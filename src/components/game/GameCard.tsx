import { BoardUnit, Rarity, RACE_INFO } from '@/engine/types';
import { CARD_ART } from '@/data/cardArt';

interface GameCardProps {
  unit: BoardUnit;
  size?: 'board' | 'hero';
}

const RARITY_BORDER: Record<Rarity, string> = {
  COMMON: '#4a6741',
  RARE: '#3a6a8a',
  EPIC: '#7b3fa0',
  LEGENDARY: '#c9a84c',
};

const RARITY_GLOW: Record<Rarity, string> = {
  COMMON: 'none',
  RARE: '0 0 8px #3a6a8a60',
  EPIC: '0 0 12px #7b3fa080',
  LEGENDARY: '0 0 18px #c9a84c80, 0 0 30px #c9a84c40',
};

const RARITY_STARS: Record<Rarity, number> = {
  COMMON: 1,
  RARE: 2,
  EPIC: 3,
  LEGENDARY: 5,
};

export default function GameCard({ unit, size = 'board' }: GameCardProps) {
  const card = unit.card;
  const borderColor = RARITY_BORDER[card.rarity];
  const stars = RARITY_STARS[card.rarity];
  const hpPercent = Math.max(0, (unit.currentHp / unit.maxHp) * 100);
  const raceInfo = RACE_INFO[card.race];
  const artSrc = CARD_ART[card.id];
  const isDamaged = unit.currentHp < unit.maxHp;

  const isHeroSize = size === 'hero';
  const w = isHeroSize ? 200 : 130;
  const h = isHeroSize ? 280 : 180;

  const animClass =
    unit.animState === 'attacking' ? 'animate-attack-lunge' :
    unit.animState === 'damaged' ? 'animate-take-damage' :
    unit.animState === 'dying' ? 'animate-unit-die' :
    unit.animState === 'spawning' ? 'animate-unit-spawn' : '';

  return (
    <div
      className={`relative flex flex-col overflow-hidden ${animClass}`}
      style={{
        width: w, height: h, borderRadius: 4,
        border: `2px solid ${borderColor}`,
        background: '#0d1117',
        boxShadow: RARITY_GLOW[card.rarity],
      }}
    >
      {/* LV Badge - top left */}
      <div className="absolute top-0.5 left-0.5 z-10 flex flex-col items-center justify-center"
        style={{
          width: 24, height: 24, borderRadius: '50%',
          background: 'linear-gradient(135deg, #2d5a27, #1a3d15)',
          border: '1.5px solid #4a8a3f',
        }}>
        <span style={{ fontSize: 6, color: '#8bc34a', lineHeight: 1, fontFamily: 'Cinzel' }}>LV</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', lineHeight: 1, fontFamily: 'Cinzel' }}>{unit.level}</span>
      </div>

      {/* Card Name */}
      <div className="absolute top-0 left-7 right-0 z-10 truncate px-0.5 py-0.5"
        style={{
          fontSize: 9, fontWeight: 700,
          color: '#e8dfc8', fontFamily: 'Cinzel, serif',
          textShadow: '0 1px 3px #000, 0 0 6px #000',
          background: 'linear-gradient(90deg, #00000080, transparent)',
        }}>
        {card.name}
      </div>

      {/* Stars */}
      <div className="absolute top-3.5 left-7 z-10 flex gap-px">
        {Array.from({ length: stars }).map((_, i) => (
          <span key={i} style={{ color: '#f0c040', fontSize: 8, textShadow: '0 0 4px #f0c040' }}>★</span>
        ))}
      </div>

      {/* Race icon badge - top left under LV */}
      <div className="absolute top-6 left-0.5 z-10 flex items-center justify-center"
        style={{
          width: 16, height: 16, borderRadius: '50%',
          background: `${raceInfo.color}40`,
          border: `1px solid ${raceInfo.color}60`,
          fontSize: 9,
        }}>
        {raceInfo.icon}
      </div>

      {/* Art area */}
      <div className="relative flex-1 overflow-hidden">
        {artSrc ? (
          <img src={artSrc} alt={card.name} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #1a1520, #0d0a15)' }}>
            <span style={{ fontSize: 36, opacity: 0.5 }}>{raceInfo.icon}</span>
          </div>
        )}

        {/* Damage overlay */}
        {isDamaged && hpPercent < 30 && (
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(circle, transparent 30%, #ff000015 100%)',
            pointerEvents: 'none',
          }} />
        )}
      </div>

      {/* Stats bar - ATK & HP */}
      <div className="flex items-center justify-between px-1.5 py-0.5"
        style={{
          background: 'linear-gradient(0deg, #05080f, #0a0e18)',
          borderTop: `1px solid ${borderColor}40`,
        }}>
        <div className="flex items-center gap-0.5">
          <span style={{ fontSize: 10 }}>⚔</span>
          <span style={{ color: '#ff6b35', fontSize: 12, fontWeight: 700, fontFamily: 'Cinzel' }}>{unit.currentAtk}</span>
        </div>
        <div className="flex items-center gap-0.5">
          <span style={{ fontSize: 10 }}>❤</span>
          <span style={{
            color: isDamaged ? '#ff4444' : '#e74c7d',
            fontSize: 12, fontWeight: 700, fontFamily: 'Cinzel',
          }}>{unit.currentHp}</span>
        </div>
      </div>

      {/* HP bar */}
      <div style={{ height: 2, background: '#1a1a2e' }}>
        <div style={{
          height: '100%', width: `${hpPercent}%`,
          background: hpPercent > 60 ? '#4ade80' : hpPercent > 30 ? '#fb923c' : '#ef4444',
          transition: 'width 0.3s',
        }} />
      </div>

      {/* Wait counter - bottom right */}
      {unit.wait > 0 && (
        <div className="absolute bottom-5 right-0.5 z-10 flex items-center justify-center"
          style={{
            width: 20, height: 20, borderRadius: '50%',
            background: 'linear-gradient(135deg, #c9a84c, #8a6d2b)',
            border: '1.5px solid #f0c040',
            color: '#fff', fontSize: 11, fontWeight: 700, fontFamily: 'Cinzel',
            boxShadow: '0 0 6px #c9a84c60',
          }}>
          {unit.wait}
        </div>
      )}

      {/* Shield badge */}
      {unit.currentShield > 0 && (
        <div className="absolute top-0.5 right-0.5 z-10 px-1 py-px rounded text-[8px] font-bold"
          style={{ background: '#2563eb90', color: '#93c5fd', border: '1px solid #3b82f6' }}>
          🛡{unit.currentShield}
        </div>
      )}
      {/* Poison badge */}
      {unit.poisonStacks > 0 && (
        <div className="absolute top-5 right-0.5 z-10 px-1 py-px rounded text-[8px] font-bold"
          style={{ background: '#16a34a90', color: '#86efac', border: '1px solid #22c55e' }}>
          ☠{unit.poisonStacks}
        </div>
      )}
    </div>
  );
}
