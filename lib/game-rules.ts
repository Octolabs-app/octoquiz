// Shared timing and scoring for the four question games. Host receipt time decides.
export function answerTime(
  startedAt: number | null,
  limitSeconds: number,
  now = Date.now(),
): number | null {
  if (startedAt === null || !Number.isFinite(startedAt) || !Number.isFinite(now)) return null
  const elapsed = now - startedAt
  return elapsed >= 0 && elapsed < limitSeconds * 1000 ? elapsed : null
}
export function timedPoints(
  timeMs: number,
  limitSeconds: number,
  min: number,
  max: number,
): number {
  if (!Number.isFinite(timeMs) || timeMs < 0 || timeMs >= limitSeconds * 1000) return 0
  return Math.round(min + (1 - timeMs / (limitSeconds * 1000)) * (max - min))
}
export function caughtByVotes(
  votes: Record<string, string>,
  imposterId: string,
  playerIds: string[],
): boolean {
  const roster = new Set(playerIds),
    counts = new Map<string, number>()
  for (const [voter, target] of Object.entries(votes))
    if (roster.has(voter) && roster.has(target) && voter !== target)
      counts.set(target, (counts.get(target) ?? 0) + 1)
  const most = Math.max(0, ...counts.values()),
    leaders = [...counts].filter(([, n]) => n === most)
  return leaders.length === 1 && leaders[0][0] === imposterId
}
