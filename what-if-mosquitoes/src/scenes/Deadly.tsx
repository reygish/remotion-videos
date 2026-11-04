import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from '../config/theme';
import {SCENES} from '../config/scenes';
import {clamp} from '../lib/math';
import {SceneFrame} from '../components/SceneFrame';
import {Caption} from '../components/Caption';
import {Headline} from '../components/Headline';

/** "Deadliest animal" scene: a counter ticks up to 600,000 malaria deaths, then disease pills pop in. */
export const Deadly: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const count = Math.round(
    interpolate(f, [30, 120], [0, 600000], {...clamp, easing: Easing.out(Easing.cubic)})
  );
  const diseases = ['MALARIA', 'DENGUE', 'ZIKA', 'WEST NILE', 'YELLOW FEVER'];
  const pulse = 1 + Math.sin(f / 5) * 0.02;
  return (
    <SceneFrame duration={SCENES.deadly} bg="radial-gradient(circle at 50% 35%, #5a0f14 0%, #160304 75%)">
      <Headline top={190} size={80} color="#ffb3b3">
        THE DEADLIEST ANIMAL
        <br />
        ON EARTH
      </Headline>
      <div
        style={{
          position: 'absolute',
          top: 560,
          width: '100%',
          textAlign: 'center',
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 210,
          letterSpacing: -6,
          color: '#ff4d4d',
          transform: `scale(${pulse})`,
          textShadow: '0 0 60px rgba(255,60,60,0.6)',
        }}
      >
        {count.toLocaleString('en-US')}
      </div>
      <div
        style={{
          position: 'absolute',
          top: 820,
          width: '100%',
          textAlign: 'center',
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 50,
          color: 'white',
          opacity: interpolate(f, [60, 80], [0, 1], clamp),
        }}
      >
        deaths a year from malaria alone
      </div>
      <div
        style={{
          position: 'absolute',
          top: 980,
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 22,
          padding: '0 80px',
        }}
      >
        {diseases.map((d, i) => {
          const s = spring({frame: f - 100 - i * 8, fps, config: {damping: 12}});
          return (
            <div
              key={d}
              style={{
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: 44,
                color: 'white',
                background: 'rgba(255,77,77,0.22)',
                border: '3px solid #ff4d4d',
                borderRadius: 60,
                padding: '14px 34px',
                transform: `scale(${s})`,
              }}
            >
              {d}
            </div>
          );
        })}
      </div>
      <Caption text="Mosquitoes kill more humans than any other animal on the planet." end={190} />
    </SceneFrame>
  );
};
