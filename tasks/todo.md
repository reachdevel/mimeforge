# MimeForge – TODO

## Done (v0.1)
- [x] Clean project, TS/ESM, vitest (122 tests), CI workflow
- [x] 24 bundled bodies (assets/bodies) + Monogram bitmap font (CC0)
- [x] extension → category: overrides + all mime-db mimes (multi-mime aware); generic 499 → 284 of 1365
- [x] SVG renderer: recolor tokens, label band, auto text color, proportional shrink
- [x] CLI: `--test-run`, `--font`, `--body`, `--color(s)`, `--accent`, `--all`, `--list`, `--png`, `--config`
- [x] Config file (`mimeforge.config.json`), optional PNG export (`@resvg/resvg-js`)
- [x] `-`, `_` and `Q` glyphs verified in labels
- [x] Name check: `mimeforge` free on npm and GitHub search (2026-10-07)
- [x] Brand-logo bodies deliberately NOT in core (trademark risk)

## Next
- [ ] Create the GitHub repo, push, set the `repository` field in package.json, first npm release
- [ ] Triage of the remaining 284 generic extensions (mostly obscure vendor formats; see `mimeforge --list`)
- [ ] Optional: `diagram` body (Visio-like formats now live under `design`), dark-theme palette variant
- [ ] Optional: more fonts bundled (Tom Thumb / Tiny5 bitmap JSON) as `--font` presets
- [ ] Final cleanup outside this repo: old exploration folders next to it (`file-icon-generator`, `fileicons`, `filesvg`, `fonts`)
