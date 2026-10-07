import { labelTextColor } from './color.js';
import { CAP_HEIGHT, GRID, type LabelFont } from './font.js';

export interface LabelConfig {
  /** Label band: horizontal center is x=16; `width` and bottom edge in SVG units. */
  bandWidth: number;
  bandBottom: number;
  /** Vertical padding between text and band edge, in grid cells. */
  padCells: number;
  /** Maximum text width in SVG units; longer text is scaled down. */
  innerWidth: number;
  /** Smallest scale before letters are dropped. */
  minScale: number;
  cornerRadius: number;
  textLight: string;
  textDark: string;
}

export const DEFAULT_LABEL: LabelConfig = {
  bandWidth: 26, bandBottom: 28, padCells: 2, innerWidth: 24, minScale: 0.35, cornerRadius: 1,
  textLight: '#FFFFFF', textDark: '#1B1F24',
};

const num = (v: number): string => String(+v.toFixed(3));
const snap = (v: number, grid?: number): number => (grid ? Math.round(v / grid) * grid : v);

/** SVG fragment (band + text) for `text` in the 32×32 canvas. */
export function renderLabel(text: string, font: LabelFont, accent: string, cfg: LabelConfig = DEFAULT_LABEL): string {
  let chars = [...text].filter((c) => font.has(c));
  if (!chars.length) return '';
  let scale = 1;
  let layout = font.layout(chars.join(''), 1);
  if (layout.width > cfg.innerWidth) {
    scale = cfg.innerWidth / layout.width;
    // below the minimum scale we drop trailing letters instead of shrinking further
    while (scale < cfg.minScale && chars.length > 1) {
      chars = chars.slice(0, -1);
      const l = font.layout(chars.join(''), 1);
      scale = Math.min(1, cfg.innerWidth / l.width);
    }
    scale = Math.max(scale, cfg.minScale);
    layout = font.layout(chars.join(''), scale);
  }
  const pad = cfg.padCells * GRID;
  const bandH = CAP_HEIGHT + 2 * pad;
  const bandTop = cfg.bandBottom - bandH;
  const tx = snap(16 - layout.width / 2, layout.grid);
  const ty = snap(bandTop + (bandH - layout.height) / 2, layout.grid);
  const fill = labelTextColor(accent, cfg.textLight, cfg.textDark);
  const band = `<rect x="${num(16 - cfg.bandWidth / 2)}" y="${num(bandTop)}" width="${cfg.bandWidth}" height="${num(bandH)}" rx="${cfg.cornerRadius}" fill="${accent}"/>`;
  const txt = `<path transform="translate(${num(tx)} ${num(ty)}) scale(${num(layout.unitScale)})" d="${layout.d}" fill="${fill}"/>`;
  return `<g id="label">${band}${txt}</g>`;
}
