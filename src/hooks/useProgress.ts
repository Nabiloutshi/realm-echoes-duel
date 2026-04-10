import { useState, useCallback } from 'react';
import { PlayerProgress, createDefaultProgress, addXp } from '@/data/progression';

const STORAGE_KEY = 'roe-progress';

function loadProgress(): PlayerProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return createDefaultProgress();
}

function saveProgress(p: PlayerProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

export function useProgress() {
  const [progress, setProgress] = useState<PlayerProgress>(loadProgress);

  const update = useCallback((fn: (p: PlayerProgress) => PlayerProgress) => {
    setProgress(prev => {
      const next = fn(prev);
      saveProgress(next);
      return next;
    });
  }, []);

  const gainXp = useCallback((amount: number) => {
    let levelsGained = 0;
    update(p => {
      const result = addXp(p, amount);
      levelsGained = result.levelsGained;
      return result.progress;
    });
    return levelsGained;
  }, [update]);

  const spendGold = useCallback((amount: number): boolean => {
    if (progress.gold < amount) return false;
    update(p => ({ ...p, gold: p.gold - amount }));
    return true;
  }, [progress.gold, update]);

  const spendGems = useCallback((amount: number): boolean => {
    if (progress.gems < amount) return false;
    update(p => ({ ...p, gems: p.gems - amount }));
    return true;
  }, [progress.gems, update]);

  const addGold = useCallback((amount: number) => {
    update(p => ({ ...p, gold: p.gold + amount }));
  }, [update]);

  const addGems = useCallback((amount: number) => {
    update(p => ({ ...p, gems: p.gems + amount }));
  }, [update]);

  const completeStage = useCallback((stageId: string) => {
    update(p => ({ ...p, campaignProgress: { ...p.campaignProgress, [stageId]: true } }));
  }, [update]);

  const unlockCard = useCallback((cardId: string) => {
    update(p => ({
      ...p,
      unlockedCardIds: p.unlockedCardIds.includes(cardId) ? p.unlockedCardIds : [...p.unlockedCardIds, cardId],
    }));
  }, [update]);

  return { progress, gainXp, spendGold, spendGems, addGold, addGems, completeStage, unlockCard };
}
