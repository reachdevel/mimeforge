# Bodies

A **body** is the SVG that holds the page shape and the type emblem (the PDF flame, the music note, …). MimeForge adds
the colored extension **label** on top and recolors the body with the icon's accent color.

MimeForge ships 24 bodies in `assets/bodies/`, one per [category](categories.md). You can replace all of them or just
some, with `--body`.

## Using your own bodies

```bash
mimeforge --test-run --body ./my-bodies      # a directory of <category>.svg
mimeforge --all --body ./one-shape.svg       # one SVG for every category
```

- **Directory:** file names are category names (`pdf.svg`, `code.svg`, …, see the list in [categories.md](categories.md)).
  A category without a file falls back to your `generic.svg`, then to the bundled body. Other file names are ignored.
- **Single file:** used for every category.

`mimeforge --test-run --body …` shows every category with your bodies, so you can check them at 16, 48 and 128 px.

## The contract

| Rule | Why |
|---|---|
| The root is `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">` | the label geometry uses the same 32×32 space |
| The accent color appears literally as **`#FF00FF`** everywhere the category color should be used | it is replaced by the icon's accent |
| The lighter tint appears literally as **`#FF99FF`** (optional) | it is replaced by the accent mixed 55 % towards white |
| Leave the **label zone** empty: x 3 to 29, y 19.3 to 28 | the label band is drawn there, on top of the body |
| Use plain shapes with solid fills. No gradients, filters, masks, clip paths, `<style>`, `<text>` | identical rendering everywhere, tiny files |
| The file ends with `</svg>` | the label is inserted just before it |

MimeForge warns on stderr when a body breaks the first, second or last rule.

The placeholder colors can be changed in the library API: `loadBodies(path, { accent: '#123456', tint: '#abcdef' })`.

## Skeleton of a bundled body

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
<g id="page">
<path d="M7.5 2.5H19.5L26.5 9.5V27.5A2 2 0 0 1 24.5 29.5H7.5A2 2 0 0 1 5.5 27.5V4.5A2 2 0 0 1 7.5 2.5Z" fill="#FFFFFF" stroke="#B8BFC7" stroke-linejoin="round"/>
</g>
<g id="emblem">
  <!-- emblem, drawn in accent #FF00FF and tint #FF99FF -->
</g>
<g id="fold">
<path d="M19.5 2.5V7.5Q19.5 9.5 21.5 9.5H26.5Z" fill="#E3E7EB"/>
<path d="M19.5 2.5V7.5Q19.5 9.5 21.5 9.5H26.5Z" fill="none" stroke="#B8BFC7" stroke-linejoin="round"/>
</g>
</svg>
```

The bundled set uses these conventions (you do not have to):

- page x 5 to 27, y 2 to 30 (22 × 28 units), 1 unit outline `#B8BFC7`, rounded corners of radius 2
- the folded corner is its own group, drawn last, so it covers parts of the emblem that reach the corner
- emblem inside x 9 to 23, y 6 to 18, bold shapes (at least 2 units wide), at most about three shapes, readable at 16 px
- neutrals `#FFFFFF`, `#E3E7EB`, `#B8BFC7`; a shape that should look cut out of an accent shape is painted `#FFFFFF`

## Generating new bodies with an AI design tool

The bundled bodies were designed with an AI design tool. A prompt template that works well, with the skeleton
attached as a reference (replace the bracketed parts):

```text
I have a family of file-type icon bodies in one flat style (reference SVGs attached). I need [N] more in exactly the
same style: [names]. Each is the same document-page silhouette with a category emblem. The extension label is added
later by code, so draw no text or letters.

Rules: solid fills only (no gradients, shadows, filters, masks, clip-paths, styles, classes, opacity tricks); bold
shapes with round caps and joins, minimum feature and gap size 2 units, at most about 3 shapes, readable at 16x16 px.
viewBox 0 0 32 32. The accent color is the literal #FF00FF and its lighter tint the literal #FF99FF; besides those only
#FFFFFF, #E3E7EB, #B8BFC7, #5B6470. Use the attached skeleton verbatim for the "page" and "fold" groups and design only
the contents of "emblem". Keep the emblem inside x 9-23, y 6-18 and nothing below y = 18 (a label band covers y 19.3-28).
The folded corner is drawn last and covers whatever reaches it.

Emblems:
1. [name]: [what to draw]
...

First deliver one preview sheet only: the new icons at 32 px and 16 px on white and on dark gray, next to three of the
attached icons so I can judge consistency. I will ask for the SVG files after reviewing it.
```

Then run `mimeforge --test-run --body ./new-bodies` and check the colors, the 16 px rendering and the warnings.
