import { GameState, BoardUnit } from '@/engine/types';
import GameCard from './GameCard';

interface GameBoardProps {
  state: GameState;
  onSlotClick: (side: 'player' | 'opponent', slotIndex: number) => void;
  onPlayerAvatarClick: (side: 'opponent') => void;
}

export default function GameBoard({ state, onSlotClick, onPlayerAvatarClick }: GameBoardProps) {
  const renderSlot = (unit: BoardUnit | null, index: number, side: 'player' | 'opponent') => {
    const isPlayerSide = side === 'player';
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
        className="relative flex items-center justify-center cursor-pointer"
        style={{
          width: 118, height: 156,
          border: unit
            ? isSelected ? '2px solid #fb923c' : '1px solid rgba(255,255,255,0.08)'
            : isEmptyPlayable ? '1px solid rgba(201,168,76,0.4)' : '1px solid rgba(255,255,255,0.05)',
          borderRadius: 8,
          background: unit ? 'transparent'
            : isEmptyPlayable ? 'rgba(201,168,76,0.05)'
            : 'rgba(255,255,255,0.02)',
          boxShadow: isSelected ? '0 0 12px rgba(251,146,60,0.5)' : 'none',
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
          /* Empty slot - ornate circle pattern like Deck Heroes */
          <div className="flex items-center justify-center" style={{
            width: 50, height: 50, borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(255,255,255,0.02)',
          }}>
            <span style={{ fontSize: 16, opacity: 0.1, color: '#c9a84c' }}>
              {isEmptyPlayable ? '✦' : '◈'}
            </span>
          </div>
        )}

        {/* Floating damage/heal numbers — BIG like Deck Heroes */}
        {floats.map(f => (
          <div
            key={f.id}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 animate-float-up"
          >
            <span
              className="font-cinzel font-black"
              style={{
                fontSize: 36,
                color: f.type === 'damage' ? '#ff2222'
                  : f.type === 'heal' ? '#22ff44'
                  : f.type === 'shield' ? '#4488ff'
                  : '#22cc44',
                textShadow: f.type === 'damage'
                  ? '0 0 10px rgba(255,0,0,0.8), 0 2px 4px rgba(0,0,0,0.9)'
                  : '0 0 10px rgba(0,255,0,0.8), 0 2px 4px rgba(0,0,0,0.9)',
                WebkitTextStroke: '1px rgba(0,0,0,0.5)',
              }}
            >
              {f.type === 'heal' || f.type === 'shield' ? '+' : '-'}{f.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const canAttackPlayer = state.phase === 'COMBAT' && state.activeSide === 'player'
    && state.selectedAttackerSlot !== null
    && !state.opponent.board.some(u => u !== null);

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0a0e18 0%, #0f1520 30%, #0f1520 70%, #0a0e18 100%)',
      }}>

      {/* Metallic frame border overlay */}
      <div className="absolute inset-0 pointer-events-none z-10"
        style={{
          border: '3px solid #1a2235',
          borderRadius: 4,
          boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5)',
        }}
      />

      {/* Background ornate pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 30%, #c9a84c 1px, transparent 1px),
            radial-gradient(circle at 70% 70%, #7c3aed 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Faction glow - Umbra top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-48 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.08), transparent)' }} />
      {/* Faction glow - Solari bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-48 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(232,132,60,0.08), transparent)' }} />

      {/* Opponent row */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div className="flex items-center gap-1.5">
          {state.opponent.board.map((unit, i) => renderSlot(unit, i, 'opponent'))}
        </div>
      </div>

      {/* Center divider — metallic line */}
      <div className="flex items-center justify-center py-1 relative z-10">
        <div className="flex-1 h-px mx-4" style={{ background: 'linear-gradient(90deg, transparent, #c9a84c40, transparent)' }} />
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#c9a84c60' }} />
          <span className="font-cinzel text-[9px] tracking-[0.15em]" style={{ color: '#c9a84c50' }}>
            VS
          </span>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#c9a84c60' }} />
        </div>
        <div className="flex-1 h-px mx-4" style={{ background: 'linear-gradient(90deg, transparent, #c9a84c40, transparent)' }} />
      </div>

      {/* Player row */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div className="flex items-center gap-1.5">
          {state.player.board.map((unit, i) => renderSlot(unit, i, 'player'))}
        </div>
      </div>
    </div>
  );
}
