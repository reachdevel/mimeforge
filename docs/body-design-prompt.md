# Claude Design prompt – file-type icon bodies (SVG)


Design a consistent set of **21 file-type icon bodies** as individual SVG files, for a file-icon library. Each icon is a "document page" silhouette with a category emblem on it. A separate generator will later draw the extension label (e.g. "PDF", "AAC") and tint the accent color, so **do not draw any text or letters**.

## Overall style
- Flat, modern, friendly, slightly geometric. One coherent family: same page silhouette, same corner radius, same stroke weight, same level of detail in every icon.
- No gradients, no drop shadows, no blur, no filters, no masks, no clip-paths, no opacity tricks on groups. Plain `<path>`, `<rect>`, `<circle>`, `<polygon>` with solid fills only (so it rasterizes identically everywhere).
- Page: light neutral body (#FFFFFF fill) with a 1-unit mid-gray outline (#B8BFC7), a folded top-right corner (the fold triangle in #E3E7EB), rounded corners (radius 2).
- Emblem: simple, bold, instantly readable at **16×16 px**. Minimum stroke/feature width 2 units. Maximum ~3 shapes per emblem. Use a single accent color for the emblem, plus at most one lighter tint of it.

## Canvas and layout (strict, identical in all files)
- `viewBox="0 0 32 32"`, `width="32" height="32"`, no other attributes on the root except `xmlns`.
- Page silhouette occupies x 5–27, y 2–30 (22 × 28 units), fold corner 7 units at top right.
- **Label zone (leave empty, the generator draws here):** x 3–29, y 20–28. Nothing but the page body may be under it; do not put emblem parts in it.
- **Emblem zone:** x 9–23, y 6–18 (14 × 12 units), centered. Keep all emblem shapes inside it.

## Color tokens (very important)
- The category accent color must be the literal color **`#FF00FF`** everywhere it appears (the generator replaces it per category). Lighter tint of the accent: **`#FF99FF`**. Use no other chromatic colors; neutrals only (#FFFFFF, #E3E7EB, #B8BFC7, #5B6470).
- Give the root `<g>` elements stable ids: `id="page"`, `id="emblem"`.

## The 21 icons (file name → emblem idea)
1. `generic.svg` – plain page, small "dog-ear" mark only (a neutral fallback), emblem: three short horizontal lines
2. `text.svg` – 4 text lines of varying length
3. `code.svg` – `</>` angle brackets with slash, built from paths
4. `data.svg` – curly braces `{ }` suggesting structured data (json/xml/yaml)
5. `pdf.svg` – a bold curved ribbon/flame shape, abstract (not the Adobe logo)
6. `word.svg` – a text block with a bold heading bar above it
7. `sheet.svg` – 3×3 grid/table with a header row
8. `slides.svg` – a rounded screen/rectangle with a simple bar-chart or pie wedge
9. `image.svg` – mountains + sun in a frame
10. `audio.svg` – a musical note (eighth note) or speaker with waves
11. `video.svg` – play triangle inside a rounded rectangle
12. `archive.svg` – a zipper line down the center of the page (alternating teeth)
13. `font.svg` – a bold serif "A"-like glyph built from paths (an abstract letterform, not real text)
14. `ebook.svg` – an open book
15. `database.svg` – a cylinder (three stacked ellipses)
16. `executable.svg` – a small gear or a terminal prompt `>_` built from paths
17. `security.svg` – a key or padlock
18. `model3d.svg` – an isometric cube
19. `geo.svg` – a map pin
20. `mail.svg` – an envelope
21. `science.svg` – a flask or a hexagon molecule

## Deliverables
- 21 separate SVG files with the names above, plus one preview sheet showing all 21 at 32 px and at 16 px side by side on white and on dark gray (#1E2227), to check consistency and 16 px legibility.
- Keep the SVG markup minimal and clean (no editor metadata, no inline styles, no classes; presentation attributes like `fill` only; coordinates as integers or .5 where possible).
- Verify before finishing: every emblem fits the emblem zone, nothing overlaps the label zone, and only the allowed colors are used.
