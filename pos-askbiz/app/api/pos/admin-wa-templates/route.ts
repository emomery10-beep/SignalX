import { NextRequest, NextResponse } from 'next/server'

// TEMPORARY setup route — not linked from any UI, deleted right after use.
// Gated behind a one-off shared secret. Creates "askbiz_photo_update" — a
// UTILITY template with a URL BUTTON (dynamic suffix = job id) instead of
// a body-text link, since Meta rejects a raw URL substituted into a body
// parameter (confirmed live 08-09, error 132018). See lib/whatsapp.ts's
// sendPhotoUpdate for the full story.
const BASE = 'https://graph.facebook.com/v19.0'
const SETUP_KEY = 'askbiz-wa-setup-20260809-temp'
const WABA_ID = '1694706301746856'

export async function GET(req: NextRequest) {
  if (new URL(req.url).searchParams.get('key') !== SETUP_KEY) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const token = process.env.META_WHATSAPP_TOKEN
  const lang = process.env.META_TEMPLATE_LANG || 'en_GB'
  if (!token) return NextResponse.json({ error: 'META_WHATSAPP_TOKEN not configured' }, { status: 500 })

  const checkId = new URL(req.url).searchParams.get('check')
  if (checkId) {
    const statusRes = await fetch(`${BASE}/${checkId}?fields=id,name,status,category,language,rejected_reason`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return NextResponse.json(await statusRes.json(), { status: 200 })
  }

  const out: Record<string, any> = { wabaId: WABA_ID, lang }

  const listRes = await fetch(`${BASE}/${WABA_ID}/message_templates?name=askbiz_photo_update&limit=20`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  out.existing_templates = await listRes.json()
  if (Array.isArray(out.existing_templates?.data) && out.existing_templates.data.length > 0) {
    out.action = 'none — already exists, see existing_templates for language/status'
    return NextResponse.json(out, { status: 200 })
  }

  const createRes = await fetch(`${BASE}/${WABA_ID}/message_templates`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'askbiz_photo_update',
      language: lang,
      category: 'UTILITY',
      components: [
        {
          type: 'BODY',
          text: "Hi {{1}}, here's a photo update on your repair (ticket {{2}}).",
          example: { body_text: [['Ahmed', 'SJ-00123']] },
        },
        {
          type: 'BUTTONS',
          buttons: [
            {
              type: 'URL',
              text: 'View Photos',
              url: 'https://pos.askbiz.co/repair/photos/{{1}}',
              example: ['7889a5cd-994f-4831-8bc8-fa0e877d5e5d'],
            },
          ],
        },
      ],
    }),
  })
  out.create_status = createRes.status
  out.create_result = await createRes.json()
  out.action = createRes.ok ? 'submitted for Meta review' : 'creation failed, see create_result'

  return NextResponse.json(out, { status: 200 })
}
