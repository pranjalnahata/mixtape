import Link from "next/link";
import { headers } from "next/headers";
import { CassetteScene } from "@/components/cassette-scene";
import { MixtapePlayer } from "@/components/mixtape-player";
import { PageShell } from "@/components/page-shell";
import { ShareActions } from "@/components/share-actions";
import { getMixtapeOrThrow } from "@/lib/mixtapes";

export const dynamic = "force-dynamic";

export default async function SharePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const mixtape = await getMixtapeOrThrow(slug);
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const proto = requestHeaders.get("x-forwarded-proto") ?? "http";
  const publicUrl =
    host && !process.env.NEXT_PUBLIC_SITE_URL
      ? `${proto}://${host}/m/${mixtape.slug}`
      : `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/m/${mixtape.slug}`;

  return (
    <PageShell className="max-w-6xl">
      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="paper-panel rounded-[2.2rem] p-6 shadow-frame sm:p-8">
          <p className="pixel-heading text-sm text-[var(--accent)]">Share Your Mixtape</p>
          <h1 className="pixel-heading mt-5 text-3xl leading-[1.5] text-[var(--foreground)] sm:text-4xl">
            Your little tape is ready.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-8 text-[var(--muted)]">
            Copy the public link, send it to someone sweet, or open the recipient view yourself.
          </p>
          <CassetteScene
            className="mx-auto mt-8 w-full max-w-[31rem]"
            themeKey={mixtape.themeKey}
            tracks={mixtape.tracks}
            stickers={mixtape.stickers}
            note={mixtape.note}
          />
        </div>
        <div className="flex flex-col gap-5">
          <ShareActions publicUrl={publicUrl || `/m/${mixtape.slug}`} />
          <MixtapePlayer tracks={mixtape.tracks} />
          <Link
            href={`/m/${mixtape.slug}`}
            className="button-secondary rounded-[1.8rem] border border-black/15 px-6 py-5 text-center text-lg font-semibold"
          >
            Open recipient view
          </Link>
          <Link
            href="/create"
            className="button-soft rounded-[1.8rem] px-6 py-5 text-center text-lg font-semibold text-[var(--foreground)]"
          >
            Make another
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
