import React, {useMemo} from 'react';
import * as THREE from 'three';
import {SHOCK_RING_VERTEX, SHOCK_SPHERE_FRAGMENT} from '../../shaders/shock';

/** Expanding hemispherical shock front around the viewer: a bright haze over everything beyond it. */
export const ShockSphere: React.FC<{radius: number; opacity: number; time: number; color: string}> = ({radius, opacity, time, color}) => {
  const geometry = useMemo(() => new THREE.SphereGeometry(1, 64, 24, 0, Math.PI * 2, 0, Math.PI / 2), []);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: SHOCK_RING_VERTEX,
        fragmentShader: SHOCK_SPHERE_FRAGMENT,
        uniforms: {uOpacity: {value: 0}, uTime: {value: 0}, uColor: {value: new THREE.Color()}},
        transparent: true,
        depthWrite: false,
        side: THREE.BackSide,
      }),
    []
  );
  if (opacity <= 0.005 || radius <= 0) return null;
  material.uniforms.uOpacity.value = opacity;
  material.uniforms.uTime.value = time;
  material.uniforms.uColor.value.set(color).convertLinearToSRGB();
  return <mesh geometry={geometry} material={material} scale={radius} renderOrder={6} frustumCulled={false} />;
};
