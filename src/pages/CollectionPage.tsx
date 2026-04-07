import { useState } from 'react';
import { ALL_CARDS } from '@/data/cards';
import { CardDefinition, Race, Rarity, BoardUnit, RACE_INFO } from '@/engine/types';
import GameCard from '@/components/game/GameCard';

function makeDummyUnit(card: CardDefinition): BoardUnit {
  return {
    instanceId: `preview-${card.id}`,
    cardId: card.id,
    card,
    currentAtk: card.atk * 50,
    currentHp: card.hp * 100,
    maxHp: card.hp * 100,
    currentShield: 0,
    poisonStacks: 0,
    wait: card.speed,
    hasAttacked: false,
    hasRebirth: false,
    rebirthHp: 0,
    animState: 'idle',
    level: 1,
  };
}

export default function CollectionPage() {
  const [raceFilter, setRaceFilter] = useState<Race | 'ALL'>('ALL');
  const [selectedCard, setSelectedCard] = useState<CardDefinition | null>(null);

  const filtered = ALL_CARDS.filter(c => {
    if (raceFilter !== 'ALL' && c.race !== raceFilter) return false;
    return true;
  });

  const EFFECT_DESCS: Record<string, string> = {
    SHIELD: 'Absorbe X dégâts avant les PV',
    HEAL: 'Restaure X PV à un allié',
    BLESSING: '+X ATK à tous les alliés',
    IMMOVABLE: 'Immunisé au Poison',
    REBIRTH: 'Renaît avec X PV à la mort',
    TAUNT: 'Les ennemis doivent cibler cette unité en premier',
    POISON: 'Inflige X dégâts par tour à la cible',
    RAGE: '+X ATK ce tour',
    DEATH_BURST: 'Inflige dégâts au héros ennemi quand détruit',
    SUMMON: 'Invoque X jetons',
    CORRUPT: '-X ATK à une unité ennemie',
    STEALTH: 'Ne peut pas être ciblé par les sorts',
    RIPOSTE: 'Contre-attaque quand attaqué',
    DOUBLE_STRIKE: 'Attaque deux fois par tour',
    LIFESTEAL: 'Restaure PV par attaque',
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'hsl(220 40% 4%)' }}>
      <div className="flex-1 flex flex-col p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-cinzel font-bold text-2xl" style={{ color: 'hsl(42 50% 54%)' }}>
            📖 COLLECTION
          </h1>
          <a href="/" className="font-cinzel text-xs px-3 py-1.5 rounded-lg transition-all hover:scale-105"
            style={{ background: 'hsl(220 20% 15%)', border: '1px solid hsl(220 20% 22%)', color: 'hsl(38 40% 75%)' }}>
            ← Menu
          </a>
        </div>

        <div className="flex gap-2 mb-4 flex-wrap">
          {(['ALL', 'HUMAINS_NAINS', 'ELFES', 'ORCS_TROLLS', 'GOBELINS_GNOLLS'] as const).map(r => (
            <button key={r} onClick={() => setRaceFilter(r)}
              className="px-3 py-1 rounded-full text-xs font-cinzel transition-all"
              style={{
                background: raceFilter === r ? 'hsl(42 50% 54% / 0.2)' : 'hsl(220 20% 15%)',
                border: `1px solid ${raceFilter === r ? 'hsl(42 50% 54%)' : 'hsl(220 20% 22%)'}`,
                color: raceFilter === r ? 'hsl(42 50% 54%)' : 'hsl(213 15% 55%)',
              }}>
              {r === 'ALL' ? 'Toutes' : RACE_INFO[r].icon + ' ' + RACE_INFO[r].label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-5 gap-4 overflow-y-auto flex-1">
          {filtered.map(card => (
            <div key={card.id} onClick={() => setSelectedCard(card)} className="flex justify-center cursor-pointer">
              <GameCard unit={makeDummyUnit(card)} />
            </div>
          ))}
        </div>
      </div>

      {selectedCard && (
        <div className="w-80 p-6 flex flex-col gap-4 shrink-0"
          style={{ background: 'hsl(220 30% 8%)', borderLeft: '1px solid hsl(220 20% 18%)' }}>
          <div className="flex justify-center">
            <GameCard unit={makeDummyUnit(selectedCard)} />
          </div>
          <h2 className="font-cinzel font-bold text-lg text-center" style={{ color: 'hsl(42 50% 54%)' }}>
            {selectedCard.name}
          </h2>
          <div className="flex flex-wrap justify-center gap-2 text-[10px] font-cinzel">
            <span className="px-2 py-0.5 rounded-full" style={{
              background: `${RACE_INFO[selectedCard.race].color}20`,
              color: RACE_INFO[selectedCard.race].color,
            }}>{RACE_INFO[selectedCard.race].label}</span>
            <span className="px-2 py-0.5 rounded-full" style={{ background: 'hsl(220 20% 18%)', color: 'hsl(213 15% 55%)' }}>
              {selectedCard.rarity}
            </span>
          </div>
          {selectedCard.effects.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="font-cinzel text-xs" style={{ color: 'hsl(42 50% 54%)' }}>EFFETS</span>
              {selectedCard.effects.map((eff, i) => (
                <div key={i} className="text-xs font-crimson" style={{ color: 'hsl(38 40% 75%)' }}>
                  <span className="font-bold">{eff.code}{eff.value > 0 ? `(${eff.value})` : ''}</span>
                  <span className="ml-1" style={{ color: 'hsl(213 15% 55%)' }}>— {EFFECT_DESCS[eff.code] || ''}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
