# Locked design: DATA_STORY_3D_BRIGHT_V1 (browser build)

Everything below is implemented inside `assets/engine.js`, `assets/fonts.css` and the two
templates. It is listed here for the record and for QA, not for you to re-implement. The
builder verifies these files against `LOCKED_SHA256.txt`; a changed byte stops the build.

## Canvas and clock
1080×1920 master, 25 fps, integer milliseconds on one master clock. Scene boundaries on 40 ms.

## Geometry
Ray-marched signed-distance fields, orthographic camera. Donut: eye (0,12,16), target (0,0.3,0),
span 8.9. All other charts: eye (0,7,23), target (0,2.65,0), span 9.4. Geometry occupies the
master square y 650–1730. Rounded edges and depth never change the encoded value.

## Materials (linear RGB) and lights
Blue (0.022,0.085,0.85) · red (0.86,0.008,0.075) · purple (0.28,0.035,0.72) · steel (0.08,0.16,0.32)
· floor (0.016,0.025,0.054) · unselected figure (0.055,0.08,0.145). Four lights at (-5,11,9),
(7,9,4), (0,10,-5), (-1,4,11) with powers 1.35, 1.35, 2.0, 0.65; specular pow 60 ×0.72 + pow 12
×0.05; display exponent 1/2.2.

## Background field
Base #121B37 plus three additive Gaussian fields: (100,1160,680,550)→[14,25,66],
(1120,1280,640,760)→[47,9,38], (720,−120,600,600)→[13,8,29]. Computed in the shader per pixel.

## Typography (master px, Pillow 'la' anchors reproduced with line-height: normal)
DejaVu Sans Bold / Regular, subset Greek+Latin, embedded. Badge 29 px at (115,105) with red
mark; rule y=167; title lines 98 px at (76,212) and (76,324), auto-shrink to 84 px minimum,
fit width 920; context line 27 px at (83,480); hero 158 px at (78,535); hero label 38 px and
sub 25 px anchored on the FINAL value width; rules y=759 and y=1785; source footer ≥30 px at
(83,1804), width 910, up to two lines. Screen colors: text #F6F7FF, secondary #A7B3CF, source
#AFBBD3; accents red #FF315C, blue #567BFF, purple #9852FF, steel #7191B9.

## Motion vocabulary (per scene, seconds are scene-local)
Header settle: opacity + 18 px over 650 ms from 0.12 s. Geometry growth: ease-out cubic,
population figures select sequentially from 1.3 s every 0.4 s; bars from 0.9 s staggered 0.28 s
over 2.5 s; columns 0.9 s staggered 0.55 s over 2.2 s; stacked rows 0.9 s staggered 0.5 s over
2.4 s; donut arc and line draw over 3.6 s from 0.9 s. Counters never overshoot and their labels
keep fixed anchors. Handoffs: `crossfade` (outgoing scene holds its last frame while the next
fades in on top, 280–450 ms) or `cut`. Scene 1 static cover: everything visible at frame 0,
animation starts after `cover_hold_ms`.

## Verified equivalence
Each template's settled frame was compared pixel-by-pixel with the native C++/Pillow reference
stills: mean absolute error 1.8–3.3/255, background within 1/255; remaining differences are
anti-aliased edges and text rasterization. That equivalence is what the hash lock protects.
