import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from '../config/theme';
import {SCENES} from '../config/scenes';
import {clamp} from '../lib/math';
import {cue} from '../lib/voiceover';
import {SceneFrame} from '../components/SceneFrame';
import {Headline} from '../components/Headline';
import {BigStat} from '../components/BigStat';
import {CompareBar} from '../components/CompareBar';

/** Stefan–Boltzmann: the T⁴ exponent pops, then +0.07% more sunlight, barely visible on two bars. */
export const Energy: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  // Formula on "energy", exponent on "fourth", math on "so", +0.07% counts from "zero" to "percent".
  const formulaAt = cue('energy', 'energy');
  const powerAt = cue('energy', 'fourth');
  const mathAt = cue('energy', 'so');
  const pctFrom = cue('energy', 'zero');
  const pctTo = cue('energy', 'percent');
  const formula = spring({frame: f - formulaAt, fps, config: {damping: 14}});
  const power = spring({frame: f - powerAt, fps, config: {damping: 8, mass: 0.7}});
  const math = interpolate(f, [mathAt, mathAt + 12], [0, 1], clamp);
  const pct = interpolate(f, [pctFrom, pctTo], [0, 0.07], clamp);
  const pctIn = spring({frame: f - pctFrom, fps, config: {damping: 14}});
  const bars = interpolate(f, [pctTo, pctTo + 30], [0, 1], clamp);
  return (
    <SceneFrame duration={SCENES.energy} bg="radial-gradient(circle at 50% 30%, #2a1f66 0%, #0d0a2a 70%, #05040f 100%)">
      {/* slowly turning sunbeams */}
      <div
        style={{
          position: 'absolute',
          left: -900,
          top: -1400,
          width: 2880,
          height: 2880,
          background: 'repeating-conic-gradient(from 0deg, rgba(255,201,77,0.07) 0deg 6deg, transparent 6deg 18deg)',
          transform: `rotate(${f * 0.08}deg)`,
          borderRadius: '50%',
        }}
      />
      <Headline top={190} size={92}>
        ENERGY GROWS
        <br />
        <span style={{color: '#FFC94D'}}>MUCH FASTER</span>
      </Headline>
      <div
        style={{
          position: 'absolute',
          top: 440,
          width: '100%',
          textAlign: 'center',
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 190,
          color: 'white',
          opacity: formula,
          transform: `scale(${0.8 + formula * 0.2})`,
        }}
      >
        E = σT
        <span
          style={{
            display: 'inline-block',
            fontSize: 120,
            color: '#FFC94D',
            verticalAlign: 'top',
            transform: `scale(${power * 1.2}) translateY(-10px)`,
            textShadow: '0 0 40px rgba(255,201,77,0.9)',
          }}
        >
          4
        </span>
      </div>
      <div style={{position: 'absolute', top: 680, width: '100%', textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 36, letterSpacing: 6, color: 'rgba(255,255,255,0.6)', opacity: formula}}>
        STEFAN–BOLTZMANN LAW
      </div>
      <div style={{position: 'absolute', top: 770, width: '100%', textAlign: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 60, color: '#C9C2FF', opacity: math}}>
        1.00017⁴ ≈ 1.0007
      </div>
      <BigStat top={880} color="#FFC94D" size={200} opacity={pctIn} scale={0.7 + pctIn * 0.3}>
        +{pct.toFixed(2)}%
      </BigStat>
      <div style={{position: 'absolute', top: 1110, left: 100, display: 'flex', flexDirection: 'column', gap: 26}}>
        <CompareBar label="Sunlight today" value="100%" fraction={1} progress={bars} color="#8F84FF" />
        <CompareBar label="Sun +1°C" value="100.07%" fraction={1} progress={bars} color="#FFC94D" />
      </div>
    </SceneFrame>
  );
};
