// Capture several master-clock timestamps of a built page in one Chromium session.
// usage: node web/tools/stills.mjs dist/story.html out_dir t1,t2,t3[...]   (seconds; names frame_<t>.png)
import { chromium } from 'playwright'; import path from 'node:path'; import fs from 'node:fs';
async function fastPng(page, cdp) {
  const r = await cdp.send('Page.captureScreenshot', { format: 'png', optimizeForSpeed: true, clip: { x: 0, y: 0, width: 1080, height: 1920, scale: 1 } });
  return Buffer.from(r.data, 'base64');
}

const [file, outDir, list] = process.argv.slice(2); fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
page.on('pageerror', e => console.error('PAGE ERROR', e.message));
await page.goto('file://' + path.resolve(file) + '?t=0');
await page.waitForFunction(() => window.__frameReady === true || window.__pageError, null, { timeout: 120000 });
const pageError = await page.evaluate(() => window.__pageError); if (pageError) { console.error('PAGE ERROR:', pageError); await browser.close(); process.exit(2); }
const cdp = await page.context().newCDPSession(page);
for (const t of list.split(',').map(Number)) {
  await page.evaluate(t => window.dataStory.render(t), t);
  const out = path.join(outDir, `frame_${t.toFixed(2)}.png`);
  fs.writeFileSync(out, await fastPng(page, cdp)); console.log('saved', out);
}
await browser.close();
