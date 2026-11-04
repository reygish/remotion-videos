/** Earth's surface lit by the Sun: day texture, ocean glint and a blue rim (adapted from what-if-hotter-sun-3d). */
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
uniform sampler2D uClouds;
uniform vec3 uSunDir;
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
  vec3 col = day * (0.05 + diff * 1.15);
  vec3 r = reflect(-l, n);
  col += vec3(1.0, 0.92, 0.75) * pow(max(dot(r, v), 0.0), 24.0) * ocean * 0.5 * diff;
  // Clouds baked into the same pass (one draw call instead of two).
  float cloud = texture2D(uClouds, vUv).a;
  col = mix(col, vec3(1.0) * (0.08 + diff * 1.05), cloud * 0.85);
  float fres = pow(1.0 - max(dot(n, v), 0.0), 3.0);
  col += vec3(0.35, 0.62, 1.0) * fres * (0.3 + diff * 1.1);
  gl_FragColor = vec4(col, 1.0);
}
`;
