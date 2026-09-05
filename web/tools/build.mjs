// Bundle engine + fonts + JSON into ONE self-contained HTML file.
//   node web/tools/build.mjs web/scenes/<scene>.json [out.html]        → single-scene page
//   node web/tools/build.mjs --story web/stories/<production>.json [out] → multi-scene story player
import fs from 'node:fs'; import path from 'node:path';
const here = path.dirname(new URL(import.meta.url).pathname), web = path.resolve(here, '..');
const args = process.argv.slice(2); const story = args[0] === '--story'; if (story) args.shift();
const jsonFile = args[0]; if (!jsonFile) { console.error('json file required'); process.exit(1); }
const data = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
const out = args[1] || path.join(web, 'dist', path.basename(jsonFile, '.json') + '.html');
const tpl = fs.readFileSync(path.join(web, story ? 'src/story.template.html' : 'src/page.template.html'), 'utf8');
const html = tpl
  .replace('{{TITLE}}', story ? `DATA STORY · ${data.topic ?? 'story'}` : `DATA STORY · ${data.template_id} · ${data.id}`)
  .replace('{{FONTS_CSS}}', fs.readFileSync(path.join(web, 'fonts/fonts.css'), 'utf8'))
  .replace('{{ENGINE_JS}}', fs.readFileSync(path.join(web, 'src/engine.js'), 'utf8'))
  .replace(story ? '{{PRODUCTION_JSON}}' : '{{SCENE_JSON}}', JSON.stringify(data));
fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, html);
console.log(`built ${out} (${(fs.statSync(out).size/1024).toFixed(0)} KB)`);
