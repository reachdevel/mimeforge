import { describe, expect, it } from 'vitest';
import { allExtensions, loadFont, renderIcon } from '../src/index.js';

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
