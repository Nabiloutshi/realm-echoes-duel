import { GameState, FloatingNumber } from '@/engine/types';
import GameCard from './GameCard';

interface GameBoardProps {
  state: GameState;
}

export default function GameBoard({ state }: GameBoardProps) {
  return (
    <div className="flex-1 flex flex-col justify-center items-center relative overflow-hidden board-grid"
      style={{ background: 'linear-gradient(180deg, #080b12 0%, #0d1220 50%, #080b12 100%)' }}>

      {/* Opponent territory label */}
      <div className="font-cinzel text-[10px] tracking-[3px] mb-2"
        style={{ color: 'hsl(var(--umbra) / 0.5)' }}>
        TERRITOIRE ENNEMI
      </div>

      {/* Opponent board */}
      <div className="flex gap-2 mb-4">
        {state.opponent.board.map((unit, i) => (
          <div key={`opp-${i}`} className="relative">
            {unit ? <GameCard unit={unit} /> : <EmptySlot faction="UMBRA" />}
            {state.floatingNumbers
              .filter(f => f.side === 'opponent' && f.slotIndex === i)
              .map(f => <FloatingNum key={f.id} data={f} />)}
          </div>
        ))}
      </div>

      {/* Center divider */}
      <div className="flex items-center gap-3 my-2">
        <div style={{ width: 80, height: 1, background: 'linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)' }} />
        <span className="font-cinzel text-[10px] tracking-wider" style={{ color: 'hsl(var(--primary) / 0.6)' }}>
          ✦ CHAMP DE BATAILLE ✦
        </span>
        <div style={{ width: 80, height: 1, background: 'linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)' }} />
      </div>

      {/* Player board */}
      <div className="flex gap-2 mt-4">
        {state.player.board.map((unit, i) => (
          <div key={`plr-${i}`} className="relative">
            {unit ? <GameCard unit={unit} /> : <EmptySlot faction="SOLARI" />}
            {state.floatingNumbers
              .filter(f => f.side === 'player' && f.slotIndex === i)
              .map(f => <FloatingNum key={f.id} data={f} />)}
          </div>
        ))}
      </div>

      {/* Player territory label */}
      <div className="font-cinzel text-[10px] tracking-[3px] mt-2"
        style={{ color: 'hsl(var(--solari) / 0.5)' }}>
        VOTRE TERRITOIRE
      </div>
    </div>
  );
}

function EmptySlot({ faction }: { faction: 'SOLARI' | 'UMBRA' }) {
  const color = faction === 'SOLARI' ? 'hsl(var(--solari))' : 'hsl(var(--umbra))';
  return (
    <div className="flex items-center justify-center"
      style={{
        width: 140, height: 195, borderRadius: 6,
        border: `1px dashed ${color}30`, background: '#0a0e1840',
      }}>
      <div style={{
        width: 50, height: 50, borderRadius: '50%',
        border: `1px solid ${color}20`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ color: `${color}30`, fontSize: 20 }}>✦</span>
      </div>
    </div>
  );
}

function FloatingNum({ data }: { data: FloatingNumber }) {
  const color = data.type === 'damage' ? '#ff4444'
    : data.type === 'heal' ? '#4ade80'
    : data.type === 'shield' ? '#60a5fa' : '#22c55e';

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 animate-float-up"
      style={{
        color, fontSize: 36, fontWeight: 900, fontFamily: 'Cinzel, serif',
        textShadow: `0 2px 8px ${color}80, 0 0 20px ${color}40`,
      }}>
      {data.value > 0 ? `+${data.value}` : data.value}
    </div>
  );
}
