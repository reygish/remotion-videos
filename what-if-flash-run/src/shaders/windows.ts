import {COMMON_GLSL} from './common';

/**
 * Instanced city towers: dark glass facades with a grid of windows (a share
 * of them lit, warm or cool), a warm sunset rim on sun-facing walls, dark
 * roofs, and exp² fog. Window grids fade to their average when they get too
 * small on screen (no moiré).
 */
export const WINDOWS_VERTEX = /* glsl */ `
varying vec3 vWorld;
varying vec3 vNormalW;
varying float vSeed;
void main() {
  mat4 m = modelMatrix * instanceMatrix;
  vec4 w = m * vec4(position, 1.0);
  vWorld = w.xyz;
  vNormalW = normalize(mat3(m) * normal);
  vSeed = fract(sin(dot(instanceMatrix[3].xz, vec2(12.9898, 78.233))) * 43758.5453);
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;

export const WINDOWS_FRAGMENT = /* glsl */ `
uniform vec3 uSunDir;
uniform vec3 uRim;
uniform vec3 uFacade;
uniform vec3 uSkyRefl;
uniform vec3 uFogColor;
uniform float uFogDensity;
uniform float uLit;
varying vec3 vWorld;
varying vec3 vNormalW;
varying float vSeed;
${COMMON_GLSL}
void main() {
  vec3 n = normalize(vNormalW);
  float dist = length(vWorld - cameraPosition);
  float u = abs(n.x) > 0.5 ? vWorld.z : vWorld.x;
  vec2 cell = vec2(u / 3.4, vWorld.y / 4.0);
  vec2 id = floor(cell);
  vec2 f = fract(cell);
  float fw = max(fwidth(cell.x), fwidth(cell.y));
  float win = smoothstep(0.12, 0.2, f.x) * (1.0 - smoothstep(0.8, 0.88, f.x)) * smoothstep(0.22, 0.3, f.y) * (1.0 - smoothstep(0.78, 0.86, f.y));
  // Lit windows cluster by floor and building.
  float floorOn = hash21(vec2(id.y, vSeed * 91.0));
  float on = step(1.0 - uLit * (0.5 + floorOn), hash21(id + vSeed * 137.0));
  vec3 warm = mix(vec3(1.0, 0.78, 0.42), vec3(1.0, 0.9, 0.7), hash21(id + 3.1));
  vec3 cool = vec3(0.75, 0.85, 1.0);
  vec3 lamp = mix(warm, cool, step(0.82, hash21(id + 9.7))) * (0.75 + 0.5 * hash21(id + 5.3));

  float sunFace = max(dot(n, normalize(vec3(uSunDir.x, 0.0, uSunDir.z))), 0.0);
  float height = clamp(vWorld.y / 300.0, 0.0, 1.0);
  vec3 facade = uFacade * (0.8 + 0.4 * vSeed) + uRim * sunFace * (0.35 + 0.65 * height);
  vec3 glass = mix(facade, uSkyRefl, 0.35 + 0.25 * sunFace);
  vec3 near = mix(facade, mix(glass, lamp, on), win);
  vec3 far = mix(facade, lamp, uLit * 0.3) ;
  vec3 col = mix(near, far, smoothstep(0.35, 0.9, fw));
  col = mix(col, uFacade * 0.6, step(0.6, n.y));
  gl_FragColor = vec4(applyFog(col, uFogColor, uFogDensity, dist), 1.0);
}
`;
