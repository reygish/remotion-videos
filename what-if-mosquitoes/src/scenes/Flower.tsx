import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SCENES} from '../config/scenes';
import {clamp} from '../lib/math';
import {cue} from '../lib/voiceover';
import {SceneFrame} from '../components/SceneFrame';
import {Headline} from '../components/Headline';
import {Mosquito} from '../components/Mosquito';

/** A flower blooms, then wilts as its mosquito pollinator flies off and fades away. */
export const Flower: React.FC = () => {
  const f = useCurrentFrame();
  // The mosquito leaves on "rely", then the flower wilts.
  const leaveAt = cue('flower', 'rely');
  const {fps} = useVideoConfig();
  const bloom = spring({frame: f - 10, fps, config: {damping: 15}});
  const wilt = interpolate(f, [leaveAt + 15, leaveAt + 55], [0, 1], clamp);
  return (
    <SceneFrame duration={SCENES.flower} bg="radial-gradient(circle at 50% 50%, #2f1d4a 0%, #0f0818 75%)">
      <Headline top={190} size={84}>
        SOME FLOWERS
        <br />
        LOSE A <span style={{color: '#f783ac'}}>POLLINATOR</span>
      </Headline>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', top: 180}}>
        <svg width={700} height={900} viewBox="0 0 350 450">
          <path d={`M175 450 Q${170 + wilt * 40} 330 175 ${200 + wilt * 30}`} stroke="#51cf66" strokeWidth={10} fill="none" />
          <path d="M175 360 Q120 330 100 280 Q150 300 175 340" fill="#51cf66" />
          <g
            style={{
              transformOrigin: '175px 190px',
              transform: `scale(${bloom}) rotate(${wilt * 35}deg) translateY(${wilt * 40}px)`,
              filter: `saturate(${1 - wilt * 0.8}) brightness(${1 - wilt * 0.3})`,
            }}
          >
            {[0, 60, 120, 180, 240, 300].map((r) => (
              <ellipse key={r} cx={175} cy={120} rx={36} ry={72} fill="#e8e3c0" transform={`rotate(${r} 175 190)`} opacity={0.95} />
            ))}
            <circle cx={175} cy={190} r={34} fill="#9c36b5" />
            <circle cx={175} cy={190} r={16} fill="#ffd43b" />
          </g>
        </svg>
      </AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: 540 + Math.sin(f / 12) * 180,
          top: 760 + Math.cos(f / 9) * 60,
          opacity: interpolate(f, [leaveAt, leaveAt + 15], [1, 0], clamp),
        }}
      >
        <Mosquito size={150} seed={7} />
      </div>
    </SceneFrame>
  );
};
