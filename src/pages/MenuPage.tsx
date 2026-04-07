import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AIDifficulty, Race, RACE_INFO } from '@/engine/types';

const DIFFICULTIES: { key: AIDifficulty; label: string; desc: string }[] = [
  { key: 'NOVICE', label: 'NOVICE', desc: 'Adversaire faible' },
  { key: 'SCHOLAR', label: 'ÉRUDIT', desc: 'Adversaire équilibré' },
  { key: 'MASTER', label: 'MAÎTRE', desc: 'Adversaire redoutable' },
];

export default function MenuPage() {
  const [difficulty, setDifficulty] = useState<AIDifficulty>('SCHOLAR');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative"
      style={{ background: 'hsl(220 40% 4%)' }}>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #c9a84c, transparent)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #a855f7, transparent)' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <h1 className="font-cinzel font-bold text-4xl tracking-wider"
            style={{ color: 'hsl(42 50% 54%)', textShadow: '0 0 30px hsl(42 50% 54% / 0.3)' }}>
            REALM OF ECHOES
          </h1>
          <p className="font-crimson text-lg italic" style={{ color: 'hsl(213 15% 55%)' }}>
            Quatre races — Un seul vainqueur
          </p>
        </div>

        {/* Race icons */}
        <div className="flex gap-4">
          {(Object.keys(RACE_INFO) as Race[]).map(race => {
            const info = RACE_INFO[race];
            return (
              <div key={race} className="flex flex-col items-center gap-1">
                <div className="flex items-center justify-center"
                  style={{
                    width: 50, height: 50, borderRadius: '50%',
                    background: `${info.color}15`, border: `2px solid ${info.color}40`,
                  }}>
                  <span style={{ fontSize: 24 }}>{info.icon}</span>
                </div>
                <span className="font-cinzel text-[9px]" style={{ color: info.color }}>{info.label}</span>
              </div>
            );
          })}
        </div>

        <div className="flex gap-8">
          {/* Deck & Fight */}
          <div className="w-80 rounded-xl p-6 flex flex-col gap-4"
            style={{ background: 'hsl(220 30% 10%)', border: '1px solid hsl(220 20% 18%)' }}>
            <h2 className="font-cinzel font-bold text-lg" style={{ color: 'hsl(42 50% 54%)' }}>
              COMBATTRE
            </h2>

            <button onClick={() => navigate('/deck')}
              className="w-full py-3 rounded-lg font-cinzel font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, hsl(42 50% 54%), hsl(42 60% 40%))',
                color: 'hsl(220 40% 4%)',
                boxShadow: '0 0 20px hsl(42 50% 54% / 0.3)',
              }}>
              ⚔ PRÉPARER LE DECK
            </button>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-cinzel" style={{ color: 'hsl(213 15% 55%)' }}>
                Combat rapide
              </span>
              {DIFFICULTIES.map(d => (
                <button key={d.key} onClick={() => setDifficulty(d.key)}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all"
                  style={{
                    background: difficulty === d.key ? 'hsl(42 50% 54% / 0.15)' : 'hsl(220 20% 15%)',
                    border: `1px solid ${difficulty === d.key ? 'hsl(42 50% 54%)' : 'hsl(220 20% 22%)'}`,
                    color: difficulty === d.key ? 'hsl(42 50% 54%)' : 'hsl(38 40% 75%)',
                  }}>
                  <span className="font-cinzel font-semibold">{d.label}</span>
                  <span className="text-[10px]" style={{ color: 'hsl(213 15% 55%)' }}>{d.desc}</span>
                </button>
              ))}
            </div>

            <button onClick={() => navigate(`/game?difficulty=${difficulty}`)}
              className="w-full py-2 rounded-lg font-cinzel text-xs transition-all hover:scale-[1.02]"
              style={{
                background: 'hsl(220 20% 15%)', border: '1px solid hsl(220 20% 22%)',
                color: 'hsl(38 40% 75%)',
              }}>
              ⚡ COMBAT RAPIDE
            </button>
          </div>

          {/* Info */}
          <div className="w-72 rounded-xl p-6 flex flex-col gap-4"
            style={{ background: 'hsl(220 30% 10%)', border: '1px solid hsl(220 20% 18%)' }}>
            <h2 className="font-cinzel font-bold text-lg" style={{ color: 'hsl(42 50% 54%)' }}>
              LES RACES
            </h2>
            <div className="flex flex-col gap-3 text-sm font-crimson" style={{ color: 'hsl(38 40% 75%)' }}>
              <p><span className="font-cinzel text-xs" style={{ color: '#c9a84c' }}>⚔ Humains & Nains</span> — Défense, boucliers, endurance</p>
              <p><span className="font-cinzel text-xs" style={{ color: '#4ade80' }}>🌿 Elfes</span> — Soins, furtivité, agilité</p>
              <p><span className="font-cinzel text-xs" style={{ color: '#ef4444' }}>🔥 Orcs & Trolls</span> — Rage, force brute, régénération</p>
              <p><span className="font-cinzel text-xs" style={{ color: '#a855f7' }}>💀 Gobelins & Gnolls</span> — Poison, ruse, essaim</p>
            </div>

            <div className="flex gap-2 mt-auto">
              <button onClick={() => navigate('/collection')}
                className="flex-1 py-2 rounded-lg font-cinzel text-xs transition-all hover:scale-[1.02]"
                style={{ background: 'hsl(220 20% 15%)', border: '1px solid hsl(220 20% 22%)', color: 'hsl(38 40% 75%)' }}>
                📖 Collection
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
