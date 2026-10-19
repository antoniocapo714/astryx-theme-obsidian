# Instructions for AI agents working on this repository

This is **Obsidian**, a dark-only theme for the Astryx design system, shipped as an Astryx integration package.

## Layout

- `themes/obsidian/obsidianTheme.ts` — the theme source. The only place to change how the theme looks.
- `themes/obsidian/obsidian.css`, `obsidian.js`, `obsidian.d.ts`, `obsidian.css.d.ts` — **generated** by `bun run build`. Never edit by hand.
- `themes/obsidian/darkDefaults.ts` — **generated** by `bun run bake` from `@astryxdesign/core`. Never edit by hand.
- `themes/obsidian/obsidian.fonts.css` — the font loader `astryx theme add` imports.
- `astryx-docs/` — the doc topic apps read with `astryx docs theme`.
- `demo/` — the showcase published to GitHub Pages; `demo/ReadmeBanner.tsx` is the README banner (`?view=banner`).
- `test/` — `contrast.test.ts`, `dataviz.test.ts` (Vitest) and `render.e2e.ts` (Playwright).
- `scripts/fit-data-palette.mjs` — fits the chart colours; `scripts/bake-dark-defaults.mjs` — writes `darkDefaults.ts`.

## Commands

```bash
bun install
bun run build                  # after any change to obsidianTheme.ts
bun run test                   # contrast, token and chart-colour tests
npx playwright test            # the theme as the browser renders it
npx astryx integration verify  # the package as npm would publish it
SCREENSHOTS=1 npx playwright test   # refresh docs/*.png
```

## Rules

- **The contrast tests are the contract.** Text ≥ 4.5:1 on every surface, control edges ≥ 3:1, chart colours checked for colour-blind readers. If a change fails them, fix the change; never relax a threshold to make a test pass.
- **Dark-only.** Every colour token is a single value, never a `[light, dark]` pair. `test/contrast.test.ts` fails if any token differs between modes.
- **Run `bun run build` after editing the theme source** and commit the generated files with it. The built CSS is what apps load.
- **Upgrading `@astryxdesign/core`**: `bun run bake`, then `bun run build`, then all tests and `npx astryx integration verify`. Astryx renames component keys between minor versions; check `npx astryx theme targets`.
- **Spacing and type in the demo use tokens** (`--spacing-*`, `--font-size-*`), not hand-set pixels.
- **No product or personal names, and no other brands**, in code, comments, docs or demo content. Write documentation in English, short and plain.
- Production builds need a CSS minifier that keeps `@scope` (Lightning CSS). esbuild drops it silently.
