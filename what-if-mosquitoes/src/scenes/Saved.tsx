import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {SCENES} from '../config/scenes';
import {clamp, rand} from '../lib/math';
import {SceneFrame} from '../components/SceneFrame';
import {Caption} from '../components/Caption';
import {Headline} from '../components/Headline';
import {Person} from '../components/Person';

/** Lives-saved scene: a grid of people lights up green one by one. */
export const Saved: React.FC = () => {
  const f = useCurrentFrame();
  const cols = 7;
  const rows = 6;
  return (
    <SceneFrame duration={SCENES.saved} bg="radial-gradient(circle at 50% 40%, #1d3b55 0%, #08121c 75%)">
      <Headline top={190} size={92}>
        DELETE THEM
        <br />
        <span style={{color: '#7CFFB2'}}>OVERNIGHT...</span>
      </Headline>
      <div
        style={{
          position: 'absolute',
          top: 560,
          left: 0,
          width: '100%',
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 110px)`,
          justifyContent: 'center',
          gap: 18,
        }}
      >
        {Array.from({length: cols * rows}).map((_, i) => {
          const order = rand(i + 7) * 90;
          const lit = interpolate(f, [20 + order, 34 + order], [0, 1], clamp);
          return (
            <div key={i} style={{transform: `scale(${0.85 + lit * 0.15})`}}>
              <Person color={lit > 0.5 ? '#7CFFB2' : '#3b4d5e'} />
            </div>
          );
        })}
      </div>
      <Caption text="Hundreds of thousands of lives saved. Every single year." end={165} />
    </SceneFrame>
  );
};
