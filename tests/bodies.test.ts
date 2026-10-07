import { describe, expect, it } from 'vitest';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadBodies, renderIcon, validateBody, CATEGORIES } from '../src/index.js';

describe('bodies', () => {
  it('every category resolves to a body that passes validation', () => {
    const bodies = loadBodies();
    for (const c of CATEGORIES) expect(validateBody(bodies.svg(c), c)).toEqual([]);
  });
  it('every category has its own bundled body', () => expect(loadBodies().missing).toEqual([]));
  it('accepts a single svg for every type, with warnings for violations', () => {
    const dir = mkdtempSync(join(tmpdir(), 'mimeforge-'));
    const file = join(dir, 'b.svg');
    writeFileSync(file, '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect fill="#000"/></svg>');
    const bodies = loadBodies(file);
    expect(bodies.warnings.length).toBe(2);
    expect(renderIcon('pdf', { bodies }).svg).toContain('<rect fill="#000"/>');
  });
  it('directory bodies override per category and fall back to bundled', () => {
    const dir = mkdtempSync(join(tmpdir(), 'mimeforge-'));
    writeFileSync(join(dir, 'pdf.svg'), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle id="custom" fill="#FF00FF"/></svg>');
    const bodies = loadBodies(dir);
    expect(renderIcon('pdf', { bodies }).svg).toContain('id="custom"');
    expect(renderIcon('zip', { bodies }).svg).toContain('id="page"');
  });
  it('throws for a missing body path', () => expect(() => loadBodies('/nope/nope')).toThrow(/not found/));
});
