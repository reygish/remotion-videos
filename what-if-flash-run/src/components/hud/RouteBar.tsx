import React from 'react';
import {FONT} from '../../config/theme';

const TRACK_X = 96;
const TRACK_W = 760;

/** "LA ●━━━━━ NYC" route bar with a glowing runner marker; `trail` (0..1) stretches a speed streak behind it. */
export const RouteBar: React.FC<{progress: number; trail: number; accent: string; arrived: boolean; pulse: number}> = ({
  progress,
  trail,
  accent,
  arrived,
  pulse,
}) => {
  const x = TRACK_X + progress * TRACK_W;
  const label: React.CSSProperties = {
    position: 'absolute',
    top: 8,
    fontFamily: FONT,
    fontSize: 28,
    fontWeight: 900,
    letterSpacing: 2,
    color: 'white',
    textShadow: '0 3px 0 rgba(0,0,0,0.5)',
  };
  return (
    <div style={{position: 'absolute', left: 30, right: 30, top: 172, height: 56}}>
      <div style={{...label, left: 0}}>LA</div>
      <div style={{...label, right: 0, color: arrived ? accent : 'white'}}>NYC</div>
      {/* track */}
      <div style={{position: 'absolute', left: TRACK_X, width: TRACK_W, top: 23, height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.22)'}} />
      {Array.from({length: 9}, (_, i) => (
        <div
          key={i}
          style={{position: 'absolute', left: TRACK_X + ((i + 1) / 10) * TRACK_W - 1, top: 17, width: 3, height: 20, borderRadius: 2, background: 'rgba(255,255,255,0.28)'}}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          left: TRACK_X,
          width: progress * TRACK_W,
          top: 23,
          height: 8,
          borderRadius: 4,
          background: `linear-gradient(90deg, ${accent}55, ${accent})`,
          boxShadow: `0 0 14px ${accent}`,
        }}
      />
      {/* city dots */}
      <div style={{position: 'absolute', left: TRACK_X - 9, top: 18, width: 18, height: 18, borderRadius: 9, background: 'white'}} />
      <div
        style={{
          position: 'absolute',
          left: TRACK_X + TRACK_W - 9,
          top: 18,
          width: 18,
          height: 18,
          borderRadius: 9,
          background: arrived ? accent : 'rgba(255,255,255,0.55)',
          boxShadow: arrived ? `0 0 ${10 + pulse * 30}px ${accent}` : 'none',
        }}
      />
      {/* speed streak + runner marker */}
      {trail > 0.01 && (
        <div
          style={{
            position: 'absolute',
            left: x - trail * 260,
            width: trail * 260,
            top: 19,
            height: 16,
            borderRadius: 8,
            background: `linear-gradient(90deg, ${accent}00, white)`,
          }}
        />
      )}
      <div
        style={{
          position: 'absolute',
          left: x - 16,
          top: 11,
          width: 32,
          height: 32,
          borderRadius: 16,
          background: 'white',
          border: `6px solid ${accent}`,
          boxShadow: `0 0 22px ${accent}, 0 0 4px white`,
        }}
      />
    </div>
  );
};
