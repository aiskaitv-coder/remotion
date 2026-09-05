#!/usr/bin/env bash
# Self-contained Stage-based HTML for exporters that accept only .html/.zip (React 18 + Stage/useTime runtime + locked engine, no network).
# usage: web/tools/build_stage_html.sh <production.json> <out.html> [ComponentName]
set -e; cd "$(dirname "$0")/.."
JSON="$1"; OUT="$2"; NAME="${3:-DataStoryStage}"; TMP=$(mktemp -d ./.stagebuild.XXXXXX)
node tools/build_stage.mjs "$JSON" "$TMP/Story.stage.jsx" "$NAME" >/dev/null
cp src/stage-runtime/animations.jsx "$TMP/animations.jsx"
cat > "$TMP/entry.jsx" <<JSX
import React from "react"; import { createRoot } from "react-dom/client";
import Story from "./Story.stage.jsx";
window.__frameReady = false; window.__pageError = null;
window.addEventListener('error', e => { window.__pageError = String(e.message); });
window.addEventListener('unhandledrejection', e => { window.__pageError = String(e.reason && (e.reason.message || e.reason)); });
createRoot(document.getElementById('root')).render(<Story />);
JSX
# no minification: the exporter finds the Stage component by its name in the React tree
./node_modules/.bin/esbuild "$TMP/entry.jsx" --bundle --outfile="$TMP/bundle.js" --loader:.jsx=jsx --jsx=automatic --define:process.env.NODE_ENV='"production"' --log-level=warning
{
  printf '<!doctype html>\n<html lang="el"><head><meta charset="utf-8"><title>DATA STORY · Stage</title>\n'
  printf '<style>html,body{margin:0;background:#121B37;}#root{width:1080px;height:1920px;overflow:hidden;}</style></head>\n'
  printf '<body><div id="root"></div>\n<script>\n'; cat "$TMP/bundle.js"; printf '\n</script></body></html>\n'
} > "$OUT"
echo "built $OUT ($(du -k "$OUT" | cut -f1) KB)"; rm -rf "$TMP"
