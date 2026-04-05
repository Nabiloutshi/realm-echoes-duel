import { CardDefinition, Faction } from '@/engine/types';

export const ALL_CARDS: CardDefinition[] = [
  // ═══ SOLARI UNITS ═══
  {
    id: 'sol-01', slug: 'gardien-aube', name: "Gardien de l'Aube",
    faction: 'SOLARI', rarity: 'COMMON', cardType: 'UNIT',
    cost: 2, atk: 2, hp: 5, speed: 2,
    effects: [{ code: 'SHIELD', value: 3, trigger: 'ON_ENTER' }],
  },
  {
    id: 'sol-02', slug: 'pretresse-solara', name: 'Prêtresse Solara',
    faction: 'SOLARI', rarity: 'RARE', cardType: 'UNIT',
    cost: 3, atk: 1, hp: 6, speed: 2,
    effects: [{ code: 'HEAL', value: 3, trigger: 'PER_TURN' }],
  },
  {
    id: 'sol-03', slug: 'chevalier-soleil', name: 'Chevalier du Soleil',
    faction: 'SOLARI', rarity: 'RARE', cardType: 'UNIT',
    cost: 4, atk: 5, hp: 7, speed: 3,
    effects: [
      { code: 'TAUNT', value: 0, trigger: 'PASSIVE' },
      { code: 'RIPOSTE', value: 2, trigger: 'ON_DEFEND' },
    ],
  },
  {
    id: 'sol-04', slug: 'seraphin-eternel', name: 'Séraphin Éternel',
    faction: 'SOLARI', rarity: 'EPIC', cardType: 'UNIT',
    cost: 6, atk: 6, hp: 10, speed: 3,
    effects: [
      { code: 'IMMOVABLE', value: 0, trigger: 'PASSIVE' },
      { code: 'BLESSING', value: 2, trigger: 'ON_ENTER' },
      { code: 'REBIRTH', value: 4, trigger: 'ON_DEATH' },
    ],
  },
  {
    id: 'sol-05', slug: 'eclaireur-solaire', name: 'Éclaireur Solaire',
    faction: 'SOLARI', rarity: 'COMMON', cardType: 'UNIT',
    cost: 1, atk: 2, hp: 2, speed: 3, effects: [],
  },
  {
    id: 'sol-06', slug: 'vierge-bouclier', name: 'Vierge Bouclier',
    faction: 'SOLARI', rarity: 'COMMON', cardType: 'UNIT',
    cost: 2, atk: 1, hp: 6, speed: 2,
    effects: [{ code: 'TAUNT', value: 0, trigger: 'PASSIVE' }],
  },
  {
    id: 'sol-07', slug: 'archer-aube', name: "Archer de l'Aube",
    faction: 'SOLARI', rarity: 'COMMON', cardType: 'UNIT',
    cost: 2, atk: 3, hp: 3, speed: 3, effects: [],
  },
  {
    id: 'sol-08', slug: 'paladin-solaire', name: 'Paladin Solaire',
    faction: 'SOLARI', rarity: 'RARE', cardType: 'UNIT',
    cost: 3, atk: 3, hp: 6, speed: 2,
    effects: [
      { code: 'SHIELD', value: 2, trigger: 'ON_ENTER' },
      { code: 'TAUNT', value: 0, trigger: 'PASSIVE' },
    ],
  },
  {
    id: 'sol-09', slug: 'rempart-dore', name: 'Rempart Doré',
    faction: 'SOLARI', rarity: 'RARE', cardType: 'UNIT',
    cost: 4, atk: 2, hp: 10, speed: 1,
    effects: [
      { code: 'TAUNT', value: 0, trigger: 'PASSIVE' },
      { code: 'SHIELD', value: 2, trigger: 'ON_ENTER' },
    ],
  },
  {
    id: 'sol-10', slug: 'heraut-solaire', name: 'Héraut Solaire',
    faction: 'SOLARI', rarity: 'COMMON', cardType: 'UNIT',
    cost: 3, atk: 2, hp: 4, speed: 2,
    effects: [{ code: 'BLESSING', value: 1, trigger: 'ON_ENTER' }],
  },
  {
    id: 'sol-11', slug: 'aureus-lame-sacree', name: 'Aureus Lame Sacrée',
    faction: 'SOLARI', rarity: 'LEGENDARY', cardType: 'UNIT',
    cost: 8, atk: 10, hp: 15, speed: 4,
    effects: [
      { code: 'DOUBLE_STRIKE', value: 0, trigger: 'PASSIVE' },
      { code: 'IMMOVABLE', value: 0, trigger: 'PASSIVE' },
      { code: 'BLESSING', value: 3, trigger: 'ON_ENTER' },
    ],
  },
  // ═══ SOLARI SPELLS/RELICS ═══
  {
    id: 'sol-sp1', slug: 'lumiere-purifiante', name: 'Lumière Purifiante',
    faction: 'SOLARI', rarity: 'COMMON', cardType: 'SPELL',
    cost: 2, atk: 0, hp: 0, speed: 0,
    effects: [{ code: 'HEAL', value: 5, trigger: 'ON_ENTER' }],
  },
  {
    id: 'sol-sp2', slug: 'frappe-sacree', name: 'Frappe Sacrée',
    faction: 'SOLARI', rarity: 'COMMON', cardType: 'SPELL',
    cost: 2, atk: 0, hp: 0, speed: 0,
    effects: [{ code: 'HEAL', value: 4, trigger: 'ON_ENTER' }],
  },
  {
    id: 'sol-sp3', slug: 'protection-divine', name: 'Protection Divine',
    faction: 'SOLARI', rarity: 'COMMON', cardType: 'SPELL',
    cost: 1, atk: 0, hp: 0, speed: 0,
    effects: [{ code: 'SHIELD', value: 4, trigger: 'ON_ENTER' }],
  },
  {
    id: 'sol-rl1', slug: 'sanctuaire-lumiere', name: 'Sanctuaire de Lumière',
    faction: 'SOLARI', rarity: 'EPIC', cardType: 'RELIC',
    cost: 4, atk: 0, hp: 0, speed: 0,
    effects: [{ code: 'SHIELD', value: 1, trigger: 'PER_TURN' }],
  },
  // ═══ UMBRA UNITS ═══
  {
    id: 'umb-01', slug: 'specter-venimeux', name: 'Spectre Venimeux',
    faction: 'UMBRA', rarity: 'COMMON', cardType: 'UNIT',
    cost: 2, atk: 3, hp: 3, speed: 3,
    effects: [{ code: 'POISON', value: 1, trigger: 'ON_ATTACK' }],
  },
  {
    id: 'umb-02', slug: 'tisseuse-ombres', name: "Tisseuse d'Ombres",
    faction: 'UMBRA', rarity: 'RARE', cardType: 'UNIT',
    cost: 3, atk: 2, hp: 4, speed: 3,
    effects: [
      { code: 'SUMMON', value: 2, trigger: 'ON_ENTER' },
      { code: 'STEALTH', value: 0, trigger: 'PASSIVE' },
    ],
  },
  {
    id: 'umb-03', slug: 'ravageur-cramoisi', name: 'Ravageur Cramoisi',
    faction: 'UMBRA', rarity: 'RARE', cardType: 'UNIT',
    cost: 3, atk: 4, hp: 5, speed: 4,
    effects: [
      { code: 'RAGE', value: 3, trigger: 'ON_ATTACK' },
      { code: 'DEATH_BURST', value: 3, trigger: 'ON_DEATH' },
    ],
  },
  {
    id: 'umb-04', slug: 'archimage-pestilence', name: 'Archimage de Pestilence',
    faction: 'UMBRA', rarity: 'EPIC', cardType: 'UNIT',
    cost: 5, atk: 4, hp: 8, speed: 2,
    effects: [{ code: 'POISON', value: 2, trigger: 'ON_ENTER' }],
  },
  {
    id: 'umb-05', slug: 'diablotin-ombres', name: 'Diablotin des Ombres',
    faction: 'UMBRA', rarity: 'COMMON', cardType: 'UNIT',
    cost: 1, atk: 2, hp: 1, speed: 4,
    effects: [{ code: 'DEATH_BURST', value: 3, trigger: 'ON_DEATH' }],
  },
  {
    id: 'umb-06', slug: 'porteur-peste', name: 'Porteur de Peste',
    faction: 'UMBRA', rarity: 'COMMON', cardType: 'UNIT',
    cost: 2, atk: 2, hp: 3, speed: 2,
    effects: [{ code: 'POISON', value: 1, trigger: 'ON_ATTACK' }],
  },
  {
    id: 'umb-07', slug: 'traqueur-umbra', name: 'Traqueur Umbra',
    faction: 'UMBRA', rarity: 'COMMON', cardType: 'UNIT',
    cost: 2, atk: 3, hp: 3, speed: 4,
    effects: [{ code: 'STEALTH', value: 0, trigger: 'PASSIVE' }],
  },
  {
    id: 'umb-08', slug: 'cultiste-vide', name: 'Cultiste du Vide',
    faction: 'UMBRA', rarity: 'COMMON', cardType: 'UNIT',
    cost: 3, atk: 3, hp: 4, speed: 2,
    effects: [{ code: 'RAGE', value: 2, trigger: 'ON_ATTACK' }],
  },
  {
    id: 'umb-09', slug: 'collecteur-os', name: "Collecteur d'Os",
    faction: 'UMBRA', rarity: 'RARE', cardType: 'UNIT',
    cost: 4, atk: 4, hp: 5, speed: 3,
    effects: [
      { code: 'LIFESTEAL', value: 2, trigger: 'ON_ATTACK' },
      { code: 'DEATH_BURST', value: 3, trigger: 'ON_DEATH' },
    ],
  },
  {
    id: 'umb-10', slug: 'heraut-vide', name: 'Héraut du Vide',
    faction: 'UMBRA', rarity: 'COMMON', cardType: 'UNIT',
    cost: 3, atk: 2, hp: 5, speed: 2,
    effects: [{ code: 'SUMMON', value: 1, trigger: 'ON_ENTER' }],
  },
  {
    id: 'umb-11', slug: 'assassin-ombres', name: 'Assassin des Ombres',
    faction: 'UMBRA', rarity: 'EPIC', cardType: 'UNIT',
    cost: 4, atk: 5, hp: 4, speed: 5,
    effects: [
      { code: 'STEALTH', value: 0, trigger: 'PASSIVE' },
      { code: 'DOUBLE_STRIKE', value: 0, trigger: 'PASSIVE' },
    ],
  },
  {
    id: 'umb-12', slug: 'vexar-maitre-neant', name: 'Vexar Maître du Néant',
    faction: 'UMBRA', rarity: 'LEGENDARY', cardType: 'UNIT',
    cost: 9, atk: 8, hp: 12, speed: 5,
    effects: [
      { code: 'POISON', value: 3, trigger: 'ON_ATTACK' },
      { code: 'SUMMON', value: 3, trigger: 'ON_DEATH' },
      { code: 'LIFESTEAL', value: 2, trigger: 'ON_ATTACK' },
    ],
  },
  // ═══ UMBRA SPELLS/RELICS ═══
  {
    id: 'umb-sp1', slug: 'brume-toxique', name: 'Brume Toxique',
    faction: 'UMBRA', rarity: 'COMMON', cardType: 'SPELL',
    cost: 2, atk: 0, hp: 0, speed: 0,
    effects: [{ code: 'POISON', value: 2, trigger: 'ON_ENTER' }],
  },
  {
    id: 'umb-sp2', slug: 'pacte-sombre', name: 'Pacte Sombre',
    faction: 'UMBRA', rarity: 'COMMON', cardType: 'SPELL',
    cost: 2, atk: 0, hp: 0, speed: 0,
    effects: [{ code: 'POISON', value: 3, trigger: 'ON_ENTER' }],
  },
  {
    id: 'umb-rl1', slug: 'autel-ames-perdues', name: 'Autel des Âmes Perdues',
    faction: 'UMBRA', rarity: 'EPIC', cardType: 'RELIC',
    cost: 5, atk: 0, hp: 0, speed: 0,
    effects: [{ code: 'DEATH_BURST', value: 2, trigger: 'PASSIVE' }],
  },
];

// Shadow token generated by SUMMON
export const SHADOW_TOKEN: CardDefinition = {
  id: 'token-shadow', slug: 'shadow-token', name: "Ombre d'Écho",
  faction: 'UMBRA', rarity: 'COMMON', cardType: 'UNIT',
  cost: 0, atk: 1, hp: 1, speed: 1, effects: [],
};

export function getSolariCards() { return ALL_CARDS.filter(c => c.faction === 'SOLARI'); }
export function getUmbraCards() { return ALL_CARDS.filter(c => c.faction === 'UMBRA'); }

export function buildDefaultDeck(faction: Faction): CardDefinition[] {
  const factionCards = ALL_CARDS.filter(c => c.faction === faction);
  const deck: CardDefinition[] = [];
  for (const card of factionCards) {
    const copies = card.rarity === 'LEGENDARY' ? 1 : 2;
    for (let i = 0; i < copies; i++) deck.push({ ...card });
  }
  // Fill to 30 by duplicating commons
  const commons = factionCards.filter(c => c.rarity === 'COMMON');
  let ci = 0;
  while (deck.length < 30) {
    deck.push({ ...commons[ci % commons.length] });
    ci++;
  }
  return deck.slice(0, 30);
}
