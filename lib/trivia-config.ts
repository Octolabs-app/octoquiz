// ─── Shared trivia config — safe to import in both client and server ──────────
// Keeps category/mode definitions out of lib/games/trivia.ts (server-only file)
// so client components can import categories without pulling in Node.js Buffer.

export const TRIVIA_CATEGORIES: { id: string; icon: string; color: string }[] = [
  { id: 'Mixed',               icon: '🎲', color: '#a855f7' },
  { id: 'General Knowledge',   icon: '🧠', color: '#3b82f6' },
  { id: 'Geography & Capitals',icon: '🌍', color: '#22c55e' },
  { id: 'World Landmarks',     icon: '🏛️', color: '#f59e0b' },
  { id: 'Science & Nature',    icon: '🧬', color: '#06b6d4' },
  { id: 'History',             icon: '📜', color: '#ef4444' },
  { id: 'Movies & TV',         icon: '🎬', color: '#f97316' },
  { id: 'Music',               icon: '🎵', color: '#ec4899' },
  { id: 'Sports',              icon: '⚽', color: '#84cc16' },
  { id: 'Pop Culture',         icon: '🎭', color: '#8b5cf6' },
  { id: 'Food & Cuisine',      icon: '🍕', color: '#fb923c' },
  { id: 'Mauritius',           icon: '🇲🇺', color: '#C6A87C' },
]
