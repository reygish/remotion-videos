import {NOISE_GLSL} from './noise';

/**
 * Sun surface: boiling granulation from layered noise, a hot-to-cool colour
 * ramp, and limb darkening (edges dimmer and redder, like the real Sun).
 * Uniforms: uTime (seconds), uHeat (0-1, whiter + brighter), uSeed.
 */
export const SUN_VERTEX = /* glsl */ `
varying vec3 vPos;
varying vec3 vNormal;
varying vec3 vView;
void main() {
  vPos = position;
  vec4 world = modelMatrix * vec4(position, 1.0);
  vNormal = normalize(mat3(modelMatrix) * normal);
  vView = normalize(cameraPosition - world.xyz);
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

export const SUN_FRAGMENT = /* glsl */ `
uniform float uTime;
uniform float uHeat;
uniform float uSeed;
varying vec3 vPos;
varying vec3 vNormal;
varying vec3 vView;
${NOISE_GLSL}
void main() {
  vec3 p = normalize(vPos);
  vec3 drift = vec3(uSeed, uTime * 0.04, uTime * 0.03);
  float large = fbm(p * 3.0 + drift);
  float cells = fbm(p * 16.0 + drift * 3.0 + large * 1.5);
  float t = clamp(0.35 * large + 0.75 * cells, 0.0, 1.0);
  t = clamp(t + uHeat * 0.18, 0.0, 1.0);

  vec3 deep   = vec3(0.55, 0.08, 0.0);
  vec3 orange = vec3(1.0, 0.42, 0.04);
  vec3 yellow = vec3(1.0, 0.80, 0.32);
  vec3 white  = vec3(1.0, 0.97, 0.88);
  vec3 col = mix(deep, orange, smoothstep(0.15, 0.5, t));
  col = mix(col, yellow, smoothstep(0.45, 0.75, t));
  col = mix(col, white, smoothstep(0.75, 1.0, t));

  float mu = clamp(dot(normalize(vNormal), normalize(vView)), 0.0, 1.0);
  float limb = pow(mu, 0.45);
  col *= mix(0.45, 1.15, limb);
  col = mix(col, white, uHeat * 0.35 * limb);
  col *= 1.0 + uHeat * 0.35;
  gl_FragColor = vec4(col, 1.0);
}
`;
