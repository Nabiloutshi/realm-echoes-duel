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
  const heroId = searchParams.get('hero');

  const { gameState, isAnimating, startGame, endRound, toggleAuto, toggleSpeed } = useGame();

  useEffect(() => {
    if (!gameState) {
      const hero = heroId ? HEROES.find(h => h.id === heroId) : HEROES[0];
      const selectedHero = hero || HEROES[0];
      const raceUnits = ALL_CARDS.filter(c => c.race === selectedHero.race);
      const sorted = [...raceUnits].sort((a, b) => (b.atk * 2 + b.hp) - (a.atk * 2 + a.hp));
      startGame(selectedHero, sorted.slice(0, 5), difficulty);
    }
  }, []);

  if (!gameState) return null;

  return (
    <div className="flex h-screen overflow-hidden relative" style={{ background: '#080b12' }}>
      {/* LEFT: Player Hero */}
      <div className="w-[170px] shrink-0 flex flex-col items-center justify-center py-3"
        style={{
          background: 'linear-gradient(180deg, #0a0e18, #080b12)',
          borderRight: '2px solid #1a2235',
        }}>
        <PlayerInfo
          heroState={gameState.player.hero}
          isPlayer
          floatingNumbers={gameState.heroFloatingNumbers.filter(f => f.side === 'player')}
        />
        <div className="mt-2 font-cinzel text-[10px] tracking-wider" style={{ color: '#8a9bb0' }}>
          Joueur
        </div>
      </div>

      {/* CENTER: Battle Board */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Round counter top */}
        <div className="flex items-center justify-center py-1.5"
          style={{ background: '#0a0e18', borderBottom: '1px solid #1a2235' }}>
          <span className="font-cinzel text-xs tracking-wider" style={{ color: '#c9a84c' }}>
            ROUND {gameState.round}
          </span>
        </div>
        <GameBoard state={gameState} />
      </div>

      {/* RIGHT: Opponent Hero + Controls */}
      <div className="w-[170px] shrink-0 flex flex-col"
        style={{
          background: 'linear-gradient(180deg, #0a0e18, #080b12)',
          borderLeft: '2px solid #1a2235',
        }}>
        {/* Opponent hero */}
        <div className="flex flex-col items-center py-3">
          <PlayerInfo
            heroState={gameState.opponent.hero}
            floatingNumbers={gameState.heroFloatingNumbers.filter(f => f.side === 'opponent')}
          />
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-2 py-3 mx-3"
          style={{ borderTop: '1px solid #1a2235' }}>
          {/* Auto button */}
          <button onClick={toggleAuto}
            className="font-cinzel text-[10px] font-bold px-4 py-1.5 rounded-full transition-all w-full"
            style={{
              background: gameState.isAutoBattle
                ? 'linear-gradient(135deg, #c9a84c, #8a6d2b)'
                : '#1a2235',
              color: gameState.isAutoBattle ? '#080b12' : '#8a9bb0',
              border: `1px solid ${gameState.isAutoBattle ? '#c9a84c' : '#2a3245'}`,
            }}>
            Auto
          </button>

          {/* Round number */}
          <div className="flex items-center justify-center"
            style={{
              width: 42, height: 42, borderRadius: '50%',
              background: 'linear-gradient(135deg, #0d1220, #1a2235)',
              border: `2px solid ${gameState.isAutoBattle ? '#ef4444' : '#3a6a8a'}`,
              color: gameState.isAutoBattle ? '#ef4444' : '#3a6a8a',
              fontFamily: 'Cinzel', fontWeight: 700, fontSize: 16,
            }}>
            {gameState.round}
          </div>

          {/* End Round */}
          <button onClick={endRound}
            disabled={isAnimating || gameState.status !== 'PLAYING'}
            className="font-cinzel text-[10px] font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex flex-col items-center justify-center"
            style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'linear-gradient(135deg, #1a2235, #2a3245)',
              border: '2px solid #3a4a60',
              color: '#e8dfc8',
            }}>
            <span style={{ fontSize: 18 }}>▶</span>
            <span style={{ fontSize: 7, marginTop: 1 }}>End Round</span>
          </button>

          {/* Fast Fwd */}
          <button onClick={toggleSpeed}
            className="font-cinzel text-[9px] px-3 py-1 rounded transition-all"
            style={{
              background: gameState.battleSpeed === 2 ? '#2563eb' : '#1a2235',
              color: gameState.battleSpeed === 2 ? '#fff' : '#8a9bb0',
              border: '1px solid #2a3245',
            }}>
            Fast Fwd
          </button>
        </div>

        {/* Event log */}
        <div className="flex-1 min-h-0" style={{ borderTop: '1px solid #1a2235' }}>
          <EventLog events={gameState.events} />
        </div>
      </div>

      <GameOverOverlay
        status={gameState.status}
        onNewGame={() => {
          const hero = heroId ? HEROES.find(h => h.id === heroId) : HEROES[0];
          const selectedHero = hero || HEROES[0];
          const raceUnits = ALL_CARDS.filter(c => c.race === selectedHero.race);
          const sorted = [...raceUnits].sort((a, b) => (b.atk * 2 + b.hp) - (a.atk * 2 + a.hp));
          startGame(selectedHero, sorted.slice(0, 5), difficulty);
        }}
        onMenu={() => navigate('/')}
      />
    </div>
  );
}
