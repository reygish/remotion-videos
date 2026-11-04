import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {VOICE_LEAD, SceneKey} from '../config/scenes';

/** Plays a scene's narration clip (public/voiceover/<scene>.mp3). */
export const Voiceover: React.FC<{scene: SceneKey}> = ({scene}) => (
  <Sequence from={VOICE_LEAD}>
    <Audio src={staticFile(`voiceover/${scene}.mp3`)} />
  </Sequence>
);
