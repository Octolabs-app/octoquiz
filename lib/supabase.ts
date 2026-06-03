import { createClient } from '@supabase/supabase-js'

// AniCal Supabase project — used for OctoQuiz realtime (ephemeral channels only, no DB tables)
const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? 'https://seopeujrimwxnuvcbfxx.supabase.co'
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlb3BldWpyaW13eG51dmNiZnh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NjUzNjEsImV4cCI6MjA5NDM0MTM2MX0.XT8abPOuAygiZEP7HOwbF7Mk8Z7wqC_6cw-0lZK_ClI'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  realtime: { params: { eventsPerSecond: 20 } },
})

/**
 * Generate a random 5-letter room code.
 * 24^5 ≈ 8M combinations. With no central registry (serverless host-as-server),
 * this keeps the odds of two simultaneous rooms colliding on the same channel
 * negligible even at hundreds of concurrent games.
 */
export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ' // no 0/O or I/1 ambiguity
  return Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

/** Supabase Realtime channel name for a room */
export const channelName = (code: string) => `octoquiz:${code.toUpperCase()}`
