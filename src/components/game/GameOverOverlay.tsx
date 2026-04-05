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
      style={{ background: 'hsl(220 40% 4% / 0.85)' }}>
      
      {/* Radial glow */}
      {isVictory && (
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, hsl(42 50% 54%), transparent)' }} />
      )}

      <div className="flex flex-col items-center gap-6 relative z-10">
        <h1
          className="font-cinzel font-bold text-5xl tracking-wider"
          style={{ color: isVictory ? 'hsl(42 50% 54%)' : 'hsl(0 70% 50%)',
            textShadow: `0 0 30px ${isVictory ? 'hsl(42 50% 54% / 0.5)' : 'hsl(0 70% 50% / 0.5)'}` }}
        >
          {isVictory ? 'VICTOIRE' : 'DÉFAITE'}
        </h1>

        <p className="font-crimson text-lg italic" style={{ color: 'hsl(38 40% 75%)' }}>
          {isVictory
            ? 'Votre faction triomphe sur les ténèbres.'
            : "L'obscurité l'emporte sur la lumière."}
        </p>

        <div className="flex gap-4 mt-4">
          <button
            onClick={onNewGame}
            className="px-6 py-2.5 rounded-lg font-cinzel font-bold text-sm transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, hsl(42 50% 54%), hsl(42 60% 40%))',
              color: 'hsl(220 40% 4%)',
            }}
          >
            NOUVELLE PARTIE
          </button>
          <button
            onClick={onMenu}
            className="px-6 py-2.5 rounded-lg font-cinzel font-bold text-sm transition-all hover:scale-105"
            style={{
              background: 'hsl(220 30% 14%)',
              color: 'hsl(38 40% 85%)',
              border: '1px solid hsl(220 20% 25%)',
            }}
          >
            MENU
          </button>
        </div>
      </div>
    </div>
  );
}
