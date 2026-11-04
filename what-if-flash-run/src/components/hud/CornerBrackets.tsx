import React from 'react';

/** Sci-fi corner brackets framing a HUD panel. */
export const CornerBrackets: React.FC<{color: string; size?: number; thickness?: number}> = ({color, size = 34, thickness = 5}) => {
  const corners: React.CSSProperties[] = [
    {top: -3, left: -3, borderTop: 1, borderLeft: 1},
    {top: -3, right: -3, borderTop: 1, borderRight: 1},
    {bottom: -3, left: -3, borderBottom: 1, borderLeft: 1},
    {bottom: -3, right: -3, borderBottom: 1, borderRight: 1},
  ];
  return (
    <>
      {corners.map((c, i) => {
        const border = `${thickness}px solid ${color}`;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: size,
              height: size,
              top: c.top,
              left: c.left,
              right: c.right,
              bottom: c.bottom,
              borderTop: c.borderTop ? border : undefined,
              borderLeft: c.borderLeft ? border : undefined,
              borderRight: c.borderRight ? border : undefined,
              borderBottom: c.borderBottom ? border : undefined,
              borderRadius: 6,
            }}
          />
        );
      })}
    </>
  );
};
