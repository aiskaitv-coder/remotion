// Capture one 1080×1920 frame of a built scene at time t (seconds) with headless Chromium (SwiftShader WebGL2).
// usage: NODE_PATH=/opt/node22/lib/node_modules node web/tools/screenshot.mjs dist/scene.html 6 out.png [extra query]
import { chromium } from 'playwright'; import path from 'node:path'; import fs from 'node:fs';
async function fastPng(page, cdp) {
  const r = await cdp.send('Page.captureScreenshot', { format: 'png', optimizeForSpeed: true, clip: { x: 0, y: 0, width: 1080, height: 1920, scale: 1 } });
  return Buffer.from(r.data, 'base64');
}

const [file, t, out, extra = ''] = process.argv.slice(2);
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
page.on('pageerror', e => { console.error('PAGE ERROR', e.message); });
page.on('console', m => { if (m.type() === 'error') console.error('CONSOLE', m.text()); });
await page.goto('file://' + path.resolve(file) + `?t=${t}${extra}`);
await page.waitForFunction(() => window.__frameReady === true || window.__pageError, null, { timeout: 120000 });
const pageError = await page.evaluate(() => window.__pageError); if (pageError) { console.error('PAGE ERROR:', pageError); await browser.close(); process.exit(2); }
const cdp = await page.context().newCDPSession(page); fs.writeFileSync(out, await fastPng(page, cdp));
await browser.close(); console.log('saved', out);
