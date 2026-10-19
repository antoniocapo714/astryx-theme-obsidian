import {describe, expect, it} from 'vitest';
import {resolveThemeTokens} from '@astryxdesign/core/theme/tokens';
import {obsidianTheme} from '../themes/obsidian/obsidianTheme';

/**
 * The contrast contract (WCAG 2.2):
 *  - text that carries meaning: 4.5:1 on every surface it can sit on (1.4.3);
 *  - whatever identifies a control or its state — an input edge, a switch
 *    track, a checkbox, a focus ring: 3:1 against what is next to it (1.4.11).
 * Disabled text is exempt and only reported.
 *
 * Translucent tokens are composited over the body first: a nominal hex with
 * alpha is not the colour anyone sees.
 */

const dark = resolveThemeTokens(obsidianTheme, {mode: 'dark'});
const light = resolveThemeTokens(obsidianTheme, {mode: 'light'});

type RGBA = [number, number, number, number];

function parse(value: string): RGBA {
  const v = value.trim();
  const hex = /^#([0-9a-f]{6})([0-9a-f]{2})?$/i.exec(v);
  if (hex) {
    const n = parseInt(hex[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255, hex[2] ? parseInt(hex[2], 16) / 255 : 1];
  }
  const rgb = /^rgba?\(([^)]+)\)$/i.exec(v);
  if (rgb) {
    const [r, g, b, a = '1'] = rgb[1].split(/[\s,/]+/).filter(Boolean);
    return [Number(r), Number(g), Number(b), Number(a)];
  }
  throw new Error(`cannot parse colour ${value}`);
}

function over(fg: RGBA, bg: RGBA): RGBA {
  const a = fg[3];
  return [fg[0] * a + bg[0] * (1 - a), fg[1] * a + bg[1] * (1 - a), fg[2] * a + bg[2] * (1 - a), 1];
}

function luminance([r, g, b]: RGBA): number {
  const f = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function contrast(a: RGBA, b: RGBA): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const token = (name: string) => {
  const v = dark[name];
  if (!v) throw new Error(`${name} is not set`);
  return parse(v);
};

const body = token('--color-background-body');
const surfaces: Record<string, RGBA> = {
  body,
  surface: over(token('--color-background-surface'), body),
  card: over(token('--color-background-card'), body),
  popover: over(token('--color-background-popover'), body),
  // The floating side navigation: its veil over the deep canvas.
  rail: over(parse(dark['--obsidian-rail'] ?? 'rgba(24, 27, 32, 0.88)'), parse(dark['--obsidian-canvas'] ?? '#050506')),
};

describe('obsidian is dark-only', () => {
  it('resolves every token the same way in light and dark mode', () => {
    const differ = Object.keys(dark).filter((k) => k.startsWith('--color-') && dark[k] !== light[k]);
    expect(differ).toEqual([]);
  });
});

describe('text reaches 4.5:1 on every surface', () => {
  for (const name of ['--color-text-primary', '--color-text-secondary', '--color-text-accent']) {
    for (const [surface, bg] of Object.entries(surfaces)) {
      it(`${name} on ${surface}`, () => {
        expect(contrast(over(token(name), bg), bg)).toBeGreaterThanOrEqual(4.5);
      });
    }
  }
});

describe('control edges reach 3:1 on every surface', () => {
  for (const name of ['--color-border-emphasized', '--color-track']) {
    for (const [surface, bg] of Object.entries(surfaces)) {
      it(`${name} on ${surface}`, () => {
        expect(contrast(over(token(name), bg), bg)).toBeGreaterThanOrEqual(3);
      });
    }
  }
  it('the accent, used as the focus ring, on the body', () => {
    expect(contrast(token('--color-accent'), body)).toBeGreaterThanOrEqual(3);
  });
});

describe('labels on filled controls reach 4.5:1', () => {
  for (const [fill, on] of [
    ['--color-accent', '--color-on-accent'],
    ['--color-success', '--color-on-success'],
    ['--color-error', '--color-on-error'],
    ['--color-warning', '--color-on-warning'],
  ]) {
    it(`${on} on ${fill}`, () => {
      expect(contrast(token(on), over(token(fill), body))).toBeGreaterThanOrEqual(4.5);
    });
  }
});

describe('categorical badges keep their text legible', () => {
  for (const hue of ['blue', 'cyan', 'gray', 'green', 'orange', 'pink', 'purple', 'red', 'teal', 'yellow']) {
    it(`text on ${hue}`, () => {
      const bg = over(token(`--color-background-${hue}`), body);
      expect(contrast(over(token(`--color-text-${hue}`), bg), bg)).toBeGreaterThanOrEqual(4.5);
    });
  }
});

describe('the type scale has a floor', () => {
  it('no size token renders below 10px', () => {
    const sizes = Object.entries(dark)
      .filter(([k]) => k.startsWith('--font-size-'))
      .map(([k, v]) => [k, parseFloat(v) * (v.endsWith('rem') ? 16 : 1)] as const);
    expect(sizes.filter(([, px]) => px < 10)).toEqual([]);
  });
});

describe('the radius scale', () => {
  it('"full" is round', () => {
    expect(parseFloat(dark['--radius-full'])).toBeGreaterThanOrEqual(999);
  });
});
