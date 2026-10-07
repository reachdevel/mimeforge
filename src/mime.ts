import { createRequire } from 'node:module';
import { classify, EXT_OVERRIDES, type Category } from './categories.js';

type MimeDb = Record<string, { extensions?: string[]; source?: string }>;
const require = createRequire(import.meta.url);

let cache: Map<string, string[]> | undefined;

/** extension → all registered mime types, built from the `mime-db` package (MIT). */
export function extToMime(): Map<string, string[]> {
  if (cache) return cache;
  const db = require('mime-db') as MimeDb;
  const map = new Map<string, string[]>();
  for (const [mime, info] of Object.entries(db)) for (const ext of info.extensions ?? []) {
    const list = map.get(ext);
    if (list) list.push(mime); else map.set(ext, [mime]);
  }
  return (cache = map);
}

export function categoryFor(ext: string): Category {
  const e = ext.toLowerCase().replace(/^\./, '');
  return classify(e, extToMime().get(e));
}

/** Every extension we know about (mime-db + our own overrides), sorted. */
export function allExtensions(): string[] {
  return [...new Set([...extToMime().keys(), ...EXT_OVERRIDES.keys()])].sort();
}
