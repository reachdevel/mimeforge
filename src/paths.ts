import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

/** Package root. Works from both `src/` and `dist/` (both sit one level below the root). */
export const ROOT = fileURLToPath(new URL('..', import.meta.url));
export const assetPath = (...parts: string[]): string => join(ROOT, 'assets', ...parts);
