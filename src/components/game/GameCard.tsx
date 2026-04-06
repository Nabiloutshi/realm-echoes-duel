import { CardDefinition, BoardUnit, Rarity } from '@/engine/types';
import { CARD_ART } from '@/data/cardArt';

interface GameCardProps {
  card: CardDefinition;
  boardUnit?: BoardUnit;
  size?: 'sm' | 'md' | 'lg' | 'hand' | 'hero';
  isPlayable?: boolean;
  isSelected?: boolean;
  isAttackable?: boolean;
  isTargetable?: boolean;
  isExhausted?: boolean;
  onClick?: () => void;
  deficit?: number;
  animDelay?: number;
}

const SIZE_MAP = {
  sm:   { w: 90,  h: 120, nameSize: 9,  statSize: 11, costSize: 10, costW: 22, starSize: 6, artPct: '55%' },
  md:   { w: 110, h: 148, nameSize: 10, statSize: 12, costSize: 11, costW: 24, starSize: 7, artPct: '55%' },
  lg:   { w: 150, h: 200, nameSize: 12, statSize: 14, costSize: 13, costW: 28, starSize: 8, artPct: '55%' },
  hand: { w: 105, h: 140, nameSize: 10, statSize: 11, costSize: 11, costW: 22, starSize: 7, artPct: '55%' },
  hero: { w: 180, h: 280, nameSize: 14, statSize: 16, costSize: 14, costW: 32, starSize: 10, artPct: '65%' },
};

const RARITY_BORDER: Record<Rarity, string> = {
  COMMON:    '#4a5568',
  RARE:      '#2d8a4e',
  EPIC:      '#7c3aed',
  LEGENDARY: '#c9a84c',
};

const RARITY_STARS: Record<Rarity, number> = {
  COMMON: 1, RARE: 2, EPIC: 3, LEGENDARY: 5,
};

const RARITY_STAR_COLOR: Record<Rarity, string> = {
  COMMON: '#9ca3af',
  RARE: '#34d399',
  EPIC: '#a78bfa',
  LEGENDARY: '#fbbf24',
};

const EFFECT_ICONS: Record<string, { icon: string; color: string }> = {
  SHIELD: { icon: '🛡', color: '#60a5fa' },
  HEAL: { icon: '❤', color: '#4ade80' },
  BLESSING: { icon: '✦', color: '#c9a84c' },
  IMMOVABLE: { icon: '🏔', color: '#94a3b8' },
  REBIRTH: { icon: '♻', color: '#c9a84c' },
  TAUNT: { icon: '🛡', color: '#fb923c' },
  POISON: { icon: '☠', color: '#22c55e' },
  RAGE: { icon: '🔥', color: '#ef4444' },
  DEATH_BURST: { icon: '💥', color: '#ef4444' },
  SUMMON: { icon: '👥', color: '#a78bfa' },
  CORRUPT: { icon: '💀', color: '#7c3aed' },
  STEALTH: { icon: '👁', color: '#64748b' },
  RIPOSTE: { icon: '⚡', color: '#eab308' },
  DOUBLE_STRIKE: { icon: '⚔', color: '#ef4444' },
  LIFESTEAL: { icon: '🩸', color: '#dc2626' },
};

export default function GameCard({
  card, boardUnit, size = 'md', isPlayable, isSelected, isAttackable, isTargetable,
  isExhausted, onClick, deficit, animDelay = 0,
}: GameCardProps) {
  const s = SIZE_MAP[size];
  const borderColor = RARITY_BORDER[card.rarity];
  const stars = RARITY_STARS[card.rarity];
  const starColor = RARITY_STAR_COLOR[card.rarity];
  const isSolari = card.faction === 'SOLARI';

  const animClass = boardUnit?.animState === 'spawning' ? 'animate-unit-spawn'
    : boardUnit?.animState === 'attacking' ? (isSolari ? 'animate-attack-lunge' : 'animate-attack-lunge-down')
    : boardUnit?.animState === 'damaged' ? 'animate-take-damage'
    : boardUnit?.animState === 'dying' ? 'animate-unit-die'
    : '';

  const pulseClass = isPlayable ? 'animate-card-pulse'
    : isAttackable ? 'animate-attack-pulse'
    : isTargetable ? 'animate-target-pulse'
    : '';

  const displayAtk = boardUnit ? boardUnit.currentAtk : card.atk;
  const displayHp = boardUnit ? boardUnit.currentHp : card.hp;
  const maxHp = boardUnit ? boardUnit.maxHp : card.hp;
  const hpPct = (displayHp / maxHp) * 100;
  const hpColor = hpPct > 60 ? '#4ade80' : hpPct > 30 ? '#fb923c' : '#ef4444';

  // Ornate frame: double border with inner glow
  const isLegendary = card.rarity === 'LEGENDARY';

  return (
    <div
      onClick={onClick}
      className={`relative select-none cursor-pointer transition-all duration-200
        ${isSelected ? '-translate-y-4 scale-[1.08]' : 'hover:-translate-y-1 hover:scale-[1.03]'}
        ${animClass} ${pulseClass}
        ${deficit && deficit > 0 ? 'opacity-40 grayscale' : ''}
      `}
      style={{
        width: s.w, height: s.h,
        animationDelay: `${animDelay}ms`,
      }}
    >
      {/* Outer frame */}
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          background: `linear-gradient(180deg, ${borderColor}, ${borderColor}88)`,
          padding: 2,
        }}
      >
        {/* Inner frame */}
        <div
          className="w-full h-full rounded-md overflow-hidden relative"
          style={{
            background: '#0f1520',
          }}
        >
          {/* Legendary fire/glow overlay */}
          {isLegendary && (
            <div className="absolute inset-0 z-30 pointer-events-none rounded-md animate-ambient-glow"
              style={{
                boxShadow: `inset 0 0 20px ${borderColor}60, 0 0 15px ${borderColor}40`,
              }}
            />
          )}

          {/* Cost badge - top left */}
          <div
            className="absolute top-1 left-1 z-20 rounded-full flex items-center justify-center font-cinzel font-bold"
            style={{
              width: s.costW, height: s.costW,
              background: 'linear-gradient(135deg, #1a5c2a, #0d3518)',
              border: '2px solid #2d8a4e',
              color: '#fff',
              fontSize: s.costSize,
              boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            {card.cost}
          </div>

          {/* Card name - top */}
          <div
            className="absolute top-0.5 left-0 right-0 z-10 text-center font-cinzel font-bold truncate px-7"
            style={{
              fontSize: s.nameSize,
              color: '#e8dfc8',
              textShadow: '0 1px 3px rgba(0,0,0,0.8)',
              lineHeight: `${s.costW}px`,
            }}
          >
            {card.name}
          </div>

          {/* Stars row below name */}
          <div
            className="absolute z-10 flex items-center justify-center gap-px"
            style={{
              top: s.costW + 2,
              left: 0, right: 0,
            }}
          >
            {Array.from({ length: stars }).map((_, i) => (
              <span key={i} style={{ fontSize: s.starSize, color: starColor, textShadow: `0 0 4px ${starColor}` }}>★</span>
            ))}
          </div>

          {/* Art area */}
          <div
            className="absolute left-0 right-0 overflow-hidden"
            style={{
              top: s.costW + s.starSize + 6,
              bottom: card.cardType === 'UNIT' ? 32 : 16,
            }}
          >
            {CARD_ART[card.id] ? (
              <img
                src={CARD_ART[card.id]}
                alt={card.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center"
                style={{
                  background: isSolari
                    ? 'linear-gradient(135deg, #8b4513 0%, #c9a84c 100%)'
                    : 'linear-gradient(135deg, #2d1b69 0%, #7c3aed 100%)',
                }}>
                <span style={{ fontSize: size === 'hero' ? 48 : 28, opacity: 0.7 }}>
                  {isSolari ? '☀' : '☽'}
                </span>
              </div>
            )}

            {/* Effect icons overlay on art */}
            {card.effects.length > 0 && size !== 'sm' && (
              <div className="absolute bottom-1 left-0 right-0 flex items-center justify-center gap-0.5 px-1">
                {card.effects.slice(0, 4).map((eff, i) => {
                  const ei = EFFECT_ICONS[eff.code];
                  return (
                    <span
                      key={i}
                      className="inline-flex items-center gap-px rounded px-0.5"
                      style={{
                        background: 'rgba(0,0,0,0.7)',
                        color: ei?.color,
                        fontSize: size === 'hero' ? 12 : 9,
                      }}
                      title={`${eff.code}${eff.value ? `(${eff.value})` : ''}`}
                    >
                      {ei?.icon}{eff.value > 0 && <span className="font-bold">{eff.value}</span>}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Status badges */}
          {boardUnit && boardUnit.currentShield > 0 && (
            <div className="absolute top-1 right-1 z-20 rounded-full px-1.5 py-0.5 font-bold"
              style={{ background: 'rgba(59,130,246,0.85)', color: '#fff', fontSize: 9 }}>
              🛡{boardUnit.currentShield}
            </div>
          )}
          {boardUnit && boardUnit.poisonStacks > 0 && (
            <div className="absolute right-1 z-20 rounded-full px-1.5 py-0.5 font-bold"
              style={{ top: boardUnit.currentShield > 0 ? 22 : 4, background: 'rgba(34,197,94,0.85)', color: '#fff', fontSize: 9 }}>
              ☠{boardUnit.poisonStacks}
            </div>
          )}

          {/* ATK / HP footer for units */}
          {card.cardType === 'UNIT' && (
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-1 py-0.5"
              style={{ background: 'rgba(0,0,0,0.8)' }}>
              <div className="flex items-center gap-0.5">
                <span style={{ color: '#ef4444', fontSize: s.statSize - 2 }}>⚔</span>
                <span className="font-cinzel font-bold" style={{ color: '#fff', fontSize: s.statSize }}>{displayAtk}</span>
              </div>
              {/* HP bar in middle */}
              {boardUnit && (
                <div className="flex-1 mx-1.5 h-1.5 rounded-full overflow-hidden" style={{ background: '#1a1a2e' }}>
                  <div className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(0, hpPct)}%`, background: hpColor }} />
                </div>
              )}
              <div className="flex items-center gap-0.5">
                <span style={{ fontSize: s.statSize - 2 }}>❤</span>
                <span className="font-cinzel font-bold" style={{
                  color: boardUnit && displayHp < maxHp ? hpColor : '#fff',
                  fontSize: s.statSize,
                }}>
                  {displayHp}
                </span>
              </div>
            </div>
          )}

          {/* Exhausted overlay */}
          {isExhausted && (
            <div className="absolute inset-0 rounded-md flex items-center justify-center z-20"
              style={{ background: 'rgba(0,0,0,0.6)' }}>
              <span className="font-cinzel font-bold -rotate-12" style={{ color: '#ef4444', fontSize: 11 }}>
                ÉPUISÉ
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Deficit label */}
      {deficit && deficit > 0 && (
        <div className="absolute -bottom-4 left-0 right-0 text-center font-bold"
          style={{ color: '#ef4444', fontSize: 9 }}>
          -{deficit} éclats
        </div>
      )}
    </div>
  );
}
