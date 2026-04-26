'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
export default function XAgentRedirect() {
  const router = useRouter()
  useEffect(() => { router.replace('/admin/agent') }, [])
  return <div style={{padding:24}}>Redirecting...</div>
}
