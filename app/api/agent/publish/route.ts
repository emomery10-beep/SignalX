import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

export const runtime = 'nodejs'

// Only callable from the agent (internal) with the cron secret
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { post } = await request.json()

  if (!post?.slug || !post?.title || !post?.sections) {
    return NextResponse.json({ error: 'Invalid post structure' }, { status: 400 })
  }

  try {
    const filePath = join(process.cwd(), 'lib', 'blog-content.ts')
    let fileContent = readFileSync(filePath, 'utf-8')

    // Deduplicate — check slug not already present
    if (fileContent.includes(`"slug": "${post.slug}"`)) {
      return NextResponse.json({ error: 'duplicate_slug', slug: post.slug }, { status: 409 })
    }

    // Find the last entry in the array and append after it
    const insertPoint = fileContent.lastIndexOf('\n]\n\nexport')
    if (insertPoint === -1) {
      return NextResponse.json({ error: 'Could not find insertion point' }, { status: 500 })
    }

    const postJson = JSON.stringify(post, null, 2)
    fileContent = fileContent.slice(0, insertPoint) +
      ',\n  ' + postJson +
      fileContent.slice(insertPoint)

    writeFileSync(filePath, fileContent, 'utf-8')

    // Trigger Vercel redeploy if deploy hook is configured
    if (process.env.VERCEL_DEPLOY_HOOK_URL) {
      await fetch(process.env.VERCEL_DEPLOY_HOOK_URL, { method: 'POST' }).catch(() => {
        // Non-fatal — post is written, redeploy will happen on next push
        console.warn('[publish] Deploy hook failed — post written but redeploy not triggered')
      })
    }

    return NextResponse.json({ success: true, slug: post.slug, title: post.title })

  } catch (err) {
    console.error('[publish] Error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
