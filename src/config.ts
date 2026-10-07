import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

export interface Config {
  out?: string;
  font?: string;
  body?: string;
  /** Accent per category (`pdf`) or extension (`.docx`). */
  colors?: Record<string, string>;
  accent?: string;
  labelCase?: 'upper' | 'lower' | 'none';
  /** false = bodies only. */
  label?: boolean;
  /** Raster sizes for `--png`. */
  png?: number[];
}

export const CONFIG_FILE = 'mimeforge.config.json';

/**
 * Load a config file (`path`, or `./mimeforge.config.json` when it exists). Relative `out`, `font` and `body`
 * paths are resolved against the config file's directory.
 */
export function loadConfig(path?: string): { file: string; config: Config } | undefined {
  const file = path ? resolve(path) : resolve(CONFIG_FILE);
  if (!existsSync(file)) {
    if (path) throw new Error(`Config file not found: ${path}`);
    return undefined;
  }
  let config: Config;
  try { config = JSON.parse(readFileSync(file, 'utf8')) as Config; }
  catch (e) { throw new Error(`Invalid JSON in ${file}: ${(e as Error).message}`); }
  const dir = dirname(file);
  for (const k of ['out', 'font', 'body'] as const) {
    const v = config[k];
    // "monogram" is the built-in font name, not a path
    if (typeof v === 'string' && !(k === 'font' && v === 'monogram')) config[k] = resolve(dir, v);
  }
  return { file, config };
}
