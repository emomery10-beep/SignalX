import { NextResponse } from "next/server";
import { getLatestAskBizVideos } from "@/lib/youtube-feed";

export const revalidate = 3600;

export async function GET() {
  const videos = await getLatestAskBizVideos();
  return NextResponse.json({ videos });
}
