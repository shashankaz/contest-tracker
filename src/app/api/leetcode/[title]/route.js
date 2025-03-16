import { NextResponse } from "next/server";
import slugify from "slugify";
import { createClient } from "redis";

const redis = createClient({ url: process.env.REDIS_URL });
await redis.connect();

export const GET = async (request, { params }) => {
  const API_KEY = process.env.API_KEY;
  const PLAYLIST_ID = "PLcXpkI9A-RZI6FhydNz3JBt_-p_i25Cbr";

  const { title: name } = await params;
  const modifiedName = slugify(name || "", {
    lower: true,
    remove: /[^\w\s-]/g,
  });

  if (!modifiedName) {
    return NextResponse.json(
      { message: "Title parameter is required" },
      { status: 400 }
    );
  }

  try {
    const cachedData = await redis.get("playlistVideosLeetcode");
    let videos;
    if (cachedData) {
      videos = JSON.parse(cachedData);
    } else {
      const getPlaylistVideos = async (pageToken = "") => {
        const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${PLAYLIST_ID}&maxResults=50&key=${API_KEY}&pageToken=${pageToken}`;
        const response = await fetch(url);
        const data = await response.json();

        const videoDetails = data.items.map((video) => ({
          title: video.snippet.title,
          description: video.snippet.description,
          videoUrl: `https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}`,
        }));

        if (data.nextPageToken) {
          const nextPageVideos = await getPlaylistVideos(data.nextPageToken);
          return [...videoDetails, ...nextPageVideos];
        }

        return videoDetails;
      };

      videos = await getPlaylistVideos();

      await redis.set("playlistVideosLeetcode", JSON.stringify(videos), {
        EX: 3600,
      });
    }

    const filteredVideos = videos.filter((solution) => {
      const modifiedTitle = solution.title.split(" | ")[0].slice(9);
      const slugifiedTitle = slugify(modifiedTitle, {
        lower: true,
        remove: /[^\w\s-]/g,
      });
      return modifiedName.includes(slugifiedTitle);
    });

    return NextResponse.json(filteredVideos, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
