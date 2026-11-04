import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {FONT} from '../config/theme';
import {SCENES} from '../config/scenes';
import {clamp, rand} from '../lib/math';
import {cue} from '../lib/voiceover';
import {SceneFrame} from '../components/SceneFrame';
import {Headline} from '../components/Headline';
import {Fish} from '../components/Fish';

/** Underwater pond: wriggling mosquito larvae fade away, leaving swimming fish hungry and confused. */
export const Pond: React.FC = () => {
  const f = useCurrentFrame();
  // Labels appear on "Fish"; larvae vanish on "Some of them", fish is puzzled on "hungry".
  const labelsAt = cue('pond', 'Fish');
  const vanishAt = cue('pond', 'Some');
  const hungryAt = cue('pond', 'hungry');
  const larvaeFade = interpolate(f, [vanishAt, hungryAt + 5], [1, 0], clamp);
  const qPop = interpolate(f, [hungryAt, hungryAt + 15], [0, 1], clamp);
  const fishX = 140 + Math.sin(f / 30) * 260;
  return (
    <SceneFrame duration={SCENES.pond} bg="linear-gradient(#0d2a3a 0%, #0d2a3a 38%, #0a4a5c 38%, #04202b 100%)">
      {/* water surface wave */}
      <svg width={1080} height={80} style={{position: 'absolute', top: 690}} viewBox="0 0 1080 80">
        <path
          d={`M0 40 ${Array.from({length: 13})
            .map((_, i) => `Q ${i * 90 + 45} ${40 + Math.sin(f / 8 + i) * 22} ${(i + 1) * 90} 40`)
            .join(' ')} L1080 80 L0 80 Z`}
          fill="#0a4a5c"
        />
      </svg>
      <Headline top={200} size={84}>
        BUT THEIR BABIES
        <br />
        ARE <span style={{color: '#5ee7ff'}}>FOOD</span>
      </Headline>
      {/* light rays */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: 740,
            left: 150 + i * 330,
            width: 120,
            height: 900,
            background: 'linear-gradient(rgba(255,255,255,0.12), transparent)',
            transform: `skewX(${-12 + Math.sin(f / 40 + i) * 4}deg)`,
          }}
        />
      ))}
      {/* wriggling larvae */}
      {Array.from({length: 18}).map((_, i) => {
        const x = 80 + rand(i + 3) * 900;
        const y = 800 + rand(i + 33) * 650;
        const wig = Math.sin(f / 4 + i) * 25;
        return (
          <svg
            key={i}
            width={40}
            height={80}
            viewBox="0 0 20 40"
            style={{position: 'absolute', left: x, top: y + Math.sin(f / 15 + i) * 15, opacity: larvaeFade * 0.9, transform: `rotate(${wig}deg)`}}
          >
            <path d="M10 2 Q16 12 10 20 Q4 28 10 38" stroke="#d6f5c9" strokeWidth={4} fill="none" strokeLinecap="round" />
            <circle cx={10} cy={4} r={4} fill="#d6f5c9" />
          </svg>
        );
      })}
      <Fish x={fishX} y={1060} color="#ffa94d" />
      <Fish x={740 - Math.sin(f / 26) * 200} y={1300} flip color="#ffd43b" />
      {/* question bubble */}
      <div
        style={{
          position: 'absolute',
          left: fishX + 60,
          top: 940,
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 110,
          color: 'white',
          transform: `scale(${qPop})`,
        }}
      >
        ?
      </div>
      {/* labels */}
      <div style={{position: 'absolute', top: 470, width: '100%', display: 'flex', justifyContent: 'center', gap: 24}}>
        {['FISH', 'FROGS', 'DRAGONFLIES'].map((t, i) => (
          <div
            key={t}
            style={{
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: 42,
              color: '#04202b',
              background: '#5ee7ff',
              padding: '10px 28px',
              borderRadius: 40,
              opacity: interpolate(f, [labelsAt + i * 10, labelsAt + 10 + i * 10], [0, 1], clamp),
            }}
          >
            {t}
          </div>
        ))}
      </div>
    </SceneFrame>
  );
};
