// Verify the Claude2Video Stage Export Format the way the exporter does: readyMarker, #root mount, fiber walk to the
// Stage fiber, numeric props, hook layout (time, playing), pause + seek through the hook queue, canvas div, capture.
import { chromium } from 'playwright'; import fs from 'node:fs'; import path from 'node:path';
const file = process.argv[2]; const times = (process.argv[3] || '0,30.70,70.38').split(',').map(Number);
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
page.on('pageerror', e => console.error('PAGE ERROR', e.message));
await page.goto('file://' + path.resolve(file));
await page.waitForFunction(() => typeof window.Stage === 'function' && typeof window.useTime === 'function', null, { timeout: 60000 });
console.log('readyMarker: window.Stage/useTime are functions');
await page.waitForFunction(() => document.querySelector('#root') && document.querySelector('#root').children.length > 0);
console.log('#root mounted with children');
const walk = `(() => {
  const root = document.querySelector('#root'); const key = Object.keys(root).find(k => k.startsWith('__reactContainer$'));
  let fiber = root[key]; const stack = [fiber]; const found = [];
  while (stack.length) { const f = stack.pop(); if (!f) continue;
    if (typeof f.type === 'function' && (f.type.name === 'Stage' || f.type.displayName === 'Stage')) found.push(f);
    if (f.child) stack.push(f.child); if (f.sibling) stack.push(f.sibling); }
  return found; })()`;
const info = await page.evaluate(`(() => { const f = ${walk}; if (f.length !== 1) return { count: f.length };
  const s = f[0]; const h1 = s.memoizedState, h2 = h1 && h1.next;
  return { count: f.length, props: { width: s.memoizedProps.width, height: s.memoizedProps.height, duration: s.memoizedProps.duration },
           hook1: typeof h1.memoizedState, hook2: typeof h2.memoizedState, canvasDiv: (() => { const d = s.child && s.child.stateNode ? s.child.stateNode : null; let el = s.child; while (el && !(el.stateNode instanceof HTMLElement)) el = el.child; return el ? el.stateNode.getAttribute('style') : null; })() }; })()`);
console.log('Stage fiber:', JSON.stringify(info));
if (info.count !== 1 || info.hook1 !== 'number' || info.hook2 !== 'boolean') { console.error('CONTRACT FAIL'); process.exit(2); }
await page.waitForFunction(() => document.fonts.status === 'loaded' && document.querySelectorAll('canvas').length >= 1, null, { timeout: 60000 });
const cdp = await page.context().newCDPSession(page); fs.mkdirSync('test/stage/out', { recursive: true });
for (const t of times) {
  // exporter-style: dispatch through the hook queues — pause (2nd hook) then seek (1st hook)
  await page.evaluate(`(() => { const s = ${walk}[0]; s.memoizedState.next.queue.dispatch(false); s.memoizedState.queue.dispatch(${t}); })()`);
  await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
  const r = await cdp.send('Page.captureScreenshot', { format: 'png', optimizeForSpeed: true, clip: { x: 0, y: 0, width: 1080, height: 1920, scale: 1 } });
  fs.writeFileSync(`test/stage/out/contract_${t.toFixed(2)}.png`, Buffer.from(r.data, 'base64')); console.log('captured via hook queue', t);
}
await browser.close();
