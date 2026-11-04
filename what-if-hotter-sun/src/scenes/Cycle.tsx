import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from '../config/theme';
import {SCENES} from '../config/scenes';
import {clamp} from '../lib/math';
import {cue} from '../lib/voiceover';
import {SceneFrame} from '../components/SceneFrame';
import {Headline} from '../components/Headline';
import {SolarCycleWave} from '../components/SolarCycleWave';
import {Chip} from '../components/Chip';
import {CompareBar} from '../components/CompareBar';

const TEAL = '#4FF0D0';
const ORANGE = '#FF9A3D';
/** Pixel height of the solar cycle's 0.1% peak-to-trough swing. */
const SWING = 240;

/** Vertical measuring bracket of a given height, centered on the chart midline. */
const bracket = (x: number, h: number, color: string, grow: number) => {
  const half = (h / 2) * grow;
  return (
    <g stroke={color} strokeWidth={8} strokeLinecap="round" opacity={Math.min(1, grow * 2)}>
      <line x1={x} y1={200 - half} x2={x} y2={200 + half} />
      <line x1={x - 18} y1={200 - half} x2={x + 18} y2={200 - half} />
      <line x1={x - 18} y1={200 + half} x2={x + 18} y2={200 + half} />
    </g>
  );
};

/** The 11-year solar cycle wave dwarfs the 1° change; then +0.1 °C vs the 1.2 °C humans caused. */
export const Cycle: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  // Wave draws on "eleven-year", brackets on "swings"/"percent", bars on "tenth" and "Humans".
  const waveAt = cue('cycle', 'eleven-year');
  const swingAt = cue('cycle', 'swings');
  const oneAt = cue('cycle', 'percent');
  const tenthAt = cue('cycle', 'tenth');
  const humansAt = cue('cycle', 'Humans');
  const wave = interpolate(f, [waveAt - 10, waveAt + 50], [0, 1], clamp);
  const swing = spring({frame: f - swingAt, fps, config: {damping: 14}});
  const one = spring({frame: f - oneAt, fps, config: {damping: 14}});
  const sunBar = interpolate(f, [tenthAt, tenthAt + 20], [0, 1], clamp);
  const humanBar = interpolate(f, [humansAt, humansAt + 30], [0, 1], clamp);
  return (
    <SceneFrame duration={SCENES.cycle} bg="radial-gradient(circle at 50% 35%, #0c4552 0%, #04191f 70%, #020a0c 100%)">
      <Headline top={190} size={90}>
        SMALLER THAN THE
        <br />
        <span style={{color: TEAL}}>SOLAR CYCLE</span>
      </Headline>
      <div style={{position: 'absolute', top: 440, left: 80, fontFamily: FONT, fontWeight: 800, fontSize: 36, letterSpacing: 3, color: 'rgba(255,255,255,0.7)', opacity: wave * 2}}>
        SUN'S BRIGHTNESS · 11-YEAR CYCLE
      </div>
      <svg width={1080} height={400} style={{position: 'absolute', top: 500, left: 0, overflow: 'visible'}}>
        <g transform="translate(80 0)">
          <SolarCycleWave width={720} height={400} amp={SWING / 2} progress={wave} color={TEAL} cycles={2.5} />
        </g>
        {bracket(870, SWING, TEAL, swing)}
        {bracket(960, SWING * 0.7, ORANGE, one)}
      </svg>
      <div style={{position: 'absolute', top: 930, width: '100%', display: 'flex', justifyContent: 'center', gap: 24}}>
        <Chip color={TEAL} scale={swing} size={38}>
          CYCLE SWING 0.1%
        </Chip>
        <Chip color={ORANGE} scale={one} size={38}>
          +1°C SUN 0.07%
        </Chip>
      </div>
      <div style={{position: 'absolute', top: 1070, left: 100, display: 'flex', flexDirection: 'column', gap: 26}}>
        <CompareBar label="Warming from a +1° Sun" value="+0.1°C" fraction={0.1 / 1.2} progress={sunBar} color={ORANGE} />
        <CompareBar label="Warming humans caused" value="+1.2°C" fraction={1} progress={humanBar} color="#FF4D6A" />
      </div>
    </SceneFrame>
  );
};
