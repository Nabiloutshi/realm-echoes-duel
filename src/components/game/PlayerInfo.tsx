import { HeroState, HeroFloatingNumber, RACE_INFO } from '@/engine/types';

interface PlayerInfoProps {
  heroState: HeroState;
  isPlayer?: boolean;
  floatingNumbers?: HeroFloatingNumber[];
}

export default function PlayerInfo({ heroState, isPlayer = false, floatingNumbers = [] }: PlayerInfoProps) {
  const { hero, currentHp, maxHp, level } = heroState;
  const hpPercent = Math.max(0, (currentHp / maxHp) * 100);
  const raceInfo = RACE_INFO[hero.race];
  const raceColor = raceInfo.color;

  const borderGlow = isPlayer
    ? `0 0 20px ${raceColor}50, 0 0 40px ${raceColor}20`
    : `0 0 15px ${raceColor}30`;

  return (
    <div className="flex flex-col items-center gap-1.5 relative">
      {/* Floating numbers */}
      {floatingNumbers.map(f => (
        <div key={f.id} className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 animate-float-up"
          style={{
            color: f.type === 'damage' ? '#ff4444' : '#4ade80',
            fontSize: 28, fontWeight: 900, fontFamily: 'Cinzel',
            textShadow: f.type === 'damage' ? '0 2px 8px #ff000080' : '0 2px 8px #00ff0080',
          }}>
          {f.value}
        </div>
      ))}

      {/* Hero portrait */}
      <div className="relative" style={{
        width: isPlayer ? 150 : 120, height: isPlayer ? 210 : 170,
        borderRadius: 6,
        border: `3px solid ${raceColor}`,
        boxShadow: borderGlow,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #1a1520, #0d0a15)',
      }}>
        {/* Hero art */}
        {hero.artUrl ? (
          <img src={hero.artUrl} alt={hero.name} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span style={{ fontSize: 50, opacity: 0.4 }}>{raceInfo.icon}</span>
          </div>
        )}

        {/* LV badge */}
        <div className="absolute top-1 left-1 z-10" style={{
          width: 26, height: 26, borderRadius: '50%',
          background: 'linear-gradient(135deg, #2d5a27, #1a3d15)',
          border: '1.5px solid #4a8a3f',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 6, color: '#8bc34a', fontFamily: 'Cinzel' }}>LV</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', fontFamily: 'Cinzel', marginTop: -2 }}>{level}</span>
        </div>

        {/* Name */}
        <div className="absolute top-1 left-8 right-0 z-10">
          <div style={{ fontSize: 9, fontWeight: 700, color: '#e8dfc8', fontFamily: 'Cinzel', textShadow: '0 1px 3px #000' }}>
            {hero.name}
          </div>
          <div className="flex gap-px">
            {[1,2,3,4,5].map(i => (
              <span key={i} style={{ color: '#f0c040', fontSize: 8, textShadow: '0 0 4px #f0c040' }}>★</span>
            ))}
          </div>
        </div>

        {/* Skill icon slots */}
        <div className="absolute left-1 bottom-8 z-10 flex flex-col gap-1">
          <div style={{
            width: 18, height: 18, borderRadius: '50%',
            background: '#1a223580', border: '1px solid #2a324560',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10,
          }}>⚡</div>
        </div>

        {/* HP at bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-2 py-1 flex items-center gap-1"
          style={{ background: 'linear-gradient(transparent, #000000cc)' }}>
          <span style={{ color: '#e74c7d', fontSize: 11 }}>❤</span>
          <span style={{
            color: currentHp < maxHp * 0.3 ? '#ff4444' : '#e8dfc8',
            fontSize: 12, fontWeight: 700, fontFamily: 'Cinzel',
          }}>
            {currentHp}/{maxHp}
          </span>
        </div>
      </div>

      {/* HP bar */}
      <div style={{
        width: isPlayer ? 150 : 120, height: 5, borderRadius: 3,
        background: '#1a1a2e', overflow: 'hidden',
        border: '1px solid #2a324540',
      }}>
        <div style={{
          height: '100%', width: `${hpPercent}%`,
          background: hpPercent > 60 ? '#4ade80' : hpPercent > 30 ? '#fb923c' : '#ef4444',
          transition: 'width 0.5s', borderRadius: 3,
        }} />
      </div>
    </div>
  );
}
