/** Soft atmosphere halo: back-faces of a slightly larger sphere, additive, brighter on the sunlit side. */
export const ATMOSPHERE_VERTEX = /* glsl */ `
varying vec3 vNormal;
varying vec3 vView;
void main() {
  vec4 world = modelMatrix * vec4(position, 1.0);
  vNormal = normalize(mat3(modelMatrix) * normal);
  vView = normalize(cameraPosition - world.xyz);
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

export const ATMOSPHERE_FRAGMENT = /* glsl */ `
uniform vec3 uColor;
uniform vec3 uSunDir;
varying vec3 vNormal;
varying vec3 vView;
void main() {
  float rim = pow(clamp(1.0 + dot(normalize(vNormal), normalize(vView)) * 1.0, 0.0, 1.0), 4.0);
  float lit = 0.35 + 0.65 * max(dot(normalize(vNormal), normalize(uSunDir)), 0.0);
  gl_FragColor = vec4(uColor * rim * lit * 1.4, 1.0);
}
`;
