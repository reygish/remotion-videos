import React, {useMemo} from 'react';
import * as THREE from 'three';
import {VAPOR_FRAGMENT, VAPOR_VERTEX} from '../../shaders/vapor';

/**
 * A funnel of condensation around the viewer (open cone, narrow end ahead).
 * `slide` pushes it back past the camera so the ring sweeps out to the screen edges.
 * Reused with an orange colour as the Mach-10 plasma sheath.
 */
export const VaporCone: React.FC<{
  opacity: number;
  slide: number;
  time: number;
  color: string;
  /** Brightness of the sharp ring at the cone's front edge. */
  front?: number;
  /** 0: mist gathers toward the front; 1: toward the viewer (screen edges). */
  rear?: number;
  camera: {x: number; y: number; pitch: number; yaw: number};
}> = ({opacity, slide, time, color, front = 1, rear = 0, camera}) => {
  const geometry = useMemo(() => new THREE.CylinderGeometry(0.7, 4, 5, 64, 1, true).rotateX(-Math.PI / 2), []);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VAPOR_VERTEX,
        fragmentShader: VAPOR_FRAGMENT,
        uniforms: {uOpacity: {value: 0}, uTime: {value: 0}, uColor: {value: new THREE.Color()}, uFront: {value: 1}, uRear: {value: 0}},
        transparent: true,
        depthWrite: false,
        depthTest: false,
        side: THREE.DoubleSide,
      }),
    []
  );
  if (opacity <= 0.005) return null;
  material.uniforms.uOpacity.value = opacity;
  material.uniforms.uTime.value = time;
  material.uniforms.uFront.value = front;
  material.uniforms.uRear.value = rear;
  material.uniforms.uColor.value.set(color).convertLinearToSRGB();
  return (
    <group position={[camera.x, camera.y, 0]} rotation={[camera.pitch, camera.yaw, 0, 'YXZ']}>
      <mesh geometry={geometry} material={material} position={[0, 0, -2.5 + slide]} renderOrder={20} frustumCulled={false} />
    </group>
  );
};
