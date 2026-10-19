/** @type {import('@astryxdesign/cli/authoring').ReferenceDoc} */
export default {
  type: 'generic',
  name: 'obsidian-theme',
  extends: 'theme',
  title: 'Obsidian theme',
  description: 'Use the dark-only Obsidian theme from astryx-theme-obsidian.',
  sections: [
    {
      id: 'use-the-obsidian-theme',
      title: 'Use the Obsidian theme',
      content: [
        {
          type: 'prose',
          text: 'Install astryx-theme-obsidian, run `astryx theme add obsidian --package astryx-theme-obsidian`, and apply it from the generated app theme module with `mode="dark"`. It is dark-only. The fonts (Inter Variable, Space Grotesk Variable, Space Mono) load from the exported themes/obsidian.fonts.css, which `theme add` imports. Customize it with `defineTheme({extends: obsidianTheme, ...})`. Its CSS uses @scope, so the production build needs a minifier that keeps @scope, such as Lightning CSS.',
        },
      ],
    },
  ],
};
