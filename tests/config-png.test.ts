import { describe, expect, it } from 'vitest';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { renderIcon } from '../src/index.js';

describe('config and png', () => {
  it('loads a config file and resolves relative paths against it', async () => {
    const { loadConfig } = await import('../src/config.js');
    const dir = mkdtempSync(join(tmpdir(), 'mimeforge-'));
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
