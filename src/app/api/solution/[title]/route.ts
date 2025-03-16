import { NextRequest, NextResponse } from "next/server";
import Solution from "@/models/Solution";
import connectDB from "@/lib/db";

export const GET = async (
  request: NextRequest,
  { params }: { params: { title: string } }
) => {
  const { title } = await params;

  try {
    await connectDB();

    const getPlaylistVideos = async () => {
      const videos = await Solution.findOne({
        title: title,
      });

      return videos;
    };

    const videos = await getPlaylistVideos();

    if (!videos) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json([videos], { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
