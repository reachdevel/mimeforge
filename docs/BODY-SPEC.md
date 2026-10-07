# Body spec

A **body** is the SVG that holds the page shape and the type emblem (PDF flame, music note, …). The generator adds the
colored **label** (the extension text) on top. Anyone can supply their own bodies with `--body`.

## Files
- `--body <dir>`: `<category>.svg` for any of the 24 categories
  (`generic text code data pdf word sheet slides image audio video archive font ebook database executable security model3d geo mail science disk design game`).
  Missing categories fall back to the directory's `generic.svg`, then to the bundled body.
- `--body <file.svg>`: one SVG used for every type.

## Contract
| Rule | Why |
|---|---|
| Root is `<svg xmlns=… viewBox="0 0 32 32">` | the label geometry lives in the same 32×32 space |
| The accent color appears literally as **`#FF00FF`** (every place the category color is used) | replaced by the icon's accent |
| The lighter accent tint appears literally as **`#FF99FF`** (optional) | replaced by `tint(accent, 55%)` |
| Nothing is drawn in the **label zone** x 3–29, y 19.3–28 (bottom-aligned) | the generator draws the band there |
| Plain shapes, solid fills; no gradients, filters, masks, clip-paths, `<style>` or `<text>` | identical rendering everywhere, tiny files |
| File ends with `</svg>` | the label is injected before it |

The bundled bodies use: page x 5–27, y 2–30, 22×28 units, 1 unit outline `#B8BFC7`; fold triangle in its own
`<g id="fold">` drawn **last** so it covers emblem parts that reach the corner; emblem inside x 9–23, y 6–18.
Neutral colors used: `#FFFFFF #E3E7EB #B8BFC7 #5B6470`.

The tokens are configurable in the API (`loadBodies(path, { accent, tint })`), so bodies drawn with other placeholder colors work too.
`mimeforge` warns (stderr) when a custom body breaks the first rules.

`docs/body-design-prompt.md` (first 21) and `docs/body-design-prompt-v2.md` (disk, design, game) are the prompts that produced the bundled set with an AI design tool.
