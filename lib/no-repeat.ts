/**
 * Cross-session no-repeat picker.
 *
 * Tracks which items have already been served per key (for the host browser's
 * lifetime) so back-to-back games never replay the same questions/words until
 * the whole pool has been used — then it resets and reshuffles. Mirrors the
 * anti-repeat behaviour the trivia game already gets from OpenTDB tokens.
 */
const served = new Map<string, Set<string>>()

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function pickFresh<T>(
  key: string,
  pool: T[],
  count: number,
  idOf: (t: T) => string,
): T[] {
  let seen = served.get(key)
  if (!seen) { seen = new Set<string>(); served.set(key, seen) }

  let available = pool.filter(p => !seen.has(idOf(p)))
  if (available.length < count) {
    // Pool exhausted — reset so we cycle through fresh again.
    seen.clear()
    available = pool.slice()
  }

  const picked = shuffle(available).slice(0, Math.min(count, pool.length))
  for (const p of picked) seen.add(idOf(p))
  return picked
}
