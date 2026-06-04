import { CassetteScene } from "@/components/cassette-scene";
import { MixtapePlayer } from "@/components/mixtape-player";
import { PageShell } from "@/components/page-shell";
import { getMixtapeOrThrow } from "@/lib/mixtapes";

export const dynamic = "force-dynamic";

export default async function PublicMixtapePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const mixtape = await getMixtapeOrThrow(slug);

  return (
    <PageShell className="max-w-5xl">
      <section className="mx-auto grid w-full max-w-4xl gap-8">
        <div className="mx-auto text-center">
          <p className="pixel-heading text-sm text-[var(--accent)]">This Is For You</p>
          <h1 className="pixel-heading mt-5 text-3xl leading-[1.55] text-[var(--foreground)] sm:text-4xl">
            Someone made you a mixtape.
          </h1>
        </div>
        <CassetteScene
          className="mx-auto w-full max-w-[32rem]"
          themeKey={mixtape.themeKey}
          tracks={mixtape.tracks}
          stickers={mixtape.stickers}
          note={mixtape.note}
        />
        <MixtapePlayer className="mx-auto w-full max-w-3xl" tracks={mixtape.tracks} />
      </section>
    </PageShell>
  );
}
