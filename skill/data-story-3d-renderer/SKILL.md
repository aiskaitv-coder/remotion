---
name: data-story-3d-renderer
description: Renders DATA STORY Reels/Shorts (1080×1920, 25 fps) in the locked DATA_STORY_3D_BRIGHT_V1 graphics system from a production JSON, producing a self-contained HTML timeline that plays in the browser or Claude Design and exports to MP4. Use it whenever a user asks to build, render, preview, export or hand off a DATA STORY video, a "3D bright" data chart scene, a population_ratio_10 / before_after_columns / stacked_100 / donut_parts / line_single / ranking_horizontal scene, a cover still, a contact sheet or a review package, or when a Production Document / production JSON exists and needs to become video. The graphics are frozen assets, never redrawn — this skill only fills data.
---

# DATA STORY 3D renderer (locked design, data-only workflow)

This skill turns an approved DATA STORY production JSON into the final graphics. The look is
**not** something you design: the shader, materials, lights, orthographic camera, background
field, typography anchors, DejaVu Sans fonts, flags and motion vocabulary all live in
`assets/` as a locked engine. Your entire job is to produce a correct JSON and run the builder.
The builder verifies the SHA256 of every locked asset and refuses to run if one changed, so
the output can never drift from the approved DATA_STORY_3D_BRIGHT_V1 look.

Why so strict: the design was approved once, pixel-compared with the native C++ renderer, and
the user publishes many stories with it. Any "improvement" you make in HTML or CSS is a
variation the editor did not approve and would have to be reviewed again. Do not write CSS,
SVG, canvas or shader code for these charts. Do not restyle, reposition or re-time anything.
If a story needs something the six templates cannot express, say so and stop.

## Workflow

1. **Get the facts and copy into JSON.** Start from `assets/demo_reel.json` (fictional demo
   values, six scenes) as a structural example and read `references/production-json.md` for
   every field. Numbers come from the audited production facts, never from memory. Spoken VO
   and screen values are separate: screen values are numeric strings with Greek decimal commas.
2. **Validate before building:**
   `python3 scripts/validate_production.py story.json --publication`
   Fix every reported line. It checks supported templates, donut sums, integer tenths for the
   ten-figure ratio, descending rankings, contiguous timeline at 40 ms boundaries, cover hold,
   transitions in the 280–450 ms band and real source footers. It cannot verify facts.
3. **Build the timeline page:**
   `python3 scripts/build.py --story story.json DATA_STORY_<topic>.html`
   One self-contained file (~80 KB): fonts, engine and data inline, no network. It autoplays
   and loops; `?t=<seconds>` shows one exact frame; `window.dataStory.render(t)` drives it
   from an external timeline. Scene 1 is a complete static cover at frame 0 for `cover_hold_ms`.
   If you cannot execute Python, do the same substitution by hand: paste `fonts.css` at
   `{{FONTS_CSS}}`, `engine.js` at `{{ENGINE_JS}}`, the JSON at `{{PRODUCTION_JSON}}` and a
   title at `{{TITLE}}` in `assets/story.template.html`, changing nothing else.
4. **Hand off.** Deliver the HTML with the scene table (id, template, start, duration,
   transition). For Claude Design's Stage-based (exportable) projects build the React component
   instead: `python3 scripts/build.py --stage story.json DATA_STORY_<topic>.stage.jsx`. It wraps
   the same locked engine in `<Stage width={1080} height={1920} duration={…} fps={25} autoPlay>`
   and renders every frame from `useTime()` (seconds), so the exporter can seek any frame; the
   only project-specific line is `import { Stage, useTime } from "./animations.jsx"` — point it
   at the project's Stage starter if it lives elsewhere. Do not add CSS animations, timers or
   randomness around it: exportability depends on every pixel being a function of the time value. In Claude Code, `scripts/render_mp4.mjs` and
   `scripts/review.py` produce the MP4 and the visual-review package (cover PNG, one settled
   frame per scene, numbered contact sheet) from the same file — see `references/qa-checklist.md`.

Editorial approval unlocks production; the visual-review stills must still be approved before
a video is treated as final. Never state that a render ran when it did not.

## Choosing a template

| Question the scene answers | template_id |
|---|---|
| How many people out of ten? (exact tenths only) | population_ratio_10 |
| How did one measure change between two dates? | before_after_columns |
| How do two groups split 100%? | stacked_100 |
| How is one whole divided (2–4 parts, sum 100)? | donut_parts |
| How did one measure move over 2–5 dated points? | line_single |
| Who is ahead among 2–4 comparable categories? | ranking_horizontal |

73% is not "7 in 10". Use a bar or donut, or record that `waffle_100` is planned and not
implemented. Planned templates (hero_kpi, waffle_100, line_dual, timeline, diverging_bars,
waterfall) are rejected by the validator; state the dependency rather than improvising.

## Colors and roles

`material_id`: 0 blue (EU-27), 1 red (Greece or the focus item), 2 purple, 3 steel. Red is the
focus color, not an alarm. In population_ratio_10 the selected figures are red and the rest
steel automatically. Label colors for donut legends are the screen accents listed in
`references/production-json.md`; do not invent others.

## What to say when something does not fit

- A title longer than about 16 capitals: shorten the words. The engine shrinks down to 84 px
  and no further; the validator warns early.
- A footer that needs more than two lines at 30 px: shorten the attribution wording without
  changing its meaning; the full URL belongs in the audit, not on screen.
- More than five observations, more than four bars or parts: keep the verified data, report
  that the demonstrated layout needs an extension, and do not delete data to fit.
- A morph between scenes: not supported; declare `cut` or `crossfade`.

## Files

- `assets/` — locked engine, fonts, templates, demo JSON (hashes in `references/LOCKED_SHA256.txt`)
- `scripts/build.py`, `scripts/validate_production.py` — dependency-free; use these first
- `scripts/render_mp4.mjs`, `scripts/stills.mjs`, `scripts/review.py`, `scripts/compare.py` — Claude Code / Node + Playwright + FFmpeg only
- `scripts/build_stage_html.sh` — when an exporter accepts only .html/.zip: bundles React 18 + `assets/stage-runtime/animations.jsx` (Stage/useTime, `window.__seek`, `window.__videoMeta`, `?__render=1`) + the Stage JSX into ONE html (needs Node, esbuild, react, react-dom in `web/`)
- `references/production-json.md` — every field, per template, with an example
- `references/locked-design.md` — what is frozen and why, tokens for the record
- `references/qa-checklist.md` — PASS/FAIL/NOT_RUN checklist for specification and render
