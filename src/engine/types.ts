export type Faction = 'SOLARI' | 'UMBRA';
export type CardType = 'UNIT' | 'SPELL' | 'RELIC';
export type Rarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
export type Phase = 'DRAW' | 'RESOURCE' | 'MAIN' | 'COMBAT' | 'EFFECTS' | 'END';
export type PlayerSide = 'player' | 'opponent';
export type AIDifficulty = 'NOVICE' | 'SCHOLAR' | 'MASTER';
export type GameStatus = 'PLAYING' | 'VICTORY' | 'DEFEAT';

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
  cardType: CardType;
  cost: number;
  atk: number;
  hp: number;
  speed: number;
  effects: CardEffect[];
  artUrl?: string;
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
  hasAttacked: boolean;
  attacksThisTurn: number;
  maxAttacks: number;
  hasRebirth: boolean;
  rebirthHp: number;
  animState?: 'spawning' | 'attacking' | 'damaged' | 'dying' | 'idle';
}

export interface PlayerState {
  side: PlayerSide;
  faction: Faction;
  hp: number;
  maxHp: number;
  shards: number;
  maxShards: number;
  hand: CardDefinition[];
  deck: CardDefinition[];
  board: (BoardUnit | null)[];
  name: string;
}

export interface GameEvent {
  turn: number;
  phase: Phase;
  type: 'DAMAGE' | 'HEAL' | 'SHIELD' | 'POISON' | 'DEATH' | 'PLAY' | 'DRAW' | 'TURN_START' | 'EFFECT' | 'ATTACK' | 'GAME_OVER';
  actorSide: PlayerSide;
  sourceCardName?: string;
  targetCardName?: string;
  value?: number;
  message: string;
}

export interface FloatingNumber {
  id: string;
  slotIndex: number;
  side: PlayerSide;
  value: number;
  type: 'damage' | 'heal' | 'shield' | 'poison';
}

export interface GameState {
  turn: number;
  phase: Phase;
  activeSide: PlayerSide;
  player: PlayerState;
  opponent: PlayerState;
  status: GameStatus;
  events: GameEvent[];
  selectedHandIndex: number | null;
  selectedAttackerSlot: number | null;
  aiDifficulty: AIDifficulty;
  floatingNumbers: FloatingNumber[];
}

export type GameAction =
  | { type: 'NEXT_PHASE' }
  | { type: 'PLAY_CARD'; handIndex: number; slotIndex: number }
  | { type: 'SELECT_HAND_CARD'; handIndex: number }
  | { type: 'SELECT_ATTACKER'; slotIndex: number }
  | { type: 'ATTACK_TARGET'; attackerSlot: number; targetSlot: number }
  | { type: 'ATTACK_PLAYER'; attackerSlot: number }
  | { type: 'DESELECT' };
