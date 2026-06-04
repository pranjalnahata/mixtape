import "server-only";

import { promises as fs } from "node:fs";
import { notFound } from "next/navigation";
import { createSlug } from "@/lib/slug";
import { getSupabaseAdminClient, isSupabaseConfigured } from "@/lib/supabase";
import type { MixtapeDraft, MixtapeRecord, MixtapeTrack, PlacedSticker } from "@/lib/types";

const LOCAL_STORE_PATH = "/private/tmp/mixtape-local-store.json";

function validateTrack(track: MixtapeTrack) {
  if (!track.id || !track.title || !track.artist || !track.spotifyUrl || !track.spotifyUri) {
    throw new Error("Each track needs an id, title, artist, and Spotify link.");
  }
}

function validateSticker(sticker: PlacedSticker) {
  if (!sticker.id || !sticker.stickerId || !sticker.zone) {
    throw new Error("Every sticker needs an id, type, and zone.");
  }
}

export function validateDraft(draft: MixtapeDraft) {
  if (!draft.themeKey) {
    throw new Error("Pick a cassette color first.");
  }

  if (!draft.tracks.length) {
    throw new Error("Add at least one song.");
  }

  if (draft.tracks.length > 4) {
    throw new Error("Mixtapes are limited to four songs.");
  }

  if (!draft.note.trim()) {
    throw new Error("Add a note before finishing.");
  }

  if (draft.note.length > 280) {
    throw new Error("Notes are limited to 280 characters.");
  }

  draft.tracks.forEach(validateTrack);
  draft.stickers.forEach(validateSticker);
}

function toRecord(draft: MixtapeDraft): MixtapeRecord {
  const now = new Date().toISOString();

  return {
    ...draft,
    slug: createSlug(),
    note: draft.note.trim(),
    createdAt: now,
    updatedAt: now,
  };
}

async function readLocalRecords() {
  try {
    const raw = await fs.readFile(LOCAL_STORE_PATH, "utf8");
    return JSON.parse(raw) as MixtapeRecord[];
  } catch {
    return [];
  }
}

async function writeLocalRecords(records: MixtapeRecord[]) {
  await fs.writeFile(LOCAL_STORE_PATH, JSON.stringify(records, null, 2), "utf8");
}

export async function createMixtape(draft: MixtapeDraft) {
  validateDraft(draft);
  const record = toRecord(draft);

  if (!isSupabaseConfigured()) {
    const records = await readLocalRecords();
    records.push(record);
    await writeLocalRecords(records);
    return record;
  }

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("mixtapes").insert({
    slug: record.slug,
    theme_key: record.themeKey,
    stickers: record.stickers,
    note: record.note,
    tracks: record.tracks,
  });

  if (error) {
    throw new Error(error.message);
  }

  return record;
}

export async function getMixtapeBySlug(slug: string) {
  if (!slug) {
    return null;
  }

  if (!isSupabaseConfigured()) {
    const records = await readLocalRecords();
    return records.find((record) => record.slug === slug) ?? null;
  }

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("mixtapes")
    .select("slug, theme_key, stickers, note, tracks, created_at, updated_at")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return {
    slug: data.slug,
    themeKey: data.theme_key,
    stickers: data.stickers,
    note: data.note,
    tracks: data.tracks,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  } satisfies MixtapeRecord;
}

export async function getMixtapeOrThrow(slug: string) {
  const mixtape = await getMixtapeBySlug(slug);

  if (!mixtape) {
    notFound();
  }

  return mixtape;
}
