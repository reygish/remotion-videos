import React from 'react';
import {AbsoluteFill, Series} from 'remotion';
import {SCENES, SCENE_ORDER, SceneKey} from './config/scenes';
import {ProgressBar} from './components/ProgressBar';
import {Caption} from './components/Caption';
import {Voiceover} from './components/Voiceover';
import {Hook} from './scenes/Hook';
import {Night} from './scenes/Night';
import {Toll} from './scenes/Toll';
import {Pripyat} from './scenes/Pripyat';
import {Nuclear} from './scenes/Nuclear';
import {Soviet} from './scenes/Soviet';
import {Wildlife} from './scenes/Wildlife';

const SCENE_COMPONENTS: Record<SceneKey, React.FC> = {
  hook: Hook,
  night: Night,
  toll: Toll,
  pripyat: Pripyat,
  nuclear: Nuclear,
  soviet: Soviet,
  wildlife: Wildlife,
};

/** Timeline: each scene with its narration and synced captions, plus the progress bar. */
export const WhatIfChernobyl: React.FC = () => (
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
