// Render a built page to MP4: Playwright drives window.dataStory.render(t) frame by frame at 25 fps,
// screenshots are piped as PNG into FFmpeg (libx264, yuv420p, 1080×1920).
// usage: node web/tools/render_mp4.mjs dist/story.html out.mp4 [--fps 25] [--start <s>] [--end <s>] [--crf 18]
import { chromium } from 'playwright'; import path from 'node:path'; import { spawn } from 'node:child_process';
async function fastPng(page, cdp) {
  const r = await cdp.send('Page.captureScreenshot', { format: 'png', optimizeForSpeed: true, clip: { x: 0, y: 0, width: 1080, height: 1920, scale: 1 } });
  return Buffer.from(r.data, 'base64');
}

const [file, out, ...rest] = process.argv.slice(2);
const opt = (k, d) => { const i = rest.indexOf(k); return i >= 0 ? +rest[i + 1] : d; };
const fps = opt('--fps', 25), crf = opt('--crf', 18);
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
page.on('pageerror', e => console.error('PAGE ERROR', e.message));
await page.goto('file://' + path.resolve(file) + '?t=0');
await page.waitForFunction(() => window.__frameReady === true, null, { timeout: 120000 });
const cdp = await page.context().newCDPSession(page);
const duration = opt('--end', await page.evaluate(() => window.dataStory.duration));
const startF = Math.round(opt('--start', 0) * fps), frames = Math.round(duration * fps);
const ff = spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'image2pipe', '-vcodec', 'png', '-r', String(fps), '-i', '-',
  '-an', '-c:v', 'libx264', '-preset', 'medium', '-crf', String(crf), '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
const t0 = Date.now();
for (let i = startF; i < frames; i++) {
  const t = i / fps;                                  // integer frame index → exact 40 ms boundaries at 25 fps
  await page.evaluate(t => window.dataStory.render(t), t);
  const png = await fastPng(page, cdp);   // lossless PNG, fast encoder
  if (!ff.stdin.write(png)) await new Promise(r => ff.stdin.once('drain', r));
  if (i % 50 === 0) console.log(`frame ${i}/${frames} · ${((Date.now() - t0) / 1000).toFixed(1)}s`);
}
ff.stdin.end(); await new Promise((res, rej) => ff.on('close', c => c ? rej(new Error('ffmpeg exit ' + c)) : res()));
await browser.close(); console.log(`DONE ${out} · ${frames - startF} frames · ${duration}s · ${((Date.now() - t0) / 1000).toFixed(0)}s wall`);
