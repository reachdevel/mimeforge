import { loadBodies, recolor, DEFAULT_TOKENS, type BodySet, type BodyTokens } from './body.js';
import type { Category } from './categories.js';
import { normalizeHex } from './color.js';
import { loadFont, type LabelFont } from './font.js';
import { DEFAULT_LABEL, renderLabel, type LabelConfig } from './label.js';
import { categoryFor } from './mime.js';
import { accentFor, createPalette, type Palette } from './palette.js';

export interface RenderOptions {
  font?: LabelFont;
  bodies?: BodySet;
  palette?: Palette;
  /** Force this accent for the icon (wins over the palette). */
  accent?: string;
  /** Force a category (skip mime lookup). */
  category?: Category;
  /** Text on the label: default is the extension; `false` draws no label. */
  label?: string | false;
  labelCase?: 'upper' | 'lower' | 'none';
  labelConfig?: Partial<LabelConfig>;
  tokens?: BodyTokens;
}

export interface RenderResult {
  svg: string;
  ext: string;
  category: Category;
  accent: string;
}

let defaults: { font: LabelFont; bodies: BodySet; palette: Palette } | undefined;
const getDefaults = () => (defaults ??= { font: loadFont(), bodies: loadBodies(), palette: createPalette() });

export function renderIcon(extension: string, opts: RenderOptions = {}): RenderResult {
  const d = getDefaults();
  const ext = extension.toLowerCase().replace(/^\./, '');
  const category = opts.category ?? categoryFor(ext);
  const accent = opts.accent ? normalizeHex(opts.accent) : accentFor(opts.palette ?? d.palette, ext, category);
  const tokens = opts.tokens ?? DEFAULT_TOKENS;
  let svg = recolor((opts.bodies ?? d.bodies).svg(category), accent, tokens);
  if (opts.label !== false) {
    const raw = opts.label ?? ext;
    const text = opts.labelCase === 'lower' ? raw.toLowerCase() : opts.labelCase === 'none' ? raw : raw.toUpperCase();
    const frag = renderLabel(text, opts.font ?? d.font, accent, { ...DEFAULT_LABEL, ...opts.labelConfig });
    svg = svg.replace(/<\/svg>\s*$/, `${frag}</svg>`);
  }
  return { svg: svg.replace(/>\s*\n\s*</g, '><').trim() + '\n', ext, category, accent };
}

/**
 * The fallback icon for extensions that have no icon of their own: the generic body without a label
 * (an unknown extension cannot be named). Written as `default.svg` by `mimeforge --all`.
 */
export function renderDefaultIcon(opts: RenderOptions = {}): RenderResult {
  return renderIcon('default', { ...opts, category: 'generic', label: false });
}
