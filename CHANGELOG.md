# Changelog

## 0.2.0

- Data visualization. The ten categorical chart colors are refitted for the near-black body: Astryx's defaults put orange and pink above the dark lightness band, purple under 3:1 on a card, and pink next to cyan where protanopic readers cannot tell them apart. In order, neighbours now stay at least ΔE 14 apart for colour-blind readers.
- Four sequential steps adjusted so every ramp is monotone and its darkest step still reaches 2:1 on the body.
- All 56 data tokens are published as CSS custom properties. Astryx 0.7 only emits the ones a theme sets, so `var(--color-data-blue-3)` resolved to nothing before.
- The showcase gains a data visualization section with reference charts, and its spacing uses Astryx's spacing tokens.
- `test/dataviz.test.ts` checks the palette and ramps; it fails on Astryx's defaults.

## 0.1.0

First release, for `@astryxdesign/core` 0.7.

- Dark-only: every color is a single value. Tokens the theme does not design come from Astryx's dark defaults (`themes/obsidian/darkDefaults.ts`), so nothing follows a light system preference.
- Control edges reach 3:1: input borders, unchecked checkboxes and the off track of a switch use `#65686D`.
- The warning fill takes a dark label (5.6:1).
- `--radius-full` is round again (`9999px`), so avatars, badges and switches are circles and pills.
- Type floor: nothing below 10 px, and the smallest heading is 11 px.
- Headings use the variable Space Grotesk, so weight 510 renders as 510 instead of falling back to Bold.
- The side navigation carries its own blurred panel, so the theme needs no CSS from the host app.
- Ships its font loader (`obsidian.fonts.css`) and a contrast test suite.
