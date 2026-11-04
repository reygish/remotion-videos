# What if mosquitoes didn't exist?

A 62-second vertical (1080×1920, 30 fps) short video built with [Remotion](https://www.remotion.dev), narrated with [Kokoro](https://github.com/hexgrad/kokoro) text-to-speech.

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

1. Edit `voiceover/script.json`. Voices: `af_heart` (default), `af_bella`, `am_michael`, `am_onyx`, `bm_george`, and more. The first letter picks the accent (`a` American, `b` British).
2. Regenerate. This needs **Python 3.10 to 3.12** (kokoro doesn't support 3.13 yet) and ffmpeg. The model downloads from Hugging Face on first run.
   ```bash
   python3.12 -m venv .venv && source .venv/bin/activate
   pip install -r voiceover/requirements.txt
   python voiceover/generate.py
   ```
3. `npm run render`. Scene lengths, captions and word-cued animations update automatically.

Kokoro returns the exact start and end of every spoken word, so captions are timed to the audio.

## Making changes

- **Change narration/captions:** edit `voiceover/script.json` and regenerate. On-screen titles are the `Headline` text in each scene file.
- **Sync an animation to a word:** `cue('scene', 'word')` returns the frame that word is spoken.
- **Re-time:** scenes last as long as their narration; raise a scene's minimum in `config/scenes.ts` to hold it longer.
- **Add a scene:** create `src/scenes/MyScene.tsx`, add it to `MIN_FRAMES` in `config/scenes.ts`, `SCENE_COMPONENTS` in `WhatIfMosquitoes.tsx`, and `voiceover/script.json`, then regenerate the voiceover.
