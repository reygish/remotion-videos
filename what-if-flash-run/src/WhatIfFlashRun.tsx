import React from 'react';
import {AbsoluteFill, Series} from 'remotion';
import {SCENES, SCENE_ORDER, SceneKey} from './config/scenes';
import {World} from './world/World';
import {Hud} from './components/Hud';
import {ProgressBar} from './components/ProgressBar';
import {Caption} from './components/Caption';
import {Voiceover} from './components/Voiceover';
import {Hook} from './scenes/Hook';
import {Walk} from './scenes/Walk';
import {Sprint} from './scenes/Sprint';
import {Mach1} from './scenes/Mach1';
import {Mach10} from './scenes/Mach10';
import {Orbit} from './scenes/Orbit';
import {OneSecond} from './scenes/OneSecond';
import {Ending} from './scenes/Ending';

const SCENE_COMPONENTS: Record<SceneKey, React.FC> = {
  hook: Hook,
  walk: Walk,
  sprint: Sprint,
  mach1: Mach1,
  mach10: Mach10,
  orbit: Orbit,
  onesecond: OneSecond,
  ending: Ending,
};

/**
 * Layers, back to front:
 * 1. World: one continuous first-person 3D run across the whole video
 * 2. Scene overlays: titles, stats and effects for each stage
 * 3. HUD: speed, Mach, ETA, distance (game-style)
 * 4. Captions + narration, progress bar
 */
export const WhatIfFlashRun: React.FC = () => (
  <AbsoluteFill style={{background: 'black'}}>
    <World />
    <Series>
      {SCENE_ORDER.map((key) => {
        const Scene = SCENE_COMPONENTS[key];
        return (
          <Series.Sequence key={key} durationInFrames={SCENES[key]}>
            <Scene />
            <Voiceover scene={key} />
            <Caption scene={key} />
          </Series.Sequence>
        );
      })}
    </Series>
    <Hud />
    <ProgressBar />
  </AbsoluteFill>
);
