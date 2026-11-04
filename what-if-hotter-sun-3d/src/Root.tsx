import React from 'react';
import {Composition} from 'remotion';
import {WhatIfHotterSun} from './WhatIfHotterSun';
import {FPS, TOTAL_FRAMES} from './config/scenes';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="WhatIfHotterSun3D"
    component={WhatIfHotterSun}
    durationInFrames={TOTAL_FRAMES}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
