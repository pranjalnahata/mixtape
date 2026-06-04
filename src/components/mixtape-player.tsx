"use client";

import * as React from "react";
import Image from "next/image";
import type { MixtapeTrack } from "@/lib/types";
import { cn, formatDuration } from "@/lib/utils";

function spotifyTrackIdFromUri(uri: string) {
  const [, , trackId] = uri.split(":");
  return trackId;
}

function spotifyEmbedUrl(uri: string) {
  const trackId = spotifyTrackIdFromUri(uri);
  return `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`;
}

export function MixtapePlayer({
  tracks,
  className,
}: {
  tracks: MixtapeTrack[];
  className?: string;
}) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  if (!tracks.length) {
    return null;
  }

  const activeTrack = tracks[currentIndex];

  return (
    <section className={cn("paper-panel rounded-[1.8rem] p-4 shadow-frame sm:p-5", className)}>
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 overflow-hidden rounded-2xl bg-[#cbdced] shadow-inner">
          {activeTrack.artworkUrl ? (
            <Image
              src={activeTrack.artworkUrl}
              alt={`${activeTrack.title} artwork`}
              width={64}
              height={64}
              className="h-full w-full object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#dce8f5] to-[#a8bfd4] text-xs font-semibold uppercase tracking-[0.22em] text-[#3d5b75]">
              Tape
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            {activeTrack.title}
          </p>
          <p className="truncate text-base text-[var(--muted)]">{activeTrack.artist}</p>
        </div>
        <a
          href={activeTrack.spotifyUrl}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-medium text-[#5f7487] underline decoration-[#90a7be] underline-offset-4"
        >
          Spotify
        </a>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
          disabled={currentIndex === 0}
          className="button-secondary rounded-full border border-black/15 px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-35"
          aria-label="Previous track"
        >
          Previous
        </button>
        <div className="text-center">
          <p className="text-sm font-medium text-[var(--muted)]">
            Track {currentIndex + 1} of {tracks.length}
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {formatDuration(activeTrack.durationMs)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCurrentIndex((index) => Math.min(tracks.length - 1, index + 1))}
          disabled={currentIndex === tracks.length - 1}
          className="button-secondary rounded-full border border-black/15 px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-35"
          aria-label="Next track"
        >
          Next
        </button>
      </div>

      <div className="mt-5 overflow-hidden rounded-[1.4rem] border border-white/60 bg-white/65 shadow-inner">
        <iframe
          key={activeTrack.spotifyUri}
          title={`Spotify player for ${activeTrack.title}`}
          src={spotifyEmbedUrl(activeTrack.spotifyUri)}
          width="100%"
          height="152"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="block w-full"
        />
      </div>

      {tracks.length > 1 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {tracks.map((track, index) => (
            <button
              key={track.id}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "rounded-full px-3 py-2 text-sm font-medium transition",
                index === currentIndex
                  ? "bg-[var(--accent)] text-white"
                  : "button-soft text-[var(--foreground)]"
              )}
            >
              {track.title}
            </button>
          ))}
        </div>
      ) : null}

      <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
        Playback is handled with Spotify&apos;s embedded player. If the listener is not signed into
        Spotify or their account has playback limits, Spotify may restrict what can play.
      </p>
    </section>
  );
}
