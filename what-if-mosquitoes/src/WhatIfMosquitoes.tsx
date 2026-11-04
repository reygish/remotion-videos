import React from 'react';
import {AbsoluteFill, Series} from 'remotion';
import {SCENES} from './config/scenes';
import {ProgressBar} from './components/ProgressBar';
import {Hook} from './scenes/Hook';
import {Deadly} from './scenes/Deadly';
import {Saved} from './scenes/Saved';
import {Pond} from './scenes/Pond';
import {Arctic} from './scenes/Arctic';
import {Flower} from './scenes/Flower';
import {Verdict} from './scenes/Verdict';

/** Scene order. Durations come from config/scenes.ts. */
const TIMELINE = [
  {key: 'hook', Scene: Hook, duration: SCENES.hook},
  {key: 'deadly', Scene: Deadly, duration: SCENES.deadly},
  {key: 'saved', Scene: Saved, duration: SCENES.saved},
  {key: 'pond', Scene: Pond, duration: SCENES.pond},
  {key: 'arctic', Scene: Arctic, duration: SCENES.arctic},
  {key: 'flower', Scene: Flower, duration: SCENES.flower},
  {key: 'verdict', Scene: Verdict, duration: SCENES.verdict},
];

export const WhatIfMosquitoes: React.FC = () => (
  <AbsoluteFill style={{background: 'black'}}>
    <Series>
      {TIMELINE.map(({key, Scene, duration}) => (
        <Series.Sequence key={key} durationInFrames={duration}>
          <Scene />
        </Series.Sequence>
      ))}
    </Series>
    <ProgressBar />
  </AbsoluteFill>
);
