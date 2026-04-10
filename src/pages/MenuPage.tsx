import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AIDifficulty, Race, RACE_INFO } from '@/engine/types';
import { HEROES } from '@/data/heroes';
import { useProgress } from '@/hooks/useProgress';
import menuBg from '@/assets/menu-bg.jpg';

const DIFFICULTIES: { key: AIDifficulty; label: string; desc: string }[] = [
  { key: 'NOVICE', label: 'NOVICE', desc: 'Adversaire faible' },
  { key: 'SCHOLAR', label: 'ÉRUDIT', desc: 'Adversaire équilibré' },
  { key: 'MASTER', label: 'MAÎTRE', desc: 'Adversaire redoutable' },
];

export default function MenuPage() {
  const [difficulty, setDifficulty] = useState<AIDifficulty>('SCHOLAR');
  const [selectedRace, setSelectedRace] = useState<Race>('HUMAINS_NAINS');
  const [showDiffModal, setShowDiffModal] = useState(false);
  const navigate = useNavigate();
  const { progress } = useProgress();
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; dur: number; delay: number }[]>([]);

  const raceHeroes = HEROES.filter(h => h.race === selectedRace);
  const hero = raceHeroes[0];
  const raceInfo = RACE_INFO[selectedRace];

  useEffect(() => {
    const p = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      dur: 3 + Math.random() * 5,
      delay: Math.random() * 5,
    }));
    setParticles(p);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: '#080b12' }}>
      
      {/* Animated background */}
      <div className="absolute inset-0">
        <img src={menuBg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, rgba(8,11,18,0.3) 0%, rgba(8,11,18,0.7) 50%, rgba(8,11,18,0.95) 100%)',
        }} />
      </div>

      {/* Floating particles */}
      {particles.map(p => (
        <div key={p.id} className="absolute rounded-full pointer-events-none"
          style={{
            left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size,
            background: `radial-gradient(circle, #c9a84c, transparent)`,
            animation: `particleFloat ${p.dur}s ease-in-out ${p.delay}s infinite`,
            opacity: 0.6,
          }} />
      ))}

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-6 py-3"
        style={{ borderBottom: '1px solid #1a223580' }}>
        <div className="flex items-center gap-3">
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg, #c9a84c, #8a6d2b)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, border: '2px solid #f0c040',
            boxShadow: '0 0 15px #c9a84c40',
          }}>⚔</div>
          <div>
            <h1 className="font-cinzel font-bold text-lg tracking-wider" style={{ color: '#c9a84c' }}>
              REALM OF ECHOES
            </h1>
            <p className="font-crimson text-xs italic" style={{ color: '#5a6a8080' }}>
              Quatre races — Un seul vainqueur
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ResourceBadge icon="💎" value={progress.gems.toLocaleString()} />
          <ResourceBadge icon="🪙" value={progress.gold.toLocaleString()} />
          <div className="flex items-center gap-1 px-2 py-1 rounded"
            style={{ background: '#1a223560', border: '1px solid #2a324540' }}>
            <span className="font-cinzel text-[10px]" style={{ color: '#8a9bb0' }}>Niv. {progress.level}</span>
          </div>
          {/* XP bar */}
          <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: '#1a2235' }}>
            <div className="h-full rounded-full transition-all" style={{
              width: `${(progress.xp / progress.xpToNext) * 100}%`,
              background: 'linear-gradient(90deg, #c9a84c, #f0c040)',
            }} />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-8">
        <div className="flex gap-8 items-stretch max-w-[1100px] w-full">
          
          {/* LEFT: Hero portrait */}
          <div className="flex flex-col items-center gap-4 w-[280px] shrink-0">
            {/* Race selector */}
            <div className="flex gap-1.5">
              {(Object.keys(RACE_INFO) as Race[]).map(race => {
                const info = RACE_INFO[race];
                const active = selectedRace === race;
                return (
                  <button key={race} onClick={() => setSelectedRace(race)}
                    className="transition-all hover:scale-105"
                    style={{
                      width: 48, height: 48, borderRadius: '50%',
                      background: active ? `${info.color}30` : '#0d122080',
                      border: `2px solid ${active ? info.color : '#1a223560'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 22,
                      boxShadow: active ? `0 0 20px ${info.color}40` : 'none',
                    }}>
                    {info.icon}
                  </button>
                );
              })}
            </div>

            {/* Hero card */}
            <div className="relative w-full rounded-lg overflow-hidden"
              style={{
                height: 380,
                border: `3px solid ${raceInfo.color}`,
                boxShadow: `0 0 30px ${raceInfo.color}40, 0 0 60px ${raceInfo.color}15`,
              }}>
              {hero?.artUrl ? (
                <img src={hero.artUrl} alt={hero.name} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #1a1520, #0d0a15)' }}>
                  <span style={{ fontSize: 80, opacity: 0.3 }}>{raceInfo.icon}</span>
                </div>
              )}
              {/* Gradient overlay */}
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(0deg, #000000ee 0%, transparent 40%, transparent 70%, #00000080 100%)',
              }} />
              {/* LV badge */}
              <div className="absolute top-3 left-3 z-10" style={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'linear-gradient(135deg, #2d5a27, #1a3d15)',
                border: '2px solid #4a8a3f',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 10px #4a8a3f40',
              }}>
                <span style={{ fontSize: 8, color: '#8bc34a', fontFamily: 'Cinzel' }}>LV</span>
                <span style={{ fontSize: 18, fontWeight: 700, color: '#fff', fontFamily: 'Cinzel', marginTop: -3 }}>51</span>
              </div>
              {/* Stars */}
              <div className="absolute top-3 left-14 z-10">
                <div className="font-cinzel text-sm font-bold" style={{ color: '#e8dfc8', textShadow: '0 2px 6px #000' }}>
                  {hero?.name}
                </div>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <span key={i} style={{ color: '#f0c040', fontSize: 14, textShadow: '0 0 8px #f0c040' }}>★</span>
                  ))}
                </div>
              </div>
              {/* Bottom info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span style={{ color: '#e74c7d', fontSize: 16 }}>❤</span>
                  <span className="font-cinzel font-bold text-xl" style={{ color: '#e8dfc8' }}>
                    {hero?.hp?.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span style={{ fontSize: 14 }}>⚡</span>
                  <span className="font-crimson text-xs" style={{ color: '#8ab4f8' }}>
                    {hero?.skillName}
                  </span>
                </div>
                <p className="font-crimson text-[10px] mt-0.5" style={{ color: '#8a9bb080' }}>
                  {hero?.skillDescription}
                </p>
              </div>
            </div>

            {/* Race label */}
            <div className="font-cinzel text-xs tracking-widest" style={{ color: raceInfo.color }}>
              {raceInfo.icon} {raceInfo.label}
            </div>
          </div>

          {/* RIGHT: Menu buttons */}
          <div className="flex-1 flex flex-col justify-center gap-3">
            {/* Main action buttons */}
            <MenuButton
              icon="⚔" label="COMBATTRE" sublabel="Affrontez un adversaire"
              gradient="linear-gradient(135deg, #c9a84c, #8a6d2b)"
              glowColor="#c9a84c"
              textColor="#080b12"
              onClick={() => setShowDiffModal(true)}
              big
            />
            <MenuButton
              icon="🃏" label="DECK" sublabel="Gérer vos créatures et équipements"
              gradient="linear-gradient(135deg, #1a2235, #2a3245)"
              glowColor="#3a6a8a"
              textColor="#e8dfc8"
              onClick={() => navigate('/deck')}
            />
            <MenuButton
              icon="🗺" label="CAMPAGNE" sublabel="Explorez le monde"
              gradient="linear-gradient(135deg, #1a2235, #2a3245)"
              glowColor="#ef4444"
              textColor="#e8dfc8"
              onClick={() => navigate('/campaign')}
            />
            <div className="flex gap-3">
              <MenuButton
                icon="📖" label="COLLECTION" sublabel="Toutes les cartes"
                gradient="linear-gradient(135deg, #1a2235, #2a3245)"
                glowColor="#7b3fa0"
                textColor="#e8dfc8"
                onClick={() => navigate('/collection')}
                half
              />
              <MenuButton
                icon="🏪" label="BOUTIQUE" sublabel="Acheter des packs"
                gradient="linear-gradient(135deg, #1a2235, #2a3245)"
                glowColor="#4ade80"
                textColor="#e8dfc8"
                onClick={() => navigate('/shop')}
                half
              />
            </div>

            {/* Race descriptions */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              {(Object.keys(RACE_INFO) as Race[]).map(race => {
                const info = RACE_INFO[race];
                const active = selectedRace === race;
                return (
                  <div key={race} className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all"
                    onClick={() => setSelectedRace(race)}
                    style={{
                      background: active ? `${info.color}15` : '#0d122060',
                      border: `1px solid ${active ? info.color + '60' : '#1a223530'}`,
                    }}>
                    <span style={{ fontSize: 20 }}>{info.icon}</span>
                    <div>
                      <div className="font-cinzel text-[10px] font-bold" style={{ color: active ? info.color : '#5a6a80' }}>
                        {info.label}
                      </div>
                      <div className="font-crimson text-[9px]" style={{ color: '#5a6a8090' }}>
                        {race === 'HUMAINS_NAINS' ? 'Défense, boucliers' :
                         race === 'ELFES' ? 'Soins, furtivité' :
                         race === 'ORCS_TROLLS' ? 'Rage, force brute' :
                         'Poison, essaim'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Difficulty modal */}
      {showDiffModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.85)' }}>
          <div className="rounded-xl p-6 w-[380px]"
            style={{
              background: 'linear-gradient(135deg, #0d1220, #1a2235)',
              border: '2px solid #c9a84c40',
              boxShadow: '0 0 40px #c9a84c20',
            }}>
            <h2 className="font-cinzel font-bold text-lg mb-4 text-center" style={{ color: '#c9a84c' }}>
              CHOISIR LA DIFFICULTÉ
            </h2>
            <div className="flex flex-col gap-2 mb-4">
              {DIFFICULTIES.map(d => (
                <button key={d.key} onClick={() => setDifficulty(d.key)}
                  className="flex items-center justify-between px-4 py-3 rounded-lg transition-all hover:scale-[1.01]"
                  style={{
                    background: difficulty === d.key ? '#c9a84c20' : '#0d122080',
                    border: `1px solid ${difficulty === d.key ? '#c9a84c' : '#2a324560'}`,
                    color: difficulty === d.key ? '#c9a84c' : '#8a9bb0',
                  }}>
                  <span className="font-cinzel font-bold text-sm">{d.label}</span>
                  <span className="font-crimson text-xs" style={{ color: '#5a6a80' }}>{d.desc}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowDiffModal(false)}
                className="flex-1 py-2.5 rounded-lg font-cinzel text-xs transition-all hover:scale-[1.02]"
                style={{ background: '#1a2235', border: '1px solid #2a3245', color: '#8a9bb0' }}>
                Annuler
              </button>
              <button onClick={() => navigate(`/game?hero=${hero?.id}&difficulty=${difficulty}`)}
                className="flex-1 py-2.5 rounded-lg font-cinzel font-bold text-sm transition-all hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg, #c9a84c, #8a6d2b)',
                  color: '#080b12',
                  boxShadow: '0 0 20px #c9a84c40',
                }}>
                ⚔ COMBATTRE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuButton({ icon, label, sublabel, gradient, glowColor, textColor, onClick, big, half }: {
  icon: string; label: string; sublabel: string;
  gradient: string; glowColor: string; textColor: string;
  onClick: () => void; big?: boolean; half?: boolean;
}) {
  return (
    <button onClick={onClick}
      className={`relative overflow-hidden rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] text-left ${half ? 'flex-1' : 'w-full'}`}
      style={{
        background: gradient,
        border: `1px solid ${glowColor}40`,
        boxShadow: `0 0 15px ${glowColor}20`,
        padding: big ? '18px 24px' : '14px 20px',
      }}>
      <div className="flex items-center gap-3">
        <span style={{ fontSize: big ? 28 : 22 }}>{icon}</span>
        <div>
          <div className="font-cinzel font-bold" style={{ color: textColor, fontSize: big ? 16 : 13 }}>
            {label}
          </div>
          <div className="font-crimson text-xs" style={{ color: `${textColor}90`, opacity: 0.7 }}>
            {sublabel}
          </div>
        </div>
      </div>
      {/* Shine effect */}
      <div className="absolute top-0 -left-full w-1/2 h-full opacity-10 animate-shimmer"
        style={{
          background: `linear-gradient(90deg, transparent, ${glowColor}, transparent)`,
          backgroundSize: '200% 100%',
        }} />
    </button>
  );
}

function ResourceBadge({ icon, value }: { icon: string; value: string }) {
  return (
    <div className="flex items-center gap-1 px-2 py-1 rounded"
      style={{ background: '#1a223560', border: '1px solid #2a324540' }}>
      <span style={{ fontSize: 14 }}>{icon}</span>
      <span className="font-cinzel text-xs font-bold" style={{ color: '#e8dfc8' }}>{value}</span>
    </div>
  );
}
