import React from 'react';
import {Composition} from 'remotion';
import {WhatIfMosquitoes} from './WhatIfMosquitoes';
import {TOTAL_FRAMES} from './config/scenes';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="WhatIfMosquitoes"
    component={WhatIfMosquitoes}
    durationInFrames={TOTAL_FRAMES}
    fps={30}
    width={1080}
    height={1920}
  />
);
