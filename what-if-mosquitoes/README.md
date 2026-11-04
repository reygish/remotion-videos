# What if mosquitoes didn't exist?

A 62-second vertical (1080×1920, 30 fps) short video built with [Remotion](https://www.remotion.dev), narrated with [Kokoro](https://github.com/thewh1teagle/kokoro-onnx) text-to-speech.

## Commands

| Command | What it does |
|---|---|
| `npm run studio` | Opens the live preview in your browser |
| `npm run render` | Renders `out/what-if-mosquitoes.mp4` |
| `npm run typecheck` | Type-checks the project |

The `render` script points at this cloud container's Chromium. On your own machine, drop the `--browser-executable` flag.

## Layout

```
src/
├── index.ts               Entry point (registers the root)
├── Root.tsx               Declares the composition (size, fps, length)
├── WhatIfMosquitoes.tsx   The timeline: scene order + progress bar
├── config/
│   ├── scenes.ts          Minimum scene lengths; final lengths stretch to fit the narration
│   ├── voiceover.json     GENERATED: narration clip lengths + word timings
│   └── theme.ts           Font
├── lib/
│   ├── math.ts            rand() and clamp helpers
│   └── voiceover.ts       sceneWords() and cue(scene, word) for syncing to narration
├── components/            Reusable building blocks
│   ├── SceneFrame.tsx     Fade in/out + slow zoom wrapper
│   ├── Headline.tsx       Big title text
│   ├── Caption.tsx        Word-by-word captions synced to the narration
│   ├── Voiceover.tsx      Plays a scene's narration clip
│   ├── ProgressBar.tsx    Top progress bar
│   ├── Mosquito.tsx       Animated SVG mosquito
│   ├── Person.tsx         Person icon (Saved scene)
│   └── Fish.tsx           Fish (Pond scene)
└── scenes/                One file per scene, in play order
    ├── Hook.tsx           Title + swarm + "no" stamp
    ├── Deadly.tsx         600,000 counter + disease pills
    ├── Saved.tsx          Grid of people lighting up
    ├── Pond.tsx           Larvae vanish, hungry fish
    ├── Arctic.tsx         Migrating birds, fading swarm
    ├── Flower.tsx         Orchid loses its pollinator
    └── Verdict.tsx        Species bar + end card
```

Outside `src/`:

```
voiceover/
├── script.json            Narration text per scene, voice and speed ← edit the words here
├── generate.py            Kokoro TTS → public/voiceover/*.mp3 + src/config/voiceover.json
└── requirements.txt
public/voiceover/          Generated narration clips (one mp3 per scene)
```

## Voiceover

1. Edit `voiceover/script.json`. Voices: `af_heart` (default), `af_bella`, `am_michael`, `am_onyx`, `bm_george`, and more.
2. Download `kokoro-v1.0.onnx` and `voices-v1.0.bin` from the [kokoro-onnx model release](https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0) into a folder.
3. Regenerate (needs Python and ffmpeg):
   ```bash
   pip install -r voiceover/requirements.txt
   python voiceover/generate.py --models /path/to/that/folder
   ```
4. `npm run render`. Scene lengths, captions and word-cued animations update automatically.

Caption word timings are estimated within each sentence (sentence boundaries come from the audio), so they are close but not frame-perfect.

## Making changes

- **Change narration/captions:** edit `voiceover/script.json` and regenerate. On-screen titles are the `Headline` text in each scene file.
- **Sync an animation to a word:** `cue('scene', 'word')` returns the frame that word is spoken.
- **Re-time:** scenes last as long as their narration; raise a scene's minimum in `config/scenes.ts` to hold it longer.
- **Add a scene:** create `src/scenes/MyScene.tsx`, add it to `MIN_FRAMES` in `config/scenes.ts`, `SCENE_COMPONENTS` in `WhatIfMosquitoes.tsx`, and `voiceover/script.json`, then regenerate the voiceover.
