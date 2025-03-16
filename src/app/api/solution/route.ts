import { NextRequest, NextResponse } from "next/server";
import Solution from "@/models/Solution";
import connectDB from "@/lib/db";

export const POST = async (req: NextRequest) => {
  const { title, videoUrl, links } = await req.json();

  try {
    await connectDB();

    const solution = await Solution.create({
      title,
      videoUrl,
      links,
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
    await connectDB();

    const solutions = await Solution.find({});
    return NextResponse.json({ solutions }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
