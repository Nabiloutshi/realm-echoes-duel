import { Race } from '@/engine/types';

export interface PlayerProgress {
  level: number;
  xp: number;
  xpToNext: number;
  gems: number;
  gold: number;
  unlockedCardIds: string[];
  unlockedDeckSlots: number;
  campaignProgress: Record<string, boolean>; // stageId -> completed
}

export function getXpForLevel(level: number): number {
  return Math.round(100 * Math.pow(1.3, level - 1));
}

export function createDefaultProgress(): PlayerProgress {
  return {
    level: 1,
    xp: 0,
    xpToNext: getXpForLevel(1),
    gems: 500,
    gold: 5000,
    unlockedCardIds: [],
    unlockedDeckSlots: 2,
    campaignProgress: {},
  };
}

export function addXp(progress: PlayerProgress, amount: number): { progress: PlayerProgress; levelsGained: number } {
  const p = { ...progress };
  p.xp += amount;
  let levelsGained = 0;
  while (p.xp >= p.xpToNext) {
    p.xp -= p.xpToNext;
    p.level += 1;
    levelsGained += 1;
    p.xpToNext = getXpForLevel(p.level);
    // Unlock deck slots at certain levels
    if (p.level === 5) p.unlockedDeckSlots = 3;
    if (p.level === 10) p.unlockedDeckSlots = 4;
    if (p.level === 15) p.unlockedDeckSlots = 5;
    // Bonus rewards
    p.gems += 50;
    p.gold += 500;
  }
  return { progress: p, levelsGained };
}

export function getXpReward(won: boolean, difficulty: string): number {
  const base = won ? 80 : 30;
  const mult = difficulty === 'MASTER' ? 2 : difficulty === 'SCHOLAR' ? 1.5 : 1;
  return Math.round(base * mult);
}

export function getGoldReward(won: boolean): number {
  return won ? 300 : 100;
}

export interface CampaignStage {
  id: string;
  name: string;
  description: string;
  region: string;
  difficulty: number; // 1-10
  requiredLevel: number;
  bossName?: string;
  bossRace: Race;
  rewardGold: number;
  rewardGems: number;
  rewardXp: number;
  rewardCardId?: string;
  x: number; // position on map (%)
  y: number;
}

export const CAMPAIGN_STAGES: CampaignStage[] = [
  // Region 1: Plaines
  { id: 'stage-1', name: 'Avant-poste Abandonné', description: 'Un ancien poste de garde envahi par des gobelins.', region: 'Plaines du Crépuscule', difficulty: 1, requiredLevel: 1, bossRace: 'GOBELINS_GNOLLS', rewardGold: 200, rewardGems: 20, rewardXp: 50, x: 12, y: 78 },
  { id: 'stage-2', name: 'Forêt des Murmures', description: 'Les arbres cachent des créatures elfiques hostiles.', region: 'Plaines du Crépuscule', difficulty: 2, requiredLevel: 2, bossRace: 'ELFES', rewardGold: 300, rewardGems: 30, rewardXp: 80, rewardCardId: 'elf-01', x: 22, y: 68 },
  { id: 'stage-3', name: 'Col du Tonnerre', description: 'Les orcs ont établi un campement au sommet.', region: 'Plaines du Crépuscule', difficulty: 3, requiredLevel: 3, bossRace: 'ORCS_TROLLS', rewardGold: 400, rewardGems: 40, rewardXp: 120, x: 30, y: 55 },
  // Region 2: Montagnes
  { id: 'stage-4', name: 'Mines de Khazgrim', description: 'Les nains défendent jalousement leurs mines.', region: 'Montagnes Brisées', difficulty: 4, requiredLevel: 5, bossName: 'Brunhild Forgeflamme', bossRace: 'HUMAINS_NAINS', rewardGold: 500, rewardGems: 50, rewardXp: 150, rewardCardId: 'hn-03', x: 38, y: 42 },
  { id: 'stage-5', name: 'Caverne Toxique', description: 'Un nid de gnolls empoisonneurs bloque le chemin.', region: 'Montagnes Brisées', difficulty: 5, requiredLevel: 7, bossRace: 'GOBELINS_GNOLLS', rewardGold: 600, rewardGems: 60, rewardXp: 200, rewardCardId: 'gg-05', x: 48, y: 50 },
  { id: 'stage-6', name: "L'Arène Sanglante", description: "Les champions orcs vous défient dans l'arène.", region: 'Montagnes Brisées', difficulty: 6, requiredLevel: 8, bossName: "Grok'thar Briseciel", bossRace: 'ORCS_TROLLS', rewardGold: 800, rewardGems: 80, rewardXp: 250, rewardCardId: 'ot-06', x: 55, y: 38 },
  // Region 3: Forêt Sombre
  { id: 'stage-7', name: 'Bois Maudit', description: 'Les elfes noirs rodent dans les ombres.', region: 'Forêt Éternelle', difficulty: 7, requiredLevel: 10, bossRace: 'ELFES', rewardGold: 1000, rewardGems: 100, rewardXp: 300, rewardCardId: 'elf-06', x: 62, y: 28 },
  { id: 'stage-8', name: 'Tour du Nécromant', description: 'Un sorcier gobelin commande une armée de morts.', region: 'Forêt Éternelle', difficulty: 8, requiredLevel: 12, bossName: 'Skritch Doigts-Vifs', bossRace: 'GOBELINS_GNOLLS', rewardGold: 1200, rewardGems: 120, rewardXp: 400, rewardCardId: 'gg-08', x: 72, y: 35 },
  // Region 4: Citadelle
  { id: 'stage-9', name: 'Porte de la Citadelle', description: 'Les défenseurs humains protègent la dernière forteresse.', region: 'Citadelle Éternelle', difficulty: 9, requiredLevel: 14, bossName: 'Tharion le Juste', bossRace: 'HUMAINS_NAINS', rewardGold: 1500, rewardGems: 150, rewardXp: 500, rewardCardId: 'hn-08', x: 80, y: 25 },
  { id: 'stage-10', name: 'Trône des Échos', description: 'Le boss final vous attend au sommet de la Citadelle.', region: 'Citadelle Éternelle', difficulty: 10, requiredLevel: 15, bossName: 'Seigneur des Échos', bossRace: 'ORCS_TROLLS', rewardGold: 3000, rewardGems: 300, rewardXp: 1000, rewardCardId: 'ot-08', x: 88, y: 18 },
];

export const REGIONS = ['Plaines du Crépuscule', 'Montagnes Brisées', 'Forêt Éternelle', 'Citadelle Éternelle'];

export const REGION_COLORS: Record<string, string> = {
  'Plaines du Crépuscule': '#4ade80',
  'Montagnes Brisées': '#c9a84c',
  'Forêt Éternelle': '#a855f7',
  'Citadelle Éternelle': '#ef4444',
};
