import { GameState, BoardUnit, FloatingNumber } from '@/engine/types';
import GameCard from './GameCard';

interface GameBoardProps {
  state: GameState;
  onSlotClick: (side: 'player' | 'opponent', slotIndex: number) => void;
  onPlayerAvatarClick: (side: 'opponent') => void;
}

export default function GameBoard({ state, onSlotClick, onPlayerAvatarClick }: GameBoardProps) {
  const renderSlot = (unit: BoardUnit | null, index: number, side: 'player' | 'opponent') => {
    const isPlayerSide = side === 'player';
    const factionColor = isPlayerSide ? 'hsl(22 78% 57%)' : 'hsl(270 60% 55%)';

    // Determine interactivity
    const isCombatPhase = state.phase === 'COMBAT' && state.activeSide === 'player';
    const isMainPhase = state.phase === 'MAIN' && state.activeSide === 'player';

    let isAttackable = false;
    let isTargetable = false;
    let isExhausted = false;

    if (unit && isPlayerSide && isCombatPhase) {
      isAttackable = unit.attacksThisTurn < unit.maxAttacks && unit.currentAtk > 0 && unit.card.cardType === 'UNIT';
      isExhausted = unit.attacksThisTurn >= unit.maxAttacks;
    }
    if (unit && !isPlayerSide && isCombatPhase && state.selectedAttackerSlot !== null) {
      isTargetable = true;
    }

    const isSelected = isPlayerSide && state.selectedAttackerSlot === index;
    const isEmptyPlayable = !unit && isPlayerSide && isMainPhase && state.selectedHandIndex !== null;

    // Floating numbers
    const floats = state.floatingNumbers.filter(f => f.slotIndex === index && f.side === side);

    return (
      <div
        key={`${side}-${index}`}
        onClick={() => onSlotClick(side, index)}
        className="relative flex items-center justify-center transition-all duration-200 cursor-pointer"
        style={{
          width: 122, height: 170,
          border: unit
            ? isSelected ? '2px solid hsl(30 90% 50%)' : `1px solid ${factionColor}30`
            : `1px dashed ${factionColor}20`,
          borderRadius: 8,
          background: unit ? 'transparent' : `${factionColor}05`,
        }}
      >
        {unit ? (
          <GameCard
            card={unit.card}
            boardUnit={unit}
            size="md"
            isAttackable={isAttackable}
            isTargetable={isTargetable}
            isExhausted={isExhausted}
            isSelected={isSelected}
          />
        ) : (
          <span className="text-[10px] font-cinzel" style={{ color: `${factionColor}30` }}>
            {isEmptyPlayable ? '✦' : index + 1}
          </span>
        )}

        {/* Floating damage numbers */}
        {floats.map(f => (
          <div
            key={f.id}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 font-cinzel font-bold animate-float-up pointer-events-none z-20"
            style={{
              color: f.type === 'damage' ? 'hsl(0 70% 55%)'
                : f.type === 'heal' ? 'hsl(142 60% 50%)'
                : f.type === 'shield' ? 'hsl(210 70% 55%)'
                : 'hsl(142 70% 40%)',
              fontSize: 18,
              textShadow: '0 0 8px currentColor',
            }}
          >
            {f.type === 'heal' || f.type === 'shield' ? '+' : '-'}{f.value}
          </div>
        ))}
      </div>
    );
  };

  const canAttackPlayer = state.phase === 'COMBAT' && state.activeSide === 'player'
    && state.selectedAttackerSlot !== null
    && !state.opponent.board.some(u => u !== null);

  return (
    <div className="flex-1 flex flex-col relative board-grid">
      {/* Opponent territory */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <span className="text-[9px] font-cinzel tracking-widest mb-2" style={{ color: 'hsl(270 60% 55% / 0.5)' }}>
          TERRITOIRE UMBRA
        </span>

        {/* Opponent HP badge */}
        <div
          className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center rounded-full cursor-pointer"
          onClick={() => canAttackPlayer && onPlayerAvatarClick('opponent')}
          style={{
            width: 56, height: 56,
            background: 'hsl(270 60% 55% / 0.15)',
            border: canAttackPlayer ? '2px solid hsl(0 70% 55%)' : '2px solid hsl(270 60% 55% / 0.3)',
            boxShadow: canAttackPlayer ? '0 0 12px hsl(0 70% 55% / 0.5)' : 'none',
          }}
        >
          <span style={{ fontSize: 18 }}>☽</span>
          <span className="text-[10px] font-bold" style={{
            color: state.opponent.hp > 18 ? 'hsl(142 60% 50%)' : state.opponent.hp > 9 ? 'hsl(32 90% 55%)' : 'hsl(0 70% 55%)'
          }}>
            {state.opponent.hp}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {state.opponent.board.map((unit, i) => renderSlot(unit, i, 'opponent'))}
        </div>
      </div>

      {/* Center divider */}
      <div className="flex items-center justify-center py-1.5">
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, hsl(42 50% 54% / 0.4), transparent)' }} />
        <span className="px-3 font-cinzel text-[10px] tracking-wider" style={{ color: 'hsl(42 50% 54% / 0.6)' }}>
          ✦ CHAMP DE BATAILLE ✦
        </span>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, hsl(42 50% 54% / 0.4), transparent)' }} />
      </div>

      {/* Player territory */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div className="flex items-center gap-2">
          {state.player.board.map((unit, i) => renderSlot(unit, i, 'player'))}
        </div>

        {/* Player HP badge */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center rounded-full"
          style={{
            width: 56, height: 56,
            background: 'hsl(22 78% 57% / 0.15)',
            border: '2px solid hsl(22 78% 57% / 0.3)',
          }}
        >
          <span style={{ fontSize: 18 }}>☀</span>
          <span className="text-[10px] font-bold" style={{
            color: state.player.hp > 18 ? 'hsl(142 60% 50%)' : state.player.hp > 9 ? 'hsl(32 90% 55%)' : 'hsl(0 70% 55%)'
          }}>
            {state.player.hp}
          </span>
        </div>

        <span className="text-[9px] font-cinzel tracking-widest mt-2" style={{ color: 'hsl(22 78% 57% / 0.5)' }}>
          TERRITOIRE SOLARI
        </span>
      </div>

      {/* Background faction glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, hsl(270 60% 55%), transparent)' }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, hsl(22 78% 57%), transparent)' }} />
      </div>
    </div>
  );
}
