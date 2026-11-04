import {COMMON_GLSL} from './common';

/** Expanding shock ring: a wall of dust/vapour, dense at the ground, ragged on top. */
export const SHOCK_RING_VERTEX = /* glsl */ `
varying vec2 vUv;
varying vec3 vWorld;
void main() {
  vUv = uv;
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;

export const SHOCK_RING_FRAGMENT = /* glsl */ `
uniform float uOpacity;
uniform float uTime;
uniform vec3 uColor;
varying vec2 vUv;
varying vec3 vWorld;
${COMMON_GLSL}
void main() {
  float n = vnoise(vec2(vUv.x * 90.0, vUv.y * 3.0 - uTime * 2.0));
  float top = 1.0 - smoothstep(0.25 + 0.5 * n, 1.0, vUv.y);
  float base = 1.0 - smoothstep(0.0, 0.35, vUv.y);
  float a = (top * 0.55 + base * 0.45) * (0.6 + 0.4 * n);
  gl_FragColor = vec4(uColor * (0.9 + 0.2 * n), a * uOpacity);
}
`;

/** Expanding spherical shock front seen from inside: a bright haze over everything beyond it. */
export const SHOCK_SPHERE_FRAGMENT = /* glsl */ `
uniform float uOpacity;
uniform float uTime;
uniform vec3 uColor;
varying vec2 vUv;
varying vec3 vWorld;
${COMMON_GLSL}
void main() {
  float n = vnoise(vec2(vUv.x * 40.0, vUv.y * 20.0 + uTime));
  float low = 1.0 - smoothstep(0.5, 0.8, vUv.y);
  float a = (0.35 + 0.65 * low) * (0.75 + 0.25 * n);
  gl_FragColor = vec4(uColor, a * uOpacity);
}
`;
