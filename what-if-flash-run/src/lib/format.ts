/** Thousands separators without relying on locale data. */
export const commas = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/** HUD speed: one decimal below 100 km/h, then whole numbers with commas. */
export const formatKmh = (v: number) => (v < 100 ? v.toFixed(1) : commas(v));

/** HUD Mach number: more decimals at low speed, whole numbers at absurd speed. */
export const formatMach = (m: number) => {
  if (m <= 0.0005) return '0';
  if (m < 0.1) return m.toFixed(3);
  if (m < 9.95) return m.toFixed(2);
  return commas(m);
};
