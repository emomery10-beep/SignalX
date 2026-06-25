import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'

const today = () => new Date().toISOString().slice(0, 10)

export async function getDailyCache<T>(
  userId: string,
  route: string,
): Promise<T | null> {
  try {
    const supabase = createServiceClient()
    const { data } = await supabase
      .from('ai_daily_cache')
      .select('response')
      .eq('user_id', userId)
      .eq('route', route)
      .eq('cache_date', today())
      .single()
    return data ? (data.response as T) : null
  } catch {
    return null
  }
}

export async function setDailyCache(
  userId: string,
  route: string,
  response: unknown,
): Promise<void> {
  try {
    const supabase = createServiceClient()
    await supabase
      .from('ai_daily_cache')
      .upsert(
        { user_id: userId, route, cache_date: today(), response, created_at: new Date().toISOString() },
        { onConflict: 'user_id,route,cache_date' },
      )
  } catch {
    // Never throw — cache write must never break the caller
  }
}
