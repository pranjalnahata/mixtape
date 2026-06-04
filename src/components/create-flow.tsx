"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CasePreview,
  CassetteScene,
  NotePreview,
  StickerEditorCanvas,
  StickerPalette,
  TapePreview,
} from "@/components/cassette-scene";
import { DEFAULT_THEME_KEY, THEMES } from "@/data/themes";
import type { MixtapeDraft, MixtapeTrack, PlacedSticker, StickerZone } from "@/lib/types";
import { cn, makeId } from "@/lib/utils";

const STORAGE_KEY = "mixtape-draft-v1";
const subscribeToNothing = () => () => undefined;

const INITIAL_DRAFT: MixtapeDraft = {
  themeKey: DEFAULT_THEME_KEY,
  stickers: [],
  tracks: [],
  note: "",
};

type DraftAction =
  | { type: "hydrate"; payload: MixtapeDraft }
  | { type: "set-theme"; payload: string }
  | { type: "add-sticker"; payload: PlacedSticker }
  | { type: "move-sticker"; payload: { id: string; x: number; y: number } }
  | { type: "remove-sticker"; payload: string }
  | { type: "add-track"; payload: MixtapeTrack }
  | { type: "remove-track"; payload: string }
  | { type: "set-note"; payload: string }
  | { type: "reset" };

function draftReducer(state: MixtapeDraft, action: DraftAction): MixtapeDraft {
  switch (action.type) {
    case "hydrate":
      return action.payload;
    case "set-theme":
      return { ...state, themeKey: action.payload };
    case "add-sticker":
      return { ...state, stickers: [...state.stickers, action.payload] };
    case "move-sticker":
      return {
        ...state,
        stickers: state.stickers.map((sticker) =>
          sticker.id === action.payload.id
            ? { ...sticker, x: action.payload.x, y: action.payload.y }
            : sticker
        ),
      };
    case "remove-sticker":
      return {
        ...state,
        stickers: state.stickers.filter((sticker) => sticker.id !== action.payload),
      };
    case "add-track":
      if (state.tracks.some((track) => track.id === action.payload.id) || state.tracks.length >= 4) {
        return state;
      }
      return { ...state, tracks: [...state.tracks, action.payload] };
    case "remove-track":
      return { ...state, tracks: state.tracks.filter((track) => track.id !== action.payload) };
    case "set-note":
      return { ...state, note: action.payload.slice(0, 280) };
    case "reset":
      return INITIAL_DRAFT;
    default:
      return state;
  }
}

interface SearchState {
  query: string;
  loading: boolean;
  error: string | null;
  results: MixtapeTrack[];
}

export function CreateFlow() {
  const router = useRouter();
  const isMounted = React.useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false
  );
  const [step, setStep] = React.useState(1);
  const [draft, dispatch] = React.useReducer(draftReducer, INITIAL_DRAFT);
  const [activeZone, setActiveZone] = React.useState<StickerZone>("tape");
  const [submitting, setSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState<SearchState>({
    query: "",
    loading: false,
    error: null,
    results: [],
  });
  const deferredQuery = React.useDeferredValue(search.query);

  React.useEffect(() => {
    if (!isMounted) {
      return;
    }

    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as MixtapeDraft;
        dispatch({ type: "hydrate", payload: parsed });
      } catch {
        window.sessionStorage.removeItem(STORAGE_KEY);
      }
    }
  }, [isMounted]);

  React.useEffect(() => {
    if (!isMounted) {
      return;
    }
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [draft, isMounted]);

  React.useEffect(() => {
    if (!deferredQuery.trim()) {
      return;
    }

    if (deferredQuery.trim().length < 2) {
      return;
    }

    let cancelled = false;
    React.startTransition(() => {
      setSearch((current) => ({ ...current, loading: true, error: null }));
    });

    fetch(`/api/music/search?q=${encodeURIComponent(deferredQuery.trim())}`)
      .then(async (response) => {
        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as { error?: string } | null;
          throw new Error(payload?.error ?? "Search failed.");
        }
        return (await response.json()) as { tracks: MixtapeTrack[] };
      })
      .then((payload) => {
        if (cancelled) {
          return;
        }
        React.startTransition(() => {
          setSearch((current) => ({
            ...current,
            loading: false,
            error: null,
            results: payload.tracks,
          }));
        });
      })
      .catch((error: Error) => {
        if (cancelled) {
          return;
        }
        React.startTransition(() => {
          setSearch((current) => ({
            ...current,
            loading: false,
            error: error.message,
            results: [],
          }));
        });
      });

    return () => {
      cancelled = true;
    };
  }, [deferredQuery]);

  const canAdvance =
    (step === 1 && Boolean(draft.themeKey)) ||
    step === 2 ||
    (step === 3 && draft.tracks.length > 0) ||
    (step === 4 && draft.note.trim().length > 0);

  function createSticker(stickerId: string) {
    const siblingCount = draft.stickers.filter((sticker) => sticker.zone === activeZone).length;
    dispatch({
      type: "add-sticker",
      payload: {
        id: makeId("sticker"),
        stickerId,
        zone: activeZone,
        x: 28 + ((siblingCount * 17) % 44),
        y: 28 + ((siblingCount * 11) % 32),
        rotation: siblingCount % 2 === 0 ? -8 : 8,
        scale: 1,
      },
    });
  }

  async function finishMixtape() {
    setSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/mixtapes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });

      const payload = (await response.json()) as
        | { error: string }
        | { slug: string; ownerShareUrl: string; publicUrl: string };

      if (!response.ok || "error" in payload) {
        throw new Error("error" in payload ? payload.error : "Could not save your mixtape.");
      }

      window.sessionStorage.removeItem(STORAGE_KEY);
      dispatch({ type: "reset" });
      router.push(`/share/${payload.slug}`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Could not save your mixtape.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!isMounted) {
    return (
      <div className="paper-panel mx-auto w-full max-w-3xl rounded-[2rem] px-8 py-16 text-center shadow-frame">
        <p className="pixel-heading text-sm text-[var(--accent)]">Loading your cassette...</p>
      </div>
    );
  }

  return (
    <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
      <div className="paper-panel rounded-[2.2rem] p-5 shadow-frame sm:p-7">
        <ProgressDots step={step} />
        <div className="mt-6">
          {step === 1 ? (
            <div className="space-y-6">
              <SectionHeading
                title="Pick cassette color"
                copy="Start with a soft little palette. You can still change your mind later."
              />
              <TapePreview themeKey={draft.themeKey} className="mx-auto w-full max-w-[28rem]" />
              <div className="grid gap-3 sm:grid-cols-2">
                {THEMES.map((theme) => (
                  <button
                    key={theme.key}
                    type="button"
                    onClick={() => dispatch({ type: "set-theme", payload: theme.key })}
                    className={cn(
                      "paper-panel flex items-center gap-4 rounded-[1.4rem] p-4 text-left transition-transform hover:-translate-y-0.5",
                      draft.themeKey === theme.key && "ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-transparent"
                    )}
                  >
                    <span
                      className="h-12 w-12 rounded-full border border-white/70 shadow-inner"
                      style={{ background: `linear-gradient(180deg, ${theme.accentSoft}, ${theme.accent})` }}
                    />
                    <span>
                      <span className="block text-lg font-semibold text-[var(--foreground)]">
                        {theme.name}
                      </span>
                      <span className="block text-sm text-[var(--muted)]">
                        Soft, romantic, and scrapbook-ready.
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-6">
              <SectionHeading
                title="Add stickers"
                copy="Place them on the tape or on the case, then drag them until the composition feels right."
              />
              <div className="flex justify-center gap-3">
                {(["tape", "case"] as StickerZone[]).map((zone) => (
                  <button
                    key={zone}
                    type="button"
                    onClick={() => setActiveZone(zone)}
                    className={cn(
                      "rounded-full px-5 py-2 text-sm font-semibold transition",
                      activeZone === zone
                        ? "bg-[var(--accent)] text-white"
                        : "button-soft text-[var(--foreground)]"
                    )}
                  >
                    Place on {zone}
                  </button>
                ))}
              </div>
              <StickerEditorCanvas
                themeKey={draft.themeKey}
                zone={activeZone}
                stickers={draft.stickers}
                onMoveSticker={(id, x, y) =>
                  dispatch({ type: "move-sticker", payload: { id, x, y } })
                }
                onRemoveSticker={(id) => dispatch({ type: "remove-sticker", payload: id })}
              />
              <StickerPalette onAddSticker={createSticker} />
              <p className="text-center text-sm text-[var(--muted)]">
                {draft.stickers.length
                  ? `${draft.stickers.length} sticker${draft.stickers.length === 1 ? "" : "s"} added`
                  : "Tap any sticker to add it."}
              </p>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-6">
              <SectionHeading
                title="Add your songs"
                copy="Search Spotify by title or artist, then keep it to four tracks max."
              />
              <CasePreview
                themeKey={draft.themeKey}
                tracks={draft.tracks}
                stickers={draft.stickers}
                className="mx-auto w-full max-w-[26rem]"
              />
              <div className="paper-panel rounded-[1.4rem] p-4">
                <div className="flex flex-col gap-1 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
                  <span>{draft.tracks.length ? `${draft.tracks.length}/4 songs added` : "No songs yet — up to 4"}</span>
                  <span>Playback on share pages uses Spotify embeds</span>
                </div>
                {draft.tracks.length ? (
                  <div className="mt-3 grid gap-3">
                    {draft.tracks.map((track) => (
                      <div
                        key={track.id}
                        className="flex items-center justify-between rounded-[1.2rem] bg-white/55 px-4 py-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-[var(--foreground)]">{track.title}</p>
                          <p className="truncate text-sm text-[var(--muted)]">{track.artist}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => dispatch({ type: "remove-track", payload: track.id })}
                          className="rounded-full bg-black/85 px-3 py-1 text-sm font-semibold text-white"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="paper-panel rounded-[1.4rem] p-4">
                <input
                  value={search.query}
                  onChange={(event) => {
                    const nextQuery = event.target.value;
                    setSearch((current) => ({
                      ...current,
                      query: nextQuery,
                      ...(nextQuery.trim().length < 2
                        ? { loading: false, error: null, results: [] }
                        : {}),
                    }));
                  }}
                  placeholder="Search a song or artist..."
                  className="w-full rounded-2xl border border-[#95aac0]/30 bg-white/80 px-5 py-4 text-base outline-none placeholder:text-[#7a91a6]"
                />
                {search.loading ? (
                  <p className="mt-4 text-sm text-[var(--muted)]">Searching softly...</p>
                ) : null}
                {search.error ? <p className="mt-4 text-sm text-[#8f4b4b]">{search.error}</p> : null}
                {!search.loading && !search.error && search.query.trim().length >= 2 && !search.results.length ? (
                  <p className="mt-4 text-sm text-[var(--muted)]">No Spotify tracks found for that search yet.</p>
                ) : null}
                <div className="mt-4 max-h-[22rem] space-y-3 overflow-y-auto pr-1 hide-scrollbar">
                  {search.results.map((track) => {
                    const alreadyAdded = draft.tracks.some((item) => item.id === track.id);
                    return (
                      <div
                        key={track.id}
                        className="paper-panel grid gap-3 rounded-[1.3rem] p-3 sm:grid-cols-[auto_1fr_auto]"
                      >
                        <div className="h-16 w-16 overflow-hidden rounded-2xl bg-[#d6e5f4]">
                          {track.artworkUrl ? (
                            <Image
                              src={track.artworkUrl}
                              alt={`${track.title} artwork`}
                              width={64}
                              height={64}
                              className="h-full w-full object-cover"
                              unoptimized
                            />
                          ) : null}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-lg font-semibold text-[var(--foreground)]">
                            {track.title}
                          </p>
                          <p className="truncate text-sm text-[var(--muted)]">{track.artist}</p>
                          <div className="mt-2 flex flex-wrap gap-3 text-xs text-[var(--muted)]">
                            <span>Opens in Spotify</span>
                            <a
                              href={track.spotifyUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="underline decoration-[#9db0c2] underline-offset-4"
                            >
                              Open in Spotify
                            </a>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:flex-col sm:justify-center">
                          <button
                            type="button"
                            onClick={() => dispatch({ type: "add-track", payload: track })}
                            disabled={alreadyAdded || draft.tracks.length >= 4}
                            className="rounded-full border border-black/15 bg-white/90 px-4 py-2 text-sm font-semibold disabled:opacity-45"
                          >
                            {alreadyAdded ? "Added" : "Add"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="space-y-6">
              <SectionHeading
                title="Add a little note"
                copy="One tender sentence is enough. Keep it short and easy to reread."
              />
              <div className="grid gap-5 lg:grid-cols-[0.94fr_1.06fr]">
                <CassetteScene
                  themeKey={draft.themeKey}
                  tracks={draft.tracks}
                  stickers={draft.stickers}
                  note={draft.note}
                  className="mx-auto w-full max-w-[24rem]"
                />
                <div className="paper-panel rounded-[1.8rem] p-4">
                  <NotePreview note={draft.note} className="min-h-[20rem]" />
                  <textarea
                    value={draft.note}
                    onChange={(event) =>
                      dispatch({ type: "set-note", payload: event.target.value })
                    }
                    rows={7}
                    placeholder="Write something from your heart..."
                    className="mt-4 w-full rounded-[1.4rem] border border-[#95aac0]/30 bg-white/80 px-5 py-4 text-base leading-8 text-[var(--foreground)] outline-none placeholder:text-[#7a91a6]"
                  />
                  <div className="mt-3 flex items-center justify-between text-sm text-[var(--muted)]">
                    <span>Keep it gentle and personal.</span>
                    <span>{draft.note.length}/280</span>
                  </div>
                </div>
              </div>
              {submitError ? <p className="text-sm text-[#8f4b4b]">{submitError}</p> : null}
            </div>
          ) : null}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => setStep((current) => Math.max(1, current - 1))}
            disabled={step === 1 || submitting}
            className="button-secondary rounded-2xl border border-black/15 px-6 py-4 text-base font-semibold disabled:cursor-not-allowed disabled:opacity-45"
          >
            Back
          </button>
          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((current) => Math.min(4, current + 1))}
              disabled={!canAdvance}
              className="button-primary rounded-2xl border border-black/60 px-6 py-4 text-base font-semibold disabled:cursor-not-allowed disabled:opacity-45"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void finishMixtape()}
              disabled={!canAdvance || submitting}
              className="button-primary rounded-2xl border border-black/60 px-6 py-4 text-base font-semibold disabled:cursor-not-allowed disabled:opacity-45"
            >
              {submitting ? "Creating..." : "Finish"}
            </button>
          )}
        </div>
      </div>

      <aside className="flex flex-col gap-5">
        <div className="soft-panel rounded-[2.2rem] p-6 shadow-frame">
          <p className="pixel-heading text-sm text-[var(--accent)]">Current Moodboard</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
            Cute, nostalgic, and easy to send.
          </h2>
          <p className="mt-4 text-base leading-8 text-[var(--muted)]">
            The final mixtape page stays anonymous and shareable. If Supabase isn&apos;t configured
            yet, local development falls back to a temporary file-backed store so you can still test
            the full flow.
          </p>
        </div>
        <div className="paper-panel rounded-[2.2rem] p-6 shadow-frame">
          <p className="pixel-heading text-sm text-[var(--accent)]">Step Preview</p>
          <div className="mt-5">
            {step === 1 ? (
              <TapePreview themeKey={draft.themeKey} className="mx-auto w-full max-w-[24rem]" />
            ) : null}
            {step === 2 ? (
              <CassetteScene
                themeKey={draft.themeKey}
                tracks={draft.tracks}
                stickers={draft.stickers}
                note={draft.note || "A tiny note goes here."}
                showFloatingTape
                className="mx-auto w-full max-w-[24rem]"
              />
            ) : null}
            {step === 3 ? (
              <CasePreview
                themeKey={draft.themeKey}
                tracks={draft.tracks}
                stickers={draft.stickers}
                className="mx-auto w-full max-w-[24rem]"
              />
            ) : null}
            {step === 4 ? (
              <NotePreview note={draft.note || "Write something from your heart..."} />
            ) : null}
          </div>
        </div>
      </aside>
    </section>
  );
}

function ProgressDots({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center gap-3">
      {[1, 2, 3, 4].map((index) => (
        <React.Fragment key={index}>
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold",
              step > index
                ? "bg-[var(--accent)] text-white"
                : step === index
                  ? "bg-white text-[var(--foreground)] shadow"
                  : "bg-white/45 text-[var(--muted)]"
            )}
          >
            {step > index ? "✓" : index}
          </div>
          {index < 4 ? <div className="progress-line h-1 w-10 rounded-full" /> : null}
        </React.Fragment>
      ))}
    </div>
  );
}

function SectionHeading({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="text-center">
      <h1 className="pixel-heading text-3xl leading-[1.5] text-[var(--foreground)] sm:text-[2rem]">
        {title}
      </h1>
      <p className="mx-auto mt-3 max-w-2xl text-base leading-8 text-[var(--muted)]">{copy}</p>
    </div>
  );
}
