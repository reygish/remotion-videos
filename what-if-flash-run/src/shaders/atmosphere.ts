/**
 * Thin atmosphere around a radius-1 planet at the origin, computed per view ray
 * (closest approach to the centre): a soft blue limb glow that fades with
 * altitude, and a light haze over the surface near the horizon. Drawn additively
 * on the back faces of a larger sphere, without depth test.
 */
export const ATMOSPHERE_VERTEX = /* glsl */ `
varying vec3 vWorld;
void main() {
  vec4 world = modelMatrix * vec4(position, 1.0);
  vWorld = world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

export const ATMOSPHERE_FRAGMENT = /* glsl */ `
uniform vec3 uColor;
uniform vec3 uSunDir;
uniform float uScale;
varying vec3 vWorld;
void main() {
  vec3 d = normalize(vWorld - cameraPosition);
  float t = -dot(cameraPosition, d);
  vec3 closest = cameraPosition + d * max(t, 0.0);
  float b = length(closest);
  float lit = 0.3 + 0.7 * smoothstep(-0.3, 0.6, dot(normalize(closest), normalize(uSunDir)));
  float limb = exp(-max(b - 1.0, 0.0) / uScale);
  float hits = step(b, 1.0) * step(0.0, t);
  float haze = exp(-(1.0 - b) / (uScale * 6.0)) * 0.7;
  float g = mix(limb, haze, hits);
  vec3 col = mix(uColor, vec3(0.85, 0.93, 1.0), pow(limb, 6.0) * (1.0 - hits) * 0.6);
  gl_FragColor = vec4(col * g * lit, 1.0);
}
`;
