import Link from "next/link";
import { PageShell } from "@/components/page-shell";

export default function NotFound() {
  return (
    <PageShell className="max-w-3xl">
      <section className="paper-panel mx-auto flex w-full max-w-2xl flex-col items-center rounded-[2rem] px-8 py-14 text-center shadow-frame">
        <p className="pixel-heading text-sm text-[var(--accent)]">Mixtape Missing</p>
        <h1 className="pixel-heading mt-5 text-3xl leading-[1.45] text-[var(--foreground)] sm:text-4xl">
          We couldn&apos;t find that tape.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-8 text-[var(--muted)] sm:text-lg">
          The link may be incomplete, expired in local dev mode, or the mixtape simply was
          never saved.
        </p>
        <Link
          href="/create"
          className="button-primary mt-8 rounded-2xl border border-black/60 px-7 py-4 text-lg font-semibold transition-transform hover:-translate-y-0.5"
        >
          Make a new mixtape
        </Link>
      </section>
    </PageShell>
  );
}
