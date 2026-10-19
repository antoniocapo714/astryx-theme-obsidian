import {defineTheme} from '@astryxdesign/core/theme';
import {darkDefaults} from './darkDefaults';

/**
 * Obsidian — a dark-only theme for dense, data-heavy interfaces.
 *
 * Four ideas carry the whole theme:
 *
 * 1. Depth by light, not by shadow. Surfaces are translucent white veils over
 *    a near-black body, and each step up the ladder is a little more light.
 *    Cards never cast a shadow; only menus and popovers keep Astryx's soft one.
 * 2. Brightness is the hierarchy. Text comes in four steps; the brightest is
 *    kept for the values and titles that matter, and everything else steps
 *    down from it.
 * 3. One gesture per state. Hover and selection change brightness and veil
 *    together, never a coloured bar or an accent tint.
 * 4. Small, consistent radii. Sharp enough to read as precise, rounded enough
 *    not to look unfinished in a tool used all day.
 *
 * Dark-only: every color is a single value. Tokens the theme does not design
 * are baked from Astryx's own dark defaults (./darkDefaults.ts), so nothing
 * follows a light system preference. Pass `mode="dark"` to <Theme> as well, so
 * scrollbars and native controls match.
 *
 * Contrast is part of the contract and is tested (test/contrast.test.ts):
 * body text ≥ 4.5:1 on every surface, and anything that identifies a control
 * — an input edge, a switch track, a focus ring — ≥ 3:1.
 */

/** The veil ladder: white at increasing alpha over the near-black body. */
const VEIL = {
  muted: '#FFFFFF05', //  2% — muted wells
  card: '#FFFFFF08', //   3% — cards and panels
  hover: '#FFFFFF0A', //  4% — hover on anything interactive
  selected: '#FFFFFF0F', // 6% — the selected item; also a hovered card
  pressed: '#FFFFFF14', //  8% — pressed
} as const;

export const obsidianTheme = defineTheme({
  name: 'obsidian',
  typography: {
    scale: {base: 14, ratio: 1.25},
    body: {
      family: 'Inter Variable',
      fallbacks:
        '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    },
    // The variable face, so the 510 weight below renders as 510. With only the
    // static 400/500/700 files installed, the browser picks the 700 Bold.
    heading: {
      family: 'Space Grotesk Variable',
      fallbacks:
        '"Space Grotesk", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      weight: 'medium',
    },
    code: {
      family: 'Space Mono',
      fallbacks: '"SF Mono", Monaco, Consolas, monospace',
    },
  },
  motion: {fast: 100, medium: 220, slow: 500, ratio: 0.75},

  // Theme-local tokens: the parts of the ladder Astryx has no slot for.
  localTokens: {
    '--obsidian-veil-selected': VEIL.selected,
    '--obsidian-text-hover': '#D5D8DC',
    '--obsidian-canvas': '#050506',
    '--obsidian-rail': 'rgba(24, 27, 32, 0.88)',
  },

  tokens: {
    ...darkDefaults,

    // ---- Surfaces ----
    '--color-background-body': '#08090A',
    '--color-background-surface': '#0F1011',
    '--color-background-card': VEIL.card,
    '--color-background-popover': '#1A1D21',
    '--color-background-muted': VEIL.muted,
    '--color-background-inverted': '#E8EAED',
    '--color-overlay': '#000000B3',
    '--color-overlay-hover': VEIL.hover,
    '--color-overlay-pressed': VEIL.pressed,

    // ---- Text and icons: four brightness steps ----
    // On the body: 18.7, 6.1, 3.5 (disabled, exempt) — measured in the tests.
    '--color-text-primary': '#F7F8F8',
    '--color-text-secondary': '#8A8F98',
    '--color-text-disabled': '#62666D',
    '--color-icon-primary': '#F7F8F8',
    '--color-icon-secondary': '#8A8F98',
    '--color-icon-disabled': '#62666D',
    '--color-on-dark': '#FFFFFF',
    '--color-on-light': '#0D0E10',

    // ---- Accent: one restrained cold blue ----
    '--color-accent': '#2D72D2',
    '--color-accent-muted': '#2D72D23D',
    '--color-on-accent': '#FFFFFF',
    '--color-text-accent': '#6FA6E8',
    '--color-icon-accent': '#6FA6E8',

    // ---- Lines ----
    // Two weights on purpose. `border` is a divider: decoration, so it may
    // whisper. `border-emphasized` and `track` draw the edge of a control — an
    // input, a switch, a checkbox — and must reach 3:1 on every surface, or
    // the control is not there for a large share of readers.
    '--color-border': '#FFFFFF0D',
    '--color-border-emphasized': '#65686D',
    '--color-track': '#65686D',
    '--color-skeleton': VEIL.pressed,
    '--color-neutral': '#8A8F9833',
    // No elevation shadows: depth is light. Menus and popovers keep the soft
    // shadow Astryx gives them, which does not read through this token.
    '--color-shadow': '#00000000',

    // ---- Weight: Inter and Space Grotesk are variable, so 510 is real ----
    '--font-weight-medium': '510',

    // ---- Status: muted for dark grounds ----
    '--color-success': '#238551',
    '--color-success-muted': '#23855140',
    '--color-on-success': '#FFFFFF',
    '--color-error': '#CD4246',
    '--color-error-muted': '#CD424640',
    '--color-on-error': '#FFFFFF',
    '--color-warning': '#C87619',
    '--color-warning-muted': '#C8761940',
    // Dark text on the orange: 5.6:1. White on it was 3.5:1.
    '--color-on-warning': '#0D0E10',

    // ---- Type floor ----
    // The 1.25 scale from 14px runs down to 5px. Nothing below 10px, and the
    // smallest heading step stays at 11px.
    '--font-size-xs': '0.6875rem',
    '--font-size-2xs': '0.625rem',
    '--font-size-3xs': '0.625rem',
    '--font-size-4xs': '0.625rem',

    // ---- Geometry ----
    '--radius-none': '0px',
    '--radius-inner': '4px',
    '--radius-element': '6px',
    '--radius-container': '8px',
    '--radius-page': '8px',
    // `full` means round: avatars, switches and pills depend on it.
    '--radius-full': '9999px',
  },

  components: {
    heading: {
      base: {letterSpacing: '-0.02em'},
    },
    // Cards are a veil with no border; hovering brightens the veil one step.
    // (A 0.5px hairline rounds to a full 1px line on 1x screens.)
    card: {
      base: {
        borderStyle: 'none',
        transition: 'background-color var(--duration-fast) var(--ease-standard)',
        ':hover': {backgroundColor: 'var(--obsidian-veil-selected)'},
      },
    },
    // Selection is one gesture: a veil plus text stepping up to full
    // brightness. No coloured bar, no accent tint; aria-current carries state.
    'side-nav-item': {
      base: {
        // Astryx sizes the row at a fixed 32px. Where an app lets a label wrap,
        // the row grows with it instead of spilling text over the next item;
        // single-line rows keep the 32px rhythm.
        blockSize: 'auto',
        minHeight: '32px',
        borderRadius: 'var(--radius-inner)',
        color: 'var(--color-text-secondary)',
        transition:
          'background-color var(--duration-fast) var(--ease-standard), color var(--duration-fast) var(--ease-standard)',
        ':hover': {
          backgroundColor: 'var(--color-overlay-hover)',
          color: 'var(--obsidian-text-hover)',
        },
      },
      selected: {
        backgroundColor: 'var(--obsidian-veil-selected)',
        color: 'var(--color-text-primary)',
        fontWeight: 'var(--font-weight-medium)',
      },
    },
    // The shell: a deep canvas with the side navigation floating on it as a
    // rounded, blurred panel.
    'app-shell': {
      base: {backgroundColor: 'var(--obsidian-canvas)'},
    },
    'layout-content': {
      base: {backgroundColor: 'transparent'},
    },
    'app-shell-sidenav': {
      base: {backgroundColor: 'transparent'},
    },
    'side-nav': {
      base: {
        margin: '8px',
        // The margin does not shrink the panel; without this it measures
        // 100% + margin and pushes its own footer off-screen.
        blockSize: 'calc(100% - 16px)',
        borderRadius: 'var(--radius-page)',
        backgroundColor: 'var(--obsidian-rail)',
        backdropFilter: 'blur(20px) saturate(120%)',
      },
    },
    // Astryx draws the off track from its own neutral wash (1.2:1 here), so a
    // switch that is off is barely there. Point it at the control-edge token.
    switch: {
      base: {backgroundColor: 'var(--color-track)'},
      checked: {backgroundColor: 'var(--color-accent)'},
    },
    'side-nav-section': {
      base: {marginBlockStart: '12px', rowGap: '4px'},
    },
  },
});
