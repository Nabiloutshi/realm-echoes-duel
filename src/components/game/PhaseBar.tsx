import { Phase } from '@/engine/types';

const PHASES: { key: Phase; label: string; desc: string }[] = [
  { key: 'DRAW', label: 'PIOCHE', desc: 'Piochez une carte' },
  { key: 'RESOURCE', label: 'RESSOURCE', desc: 'Gain d\'éclats' },
  { key: 'MAIN', label: 'PRINCIPALE', desc: 'Jouez vos cartes' },
  { key: 'COMBAT', label: 'COMBAT', desc: 'Attaquez avec vos unités' },
  { key: 'EFFECTS', label: 'EFFETS', desc: 'Résolution des effets' },
  { key: 'END', label: 'FIN', desc: 'Fin du tour' },
];

interface PhaseBarProps {
  currentPhase: Phase;
  onNextPhase: () => void;
  isPlayerTurn: boolean;
  isLoading?: boolean;
}

export default function PhaseBar({ currentPhase, onNextPhase, isPlayerTurn, isLoading }: PhaseBarProps) {
  const currentIdx = PHASES.findIndex(p => p.key === currentPhase);
  const currentDesc = PHASES[currentIdx]?.desc;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {PHASES.map((p, i) => {
          const isPast = i < currentIdx;
          const isCurrent = i === currentIdx;
          return (
            <span
              key={p.key}
              className="px-2 py-0.5 rounded-full text-[9px] font-cinzel font-semibold transition-all duration-300"
              style={{
                background: isCurrent
                  ? 'linear-gradient(135deg, hsl(42 50% 54%), hsl(42 60% 45%))'
                  : isPast ? 'hsl(220 20% 18%)' : 'transparent',
                color: isCurrent ? 'hsl(220 40% 4%)' : isPast ? 'hsl(213 15% 45%)' : 'hsl(213 15% 30%)',
                border: isCurrent ? 'none' : '1px solid hsl(220 20% 22%)',
              }}
            >
              {p.label}
            </span>
          );
        })}
      </div>

      <span className="text-[10px] italic ml-2" style={{ color: 'hsl(213 15% 55%)' }}>
        {isPlayerTurn ? currentDesc : "Tour de l'adversaire..."}
      </span>

      {isPlayerTurn && (
        <button
          onClick={onNextPhase}
          disabled={isLoading}
          className="ml-2 px-3 py-1 rounded font-cinzel font-bold text-xs transition-all hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, hsl(42 50% 54%), hsl(42 60% 40%))',
            color: 'hsl(220 40% 4%)',
            border: '1px solid hsl(42 50% 65%)',
          }}
        >
          {isLoading ? '...' : 'SUIVANT ›'}
        </button>
      )}
    </div>
  );
}
