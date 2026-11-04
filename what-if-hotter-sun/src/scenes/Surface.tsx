import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from '../config/theme';
import {SCENES} from '../config/scenes';
import {clamp, rand} from '../lib/math';
import {cue} from '../lib/voiceover';
import {SceneFrame} from '../components/SceneFrame';
import {Headline} from '../components/Headline';
import {Thermometer} from '../components/Thermometer';
import {Chip} from '../components/Chip';

/** How hot the Sun is: a thermometer climbs to 5,500 °C, then +1 °C turns out to be just 0.017%. */
export const Surface: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  // Counter runs from "about" to "degrees"; +1 pops on "One"; the percentage counts up on "zero".
  const countFrom = cue('surface', 'about');
  const countTo = cue('surface', 'degrees');
  const plusAt = cue('surface', 'One');
  const pctFrom = cue('surface', 'zero');
  const pctTo = cue('surface', 'percent');
  const temp = interpolate(f, [countFrom, countTo], [0, 5500], {...clamp, easing: Easing.out(Easing.cubic)});
  const shown = f > plusAt + 10 ? 5501 : Math.round(temp);
  const plus = spring({frame: f - plusAt, fps, config: {damping: 10}});
  const pct = interpolate(f, [pctFrom, pctTo], [0, 0.017], clamp);
  const pctIn = spring({frame: f - pctFrom, fps, config: {damping: 14}});
  const text: React.CSSProperties = {position: 'absolute', left: 330, width: 720, textAlign: 'center', fontFamily: FONT};
  return (
    <SceneFrame duration={SCENES.surface} bg="linear-gradient(#1a0503 0%, #3d0c06 55%, #6e1a08 100%)">
      {/* the Sun's boiling surface, peeking up from the bottom */}
      <div
        style={{
          position: 'absolute',
          left: -700,
          top: 1640,
          width: 2480,
          height: 2480,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 50% 0%, #FFE27A 0%, #FF9A1F 8%, #E2470A 20%, #7A1A04 40%)',
          boxShadow: '0 0 160px 40px rgba(255,120,20,0.55)',
        }}
      />
      {Array.from({length: 14}).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: rand(i + 3) * 1040,
            top: 1700 + rand(i + 20) * 160,
            width: 70,
            height: 40,
            borderRadius: '50%',
            background: '#FFE27A',
            opacity: 0.18 + 0.15 * Math.sin(f / 7 + i),
          }}
        />
      ))}
      <Headline top={190} size={96}>
        THE SUN'S
        <br />
        <span style={{color: '#FF8A4D'}}>SURFACE</span>
      </Headline>
      <div style={{position: 'absolute', left: 110, top: 480}}>
        <Thermometer level={(temp / 5500) * 0.88 + plus * 0.02} height={860} />
      </div>
      <div
        style={{
          ...text,
          top: 540,
          fontWeight: 900,
          fontSize: 140,
          letterSpacing: -4,
          color: '#FFE0B0',
          textShadow: '0 0 50px rgba(255,120,40,0.7)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {shown.toLocaleString('en-US')}°C
      </div>
      <div style={{...text, top: 700, fontWeight: 700, fontSize: 46, color: 'rgba(255,255,255,0.75)', opacity: interpolate(f, [countTo, countTo + 15], [0, 1], clamp)}}>
        about 5,772 kelvin
      </div>
      <div style={{...text, top: 810}}>
        <Chip color="#FF8A4D" scale={plus} size={56}>
          +1°C
        </Chip>
      </div>
      <div
        style={{
          ...text,
          top: 960,
          fontWeight: 900,
          fontSize: 150,
          letterSpacing: -4,
          color: '#FF6A3D',
          opacity: pctIn,
          transform: `scale(${0.7 + pctIn * 0.3})`,
          textShadow: '0 0 50px rgba(255,90,40,0.6)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {pct.toFixed(3)}%
      </div>
      <div style={{...text, top: 1140, fontWeight: 800, fontSize: 50, color: 'white', opacity: pctIn}}>
        a microscopic change
      </div>
    </SceneFrame>
  );
};
