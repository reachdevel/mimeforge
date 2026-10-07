# Changelog

All notable changes are listed here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the
project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

- Fallback icon: `mimeforge default` and `mimeforge --all` write `default.svg` (generic body without a label), and
  `--png` adds `<size>/default.png`; library: `renderDefaultIcon()`. For apps that need a file to point at when an
  extension has no icon.
- PNG export no longer loads system fonts: `--all --png 16` takes about half a second instead of minutes.

## [0.1.2] - 2026-10-08

Documentation only.

- README: separate install paths (npx, global, project dependency, from source), a "use it in a project" example,
  library install and ESM notes

## [0.1.1] - 2026-10-08

Maintenance release, the first one published through GitHub Actions (npm Trusted Publishing). No code changes.

- README: npm version badge
- Repository metadata, issue and pull request templates, publish workflow guard

## [0.1.0] - 2026-10-07

First release.

- 24 bundled icon bodies and a bitmap label font (Monogram, CC0)
- ~1,365 extensions mapped to categories from mime-db plus curated mappings
- CLI: `--all`, `--list`, `--test-run`, `--font`, `--body`, `--color`, `--colors`, `--accent`, `--label-case`, `--no-label`,
  `--png`, `--config`
- Library API: `renderIcon`, `loadFont`, `loadBodies`, `createPalette` and friends
- Pluggable fonts (bitmap JSON, TTF, OTF, WOFF), bodies (directory or single SVG) and colors (per category or extension)
