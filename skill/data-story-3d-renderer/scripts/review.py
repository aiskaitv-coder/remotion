"""Visual-review package: cover, one settled frame per scene, numbered contact sheet.
usage: python3 web/tools/review.py <production.json> <built.html> <out_dir>
Frames are captured with tools/stills.mjs from the SAME built page used for the MP4. Scene numbers
and timestamps are drawn on the contact sheet margins only (review annotations, not artwork)."""
import json, os, subprocess, sys
from PIL import Image, ImageDraw, ImageFont
prod_file, html, out = sys.argv[1:4]; os.makedirs(out, exist_ok=True)
prod = json.load(open(prod_file)); scenes = prod['scenes']
def settle_time(s):  # declared review_at_ms, else 300 ms before the outgoing transition starts
    if 'review_at_ms' in s: return (s['start_ms'] + s['review_at_ms']) / 1000
    tr = (s.get('transition') or {}).get('duration_ms', 350)
    return (s['start_ms'] + s['duration_ms'] - tr - 300) / 1000
times = [0.0] + [settle_time(s) for s in scenes]
subprocess.run(['node', os.path.join(os.path.dirname(__file__), 'stills.mjs'), html, out, ','.join(f'{t:.2f}' for t in times)], check=True)
os.replace(os.path.join(out, 'frame_0.00.png'), os.path.join(out, 'cover_frame0.png'))
for i, (s, t) in enumerate(zip(scenes, times[1:]), 1):
    os.replace(os.path.join(out, f'frame_{t:.2f}.png'), os.path.join(out, f'scene_{i:02d}_{s["id"]}_{t:.2f}s.png'))
# Contact sheet: cover + scenes, 3 per row, 360×640 thumbs, labels in the margin.
files = ['cover_frame0.png'] + sorted(f for f in os.listdir(out) if f.startswith('scene_'))
labels = ['COVER · frame 0 · 0.00 s'] + [f'{i}. {s["id"]} {s["template_id"]} · {t:.2f}s' for i, (s, t) in enumerate(zip(scenes, times[1:]), 1)]
cols, tw, th, pad, cap = 3, 360, 640, 24, 40
rows = -(-len(files) // cols)
sheet = Image.new('RGB', (cols * (tw + pad) + pad, rows * (th + cap + pad) + pad), '#0b1024'); d = ImageDraw.Draw(sheet)
font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 16)
for k, (f, lab) in enumerate(zip(files, labels)):
    x = pad + (k % cols) * (tw + pad); y = pad + (k // cols) * (th + cap + pad)
    sheet.paste(Image.open(os.path.join(out, f)).resize((tw, th), Image.Resampling.LANCZOS), (x, y + cap))
    d.text((x, y + 8), lab, font=font, fill='#f6f7ff')
sheet.save(os.path.join(out, 'contact_sheet.png')); print('review package in', out); print('\n'.join(files))
