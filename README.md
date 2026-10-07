# MimeForge

Generate **file-type icons as SVG** from a file extension: a page body with a type emblem, plus a colored label
with the extension (`PDF`, `DOCX`, …). Bodies, label font and colors are all pluggable.

- ~1.3 KB per icon, deterministic output, no runtime font needed (label glyphs are paths)
- 24 body types, ~1,300 known extensions (via `mime-db` + extras), unknown ones fall back to a generic body
- Size is up to the consumer: `<img src="pdf.svg" width="16">`, `width="1024"` — it is just an SVG

```bash
npm i && npm run build
npx mimeforge pdf docx webm -o icons          # → icons/pdf.svg …
npx mimeforge --all -o icons                  # every known extension + manifest.json
npx mimeforge --test-run                      # HTML preview: all body types at 16/48/128 px
npx mimeforge pdf docx --png 16,20,32,48 -o icons   # also PNGs → icons/<size>/<ext>.png
```

## Options

| Flag | |
|---|---|
| `--test-run` | write `out/test-run/index.html` (+ `svg/`): every body type with its color, plus a label-length stress test, as plain `<img>` at 16 / 48 / 128 px |
| `--font <spec>` | `monogram` (default), a `.ttf` / `.otf` / `.woff` file, or a bitmap-font `.json` |
| `--body <path>` | a directory of `<category>.svg` bodies, or one `.svg` for every type — see [docs/BODY-SPEC.md](docs/BODY-SPEC.md) |
| `--color pdf=#d00` / `--color .docx=#06c` | accent per category or per extension (repeatable) |
| `--colors file.json` | the same as a JSON object |
| `--accent #hex` | one accent for every icon |
| `--label-case upper\|lower\|none`, `--no-label` | label text options |
| `--png 16,32,48` | also write PNGs to `<out>/<size>/<ext>.png` (uses the optional dependency `@resvg/resvg-js`) |
| `--config <file>` | JSON config, default `./mimeforge.config.json` (flags override it) |
| `-o, --out <dir>`, `--list` | output directory; list `ext category` |

All options combine with `--test-run`, e.g. `npx mimeforge --test-run --font MyFont.ttf --body ./my-bodies`.

### Config file

```json
{
  "out": "icons",
  "font": "monogram",
  "body": "./my-bodies",
  "colors": { "pdf": "#d00", ".docx": "#06c" },
  "labelCase": "upper",
  "png": [16, 32, 48]
}
```
Relative `out`, `font` and `body` paths are resolved against the config file.

## API

```ts
import { renderIcon, loadFont, loadBodies, createPalette } from 'mimeforge';

renderIcon('pdf').svg;                                        // string
renderIcon('docx', { accent: '#0a7', label: 'WORD' }).svg;
renderIcon('xyz', { font: loadFont('MyFont.ttf'), bodies: loadBodies('./bodies'),
                    palette: createPalette({ pdf: '#d00', '.zip': '#fa0' }) });
```

## How it works

The 24 types: generic, text, code, data, pdf, word, sheet, slides, image, audio, video, archive, font, ebook, database, executable, security, model3d, geo, mail, science, disk, design, game.

1. extension → category: our overrides (`py`, `tsx`, `vue`, …) first, then every mime type of the extension from `mime-db`.
2. category → body SVG; the placeholder colors `#FF00FF` / `#FF99FF` become the accent and its tint.
3. the label band (26 units wide, overhanging the page) is added; text color flips to dark on light accents (WCAG contrast 3:1).
   Text longer than the band is scaled down proportionally.

### Label fonts
- **Bitmap fonts** (default Monogram, 5×7, fixed width): drawn as rectangles in whole-pixel steps, so they are crisp when the
  icon is shown at multiples of 48 px and stay clean vectors everywhere else. The 7 glyph rows are stretched to 9 cell rows.
  JSON schema: `{ "name", "cols", "rows", "descender"?, "advance", "glyphs": { "A": ["#.#", …] } }`
  (`rows + descender` strings of `#`/`.` per glyph; see `assets/fonts/monogram.json`).
- **Outline fonts** (`.ttf/.otf/.woff`): glyph outlines become SVG paths, scaled so the capital height matches the label.

## Develop
`npm test` (vitest) · `npm run dev -- pdf` · `npm run extract-font` (regenerates the Monogram bitmap table)

## License
MIT. Third-party material: [THIRD_PARTY.md](THIRD_PARTY.md).
