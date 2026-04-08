export interface Artifact {
  id: string;
  name: string;
  rarity: 'RARE' | 'EPIC' | 'LEGENDARY';
  description: string;
  bonusAtk: number;
  bonusHp: number;
  bonusSpeed: number;
  icon: string;
}

export interface Equipment {
  id: string;
  name: string;
  slot: 'weapon' | 'armor' | 'accessory';
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  description: string;
  bonusAtk: number;
  bonusHp: number;
  bonusSpeed: number;
  icon: string;
}

export const ALL_ARTIFACTS: Artifact[] = [
  { id: 'art-01', name: 'Orbe du Néant', rarity: 'EPIC', description: '+200 ATQ à toutes les créatures', bonusAtk: 200, bonusHp: 0, bonusSpeed: 0, icon: '🔮' },
  { id: 'art-02', name: 'Calice de Vie', rarity: 'RARE', description: '+500 PV à toutes les créatures', bonusAtk: 0, bonusHp: 500, bonusSpeed: 0, icon: '🏆' },
  { id: 'art-03', name: 'Amulette de Célérité', rarity: 'RARE', description: '+1 Vitesse à toutes les créatures', bonusAtk: 0, bonusHp: 0, bonusSpeed: 1, icon: '📿' },
  { id: 'art-04', name: 'Crâne Ancien', rarity: 'LEGENDARY', description: '+400 ATQ et +800 PV', bonusAtk: 400, bonusHp: 800, bonusSpeed: 0, icon: '💀' },
  { id: 'art-05', name: 'Pierre de Foudre', rarity: 'EPIC', description: '+300 ATQ et +1 Vitesse', bonusAtk: 300, bonusHp: 0, bonusSpeed: 1, icon: '⚡' },
  { id: 'art-06', name: 'Sceau Draconique', rarity: 'LEGENDARY', description: '+500 ATQ, +1000 PV, +1 Vitesse', bonusAtk: 500, bonusHp: 1000, bonusSpeed: 1, icon: '🐉' },
];

export const ALL_EQUIPMENT: Equipment[] = [
  { id: 'eq-01', name: 'Épée du Crépuscule', slot: 'weapon', rarity: 'RARE', description: '+150 ATQ au héros', bonusAtk: 150, bonusHp: 0, bonusSpeed: 0, icon: '⚔' },
  { id: 'eq-02', name: 'Lame Infernale', slot: 'weapon', rarity: 'EPIC', description: '+350 ATQ au héros', bonusAtk: 350, bonusHp: 0, bonusSpeed: 0, icon: '🗡' },
  { id: 'eq-03', name: 'Faux du Destin', slot: 'weapon', rarity: 'LEGENDARY', description: '+600 ATQ au héros', bonusAtk: 600, bonusHp: 0, bonusSpeed: 0, icon: '⚜' },
  { id: 'eq-04', name: 'Cuirasse de Fer', slot: 'armor', rarity: 'COMMON', description: '+500 PV au héros', bonusAtk: 0, bonusHp: 500, bonusSpeed: 0, icon: '🛡' },
  { id: 'eq-05', name: 'Armure du Titan', slot: 'armor', rarity: 'EPIC', description: '+2000 PV au héros', bonusAtk: 0, bonusHp: 2000, bonusSpeed: 0, icon: '🏛' },
  { id: 'eq-06', name: 'Plastron Céleste', slot: 'armor', rarity: 'LEGENDARY', description: '+4000 PV au héros', bonusAtk: 0, bonusHp: 4000, bonusSpeed: 0, icon: '✨' },
  { id: 'eq-07', name: 'Anneau de Puissance', slot: 'accessory', rarity: 'RARE', description: '+100 ATQ, +300 PV', bonusAtk: 100, bonusHp: 300, bonusSpeed: 0, icon: '💍' },
  { id: 'eq-08', name: 'Cape des Ombres', slot: 'accessory', rarity: 'EPIC', description: '+200 ATQ, +1 Vitesse', bonusAtk: 200, bonusHp: 0, bonusSpeed: 1, icon: '🧥' },
  { id: 'eq-09', name: 'Couronne Éternelle', slot: 'accessory', rarity: 'LEGENDARY', description: '+400 ATQ, +2000 PV, +1 Vitesse', bonusAtk: 400, bonusHp: 2000, bonusSpeed: 1, icon: '👑' },
];

export const RARITY_COLORS: Record<string, string> = {
  COMMON: '#4a6741',
  RARE: '#3a6a8a',
  EPIC: '#7b3fa0',
  LEGENDARY: '#c9a84c',
};
