import { NextResponse } from "next/server";
import { createClient } from "redis";
import Solution from "@/models/Solution";
import connectDB from "@/lib/db";

const redis = createClient({ url: process.env.REDIS_URL });
(async () => {
  await redis.connect();
})();

export const POST = async (req) => {
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

    const cachedSolutions = await redis.get("solutions");
    if (cachedSolutions) {
      return NextResponse.json(
        { solutions: JSON.parse(cachedSolutions) },
        { status: 200 }
      );
    }

    const solutions = await Solution.find({});
    await redis.set("solutions", JSON.stringify(solutions), { EX: 3600 });

    return NextResponse.json({ solutions }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
