# QA checklist (report PASS / FAIL / NOT_RUN with evidence)

## Specification (always possible)
- validate_production.py exits 0 in the intended mode (publication rejects the demo footer).
- Every displayed number traces to an audited fact id; screen strings use Greek decimal commas.
- population_ratio_10: selected_units × 10 equals the stated percentage exactly.
- donut shares sum to 100; stacked shares are 0–100; ranking sorted descending.
- before_after delta is in percentage points when both values are percentages.
- Scene 1 static cover, cover_hold_ms 600–1000; transitions 280–450 ms or cut; scenes contiguous.
- Total duration within 40–60 s (up to 75 s only with justification recorded).
- No planned template, no placeholder, no "data unavailable" scene.

## Render (only after actually running the tools)
- `scripts/build.py` printed the output hash; the same JSON rebuilt gives the same hash.
- Frame 0 (`?t=0`) shows the complete cover: KPI at final value, title, period, source.
- One settled still per scene (review.py) shows final values, source footer ≥30 px, Greek text
  inside the 82 px margins, nothing clipped.
- MP4: 1080×1920, 25 fps, frame count = total_duration_ms / 40, full decode without error.
- No unplanned empty frame at scene boundaries (check ±0.5 s around each handoff).
- Audio alignment: NOT_RUN unless a measured VO file exists and was aligned.

## Not covered by this skill
Fact verification, comparability, editorial approval, VO writing and TTS. Those belong to the
DATA STORY editorial instructions; this skill assumes an approved production JSON.
