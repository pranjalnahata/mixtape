import { NextResponse } from "next/server";
import { createMixtape } from "@/lib/mixtapes";
import type { MixtapeDraft } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const draft = (await request.json()) as MixtapeDraft;
    const mixtape = await createMixtape(draft);
    const origin = new URL(request.url).origin;

    return NextResponse.json({
      slug: mixtape.slug,
      ownerShareUrl: `${origin}/share/${mixtape.slug}`,
      publicUrl: `${origin}/m/${mixtape.slug}`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Could not create mixtape.",
      },
      { status: 400 }
    );
  }
}
