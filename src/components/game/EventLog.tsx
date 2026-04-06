import { CombatEvent } from '@/engine/types';

interface EventLogProps {
  events: CombatEvent[];
}

export default function EventLog({ events }: EventLogProps) {
  const last = events.slice(-30);

  const getColor = (type: CombatEvent['type']) => {
    switch (type) {
      case 'DAMAGE': case 'HERO_DAMAGE': return '#ef4444';
      case 'HEAL': return '#4ade80';
      case 'DEATH': return '#a855f7';
      case 'ATTACK': return '#fb923c';
      case 'ROUND_START': return '#c9a84c';
      case 'GAME_OVER': return '#fbbf24';
      case 'POISON': return '#22c55e';
      case 'SHIELD': return '#60a5fa';
      case 'EFFECT': return '#8ab4f8';
      default: return '#8a9bb0';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="font-cinzel text-[10px] tracking-wider px-3 py-2"
        style={{ color: 'hsl(var(--primary))', borderBottom: '1px solid hsl(var(--border))' }}>
        JOURNAL
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-1" style={{ maxHeight: 300 }}>
        {last.map((ev, i) => (
          <div key={i} className="py-0.5 text-[9px] font-crimson leading-tight" style={{ color: getColor(ev.type) }}>
            {ev.message}
          </div>
        ))}
      </div>
    </div>
  );
}
