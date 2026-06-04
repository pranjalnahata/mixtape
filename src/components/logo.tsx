import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="inline-flex items-end gap-1 text-[var(--foreground)]">
      <span className="pixel-heading text-[1.8rem] leading-none sm:text-[2rem]">Mixtape</span>
      <span className="script-text -mb-0.5 text-[1.25rem] text-[#36546d] sm:text-[1.4rem]">
        for you
      </span>
    </Link>
  );
}
