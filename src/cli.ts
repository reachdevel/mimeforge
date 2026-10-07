#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { loadBodies } from './body.js';
import { loadConfig, type Config } from './config.js';
import { renderPng } from './png.js';
import { loadFont } from './font.js';
import { allExtensions, categoryFor } from './mime.js';
import { createPalette } from './palette.js';
import { renderDefaultIcon, renderIcon, type RenderOptions } from './render.js';
import { testRun } from './testrun.js';
import { ROOT } from './paths.js';

const HELP = `MimeForge – generate file-type icons (SVG) from file extensions

Usage
  mimeforge <ext...> [options]           write <out>/<ext>.svg for the given extensions
                                         ("default" = the fallback icon without a label)
  mimeforge --all [options]              every known extension (mime-db + extras) + manifest.json
  mimeforge --test-run [options]         write an HTML page with all body types at 16/48/128 px

Options
  -o, --out <dir>          output directory (default: ./out, test run: ./out/test-run)
      --font <spec>        "monogram" (default), a .ttf/.otf/.woff file, or a bitmap-font .json
      --body <path>        a directory of <category>.svg bodies, or one .svg used for every type
      --color <k=#hex>     override an accent; k = category (pdf) or extension (.docx); repeatable
      --colors <file>      JSON file {"pdf": "#d00", ".docx": "#06c"}
      --accent <#hex>      force one accent for all icons
      --label-case <c>     upper (default) | lower | none
      --no-label           bodies only
      --png <sizes>        also write PNGs, e.g. --png 16,32,48 → <out>/<size>/<ext>.png (needs @resvg/resvg-js)
      --config <file>      JSON config (default: ./mimeforge.config.json if present); flags override it
      --list               print "ext category" for every known extension
  -h, --help               this help
  -v, --version
`;

function fail(msg: string): never {
  console.error(`error: ${msg}`);
  process.exit(1);
}

async function main(): Promise<void> {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      'test-run': { type: 'boolean' }, all: { type: 'boolean' }, list: { type: 'boolean' },
      out: { type: 'string', short: 'o' }, font: { type: 'string' }, body: { type: 'string' },
      color: { type: 'string', multiple: true }, colors: { type: 'string' }, accent: { type: 'string' },
      'label-case': { type: 'string' }, 'no-label': { type: 'boolean' }, png: { type: 'string' }, config: { type: 'string' },
      help: { type: 'boolean', short: 'h' }, version: { type: 'boolean', short: 'v' },
    },
  });

  if (values.version) {
    console.log((JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')) as { version: string }).version);
    return;
  }
  if (values.help || (!positionals.length && !values.all && !values['test-run'] && !values.list)) { console.log(HELP); return; }
  if (values.list) { for (const e of allExtensions()) console.log(`${e} ${categoryFor(e)}`); return; }

  let cfg: Config = {};
  try { cfg = loadConfig(values.config)?.config ?? {}; } catch (e) { fail((e as Error).message); }
  const fontSpec = values.font ?? cfg.font;
  const bodySpec = values.body ?? cfg.body;
  const accent = values.accent ?? cfg.accent;
  const overrides: Record<string, string> = { ...(cfg.colors ?? {}) };
  if (values.colors) Object.assign(overrides, JSON.parse(readFileSync(values.colors, 'utf8')));
  for (const kv of values.color ?? []) {
    const i = kv.indexOf('=');
    if (i < 1) fail(`--color expects key=#hex, got "${kv}"`);
    overrides[kv.slice(0, i)] = kv.slice(i + 1);
  }
  const labelCase = values['label-case'] ?? cfg.labelCase ?? 'upper';
  if (!['upper', 'lower', 'none'].includes(labelCase)) fail('--label-case must be upper, lower or none');

  let opts: RenderOptions;
  let bodyInfo: { source: string; warnings: string[]; missing: string[] };
  try {
    const bodies = loadBodies(bodySpec);
    bodyInfo = bodies;
    opts = {
      font: loadFont(fontSpec), bodies, palette: createPalette(overrides), accent,
      label: values['no-label'] || cfg.label === false ? false : undefined, labelCase: labelCase as 'upper' | 'lower' | 'none',
    };
  } catch (e) { fail((e as Error).message); }

  for (const w of bodyInfo.warnings) console.error(`warning: ${w}`);

  if (values['test-run']) {
    const out = resolve(values.out ?? 'out/test-run');
    const file = testRun(out, opts, { font: fontSpec ?? 'monogram', body: bodyInfo.source, warnings: bodyInfo.warnings, missing: bodyInfo.missing });
    console.log(`test run written: ${file}`);
    return;
  }

  const out = resolve(values.out ?? cfg.out ?? 'out');
  mkdirSync(out, { recursive: true });
  const pngSizes = (values.png ? values.png.split(',').map(Number) : cfg.png ?? []).filter((n) => Number.isFinite(n) && n > 0);
  const exts = values.all ? [...allExtensions(), 'default'] : positionals.map((e) => e.toLowerCase().replace(/^\./, ''));
  const manifest: Record<string, string> = {};
  let bytes = 0;
  for (const ext of exts) {
    const r = ext === 'default' ? renderDefaultIcon(opts) : renderIcon(ext, opts);
    writeFileSync(join(out, `${ext}.svg`), r.svg);
    for (const size of pngSizes) {
      mkdirSync(join(out, String(size)), { recursive: true });
      writeFileSync(join(out, String(size), `${ext}.png`), await renderPng(r.svg, size));
    }
    if (ext !== 'default') manifest[ext] = r.category;
    bytes += r.svg.length;
  }
  if (values.all) writeFileSync(join(out, 'manifest.json'), JSON.stringify(manifest, null, 1));
  console.log(`${exts.length} icon(s)${values.all ? ' (incl. default)' : ''} → ${out}  (${(bytes / 1024).toFixed(0)} KB total, ${(bytes / exts.length / 1024).toFixed(1)} KB avg)`);
}

main().catch((e: Error) => fail(e.message));
