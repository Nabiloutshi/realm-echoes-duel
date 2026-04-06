import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useGame } from '@/hooks/useGame';
import { AIDifficulty } from '@/engine/types';
import PlayerInfo from '@/components/game/PlayerInfo';
import GameBoard from '@/components/game/GameBoard';
import EventLog from '@/components/game/EventLog';
import GameOverOverlay from '@/components/game/GameOverOverlay';
import { ALL_CARDS } from '@/data/cards';
import { HEROES } from '@/data/heroes';

export default function GamePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const difficulty = (searchParams.get('difficulty') || 'SCHOLAR') as AIDifficulty;

  const { gameState, isAnimating, startGame, endRound, toggleAuto, toggleSpeed } = useGame();

  useEffect(() => {
    if (!gameState) {
      // Auto-start with default Solari hero and top 5 units
      const solariHeroes = HEROES.filter(h => h.faction === 'SOLARI');
      const hero = solariHeroes[0];
      const solariUnits = ALL_CARDS.filter(c => c.faction === 'SOLARI' && c.cardType === 'UNIT');
      const sorted = [...solariUnits].sort((a, b) => (b.atk * 2 + b.hp) - (a.atk * 2 + a.hp));
      startGame(hero, sorted.slice(0, 5), difficulty);
    }
  }, []);

  if (!gameState) return null;

  return (
    <div className="flex h-screen overflow-hidden relative" style={{ background: '#080b12' }}>
      {/* LEFT: Player Hero */}
      <div className="w-[180px] shrink-0 flex flex-col items-center justify-center py-4"
        style={{
          background: 'linear-gradient(180deg, #0a0e18, #080b12)',
          borderRight: '2px solid #1a2235',
        }}>
        <PlayerInfo
          heroState={gameState.player.hero}
          isPlayer
          floatingNumbers={gameState.heroFloatingNumbers.filter(f => f.side === 'player')}
        />

        {/* Player name */}
        <div className="mt-3 font-cinzel text-[11px] tracking-wider" style={{ color: 'hsl(var(--foreground))' }}>
          Joueur
        </div>
      </div>

      {/* CENTER: Battle Board */}
      <div className="flex-1 flex flex-col min-w-0">
        <GameBoard state={gameState} />
      </div>

      {/* RIGHT: Opponent Hero + Controls + Log */}
      <div className="w-[180px] shrink-0 flex flex-col"
        style={{
          background: 'linear-gradient(180deg, #0a0e18, #080b12)',
          borderLeft: '2px solid #1a2235',
        }}>
        {/* Opponent name */}
        <div className="text-center pt-2 font-cinzel text-[10px] tracking-wider" style={{ color: 'hsl(var(--muted-foreground))' }}>
          {gameState.opponent.hero.hero.name}
        </div>

        {/* Opponent Hero */}
        <div className="flex flex-col items-center py-2">
          <PlayerInfo
            heroState={gameState.opponent.hero}
            floatingNumbers={gameState.heroFloatingNumbers.filter(f => f.side === 'opponent')}
          />
        </div>

        {/* Divider */}
        <div className="mx-4 h-px" style={{ background: '#1a2235' }} />

        {/* Controls */}
        <div className="flex flex-col items-center gap-3 py-4">
          {/* Auto button */}
          <button onClick={toggleAuto}
            className="font-cinzel text-xs font-bold px-4 py-2 rounded-full transition-all"
            style={{
              background: gameState.isAutoBattle ? 'hsl(var(--primary))' : '#1a2235',
              color: gameState.isAutoBattle ? '#080b12' : '#8a9bb0',
              border: `1px solid ${gameState.isAutoBattle ? 'hsl(var(--primary))' : '#2a3245'}`,
            }}>
            Auto
          </button>

          {/* Round counter */}
          <div className="flex items-center justify-center"
            style={{
              width: 48, height: 48, borderRadius: '50%',
              background: '#0d1220', border: '2px solid hsl(var(--primary))',
              color: 'hsl(var(--primary))', fontFamily: 'Cinzel', fontWeight: 700, fontSize: 18,
            }}>
            {gameState.round}
          </div>

          {/* End Round button */}
          <button onClick={endRound}
            disabled={isAnimating || gameState.status !== 'PLAYING'}
            className="font-cinzel text-xs font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            style={{
              width: 60, height: 60, borderRadius: '50%',
              background: '#1a2235', border: '2px solid #2a3245',
              color: '#e8dfc8',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column',
            }}>
            <span style={{ fontSize: 20 }}>▶</span>
            <span style={{ fontSize: 8, marginTop: 2 }}>End Round</span>
          </button>

          {/* Fast Fwd */}
          <button onClick={toggleSpeed}
            className="font-cinzel text-[10px] px-3 py-1 rounded transition-all"
            style={{
              background: gameState.battleSpeed === 2 ? '#2563eb' : '#1a2235',
              color: gameState.battleSpeed === 2 ? '#fff' : '#8a9bb0',
              border: '1px solid #2a3245',
            }}>
            Fast Fwd
          </button>
        </div>

        {/* Divider */}
        <div className="mx-4 h-px" style={{ background: '#1a2235' }} />

        {/* Event Log */}
        <div className="flex-1 min-h-0">
          <EventLog events={gameState.events} />
        </div>
      </div>

      <GameOverOverlay
        status={gameState.status}
        onNewGame={() => {
          const solariHeroes = HEROES.filter(h => h.faction === 'SOLARI');
          const solariUnits = ALL_CARDS.filter(c => c.faction === 'SOLARI' && c.cardType === 'UNIT');
          const sorted = [...solariUnits].sort((a, b) => (b.atk * 2 + b.hp) - (a.atk * 2 + a.hp));
          startGame(solariHeroes[0], sorted.slice(0, 5), difficulty);
        }}
        onMenu={() => navigate('/')}
      />
    </div>
  );
}
