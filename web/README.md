# DATA STORY — browser port (WebGL2) του DATA_STORY_3D_BRIGHT_V1

Single-file HTML εκδοχή του εγκεκριμένου 3D renderer, για Claude Design, browser preview
και αυτόματο render MP4/stills από αυτό το repo. Κάθε αρχείο εξόδου είναι αυτόνομο
(shader, fonts, δεδομένα ενσωματωμένα), χωρίς δίκτυο.

## Τι είναι

| Αρχείο | Ρόλος |
|---|---|
| `src/engine.js` | Το port: GLSL ES 3.0 fragment shader (SDF ray march, 4 φώτα, υλικά, orthographic κάμερα, locked φόντο) + HTML τυπογραφία στις ίδιες συντεταγμένες με το Python/Pillow. Τα δεδομένα μπαίνουν από JSON ως uniforms και labels. |
| `src/page.template.html` | Σκελετός για ΜΙΑ σκηνή (`window.DATA_STORY_SCENE`). |
| `src/story.template.html` | Story player: όλες οι σκηνές ενός Production JSON σε έναν master clock, static cover, crossfade/cut handoffs. |
| `fonts/` | DejaVu Sans Bold/Regular, υποσέτ Greek+Latin (woff2, ~17 KB το καθένα), ως base64 `@font-face`. |
| `scenes/demo_*.json` | Οι έξι demo σκηνές (fictional τιμές) με τη μορφή template inputs. |
| `stories/demo_reel.json` | Production JSON 6 σκηνών × 8 s, για δοκιμή του player. |
| `tools/build.mjs` | Bundler → `dist/<name>.html`. |
| `src/stage.template.html`, `src/stage-runtime/` | **Κύριο παραδοτέο**: Stage-based HTML κατά το Claude2Video Stage Export Format. Το runtime (React 18 + Stage/useTime + timeline component) είναι προ-bundled (`stage-runtime.bundle.js`, esbuild, χωρίς minify) ώστε ο builder να είναι απλή αντικατάσταση. `node tools/build.mjs --stage-html <production.json>`. |
| `tools/build_stage.mjs`, `src/stage.template.jsx` | Stage-based React component (JSX) για Claude Design: `<Stage duration fps autoPlay>` + `useTime()` → `engine.mountStory().render(t)`. Επαληθεύτηκε με shim harness (`test/stage/`): καρέ μέσω `__seek` ταυτόσημα με τα stills. |
| `tools/screenshot.mjs`, `tools/stills.mjs` | Chromium capture ενός ή πολλών timestamps (1080×1920). |
| `tools/render_mp4.mjs` | Frame-by-frame render σε MP4 (25 fps, libx264, yuv420p). |
| `tools/review.py` | Πακέτο VISUAL REVIEW: cover frame 0, ένα settled frame ανά σκηνή, αριθμημένο contact sheet. |
| `tools/compare.py`, `tools/qa_templates.sh` | Pixel σύγκριση με τα native reference stills. |

## Χρήση

```sh
cd web
ln -sfn /opt/node22/lib/node_modules/playwright node_modules/playwright   # ή npm i playwright (χρειάζεται Chromium)

# 1. Μία σκηνή → HTML → still
node tools/build.mjs scenes/demo_population_ratio_10.json
node tools/screenshot.mjs dist/demo_population_ratio_10.html 6 out.png "&static_cover=1&source_px=30"

# 2. Ολόκληρο story → Stage HTML (για claude2video.com) + review package; MP4 προαιρετικά τοπικά
node tools/build.mjs --stage-html stories/demo_reel.json     # → dist/demo_reel.stage.html, το παραδοτέο
node tools/build.mjs --story stories/demo_reel.json
python3 tools/review.py stories/demo_reel.json dist/demo_reel.html dist/review_demo_reel
node tools/render_mp4.mjs dist/demo_reel.html dist/demo_reel.mp4

# 3. QA όλων των templates έναντι των reference stills
./tools/qa_templates.sh
```

Query παράμετροι της σελίδας: `?t=<s>` στατικό καρέ στον master clock, `&static_cover=1`,
`&source_px=30`. Χωρίς `t` η σελίδα κάνει autoplay/loop. Το JS API είναι
`window.dataStory.render(t)` και `window.dataStory.duration`.

## Μορφή σκηνής (template inputs)

Κάθε σκηνή: `id, template_id, duration_ms, copy{...}, inputs{...}, source_footer`, και στο
story επιπλέον `start_ms, static_cover, cover_hold_ms, transition{type, duration_ms}`.

| template_id | inputs |
|---|---|
| population_ratio_10 | `total_units=10, selected_units, country_code` |

Κοινά προαιρετικά πεδία inputs (engine 1.1): `value_decimals` 0–2 (δεκαδικό κόμμα στην οθόνη, τελείες χιλιάδων αυτόματα), `delta_suffix`, `delta_decimals`, `delta_kind: "relative"` για σχετική μεταβολή σε %. `country_code: null` = μπάρα χωρίς σημαία. Σημαίες: DE FR IT GR EU ES FI CZ PL PT.
| before_after_columns | `from{time_label,value}, to{time_label,value}, delta_value, value_suffix, value_scale` |
| stacked_100 | `groups[2]{label, country_code, share}` |
| donut_parts | `parts[]{label, share, material_id, label_color}, highlighted_index` |
| line_single | `observations[]{time, value}, gridlines[], delta_value, value_suffix, value_scale` |
| ranking_horizontal | `bars[]{label, country_code, value, material_id}, highlighted_index, value_suffix, value_scale` |

`material_id`: 0 μπλε (ΕΕ), 1 κόκκινο (Ελλάδα/focus), 2 μωβ, 3 steel. Τα `value_scale`
είναι οι κλίμακες του native renderer (0,064 / 0,080 / 0,075 ανά % μονάδα) και μένουν
σταθερές μέσα σε μια ιστορία.

## Επαλήθευση

Όλα τα έξι templates συγκρίθηκαν pixel-προς-pixel με τα native stills (`renderer/previews`)
στο settled frame t=6 s. Μέση απόλυτη απόκλιση 1,8–3,3/255, φόντο εντός 1/255. Οι διαφορές
είναι ακμές anti-aliasing (ο native κάνει render σε 900 px και LANCZOS resize) και
rasterizer κειμένου (Pillow vs Chromium). Δείτε `docs/RUNTIME_STATUS.md`.

## Όρια

- Το port δεν έχει δοκιμαστεί μέσα στο claude.ai/design. Απαιτεί WebGL2 και εκτέλεση JS
  μέσα στο component. Ο τρόπος που το timeline του Design οδηγεί τον χρόνο πρέπει να
  συνδεθεί με `dataStory.render(t)` ή να αφεθεί το autoplay.
- Τα έξι planned templates (hero_kpi, waffle_100, line_dual, timeline, diverging_bars,
  waterfall) δεν υλοποιούνται· το `mount()` απορρίπτει άγνωστο template_id.
- Το headless render στο repo χρησιμοποιεί SwiftShader (CPU): ≈4,7 s ανά καρέ 1080×1920 στη
  βαρύτερη σκηνή (10 φιγούρες), δηλαδή ≈1,5 ώρα για 48 s βίντεο σε 4 cores. Τα stills και το
  review package είναι γρήγορα (7 καρέ σε 45 s). Σε GPU browser η κίνηση παίζει σε πραγματικό χρόνο.

## Ανανέωση του runtime bundle

```sh
cd web && npm install --no-save esbuild react@18 react-dom@18 && ln -sfn /opt/node22/lib/node_modules/playwright node_modules/playwright
./node_modules/.bin/esbuild src/stage-runtime/entry.jsx --bundle --outfile=src/stage-runtime/stage-runtime.bundle.js \
  --loader:.jsx=jsx --jsx=automatic --define:process.env.NODE_ENV='"production"'
node test/stage/verify_contract.mjs dist/<story>.stage.html   # fiber walk, hook layout, seek, frame compare
```

Χωρίς minification: ο exporter βρίσκει το Stage από το `type.name`. Μετά την ανανέωση, νέα SHA256 στο skill.
