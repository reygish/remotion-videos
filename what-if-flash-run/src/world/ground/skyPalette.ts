import * as THREE from 'three';
import {WorldState} from '../speedProfile';

type Look = {zenith: string; horizon: string; fog: string; sun: string; ground: string; fogDensity: number};

/** Art direction of the run: warm desert dawn → clear day → Mach-10 heat → black space. */
const DAWN: Look = {zenith: '#1f3c7c', horizon: '#f9a466', fog: '#eab08a', sun: '#ffcf8f', ground: '#6a4a3a', fogDensity: 0.00011};
const DAY: Look = {zenith: '#2c66bd', horizon: '#c9def0', fog: '#c3d6e6', sun: '#fff1d8', ground: '#7a6a55', fogDensity: 0.00008};
const HEAT: Look = {zenith: '#3a0c05', horizon: '#ff6a1f', fog: '#e45a22', sun: '#ffb070', ground: '#5a2010', fogDensity: 0.0003};
const SPACE: Look = {zenith: '#000105', horizon: '#4f8fff', fog: '#7aa7e6', sun: '#ffffff', ground: '#203050', fogDensity: 0.000012};

const c = (hex: string) => new THREE.Color(hex);
const lerpLook = (a: Look, b: Look, t: number): Look => ({
  zenith: '#' + c(a.zenith).lerp(c(b.zenith), t).getHexString(),
  horizon: '#' + c(a.horizon).lerp(c(b.horizon), t).getHexString(),
  fog: '#' + c(a.fog).lerp(c(b.fog), t).getHexString(),
  sun: '#' + c(a.sun).lerp(c(b.sun), t).getHexString(),
  ground: '#' + c(a.ground).lerp(c(b.ground), t).getHexString(),
  fogDensity: a.fogDensity + (b.fogDensity - a.fogDensity) * t,
});

export type SkyLook = {
  zenith: THREE.Color;
  horizon: THREE.Color;
  fog: THREE.Color;
  sun: THREE.Color;
  ground: THREE.Color;
  fogDensity: number;
  sunDir: THREE.Vector3;
};

/** Sky, fog and light colours for the ground phase. */
export const skyPalette = (w: WorldState): SkyLook => {
  let look = lerpLook(DAWN, DAY, w.day);
  look = lerpLook(look, HEAT, w.heat);
  look = lerpLook(look, SPACE, w.space);
  // Dawn: the sun rises ahead of us (we run east), left of the road. By day it
  // swings high overhead-behind, so it lights the scenery and leaves the top of the frame clear.
  const sunDir = new THREE.Vector3(-0.34, 0.035, -1)
    .normalize()
    .lerp(new THREE.Vector3(-0.45, 0.85, 0.35).normalize(), w.day)
    .normalize();
  return {
    zenith: c(look.zenith),
    horizon: c(look.horizon),
    fog: c(look.fog),
    sun: c(look.sun),
    ground: c(look.ground),
    fogDensity: look.fogDensity,
    sunDir,
  };
};
