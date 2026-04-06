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
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(8,11,18,0.92)' }}>
      
      {isVictory && (
        <div className="absolute w-[600px] h-[600px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #c9a84c, transparent 70%)' }} />
      )}

      <div className="flex flex-col items-center gap-6 relative z-10">
        <h1 className="font-cinzel font-bold tracking-wider"
          style={{
            fontSize: 56,
            color: isVictory ? '#c9a84c' : '#ef4444',
            textShadow: `0 0 40px ${isVictory ? 'rgba(201,168,76,0.5)' : 'rgba(239,68,68,0.5)'}`,
          }}>
          {isVictory ? 'VICTOIRE' : 'DÉFAITE'}
        </h1>

        <p className="font-crimson text-lg italic" style={{ color: '#8a9bb0' }}>
          {isVictory
            ? 'Votre faction triomphe sur les ténèbres.'
            : "L'obscurité l'emporte sur la lumière."}
        </p>

        <div className="flex gap-4 mt-4">
          <button
            onClick={onNewGame}
            className="px-8 py-3 rounded-lg font-cinzel font-bold text-sm transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #c9a84c, #a08030)',
              color: '#0a0e18',
              boxShadow: '0 0 15px rgba(201,168,76,0.3)',
            }}
          >
            NOUVELLE PARTIE
          </button>
          <button
            onClick={onMenu}
            className="px-8 py-3 rounded-lg font-cinzel font-bold text-sm transition-all hover:scale-105"
            style={{
              background: '#1a2235',
              color: '#e8dfc8',
              border: '1px solid #2a3555',
            }}
          >
            MENU
          </button>
        </div>
      </div>
    </div>
  );
}
