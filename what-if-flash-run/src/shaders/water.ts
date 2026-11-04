import {COMMON_GLSL} from './common';

/** River at dusk: sky reflection, rippling streaks of city lights and a sunset glitter path. */
export const WATER_VERTEX = /* glsl */ `
varying vec3 vWorld;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;

export const WATER_FRAGMENT = /* glsl */ `
uniform vec3 uDeep;
uniform vec3 uSky;
uniform vec3 uSun;
uniform vec3 uSunDir;
uniform vec3 uFogColor;
uniform float uFogDensity;
uniform float uTime;
varying vec3 vWorld;
${COMMON_GLSL}
void main() {
  vec3 toCam = cameraPosition - vWorld;
  float dist = length(toCam);
  vec3 v = toCam / dist;
  float fres = pow(1.0 - v.y, 4.0);
  float ripple = vnoise(vec2(vWorld.x * 0.08, vWorld.z * 0.6 + uTime * 0.8)) * vnoise(vec2(vWorld.x * 0.3, vWorld.z * 1.4 - uTime));
  vec3 col = mix(uDeep, uSky, 0.25 + 0.7 * fres);
  // City lights: broken vertical streaks under the skyline.
  float column = hash21(vec2(floor(vWorld.x / 7.0), 1.0));
  float lights = step(0.55, column) * smoothstep(0.35, 0.8, ripple) * (1.0 - smoothstep(500.0, 900.0, abs(vWorld.x)));
  col += vec3(1.0, 0.75, 0.4) * lights * 0.55 * smoothstep(80.0, 600.0, dist);
  // Glitter path toward the low sun.
  vec3 sunFlat = normalize(vec3(uSunDir.x, 0.0, uSunDir.z));
  float path = pow(max(dot(normalize(vec3(-v.x, 0.0, -v.z)), sunFlat), 0.0), 400.0);
  col += uSun * path * smoothstep(0.4, 0.75, ripple) * 1.2;
  gl_FragColor = vec4(applyFog(col, uFogColor, uFogDensity, dist), 1.0);
}
`;
