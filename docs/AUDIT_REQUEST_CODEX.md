# OctoQuiz — Audit Request for Codex

**From:** Claude (branch `claude/octoquiz-release`)
**To:** Codex
**Goal:** Independently verify everything I changed this session. Be adversarial —
try to break it, don't just read the diff. Report findings as a checklist with
PASS / FAIL / RISK + file:line + repro steps. Don't fix silently; list issues so
we can agree on fixes (small obvious bugs you may fix, but call them out).

---

## 0. Setup & context

- **Repo:** `Octolabs-app/octoquiz`. My work is on **`claude/octoquiz-release`**
  (built on top of `main`, **not merged**).
- **Live:** deployed by **direct `wrangler pages deploy out`** (NOT Git-connected)
  to the Cloudflare Pages `octoquiz` project → **https://octoquiz.octolabs.app**
  and `octoquiz.pages.dev`.
- **Architecture (important):** the app is now a **fully client-side SPA** —
  Supabase Realtime, "host-as-server" pattern, **no Node server**, shipped as a
  **static export** (`next.config.mjs` `output:'export'`).
  - ⚠️ This **conflicts with your `codex/cloudflare-migration` branch** (OpenNext
    Workers). We need to pick ONE. My claim: since realtime is 100% client-side
    and there are no server routes, static export is simpler and cheaper. Please
    sanity-check that claim and flag anything that actually needs SSR/Workers.
- **Realtime backend:** runs on the **AniCal Supabase project** (free tier),
  **shared** with AniCal. See `lib/supabase.ts`.

**Build/run locally**
```bash
npm install
npx next build        # static export → ./out
# NOTE: `npm run dev` is the OLD socket server; use `npx next dev` for the SPA.
```
To test multiplayer locally: open `/host` in one tab, `/join?room=CODE` in others.

---

## 1. Deploy: static export, off Render  — files to check
`next.config.mjs`, `app/host/page.tsx`, `app/join/page.tsx`, `app/page.tsx`,
`components/host/HostLobby.tsx`

- [ ] `output:'export'` + `images.unoptimized:true`. Confirm `next build` produces
      `out/` with `host.html`, `join.html`, `index.html`, `couples.html`.
- [ ] Dynamic routes `/host/[room]` & `/join/[room]` were **removed**; room code
      now comes from a **`?room=` query param** read client-side. Verify:
  - `https://octoquiz.octolabs.app/join?room=ABCD` serves the join page (not 404,
    not the home page).
  - `/host?room=ABCD` serves host; `/host` with no code generates one and
    `history.replaceState`s it into the URL.
- [ ] `public/_redirects` is `/* /index.html 200` (SPA fallback). Confirm it does
      **not** shadow `host.html`/`join.html` (Cloudflare serves static assets
      first — verify `/host` returns host content, not index).
- [ ] **Deploy-skew risk:** because we redeployed many times (content-hashed JS),
      a stale open tab can hit a hydration error (#418) on navigation. Confirm a
      **fresh load** is always clean. Consider whether we should add a safeguard
      (e.g., version check / `next build` `generateBuildId`).
- [ ] QR + "Copy invite link" always use the canonical `https://octoquiz.octolabs.app`
      (except on localhost). See `HostLobby.tsx`.

## 2. Decoy (new drawing-imposter game) — the big one
`lib/types.ts` (`DrawImposterState`, `DrawStroke`, `GameAction`),
`lib/games/draw-imposter.ts`, `hooks/useGameHost.ts`, `hooks/useGamePlayer.ts`,
`components/host/games/DrawImposterHost.tsx`,
`components/player/games/DrawImposterPlayer.tsx`,
`app/host/page.tsx`, `app/join/page.tsx`, `components/host/GameSelect.tsx`,
`app/page.tsx`, `data/decoy-words.json`

Verify with a **real 3–4 player session**:
- [ ] **Single shared whiteboard**: every client (host TV + all phones) shows the
      **identical** board. Strokes are sent via a dedicated `draw` broadcast (+
      `draw_reset`), NOT inside `game_state`.
- [ ] **ONE stroke per turn (Fake Artist style):** the current drawer may draw a
      single line, then the turn **auto-passes**. Player locks after one stroke
      (`drawnThisTurn`, reset on `turnIndex` change) and sends `stroke_done`; host
      advances on `stroke_done` from the current drawer (700ms delay). A 20s
      per-turn timer is only a fallback for idle/disconnected drawers. Verify the
      auto-pass fires on stroke completion and the fallback fires if nobody draws.
      - ⚠️ **SUSPECTED ISSUE I couldn't fully confirm (synthetic testing was
        flaky):** the host per-turn countdown may not reset to a full 20s on each
        auto-pass — verify `turnStartedAt` is updated on every `advanceTurn` and
        that `DrawImposterHost`'s `timeLeft` resets per turn, so the fallback
        never fires early and skip a player who is still thinking. (Confirmed
        working: a drawn line renders on the host board + all players, and turns
        rotate Ben→Ana→Cid; this note is only about the timer display/fallback.)
- [ ] **Turn-based**: only `currentDrawer` can draw; others see "X is drawing… watch
      the board". Turns rotate through `drawerOrder` for `totalRounds` (3) rounds.
- [ ] **Different words**: crew share `realWord`; the decoy gets `imposterWord`.
- [ ] **Early vote**: a player "Call vote" → when a **majority** call, voting opens;
      host TV "Start vote" also works (`drawSkipToVote`).
- [ ] **Voting + scoring + reset** between games (`draw_reset` on new game).
- [ ] **BUG TO CONFIRM:** on the reveal screen the "first up" drawer must equal the
      first actual drawing turn (`drawerOrder[0]`). I *think* it's consistent but
      saw one ambiguous moment — please verify there's no off-by-one when
      `startDrawing` runs.
- [ ] **Disconnect mid-turn**: if the current drawer leaves, does the turn timer
      still advance (no stall)? (`drawNextTurn` is on a host timer — confirm.)
- [ ] **Message volume**: one broadcast per *finished* stroke (on pointer-up), not
      per point. Confirm this stays well under Supabase's 100 msg/s even with fast
      drawing. Flag if you think mid-stroke streaming is needed.
- [ ] `data/decoy-words.json` (60 pairs): pairs should be simple/drawable and
      *distinct enough* that the decoy is spottable (not synonyms). Sanity-check.

## 3. No-repeat picker — `lib/no-repeat.ts` (+ all games)
Applied in `flag-quiz.ts`, `capitals.ts`, `landmarks.ts`, `imposter.ts`,
`draw-imposter.ts`. (Trivia uses OpenTDB session tokens already.)
- [ ] `pickFresh(key, pool, count, idOf)` returns items not served since last reset;
      resets+reshuffles when `available < count`. Verify **no repeats across
      back-to-back sessions** until the pool is exhausted.
- [ ] State is **module-level** (per host browser tab) — confirm that's acceptable
      (resets on host reload). Flag if you think it should be per-room.
- [ ] `idOf` uniqueness: flags=`code`, capitals=`city`, landmarks=`name`,
      imposter/decoy=`real`. Confirm no duplicate ids weaken dedup (I checked
      landmarks — no dup names).

## 4. Capital Cities rework (text quiz, no photos)
`lib/types.ts` (`CapitalsQuestion`), `data/capitals.ts` (`ALL_CAPITAL_CITIES`),
`lib/games/capitals.ts`, `CapitalsHost.tsx`, `CapitalsPlayer.tsx`
- [ ] Question is now **"What is the capital of {country}?"** with **4 city**
      options; **no Wikipedia images** (all image fetch removed).
- [ ] Correctness compares answer to `q.capital`; `correctIndex` points to the
      capital; distractors are *other capital cities*; reveal shows the capital.
- [ ] No leftover references to `q.city` / `q.imageUrl` anywhere.

## 5. Mauritius trivia fix — `lib/games/trivia.ts`, `data/trivia-local.ts`
- [ ] Root cause was: `'Mauritius'` was **missing from `OPENTDB_CATEGORY_MAP`**, so
      `localOnly` was false and it fetched **generic** OpenTDB questions. Fix:
      added `'Mauritius': null` and changed the check to
      `!OPENTDB_CATEGORY_MAP[category] && category !== 'Mixed'`.
- [ ] Verify selecting **Mauritius** now serves the **local MU bank** (Port Louis,
      dodo, rupee, 1968 independence, etc.) — NOT generic trivia.
- [ ] Verify mapped categories (General/Science/History/Geography/Movies/Music/
      Sports) still hit OpenTDB, and other local-only ones (Pop Culture, Food,
      World Landmarks, Mixed) behave correctly.
- [ ] **Fact-check** the ~23 MU questions in `data/trivia-local.ts` for accuracy.

## 6. Join username fix — `app/join/page.tsx`
- [ ] Bug was: the auto-join effect depended on the live `name`, so it joined after
      the **first keystroke**. Fix: a `cachedName` ref captured on mount; auto-join
      only fires from a **home-screen-cached** name.
- [ ] Verify: (a) direct `/join?room=X` shows the form and you can type a full
      name; (b) coming from the home screen (name cached in sessionStorage)
      auto-joins as before; (c) no double-join.

## 7. Landmarks expansion — `data/landmarks.ts`
- [ ] Pool grew 46 → 97. Spot-check that `wikiPage` titles resolve to real
      Wikipedia images (the game fetches thumbnails at runtime). Flag any 404s.

## 8. Capacity / concurrency — `scripts/capacity-test.mjs`
- [ ] Re-run `node scripts/capacity-test.mjs 12 5 12 1` (and a throughput run).
      Confirm **0 cross-room leakage** and good delivery. My results: 98 conns and
      ~62 msg/s both at 100% delivery, ~230ms p50.
- [ ] **Key risk to assess:** Supabase **free tier** ≈ **200 concurrent
      connections / 100 msg/s for the whole project**, and it's **shared with
      AniCal**. Recommend whether OctoQuiz needs its **own** Supabase project
      and/or a paid plan before public launch. Room codes are 5-char
      (24⁵ ≈ 8M) so collisions are negligible — confirm.

---

## 9. Also (lighter pass — different repos)
- **Octolabs homepage** (`Octolabs-app/octolabs`, branch
  `claude/octolabs-brand-review`, live `octolabs.app`): I replaced the
  interactive swimming-octopus with a simple static octopus-with-hat mascot
  (hero + nav logo). Verify it renders, no console errors, no leftover dead JS.
  Note: the **favicon** is still the old mark (not updated).
- **ArtisanMU** (`Octolabs-app/artisanmu`, Vercel, `artisanmu.octolabs.app`):
  I updated the Vercel env vars `SUPABASE_URL`/`SUPABASE_ANON_KEY` to the new
  project `tlvgcxshiapqswcyyvyq`, but the **redeploy failed** because Vercel's
  Git link points to the old `A1l4n/ArtsianMU` repo path. **Not yet live** —
  needs the Git connection repointed. Please confirm the env values are right
  and flag the reconnect as outstanding.

## Report format
For each numbered section: **PASS / FAIL / RISK**, with `file:line`, a one-line
repro, and severity (blocker / major / minor / nit). Put anything that should
block a public launch at the top.
