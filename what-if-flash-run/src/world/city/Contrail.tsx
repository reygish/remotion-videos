import React, {useMemo} from 'react';
import * as THREE from 'three';

const VERT = /* glsl */ `
varying float vT;
void main() {
  vT = position.x + 0.5;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
const FRAG = /* glsl */ `
uniform vec3 uColor;
uniform float uOpacity;
varying float vT;
void main() {
  gl_FragColor = vec4(uColor, uOpacity * smoothstep(0.0, 0.9, vT));
}
`;

/** A fading vapour trail behind the airplane (local +x is toward the plane). */
export const Contrail: React.FC<{length: number; color: string; opacity: number; position: [number, number, number]}> = ({
  length,
  color,
  opacity,
  position,
}) => {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms: {uColor: {value: new THREE.Color()}, uOpacity: {value: 0}},
        transparent: true,
        depthWrite: false,
      }),
    []
  );
  material.uniforms.uColor.value.set(color).convertLinearToSRGB();
  material.uniforms.uOpacity.value = opacity;
  return (
    <mesh material={material} position={[position[0] - length / 2, position[1], position[2]]} scale={[length, 3.5, 3.5]}>
      <boxGeometry args={[1, 1, 1]} />
    </mesh>
  );
};
