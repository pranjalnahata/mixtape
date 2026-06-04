import "server-only";

import type { MixtapeTrack } from "@/lib/types";
import { normalizeText } from "@/lib/utils";

let spotifyTokenCache: { token: string; expiresAt: number } | null = null;

async function getSpotifyAccessToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return null;
  }

  if (spotifyTokenCache && spotifyTokenCache.expiresAt > Date.now() + 5_000) {
    return spotifyTokenCache.token;
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as {
    access_token: string;
    expires_in: number;
  };

  spotifyTokenCache = {
    token: payload.access_token,
    expiresAt: Date.now() + payload.expires_in * 1000,
  };

  return payload.access_token;
}

async function enrichWithSpotify(track: MixtapeTrack) {
  const accessToken = await getSpotifyAccessToken();
  if (!accessToken) {
    return track;
  }

  const query = encodeURIComponent(`track:${track.title} artist:${track.artist}`);
  const response = await fetch(
    `https://api.spotify.com/v1/search?type=track&limit=1&market=US&q=${query}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return track;
  }

  const payload = (await response.json()) as {
    tracks?: {
      items?: Array<{
        uri: string;
        external_urls?: { spotify?: string };
        name: string;
        artists: Array<{ name: string }>;
      }>;
    };
  };

  const candidate = payload.tracks?.items?.[0];
  if (!candidate) {
    return track;
  }

  const sameTitle =
    normalizeText(candidate.name) === normalizeText(track.title) ||
    normalizeText(candidate.name).includes(normalizeText(track.title)) ||
    normalizeText(track.title).includes(normalizeText(candidate.name));
  const sameArtist = candidate.artists.some((artist) =>
    normalizeText(artist.name).includes(normalizeText(track.artist))
  );

  if (!sameTitle || !sameArtist) {
    return track;
  }

  return {
    ...track,
    spotifyUrl: candidate.external_urls?.spotify ?? null,
    spotifyUri: candidate.uri,
  };
}

export async function searchMusic(query: string) {
  const trimmedQuery = query.trim();
  if (trimmedQuery.length < 2) {
    return [];
  }

  const response = await fetch(
    `https://itunes.apple.com/search?entity=song&country=US&limit=8&term=${encodeURIComponent(trimmedQuery)}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Apple Music search is unavailable right now.");
  }

  const payload = (await response.json()) as {
    results: Array<{
      trackId: number;
      trackName: string;
      artistName: string;
      artworkUrl100?: string;
      trackTimeMillis?: number;
      previewUrl?: string;
      trackViewUrl?: string;
    }>;
  };

  const baseTracks = payload.results
    .filter((item) => item.trackId && item.trackName && item.artistName && item.trackViewUrl)
    .map((item) => ({
      id: `apple-${item.trackId}`,
      title: item.trackName,
      artist: item.artistName,
      artworkUrl: item.artworkUrl100?.replace("100x100", "300x300") ?? null,
      durationMs: item.previewUrl ? 30_000 : (item.trackTimeMillis ?? null),
      previewUrl: item.previewUrl ?? null,
      appleUrl: item.trackViewUrl ?? "https://music.apple.com",
      spotifyUrl: null,
      spotifyUri: null,
      source: "apple" as const,
    }));

  return Promise.all(baseTracks.map((track) => enrichWithSpotify(track)));
}
