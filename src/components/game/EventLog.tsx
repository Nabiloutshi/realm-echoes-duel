import { GameEvent } from '@/engine/types';

interface EventLogProps {
  events: GameEvent[];
}

const typeColors: Record<string, string> = {
  DAMAGE: '#ef4444',
  HEAL: '#4ade80',
  SHIELD: '#60a5fa',
  POISON: '#22c55e',
  DEATH: '#991b1b',
  PLAY: '#c9a84c',
  DRAW: '#8a9bb0',
  TURN_START: '#c9a84c',
  EFFECT: '#a78bfa',
  ATTACK: '#fb923c',
  GAME_OVER: '#fbbf24',
};

export default function EventLog({ events }: EventLogProps) {
  const recent = events.slice(-30);

  return (
    <div className="flex flex-col h-full overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0c1018, #080b12)',
        borderLeft: '2px solid #1a2235',
      }}>
      <div className="px-3 py-2 font-cinzel font-semibold text-center"
        style={{
          borderBottom: '1px solid #1a2235',
          color: '#c9a84c',
          fontSize: 10,
          letterSpacing: '0.1em',
        }}>
        📜 JOURNAL
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5" id="event-log">
        {recent.map((evt, i) => (
          <div key={i} className="py-0.5 leading-tight font-crimson"
            style={{ color: typeColors[evt.type] || '#8a9bb0', fontSize: 10 }}>
            {evt.message}
          </div>
        ))}
      </div>
    </div>
  );
}
