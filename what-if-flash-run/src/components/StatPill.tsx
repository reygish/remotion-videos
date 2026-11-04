import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from '../config/theme';
import {CYAN, INK} from '../lib/palette';
import {clamp} from '../lib/math';

/** Dark glass pill with an accent border, centred at `top`; pops in at `at`, fades at `out`. */
export const StatPill: React.FC<{
  at: number;
  out?: number;
  top: number;
  color?: string;
  size?: number;
  solid?: boolean;
  children: React.ReactNode;
}> = ({at, out, top, color = CYAN, size = 44, solid = false, children}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < at || (out !== undefined && f > out + 10)) return null;
  const s = spring({frame: f - at, fps, config: {damping: 11, mass: 0.6}});
  const exit = out === undefined ? 0 : interpolate(f, [out, out + 10], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', top, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: size,
          letterSpacing: 1,
          color: solid ? INK : 'white',
          background: solid ? color : 'rgba(4,16,28,0.72)',
          border: `4px solid ${color}`,
          borderRadius: 999,
          padding: `${Math.round(size * 0.3)}px ${Math.round(size * 0.8)}px`,
          boxShadow: `0 0 34px ${color}66, 0 12px 30px rgba(0,0,0,0.35)`,
          whiteSpace: 'nowrap',
          fontVariantNumeric: 'tabular-nums',
          opacity: Math.min(1, s * 2) * (1 - exit),
          transform: `translateY(${-exit * 30}px) scale(${interpolate(s, [0, 1], [0.6, 1])})`,
        }}
      >
        {children}
      </div>
    </div>
  );
};
