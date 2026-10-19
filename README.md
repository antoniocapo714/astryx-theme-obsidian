<p align="center">
  <img src="docs/banner.png" alt="Obsidian: real Astryx components wearing the theme, arranged around the wordmark" width="100%">
</p>

<h1 align="center">Obsidian</h1>

<p align="center">
  A dark-only theme for the <a href="https://github.com/facebook/astryx">Astryx</a> design system,<br>
  built for dense, data-heavy interfaces.
</p>

<p align="center">
  <b>Version 0.1</b> · Built on <a href="https://github.com/facebook/astryx">Astryx 0.7</a> and <a href="https://react.dev">React 19+</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-0.1.0-2D72D2?labelColor=1A1D21" alt="Version 0.1.0">
  <img src="https://img.shields.io/badge/license-MIT-238551?labelColor=1A1D21" alt="MIT licence">
  <img src="https://img.shields.io/badge/astryx-0.7-8A8F98?labelColor=1A1D21" alt="Astryx 0.7">
  <img src="https://img.shields.io/badge/WCAG_2.2-AA_tested-6FA6E8?labelColor=1A1D21" alt="WCAG 2.2 AA, tested">
</p>

<p align="center">
  <a href="https://antoniocapo714.github.io/astryx-theme-obsidian/"><img src="https://img.shields.io/badge/Demo-live-2D72D2?labelColor=1A1D21" alt="Live demo"></a>
</p>

<p align="center">
  <a href="https://antoniocapo714.github.io/astryx-theme-obsidian/"><b>Live demo</b></a> ·
  <a href="#getting-started"><b>Getting started</b></a> ·
  <a href="#customize"><b>Customize</b></a> ·
  <a href="CHANGELOG.md"><b>Changelog</b></a>
</p>

## Overview

Obsidian is a theme for Astryx, Meta's open source design system. It changes nothing in how you build: the same components, the same props, the same CLI. It changes how they look: near-black surfaces, depth made of light, and a strict brightness hierarchy that keeps dense screens readable.

The [live demo](https://antoniocapo714.github.io/astryx-theme-obsidian/) shows every part of it on real Astryx components.

**What makes Obsidian different:**

- **Depth by light, not shadow.** Surfaces are translucent white veils over a near-black body, and each step up is a little more light: 2% for muted wells, 3% for cards, 4% on hover, 6% when selected. Cards never cast a shadow.
- **Brightness is the hierarchy.** Text comes in four steps, and the brightest is kept for the values and titles that matter. Hover and selection change brightness and veil together, with no coloured bars or accent tints.
- **Dark only, for real.** Every color is a single value, including the ones it inherits from Astryx, so nothing turns light when the system preference is light.
- **Accessible by contract.** Text reaches 4.5:1 on every surface, and the edge of every control reaches 3:1. A test suite enforces both, so a change that breaks them fails.

![The showcase: the side navigation is the page's own table of contents](docs/screenshot.png)

![Form controls, status and the table in Obsidian](docs/screenshot-controls.png)

## Getting started

Obsidian needs `@astryxdesign/core` 0.7 and React 19 or later. It is installed straight from this repository; it is not on the npm registry.

```bash
npm install github:antoniocapo714/astryx-theme-obsidian
npx astryx theme add obsidian --package astryx-theme-obsidian
```

`theme add` writes the imports for the built theme, its stylesheet and its fonts into your generated theme module. Apply it with `mode="dark"`:

```tsx
import {Theme} from '@astryxdesign/core/theme';
import {themes} from './astryx-themes';

<Theme theme={themes.obsidian} mode="dark">
  <App />
</Theme>
```

### Keep `@scope` in your production build

The theme ships as CSS `@scope` rules. esbuild, Vite's default CSS minifier, removes them without a warning, so the theme works in development and disappears in production. Use Lightning CSS:

```ts
// vite.config.ts
export default defineConfig({
  build: {cssMinify: 'lightningcss', cssTarget: ['chrome118', 'safari17', 'firefox128']},
});
```

`@scope` needs Chrome 118, Safari 17.4 or Firefox 128 or later.

### Page background

`AppShell` paints the page background. If a page doesn't use it, the browser's default dark grey shows around your content. Set it yourself:

```css
body {
  background: var(--color-background-body);
}
```

### Wiring it by hand

Without the CLI, import the built theme and its two stylesheets:

```tsx
import {Theme} from '@astryxdesign/core/theme';
import {obsidianTheme} from 'astryx-theme-obsidian/themes/obsidian';
import 'astryx-theme-obsidian/themes/obsidian.fonts.css';
import 'astryx-theme-obsidian/themes/obsidian.css';

<Theme theme={obsidianTheme} mode="dark">
  <App />
</Theme>
```

## Colors

Contrast ratios are measured against the body (`#08090A`), a card and a popover.

| Role | Token | Value | Body | Card | Popover |
|---|---|---|---|---|---|
| Primary text | `--color-text-primary` | `#F7F8F8` | 18.7 | 17.8 | 15.9 |
| Secondary text | `--color-text-secondary` | `#8A8F98` | 6.1 | 5.8 | 5.2 |
| Accent text | `--color-text-accent` | `#6FA6E8` | 7.9 | 7.5 | 6.7 |
| Disabled text | `--color-text-disabled` | `#62666D` | 3.5 | 3.3 | 2.9 |
| Control edge | `--color-border-emphasized` | `#65686D` | 3.6 | 3.4 | 3.0 |
| Switch track | `--color-track` | `#65686D` | 3.6 | 3.4 | 3.0 |
| Accent, focus ring | `--color-accent` | `#2D72D2` | 4.2 | 4.0 | 3.6 |

| Filled control | Fill | Label | Contrast |
|---|---|---|---|
| Accent | `#2D72D2` | `#FFFFFF` | 4.7 |
| Success | `#238551` | `#FFFFFF` | 4.6 |
| Error | `#CD4246` | `#FFFFFF` | 4.7 |
| Warning | `#C87619` | `#0D0E10` | 5.6 |

The chart colors (`--color-data-*`) are Astryx's dark defaults in this version.

## Typography

| Role | Family | Notes |
|---|---|---|
| Body | Inter Variable | |
| Headings | Space Grotesk Variable | Weight 510, -0.02em tracking. |
| Code | Space Mono | |

The fonts are self-hosted through [Fontsource](https://fontsource.org) and loaded by `obsidian.fonts.css`. Inter and Space Grotesk must be the variable versions: the theme uses weight 510, and with static files the browser renders the 700 Bold instead.

The scale starts at 14 px with a ratio of 1.25. No size goes below 10 px, and the smallest heading is 11 px.

## Accessibility

- Text that carries meaning reaches 4.5:1 on every surface (WCAG 1.4.3).
- Anything that identifies a control or its state reaches 3:1: input edges, an unchecked checkbox, a switch that is off, and the focus ring (WCAG 1.4.11).
- Disabled text is exempt and measures 2.9–3.5:1.
- Plain dividers (`--color-border`) stay faint on purpose. They are decoration, so don't make one the only edge of something a user has to find.

## Customize

Extend the theme rather than copying it, so you keep receiving its fixes:

```ts
import {defineTheme} from '@astryxdesign/core/theme';
import {obsidianTheme} from 'astryx-theme-obsidian/themes/obsidian';

export const myTheme = defineTheme({
  name: 'my-theme',
  extends: obsidianTheme,
  tokens: {
    '--color-accent': '#7C5CFF',
  },
});
```

Build it with `npx astryx theme build`. If you change a color, check it against the tables above; `test/contrast.test.ts` shows how to measure it.

## Develop

```bash
bun install
bun run build         # themes/obsidian/obsidianTheme.ts → obsidian.css / .js / .d.ts
bun run demo          # the showcase at http://localhost:5173
bun run test          # contrast and token tests
npx playwright test   # the theme as the browser renders it
```

After upgrading `@astryxdesign/core`, run `bun run bake` to refresh `themes/obsidian/darkDefaults.ts`, then `bun run build`. Every push to `main` runs the tests and publishes the showcase to GitHub Pages.

## License

[MIT](LICENSE)
