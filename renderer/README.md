# Data Story — 3D motion test

Six animated chart demos sharing the approved brighter blue–violet design:
population ratio, before–after, 100% stacked composition, donut, time-series tube,
and horizontal country ranking. The output is a silent 48-second H.264 MP4,
720 × 1280, 25 fps. All numbers are illustrative demo data. The former studio
label has been removed, and every scene has a dedicated source footer.

This prototype uses a native C++ software ray marcher, Python/Pillow for Greek
typography and composition, and FFmpeg for encoding. It does not require Remotion,
an image-generation service, or network access when the dependencies are installed.

## Dependencies

Linux, Python 3 with NumPy and Pillow, FFmpeg with libx264, g++ with OpenMP,
and DejaVu Sans fonts at `/usr/share/fonts/truetype/dejavu/`.

## Build

Run in this folder:

```sh
g++ -O3 -ffast-math -fopenmp -shared -fPIC motion_renderer.cpp -o motion_renderer.so
python build_motion_test.py
```

Output: `data-story-3d-animation-test.mp4`.

Use `python build_motion_test.py --only-new` for the three new types as a
24-second MP4. Use `python build_motion_test.py --stills` to export all six
full-size PNG previews at 1080 × 1920.

Edit `chart-sources.json` to set the source for each scene. While `is_demo` is
true, no real organization is attributed to these fictional values. Non-demo
scenes require an organization, reference period and source URL. Source text
wraps onto at most two reserved footer lines; excessive text raises an error.

`DATA_STORY_CHART_CATALOG.md` describes the 12 proposed chart families,
their intended uses, the six implemented demos, and production design rules.

The Python file sets the scene duration, frame rate, titles, animated labels,
and transitions. The C++ file defines the geometry, lights, materials, camera,
and growth timing. Geometry and labels use the same easing function and timeline.

Demo values are currently defined in both files. Keep them synchronized when
editing; this is a visual prototype, not yet a generalized data-input interface.
`render_variants.py` supplies shared background and typography utilities and
can also render the corresponding static studies.

No audio is included. The small PNG files created while building are local
visual verification frames, not additional video scenes.
