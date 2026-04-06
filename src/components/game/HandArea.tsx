import { GameState, CardDefinition } from '@/engine/types';
import GameCard from './GameCard';

interface HandAreaProps {
  state: GameState;
  onCardClick: (index: number) => void;
}

export default function HandArea({ state, onCardClick }: HandAreaProps) {
  const isMainPhase = state.phase === 'MAIN' && state.activeSide === 'player';
  const hand = state.player.hand;

  const getInstruction = () => {
    if (state.activeSide !== 'player') return { text: "Tour de l'adversaire...", style: 'muted' as const };
    if (state.phase === 'MAIN' && state.selectedHandIndex !== null) return { text: '→ Cliquez sur un emplacement libre', style: 'gold' as const };
    if (state.phase === 'MAIN') return { text: 'Sélectionnez une carte à jouer', style: 'gold' as const };
    if (state.phase === 'COMBAT' && state.selectedAttackerSlot !== null) return { text: '→ Cliquez sur une cible ennemie', style: 'orange' as const };
    if (state.phase === 'COMBAT') return { text: 'Sélectionnez une unité pour attaquer', style: 'orange' as const };
    return { text: `Phase: ${state.phase}`, style: 'muted' as const };
  };

  const instruction = getInstruction();

  return (
    <div className="flex flex-col items-center shrink-0"
      style={{
        background: 'linear-gradient(180deg, #0a0e18, #080b12)',
        borderTop: '2px solid #1a2235',
      }}>
      {/* Instruction bar */}
      <div className="w-full px-4 py-1 text-center font-cinzel"
        style={{
          fontSize: 11,
          color: instruction.style === 'gold' ? '#c9a84c'
            : instruction.style === 'orange' ? '#fb923c'
            : '#4a5568',
          background: instruction.style === 'gold' ? 'rgba(201,168,76,0.08)'
            : instruction.style === 'orange' ? 'rgba(251,146,60,0.08)'
            : 'transparent',
        }}>
        {instruction.text}
      </div>

      {/* Hand cards */}
      <div className="flex items-end justify-center gap-1.5 py-2 px-4 min-h-[150px]">
        {hand.map((card: CardDefinition, i: number) => {
          const isPlayable = isMainPhase && card.cost <= state.player.shards;
          const deficit = isMainPhase && card.cost > state.player.shards ? card.cost - state.player.shards : 0;
          const isSelected = state.selectedHandIndex === i;

          return (
            <div key={`hand-${i}`} className="animate-deal-card" style={{ animationDelay: `${i * 60}ms` }}>
              <GameCard
                card={card}
                size="hand"
                isPlayable={isPlayable}
                isSelected={isSelected}
                deficit={deficit}
                onClick={() => onCardClick(i)}
              />
            </div>
          );
        })}
        {hand.length === 0 && (
          <span className="font-cinzel" style={{ color: '#2a3045', fontSize: 13 }}>
            Main vide
          </span>
        )}
      </div>
    </div>
  );
}
