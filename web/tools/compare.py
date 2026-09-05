"""Compare a browser-rendered frame with a native reference still.
usage: python3 web/tools/compare.py candidate.png reference.png out_prefix
Reports mean absolute error (0-255) for the whole frame, the geometry square (y 650-1730)
and the text regions, and writes a side-by-side + amplified diff image."""
import sys, numpy as np
from PIL import Image
cand, ref, prefix = sys.argv[1:4]
a = np.asarray(Image.open(cand).convert('RGB')).astype(np.int16)
b = np.asarray(Image.open(ref).convert('RGB')).astype(np.int16)
assert a.shape == b.shape, (a.shape, b.shape)
d = np.abs(a - b)
def mae(sl): return float(d[sl].mean())
print(f"MAE full frame      : {mae(np.s_[:, :]):6.2f}")
print(f"MAE geometry square : {mae(np.s_[650:1730, :]):6.2f}")
print(f"MAE header (0-650)  : {mae(np.s_[0:650, :]):6.2f}")
print(f"MAE footer (1730-)  : {mae(np.s_[1730:, :]):6.2f}")
print(f"pixels with any channel diff > 40: {(d.max(axis=2) > 40).mean()*100:5.2f}%")
side = Image.new('RGB', (1080*3, 1920))
side.paste(Image.fromarray(a.astype(np.uint8)), (0, 0)); side.paste(Image.fromarray(b.astype(np.uint8)), (1080, 0))
side.paste(Image.fromarray(np.clip(d*4, 0, 255).astype(np.uint8)), (2160, 0))
side.resize((1080*3//2, 960)).save(prefix + '_side_by_side.png'); print('wrote', prefix + '_side_by_side.png')
