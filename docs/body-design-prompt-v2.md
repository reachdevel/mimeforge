# Claude Design prompt – 3 new bodies (disk, design, game)

Attach these three existing files as style references: `assets/bodies/code.svg`, `assets/bodies/audio.svg`, `assets/bodies/image.svg`.
Then paste everything below the line.

---

I have a family of 21 file-type icon bodies (three are attached as references). I need **3 more in exactly the same style**:
`disk`, `design`, `game`. Each is the same document-page silhouette with a category emblem. The extension label (e.g. "ISO", "PSD", "ROM") is added later by code, so **draw no text or letters**.

## Rules (identical to the attached files)
- Flat and friendly, solid fills only: no gradients, shadows, blur, filters, masks, clip-paths, `<style>`, classes or opacity tricks. Plain `<path>`, `<rect>`, `<circle>`, `<polygon>`, `<ellipse>`.
- Same stroke language as the references: bold shapes, round caps and joins, minimum feature/gap size 2 units, at most ~3 shapes, readable at 16×16 px.
- Colors: accent is the literal **`#FF00FF`**, its lighter tint is the literal **`#FF99FF`**. Neutrals only besides those: `#FFFFFF`, `#E3E7EB`, `#B8BFC7`, `#5B6470`. Where a shape must look "cut out" of an accent shape, paint it `#FFFFFF` (no masks).
- `viewBox="0 0 32 32"`, `width="32" height="32"`.
- **Use this skeleton verbatim for `page` and `fold`; only design the contents of `emblem`:**

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
<g id="page">
<path d="M7.5 2.5H19.5L26.5 9.5V27.5A2 2 0 0 1 24.5 29.5H7.5A2 2 0 0 1 5.5 27.5V4.5A2 2 0 0 1 7.5 2.5Z" fill="#FFFFFF" stroke="#B8BFC7" stroke-linejoin="round"/>
</g>
<g id="emblem">
  <!-- your emblem -->
</g>
<g id="fold">
<path d="M19.5 2.5V7.5Q19.5 9.5 21.5 9.5H26.5Z" fill="#E3E7EB"/>
<path d="M19.5 2.5V7.5Q19.5 9.5 21.5 9.5H26.5Z" fill="none" stroke="#B8BFC7" stroke-linejoin="round"/>
</g>
</svg>
```

- **Emblem zone:** x 9–23, y 6–18, centered, nothing below y = 18 (a label band covers y 19.3–28 later). The folded corner (x 19.5–26.5, y 2.5–9.5) is drawn last and **covers** whatever reaches it, so the emblem must still read well with its top-right corner tucked behind the fold.

## The three emblems
1. **`disk`** (disk images, virtual machines, ISO/DMG/VMDK): an **optical disc seen from above**: one large circle (~12 units across) in `#FF00FF`, a white (`#FFFFFF`) spindle hole in the middle (~3.5 units), and one short lighter-tint (`#FF99FF`) arc or ring segment on the upper left as a sheen. Nothing else.
2. **`design`** (Photoshop/Illustrator/Sketch/Figma/Visio/Quark sources): a **vector pen-tool nib**, upright, pointing down: flat top, body narrowing to a point, a thin white slit down the middle ending in a white round hole, and a `#FF99FF` band across the shoulders. Generic nib, **not** any company's logo.
3. **`game`** (ROMs, game saves, interactive fiction): a **gamepad** seen from the front: a wide rounded body (~14 × 8 units) with two short grips at the bottom corners, a white plus-shaped D-pad on the left, two white round buttons on the right (one slightly lower than the other).

## Deliver (this round)
One preview sheet only: the 3 new icons at 32 px and 16 px, on white and on dark gray (`#1E2227`), each next to the three attached reference icons so I can judge consistency. Do **not** send SVG files yet; I will ask for them after I review the sheet.
