# Fonts

The label font is chosen with `--font` (or `font` in the config file, or `loadFont()` in the API):

| Spec | Result |
|---|---|
| `monogram` or nothing | the built-in pixel font (bitmap table in `assets/fonts/monogram.json`) |
| `path/to/font.json` | a bitmap font in the JSON format below |
| `path/to/font.ttf`, `.otf`, `.woff` | an outline font (`.woff2` is not supported) |

Glyphs are always converted to SVG shapes, so the finished icons do not need the font at runtime.

## Bitmap font format

```json
{
  "name": "Tiny",
  "cols": 3,
  "rows": 3,
  "descender": 0,
  "advance": 4,
  "glyphs": {
    "A": ["###", "#.#", "#.#"],
    "B": ["##.", "###", "##."]
  }
}
```

| Field | Meaning |
|---|---|
| `cols` | glyph width in cells |
| `rows` | rows above the baseline (the "capital height") |
| `descender` | optional extra rows below the baseline (for `Q`, `g`, …) |
| `advance` | distance from one glyph to the next, in cells (width plus spacing). All glyphs share it, so bitmap fonts are monospaced |
| `glyphs` | one entry per character; each is `rows + descender` strings of exactly `cols` characters, `#` filled, `.` empty |

Optional metadata (`author`, `license`, `source`) is ignored by the renderer.

How it is drawn: every filled cell run becomes a rectangle. The label text is 6 units tall (9 cells of 2/3 unit, which
is one pixel of a 48 px rendering). A font with `rows: 7` such as Monogram is stretched to 9 cell rows by doubling a
few rows; a font with a different `rows` is stretched the same way, so very small fonts look chunkier.
Characters missing from `glyphs` are skipped.

Letter case: the label is uppercase by default (`--label-case`). Put both cases into `glyphs` if you need `lower`.

## Outline fonts

Outline glyphs are converted to paths and scaled so the height of the capital `H` is 6 units. Advance widths are used
as they are (no kerning). The font needs the characters you use (digits and letters for most extensions).

## Regenerating the built-in font

`assets/fonts/monogram.json` is generated from the Monogram TTF (CC0, in `third_party/monogram/`) by sampling each
glyph into a 5 × 7 grid plus one descender row:

```bash
npm run extract-font
```

## Licenses

Check the license of any font you use. The bundled Monogram is CC0 (see [THIRD_PARTY.md](../THIRD_PARTY.md)).
Icons made with a font are usually fine to distribute, but some font licenses restrict embedding glyph outlines.
