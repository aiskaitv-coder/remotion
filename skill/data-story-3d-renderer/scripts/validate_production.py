#!/usr/bin/env python3
"""Deterministic pre-build checks for a DATA STORY production JSON (story) or a single scene JSON.
    python3 scripts/validate_production.py production.json [--publication]
Exit code 0 = PASS. Every failure is printed with the scene id. Checks the things a renderer
cannot judge for you: supported templates, sums, unit counts, contiguous timeline, sources."""
import json, sys

SUPPORTED = {'population_ratio_10', 'before_after_columns', 'stacked_100', 'donut_parts', 'line_single', 'ranking_horizontal'}
PLANNED = {'hero_kpi', 'waffle_100', 'line_dual', 'timeline', 'diverging_bars', 'waterfall'}
DEMO_FOOTER = 'ΠΗΓΗ: — · ΔΟΚΙΜΑΣΤΙΚΑ ΣΤΟΙΧΕΙΑ'
COPY_REQUIRED = {
    '*': ['title_line_1', 'title_line_2', 'subtitle', 'hero_final', 'hero_label', 'hero_sub'],
    'population_ratio_10': ['legend_selected', 'legend_rest', 'legend_note'],
    'line_single': ['summary_line', 'summary_note'], 'ranking_horizontal': ['end_note'],
    'before_after_columns': ['from_caption', 'to_caption'],
    'stacked_100': ['end_title', 'end_note', 'part_label_yes', 'part_label_no'], 'donut_parts': []}

def footer_lines(text, px=30, maxw=910):
    """Wrap like the engine does; needs DejaVu Sans metrics (fontTools + system font). Returns None if unavailable."""
    try:
        from fontTools.ttLib import TTFont
        f = footer_lines._font = getattr(footer_lines, '_font', None) or TTFont('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf')
        cmap, hmtx, upm = f.getBestCmap(), f['hmtx'], f['head'].unitsPerEm
        width = lambda t: sum(hmtx[cmap.get(ord(c), cmap[ord('?')])][0] for c in t) / upm * px
    except Exception: return None
    out, line = [], ''
    for w in text.split():
        trial = (line + ' ' + w).strip()
        if width(trial) > maxw: out.append(line); line = w
        else: line = trial
    out.append(line); return out

def text_width(text, px, bold=False):
    """DejaVu Sans advance width in master px (fontTools + system font); None if unavailable."""
    try:
        from fontTools.ttLib import TTFont
        key = '_bold' if bold else '_reg'
        f = getattr(text_width, key, None)
        if f is None:
            f = TTFont('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'); setattr(text_width, key, f)
        cmap, hmtx, upm = f.getBestCmap(), f['hmtx'], f['head'].unitsPerEm
        return sum(hmtx[cmap.get(ord(c), cmap[ord('?')])][0] for c in text) / upm * px
    except Exception: return None

def layout_checks(sid, copy, errs):
    """Reproduce the engine's fixed anchors: title ≤920 px at ≥84 px; hero row (hero 158 px + 27 px gap + label/sub) must end ≤998 px."""
    for k in ('title_line_1', 'title_line_2'):
        t = copy.get(k, ''); w = text_width(t, 98, True)
        if w is None: return
        size = 98
        while text_width(t, size, True) > 920 and size > 84: size -= 1
        if text_width(t, size, True) > 920: errs.append(f'{sid}: copy.{k} {t!r} does not fit 920 px even at 84 px — shorten')
    hw = text_width(copy.get('hero_final', ''), 158, True)
    for k, px, bold in (('hero_label', 38, True), ('hero_sub', 25, False)):
        w = text_width(copy.get(k, ''), px, bold)
        if hw is not None and w is not None and 105 + hw + w > 998:
            errs.append(f'{sid}: copy.{k} {copy.get(k)!r} overflows the right margin by {int(105 + hw + w - 998)} px next to hero {copy.get("hero_final")!r} — shorten')

def check_scene(s, publication, errs):
    sid = s.get('id', '?'); t = s.get('template_id'); inp = s.get('inputs', {}); copy = s.get('copy', {})
    if t in PLANNED: errs.append(f'{sid}: template {t} is PLANNED, not implemented — choose a supported form'); return
    if t not in SUPPORTED: errs.append(f'{sid}: unknown template_id {t!r}'); return
    for k in COPY_REQUIRED['*'] + COPY_REQUIRED[t]:
        if not copy.get(k): errs.append(f'{sid}: copy.{k} missing')
    layout_checks(sid, copy, errs)
    for k in ('title_line_1', 'title_line_2'):
        if copy.get(k) and len(copy[k]) > 16 and text_width('x', 10, True) is None: errs.append(f'{sid}: copy.{k} {copy[k]!r} is long (>16 chars); rewrite shorter rather than letting it shrink below 84 px')
    if not s.get('source_footer'): errs.append(f'{sid}: source_footer missing')
    elif publication and s['source_footer'].strip() == DEMO_FOOTER: errs.append(f'{sid}: demo source footer is not allowed in publication mode')
    if s.get('source_footer'):
        fl = footer_lines(s['source_footer'])
        if fl is not None and len(fl) > 2: errs.append(f'{sid}: source_footer needs {len(fl)} lines at 30 px (max 2) — shorten wording: {s["source_footer"]}')
    if publication and not s['source_footer'].startswith(('ΠΗΓΗ', 'ΠΗΓΕΣ')): errs.append(f'{sid}: source_footer must start with ΠΗΓΗ: or ΠΗΓΕΣ:')
    if not isinstance(s.get('duration_ms'), int) or s['duration_ms'] <= 0: errs.append(f'{sid}: duration_ms must be a positive integer (ms)')
    if inp.get('value_decimals', 0) not in (0, 1, 2): errs.append(f'{sid}: value_decimals must be 0, 1 or 2')
    if t == 'population_ratio_10':
        if inp.get('total_units') != 10: errs.append(f'{sid}: total_units must be 10')
        su = inp.get('selected_units')
        if not isinstance(su, int) or not 0 <= su <= 10: errs.append(f'{sid}: selected_units must be an integer 0–10 (exact tenths only; 73% needs waffle_100 or a bar/donut)')
        if not inp.get('country_code'): errs.append(f'{sid}: country_code missing')
    elif t == 'donut_parts':
        parts = inp.get('parts', [])
        if not 2 <= len(parts) <= 4: errs.append(f'{sid}: donut needs 2–4 parts (demonstrated layout: 4)')
        total = round(sum(p.get('share', 0) for p in parts), 6)
        if total != 100: errs.append(f'{sid}: donut shares sum to {total}, not 100 — normalize only via an explicit, documented calculation')
        if not 0 <= inp.get('highlighted_index', -1) < len(parts): errs.append(f'{sid}: highlighted_index out of range')
        for p in parts:
            if p.get('material_id') not in (0, 1, 2, 3): errs.append(f'{sid}: part {p.get("label")} material_id must be 0–3')
    elif t == 'stacked_100':
        g = inp.get('groups', [])
        if len(g) != 2: errs.append(f'{sid}: stacked_100 demonstrated layout takes exactly 2 groups')
        for x in g:
            if not 0 <= x.get('share', -1) <= 100: errs.append(f'{sid}: group {x.get("label")} share must be 0–100')
    elif t == 'line_single':
        obs = inp.get('observations', [])
        if not 2 <= len(obs) <= 5: errs.append(f'{sid}: line_single demonstrated layout takes 2–5 observations (more needs a layout extension)')
        times = [o.get('time') for o in obs]
        if times != sorted(times) or len(set(times)) != len(times): errs.append(f'{sid}: observations must be strictly increasing in time')
        if 'delta_value' in inp and obs and round(obs[-1]['value'] - obs[0]['value'], 6) != round(inp['delta_value'], 6):
            errs.append(f'{sid}: delta_value {inp["delta_value"]} ≠ last−first ({obs[-1]["value"]}−{obs[0]["value"]})')
    elif t == 'ranking_horizontal':
        bars = inp.get('bars', [])
        if not 1 <= len(bars) <= 4: errs.append(f'{sid}: ranking layout takes 1–4 bars (a single bar is a dated hero comparison with the label carrying the baseline)')
        vals = [b.get('value') for b in bars]
        if vals != sorted(vals, reverse=True): errs.append(f'{sid}: bars must be sorted descending (title promises a ranking)')
        for b in bars:
            if b.get('material_id') not in (0, 1, 2, 3): errs.append(f'{sid}: bar {b.get("label")} material_id must be 0–3')
            if b.get('country_code') not in (None, 'DE', 'FR', 'IT', 'GR', 'EU', 'ES', 'FI', 'CZ', 'PL', 'PT'): errs.append(f'{sid}: bar {b.get("label")} country_code {b.get("country_code")!r} has no flag in the locked set (null = no flag)')
    elif t == 'before_after_columns':
        f, to = inp.get('from', {}), inp.get('to', {})
        for k in ('time_label', 'value'):
            if k not in f or k not in to: errs.append(f'{sid}: from/to need time_label and value')
        if 'value' in f and 'value' in to:
            if inp.get('delta_kind') == 'relative':   # relative change in %, allowed when both values are counts or amounts
                exp = (to['value'] - f['value']) / f['value'] * 100 if f['value'] else float('nan')
                if abs(exp - inp.get('delta_value', float('nan'))) > 0.05: errs.append(f'{sid}: relative delta_value {inp.get("delta_value")} ≠ (to−from)/from×100 = {exp:.2f}')
                if not inp.get('delta_suffix'): errs.append(f'{sid}: a relative delta must carry delta_suffix "%" so it is never read as points')
            elif round(to['value'] - f['value'], 6) != round(inp.get('delta_value', float('nan')), 6):
                errs.append(f'{sid}: delta_value must equal to.value − from.value (percentage points, not percent)')

def main():
    args = sys.argv[1:]; publication = '--publication' in args; path = [a for a in args if a != '--publication'][0]
    data = json.load(open(path, encoding='utf-8')); errs = []
    if 'scenes' in data:
        if data.get('mode') == 'publication': publication = True
        scenes = data['scenes']
        if not scenes: errs.append('no scenes')
        if scenes and not scenes[0].get('static_cover'): errs.append('scene 1 must be a static cover (static_cover: true, cover_hold_ms 600–1000)')
        if scenes and not 600 <= scenes[0].get('cover_hold_ms', 0) <= 1000: errs.append('scene 1 cover_hold_ms should be 600–1000 ms')
        t = 0
        for s in scenes:
            if s.get('start_ms') != t: errs.append(f'{s.get("id")}: start_ms {s.get("start_ms")} ≠ previous end {t} (scenes must be contiguous)')
            t = s.get('start_ms', t) + s.get('duration_ms', 0)
            tr = s.get('transition') or {}
            if tr.get('type') not in ('crossfade', 'cut'): errs.append(f'{s.get("id")}: transition.type must be crossfade or cut')
            if tr.get('type') == 'crossfade' and not 280 <= tr.get('duration_ms', 0) <= 450: errs.append(f'{s.get("id")}: crossfade duration must be 280–450 ms')
            if s.get('duration_ms', 0) % 40: errs.append(f'{s.get("id")}: duration_ms {s.get("duration_ms")} is not a multiple of 40 ms (25 fps frame boundary)')
            check_scene(s, publication, errs)
        if data.get('total_duration_ms') not in (None, t): errs.append(f'total_duration_ms {data.get("total_duration_ms")} ≠ sum of scenes {t}')
        if t and not 40000 <= t <= 60000: print(f'NOTE: total {t/1000:.1f}s is outside the 40–60 s target range (allowed up to 75 s with justification)')
    else:
        check_scene(data, publication, errs)
    if errs: print('FAIL'); print('\n'.join(' - ' + e for e in errs)); sys.exit(1)
    print('PASS', f'({len(data.get("scenes", [data]))} scene(s), {"publication" if publication else "demo"} mode)')

if __name__ == '__main__': main()
