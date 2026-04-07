import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Race, RACE_INFO, CardDefinition, BoardUnit, HeroDefinition } from '@/engine/types';
import { HEROES } from '@/data/heroes';
import { ALL_CARDS } from '@/data/cards';
import GameCard from '@/components/game/GameCard';

function makeDummyUnit(card: CardDefinition, level: number = 10): BoardUnit {
  const hpMult = 1 + (level - 1) * 0.15;
  const atkMult = 1 + (level - 1) * 0.12;
  return {
    instanceId: `deck-${card.id}`,
    cardId: card.id,
    card,
    currentAtk: Math.round(card.atk * 50 * atkMult),
    currentHp: Math.round(card.hp * 100 * hpMult),
    maxHp: Math.round(card.hp * 100 * hpMult),
    currentShield: 0,
    poisonStacks: 0,
    wait: card.speed,
    hasAttacked: false,
    hasRebirth: false,
    rebirthHp: 0,
    animState: 'idle',
    level,
  };
}

type DeckTab = 'creatures' | 'artefacts' | 'equipement';

export default function DeckPage() {
  const navigate = useNavigate();
  const [selectedRace, setSelectedRace] = useState<Race>('HUMAINS_NAINS');
  const [selectedHero, setSelectedHero] = useState<HeroDefinition>(
    HEROES.filter(h => h.race === 'HUMAINS_NAINS')[0]
  );
  const [deckSlots, setDeckSlots] = useState<(CardDefinition | null)[]>(() => {
    const cards = ALL_CARDS.filter(c => c.race === 'HUMAINS_NAINS');
    const sorted = [...cards].sort((a, b) => (b.atk * 2 + b.hp) - (a.atk * 2 + a.hp));
    const slots: (CardDefinition | null)[] = Array(10).fill(null);
    sorted.slice(0, 10).forEach((c, i) => { slots[i] = c; });
    return slots;
  });
  const [activeTab, setActiveTab] = useState<DeckTab>('creatures');
  const [activeDeck, setActiveDeck] = useState(1);

  const raceHeroes = HEROES.filter(h => h.race === selectedRace);
  const raceCards = ALL_CARDS.filter(c => c.race === selectedRace);
  const raceInfo = RACE_INFO[selectedRace];

  const handleRaceChange = (race: Race) => {
    setSelectedRace(race);
    const heroes = HEROES.filter(h => h.race === race);
    setSelectedHero(heroes[0]);
    const cards = ALL_CARDS.filter(c => c.race === race);
    const sorted = [...cards].sort((a, b) => (b.atk * 2 + b.hp) - (a.atk * 2 + a.hp));
    const slots: (CardDefinition | null)[] = Array(10).fill(null);
    sorted.slice(0, 10).forEach((c, i) => { slots[i] = c; });
    setDeckSlots(slots);
  };

  const totalAtk = deckSlots.reduce((s, c) => s + (c ? c.atk * 50 : 0), 0);
  const totalHp = deckSlots.reduce((s, c) => s + (c ? c.hp * 100 : 0), 0);
  const filledCount = deckSlots.filter(Boolean).length;

  const handleFight = () => {
    navigate(`/game?hero=${selectedHero.id}&difficulty=SCHOLAR`);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#080b12' }}>
      {/* Deck tabs at top */}
      <div className="flex items-center justify-center gap-1 pt-3 pb-2">
        {[1, 2, 3, 4, 5].map(i => (
          <button key={i} onClick={() => setActiveDeck(i)}
            className="font-cinzel text-xs px-6 py-2 transition-all"
            style={{
              background: activeDeck === i ? '#1a2235' : '#0d1220',
              border: `1px solid ${activeDeck === i ? '#c9a84c' : '#1a2235'}`,
              color: activeDeck === i ? '#c9a84c' : '#5a6a80',
              borderRadius: 4,
            }}>
            Deck {i}
          </button>
        ))}
        <button onClick={() => navigate('/')}
          className="ml-4 font-cinzel text-xs px-3 py-2 rounded"
          style={{ background: '#1a2235', border: '1px solid #2a3245', color: '#8a9bb0' }}>
          ← Menu
        </button>
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-center gap-6 py-2"
        style={{ background: '#0d1220', borderTop: '1px solid #1a2235', borderBottom: '1px solid #1a2235' }}>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 18 }}>✊</span>
          <span className="font-cinzel font-bold text-lg" style={{ color: '#e8dfc8' }}>{totalAtk}</span>
        </div>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 18 }}>🔥</span>
          <span className="font-cinzel font-bold text-lg" style={{ color: '#e8dfc8' }}>
            {deckSlots.reduce((s, c) => s + (c ? c.speed : 0), 0)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span style={{ color: '#e74c7d', fontSize: 18 }}>❤</span>
          <span className="font-cinzel font-bold text-lg" style={{ color: '#e8dfc8' }}>{totalHp + selectedHero.hp}</span>
        </div>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 18 }}>⚔</span>
          <span className="font-cinzel font-bold text-lg" style={{ color: '#e8dfc8' }}>{filledCount}/10</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: Hero */}
        <div className="w-[280px] shrink-0 flex flex-col items-center py-4 gap-3"
          style={{ background: '#0a0e18', borderRight: '2px solid #1a2235' }}>
          
          {/* Race selector */}
          <div className="flex flex-wrap gap-1 px-2 justify-center">
            {(Object.keys(RACE_INFO) as Race[]).map(race => (
              <button key={race} onClick={() => handleRaceChange(race)}
                className="text-[10px] font-cinzel px-2 py-1 rounded transition-all"
                style={{
                  background: selectedRace === race ? `${RACE_INFO[race].color}30` : '#1a2235',
                  border: `1px solid ${selectedRace === race ? RACE_INFO[race].color : '#2a3245'}`,
                  color: selectedRace === race ? RACE_INFO[race].color : '#5a6a80',
                }}>
                {RACE_INFO[race].icon} {RACE_INFO[race].label}
              </button>
            ))}
          </div>

          {/* Hero selector */}
          {raceHeroes.length > 1 && (
            <div className="flex gap-2">
              {raceHeroes.map(h => (
                <button key={h.id} onClick={() => setSelectedHero(h)}
                  className="text-[9px] font-cinzel px-2 py-1 rounded"
                  style={{
                    background: selectedHero.id === h.id ? `${raceInfo.color}30` : '#1a2235',
                    border: `1px solid ${selectedHero.id === h.id ? raceInfo.color : '#2a3245'}`,
                    color: selectedHero.id === h.id ? raceInfo.color : '#5a6a80',
                  }}>
                  {h.name}
                </button>
              ))}
            </div>
          )}

          {/* Hero portrait */}
          <div className="relative" style={{
            width: 220, height: 300, borderRadius: 10,
            border: `3px solid ${raceInfo.color}`,
            boxShadow: `0 0 30px ${raceInfo.color}40, inset 0 0 20px ${raceInfo.color}15`,
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #1a1520, #0d0a15)',
          }}>
            {/* Hero art */}
            {selectedHero.artUrl ? (
              <img src={selectedHero.artUrl} alt={selectedHero.name} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span style={{ fontSize: 80, opacity: 0.3 }}>{raceInfo.icon}</span>
              </div>
            )}

            {/* LV badge */}
            <div className="absolute top-2 left-2 z-10" style={{
              width: 40, height: 40, borderRadius: '50%',
              background: '#2d5a27', border: '2px solid #4a8a3f',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 8, color: '#8bc34a', fontFamily: 'Cinzel' }}>LV</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#fff', fontFamily: 'Cinzel', marginTop: -2 }}>51</span>
            </div>

            {/* Name + stars */}
            <div className="absolute top-2 left-12 z-10">
              <div className="font-cinzel text-sm font-bold" style={{ color: '#e8dfc8', textShadow: '0 2px 4px #000' }}>
                {selectedHero.name}
              </div>
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <span key={i} style={{ color: '#f0c040', fontSize: 14, textShadow: '0 0 6px #f0c040' }}>★</span>
                ))}
              </div>
            </div>

            {/* HP at bottom */}
            <div className="absolute bottom-0 left-0 right-0 px-3 py-2 flex items-center gap-1"
              style={{ background: 'linear-gradient(transparent, #000000dd)' }}>
              <span style={{ color: '#e74c7d', fontSize: 16 }}>❤</span>
              <span className="font-cinzel font-bold text-lg" style={{ color: '#e8dfc8' }}>
                {selectedHero.hp}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button onClick={() => setActiveTab('creatures')}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all"
              style={{
                background: activeTab === 'creatures' ? `${raceInfo.color}20` : '#1a2235',
                border: `1px solid ${activeTab === 'creatures' ? raceInfo.color : '#2a3245'}`,
              }}>
              <span style={{ fontSize: 24 }}>🃏</span>
              <span className="font-cinzel text-[9px]" style={{ color: activeTab === 'creatures' ? raceInfo.color : '#5a6a80' }}>
                Modifier Créatures
              </span>
            </button>
            <button onClick={() => setActiveTab('artefacts')}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all"
              style={{
                background: activeTab === 'artefacts' ? '#c9a84c20' : '#1a2235',
                border: `1px solid ${activeTab === 'artefacts' ? '#c9a84c' : '#2a3245'}`,
              }}>
              <span style={{ fontSize: 24 }}>🔮</span>
              <span className="font-cinzel text-[9px]" style={{ color: activeTab === 'artefacts' ? '#c9a84c' : '#5a6a80' }}>
                Voir Artefact
              </span>
            </button>
          </div>
          <button onClick={() => setActiveTab('equipement')}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all"
            style={{
              background: activeTab === 'equipement' ? '#60a5fa20' : '#1a2235',
              border: `1px solid ${activeTab === 'equipement' ? '#60a5fa' : '#2a3245'}`,
            }}>
            <span style={{ fontSize: 24 }}>🛡</span>
            <span className="font-cinzel text-[9px]" style={{ color: activeTab === 'equipement' ? '#60a5fa' : '#5a6a80' }}>
              Équipement
            </span>
          </button>

          {/* Fight button */}
          <button onClick={handleFight}
            className="w-[200px] py-3 rounded-lg font-cinzel font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: `linear-gradient(135deg, ${raceInfo.color}, ${raceInfo.color}aa)`,
              color: '#080b12',
              boxShadow: `0 0 20px ${raceInfo.color}40`,
            }}>
            ⚔ COMBATTRE
          </button>
        </div>

        {/* RIGHT: Creature grid (2 rows of 5) */}
        <div className="flex-1 flex flex-col p-4">
          {activeTab === 'creatures' && (
            <>
              {/* Top row */}
              <div className="flex gap-3 justify-center mb-3">
                {deckSlots.slice(0, 5).map((card, i) => (
                  <div key={`top-${i}`} className="relative">
                    {card ? (
                      <div className="cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => {
                          const newSlots = [...deckSlots];
                          newSlots[i] = null;
                          setDeckSlots(newSlots);
                        }}>
                        <GameCard unit={makeDummyUnit(card)} />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center"
                        style={{
                          width: 140, height: 195, borderRadius: 6,
                          border: `1px dashed ${raceInfo.color}30`, background: '#0a0e1840',
                        }}>
                        <span style={{ color: `${raceInfo.color}30`, fontSize: 28 }}>+</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {/* Bottom row */}
              <div className="flex gap-3 justify-center mb-4">
                {deckSlots.slice(5, 10).map((card, i) => (
                  <div key={`bot-${i}`} className="relative">
                    {card ? (
                      <div className="cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => {
                          const newSlots = [...deckSlots];
                          newSlots[i + 5] = null;
                          setDeckSlots(newSlots);
                        }}>
                        <GameCard unit={makeDummyUnit(card)} />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center"
                        style={{
                          width: 140, height: 195, borderRadius: 6,
                          border: `1px dashed ${raceInfo.color}30`, background: '#0a0e1840',
                        }}>
                        <span style={{ color: `${raceInfo.color}30`, fontSize: 28 }}>+</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Available cards */}
              <div className="font-cinzel text-xs mb-2" style={{ color: raceInfo.color }}>
                CRÉATURES DISPONIBLES
              </div>
              <div className="flex gap-2 flex-wrap overflow-y-auto">
                {raceCards.filter(c => !deckSlots.some(s => s?.id === c.id)).map(card => (
                  <div key={card.id} className="cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => {
                      const emptyIdx = deckSlots.findIndex(s => s === null);
                      if (emptyIdx >= 0) {
                        const newSlots = [...deckSlots];
                        newSlots[emptyIdx] = card;
                        setDeckSlots(newSlots);
                      }
                    }}>
                    <GameCard unit={makeDummyUnit(card)} />
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'artefacts' && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <span style={{ fontSize: 60, opacity: 0.3 }}>🔮</span>
                <div className="font-cinzel text-sm mt-2" style={{ color: '#5a6a80' }}>
                  Artefacts — Bientôt disponible
                </div>
                <div className="font-crimson text-xs mt-1" style={{ color: '#3a4a60' }}>
                  Les artefacts augmentent les capacités de votre héros
                </div>
              </div>
            </div>
          )}

          {activeTab === 'equipement' && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <span style={{ fontSize: 60, opacity: 0.3 }}>🛡</span>
                <div className="font-cinzel text-sm mt-2" style={{ color: '#5a6a80' }}>
                  Équipement — Bientôt disponible
                </div>
                <div className="font-crimson text-xs mt-1" style={{ color: '#3a4a60' }}>
                  Équipez votre héros avec des armes et armures
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
