# DATA STORY — Runtime status του reference renderer

Ημερομηνία ελέγχου: 2026-09-05 · Περιβάλλον: Linux x86_64, 4 cores, g++ 12, Python 3.11.15,
numpy 2.4.6, Pillow 12.3.0, FFmpeg 7.0.2-static (imageio-ffmpeg), DejaVu Sans στο
`/usr/share/fonts/truetype/dejavu/`.

Απαντά στο ερώτημα: «Το πακέτο είναι μόνο specification ή μπορεί πράγματι να γίνει render;»

## Εκτελεσμένοι έλεγχοι

| # | Έλεγχος | Αποτέλεσμα | Τεκμήριο |
|---|---|---|---|
| 1 | SHA256 `motion_renderer.cpp` / `build_motion_test.py` / `render_variants.py` = registry | PASS | Και οι τρεις τιμές ταυτίζονται με `DATA_STORY_TEMPLATE_REGISTRY.json → reference_sha256` |
| 2 | Compile `motion_renderer.cpp` (`-O3 -ffast-math -fopenmp -shared -fPIC`) | PASS | `motion_renderer.so` 25 392 bytes, 2,5 s, χωρίς warnings |
| 3 | `build_motion_test.py --stills` (6 PNG 1080×1920) | PASS | 4,05 s συνολικά |
| 4 | Stills byte-identical με `previews/data-story-3d-*.png` | PASS | `cmp` IDENTICAL για population, before-after, stacked, donut, line, ranking |
| 5 | Πλήρες demo MP4 (`build_motion_test.py`) | PASS | 1200 frames, 720×1280, 25 fps, 48,00 s, H.264 yuv420p, 1,49 MB, 3 min 26 s render |
| 6 | Full decode του MP4 με FFmpeg (`-f null`) | PASS | 1200 frames αποκωδικοποιήθηκαν χωρίς σφάλμα |
| 7 | Μετρητής KPI συγχρονισμένος με επιλογή φιγούρων (population, frame 38) | PASS | Ένδειξη 10% με ακριβώς 1 κόκκινη φιγούρα από 10 |
| 8 | Στατικό εξώφυλλο στο frame 0 | FAIL (αναμενόμενο) | Frame 0: μέση φωτεινότητα 42,8, max 57 — μόνο φόντο. Το demo κάνει fade-in από άδειο περιβάλλον, όπως τεκμηριώνει το Knowledge §4 |
| 9 | Footer πηγής ≥30 px στο master 1080 | FAIL (αναμενόμενο) | Ο κώδικας χρησιμοποιεί 23 px (`render_variants.overlay`) — registry `demo_source_font_px: 23` |
| 10 | Ελληνικά κείμενα, σημαίες, τίτλοι χωρίς τονο στα stills | PASS | Οπτικός έλεγχος population still: τίτλος, KPI, σημαία, labels, footer εντός 82 px margins |

## Μη εκτελεσμένοι έλεγχοι

| Έλεγχος | Κατάσταση | Λόγος |
|---|---|---|
| Render με πραγματικά (μη demo) δεδομένα | NOT_RUN | Δεν υπάρχει adapter Production JSON → renderer· οι τιμές είναι hard-coded |
| Έξοδος 1080×1920 MP4 | NOT_RUN | Το script εξάγει 720×1280 (`W,H=720,1280`); τα stills είναι 1080×1920 |
| Ευθυγράμμιση VO / ήχου | NOT_RUN | Δεν υπάρχει audio asset· ο renderer είναι silent |
| Planned templates (hero_kpi, waffle_100, line_dual, timeline, diverging_bars, waterfall) | NOT_RUN | Δεν υλοποιούνται στον κώδικα |

## Συμπέρασμα

Το πακέτο **κάνει πράγματι render** σε αυτό το περιβάλλον και αναπαράγει ακριβώς
τα εγκεκριμένα previews. Παραμένει όμως **visual demo**, όχι production pipeline:

1. Χωρίς adapter δεδομένων δεν μπορεί να δεχθεί νέο θέμα χωρίς χειροκίνητη επεξεργασία
   C++ και Python (διπλή συντήρηση τιμών).
2. Το frame 0 δεν είναι στατικό εξώφυλλο (απαίτηση publication).
3. Το footer πηγής είναι 23 px αντί για ≥30 px.
4. Η εξαγωγή βίντεο είναι 720×1280 αντί για master 1080×1920.

Κάθε Production Document που παράγεται πριν καλυφθούν τα 1–4 παραδίδεται ως
`specification_complete`, με `render_status: not_run` για τα πραγματικά δεδομένα.
