/** Sky dome: zenith→horizon gradient, warm glow toward the sun, soft sun disc. */
export const SKY_VERTEX = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = normalize(position);
  vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_Position = p.xyww;
}
`;

export const SKY_FRAGMENT = /* glsl */ `
uniform vec3 uZenith;
uniform vec3 uHorizon;
uniform vec3 uSunColor;
uniform vec3 uSunDir;
uniform float uSunSize;
uniform float uBand;
uniform float uDip;
uniform float uGlow;
varying vec3 vDir;
void main() {
  vec3 d = normalize(vDir);
  float e = clamp(d.y + uDip, 0.0, 1.0);
  vec3 col = mix(uHorizon, uZenith, pow(e, uBand));
  float s = max(dot(d, normalize(uSunDir)), 0.0);
  col += uSunColor * (pow(s, 6.0) * 0.4 * uGlow + pow(s, 90.0) * 0.5) * (1.0 - e * 0.5);
  col = mix(col, vec3(1.0, 0.98, 0.92), smoothstep(1.0 - uSunSize, 1.0 - uSunSize * 0.6, s));
  gl_FragColor = vec4(col, 1.0);
}
`;
