"use client";

import * as React from "react";
import Image from "next/image";
import type { MixtapeTrack } from "@/lib/types";
import { cn, formatDuration } from "@/lib/utils";

export function MixtapePlayer({
  tracks,
  className,
}: {
  tracks: MixtapeTrack[];
  className?: string;
}) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const activeTrack = tracks[currentIndex];

  const attachPreview = React.useEffectEvent(() => {
    if (!audioRef.current || !activeTrack?.previewUrl) {
      return;
    }

    if (audioRef.current.src !== activeTrack.previewUrl) {
      audioRef.current.src = activeTrack.previewUrl;
      setCurrentTime(0);
    }
  });

  const playCurrent = React.useEffectEvent(async () => {
    if (!audioRef.current || !activeTrack?.previewUrl) {
      return;
    }

    attachPreview();
    await audioRef.current.play();
    setIsPlaying(true);
  });

  React.useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = "none";
    }

    const audio = audioRef.current;

    const handleTime = () => setCurrentTime(audio.currentTime);
    const handlePause = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);
    const handleEnded = () => {
      if (currentIndex < tracks.length - 1) {
        setCurrentIndex((index) => index + 1);
        return;
      }
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", handleTime);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", handleTime);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentIndex, tracks.length]);

  React.useEffect(() => {
    attachPreview();
    if (isPlaying) {
      void playCurrent();
    }
  }, [activeTrack?.previewUrl, isPlaying]);

  if (!tracks.length) {
    return null;
  }

  const progress = activeTrack?.durationMs
    ? Math.min((currentTime / (activeTrack.durationMs / 1000)) * 100, 100)
    : 0;

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
          href={activeTrack.spotifyUrl ?? activeTrack.appleUrl}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-medium text-[#5f7487] underline decoration-[#90a7be] underline-offset-4"
        >
          {activeTrack.spotifyUrl ? "Spotify" : "Apple Music"}
        </a>
      </div>
      <div className="mt-5 flex items-center gap-4 text-[var(--muted)]">
        <span className="w-11 text-sm tabular-nums">{formatDuration(currentTime * 1000)}</span>
        <button
          type="button"
          onClick={() => {
            setCurrentIndex((index) => Math.max(0, index - 1));
            setCurrentTime(0);
          }}
          disabled={currentIndex === 0}
          className="rounded-full p-2 text-xl disabled:cursor-not-allowed disabled:opacity-35"
          aria-label="Previous track"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={async () => {
            if (!activeTrack.previewUrl) {
              return;
            }

            if (isPlaying) {
              audioRef.current?.pause();
              return;
            }

            await playCurrent();
          }}
          disabled={!activeTrack.previewUrl}
          className="button-primary flex h-14 w-14 items-center justify-center rounded-full border border-black/60 text-xl disabled:cursor-not-allowed disabled:opacity-45"
          aria-label={isPlaying ? "Pause preview" : "Play preview"}
        >
          {isPlaying ? "❚❚" : "▶"}
        </button>
        <button
          type="button"
          onClick={() => {
            setCurrentIndex((index) => Math.min(tracks.length - 1, index + 1));
            setCurrentTime(0);
          }}
          disabled={currentIndex === tracks.length - 1}
          className="rounded-full p-2 text-xl disabled:cursor-not-allowed disabled:opacity-35"
          aria-label="Next track"
        >
          ›
        </button>
        <span className="w-11 text-right text-sm tabular-nums">
          {formatDuration(activeTrack.durationMs)}
        </span>
      </div>
      <div className="mt-4 h-2 rounded-full bg-[#dfe8f1]">
        <div
          className="h-full rounded-full bg-[#7b96ad] transition-[width]"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
        {activeTrack.previewUrl
          ? "30-second preview provided via Apple Music/iTunes."
          : "Preview unavailable for this track. You can still open it in Spotify or Apple Music."}
      </p>
    </section>
  );
}
