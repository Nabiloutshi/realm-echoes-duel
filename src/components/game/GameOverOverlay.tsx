import { GameStatus } from '@/engine/types';

interface GameOverOverlayProps {
  status: GameStatus;
  onNewGame: () => void;
  onMenu: () => void;
}

export default function GameOverOverlay({ status, onNewGame, onMenu }: GameOverOverlayProps) {
  if (status === 'PLAYING') return null;
  const isVictory = status === 'VICTORY';

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center"
      style={{ background: 'radial-gradient(circle, rgba(0,0,0,0.85), rgba(0,0,0,0.95))' }}>
      <div className="flex flex-col items-center gap-6">
        {isVictory && (
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(circle, hsl(42 50% 54% / 0.1), transparent 60%)' }} />
        )}
        <h1 className="font-cinzel font-black text-5xl relative z-10"
          style={{
            color: isVictory ? '#c9a84c' : '#ef4444',
            textShadow: isVictory ? '0 0 40px #c9a84c80' : '0 0 40px #ef444480',
          }}>
          {isVictory ? 'VICTOIRE' : 'DÉFAITE'}
        </h1>
        <p className="font-crimson italic text-lg relative z-10" style={{ color: '#8a9bb0' }}>
          {isVictory ? 'Votre faction triomphe sur les ténèbres.' : "L'obscurité l'emporte sur la lumière."}
        </p>
        <div className="flex gap-4 relative z-10">
          <button onClick={onNewGame}
            className="px-6 py-3 rounded-lg font-cinzel font-bold text-sm transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, hsl(42 50% 54%), hsl(42 60% 40%))',
              color: '#080b12', boxShadow: '0 0 20px hsl(42 50% 54% / 0.3)',
            }}>
            NOUVELLE PARTIE
          </button>
          <button onClick={onMenu}
            className="px-6 py-3 rounded-lg font-cinzel font-bold text-sm transition-all hover:scale-105"
            style={{ background: 'hsl(220 20% 15%)', border: '1px solid hsl(220 20% 25%)', color: '#8a9bb0' }}>
            MENU
          </button>
        </div>
      </div>
    </div>
  );
}
