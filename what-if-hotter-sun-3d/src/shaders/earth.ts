/**
 * Earth surface lit by the Sun, with:
 *  - uIce   (0-1): polar ice; lower values melt the caps from the edges inward
 *  - uSea   (0-1): floods low land with a blue tint
 *  - uVenus (0-1): blends into a hot, cloudy Venus
 */
export const EARTH_VERTEX = /* glsl */ `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vView;
void main() {
  vUv = uv;
  vec4 world = modelMatrix * vec4(position, 1.0);
  vNormal = normalize(mat3(modelMatrix) * normal);
  vView = normalize(cameraPosition - world.xyz);
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

export const EARTH_FRAGMENT = /* glsl */ `
uniform sampler2D uDay;
uniform sampler2D uSpec;
uniform sampler2D uVenusMap;
uniform vec3 uSunDir;
uniform float uIce;
uniform float uSea;
uniform float uVenus;
uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vView;
void main() {
  vec3 n = normalize(vNormal);
  vec3 v = normalize(vView);
  vec3 l = normalize(uSunDir);
  float diff = max(dot(n, l), 0.0);

  vec3 day = texture2D(uDay, vUv).rgb;
  float ocean = texture2D(uSpec, vUv).r;

  // Melting ice: bright pixels toward the poles disappear as uIce drops.
  float lat = abs(vUv.y * 2.0 - 1.0);
  float bright = smoothstep(0.5, 0.78, min(day.r, min(day.g, day.b)));
  float edge = mix(1.05, 0.55, uIce);
  float keep = smoothstep(edge - 0.04, edge + 0.04, lat);
  vec3 bare = mix(vec3(0.05, 0.16, 0.32), vec3(0.32, 0.27, 0.22), 1.0 - ocean);
  day = mix(day, bare, bright * (1.0 - keep));

  // Rising seas: tint land near sea level blue.
  day = mix(day, vec3(0.06, 0.2, 0.38), uSea * 0.35 * (1.0 - ocean));

  vec3 earth = day * (0.06 + diff * 1.15);
  vec3 r = reflect(-l, n);
  earth += vec3(1.0, 0.92, 0.75) * pow(max(dot(r, v), 0.0), 24.0) * ocean * 0.6 * diff;

  vec3 venusCol = texture2D(uVenusMap, vUv + vec2(uTime * 0.004, 0.0)).rgb * vec3(1.1, 0.95, 0.7);
  vec3 venus = venusCol * (0.18 + diff * 1.05);
  vec3 col = mix(earth, venus, uVenus);

  float fres = pow(1.0 - max(dot(n, v), 0.0), 3.0);
  vec3 rim = mix(vec3(0.35, 0.62, 1.0), vec3(1.0, 0.75, 0.35), uVenus);
  col += rim * fres * (0.25 + diff * 0.9);
  gl_FragColor = vec4(col, 1.0);
}
`;
