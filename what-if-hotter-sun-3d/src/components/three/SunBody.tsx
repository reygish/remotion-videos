import React, {useMemo} from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {SUN_FRAGMENT, SUN_VERTEX} from '../../shaders/sun';

/** The Sun's sphere with animated granulation. `heat` (0-1) makes it whiter and brighter. */
export const SunBody: React.FC<{radius?: number; heat?: number; seed?: number}> = ({radius = 1, heat = 0, seed = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: SUN_VERTEX,
        fragmentShader: SUN_FRAGMENT,
        uniforms: {uTime: {value: 0}, uHeat: {value: 0}, uSeed: {value: 0}},
      }),
    []
  );
  material.uniforms.uTime.value = frame / fps;
  material.uniforms.uHeat.value = heat;
  material.uniforms.uSeed.value = seed * 7.3;
  return (
    <mesh material={material} rotation={[0.25, frame * 0.004 + seed, 0]}>
      <sphereGeometry args={[radius, 96, 96]} />
    </mesh>
  );
};
