import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {clamp} from '../lib/math';

/** Number that counts up from 0 to `value` between frames `from` and `to`. */
export const Counter: React.FC<{value: number; from: number; to: number; suffix?: string}> = ({
  value,
  from,
  to,
  suffix = '',
}) => {
  const f = useCurrentFrame();
  const n = Math.round(interpolate(f, [from, to], [0, value], {...clamp, easing: Easing.out(Easing.cubic)}));
  return (
    <>
      {n.toLocaleString('en-US')}
      {suffix}
    </>
  );
};
