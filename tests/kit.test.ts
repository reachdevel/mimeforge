import { describe, expect, it } from 'vitest';
import { mkdtempSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { allExtensions, categoryFor, classify, contrast, createPalette, loadBodies, loadFont, outlineFont, renderIcon, tint, validateBody, CATEGORIES } from '../src/index.js';
import { testRun } from '../src/testrun.js';
import { assetPath } from '../src/paths.js';

describe('categories', () => {
  it.each([
    ['pdf', 'pdf'], ['docx', 'word'], ['xlsx', 'sheet'], ['pptx', 'slides'], ['png', 'image'], ['jpg', 'image'], ['mp3', 'audio'],
    ['mp4', 'video'], ['zip', 'archive'], ['ttf', 'font'], ['epub', 'ebook'], ['sqlite', 'database'], ['exe', 'executable'],
    ['pem', 'security'], ['glb', 'model3d'], ['kml', 'geo'], ['eml', 'mail'], ['json', 'data'], ['py', 'code'], ['tsx', 'code'],
    ['gdoc', 'word'], ['gsheet', 'sheet'], ['gslides', 'slides'], ['sdw', 'word'], ['wps', 'word'], ['one', 'text'], ['xps', 'pdf'], ['chm', 'ebook'],
    ['m3u8', 'audio'], ['wmf', 'image'], ['icc', 'data'], ['texi', 'text'], ['siv', 'code'], ['kwd', 'word'], ['m4p', 'video'], ['sh', 'code'],
    ['iso', 'disk'], ['dmg', 'disk'], ['vmdk', 'disk'], ['vhd', 'disk'], ['psd', 'design'], ['ai', 'design'], ['vsdx', 'design'], ['qxd', 'design'], ['fm', 'design'],
    ['z5', 'game'], ['rom', 'game'], ['wad', 'game'], ['swf', 'game'], ['gba', 'game'], ['dir', 'game'],
    ['gbr', 'generic'], ['kdbx', 'security'], ['rm', 'video'], ['mxf', 'video'], ['mmf', 'audio'], ['class', 'executable'], ['xpi', 'archive'], ['appx', 'archive'], ['lrf', 'ebook'], ['mseed', 'science'], ['mvt', 'geo'],
    ['lwp', 'word'], ['123', 'sheet'], ['pre', 'slides'], ['nsf', 'mail'], ['ipk', 'archive'], ['hvs', 'audio'], ['qam', 'video'], ['elc', 'code'], ['irm', 'security'], ['i2g', 'science'], ['cdy', 'science'],
    ['bin', 'generic'], ['sc', 'generic'], ['aep', 'generic'], ['bpk', 'generic'], ['deploy', 'generic'],
    ['arj', 'archive'], ['aab', 'archive'], ['msp', 'executable'], ['nt', 'data'], ['flw', 'design'], ['gqs', 'science'], ['chrt', 'sheet'], ['atx', 'game'], ['osf', 'audio'], ['m13', 'video'], ['wmlc', 'code'],
    ['xar', 'generic'], ['vox', 'generic'], ['dump', 'generic'], ['u32', 'generic'],
    ['txt', 'text'], ['md', 'text'], ['unknownext', 'generic'], ['.PDF', 'pdf'],
  ])('%s → %s', (ext, cat) => expect(categoryFor(ext)).toBe(cat));

  it('prefers the first non-generic mime of an extension', () => expect(classify('x', ['application/foo', 'video/x-foo'])).toBe('video'));
  it('knows 1000+ extensions, all lowercase', () => {
    const all = allExtensions();
    expect(all.length).toBeGreaterThan(1000);
    expect(all.every((e) => e === e.toLowerCase())).toBe(true);
  });
});

describe('color', () => {
  it('tints towards white', () => expect(tint('#000000', 0.5)).toBe('#808080'));
  it('contrast of black/white is 21', () => expect(contrast('#000000', '#FFFFFF')).toBeCloseTo(21, 0));
  it('palette rejects unknown keys and bad hex', () => {
    expect(() => createPalette({ nope: '#fff' })).toThrow(/Unknown color key/);
    expect(() => createPalette({ pdf: 'red' })).toThrow(/Invalid hex/);
  });
  it('palette supports category and extension overrides', () => {
    expect(renderIcon('docx', { palette: createPalette({ word: '#112233' }) }).accent).toBe('#112233');
    expect(renderIcon('docx', { palette: createPalette({ word: '#112233', '.docx': '#445566' }) }).accent).toBe('#445566');
    expect(renderIcon('docx', { accent: '#0a0b0c' }).accent).toBe('#0A0B0C');
  });
});

describe('render', () => {
  it('replaces tokens with the accent and keeps the SVG well formed', () => {
    const { svg } = renderIcon('pdf', { accent: '#123456' });
    expect(svg).not.toMatch(/FF00FF|FF99FF/i);
    expect(svg).toContain('#123456');
    expect(svg.startsWith('<svg')).toBe(true);
    expect(svg.trimEnd().endsWith('</svg>')).toBe(true);
    expect(svg).toContain('viewBox="0 0 32 32"');
  });
  it('is deterministic', () => expect(renderIcon('zip').svg).toBe(renderIcon('zip').svg));
  it('draws no label with label:false', () => expect(renderIcon('zip', { label: false }).svg).not.toContain('id="label"'));
  it('uses a dark label text on light accents', () => {
    const light = renderIcon('x', { accent: '#99CC00' }).svg;
    expect(light).toContain('fill="#1B1F24"');
    expect(renderIcon('x', { accent: '#990000' }).svg).toContain('fill="#FFFFFF"');
  });
  it('stays small for every known extension (< 6 KB) and never emits NaN', () => {
    for (const ext of allExtensions()) {
      const { svg } = renderIcon(ext);
      expect(svg.length).toBeLessThan(6000);
      expect(svg).not.toContain('NaN');
    }
  });
  it('shrinks long labels to fit the label width', () => {
    const font = loadFont();
    for (const ext of ['mmmm', 'webmanifest', 'appinstaller', 'a'.repeat(40)]) {
      const svg = renderIcon(ext, { font }).svg;
      const m = /translate\(([\d.-]+) [\d.-]+\) scale\(([\d.]+)\)/.exec(svg)!;
      const x = parseFloat(m[1]);
      expect(x).toBeGreaterThanOrEqual(4); // inside the 26-wide band (starts at x=3)
      expect(32 - x).toBeGreaterThanOrEqual(4);
    }
  });
  it('keeps equal-width letters equal: MMMM and DDDD have the same width', () => {
    const w = (t: string) => loadFont().layout(t, 1).width;
    expect(w('MMMM')).toBe(w('DDDD'));
  });
});

describe('fonts', () => {
  it('loads an outline font (ttf) and renders paths', () => {
    const font = outlineFont(readFileSync(join(assetPath('..'), 'third_party/monogram/monogram.ttf')), 'monogram.ttf');
    const l = font.layout('PDF', 1);
    expect(l.d.length).toBeGreaterThan(10);
    expect(l.d).not.toContain('NaN');
    expect(renderIcon('pdf', { font }).svg).toContain('id="label"');
  });
  it('loads a bitmap font from json', () => {
    const dir = mkdtempSync(join(tmpdir(), 'fk-'));
    const file = join(dir, 'tiny.json');
    writeFileSync(file, JSON.stringify({ name: 't', cols: 3, rows: 3, advance: 4, glyphs: { A: ['###', '#.#', '#.#'], B: ['##.', '###', '##.'] } }));
    const svg = renderIcon('ab', { font: loadFont(file) }).svg;
    expect(svg).toContain('id="label"');
  });
  it('rejects unsupported font files', () => expect(() => loadFont('x.png')).toThrow(/Unsupported font/));
});

describe('bodies', () => {
  it('every category resolves to a body that passes validation', () => {
    const bodies = loadBodies();
    for (const c of CATEGORIES) expect(validateBody(bodies.svg(c), c)).toEqual([]);
  });
  it('every category has its own bundled body', () => expect(loadBodies().missing).toEqual([]));
  it('accepts a single svg for every type, with warnings for violations', () => {
    const dir = mkdtempSync(join(tmpdir(), 'fk-'));
    const file = join(dir, 'b.svg');
    writeFileSync(file, '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect fill="#000"/></svg>');
    const bodies = loadBodies(file);
    expect(bodies.warnings.length).toBe(2);
    expect(renderIcon('pdf', { bodies }).svg).toContain('<rect fill="#000"/>');
  });
  it('directory bodies override per category and fall back to bundled', () => {
    const dir = mkdtempSync(join(tmpdir(), 'fk-'));
    writeFileSync(join(dir, 'pdf.svg'), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle id="custom" fill="#FF00FF"/></svg>');
    const bodies = loadBodies(dir);
    expect(renderIcon('pdf', { bodies }).svg).toContain('id="custom"');
    expect(renderIcon('zip', { bodies }).svg).toContain('id="page"');
  });
  it('throws for a missing body path', () => expect(() => loadBodies('/nope/nope')).toThrow(/not found/));
});

describe('test run', () => {
  it('writes an html page and one svg per sample', () => {
    const dir = mkdtempSync(join(tmpdir(), 'fk-'));
    const file = testRun(dir, {}, { font: 'monogram', body: 'bundled', warnings: [] });
    const html = readFileSync(file, 'utf8');
    expect(html).toContain('width="16"');
    expect(html).toContain('width="48"');
    expect(existsSync(join(dir, 'svg', 'docx.svg'))).toBe(true);
  });
});

describe('config and png', () => {
  it('loads a config file and resolves relative paths against it', async () => {
    const { loadConfig } = await import('../src/config.js');
    const dir = mkdtempSync(join(tmpdir(), 'fk-'));
    writeFileSync(join(dir, 'mimeforge.config.json'), JSON.stringify({ out: 'icons', font: 'monogram', colors: { pdf: '#112233' }, png: [16] }));
    const loaded = loadConfig(join(dir, 'mimeforge.config.json'))!;
    expect(loaded.config.out).toBe(join(dir, 'icons'));
    expect(loaded.config.font).toBe('monogram');
    expect(loaded.config.colors).toEqual({ pdf: '#112233' });
    expect(() => loadConfig(join(dir, 'missing.json'))).toThrow(/not found/);
  });
  it('rasterizes an icon to a PNG at any size', async () => {
    const { renderPng } = await import('../src/png.js');
    const png = await renderPng(renderIcon('pdf').svg, 40);
    expect(png.subarray(0, 4).toString('hex')).toBe('89504e47');
  });
  it('draws hyphen, underscore and the Q tail', () => {
    for (const label of ['n-gage', 'x_t', 'qt']) {
      const svg = renderIcon('x', { label }).svg;
      expect(svg).toContain('id="label"');
    }
  });
});
