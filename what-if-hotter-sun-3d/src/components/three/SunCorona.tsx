import React, {useMemo} from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {CORONA_FRAGMENT, CORONA_VERTEX} from '../../shaders/corona';

/**
 * Glowing corona with flowing streamers, drawn on a camera-facing plane behind the Sun.
 * Adds light without touching alpha, so it glows over whatever is behind the canvas.
 */
export const SunCorona: React.FC<{radius?: number; extent?: number; heat?: number; seed?: number}> = ({
  radius = 1,
  extent = 1.9,
  heat = 0,
  seed = 0,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: CORONA_VERTEX,
        fragmentShader: CORONA_FRAGMENT,
        uniforms: {uTime: {value: 0}, uHeat: {value: 0}, uExtent: {value: 1}, uSeed: {value: 0}},
        transparent: true,
        depthWrite: false,
        blending: THREE.CustomBlending,
        blendEquation: THREE.AddEquation,
        blendSrc: THREE.OneFactor,
        blendDst: THREE.OneFactor,
        blendSrcAlpha: THREE.ZeroFactor,
        blendDstAlpha: THREE.OneFactor,
      }),
    []
  );
  material.uniforms.uTime.value = frame / fps;
  material.uniforms.uHeat.value = heat;
  material.uniforms.uExtent.value = extent;
  material.uniforms.uSeed.value = seed * 3.1;
  const w = radius * extent * 2;
  return (
    <mesh material={material} position={[0, 0, -radius * 0.2]}>
      <planeGeometry args={[w, w]} />
    </mesh>
  );
};
