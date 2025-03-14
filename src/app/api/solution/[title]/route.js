import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async (request, { params }) => {
  const { title } = await params;

  try {
    const getPlaylistVideos = async () => {
      const videos = await prisma.solution.findFirst({
        where: {
          title: title,
        },
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
