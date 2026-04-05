import { CardDefinition, BoardUnit, Rarity } from '@/engine/types';
import { CARD_ART } from '@/data/cardArt';

interface GameCardProps {
  card: CardDefinition;
  boardUnit?: BoardUnit;
  size?: 'sm' | 'md' | 'lg' | 'hand';
  isPlayable?: boolean;
  isSelected?: boolean;
  isAttackable?: boolean;
  isTargetable?: boolean;
  isExhausted?: boolean;
  onClick?: () => void;
  deficit?: number; // shard deficit for unaffordable cards
  animDelay?: number;
}

const SIZE_MAP = {
  sm: { w: 82, h: 116, text: 'text-[8px]', name: 'text-[9px]', stat: 'text-[10px]', mana: 'w-5 h-5 text-[9px]' },
  md: { w: 108, h: 152, text: 'text-[9px]', name: 'text-[10px]', stat: 'text-xs', mana: 'w-6 h-6 text-[10px]' },
  lg: { w: 140, h: 196, text: 'text-[10px]', name: 'text-xs', stat: 'text-sm', mana: 'w-7 h-7 text-xs' },
  hand: { w: 118, h: 165, text: 'text-[9px]', name: 'text-[10px]', stat: 'text-xs', mana: 'w-6 h-6 text-[10px]' },
};

const RARITY_COLORS: Record<Rarity, string> = {
  COMMON: 'hsl(215 25% 33%)',
  RARE: 'hsl(200 35% 46%)',
  EPIC: 'hsl(270 60% 55%)',
  LEGENDARY: 'hsl(42 50% 54%)',
};

const TYPE_ICONS: Record<string, string> = { UNIT: '⚔', SPELL: '✦', RELIC: '◈' };

const EFFECT_ICONS: Record<string, { icon: string; color: string }> = {
  SHIELD: { icon: '🛡', color: 'hsl(210 70% 55%)' },
  HEAL: { icon: '❤', color: 'hsl(142 60% 50%)' },
  BLESSING: { icon: '✦', color: 'hsl(42 50% 54%)' },
  IMMOVABLE: { icon: '🏔', color: 'hsl(215 25% 55%)' },
  REBIRTH: { icon: '♻', color: 'hsl(42 50% 54%)' },
  TAUNT: { icon: '🛡', color: 'hsl(30 90% 50%)' },
  POISON: { icon: '☠', color: 'hsl(142 70% 40%)' },
  RAGE: { icon: '🔥', color: 'hsl(0 70% 50%)' },
  DEATH_BURST: { icon: '💥', color: 'hsl(0 60% 50%)' },
  SUMMON: { icon: '👥', color: 'hsl(270 50% 55%)' },
  CORRUPT: { icon: '💀', color: 'hsl(270 60% 45%)' },
  STEALTH: { icon: '👁', color: 'hsl(220 30% 50%)' },
  RIPOSTE: { icon: '⚡', color: 'hsl(45 80% 55%)' },
  DOUBLE_STRIKE: { icon: '⚔', color: 'hsl(0 60% 55%)' },
  LIFESTEAL: { icon: '🩸', color: 'hsl(340 60% 45%)' },
};

export default function GameCard({
  card, boardUnit, size = 'md', isPlayable, isSelected, isAttackable, isTargetable,
  isExhausted, onClick, deficit, animDelay = 0,
}: GameCardProps) {
  const s = SIZE_MAP[size];
  const rarityColor = RARITY_COLORS[card.rarity];
  const isSolari = card.faction === 'SOLARI';
  const factionGradient = isSolari
    ? 'linear-gradient(135deg, hsl(22 78% 57% / 0.3), hsl(42 50% 54% / 0.15))'
    : 'linear-gradient(135deg, hsl(270 60% 55% / 0.3), hsl(270 40% 30% / 0.15))';

  const animClass = boardUnit?.animState === 'spawning' ? 'animate-unit-spawn'
    : boardUnit?.animState === 'attacking' ? (isSolari ? 'animate-attack-lunge' : 'animate-attack-lunge-down')
    : boardUnit?.animState === 'damaged' ? 'animate-take-damage'
    : boardUnit?.animState === 'dying' ? 'animate-unit-die'
    : '';

  const pulseClass = isPlayable ? 'animate-card-pulse'
    : isAttackable ? 'animate-attack-pulse'
    : isTargetable ? 'animate-target-pulse'
    : '';

  const hpPct = boardUnit ? (boardUnit.currentHp / boardUnit.maxHp) * 100 : 100;
  const displayAtk = boardUnit ? boardUnit.currentAtk : card.atk;
  const displayHp = boardUnit ? boardUnit.currentHp : card.hp;

  return (
    <div
      onClick={onClick}
      className={`relative select-none cursor-pointer card-corners transition-all duration-200 
        ${isSelected ? '-translate-y-5 scale-[1.08]' : 'hover:-translate-y-2 hover:scale-[1.04]'}
        ${animClass} ${pulseClass}
        ${deficit && deficit > 0 ? 'opacity-40 grayscale' : ''}
      `}
      style={{
        width: s.w, height: s.h,
        background: `linear-gradient(180deg, hsl(220 30% 14%), hsl(220 30% 10%))`,
        borderRadius: 6,
        border: `1.5px solid ${rarityColor}`,
        boxShadow: card.rarity === 'LEGENDARY' ? `0 0 12px 2px ${rarityColor}` : `0 0 6px 1px ${rarityColor}40`,
        animationDelay: `${animDelay}ms`,
      }}
    >
      {/* Shimmer overlay for rare+ */}
      {card.rarity !== 'COMMON' && (
        <div className="absolute inset-0 rounded-[5px] overflow-hidden pointer-events-none">
          <div
            className="absolute inset-0 animate-shimmer"
            style={{
              background: `linear-gradient(90deg, transparent 30%, ${rarityColor}15 50%, transparent 70%)`,
              backgroundSize: '200% 100%',
            }}
          />
        </div>
      )}

      {/* Mana cost */}
      <div
        className={`absolute -top-1.5 -left-1.5 ${s.mana} rounded-full flex items-center justify-center font-cinzel font-bold z-10`}
        style={{
          background: 'linear-gradient(135deg, hsl(220 70% 55%), hsl(220 70% 40%))',
          color: 'hsl(0 0% 100%)',
          border: '1.5px solid hsl(220 50% 65%)',
          fontSize: size === 'sm' ? 9 : 11,
        }}
      >
        {card.cost}
      </div>

      {/* Type icon */}
      <div className={`absolute top-0.5 left-1/2 -translate-x-1/2 ${s.text} opacity-60`}>
        {TYPE_ICONS[card.cardType]}
      </div>

      {/* Illustration area (top 40%) */}
      <div
        className="mx-1.5 mt-3 rounded-sm flex items-center justify-center overflow-hidden relative"
        style={{
          height: '38%',
          background: factionGradient,
        }}
      >
        {CARD_ART[card.id] ? (
          <img
            src={CARD_ART[card.id]}
            alt={card.name}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <span style={{ fontSize: size === 'sm' ? 24 : size === 'lg' ? 40 : 32, opacity: 0.7 }}>
            {isSolari ? '☀' : '☽'}
          </span>
        )}
      </div>

      {/* Card name */}
      <div
        className={`mx-1.5 mt-1 font-cinzel font-semibold text-center truncate leading-tight ${s.name}`}
        style={{
          color: 'hsl(38 40% 85%)',
          borderBottom: `1px solid ${rarityColor}40`,
          paddingBottom: 2,
        }}
      >
        {card.name}
      </div>

      {/* Effects row */}
      {card.effects.length > 0 && (
        <div className="flex items-center justify-center gap-0.5 mt-0.5 px-1 flex-wrap">
          {card.effects.map((eff, i) => {
            const ei = EFFECT_ICONS[eff.code];
            return (
              <span
                key={i}
                className={`inline-flex items-center gap-px rounded-sm px-0.5 ${s.text}`}
                style={{ background: `${ei?.color}30`, color: ei?.color }}
                title={`${eff.code}${eff.value ? `(${eff.value})` : ''}`}
              >
                {ei?.icon}{eff.value > 0 && <span className="font-bold">{eff.value}</span>}
              </span>
            );
          })}
        </div>
      )}

      {/* Status badges for board units */}
      {boardUnit && boardUnit.currentShield > 0 && (
        <div className="absolute top-1 right-1 rounded-full px-1 text-[8px] font-bold"
          style={{ background: 'hsl(210 70% 55% / 0.8)', color: '#fff' }}>
          🛡{boardUnit.currentShield}
        </div>
      )}
      {boardUnit && boardUnit.poisonStacks > 0 && (
        <div className="absolute top-5 right-1 rounded-full px-1 text-[8px] font-bold"
          style={{ background: 'hsl(142 70% 40% / 0.8)', color: '#fff' }}>
          ☠{boardUnit.poisonStacks}
        </div>
      )}

      {/* HP bar for board units */}
      {boardUnit && card.cardType === 'UNIT' && (
        <div className="absolute bottom-8 left-1.5 right-1.5 h-1 rounded-full overflow-hidden" style={{ background: 'hsl(220 20% 15%)' }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${Math.max(0, hpPct)}%`,
              background: hpPct > 60 ? 'hsl(142 60% 45%)' : hpPct > 30 ? 'hsl(32 90% 55%)' : 'hsl(0 70% 50%)',
            }}
          />
        </div>
      )}

      {/* ATK / HP footer */}
      {card.cardType === 'UNIT' && (
        <div className={`absolute bottom-1 left-1.5 right-1.5 flex justify-between items-center ${s.stat} font-cinzel font-bold`}>
          <span style={{ color: 'hsl(0 70% 55%)' }}>⚔{displayAtk}</span>
          <span style={{ color: 'hsl(142 60% 50%)' }}>❤{displayHp}</span>
        </div>
      )}

      {/* Exhausted overlay */}
      {isExhausted && (
        <div className="absolute inset-0 rounded-[5px] flex items-center justify-center"
          style={{ background: 'hsl(220 30% 10% / 0.7)' }}>
          <span className="font-cinzel font-bold text-[10px] -rotate-12" style={{ color: 'hsl(0 60% 55%)' }}>
            ÉPUISÉ
          </span>
        </div>
      )}

      {/* Deficit label */}
      {deficit && deficit > 0 && (
        <div className={`absolute -bottom-4 left-0 right-0 text-center ${s.text} font-bold`}
          style={{ color: 'hsl(0 70% 55%)' }}>
          -{deficit} éclats
        </div>
      )}
    </div>
  );
}
