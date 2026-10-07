// Builds docs/preview.svg: one icon per category, laid out in a grid. Run `npm run build && npm run preview`.
import { writeFileSync } from 'node:fs';
import { renderIcon, CATEGORIES } from '../dist/index.js';

const SAMPLES = {
  generic: 'dat', text: 'txt', code: 'py', data: 'json', pdf: 'pdf', word: 'docx', sheet: 'xlsx', slides: 'pptx',
  image: 'png', audio: 'mp3', video: 'mp4', archive: 'zip', font: 'ttf', ebook: 'epub', database: 'sqlite',
  executable: 'exe', security: 'pem', model3d: 'glb', geo: 'kml', mail: 'eml', science: 'cif',
  disk: 'iso', design: 'psd', game: 'rom',
};
const COLS = 8, CELL_W = 104, CELL_H = 104, ICON = 64, PAD = 12;
const rows = Math.ceil(CATEGORIES.length / COLS);
let cells = '';
CATEGORIES.forEach((cat, i) => {
  const x = PAD + (i % COLS) * CELL_W, y = PAD + Math.floor(i / COLS) * CELL_H;
  const inner = renderIcon(SAMPLES[cat]).svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
  cells += `<g transform="translate(${x + (CELL_W - ICON) / 2 - PAD / 2} ${y}) scale(${ICON / 32})">${inner}</g>`;
  cells += `<text x="${x + CELL_W / 2 - PAD / 2}" y="${y + ICON + 16}" text-anchor="middle" font-family="-apple-system,Segoe UI,Helvetica,Arial,sans-serif" font-size="11" fill="#6e7781">${cat}</text>`;
});
const width = COLS * CELL_W + PAD, height = rows * CELL_H + PAD;
writeFileSync(new URL('../docs/preview.svg', import.meta.url),
  `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${cells}</svg>\n`);
console.log(`docs/preview.svg (${width}x${height})`);
