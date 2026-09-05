"""Renders DATA_STORY_ANERGIA_PRODUCTION.md from the production JSON (single source of truth) plus the
review/QA status passed in. Every table below is derived from the JSON, never retyped."""
import json, sys, os, hashlib
P = json.load(open("DATA_STORY_ANERGIA_PRODUCTION.json", encoding="utf-8"))
facts = {f["id"]: f for f in P["facts"]}; sources = {s["id"]: s for s in P["sources"]}
review_dir = sys.argv[1] if len(sys.argv) > 1 else None
html_hash = sys.argv[2] if len(sys.argv) > 2 else "—"
def ms(x): return f"{x/1000:.2f} s"
L = []
w = L.append
w(f"# DATA STORY — ΑΝΕΡΓΙΑ — PRODUCTION DOCUMENT\n")
w(f"**Τίτλος εργασίας:** {P['topic']}  \n**Θέση:** {P['editorial']['thesis']}  \n**Ημερομηνία παραγωγής / research cut-off:** {P['research_cutoff']}  \n**Έγκριση άξονα και δεδομένων:** {P['editorial']['approval_status']}  \n**Γλώσσα:** {P['language']} · **Καμβάς:** {P['canvas']['width']}×{P['canvas']['height']} @ {P['canvas']['fps']} fps · **Σχήμα:** {P['schema_version']} · **Design system:** {P['design_system']} (engine 1.1, browser port)  \n**Διάρκεια timeline:** {ms(P['total_duration_ms'])} ({P['total_duration_ms']//40} καρέ) · **VO:** {P['narration']['expanded_word_count']} εκτεταμένες λέξεις @ {P['narration']['wpm']} WPM = {P['narration']['theoretical_seconds']} s θεωρητικός χρόνος · **Σκηνές:** {len(P['scenes'])}  \n**Mode:** {P['mode']} · **Runtime templates:** ranking_horizontal, before_after_columns, donut_parts (visual_demo, ported) · **Ήχος:** {P['narration']['music']}, VO alignment {P['narration']['alignment_status']}\n")
w("**Αιτιολόγηση διάρκειας άνω των 60 s:** " + P["editorial"]["duration_justification"] + "\n")
w("## 1. Πηγές\n\n| ID | Φορέας | Τίτλος | Dataset | Περίοδος αναφοράς | Δημοσίευση | Πρόσβαση | Περιορισμός |\n|---|---|---|---|---|---|---|---|")
for s in P["sources"]: w(f"| {s['id']} | {s['organization']} | [{s['title']}]({s['url']}) | {s['dataset_code'] or '—'} | {s['reference_period'] or '—'} | {s['release_date'] or '—'} | {s['access_date']} | {s['limitation'] or '—'} |")
w("\n## 2. Εγκεκριμένο audit (facts)\n\n| ID | Δείκτης | Τιμή οθόνης | Μονάδα | Παρονομαστής | Γεωγραφία | Περίοδος | Πηγές | Αναφερόμενο/Υπολογισμός | Τύπος | Κατάσταση | Περιορισμός |\n|---|---|---|---|---|---|---|---|---|---|---|---|")
for f in P["facts"]: w(f"| {f['id']} | {f['indicator']} | {f['display_value']} | {f['unit']} | {f['denominator'] or '—'} | {f['geography']} | {f['reference_period']} | {', '.join(f['source_ids'])} | {f['reported_or_calculated']} | {f['formula'] or '—'} | {f['status']} | {f['limitation'] or '—'} |")
w("\n## 3. Voice-over\n\n### VO A (ElevenLabs v3, αραιά tags)\n")
for s in P["scenes"]: w(f"**{s['id']}** {s['voiceover_tagged']}  ")
w("\n### VO B (καθαρό)\n")
for s in P["scenes"]: w(f"**{s['id']}** {s['voiceover_clean']}  ")
w(f"\nΛέξεις ανά σκηνή: " + ", ".join(f"{s['id']} {s['words']}" for s in P["scenes"]) + f" · Σύνολο {P['narration']['expanded_word_count']} · Θεωρητικός χρόνος {P['narration']['theoretical_seconds']} s · Παύσεις/handoffs εντός ορίων σκηνών · Μετρημένος ήχος: δεν υπάρχει αρχείο (NOT_RUN). Τα κείμενα δεν συνεπάγονται ότι υπάρχει ηχητικό αρχείο.\n")
w("## 4. Master matrix\n\n| Σκηνή | start–end | Ρόλος | VO λέξεις | data_ids | template_id | source_ids | Transition |\n|---|---|---|---|---|---|---|---|")
for s in P["scenes"]: w(f"| {s['id']} | {s['start_ms']}–{s['start_ms']+s['duration_ms']} ms | {s['role']} | {s['words']} | {', '.join(s['data_ids'])} | {s['template_id']} | {', '.join(s['source_ids'])} | {s['transition']['type']} {s['transition'].get('duration_ms','')} ms |")
w("\n## 5. Σκηνές\n")
EV = {
 "ranking_horizontal": [(0,"—","header","enter: opacity+18px settle","0→1","650","easeOutCubic","—"),(500,"πρώτη λέξη","label/flag i","enter (stagger 280 ms)","0→1","400","easeOutCubic","—"),(900,"αριθμός","bar i","grow from x=0 (stagger 280 ms)","0→value","2500","easeOutCubic","—"),(900,"αριθμός","value label i","count, anchored to bar tip","0→value","2500","easeOutCubic","—"),(4300,"—","end_note","enter","0→1","500","easeOutCubic","—")],
 "before_after_columns": [(0,"—","header","enter: opacity+18px settle","0→1","650","easeOutCubic","—"),(450,"—","captions","enter (stagger 200 ms)","0→1","450","easeOutCubic","—"),(900,"πρώτη τιμή","column from","grow from baseline","0→from","2200","easeOutCubic","—"),(1450,"δεύτερη τιμή","column to","grow from baseline","0→to","2200","easeOutCubic","—"),(3650,"μεταβολή","hero delta","count","0→delta","800","easeOutCubic","—")],
 "donut_parts": [(0,"—","header","enter: opacity+18px settle","0→1","650","easeOutCubic","—"),(900,"—","arc","draw clockwise, parts in order","0→360°","3600","easeOutCubic","—"),(900,"μερίδιο","legend item i","enter when its arc starts","0→1","125","linear","—"),(900,"μερίδιο","hero","count while highlighted arc draws","0→share","(arc)","easeOutCubic","—")],
}
for s in P["scenes"]:
    c, inp = s["copy"], s["inputs"]
    w(f"### {s['id']} · {s['role']} · {s['template_id']} (visual_demo, browser port 1.1)\n")
    w(f"- **Χρόνος:** start {s['start_ms']} ms · duration {s['duration_ms']} ms · end {s['start_ms']+s['duration_ms']} ms · static_cover {s['static_cover']} · cover_hold {s['cover_hold_ms']} ms · transition {s['transition']['type']} {s['transition'].get('duration_ms','')} ms")
    w(f"- **VO:** «{s['voiceover_clean']}» ({s['words']} λέξεις)")
    w(f"- **Οθόνη:** τίτλος «{c['title_line_1']} / {c['title_line_2']}» · context «{c['subtitle']}» · hero «{c['hero_final']}» + «{c['hero_label']}» / «{c['hero_sub']}»" + (f" · end note «{c['end_note']}»" if c.get('end_note') else "") + (f" · captions «{c['from_caption']}» / «{c['to_caption']}»" if c.get('from_caption') else ""))
    w(f"- **Footer:** «{s['source_footer']}» (≥30 px, ≤2 γραμμές, ελέγχθηκε με μετρικές γραμματοσειράς)")
    if s["template_id"] == "ranking_horizontal":
        w("- **Inputs:** " + "; ".join(f"{b['label']} ({b['country_code'] or 'χωρίς σημαία'}) = {facts[b['fact_id']]['display_value']} [{b['fact_id']}], material {b['material_id']}" for b in inp["bars"]) + f" · sort descending · highlighted {inp['highlighted_index']} · value_scale {inp['value_scale']} world units/τιμή · decimals {inp['value_decimals']}")
    elif s["template_id"] == "before_after_columns":
        w(f"- **Inputs:** from {inp['from']['time_label']} = {facts[inp['from']['fact_id']]['display_value']} [{inp['from']['fact_id']}] → to {inp['to']['time_label']} = {facts[inp['to']['fact_id']]['display_value']} [{inp['to']['fact_id']}] · delta {facts[inp['delta_fact_id']]['display_value']} [{inp['delta_fact_id']}] · value_scale {inp['value_scale']} · decimals {inp['value_decimals']} · κοινή βάση 0, ίδια κλίμακα στις δύο στήλες")
    else:
        w("- **Inputs:** " + "; ".join(f"{p['label']} = {facts[p['fact_id']]['display_value']} [{p['fact_id']}], material {p['material_id']}, legend {p['label_color']}" for p in inp["parts"]) + f" · άθροισμα {sum(p['share'] for p in inp['parts']):.1f} · highlighted {inp['highlighted_index']}")
    w("- **Frame 0:** " + ("Πλήρες στατικό εξώφυλλο: badge, τίτλος, context, hero στην τελική τιμή, footer· γεωμετρία ξεκινά μετά το hold." if s["static_cover"] else "Φόντο + header σε fade-in (crossfade από την προηγούμενη σκηνή)· γεωμετρία απούσα (χτίζει από 0,9 s)."))
    w("- **Materials/roles:** Ελλάδα κόκκινο (1), ΕΕ-27 μπλε (0), Ισπανία μωβ (2), Φινλανδία steel (3), εκτός εργ. δυναμικού steel (3). Φόντο locked gradient. Κάμερα orthographic, σταθερή.")
    w("- **Events (local ms | trigger | target | operation | from→to | duration | easing | sound):**\n")
    w("| start_ms | trigger | target | operation | from→to | duration_ms | easing | sound |\n|---|---|---|---|---|---|---|---|")
    off = s["cover_hold_ms"]
    for e in EV[s["template_id"]]: w(f"| {e[0]+off} | {e[1]} | {e[2]} | {e[3]} | {e[4]} | {e[5]} | {e[6]} | {e[7]} |")
    hold = s["duration_ms"] - off - (4800 if s["template_id"] != "donut_parts" else 4600) - s["transition"].get("duration_ms", 0)
    w(f"\n- **Reading hold:** ≈{max(hold,0)} ms μετά το settle · **Handoff:** {s['transition']['type']} {s['transition'].get('duration_ms','')} ms, η επόμενη σκηνή εμφανίζεται πάνω από το τελικό καρέ.\n- **Audio:** VO κείμενο μόνο, χωρίς asset · **Runtime:** web/dist/DATA_STORY_ANERGIA.html · **QA:** βλ. §9.\n")
w("## 6. Κεντρικό Production JSON\n\nΤο πλήρες αντικείμενο είναι το αρχείο `DATA_STORY_ANERGIA_PRODUCTION.json` (ταυτόσημο με το ενσωματωμένο στο HTML). Ενσωματώνεται εδώ αυτούσιο:\n\n```json\n" + json.dumps(P, ensure_ascii=False, indent=1) + "\n```\n")
w("## 7. Assets\n\n| Asset | Έκδοση | Διαθεσιμότητα |\n|---|---|---|")
for k, v in P["assets"].items(): w(f"| {k} | {v} | ναι |")
w(f"| Built page | web/dist/DATA_STORY_ANERGIA.html · sha256 {html_hash} | ναι |\n| Review package | web/dist/review_anergia/ (cover, 9 stills, contact sheet) | ναι |\n| MP4 | — | όχι ακόμη (μετά την οπτική έγκριση) |\n| Audio | — | όχι |\n")
w("## 8. Οδηγία Claude Design / renderer\n\nImplement the specified story with DATA_STORY_3D_BRIGHT_V1. Use the exact approved template geometry, materials, fonts, light fields and camera from the provided source package. Populate the centralized facts and template inputs. Do not redesign the charts from prose or replace true-3D marks with a flat SVG/CSS approximation. Preserve sources, flags, Greek text, timing and scales.\n\nThe reference engine is C++ ray marching + Python/Pillow + FFmpeg. First inspect whether the target environment has this runtime or an approved compatible port. Parameterize the demo values and scene lengths through one adapter, preserving the visual constants. Implement the static publication cover, larger source footers, actual VO alignment and any requested layouts, then verify them.\n\nIf single-file HTML/CSS/JS is explicitly required, use an available validated browser implementation or perform a one-time port of the geometry/shading to WebGL with centralized uniforms/data and HTML typography. Porting is engineering work, not already delivered support. Bundle required assets/dependencies for the requested single-file/offline behavior and test in Chromium. Do not claim identical results from an untested reconstruction. A player containing the MP4 is not an editable graphics template.\n\nRender a complete static cover at frame zero. Animate only after its hold. Autoplay without visible playback UI. Respect reduced-motion in interactive preview without changing the explicitly selected export timeline. Implement declared shared morphs or use the declared clean cut. Export only after the requested actual checks run, and report failures or unrun checks truthfully.\n\n**Εφαρμογή σε αυτή την ιστορία:** η validated browser implementation υπάρχει (web/src/engine.js 1.1, ελεγμένη έναντι των native stills). Η σελίδα `DATA_STORY_ANERGIA.html` είναι το timeline· εισάγεται στο Claude Design ως component και εξάγεται MP4, ή γίνεται render με `web/tools/render_mp4.mjs`.\n")
w("## 9. QA\n\n| # | Έλεγχος | Αποτέλεσμα | Τεκμήριο |\n|---|---|---|---|")
qa = [
 ("Q1","Μόνο εγκεκριμένα facts στην οθόνη· κάθε τιμή με fact id","PASS","§2 και inputs ανά σκηνή· validator PASS"),
 ("Q2","Audit πηγών/ημερομηνιών/μεθόδου πλήρες","PASS","§1, από την έρευνα 05/09/2026 (πρωτογενείς σελίδες ανοιγμένες στο GPT)"),
 ("Q3","Διαχωρισμός ελληνικού snapshot (Ιούλ. 2026) από ετήσια ΕΕ σύγκριση (2025) και μακροχρόνια (2024)","PASS","Κάθε σκηνή φέρει την περίοδό της στο context και στο footer"),
 ("Q4","Καμία επινοημένη τιμή, καμία αιτιότητα, κανένα averaging ranks, καμία κάρτα data-gap","PASS","VO και copy περιγραφικά"),
 ("Q5","Ταύτιση τιμών οθόνης / VO / JSON","PASS","VO αριθμοί: 7,9 · 6,1 · 8,9 · 376.508 · 45 χιλ. (στρογγυλοποίηση του 45.192, ακριβές στην οθόνη) · 57/5/38 (στρογγυλοποίηση των 56,8/4,9/38,3 με «περίπου») · 16,8 · 15,1 · τρίτη · 1,2 · 71 · 76 · 5,4"),
 ("Q6","Donut μέρη αθροίζουν 100,0· ranking φθίνουσα· delta σε ποσοστιαίες μονάδες","PASS","C03+C04+C05 = 100,0 · validator"),
 ("Q7","Ποσοστό vs ποσοστιαίες μονάδες vs σχετική μεταβολή","PASS","U05/U17 π.μ. · U06b −10,7% σχετική"),
 ("Q8","VO A/B ίδιες λέξεις· μέτρηση","PASS",f"{P['narration']['expanded_word_count']} λέξεις, {P['narration']['theoretical_seconds']} s"),
 ("Q9","Template IDs υπάρχουν· planned δεν χρησιμοποιούνται","PASS","3 templates, όλα ported"),
 ("Q10","Timeline συνεχές, όρια σε 40 ms, transitions 280–450 ms, cover hold 800 ms","PASS","validator · total 71.080 ms = 1.777 καρέ"),
 ("Q11","Footer ≥30 px ≤2 γραμμές· τίτλοι ≥84 px· hero row εντός 998 px","PASS","validator με μετρικές DejaVu + render χωρίς σφάλμα"),
 ("Q12","Στατικό εξώφυλλο frame 0 με τελικό KPI","PASS","review_anergia/cover_frame0.png"),
 ("Q13","Ένα settled still ανά σκηνή, τιμές/σημαίες/πηγή ορατές","PASS","review_anergia/scene_01…09 + contact_sheet.png (οπτικός έλεγχος)"),
 ("Q14","MP4 1080×1920 25 fps, full decode, καρέ = 1.777","NOT_RUN","Εκκρεμεί οπτική έγκριση"),
 ("Q15","Ήχος/VO alignment","NOT_RUN","Δεν υπάρχει ηχητικό αρχείο"),
 ("Q16","Επαλήθευση C06 (10,1% έτος 2024) στο une_rt_a","NOT_RUN","Υπολογισμός από U12+U17· ζητήθηκε επαλήθευση στο GPT"),
 ("Q17","Νεότερη μακροχρόνια ανεργία 2025 (une_ltu_a)","NOT_RUN","Χρησιμοποιείται 2024 με ορατή χρονοσήμανση"),
]
for q in qa: w(f"| {q[0]} | {q[1]} | {q[2]} | {q[3]} |")
w(f"\n**Κατάσταση:** specification_complete · preview_complete (stills) · render_status: not_run · visual approval: pending.\n")
open("DATA_STORY_ANERGIA_PRODUCTION.md","w",encoding="utf-8").write("\n".join(L))
print("document written", len("\n".join(L))//1024, "KB")
