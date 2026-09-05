#!/usr/bin/env python3
"""Deterministic builder for DATA_STORY_3D_BRIGHT_V1 pages. No dependencies beyond Python 3.

    python3 scripts/build.py --stage-html production.json out.html   # DEFAULT DELIVERABLE: Claude2Video-ready Stage page
    python3 scripts/build.py --story production.json out.html   # plain multi-scene player (autoplay, ?t= scrub)
    python3 scripts/build.py --stage production.json out.jsx [ComponentName]   # Stage-based React component for Claude Design
    python3 scripts/build.py scene.json out.html                 # one scene

The graphics are NOT generated here. The engine (shader, materials, camera, typography anchors,
fonts, motion vocabulary) is a locked asset. This script only substitutes the JSON into the
template and refuses to run if any locked asset differs from references/LOCKED_SHA256.txt,
so a build can never carry a modified look."""
import hashlib, json, os, re, sys
from decimal import Decimal

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
ASSETS = os.path.join(ROOT, 'assets'); LOCK = os.path.join(ROOT, 'references', 'LOCKED_SHA256.txt')

def js_json(data):
    """JSON.stringify-compatible serialization so Python and Node builds are byte-identical:
    integral floats print without '.0' and small floats never use exponent notation (JS switches to
    exponents only below 1e-6 or at/above 1e21)."""
    def norm(x):
        if isinstance(x, bool) or x is None or isinstance(x, (int, str)): return x
        if isinstance(x, float):
            if x != x or x in (float('inf'), float('-inf')): return None
            if x.is_integer() and abs(x) < 1e21: return int(x)
            if 1e-6 <= abs(x) < 1e21:
                d = format(Decimal(repr(x)), 'f'); return _Raw(d.rstrip('0').rstrip('.') if '.' in d else d)
            return _Raw(repr(x).replace('e-0', 'e-').replace('e+', 'e+'))
        if isinstance(x, dict): return {k: norm(v) for k, v in x.items()}
        if isinstance(x, (list, tuple)): return [norm(v) for v in x]
        return x
    out = json.dumps(norm(data), ensure_ascii=False, separators=(',', ':'))
    return re.sub(r'"__RAW__(.*?)__"', lambda m: m.group(1), out)
class _Raw(str):
    """Marker for pre-formatted numbers; json.dumps would quote it, so encode via a placeholder."""
    def __new__(cls, v): return str.__new__(cls, '__RAW__' + v + '__')

def verify_locked():
    expected = dict(line.split()[::-1] for line in open(LOCK) if line.strip())
    bad = []
    for name, digest in expected.items():
        actual = hashlib.sha256(open(os.path.join(ASSETS, name), 'rb').read()).hexdigest()
        if actual != digest: bad.append(f'{name}: expected {digest[:12]}…, found {actual[:12]}…')
    if bad:
        sys.exit('LOCKED ASSET MODIFIED — refusing to build. The design system is frozen; restore the '
                 'original files or obtain a new signed release.\n  ' + '\n  '.join(bad))

def build_stage(json_path, out_path, name=None):
    verify_locked()
    data = json.load(open(json_path, encoding='utf-8'))
    name = name or 'DataStory' + ''.join(ch for ch in os.path.basename(json_path).split('.')[0] if ch.isalnum())
    tpl = open(os.path.join(ASSETS, 'stage.template.jsx'), encoding='utf-8').read()
    jsx = (tpl.replace('{{TITLE}}', f"DATA STORY · {data.get('topic','story')} · {data['total_duration_ms']/1000}s @ {data['canvas']['fps']} fps", 1)
              .replace('{{ENGINE_JS}}', open(os.path.join(ASSETS, 'engine.js'), encoding='utf-8').read(), 1)
              .replace('{{FONTS_CSS_JSON}}', json.dumps(open(os.path.join(ASSETS, 'fonts.css'), encoding='utf-8').read()), 1)
              .replace('{{PRODUCTION_JSON}}', js_json(data), 1)
              .replace('{{COMPONENT_NAME}}', name))
    os.makedirs(os.path.dirname(os.path.abspath(out_path)), exist_ok=True)
    open(out_path, 'w', encoding='utf-8').write(jsx)
    print(f'built {out_path} ({os.path.getsize(out_path)//1024} KB) · component {name} · <Stage duration={data["total_duration_ms"]/1000} fps={data["canvas"]["fps"]}>')

def build_stage_html(json_path, out_path):
    """One self-contained HTML implementing the Claude2Video Stage Export Format: fonts, production JSON, the locked
    engine and the pre-bundled React runtime (Stage/useTime, window.Stage/window.useTime, #root mount) inline."""
    verify_locked()
    data = json.load(open(json_path, encoding='utf-8'))
    tpl = open(os.path.join(ASSETS, 'stage.template.html'), encoding='utf-8').read()
    html = (tpl.replace('{{TITLE}}', f"DATA STORY · {data.get('topic', 'story')}", 1)
               .replace('{{FONTS_CSS}}', open(os.path.join(ASSETS, 'fonts.css'), encoding='utf-8').read(), 1)
               .replace('{{PRODUCTION_JSON}}', js_json(data), 1)
               .replace('{{ENGINE_JS}}', open(os.path.join(ASSETS, 'engine.js'), encoding='utf-8').read(), 1)
               .replace('{{STAGE_RUNTIME_JS}}', open(os.path.join(ASSETS, 'stage-runtime', 'stage-runtime.bundle.js'), encoding='utf-8').read(), 1))
    os.makedirs(os.path.dirname(os.path.abspath(out_path)), exist_ok=True)
    open(out_path, 'w', encoding='utf-8').write(html)
    print(f'built {out_path} ({os.path.getsize(out_path)//1024} KB) · <Stage width={data["canvas"]["width"]} height={data["canvas"]["height"]} duration={data["total_duration_ms"]/1000} fps={data["canvas"]["fps"]}> · sha256 {hashlib.sha256(html.encode()).hexdigest()[:16]}')
    print('next: upload this .html to https://claude2video.com/ to render the MP4')

def build(json_path, out_path, story):
    verify_locked()
    data = json.load(open(json_path, encoding='utf-8'))
    tpl = open(os.path.join(ASSETS, 'story.template.html' if story else 'page.template.html'), encoding='utf-8').read()
    title = f"DATA STORY · {data.get('topic', 'story')}" if story else f"DATA STORY · {data['template_id']} · {data['id']}"
    # separators=(',', ':') reproduces JavaScript's JSON.stringify so builds from build.mjs and build.py are byte-identical
    payload = js_json(data)
    html = (tpl.replace('{{TITLE}}', title, 1)
               .replace('{{FONTS_CSS}}', open(os.path.join(ASSETS, 'fonts.css'), encoding='utf-8').read(), 1)
               .replace('{{ENGINE_JS}}', open(os.path.join(ASSETS, 'engine.js'), encoding='utf-8').read(), 1)
               .replace('{{PRODUCTION_JSON}}' if story else '{{SCENE_JSON}}', payload, 1))
    os.makedirs(os.path.dirname(os.path.abspath(out_path)), exist_ok=True)
    open(out_path, 'w', encoding='utf-8').write(html)
    print(f'built {out_path} ({os.path.getsize(out_path)//1024} KB) · sha256 {hashlib.sha256(html.encode()).hexdigest()[:16]}')

if __name__ == '__main__':
    args = sys.argv[1:]; story = '--story' in args; stage = '--stage' in args; stage_html = '--stage-html' in args
    args = [a for a in args if a not in ('--story', '--stage', '--stage-html')]
    if len(args) not in (2, 3) or (len(args) == 3 and not stage): sys.exit(__doc__)
    if stage_html: build_stage_html(args[0], args[1])
    elif stage: build_stage(args[0], args[1], args[2] if len(args) == 3 else None)
    else: build(args[0], args[1], story)
