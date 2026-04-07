import { CardDefinition, Race } from '@/engine/types';

export const ALL_CARDS: CardDefinition[] = [
  // ═══════════════════════════════════════
  // HUMAINS & NAINS — Défensifs, boucliers
  // ═══════════════════════════════════════
  {
    id: 'hn-01', slug: 'gardien-muraille', name: 'Gardien de la Muraille',
    race: 'HUMAINS_NAINS', rarity: 'COMMON', cardType: 'UNIT',
    cost: 2, atk: 3, hp: 6, speed: 2,
    effects: [{ code: 'SHIELD', value: 3, trigger: 'ON_ENTER' }],
  },
  {
    id: 'hn-02', slug: 'clerc-lumiere', name: 'Clerc de Lumière',
    race: 'HUMAINS_NAINS', rarity: 'RARE', cardType: 'UNIT',
    cost: 3, atk: 2, hp: 7, speed: 2,
    effects: [{ code: 'HEAL', value: 3, trigger: 'PER_TURN' }],
  },
  {
    id: 'hn-03', slug: 'chevalier-couronne', name: 'Chevalier de la Couronne',
    race: 'HUMAINS_NAINS', rarity: 'RARE', cardType: 'UNIT',
    cost: 4, atk: 5, hp: 8, speed: 3,
    effects: [
      { code: 'TAUNT', value: 0, trigger: 'PASSIVE' },
      { code: 'RIPOSTE', value: 2, trigger: 'ON_DEFEND' },
    ],
  },
  {
    id: 'hn-04', slug: 'forgeron-nain', name: 'Forgeron Nain',
    race: 'HUMAINS_NAINS', rarity: 'COMMON', cardType: 'UNIT',
    cost: 2, atk: 2, hp: 5, speed: 2,
    effects: [{ code: 'BLESSING', value: 1, trigger: 'ON_ENTER' }],
  },
  {
    id: 'hn-05', slug: 'fantassin-royal', name: 'Fantassin Royal',
    race: 'HUMAINS_NAINS', rarity: 'COMMON', cardType: 'UNIT',
    cost: 1, atk: 3, hp: 3, speed: 3, effects: [],
  },
  {
    id: 'hn-06', slug: 'paladin-serment', name: 'Paladin du Serment',
    race: 'HUMAINS_NAINS', rarity: 'EPIC', cardType: 'UNIT',
    cost: 6, atk: 6, hp: 12, speed: 3,
    effects: [
      { code: 'TAUNT', value: 0, trigger: 'PASSIVE' },
      { code: 'SHIELD', value: 4, trigger: 'ON_ENTER' },
      { code: 'REBIRTH', value: 5, trigger: 'ON_DEATH' },
    ],
  },
  {
    id: 'hn-07', slug: 'arbaletrier-rempart', name: 'Arbalétrier du Rempart',
    race: 'HUMAINS_NAINS', rarity: 'COMMON', cardType: 'UNIT',
    cost: 2, atk: 4, hp: 3, speed: 3, effects: [],
  },
  {
    id: 'hn-08', slug: 'seigneur-montagne', name: 'Seigneur de la Montagne',
    race: 'HUMAINS_NAINS', rarity: 'LEGENDARY', cardType: 'UNIT',
    cost: 8, atk: 8, hp: 16, speed: 4,
    effects: [
      { code: 'IMMOVABLE', value: 0, trigger: 'PASSIVE' },
      { code: 'BLESSING', value: 3, trigger: 'ON_ENTER' },
      { code: 'DOUBLE_STRIKE', value: 0, trigger: 'PASSIVE' },
    ],
  },

  // ═══════════════════════════════════════
  // ELFES — Soins, furtivité, agilité
  // ═══════════════════════════════════════
  {
    id: 'elf-01', slug: 'archer-sylvestre', name: 'Archer Sylvestre',
    race: 'ELFES', rarity: 'COMMON', cardType: 'UNIT',
    cost: 2, atk: 4, hp: 3, speed: 4, effects: [],
  },
  {
    id: 'elf-02', slug: 'druidesse-bosquet', name: 'Druidesse du Bosquet',
    race: 'ELFES', rarity: 'RARE', cardType: 'UNIT',
    cost: 3, atk: 2, hp: 6, speed: 2,
    effects: [{ code: 'HEAL', value: 4, trigger: 'PER_TURN' }],
  },
  {
    id: 'elf-03', slug: 'lame-crepuscule', name: 'Lame du Crépuscule',
    race: 'ELFES', rarity: 'RARE', cardType: 'UNIT',
    cost: 3, atk: 5, hp: 4, speed: 4,
    effects: [
      { code: 'STEALTH', value: 0, trigger: 'PASSIVE' },
      { code: 'DOUBLE_STRIKE', value: 0, trigger: 'PASSIVE' },
    ],
  },
  {
    id: 'elf-04', slug: 'gardien-racines', name: 'Gardien des Racines',
    race: 'ELFES', rarity: 'COMMON', cardType: 'UNIT',
    cost: 2, atk: 2, hp: 7, speed: 2,
    effects: [{ code: 'TAUNT', value: 0, trigger: 'PASSIVE' }],
  },
  {
    id: 'elf-05', slug: 'tisseuse-lune', name: 'Tisseuse de Lune',
    race: 'ELFES', rarity: 'EPIC', cardType: 'UNIT',
    cost: 5, atk: 4, hp: 9, speed: 3,
    effects: [
      { code: 'HEAL', value: 3, trigger: 'PER_TURN' },
      { code: 'BLESSING', value: 2, trigger: 'ON_ENTER' },
    ],
  },
  {
    id: 'elf-06', slug: 'assassin-nuit', name: "Assassin de la Nuit",
    race: 'ELFES', rarity: 'EPIC', cardType: 'UNIT',
    cost: 4, atk: 6, hp: 4, speed: 5,
    effects: [
      { code: 'STEALTH', value: 0, trigger: 'PASSIVE' },
      { code: 'POISON', value: 2, trigger: 'ON_ATTACK' },
    ],
  },
  {
    id: 'elf-07', slug: 'sentinelle-etoiles', name: 'Sentinelle des Étoiles',
    race: 'ELFES', rarity: 'COMMON', cardType: 'UNIT',
    cost: 1, atk: 2, hp: 2, speed: 4, effects: [],
  },
  {
    id: 'elf-08', slug: 'reine-sylvaine', name: 'Reine Sylvaine',
    race: 'ELFES', rarity: 'LEGENDARY', cardType: 'UNIT',
    cost: 9, atk: 7, hp: 14, speed: 3,
    effects: [
      { code: 'HEAL', value: 5, trigger: 'PER_TURN' },
      { code: 'REBIRTH', value: 6, trigger: 'ON_DEATH' },
      { code: 'BLESSING', value: 3, trigger: 'ON_ENTER' },
    ],
  },

  // ═══════════════════════════════════════
  // ORCS & TROLLS — Rage, force brute
  // ═══════════════════════════════════════
  {
    id: 'ot-01', slug: 'berserker-sang', name: 'Berserker du Sang',
    race: 'ORCS_TROLLS', rarity: 'COMMON', cardType: 'UNIT',
    cost: 2, atk: 5, hp: 3, speed: 3,
    effects: [{ code: 'RAGE', value: 2, trigger: 'ON_ATTACK' }],
  },
  {
    id: 'ot-02', slug: 'chaman-totem', name: 'Chaman au Totem',
    race: 'ORCS_TROLLS', rarity: 'RARE', cardType: 'UNIT',
    cost: 3, atk: 3, hp: 5, speed: 2,
    effects: [{ code: 'HEAL', value: 2, trigger: 'PER_TURN' }],
  },
  {
    id: 'ot-03', slug: 'brute-demolisseur', name: 'Brute Démolisseur',
    race: 'ORCS_TROLLS', rarity: 'RARE', cardType: 'UNIT',
    cost: 4, atk: 7, hp: 6, speed: 4,
    effects: [
      { code: 'RAGE', value: 3, trigger: 'ON_ATTACK' },
      { code: 'DEATH_BURST', value: 3, trigger: 'ON_DEATH' },
    ],
  },
  {
    id: 'ot-04', slug: 'troll-regenerant', name: 'Troll Régénérant',
    race: 'ORCS_TROLLS', rarity: 'COMMON', cardType: 'UNIT',
    cost: 3, atk: 3, hp: 8, speed: 2,
    effects: [{ code: 'REBIRTH', value: 3, trigger: 'ON_DEATH' }],
  },
  {
    id: 'ot-05', slug: 'gueulard-orc', name: 'Gueulard Orc',
    race: 'ORCS_TROLLS', rarity: 'COMMON', cardType: 'UNIT',
    cost: 1, atk: 4, hp: 2, speed: 3,
    effects: [{ code: 'DEATH_BURST', value: 2, trigger: 'ON_DEATH' }],
  },
  {
    id: 'ot-06', slug: 'champion-arene', name: "Champion de l'Arène",
    race: 'ORCS_TROLLS', rarity: 'EPIC', cardType: 'UNIT',
    cost: 6, atk: 9, hp: 10, speed: 4,
    effects: [
      { code: 'RAGE', value: 4, trigger: 'ON_ATTACK' },
      { code: 'LIFESTEAL', value: 3, trigger: 'ON_ATTACK' },
    ],
  },
  {
    id: 'ot-07', slug: 'lancier-clan', name: 'Lancier du Clan',
    race: 'ORCS_TROLLS', rarity: 'COMMON', cardType: 'UNIT',
    cost: 2, atk: 4, hp: 4, speed: 3, effects: [],
  },
  {
    id: 'ot-08', slug: 'seigneur-guerre', name: 'Seigneur de Guerre Orc',
    race: 'ORCS_TROLLS', rarity: 'LEGENDARY', cardType: 'UNIT',
    cost: 9, atk: 12, hp: 14, speed: 5,
    effects: [
      { code: 'RAGE', value: 5, trigger: 'ON_ATTACK' },
      { code: 'DOUBLE_STRIKE', value: 0, trigger: 'PASSIVE' },
      { code: 'DEATH_BURST', value: 5, trigger: 'ON_DEATH' },
    ],
  },

  // ═══════════════════════════════════════
  // GOBELINS & GNOLLS — Poison, ruse, essaim
  // ═══════════════════════════════════════
  {
    id: 'gg-01', slug: 'sapeur-gobelin', name: 'Sapeur Gobelin',
    race: 'GOBELINS_GNOLLS', rarity: 'COMMON', cardType: 'UNIT',
    cost: 1, atk: 3, hp: 2, speed: 4,
    effects: [{ code: 'DEATH_BURST', value: 3, trigger: 'ON_DEATH' }],
  },
  {
    id: 'gg-02', slug: 'empoisonneur-gnoll', name: 'Empoisonneur Gnoll',
    race: 'GOBELINS_GNOLLS', rarity: 'COMMON', cardType: 'UNIT',
    cost: 2, atk: 3, hp: 3, speed: 3,
    effects: [{ code: 'POISON', value: 2, trigger: 'ON_ATTACK' }],
  },
  {
    id: 'gg-03', slug: 'invocateur-meute', name: 'Invocateur de Meute',
    race: 'GOBELINS_GNOLLS', rarity: 'RARE', cardType: 'UNIT',
    cost: 3, atk: 2, hp: 4, speed: 3,
    effects: [
      { code: 'SUMMON', value: 2, trigger: 'ON_ENTER' },
      { code: 'STEALTH', value: 0, trigger: 'PASSIVE' },
    ],
  },
  {
    id: 'gg-04', slug: 'traqueur-gnoll', name: 'Traqueur Gnoll',
    race: 'GOBELINS_GNOLLS', rarity: 'COMMON', cardType: 'UNIT',
    cost: 2, atk: 4, hp: 3, speed: 4,
    effects: [{ code: 'STEALTH', value: 0, trigger: 'PASSIVE' }],
  },
  {
    id: 'gg-05', slug: 'alchimiste-gobelin', name: 'Alchimiste Gobelin',
    race: 'GOBELINS_GNOLLS', rarity: 'RARE', cardType: 'UNIT',
    cost: 3, atk: 3, hp: 5, speed: 3,
    effects: [{ code: 'POISON', value: 3, trigger: 'ON_ENTER' }],
  },
  {
    id: 'gg-06', slug: 'hyene-alpha', name: 'Hyène Alpha',
    race: 'GOBELINS_GNOLLS', rarity: 'EPIC', cardType: 'UNIT',
    cost: 5, atk: 6, hp: 7, speed: 4,
    effects: [
      { code: 'POISON', value: 2, trigger: 'ON_ATTACK' },
      { code: 'LIFESTEAL', value: 2, trigger: 'ON_ATTACK' },
    ],
  },
  {
    id: 'gg-07', slug: 'pillard-gobelin', name: 'Pillard Gobelin',
    race: 'GOBELINS_GNOLLS', rarity: 'COMMON', cardType: 'UNIT',
    cost: 2, atk: 3, hp: 3, speed: 3,
    effects: [{ code: 'CORRUPT', value: 1, trigger: 'ON_ATTACK' }],
  },
  {
    id: 'gg-08', slug: 'roi-charognard', name: 'Roi Charognard',
    race: 'GOBELINS_GNOLLS', rarity: 'LEGENDARY', cardType: 'UNIT',
    cost: 8, atk: 7, hp: 12, speed: 5,
    effects: [
      { code: 'POISON', value: 3, trigger: 'ON_ATTACK' },
      { code: 'SUMMON', value: 3, trigger: 'ON_DEATH' },
      { code: 'LIFESTEAL', value: 3, trigger: 'ON_ATTACK' },
    ],
  },
];

export const SHADOW_TOKEN: CardDefinition = {
  id: 'token-shadow', slug: 'shadow-token', name: "Créature d'Ombre",
  race: 'GOBELINS_GNOLLS', rarity: 'COMMON', cardType: 'UNIT',
  cost: 0, atk: 1, hp: 1, speed: 1, effects: [],
};

export function getCardsByRace(race: Race) { return ALL_CARDS.filter(c => c.race === race); }

export function buildDefaultDeck(race: Race): CardDefinition[] {
  const raceCards = ALL_CARDS.filter(c => c.race === race);
  return [...raceCards].sort((a, b) => (b.atk * 2 + b.hp) - (a.atk * 2 + a.hp)).slice(0, 10);
}
