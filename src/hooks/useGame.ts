import { useState, useCallback } from 'react';
import { GameState, AIDifficulty } from '@/engine/types';
import { createGame, nextPhase, playCard, attackTarget, attackPlayer, playAITurn } from '@/engine/gameEngine';
import { buildDefaultDeck } from '@/data/cards';

export function useGame() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isAIThinking, setIsAIThinking] = useState(false);

  const startGame = useCallback((difficulty: AIDifficulty = 'SCHOLAR') => {
    const playerDeck = buildDefaultDeck('SOLARI');
    const opponentDeck = buildDefaultDeck('UMBRA');
    const state = createGame(playerDeck, opponentDeck, difficulty);
    // Auto-process DRAW and RESOURCE for first turn
    let s = state;
    s = nextPhase(s); // DRAW -> RESOURCE
    s = nextPhase(s); // RESOURCE -> MAIN
    setGameState(s);
  }, []);

  const handleNextPhase = useCallback(() => {
    if (!gameState || gameState.status !== 'PLAYING') return;

    let s = nextPhase(gameState);

    // Auto-advance non-interactive phases
    while (s.status === 'PLAYING' && s.activeSide === 'player' &&
      (s.phase === 'DRAW' || s.phase === 'RESOURCE' || s.phase === 'EFFECTS')) {
      s = nextPhase(s);
    }

    if (s.phase === 'END' && s.activeSide === 'player') {
      s = nextPhase(s); // Move to opponent's turn
    }

    // AI turn
    if (s.activeSide === 'opponent' && s.status === 'PLAYING') {
      setGameState(s);
      setIsAIThinking(true);
      setTimeout(() => {
        const afterAI = playAITurn(s);
        // Auto-advance player's draw/resource
        let ps = afterAI;
        while (ps.status === 'PLAYING' && ps.activeSide === 'player' &&
          (ps.phase === 'DRAW' || ps.phase === 'RESOURCE' || ps.phase === 'EFFECTS')) {
          ps = nextPhase(ps);
        }
        setGameState(ps);
        setIsAIThinking(false);
      }, 800);
      return;
    }

    setGameState(s);
  }, [gameState]);

  const handleSelectHandCard = useCallback((index: number) => {
    if (!gameState || gameState.phase !== 'MAIN' || gameState.activeSide !== 'player') return;
    setGameState({
      ...gameState,
      selectedHandIndex: gameState.selectedHandIndex === index ? null : index,
      selectedAttackerSlot: null,
    });
  }, [gameState]);

  const handleSlotClick = useCallback((side: 'player' | 'opponent', slotIndex: number) => {
    if (!gameState || gameState.activeSide !== 'player') return;

    // MAIN phase: play card to slot
    if (gameState.phase === 'MAIN' && side === 'player' && gameState.selectedHandIndex !== null) {
      const s = playCard(gameState, gameState.selectedHandIndex, slotIndex);
      setGameState(s);
      return;
    }

    // COMBAT phase: select attacker
    if (gameState.phase === 'COMBAT' && side === 'player') {
      const unit = gameState.player.board[slotIndex];
      if (unit && unit.attacksThisTurn < unit.maxAttacks && unit.currentAtk > 0 && unit.card.cardType === 'UNIT') {
        setGameState({
          ...gameState,
          selectedAttackerSlot: gameState.selectedAttackerSlot === slotIndex ? null : slotIndex,
          selectedHandIndex: null,
        });
      }
      return;
    }

    // COMBAT phase: attack target
    if (gameState.phase === 'COMBAT' && side === 'opponent' && gameState.selectedAttackerSlot !== null) {
      const s = attackTarget(gameState, gameState.selectedAttackerSlot, slotIndex);
      setGameState(s);
      return;
    }
  }, [gameState]);

  const handleAttackPlayer = useCallback(() => {
    if (!gameState || gameState.selectedAttackerSlot === null) return;
    const s = attackPlayer(gameState, gameState.selectedAttackerSlot);
    setGameState(s);
  }, [gameState]);

  return {
    gameState,
    isAIThinking,
    startGame,
    handleNextPhase,
    handleSelectHandCard,
    handleSlotClick,
    handleAttackPlayer,
  };
}
