import { PlayerState } from '@/engine/types';

interface PlayerInfoProps {
  player: PlayerState;
  isActive: boolean;
  compact?: boolean;
}

export default function PlayerInfo({ player, isActive, compact }: PlayerInfoProps) {
  const isSolari = player.faction === 'SOLARI';
  const factionColor = isSolari ? 'hsl(22 78% 57%)' : 'hsl(270 60% 55%)';
  const hpPct = (player.hp / player.maxHp) * 100;
  const hpColor = hpPct > 60 ? 'hsl(142 60% 45%)' : hpPct > 30 ? 'hsl(32 90% 55%)' : 'hsl(0 70% 50%)';

  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 ${compact ? 'gap-2 px-2 py-1' : ''}`}
      style={{
        background: isActive ? `${factionColor}15` : 'hsl(220 30% 12%)',
        border: `1px solid ${isActive ? factionColor : 'hsl(220 20% 22%)'}`,
        boxShadow: isActive ? `0 0 12px ${factionColor}30` : 'none',
      }}
    >
      {/* Avatar */}
      <div
        className="flex items-center justify-center rounded-full shrink-0"
        style={{
          width: compact ? 32 : 44, height: compact ? 32 : 44,
          background: `${factionColor}20`,
          border: `2px solid ${factionColor}`,
          fontSize: compact ? 16 : 22,
        }}
      >
        {isSolari ? '☀' : '☽'}
      </div>

      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-cinzel font-semibold text-sm truncate" style={{ color: 'hsl(38 40% 85%)' }}>
            {player.name}
          </span>
          {isActive && (
            <span className="px-1.5 py-0.5 rounded text-[8px] font-cinzel font-bold"
              style={{ background: factionColor, color: 'hsl(220 40% 4%)' }}>
              TOUR
            </span>
          )}
        </div>

        {/* HP bar */}
        <div className="flex items-center gap-2 mt-0.5">
          <div className="w-20 h-2 rounded-full overflow-hidden" style={{ background: 'hsl(220 20% 15%)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max(0, hpPct)}%`, background: hpColor }}
            />
          </div>
          <span className="text-[10px] font-bold" style={{ color: hpColor }}>
            {player.hp}/{player.maxHp}
          </span>
        </div>

        {/* Shards */}
        <div className="flex items-center gap-1 mt-0.5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full transition-all" style={{
              background: i < player.shards ? 'hsl(220 70% 55%)' : 'hsl(220 20% 22%)',
              boxShadow: i < player.shards ? '0 0 3px hsl(220 70% 55%)' : 'none',
            }} />
          ))}
          <span className="text-[9px] ml-1" style={{ color: 'hsl(213 15% 61%)' }}>
            🃏{player.hand.length} 📚{player.deck.length}
          </span>
        </div>
      </div>
    </div>
  );
}
