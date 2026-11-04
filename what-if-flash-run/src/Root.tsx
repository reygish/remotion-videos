import React from 'react';
import {Composition} from 'remotion';
import {WhatIfFlashRun} from './WhatIfFlashRun';
import {FPS, TOTAL_FRAMES} from './config/scenes';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="WhatIfFlashRun"
    component={WhatIfFlashRun}
    durationInFrames={TOTAL_FRAMES}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
