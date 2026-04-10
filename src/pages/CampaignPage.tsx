import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '@/hooks/useProgress';
import { CAMPAIGN_STAGES, REGION_COLORS, CampaignStage } from '@/data/progression';
import { RACE_INFO } from '@/engine/types';
import { HEROES } from '@/data/heroes';

export default function CampaignPage() {
  const navigate = useNavigate();
  const { progress } = useProgress();
  const [selectedStage, setSelectedStage] = useState<CampaignStage | null>(null);

  const isStageUnlocked = (stage: CampaignStage, index: number) => {
    if (index === 0) return true;
    if (progress.level < stage.requiredLevel) return false;
    const prevStage = CAMPAIGN_STAGES[index - 1];
    return !!progress.campaignProgress[prevStage.id];
  };

  const isStageCompleted = (stage: CampaignStage) => !!progress.campaignProgress[stage.id];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#080b12' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3" style={{ borderBottom: '1px solid #1a2235' }}>
        <button onClick={() => navigate('/')} className="font-cinzel text-xs hover:opacity-80" style={{ color: '#8a9bb0' }}>← Retour</button>
        <h1 className="font-cinzel font-bold text-lg tracking-wider" style={{ color: '#c9a84c' }}>🗺 CAMPAGNE</h1>
        <div className="font-cinzel text-xs" style={{ color: '#8a9bb0' }}>Niv. {progress.level}</div>
      </div>

      <div className="flex-1 flex">
        {/* Map */}
        <div className="flex-1 relative overflow-hidden" style={{
          background: 'radial-gradient(ellipse at 30% 70%, #0d1a12 0%, #080b12 50%, #12081a 100%)',
        }}>
          {/* Connecting lines */}
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
            {CAMPAIGN_STAGES.map((stage, i) => {
              if (i === 0) return null;
              const prev = CAMPAIGN_STAGES[i - 1];
              const completed = isStageCompleted(prev);
              return (
                <line key={stage.id} x1={`${prev.x}%`} y1={`${prev.y}%`} x2={`${stage.x}%`} y2={`${stage.y}%`}
                  stroke={completed ? '#c9a84c60' : '#1a223560'}
                  strokeWidth={completed ? 3 : 2}
                  strokeDasharray={completed ? '' : '8 4'}
                />
              );
            })}
          </svg>

          {/* Stage nodes */}
          {CAMPAIGN_STAGES.map((stage, i) => {
            const unlocked = isStageUnlocked(stage, i);
            const completed = isStageCompleted(stage);
            const regionColor = REGION_COLORS[stage.region] || '#5a6a80';
            const raceInfo = RACE_INFO[stage.bossRace];

            return (
              <button key={stage.id}
                onClick={() => unlocked && setSelectedStage(stage)}
                disabled={!unlocked}
                className="absolute z-10 transition-all hover:scale-110 disabled:cursor-not-allowed"
                style={{
                  left: `${stage.x}%`, top: `${stage.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}>
                <div className="relative flex flex-col items-center gap-1">
                  <div style={{
                    width: stage.bossName ? 52 : 40, height: stage.bossName ? 52 : 40,
                    borderRadius: '50%',
                    background: completed ? `${regionColor}30` : unlocked ? '#1a223580' : '#0a0e1880',
                    border: `3px solid ${completed ? regionColor : unlocked ? '#3a4a60' : '#1a2235'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: stage.bossName ? 24 : 18,
                    boxShadow: completed ? `0 0 15px ${regionColor}40` : unlocked ? '0 0 10px #3a4a6020' : 'none',
                    opacity: unlocked ? 1 : 0.4,
                  }}>
                    {completed ? '✅' : unlocked ? raceInfo.icon : '🔒'}
                  </div>
                  {stage.bossName && unlocked && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: '#ef4444', border: '1px solid #ff6b6b', fontSize: 10 }}>
                      💀
                    </div>
                  )}
                  <span className="font-cinzel text-[8px] font-bold whitespace-nowrap" style={{
                    color: completed ? regionColor : unlocked ? '#8a9bb0' : '#3a4a60',
                  }}>{stage.name}</span>
                </div>
              </button>
            );
          })}

          {/* Region labels */}
          {[
            { name: 'Plaines du Crépuscule', x: 20, y: 90 },
            { name: 'Montagnes Brisées', x: 45, y: 60 },
            { name: 'Forêt Éternelle', x: 68, y: 45 },
            { name: 'Citadelle Éternelle', x: 85, y: 10 },
          ].map(r => (
            <div key={r.name} className="absolute font-cinzel text-[10px] tracking-widest" style={{
              left: `${r.x}%`, top: `${r.y}%`,
              color: `${REGION_COLORS[r.name]}60`,
              transform: 'translate(-50%, 0)',
            }}>{r.name}</div>
          ))}
        </div>

        {/* Stage detail panel */}
        {selectedStage && (
          <div className="w-[320px] shrink-0 p-6 flex flex-col gap-4" style={{
            background: 'linear-gradient(180deg, #0d1220, #1a2235)',
            borderLeft: '2px solid #1a2235',
          }}>
            <div className="flex items-center gap-3">
              <span style={{ fontSize: 28 }}>{RACE_INFO[selectedStage.bossRace].icon}</span>
              <div>
                <h3 className="font-cinzel font-bold text-sm" style={{ color: '#e8dfc8' }}>{selectedStage.name}</h3>
                <span className="font-cinzel text-[10px]" style={{ color: REGION_COLORS[selectedStage.region] }}>
                  {selectedStage.region}
                </span>
              </div>
            </div>
            <p className="font-crimson text-xs" style={{ color: '#8a9bb080' }}>{selectedStage.description}</p>

            {selectedStage.bossName && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: '#ef444415', border: '1px solid #ef444440' }}>
                <span>💀</span>
                <span className="font-cinzel text-xs font-bold" style={{ color: '#ef4444' }}>Boss: {selectedStage.bossName}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="font-cinzel text-[10px]" style={{ color: '#8a9bb0' }}>Difficulté:</span>
              <div className="flex gap-0.5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="w-2 h-3 rounded-sm" style={{
                    background: i < selectedStage.difficulty ? '#ef4444' : '#1a2235',
                  }} />
                ))}
              </div>
            </div>
            <div className="font-cinzel text-[10px]" style={{ color: '#8a9bb0' }}>
              Niveau requis: <span style={{ color: progress.level >= selectedStage.requiredLevel ? '#4ade80' : '#ef4444' }}>
                {selectedStage.requiredLevel}
              </span>
            </div>

            {/* Rewards */}
            <div className="rounded-lg p-3" style={{ background: '#0a0e1880', border: '1px solid #1a223540' }}>
              <div className="font-cinzel text-[10px] mb-2" style={{ color: '#c9a84c' }}>RÉCOMPENSES</div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 font-crimson text-xs" style={{ color: '#e8dfc8' }}>
                  <span>⭐</span> {selectedStage.rewardXp} XP
                </div>
                <div className="flex items-center gap-2 font-crimson text-xs" style={{ color: '#e8dfc8' }}>
                  <span>🪙</span> {selectedStage.rewardGold} Or
                </div>
                <div className="flex items-center gap-2 font-crimson text-xs" style={{ color: '#e8dfc8' }}>
                  <span>💎</span> {selectedStage.rewardGems} Gemmes
                </div>
                {selectedStage.rewardCardId && (
                  <div className="flex items-center gap-2 font-crimson text-xs" style={{ color: '#c9a84c' }}>
                    <span>🃏</span> Créature spéciale
                  </div>
                )}
              </div>
            </div>

            {isStageCompleted(selectedStage) ? (
              <div className="flex items-center justify-center gap-2 py-3 rounded-lg" style={{ background: '#4ade8020', border: '1px solid #4ade8040' }}>
                <span>✅</span>
                <span className="font-cinzel text-xs font-bold" style={{ color: '#4ade80' }}>COMPLÉTÉ</span>
              </div>
            ) : (
              <button onClick={() => {
                const hero = HEROES.find(h => h.race !== selectedStage.bossRace) || HEROES[0];
                navigate(`/game?hero=${hero.id}&difficulty=${selectedStage.difficulty <= 3 ? 'NOVICE' : selectedStage.difficulty <= 6 ? 'SCHOLAR' : 'MASTER'}&campaign=${selectedStage.id}`);
              }}
                className="font-cinzel font-bold text-sm py-3 rounded-xl transition-all hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg, #c9a84c, #8a6d2b)',
                  color: '#080b12',
                  boxShadow: '0 0 20px #c9a84c40',
                }}>
                ⚔ COMBATTRE
              </button>
            )}

            <button onClick={() => setSelectedStage(null)} className="font-cinzel text-[10px]" style={{ color: '#5a6a80' }}>
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
