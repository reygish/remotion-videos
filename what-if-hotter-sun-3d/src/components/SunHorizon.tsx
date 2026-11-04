import React from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useCurrentFrame} from 'remotion';
import {SunBody} from './three/SunBody';
import {SunCorona} from './three/SunCorona';

const RADIUS = 14;

/**
 * Close-up of the Sun's curved, boiling surface filling the bottom of the frame,
 * with the camera slowly drifting over it.
 */
export const SunHorizon: React.FC<{top: number; height: number; heat?: number}> = ({top, height, heat = 0}) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 90) * 0.6;
  return (
    <div style={{position: 'absolute', left: 0, top}}>
      <ThreeCanvas width={1080} height={height} camera={{fov: 35, position: [drift, 0, 0]}}>
        <group position={[0, -RADIUS - 0.4, -12]}>
          <SunCorona radius={RADIUS} extent={1.25} heat={heat} />
          <SunBody radius={RADIUS} heat={heat} seed={2} />
        </group>
      </ThreeCanvas>
    </div>
  );
};
