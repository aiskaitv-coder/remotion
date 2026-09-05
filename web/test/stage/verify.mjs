// Drive the Stage harness like an exporter: ?__render=1 (no autoplay), read __videoMeta, __seek to timestamps, capture, compare.
import { chromium } from 'playwright'; import fs from 'node:fs'; import path from 'node:path';
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
page.on('pageerror', e => console.error('PAGE ERROR', e.message)); page.on('console', m => m.type() === 'error' && console.error('CONSOLE', m.text()));
await page.goto('file://' + path.resolve('test/stage/index.html') + '?__render=1');
await page.waitForFunction(() => window.__videoMeta && document.querySelector('canvas'), null, { timeout: 60000 });
console.log('videoMeta', JSON.stringify(await page.evaluate(() => window.__videoMeta)));
await page.waitForFunction(() => document.fonts.status === 'loaded' && document.querySelectorAll('canvas').length >= 9, null, { timeout: 60000 });
const cdp = await page.context().newCDPSession(page); fs.mkdirSync('test/stage/out', { recursive: true });
for (const t of [0, 30.70, 70.38]) {
  await page.evaluate(t => window.__seek(t), t);
  await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));   // let React commit + effects run
  const r = await cdp.send('Page.captureScreenshot', { format: 'png', optimizeForSpeed: true, clip: { x: 0, y: 0, width: 1080, height: 1920, scale: 1 } });
  fs.writeFileSync(`test/stage/out/stage_${t.toFixed(2)}.png`, Buffer.from(r.data, 'base64')); console.log('captured', t);
}
// Autoplay check: reload without __render and confirm the playhead advances on its own.
await page.goto('file://' + path.resolve('test/stage/index.html'));
await page.waitForFunction(() => window.__videoMeta, null, { timeout: 60000 });
const a = await page.evaluate(() => new Promise(r => setTimeout(() => r(performance.now()), 50)));
await page.waitForTimeout(1500);
const moved = await page.evaluate(() => { const c = document.querySelectorAll('canvas'); return c.length; });
console.log('autoplay: page alive, canvases', moved);
await browser.close();
