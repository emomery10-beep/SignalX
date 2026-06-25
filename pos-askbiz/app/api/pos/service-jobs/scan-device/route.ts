import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'
import { hasPermission } from '@/lib/pos-permissions'
import { logUsage } from '@/lib/log-usage'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

// POST — scan device rear sticker photo, extract model/serial/date via AI
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  if (!hasPermission(auth.role, 'service.scan_device')) {
    return json({ error: 'Only repair staff, manager, or owner can scan devices' }, 403)
  }

  const { image } = await req.json()
  if (!image) return json({ error: 'image required' }, 400)

  try {
    const _groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        max_tokens: 400,
        messages: [{
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${image}` } },
            {
              type: 'text',
              text: `You are a device identification assistant for a phone repair shop. Look at this image of a phone's rear label/sticker and extract all available information.

TASK:
1. Identify the device model (e.g., "iPhone 14 Pro", "Samsung Galaxy S24")
2. Extract the serial number or IMEI if visible
3. Extract any manufacture date if visible
4. Note the storage capacity if visible (e.g., 128GB, 256GB)
5. Note the color if identifiable
6. Note any other relevant identifiers (FCC ID, model number like A2890, etc.)

Reply ONLY with valid JSON, nothing else:
{"model":"device model","serial":"serial or IMEI or null","manufacture_date":"date string or null","storage":"capacity or null","color":"color or null","model_number":"internal model number or null","confidence":75}

Set confidence 80-100 if text is clearly readable, 50-79 if partially readable, below 50 if mostly guessing.`,
            },
          ],
        }],
      }),
    })
    const _groqData = await _groqRes.json()
    const text = _groqData.choices?.[0]?.message?.content || ''
    logUsage({ route: 'pos/service-jobs/scan-device', model: 'meta-llama/llama-4-scout-17b-16e-instruct', usage: { input_tokens: _groqData.usage?.prompt_tokens ?? 0, output_tokens: _groqData.usage?.completion_tokens ?? 0 }, userId: auth.ownerId })
    const jsonMatch = text.match(/\{[\s\S]*?\}/)
    if (!jsonMatch) return json({ error: 'Could not read device label' }, 422)

    let parsed: Record<string, unknown>
    try { parsed = JSON.parse(jsonMatch[0]) } catch {
      return json({ error: 'Could not parse AI response' }, 422)
    }

    // Check for warranty on this serial number (if we've seen this device before)
    let warranty_info = null
    if (parsed.serial) {
      const service = createServiceClient()
      const { data: previousJob } = await service
        .from('pos_service_jobs')
        .select('id, ticket_number, device_model, warranty_expires_at, status, created_at')
        .eq('owner_id', auth.ownerId)
        .eq('device_serial', parsed.serial as string)
        .eq('status', 'collected')
        .not('warranty_expires_at', 'is', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (previousJob && previousJob.warranty_expires_at) {
        const expiresAt = new Date(previousJob.warranty_expires_at)
        warranty_info = {
          previous_job_id: previousJob.id,
          previous_ticket: previousJob.ticket_number,
          previous_repair: previousJob.device_model,
          warranty_expires_at: previousJob.warranty_expires_at,
          is_under_warranty: expiresAt > new Date(),
          days_remaining: Math.max(0, Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))),
        }
      }
    }

    return json({
      device: {
        model: parsed.model || null,
        serial: parsed.serial || null,
        manufacture_date: parsed.manufacture_date || null,
        storage: parsed.storage || null,
        color: parsed.color || null,
        model_number: parsed.model_number || null,
        confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0,
      },
      warranty_info,
    })
  } catch (err: any) {
    console.error('Device scan error:', err)
    return json({ error: 'Device scan failed' }, 500)
  }
}
