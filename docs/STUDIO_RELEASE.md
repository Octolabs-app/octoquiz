# OctoQuiz studio release — 2026-10-11

## Interface

New question-mark speech-bubble logo, paper/forest palette, shared navigation,
responsive Host/Join home, invitation lobby, game picker and final standings.
Game screens use the same readable palette and phone touch controls. Motion
honors reduced-motion preferences. The separate After Dark experience remains
on its existing route.

## Logic and reliability

Shared time/scoring helpers reject inputs after the deadline and prevent invalid
clock values from earning points. Trivia indices are validated before indexing.
Answers and votes lock after submission. Self-votes are rejected; tied vote
counts do not arbitrarily catch an imposter. Rejoining an existing player keeps
their score and ready state. The timer fires expiry once per question.

The relay requires a valid presence, allows only one live host, rejects duplicate
live identities and role switching, limits message size, restricts events by role,
and stamps player-owned answers/votes/drawing events with the sender identity.

## Validation

`npm test`: eight tests, including 15,000 scoring/deadline cases, six game-family
checks, answer/vote locking, question selection and relay protocol enforcement.
`npm run build`: static production export and TypeScript validation.
`npm run lint`: no errors; legacy unused suppressions remain as warnings.
`npm audit --omit=dev`: zero known production dependency advisories at release.
The full development tree still contains transitive tooling advisories; do not
apply npm's suggested forced framework downgrade to resolve them.

## Architecture boundary

This remains a trusted-party game: the host browser owns rules, timers, correct
answers and secret roles. The relay is not an authoritative anti-cheat service.
Keep the host screen open; host refresh/disconnect does not recover a game.
Moving the state machine and per-player secret filtering into the Durable Object
is the next reliability milestone before ranked or adversarial public play.

## Deployment

Run `npm ci`, `npm test`, `npm run lint`, `npm run build`, then `npx wrangler deploy`.
The `octoquiz` Worker serves Next's static `out` assets with the existing `ROOMS`
Durable Object namespace. No database migration or new secret is needed.
After deployment, verify `/healthz`, Host/Join, answer locking, results and Leave
room on the public domain. Revert the release commit and deploy to roll back.
