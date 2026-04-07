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

  return (
    <div className="flex flex-col items-center gap-2 relative">
      {/* Floating numbers */}
      {floatingNumbers.map(f => (
        <div key={f.id} className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 animate-float-up"
          style={{
            color: f.type === 'damage' ? '#ff4444' : '#4ade80',
            fontSize: 32, fontWeight: 900, fontFamily: 'Cinzel',
            textShadow: f.type === 'damage' ? '0 2px 8px #ff000080' : '0 2px 8px #00ff0080',
          }}>
          {f.value}
        </div>
      ))}

      {/* Hero name */}
      <div className="font-cinzel text-[10px] tracking-wider" style={{ color: raceColor }}>
        {hero.name}
      </div>

      {/* Hero portrait */}
      <div className="relative" style={{
        width: 140, height: 200, borderRadius: 8,
        border: `3px solid ${raceColor}`,
        boxShadow: `0 0 20px ${raceColor}40, inset 0 0 15px ${raceColor}20`,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #1a1520, #0d0a15)',
      }}>
        {/* Hero art */}
        {hero.artUrl ? (
          <img src={hero.artUrl} alt={hero.name} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span style={{ fontSize: 60, opacity: 0.4 }}>{raceInfo.icon}</span>
          </div>
        )}

        {/* LV badge */}
        <div className="absolute top-1 left-1 z-10" style={{
          width: 30, height: 30, borderRadius: '50%',
          background: '#2d5a27', border: '2px solid #4a8a3f',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 7, color: '#8bc34a', fontFamily: 'Cinzel' }}>LV</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', fontFamily: 'Cinzel', marginTop: -2 }}>{level}</span>
        </div>

        {/* Stars */}
        <div className="absolute top-1 right-1 z-10 flex gap-0.5">
          {[1,2,3,4,5].map(i => (
            <span key={i} style={{ color: '#f0c040', fontSize: 10, textShadow: '0 0 4px #f0c040' }}>★</span>
          ))}
        </div>

        {/* HP at bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 flex items-center gap-1"
          style={{ background: 'linear-gradient(transparent, #000000cc)' }}>
          <span style={{ color: '#e74c7d', fontSize: 12 }}>❤</span>
          <span style={{
            color: currentHp < maxHp * 0.3 ? '#ff4444' : '#e8dfc8',
            fontSize: 14, fontWeight: 700, fontFamily: 'Cinzel',
          }}>
            {currentHp}/{maxHp}
          </span>
        </div>
      </div>

      {/* HP bar */}
      <div style={{ width: 140, height: 6, borderRadius: 3, background: '#1a1a2e', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${hpPercent}%`,
          background: hpPercent > 60 ? '#4ade80' : hpPercent > 30 ? '#fb923c' : '#ef4444',
          transition: 'width 0.5s', borderRadius: 3,
        }} />
      </div>

      {/* Skill */}
      <div className="text-center" style={{ maxWidth: 140 }}>
        <div className="font-cinzel text-[9px]" style={{ color: 'hsl(var(--primary))' }}>{hero.skillName}</div>
        <div className="text-[8px] font-crimson" style={{ color: 'hsl(var(--muted-foreground))' }}>{hero.skillDescription}</div>
      </div>
    </div>
  );
}
