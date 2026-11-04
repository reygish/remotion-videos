import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from '../config/theme';
import {SCENES} from '../config/scenes';
import {clamp} from '../lib/math';
import {cue} from '../lib/voiceover';
import {SceneFrame} from '../components/SceneFrame';
import {Headline} from '../components/Headline';
import {SovietFlag} from '../components/SovietFlag';

/** Gorbachev's quote, the flag cracking on "collapse", then healing on "lasted". */
export const Soviet: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const quoteAt = cue('soviet', 'Gorbachev');
  const crackAt = cue('soviet', 'collapse');
  const healAt = cue('soviet', 'lasted');
  const quote = spring({frame: f - quoteAt, fps, config: {damping: 14}});
  const split = interpolate(f, [crackAt, crackAt + 14], [0, 1], clamp);
  const heal = interpolate(f, [healAt - 4, healAt + 26], [0, 1], clamp);
  const stamp = (at: number) => spring({frame: f - at, fps, config: {damping: 9, mass: 0.8}});
  const stampStyle: React.CSSProperties = {
    fontFamily: FONT,
    fontWeight: 900,
    fontSize: 76,
    padding: '10px 34px',
    borderRadius: 16,
    border: '8px solid',
    background: 'rgba(0,0,0,0.35)',
  };
  return (
    <SceneFrame duration={SCENES.soviet} bg="radial-gradient(circle at 50% 40%, #3a3d45 0%, #0c0d10 75%)">
      <Headline top={190} size={84}>
        DID CHERNOBYL
        <br />
        BREAK THE <span style={{color: '#ff4a3d'}}>USSR?</span>
      </Headline>
      <div
        style={{
          position: 'absolute',
          top: 430,
          left: 90,
          right: 90,
          fontFamily: FONT,
          color: 'white',
          opacity: quote,
          transform: `translateY(${(1 - quote) * 30}px)`,
          borderLeft: '10px solid #ffd24a',
          paddingLeft: 30,
        }}
      >
        <div style={{fontWeight: 700, fontStyle: 'italic', fontSize: 44, lineHeight: 1.25}}>
          “Chernobyl… was perhaps the real cause of the collapse of the Soviet Union.”
        </div>
        <div style={{fontWeight: 800, fontSize: 34, color: '#ffd24a', marginTop: 14}}>MIKHAIL GORBACHEV, 2006</div>
      </div>
      <div style={{position: 'absolute', top: 760, left: 150}}>
        <SovietFlag width={760} split={split} heal={heal} />
      </div>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', top: 120}}>
        {f < healAt ? (
          <div style={{...stampStyle, color: '#ff4a3d', transform: `scale(${stamp(crackAt + 6)}) rotate(-8deg)`}}>
            DISSOLVED 1991
          </div>
        ) : (
          <div style={{...stampStyle, color: '#ffd24a', transform: `scale(${stamp(healAt + 8)}) rotate(-4deg)`}}>
            LASTS LONGER?
          </div>
        )}
      </AbsoluteFill>
    </SceneFrame>
  );
};
