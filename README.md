# Obsidian

A dark-only theme for [Astryx](https://github.com/facebook/astryx), built for dense, data-heavy interfaces. Depth comes from light instead of shadow, and brightness carries the hierarchy.

![The Obsidian theme: side navigation, type scale, buttons and cards](docs/screenshot.png)

![Form controls, status banners, badges and a table in Obsidian](docs/screenshot-controls.png)

## Install

```bash
npm install github:antoniocapo714/astryx-theme-obsidian
npx astryx theme add obsidian --package astryx-theme-obsidian
```

The package is installed straight from this repository; it is not on the npm registry.

`theme add` writes the imports for the built theme, its stylesheet and its fonts into your generated theme module. Apply it with `mode="dark"`:

```tsx
import {Theme} from '@astryxdesign/core/theme';
import {themes} from './astryx-themes';

<Theme theme={themes.obsidian} mode="dark">
  <App />
</Theme>
```

### Page background

`AppShell` paints the page background. If a page doesn't use it, the browser's default dark grey shows around your content. Set it yourself:

```css
body {
  background: var(--color-background-body);
}
```

### Wiring it by hand

```tsx
import {Theme} from '@astryxdesign/core/theme';
import {obsidianTheme} from 'astryx-theme-obsidian/themes/obsidian';
import 'astryx-theme-obsidian/themes/obsidian.fonts.css';
import 'astryx-theme-obsidian/themes/obsidian.css';

<Theme theme={obsidianTheme} mode="dark">
  <App />
</Theme>
```

## Requirements

- `@astryxdesign/core` 0.7.x and React 19.
- A browser with CSS `@scope`: Chrome 118, Safari 17.4, Firefox 128 or later.
- **A CSS minifier that keeps `@scope`.** esbuild, Vite's default, removes `@scope` rules without a warning, and the theme disappears from your production build while working fine in development. Use Lightning CSS:

  ```ts
  // vite.config.ts
  export default defineConfig({
    build: {cssMinify: 'lightningcss', cssTarget: ['chrome118', 'safari17', 'firefox128']},
  });
  ```

## Dark only

Every color in the theme is a single value. Tokens it does not design are taken from Astryx's own dark defaults, so nothing turns light when the system preference is light. Passing `mode="dark"` to `<Theme>` also makes scrollbars and native form controls match.

## Design principles

1. **Depth by light, not shadow.** Surfaces are translucent white veils over a near-black body. Each step up is a little more light: 2% for muted wells, 3% for cards, 4% on hover, 6% when selected, 8% when pressed. Cards never cast a shadow.
2. **Brightness is the hierarchy.** Text comes in four steps, and the brightest is kept for the values and titles that matter.
3. **One gesture per state.** Hover and selection change brightness and veil together. There is no coloured bar and no accent tint on a selected item.
4. **Small, consistent radii.** 4, 6 and 8 px, and fully round where a shape should be round.

The side navigation floats on a deeper canvas as a rounded, blurred panel.

## Colors

Contrast ratios are measured against the body (`#08090A`), a card, and a popover. The test suite enforces them.

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

## Typography

| Role | Family | Notes |
|---|---|---|
| Body | Inter Variable | |
| Headings | Space Grotesk Variable | Weight 510 with -0.02em tracking. |
| Code | Space Mono | |

The fonts are self-hosted through [Fontsource](https://fontsource.org) and loaded by `obsidian.fonts.css`. Inter and Space Grotesk must be the variable versions, because the theme uses weight 510; with static files the browser renders the 700 Bold instead.

The scale starts at 14 px with a ratio of 1.25. No size goes below 10 px, and the smallest heading is 11 px.

## Accessibility

- Text that carries meaning reaches 4.5:1 on every surface (WCAG 1.4.3).
- Anything that identifies a control or its state reaches 3:1: input edges, an unchecked checkbox, a switch that is off, and the focus ring (WCAG 1.4.11).
- Disabled text is exempt and measures 2.9–3.5:1.
- Plain dividers (`--color-border`) stay faint on purpose. They are decoration, so don't use them as the only edge of something a user has to find.

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

Then build it with `npx astryx theme build`. If you change a color, check it against the tables above. `test/contrast.test.ts` shows how to measure it.

## Develop

```bash
bun install
bun run build      # themes/obsidian/obsidianTheme.ts → obsidian.css / .js / .d.ts
bun run demo       # specimen page at http://localhost:5173
bun run test       # contrast and token tests
npx playwright test   # the theme as the browser renders it
```

After upgrading `@astryxdesign/core`, run `bun run bake` to refresh `themes/obsidian/darkDefaults.ts`, then `bun run build`.

## License

[MIT](LICENSE)
