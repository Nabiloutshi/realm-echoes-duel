import { PlayerState } from '@/engine/types';
import { CARD_ART } from '@/data/cardArt';

interface PlayerInfoProps {
  player: PlayerState;
  isActive: boolean;
  compact?: boolean;
  isHero?: boolean;
  canAttack?: boolean;
  onAttackClick?: () => void;
}

export default function PlayerInfo({ player, isActive, isHero, canAttack, onAttackClick }: PlayerInfoProps) {
  const isSolari = player.faction === 'SOLARI';
  const factionColor = isSolari ? '#E8843C' : '#8B45D4';
  const hpPct = (player.hp / player.maxHp) * 100;
  const hpColor = hpPct > 60 ? '#4ade80' : hpPct > 30 ? '#fb923c' : '#ef4444';

  // Use legendary card art as hero portrait
  const heroArt = isSolari ? CARD_ART['sol-11'] : CARD_ART['umb-12'];

  if (isHero) {
    return (
      <div
        className={`flex flex-col items-center gap-2 transition-all duration-300 ${canAttack ? 'cursor-pointer' : ''}`}
        onClick={canAttack ? onAttackClick : undefined}
      >
        {/* Hero card portrait */}
        <div className="relative" style={{
          width: 140, height: 200,
          border: `3px solid ${isActive ? factionColor : '#2a3045'}`,
          borderRadius: 10,
          overflow: 'hidden',
          boxShadow: isActive
            ? `0 0 20px ${factionColor}60, inset 0 0 15px rgba(0,0,0,0.5)`
            : canAttack
            ? `0 0 15px rgba(239,68,68,0.5)`
            : '0 0 10px rgba(0,0,0,0.5)',
        }}>
          {heroArt ? (
            <img src={heroArt} alt={player.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${factionColor}40, #0f1520)` }}>
              <span style={{ fontSize: 48 }}>{isSolari ? '☀' : '☽'}</span>
            </div>
          )}

          {/* Overlay gradient at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3"
            style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.9))' }} />

          {/* Name overlay */}
          <div className="absolute top-1 left-0 right-0 text-center">
            <span className="font-cinzel font-bold text-xs px-2 py-0.5 rounded"
              style={{
                color: '#e8dfc8',
                background: 'rgba(0,0,0,0.6)',
                textShadow: '0 1px 3px rgba(0,0,0,0.8)',
              }}>
              {player.name}
            </span>
          </div>

          {/* Active badge */}
          {isActive && (
            <div className="absolute top-1 right-1">
              <span className="px-1.5 py-0.5 rounded font-cinzel font-bold"
                style={{ fontSize: 8, background: factionColor, color: '#000' }}>
                TOUR
              </span>
            </div>
          )}

          {/* HP display at bottom */}
          <div className="absolute bottom-1 left-2 right-2 flex flex-col items-center gap-1">
            {/* HP bar */}
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.max(0, hpPct)}%`, background: hpColor }} />
            </div>
            <div className="flex items-center gap-1">
              <span style={{ color: '#ef4444', fontSize: 12 }}>❤</span>
              <span className="font-cinzel font-bold" style={{ color: hpColor, fontSize: 13 }}>
                {player.hp}/{player.maxHp}
              </span>
            </div>
          </div>

          {/* Attack target pulsing overlay */}
          {canAttack && (
            <div className="absolute inset-0 animate-target-pulse rounded-lg" />
          )}
        </div>

        {/* Shards display below hero */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="rounded-full transition-all" style={{
              width: 7, height: 7,
              background: i < player.shards ? '#3b82f6' : '#1e293b',
              boxShadow: i < player.shards ? '0 0 4px #3b82f6' : 'none',
            }} />
          ))}
        </div>

        {/* Hand / Deck count */}
        <div className="flex items-center gap-3">
          <span className="font-cinzel" style={{ fontSize: 10, color: '#8a9bb0' }}>
            🃏 {player.hand.length}
          </span>
          <span className="font-cinzel" style={{ fontSize: 10, color: '#8a9bb0' }}>
            📚 {player.deck.length}
          </span>
        </div>
      </div>
    );
  }

  // Compact mode for header (fallback)
  return (
    <div className="flex items-center gap-2 px-2 py-1 rounded-lg"
      style={{
        background: isActive ? `${factionColor}15` : '#1a2235',
        border: `1px solid ${isActive ? factionColor : '#2a3045'}`,
      }}>
      <div className="flex items-center justify-center rounded-full shrink-0"
        style={{ width: 28, height: 28, background: `${factionColor}20`, border: `2px solid ${factionColor}`, fontSize: 14 }}>
        {isSolari ? '☀' : '☽'}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="font-cinzel font-semibold text-xs truncate" style={{ color: '#e8dfc8' }}>{player.name}</span>
        <span className="font-bold" style={{ color: hpColor, fontSize: 10 }}>❤ {player.hp}/{player.maxHp}</span>
      </div>
    </div>
  );
}
