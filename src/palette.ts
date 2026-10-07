import { CATEGORIES, isCategory, type Category } from './categories.js';
import { normalizeHex } from './color.js';

/** Default accent per category. Everything here can be overridden (per category or per extension). */
export const DEFAULT_PALETTE: Readonly<Record<Category, string>> = {
  generic: '#990000', text: '#999999', code: '#2F7F8F', data: '#336699', pdf: '#D64545', word: '#2B6CB0',
  sheet: '#217346', slides: '#D24726', image: '#999900', audio: '#1E9E5A', video: '#8E44AD', archive: '#996600',
  font: '#7B4B94', ebook: '#B5651D', database: '#5B6770', executable: '#444B57', security: '#B8860B',
  model3d: '#4B6CB7', geo: '#99CC00', mail: '#2E86AB', science: '#009999',
  disk: '#00796B', design: '#C2185B', game: '#E08A00',
};

export interface Palette {
  categories: Record<Category, string>;
  /** Per-extension overrides (lowercase, no dot). */
  extensions: Record<string, string>;
}

/**
 * Build a palette from overrides. Keys are category names (`pdf`) or extensions with a leading dot (`.docx`).
 */
export function createPalette(overrides: Record<string, string> = {}): Palette {
  const categories = { ...DEFAULT_PALETTE } as Record<Category, string>;
  const extensions: Record<string, string> = {};
  for (const [key, value] of Object.entries(overrides)) {
    const hex = normalizeHex(value);
    if (key.startsWith('.')) extensions[key.slice(1).toLowerCase()] = hex;
    else if (isCategory(key)) categories[key] = hex;
    else throw new Error(`Unknown color key "${key}". Use a category (${CATEGORIES.join(', ')}) or ".ext".`);
  }
  for (const c of CATEGORIES) categories[c] = normalizeHex(categories[c]);
  return { categories, extensions };
}

export function accentFor(palette: Palette, ext: string, category: Category): string {
  return palette.extensions[ext.toLowerCase().replace(/^\./, '')] ?? palette.categories[category];
}
