# Cloudflare Deployment

OctoQuiz deploys as a Cloudflare Worker with static Next.js assets and a
Durable Object room relay.

## Runtime

- `next build` exports the web app to `out/`.
- `worker/index.js` serves `out/` through the Worker assets binding.
- `/healthz` returns a plain health response.
- `/realtime/:roomCode` upgrades to a WebSocket and routes all clients for the
  same room code to the same Durable Object instance.

## Deploy

```bash
npm install
npm run build
npm run deploy
```

Use Node.js 22 or newer for local work and CI.

In Cloudflare, route `octoquiz.octolabs.app/*` to the `octoquiz` Worker.

## Environment

No runtime environment variables are required for the public MVP.
