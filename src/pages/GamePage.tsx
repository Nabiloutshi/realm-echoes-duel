import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useGame } from '@/hooks/useGame';
import { AIDifficulty } from '@/engine/types';
import PlayerInfo from '@/components/game/PlayerInfo';
import PhaseBar from '@/components/game/PhaseBar';
import GameBoard from '@/components/game/GameBoard';
import HandArea from '@/components/game/HandArea';
import EventLog from '@/components/game/EventLog';
import GameOverOverlay from '@/components/game/GameOverOverlay';

export default function GamePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const difficulty = (searchParams.get('difficulty') || 'SCHOLAR') as AIDifficulty;

  const {
    gameState, isAIThinking,
    handleNextPhase, handleSelectHandCard,
    handleSlotClick, handleAttackPlayer,
    startGame,
  } = useGame();

  useEffect(() => {
    if (!gameState) startGame(difficulty);
  }, []);

  if (!gameState) return null;

  const canAttackOpponent = gameState.phase === 'COMBAT' && gameState.activeSide === 'player'
    && gameState.selectedAttackerSlot !== null
    && !gameState.opponent.board.some(u => u !== null);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#080b12' }}>
      {/* LEFT: Player Hero */}
      <div className="w-[170px] shrink-0 flex flex-col items-center justify-center py-4"
        style={{
          background: 'linear-gradient(180deg, #0a0e18, #080b12)',
          borderRight: '2px solid #1a2235',
        }}>
        <PlayerInfo
          player={gameState.player}
          isActive={gameState.activeSide === 'player'}
          isHero
        />
      </div>

      {/* CENTER: Board + Hand */}
      <div className="flex-1 flex flex-col min-w-0">
        <GameBoard
          state={gameState}
          onSlotClick={handleSlotClick}
          onPlayerAvatarClick={() => handleAttackPlayer()}
        />
        <HandArea state={gameState} onCardClick={handleSelectHandCard} />
      </div>

      {/* RIGHT: Opponent Hero + Phase Controls + Event Log */}
      <div className="w-[170px] shrink-0 flex flex-col"
        style={{
          background: 'linear-gradient(180deg, #0a0e18, #080b12)',
          borderLeft: '2px solid #1a2235',
        }}>
        {/* Opponent Hero */}
        <div className="flex flex-col items-center pt-3 pb-2">
          <PlayerInfo
            player={gameState.opponent}
            isActive={gameState.activeSide === 'opponent'}
            isHero
            canAttack={canAttackOpponent}
            onAttackClick={() => handleAttackPlayer()}
          />
        </div>

        {/* Divider */}
        <div className="mx-4 h-px" style={{ background: '#1a2235' }} />

        {/* Phase controls */}
        <div className="flex flex-col items-center py-3">
          <PhaseBar
            currentPhase={gameState.phase}
            onNextPhase={handleNextPhase}
            isPlayerTurn={gameState.activeSide === 'player' && !isAIThinking}
            isLoading={isAIThinking}
            turn={gameState.turn}
          />
        </div>

        {/* Divider */}
        <div className="mx-4 h-px" style={{ background: '#1a2235' }} />

        {/* Event Log fills remaining space */}
        <div className="flex-1 min-h-0">
          <EventLog events={gameState.events} />
        </div>
      </div>

      <GameOverOverlay
        status={gameState.status}
        onNewGame={() => startGame(difficulty)}
        onMenu={() => navigate('/')}
      />
    </div>
  );
}
