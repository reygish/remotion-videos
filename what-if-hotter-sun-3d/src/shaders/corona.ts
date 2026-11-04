import {NOISE_GLSL} from './noise';

/**
 * Corona: a camera-facing glow around the Sun with slowly flowing streamers.
 * Drawn on a plane `uExtent` sun-radii wide; additive blending.
 */
export const CORONA_VERTEX = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const CORONA_FRAGMENT = /* glsl */ `
uniform float uTime;
uniform float uHeat;
uniform float uExtent;
uniform float uSeed;
varying vec2 vUv;
${NOISE_GLSL}
void main() {
  vec2 c = (vUv - 0.5) * 2.0 * uExtent;   // in sun radii
  float d = length(c);
  if (d < 0.98) discard;
  float a = atan(c.y, c.x);
  float streak = fbm(vec3(cos(a) * 2.5, sin(a) * 2.5, uTime * 0.06 - d * 0.5 + uSeed));
  float falloff = exp(-(d - 1.0) * (3.2 - uHeat * 1.2));
  float glow = falloff * mix(0.55, 1.5, streak);
  glow += exp(-(d - 1.0) * 14.0) * 0.8;          // bright rim right at the edge
  glow *= 1.0 - smoothstep(uExtent * 0.6, uExtent * 0.97, d);  // fade out before the canvas edge
  vec3 col = mix(vec3(1.0, 0.45, 0.08), vec3(1.0, 0.85, 0.55), clamp(falloff + uHeat * 0.5, 0.0, 1.0));
  gl_FragColor = vec4(col * glow * (1.0 + uHeat * 0.6), 1.0);
}
`;
