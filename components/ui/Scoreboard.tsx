import type { Player } from '@/lib/types'

interface ScoreboardProps {
  players: Player[]
  highlightIds?: string[]
  compact?: boolean
}

const medals = ['🥇', '🥈', '🥉']

export default function Scoreboard({ players, highlightIds = [], compact = false }: ScoreboardProps) {
  const sorted = [...players].sort((a, b) => b.score - a.score)

  return (
    <div className="space-y-2 w-full">
      {sorted.map((p, i) => {
        const isHighlight = highlightIds.includes(p.id)
        return (
          <div
            key={p.id}
            className={`flex items-center gap-3 rounded-2xl transition-all ${compact ? 'px-3 py-2' : 'px-4 py-3'}`}
            style={{
              background: isHighlight ? `${p.color}33` : 'rgba(255,255,255,0.04)',
              border: `1.5px solid ${isHighlight ? p.color + '88' : 'rgba(255,255,255,0.06)'}`,
              transform: isHighlight ? 'scale(1.02)' : 'scale(1)',
            }}
          >
            <span className={compact ? 'text-lg w-6' : 'text-2xl w-8'}>
              {i < 3 ? medals[i] : <span className="text-white/30 text-sm">#{i + 1}</span>}
            </span>
            <span className={compact ? 'text-base' : 'text-xl'}>{p.avatar}</span>
            <span
              className={`font-bold flex-1 truncate ${compact ? 'text-sm' : 'text-base'}`}
              style={{ color: p.color }}
            >
              {p.name}
            </span>
            <span className={`font-black tabular-nums ${compact ? 'text-sm' : 'text-lg'} text-white`}>
              {p.score.toLocaleString()}
            </span>
          </div>
        )
      })}
    </div>
  )
}
