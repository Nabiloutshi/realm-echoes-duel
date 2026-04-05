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

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'hsl(220 40% 4%)' }}>
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between px-4 h-[60px] shrink-0"
          style={{ background: 'hsl(220 30% 7%)', borderBottom: '1px solid hsl(220 20% 15%)' }}>
          <PlayerInfo player={gameState.opponent} isActive={gameState.activeSide === 'opponent'} compact />
          <PhaseBar
            currentPhase={gameState.phase}
            onNextPhase={handleNextPhase}
            isPlayerTurn={gameState.activeSide === 'player' && !isAIThinking}
            isLoading={isAIThinking}
          />
          <PlayerInfo player={gameState.player} isActive={gameState.activeSide === 'player'} compact />
        </div>
        <GameBoard
          state={gameState}
          onSlotClick={handleSlotClick}
          onPlayerAvatarClick={() => handleAttackPlayer()}
        />
        <HandArea state={gameState} onCardClick={handleSelectHandCard} />
      </div>
      <div className="w-[200px] shrink-0" style={{ borderLeft: '1px solid hsl(220 20% 15%)' }}>
        <EventLog events={gameState.events} />
      </div>
      <GameOverOverlay
        status={gameState.status}
        onNewGame={() => startGame(difficulty)}
        onMenu={() => navigate('/')}
      />
    </div>
  );
}
