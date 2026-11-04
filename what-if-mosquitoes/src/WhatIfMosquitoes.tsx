import React from 'react';
import {AbsoluteFill, Series} from 'remotion';
import {SCENES, SCENE_ORDER, SceneKey} from './config/scenes';
import {ProgressBar} from './components/ProgressBar';
import {Caption} from './components/Caption';
import {Voiceover} from './components/Voiceover';
import {Hook} from './scenes/Hook';
import {Deadly} from './scenes/Deadly';
import {Saved} from './scenes/Saved';
import {Pond} from './scenes/Pond';
import {Arctic} from './scenes/Arctic';
import {Flower} from './scenes/Flower';
import {Verdict} from './scenes/Verdict';

const SCENE_COMPONENTS: Record<SceneKey, React.FC> = {
  hook: Hook,
  deadly: Deadly,
  saved: Saved,
  pond: Pond,
  arctic: Arctic,
  flower: Flower,
  verdict: Verdict,
};

/** Timeline: each scene with its narration and synced captions, plus the progress bar. */
export const WhatIfMosquitoes: React.FC = () => (
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
