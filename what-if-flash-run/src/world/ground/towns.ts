import {distAt} from '../speedProfile';
import {BEATS} from '../beats';

/** Towns along the road: one passes right on "Every town you PASS", then every TOWN_SPACING metres. */
export const TOWN_SPACING = 1100;
const TOWN0 = distAt(BEATS.pass);

/** Indices of the towns between `from` and `to` metres along the road. */
export const townsBetween = (from: number, to: number): number[] => {
  const first = Math.max(0, Math.ceil((from - TOWN0) / TOWN_SPACING));
  const last = Math.floor((to - TOWN0) / TOWN_SPACING);
  const out: number[] = [];
  for (let k = first; k <= last; k++) out.push(k);
  return out;
};

/** Position along the road of town k's centre. */
export const townAt = (k: number) => TOWN0 + k * TOWN_SPACING;
