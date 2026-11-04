import React, {useMemo} from 'react';
import * as THREE from 'three';
import {makeInstanced, setInstance} from '../../lib/instancing';
import {trackSlot} from '../../lib/track';
import {rand} from '../../lib/math';

const COUNT = 150;
const WINDOW = 320;

/**
 * Speed lines: thin glowing streaks of air rushing past, stretched by the
 * distance moved per frame (motion blur). Kept off the ground below the HUD.
 */
export const SpeedStreaks: React.FC<{dist: number; motion: number; opacity: number; color: string; eyeY: number}> = ({
  dist,
  motion,
  opacity,
  color,
  eyeY,
}) => {
  const material = useMemo(
    () => new THREE.MeshBasicMaterial({transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false}),
    []
  );
  const mesh = useMemo(() => makeInstanced(new THREE.BoxGeometry(1, 1, 1), material, COUNT), [material]);
  if (opacity <= 0.01) return null;
  material.color.set(color).multiplyScalar(opacity);
  const len = Math.min(140, Math.max(2, motion * 1.6));
  for (let i = 0; i < COUNT; i++) {
    const {ahead} = trackSlot(dist * 1.3, rand(i * 2.7) * WINDOW, WINDOW, 20);
    // Around the view axis, mostly to the sides and above; never under the ground.
    const a = -0.08 * Math.PI + rand(i * 5.3) * 1.16 * Math.PI;
    const r = 2.5 + Math.pow(rand(i * 9.1), 0.7) * 16;
    const x = Math.cos(a) * r;
    const y = eyeY + Math.sin(a) * r;
    const thick = 0.02 + rand(i * 3.3) * 0.04;
    setInstance(mesh, i, x, y, -ahead, thick, thick, len);
  }
  mesh.instanceMatrix.needsUpdate = true;
  return <primitive object={mesh} />;
};
