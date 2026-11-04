import React from 'react';
import * as THREE from 'three';

/** Cloud layer slightly above the surface, drifting a little faster than the ground. Fades out as `opacity` drops. */
export const EarthClouds: React.FC<{clouds: THREE.Texture; spin: number; opacity: number}> = ({clouds, spin, opacity}) => {
  if (opacity <= 0.01) return null;
  return (
    <mesh rotation={[0, spin * 1.15, 0]}>
      <sphereGeometry args={[1.012, 96, 96]} />
      <meshLambertMaterial map={clouds} transparent opacity={opacity} depthWrite={false} />
    </mesh>
  );
};
