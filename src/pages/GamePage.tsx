import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useGame } from '@/hooks/useGame';
import { useProgress } from '@/hooks/useProgress';
import { AIDifficulty } from '@/engine/types';
import { getXpReward, getGoldReward, CAMPAIGN_STAGES } from '@/data/progression';
import PlayerInfo from '@/components/game/PlayerInfo';
import GameBoard from '@/components/game/GameBoard';
import EventLog from '@/components/game/EventLog';
import GameOverOverlay from '@/components/game/GameOverOverlay';
import { ALL_CARDS } from '@/data/cards';
import { HEROES } from '@/data/heroes';

export default function GamePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const difficulty = (searchParams.get('difficulty') || 'SCHOLAR') as AIDifficulty;
  const heroId = searchParams.get('hero');
  const campaignStageId = searchParams.get('campaign');

  const { gameState, isAnimating, startGame, endRound, toggleAuto, toggleSpeed } = useGame();
  const { progress, gainXp, addGold, addGems, completeStage, unlockCard } = useProgress();
  const [rewardsGiven, setRewardsGiven] = useState(false);
  const [showRewards, setShowRewards] = useState(false);
  const [rewards, setRewards] = useState({ xp: 0, gold: 0, gems: 0, levelsGained: 0, cardId: '' });

  useEffect(() => {
    if (!gameState) {
      const hero = heroId ? HEROES.find(h => h.id === heroId) : HEROES[0];
      const selectedHero = hero || HEROES[0];
      const raceUnits = ALL_CARDS.filter(c => c.race === selectedHero.race);
      const sorted = [...raceUnits].sort((a, b) => (b.atk * 2 + b.hp) - (a.atk * 2 + a.hp));
      startGame(selectedHero, sorted.slice(0, 5), difficulty);
    }
  }, []);

  // Give rewards on game end
  useEffect(() => {
    if (!gameState || gameState.status === 'PLAYING' || rewardsGiven) return;
    setRewardsGiven(true);
    const won = gameState.status === 'VICTORY';
    const xp = getXpReward(won, difficulty);
    const gold = getGoldReward(won);
    let gems = 0;
    let cardId = '';

    const levelsGained = gainXp(xp);
    addGold(gold);

    if (won && campaignStageId) {
      const stage = CAMPAIGN_STAGES.find(s => s.id === campaignStageId);
      if (stage) {
        completeStage(stage.id);
        addGold(stage.rewardGold);
        addGems(stage.rewardGems);
        gems = stage.rewardGems;
        if (stage.rewardCardId) {
          unlockCard(stage.rewardCardId);
          cardId = stage.rewardCardId;
        }
      }
    }

    setRewards({ xp, gold, gems, levelsGained, cardId });
    setTimeout(() => setShowRewards(true), 500);
  }, [gameState?.status, rewardsGiven]);

  if (!gameState) return null;

  return (
    <div className="flex h-screen overflow-hidden relative" style={{ background: '#080b12' }}>
      {/* LEFT: Player Hero */}
      <div className="w-[170px] shrink-0 flex flex-col items-center justify-center py-3"
        style={{
          background: 'linear-gradient(180deg, #0a0e18, #080b12)',
          borderRight: '2px solid #1a2235',
        }}>
        <PlayerInfo
          heroState={gameState.player.hero}
          isPlayer
          floatingNumbers={gameState.heroFloatingNumbers.filter(f => f.side === 'player')}
        />
        <div className="mt-2 font-cinzel text-[10px] tracking-wider" style={{ color: '#8a9bb0' }}>
          Joueur
        </div>
      </div>

      {/* CENTER: Battle Board */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-center py-1.5"
          style={{ background: '#0a0e18', borderBottom: '1px solid #1a2235' }}>
          <span className="font-cinzel text-xs tracking-wider" style={{ color: '#c9a84c' }}>
            ROUND {gameState.round}
          </span>
          {campaignStageId && (
            <span className="ml-3 font-crimson text-[10px]" style={{ color: '#8a9bb080' }}>
              {CAMPAIGN_STAGES.find(s => s.id === campaignStageId)?.name}
            </span>
          )}
        </div>
        <GameBoard state={gameState} />
      </div>

      {/* RIGHT: Opponent Hero + Controls */}
      <div className="w-[170px] shrink-0 flex flex-col"
        style={{
          background: 'linear-gradient(180deg, #0a0e18, #080b12)',
          borderLeft: '2px solid #1a2235',
        }}>
        <div className="flex flex-col items-center py-3">
          <PlayerInfo
            heroState={gameState.opponent.hero}
            floatingNumbers={gameState.heroFloatingNumbers.filter(f => f.side === 'opponent')}
          />
        </div>

        <div className="flex flex-col items-center gap-2 py-3 mx-3"
          style={{ borderTop: '1px solid #1a2235' }}>
          <button onClick={toggleAuto}
            className="font-cinzel text-[10px] font-bold px-4 py-1.5 rounded-full transition-all w-full"
            style={{
              background: gameState.isAutoBattle ? 'linear-gradient(135deg, #c9a84c, #8a6d2b)' : '#1a2235',
              color: gameState.isAutoBattle ? '#080b12' : '#8a9bb0',
              border: `1px solid ${gameState.isAutoBattle ? '#c9a84c' : '#2a3245'}`,
            }}>
            Auto
          </button>

          <div className="flex items-center justify-center"
            style={{
              width: 42, height: 42, borderRadius: '50%',
              background: 'linear-gradient(135deg, #0d1220, #1a2235)',
              border: `2px solid ${gameState.isAutoBattle ? '#ef4444' : '#3a6a8a'}`,
              color: gameState.isAutoBattle ? '#ef4444' : '#3a6a8a',
              fontFamily: 'Cinzel', fontWeight: 700, fontSize: 16,
            }}>
            {gameState.round}
          </div>

          <button onClick={endRound}
            disabled={isAnimating || gameState.status !== 'PLAYING'}
            className="font-cinzel text-[10px] font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex flex-col items-center justify-center"
            style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'linear-gradient(135deg, #1a2235, #2a3245)',
              border: '2px solid #3a4a60',
              color: '#e8dfc8',
            }}>
            <span style={{ fontSize: 18 }}>▶</span>
            <span style={{ fontSize: 7, marginTop: 1 }}>End Round</span>
          </button>

          <button onClick={toggleSpeed}
            className="font-cinzel text-[9px] px-3 py-1 rounded transition-all"
            style={{
              background: gameState.battleSpeed === 2 ? '#2563eb' : '#1a2235',
              color: gameState.battleSpeed === 2 ? '#fff' : '#8a9bb0',
              border: '1px solid #2a3245',
            }}>
            Fast Fwd
          </button>
        </div>

        <div className="flex-1 min-h-0" style={{ borderTop: '1px solid #1a2235' }}>
          <EventLog events={gameState.events} />
        </div>
      </div>

      {/* Game Over + Rewards */}
      <GameOverOverlay
        status={gameState.status}
        onNewGame={() => {
          setRewardsGiven(false);
          setShowRewards(false);
          const hero = heroId ? HEROES.find(h => h.id === heroId) : HEROES[0];
          const selectedHero = hero || HEROES[0];
          const raceUnits = ALL_CARDS.filter(c => c.race === selectedHero.race);
          const sorted = [...raceUnits].sort((a, b) => (b.atk * 2 + b.hp) - (a.atk * 2 + a.hp));
          startGame(selectedHero, sorted.slice(0, 5), difficulty);
        }}
        onMenu={() => navigate(campaignStageId ? '/campaign' : '/')}
      />

      {/* Rewards overlay */}
      {showRewards && gameState.status !== 'PLAYING' && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 px-6 py-3 rounded-xl animate-level-up"
          style={{
            background: 'linear-gradient(135deg, #0d1220ee, #1a2235ee)',
            border: '2px solid #c9a84c60',
            boxShadow: '0 0 30px #c9a84c20',
          }}>
          <div className="flex items-center gap-2 font-cinzel text-xs" style={{ color: '#e8dfc8' }}>
            <span>⭐</span> +{rewards.xp} XP
          </div>
          <div className="flex items-center gap-2 font-cinzel text-xs" style={{ color: '#e8dfc8' }}>
            <span>🪙</span> +{rewards.gold}
          </div>
          {rewards.gems > 0 && (
            <div className="flex items-center gap-2 font-cinzel text-xs" style={{ color: '#e8dfc8' }}>
              <span>💎</span> +{rewards.gems}
            </div>
          )}
          {rewards.levelsGained > 0 && (
            <div className="flex items-center gap-2 font-cinzel text-xs font-bold" style={{ color: '#f0c040' }}>
              🎉 Niveau {progress.level}!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
