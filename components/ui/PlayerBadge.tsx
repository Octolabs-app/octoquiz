import type { Player } from '@/lib/types'

interface PlayerBadgeProps {
  player: Player
  size?: 'sm' | 'md' | 'lg'
  showScore?: boolean
  highlight?: boolean
  dim?: boolean
}

export default function PlayerBadge({ player, size = 'md', showScore, highlight, dim }: PlayerBadgeProps) {
  const sizes = {
    sm: { wrap: 'px-3 py-1.5 gap-1.5', avatar: 'text-base', name: 'text-sm', score: 'text-xs' },
    md: { wrap: 'px-4 py-2.5 gap-2',   avatar: 'text-xl',   name: 'text-base', score: 'text-sm' },
    lg: { wrap: 'px-5 py-3 gap-2.5',   avatar: 'text-2xl',  name: 'text-xl',   score: 'text-base' },
  }
  const s = sizes[size]

  return (
    <div
      className={`flex items-center ${s.wrap} rounded-2xl transition-all ${dim ? 'opacity-30' : 'opacity-100'}`}
      style={{
        background: `${player.color}22`,
        border: `2px solid ${highlight ? player.color : player.color + '44'}`,
        boxShadow: highlight ? `0 0 20px ${player.color}55` : 'none',
      }}
    >
      <span className={s.avatar}>{player.avatar}</span>
      <span className={`font-bold ${s.name} truncate max-w-[120px]`} style={{ color: player.color }}>
        {player.name}
      </span>
      {showScore && (
        <span className={`ml-auto font-black ${s.score} text-white/70`}>
          {player.score.toLocaleString()}
        </span>
      )}
    </div>
  )
}
