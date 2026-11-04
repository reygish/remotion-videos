import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {SCENES} from '../config/scenes';
import {clamp, rand} from '../lib/math';
import {cue} from '../lib/voiceover';
import {SceneFrame} from '../components/SceneFrame';
import {Headline} from '../components/Headline';

/** Arctic landscape: migrating bird flocks fly over as the mosquito swarm cloud fades out. */
export const Arctic: React.FC = () => {
  const f = useCurrentFrame();
  // The swarm fades as the narrator says "That buffet would vanish".
  const vanishAt = cue('arctic', 'buffet');
  return (
    <SceneFrame duration={SCENES.arctic} bg="linear-gradient(#8ec5fc 0%, #e0f0ff 55%, #ffffff 100%)">
      {/* mountains */}
      <svg width={1080} height={700} viewBox="0 0 1080 700" style={{position: 'absolute', top: 1050}}>
        <path d="M0 300 L180 120 L330 260 L520 60 L720 280 L880 150 L1080 300 L1080 700 L0 700 Z" fill="#b9d3ea" />
        <path d="M0 420 L240 260 L460 400 L680 240 L900 380 L1080 300 L1080 700 L0 700 Z" fill="#dbe9f5" />
        <path d="M0 520 Q540 430 1080 520 L1080 700 L0 700 Z" fill="#ffffff" />
      </svg>
      {/* migrating birds (V formations) */}
      {[0, 1, 2].map((g) => {
        const gx = interpolate(f, [0, SCENES.arctic], [-60 - g * 260, 1500 - g * 260]);
        const gy = 620 + g * 160;
        return Array.from({length: 7}).map((_, i) => {
          const off = Math.ceil(i / 2) * (i % 2 ? 1 : -1);
          const flap = Math.sin(f / 3 + i + g) * 12;
          return (
            <svg
              key={`${g}-${i}`}
              width={70}
              height={40}
              viewBox="0 0 70 40"
              style={{position: 'absolute', left: gx - Math.abs(off) * 60, top: gy + off * 40}}
            >
              <path d={`M0 ${20 - flap} Q18 20 35 22 Q52 20 70 ${20 - flap}`} stroke="#22313f" strokeWidth={5} fill="none" strokeLinecap="round" />
            </svg>
          );
        });
      })}
      {/* swarm cloud */}
      {Array.from({length: 120}).map((_, i) => {
        const cx = 540 + Math.sin(f / 20 + i) * (150 + rand(i) * 250);
        const cy = 1250 + Math.cos(f / 17 + i * 1.3) * (60 + rand(i + 9) * 120);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: cx,
              top: cy,
              width: 6,
              height: 6,
              borderRadius: 3,
              background: '#22313f',
              opacity: interpolate(f, [vanishAt, vanishAt + 40], [0.8, 0], clamp),
            }}
          />
        );
      })}
      <Headline top={190} size={84} color="#0d2a3a">
        THE ARCTIC
        <br />
        GOES <span style={{color: '#e8590c'}}>QUIET</span>
      </Headline>
    </SceneFrame>
  );
};
