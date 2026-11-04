import React, {useMemo} from 'react';
import * as THREE from 'three';
import {rand} from '../../lib/math';

/** Smooth ridge height around the horizon: a few octaves of sines + random peaks. */
const ridge = (a: number, seed: number, minH: number, maxH: number) => {
  let v = 0;
  v += 0.5 + 0.5 * Math.sin(a * 3 + seed);
  v += 0.6 * (0.5 + 0.5 * Math.sin(a * 7.3 + seed * 2.1));
  v += 0.35 * (0.5 + 0.5 * Math.sin(a * 17.1 + seed * 3.7));
  v += 0.2 * (0.5 + 0.5 * Math.sin(a * 41.7 + seed * 5.3));
  v /= 1.65;
  // A pass straight ahead (-z), where the road goes.
  const ahead = Math.max(0, -Math.sin(a));
  return (minH + (maxH - minH) * v * v) * (1 - 0.6 * Math.pow(ahead, 30));
};

/** A continuous faceted mountain range at `radius` m around the camera. */
const rangeGeometry = (radius: number, depth: number, minH: number, maxH: number, seed: number, n: number) => {
  const pos: number[] = [];
  const pt = (i: number, row: number) => {
    const a = (i / n) * Math.PI * 2;
    const h = ridge(a, seed, minH, maxH);
    const jitter = (rand(seed + i * 1.7 + row * 31) - 0.5) * 0.25;
    const r = radius + depth * [0, 0.45 + jitter, 1][row];
    const y = [-40, h * (0.55 + jitter), h][row];
    return [Math.cos(a) * r, y, Math.sin(a) * r];
  };
  for (let i = 0; i < n; i++) {
    for (let row = 0; row < 2; row++) {
      const a = pt(i, row);
      const b = pt(i + 1, row);
      const c = pt(i, row + 1);
      const d = pt(i + 1, row + 1);
      pos.push(...a, ...c, ...b, ...b, ...c, ...d);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.computeVertexNormals();
  return g;
};

/** Distant desert mountain ranges; they sink away as farmland takes over. */
export const Mountains: React.FC<{sink: number}> = ({sink}) => {
  const near = useMemo(() => rangeGeometry(5500, 1600, 60, 700, 3, 160), []);
  const far = useMemo(() => rangeGeometry(10000, 2500, 300, 1700, 17, 120), []);
  if (sink >= 1) return null;
  return (
    <group scale={[1, 1 - sink, 1]}>
      <mesh geometry={near}>
        <meshLambertMaterial color="#a8705a" flatShading side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={far}>
        <meshLambertMaterial color="#86667a" flatShading side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};
