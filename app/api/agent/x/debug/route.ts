import { NextRequest, NextResponse } from 'next/server'
import { validateXCredentials } from '@/lib/x-api'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
const ADMIN_EMAILS = ['emomery10@gmail.com', 'emomery10@googlemail.com']

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const env = {
    X_API_KEY:             process.env.X_API_KEY             ? 'set:' + process.env.X_API_KEY.slice(0,12)             : 'MISSING',
    X_API_SECRET:          process.env.X_API_SECRET          ? 'set:' + process.env.X_API_SECRET.slice(0,12)          : 'MISSING',
    X_ACCESS_TOKEN:        process.env.X_ACCESS_TOKEN        ? 'set:' + process.env.X_ACCESS_TOKEN.slice(0,20)        : 'MISSING',
    X_ACCESS_TOKEN_SECRET: process.env.X_ACCESS_TOKEN_SECRET ? 'set:' + process.env.X_ACCESS_TOKEN_SECRET.slice(0,12) : 'MISSING',
  }

  const validation = await validateXCredentials()

  return NextResponse.json({ ts: new Date().toISOString(), env, validation })
}
