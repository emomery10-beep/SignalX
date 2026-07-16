import { NextResponse } from "next/server";
import { getLatestAskBizVideos } from "@/lib/youtube-feed";

// Caching is handled by the underlying fetch's own `next.revalidate` in
// lib/youtube-feed.ts — force-dynamic here so a failed upstream fetch can
// self-heal on the next request instead of being frozen into the route's
// own static cache for a full hour.
export const dynamic = "force-dynamic";

export async function GET() {
  const videos = await getLatestAskBizVideos();
  return NextResponse.json({ videos });
}
