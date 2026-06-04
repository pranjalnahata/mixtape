# Mixtape For You

A scrapbook-style Next.js app for creating cute digital mixtapes with:

- a cassette theme picker,
- draggable sticker placement,
- Spotify-based song search,
- an owner share page,
- and a public recipient page.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- Supabase for production storage
- local temp-file fallback storage for development when Supabase env vars are missing

## Routes

- `/`
- `/create`
- `/share/[slug]`
- `/m/[slug]`
- `/api/music/search`
- `/api/mixtapes`
- `/api/mixtapes/[slug]`

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Copy envs:

```bash
cp .env.example .env.local
```

3. Start the app:

```bash
npm run dev
```

4. Open [http://127.0.0.1:3000](http://127.0.0.1:3000)

If Supabase is not configured yet, the app still works locally by saving mixtapes to a temp JSON file at `/private/tmp/mixtape-local-store.json`.
If Spotify credentials are missing, song search will not work.

## Environment Variables

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`

## Deploying Live

### 1. Create Supabase

1. Create a new Supabase project.
2. Open the SQL editor.
3. Run the migration from:

```text
supabase/migrations/20260604143000_create_mixtapes.sql
```

4. In Supabase project settings, copy:
   - Project URL
   - `anon` public key
   - `service_role` secret key

### 2. Create a Spotify App

1. Go to the Spotify Developer Dashboard.
2. Sign in and choose **Create app**.
3. Give it any app name and description.
4. If Spotify asks for a redirect URI during setup, use `http://127.0.0.1:3000`.
5. After the app is created, open its settings page.
6. Copy:
   - **Client ID**
   - **Client secret**

This app only uses Spotify for server-side search enrichment, so no redirect URI is required for the current implementation.

### 3. Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel, choose **Add New Project** and import the repo.
3. Add these environment variables in Vercel:

```text
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
SPOTIFY_CLIENT_ID=...
SPOTIFY_CLIENT_SECRET=...
```

4. Deploy.

### 4. Add Your Domain

1. In Vercel, open the project settings.
2. Add your custom domain.
3. Update DNS as instructed by Vercel.
4. Confirm `NEXT_PUBLIC_SITE_URL` exactly matches the final domain, then redeploy if you changed it.

### 5. Production Smoke Test

Verify all of these on the live site:

- `/`
- `/create`
- search for a song
- add at least one track
- finish a mixtape
- open `/share/[slug]`
- open `/m/[slug]`
- confirm copied links use the real domain
- confirm Spotify embeds load on share and recipient pages

## Vercel CLI Option

If you prefer CLI deployment:

```bash
npm install -g vercel
vercel
vercel env add NEXT_PUBLIC_SITE_URL
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add SPOTIFY_CLIENT_ID
vercel env add SPOTIFY_CLIENT_SECRET
vercel --prod
```

## Database

The initial schema migration lives at:

- `supabase/migrations/20260604143000_create_mixtapes.sql`

## Checks

```bash
npm run lint
npm run build
```
