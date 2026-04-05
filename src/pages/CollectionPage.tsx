import { useState } from 'react';
import { ALL_CARDS } from '@/data/cards';
import { CardDefinition, Faction, CardType, Rarity } from '@/engine/types';
import GameCard from '@/components/game/GameCard';

export default function CollectionPage() {
  const [factionFilter, setFactionFilter] = useState<Faction | 'ALL'>('ALL');
  const [typeFilter, setTypeFilter] = useState<CardType | 'ALL'>('ALL');
  const [selectedCard, setSelectedCard] = useState<CardDefinition | null>(null);

  const filtered = ALL_CARDS.filter(c => {
    if (factionFilter !== 'ALL' && c.faction !== factionFilter) return false;
    if (typeFilter !== 'ALL' && c.cardType !== typeFilter) return false;
    return true;
  });

  const EFFECT_DESCS: Record<string, string> = {
    SHIELD: 'Absorbe X dégâts avant les PV',
    HEAL: 'Restaure X PV à un allié',
    BLESSING: '+X ATK à tous les alliés de même faction',
    IMMOVABLE: 'Immunisé au Poison',
    REBIRTH: 'Renaît avec X PV à la mort',
    TAUNT: 'Les ennemis doivent cibler cette unité en premier',
    POISON: 'Inflige X dégâts par tour à la cible',
    RAGE: '+X ATK ce tour, perd X PV en fin de tour',
    DEATH_BURST: 'Inflige 3 dégâts à l\'adversaire quand détruit',
    SUMMON: 'Invoque X jetons Ombre (1/1)',
    CORRUPT: '-X ATK à une unité ennemie ciblée',
    STEALTH: 'Ne peut pas être ciblé par les sorts/effets',
    RIPOSTE: 'Contre-attaque avec X ATK quand attaqué',
    DOUBLE_STRIKE: 'Attaque deux fois par tour',
    LIFESTEAL: 'Restaure X PV au propriétaire par attaque',
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'hsl(220 40% 4%)' }}>
      {/* Card grid */}
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

        {/* Filters */}
        <div className="flex gap-2 mb-4">
          {(['ALL', 'SOLARI', 'UMBRA'] as const).map(f => (
            <button key={f} onClick={() => setFactionFilter(f)}
              className="px-3 py-1 rounded-full text-xs font-cinzel transition-all"
              style={{
                background: factionFilter === f ? 'hsl(42 50% 54% / 0.2)' : 'hsl(220 20% 15%)',
                border: `1px solid ${factionFilter === f ? 'hsl(42 50% 54%)' : 'hsl(220 20% 22%)'}`,
                color: factionFilter === f ? 'hsl(42 50% 54%)' : 'hsl(213 15% 55%)',
              }}
            >
              {f === 'ALL' ? 'Toutes' : f}
            </button>
          ))}
          <div className="w-px mx-2" style={{ background: 'hsl(220 20% 22%)' }} />
          {(['ALL', 'UNIT', 'SPELL', 'RELIC'] as const).map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className="px-3 py-1 rounded-full text-xs font-cinzel transition-all"
              style={{
                background: typeFilter === t ? 'hsl(42 50% 54% / 0.2)' : 'hsl(220 20% 15%)',
                border: `1px solid ${typeFilter === t ? 'hsl(42 50% 54%)' : 'hsl(220 20% 22%)'}`,
                color: typeFilter === t ? 'hsl(42 50% 54%)' : 'hsl(213 15% 55%)',
              }}
            >
              {t === 'ALL' ? 'Tous' : t === 'UNIT' ? '⚔ Unité' : t === 'SPELL' ? '✦ Sort' : '◈ Relique'}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-6 gap-4 overflow-y-auto flex-1">
          {filtered.map(card => (
            <div key={card.id} onClick={() => setSelectedCard(card)} className="flex justify-center cursor-pointer">
              <GameCard card={card} size="lg" isSelected={selectedCard?.id === card.id} />
            </div>
          ))}
        </div>
      </div>

      {/* Detail panel */}
      {selectedCard && (
        <div className="w-80 p-6 flex flex-col gap-4 shrink-0"
          style={{ background: 'hsl(220 30% 8%)', borderLeft: '1px solid hsl(220 20% 18%)' }}>
          <div className="flex justify-center">
            <GameCard card={selectedCard} size="lg" />
          </div>
          <h2 className="font-cinzel font-bold text-lg text-center" style={{ color: 'hsl(42 50% 54%)' }}>
            {selectedCard.name}
          </h2>
          <div className="flex flex-wrap justify-center gap-2 text-[10px] font-cinzel">
            <span className="px-2 py-0.5 rounded-full" style={{
              background: selectedCard.faction === 'SOLARI' ? 'hsl(22 78% 57% / 0.2)' : 'hsl(270 60% 55% / 0.2)',
              color: selectedCard.faction === 'SOLARI' ? 'hsl(22 78% 57%)' : 'hsl(270 60% 55%)',
            }}>{selectedCard.faction}</span>
            <span className="px-2 py-0.5 rounded-full" style={{ background: 'hsl(220 20% 18%)', color: 'hsl(213 15% 55%)' }}>
              {selectedCard.cardType}
            </span>
            <span className="px-2 py-0.5 rounded-full" style={{ background: 'hsl(220 20% 18%)', color: 'hsl(213 15% 55%)' }}>
              {selectedCard.rarity}
            </span>
          </div>
          {selectedCard.cardType === 'UNIT' && (
            <div className="text-center text-sm font-crimson" style={{ color: 'hsl(38 40% 75%)' }}>
              ATK {selectedCard.atk} · HP {selectedCard.hp} · Vitesse {selectedCard.speed} · Coût {selectedCard.cost}
            </div>
          )}
          {selectedCard.effects.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="font-cinzel text-xs" style={{ color: 'hsl(42 50% 54%)' }}>EFFETS</span>
              {selectedCard.effects.map((eff, i) => (
                <div key={i} className="text-xs font-crimson" style={{ color: 'hsl(38 40% 75%)' }}>
                  <span className="font-bold">{eff.code}{eff.value > 0 ? `(${eff.value})` : ''}</span>
                  <span className="ml-1" style={{ color: 'hsl(213 15% 55%)' }}>
                    — {EFFECT_DESCS[eff.code] || ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
