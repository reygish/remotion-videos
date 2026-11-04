import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SCENE_START, SceneKey} from '../config/scenes';
import {ARRIVE_AT, HUD_IN_AT, hudState, routeAt} from '../lib/hud';
import {formatMach} from '../lib/format';
import {shakeAll} from '../lib/shake';
import {cue} from '../lib/voiceover';
import {CYAN, HEAT, ORANGE} from '../lib/palette';
import {SpeedReadout} from './hud/SpeedReadout';
import {HudReading} from './hud/HudReading';
import {StagePill} from './hud/StagePill';
import {RouteBar} from './hud/RouteBar';
import {CornerBrackets} from './hud/CornerBrackets';

/** Stage pill colour: cyan, turning hot during the plasma and Flash stages. */
const PILL_COLOR: Partial<Record<SceneKey, string>> = {mach10: ORANGE, onesecond: HEAT};

const HITS = [
  {at: SCENE_START.mach1 + cue('mach1', 'barrier'), amp: 22},
  {at: SCENE_START.mach1 + cue('mach1', 'boom'), amp: 14},
  {at: ARRIVE_AT, amp: 26},
];

/**
 * Game-style HUD in the bottom strip (y ≈ 1636–1880): speed, Mach, ETA to New
 * York, stage label and an LA→NYC route bar. Rendered outside the Series, so
 * the frame here is GLOBAL.
 */
export const Hud: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < HUD_IN_AT) return null;
  const s = hudState(f);
  const enter = spring({frame: f - HUD_IN_AT, fps, config: {damping: 15}});
  const pop = spring({frame: f - SCENE_START[s.scene], fps, config: {damping: 10, mass: 0.5}});
  const accent = s.scene === 'mach10' ? ORANGE : CYAN;
  const trail = Math.min(1, Math.abs(s.route - routeAt(f - 3)) * 12);
  const pulse = (Math.sin(f / 5) + 1) / 2;
  const jolt = shakeAll(f, HITS);
  return (
    <div
      style={{
        position: 'absolute',
        left: 40,
        top: 1636,
        width: 1000,
        height: 244,
        opacity: enter,
        transform: `translate(${jolt.x}px, ${jolt.y + (1 - enter) * 120}px)`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 26,
          background: 'linear-gradient(180deg, rgba(5,14,26,0.58), rgba(5,14,26,0.8))',
          border: `2px solid ${accent}66`,
          boxShadow: `0 0 40px ${accent}33, inset 0 0 30px ${accent}1A`,
        }}
      />
      <CornerBrackets color={accent} />
      <SpeedReadout kmh={s.kmh} arrived={s.scene === 'ending'} accent={accent} />
      <StagePill label={s.label} color={PILL_COLOR[s.scene] ?? CYAN} pop={pop} />
      <HudReading label="MACH" value={formatMach(s.mach)} top={86} accent={accent} />
      <HudReading label="ETA NYC" value={s.eta} top={128} accent={accent} />
      <div style={{position: 'absolute', left: 30, right: 30, top: 170, height: 2, background: `${accent}33`}} />
      <RouteBar progress={s.route} trail={trail} accent={accent} arrived={s.arrived} pulse={interpolate(pulse, [0, 1], [0.3, 1])} />
    </div>
  );
};
