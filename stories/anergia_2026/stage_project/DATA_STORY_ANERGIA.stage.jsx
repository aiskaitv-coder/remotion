// DATA STORY · Ανεργία στην Ελλάδα, Ιούλιος 2026 και θέση στην ΕΕ-27 · 71.08s @ 25 fps
// DATA STORY · DATA_STORY_3D_BRIGHT_V1 · Stage-based animation for Claude Design (export-ready).
//
// Contract: a single <Stage width height duration fps> wraps the scene; every frame is a pure function of
// useTime() (seconds). No wall clock, no CSS keyframes, no Math.random(). The locked engine below already
// renders any timestamp deterministically: render(t) draws the WebGL geometry and lays out the Greek text
// for exactly that t. The Stage drives it; the exporter can seek to any frame.
//
// Stage and useTime come from animations.jsx (Claude Design's starter or the bundled runtime); both satisfy the
// Claude2Video Stage Export Format (type.name 'Stage', first two useState = time, playing; useTime() in seconds).
import React, { useEffect, useRef, useState } from "react";
import { Stage, useTime } from "./animations.jsx";

// ---- locked graphics engine (do not edit: SHA256-locked in the data-story-3d-renderer skill) ----
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
  uniform float uX[5];         // line_single: node x coordinates (proportional time spacing)
  uniform float uScale;        // value→world scale for line/ranking/before-after

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
      for (int i = 0; i < 5; i++) nodes[i] = vec3(uX[i], uVals[i] * uScale, 0.0);
      if (uProg > 0.0001) {
        for (int i = 0; i < 4; i++) { float part = clampf(uProg * 4.0 - float(i)); if (part <= 0.0) continue;
          float d = sdCapsule(p, nodes[i], nodes[i] + (nodes[i+1] - nodes[i]) * part, 0.078); if (d < s.x) s = vec2(d, 0.0); }
        for (int i = 0; i < 5; i++) { if (uProg * 4.0 + 0.001 < float(i)) continue;
          float d = length(p - nodes[i]) - (i == 4 ? 0.17 : 0.13); if (d < s.x) s = vec2(d, i == 4 ? 1.0 : 0.0); }
      }
    } else if (uKind == 2) {
      for (int i = 0; i < 4; i++) { if (uBar[i] < 0.001) continue;
        float l = uVals[i] * uScale * uBar[i]; float r = min(0.09, l * 0.3);
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
        float h = uVals[i] * uScale * bp;
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
    const U = {}; ['uRes','uKind','uTime','uProg','uBar','uSel','uVals','uIds','uCuts','uDonutIds','uContentAlpha','uGeomY','uX','uScale']
      .forEach(n => U[n] = gl.getUniformLocation(prog, n));
    return { gl, U };
  }

  // ---------- scene → uniforms (single numeric source of truth) ----------
  // Line nodes: x spans [-3.45, 3.45]; spacing proportional to the actual time coordinates.
  function lineX(obs) { const t0 = obs[0].time, t1 = obs[obs.length - 1].time;
    return obs.map(o => -3.45 + 6.9 * (t1 === t0 ? 0 : (o.time - t0) / (t1 - t0))); }

  function uniformsFor(scene, t) {
    const kind = KIND[scene.template_id];
    const inp = scene.inputs;
    const vals = [0,0,0,0,0], ids = [0,2,3,1], cuts = [0.38,0.62,0.80], donutIds = [1,0,2,3], sel = new Array(10).fill(0), bar = [0,0,0,0];
    const x = [-3.45,-1.725,0,1.725,3.45]; let scale = 1;
    if (kind === 3) {
      // Exactly `selected_units` figures change material, sequentially, like the demo.
      for (let i = 0; i < 10; i++) sel[i] = i < inp.selected_units ? ease((t - 1.3 - i * 0.4) / 0.35) : 0;
    } else if (kind === 2) {
      scale = inp.value_scale ?? 0.080;
      inp.bars.forEach((b, i) => { vals[i] = b.value; ids[i] = b.material_id; bar[i] = ease((t - 0.9 - i * 0.28) / 2.5); });
    } else if (kind === 1) {
      scale = inp.value_scale ?? 0.064;
      inp.observations.forEach((o, i) => vals[i] = o.value); lineX(inp.observations).forEach((v, i) => x[i] = v);
    } else if (kind === 0) {
      let acc = 0; inp.parts.forEach((p, i) => { acc += p.share / 100; if (i < 3) cuts[i] = acc; donutIds[i] = p.material_id; });
    } else if (kind === 4) {
      scale = inp.value_scale ?? 0.075; vals[0] = inp.from.value; vals[1] = inp.to.value;
    } else if (kind === 5) {
      vals[0] = inp.groups[0].share / 100; vals[1] = inp.groups[1].share / 100;
    }
    return { kind, vals, ids, cuts, donutIds, sel, bar, x, scale, prog: ease((t - 0.9) / 3.6) };
  }

  function drawGeometry(ctx, scene, t, contentAlpha) {
    const { gl, U } = ctx; const u = uniformsFor(scene, t);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.uniform2f(U.uRes, gl.canvas.width, gl.canvas.height);
    gl.uniform1i(U.uKind, u.kind); gl.uniform1f(U.uTime, t); gl.uniform1f(U.uProg, u.prog);
    gl.uniform1fv(U.uBar, u.bar); gl.uniform1fv(U.uSel, u.sel); gl.uniform1fv(U.uVals, u.vals);
    gl.uniform1iv(U.uIds, u.ids); gl.uniform1fv(U.uCuts, u.cuts); gl.uniform1iv(U.uDonutIds, u.donutIds);
    gl.uniform1f(U.uContentAlpha, contentAlpha); gl.uniform1f(U.uGeomY, 650);
    gl.uniform1fv(U.uX, u.x); gl.uniform1f(U.uScale, u.scale);
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
    else if (code === 'ES') { R(cx-22, cy-14, cx+22, cy-8, '#c60b1e'); R(cx-22, cy-7, cx+22, cy+6, '#ffc400'); R(cx-22, cy+7, cx+22, cy+13, '#c60b1e'); }
    else if (code === 'FI') { R(cx-22, cy-14, cx+22, cy+13, '#fff'); R(cx-22, cy-4, cx+22, cy+3, '#1a4fb0'); R(cx-10, cy-14, cx-3, cy+13, '#1a4fb0'); }
    else if (code === 'PL') { R(cx-22, cy-14, cx+22, cy-1, '#fff'); R(cx-22, cy, cx+22, cy+13, '#dc143c'); }
    else if (code === 'PT') { R(cx-22, cy-14, cx-6, cy+13, '#006600'); R(cx-5, cy-14, cx+22, cy+13, '#ff0000'); }
    else if (code === 'CZ') { R(cx-22, cy-14, cx+22, cy-1, '#fff'); R(cx-22, cy, cx+22, cy+13, '#d7141a');
      const p = document.createElementNS(svg.namespaceURI, 'polygon'); p.setAttribute('points', `${cx-22},${cy-14} ${cx},${cy} ${cx-22},${cy+14}`); p.setAttribute('fill', '#11457e'); svg.appendChild(p); }
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
    if (lines.length > 2) throw new Error(`Source footer exceeds two lines at ${px}px in scene ${scene.id}; shorten the attribution: ${scene.source_footer}`);
    lines.forEach((l, i) => txt(h, 83, 1804 + i * gap, l, px, '#afbbd3', false));
    return { layer: h, hero };
  }

  // Orthographic projection of a world point to master px (same camera as the shader; 1190 = 650 + 540).
  function project(kind, v) {
    const eye = kind === 0 ? [0,12,16] : [0,7,23], target = kind === 0 ? [0,.3,0] : [0,2.65,0], span = kind === 0 ? 8.9 : 9.4;
    const sub = (a,b) => [a[0]-b[0],a[1]-b[1],a[2]-b[2]], dot = (a,b) => a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
    const nrm = (a) => { const l = Math.hypot(...a); return [a[0]/l,a[1]/l,a[2]/l]; };
    const cross = (a,b) => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
    const f = nrm(sub(target, eye)), r = nrm(cross(f, [0,1,0])), u = cross(r, f), q = sub(v, eye);
    return [540 + dot(q, r) / span * 1080, 1190 - dot(q, u) / span * 1080];
  }
  // PIL-style line between two points (axis-aligned in practice: grid lines, baselines, ticks).
  function line(parent, x0, y0, x1, y1, color, width = 1) {
    const horizontal = Math.abs(y1 - y0) < Math.abs(x1 - x0);
    if (horizontal) parent.appendChild(el('div', { position:'absolute', left: Math.min(x0,x1)+'px', top: (Math.min(y0,y1) - width/2)+'px', width: Math.abs(x1-x0)+'px', height: width+'px', background: color }));
    else parent.appendChild(el('div', { position:'absolute', left: (Math.min(x0,x1) - width/2)+'px', top: Math.min(y0,y1)+'px', width: width+'px', height: Math.abs(y1-y0)+'px', background: color }));
  }
  // Greek numeric display: decimal comma, dots as thousands separators. Decimals come from the scene inputs
  // (value_decimals, default 0) so the counter and the final label always share one format.
  function fmtNum(v, decimals = 0) {
    const fixed = Math.abs(v).toFixed(decimals); const [int, frac] = fixed.split('.');
    const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return (v < 0 ? '−' : '') + grouped + (frac ? ',' + frac : '');
  }
  const fmt = (v, suffix = '', decimals = 0) => fmtNum(v, decimals) + suffix;

  // Template-specific annotations. Each returns update(t, hero, opts) to animate label layers and the KPI counter.
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
    },
    donut_parts(parent, scene) {
      const inp = scene.inputs, c = scene.copy, items = [];
      let acc = 0;
      inp.parts.forEach((p, i) => {
        const l = layer(parent), x = 84 + (i % 2) * 475, y = 1506 + Math.floor(i / 2) * 111;
        const dec = inp.value_decimals ?? 0;
        rect(l, x, y + 9, x + 12, y + 38, p.label_color, 4); txt(l, x + 30, y, p.label, 27); txt(l, x + 30, y + 39, fmt(p.share, '%', dec), 39, p.label_color);
        items.push({ layer: l, start: acc, share: p.share / 100 }); acc += p.share / 100;
      });
      const hi = items[inp.highlighted_index], hiShare = inp.parts[inp.highlighted_index].share;
      return (t, hero, opts) => {
        const p = ease((t - 0.9) / 3.6);
        items.forEach(it => fadeLayer(it.layer, clamp01((p - it.start) * 8)));
        // The highlighted share counts up while its own arc is being drawn.
        hero.textContent = opts.static_cover ? c.hero_final : fmt(hiShare * clamp01((p - hi.start) / hi.share), '%', inp.value_decimals ?? 0);
      };
    },
    line_single(parent, scene) {
      const inp = scene.inputs, c = scene.copy, obs = inp.observations, n = obs.length, xs = lineX(obs), sc = inp.value_scale ?? 0.064, sfx = inp.value_suffix ?? '', dec = inp.value_decimals ?? 0;
      const grid = layer(parent);
      (inp.gridlines ?? []).forEach(v => { const a = project(1, [-3.45, v * sc, 0]), b = project(1, [3.45, v * sc, 0]); line(grid, a[0], a[1], b[0], b[1], 'rgba(134,152,195,0.255)', 1); });
      const nodes = obs.map((o, i) => { const l = layer(parent); const [x, y] = project(1, [xs[i], o.value * sc, 0]);
        txt(l, x, y - 84, fmt(o.value, sfx, dec), 43, i === n - 1 ? '#ff6386' : '#f6f7ff', true, true);
        // Value appears when the tube actually reaches its point (inverse of the cubic ease over the 4 segments).
        return { layer: l, arrival: i < n - 1 ? 0.9 + 3.6 * (1 - Math.pow(1 - i / (n - 1), 1 / 3)) : 4.5 }; });
      const years = obs.map((o, i) => { const l = layer(parent); const [bx, by] = project(1, [xs[i], 0, 0]);
        line(l, bx, by - 10, bx, by + 6, '#8698bd', 2); txt(l, bx, by + 25, String(o.time), 35, '#f6f7ff', true, true); return l; });
      const summary = layer(parent); txt(summary, 85, 1607, c.summary_line, 53); txt(summary, 85, 1690, c.summary_note, 27, '#a7b3cf', false);
      return (t, hero, opts) => {
        const p = ease((t - 0.9) / 3.6);
        fadeLayer(grid, ease((t - 0.4) / 0.6));
        nodes.forEach(nd => fadeLayer(nd.layer, ease((t - nd.arrival) / 0.35)));
        years.forEach((l, i) => fadeLayer(l, ease((t - 0.4 - i * 0.06) / 0.4)));
        fadeLayer(summary, ease((t - 4.5) / 0.5));
        hero.textContent = opts.static_cover ? c.hero_final : (inp.delta_value >= 0 ? '+' : '−') + fmt(Math.abs(inp.delta_value) * p, inp.delta_suffix ?? '', dec);
      };
    },
    ranking_horizontal(parent, scene) {
      const inp = scene.inputs, c = scene.copy, sc = inp.value_scale ?? 0.080, sfx = inp.value_suffix ?? '', dec = inp.value_decimals ?? 0;
      const items = inp.bars.map((b, i) => { const l = layer(parent); const [, cy] = project(2, [-3.75, 5.25 - i * 1.42, 0]);
        if (b.country_code) { txt(l, 163, cy - 94, b.label, 33); flag(l, b.country_code, 124, cy - 75); } else txt(l, 102, cy - 94, b.label, 33);
        const val = txt(l, 0, 0, '', 44, i === inp.highlighted_index ? '#ff6386' : '#f6f7ff'); return { layer: l, val, b, i }; });
      const end = layer(parent); txt(end, 85, 1668, c.end_note, 27, '#a7b3cf', false);
      return (t, hero, opts) => {
        items.forEach(({ layer: l, val, b, i }) => { const bp = ease((t - 0.9 - i * 0.28) / 2.5);
          const [ex, ey] = project(2, [-3.75 + b.value * sc * bp, 5.25 - i * 1.42, 0]);
          // Counter rides the bar tip; label anchor moves with the geometry, never overshoots.
          val.style.left = (ex + 29) + 'px'; val.style.top = (ey - 30) + 'px'; val.textContent = bp > 0 ? fmt(b.value * bp, sfx, dec) : '';
          fadeLayer(l, ease((t - 0.5 - i * 0.28) / 0.4)); });
        fadeLayer(end, ease((t - 4.3) / 0.5));
        hero.textContent = c.hero_final;
      };
    },
    before_after_columns(parent, scene) {
      const inp = scene.inputs, c = scene.copy, sc = inp.value_scale ?? 0.075, sfx = inp.value_suffix ?? '', dec = inp.value_decimals ?? 0;
      const base = layer(parent); const a = project(4, [-3.15, 0, 0]), b = project(4, [3.15, 0, 0]); line(base, a[0], a[1], b[0], b[1], '#617596', 2);
      const cols = [inp.from, inp.to].map((o, i) => { const l = layer(parent); const x = i === 0 ? -1.9 : 1.9; const [lx] = project(4, [x, 0, 0]);
        const val = txt(l, 0, 0, '', 70); txt(l, lx, 1544, o.time_label, 55, '#f6f7ff', true, true);
        txt(l, lx, 1625, i === 0 ? c.from_caption : c.to_caption, 32, '#b1bed7', true, true); return { layer: l, val, o, x, i }; });
      return (t, hero, opts) => {
        cols.forEach(({ layer: l, val, o, x, i }) => { const bp = ease((t - 0.9 - i * 0.55) / 2.2);
          const [px, py] = project(4, [x, o.value * sc * bp, 0]); const s = bp > 0.001 ? fmt(o.value * bp, sfx, dec) : '';
          val.textContent = s; val.style.left = (px - textWidth(s, 70, true) / 2) + 'px'; val.style.top = (py - 125) + 'px';
          fadeLayer(l, ease((t - 0.45 - i * 0.2) / 0.45)); });
        const d = inp.delta_value;
        hero.textContent = opts.static_cover ? c.hero_final : (d >= 0 ? '+' : '−') + fmt(Math.abs(d) * ease((t - 3.65) / 0.8), inp.delta_suffix ?? '', inp.delta_decimals ?? dec);
      };
    },
    stacked_100(parent, scene) {
      const inp = scene.inputs, c = scene.copy;
      const rows = inp.groups.map((g, row) => { const y = 4.70 - row * 2.50; const [, cy] = project(5, [-3.5, y, 0]);
        const head = layer(parent); flag(head, g.country_code, 139, cy - 109); txt(head, 184, cy - 133, g.label, 36);
        const labels = layer(parent); const s = g.share / 100;
        const [sx, sy] = project(5, [-3.5 + 7 * s / 2, y, 0]), [nx, ny] = project(5, [-3.5 + 7 * s + 7 * (1 - s) / 2, y, 0]);
        const dec = inp.value_decimals ?? 0;
        txt(labels, sx, sy - 26, c.part_label_yes + ' ' + fmt(g.share, '%', dec), 32, '#101b3b', true, true);
        txt(labels, nx, ny - 26, c.part_label_no + ' ' + fmt(100 - g.share, '%', dec), 32, '#101b3b', true, true);
        return { head, labels, row }; });
      const end = layer(parent); txt(end, 85, 1575, c.end_title, 43); txt(end, 85, 1668, c.end_note, 30, '#b1bed7', false);
      return (t, hero) => {
        rows.forEach(({ head, labels, row }) => { fadeLayer(head, ease((t - 0.4 - row * 0.5) / 0.4)); fadeLayer(labels, ease((t - 3.25 - row * 0.5) / 0.4)); });
        fadeLayer(end, ease((t - 4.1) / 0.5));
        hero.textContent = c.hero_final;
      };
    }
  };

  // ---------- page assembly ----------
  function mount(root, scene, options = {}) {
    const opts = Object.assign({ source_px: 30, static_cover: false, cover_hold_ms: 0, fade_in_ms: 280, fade_out_ms: 400 }, options);
    root.style.cssText = 'position:relative;width:1080px;height:1920px;overflow:hidden;background:#121B37;';
    const canvas = el('canvas', { position: 'absolute', left: 0, top: 0, width: '1080px', height: '1920px' });
    canvas.width = 1080; canvas.height = 1920; root.appendChild(canvas);
    const ctx = createGL(canvas);
    const content = layer(root);
    const header = buildHeader(content, scene, opts);
    const ann = ANNOTATIONS[scene.template_id]; if (!ann) throw new Error('No annotation layer ported for ' + scene.template_id);
    const update = ann(content, scene);
    const duration = scene.duration_ms / 1000;

    function render(tScene) {
      // With a static cover, geometry/annotation animation starts only after the cover hold.
      const t = opts.static_cover ? Math.max(0, tScene - opts.cover_hold_ms / 1000) : tScene;
      // Demo behaviour (build_motion_test.py): content fades in over 280ms and out over the last 400ms.
      // static_cover=true keeps everything fully visible from frame 0 (publication cover requirement).
      const fi = opts.fade_in_ms / 1000, fo = opts.fade_out_ms / 1000;
      const fadeOut = fo > 0 ? 1 - ease((tScene - (duration - fo)) / fo) : 1;
      const fadeIn = (opts.static_cover || fi <= 0) ? 1 : ease(tScene / fi);
      const contentAlpha = fadeIn * fadeOut;
      const headerA = opts.static_cover ? 1 : ease((t - 0.12) / 0.65);
      fadeLayer(header.layer, headerA, Math.round(18 * (1 - headerA)));
      content.style.opacity = contentAlpha;
      update(t, header.hero, opts);
      drawGeometry(ctx, scene, t, contentAlpha);
    }
    return { render, duration, canvas, root };
  }


  // ---------- story player: every scene of a production JSON on ONE master clock (seconds) ----------
  // Scene i is visible for start_ms <= T < start_ms + duration_ms. Handoffs are declared on the OUTGOING scene
  // (transition.type 'crossfade' | 'cut', transition.duration_ms). A crossfade keeps the outgoing scene's final
  // frame for the transition length while the incoming scene fades in ON TOP via stage opacity, so no frame is
  // ever empty. The last scene's declared transition fades its content out to the shared background.
  function mountStory(stage, prod, options = {}) {
    const scenes = prod.scenes;
    const total = (prod.total_duration_ms ?? scenes.reduce((m, s) => Math.max(m, s.start_ms + s.duration_ms), 0)) / 1000;
    stage.style.cssText = 'position:relative;width:1080px;height:1920px;overflow:hidden;background:#121B37;' + (options.stage_css || '');
    const tr = (sc) => sc.transition ?? { type: 'crossfade', duration_ms: 350 };
    const players = scenes.map((sc, i) => {
      const prev = scenes[i - 1], last = i === scenes.length - 1;
      const inMs = prev && tr(prev).type !== 'cut' ? tr(prev).duration_ms : 0;
      const root = document.createElement('div'); stage.appendChild(root);            // later scenes stack on top
      const player = mount(root, sc, {
        source_px: options.source_px ?? prod.render_options?.source_px ?? 30,
        static_cover: !!sc.static_cover, cover_hold_ms: sc.cover_hold_ms ?? 0,
        fade_in_ms: 0, fade_out_ms: last && tr(sc).type !== 'cut' ? tr(sc).duration_ms : 0 });
      root.style.position = 'absolute'; root.style.left = '0'; root.style.top = '0';  // mount() resets cssText; scenes must overlap
      root.hidden = true; return { sc, player, root, inMs, tailMs: !last && tr(sc).type !== 'cut' ? tr(sc).duration_ms : 0 };
    });
    function render(T) {
      for (const { sc, player, root, inMs, tailMs } of players) {
        const start = sc.start_ms / 1000, dur = sc.duration_ms / 1000, local = T - start;
        const on = local >= 0 && local < dur + tailMs / 1000;
        root.hidden = !on; if (!on) continue;
        root.style.opacity = inMs > 0 && !sc.static_cover ? ease(local / (inMs / 1000)) : 1;
        player.render(Math.min(local, dur - 0.001));   // tail holds the final frame under the incoming scene
      }
    }
    return { render, duration: total, scenes: scenes.map(s => ({ id: s.id, start_ms: s.start_ms, duration_ms: s.duration_ms })) };
  }

  // Fonts must be resolved before the first layout (hero anchors are measured from the final KPI string).
  function ready() { return document.fonts.load('700 100px "DataStory DejaVu"').then(() => document.fonts.load('400 100px "DataStory DejaVu"')); }

  window.DataStoryEngine = { mount, mountStory, ready, ease, KIND };
})();

// ---- end of locked engine ----

const FONTS_CSS = "/* DejaVu Sans, subset to Latin + Greek (+ Greek Extended, punctuation, arrows, euro). Metrics untouched. */\n@font-face{font-family:\"DataStory DejaVu\";font-weight:400;font-style:normal;src:url(data:font/woff2;base64,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) format(\"woff2\");}\n@font-face{font-family:\"DataStory DejaVu\";font-weight:700;font-style:normal;src:url(data:font/woff2;base64,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) format(\"woff2\");}\n";
const PRODUCTION = {"schema_version":"2.0","design_system":"DATA_STORY_3D_BRIGHT_V1","mode":"publication","topic":"Ανεργία στην Ελλάδα, Ιούλιος 2026 και θέση στην ΕΕ-27","language":"el","research_cutoff":"2026-09-05","canvas":{"width":1080,"height":1920,"fps":25},"editorial":{"approval_status":"approved_2026-09-05 (angle + data, user: 'ναι')","thesis":"Η ανεργία έπεσε στο 7,9% τον Ιούλιο 2026, αλλά η Ελλάδα παραμένει πάνω από τον μέσο όρο της ΕΕ-27, τρίτη υψηλότερη στο ετήσιο 2025, με χαμηλότερη απασχόληση και την υψηλότερη μακροχρόνια ανεργία στα τελευταία πλήρως συγκρίσιμα στοιχεία.","limitations":["Μηνιαία SA εκτιμήσεις αναθεωρούνται","Μακροχρόνια ανεργία: έτος 2024· τιμή 2025 δεν επιβεβαιώθηκε","Τιμή 2024 ετήσιας ανεργίας (10,1%) υπολογισμένη, προς επαλήθευση","Καμία αιτιώδης ερμηνεία","Διάρκεια 67 s: εξαίρεση από το όριο 60 s, δικαιολογημένη από 9 επιβεβαιωμένες μεταβλητές μίας οικογένειας πηγών"],"duration_justification":"9 σκηνές, μία ιδέα ανά σκηνή, όλες οι μεταβλητές ΕΠΙΒΕΒΑΙΩΜΕΝΟ/ΜΕ ΠΕΡΙΟΡΙΣΜΟ, ίδια οικογένεια πηγών (EU-LFS). Εναλλακτικά χωρίζεται σε Μέρος 1 (S01–S05) και Μέρος 2 (S06–S09)."},"narration":{"wpm":145,"expanded_word_count":144,"theoretical_seconds":59.6,"vo_a":"[calm] Επτά κόμμα εννέα τοις εκατό η ανεργία στην Ελλάδα τον Ιούλιο του είκοσι έξι. Στην Ευρωπαϊκή Ένωση, έξι κόμμα ένα. Πέρσι ήταν οκτώ κόμμα εννέα. Μία ποσοστιαία μονάδα κάτω. Τριακόσιες εβδομήντα έξι χιλιάδες πεντακόσιοι οκτώ άνεργοι. Σαράντα πέντε χιλιάδες λιγότεροι. Στα εκατό άτομα δεκαπέντε έως εβδομήντα τεσσάρων, περίπου πενήντα επτά εργάζονται, πέντε είναι άνεργοι, τριάντα οκτώ εκτός εργατικού δυναμικού. Στους νέους, δεκαέξι κόμμα οκτώ τοις εκατό, έναντι δεκαπέντε κόμμα ένα στην Ένωση. Για όλο το είκοσι πέντε, τρίτο υψηλότερο ποσοστό στην Ένωση, πίσω από Ισπανία και Φινλανδία. [warm] Αλλά και η μεγαλύτερη πτώση: μία κόμμα δύο ποσοστιαίες μονάδες σε έναν χρόνο. Στην απασχόληση, εβδομήντα ένα τοις εκατό των είκοσι έως εξήντα τεσσάρων εργάζονται. Στην Ένωση, εβδομήντα έξι. Και το είκοσι τέσσερα, η υψηλότερη μακροχρόνια ανεργία στην Ένωση: πέντε κόμμα τέσσερα τοις εκατό. [pause] Η ανεργία πέφτει. Λύθηκε το πρόβλημα; Γράψε μας τη γνώμη σου στα σχόλια.","vo_b":"Επτά κόμμα εννέα τοις εκατό η ανεργία στην Ελλάδα τον Ιούλιο του είκοσι έξι. Στην Ευρωπαϊκή Ένωση, έξι κόμμα ένα. Πέρσι ήταν οκτώ κόμμα εννέα. Μία ποσοστιαία μονάδα κάτω. Τριακόσιες εβδομήντα έξι χιλιάδες πεντακόσιοι οκτώ άνεργοι. Σαράντα πέντε χιλιάδες λιγότεροι. Στα εκατό άτομα δεκαπέντε έως εβδομήντα τεσσάρων, περίπου πενήντα επτά εργάζονται, πέντε είναι άνεργοι, τριάντα οκτώ εκτός εργατικού δυναμικού. Στους νέους, δεκαέξι κόμμα οκτώ τοις εκατό, έναντι δεκαπέντε κόμμα ένα στην Ένωση. Για όλο το είκοσι πέντε, τρίτο υψηλότερο ποσοστό στην Ένωση, πίσω από Ισπανία και Φινλανδία. Αλλά και η μεγαλύτερη πτώση: μία κόμμα δύο ποσοστιαίες μονάδες σε έναν χρόνο. Στην απασχόληση, εβδομήντα ένα τοις εκατό των είκοσι έως εξήντα τεσσάρων εργάζονται. Στην Ένωση, εβδομήντα έξι. Και το είκοσι τέσσερα, η υψηλότερη μακροχρόνια ανεργία στην Ένωση: πέντε κόμμα τέσσερα τοις εκατό. Η ανεργία πέφτει. Λύθηκε το πρόβλημα; Γράψε μας τη γνώμη σου στα σχόλια.","audio_asset":null,"audio_duration_ms":null,"alignment_status":"NOT_RUN","music":"off","sfx":"none"},"sources":[{"id":"SRC01","organization":"ΕΛΣΤΑΤ","title":"Έρευνα Εργατικού Δυναμικού, μηνιαίες εκτιμήσεις, Ιούλιος 2026","url":"https://www.statistics.gr/documents/20181/c74980f5-58a4-b4e1-b689-2aa5cf610b70","dataset_code":"SJO02 (μηνιαίες εκτιμήσεις ΕΕΔ)","page":"δελτίο τύπου","reference_period":"2026-07","fieldwork_period":"Ιούλιος 2026 (ΕΕΔ, εβδομάδες αναφοράς)","release_date":"2026-08-31","access_date":"2026-09-05","methodology":"EU-LFS/ILO, εποχικά διορθωμένες εκτιμήσεις, 15–74, επανασταθμισμένο δείγμα βάσει Απογραφής 2021","sample":null,"limitation":"Μηνιαία εκτίμηση, αναθεωρήσιμη· ο Ιούνιος 2026 αναθεωρήθηκε σε 8,1%"},{"id":"SRC02","organization":"Eurostat","title":"Euro area unemployment at 6.4% — euro indicators, July 2026","url":"https://ec.europa.eu/eurostat/web/products-euro-indicators/w/3-01092026-bp","dataset_code":"une_rt_m","page":"news release 3-01092026-BP","reference_period":"2026-07","fieldwork_period":null,"release_date":"2026-09-01","access_date":"2026-09-05","methodology":"Εναρμονισμένη μηνιαία ανεργία, SA, ILO","sample":null,"limitation":"Μηνιαίες σειρές αναθεωρούνται με νέα EU-LFS δεδομένα"},{"id":"SRC03","organization":"Eurostat","title":"EU unemployment rate in 2025: 6.0%","url":"https://ec.europa.eu/eurostat/en/web/products-eurostat-news/w/ddn-20260610-3","dataset_code":"une_rt_a","page":"news article DDN-20260610-3","reference_period":"2025","fieldwork_period":null,"release_date":"2026-06-10","access_date":"2026-09-05","methodology":"Ετήσιος μέσος, 15–74, EU-LFS","sample":null,"limitation":"Ετήσια μέτρηση, όχι εναλλάξιμη με μεμονωμένο μήνα"},{"id":"SRC04","organization":"Eurostat","title":"Key figures on Europe — 2026 edition","url":"https://ec.europa.eu/eurostat/documents/15216629/23964567/KS-01-26-035-EN-N.pdf","dataset_code":"une_rt_a","page":"labour market chapter","reference_period":"2024–2025","fieldwork_period":null,"release_date":"2026","access_date":"2026-09-05","methodology":"Ετήσιος μέσος, EU-LFS","sample":null,"limitation":"Η μεταβολή −1,2 π.μ. αναφέρεται από την έκδοση· η τιμή 2024 προκύπτει με υπολογισμό"},{"id":"SRC05","organization":"Eurostat","title":"New lows for EU unemployment in 2024","url":"https://ec.europa.eu/eurostat/web/products-eurostat-news/w/ddn-20250523-1","dataset_code":"une_ltu_a","page":"news article DDN-20250523-1","reference_period":"2024","fieldwork_period":null,"release_date":"2025-05-23","access_date":"2026-09-05","methodology":"Άνεργοι ≥12 μήνες ως % εργατικού δυναμικού, EU-LFS","sample":null,"limitation":"Έτος 2024· νεότερη τιμή 2025 δεν επιβεβαιώθηκε στο audit"},{"id":"SRC06","organization":"Eurostat","title":"EU's employment rate grew above 76% in 2025","url":"https://ec.europa.eu/eurostat/en/web/products-eurostat-news/w/ddn-20260417-1","dataset_code":"lfsi_emp_a","page":"news article DDN-20260417-1","reference_period":"2025","fieldwork_period":null,"release_date":"2026-04-17","access_date":"2026-09-05","methodology":"Απασχολούμενοι ως % πληθυσμού 20–64, EU-LFS","sample":null,"limitation":"Άλλος παρονομαστής από την ανεργία"},{"id":"SRC07","organization":"Eurostat","title":"Metadata, monthly unemployment (une_rt_m ESMS)","url":"https://ec.europa.eu/eurostat/cache/metadata/en/une_rt_m_esms.htm","dataset_code":"une_rt_m","page":"ESMS","reference_period":null,"fieldwork_period":null,"release_date":null,"access_date":"2026-09-05","methodology":"Ορισμοί και αναθεωρήσεις","sample":null,"limitation":null},{"id":"SRC08","organization":"ΕΛΣΤΑΤ","title":"Ημερολόγιο ανακοινώσεων","url":"https://www.statistics.gr/calendar","dataset_code":null,"page":null,"reference_period":null,"fieldwork_period":null,"release_date":null,"access_date":"2026-09-05","methodology":null,"sample":null,"limitation":"Επόμενη μηνιαία ΕΕΔ (Αύγουστος 2026): 30/09/2026"}],"facts":[{"id":"U01","indicator":"Ποσοστό ανεργίας, SA","value":7.9,"unit":"%","denominator":"εργατικό δυναμικό 15–74","geography":"Ελλάδα","reference_period":"2026-07","source_ids":["SRC01"],"status":"ΕΠΙΒΕΒΑΙΩΜΕΝΟ","reported_or_calculated":"reported","formula":null,"input_fact_ids":[],"limitation":"Μηνιαία SA εκτίμηση, αναθεωρήσιμη","display_value":"7,9%"},{"id":"U02","indicator":"Άνεργοι, SA","value":376508,"unit":"άτομα","denominator":null,"geography":"Ελλάδα","reference_period":"2026-07","source_ids":["SRC01"],"status":"ΕΠΙΒΕΒΑΙΩΜΕΝΟ","reported_or_calculated":"reported","formula":null,"input_fact_ids":[],"limitation":null,"display_value":"376.508"},{"id":"U03","indicator":"Απασχολούμενοι, SA","value":4379823,"unit":"άτομα","denominator":null,"geography":"Ελλάδα","reference_period":"2026-07","source_ids":["SRC01"],"status":"ΕΠΙΒΕΒΑΙΩΜΕΝΟ","reported_or_calculated":"reported","formula":null,"input_fact_ids":[],"limitation":null,"display_value":"4.379.823"},{"id":"U04","indicator":"Εκτός εργατικού δυναμικού (κάτω των 75)","value":2951948,"unit":"άτομα","denominator":null,"geography":"Ελλάδα","reference_period":"2026-07","source_ids":["SRC01"],"status":"ΕΠΙΒΕΒΑΙΩΜΕΝΟ","reported_or_calculated":"reported","formula":null,"input_fact_ids":[],"limitation":"Δεν είναι άνεργοι· χωριστή κατηγορία","display_value":"2.951.948"},{"id":"U05a","indicator":"Ποσοστό ανεργίας, SA, έναν χρόνο πριν","value":8.9,"unit":"%","denominator":"εργατικό δυναμικό 15–74","geography":"Ελλάδα","reference_period":"2025-07","source_ids":["SRC01"],"status":"ΕΠΙΒΕΒΑΙΩΜΕΝΟ","reported_or_calculated":"reported","formula":null,"input_fact_ids":[],"limitation":null,"display_value":"8,9%"},{"id":"U05","indicator":"Ετήσια μεταβολή ποσοστού ανεργίας","value":-1,"unit":"ποσοστιαίες μονάδες","denominator":null,"geography":"Ελλάδα","reference_period":"2025-07 → 2026-07","source_ids":["SRC01"],"status":"ΕΠΙΒΕΒΑΙΩΜΕΝΟ","reported_or_calculated":"reported","formula":"7,9 − 8,9","input_fact_ids":["U01","U05a"],"limitation":null,"display_value":"−1,0"},{"id":"U06","indicator":"Ετήσια μεταβολή αριθμού ανέργων","value":-45192,"unit":"άτομα","denominator":null,"geography":"Ελλάδα","reference_period":"2025-07 → 2026-07","source_ids":["SRC01"],"status":"ΕΠΙΒΕΒΑΙΩΜΕΝΟ","reported_or_calculated":"reported","formula":null,"input_fact_ids":[],"limitation":"−10,7%","display_value":"−45.192"},{"id":"U06b","indicator":"Ετήσια μεταβολή αριθμού ανέργων, σχετική","value":-10.7,"unit":"%","denominator":"άνεργοι Ιουλίου 2025","geography":"Ελλάδα","reference_period":"2025-07 → 2026-07","source_ids":["SRC01"],"status":"ΕΠΙΒΕΒΑΙΩΜΕΝΟ","reported_or_calculated":"reported","formula":null,"input_fact_ids":[],"limitation":"Σχετική μεταβολή (τοις εκατό), όχι ποσοστιαίες μονάδες","display_value":"−10,7%"},{"id":"U07","indicator":"Ετήσια μεταβολή απασχολουμένων","value":41365,"unit":"άτομα","denominator":null,"geography":"Ελλάδα","reference_period":"2025-07 → 2026-07","source_ids":["SRC01"],"status":"ΕΠΙΒΕΒΑΙΩΜΕΝΟ","reported_or_calculated":"reported","formula":null,"input_fact_ids":[],"limitation":"+1,0%","display_value":"+41.365"},{"id":"U08","indicator":"Ποσοστό ανεργίας ΕΕ-27, SA","value":6.1,"unit":"%","denominator":"εργατικό δυναμικό 15–74","geography":"ΕΕ-27","reference_period":"2026-07","source_ids":["SRC02"],"status":"ΕΠΙΒΕΒΑΙΩΜΕΝΟ","reported_or_calculated":"reported","formula":null,"input_fact_ids":[],"limitation":null,"display_value":"6,1%"},{"id":"U10","indicator":"Ανεργία νέων <25","value":16.8,"unit":"%","denominator":"εργατικό δυναμικό 15–24","geography":"Ελλάδα","reference_period":"2026-07","source_ids":["SRC02"],"status":"ΕΠΙΒΕΒΑΙΩΜΕΝΟ","reported_or_calculated":"reported","formula":null,"input_fact_ids":[],"limitation":"Παρονομαστής το νεανικό εργατικό δυναμικό, όχι όλοι οι νέοι","display_value":"16,8%"},{"id":"U11","indicator":"Ανεργία νέων <25 ΕΕ-27","value":15.1,"unit":"%","denominator":"εργατικό δυναμικό 15–24","geography":"ΕΕ-27","reference_period":"2026-07","source_ids":["SRC02"],"status":"ΕΠΙΒΕΒΑΙΩΜΕΝΟ","reported_or_calculated":"reported","formula":null,"input_fact_ids":[],"limitation":null,"display_value":"15,1%"},{"id":"U12","indicator":"Ετήσιο ποσοστό ανεργίας","value":8.9,"unit":"%","denominator":"εργατικό δυναμικό 15–74","geography":"Ελλάδα","reference_period":"2025","source_ids":["SRC03"],"status":"ΕΠΙΒΕΒΑΙΩΜΕΝΟ","reported_or_calculated":"reported","formula":null,"input_fact_ids":[],"limitation":null,"display_value":"8,9%"},{"id":"U13","indicator":"Ετήσιο ποσοστό ανεργίας ΕΕ-27","value":6,"unit":"%","denominator":"εργατικό δυναμικό 15–74","geography":"ΕΕ-27","reference_period":"2025","source_ids":["SRC03"],"status":"ΕΠΙΒΕΒΑΙΩΜΕΝΟ","reported_or_calculated":"reported","formula":null,"input_fact_ids":[],"limitation":null,"display_value":"6,0%"},{"id":"U14","indicator":"Θέση Ελλάδας στην ετήσια ανεργία ΕΕ-27","value":3,"unit":"κατάταξη (υψηλότερη=1)","denominator":"27 κράτη-μέλη","geography":"ΕΕ-27","reference_period":"2025","source_ids":["SRC03"],"status":"ΕΠΙΒΕΒΑΙΩΜΕΝΟ","reported_or_calculated":"reported","formula":null,"input_fact_ids":[],"limitation":"Ισπανία 10,5 · Φινλανδία 9,7 · Ελλάδα 8,9","display_value":"3η"},{"id":"U15","indicator":"Ετήσιο ποσοστό ανεργίας Ισπανίας","value":10.5,"unit":"%","denominator":"εργατικό δυναμικό 15–74","geography":"Ισπανία","reference_period":"2025","source_ids":["SRC03"],"status":"ΕΠΙΒΕΒΑΙΩΜΕΝΟ","reported_or_calculated":"reported","formula":null,"input_fact_ids":[],"limitation":null,"display_value":"10,5%"},{"id":"U15b","indicator":"Ετήσιο ποσοστό ανεργίας Φινλανδίας","value":9.7,"unit":"%","denominator":"εργατικό δυναμικό 15–74","geography":"Φινλανδία","reference_period":"2025","source_ids":["SRC03"],"status":"ΕΠΙΒΕΒΑΙΩΜΕΝΟ","reported_or_calculated":"reported","formula":null,"input_fact_ids":[],"limitation":null,"display_value":"9,7%"},{"id":"U16","indicator":"Χαμηλότερο ετήσιο ποσοστό ΕΕ-27 (Τσεχία)","value":2.8,"unit":"%","denominator":"εργατικό δυναμικό 15–74","geography":"Τσεχία","reference_period":"2025","source_ids":["SRC03"],"status":"ΕΠΙΒΕΒΑΙΩΜΕΝΟ","reported_or_calculated":"reported","formula":null,"input_fact_ids":[],"limitation":"Πολωνία, Μάλτα 3,1","display_value":"2,8%"},{"id":"U17","indicator":"Μεταβολή ετήσιας ανεργίας 2024→2025","value":-1.2,"unit":"ποσοστιαίες μονάδες","denominator":null,"geography":"Ελλάδα","reference_period":"2024 → 2025","source_ids":["SRC04"],"status":"ΕΠΙΒΕΒΑΙΩΜΕΝΟ","reported_or_calculated":"reported","formula":null,"input_fact_ids":[],"limitation":"Μεγαλύτερη πτώση μεταξύ κρατών-μελών κατά την έκδοση","display_value":"−1,2"},{"id":"U18","indicator":"Μακροχρόνια ανεργία (≥12 μήνες)","value":5.4,"unit":"%","denominator":"εργατικό δυναμικό","geography":"Ελλάδα","reference_period":"2024","source_ids":["SRC05"],"status":"ΕΠΙΒΕΒΑΙΩΜΕΝΟ ΜΕ ΠΕΡΙΟΡΙΣΜΟ","reported_or_calculated":"reported","formula":null,"input_fact_ids":[],"limitation":"Έτος 2024· δεν παρουσιάζεται ως τρέχουσα τιμή","display_value":"5,4%"},{"id":"U19","indicator":"Θέση Ελλάδας στη μακροχρόνια ανεργία ΕΕ-27","value":1,"unit":"κατάταξη (υψηλότερη=1)","denominator":"27 κράτη-μέλη","geography":"ΕΕ-27","reference_period":"2024","source_ids":["SRC05"],"status":"ΕΠΙΒΕΒΑΙΩΜΕΝΟ ΜΕ ΠΕΡΙΟΡΙΣΜΟ","reported_or_calculated":"reported","formula":null,"input_fact_ids":[],"limitation":"Ισχύει για το 2024","display_value":"υψηλότερη"},{"id":"U20","indicator":"Ποσοστό απασχόλησης 20–64","value":71,"unit":"%","denominator":"πληθυσμός 20–64","geography":"Ελλάδα","reference_period":"2025","source_ids":["SRC06"],"status":"ΕΠΙΒΕΒΑΙΩΜΕΝΟ","reported_or_calculated":"reported","formula":null,"input_fact_ids":[],"limitation":null,"display_value":"71,0%"},{"id":"U21","indicator":"Ποσοστό απασχόλησης 20–64 ΕΕ-27","value":76.1,"unit":"%","denominator":"πληθυσμός 20–64","geography":"ΕΕ-27","reference_period":"2025","source_ids":["SRC06"],"status":"ΕΠΙΒΕΒΑΙΩΜΕΝΟ","reported_or_calculated":"reported","formula":null,"input_fact_ids":[],"limitation":null,"display_value":"76,1%"},{"id":"C01","indicator":"Άνεργοι Ιούλιος 2025, SA","value":421700,"unit":"άτομα","denominator":null,"geography":"Ελλάδα","reference_period":"2025-07","source_ids":["SRC01"],"status":"ΕΠΙΒΕΒΑΙΩΜΕΝΟ","reported_or_calculated":"calculated","formula":"376.508 − (−45.192) = 421.700","input_fact_ids":["U02","U06"],"limitation":"Υπολογισμός DATA STORY βάσει ΕΛΣΤΑΤ","display_value":"421.700"},{"id":"C02","indicator":"Πληθυσμός 15–74 (απασχολούμενοι + άνεργοι + εκτός)","value":7708279,"unit":"άτομα","denominator":null,"geography":"Ελλάδα","reference_period":"2026-07","source_ids":["SRC01"],"status":"ΕΠΙΒΕΒΑΙΩΜΕΝΟ","reported_or_calculated":"calculated","formula":"4.379.823 + 376.508 + 2.951.948","input_fact_ids":["U03","U02","U04"],"limitation":"Υπολογισμός DATA STORY βάσει ΕΛΣΤΑΤ","display_value":"7.708.279"},{"id":"C03","indicator":"Μερίδιο απασχολουμένων στον πληθυσμό 15–74","value":56.8,"unit":"%","denominator":"πληθυσμός 15–74 (C02)","geography":"Ελλάδα","reference_period":"2026-07","source_ids":["SRC01"],"status":"ΕΠΙΒΕΒΑΙΩΜΕΝΟ","reported_or_calculated":"calculated","formula":"4.379.823 ÷ 7.708.279 × 100 = 56,82","input_fact_ids":["U03","C02"],"limitation":"Υπολογισμός DATA STORY βάσει ΕΛΣΤΑΤ","display_value":"56,8%"},{"id":"C04","indicator":"Μερίδιο ανέργων στον πληθυσμό 15–74","value":4.9,"unit":"%","denominator":"πληθυσμός 15–74 (C02)","geography":"Ελλάδα","reference_period":"2026-07","source_ids":["SRC01"],"status":"ΕΠΙΒΕΒΑΙΩΜΕΝΟ","reported_or_calculated":"calculated","formula":"376.508 ÷ 7.708.279 × 100 = 4,88","input_fact_ids":["U02","C02"],"limitation":"Διαφέρει από το ποσοστό ανεργίας (παρονομαστής πληθυσμός, όχι εργατικό δυναμικό)","display_value":"4,9%"},{"id":"C05","indicator":"Μερίδιο εκτός εργατικού δυναμικού στον πληθυσμό 15–74","value":38.3,"unit":"%","denominator":"πληθυσμός 15–74 (C02)","geography":"Ελλάδα","reference_period":"2026-07","source_ids":["SRC01"],"status":"ΕΠΙΒΕΒΑΙΩΜΕΝΟ","reported_or_calculated":"calculated","formula":"2.951.948 ÷ 7.708.279 × 100 = 38,30","input_fact_ids":["U04","C02"],"limitation":"56,8 + 4,9 + 38,3 = 100,0","display_value":"38,3%"},{"id":"C06","indicator":"Ετήσιο ποσοστό ανεργίας 2024","value":10.1,"unit":"%","denominator":"εργατικό δυναμικό 15–74","geography":"Ελλάδα","reference_period":"2024","source_ids":["SRC03","SRC04"],"status":"ΕΠΙΒΕΒΑΙΩΜΕΝΟ ΜΕ ΠΕΡΙΟΡΙΣΜΟ","reported_or_calculated":"calculated","formula":"8,9 + 1,2 = 10,1","input_fact_ids":["U12","U17"],"limitation":"Υπολογισμός DATA STORY βάσει Eurostat· να επαληθευτεί έναντι une_rt_a 2024 πριν τη δημοσίευση","display_value":"10,1%"},{"id":"C07","indicator":"Διαφορά Ελλάδας από ΕΕ-27, Ιούλιος 2026","value":1.8,"unit":"ποσοστιαίες μονάδες","denominator":null,"geography":"Ελλάδα/ΕΕ-27","reference_period":"2026-07","source_ids":["SRC01","SRC02"],"status":"ΕΠΙΒΕΒΑΙΩΜΕΝΟ","reported_or_calculated":"calculated","formula":"7,9 − 6,1","input_fact_ids":["U01","U08"],"limitation":"Υπολογισμός DATA STORY βάσει ΕΛΣΤΑΤ και Eurostat","display_value":"+1,8"}],"scenes":[{"id":"S01","role":"cover","template_id":"ranking_horizontal","start_ms":0,"duration_ms":9920,"static_cover":true,"cover_hold_ms":800,"transition":{"type":"crossfade","duration_ms":400},"copy":{"title_line_1":"Η ΑΝΕΡΓΙΑ","title_line_2":"ΣΤΟ 7,9%","subtitle":"ΠΟΣΟΣΤΟ ΑΝΕΡΓΙΑΣ 15–74, ΙΟΥΛΙΟΣ 2026","hero_final":"7,9%","hero_label":"ΕΛΛΑΔΑ","hero_sub":"ΙΟΥΛΙΟΣ 2026 · ΕΕ-27: 6,1%","end_note":"ΙΔΙΟΣ ΜΗΝΑΣ, ΙΔΙΟΣ ΟΡΙΣΜΟΣ (ILO), ΕΠΟΧΙΚΑ ΔΙΟΡΘΩΜΕΝΑ"},"inputs":{"bars":[{"fact_id":"U01","label":"ΕΛΛΑΔΑ","country_code":"GR","value":7.9,"material_id":1},{"fact_id":"U08","label":"ΕΕ-27","country_code":"EU","value":6.1,"material_id":0}],"highlighted_index":0,"value_suffix":"%","value_decimals":1,"value_scale":0.55},"source_footer":"ΠΗΓΗ: ΕΛΣΤΑΤ ΕΕΔ · EUROSTAT une_rt_m · ΔΕΔΟΜΕΝΑ: ΙΟΥΛΙΟΣ 2026 · ΔΗΜΟΣΙΕΥΣΗ 31/08 & 01/09/2026","data_ids":["U01","U08","C07"],"source_ids":["SRC01","SRC02"],"voiceover_clean":"Επτά κόμμα εννέα τοις εκατό η ανεργία στην Ελλάδα τον Ιούλιο του είκοσι έξι. Στην Ευρωπαϊκή Ένωση, έξι κόμμα ένα.","voiceover_tagged":"[calm] Επτά κόμμα εννέα τοις εκατό η ανεργία στην Ελλάδα τον Ιούλιο του είκοσι έξι. Στην Ευρωπαϊκή Ένωση, έξι κόμμα ένα.","words":20},{"id":"S02","role":"chart","template_id":"before_after_columns","start_ms":9920,"duration_ms":6400,"static_cover":false,"cover_hold_ms":0,"transition":{"type":"crossfade","duration_ms":400},"copy":{"title_line_1":"ΕΝΑΝ ΧΡΟΝΟ","title_line_2":"ΠΡΙΝ","subtitle":"ΠΟΣΟΣΤΟ ΑΝΕΡΓΙΑΣ, ΙΟΥΛΙΟΣ 2025 → ΙΟΥΛΙΟΣ 2026","hero_final":"−1,0","hero_label":"ΜΟΝΑΔΑ","hero_sub":"ΠΟΣΟΣΤΙΑΙΑ, ΣΕ 12 ΜΗΝΕΣ","from_caption":"ΙΟΥΛΙΟΣ 2025","to_caption":"ΙΟΥΛΙΟΣ 2026"},"inputs":{"from":{"fact_id":"U05a","time_label":"2025","value":8.9},"to":{"fact_id":"U01","time_label":"2026","value":7.9},"delta_fact_id":"U05","delta_value":-1,"value_suffix":"%","value_decimals":1,"value_scale":0.55},"source_footer":"ΠΗΓΗ: ΕΛΣΤΑΤ ΕΕΔ · ΔΕΔΟΜΕΝΑ: ΙΟΥΛΙΟΣ 2025 ΚΑΙ ΙΟΥΛΙΟΣ 2026 · ΔΗΜΟΣΙΕΥΣΗ 31/08/2026","data_ids":["U05a","U01","U05"],"source_ids":["SRC01"],"voiceover_clean":"Πέρσι ήταν οκτώ κόμμα εννέα. Μία ποσοστιαία μονάδα κάτω.","voiceover_tagged":"Πέρσι ήταν οκτώ κόμμα εννέα. Μία ποσοστιαία μονάδα κάτω.","words":9},{"id":"S03","role":"chart","template_id":"before_after_columns","start_ms":16320,"duration_ms":6400,"static_cover":false,"cover_hold_ms":0,"transition":{"type":"crossfade","duration_ms":400},"copy":{"title_line_1":"376.508","title_line_2":"ΑΝΕΡΓΟΙ","subtitle":"ΑΡΙΘΜΟΣ ΑΝΕΡΓΩΝ, ΙΟΥΛΙΟΣ 2025 → ΙΟΥΛΙΟΣ 2026","hero_final":"−10,7%","hero_label":"ΑΝΕΡΓΟΙ","hero_sub":"−45.192 ΑΤΟΜΑ","from_caption":"ΙΟΥΛΙΟΣ 2025","to_caption":"ΙΟΥΛΙΟΣ 2026"},"inputs":{"from":{"fact_id":"C01","time_label":"2025","value":421700},"to":{"fact_id":"U02","time_label":"2026","value":376508},"delta_fact_id":"U06b","delta_kind":"relative","delta_value":-10.7,"delta_suffix":"%","delta_decimals":1,"value_suffix":"","value_decimals":0,"value_scale":0.0000116},"source_footer":"ΠΗΓΗ: ΕΛΣΤΑΤ ΕΕΔ · ΔΕΔΟΜΕΝΑ: ΙΟΥΛΙΟΣ 2026 · 2025: ΥΠΟΛΟΓΙΣΜΟΣ DATA STORY ΑΠΟ ΤΗ ΜΕΤΑΒΟΛΗ","data_ids":["C01","U02","U06","U06b"],"source_ids":["SRC01"],"voiceover_clean":"Τριακόσιες εβδομήντα έξι χιλιάδες πεντακόσιοι οκτώ άνεργοι. Σαράντα πέντε χιλιάδες λιγότεροι.","voiceover_tagged":"Τριακόσιες εβδομήντα έξι χιλιάδες πεντακόσιοι οκτώ άνεργοι. Σαράντα πέντε χιλιάδες λιγότεροι.","words":11},{"id":"S04","role":"chart","template_id":"donut_parts","start_ms":22720,"duration_ms":8680,"static_cover":false,"cover_hold_ms":0,"transition":{"type":"crossfade","duration_ms":400},"copy":{"title_line_1":"100 ΑΤΟΜΑ","title_line_2":"15–74 ΕΤΩΝ","subtitle":"ΚΑΤΑΝΟΜΗ ΠΛΗΘΥΣΜΟΥ 15–74, ΙΟΥΛΙΟΣ 2026","hero_final":"4,9%","hero_label":"ΑΝΕΡΓΟΙ","hero_sub":"ΤΟΥ ΠΛΗΘΥΣΜΟΥ 15–74"},"inputs":{"parts":[{"fact_id":"C03","label":"ΑΠΑΣΧΟΛΟΥΜΕΝΟΙ","share":56.8,"material_id":0,"label_color":"#7895ff"},{"fact_id":"C04","label":"ΑΝΕΡΓΟΙ","share":4.9,"material_id":1,"label_color":"#ff315c"},{"fact_id":"C05","label":"ΕΚΤΟΣ ΕΡΓ. ΔΥΝΑΜΙΚΟΥ","share":38.3,"material_id":3,"label_color":"#95b0d4"}],"highlighted_index":1,"value_decimals":1},"source_footer":"ΠΗΓΗ: ΕΛΣΤΑΤ ΕΕΔ · ΔΕΔΟΜΕΝΑ: ΙΟΥΛΙΟΣ 2026 · ΜΕΡΙΔΙΑ: ΥΠΟΛΟΓΙΣΜΟΣ DATA STORY ΒΑΣΕΙ ΕΛΣΤΑΤ","data_ids":["C03","C04","C05","C02"],"source_ids":["SRC01"],"voiceover_clean":"Στα εκατό άτομα δεκαπέντε έως εβδομήντα τεσσάρων, περίπου πενήντα επτά εργάζονται, πέντε είναι άνεργοι, τριάντα οκτώ εκτός εργατικού δυναμικού.","voiceover_tagged":"Στα εκατό άτομα δεκαπέντε έως εβδομήντα τεσσάρων, περίπου πενήντα επτά εργάζονται, πέντε είναι άνεργοι, τριάντα οκτώ εκτός εργατικού δυναμικού.","words":19},{"id":"S05","role":"chart","template_id":"ranking_horizontal","start_ms":31400,"duration_ms":6400,"static_cover":false,"cover_hold_ms":0,"transition":{"type":"crossfade","duration_ms":400},"copy":{"title_line_1":"ΝΕΟΙ","title_line_2":"ΚΑΤΩ ΤΩΝ 25","subtitle":"ΑΝΕΡΓΙΑ 15–24, ΙΟΥΛΙΟΣ 2026","hero_final":"16,8%","hero_label":"ΕΛΛΑΔΑ","hero_sub":"ΕΕ-27: 15,1%","end_note":"% ΤΟΥ ΕΡΓΑΤΙΚΟΥ ΔΥΝΑΜΙΚΟΥ 15–24, ΟΧΙ ΟΛΩΝ ΤΩΝ ΝΕΩΝ"},"inputs":{"bars":[{"fact_id":"U10","label":"ΕΛΛΑΔΑ","country_code":"GR","value":16.8,"material_id":1},{"fact_id":"U11","label":"ΕΕ-27","country_code":"EU","value":15.1,"material_id":0}],"highlighted_index":0,"value_suffix":"%","value_decimals":1,"value_scale":0.3},"source_footer":"ΠΗΓΗ: EUROSTAT une_rt_m · ΔΕΔΟΜΕΝΑ: ΙΟΥΛΙΟΣ 2026 (ΕΠΟΧΙΚΑ ΔΙΟΡΘΩΜΕΝΑ) · ΔΗΜΟΣΙΕΥΣΗ 01/09/2026","data_ids":["U10","U11"],"source_ids":["SRC02"],"voiceover_clean":"Στους νέους, δεκαέξι κόμμα οκτώ τοις εκατό, έναντι δεκαπέντε κόμμα ένα στην Ένωση.","voiceover_tagged":"Στους νέους, δεκαέξι κόμμα οκτώ τοις εκατό, έναντι δεκαπέντε κόμμα ένα στην Ένωση.","words":13},{"id":"S06","role":"chart","template_id":"ranking_horizontal","start_ms":37800,"duration_ms":7040,"static_cover":false,"cover_hold_ms":0,"transition":{"type":"crossfade","duration_ms":400},"copy":{"title_line_1":"ΤΡΙΤΗ","title_line_2":"ΥΨΗΛΟΤΕΡΗ","subtitle":"ΕΤΗΣΙΟ ΠΟΣΟΣΤΟ ΑΝΕΡΓΙΑΣ 2025, ΕΕ-27","hero_final":"8,9%","hero_label":"ΕΛΛΑΔΑ","hero_sub":"ΕΤΟΣ 2025 · ΕΕ-27: 6,0%","end_note":"ΕΤΗΣΙΟΣ ΜΕΣΟΣ 2025, ΚΟΙΝΟΣ ΟΡΙΣΜΟΣ EU-LFS"},"inputs":{"bars":[{"fact_id":"U15","label":"ΙΣΠΑΝΙΑ","country_code":"ES","value":10.5,"material_id":2},{"fact_id":"U15b","label":"ΦΙΝΛΑΝΔΙΑ","country_code":"FI","value":9.7,"material_id":3},{"fact_id":"U12","label":"ΕΛΛΑΔΑ","country_code":"GR","value":8.9,"material_id":1},{"fact_id":"U13","label":"ΕΕ-27","country_code":"EU","value":6,"material_id":0}],"highlighted_index":2,"value_suffix":"%","value_decimals":1,"value_scale":0.55},"source_footer":"ΠΗΓΗ: EUROSTAT une_rt_a · ΔΕΔΟΜΕΝΑ: ΕΤΟΣ 2025 · ΔΗΜΟΣΙΕΥΣΗ 10/06/2026","data_ids":["U15","U15b","U12","U13","U14"],"source_ids":["SRC03"],"voiceover_clean":"Για όλο το είκοσι πέντε, τρίτο υψηλότερο ποσοστό στην Ένωση, πίσω από Ισπανία και Φινλανδία.","voiceover_tagged":"Για όλο το είκοσι πέντε, τρίτο υψηλότερο ποσοστό στην Ένωση, πίσω από Ισπανία και Φινλανδία.","words":15},{"id":"S07","role":"chart","template_id":"before_after_columns","start_ms":44840,"duration_ms":6400,"static_cover":false,"cover_hold_ms":0,"transition":{"type":"crossfade","duration_ms":400},"copy":{"title_line_1":"Η ΜΕΓΑΛΥΤΕΡΗ","title_line_2":"ΠΤΩΣΗ ΣΤΗΝ ΕΕ","subtitle":"ΕΤΗΣΙΟ ΠΟΣΟΣΤΟ ΑΝΕΡΓΙΑΣ, 2024 → 2025","hero_final":"−1,2","hero_label":"ΜΟΝΑΔΕΣ","hero_sub":"ΠΟΣΟΣΤΙΑΙΕΣ, 2024 → 2025","from_caption":"ΕΤΟΣ 2024","to_caption":"ΕΤΟΣ 2025"},"inputs":{"from":{"fact_id":"C06","time_label":"2024","value":10.1},"to":{"fact_id":"U12","time_label":"2025","value":8.9},"delta_fact_id":"U17","delta_value":-1.2,"value_suffix":"%","value_decimals":1,"value_scale":0.48},"source_footer":"ΠΗΓΗ: EUROSTAT · KEY FIGURES ON EUROPE 2026 · une_rt_a · ΔΕΔΟΜΕΝΑ: 2024 ΚΑΙ 2025","data_ids":["C06","U12","U17"],"source_ids":["SRC03","SRC04"],"voiceover_clean":"Αλλά και η μεγαλύτερη πτώση: μία κόμμα δύο ποσοστιαίες μονάδες σε έναν χρόνο.","voiceover_tagged":"[warm] Αλλά και η μεγαλύτερη πτώση: μία κόμμα δύο ποσοστιαίες μονάδες σε έναν χρόνο.","words":13},{"id":"S08","role":"chart","template_id":"ranking_horizontal","start_ms":51240,"duration_ms":7440,"static_cover":false,"cover_hold_ms":0,"transition":{"type":"crossfade","duration_ms":400},"copy":{"title_line_1":"ΑΠΑΣΧΟΛΗΣΗ","title_line_2":"20–64 ΕΤΩΝ","subtitle":"ΑΠΑΣΧΟΛΟΥΜΕΝΟΙ ΩΣ % ΤΟΥ ΠΛΗΘΥΣΜΟΥ 20–64, 2025","hero_final":"71,0%","hero_label":"ΕΛΛΑΔΑ","hero_sub":"ΕΕ-27: 76,1%","end_note":"ΑΛΛΟΣ ΠΑΡΟΝΟΜΑΣΤΗΣ ΑΠΟ ΤΟ ΠΟΣΟΣΤΟ ΑΝΕΡΓΙΑΣ"},"inputs":{"bars":[{"fact_id":"U21","label":"ΕΕ-27","country_code":"EU","value":76.1,"material_id":0},{"fact_id":"U20","label":"ΕΛΛΑΔΑ","country_code":"GR","value":71,"material_id":1}],"highlighted_index":1,"value_suffix":"%","value_decimals":1,"value_scale":0.08},"source_footer":"ΠΗΓΗ: EUROSTAT lfsi_emp_a · ΔΕΔΟΜΕΝΑ: ΕΤΟΣ 2025 · ΔΗΜΟΣΙΕΥΣΗ 17/04/2026","data_ids":["U21","U20"],"source_ids":["SRC06"],"voiceover_clean":"Στην απασχόληση, εβδομήντα ένα τοις εκατό των είκοσι έως εξήντα τεσσάρων εργάζονται. Στην Ένωση, εβδομήντα έξι.","voiceover_tagged":"Στην απασχόληση, εβδομήντα ένα τοις εκατό των είκοσι έως εξήντα τεσσάρων εργάζονται. Στην Ένωση, εβδομήντα έξι.","words":16},{"id":"S09","role":"outro","template_id":"ranking_horizontal","start_ms":58680,"duration_ms":12400,"static_cover":false,"cover_hold_ms":0,"transition":{"type":"crossfade","duration_ms":400},"copy":{"title_line_1":"ΜΑΚΡΟΧΡΟΝΙΑ","title_line_2":"ΑΝΕΡΓΙΑ","subtitle":"ΑΝΕΡΓΟΙ 12+ ΜΗΝΕΣ ΩΣ % ΤΟΥ ΕΡΓ. ΔΥΝΑΜΙΚΟΥ, ΕΤΟΣ 2024","hero_final":"5,4%","hero_label":"ΕΛΛΑΔΑ","hero_sub":"ΕΤΟΣ ΔΕΔΟΜΕΝΩΝ 2024","end_note":"Η ΥΨΗΛΟΤΕΡΗ ΣΤΗΝ ΕΕ-27 ΤΟ 2024 · ΓΡΑΨΕ ΜΑΣ ΤΗ ΓΝΩΜΗ ΣΟΥ"},"inputs":{"bars":[{"fact_id":"U18","label":"ΕΛΛΑΔΑ","country_code":"GR","value":5.4,"material_id":1}],"highlighted_index":0,"value_suffix":"%","value_decimals":1,"value_scale":0.55},"source_footer":"ΠΗΓΗ: EUROSTAT une_ltu_a · ΕΤΟΣ ΔΕΔΟΜΕΝΩΝ: 2024 · ΔΗΜΟΣΙΕΥΣΗ 23/05/2025","data_ids":["U18","U19"],"source_ids":["SRC05"],"voiceover_clean":"Και το είκοσι τέσσερα, η υψηλότερη μακροχρόνια ανεργία στην Ένωση: πέντε κόμμα τέσσερα τοις εκατό. Η ανεργία πέφτει. Λύθηκε το πρόβλημα; Γράψε μας τη γνώμη σου στα σχόλια.","voiceover_tagged":"Και το είκοσι τέσσερα, η υψηλότερη μακροχρόνια ανεργία στην Ένωση: πέντε κόμμα τέσσερα τοις εκατό. [pause] Η ανεργία πέφτει. Λύθηκε το πρόβλημα; Γράψε μας τη γνώμη σου στα σχόλια.","words":28}],"total_duration_ms":71080,"render_options":{"source_px":30},"assets":{"engine":"web/src/engine.js v1.1 (DATA_STORY_3D_BRIGHT_V1 browser port)","fonts":"DejaVu Sans Bold/Regular subset (embedded)","flags":"DE FR IT GR EU ES FI CZ PL PT","availability":"available in repo aiskaitv-coder/remotion, branch claude/data-story-reels-shorts-2spn51"},"visual_review":{"version":"v1","preview_status":"complete","asset_paths":["stories/anergia_2026/review/cover_frame0.png","stories/anergia_2026/review/scene_01_S01_*.png","stories/anergia_2026/review/scene_02_S02_*.png","stories/anergia_2026/review/scene_03_S03_*.png","stories/anergia_2026/review/scene_04_S04_*.png","stories/anergia_2026/review/scene_05_S05_*.png","stories/anergia_2026/review/scene_06_S06_*.png","stories/anergia_2026/review/scene_07_S07_*.png","stories/anergia_2026/review/scene_08_S08_*.png","stories/anergia_2026/review/scene_09_S09_*.png","stories/anergia_2026/review/contact_sheet.png"],"scene_timestamps":[{"id":"S01","settled_at_ms":9220},{"id":"S02","settled_at_ms":15620},{"id":"S03","settled_at_ms":22020},{"id":"S04","settled_at_ms":30700},{"id":"S05","settled_at_ms":37100},{"id":"S06","settled_at_ms":44140},{"id":"S07","settled_at_ms":50540},{"id":"S08","settled_at_ms":57980},{"id":"S09","settled_at_ms":70380}],"renderer_version":"engine 1.1","data_version":"anergia_2026 v1","approval_status":"approved_2026-09-05 (user: 'ναι εγκρινω')","approved_version":"v1"},"execution":{"specification_status":"specification_complete","preview_status":"complete","render_status":"in_progress","visual_qa_status":"approved","blockers":["C06 (10,1% έτος 2024) προς επαλήθευση στο une_rt_a","U18/U19 έτος 2024· 2025 προς επαλήθευση στο une_ltu_a"]}};

const WIDTH = PRODUCTION.canvas.width, HEIGHT = PRODUCTION.canvas.height, FPS = PRODUCTION.canvas.fps;
const DURATION = PRODUCTION.total_duration_ms / 1000;

let fontsInjected = false;
function injectFonts() {
  if (fontsInjected || typeof document === "undefined") return;
  const style = document.createElement("style"); style.setAttribute("data-datastory-fonts", "1");
  style.textContent = FONTS_CSS; document.head.appendChild(style); fontsInjected = true;
}

function DataStoryTimeline() {
  const t = useTime();                          // seconds on the Stage playhead
  const host = useRef(null);
  const player = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {                             // mount the locked engine once, after the fonts resolve
    injectFonts();
    let cancelled = false;
    window.DataStoryEngine.ready().then(() => {
      if (cancelled || !host.current) return;
      player.current = window.DataStoryEngine.mountStory(host.current, PRODUCTION);
      setReady(true);
    });
    return () => { cancelled = true; if (host.current) host.current.innerHTML = ""; player.current = null; };
  }, []);

  useEffect(() => {                             // one deterministic frame per time value
    if (!ready || !player.current) return;
    const clamped = Math.min(Math.max(t, 0), DURATION - 1 / FPS);
    player.current.render(clamped);
  }, [t, ready]);

  return <div ref={host} style={{ width: WIDTH, height: HEIGHT, position: "relative", overflow: "hidden", background: "#121B37" }} />;
}

export default function DataStoryAnergia() {
  // Fixed duration and fps from the production JSON; autoplay with no user interaction.
  return (
    <Stage width={WIDTH} height={HEIGHT} duration={DURATION} fps={FPS} autoPlay loop={false}>
      <DataStoryTimeline />
    </Stage>
  );
}
