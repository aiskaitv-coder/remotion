#!/usr/bin/env bash
# Build every demo scene, capture the settled frame (t=6 s) in Chromium and compare with the native reference still.
set -e
cd "$(dirname "$0")/.."
declare -A REF=( [demo_population_ratio_10]=population [demo_before_after_columns]=before-after [demo_stacked_100]=stacked [demo_donut_parts]=donut [demo_line_single]=line [demo_ranking_horizontal]=ranking )
for scene in "${!REF[@]}"; do
  node tools/build.mjs scenes/$scene.json >/dev/null
  node tools/screenshot.mjs dist/$scene.html 6 dist/qa_${scene}_t6.png >/dev/null
  echo "== $scene vs previews/data-story-3d-${REF[$scene]}.png"
  python3 tools/compare.py dist/qa_${scene}_t6.png ../renderer/previews/data-story-3d-${REF[$scene]}.png dist/qa_$scene
done
