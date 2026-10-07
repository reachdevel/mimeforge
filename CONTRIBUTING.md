# Contributing

Thanks for helping. Small, focused pull requests are easiest to review.

## Setup

```bash
git clone https://github.com/reachdevel/mimeforge.git
cd mimeforge
npm install        # installs and builds
npm test           # vitest
```

Node.js 20 or newer. The source is TypeScript (ESM) in `src/`; `npm run dev -- pdf` runs the CLI from source,
`npm run test-run` writes the HTML preview page to `out/test-run/`.

## Common contributions

| I want to… | Where |
|---|---|
| fix or add an extension mapping | `src/categories.ts`, see [docs/categories.md](docs/categories.md); add a case to `tests/categories.test.ts` |
| change a default color | `src/palette.ts` |
| improve or add a body | `assets/bodies/`, follow [docs/bodies.md](docs/bodies.md); check it with `mimeforge --test-run` |
| add a category | [docs/categories.md](docs/categories.md#add-a-category) |
| support another font format | `src/font.ts`, see [docs/fonts.md](docs/fonts.md) |

## Before you open a pull request

- `npm test` passes and `npx tsc --noEmit` is clean.
- Visual changes: attach a screenshot of `mimeforge --test-run`, and run `npm run build && npm run preview` if the
  preview image in `docs/` changes.
- Bodies must follow the contract in [docs/bodies.md](docs/bodies.md): original artwork, no company logos or
  look-alikes of trademarked logos. Icons that represent a *kind of file* (a document, a disc, a gamepad) are welcome;
  brand marks are not.
- Fonts and other third-party files need a license that allows redistribution; add them to
  [THIRD_PARTY.md](THIRD_PARTY.md) with the license text under `third_party/`.
- Keep the output deterministic: the same input must produce the same SVG bytes.

## Releasing (maintainers)

1. Update `CHANGELOG.md` and bump `version` in `package.json` (`npm version patch|minor` also tags).
2. Push the commit and the tag: `git push origin main --follow-tags`.
3. The `Publish` workflow tests and publishes to npm using Trusted Publishing (configured once under the package's
   settings on npmjs.com; the very first version has to be published by hand with `npm publish`).

## Reporting problems

Open an [issue](https://github.com/reachdevel/mimeforge/issues) (or write to reachdevel@gmail.com) with the extension, the command or API call, and (for visual problems) the SVG you got.

By contributing you agree that your contribution is licensed under the [MIT License](LICENSE).
