import React from 'react';
import {AbsoluteFill, Series} from 'remotion';
import {SCENES, SCENE_ORDER, SceneKey} from './config/scenes';
import {ProgressBar} from './components/ProgressBar';
import {Caption} from './components/Caption';
import {Voiceover} from './components/Voiceover';
import {Hook} from './scenes/Hook';
import {Surface} from './scenes/Surface';
import {Energy} from './scenes/Energy';
import {Cycle} from './scenes/Cycle';
import {OnePercent} from './scenes/OnePercent';
import {TenPercent} from './scenes/TenPercent';
import {Ending} from './scenes/Ending';

const SCENE_COMPONENTS: Record<SceneKey, React.FC> = {
  hook: Hook,
  surface: Surface,
  energy: Energy,
  cycle: Cycle,
  onepercent: OnePercent,
  tenpercent: TenPercent,
  ending: Ending,
};

/** Timeline: each scene with its narration and synced captions, plus the progress bar. */
export const WhatIfHotterSun: React.FC = () => (
  <AbsoluteFill style={{background: 'black'}}>
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
    <ProgressBar />
  </AbsoluteFill>
);
