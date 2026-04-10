import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '@/hooks/useProgress';
import { ALL_CARDS } from '@/data/cards';
import { RACE_INFO, Rarity } from '@/engine/types';
import { RARITY_COLORS } from '@/data/artifacts';

interface PackDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  cost: number;
  currency: 'gold' | 'gems';
  cardCount: number;
  guaranteedRarity?: Rarity;
  color: string;
}

const PACKS: PackDef[] = [
  { id: 'basic', name: 'Pack Basique', description: '3 cartes aléatoires', icon: '📦', cost: 500, currency: 'gold', cardCount: 3, color: '#4a6741' },
  { id: 'silver', name: 'Pack Argent', description: '4 cartes, 1 Rare garantie', icon: '🥈', cost: 1500, currency: 'gold', cardCount: 4, guaranteedRarity: 'RARE', color: '#3a6a8a' },
  { id: 'gold', name: 'Pack Or', description: '5 cartes, 1 Épique garantie', icon: '🥇', cost: 100, currency: 'gems', cardCount: 5, guaranteedRarity: 'EPIC', color: '#7b3fa0' },
  { id: 'legendary', name: 'Pack Légendaire', description: '5 cartes, 1 Légendaire garantie', icon: '👑', cost: 300, currency: 'gems', cardCount: 5, guaranteedRarity: 'LEGENDARY', color: '#c9a84c' },
];

function rollCard(guaranteedRarity?: Rarity): typeof ALL_CARDS[0] {
  const roll = Math.random();
  let rarity: Rarity;
  if (guaranteedRarity) {
    rarity = guaranteedRarity;
  } else if (roll < 0.5) rarity = 'COMMON';
  else if (roll < 0.8) rarity = 'RARE';
  else if (roll < 0.95) rarity = 'EPIC';
  else rarity = 'LEGENDARY';

  const pool = ALL_CARDS.filter(c => c.rarity === rarity);
  return pool[Math.floor(Math.random() * pool.length)];
}

function openPack(pack: PackDef): typeof ALL_CARDS[0][] {
  const cards: typeof ALL_CARDS[0][] = [];
  for (let i = 0; i < pack.cardCount; i++) {
    const guaranteed = i === 0 ? pack.guaranteedRarity : undefined;
    cards.push(rollCard(guaranteed));
  }
  return cards.sort((a, b) => {
    const order: Record<Rarity, number> = { LEGENDARY: 0, EPIC: 1, RARE: 2, COMMON: 3 };
    return order[a.rarity] - order[b.rarity];
  });
}

export default function ShopPage() {
  const navigate = useNavigate();
  const { progress, spendGold, spendGems, unlockCard } = useProgress();
  const [openingPack, setOpeningPack] = useState<PackDef | null>(null);
  const [revealedCards, setRevealedCards] = useState<typeof ALL_CARDS[0][]>([]);
  const [revealIndex, setRevealIndex] = useState(-1);
  const [phase, setPhase] = useState<'idle' | 'opening' | 'revealing' | 'done'>('idle');

  const buyPack = (pack: PackDef) => {
    const success = pack.currency === 'gold' ? spendGold(pack.cost) : spendGems(pack.cost);
    if (!success) return;
    const cards = openPack(pack);
    cards.forEach(c => unlockCard(c.id));
    setRevealedCards(cards);
    setOpeningPack(pack);
    setPhase('opening');
    setRevealIndex(-1);
  };

  useEffect(() => {
    if (phase === 'opening') {
      const t = setTimeout(() => { setPhase('revealing'); setRevealIndex(0); }, 1200);
      return () => clearTimeout(t);
    }
    if (phase === 'revealing' && revealIndex >= 0 && revealIndex < revealedCards.length - 1) {
      const t = setTimeout(() => setRevealIndex(i => i + 1), 500);
      return () => clearTimeout(t);
    }
    if (phase === 'revealing' && revealIndex >= revealedCards.length - 1) {
      const t = setTimeout(() => setPhase('done'), 400);
      return () => clearTimeout(t);
    }
  }, [phase, revealIndex, revealedCards.length]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#080b12' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3" style={{ borderBottom: '1px solid #1a2235' }}>
        <button onClick={() => navigate('/')} className="font-cinzel text-xs hover:opacity-80 transition-all" style={{ color: '#8a9bb0' }}>← Retour</button>
        <h1 className="font-cinzel font-bold text-lg tracking-wider" style={{ color: '#c9a84c' }}>🏪 BOUTIQUE</h1>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 px-2 py-1 rounded" style={{ background: '#1a223560', border: '1px solid #2a324540' }}>
            <span style={{ fontSize: 14 }}>💎</span>
            <span className="font-cinzel text-xs font-bold" style={{ color: '#e8dfc8' }}>{progress.gems.toLocaleString()}</span>
          </span>
          <span className="flex items-center gap-1 px-2 py-1 rounded" style={{ background: '#1a223560', border: '1px solid #2a324540' }}>
            <span style={{ fontSize: 14 }}>🪙</span>
            <span className="font-cinzel text-xs font-bold" style={{ color: '#e8dfc8' }}>{progress.gold.toLocaleString()}</span>
          </span>
        </div>
      </div>

      {/* Packs grid */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1000px] w-full">
          {PACKS.map(pack => {
            const canAfford = pack.currency === 'gold' ? progress.gold >= pack.cost : progress.gems >= pack.cost;
            return (
              <div key={pack.id} className="relative rounded-xl overflow-hidden transition-all hover:scale-105 cursor-pointer group"
                onClick={() => canAfford && buyPack(pack)}
                style={{
                  background: 'linear-gradient(180deg, #0d1220, #1a2235)',
                  border: `2px solid ${pack.color}60`,
                  boxShadow: `0 0 30px ${pack.color}20`,
                  opacity: canAfford ? 1 : 0.5,
                }}>
                {/* Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{
                  background: `radial-gradient(circle at center, ${pack.color}15, transparent 70%)`,
                }} />
                <div className="relative p-6 flex flex-col items-center gap-4">
                  {/* Pack icon */}
                  <div className="relative" style={{ fontSize: 64 }}>
                    <span className="block transition-transform group-hover:scale-110 group-hover:rotate-3">{pack.icon}</span>
                    <div className="absolute -inset-4 rounded-full animate-ambient-glow" style={{
                      background: `radial-gradient(circle, ${pack.color}30, transparent 70%)`,
                    }} />
                  </div>
                  <h3 className="font-cinzel font-bold text-sm" style={{ color: pack.color }}>{pack.name}</h3>
                  <p className="font-crimson text-xs text-center" style={{ color: '#8a9bb080' }}>{pack.description}</p>
                  <div className="flex items-center gap-1.5 px-4 py-2 rounded-lg" style={{
                    background: canAfford ? `${pack.color}20` : '#1a2235',
                    border: `1px solid ${canAfford ? pack.color : '#2a3245'}`,
                  }}>
                    <span style={{ fontSize: 16 }}>{pack.currency === 'gold' ? '🪙' : '💎'}</span>
                    <span className="font-cinzel font-bold text-sm" style={{ color: canAfford ? '#e8dfc8' : '#5a6a80' }}>
                      {pack.cost}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pack opening overlay */}
      {openingPack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.92)' }}>
          {phase === 'opening' && (
            <div className="flex flex-col items-center gap-6">
              <div style={{ fontSize: 100 }} className="animate-pack-shake">{openingPack.icon}</div>
              <div className="font-cinzel text-lg" style={{ color: openingPack.color }}>Ouverture...</div>
            </div>
          )}
          {(phase === 'revealing' || phase === 'done') && (
            <div className="flex flex-col items-center gap-8">
              <h2 className="font-cinzel font-bold text-xl" style={{ color: '#c9a84c' }}>
                {openingPack.name}
              </h2>
              <div className="flex gap-4 flex-wrap justify-center">
                {revealedCards.map((card, i) => {
                  const visible = i <= revealIndex;
                  const rarityColor = RARITY_COLORS[card.rarity] || '#4a6741';
                  const raceInfo = RACE_INFO[card.race];
                  return (
                    <div key={`${card.id}-${i}`}
                      className={`relative w-[140px] h-[200px] rounded-lg overflow-hidden transition-all duration-500 ${visible ? 'animate-card-reveal' : ''}`}
                      style={{
                        background: visible ? 'linear-gradient(180deg, #0d1220, #1a2235)' : '#0a0e18',
                        border: `2px solid ${visible ? rarityColor : '#1a2235'}`,
                        boxShadow: visible ? `0 0 20px ${rarityColor}40` : 'none',
                        transform: visible ? 'scale(1) rotateY(0)' : 'scale(0.8) rotateY(90deg)',
                        opacity: visible ? 1 : 0.3,
                      }}>
                      {visible && (
                        <>
                          {card.artUrl ? (
                            <img src={card.artUrl} alt={card.name} className="absolute inset-0 w-full h-full object-cover" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center" style={{ background: `${rarityColor}20` }}>
                              <span style={{ fontSize: 40 }}>{raceInfo.icon}</span>
                            </div>
                          )}
                          <div className="absolute inset-0" style={{
                            background: 'linear-gradient(0deg, #000e 0%, transparent 50%)',
                          }} />
                          <div className="absolute bottom-0 left-0 right-0 p-2">
                            <div className="font-cinzel text-[10px] font-bold" style={{ color: '#e8dfc8' }}>{card.name}</div>
                            <div className="flex gap-1 mt-0.5">
                              {Array.from({ length: card.rarity === 'COMMON' ? 1 : card.rarity === 'RARE' ? 2 : card.rarity === 'EPIC' ? 3 : 5 }).map((_, s) => (
                                <span key={s} style={{ color: rarityColor, fontSize: 10 }}>★</span>
                              ))}
                            </div>
                            <div className="flex gap-2 mt-1 font-cinzel text-[9px]" style={{ color: '#8a9bb0' }}>
                              <span>⚔{card.atk}</span>
                              <span>❤{card.hp}</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
              {phase === 'done' && (
                <button onClick={() => { setOpeningPack(null); setPhase('idle'); }}
                  className="font-cinzel font-bold text-sm px-8 py-3 rounded-xl transition-all hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #c9a84c, #8a6d2b)',
                    color: '#080b12',
                    boxShadow: '0 0 20px #c9a84c40',
                  }}>
                  Fermer
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
