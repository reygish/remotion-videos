import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SCENES} from '../config/scenes';
import {clamp, rand} from '../lib/math';
import {SceneFrame} from '../components/SceneFrame';
import {Headline} from '../components/Headline';
import {Mosquito} from '../components/Mosquito';

/** Opening hook: a swarm of mosquitoes vanishes as a red prohibition stamp slams over the title. */
export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const stamp = spring({frame: f - 62, fps, config: {damping: 9, mass: 0.8}});
  const vanish = interpolate(f, [62, 80], [1, 0], clamp);
  return (
    <SceneFrame duration={SCENES.hook} bg="radial-gradient(circle at 50% 40%, #2a3d2e 0%, #0b120d 70%)">
      {Array.from({length: 26}).map((_, i) => {
        const bx = rand(i) * 1080;
        const by = 500 + rand(i + 50) * 900;
        const x = bx + Math.sin(f / 9 + i) * 60 + Math.sin(f / 23 + i * 2) * 40;
        const y = by + Math.cos(f / 11 + i * 1.7) * 50;
        const s = 50 + rand(i + 99) * 90;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              transform: `scale(${vanish}) rotate(${Math.sin(f / 7 + i) * 20}deg)`,
              opacity: 0.85,
            }}
          >
            <Mosquito size={s} seed={i} />
          </div>
        );
      })}
      <Headline top={200} size={120}>
        WHAT IF
        <br />
        <span style={{color: '#FFE14D'}}>MOSQUITOES</span>
        <br />
        DIDN'T EXIST?
      </Headline>
      {/* big prohibition stamp */}
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', top: 300}}>
        <div style={{transform: `scale(${stamp * 1}) rotate(${(1 - stamp) * -40}deg)`, opacity: stamp}}>
          <svg width={620} height={620} viewBox="0 0 100 100">
            <circle cx={50} cy={50} r={44} fill="none" stroke="#ff3b3b" strokeWidth={8} />
            <line x1={19} y1={19} x2={81} y2={81} stroke="#ff3b3b" strokeWidth={8} />
          </svg>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', top: 300}}>
        <div style={{opacity: stamp, transform: `scale(${0.6 + stamp * 0.4})`}}>
          <Mosquito size={330} seed={3} />
        </div>
      </AbsoluteFill>
    </SceneFrame>
  );
};
