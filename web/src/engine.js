/*
 * DATA STORY — DATA_STORY_3D_BRIGHT_V1 browser engine (WebGL2 port of motion_renderer.cpp)
 *
 * One fullscreen fragment shader draws BOTH the locked background field and the
 * ray-marched 3D geometry, at master coordinates 1080×1920. Geometry occupies the
 * square master region x∈[0,1080), y∈[650,1730) exactly like the native renderer
 * (which pastes its G×G render at (0,650)). Greek typography is HTML, positioned at
 * the same master pixel anchors as the Python/Pillow compositor.
 *
 * Numeric inputs come ONLY from the scene JSON (window.DATA_STORY_SCENE).
 */
(function () {
  'use strict';

  // ---------- easing / clock (identical to C++ ease and Python ease) ----------
  const clamp01 = (x) => Math.min(1, Math.max(0, x));
  const ease = (x) => 1 - Math.pow(1 - clamp01(x), 3);

  // kind ids match the native renderer: 0 donut, 1 line, 2 ranking, 3 population, 4 before-after, 5 stacked
  const KIND = { donut_parts: 0, line_single: 1, ranking_horizontal: 2, population_ratio_10: 3, before_after_columns: 4, stacked_100: 5 };

  // ---------- GLSL (straight port of motion_renderer.cpp) ----------
  const VERT = `#version 300 es
  in vec2 aPos; void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`;

  const FRAG = `#version 300 es
  precision highp float;
  out vec4 outColor;
  uniform vec2  uRes;          // master canvas size (1080,1920)
  uniform int   uKind;
  uniform float uTime;         // scene-local seconds
  uniform float uProg;         // ease((t-.9)/3.6)
  uniform float uBar[4];       // ranking growth per bar
  uniform float uSel[10];      // population: per-figure selection 0..1
  uniform float uVals[5];      // template numeric values
  uniform int   uIds[4];       // ranking material ids
  uniform float uCuts[3];      // donut cumulative shares (0..1)
  uniform int   uDonutIds[4];  // donut material ids per part
  uniform float uContentAlpha; // global content fade (demo behaviour)
  uniform float uGeomY;        // top of geometry square in master px (650)

  const float TAU = 6.2831853;
  float clampf(float f){ return clamp(f, 0.0, 1.0); }
  float easef(float t){ t = clampf(t); return 1.0 - pow(1.0 - t, 3.0); }

  float sdBox(vec3 p, vec3 c, vec3 b, float r){
    vec3 q = p - c; q = vec3(abs(q.x) - b.x + r, abs(q.y) - b.y + r, abs(q.z) - b.z + r);
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r;
  }
  float sdCapsule(vec3 p, vec3 a, vec3 b, float r){
    vec3 v = b - a; float t = clampf(dot(p - a, v) / max(dot(v, v), 1e-9)); return length(p - a - v * t) - r;
  }

  // returns (distance, material id)
  vec2 scene(vec3 p){
    vec2 s = vec2(100.0, 0.0);
    if (uKind == 0) {
      if (uProg > 0.0001) {
        float radial = sqrt(p.x*p.x + p.z*p.z), qx = abs(radial - 2.7) - 0.57, qy = abs(p.y - 0.58) - 0.38;
        float d = sqrt(max(qx,0.0)*max(qx,0.0) + max(qy,0.0)*max(qy,0.0)) + min(max(qx,qy),0.0) - 0.10;
        float a = mod(atan(p.z, p.x) + 0.7 + TAU, TAU);
        if (uProg < 0.9999) {
          float e = uProg * TAU;
          float ad = a > e ? min(a - e, TAU - a) : -min(a, e - a);
          float cut = radial * sin(clamp(abs(ad), 0.0, 1.5707963)) * (ad < 0.0 ? -1.0 : 1.0);
          d = max(d, cut);
        }
        int id = a < uCuts[0]*TAU ? uDonutIds[0] : (a < uCuts[1]*TAU ? uDonutIds[1] : (a < uCuts[2]*TAU ? uDonutIds[2] : uDonutIds[3]));
        s = vec2(d, float(id));
      }
    } else if (uKind == 1) {
      vec3 nodes[5];
      for (int i = 0; i < 5; i++) nodes[i] = vec3(-3.45 + float(i) * 1.725, uVals[i] * 0.064, 0.0);
      if (uProg > 0.0001) {
        for (int i = 0; i < 4; i++) { float part = clampf(uProg * 4.0 - float(i)); if (part <= 0.0) continue;
          float d = sdCapsule(p, nodes[i], nodes[i] + (nodes[i+1] - nodes[i]) * part, 0.078); if (d < s.x) s = vec2(d, 0.0); }
        for (int i = 0; i < 5; i++) { if (uProg * 4.0 + 0.001 < float(i)) continue;
          float d = length(p - nodes[i]) - (i == 4 ? 0.17 : 0.13); if (d < s.x) s = vec2(d, i == 4 ? 1.0 : 0.0); }
      }
    } else if (uKind == 2) {
      for (int i = 0; i < 4; i++) { if (uBar[i] < 0.001) continue;
        float l = uVals[i] * 0.080 * uBar[i]; float r = min(0.09, l * 0.3);
        float d = sdBox(p, vec3(-3.75 + l/2.0, 5.25 - float(i)*1.42, 0.0), vec3(l/2.0, 0.225, 0.5), r);
        if (d < s.x) s = vec2(d, float(uIds[i])); }
    } else if (uKind == 3) {
      for (int i = 0; i < 10; i++) {
        vec3 q = p - vec3(-3.16 + float(i - (i/5)*5) * 1.58, i < 5 ? 3.15 : 0.55, 0.0);
        float bound = max(abs(q.x) - 0.56, max(abs(q.y - 0.84) - 0.85, abs(q.z) - 0.21));
        if (bound > s.x) continue;
        float d = length(q - vec3(0.0, 1.48, 0.0)) - 0.19;
        d = min(d, sdBox(q, vec3(0.0, 0.87, 0.0), vec3(0.24, 0.36, 0.16), 0.11));
        d = min(d, sdCapsule(q, vec3(-0.30, 1.10, 0.0), vec3(-0.43, 0.57, 0.0), 0.105));
        d = min(d, sdCapsule(q, vec3( 0.30, 1.10, 0.0), vec3( 0.43, 0.57, 0.0), 0.105));
        d = min(d, sdCapsule(q, vec3(-0.135, 0.57, 0.0), vec3(-0.155, 0.10, 0.0), 0.105));
        d = min(d, sdCapsule(q, vec3( 0.135, 0.57, 0.0), vec3( 0.155, 0.10, 0.0), 0.105));
        if (d < s.x) s = vec2(d, float(10 + i));
      }
    } else if (uKind == 4) {
      for (int i = 0; i < 2; i++) {
        float bp = easef((uTime - 0.9 - float(i)*0.55) / 2.2); if (bp < 0.002) continue;
        float h = uVals[i] * 0.075 * bp;
        vec3 q = p - vec3(i == 0 ? -1.9 : 1.9, h/2.0, 0.0);
        q = vec3(q.x*0.966 - q.z*0.259, q.y, q.x*0.259 + q.z*0.966);
        float d = sdBox(q, vec3(0.0), vec3(0.78, h/2.0, 0.64), min(0.105, h*0.3));
        if (d < s.x) s = vec2(d, i == 0 ? 0.0 : 1.0);
      }
    } else if (uKind == 5) {
      for (int row = 0; row < 2; row++) {
        float bp = easef((uTime - 0.9 - float(row)*0.5) / 2.4); if (bp < 0.002) continue;
        float v = uVals[row]; float len1 = 7.0*v*bp, len2 = 7.0*(1.0 - v)*bp; float y = 4.70 - float(row)*2.50;
        float d = sdBox(p, vec3(-3.5 + len1/2.0, y, 0.0), vec3(len1/2.0, 0.40, 0.50), min(0.09, len1*0.3));
        if (d < s.x) s = vec2(d, row == 0 ? 1.0 : 0.0);
        d = sdBox(p, vec3(-3.5 + len1 + len2/2.0, y, 0.0), vec3(len2/2.0, 0.40, 0.50), min(0.09, len2*0.3));
        if (d < s.x) s = vec2(d, 3.0);
      }
    }
    if (uKind == 0 && p.y + 0.10 < s.x) s = vec2(p.y + 0.10, 4.0);
    return s;
  }

  vec3 calcNormal(vec3 p){ float e = 0.004;
    return normalize(vec3(scene(p+vec3(e,0,0)).x - scene(p-vec3(e,0,0)).x,
                          scene(p+vec3(0,e,0)).x - scene(p-vec3(0,e,0)).x,
                          scene(p+vec3(0,0,e)).x - scene(p-vec3(0,0,e)).x)); }

  vec3 materialColor(int id){
    if (id == 0) return vec3(0.022, 0.085, 0.85);   // blue
    if (id == 1) return vec3(0.86, 0.008, 0.075);   // red (Greece / focus)
    if (id == 2) return vec3(0.28, 0.035, 0.72);    // purple
    if (id == 3) return vec3(0.08, 0.16, 0.32);     // steel
    return vec3(0.016, 0.025, 0.054);               // floor
  }

  vec3 shade(vec3 p, vec3 n, int id, vec3 view){
    vec3 material;
    if (id >= 10) { float sel = uSel[id - 10]; material = vec3(0.055, 0.08, 0.145) * (1.0 - sel) + materialColor(1) * sel; }
    else material = materialColor(id);
    vec3 col = material * 0.16;
    vec3 poses[4]  = vec3[4](vec3(-5.0,11.0,9.0), vec3(7.0,9.0,4.0), vec3(0.0,10.0,-5.0), vec3(-1.0,4.0,11.0));
    float powers[4] = float[4](1.35, 1.35, 2.0, 0.65);
    vec3 lights[4] = vec3[4](vec3(0.62,0.75,1.0), vec3(1.0,0.5,0.6), vec3(0.5,0.55,1.0), vec3(1.0));
    for (int i = 0; i < 4; i++) {
      vec3 l = normalize(poses[i] - p); float nd = max(dot(n, l), 0.0); float sp = max(dot(n, normalize(l + view)), 0.0);
      float spec = pow(sp, 60.0) * 0.72 + pow(sp, 12.0) * 0.05;
      col += lights[i] * (material * (nd * 0.58) + vec3(spec)) * powers[i];
    }
    return col;
  }

  bool trace(vec3 o, vec3 d, int steps, out vec3 p, out int id){
    float t = 0.0; vec2 h;
    for (int i = 0; i < 85; i++) { if (i >= steps) break;
      p = o + d * t; h = scene(p); if (h.x < 0.003) { id = int(h.y); return true; }
      t += max(h.x, 0.002); if (t > 60.0) return false; }
    p = o + d * t; h = scene(p); id = int(h.y); return h.x < 0.016;
  }

  vec3 background(vec2 m){ // m = master pixel coords (x right, y down)
    vec3 c = vec3(18.0, 27.0, 55.0);
    c += vec3(14.0,25.0,66.0) * exp(-pow((m.x-100.0)/680.0,2.0) - pow((m.y-1160.0)/550.0,2.0));
    c += vec3(47.0, 9.0,38.0) * exp(-pow((m.x-1120.0)/640.0,2.0) - pow((m.y-1280.0)/760.0,2.0));
    c += vec3(13.0, 8.0,29.0) * exp(-pow((m.x-720.0)/600.0,2.0) - pow((m.y+120.0)/600.0,2.0));
    return clamp(c / 255.0, 0.0, 1.0);
  }

  void main(){
    vec2 m = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);   // master coords, y down
    vec3 bg = background(m);
    vec2 g = vec2(m.x, m.y - uGeomY);                          // geometry square coords 0..1080
    if (g.y < 0.0 || g.y >= 1080.0) { outColor = vec4(bg, 1.0); return; }
    vec3 eye = uKind == 0 ? vec3(0.0,12.0,16.0) : vec3(0.0,7.0,23.0);
    vec3 target = uKind == 0 ? vec3(0.0,0.3,0.0) : vec3(0.0,2.65,0.0);
    float span = uKind == 0 ? 8.9 : 9.4;
    vec3 f = normalize(target - eye), r = normalize(cross(f, vec3(0.0,1.0,0.0))), u = cross(r, f);
    vec3 o = eye + r * ((g.x - 540.0) * span / 1080.0) - u * ((g.y - 540.0) * span / 1080.0);
    vec3 p; int id; bool hit = trace(o, f, 85, p, id);
    vec3 col = vec3(0.0);
    if (hit) {
      vec3 n = calcNormal(p); col = shade(p, n, id, -f);
      if (uKind == 0 && id == 4) {
        vec3 rd = f - n * (2.0 * dot(f, n)); vec3 rp; int ri;
        if (trace(p + n * 0.02, rd, 45, rp, ri) && ri < 4) col = col * 0.7 + shade(rp, calcNormal(rp), ri, -rd) * 0.18;
        float shadow = exp(-(p.x*p.x + p.z*p.z) / 8.0); col *= (1.0 - shadow * 0.55);
      }
    }
    col = pow(clamp(col, 0.0, 1.0), vec3(1.0/2.2));
    float alpha = hit ? 1.0 : 0.0;
    if (uKind == 0) alpha *= clampf((g.y - 110.0) / 150.0) * clampf((1040.0 - g.y) / 230.0);
    alpha *= uContentAlpha;
    outColor = vec4(mix(bg, col, alpha), 1.0);
  }`;

  // ---------- WebGL setup ----------
  function createGL(canvas) {
    const gl = canvas.getContext('webgl2', { antialias: false, preserveDrawingBuffer: true, premultipliedAlpha: false });
    if (!gl) throw new Error('WebGL2 unavailable');
    const compile = (type, src) => { const sh = gl.createShader(type); gl.shaderSource(sh, src); gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh)); return sh; };
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT)); gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog); if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    gl.useProgram(prog);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'aPos'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = {}; ['uRes','uKind','uTime','uProg','uBar','uSel','uVals','uIds','uCuts','uDonutIds','uContentAlpha','uGeomY']
      .forEach(n => U[n] = gl.getUniformLocation(prog, n));
    return { gl, U };
  }

  // ---------- scene → uniforms (single numeric source of truth) ----------
  function uniformsFor(scene, t) {
    const kind = KIND[scene.template_id];
    const inp = scene.inputs;
    const vals = [0,0,0,0,0], ids = [0,2,3,1], cuts = [0.38,0.62,0.80], donutIds = [1,0,2,3], sel = new Array(10).fill(0), bar = [0,0,0,0];
    if (kind === 3) {
      // Exactly `selected_units` figures change material, sequentially, like the demo.
      for (let i = 0; i < 10; i++) sel[i] = i < inp.selected_units ? ease((t - 1.3 - i * 0.4) / 0.35) : 0;
    } else if (kind === 2) {
      inp.values.forEach((v, i) => { vals[i] = v; ids[i] = inp.material_ids[i]; bar[i] = ease((t - 0.9 - i * 0.28) / 2.5); });
    } else if (kind === 1) {
      inp.values.forEach((v, i) => vals[i] = v);
    } else if (kind === 0) {
      let acc = 0; inp.shares.forEach((s, i) => { acc += s; if (i < 3) cuts[i] = acc; donutIds[i] = inp.material_ids[i]; });
    } else if (kind === 4) {
      vals[0] = inp.from_value; vals[1] = inp.to_value;
    } else if (kind === 5) {
      vals[0] = inp.groups[0].share / 100; vals[1] = inp.groups[1].share / 100;
    }
    return { kind, vals, ids, cuts, donutIds, sel, bar, prog: ease((t - 0.9) / 3.6) };
  }

  function drawGeometry(ctx, scene, t, contentAlpha) {
    const { gl, U } = ctx; const u = uniformsFor(scene, t);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.uniform2f(U.uRes, gl.canvas.width, gl.canvas.height);
    gl.uniform1i(U.uKind, u.kind); gl.uniform1f(U.uTime, t); gl.uniform1f(U.uProg, u.prog);
    gl.uniform1fv(U.uBar, u.bar); gl.uniform1fv(U.uSel, u.sel); gl.uniform1fv(U.uVals, u.vals);
    gl.uniform1iv(U.uIds, u.ids); gl.uniform1fv(U.uCuts, u.cuts); gl.uniform1iv(U.uDonutIds, u.donutIds);
    gl.uniform1f(U.uContentAlpha, contentAlpha); gl.uniform1f(U.uGeomY, 650);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  // ---------- typography (master px anchors from render_variants.overlay / build_motion_test.annotations) ----------
  const FONT = '"DataStory DejaVu", "DejaVu Sans", sans-serif';
  const measurer = document.createElement('canvas').getContext('2d');
  function textWidth(s, px, bold) { measurer.font = `${bold ? 700 : 400} ${px}px ${FONT}`; return measurer.measureText(s).width; }
  function el(tag, style, text) { const e = document.createElement(tag); Object.assign(e.style, style); if (text != null) e.textContent = text; return e; }
  // Pillow's default anchor is 'la' (left, ascender): (x,y) is the ascender top. With line-height:normal and
  // DejaVu's hhea metrics (1901/-483) the CSS content box top coincides with the ascender line, so top=y.
  function txt(parent, x, y, s, px, color = '#f6f7ff', bold = true, center = false) {
    if (center) x -= textWidth(s, px, bold) / 2;
    const e = el('div', { position: 'absolute', left: x + 'px', top: y + 'px', font: `${bold ? 700 : 400} ${px}px ${FONT}`, lineHeight: 'normal', color, whiteSpace: 'pre' }, s);
    parent.appendChild(e); return e;
  }
  function rect(parent, x0, y0, x1, y1, fill, radius = 0) { // PIL rectangle: inclusive corners
    parent.appendChild(el('div', { position: 'absolute', left: x0 + 'px', top: y0 + 'px', width: (x1 - x0 + 1) + 'px', height: (y1 - y0 + 1) + 'px', background: fill, borderRadius: radius + 'px' }));
  }
  function hline(parent, x0, x1, y, color = '#354057') { rect(parent, x0, y, x1, y, color); }

  // Flags as inline SVG, replicating the Pillow rectangles (country codes: DE, FR, IT, GR, EU)
  function flag(parent, code, cx, cy) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', 46); svg.setAttribute('height', 30); svg.setAttribute('viewBox', `${cx - 23} ${cy - 15} 46 30`);
    Object.assign(svg.style, { position: 'absolute', left: (cx - 23) + 'px', top: (cy - 15) + 'px' });
    const R = (x0, y0, x1, y1, f) => { const r = document.createElementNS(svg.namespaceURI, 'rect'); r.setAttribute('x', x0); r.setAttribute('y', y0); r.setAttribute('width', x1 - x0 + 1); r.setAttribute('height', y1 - y0 + 1); r.setAttribute('fill', f); svg.appendChild(r); };
    if (code === 'DE') ['#161616', '#d9283d', '#ffc735'].forEach((c, j) => R(cx-22, cy-14+j*9, cx+22, cy-6+j*9, c));
    else if (code === 'FR' || code === 'IT') (code === 'FR' ? ['#2359bb','#fff','#e73347'] : ['#22a269','#fff','#e73347']).forEach((c, j) => R(cx-22+j*15, cy-14, cx-8+j*15, cy+13, c));
    else if (code === 'GR') { R(cx-22, cy-14, cx+22, cy+13, '#fff'); for (let j = 0; j < 9; j += 2) R(cx-22, cy-14+j*3, cx+22, cy-12+j*3, '#2469d7');
      R(cx-22, cy-14, cx-8, cy, '#2469d7'); R(cx-16, cy-14, cx-14, cy, '#fff'); R(cx-22, cy-8, cx-8, cy-6, '#fff'); }
    else { R(cx-22, cy-14, cx+22, cy+14, '#1745b5'); for (let j = 0; j < 12; j++) { const a = j*Math.PI/6, x = cx+9*Math.sin(a), y = cy-9*Math.cos(a);
        const c = document.createElementNS(svg.namespaceURI, 'circle'); c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', 1.3); c.setAttribute('fill', '#ffe252'); svg.appendChild(c); } }
    parent.appendChild(svg);
  }

  function fadeLayer(layer, a, dy = 0) { layer.style.opacity = clamp01(a); if (dy) layer.style.transform = `translateY(${dy}px)`; }
  function layer(parent) { const l = el('div', { position: 'absolute', left: 0, top: 0, width: '1080px', height: '1920px' }); parent.appendChild(l); return l; }

  // Shared chrome: badge, rules, title, subtitle, hero, footer. Returns hero value element (counter target).
  function buildHeader(parent, scene, opts) {
    const c = scene.copy; const h = layer(parent);
    rect(h, 82, 111, 96, 137, '#fa244e', 4); txt(h, 115, 105, 'DATA STORY', 29);
    hline(h, 82, 998, 167);
    [[212, c.title_line_1], [324, c.title_line_2]].forEach(([y, s]) => { let size = 98; while (textWidth(s, size, true) > 920 && size > 84) size--; txt(h, 76, y, s, size); });
    txt(h, 83, 480, c.subtitle, 27, '#a7b3cf', false);
    // Hero anchor is fixed on the FINAL value's width, not the live counter's.
    const hw = textWidth(c.hero_final, 158, true);
    const hero = txt(h, 78, 535, c.hero_final, 158);
    txt(h, 105 + hw, 593, c.hero_label, 38); txt(h, 105 + hw, 649, c.hero_sub, 25, '#a7b3cf', false);
    hline(h, 83, 995, 759); hline(h, 82, 998, 1785);
    // Source footer: wrap onto at most two reserved lines; never crop.
    const px = opts.source_px, gap = Math.round(px * 34 / 23), words = scene.source_footer.split(/\s+/), lines = []; let line = '';
    for (const w of words) { const trial = (line + ' ' + w).trim(); if (textWidth(trial, px, false) > 910) { lines.push(line); line = w; } else line = trial; }
    lines.push(line);
    if (lines.length > 2) throw new Error('Source footer exceeds two lines; shorten the attribution.');
    lines.forEach((l, i) => txt(h, 83, 1804 + i * gap, l, px, '#afbbd3', false));
    return { layer: h, hero };
  }

  // Template-specific annotations. Each returns update(t) to animate label layers.
  const ANNOTATIONS = {
    population_ratio_10(parent, scene) {
      const inp = scene.inputs, c = scene.copy;
      const base = layer(parent); flag(base, inp.country_code, 900, 620);
      const end = layer(parent);
      rect(end, 86, 1532, 101, 1570, '#ff315c', 4); txt(end, 122, 1523, c.legend_selected, 43);
      rect(end, 598, 1532, 613, 1570, '#8fa4c7', 4); txt(end, 634, 1523, c.legend_rest, 43);
      txt(end, 86, 1641, c.legend_note, 30, '#b1bed7', false);
      return (t, hero, opts) => {
        fadeLayer(end, ease((t - 4.1) / 0.5));
        // Publication cover: the KPI shows its final verified value from frame 0 and never resets while figures build.
        if (opts.static_cover) { hero.textContent = c.hero_final; return; }
        let n = 0; for (let i = 0; i < inp.selected_units; i++) if (t >= 1.3 + i * 0.4 + 0.20) n++;
        hero.textContent = (n * 10) + '%';
      };
    }
    // TODO(port): before_after_columns, stacked_100, donut_parts, line_single, ranking_horizontal annotation layers.
  };

  // ---------- page assembly ----------
  function mount(root, scene, options = {}) {
    const opts = Object.assign({ source_px: 30, demo_timing: true, static_cover: false }, options);
    root.style.cssText = 'position:relative;width:1080px;height:1920px;overflow:hidden;background:#121B37;';
    const canvas = el('canvas', { position: 'absolute', left: 0, top: 0, width: '1080px', height: '1920px' });
    canvas.width = 1080; canvas.height = 1920; root.appendChild(canvas);
    const ctx = createGL(canvas);
    const content = layer(root);
    const header = buildHeader(content, scene, opts);
    const ann = ANNOTATIONS[scene.template_id]; if (!ann) throw new Error('No annotation layer ported for ' + scene.template_id);
    const update = ann(content, scene);
    const duration = scene.duration_ms / 1000;

    function render(t) {
      // Demo behaviour (build_motion_test.py): content fades in over 280ms and out over the last 400ms.
      // static_cover=true keeps everything fully visible from frame 0 (publication cover requirement).
      const contentAlpha = opts.static_cover ? (1 - ease((t - (duration - 0.4)) / 0.4)) : ease(t / 0.28) * (1 - ease((t - (duration - 0.4)) / 0.4));
      const headerA = opts.static_cover ? 1 : ease((t - 0.12) / 0.65);
      fadeLayer(header.layer, headerA, Math.round(18 * (1 - headerA)));
      content.style.opacity = contentAlpha;
      update(t, header.hero, opts);
      drawGeometry(ctx, scene, t, contentAlpha);
    }
    return { render, duration, canvas };
  }

  window.DataStoryEngine = { mount, ease, KIND };
})();
