import {describe, expect, it} from 'vitest';
import {resolveThemeTokens} from '@astryxdesign/core/theme/tokens';
import {obsidianTheme} from '../themes/obsidian/obsidianTheme';

/**
 * Chart colours, checked the way the data-viz method requires — computed, not
 * eyeballed. Distances are OKLab ΔE ×100; colour-blind vision is simulated with
 * Machado, Oliveira & Fernandes (2009) at severity 1.0.
 *
 * Categorical, in Astryx's token order (neighbours are what touch in a stack,
 * a bar group or a line legend):
 *   - OKLCH lightness 0.48–0.67 and chroma ≥ 0.10 on a dark surface;
 *   - ≥ 3:1 on the body and on a card;
 *   - neighbours ≥ 8 ΔE apart for protan and deutan readers, ≥ 15 for everyone.
 * Sequential ramps: lightness strictly monotone with ≥ 0.06 between steps, and
 * the darkest step still ≥ 2:1 on the body so an ordinal mark never vanishes.
 */
const t = resolveThemeTokens(obsidianTheme, {mode: 'dark'});
const BODY = '#08090A';
const CARD = '#101112'; // the 3% card veil over the body

const CATEGORICAL = ['blue', 'orange', 'purple', 'green', 'pink', 'cyan', 'red', 'teal', 'brown', 'indigo'];
const RAMPS = ['blue', 'shamrock', 'orange', 'pink', 'purple', 'red', 'teal', 'yellow', 'gray'];

const s2lin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lin = (h: string) => [1, 3, 5].map((i) => s2lin(parseInt(h.slice(i, i + 2), 16) / 255));
function oklab([r, g, b]: number[]) {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}
const MACHADO = {
  protan: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
  deutan: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.01182, 0.04294, 0.968881]],
};
const simulate = (h: string, kind: keyof typeof MACHADO) =>
  MACHADO[kind].map((row) => Math.min(1, Math.max(0, row[0] * lin(h)[0] + row[1] * lin(h)[1] + row[2] * lin(h)[2])));
const deltaE = (a: string, b: string, kind?: keyof typeof MACHADO) => {
  const p = oklab(kind ? simulate(a, kind) : lin(a));
  const q = oklab(kind ? simulate(b, kind) : lin(b));
  return 100 * Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
};
const lightness = (h: string) => oklab(lin(h))[0];
const chroma = (h: string) => Math.hypot(oklab(lin(h))[1], oklab(lin(h))[2]);
const luminance = (h: string) => {
  const [r, g, b] = lin(h);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const categorical = CATEGORICAL.map((name) => ({name, hex: t[`--color-data-categorical-${name}`]}));

describe('categorical chart colours', () => {
  for (const {name, hex} of categorical) {
    it(`${name} sits in the dark band and reads as a colour`, () => {
      expect(lightness(hex)).toBeGreaterThanOrEqual(0.48);
      expect(lightness(hex)).toBeLessThanOrEqual(0.67);
      expect(chroma(hex)).toBeGreaterThanOrEqual(0.1);
    });
    it(`${name} reaches 3:1 on the body and on a card`, () => {
      expect(contrast(hex, BODY)).toBeGreaterThanOrEqual(3);
      expect(contrast(hex, CARD)).toBeGreaterThanOrEqual(3);
    });
  }
  for (let i = 0; i < categorical.length - 1; i++) {
    const [a, b] = [categorical[i], categorical[i + 1]];
    it(`${a.name} and ${b.name} stay apart for every reader`, () => {
      expect(deltaE(a.hex, b.hex, 'protan')).toBeGreaterThanOrEqual(8);
      expect(deltaE(a.hex, b.hex, 'deutan')).toBeGreaterThanOrEqual(8);
      expect(deltaE(a.hex, b.hex)).toBeGreaterThanOrEqual(15);
    });
  }
});

describe('sequential ramps', () => {
  for (const ramp of RAMPS) {
    const steps = [1, 2, 3, 4, 5].map((i) => t[`--color-data-${ramp}-${i}`]);
    it(`${ramp} steps from light to dark with visible gaps`, () => {
      for (let i = 0; i < 4; i++) {
        expect(lightness(steps[i]) - lightness(steps[i + 1])).toBeGreaterThanOrEqual(0.06);
      }
    });
    it(`${ramp}'s darkest step stays visible on the body`, () => {
      expect(contrast(steps[4], BODY)).toBeGreaterThanOrEqual(2);
    });
  }
});
