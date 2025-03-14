import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (req) => {
  const { title, videoUrl, links } = await req.json();

  try {
    const solution = await prisma.solution.create({
      data: {
        title,
        videoUrl,
        links,
      },
    });

    return NextResponse.json({ solution }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const GET = async () => {
  try {
    const solutions = await prisma.solution.findMany();
    return NextResponse.json({ solutions }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
