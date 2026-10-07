import { describe, expect, it } from 'vitest';
import { contrast, createPalette, renderIcon, tint } from '../src/index.js';

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
