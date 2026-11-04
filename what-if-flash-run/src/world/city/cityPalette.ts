import * as THREE from 'three';
import {smooth} from '../../lib/timeline';
import {BEATS} from '../beats';

export type CityLook = {
  zenith: THREE.Color;
  horizon: THREE.Color;
  sun: THREE.Color;
  sunDir: THREE.Vector3;
  fog: THREE.Color;
  fogDensity: number;
  rim: THREE.Color;
  facade: THREE.Color;
  lit: number;
};

/** New York at dusk (arrival), deepening into a calm sunset for the ending. */
export const cityPalette = (frame: number): CityLook => {
  const t = smooth(BEATS.release + 40, BEATS.end, frame);
  return {
    zenith: new THREE.Color('#1c2458').lerp(new THREE.Color('#15173f'), t),
    horizon: new THREE.Color('#ff9a5c').lerp(new THREE.Color('#ff7f50'), t),
    sun: new THREE.Color('#ffc27a'),
    sunDir: new THREE.Vector3(0.32, 0.03 - 0.015 * t, -1).normalize(),
    fog: new THREE.Color('#d98a6e').lerp(new THREE.Color('#c97563'), t),
    fogDensity: 0.00026,
    rim: new THREE.Color('#ff9a5a'),
    facade: new THREE.Color('#2a2d48'),
    lit: 0.38 + 0.12 * t,
  };
};
