import React from 'react';
import {ThreeCanvas} from '@remotion/three';
import {SunBody} from './three/SunBody';
import {SunCorona} from './three/SunCorona';

/** How far the corona reaches, in sun radii. The canvas is this much wider than the Sun. */
const EXTENT = 1.9;
/** Camera distance that makes a radius-1 sphere exactly `size` px wide (30° vertical FOV). */
const DISTANCE = EXTENT / Math.tan((15 * Math.PI) / 180);

/**
 * 3D Sun: a slowly rotating sphere with boiling granulation and a glowing corona.
 * Laid out like a `size`-px circle; the corona spills outside that box.
 * `heat` (0-1) makes it whiter and brighter.
 */
export const Sun: React.FC<{size?: number; heat?: number; seed?: number}> = ({size = 600, heat = 0, seed = 0}) => {
  const canvas = Math.round(size * EXTENT);
  const offset = (canvas - size) / 2;
  return (
    <div style={{position: 'relative', width: size, height: size}}>
      <div style={{position: 'absolute', left: -offset, top: -offset}}>
        <ThreeCanvas width={canvas} height={canvas} camera={{fov: 30, position: [0, 0, DISTANCE]}}>
          <SunCorona extent={EXTENT} heat={heat} seed={seed} />
          <SunBody heat={heat} seed={seed} />
        </ThreeCanvas>
      </div>
    </div>
  );
};
