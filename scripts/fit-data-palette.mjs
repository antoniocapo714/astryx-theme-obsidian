/**
 * Fits Astryx's ten categorical chart colors to Obsidian's near-black body.
 *
 * Astryx's defaults fail there: orange and pink sit above the dark lightness
 * band, and pink↔cyan collapse under protanopia (ΔE 5.7). This keeps each
 * slot's hue (its OKLCH angle from Astryx) and searches lightness and chroma
 * for the set that maximises the worst adjacent CVD separation, subject to:
 *   - OKLCH L 0.48–0.67 (dark band), C ≥ 0.10, inside sRGB;
 *   - ≥ 3:1 on the body (#08090A) and on a card (3% white veil);
 *   - normal-vision ΔE ≥ 15 between neighbours.
 * Order is Astryx's token order, so an app that uses them in order is safe.
 *
 * node scripts/fit-data-palette.mjs   → prints the fitted hexes
 */
const NAMES = ['blue', 'orange', 'purple', 'green', 'pink', 'cyan', 'red', 'teal', 'brown', 'indigo'];
const ASTRYX = ['#0171E3', '#EB6E00', '#6B1EFD', '#0B991F', '#F351C0', '#0171A4', '#F5394F', '#08A3A3', '#965E03', '#6F8AFF'];
const BODY = '#08090A';
// A per-slot chroma floor above the method's 0.10: with only the global floor,
// pink fits the band by draining to a mauve and stops reading as pink.
const MIN_C = {pink: Number(process.env.PINK_C ?? 0.14)};
const CARD = '#101112';

const s2lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lin2s = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const hex2lin = (h) => [1, 3, 5].map((i) => s2lin(parseInt(h.slice(i, i + 2), 16) / 255));
const lin2hex = (rgb) => '#' + rgb.map((c) => Math.round(Math.max(0, Math.min(1, lin2s(c))) * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
function lin2oklab([r, g, b]) {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}
function oklch2lin(L, C, H) {
  const a = C * Math.cos((H * Math.PI) / 180), b = C * Math.sin((H * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
}
const inGamut = (rgb) => rgb.every((c) => c >= -1e-4 && c <= 1 + 1e-4);
const hueOf = (h) => { const [, a, b] = lin2oklab(hex2lin(h)); return ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360; };
const lum = (h) => { const [r, g, b] = hex2lin(h); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const contrast = (x, y) => { const [hi, lo] = [lum(x), lum(y)].sort((p, q) => q - p); return (hi + 0.05) / (lo + 0.05); };
const M = {
  protan: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
  deutan: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.01182, 0.04294, 0.968881]],
};
const sim = (h, k) => { const [r, g, b] = hex2lin(h), m = M[k]; return m.map((row) => Math.max(0, Math.min(1, row[0] * r + row[1] * g + row[2] * b))); };
const dE = (x, y, k) => { const p = lin2oklab(k ? sim(x, k) : hex2lin(x)), q = lin2oklab(k ? sim(y, k) : hex2lin(y)); return 100 * Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]); };

// Candidate steps per slot: same hue, L in band, C from the floor to the gamut edge.
const candidates = ASTRYX.map((hex, slot) => {
  const H = hueOf(hex), out = [];
  for (let L = 0.5; L <= 0.665; L += 0.005)
    for (let C = MIN_C[NAMES[slot]] ?? 0.1; C <= 0.3; C += 0.005) {
      const rgb = oklch2lin(L, C, H);
      if (!inGamut(rgb)) continue;
      const h = lin2hex(rgb);
      if (contrast(h, BODY) >= 3 && contrast(h, CARD) >= 3) out.push(h);
    }
  if (!out.length) throw new Error(`no candidate for ${NAMES[slot]} at this chroma floor`);
  return out;
});

function score(pal) {
  let cvd = Infinity, normal = Infinity;
  for (let i = 0; i < pal.length - 1; i++) {
    cvd = Math.min(cvd, dE(pal[i], pal[i + 1], 'protan'), dE(pal[i], pal[i + 1], 'deutan'));
    normal = Math.min(normal, dE(pal[i], pal[i + 1]));
  }
  return { cvd, normal, value: normal >= 15 ? cvd : cvd - 100 };
}

// Coordinate ascent from the candidate nearest each Astryx value, several sweeps.
let pal = candidates.map((c, i) => c.reduce((best, h) => (dE(h, ASTRYX[i]) < dE(best, ASTRYX[i]) ? h : best), c[0]));
for (let sweep = 0; sweep < 6; sweep++) {
  for (let i = 0; i < pal.length; i++) {
    let best = pal[i], bestScore = score(pal).value;
    for (const h of candidates[i]) {
      const trial = pal.slice(); trial[i] = h;
      const s = score(trial).value;
      // Tie-break toward the original colour, so the palette stays recognisably Astryx's.
      if (s > bestScore + 1e-9 || (Math.abs(s - bestScore) < 1e-9 && dE(h, ASTRYX[i]) < dE(best, ASTRYX[i]))) { best = h; bestScore = s; }
    }
    pal[i] = best;
  }
}
const s = score(pal);
console.log(JSON.stringify(Object.fromEntries(NAMES.map((n, i) => [n, pal[i]])), null, 1));
console.log(`worst adjacent CVD ΔE ${s.cvd.toFixed(1)} · normal ${s.normal.toFixed(1)}`);
console.log('PALETTE', pal.join(','));
