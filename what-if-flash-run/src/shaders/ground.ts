import {COMMON_GLSL} from './common';

/**
 * The ground of the run: desert sand → patchwork farmland (by position along
 * the road), a two-lane highway with motion-blurred dashes, curvature for the
 * climb to orbit, heat tint and exp² fog.
 */
export const GROUND_VERTEX = /* glsl */ `
uniform float uCurve;
varying vec3 vWorld;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  w.y -= dot(w.xz, w.xz) * uCurve * 0.5;
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;

export const GROUND_FRAGMENT = /* glsl */ `
uniform float uDist;
uniform float uScroll;
uniform float uStretch;
uniform float uMotion;
uniform vec2 uBiome;
uniform vec3 uFogColor;
uniform float uFogDensity;
uniform vec3 uSunColor;
uniform vec3 uSkyColor;
uniform float uSunElev;
uniform float uHeat;
varying vec3 vWorld;
${COMMON_GLSL}

// Integral of a square wave (period P, duty d): lets us box-blur dashes analytically.
float sqInt(float z, float P, float d) { return floor(z / P) * d * P + min(mod(z, P), d * P); }
float blurDash(float z, float P, float d, float w) { return (sqInt(z + w, P, d) - sqInt(z, P, d)) / w; }

void main() {
  float x = vWorld.x;
  float s = uDist - vWorld.z;
  float dist = length(vWorld - cameraPosition);
  float biome = smoothstep(uBiome.x, uBiome.y, s);
  // Texture space: stretched along the road at speed (motion blur).
  vec2 p = vec2(x, -vWorld.z / uStretch + uScroll);

  // Desert: sand dunes, darker scrub specks.
  float n1 = vnoise(p * 0.012);
  float n2 = vnoise(p * vec2(0.09, 0.09));
  float fast = smoothstep(2.0, 10.0, uStretch);
  vec3 sand = mix(vec3(0.80, 0.56, 0.36), vec3(0.90, 0.70, 0.48), n1);
  sand *= 0.9 + 0.18 * n2;
  float scrub = smoothstep(0.80, 0.9, vnoise(p * 0.55)) * (1.0 - smoothstep(60.0, 400.0, dist));
  sand = mix(sand, vec3(0.42, 0.40, 0.26), scrub * 0.75);

  // Farmland: patchwork fields with crop rows and darker borders.
  vec2 fsz = vec2(70.0, 110.0);
  vec2 q = vec2(x + 13.0, p.y) / fsz;
  vec2 cell = floor(q);
  vec2 fq = fract(q);
  float h = hash21(cell);
  vec3 field = h < 0.3 ? vec3(0.36, 0.55, 0.20) : h < 0.55 ? vec3(0.55, 0.62, 0.24) : h < 0.8 ? vec3(0.84, 0.71, 0.37) : vec3(0.52, 0.38, 0.24);
  float rowsDir = step(0.5, hash21(cell + 7.1));
  float rows = sin((rowsDir > 0.5 ? fq.x * fsz.x : fq.y * fsz.y) * 2.6) * 0.5 + 0.5;
  float rowFade = 1.0 - smoothstep(30.0, 250.0, dist);
  field *= 0.88 + 0.16 * mix(0.5, rows, rowFade);
  field *= 0.92 + 0.12 * n1;
  vec2 edge = min(fq, 1.0 - fq) * fsz;
  float border = 1.0 - smoothstep(0.0, 2.5, min(edge.x, edge.y));
  field = mix(field, vec3(0.30, 0.34, 0.18), border * 0.6);

  vec3 col = mix(sand, field, biome);
  col *= 1.0 + fast * 0.35 * (vnoise(vec2(x * 0.9, p.y * 0.05)) - 0.5);

  // Highway: worn asphalt with tyre tracks, tar seams, gravel shoulders, white edges, dashed yellow centre.
  float ax = abs(x);
  float grain = vnoise(p * vec2(2.2, 0.7));
  vec3 asphalt = vec3(0.33, 0.32, 0.34) * (0.88 + 0.2 * grain);
  float tyre = exp(-pow((ax - 1.9) / 0.7, 2.0));
  asphalt *= 1.0 - 0.12 * tyre;
  float patchN = vnoise(vec2(x * 0.25, p.y * 0.04));
  asphalt *= 1.0 - 0.1 * smoothstep(0.62, 0.66, patchN);
  float seam = 1.0 - smoothstep(0.0, 0.008, abs(vnoise(vec2(x * 0.5, p.y * 0.15)) - 0.5));
  asphalt = mix(asphalt, vec3(0.2, 0.2, 0.21), seam * 0.45 * (1.0 - smoothstep(20.0, 120.0, dist)));
  float shoulder = 1.0 - aastep(6.4, ax);
  col = mix(col, mix(col, vec3(0.6, 0.55, 0.5), 0.45), shoulder);
  float road = 1.0 - aastep(4.4, ax);
  col = mix(col, asphalt, road);
  float edgeLine = aastep(3.85, ax) * (1.0 - aastep(4.05, ax));
  col = mix(col, vec3(0.93), edgeLine);
  float w = max(uMotion, 0.05);
  float dash = blurDash(s, 12.0, 0.4, w);
  float centre = 1.0 - aastep(0.1, ax);
  col = mix(col, vec3(0.97, 0.76, 0.18), centre * dash);

  // Simple lighting: flat ground, sun + sky ambient.
  vec3 lit = col * (uSkyColor * 0.45 + uSunColor * (0.55 + 0.45 * clamp(uSunElev * 2.0, 0.0, 1.0)));
  lit = mix(lit, lit * vec3(1.3, 0.62, 0.4) + vec3(0.12, 0.03, 0.0), uHeat * 0.6);
  gl_FragColor = vec4(applyFog(lit, uFogColor, uFogDensity, dist), 1.0);
}
`;
