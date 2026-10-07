import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, join } from 'node:path';
import { CATEGORIES, isCategory, type Category } from './categories.js';
import { tint } from './color.js';
import { assetPath } from './paths.js';

export interface BodyTokens {
  /** Literal color in body SVGs that is replaced by the accent. */
  accent: string;
  /** Literal color replaced by the lighter tint of the accent. */
  tint: string;
}
export const DEFAULT_TOKENS: BodyTokens = { accent: '#FF00FF', tint: '#FF99FF' };

export interface BodySet {
  source: string;
  svg(category: Category): string;
  warnings: string[];
  /** Categories that have no own body and are drawn with the generic one. */
  missing: Category[];
}

/** Check the body contract (see docs/BODY-SPEC.md). Returns human readable problems. */
export function validateBody(svg: string, name: string, tokens: BodyTokens = DEFAULT_TOKENS): string[] {
  const problems: string[] = [];
  if (!/<svg[^>]*viewBox="0 0 32 32"/.test(svg)) problems.push(`${name}: root <svg> must have viewBox="0 0 32 32"`);
  if (!svg.toLowerCase().includes(tokens.accent.toLowerCase())) problems.push(`${name}: no accent token ${tokens.accent} found (icon cannot be recolored)`);
  if (!/<\/svg>\s*$/.test(svg)) problems.push(`${name}: must end with </svg>`);
  return problems;
}

function readDirBodies(dir: string): Map<Category, string> {
  const map = new Map<Category, string>();
  for (const f of readdirSync(dir)) {
    if (!f.endsWith('.svg')) continue;
    const cat = basename(f, '.svg');
    if (isCategory(cat)) map.set(cat, readFileSync(join(dir, f), 'utf8').trim());
  }
  return map;
}

/**
 * `spec`: undefined → bundled bodies. A directory → `<category>.svg` files, missing ones fall back to the
 * directory's `generic.svg`, then to the bundled body. A single `.svg` file → used for every category.
 */
export function loadBodies(spec?: string, tokens: BodyTokens = DEFAULT_TOKENS): BodySet {
  const bundled = readDirBodies(assetPath('bodies'));
  const warnings: string[] = [];
  let custom: Map<Category, string> | undefined;
  let single: string | undefined;
  if (spec) {
    if (!existsSync(spec)) throw new Error(`Body path not found: ${spec}`);
    if (statSync(spec).isDirectory()) custom = readDirBodies(spec);
    else single = readFileSync(spec, 'utf8').trim();
  }
  if (single) warnings.push(...validateBody(single, spec!, tokens));
  if (custom) for (const [c, s] of custom) warnings.push(...validateBody(s, `${spec}/${c}.svg`, tokens));
  const has = (c: Category): boolean => !!(single ?? custom?.get(c) ?? bundled.get(c));
  return {
    source: spec ?? 'bundled',
    warnings,
    missing: CATEGORIES.filter((c) => !has(c)),
    svg(category) {
      const s = single ?? custom?.get(category) ?? custom?.get('generic') ?? bundled.get(category) ?? bundled.get('generic');
      if (!s) throw new Error(`No body for category "${category}"`);
      return s;
    },
  };
}

/** Replace the color tokens in a body SVG. */
export function recolor(svg: string, accent: string, tokens: BodyTokens = DEFAULT_TOKENS, tintAmount = 0.55): string {
  const esc = (s: string): string => s.replace(/[.*+?^${}()|[\]\\#]/g, '\\$&');
  return svg
    .replace(new RegExp(esc(tokens.accent), 'gi'), accent)
    .replace(new RegExp(esc(tokens.tint), 'gi'), tint(accent, tintAmount));
}
