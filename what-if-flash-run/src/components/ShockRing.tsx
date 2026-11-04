import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {clamp} from '../lib/math';

/** 2D sonic-boom shock wave: bright rings + a pressure flash bursting out from (cx, cy) at `at`. */
export const ShockRing: React.FC<{at: number; cx?: number; cy?: number}> = ({at, cx = 540, cy = 880}) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < 0 || t > 40) return null;
  const flash = interpolate(t, [0, 2, 12], [0, 0.55, 0], clamp);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <defs>
          <radialGradient id="shock-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity={1} />
            <stop offset="60%" stopColor="#CFF8FF" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#CFF8FF" stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle cx={cx} cy={cy} r={interpolate(t, [0, 12], [60, 520], clamp)} fill="url(#shock-core)" opacity={flash} />
        {[0, 4, 9].map((delay, i) => {
          const k = t - delay;
          if (k < 0) return null;
          const r = interpolate(k, [0, 28], [40, 1500], {...clamp, easing: Easing.out(Easing.quad)});
          const o = interpolate(k, [0, 3, 28], [0, 0.95 - i * 0.2, 0], clamp);
          return (
            <g key={i} opacity={o}>
              <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.82} fill="none" stroke="rgba(0,20,40,0.35)" strokeWidth={interpolate(k, [0, 28], [40, 8], clamp)} />
              <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.82} fill="none" stroke="white" strokeWidth={interpolate(k, [0, 28], [22, 3], clamp)} />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
