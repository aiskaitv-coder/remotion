# DATA STORY — Reels/Shorts graphics system (DATA_STORY_3D_BRIGHT_V1)

Repo υποδομής για τα data-journalism Reels/Shorts του DATA STORY. Περιέχει το
εγκεκριμένο πακέτο οδηγιών (Custom GPT Instructions + Knowledge), το μητρώο
templates και τον reference renderer (C++ ray marching + Python/Pillow + FFmpeg).

## Δομή

| Διαδρομή | Περιεχόμενο |
|---|---|
| `docs/DATA_STORY_GPT_CORE_INSTRUCTIONS.txt` | Το βασικό κείμενο Instructions του Custom GPT |
| `docs/DATA_STORY_Custom_GPT_Instructions.md` | Knowledge «3D BRIGHT V2»: schema, tokens, registry, QA |
| `docs/DATA_STORY_TEMPLATE_REGISTRY.json` | Μητρώο 12 template IDs (6 visual_demo, 6 planned) + SHA256 αναφοράς |
| `docs/START_HERE.md` | Οδηγός εγκατάστασης του πακέτου στο GPT |
| `docs/RUNTIME_STATUS.md` | Πραγματικός έλεγχος εκτέλεσης του renderer σε αυτό το περιβάλλον |
| `renderer/` | Reference renderer: `motion_renderer.cpp`, `build_motion_test.py`, `render_variants.py`, `chart-sources.json`, `previews/` |

## Build και render (Linux)

```sh
# Εξαρτήσεις: g++ με OpenMP, Python 3 + numpy + pillow, FFmpeg με libx264, DejaVu Sans
pip install numpy pillow
cd renderer
g++ -O3 -ffast-math -fopenmp -shared -fPIC motion_renderer.cpp -o motion_renderer.so
python3 build_motion_test.py --stills   # 6 PNG 1080×1920 (~4 s)
python3 build_motion_test.py            # 48 s demo MP4 720×1280 @25fps (~3,5 min σε 4 cores)
```

Αν δεν υπάρχει FFmpeg στο σύστημα: `pip install imageio-ffmpeg` και symlink το
binary που επιστρέφει `imageio_ffmpeg.get_ffmpeg_exe()` ως `ffmpeg` στο PATH.

## Κατάσταση υλοποίησης

- Τα έξι demo γραφήματα κάνουν render και ταυτίζονται byte-by-byte με τα previews αναφοράς.
- Οι τιμές, τίτλοι, πηγές και διάρκειες είναι ακόμη hard-coded (C++ και Python).
- Δεν υπάρχει adapter που να διαβάζει το Production JSON (schema 2.0), ούτε static cover
  στο frame 0, ούτε footer πηγής ≥30px. Βλ. `docs/RUNTIME_STATUS.md`.
