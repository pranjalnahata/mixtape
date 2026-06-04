import "server-only";

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

export async function searchMusic(query: string) {
  const trimmedQuery = query.trim();
  if (trimmedQuery.length < 2) {
    return [];
  }

  const accessToken = await getSpotifyAccessToken();
  if (!accessToken) {
    throw new Error("Spotify credentials are missing or invalid.");
  }

  const response = await fetch(
    `https://api.spotify.com/v1/search?type=track&limit=8&market=US&q=${encodeURIComponent(trimmedQuery)}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Spotify search is unavailable right now.");
  }

  const payload = (await response.json()) as {
    tracks?: {
      items?: Array<{
        id: string;
        name: string;
        uri: string;
        duration_ms?: number;
        artists: Array<{ name: string }>;
        album?: {
          images?: Array<{ url: string }>;
        };
        external_urls?: { spotify?: string };
      }>;
    };
  };

  return (payload.tracks?.items ?? [])
    .filter((item) => item.id && item.name && item.artists?.length && item.uri && item.external_urls?.spotify)
    .map((item) => ({
      id: `spotify-${item.id}`,
      title: item.name,
      artist: item.artists.map((artist) => artist.name).join(", "),
      artworkUrl: item.album?.images?.[0]?.url ?? null,
      durationMs: item.duration_ms ?? null,
      spotifyUrl: item.external_urls?.spotify ?? "https://open.spotify.com",
      spotifyUri: item.uri,
      source: "spotify" as const,
    }));
}
