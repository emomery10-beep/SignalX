import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
const ADMIN_EMAILS = ['emomery10@gmail.com', 'emomery10@googlemail.com']

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Show first 30 chars of each token so we can see exactly what is stored
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    X_ACCESS_TOKEN_FULL:        process.env.X_ACCESS_TOKEN?.slice(0, 30) + '...',
    X_ACCESS_TOKEN_SECRET_FULL: process.env.X_ACCESS_TOKEN_SECRET?.slice(0, 30) + '...',
    X_API_KEY_FULL:             process.env.X_API_KEY?.slice(0, 30) + '...',
    X_API_SECRET_FULL:          process.env.X_API_SECRET?.slice(0, 30) + '...',
    lengths: {
      X_ACCESS_TOKEN:        process.env.X_ACCESS_TOKEN?.length,
      X_ACCESS_TOKEN_SECRET: process.env.X_ACCESS_TOKEN_SECRET?.length,
      X_API_KEY:             process.env.X_API_KEY?.length,
      X_API_SECRET:          process.env.X_API_SECRET?.length,
    }
  })
}
