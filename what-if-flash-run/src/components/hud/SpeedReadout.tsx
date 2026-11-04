import React from 'react';
import {FONT} from '../../config/theme';
import {formatKmh} from '../../lib/format';

/** Big speed digits (km/h) with a small caption; shows "ARRIVED" once the run is over. */
export const SpeedReadout: React.FC<{kmh: number; arrived: boolean; accent: string}> = ({kmh, arrived, accent}) => (
  <div style={{position: 'absolute', left: 34, top: 18, fontFamily: FONT}}>
    <div style={{fontSize: 22, fontWeight: 700, letterSpacing: 5, color: accent, opacity: 0.9}}>
      {arrived ? 'STATUS' : 'SPEED · KM/H'}
    </div>
    <div
      style={{
        marginTop: 2,
        fontSize: 92,
        fontWeight: 800,
        lineHeight: 1,
        letterSpacing: -2,
        color: arrived ? accent : 'white',
        fontVariantNumeric: 'tabular-nums',
        textShadow: `0 0 26px ${accent}AA, 0 4px 0 rgba(0,0,0,0.5)`,
        whiteSpace: 'nowrap',
      }}
    >
      {arrived ? 'ARRIVED' : formatKmh(kmh)}
    </div>
  </div>
);
