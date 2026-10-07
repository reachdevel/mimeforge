export type RGB = [number, number, number];

export function parseHex(input: string): RGB {
  let h = input.trim().replace(/^#/, '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (!/^[0-9a-fA-F]{6}$/.test(h)) throw new Error(`Invalid hex color: "${input}"`);
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

export function toHex([r, g, b]: RGB): string {
  return '#' + [r, g, b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('').toUpperCase();
}

/** Normalize any accepted hex notation to `#RRGGBB`. */
export const normalizeHex = (input: string): string => toHex(parseHex(input));

/** Mix a color towards white by `t` (0 = unchanged, 1 = white). */
export function tint(hex: string, t: number): string {
  const [r, g, b] = parseHex(hex);
  return toHex([r + (255 - r) * t, g + (255 - g) * t, b + (255 - b) * t]);
}

/** WCAG relative luminance. */
export function luminance(hex: string): number {
  const lin = parseHex(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** White label text unless the accent is too light for it; then a dark ink. */
export function labelTextColor(accent: string, light = '#FFFFFF', dark = '#1B1F24', minContrast = 3): string {
  return contrast(accent, light) >= minContrast ? light : dark;
}
