import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AIDifficulty } from '@/engine/types';

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

      {/* Background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, hsl(22 78% 57%), transparent)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, hsl(270 60% 55%), transparent)' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Title */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-4 text-3xl">
            <span>☀</span>
            <h1 className="font-cinzel font-bold text-4xl tracking-wider"
              style={{ color: 'hsl(42 50% 54%)', textShadow: '0 0 30px hsl(42 50% 54% / 0.3)' }}>
              REALM OF ECHOES
            </h1>
            <span>☽</span>
          </div>
          <p className="font-crimson text-lg italic" style={{ color: 'hsl(213 15% 55%)' }}>
            Lumière contre Ténèbres — le destin vous attend
          </p>
        </div>

        {/* Main panels */}
        <div className="flex gap-8">
          {/* New Game */}
          <div className="w-80 rounded-xl p-6 flex flex-col gap-4"
            style={{ background: 'hsl(220 30% 10%)', border: '1px solid hsl(220 20% 18%)' }}>
            <h2 className="font-cinzel font-bold text-lg" style={{ color: 'hsl(42 50% 54%)' }}>
              COMBATTRE
            </h2>

            <div className="font-crimson text-sm" style={{ color: 'hsl(38 40% 75%)' }}>
              Lancez un combat automatique. Vos créatures Solari affrontent les forces Umbra!
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-cinzel" style={{ color: 'hsl(213 15% 55%)' }}>
                Difficulté
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
              className="mt-2 w-full py-3 rounded-lg font-cinzel font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, hsl(42 50% 54%), hsl(42 60% 40%))',
                color: 'hsl(220 40% 4%)',
                boxShadow: '0 0 20px hsl(42 50% 54% / 0.3)',
              }}>
              ⚔ COMMENCER
            </button>
          </div>

          {/* How to play */}
          <div className="w-72 rounded-xl p-6 flex flex-col gap-4"
            style={{ background: 'hsl(220 30% 10%)', border: '1px solid hsl(220 20% 18%)' }}>
            <h2 className="font-cinzel font-bold text-lg" style={{ color: 'hsl(42 50% 54%)' }}>
              COMMENT JOUER
            </h2>
            <div className="flex flex-col gap-3 text-sm font-crimson" style={{ color: 'hsl(38 40% 75%)' }}>
              <p>
                <span className="font-cinzel text-xs" style={{ color: 'hsl(22 78% 57%)' }}>☀ SOLARI</span> —
                Faction défensive. Boucliers, soins, bénédictions.
              </p>
              <p>
                <span className="font-cinzel text-xs" style={{ color: 'hsl(270 60% 55%)' }}>☽ UMBRA</span> —
                Faction agressive. Poison, invocations, vol de vie.
              </p>
              <hr style={{ borderColor: 'hsl(220 20% 18%)' }} />
              <p className="text-xs" style={{ color: 'hsl(213 15% 55%)' }}>
                Le combat est <strong>automatique</strong>. Vos créatures attaquent chaque round.
                Chaque créature a un compteur d'attente — elle attaque quand il atteint 0.
              </p>
              <p className="text-xs" style={{ color: 'hsl(213 15% 55%)' }}>
                Réduisez les PV du héros adversaire à 0 pour gagner!
              </p>
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
