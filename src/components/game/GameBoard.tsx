import { GameState, FloatingNumber, RACE_INFO } from '@/engine/types';
import GameCard from './GameCard';

interface GameBoardProps {
  state: GameState;
}

export default function GameBoard({ state }: GameBoardProps) {
  const oppRace = state.opponent.hero.hero.race;
  const plrRace = state.player.hero.hero.race;

  return (
    <div className="flex-1 flex flex-col justify-center items-center relative overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse 60% 40% at 50% 50%, #141a2a 0%, transparent 70%),
          linear-gradient(180deg, #080b12 0%, #0d1220 50%, #080b12 100%)
        `,
      }}>

      {/* Metallic board frame */}
      <div className="relative rounded-lg overflow-hidden" style={{
        border: '2px solid #2a3245',
        boxShadow: 'inset 0 0 30px #00000080, 0 0 20px #00000060',
        background: '#0a0e18',
        padding: '8px',
      }}>
        {/* Opponent row */}
        <div className="flex gap-1.5 mb-2 justify-center">
          {state.opponent.board.map((unit, i) => (
            <div key={`opp-${i}`} className="relative">
              {unit ? <GameCard unit={unit} /> : <EmptySlot />}
              {state.floatingNumbers
                .filter(f => f.side === 'opponent' && f.slotIndex === i)
                .map(f => <FloatingNum key={f.id} data={f} />)}
            </div>
          ))}
        </div>

        {/* Divider line */}
        <div className="flex items-center justify-center my-1.5">
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #2a3245, transparent)' }} />
        </div>

        {/* Player row */}
        <div className="flex gap-1.5 justify-center">
          {state.player.board.map((unit, i) => (
            <div key={`plr-${i}`} className="relative">
              {unit ? <GameCard unit={unit} /> : <EmptySlot />}
              {state.floatingNumbers
                .filter(f => f.side === 'player' && f.slotIndex === i)
                .map(f => <FloatingNum key={f.id} data={f} />)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmptySlot() {
  return (
    <div className="flex items-center justify-center"
      style={{
        width: 130, height: 180, borderRadius: 4,
        border: '1px solid #1a223540',
        background: 'radial-gradient(circle, #0d122040 0%, #080b1220 100%)',
      }}>
      {/* Pentagram/seal icon */}
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        border: '1px solid #1a223560',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: 0.3,
      }}>
        <span style={{ fontSize: 16, color: '#2a3245' }}>✦</span>
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
        color, fontSize: 32, fontWeight: 900, fontFamily: 'Cinzel, serif',
        textShadow: `0 2px 8px ${color}80, 0 0 20px ${color}40`,
        WebkitTextStroke: '1px #00000080',
      }}>
      {data.value > 0 ? `+${data.value}` : data.value}
    </div>
  );
}
