import React from 'react';

/** Simple person silhouette (head + shoulders) filled with the given color. */
export const Person: React.FC<{color: string}> = ({color}) => (
  <svg width={110} height={150} viewBox="0 0 40 55">
    <circle cx={20} cy={11} r={9} fill={color} />
    <path d="M4 54 Q4 26 20 26 Q36 26 36 54 Z" fill={color} />
  </svg>
);
