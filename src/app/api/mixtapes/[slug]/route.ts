import { NextResponse } from "next/server";
import { getMixtapeBySlug } from "@/lib/mixtapes";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const mixtape = await getMixtapeBySlug(slug);

  if (!mixtape) {
    return NextResponse.json({ error: "Mixtape not found." }, { status: 404 });
  }

  return NextResponse.json(mixtape);
}
