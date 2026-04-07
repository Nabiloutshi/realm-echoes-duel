export type Race = 'HUMAINS_NAINS' | 'ELFES' | 'ORCS_TROLLS' | 'GOBELINS_GNOLLS';
export type Rarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
export type AIDifficulty = 'NOVICE' | 'SCHOLAR' | 'MASTER';
export type GameStatus = 'PLAYING' | 'VICTORY' | 'DEFEAT';
export type PlayerSide = 'player' | 'opponent';

export type EffectCode =
  | 'SHIELD' | 'HEAL' | 'BLESSING' | 'IMMOVABLE' | 'REBIRTH'
  | 'TAUNT' | 'POISON' | 'RAGE' | 'DEATH_BURST' | 'SUMMON'
  | 'CORRUPT' | 'STEALTH' | 'RIPOSTE' | 'DOUBLE_STRIKE' | 'LIFESTEAL';

export type EffectTrigger = 'PASSIVE' | 'ON_ENTER' | 'ON_DEATH' | 'PER_TURN' | 'ON_ATTACK' | 'ON_DEFEND';

export interface CardEffect {
  code: EffectCode;
  value: number;
  trigger: EffectTrigger;
}

export interface CardDefinition {
  id: string;
  slug: string;
  name: string;
  race: Race;
  rarity: Rarity;
  cardType: 'UNIT';
  cost: number;
  atk: number;
  hp: number;
  speed: number;
  effects: CardEffect[];
  artUrl?: string;
  level?: number;
}

export interface BoardUnit {
  instanceId: string;
  cardId: string;
  card: CardDefinition;
  currentAtk: number;
  currentHp: number;
  maxHp: number;
  currentShield: number;
  poisonStacks: number;
  wait: number;
  hasAttacked: boolean;
  hasRebirth: boolean;
  rebirthHp: number;
  animState?: 'spawning' | 'attacking' | 'damaged' | 'dying' | 'healing' | 'idle';
  level: number;
}

export interface HeroDefinition {
  id: string;
  name: string;
  race: Race;
  hp: number;
  skillName: string;
  skillDescription: string;
  artUrl?: string;
}

export interface HeroState {
  hero: HeroDefinition;
  currentHp: number;
  maxHp: number;
  level: number;
}

export interface FloatingNumber {
  id: string;
  slotIndex: number;
  side: PlayerSide;
  value: number;
  type: 'damage' | 'heal' | 'shield' | 'poison';
}

export interface HeroFloatingNumber {
  id: string;
  side: PlayerSide;
  value: number;
  type: 'damage' | 'heal';
}

export interface CombatEvent {
  round: number;
  type: 'ATTACK' | 'DAMAGE' | 'HEAL' | 'DEATH' | 'HERO_DAMAGE' | 'EFFECT' | 'ROUND_START' | 'GAME_OVER' | 'POISON' | 'SHIELD';
  actorSide: PlayerSide;
  sourceCardName?: string;
  targetCardName?: string;
  value?: number;
  message: string;
}

export interface GameState {
  round: number;
  status: GameStatus;
  player: {
    hero: HeroState;
    board: (BoardUnit | null)[];
  };
  opponent: {
    hero: HeroState;
    board: (BoardUnit | null)[];
  };
  events: CombatEvent[];
  floatingNumbers: FloatingNumber[];
  heroFloatingNumbers: HeroFloatingNumber[];
  aiDifficulty: AIDifficulty;
  isAutoBattle: boolean;
  battleSpeed: number;
}

export interface DeckSlot {
  heroId: string;
  cardIds: string[]; // up to 10 creatures
}

export const RACE_INFO: Record<Race, { label: string; color: string; icon: string }> = {
  HUMAINS_NAINS: { label: 'Humains & Nains', color: '#c9a84c', icon: '⚔' },
  ELFES: { label: 'Elfes', color: '#4ade80', icon: '🌿' },
  ORCS_TROLLS: { label: 'Orcs & Trolls', color: '#ef4444', icon: '🔥' },
  GOBELINS_GNOLLS: { label: 'Gobelins & Gnolls', color: '#a855f7', icon: '💀' },
};
