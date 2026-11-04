import React, {useMemo} from 'react';
import * as THREE from 'three';
import {hideFrom, makeInstanced, setInstance} from '../../lib/instancing';
import {rand} from '../../lib/math';
import {smooth} from '../../lib/timeline';
import {houseGeometry} from './houseGeometry';
import {townAt, townsBetween} from './towns';

const PER_TOWN = 46;
const MAX_TOWNS = 3;
const PALETTE = ['#efe6d2', '#c46a4c', '#dcb98a', '#a9c2d4', '#e3a58c', '#f2eedc', '#a3bba2', '#d8d0c0'];

/** Small Midwest towns zipping past: blocks of gabled houses either side of the highway. */
export const TownBuildings: React.FC<{dist: number; speed: number}> = ({dist, speed}) => {
  const mesh = useMemo(() => {
    const m = makeInstanced(houseGeometry(), new THREE.MeshLambertMaterial({vertexColors: true, flatShading: true}), PER_TOWN * MAX_TOWNS);
    const c = new THREE.Color();
    for (let i = 0; i < m.count; i++) m.setColorAt(i, c.set(PALETTE[Math.floor(rand(i * 3.3) * PALETTE.length)]));
    return m;
  }, []);
  const show = 1 - smooth(1200, 2000, speed);
  let n = 0;
  if (show > 0) {
    for (const k of townsBetween(dist - 300, dist + 3500).slice(0, MAX_TOWNS)) {
      const centre = townAt(k) - dist;
      for (let j = 0; j < PER_TOWN; j++) {
        const seed = k * 101 + j;
        const side = j % 2 === 0 ? -1 : 1;
        // Houses on a loose grid of blocks; a few bigger "main street" buildings near the road.
        const big = j < 6;
        const x = side * (big ? 16 + rand(seed) * 10 : 22 + Math.floor(rand(seed * 1.7) * 6) * 22 + rand(seed * 2.1) * 6);
        const along = (rand(seed * 3.9) - 0.5) * (big ? 120 : 340);
        const wdt = big ? 12 + rand(seed * 5.1) * 8 : 8 + rand(seed * 5.1) * 4;
        const hgt = big ? 9 + rand(seed * 6.3) * 6 : 6 + rand(seed * 6.3) * 2;
        setInstance(mesh, n++, x, 0, -(centre + along), wdt, hgt * show, wdt * (0.8 + rand(seed * 7.7) * 0.5), side > 0 ? 0 : Math.PI);
      }
    }
  }
  hideFrom(mesh, n);
  mesh.instanceMatrix.needsUpdate = true;
  return <primitive object={mesh} />;
};
