# OctoQuiz

OctoQuiz is an Octolabs multiplayer party trivia game. The production web app
runs on Cloudflare Workers with static Next.js assets and a Durable Object room
relay.

## Runtime

- `next build` exports the app to `out/`.
- `worker/index.js` serves the exported assets through Cloudflare Workers.
- `/realtime/:roomCode` upgrades to a WebSocket and routes to a Durable Object.
- One Durable Object instance is created per room code.
- No Render server, Socket.IO server, or Supabase Realtime project is required.

## Commands

```bash
npm install
npm run build
npm run preview
npm run deploy
```

Use Node.js 22 or newer for local work and CI.

## Environment

No runtime environment variables are required for the current public MVP.

## Deployment

Deploy with Wrangler:

```bash
npm run deploy
```

Then route `octoquiz.octolabs.app/*` to the `octoquiz` Worker in Cloudflare.

## Notes

The host browser still owns game logic for the current MVP. The Durable Object is
currently a room relay and identity-stamping layer. If OctoQuiz needs stronger
anti-cheat, recovery after host disconnects, or larger public rooms, move the
game state machine itself into the Durable Object.
