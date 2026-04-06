import { Phase } from '@/engine/types';

const PHASES: { key: Phase; label: string; desc: string }[] = [
  { key: 'DRAW', label: 'PIOCHE', desc: 'Piochez une carte' },
  { key: 'RESOURCE', label: 'RESSOURCE', desc: "Gain d'éclats" },
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
  turn: number;
}

export default function PhaseBar({ currentPhase, onNextPhase, isPlayerTurn, isLoading, turn }: PhaseBarProps) {
  const currentIdx = PHASES.findIndex(p => p.key === currentPhase);
  const currentDesc = PHASES[currentIdx]?.desc;

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      {/* Round counter */}
      <div className="flex items-center justify-center rounded-full"
        style={{
          width: 52, height: 52,
          background: 'linear-gradient(135deg, #1a2235, #0f1520)',
          border: '3px solid #2a3555',
          boxShadow: '0 0 10px rgba(0,0,0,0.5), inset 0 0 8px rgba(0,0,0,0.3)',
        }}>
        <span className="font-cinzel font-bold" style={{ color: '#c9a84c', fontSize: 20 }}>{turn}</span>
      </div>

      {/* Phase pills - vertical */}
      <div className="flex flex-col items-center gap-1 w-full px-2">
        {PHASES.map((p, i) => {
          const isPast = i < currentIdx;
          const isCurrent = i === currentIdx;
          return (
            <div
              key={p.key}
              className="w-full text-center py-0.5 rounded font-cinzel font-semibold transition-all duration-300"
              style={{
                fontSize: 8,
                background: isCurrent ? 'linear-gradient(135deg, #c9a84c, #a08030)' : 'transparent',
                color: isCurrent ? '#0a0e18' : isPast ? '#4a5568' : '#2a3045',
                border: isCurrent ? 'none' : '1px solid transparent',
              }}
            >
              {p.label}
            </div>
          );
        })}
      </div>

      {/* Current phase description */}
      <div className="text-center px-2">
        <span className="font-crimson italic" style={{ fontSize: 10, color: '#8a9bb0' }}>
          {isPlayerTurn ? currentDesc : "Tour de l'adversaire..."}
        </span>
      </div>

      {/* End Round / Next Phase button */}
      {isPlayerTurn && (
        <button
          onClick={onNextPhase}
          disabled={isLoading}
          className="w-14 h-14 rounded-full font-cinzel font-bold transition-all hover:scale-110 active:scale-95 flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #1a2235, #0f1520)',
            border: '3px solid #c9a84c',
            color: '#c9a84c',
            fontSize: 10,
            boxShadow: '0 0 12px rgba(201,168,76,0.3)',
          }}
        >
          {isLoading ? (
            <span style={{ fontSize: 14 }}>⏳</span>
          ) : (
            <span style={{ fontSize: 18 }}>▶</span>
          )}
        </button>
      )}

      {isPlayerTurn && (
        <span className="font-cinzel" style={{ fontSize: 9, color: '#c9a84c' }}>
          {currentPhase === 'COMBAT' ? 'Fin Combat' : 'Suivant'}
        </span>
      )}
    </div>
  );
}
