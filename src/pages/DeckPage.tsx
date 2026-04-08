import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Race, RACE_INFO, CardDefinition, BoardUnit, HeroDefinition } from '@/engine/types';
import { HEROES } from '@/data/heroes';
import { ALL_CARDS } from '@/data/cards';
import { ALL_ARTIFACTS, ALL_EQUIPMENT, Artifact, Equipment, RARITY_COLORS } from '@/data/artifacts';
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
  const [equippedArtifact, setEquippedArtifact] = useState<Artifact | null>(null);
  const [equippedWeapon, setEquippedWeapon] = useState<Equipment | null>(null);
  const [equippedArmor, setEquippedArmor] = useState<Equipment | null>(null);
  const [equippedAccessory, setEquippedAccessory] = useState<Equipment | null>(null);

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

  const artBonus = equippedArtifact ? equippedArtifact.bonusAtk : 0;
  const eqAtkBonus = (equippedWeapon?.bonusAtk || 0) + (equippedArmor?.bonusAtk || 0) + (equippedAccessory?.bonusAtk || 0);
  const eqHpBonus = (equippedWeapon?.bonusHp || 0) + (equippedArmor?.bonusHp || 0) + (equippedAccessory?.bonusHp || 0);

  const totalAtk = deckSlots.reduce((s, c) => s + (c ? c.atk * 50 + artBonus : 0), 0) + eqAtkBonus;
  const totalHp = deckSlots.reduce((s, c) => s + (c ? c.hp * 100 + (equippedArtifact?.bonusHp || 0) : 0), 0) + selectedHero.hp + eqHpBonus;
  const filledCount = deckSlots.filter(Boolean).length;

  const handleFight = () => {
    navigate(`/game?hero=${selectedHero.id}&difficulty=SCHOLAR`);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#080b12' }}>
      {/* Deck tabs */}
      <div className="flex items-center justify-center gap-1 pt-2 pb-1.5"
        style={{ borderBottom: '2px solid #1a2235' }}>
        {[1, 2, 3, 4, 5].map(i => (
          <button key={i} onClick={() => setActiveDeck(i)}
            className="font-cinzel text-[10px] px-5 py-1.5 transition-all"
            style={{
              background: activeDeck === i
                ? 'linear-gradient(180deg, #1a2235, #0d1220)'
                : '#0a0e18',
              border: activeDeck === i ? '1px solid #c9a84c' : '1px solid #1a2235',
              color: activeDeck === i ? '#c9a84c' : '#5a6a80',
              borderRadius: 3,
              borderBottom: activeDeck === i ? '2px solid #c9a84c' : '2px solid transparent',
            }}>
            Deck {i}{i > 1 ? ` (Niv ${i * 10 + 5})` : ''}
          </button>
        ))}
        <button onClick={() => navigate('/')}
          className="ml-3 font-cinzel text-[10px] px-3 py-1.5 rounded"
          style={{ background: '#1a2235', border: '1px solid #2a3245', color: '#8a9bb0' }}>
          ← Menu
        </button>
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-center gap-6 py-1.5"
        style={{ background: '#0d1220', borderBottom: '1px solid #1a2235' }}>
        <StatDisplay icon="✊" value={totalAtk} />
        <StatDisplay icon="🔥" value={deckSlots.reduce((s, c) => s + (c ? c.speed : 0), 0)} />
        <StatDisplay icon="❤" value={totalHp} color="#e74c7d" />
        <StatDisplay icon="⚔" value={`${filledCount}/10`} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: Hero panel */}
        <div className="w-[250px] shrink-0 flex flex-col items-center py-3 gap-2 overflow-y-auto"
          style={{ background: '#0a0e18', borderRight: '2px solid #1a2235' }}>
          
          {/* Race selector */}
          <div className="flex flex-wrap gap-1 px-2 justify-center">
            {(Object.keys(RACE_INFO) as Race[]).map(race => (
              <button key={race} onClick={() => handleRaceChange(race)}
                className="text-[9px] font-cinzel px-2 py-0.5 rounded transition-all"
                style={{
                  background: selectedRace === race ? `${RACE_INFO[race].color}25` : '#1a2235',
                  border: `1px solid ${selectedRace === race ? RACE_INFO[race].color : '#2a3245'}`,
                  color: selectedRace === race ? RACE_INFO[race].color : '#5a6a80',
                }}>
                {RACE_INFO[race].icon} {RACE_INFO[race].label}
              </button>
            ))}
          </div>

          {/* Hero selector */}
          {raceHeroes.length > 1 && (
            <div className="flex gap-1">
              {raceHeroes.map(h => (
                <button key={h.id} onClick={() => setSelectedHero(h)}
                  className="text-[8px] font-cinzel px-2 py-0.5 rounded"
                  style={{
                    background: selectedHero.id === h.id ? `${raceInfo.color}25` : '#1a2235',
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
            width: 200, height: 280, borderRadius: 8,
            border: `3px solid ${raceInfo.color}`,
            boxShadow: `0 0 25px ${raceInfo.color}40, inset 0 0 15px ${raceInfo.color}15`,
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #1a1520, #0d0a15)',
          }}>
            {selectedHero.artUrl ? (
              <img src={selectedHero.artUrl} alt={selectedHero.name} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span style={{ fontSize: 70, opacity: 0.3 }}>{raceInfo.icon}</span>
              </div>
            )}
            {/* LV badge */}
            <div className="absolute top-2 left-2 z-10" style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, #2d5a27, #1a3d15)',
              border: '2px solid #4a8a3f',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 7, color: '#8bc34a', fontFamily: 'Cinzel' }}>LV</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#fff', fontFamily: 'Cinzel', marginTop: -2 }}>51</span>
            </div>
            <div className="absolute top-2 left-11 z-10">
              <div className="font-cinzel text-xs font-bold" style={{ color: '#e8dfc8', textShadow: '0 2px 4px #000' }}>
                {selectedHero.name}
              </div>
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <span key={i} style={{ color: '#f0c040', fontSize: 12, textShadow: '0 0 6px #f0c040' }}>★</span>
                ))}
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 px-3 py-1.5 flex items-center gap-1"
              style={{ background: 'linear-gradient(transparent, #000000dd)' }}>
              <span style={{ color: '#e74c7d', fontSize: 14 }}>❤</span>
              <span className="font-cinzel font-bold text-base" style={{ color: '#e8dfc8' }}>
                {selectedHero.hp + eqHpBonus}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <ActionBtn icon="🃏" label="Modifier Créatures" active={activeTab === 'creatures'} color={raceInfo.color}
              onClick={() => setActiveTab('creatures')} />
            <ActionBtn icon="🔮" label="Voir Artefact" active={activeTab === 'artefacts'} color="#c9a84c"
              onClick={() => setActiveTab('artefacts')} />
          </div>
          <ActionBtn icon="🛡" label="Équipement" active={activeTab === 'equipement'} color="#60a5fa"
            onClick={() => setActiveTab('equipement')} />

          {/* Fight button */}
          <button onClick={handleFight}
            className="w-[190px] py-2.5 rounded-lg font-cinzel font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: `linear-gradient(135deg, ${raceInfo.color}, ${raceInfo.color}aa)`,
              color: '#080b12',
              boxShadow: `0 0 20px ${raceInfo.color}40`,
            }}>
            ⚔ COMBATTRE
          </button>
        </div>

        {/* RIGHT: Content area */}
        <div className="flex-1 flex flex-col p-3 overflow-y-auto">
          {activeTab === 'creatures' && (
            <>
              {/* Top row */}
              <div className="flex gap-2 justify-center mb-2">
                {deckSlots.slice(0, 5).map((card, i) => (
                  <div key={`top-${i}`} className="relative">
                    {card ? (
                      <div className="cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => { const s = [...deckSlots]; s[i] = null; setDeckSlots(s); }}>
                        <GameCard unit={makeDummyUnit(card)} />
                      </div>
                    ) : <EmptyCardSlot color={raceInfo.color} />}
                  </div>
                ))}
              </div>
              {/* Bottom row */}
              <div className="flex gap-2 justify-center mb-3">
                {deckSlots.slice(5, 10).map((card, i) => (
                  <div key={`bot-${i}`} className="relative">
                    {card ? (
                      <div className="cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => { const s = [...deckSlots]; s[i + 5] = null; setDeckSlots(s); }}>
                        <GameCard unit={makeDummyUnit(card)} />
                      </div>
                    ) : <EmptyCardSlot color={raceInfo.color} />}
                  </div>
                ))}
              </div>
              {/* Available cards */}
              <div className="font-cinzel text-[10px] mb-1.5 tracking-wider" style={{ color: raceInfo.color }}>
                CRÉATURES DISPONIBLES
              </div>
              <div className="flex gap-2 flex-wrap">
                {raceCards.filter(c => !deckSlots.some(s => s?.id === c.id)).map(card => (
                  <div key={card.id} className="cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => {
                      const idx = deckSlots.findIndex(s => s === null);
                      if (idx >= 0) { const s = [...deckSlots]; s[idx] = card; setDeckSlots(s); }
                    }}>
                    <GameCard unit={makeDummyUnit(card)} />
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'artefacts' && (
            <div className="flex flex-col gap-3">
              <div className="font-cinzel text-xs tracking-wider" style={{ color: '#c9a84c' }}>ARTEFACTS</div>
              {equippedArtifact && (
                <div className="p-3 rounded-lg mb-2" style={{
                  background: '#1a223580', border: `2px solid ${RARITY_COLORS[equippedArtifact.rarity]}`,
                  boxShadow: `0 0 15px ${RARITY_COLORS[equippedArtifact.rarity]}30`,
                }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span style={{ fontSize: 28 }}>{equippedArtifact.icon}</span>
                    <div>
                      <div className="font-cinzel text-sm font-bold" style={{ color: RARITY_COLORS[equippedArtifact.rarity] }}>
                        {equippedArtifact.name} <span className="text-[9px]" style={{ color: '#4ade80' }}>ÉQUIPÉ</span>
                      </div>
                      <div className="text-[10px] font-crimson" style={{ color: '#8a9bb0' }}>{equippedArtifact.description}</div>
                    </div>
                    <button onClick={() => setEquippedArtifact(null)}
                      className="ml-auto text-[9px] font-cinzel px-2 py-1 rounded"
                      style={{ background: '#ef444430', color: '#ef4444', border: '1px solid #ef444450' }}>
                      Retirer
                    </button>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                {ALL_ARTIFACTS.filter(a => a.id !== equippedArtifact?.id).map(art => (
                  <ItemCard key={art.id} name={art.name} icon={art.icon} rarity={art.rarity}
                    description={art.description} onEquip={() => setEquippedArtifact(art)} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'equipement' && (
            <div className="flex flex-col gap-4">
              <div className="font-cinzel text-xs tracking-wider" style={{ color: '#60a5fa' }}>ÉQUIPEMENT</div>
              
              {/* Equipped slots */}
              <div className="grid grid-cols-3 gap-2 mb-2">
                <EquipSlot label="Arme" item={equippedWeapon} onRemove={() => setEquippedWeapon(null)} />
                <EquipSlot label="Armure" item={equippedArmor} onRemove={() => setEquippedArmor(null)} />
                <EquipSlot label="Accessoire" item={equippedAccessory} onRemove={() => setEquippedAccessory(null)} />
              </div>

              {/* Bonus summary */}
              {(eqAtkBonus > 0 || eqHpBonus > 0) && (
                <div className="flex gap-3 text-[10px] font-cinzel" style={{ color: '#4ade80' }}>
                  {eqAtkBonus > 0 && <span>⚔ +{eqAtkBonus} ATQ</span>}
                  {eqHpBonus > 0 && <span>❤ +{eqHpBonus} PV</span>}
                </div>
              )}

              {/* Available equipment */}
              <div className="font-cinzel text-[10px] tracking-wider" style={{ color: '#5a6a80' }}>DISPONIBLE</div>
              <div className="grid grid-cols-2 gap-2">
                {ALL_EQUIPMENT.filter(e => {
                  if (e.slot === 'weapon' && equippedWeapon?.id === e.id) return false;
                  if (e.slot === 'armor' && equippedArmor?.id === e.id) return false;
                  if (e.slot === 'accessory' && equippedAccessory?.id === e.id) return false;
                  return true;
                }).map(eq => (
                  <ItemCard key={eq.id} name={eq.name} icon={eq.icon} rarity={eq.rarity}
                    description={eq.description}
                    sublabel={eq.slot === 'weapon' ? 'Arme' : eq.slot === 'armor' ? 'Armure' : 'Accessoire'}
                    onEquip={() => {
                      if (eq.slot === 'weapon') setEquippedWeapon(eq);
                      else if (eq.slot === 'armor') setEquippedArmor(eq);
                      else setEquippedAccessory(eq);
                    }} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatDisplay({ icon, value, color }: { icon: string; value: number | string; color?: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span style={{ fontSize: 16, color }}>{icon}</span>
      <span className="font-cinzel font-bold text-sm" style={{ color: '#e8dfc8' }}>{value}</span>
    </div>
  );
}

function ActionBtn({ icon, label, active, color, onClick }: {
  icon: string; label: string; active: boolean; color: string; onClick: () => void;
}) {
  return (
    <button onClick={onClick}
      className="flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-lg transition-all"
      style={{
        background: active ? `${color}20` : '#1a2235',
        border: `1px solid ${active ? color : '#2a3245'}`,
      }}>
      <span style={{ fontSize: 20 }}>{icon}</span>
      <span className="font-cinzel text-[8px]" style={{ color: active ? color : '#5a6a80' }}>{label}</span>
    </button>
  );
}

function EmptyCardSlot({ color }: { color: string }) {
  return (
    <div className="flex items-center justify-center"
      style={{
        width: 130, height: 180, borderRadius: 4,
        border: `1px dashed ${color}30`, background: '#0a0e1830',
      }}>
      <span style={{ color: `${color}30`, fontSize: 24 }}>+</span>
    </div>
  );
}

function ItemCard({ name, icon, rarity, description, sublabel, onEquip }: {
  name: string; icon: string; rarity: string; description: string; sublabel?: string; onEquip: () => void;
}) {
  const color = RARITY_COLORS[rarity] || '#5a6a80';
  return (
    <div className="p-2.5 rounded-lg cursor-pointer hover:scale-[1.02] transition-all"
      onClick={onEquip}
      style={{
        background: '#1a223560',
        border: `1px solid ${color}60`,
      }}>
      <div className="flex items-center gap-2">
        <span style={{ fontSize: 22 }}>{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="font-cinzel text-[10px] font-bold truncate" style={{ color }}>{name}</div>
          {sublabel && <div className="text-[8px] font-cinzel" style={{ color: '#5a6a80' }}>{sublabel}</div>}
          <div className="text-[9px] font-crimson" style={{ color: '#8a9bb0' }}>{description}</div>
        </div>
      </div>
      <div className="text-right mt-1">
        <span className="text-[8px] font-cinzel px-1.5 py-0.5 rounded"
          style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}>
          Équiper
        </span>
      </div>
    </div>
  );
}

function EquipSlot({ label, item, onRemove }: { label: string; item: Equipment | null; onRemove: () => void }) {
  return (
    <div className="p-2 rounded-lg text-center" style={{
      background: item ? '#1a223580' : '#0d122040',
      border: item ? `1px solid ${RARITY_COLORS[item.rarity]}60` : '1px dashed #2a324540',
      minHeight: 70,
    }}>
      <div className="font-cinzel text-[8px] tracking-wider mb-1" style={{ color: '#5a6a80' }}>{label}</div>
      {item ? (
        <>
          <span style={{ fontSize: 20 }}>{item.icon}</span>
          <div className="font-cinzel text-[8px] font-bold truncate" style={{ color: RARITY_COLORS[item.rarity] }}>
            {item.name}
          </div>
          <button onClick={onRemove} className="text-[7px] font-cinzel mt-0.5" style={{ color: '#ef4444' }}>
            Retirer
          </button>
        </>
      ) : (
        <div style={{ fontSize: 18, opacity: 0.2 }}>+</div>
      )}
    </div>
  );
}
