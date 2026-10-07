import { describe, expect, it } from 'vitest';
import { mkdtempSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { testRun } from '../src/testrun.js';

describe('test run', () => {
  it('writes an html page and one svg per sample', () => {
    const dir = mkdtempSync(join(tmpdir(), 'mimeforge-'));
    const file = testRun(dir, {}, { font: 'monogram', body: 'bundled', warnings: [] });
    const html = readFileSync(file, 'utf8');
    expect(html).toContain('width="16"');
    expect(html).toContain('width="48"');
    expect(existsSync(join(dir, 'svg', 'docx.svg'))).toBe(true);
  });
});
