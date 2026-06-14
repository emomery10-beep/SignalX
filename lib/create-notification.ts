import { createClient } from '@supabase/supabase-js'

/**
 * Create an in-app notification for a user.
 * Deduplicates by title within the last 6 hours.
 *
 * Types: 'alert' | 'shipment' | 'insight' | 'brief' | 'system'
 */
export async function createNotification({
  userId,
  type,
  title,
  body,
  metadata = {},
  dedupHours = 6,
}: {
  userId: string
  type: 'alert' | 'shipment' | 'insight' | 'brief' | 'system'
  title: string
  body: string
  metadata?: Record<string, unknown>
  dedupHours?: number
}) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  // Deduplicate — don't fire same title within dedupHours
  if (dedupHours > 0) {
    const { data: existing } = await supabase
      .from('notifications')
      .select('id')
      .eq('user_id', userId)
      .eq('title', title)
      .gte('created_at', new Date(Date.now() - dedupHours * 3600000).toISOString())
      .limit(1)

    if (existing && existing.length > 0) return null
  }

  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      type,
      title,
      body,
      metadata,
    })
    .select('id')
    .single()

  if (error) {
    console.error('[create-notification] error:', error.message)
    return null
  }

  return data?.id || null
}

/**
 * Create multiple notifications in batch (e.g. reorder suggestions).
 * Deduplicates each by title.
 */
export async function createNotifications(
  items: {
    userId: string
    type: 'alert' | 'shipment' | 'insight' | 'brief' | 'system'
    title: string
    body: string
    metadata?: Record<string, unknown>
  }[],
  dedupHours = 6,
) {
  const results: (string | null)[] = []
  for (const item of items.slice(0, 10)) { // Cap at 10 per batch
    const id = await createNotification({ ...item, dedupHours })
    results.push(id)
  }
  return results
}
