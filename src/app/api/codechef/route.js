import { NextResponse } from "next/server";

export const GET = async () => {
  const API_KEY = process.env.API_KEY;
  const PLAYLIST_ID = "PLcXpkI9A-RZIZ6lsE0KCcLWeKNoG45fYr";

  try {
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

    return NextResponse.json(videos, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
