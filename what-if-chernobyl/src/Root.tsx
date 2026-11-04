import React from 'react';
import {Composition} from 'remotion';
import {WhatIfChernobyl} from './WhatIfChernobyl';
import {FPS, TOTAL_FRAMES} from './config/scenes';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="WhatIfChernobyl"
    component={WhatIfChernobyl}
    durationInFrames={TOTAL_FRAMES}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
