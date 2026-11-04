import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from '../config/theme';
import {SCENES} from '../config/scenes';
import {clamp, rand} from '../lib/math';
import {cue} from '../lib/voiceover';
import {SceneFrame} from '../components/SceneFrame';
import {Headline} from '../components/Headline';
import {Animal, AnimalKind} from '../components/Animal';

/** The twist: wolves, lynx and Przewalski's horses roam the empty zone, then the end card. */
export const Wildlife: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const endAt = cue('wildlife', 'So');
  const animals: {kind: AnimalKind; label: string; at: number; x: number; y: number; size: number}[] = [
    {kind: 'wolf', label: 'WOLVES', at: cue('wildlife', 'Wolves'), x: 40, y: 1010, size: 340},
    {kind: 'lynx', label: 'LYNX', at: cue('wildlife', 'lynx'), x: 650, y: 985, size: 290},
    {kind: 'horse', label: "PRZEWALSKI'S HORSES", at: cue('wildlife', 'Przewalskis'), x: 270, y: 1060, size: 450},
  ];
  const end = spring({frame: f - endAt, fps, config: {damping: 12}});
  const dim = interpolate(f, [endAt - 5, endAt + 12], [0, 0.85], clamp);
  return (
    <SceneFrame duration={SCENES.wildlife} bg="linear-gradient(#2a1840 0%, #8a3b4a 40%, #f0a04b 66%, #f7c86b 72%)">
      {/* distant pine forest and the golden meadow in front of it */}
      <svg width={1080} height={1200} viewBox="0 0 1080 1200" style={{position: 'absolute', top: 760}}>
        <defs>
          <linearGradient id="wild-meadow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e2ad55" />
            <stop offset="45%" stopColor="#9a6430" />
            <stop offset="100%" stopColor="#2a1a0c" />
          </linearGradient>
        </defs>
        {Array.from({length: 18}).map((_, i) => {
          const x = i * 64 + rand(i) * 30 - 30;
          const h = 110 + rand(i + 40) * 120;
          return <path key={i} d={`M${x} 250 L${x + 40} ${250 - h} L${x + 80} 250 Z`} fill="#6a3446" />;
        })}
        <rect x={0} y={240} width={1080} height={960} fill="url(#wild-meadow)" />
      </svg>
      {/* fireflies / pollen */}
      {Array.from({length: 24}).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: rand(i + 11) * 1080 + Math.sin(f / 20 + i) * 30,
            top: 700 + rand(i + 22) * 600 + Math.cos(f / 25 + i) * 30,
            width: 8,
            height: 8,
            borderRadius: 4,
            background: '#ffe9a8',
            opacity: 0.3 + Math.abs(Math.sin(f / 10 + i)) * 0.6,
          }}
        />
      ))}
      {animals.map((a, i) => {
        const s = spring({frame: f - a.at, fps, config: {damping: 14}});
        const walk = interpolate(f, [a.at, SCENES.wildlife], [0, 60], clamp);
        return (
          <div key={a.kind} style={{position: 'absolute', left: a.x - (1 - s) * 400 + walk, top: a.y, opacity: s}}>
            <Animal kind={a.kind} size={a.size} seed={i} color={i === 2 ? '#3a200c' : '#1c100a'} />
          </div>
        );
      })}
      {/* title and labels make way for the end card */}
      <div style={{opacity: 1 - dim / 0.85}}>
        <Headline top={190} size={92}>
          THE TWIST:
          <br />
          <span style={{color: '#ffe066'}}>NATURE MOVED IN</span>
        </Headline>
        <div
          style={{
            position: 'absolute',
            top: 470,
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 20,
            padding: '0 70px',
          }}
        >
          {animals.map((a) => {
            const s = spring({frame: f - a.at, fps, config: {damping: 12}});
            return (
              <div
                key={a.label}
                style={{
                  fontFamily: FONT,
                  fontWeight: 800,
                  fontSize: 44,
                  color: '#2a1840',
                  background: '#ffe066',
                  borderRadius: 50,
                  padding: '12px 30px',
                  transform: `scale(${s})`,
                }}
              >
                {a.label}
              </div>
            );
          })}
        </div>
      </div>
      {/* end card */}
      <AbsoluteFill style={{background: '#0d0614', opacity: dim}} />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', top: -120}}>
        <div style={{transform: `scale(${end})`, textAlign: 'center', fontFamily: FONT, fontWeight: 900, color: 'white'}}>
          <div style={{fontSize: 64, color: '#ffe066'}}>Without Chernobyl…</div>
          <div style={{fontSize: 118, letterSpacing: -3, lineHeight: 1.05}}>
            WOULD THE
            <br />
            WORLD BE
            <br />
            BETTER?
          </div>
          <div
            style={{
              marginTop: 50,
              display: 'inline-block',
              fontSize: 58,
              background: '#ffe066',
              color: 'black',
              padding: '18px 44px',
              borderRadius: 20,
              transform: `rotate(-2deg) scale(${1 + Math.sin(f / 6) * 0.03})`,
            }}
          >
            COMMENT BELOW
          </div>
        </div>
      </AbsoluteFill>
    </SceneFrame>
  );
};
