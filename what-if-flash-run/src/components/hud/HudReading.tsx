import React from 'react';
import {FONT} from '../../config/theme';

/** One label/value row of the HUD (e.g. MACH 1.00, ETA NYC 19 MIN). */
export const HudReading: React.FC<{label: string; value: string; top: number; accent: string}> = ({label, value, top, accent}) => (
  <div
    style={{
      position: 'absolute',
      top,
      right: 30,
      width: 310,
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      fontFamily: FONT,
      whiteSpace: 'nowrap',
    }}
  >
    <span style={{fontSize: 20, fontWeight: 700, letterSpacing: 3, color: accent, opacity: 0.9}}>{label}</span>
    <span style={{fontSize: 34, fontWeight: 800, color: 'white', fontVariantNumeric: 'tabular-nums', textShadow: '0 3px 0 rgba(0,0,0,0.5)'}}>
      {value}
    </span>
  </div>
);
