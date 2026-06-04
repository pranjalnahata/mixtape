import Link from "next/link";
import { CassetteScene } from "@/components/cassette-scene";
import { Footer } from "@/components/footer";
import { Logo } from "@/components/logo";
import { THEMES } from "@/data/themes";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center px-4 pb-8 pt-5 sm:px-6 lg:px-8">
      <Logo />
      <main className="flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-16 py-10">
        <section className="grid w-full items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="order-2 flex flex-col items-center text-center lg:order-1 lg:items-start lg:text-left">
            <div className="soft-panel grain shadow-frame max-w-xl rounded-[2rem] px-7 py-8 sm:px-9 sm:py-10">
              <p className="script-text text-xl text-[var(--muted)] sm:text-2xl">
                A tiny digital keepsake for your favorite person.
              </p>
              <h1 className="pixel-heading mt-5 max-w-lg text-3xl leading-[1.4] text-[var(--foreground)] sm:text-[2.65rem]">
                Build a mixtape they can open like a love note.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-8 text-[var(--muted)] sm:text-lg">
                Pick a cassette, add sweet little stickers, search songs with preview clips,
                and share one link that feels like passing someone a hand-decorated tape.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/create"
                  className="button-primary rounded-2xl border border-black/60 px-8 py-4 text-center text-lg font-semibold transition-transform hover:-translate-y-0.5"
                >
                  Create a mixtape
                </Link>
                <a
                  href="#how-it-works"
                  className="button-secondary rounded-2xl border border-black/20 px-8 py-4 text-center text-lg font-semibold transition-transform hover:-translate-y-0.5"
                >
                  How it works
                </a>
              </div>
            </div>
          </div>
          <div className="order-1 flex justify-center lg:order-2">
            <CassetteScene
              className="w-full max-w-[34rem]"
              themeKey={THEMES[0].key}
              note="I made this for you. Press play when you miss me."
              tracks={[
                {
                  id: "landing-1",
                  title: "Lover Girl",
                  artist: "Laufey",
                  artworkUrl: null,
                  durationMs: 30000,
                  previewUrl: null,
                  appleUrl: "https://music.apple.com",
                  spotifyUrl: null,
                  spotifyUri: null,
                  source: "apple",
                },
                {
                  id: "landing-2",
                  title: "Moon Song",
                  artist: "Phoebe Bridgers",
                  artworkUrl: null,
                  durationMs: 30000,
                  previewUrl: null,
                  appleUrl: "https://music.apple.com",
                  spotifyUrl: null,
                  spotifyUri: null,
                  source: "apple",
                },
              ]}
              stickers={[
                { id: "landing-sticker-1", stickerId: "clover", zone: "tape", x: 17, y: 18, rotation: -10, scale: 1 },
                { id: "landing-sticker-2", stickerId: "bow", zone: "case", x: 81, y: 17, rotation: 7, scale: 1.05 },
                { id: "landing-sticker-3", stickerId: "daisy", zone: "case", x: 69, y: 22, rotation: 8, scale: 1 },
              ]}
              showFloatingTape
            />
          </div>
        </section>

        <section
          id="how-it-works"
          className="grid w-full gap-5 rounded-[2rem] border border-white/40 bg-white/25 p-5 shadow-frame backdrop-blur-sm sm:p-7 lg:grid-cols-3"
        >
          {[
            {
              number: "01",
              title: "Dress the cassette",
              copy: "Choose a soft palette and layer on scrapbook stickers until it feels personal.",
            },
            {
              number: "02",
              title: "Add a few songs",
              copy: "Search tracks, hear 30-second previews, and stack up to four songs in a tiny queue.",
            },
            {
              number: "03",
              title: "Share one sweet link",
              copy: "Your loved one opens a public page with the note, artwork, and mini player ready to go.",
            },
          ].map((item) => (
            <article key={item.number} className="paper-panel rounded-[1.8rem] p-6 sm:p-7">
              <p className="pixel-heading text-sm text-[var(--accent)]">{item.number}</p>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                {item.title}
              </h2>
              <p className="mt-4 text-base leading-7 text-[var(--muted)]">{item.copy}</p>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
