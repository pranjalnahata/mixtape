import { NextResponse } from "next/server";
import { searchMusic } from "@/lib/music";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";

  try {
    const tracks = await searchMusic(query);
    return NextResponse.json({ tracks });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Search failed.",
      },
      { status: 500 }
    );
  }
}
