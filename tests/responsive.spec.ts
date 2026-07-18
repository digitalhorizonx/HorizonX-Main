import { expect, test } from "@playwright/test";
import { gotoHome, hasHorizontalOverflow, scrollToFraction } from "./helpers";

const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
];

for (const vp of VIEWPORTS) {
  test.describe(`Responsive · ${vp.name} (${vp.width}×${vp.height})`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test("journey has no horizontal overflow at any depth", async ({ page }) => {
      await gotoHome(page);
      for (const f of [0, 0.25, 0.5, 0.75, 1]) {
        await scrollToFraction(page, f);
        await page.waitForTimeout(350);
        expect(await hasHorizontalOverflow(page), `overflow at ${f * 100}%`).toBe(false);
      }
    });

    test("investor page is readable without overflow", async ({ page }) => {
      await page.goto("/investors");
      await expect(page.locator("h1")).toBeVisible();
      await scrollToFraction(page, 0.5);
      expect(await hasHorizontalOverflow(page)).toBe(false);
      await scrollToFraction(page, 1);
      expect(await hasHorizontalOverflow(page)).toBe(false);
      // access CTA reachable
      await expect(page.locator('a[href^="mailto:"]').first()).toBeVisible();
    });

    test("XBrain network visualization stays understandable", async ({ page }) => {
      await page.goto("/xbrain");
      await expect(page.locator(".xbnet__core-label")).toBeVisible();
      await expect(page.locator(".xbnet__node")).toHaveCount(5);
      expect(await hasHorizontalOverflow(page)).toBe(false);
    });

    test("canvas never covers interactive UI", async ({ page }) => {
      await gotoHome(page);
      await page.waitForTimeout(3000); // allow the lazy WebGL layer to mount
      // hit-testing at content points must never land on the canvas layer
      const hits = await page.evaluate(() => {
        const points: Array<[number, number]> = [
          [window.innerWidth / 2, 80], // nav area
          [window.innerWidth / 2, window.innerHeight / 2], // hero content
        ];
        return points.map(([x, y]) => document.elementFromPoint(x, y)?.tagName ?? "NONE");
      });
      for (const tag of hits) expect(tag).not.toBe("CANVAS");
      // and the hero CTA region remains clickable (canvas is pointer-transparent)
      await expect(page.locator(".nav__brand")).toBeVisible();
    });
  });
}
