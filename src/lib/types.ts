export type StickerZone = "tape" | "case";

export type MixtapeTrackSource = "spotify";

export interface MixtapeTrack {
  id: string;
  title: string;
  artist: string;
  artworkUrl: string | null;
  durationMs: number | null;
  spotifyUrl: string;
  spotifyUri: string;
  source: MixtapeTrackSource;
}

export interface PlacedSticker {
  id: string;
  stickerId: string;
  zone: StickerZone;
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

export interface MixtapeDraft {
  themeKey: string;
  stickers: PlacedSticker[];
  tracks: MixtapeTrack[];
  note: string;
}

export interface MixtapeRecord extends MixtapeDraft {
  slug: string;
  createdAt: string;
  updatedAt: string;
}
