export type Faction = 'SOLARI' | 'UMBRA';
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
  faction: Faction;
  rarity: Rarity;
  cardType: 'UNIT' | 'SPELL' | 'RELIC';
  cost: number;
  atk: number;
  hp: number;
  speed: number; // initial wait timer
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
  wait: number; // countdown - attacks when 0
  hasAttacked: boolean;
  hasRebirth: boolean;
  rebirthHp: number;
  animState?: 'spawning' | 'attacking' | 'damaged' | 'dying' | 'healing' | 'idle';
  level: number;
}

export interface HeroDefinition {
  id: string;
  name: string;
  faction: Faction;
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
    board: (BoardUnit | null)[]; // 5 slots
  };
  opponent: {
    hero: HeroState;
    board: (BoardUnit | null)[]; // 5 slots
  };
  events: CombatEvent[];
  floatingNumbers: FloatingNumber[];
  heroFloatingNumbers: HeroFloatingNumber[];
  aiDifficulty: AIDifficulty;
  isAutoBattle: boolean;
  battleSpeed: number; // 1 or 2
}
