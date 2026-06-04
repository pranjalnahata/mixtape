"use client";

import * as React from "react";
import { STICKERS, StickerIcon } from "@/data/stickers";
import { getThemeByKey } from "@/data/themes";
import type { MixtapeTrack, PlacedSticker, StickerZone } from "@/lib/types";
import { clamp, cn } from "@/lib/utils";

function StickerLayer({
  stickers,
  zone,
  editable = false,
  onPointerDown,
  onRemove,
}: {
  stickers: PlacedSticker[];
  zone: StickerZone;
  editable?: boolean;
  onPointerDown?: (stickerId: string) => (event: React.PointerEvent<HTMLButtonElement>) => void;
  onRemove?: (stickerId: string) => void;
}) {
  return (
    <>
      {stickers
        .filter((sticker) => sticker.zone === zone)
        .map((sticker) => (
          <div
            key={sticker.id}
            className="absolute z-20"
            style={{
              left: `${sticker.x}%`,
              top: `${sticker.y}%`,
              transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg) scale(${sticker.scale})`,
            }}
          >
            {editable && onPointerDown ? (
              <button
                type="button"
                className={cn(
                  "relative h-14 w-14 touch-none rounded-full outline-none transition-transform hover:scale-105",
                  "cursor-grab active:cursor-grabbing"
                )}
                onPointerDown={onPointerDown(sticker.id)}
                aria-label={`Move ${sticker.stickerId} sticker`}
              >
                <StickerIcon stickerId={sticker.stickerId} />
              </button>
            ) : (
              <div className="relative h-14 w-14">
                <StickerIcon stickerId={sticker.stickerId} />
              </div>
            )}
            {editable && onRemove ? (
              <button
                type="button"
                className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black text-sm text-white shadow-md"
                onClick={() => onRemove(sticker.id)}
                aria-label={`Remove ${sticker.stickerId} sticker`}
              >
                ×
              </button>
            ) : null}
          </div>
        ))}
    </>
  );
}

export function TapePreview({
  themeKey,
  stickers = [],
  editable = false,
  onStickerPointerDown,
  onRemoveSticker,
  className,
}: {
  themeKey: string;
  stickers?: PlacedSticker[];
  editable?: boolean;
  onStickerPointerDown?: (stickerId: string) => (event: React.PointerEvent<HTMLButtonElement>) => void;
  onRemoveSticker?: (stickerId: string) => void;
  className?: string;
}) {
  const theme = getThemeByKey(themeKey);

  return (
    <div
      className={cn(
        "relative aspect-[1.5/1] overflow-hidden rounded-[2rem] border border-white/70 px-[7%] pb-[10%] pt-[8%] shadow-frame",
        className
      )}
      style={{
        background: `linear-gradient(180deg, ${theme.tapeBody}, ${theme.tapeEdge})`,
        boxShadow: "0 24px 50px rgba(54, 71, 92, 0.16), inset 0 1px 0 rgba(255,255,255,0.95)",
      }}
    >
      <div className="absolute right-[12%] top-[8%] h-[4%] w-[18%] rounded-full bg-white/65" />
      <div
        className="grain relative flex h-full items-center justify-center overflow-hidden rounded-[1.7rem] border border-[#ddd7cf] px-[10%] py-[10%]"
        style={{ backgroundImage: theme.pattern, backgroundSize: "26px 26px, 26px 26px, cover" }}
      >
        <StickerLayer
          stickers={stickers}
          zone="tape"
          editable={editable}
          onPointerDown={onStickerPointerDown}
          onRemove={onRemoveSticker}
        />
        <div className="absolute inset-x-[12%] bottom-[26%] top-[18%] rounded-[1.5rem] border border-[#cfc8bf]/80 bg-white/55" />
        <div className="absolute left-[18%] top-[36%] h-[28%] w-[22%] rounded-full border-[6px] border-[#d7dce5] bg-[#8fb0cf] shadow-inner">
          <div className="absolute inset-[26%] rounded-full bg-[#e6ebf1]" />
        </div>
        <div className="absolute right-[18%] top-[36%] h-[28%] w-[22%] rounded-full border-[6px] border-[#d7dce5] bg-[#8fb0cf] shadow-inner">
          <div className="absolute inset-[26%] rounded-full bg-[#e6ebf1]" />
        </div>
        <div className="absolute inset-y-[33%] left-[40%] right-[40%] rounded-xl bg-[#2b2b2b] shadow-inner">
          <div className="mx-auto mt-[22%] h-[56%] w-[20%] rounded-full bg-[#505050]" />
        </div>
      </div>
      <div className="absolute bottom-[7%] left-[18%] h-[6%] w-[7%] rounded-full bg-[#a7cade] shadow-inner" />
      <div className="absolute bottom-[8%] left-[31%] h-[5%] w-[5%] rounded bg-[#a7cade] shadow-inner" />
      <div className="absolute bottom-[8%] right-[24%] h-[5%] w-[5%] rounded bg-[#a7cade] shadow-inner" />
      <div className="absolute bottom-[7%] right-[14%] h-[6%] w-[7%] rounded-full bg-[#a7cade] shadow-inner" />
    </div>
  );
}

export function CasePreview({
  themeKey,
  tracks = [],
  stickers = [],
  editable = false,
  onStickerPointerDown,
  onRemoveSticker,
  className,
}: {
  themeKey: string;
  tracks?: MixtapeTrack[];
  stickers?: PlacedSticker[];
  editable?: boolean;
  onStickerPointerDown?: (stickerId: string) => (event: React.PointerEvent<HTMLButtonElement>) => void;
  onRemoveSticker?: (stickerId: string) => void;
  className?: string;
}) {
  const theme = getThemeByKey(themeKey);

  return (
    <div
      className={cn(
        "relative aspect-[1.05/1] overflow-hidden rounded-[1.8rem] border border-white/60 bg-white/25 p-[5%] shadow-frame backdrop-blur-sm",
        className
      )}
    >
      <div className="absolute inset-0 rounded-[1.8rem] border border-white/80" />
      <div className="absolute inset-[3.2%] rounded-[1.4rem] border border-[rgba(255,255,255,0.35)]" />
      <div className="absolute left-[6%] right-[6%] top-[6%] h-[6%] rounded-full bg-white/25 blur-xl" />
      <div
        className="absolute inset-x-[6.5%] bottom-[11%] top-[20%] overflow-hidden rounded-[1.15rem] border border-white/40"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.62), rgba(255,255,255,0.16)), rgba(255,255,255,0.18)",
        }}
      >
        <StickerLayer
          stickers={stickers}
          zone="case"
          editable={editable}
          onPointerDown={onStickerPointerDown}
          onRemove={onRemoveSticker}
        />
        <div
          className="absolute inset-x-[4%] bottom-[8%] top-[32%] overflow-hidden rounded-[0.95rem] border border-[#ddd8cf]/80 px-[7%] py-[9%]"
          style={{
            background: `linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,250,240,0.88)), ${theme.labelTone}`,
          }}
        >
          <div className="lined-paper absolute inset-0 opacity-70" />
          <div className="absolute left-[6%] right-[6%] top-[10%] flex items-center justify-between text-[0.48rem] uppercase tracking-[0.2em] text-[#546c7d] opacity-70 sm:text-[0.56rem]">
            <span>Date/Time</span>
            <span>On Off</span>
            <span>Date/Time</span>
            <span>On Off</span>
          </div>
          <div className="relative grid gap-2 pt-[22%] text-[#36546d]">
            {tracks.length ? (
              tracks.slice(0, 4).map((track) => (
                <p key={track.id} className="script-text truncate text-sm sm:text-base">
                  {track.title}
                </p>
              ))
            ) : (
              <p className="script-text text-sm text-[#5f7586] sm:text-base">Your songs will appear here.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function NotePreview({
  note,
  className,
}: {
  note: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "paper-panel lined-paper relative overflow-hidden rounded-[1.8rem] px-6 py-5 shadow-frame",
        className
      )}
    >
      <div className="absolute inset-y-0 left-9 w-px bg-[rgba(165,191,212,0.55)]" />
      <div className="absolute left-3 top-5 flex flex-col gap-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <span key={index} className="h-3 w-3 rounded-full bg-[#c7dae8]/90 shadow-inner" />
        ))}
      </div>
      <p className="script-text min-h-16 whitespace-pre-wrap pl-9 pr-2 text-[1.1rem] leading-8 text-[#36546d] sm:text-[1.35rem]">
        {note || "Write something from your heart..."}
      </p>
    </div>
  );
}

export function CassetteScene({
  themeKey,
  tracks,
  stickers,
  note,
  showFloatingTape = false,
  className,
}: {
  themeKey: string;
  tracks: MixtapeTrack[];
  stickers: PlacedSticker[];
  note: string;
  showFloatingTape?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("relative aspect-[1/1.02] w-full", className)}>
      <div className="absolute inset-x-[13%] top-[2%] z-20 rotate-[-4deg]">
        <NotePreview note={note} />
      </div>
      <div className="absolute inset-x-[8%] bottom-[3%] z-10">
        <CasePreview themeKey={themeKey} tracks={tracks} stickers={stickers} />
      </div>
      {showFloatingTape ? (
        <div className="absolute left-[3%] top-[26%] z-30 rotate-[-11deg]">
          <TapePreview themeKey={themeKey} stickers={stickers} className="w-[14rem] sm:w-[17rem]" />
        </div>
      ) : null}
    </div>
  );
}

export function StickerEditorCanvas({
  themeKey,
  zone,
  stickers,
  onMoveSticker,
  onRemoveSticker,
  className,
}: {
  themeKey: string;
  zone: StickerZone;
  stickers: PlacedSticker[];
  onMoveSticker: (stickerId: string, x: number, y: number) => void;
  onRemoveSticker: (stickerId: string) => void;
  className?: string;
}) {
  const activeStickerIds = stickers.filter((sticker) => sticker.zone === zone);
  const theme = getThemeByKey(themeKey);

  return (
    <StickerCanvasFrame
      className={className}
      stickers={activeStickerIds}
      onMoveSticker={onMoveSticker}
      onRemoveSticker={onRemoveSticker}
    >
      {zone === "tape" ? (
        <TapePreview
          themeKey={theme.key}
          stickers={stickers}
          editable
          onStickerPointerDown={() => () => undefined}
          onRemoveSticker={() => undefined}
          className="w-full"
        />
      ) : (
        <CasePreview
          themeKey={theme.key}
          tracks={[]}
          stickers={stickers}
          editable
          onStickerPointerDown={() => () => undefined}
          onRemoveSticker={() => undefined}
          className="w-full"
        />
      )}
    </StickerCanvasFrame>
  );
}

function StickerCanvasFrame({
  children,
  stickers,
  onMoveSticker,
  onRemoveSticker,
  className,
}: {
  children: React.ReactNode;
  stickers: PlacedSticker[];
  onMoveSticker: (stickerId: string, x: number, y: number) => void;
  onRemoveSticker: (stickerId: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("relative mx-auto w-full max-w-[28rem]", className)}>
      <DragSurface
        stickers={stickers}
        onMoveSticker={onMoveSticker}
        onRemoveSticker={onRemoveSticker}
      >
        {children}
      </DragSurface>
    </div>
  );
}

function DragSurface({
  children,
  stickers,
  onMoveSticker,
  onRemoveSticker,
}: {
  children: React.ReactNode;
  stickers: PlacedSticker[];
  onMoveSticker: (stickerId: string, x: number, y: number) => void;
  onRemoveSticker: (stickerId: string) => void;
}) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [draggingId, setDraggingId] = React.useState<string | null>(null);

  const updatePosition = React.useEffectEvent((clientX: number, clientY: number) => {
    if (!draggingId || !containerRef.current) {
      return;
    }

    const bounds = containerRef.current.getBoundingClientRect();
    const x = clamp(((clientX - bounds.left) / bounds.width) * 100, 7, 93);
    const y = clamp(((clientY - bounds.top) / bounds.height) * 100, 10, 90);
    onMoveSticker(draggingId, x, y);
  });

  React.useEffect(() => {
    if (!draggingId) {
      return;
    }

    const handleMove = (event: PointerEvent) => updatePosition(event.clientX, event.clientY);
    const handleEnd = () => setDraggingId(null);

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleEnd);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleEnd);
    };
  }, [draggingId]);

  return (
    <div ref={containerRef} className="relative">
      {children}
      <div className="pointer-events-none absolute inset-0">
        {stickers.map((sticker) => (
          <div
            key={sticker.id}
            className="pointer-events-auto absolute z-30"
            style={{
              left: `${sticker.x}%`,
              top: `${sticker.y}%`,
              transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg) scale(${sticker.scale})`,
            }}
          >
            <button
              type="button"
              className="relative h-14 w-14 cursor-grab rounded-full active:cursor-grabbing"
              onPointerDown={(event) => {
                setDraggingId(sticker.id);
                updatePosition(event.clientX, event.clientY);
              }}
              aria-label={`Move ${sticker.stickerId} sticker`}
            >
              <StickerIcon stickerId={sticker.stickerId} />
            </button>
            <button
              type="button"
              className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black text-sm text-white shadow-md"
              onClick={() => onRemoveSticker(sticker.id)}
              aria-label={`Remove ${sticker.stickerId} sticker`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StickerPalette({
  onAddSticker,
}: {
  onAddSticker: (stickerId: string) => void;
}) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {STICKERS.map((sticker) => (
        <button
          key={sticker.id}
          type="button"
          onClick={() => onAddSticker(sticker.id)}
          className="paper-panel flex items-center gap-3 rounded-full px-4 py-3 text-sm font-semibold text-[var(--foreground)] transition-transform hover:-translate-y-0.5"
        >
          <span className="h-10 w-10 rounded-full bg-white/60 p-1.5">
            <StickerIcon stickerId={sticker.id} />
          </span>
          {sticker.name}
        </button>
      ))}
    </div>
  );
}
