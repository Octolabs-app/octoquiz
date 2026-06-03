/**
 * OctoQuiz Supabase Realtime capacity / concurrency test.
 *
 * Simulates R independent game rooms, each with 1 host + P players, all on
 * their own `octoquiz:CODE` channel — exactly like production. Measures:
 *   - subscribe success rate (does every client connect?)
 *   - room isolation (does a room ever receive another room's messages?)
 *   - host→player broadcast latency + delivery rate
 *   - errors / throttling as load climbs
 *
 * Usage:  node scripts/capacity-test.mjs <rooms> <playersPerRoom> <durationSec> <stateHz>
 * Example: node scripts/capacity-test.mjs 12 5 12 1
 *
 * NOTE: runs against the configured Realtime project. Keep total connections
 * (rooms*(players+1)) comfortably under the free-tier 200 cap to avoid
 * disrupting other apps sharing the project.
 */
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? 'https://seopeujrimwxnuvcbfxx.supabase.co'
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlb3BldWpyaW13eG51dmNiZnh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NjUzNjEsImV4cCI6MjA5NDM0MTM2MX0.XT8abPOuAygiZEP7HOwbF7Mk8Z7wqC_6cw-0lZK_ClI'

const ROOMS    = parseInt(process.argv[2] ?? '10', 10)
const PLAYERS  = parseInt(process.argv[3] ?? '5', 10)
const DUR_SEC  = parseInt(process.argv[4] ?? '12', 10)
const STATE_HZ = parseFloat(process.argv[5] ?? '1')   // host state broadcasts/sec

const TOTAL_CONNS = ROOMS * (PLAYERS + 1)
const channelName = (code) => `octoquiz:${code}`
const code = (i) => `T${String(i).padStart(3, '0')}`   // deterministic, unique per room

const m = {
  subOk: 0, subFail: 0, subTimeout: 0,
  sent: 0, recv: 0, crossRoom: 0,
  lat: [], errors: [],
}
const clients = []

function mkClient() {
  const c = createClient(SUPABASE_URL, SUPABASE_ANON, {
    realtime: { params: { eventsPerSecond: 40 } },
    auth: { persistSession: false, autoRefreshToken: false },
  })
  clients.push(c)
  return c
}

function subscribe(ch, label) {
  return new Promise((resolve) => {
    let done = false
    const t = setTimeout(() => { if (!done) { done = true; m.subTimeout++; resolve(false) } }, 15000)
    ch.subscribe((status, err) => {
      if (done) return
      if (status === 'SUBSCRIBED') { done = true; clearTimeout(t); m.subOk++; resolve(true) }
      else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        done = true; clearTimeout(t); m.subFail++
        if (err) m.errors.push(`${label}: ${err.message ?? err}`)
        resolve(false)
      }
    })
  })
}

async function buildRoom(i) {
  const roomCode = code(i)
  const ch = channelName(roomCode)

  // host
  const host = mkClient().channel(ch, { config: { broadcast: { self: false, ack: false }, presence: { key: `host-${roomCode}` } } })
  // players
  const players = []
  for (let p = 0; p < PLAYERS; p++) {
    const pc = mkClient().channel(ch, { config: { broadcast: { self: false, ack: false }, presence: { key: `p-${roomCode}-${p}` } } })
    pc.on('broadcast', { event: 'game_state' }, ({ payload }) => {
      if (payload.room !== roomCode) { m.crossRoom++; return }   // isolation check
      m.recv++
      if (typeof payload.t === 'number') m.lat.push(Date.now() - payload.t)
    })
    players.push(pc)
  }

  await Promise.all([subscribe(host, `host ${roomCode}`), ...players.map((pc, p) => subscribe(pc, `p${p} ${roomCode}`))])
  host.track({ role: 'host', code: roomCode }).catch(() => {})
  return { roomCode, host, players }
}

async function main() {
  console.log(`\n=== OctoQuiz capacity test ===`)
  console.log(`rooms=${ROOMS} players/room=${PLAYERS} → ${TOTAL_CONNS} websocket connections; ${DUR_SEC}s @ ${STATE_HZ} state-bcast/s/room\n`)

  const t0 = Date.now()
  const rooms = []
  for (let i = 0; i < ROOMS; i++) rooms.push(await buildRoom(i))
  const subMs = Date.now() - t0
  console.log(`Subscribed: ok=${m.subOk} fail=${m.subFail} timeout=${m.subTimeout} (in ${subMs}ms)`)

  // Host broadcast loop
  const interval = Math.max(50, Math.round(1000 / STATE_HZ))
  const timer = setInterval(() => {
    for (const r of rooms) {
      r.host.send({ type: 'broadcast', event: 'game_state', payload: { room: r.roomCode, t: Date.now() } })
        .then(() => { m.sent++ })
        .catch((e) => { m.errors.push(`send ${r.roomCode}: ${e.message ?? e}`) })
    }
  }, interval)

  await new Promise((r) => setTimeout(r, DUR_SEC * 1000))
  clearInterval(timer)
  await new Promise((r) => setTimeout(r, 1500)) // drain in-flight

  // expected receipts: each broadcast from a host reaches PLAYERS players
  const expected = m.sent * PLAYERS
  const lat = m.lat.slice().sort((a, b) => a - b)
  const pct = (p) => lat.length ? lat[Math.min(lat.length - 1, Math.floor(lat.length * p))] : 0

  console.log(`\n--- RESULTS ---`)
  console.log(`connections attempted : ${TOTAL_CONNS}`)
  console.log(`subscribe ok / fail   : ${m.subOk} / ${m.subFail + m.subTimeout}`)
  console.log(`broadcasts sent       : ${m.sent}`)
  console.log(`messages received     : ${m.recv} / ${expected} expected  (${expected ? ((m.recv/expected)*100).toFixed(1) : 0}% delivery)`)
  console.log(`cross-room leakage    : ${m.crossRoom}  (must be 0)`)
  console.log(`latency host→player   : p50=${pct(0.5)}ms  p95=${pct(0.95)}ms  max=${lat[lat.length-1] ?? 0}ms`)
  console.log(`peak msg/s (approx)   : ${(m.sent / DUR_SEC).toFixed(0)} sent/s, ${(m.recv / DUR_SEC).toFixed(0)} recv/s`)
  if (m.errors.length) console.log(`errors (${m.errors.length}): ${[...new Set(m.errors)].slice(0, 6).join(' | ')}`)

  for (const c of clients) { try { await c.removeAllChannels() } catch {} }
  await new Promise((r) => setTimeout(r, 500))
  console.log(`\nDone. Cleaned up ${clients.length} clients.`)
  process.exit(0)
}

main().catch((e) => { console.error('FATAL', e); process.exit(1) })
