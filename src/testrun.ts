import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { CATEGORIES, type Category } from './categories.js';
import { renderIcon, type RenderOptions } from './render.js';
import { accentFor, createPalette } from './palette.js';

/** One representative extension per body type. */
export const SAMPLES: Record<Category, string> = {
  generic: 'dat', text: 'txt', code: 'py', data: 'json', pdf: 'pdf', word: 'docx', sheet: 'xlsx', slides: 'pptx',
  image: 'png', audio: 'mp3', video: 'mp4', archive: 'zip', font: 'ttf', ebook: 'epub', database: 'sqlite',
  executable: 'exe', security: 'pem', model3d: 'glb', geo: 'kml', mail: 'eml', science: 'cif',
  disk: 'iso', design: 'psd', game: 'rom',
};
/** Label stress test: different lengths, widest letters, digits. */
const STRESS = ['go', 'pdf', 'docx', 'webm', 'xhtml', 'mmmm', 'json5', 'svgz', 'webmanifest', 'appinstaller'];
const SIZES = [16, 48, 128];

export interface TestRunInfo { font: string; body: string; warnings: string[]; missing?: string[] }

/** Writes `<out>/svg/*.svg` and `<out>/index.html`. Returns the path of the HTML file. */
export function testRun(outDir: string, opts: RenderOptions, info: TestRunInfo): string {
  const svgDir = join(outDir, 'svg');
  mkdirSync(svgDir, { recursive: true });
  const palette = opts.palette ?? createPalette();
  const write = (ext: string): { file: string; accent: string; category: Category } => {
    const r = renderIcon(ext, opts);
    writeFileSync(join(svgDir, `${ext}.svg`), r.svg);
    return { file: `svg/${ext}.svg`, accent: r.accent, category: r.category };
  };
  const imgs = (file: string, alt: string): string =>
    SIZES.map((s) => `<figure><img src="${file}" width="${s}" height="${s}" alt="${alt}"><figcaption>${s}px</figcaption></figure>`).join('');

  const bodyCards = CATEGORIES.map((cat) => {
    const ext = SAMPLES[cat];
    const r = write(ext);
    const accent = opts.accent ?? accentFor(palette, ext, cat);
    return `<section class="card"><h3>${cat}<small>.${ext}</small></h3><div class="row">${imgs(r.file, cat)}</div>` +
      `<p class="sw"><i style="background:${accent}"></i>${accent}</p></section>`;
  }).join('\n');

  const stress = STRESS.map((ext) => {
    const r = write(ext);
    return `<section class="card"><h3>.${ext}<small>${r.category}</small></h3><div class="row">${imgs(r.file, ext)}</div></section>`;
  }).join('\n');

  const missingNote = info.missing?.length ? `<div class="warn"><b>No own body yet</b> (drawn with the generic body): ${info.missing.join(', ')}</div>` : '';
  const warn = missingNote + (info.warnings.length ? `<div class="warn"><b>Body warnings</b><ul>${info.warnings.map((w) => `<li>${w}</li>`).join('')}</ul></div>` : '');
  const html = `<!doctype html>
<html lang="en"><meta charset="utf-8"><title>MimeForge test run</title>
<style>
:root{--bg:#fff;--fg:#1b1f24;--card:#f6f7f9;--line:#e2e5e9}
body.dark{--bg:#1e2227;--fg:#e8eaed;--card:#272c33;--line:#363c45}
body{font:14px/1.4 system-ui,sans-serif;margin:24px;background:var(--bg);color:var(--fg)}
h1{margin:0 0 4px;font-size:20px}h2{margin:28px 0 10px;font-size:16px}
.meta{color:#8a919a;margin-bottom:12px}.meta b{color:var(--fg)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px}
.card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px}
.card h3{margin:0 0 8px;font-size:13px}.card h3 small{color:#8a919a;margin-left:6px;font-weight:400}
.row{display:flex;align-items:flex-end;gap:16px}
figure{margin:0;text-align:center}figcaption{font-size:11px;color:#8a919a;margin-top:2px}
.sw{margin:8px 0 0;font:12px ui-monospace,monospace;color:#8a919a}.sw i{display:inline-block;width:12px;height:12px;border-radius:3px;margin-right:6px;vertical-align:-2px}
button{font:inherit;padding:4px 10px;border-radius:6px;border:1px solid var(--line);background:var(--card);color:var(--fg);cursor:pointer}
.warn{background:#fff3cd;color:#664d03;padding:8px 12px;border-radius:8px;margin:12px 0}
</style>
<body>
<h1>MimeForge · test run</h1>
<div class="meta">font: <b>${info.font}</b> · body: <b>${info.body}</b> · icons are plain &lt;img src="svg/…"&gt; at 16 / 48 / 128 px <button onclick="document.body.classList.toggle('dark')">toggle dark</button></div>
${warn}
<h2>Body types (${CATEGORIES.length})</h2>
<div class="grid">${bodyCards}</div>
<h2>Label length stress test</h2>
<div class="grid">${stress}</div>
</body></html>
`;
  const file = join(outDir, 'index.html');
  writeFileSync(file, html);
  return file;
}
