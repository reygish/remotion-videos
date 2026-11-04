import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {FONT} from '../config/theme';
import {SCENES} from '../config/scenes';
import {clamp} from '../lib/math';
import {cue} from '../lib/voiceover';
import {SceneFrame} from '../components/SceneFrame';
import {Headline} from '../components/Headline';
import {Counter} from '../components/Counter';
import {GeigerCounter} from '../components/GeigerCounter';

/** The human toll: a Geiger counter climbs while three counters land on their spoken numbers. */
export const Toll: React.FC = () => {
  const f = useCurrentFrame();
  const rows = [
    {at: cue('toll', '31'), value: 31, label: 'deaths in the immediate aftermath'},
    {at: cue('toll', 'Pripyats'), value: 49000, label: 'evacuated from the city of Pripyat'},
    {at: cue('toll', '350000'), value: 350000, label: 'people relocated in all', prefix: '~'},
  ];
  const level = interpolate(f, [0, SCENES.toll * 0.7], [0.15, 0.95], clamp);
  return (
    <SceneFrame duration={SCENES.toll} bg="radial-gradient(circle at 50% 30%, #2c2c1e 0%, #0a0a07 75%)">
      <Headline top={190} size={92} color="#f5ecd0">
        THE HUMAN <span style={{color: '#f5d90a'}}>TOLL</span>
      </Headline>
      <div style={{position: 'absolute', top: 330, width: '100%', display: 'flex', justifyContent: 'center'}}>
        <GeigerCounter size={340} level={level} />
      </div>
      {rows.map((r, i) => {
        const show = interpolate(f, [r.at - 4, r.at + 10], [0, 1], clamp);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: 670 + i * 225,
              width: '100%',
              textAlign: 'center',
              fontFamily: FONT,
              opacity: show,
              transform: `translateY(${(1 - show) * 40}px)`,
            }}
          >
            <div style={{fontWeight: 900, fontSize: 124, letterSpacing: -4, lineHeight: 1, color: '#f5d90a', textShadow: '0 0 40px rgba(245,217,10,0.35)'}}>
              {r.prefix}
              <Counter value={r.value} from={r.at} to={r.at + 22} />
            </div>
            <div style={{fontWeight: 700, fontSize: 44, color: '#f5ecd0', marginTop: 8}}>{r.label}</div>
          </div>
        );
      })}
    </SceneFrame>
  );
};
