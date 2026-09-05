# Production JSON for the renderer

The renderer reads one JSON object. Everything numeric on screen comes from it; nothing is typed
into code. `assets/demo_reel.json` is a complete six-scene example with fictional values.

## Top level (story)

| field | value |
|---|---|
| schema_version | "2.0" |
| design_system | "DATA_STORY_3D_BRIGHT_V1" |
| mode | "publication" or "demo" (demo may show `ΠΗΓΗ: — · ΔΟΚΙΜΑΣΤΙΚΑ ΣΤΟΙΧΕΙΑ`; publication may not) |
| topic, language | free text, "el" |
| canvas | {"width":1080,"height":1920,"fps":25} |
| render_options | {"source_px": 30} (23 only reproduces the old demo footer for comparisons) |
| scenes | array, contiguous: each `start_ms` equals the previous `start_ms + duration_ms` |
| total_duration_ms | sum of durations |

You may keep the editorial fields of the full DATA STORY schema (`editorial`, `narration`,
`sources`, `facts`, `visual_review`, `execution`) in the same object; the renderer ignores what
it does not need, and the audit stays attached to the video's data.

## Scene fields (all templates)

| field | value |
|---|---|
| id | stable id, e.g. "S01" |
| role | "cover", "chart", "outro" |
| template_id | one of the six supported ids |
| start_ms, duration_ms | integers, multiples of 40 |
| static_cover | true on scene 1 only |
| cover_hold_ms | 600–1000 on the cover, 0 elsewhere |
| transition | {"type":"crossfade","duration_ms":400} or {"type":"cut"} — declared on the OUTGOING scene; on the last scene it fades to the background |
| copy | screen strings (below) |
| inputs | template inputs (below) |
| source_footer | "ΠΗΓΗ: ΦΟΡΕΑΣ · ΔΕΔΟΜΕΝΑ: ΠΕΡΙΟΔΟΣ" — ≥30 px, at most two lines of ~910 px; shorten wording, never the font |
| data_ids, source_ids, voiceover_clean, words | optional editorial traceability, passed through |

### copy, shared by every template
`title_line_1`, `title_line_2` (short capitals without tonos, ≤ ~16 chars each), `subtitle`
(context line), `hero_final` (the KPI as it must read at the end and on the cover, e.g. "70%",
"+25", "38%"), `hero_label` (e.g. "ΕΛΛΑΔΑ"), `hero_sub` (e.g. "7 ΑΠΟ ΚΑΘΕ 10").

## Template inputs and extra copy

### population_ratio_10
```json
"inputs": {"fact_id":"F01","total_units":10,"selected_units":7,"country_code":"GR"},
"copy": {..., "legend_selected":"7 ΣΤΟΥΣ 10","legend_rest":"3 ΣΤΟΥΣ 10","legend_note":"ΚΑΘΕ ΦΙΓΟΥΡΑ ΑΝΤΙΣΤΟΙΧΕΙ ΣΕ 10%"}
```
Exactly `selected_units` figures turn red, one every 0.4 s; the KPI counts 10% per figure and
holds at `hero_final` on the cover. Only exact tenths.

### before_after_columns
```json
"inputs": {"from":{"fact_id":"F02","time_label":"2015","value":40},
           "to":{"fact_id":"F03","time_label":"2025","value":65},
           "delta_value":25,"value_suffix":"%","value_scale":0.075},
"copy": {..., "from_caption":"ΠΡΙΝ","to_caption":"ΜΕΤΑ"}
```
`delta_value` = to − from (percentage points when both are %). `value_scale` is world units per
value unit; keep 0.075 for percentages so 100% is the demonstrated column height.

### stacked_100
```json
"inputs": {"groups":[{"fact_id":"F04","label":"ΕΛΛΑΔΑ","country_code":"GR","share":70},
                     {"fact_id":"F05","label":"ΕΥΡΩΠΑΪΚΗ ΕΝΩΣΗ","country_code":"EU","share":55}]},
"copy": {..., "end_title":"ΚΑΘΕ ΜΠΑΡΑ = 100%","end_note":"ΣΥΓΚΡΙΝΟΥΜΕ ΤΗΝ ΚΑΤΑΝΟΜΗ","part_label_yes":"ΝΑΙ","part_label_no":"ΟΧΙ"}
```
Two groups, first row red, second blue; remainder steel. Part labels read "ΝΑΙ 70%" / "ΟΧΙ 30%".

### donut_parts
```json
"inputs": {"parts":[{"fact_id":"F06","label":"ΣΤΕΓΑΣΗ","share":38,"material_id":1,"label_color":"#ff315c"},
                    {"fact_id":"F07","label":"ΤΡΟΦΙΜΑ","share":24,"material_id":0,"label_color":"#7895ff"},
                    {"fact_id":"F08","label":"ΜΕΤΑΦΟΡΕΣ","share":18,"material_id":2,"label_color":"#b486ff"},
                    {"fact_id":"F09","label":"ΑΛΛΑ","share":20,"material_id":3,"label_color":"#95b0d4"}],
           "highlighted_index":0}
```
Shares sum to 100. Legend label colors: red #ff315c, blue #7895ff, purple #b486ff, steel #95b0d4.
The KPI counts up while the highlighted arc is drawn.

### line_single
```json
"inputs": {"observations":[{"fact_id":"F10","time":2021,"value":42}, ... {"fact_id":"F14","time":2025,"value":74}],
           "value_suffix":"%","value_scale":0.064,"gridlines":[0,40,80],"delta_value":32},
"copy": {..., "summary_line":"42%  →  74%","summary_note":"ΣΤΑΘΕΡΑ ΑΝΟΔΙΚΗ ΠΟΡΕΙΑ"}
```
2–5 observations; x spacing is proportional to `time`, so a missing year leaves a gap, as it
should. Last point is red.

### ranking_horizontal
```json
"inputs": {"bars":[{"fact_id":"F15","label":"ΓΕΡΜΑΝΙΑ","country_code":"DE","value":82,"material_id":0},
                   {"fact_id":"F16","label":"ΓΑΛΛΙΑ","country_code":"FR","value":71,"material_id":2},
                   {"fact_id":"F17","label":"ΙΤΑΛΙΑ","country_code":"IT","value":64,"material_id":3},
                   {"fact_id":"F18","label":"ΕΛΛΑΔΑ","country_code":"GR","value":48,"material_id":1}],
           "highlighted_index":3,"value_suffix":"%","value_scale":0.080},
"copy": {..., "end_note":"ΤΑΞΙΝΟΜΗΣΗ ΑΠΟ ΤΟ ΥΨΗΛΟΤΕΡΟ"}
```
2–4 bars, sorted descending, one common scale. Flags available: DE, FR, IT, GR, EU.
Other countries: use `country_code` "EU" only for the EU; for an unsupported flag record the
dependency (the flag set is part of the locked assets).

## Timing guidance
A scene needs its build time plus a 2–3 s reading hold: population ≈ 1.3 + 0.4×selected + 2.5 s;
bars/columns/stacked ≈ 4 s + hold; donut/line ≈ 4.5 s + hold. 6–8 s per scene is typical.
The cover hold (600–1000 ms) is added before the cover scene's own animation.
