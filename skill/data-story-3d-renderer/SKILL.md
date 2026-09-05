---
name: data-story-3d-renderer
description: Renders DATA STORY Reels/Shorts (1080×1920, 25 fps) in the locked DATA_STORY_3D_BRIGHT_V1 graphics system from a production JSON, producing ONE self-contained Stage-based HTML (Claude2Video Stage Export Format) that the user uploads to claude2video.com to get the MP4. Use it whenever a user asks to build, render, preview, export or hand off a DATA STORY video, a "3D bright" data chart scene, a population_ratio_10 / before_after_columns / stacked_100 / donut_parts / line_single / ranking_horizontal scene, a cover still, a contact sheet or a review package, or when a Production Document / production JSON exists and needs to become video. The graphics are frozen assets, never redrawn — this skill only fills data.
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
3. **Build the deliverable, a Stage-based HTML:**
   `python3 scripts/build.py --stage-html story.json DATA_STORY_<topic>.stage.html`
   One self-contained file (~370 KB): fonts, production JSON, the locked engine and a pre-bundled React 18
   runtime with `<Stage>`/`useTime()` inline, no network. It implements the Claude2Video Stage Export
   Format exactly (`references/claude2video-contract.md`): `window.Stage`/`window.useTime` before the
   `#root` mount, one `<Stage width height duration>` whose first two `useState` are `time` then
   `playing`, a canvas div with `transform: scale(1)`, and every pixel a function of `useTime()`.
   It autoplays in any browser with no interaction; the exporter pauses it and seeks frame by frame.
   The builder is pure Python and refuses to run if a locked asset changed.
   If you cannot execute Python, do the same substitution by hand in `assets/stage.template.html`:
   `{{FONTS_CSS}}` ← fonts.css, `{{PRODUCTION_JSON}}` ← the JSON, `{{ENGINE_JS}}` ← engine.js,
   `{{STAGE_RUNTIME_JS}}` ← stage-runtime/stage-runtime.bundle.js, `{{TITLE}}` ← a title. Nothing else.
4. **Hand off.** Deliver the `.stage.html` with the scene table (id, template, start, duration,
   transition) and tell the user: upload it to https://claude2video.com/ to render and download
   the MP4 (choose 25 fps so scene boundaries fall on frames). Do not produce an MP4 yourself
   unless the user asks for a local render; the page IS the export-ready timeline.
   Variants when asked: `--story` gives the plain autoplay page (`?t=<s>` scrubs a frame);
   `--stage <name>` gives the JSX component for a Claude Design project that has its own
   `animations.jsx`. In Claude Code, `scripts/review.py` produces the visual-review package
   (cover PNG, one settled frame per scene, numbered contact sheet) from the `--story` page.

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

- `assets/` — locked engine, fonts, templates (page, story, stage HTML, stage JSX), runtime bundle, demo JSON (hashes in `references/LOCKED_SHA256.txt`)
- `scripts/build.py` (`--stage-html` default, `--story`, `--stage`), `scripts/validate_production.py` — dependency-free; use these first
- `scripts/render_mp4.mjs`, `scripts/stills.mjs`, `scripts/review.py`, `scripts/compare.py` — optional local render/review, Claude Code only (Node + Playwright + FFmpeg)
- `assets/stage-runtime/` — `animations.jsx` (Stage/useTime source) and `stage-runtime.bundle.js` (React 18 + runtime + timeline component, pre-bundled, locked)
- `references/production-json.md` — every field, per template, with an example
- `references/locked-design.md` — what is frozen and why, tokens for the record
- `references/qa-checklist.md` — PASS/FAIL/NOT_RUN checklist for specification and render
- `references/claude2video-contract.md` — the Stage Export Format and how the bundled runtime meets it
