import {COMMON_GLSL} from './common';

/**
 * Vapour cone (Prandtl–Glauert condensation) seen from inside: a funnel of
 * streaky white mist with a sharp bright shock edge at its front.
 */
export const VAPOR_VERTEX = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const VAPOR_FRAGMENT = /* glsl */ `
uniform float uOpacity;
uniform float uTime;
uniform vec3 uColor;
uniform float uFront;
uniform float uRear;
varying vec2 vUv;
${COMMON_GLSL}
void main() {
  float along = vUv.y;
  float ring = smoothstep(0.8, 0.95, along) * (1.0 - smoothstep(0.95, 1.0, along));
  float streak = vnoise(vec2(vUv.x * 160.0, along * 4.0 - uTime * 4.0));
  float puff = vnoise(vec2(vUv.x * 18.0 + uTime, along * 6.0 - uTime * 8.0));
  float weight = mix(smoothstep(0.1, 0.9, along), 1.0 - smoothstep(0.2, 0.9, along), uRear);
  float body = weight * (0.12 * streak + 0.3 * puff * puff);
  float a = body + uFront * ring * (0.55 + 0.45 * streak * puff * 2.0);
  gl_FragColor = vec4(uColor * (0.85 + 0.3 * puff), clamp(a * uOpacity, 0.0, 1.0));
}
`;
