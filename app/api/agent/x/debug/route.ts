import { NextResponse } from 'next/server'
export const runtime = 'nodejs'
export async function GET() {
  return NextResponse.json({
    ts: new Date().toISOString(),
    at: process.env.X_ACCESS_TOKEN?.slice(0,30),
    ats: process.env.X_ACCESS_TOKEN_SECRET?.slice(0,30),
    ak: process.env.X_API_KEY?.slice(0,30),
    as: process.env.X_API_SECRET?.slice(0,30),
  })
}
