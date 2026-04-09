import { useEffect, useState } from 'react';

export interface VFXEvent {
  id: string;
  type: 'attack' | 'death' | 'heal' | 'heroSkill' | 'poison' | 'shield';
  x: number; // percent
  y: number; // percent
  color?: string;
}

interface BattleVFXProps {
  events: VFXEvent[];
}

export default function BattleVFX({ events }: BattleVFXProps) {
  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
      {events.map(ev => (
        <VFXEffect key={ev.id} event={ev} />
      ))}
    </div>
  );
}

function VFXEffect({ event }: { event: VFXEvent }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 1200);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  if (event.type === 'attack') {
    return (
      <div className="absolute" style={{ left: `${event.x}%`, top: `${event.y}%`, transform: 'translate(-50%, -50%)' }}>
        {/* Fire trail burst */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="absolute"
            style={{
              width: 4, height: 16,
              background: `linear-gradient(180deg, #ff6b35, #ff4444, transparent)`,
              borderRadius: 2,
              transform: `rotate(${i * 45}deg)`,
              transformOrigin: '2px 0',
              animation: `vfxBurst 0.6s ease-out forwards`,
              animationDelay: `${i * 0.02}s`,
              opacity: 0.9,
            }} />
        ))}
        {/* Central flash */}
        <div className="absolute rounded-full"
          style={{
            width: 30, height: 30,
            background: 'radial-gradient(circle, #ffffff, #ff6b35, transparent)',
            transform: 'translate(-50%, -50%)',
            animation: 'vfxFlash 0.4s ease-out forwards',
          }} />
        {/* Sparks */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={`spark-${i}`} className="absolute rounded-full"
            style={{
              width: 3, height: 3,
              background: '#fbbf24',
              boxShadow: '0 0 4px #fbbf24',
              animation: `vfxSpark${i % 3} 0.8s ease-out forwards`,
              animationDelay: `${i * 0.05}s`,
            }} />
        ))}
      </div>
    );
  }

  if (event.type === 'death') {
    return (
      <div className="absolute" style={{ left: `${event.x}%`, top: `${event.y}%`, transform: 'translate(-50%, -50%)' }}>
        {/* Explosion ring */}
        <div className="absolute rounded-full"
          style={{
            width: 80, height: 80,
            border: '3px solid #ff4444',
            transform: 'translate(-50%, -50%)',
            animation: 'vfxExplosionRing 0.7s ease-out forwards',
            boxShadow: '0 0 20px #ff444480',
          }} />
        {/* Skull particles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="absolute rounded-full"
            style={{
              width: 4 + Math.random() * 4, height: 4 + Math.random() * 4,
              background: i % 2 === 0 ? '#ff4444' : '#a855f7',
              boxShadow: `0 0 6px ${i % 2 === 0 ? '#ff4444' : '#a855f7'}`,
              animation: `vfxDeathParticle 0.9s ease-out forwards`,
              animationDelay: `${i * 0.03}s`,
              transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-${20 + Math.random() * 30}px)`,
            }} />
        ))}
        {/* Flash */}
        <div className="absolute rounded-full"
          style={{
            width: 50, height: 50,
            background: 'radial-gradient(circle, #ffffff, #ff4444, transparent)',
            transform: 'translate(-50%, -50%)',
            animation: 'vfxFlash 0.5s ease-out forwards',
          }} />
      </div>
    );
  }

  if (event.type === 'heal') {
    return (
      <div className="absolute" style={{ left: `${event.x}%`, top: `${event.y}%`, transform: 'translate(-50%, -50%)' }}>
        {/* Green rising particles */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="absolute rounded-full"
            style={{
              width: 4, height: 4,
              background: '#4ade80',
              boxShadow: '0 0 8px #4ade80',
              animation: 'vfxHealRise 1s ease-out forwards',
              animationDelay: `${i * 0.08}s`,
              left: (i - 4) * 8,
            }} />
        ))}
        {/* Plus sign */}
        <div className="absolute font-bold"
          style={{
            color: '#4ade80', fontSize: 20,
            textShadow: '0 0 10px #4ade80',
            transform: 'translate(-50%, -50%)',
            animation: 'vfxHealRise 0.8s ease-out forwards',
          }}>+</div>
      </div>
    );
  }

  if (event.type === 'heroSkill') {
    const color = event.color || '#c9a84c';
    return (
      <div className="absolute inset-0">
        {/* Full screen flash */}
        <div className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at ${event.x}% ${event.y}%, ${color}40, transparent 60%)`,
            animation: 'vfxScreenFlash 0.8s ease-out forwards',
          }} />
        {/* Energy ring */}
        <div className="absolute rounded-full"
          style={{
            left: `${event.x}%`, top: `${event.y}%`,
            width: 120, height: 120,
            border: `2px solid ${color}`,
            transform: 'translate(-50%, -50%)',
            animation: 'vfxExplosionRing 1s ease-out forwards',
            boxShadow: `0 0 30px ${color}60`,
          }} />
      </div>
    );
  }

  if (event.type === 'poison') {
    return (
      <div className="absolute" style={{ left: `${event.x}%`, top: `${event.y}%`, transform: 'translate(-50%, -50%)' }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="absolute rounded-full"
            style={{
              width: 6 + i * 2, height: 6 + i * 2,
              background: 'radial-gradient(circle, #22c55e80, transparent)',
              animation: 'vfxPoisonBubble 1s ease-out forwards',
              animationDelay: `${i * 0.12}s`,
              left: (i - 2) * 10,
            }} />
        ))}
      </div>
    );
  }

  return null;
}
