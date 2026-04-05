import { useGame } from '@/hooks/useGame';
import PlayerInfo from '@/components/game/PlayerInfo';
import PhaseBar from '@/components/game/PhaseBar';
import GameBoard from '@/components/game/GameBoard';
import HandArea from '@/components/game/HandArea';
import EventLog from '@/components/game/EventLog';
import GameOverOverlay from '@/components/game/GameOverOverlay';

export default function GamePage() {
  const {
    gameState, isAIThinking,
    handleNextPhase, handleSelectHandCard,
    handleSlotClick, handleAttackPlayer,
    startGame,
  } = useGame();

  if (!gameState) {
    // This shouldn't render since we start from menu, but just in case
    startGame('SCHOLAR');
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'hsl(220 40% 4%)' }}>
      {/* Main game area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
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

        {/* Battle arena */}
        <GameBoard
          state={gameState}
          onSlotClick={handleSlotClick}
          onPlayerAvatarClick={() => handleAttackPlayer()}
        />

        {/* Hand */}
        <HandArea state={gameState} onCardClick={handleSelectHandCard} />
      </div>

      {/* Event log sidebar */}
      <div className="w-[200px] shrink-0" style={{ borderLeft: '1px solid hsl(220 20% 15%)' }}>
        <EventLog events={gameState.events} />
      </div>

      {/* Game Over Overlay */}
      <GameOverOverlay
        status={gameState.status}
        onNewGame={() => startGame(gameState.aiDifficulty)}
        onMenu={() => window.location.href = '/'}
      />
    </div>
  );
}
