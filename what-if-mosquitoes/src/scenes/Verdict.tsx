import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from '../config/theme';
import {SCENES} from '../config/scenes';
import {clamp} from '../lib/math';
import {cue} from '../lib/voiceover';
import {SceneFrame} from '../components/SceneFrame';
import {Headline} from '../components/Headline';

/** Closing verdict: a species bar showing few mosquitoes bite humans, then the "nature would adapt" end card. */
export const Verdict: React.FC = () => {
  const f = useCurrentFrame();
  // Bar fills on "3,500", note on "only", end card on "Most scientists".
  const barAt = cue('verdict', '3,500');
  const noteAt = cue('verdict', 'only');
  const endAt = cue('verdict', 'Most');
  const {fps} = useVideoConfig();
  const bar = interpolate(f, [barAt, barAt + 50], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const end = spring({frame: f - endAt, fps, config: {damping: 12}});
  return (
    <SceneFrame duration={SCENES.verdict} bg="radial-gradient(circle at 50% 40%, #213a2a 0%, #070d09 75%)">
      <Headline top={190} size={92}>
        SO... WOULD
        <br />
        NATURE <span style={{color: '#FFE14D'}}>COLLAPSE?</span>
      </Headline>
      {/* species bar */}
      <div style={{position: 'absolute', top: 600, left: 110, width: 860, opacity: 1 - end}}>
        <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 46, color: 'white', marginBottom: 18}}>
          ~3,500 mosquito species
        </div>
        <div style={{height: 70, background: '#2f4a38', borderRadius: 35, overflow: 'hidden', position: 'relative'}}>
          <div style={{width: `${bar * 100}%`, height: '100%', background: '#51cf66'}} />
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: `${bar * 6}%`,
              height: '100%',
              background: '#ff4d4d',
            }}
          />
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 42,
            color: '#ff8a8a',
            marginTop: 18,
            opacity: interpolate(f, [noteAt, noteAt + 15], [0, 1], clamp),
          }}
        >
          Only a small fraction bite humans
        </div>
      </div>
      {/* end card */}
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div
          style={{
            transform: `scale(${end})`,
            textAlign: 'center',
            fontFamily: FONT,
            fontWeight: 900,
            color: 'white',
          }}
        >
          <div style={{fontSize: 70, color: '#7CFFB2'}}>Most scientists think</div>
          <div style={{fontSize: 120, letterSpacing: -3, lineHeight: 1.05}}>
            NATURE
            <br />
            WOULD ADAPT
          </div>
          <div
            style={{
              marginTop: 50,
              display: 'inline-block',
              fontSize: 56,
              background: '#FFE14D',
              color: 'black',
              padding: '18px 40px',
              borderRadius: 20,
              transform: `rotate(-2deg) scale(${1 + Math.sin(f / 6) * 0.03})`,
            }}
          >
            WOULD YOU DELETE THEM?
          </div>
        </div>
      </AbsoluteFill>
    </SceneFrame>
  );
};
