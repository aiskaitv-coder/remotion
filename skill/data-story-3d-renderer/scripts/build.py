#!/usr/bin/env python3
"""Deterministic builder for DATA_STORY_3D_BRIGHT_V1 pages. No dependencies beyond Python 3.

    python3 scripts/build.py --story production.json out.html   # multi-scene story player (timeline)
    python3 scripts/build.py scene.json out.html                 # one scene

The graphics are NOT generated here. The engine (shader, materials, camera, typography anchors,
fonts, motion vocabulary) is a locked asset. This script only substitutes the JSON into the
template and refuses to run if any locked asset differs from references/LOCKED_SHA256.txt,
so a build can never carry a modified look."""
import hashlib, json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
ASSETS = os.path.join(ROOT, 'assets'); LOCK = os.path.join(ROOT, 'references', 'LOCKED_SHA256.txt')

def verify_locked():
    expected = dict(line.split()[::-1] for line in open(LOCK) if line.strip())
    bad = []
    for name, digest in expected.items():
        actual = hashlib.sha256(open(os.path.join(ASSETS, name), 'rb').read()).hexdigest()
        if actual != digest: bad.append(f'{name}: expected {digest[:12]}…, found {actual[:12]}…')
    if bad:
        sys.exit('LOCKED ASSET MODIFIED — refusing to build. The design system is frozen; restore the '
                 'original files or obtain a new signed release.\n  ' + '\n  '.join(bad))

def build(json_path, out_path, story):
    verify_locked()
    data = json.load(open(json_path, encoding='utf-8'))
    tpl = open(os.path.join(ASSETS, 'story.template.html' if story else 'page.template.html'), encoding='utf-8').read()
    title = f"DATA STORY · {data.get('topic', 'story')}" if story else f"DATA STORY · {data['template_id']} · {data['id']}"
    # separators=(',', ':') reproduces JavaScript's JSON.stringify so builds from build.mjs and build.py are byte-identical
    payload = json.dumps(data, ensure_ascii=False, separators=(',', ':'))
    html = (tpl.replace('{{TITLE}}', title, 1)
               .replace('{{FONTS_CSS}}', open(os.path.join(ASSETS, 'fonts.css'), encoding='utf-8').read(), 1)
               .replace('{{ENGINE_JS}}', open(os.path.join(ASSETS, 'engine.js'), encoding='utf-8').read(), 1)
               .replace('{{PRODUCTION_JSON}}' if story else '{{SCENE_JSON}}', payload, 1))
    os.makedirs(os.path.dirname(os.path.abspath(out_path)), exist_ok=True)
    open(out_path, 'w', encoding='utf-8').write(html)
    print(f'built {out_path} ({os.path.getsize(out_path)//1024} KB) · sha256 {hashlib.sha256(html.encode()).hexdigest()[:16]}')

if __name__ == '__main__':
    args = sys.argv[1:]; story = '--story' in args; args = [a for a in args if a != '--story']
    if len(args) != 2: sys.exit(__doc__)
    build(args[0], args[1], story)
