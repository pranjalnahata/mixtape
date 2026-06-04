import { cn } from "@/lib/utils";

export const STICKERS = [
  { id: "clover", name: "Clover" },
  { id: "daisy", name: "Daisy" },
  { id: "bow", name: "Bow" },
  { id: "sprig", name: "Sprig" },
  { id: "heart", name: "Heart" },
] as const;

export function StickerIcon({
  stickerId,
  className,
}: {
  stickerId: string;
  className?: string;
}) {
  const classes = cn("h-full w-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.12)]", className);

  switch (stickerId) {
    case "clover":
      return (
        <svg viewBox="0 0 64 64" className={classes} aria-hidden="true">
          <g fill="#7fa46f">
            <circle cx="23" cy="20" r="10" />
            <circle cx="39" cy="20" r="10" />
            <circle cx="23" cy="36" r="10" />
            <circle cx="39" cy="36" r="10" />
          </g>
          <path d="M31 38c8 6 10 13 5 22" stroke="#688c58" strokeWidth="4" strokeLinecap="round" fill="none" />
        </svg>
      );
    case "daisy":
      return (
        <svg viewBox="0 0 64 64" className={classes} aria-hidden="true">
          <g fill="#f2eee1">
            {[0, 45, 90, 135].map((rotation) => (
              <ellipse
                key={rotation}
                cx="32"
                cy="32"
                rx="10"
                ry="21"
                transform={`rotate(${rotation} 32 32)`}
              />
            ))}
          </g>
          <circle cx="32" cy="32" r="10" fill="#d7b04b" />
        </svg>
      );
    case "bow":
      return (
        <svg viewBox="0 0 64 64" className={classes} aria-hidden="true">
          <path
            d="M14 26c8-8 17-10 24 2-9 2-16 7-19 14-7-4-10-10-5-16Z"
            fill="#9eb987"
          />
          <path
            d="M50 26c-8-8-17-10-24 2 9 2 16 7 19 14 7-4 10-10 5-16Z"
            fill="#9eb987"
          />
          <path d="M28 26c2 1 6 1 8 0 2 5 2 10 0 15-2 1-6 1-8 0-2-5-2-10 0-15Z" fill="#7d9a69" />
          <path d="M32 40c-3 6-8 11-15 14" stroke="#7d9a69" strokeWidth="4" strokeLinecap="round" />
          <path d="M32 40c3 6 8 11 15 14" stroke="#7d9a69" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case "sprig":
      return (
        <svg viewBox="0 0 64 64" className={classes} aria-hidden="true">
          <path d="M18 52c16-14 20-27 26-42" stroke="#799868" strokeWidth="4" strokeLinecap="round" />
          <g fill="#a8c08f">
            <ellipse cx="28" cy="18" rx="6" ry="11" transform="rotate(-18 28 18)" />
            <ellipse cx="38" cy="23" rx="6" ry="11" transform="rotate(18 38 23)" />
            <ellipse cx="22" cy="31" rx="6" ry="11" transform="rotate(-18 22 31)" />
            <ellipse cx="32" cy="37" rx="6" ry="11" transform="rotate(20 32 37)" />
          </g>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 64 64" className={classes} aria-hidden="true">
          <path
            d="M32 53c15-10 21-18 21-28 0-8-5-13-12-13-4 0-7 2-9 5-2-3-5-5-9-5-7 0-12 5-12 13 0 10 6 18 21 28Z"
            fill="#d88f93"
          />
        </svg>
      );
  }
}
