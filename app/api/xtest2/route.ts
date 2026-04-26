import { NextResponse } from 'next/server'
export const runtime = 'nodejs'
export async function GET() {
  return NextResponse.json({
    v: 1,
    ak: process.env.X_API_KEY?.slice(0,15) || 'MISSING',
    at: process.env.X_ACCESS_TOKEN?.slice(0,20) || 'MISSING',
  })
}
