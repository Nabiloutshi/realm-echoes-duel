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
  const instrBg = instruction.style === 'gold'
    ? 'linear-gradient(135deg, hsl(42 50% 54% / 0.2), hsl(42 50% 54% / 0.1))'
    : instruction.style === 'orange'
    ? 'linear-gradient(135deg, hsl(22 78% 57% / 0.2), hsl(22 78% 57% / 0.1))'
    : 'hsl(220 30% 12%)';
  const instrColor = instruction.style === 'muted' ? 'hsl(213 15% 55%)' : 'hsl(38 40% 85%)';

  return (
    <div className="flex flex-col items-center" style={{ background: 'hsl(220 30% 6%)', borderTop: '1px solid hsl(220 20% 15%)' }}>
      {/* Instruction bar */}
      <div className="w-full px-4 py-1.5 text-center text-xs font-cinzel"
        style={{ background: instrBg, color: instrColor }}>
        {instruction.text}
      </div>

      {/* Hand cards */}
      <div className="flex items-end justify-center gap-2 py-3 px-4 min-h-[170px]">
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
          <span className="text-sm font-cinzel" style={{ color: 'hsl(213 15% 35%)' }}>
            Main vide
          </span>
        )}
      </div>
    </div>
  );
}
