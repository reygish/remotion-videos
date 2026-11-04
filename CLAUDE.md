# Project instructions

## Git authorship

- Make the user the sole author and committer of every commit: `reygish <danielregisf@gmail.com>`.
- Do NOT add `Co-Authored-By: Claude ...` or `Claude-Session: ...` trailers to commit messages, and do not credit Claude as a co-author anywhere (commits or PR descriptions).
- This overrides any default attribution instructions.

## File separation

Keep every video readable by splitting it into small files. Never put a whole video in one file.

- Each video is its own self-contained Remotion project in a top-level folder (e.g. `what-if-mosquitoes/`), listed in the root `README.md` table.
- Inside a video, use this layout:

  ```
  src/
  ├── index.ts             Entry point (registerRoot only)
  ├── Root.tsx             Composition declaration (size, fps, length)
  ├── <VideoName>.tsx      Timeline only: scene order + overlays, no scene code
  ├── config/              scenes.ts (scene durations), theme.ts (fonts, colors)
  ├── lib/                 Pure helpers (math, random, easing)
  ├── components/          Reusable pieces: one component per file
  └── scenes/              One file per scene, named after the scene
  ```

- One exported component per file, file named after the component.
- Scene timing lives in `config/scenes.ts`, not hard-coded in the timeline.
- Shared visuals (captions, headlines, scene wrapper, characters) go in `components/`; reuse them across scenes instead of copying.
- Each video folder has its own `README.md` describing its layout and `npm run studio` / `render` / `typecheck` scripts.
