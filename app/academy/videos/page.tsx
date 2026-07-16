import { Metadata } from "next";
import { getLatestAskBizVideos } from "@/lib/youtube-feed";
import VideoLibraryClient from "./VideoLibraryClient";

export const metadata: Metadata = {
  title: "AskBiz Video Library — Watch & Learn the POS",
  description:
    "Short video walkthroughs of AskBiz POS — checkout, registration, inventory, and more. Synced automatically from the AskBiz YouTube channel.",
  alternates: {
    canonical: "https://askbiz.co/academy/videos",
  },
};

export const revalidate = 3600;

export default async function AcademyVideosPage() {
  const videos = await getLatestAskBizVideos();
  return <VideoLibraryClient videos={videos} />;
}
