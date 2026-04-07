import { useState, useCallback, useRef, useEffect } from 'react';
import { GameState, CardDefinition, AIDifficulty, HeroDefinition, Race } from '@/engine/types';
import { createGame, processRound } from '@/engine/gameEngine';
import { ALL_CARDS } from '@/data/cards';
import { HEROES } from '@/data/heroes';

export function useGame() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const autoRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startGame = useCallback((
    playerHero: HeroDefinition,
    playerCards: CardDefinition[],
    difficulty: AIDifficulty,
    opponentRace?: Race,
  ) => {
    // Pick opponent from a different race
    const oppRace = opponentRace || (['HUMAINS_NAINS', 'ELFES', 'ORCS_TROLLS', 'GOBELINS_GNOLLS'] as Race[])
      .filter(r => r !== playerHero.race)[Math.floor(Math.random() * 3)];
    const oppHeroes = HEROES.filter(h => h.race === oppRace);
    const aiHero = oppHeroes[Math.floor(Math.random() * oppHeroes.length)];
    const oppUnits = ALL_CARDS.filter(c => c.race === oppRace);
    let aiCards: CardDefinition[];

    if (difficulty === 'NOVICE') {
      aiCards = [...oppUnits].sort(() => Math.random() - 0.5).slice(0, 5);
    } else if (difficulty === 'SCHOLAR') {
      aiCards = [...oppUnits].sort((a, b) => {
        const r: Record<string, number> = { COMMON: 0, RARE: 1, EPIC: 2, LEGENDARY: 3 };
        return r[b.rarity] - r[a.rarity];
      }).slice(0, 5);
    } else {
      aiCards = [...oppUnits].sort((a, b) => (b.atk * 2 + b.hp) - (a.atk * 2 + a.hp)).slice(0, 5);
    }

    const state = createGame(playerHero, playerCards, aiHero, aiCards, difficulty);
    autoRef.current = false;
    setGameState(state);
  }, []);

  const endRound = useCallback(() => {
    if (!gameState || gameState.status !== 'PLAYING' || isAnimating) return;
    setIsAnimating(true);
    const newState = processRound(gameState);
    setGameState(newState);
    setTimeout(() => setIsAnimating(false), 800);
  }, [gameState, isAnimating]);

  const toggleAuto = useCallback(() => {
    const newAuto = !autoRef.current;
    autoRef.current = newAuto;
    setGameState(prev => prev ? { ...prev, isAutoBattle: newAuto } : null);
  }, []);

  const toggleSpeed = useCallback(() => {
    setGameState(prev => prev ? { ...prev, battleSpeed: prev.battleSpeed === 1 ? 2 : 1 } : null);
  }, []);

  useEffect(() => {
    if (!gameState || gameState.status !== 'PLAYING') {
      autoRef.current = false;
      return;
    }
    if (autoRef.current && !isAnimating) {
      const delay = gameState.battleSpeed === 2 ? 600 : 1200;
      timerRef.current = setTimeout(endRound, delay);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [gameState, isAnimating, endRound]);

  return { gameState, isAnimating, startGame, endRound, toggleAuto, toggleSpeed };
}
