/** Small GLSL helpers shared by the world shaders: hashing, value noise, fog, anti-aliased steps. */
export const COMMON_GLSL = /* glsl */ `
float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
             mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), f.x), f.y);
}
float aastep(float edge, float v) {
  float w = max(fwidth(v), 1e-4);
  return smoothstep(edge - w, edge + w, v);
}
vec3 applyFog(vec3 col, vec3 fogColor, float density, float dist) {
  float d = density * dist;
  return mix(col, fogColor, 1.0 - exp(-d * d));
}
`;
