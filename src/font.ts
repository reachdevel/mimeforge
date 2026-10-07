import { readFileSync } from 'node:fs';
import { extname } from 'node:path';
import opentype from 'opentype.js';
import { assetPath } from './paths.js';

/** Design grid of the label, in SVG units (one "pixel" of a 48 px render of the 32-unit canvas). */
export const GRID = 2 / 3;
/** Natural cap height of label text, in SVG units (9 grid cells). */
export const CAP_HEIGHT = 9 * GRID;

export interface LabelLayout {
  /** Path data. Coordinates are multiplied by `unitScale` to get SVG units. Origin = top-left of the cap box. */
  d: string;
  unitScale: number;
  /** Size of the text box in SVG units (after `unitScale`). */
  width: number;
  height: number;
  /** If set, the label should be positioned on multiples of this value (pixel fonts). */
  grid?: number;
}

export interface LabelFont {
  name: string;
  /** Layout `text` at `scale` (1 = natural size). */
  layout(text: string, scale: number): LabelLayout;
  /** Can this font draw the character? */
  has(ch: string): boolean;
}

const num = (v: number): string => String(+v.toFixed(3));

// ---------------------------------------------------------------- bitmap (pixel) fonts

export interface BitmapFontData {
  name: string;
  cols: number;
  rows: number;
  /** Extra rows below the baseline (descenders). Default 0. */
  descender?: number;
  /** Advance in cells (glyph width + spacing). */
  advance: number;
  /** char → rows of '#'/'.'; `rows + descender` rows each, `cols` characters wide. */
  glyphs: Record<string, string[]>;
  author?: string;
  license?: string;
  source?: string;
}

/**
 * Pixel font drawn as rectangles. The `rows` cap rows are stretched to `capCells` rows (whole cells, so the
 * stretch doubles a few rows) while columns stay 1 cell wide.
 */
export function bitmapFont(data: BitmapFontData, capCells = 9): LabelFont {
  const desc = data.descender ?? 0;
  const rowStart = (r: number): number => (r <= data.rows ? Math.round((r * capCells) / data.rows) : capCells + (r - data.rows));
  const glyphPath = (rows: string[], x0: number): string => {
    let d = '';
    for (let r = 0; r < data.rows + desc; r++) {
      const line = rows[r] ?? '';
      const y = rowStart(r), h = rowStart(r + 1) - y;
      for (let c = 0; c < data.cols; ) {
        if (line[c] !== '#') { c++; continue; }
        let e = c;
        while (e < data.cols && line[e] === '#') e++;
        d += `M${x0 + c} ${y}h${e - c}v${h}h${c - e}z`;
        c = e;
      }
    }
    return d;
  };
  return {
    name: data.name,
    has: (ch) => ch === ' ' || ch in data.glyphs,
    layout(text, scale) {
      const cell = GRID * scale;
      let d = '';
      [...text].forEach((ch, i) => { const g = data.glyphs[ch]; if (g) d += glyphPath(g, i * data.advance); });
      const n = [...text].length;
      return {
        d, unitScale: cell, grid: cell,
        width: (data.advance * (n - 1) + data.cols) * cell, height: capCells * cell,
      };
    },
  };
}

// ---------------------------------------------------------------- outline fonts (TTF / OTF / WOFF)

/** Serialize an opentype.js path ourselves (its `toPathData` can emit NaN for some coordinates). */
function pathData(p: { commands: any[] }): string {
  return p.commands.map((c) => {
    switch (c.type) {
      case 'M': case 'L': return `${c.type}${num(c.x)} ${num(c.y)}`;
      case 'Q': return `Q${num(c.x1)} ${num(c.y1)} ${num(c.x)} ${num(c.y)}`;
      case 'C': return `C${num(c.x1)} ${num(c.y1)} ${num(c.x2)} ${num(c.y2)} ${num(c.x)} ${num(c.y)}`;
      default: return 'Z';
    }
  }).join('');
}

/** Any vector font: glyph outlines become SVG paths, scaled so the cap height equals `CAP_HEIGHT`. */
export function outlineFont(buffer: Buffer, name: string): LabelFont {
  const font = opentype.parse(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));
  const capUnits: number = font.charToGlyph('H').getBoundingBox().y2 || font.unitsPerEm * 0.7;
  const k = CAP_HEIGHT / capUnits; // svg units per font unit
  return {
    name,
    has: (ch) => font.charToGlyph(ch).index !== 0,
    layout(text, scale) {
      const glyphs = [...text].map((c) => font.charToGlyph(c));
      let x = 0;
      const placed = glyphs.map((g) => { const px = x; x += g.advanceWidth * k; return px; });
      const first = glyphs[0]?.getBoundingBox().x1 ?? 0;
      const last = glyphs[glyphs.length - 1];
      const right = last ? placed[placed.length - 1] + last.getBoundingBox().x2 * k : 0;
      const left = first * k;
      let d = '';
      glyphs.forEach((g, i) => { d += pathData(g.getPath(placed[i] - left, CAP_HEIGHT, k * font.unitsPerEm)); });
      return { d, unitScale: scale, width: (right - left) * scale, height: CAP_HEIGHT * scale };
    },
  };
}

// ---------------------------------------------------------------- loading

export const BUILTIN_FONT = 'monogram';

/**
 * `spec`: undefined | "monogram" (built in) | path to a bitmap-font `.json` | path to a `.ttf` / `.otf` / `.woff`.
 */
export function loadFont(spec?: string): LabelFont {
  if (!spec || spec === BUILTIN_FONT) {
    return bitmapFont(JSON.parse(readFileSync(assetPath('fonts', 'monogram.json'), 'utf8')) as BitmapFontData);
  }
  const ext = extname(spec).toLowerCase();
  if (ext === '.json') return bitmapFont(JSON.parse(readFileSync(spec, 'utf8')) as BitmapFontData);
  if (['.ttf', '.otf', '.woff'].includes(ext)) return outlineFont(readFileSync(spec), spec.split('/').pop() ?? spec);
  throw new Error(`Unsupported font "${spec}". Use "monogram", a bitmap-font .json, or a .ttf/.otf/.woff file.`);
}
