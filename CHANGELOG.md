# Changelog

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
