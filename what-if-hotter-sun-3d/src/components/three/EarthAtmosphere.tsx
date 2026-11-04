import React, {useMemo} from 'react';
import * as THREE from 'three';
import {ATMOSPHERE_FRAGMENT, ATMOSPHERE_VERTEX} from '../../shaders/atmosphere';
import {SUN_DIRECTION} from './lighting';

/** Thin glowing halo around the planet. `venus` (0-1) shifts it from blue to sulphur-yellow. */
export const EarthAtmosphere: React.FC<{venus: number}> = ({venus}) => {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: ATMOSPHERE_VERTEX,
        fragmentShader: ATMOSPHERE_FRAGMENT,
        uniforms: {uColor: {value: new THREE.Color()}, uSunDir: {value: SUN_DIRECTION.clone()}},
        side: THREE.BackSide,
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
  material.uniforms.uColor.value.setRGB(0.3 + venus * 0.7, 0.55 + venus * 0.2, 1.0 - venus * 0.65);
  return (
    <mesh material={material} scale={1.09}>
      <sphereGeometry args={[1, 64, 64]} />
    </mesh>
  );
};
