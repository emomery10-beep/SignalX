import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { question, rating, comment, conversationId } = body

  if (!question || !rating || (rating !== 'helpful' && rating !== 'not_helpful')) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { error } = await supabase.from('chat_message_feedback').insert({
    user_id: user.id,
    conversation_id: conversationId || null,
    question,
    rating,
    comment: comment || null,
  })

  if (error) {
    console.error('chat_message_feedback insert error (migration applied?):', error)
    return NextResponse.json({ error: 'Failed to save feedback' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
