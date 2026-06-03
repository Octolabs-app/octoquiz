# OctoQuiz Cloudflare Migration

OctoQuiz is moving from the Render Node server to Cloudflare Workers with OpenNext.

## Runtime shape

- Cloudflare runs the Next.js app through `@opennextjs/cloudflare`.
- Supabase Realtime powers live quiz room broadcast and presence from the browser hooks.
- The old `server.ts`, `hooks/useSocket.ts`, and `lib/room-manager.ts` path remains as a Render fallback until the Cloudflare launch is verified.

## Required environment variables

Set these in the Cloudflare Worker project before production deploy:

```txt
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON
```

Only publishable Supabase keys belong in `NEXT_PUBLIC_*`. Do not put a service role key in the app.

## Commands

```bash
npm run dev
npm run preview
npm run deploy
```

`npm run preview` builds the OpenNext worker locally and serves it through Wrangler. `npm run deploy` builds and deploys to Cloudflare.

## Supabase scope

For now Supabase is only used for ephemeral realtime room channels, not persistent storage. Add database tables later only if OctoQuiz needs accounts, saved results, leaderboards, billing, or admin analytics.

If realtime rooms need stricter authority, anti-cheat, or very high concurrency, the next migration step should be Cloudflare Durable Objects for room state.
