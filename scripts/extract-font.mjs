// Dev script: sample the Monogram TTF (CC0) into a 5x7 (+1 descender row) bitmap table → assets/fonts/monogram.json.
// Usage: npm run extract-font
import { readFileSync, writeFileSync } from 'node:fs';
import opentype from 'opentype.js';
import { Resvg } from '@resvg/resvg-js';

const ttf = readFileSync(new URL('../third_party/monogram/monogram.ttf', import.meta.url));
const font = opentype.parse(ttf.buffer.slice(ttf.byteOffset, ttf.byteOffset + ttf.byteLength));
const PX = 64, COLS = 5, ROWS = 7, DESC = 1, S = 10;
const num = (v) => String(+v.toFixed(2));
const pathData = (p) => p.commands.map((c) => c.type + [c.x1, c.y1, c.x2, c.y2, c.x, c.y].filter((v) => v !== undefined).map(num).join(' ')).join('');

const glyphs = {};
for (let code = 33; code <= 126; code++) {
  const ch = String.fromCharCode(code);
  const g = font.charToGlyph(ch);
  if (!g || g.index === 0) continue;
  const d = pathData(g.getPath(0, ROWS * S, (S * font.unitsPerEm) / PX));
  const W = COLS * S, H = (ROWS + DESC) * S;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><path d="${d}" fill="#000"/></svg>`;
  const px = new Resvg(svg).render().pixels;
  const rows = [];
  for (let r = 0; r < ROWS + DESC; r++) {
    let line = '';
    for (let c = 0; c < COLS; c++) line += px[((r * S + S / 2) * W + (c * S + S / 2)) * 4 + 3] > 128 ? '#' : '.';
    rows.push(line);
  }
  glyphs[ch] = rows;
}
const out = {
  name: 'Monogram', author: 'Vinícius Menézio (datagoblin)', license: 'CC0-1.0', source: 'https://datagoblin.itch.io/monogram',
  cols: COLS, rows: ROWS, descender: DESC, advance: 6, glyphs,
};
writeFileSync(new URL('../assets/fonts/monogram.json', import.meta.url), JSON.stringify(out, null, 1).replace(/\[\n\s+("[.#]+"(?:,\n\s+"[.#]+")*)\n\s+\]/g, (m) => m.replace(/\n\s+/g, ' ')));
console.log('glyphs:', Object.keys(glyphs).length);
