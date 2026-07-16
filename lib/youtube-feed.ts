// Pulls the latest uploads from the AskBiz YouTube channel via YouTube's public
// "uploads playlist" RSS feed — no API key needed, updates automatically as new
// videos are published. Feed caps at the 15 most recent uploads.
const UPLOADS_PLAYLIST_ID = "UUaQrS9nY3bn1zmbFZkpQpuw"; // AskBizUK channel

export interface YoutubeVideo {
  id: string;
  title: string;
  publishedAt: string;
  thumbnail: string;
  watchUrl: string;
}

export async function getLatestAskBizVideos(limit = 15): Promise<YoutubeVideo[]> {
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?playlist_id=${UPLOADS_PLAYLIST_ID}`,
      {
        next: { revalidate: 3600 },
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        },
      }
    );
    if (!res.ok) {
      console.error(`[youtube-feed] fetch failed: ${res.status} ${res.statusText}`);
      return [];
    }
    const xml = await res.text();

    const videos: YoutubeVideo[] = [];
    const entryRe = /<entry>([\s\S]*?)<\/entry>/g;
    let match: RegExpExecArray | null;
    while ((match = entryRe.exec(xml)) && videos.length < limit) {
      const entry = match[1];
      const id = entry.match(/<yt:videoId>([^<]*)<\/yt:videoId>/)?.[1];
      const title = entry.match(/<title>([^<]*)<\/title>/)?.[1];
      const publishedAt = entry.match(/<published>([^<]*)<\/published>/)?.[1];
      if (!id || !title) continue;
      videos.push({
        id,
        title: decodeXmlEntities(title),
        publishedAt: publishedAt || "",
        thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        watchUrl: `https://www.youtube.com/watch?v=${id}`,
      });
    }
    return videos;
  } catch (err) {
    console.error("[youtube-feed] fetch threw:", err);
    return [];
  }
}

function decodeXmlEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}
