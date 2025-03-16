import { NextResponse } from "next/server";
import { createClient } from "redis";

const redis = createClient({ url: process.env.REDIS_URL });
await redis.connect();

export const GET = async () => {
  const API_KEY = process.env.API_KEY;
  const PLAYLIST_ID = "PLcXpkI9A-RZIZ6lsE0KCcLWeKNoG45fYr";

  try {
    const cacheKey = `playlist_videos_${PLAYLIST_ID}`;
    const cachedVideos = await redis.get(cacheKey);

    if (cachedVideos) {
      return NextResponse.json(JSON.parse(cachedVideos), { status: 200 });
    }

    const getPlaylistVideos = async (pageToken = "") => {
      const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${PLAYLIST_ID}&maxResults=50&key=${API_KEY}&pageToken=${pageToken}`;
      const response = await fetch(url);
      const data = await response.json();

      const videoDetails = data.items.map((video) => ({
        title: video.snippet.title,
        description: video.snippet.description,
        videoUrl: `https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}`,
      }));

      return videoDetails;
    };

    const videos = await getPlaylistVideos();

    await redis.set(cacheKey, JSON.stringify(videos), { EX: 3600 });

    return NextResponse.json(videos, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
