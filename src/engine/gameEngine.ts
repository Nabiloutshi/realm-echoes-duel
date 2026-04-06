import {
  GameState, BoardUnit, CardDefinition, HeroDefinition, HeroState,
  CombatEvent, FloatingNumber, HeroFloatingNumber, AIDifficulty, PlayerSide,
} from './types';

let _uid = 0;
function uid() { return `u-${++_uid}-${Date.now()}`; }

function createBoardUnit(card: CardDefinition, level: number = 1): BoardUnit {
  const hpMult = 1 + (level - 1) * 0.15;
  const atkMult = 1 + (level - 1) * 0.12;
  const baseHp = Math.round(card.hp * 100 * hpMult);
  const baseAtk = Math.round(card.atk * 50 * atkMult);

  return {
    instanceId: uid(),
    cardId: card.id,
    card,
    currentAtk: baseAtk,
    currentHp: baseHp,
    maxHp: baseHp,
    currentShield: 0,
    poisonStacks: 0,
    wait: card.speed,
    hasAttacked: false,
    hasRebirth: card.effects.some(e => e.code === 'REBIRTH'),
    rebirthHp: Math.round((card.effects.find(e => e.code === 'REBIRTH')?.value || 0) * 100 * hpMult),
    animState: 'spawning',
    level,
  };
}

function createHeroState(hero: HeroDefinition, level: number = 1): HeroState {
  const hp = Math.round(hero.hp * (1 + (level - 1) * 0.1));
  return { hero, currentHp: hp, maxHp: hp, level };
}

export function createGame(
  playerHero: HeroDefinition,
  playerCards: CardDefinition[],
  opponentHero: HeroDefinition,
  opponentCards: CardDefinition[],
  difficulty: AIDifficulty,
  playerLevel: number = 1,
  opponentLevel: number = 1,
): GameState {
  _uid = 0;

  const playerBoard: (BoardUnit | null)[] = Array(5).fill(null);
  const opponentBoard: (BoardUnit | null)[] = Array(5).fill(null);

  playerCards.slice(0, 5).forEach((card, i) => {
    playerBoard[i] = createBoardUnit(card, playerLevel);
  });
  opponentCards.slice(0, 5).forEach((card, i) => {
    opponentBoard[i] = createBoardUnit(card, opponentLevel);
  });

  return {
    round: 0,
    status: 'PLAYING',
    player: { hero: createHeroState(playerHero, playerLevel), board: playerBoard },
    opponent: { hero: createHeroState(opponentHero, opponentLevel), board: opponentBoard },
    events: [],
    floatingNumbers: [],
    heroFloatingNumbers: [],
    aiDifficulty: difficulty,
    isAutoBattle: false,
    battleSpeed: 1,
  };
}

function cloneState(state: GameState): GameState {
  return JSON.parse(JSON.stringify(state));
}

function addEvent(state: GameState, ev: Omit<CombatEvent, 'round'>) {
  state.events.push({ ...ev, round: state.round });
}

function addFloating(state: GameState, slot: number, side: PlayerSide, value: number, type: FloatingNumber['type']) {
  state.floatingNumbers.push({ id: uid(), slotIndex: slot, side, value, type });
}

function addHeroFloating(state: GameState, side: PlayerSide, value: number, type: HeroFloatingNumber['type']) {
  state.heroFloatingNumbers.push({ id: uid(), side, value, type });
}

function dealDamageToUnit(state: GameState, unit: BoardUnit, damage: number, slot: number, side: PlayerSide): boolean {
  if (unit.currentShield > 0) {
    const absorbed = Math.min(unit.currentShield, damage);
    unit.currentShield -= absorbed;
    damage -= absorbed;
  }
  unit.currentHp -= damage;
  if (damage > 0) {
    unit.animState = 'damaged';
    addFloating(state, slot, side, -damage, 'damage');
  }
  if (unit.currentHp <= 0) {
    if (unit.hasRebirth && unit.rebirthHp > 0) {
      unit.currentHp = unit.rebirthHp;
      unit.hasRebirth = false;
      addEvent(state, { type: 'EFFECT', actorSide: side, sourceCardName: unit.card.name, message: `${unit.card.name} renaît avec ${unit.rebirthHp} PV!` });
      return false;
    }
    unit.animState = 'dying';
    return true;
  }
  return false;
}

function dealHeroDamage(state: GameState, side: PlayerSide, damage: number) {
  const hero = side === 'player' ? state.player.hero : state.opponent.hero;
  hero.currentHp = Math.max(0, hero.currentHp - damage);
  addHeroFloating(state, side, -damage, 'damage');
  addEvent(state, {
    type: 'HERO_DAMAGE', actorSide: side === 'player' ? 'opponent' : 'player',
    targetCardName: hero.hero.name, value: damage,
    message: `${hero.hero.name} subit ${damage} dégâts! (${hero.currentHp}/${hero.maxHp})`,
  });
}

function healUnit(state: GameState, unit: BoardUnit, amount: number, slot: number, side: PlayerSide) {
  const healed = Math.min(amount, unit.maxHp - unit.currentHp);
  if (healed > 0) {
    unit.currentHp += healed;
    unit.animState = 'healing';
    addFloating(state, slot, side, healed, 'heal');
  }
}

function processUnitAttack(state: GameState, attackerSlot: number, attackerSide: PlayerSide) {
  const attackerBoard = attackerSide === 'player' ? state.player.board : state.opponent.board;
  const attacker = attackerBoard[attackerSlot];
  if (!attacker || attacker.wait > 0 || attacker.hasAttacked) return;

  const defenderSide: PlayerSide = attackerSide === 'player' ? 'opponent' : 'player';
  const defenderBoard = defenderSide === 'player' ? state.player.board : state.opponent.board;

  attacker.animState = 'attacking';
  attacker.hasAttacked = true;

  // Find target: taunt first, then opposite slot, then first available
  let targetSlot = -1;
  const tauntSlot = defenderBoard.findIndex(u => u && u.currentHp > 0 && u.card.effects.some(e => e.code === 'TAUNT'));
  if (tauntSlot >= 0) {
    targetSlot = tauntSlot;
  } else if (defenderBoard[attackerSlot] && defenderBoard[attackerSlot]!.currentHp > 0) {
    targetSlot = attackerSlot;
  } else {
    targetSlot = defenderBoard.findIndex(u => u && u.currentHp > 0);
  }

  let damage = attacker.currentAtk;
  const rageEffect = attacker.card.effects.find(e => e.code === 'RAGE');
  if (rageEffect) damage += Math.round(rageEffect.value * 30);

  if (targetSlot >= 0 && defenderBoard[targetSlot]) {
    const target = defenderBoard[targetSlot]!;
    addEvent(state, {
      type: 'ATTACK', actorSide: attackerSide,
      sourceCardName: attacker.card.name, targetCardName: target.card.name,
      value: damage, message: `${attacker.card.name} → ${target.card.name} (${damage} dégâts)`,
    });

    const poisonEff = attacker.card.effects.find(e => e.code === 'POISON' && e.trigger === 'ON_ATTACK');
    if (poisonEff) target.poisonStacks += poisonEff.value;

    const lifestealEff = attacker.card.effects.find(e => e.code === 'LIFESTEAL');
    if (lifestealEff) {
      const heal = Math.round(lifestealEff.value * 20);
      healUnit(state, attacker, heal, attackerSlot, attackerSide);
    }

    const died = dealDamageToUnit(state, target, damage, targetSlot, defenderSide);

    if (!died) {
      const riposteEff = target.card.effects.find(e => e.code === 'RIPOSTE');
      if (riposteEff) {
        dealDamageToUnit(state, attacker, Math.round(riposteEff.value * 30), attackerSlot, attackerSide);
      }
    }

    if (died) {
      const deathBurst = target.card.effects.find(e => e.code === 'DEATH_BURST');
      if (deathBurst) {
        const heroSide = attackerSide; // death burst damages the attacker's hero
        dealHeroDamage(state, heroSide, Math.round(deathBurst.value * 30));
      }
      addEvent(state, { type: 'DEATH', actorSide: defenderSide, sourceCardName: target.card.name, message: `${target.card.name} détruit!` });
      defenderBoard[targetSlot] = null;
    }

    // Double strike
    if (attacker.card.effects.some(e => e.code === 'DOUBLE_STRIKE') && attacker.currentHp > 0 && !attacker.hasAttacked) {
      // already attacked once above, won't re-trigger in same call
    }
  } else {
    dealHeroDamage(state, defenderSide, damage);
    addEvent(state, {
      type: 'ATTACK', actorSide: attackerSide,
      sourceCardName: attacker.card.name, value: damage,
      message: `${attacker.card.name} attaque le héros! (${damage} dégâts)`,
    });
  }
}

function processStartOfRoundEffects(state: GameState) {
  for (const side of ['player', 'opponent'] as PlayerSide[]) {
    const board = side === 'player' ? state.player.board : state.opponent.board;
    for (let i = 0; i < 5; i++) {
      const unit = board[i];
      if (!unit || unit.currentHp <= 0) continue;

      // HEAL per turn — heal all allies
      const healEff = unit.card.effects.find(e => e.code === 'HEAL' && e.trigger === 'PER_TURN');
      if (healEff) {
        const amt = Math.round(healEff.value * 25);
        for (let j = 0; j < 5; j++) {
          const ally = board[j];
          if (ally && ally.currentHp > 0 && ally.currentHp < ally.maxHp) {
            healUnit(state, ally, amt, j, side);
          }
        }
      }

      // POISON damage
      if (unit.poisonStacks > 0) {
        const dmg = unit.poisonStacks * 20;
        addFloating(state, i, side, -dmg, 'poison');
        unit.currentHp -= dmg;
        if (unit.currentHp <= 0) {
          unit.animState = 'dying';
          addEvent(state, { type: 'POISON', actorSide: side, sourceCardName: unit.card.name, value: dmg, message: `${unit.card.name} meurt du poison!` });
          board[i] = null;
        }
      }

      // SHIELD per turn
      const shieldEff = unit.card.effects.find(e => e.code === 'SHIELD' && e.trigger === 'PER_TURN');
      if (shieldEff) {
        for (let j = 0; j < 5; j++) {
          const ally = board[j];
          if (ally && ally.currentHp > 0) {
            ally.currentShield += Math.round(shieldEff.value * 15);
            addFloating(state, j, side, shieldEff.value * 15, 'shield');
          }
        }
      }
    }
  }
}

export function processRound(state: GameState): GameState {
  const s = cloneState(state);
  s.floatingNumbers = [];
  s.heroFloatingNumbers = [];
  s.round += 1;

  addEvent(s, { type: 'ROUND_START', actorSide: 'player', message: `── Round ${s.round} ──` });

  // Decrease wait counters & reset
  for (const side of ['player', 'opponent'] as PlayerSide[]) {
    const board = side === 'player' ? s.player.board : s.opponent.board;
    for (const unit of board) {
      if (unit && unit.currentHp > 0) {
        if (unit.wait > 0) unit.wait--;
        unit.hasAttacked = false;
        unit.animState = 'idle';
      }
    }
  }

  processStartOfRoundEffects(s);

  // Player units attack
  for (let i = 0; i < 5; i++) {
    const u = s.player.board[i];
    if (u && u.currentHp > 0 && u.wait === 0) processUnitAttack(s, i, 'player');
  }
  if (s.opponent.hero.currentHp <= 0) {
    s.status = 'VICTORY';
    addEvent(s, { type: 'GAME_OVER', actorSide: 'player', message: 'VICTOIRE!' });
    return s;
  }

  // Opponent units attack
  for (let i = 0; i < 5; i++) {
    const u = s.opponent.board[i];
    if (u && u.currentHp > 0 && u.wait === 0) processUnitAttack(s, i, 'opponent');
  }
  if (s.player.hero.currentHp <= 0) {
    s.status = 'DEFEAT';
    addEvent(s, { type: 'GAME_OVER', actorSide: 'opponent', message: 'DÉFAITE!' });
    return s;
  }

  // Reset wait for units that attacked
  for (const side of ['player', 'opponent'] as PlayerSide[]) {
    const board = side === 'player' ? s.player.board : s.opponent.board;
    for (const unit of board) {
      if (unit && unit.hasAttacked) unit.wait = unit.card.speed;
    }
  }

  return s;
}
