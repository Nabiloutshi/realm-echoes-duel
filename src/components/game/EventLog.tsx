import { GameEvent } from '@/engine/types';

interface EventLogProps {
  events: GameEvent[];
}

const typeColors: Record<string, string> = {
  DAMAGE: 'hsl(0 70% 55%)',
  HEAL: 'hsl(142 60% 50%)',
  SHIELD: 'hsl(210 70% 55%)',
  POISON: 'hsl(142 70% 40%)',
  DEATH: 'hsl(0 50% 40%)',
  PLAY: 'hsl(42 50% 54%)',
  DRAW: 'hsl(213 15% 55%)',
  TURN_START: 'hsl(42 50% 54%)',
  EFFECT: 'hsl(270 50% 55%)',
  ATTACK: 'hsl(22 78% 57%)',
  GAME_OVER: 'hsl(42 80% 60%)',
};

export default function EventLog({ events }: EventLogProps) {
  const recent = events.slice(-30);

  return (
    <div
      className="flex flex-col h-full overflow-hidden rounded-lg"
      style={{ background: 'hsl(220 30% 8%)', border: '1px solid hsl(220 20% 18%)' }}
    >
      <div className="px-3 py-1.5 font-cinzel font-semibold text-[10px]"
        style={{ borderBottom: '1px solid hsl(220 20% 18%)', color: 'hsl(42 50% 54%)' }}>
        📜 JOURNAL
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5" id="event-log">
        {recent.map((evt, i) => (
          <div key={i} className="text-[9px] leading-tight py-0.5"
            style={{ color: typeColors[evt.type] || 'hsl(213 15% 55%)' }}>
            {evt.message}
          </div>
        ))}
      </div>
    </div>
  );
}
