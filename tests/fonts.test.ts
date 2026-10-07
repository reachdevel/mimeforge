import { describe, expect, it } from 'vitest';
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadFont, outlineFont, renderIcon } from '../src/index.js';
import { assetPath } from '../src/paths.js';

describe('fonts', () => {
  it('loads an outline font (ttf) and renders paths', () => {
    const font = outlineFont(readFileSync(join(assetPath('..'), 'third_party/monogram/monogram.ttf')), 'monogram.ttf');
    const l = font.layout('PDF', 1);
    expect(l.d.length).toBeGreaterThan(10);
    expect(l.d).not.toContain('NaN');
    expect(renderIcon('pdf', { font }).svg).toContain('id="label"');
  });
  it('loads a bitmap font from json', () => {
    const dir = mkdtempSync(join(tmpdir(), 'mimeforge-'));
    const file = join(dir, 'tiny.json');
    writeFileSync(file, JSON.stringify({ name: 't', cols: 3, rows: 3, advance: 4, glyphs: { A: ['###', '#.#', '#.#'], B: ['##.', '###', '##.'] } }));
    const svg = renderIcon('ab', { font: loadFont(file) }).svg;
    expect(svg).toContain('id="label"');
  });
  it('rejects unsupported font files', () => expect(() => loadFont('x.png')).toThrow(/Unsupported font/));
});
