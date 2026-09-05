// Emit a Stage-based React component (JSX) for Claude Design from a production JSON.
//   node web/tools/build_stage.mjs web/stories/<production>.json [out.jsx] [ComponentName]
import fs from 'node:fs'; import path from 'node:path';
const here = path.dirname(new URL(import.meta.url).pathname), web = path.resolve(here, '..');
const [jsonFile, outArg, nameArg] = process.argv.slice(2); if (!jsonFile) { console.error('production json required'); process.exit(1); }
const data = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
const name = nameArg || 'DataStory' + path.basename(jsonFile, '.json').replace(/[^A-Za-z0-9]/g, '');
const out = outArg || path.join(web, 'dist', path.basename(jsonFile, '.json') + '.stage.jsx');
const engine = fs.readFileSync(path.join(web, 'src/engine.js'), 'utf8');
const jsx = fs.readFileSync(path.join(web, 'src/stage.template.jsx'), 'utf8')
  .replace('{{TITLE}}', `DATA STORY · ${data.topic ?? 'story'} · ${data.total_duration_ms / 1000}s @ ${data.canvas.fps} fps`)
  .replace('{{ENGINE_JS}}', engine)
  .replace('{{FONTS_CSS_JSON}}', JSON.stringify(fs.readFileSync(path.join(web, 'fonts/fonts.css'), 'utf8')))
  .replace('{{PRODUCTION_JSON}}', JSON.stringify(data))
  .replace('{{COMPONENT_NAME}}', name);
fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, jsx);
console.log(`built ${out} (${(fs.statSync(out).size / 1024).toFixed(0)} KB) · component ${name} · ${data.total_duration_ms / 1000}s @ ${data.canvas.fps}fps`);
