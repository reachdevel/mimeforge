# Categories and extension mapping

## The 24 categories

`generic text code data pdf word sheet slides image audio video archive font ebook database executable security model3d geo mail science disk design game`

Each category has one body in `assets/bodies/<category>.svg` and one default color in `src/palette.ts`.
`mimeforge --list` prints the category of every known extension, for example:

```bash
mimeforge --list | grep -i '^docx '      # docx word
mimeforge --list | grep ' game$' | head  # extensions in one category
```

## How an extension gets its category

`src/categories.ts` decides, in this order:

1. **Our extension tables** (`EXT_GROUPS` and `FUNCTION_MAP`). They cover popular formats that mime types describe badly or not
   at all (`py`, `tsx`, `vue`, `psd`, `rom`, `sqlite`, …) and formats we map by function (for example Google `gdoc` → `word`).
2. **Mime types** from [mime-db](https://github.com/jshttp/mime-db). An extension can have several mime types
   (`mp4` is both `application/mp4` and `video/mp4`); the first mime type that maps to a category wins. The rules are in
   `MIME_RULES`, first match wins, so specific rules come before broad ones.
3. **`generic`** when nothing matches.

Extensions that are ambiguous in the real world are deliberately left out (for example `bin`, `sc` or `gbr`).

## Change or add a mapping

Edit `src/categories.ts`:

- add the extension (lowercase, no dot) to the right string in `EXT_GROUPS`, or to `FUNCTION_MAP` as `ext: 'category'`;
- or add or adjust a regular expression in `MIME_RULES` to move a whole mime family.

Add a test in `tests/categories.test.ts`, then run `npm test`. From code you can also skip the lookup entirely with
`renderIcon(ext, { category: 'archive' })`.

## Add a category

1. Add the name to `CATEGORIES` (`src/categories.ts`) and a default color to `DEFAULT_PALETTE` (`src/palette.ts`).
2. Add the body `assets/bodies/<name>.svg` (see [bodies.md](bodies.md)).
3. Add a sample extension to `SAMPLES` in `src/testrun.ts` and to `scripts/make-preview.mjs`, map extensions to it, and run `npm test`.
