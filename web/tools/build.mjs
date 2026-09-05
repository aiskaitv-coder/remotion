// Bundle engine + fonts + one scene JSON into a single self-contained HTML file.
// usage: node web/tools/build.mjs web/scenes/<scene>.json [out.html]
import fs from 'node:fs'; import path from 'node:path';
const here = path.dirname(new URL(import.meta.url).pathname), web = path.resolve(here, '..');
const sceneFile = process.argv[2]; if (!sceneFile) { console.error('scene json required'); process.exit(1); }
const scene = JSON.parse(fs.readFileSync(sceneFile, 'utf8'));
const out = process.argv[3] || path.join(web, 'dist', path.basename(sceneFile, '.json') + '.html');
const html = fs.readFileSync(path.join(web, 'src/page.template.html'), 'utf8')
  .replace('{{TITLE}}', `DATA STORY · ${scene.template_id} · ${scene.id}`)
  .replace('{{FONTS_CSS}}', fs.readFileSync(path.join(web, 'fonts/fonts.css'), 'utf8'))
  .replace('{{ENGINE_JS}}', fs.readFileSync(path.join(web, 'src/engine.js'), 'utf8'))
  .replace('{{SCENE_JSON}}', JSON.stringify(scene));
fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, html);
console.log(`built ${out} (${(fs.statSync(out).size/1024).toFixed(0)} KB)`);
