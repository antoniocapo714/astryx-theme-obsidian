import { expect, test } from '@playwright/test'

/**
 * The theme as a browser renders it from the production build of the demo.
 * Unit tests check the token values; this checks they reach the screen: the
 * @scope rules survived minification, the variable fonts loaded, and the
 * controls measure what the tokens promise.
 */
const luminance = ([r, g, b]: number[]) => {
  const f = (c: number) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4 }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}
const contrast = (a: number[], b: number[]) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}
const rgb = (s: string) => (s.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number)

test('the theme reaches the screen', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)

  const m = await page.evaluate(() => {
    const cs = (sel: string) => getComputedStyle(document.querySelector(sel)!)
    return {
      body: getComputedStyle(document.body).backgroundColor,
      input: cs('.astryx-text-input').borderTopColor,
      switchOff: [...document.querySelectorAll('.astryx-switch')].map((e) => [e.getAttribute('data-checked'), getComputedStyle(e).backgroundColor]),
      checkboxOff: [...document.querySelectorAll('.astryx-checkbox-indicator')].map((e) => [e.getAttribute('data-checked'), getComputedStyle(e).borderTopColor]),
      h1Family: cs('h1').fontFamily,
      fonts: [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family),
    }
  })

  expect(m.body).toBe('rgb(8, 9, 10)')
  expect(m.h1Family).toContain('Space Grotesk Variable')
  expect(m.fonts).toEqual(expect.arrayContaining(['Inter Variable', 'Space Grotesk Variable']))

  const body = rgb(m.body)
  expect(contrast(rgb(m.input), body)).toBeGreaterThanOrEqual(3)
  const off = m.switchOff.find(([checked]) => checked === null)!
  expect(contrast(rgb(off[1]!), body)).toBeGreaterThanOrEqual(3)
  const empty = m.checkboxOff.find(([checked]) => checked === null)!
  expect(contrast(rgb(empty[1]!), body)).toBeGreaterThanOrEqual(3)

  expect(errors).toEqual([])
})

test('README images', async ({ browser }) => {
  test.skip(!process.env.SCREENSHOTS, 'set SCREENSHOTS=1 to refresh docs/*.png')
  const page = await browser.newPage({ viewport: { width: 1280, height: 640 }, deviceScaleFactor: 2 })
  await page.goto('/?view=banner')
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(300)
  await page.locator('.banner-frame').screenshot({ path: 'docs/banner.png' })

  const shot = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
  await shot.goto('/')
  await shot.evaluate(() => document.fonts.ready)
  await shot.screenshot({ path: 'docs/screenshot.png' })
  // Viewport shots, not fullPage: the side navigation is sticky, and a
  // full-page capture paints it halfway down the page.
  await shot.locator('#forms').evaluate((e) => e.scrollIntoView({ block: 'start' }))
  await shot.waitForTimeout(400)
  await shot.screenshot({ path: 'docs/screenshot-controls.png' })
})
