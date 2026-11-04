import React, {useMemo} from 'react';
import * as THREE from 'three';
import {makeInstanced, setInstance} from '../../lib/instancing';
import {trackSlot} from '../../lib/track';
import {rand} from '../../lib/math';

const COUNT = 900;
const WINDOW = 1600;
const COLORS = ['#ffffff', '#bfe4ff', '#7fc8ff', '#ffd27a', '#ff9a4a', '#ffffff'];

/**
 * Hyperspace-style streaks: long glowing lines rushing past in a tube around
 * the view axis. `bend` curves the tube downward (hugging the Earth's curve).
 */
export const TunnelStreaks: React.FC<{dist: number; length: number; bend: number; spin: number; opacity: number}> = ({
  dist,
  length,
  bend,
  spin,
  opacity,
}) => {
  const material = useMemo(
    () => new THREE.MeshBasicMaterial({transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false}),
    []
  );
  const mesh = useMemo(() => {
    const m = makeInstanced(new THREE.BoxGeometry(1, 1, 1), material, COUNT);
    const c = new THREE.Color();
    for (let i = 0; i < COUNT; i++) m.setColorAt(i, c.set(COLORS[Math.floor(rand(i * 4.1) * COLORS.length)]).multiplyScalar(0.5 + rand(i * 6.6) * 0.5));
    return m;
  }, [material]);
  material.opacity = opacity;
  for (let i = 0; i < COUNT; i++) {
    const {ahead} = trackSlot(dist * (0.7 + rand(i * 8.8) * 0.6), rand(i * 2.3) * WINDOW, WINDOW, 60);
    const a = rand(i * 5.7) * Math.PI * 2 + spin;
    const r = 1.4 + Math.pow(rand(i * 9.4), 1.3) * 26;
    const k = ahead / 400;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r - bend * k * k * 60;
    const thick = 0.015 + rand(i * 3.1) * 0.04;
    // Tilt each streak along the bend so it follows the curve.
    const tilt = -bend * k * 0.3;
    setInstance(mesh, i, x, y, -ahead, thick, thick, length * (0.5 + rand(i) * 0.8), 0, tilt);
  }
  mesh.instanceMatrix.needsUpdate = true;
  return <primitive object={mesh} />;
};
