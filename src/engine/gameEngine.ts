import {
  GameState, PlayerState, BoardUnit, Phase, PlayerSide,
  CardDefinition, GameEvent, AIDifficulty, FloatingNumber, EffectCode,
} from './types';
import { SHADOW_TOKEN } from '@/data/cards';

let uid = 0;
const genId = () => `u-${++uid}-${Date.now()}`;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function createGame(
  playerDeck: CardDefinition[],
  opponentDeck: CardDefinition[],
  difficulty: AIDifficulty = 'SCHOLAR'
): GameState {
  uid = 0;
  const shuffledP = shuffle(playerDeck);
  const shuffledO = shuffle(opponentDeck);

  const player: PlayerState = {
    side: 'player', faction: 'SOLARI', hp: 30, maxHp: 30,
    shards: 1, maxShards: 1,
    hand: shuffledP.slice(0, 4), deck: shuffledP.slice(4),
    board: [null, null, null, null, null], name: 'Joueur',
  };
  const opponent: PlayerState = {
    side: 'opponent', faction: 'UMBRA', hp: 30, maxHp: 30,
    shards: 1, maxShards: 1,
    hand: shuffledO.slice(0, 4), deck: shuffledO.slice(4),
    board: [null, null, null, null, null], name: 'Adversaire IA',
  };

  return {
    turn: 1, phase: 'DRAW', activeSide: 'player',
    player, opponent, status: 'PLAYING',
    events: [{ turn: 1, phase: 'DRAW', type: 'TURN_START', actorSide: 'player', message: '⚔ Tour 1 commence — Phase de Pioche' }],
    selectedHandIndex: null, selectedAttackerSlot: null,
    aiDifficulty: difficulty, floatingNumbers: [],
  };
}

function getActive(state: GameState): PlayerState {
  return state.activeSide === 'player' ? state.player : state.opponent;
}
function getInactive(state: GameState): PlayerState {
  return state.activeSide === 'player' ? state.opponent : state.player;
}

function addEvent(state: GameState, evt: Omit<GameEvent, 'turn' | 'phase'>) {
  state.events.push({ ...evt, turn: state.turn, phase: state.phase });
}

function addFloat(state: GameState, slotIndex: number, side: PlayerSide, value: number, type: FloatingNumber['type']) {
  state.floatingNumbers.push({ id: genId(), slotIndex, side, value, type });
}

function hasEffect(unit: BoardUnit, code: EffectCode): boolean {
  return unit.card.effects.some(e => e.code === code);
}

function getEffectValue(unit: BoardUnit, code: EffectCode): number {
  return unit.card.effects.find(e => e.code === code)?.value ?? 0;
}

function hasTaunt(board: (BoardUnit | null)[]): boolean {
  return board.some(u => u && hasEffect(u, 'TAUNT'));
}

function applyDamage(state: GameState, unit: BoardUnit, damage: number, slotIndex: number, side: PlayerSide): number {
  let remaining = damage;
  if (unit.currentShield > 0) {
    const absorbed = Math.min(unit.currentShield, remaining);
    unit.currentShield -= absorbed;
    remaining -= absorbed;
    if (absorbed > 0) addFloat(state, slotIndex, side, absorbed, 'shield');
  }
  if (remaining > 0) {
    unit.currentHp -= remaining;
    addFloat(state, slotIndex, side, remaining, 'damage');
  }
  return remaining;
}

function processOnEnter(state: GameState, unit: BoardUnit, side: PlayerSide) {
  const owner = side === 'player' ? state.player : state.opponent;
  const enemy = side === 'player' ? state.opponent : state.player;

  for (const eff of unit.card.effects) {
    if (eff.trigger !== 'ON_ENTER') continue;
    switch (eff.code) {
      case 'SHIELD':
        unit.currentShield += eff.value;
        addEvent(state, { type: 'SHIELD', actorSide: side, sourceCardName: unit.card.name, value: eff.value, message: `🛡 ${unit.card.name} gagne ${eff.value} bouclier` });
        break;
      case 'BLESSING':
        owner.board.forEach(u => {
          if (u && u.card.faction === owner.faction && u.instanceId !== unit.instanceId) {
            u.currentAtk += eff.value;
          }
        });
        addEvent(state, { type: 'EFFECT', actorSide: side, sourceCardName: unit.card.name, message: `✦ ${unit.card.name} bénit les alliés (+${eff.value} ATK)` });
        break;
      case 'SUMMON': {
        let summoned = 0;
        for (let i = 0; i < 5 && summoned < eff.value; i++) {
          if (!owner.board[i]) {
            owner.board[i] = createBoardUnit(SHADOW_TOKEN);
            owner.board[i]!.animState = 'spawning';
            summoned++;
          }
        }
        if (summoned > 0) addEvent(state, { type: 'EFFECT', actorSide: side, sourceCardName: unit.card.name, message: `👥 ${unit.card.name} invoque ${summoned} ombre(s)` });
        break;
      }
      case 'POISON':
        // Apply poison to ALL enemies on enter (Archimage)
        enemy.board.forEach((u, idx) => {
          if (u && !hasEffect(u, 'IMMOVABLE')) {
            u.poisonStacks += eff.value;
            addFloat(state, idx, enemy.side, eff.value, 'poison');
          }
        });
        addEvent(state, { type: 'POISON', actorSide: side, sourceCardName: unit.card.name, value: eff.value, message: `☠ ${unit.card.name} empoisonne les ennemis (${eff.value})` });
        break;
      case 'HEAL':
        // Spell heal: find first damaged ally
        break;
    }
  }
}

function createBoardUnit(card: CardDefinition): BoardUnit {
  return {
    instanceId: genId(), cardId: card.id, card,
    currentAtk: card.atk, currentHp: card.hp, maxHp: card.hp,
    currentShield: 0, poisonStacks: 0, hasAttacked: false,
    attacksThisTurn: 0,
    maxAttacks: card.effects.some(e => e.code === 'DOUBLE_STRIKE') ? 2 : 1,
    hasRebirth: card.effects.some(e => e.code === 'REBIRTH'),
    rebirthHp: card.effects.find(e => e.code === 'REBIRTH')?.value ?? 0,
    animState: 'spawning',
  };
}

function removeDeadUnits(state: GameState) {
  for (const ps of [state.player, state.opponent]) {
    for (let i = 0; i < 5; i++) {
      const u = ps.board[i];
      if (!u || u.currentHp > 0) continue;
      // Rebirth check
      if (u.hasRebirth) {
        u.currentHp = u.rebirthHp;
        u.hasRebirth = false;
        addEvent(state, { type: 'EFFECT', actorSide: ps.side, sourceCardName: u.card.name, message: `✦ ${u.card.name} renaît avec ${u.rebirthHp} PV!` });
        continue;
      }
      // Death burst
      if (hasEffect(u, 'DEATH_BURST')) {
        const dmg = getEffectValue(u, 'DEATH_BURST');
        const enemy = ps.side === 'player' ? state.opponent : state.player;
        enemy.hp -= dmg;
        addEvent(state, { type: 'DAMAGE', actorSide: ps.side, sourceCardName: u.card.name, value: dmg, message: `💥 ${u.card.name} explose et inflige ${dmg} dégâts!` });
      }
      // Summon on death
      const summonOnDeath = u.card.effects.find(e => e.code === 'SUMMON' && e.trigger === 'ON_DEATH');
      if (summonOnDeath) {
        const owner = ps;
        let summoned = 0;
        for (let s = 0; s < 5 && summoned < summonOnDeath.value; s++) {
          if (!owner.board[s]) {
            owner.board[s] = createBoardUnit(SHADOW_TOKEN);
            summoned++;
          }
        }
      }
      u.animState = 'dying';
      addEvent(state, { type: 'DEATH', actorSide: ps.side, sourceCardName: u.card.name, message: `☠ ${u.card.name} est détruit` });
      ps.board[i] = null;
    }
  }
}

function checkGameOver(state: GameState) {
  if (state.opponent.hp <= 0) {
    state.status = 'VICTORY';
    addEvent(state, { type: 'GAME_OVER', actorSide: 'player', message: '🏆 VICTOIRE!' });
  } else if (state.player.hp <= 0) {
    state.status = 'DEFEAT';
    addEvent(state, { type: 'GAME_OVER', actorSide: 'opponent', message: '💀 DÉFAITE...' });
  }
}

const PHASES: Phase[] = ['DRAW', 'RESOURCE', 'MAIN', 'COMBAT', 'EFFECTS', 'END'];

function drawCard(ps: PlayerState): CardDefinition | null {
  if (ps.deck.length === 0 || ps.hand.length >= 7) return null;
  const card = ps.deck.shift()!;
  ps.hand.push(card);
  return card;
}

function processPhaseEntry(state: GameState) {
  const active = getActive(state);
  switch (state.phase) {
    case 'DRAW': {
      const card = drawCard(active);
      if (card) {
        addEvent(state, { type: 'DRAW', actorSide: active.side, sourceCardName: card.name, message: `📥 ${active.name} pioche ${card.name}` });
      } else if (active.deck.length === 0) {
        // Deck depleted
        if (active.side === 'player') {
          state.status = 'DEFEAT';
          addEvent(state, { type: 'GAME_OVER', actorSide: 'opponent', message: 'Plus de cartes — DÉFAITE' });
        } else {
          state.status = 'VICTORY';
          addEvent(state, { type: 'GAME_OVER', actorSide: 'player', message: "L'adversaire n'a plus de cartes — VICTOIRE!" });
        }
      }
      break;
    }
    case 'RESOURCE':
      if (active.maxShards < 10) active.maxShards++;
      active.shards = active.maxShards;
      addEvent(state, { type: 'EFFECT', actorSide: active.side, message: `💎 ${active.name} a ${active.shards} éclats` });
      break;
    case 'COMBAT':
      // Reset attack flags
      active.board.forEach(u => {
        if (u) { u.hasAttacked = false; u.attacksThisTurn = 0; }
      });
      break;
    case 'EFFECTS':
      // Per-turn effects
      for (let i = 0; i < 5; i++) {
        const u = active.board[i];
        if (!u) continue;
        // Heal per turn
        const healEff = u.card.effects.find(e => e.code === 'HEAL' && e.trigger === 'PER_TURN');
        if (healEff) {
          // Heal the most damaged ally
          let target = u;
          active.board.forEach(ally => {
            if (ally && (ally.maxHp - ally.currentHp) > (target.maxHp - target.currentHp)) target = ally;
          });
          const healed = Math.min(healEff.value, target.maxHp - target.currentHp);
          if (healed > 0) {
            target.currentHp += healed;
            const tIdx = active.board.indexOf(target);
            addFloat(state, tIdx >= 0 ? tIdx : i, active.side, healed, 'heal');
            addEvent(state, { type: 'HEAL', actorSide: active.side, sourceCardName: u.card.name, targetCardName: target.card.name, value: healed, message: `❤ ${u.card.name} soigne ${target.card.name} de ${healed} PV` });
          }
        }
        // Shield per turn (Relic)
        const shieldEff = u.card.effects.find(e => e.code === 'SHIELD' && e.trigger === 'PER_TURN');
        if (shieldEff) {
          active.board.forEach(ally => {
            if (ally && ally.card.faction === active.faction) {
              ally.currentShield += shieldEff.value;
            }
          });
        }
      }
      // Poison damage on inactive side
      const inactive = getInactive(state);
      for (let i = 0; i < 5; i++) {
        const u = inactive.board[i];
        if (!u || u.poisonStacks <= 0) continue;
        u.currentHp -= u.poisonStacks;
        addFloat(state, i, inactive.side, u.poisonStacks, 'poison');
        addEvent(state, { type: 'POISON', actorSide: active.side, targetCardName: u.card.name, value: u.poisonStacks, message: `☠ ${u.card.name} subit ${u.poisonStacks} dégâts de poison` });
      }
      removeDeadUnits(state);
      checkGameOver(state);
      break;
    case 'END':
      // Rage end-of-turn damage
      active.board.forEach(u => {
        if (u) {
          const rage = u.card.effects.find(e => e.code === 'RAGE');
          if (rage && u.attacksThisTurn > 0) {
            u.currentHp -= rage.value;
          }
        }
      });
      removeDeadUnits(state);
      break;
  }
}

export function nextPhase(state: GameState): GameState {
  const s = { ...state, player: { ...state.player }, opponent: { ...state.opponent }, floatingNumbers: [] };
  s.player.board = [...s.player.board];
  s.opponent.board = [...s.opponent.board];
  s.events = [...s.events];

  if (s.status !== 'PLAYING') return s;

  const currentIdx = PHASES.indexOf(s.phase);
  if (currentIdx < PHASES.length - 1) {
    s.phase = PHASES[currentIdx + 1];
  } else {
    // End of turn — switch sides
    s.activeSide = s.activeSide === 'player' ? 'opponent' : 'player';
    s.turn = s.activeSide === 'player' ? s.turn + 1 : s.turn;
    s.phase = 'DRAW';
    addEvent(s, { type: 'TURN_START', actorSide: s.activeSide, message: `⚔ Tour ${s.turn} — ${getActive(s).name}` });
  }

  s.selectedHandIndex = null;
  s.selectedAttackerSlot = null;
  processPhaseEntry(s);
  return s;
}

export function playCard(state: GameState, handIndex: number, slotIndex: number): GameState {
  const s = { ...state, player: { ...state.player }, opponent: { ...state.opponent }, floatingNumbers: [] };
  s.player.board = [...s.player.board];
  s.player.hand = [...s.player.hand];
  s.events = [...s.events];

  if (s.phase !== 'MAIN' || s.activeSide !== 'player') return s;

  const card = s.player.hand[handIndex];
  if (!card || card.cost > s.player.shards) return s;

  if (card.cardType === 'UNIT') {
    if (s.player.board[slotIndex] !== null) return s;
    const unit = createBoardUnit(card);
    s.player.board[slotIndex] = unit;
    s.player.shards -= card.cost;
    s.player.hand.splice(handIndex, 1);
    processOnEnter(s, unit, 'player');
    addEvent(s, { type: 'PLAY', actorSide: 'player', sourceCardName: card.name, message: `🃏 ${card.name} déployé en position ${slotIndex + 1}` });
  } else if (card.cardType === 'SPELL') {
    // Spell: apply to target slot
    const target = s.player.board[slotIndex];
    if (!target && card.effects[0]?.code !== 'POISON') return s;
    s.player.shards -= card.cost;
    s.player.hand.splice(handIndex, 1);
    for (const eff of card.effects) {
      if (eff.code === 'HEAL' && target) {
        const healed = Math.min(eff.value, target.maxHp - target.currentHp);
        target.currentHp += healed;
        addFloat(s, slotIndex, 'player', healed, 'heal');
        addEvent(s, { type: 'HEAL', actorSide: 'player', sourceCardName: card.name, targetCardName: target.card.name, value: healed, message: `❤ ${card.name} soigne ${target.card.name} de ${healed} PV` });
      }
      if (eff.code === 'SHIELD' && target) {
        target.currentShield += eff.value;
        addEvent(s, { type: 'SHIELD', actorSide: 'player', sourceCardName: card.name, targetCardName: target.card.name, value: eff.value, message: `🛡 ${card.name} donne ${eff.value} bouclier à ${target.card.name}` });
      }
    }
    addEvent(s, { type: 'PLAY', actorSide: 'player', sourceCardName: card.name, message: `✦ ${card.name} lancé` });
  } else if (card.cardType === 'RELIC') {
    // Relic: place as "unit" with 0 ATK, persists
    if (s.player.board[slotIndex] !== null) return s;
    const unit = createBoardUnit(card);
    unit.currentHp = 1;
    unit.maxHp = 1;
    s.player.board[slotIndex] = unit;
    s.player.shards -= card.cost;
    s.player.hand.splice(handIndex, 1);
    addEvent(s, { type: 'PLAY', actorSide: 'player', sourceCardName: card.name, message: `◈ ${card.name} posé` });
  }

  s.selectedHandIndex = null;
  removeDeadUnits(s);
  checkGameOver(s);
  return s;
}

export function attackTarget(state: GameState, attackerSlot: number, targetSlot: number): GameState {
  const s = { ...state, player: { ...state.player }, opponent: { ...state.opponent }, floatingNumbers: [] };
  s.player.board = [...s.player.board];
  s.opponent.board = [...s.opponent.board];
  s.events = [...s.events];

  if (s.phase !== 'COMBAT' || s.activeSide !== 'player') return s;

  const attacker = s.player.board[attackerSlot];
  const target = s.opponent.board[targetSlot];
  if (!attacker || !target) return s;
  if (attacker.attacksThisTurn >= attacker.maxAttacks) return s;

  // Taunt check
  if (hasTaunt(s.opponent.board) && !hasEffect(target, 'TAUNT')) return s;

  // Apply attack
  attacker.animState = 'attacking';
  target.animState = 'damaged';

  let atkDmg = attacker.currentAtk;
  // Rage bonus
  const rage = attacker.card.effects.find(e => e.code === 'RAGE');
  if (rage) atkDmg += rage.value;

  applyDamage(s, target, atkDmg, targetSlot, 'opponent');
  addEvent(s, { type: 'ATTACK', actorSide: 'player', sourceCardName: attacker.card.name, targetCardName: target.card.name, value: atkDmg, message: `⚔ ${attacker.card.name} attaque ${target.card.name} pour ${atkDmg} dégâts` });

  // Poison on attack
  const poisonOnAtk = attacker.card.effects.find(e => e.code === 'POISON' && e.trigger === 'ON_ATTACK');
  if (poisonOnAtk && !hasEffect(target, 'IMMOVABLE')) {
    target.poisonStacks += poisonOnAtk.value;
    addEvent(s, { type: 'POISON', actorSide: 'player', sourceCardName: attacker.card.name, targetCardName: target.card.name, value: poisonOnAtk.value, message: `☠ ${target.card.name} empoisonné (${poisonOnAtk.value})` });
  }

  // Lifesteal
  const lifesteal = attacker.card.effects.find(e => e.code === 'LIFESTEAL');
  if (lifesteal) {
    s.player.hp = Math.min(s.player.maxHp, s.player.hp + lifesteal.value);
    addEvent(s, { type: 'HEAL', actorSide: 'player', sourceCardName: attacker.card.name, value: lifesteal.value, message: `❤ ${attacker.card.name} vole ${lifesteal.value} PV` });
  }

  // Riposte
  if (hasEffect(target, 'RIPOSTE') && target.currentHp > 0) {
    const riposteDmg = getEffectValue(target, 'RIPOSTE');
    applyDamage(s, attacker, riposteDmg, attackerSlot, 'player');
    addEvent(s, { type: 'DAMAGE', actorSide: 'opponent', sourceCardName: target.card.name, targetCardName: attacker.card.name, value: riposteDmg, message: `⚡ ${target.card.name} riposte pour ${riposteDmg} dégâts` });
  }

  attacker.attacksThisTurn++;
  attacker.hasAttacked = attacker.attacksThisTurn >= attacker.maxAttacks;

  removeDeadUnits(s);
  checkGameOver(s);
  s.selectedAttackerSlot = null;
  return s;
}

export function attackPlayer(state: GameState, attackerSlot: number): GameState {
  const s = { ...state, player: { ...state.player }, opponent: { ...state.opponent }, floatingNumbers: [] };
  s.player.board = [...s.player.board];
  s.opponent.board = [...s.opponent.board];
  s.events = [...s.events];

  if (s.phase !== 'COMBAT' || s.activeSide !== 'player') return s;

  const attacker = s.player.board[attackerSlot];
  if (!attacker || attacker.attacksThisTurn >= attacker.maxAttacks) return s;

  // Can only attack player if no taunt units and no units (or all dead)
  const hasEnemyUnits = s.opponent.board.some(u => u !== null);
  if (hasEnemyUnits && hasTaunt(s.opponent.board)) return s;
  if (hasEnemyUnits) return s; // Must attack units first if they exist

  let atkDmg = attacker.currentAtk;
  const rage = attacker.card.effects.find(e => e.code === 'RAGE');
  if (rage) atkDmg += rage.value;

  s.opponent.hp -= atkDmg;
  attacker.attacksThisTurn++;
  attacker.hasAttacked = attacker.attacksThisTurn >= attacker.maxAttacks;
  addEvent(s, { type: 'DAMAGE', actorSide: 'player', sourceCardName: attacker.card.name, value: atkDmg, message: `💥 ${attacker.card.name} attaque l'adversaire pour ${atkDmg} dégâts!` });

  const lifesteal = attacker.card.effects.find(e => e.code === 'LIFESTEAL');
  if (lifesteal) {
    s.player.hp = Math.min(s.player.maxHp, s.player.hp + lifesteal.value);
  }

  checkGameOver(s);
  s.selectedAttackerSlot = null;
  return s;
}

// ═══ AI LOGIC ═══

export function playAITurn(state: GameState): GameState {
  let s = { ...state };

  // Go through all phases for AI
  const phases: Phase[] = ['DRAW', 'RESOURCE', 'MAIN', 'COMBAT', 'EFFECTS', 'END'];

  for (const phase of phases) {
    s = { ...s, phase };
    s.player = { ...s.player };
    s.opponent = { ...s.opponent };
    s.opponent.board = [...s.opponent.board];
    s.opponent.hand = [...s.opponent.hand];
    s.events = [...s.events];
    s.floatingNumbers = [];

    processPhaseEntry(s);
    if (s.status !== 'PLAYING') return s;

    if (phase === 'MAIN') {
      s = aiPlayCards(s);
    } else if (phase === 'COMBAT') {
      s = aiCombat(s);
    }
  }

  // Switch back to player
  s.activeSide = 'player';
  s.turn++;
  s.phase = 'DRAW';
  s.events = [...s.events];
  addEvent(s, { type: 'TURN_START', actorSide: 'player', message: `⚔ Tour ${s.turn} — Votre tour` });
  processPhaseEntry(s);

  return s;
}

function aiPlayCards(state: GameState): GameState {
  let s = state;
  const ai = s.opponent;

  // Sort hand by cost descending (play expensive cards first)
  const playableIndices = ai.hand
    .map((c, i) => ({ card: c, index: i }))
    .filter(x => x.card.cost <= ai.shards && (x.card.cardType === 'UNIT' || x.card.cardType === 'RELIC'))
    .sort((a, b) => b.card.cost - a.card.cost);

  for (const { card, index } of playableIndices) {
    const emptySlot = ai.board.findIndex(slot => slot === null);
    if (emptySlot === -1) break;
    if (card.cost > ai.shards) continue;

    // Random skip for NOVICE
    if (s.aiDifficulty === 'NOVICE' && Math.random() < 0.4) continue;

    const unit = createBoardUnit(card);
    ai.board[emptySlot] = unit;
    ai.shards -= card.cost;
    ai.hand = ai.hand.filter((_, i) => i !== index);
    processOnEnter(s, unit, 'opponent');
    addEvent(s, { type: 'PLAY', actorSide: 'opponent', sourceCardName: card.name, message: `🃏 ${ai.name} joue ${card.name}` });

    // Re-index after removal
    break; // Simple: play one card at a time to avoid index issues
  }

  // Try to play more
  const canPlayMore = ai.hand.some(c => c.cost <= ai.shards && (c.cardType === 'UNIT' || c.cardType === 'RELIC')) && ai.board.some(s => s === null);
  if (canPlayMore) {
    s = aiPlayCards(s);
  }

  return s;
}

function aiCombat(state: GameState): GameState {
  let s = { ...state };
  s.opponent = { ...s.opponent };
  s.opponent.board = [...s.opponent.board];
  s.player = { ...s.player };
  s.player.board = [...s.player.board];
  s.events = [...s.events];

  // Reset attacks
  s.opponent.board.forEach(u => { if (u) { u.hasAttacked = false; u.attacksThisTurn = 0; } });

  for (let i = 0; i < 5; i++) {
    const attacker = s.opponent.board[i];
    if (!attacker || attacker.cardType === 'RELIC' || attacker.currentAtk === 0) continue;

    while (attacker.attacksThisTurn < attacker.maxAttacks) {
      if (s.status !== 'PLAYING') return s;

      // Find target
      const playerUnits = s.player.board.map((u, idx) => u ? { unit: u, idx } : null).filter(Boolean) as { unit: BoardUnit; idx: number }[];

      if (playerUnits.length === 0) {
        // Attack player directly
        let dmg = attacker.currentAtk;
        const rage = attacker.card.effects.find(e => e.code === 'RAGE');
        if (rage) dmg += rage.value;
        s.player.hp -= dmg;
        attacker.attacksThisTurn++;
        attacker.hasAttacked = attacker.attacksThisTurn >= attacker.maxAttacks;
        addEvent(s, { type: 'DAMAGE', actorSide: 'opponent', sourceCardName: attacker.card.name, value: dmg, message: `💥 ${attacker.card.name} attaque le joueur pour ${dmg} dégâts!` });
        checkGameOver(s);
        continue;
      }

      // Priority: taunt units first
      let target: { unit: BoardUnit; idx: number };
      const tauntTargets = playerUnits.filter(t => hasEffect(t.unit, 'TAUNT'));
      if (tauntTargets.length > 0) {
        target = tauntTargets[0];
      } else {
        // SCHOLAR/MASTER: target weakest HP; NOVICE: random
        if (s.aiDifficulty === 'NOVICE') {
          target = playerUnits[Math.floor(Math.random() * playerUnits.length)];
        } else {
          target = playerUnits.sort((a, b) => a.unit.currentHp - b.unit.currentHp)[0];
        }
      }

      let dmg = attacker.currentAtk;
      const rage = attacker.card.effects.find(e => e.code === 'RAGE');
      if (rage) dmg += rage.value;

      applyDamage(s, target.unit, dmg, target.idx, 'player');
      addEvent(s, { type: 'ATTACK', actorSide: 'opponent', sourceCardName: attacker.card.name, targetCardName: target.unit.card.name, value: dmg, message: `⚔ ${attacker.card.name} attaque ${target.unit.card.name} pour ${dmg}` });

      // Poison on attack
      const poisonOnAtk = attacker.card.effects.find(e => e.code === 'POISON' && e.trigger === 'ON_ATTACK');
      if (poisonOnAtk && !hasEffect(target.unit, 'IMMOVABLE')) {
        target.unit.poisonStacks += poisonOnAtk.value;
      }

      // Lifesteal
      const lifesteal = attacker.card.effects.find(e => e.code === 'LIFESTEAL');
      if (lifesteal) s.opponent.hp = Math.min(s.opponent.maxHp, s.opponent.hp + lifesteal.value);

      // Riposte
      if (hasEffect(target.unit, 'RIPOSTE') && target.unit.currentHp > 0) {
        const riposteDmg = getEffectValue(target.unit, 'RIPOSTE');
        applyDamage(s, attacker, riposteDmg, i, 'opponent');
      }

      attacker.attacksThisTurn++;
      attacker.hasAttacked = attacker.attacksThisTurn >= attacker.maxAttacks;

      removeDeadUnits(s);
      checkGameOver(s);
    }
  }

  return s;
}
