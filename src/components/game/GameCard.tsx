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

  const isHeroSize = size === 'hero';
  const w = isHeroSize ? 200 : 140;
  const h = isHeroSize ? 280 : 195;

  const animClass =
    unit.animState === 'attacking' ? 'animate-attack-lunge' :
    unit.animState === 'damaged' ? 'animate-take-damage' :
    unit.animState === 'dying' ? 'animate-unit-die' :
    unit.animState === 'spawning' ? 'animate-unit-spawn' : '';

  return (
    <div
      className={`relative flex flex-col overflow-hidden ${animClass}`}
      style={{
        width: w, height: h, borderRadius: 6,
        border: `2px solid ${borderColor}`,
        background: '#0d1117',
        boxShadow: card.rarity === 'LEGENDARY'
          ? `0 0 15px ${borderColor}80, inset 0 0 10px ${borderColor}30`
          : `0 0 8px ${borderColor}40`,
      }}
    >
      {/* LV Badge */}
      <div className="absolute top-1 left-1 z-10 flex flex-col items-center justify-center"
        style={{
          width: 28, height: 28, borderRadius: '50%',
          background: '#2d5a27', border: '2px solid #4a8a3f',
          fontFamily: 'Cinzel, serif',
        }}>
        <span style={{ fontSize: 7, color: '#8bc34a', lineHeight: 1 }}>LV</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{unit.level}</span>
      </div>

      {/* Card Name */}
      <div className="absolute top-0.5 left-8 right-1 z-10 truncate text-[10px] font-bold"
        style={{ color: '#e8dfc8', fontFamily: 'Cinzel, serif', textShadow: '0 1px 3px #000' }}>
        {card.name}
      </div>

      {/* Stars */}
      <div className="absolute top-4 left-8 z-10 flex gap-0.5">
        {Array.from({ length: stars }).map((_, i) => (
          <span key={i} style={{ color: '#f0c040', fontSize: 10, textShadow: '0 0 4px #f0c040' }}>★</span>
        ))}
      </div>

      {/* Art */}
      <div className="relative flex-1 overflow-hidden">
        {artSrc ? (
          <img src={artSrc} alt={card.name} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #1a1520, #0d0a15)' }}>
            <span style={{ fontSize: 40, opacity: 0.5 }}>{raceInfo.icon}</span>
          </div>
        )}

        {/* Wait counter */}
        {unit.wait > 0 && (
          <div className="absolute bottom-1 right-1 z-10 flex items-center justify-center"
            style={{
              width: 22, height: 22, borderRadius: '50%',
              background: '#1a1a2e', border: '2px solid #4a5568',
              color: '#8ab4f8', fontSize: 12, fontWeight: 700, fontFamily: 'Cinzel',
            }}>
            {unit.wait}
          </div>
        )}
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-between px-2 py-1"
        style={{ background: '#0a0e18', borderTop: `1px solid ${borderColor}50` }}>
        <div className="flex items-center gap-0.5">
          <span style={{ color: '#ff6b35', fontSize: 11 }}>⚔</span>
          <span style={{ color: '#ff6b35', fontSize: 13, fontWeight: 700, fontFamily: 'Cinzel' }}>{unit.currentAtk}</span>
        </div>
        <div className="flex items-center gap-0.5">
          <span style={{ color: unit.currentHp < unit.maxHp * 0.3 ? '#ff4444' : '#e74c7d', fontSize: 11 }}>❤</span>
          <span style={{
            color: unit.currentHp < unit.maxHp * 0.3 ? '#ff4444' : '#e74c7d',
            fontSize: 13, fontWeight: 700, fontFamily: 'Cinzel',
          }}>{unit.currentHp}</span>
        </div>
      </div>

      {/* HP bar */}
      <div style={{ height: 3, background: '#1a1a2e' }}>
        <div style={{
          height: '100%', width: `${hpPercent}%`,
          background: hpPercent > 60 ? '#4ade80' : hpPercent > 30 ? '#fb923c' : '#ef4444',
          transition: 'width 0.3s',
        }} />
      </div>

      {/* Shield badge */}
      {unit.currentShield > 0 && (
        <div className="absolute top-1 right-1 z-10 px-1 py-0.5 rounded text-[9px] font-bold"
          style={{ background: '#2563eb90', color: '#93c5fd', border: '1px solid #3b82f6' }}>
          🛡{unit.currentShield}
        </div>
      )}
      {/* Poison badge */}
      {unit.poisonStacks > 0 && (
        <div className="absolute top-7 right-1 z-10 px-1 py-0.5 rounded text-[9px] font-bold"
          style={{ background: '#16a34a90', color: '#86efac', border: '1px solid #22c55e' }}>
          ☠{unit.poisonStacks}
        </div>
      )}
    </div>
  );
}
