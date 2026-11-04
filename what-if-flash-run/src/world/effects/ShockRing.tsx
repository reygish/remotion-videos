import React, {useMemo} from 'react';
import * as THREE from 'three';
import {SHOCK_RING_FRAGMENT, SHOCK_RING_VERTEX} from '../../shaders/shock';

/** An expanding ring wall of dust/vapour centred under the viewer (sonic boom, city shockwave). */
export const ShockRing: React.FC<{radius: number; height: number; opacity: number; time: number; color: string; y?: number}> = ({
  radius,
  height,
  opacity,
  time,
  color,
  y = 0,
}) => {
  const geometry = useMemo(() => new THREE.CylinderGeometry(1, 1, 1, 128, 1, true).translate(0, 0.5, 0), []);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: SHOCK_RING_VERTEX,
        fragmentShader: SHOCK_RING_FRAGMENT,
        uniforms: {uOpacity: {value: 0}, uTime: {value: 0}, uColor: {value: new THREE.Color()}},
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    []
  );
  if (opacity <= 0.005 || radius <= 0) return null;
  material.uniforms.uOpacity.value = opacity;
  material.uniforms.uTime.value = time;
  material.uniforms.uColor.value.set(color).convertLinearToSRGB();
  return <mesh geometry={geometry} material={material} position={[0, y, 0]} scale={[radius, height, radius]} renderOrder={5} frustumCulled={false} />;
};
