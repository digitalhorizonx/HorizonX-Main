import { expect, test } from "@playwright/test";
import { PRODUCTS } from "../src/lib/ecosystem";
import { publishedSectors } from "../src/content/sectors";

/**
 * Sector landing pages: data-driven rendering, honest content rules,
 * internal linking, and unpublished-sector fallbacks.
 */

test.describe("Sector pages", () => {
  for (const sector of publishedSectors()) {
    test(`/digital-transformation/${sector.slug} renders full content`, async ({ page }) => {
      await page.goto(`/digital-transformation/${sector.slug}`);
      await expect(page.locator("h1")).toContainText(sector.title);
      // the five-stage journey with product links from the central config
      await expect(page.locator(".sector__journey li")).toHaveCount(5);
      for (const id of ["xability", "xsite", "xapps", "xauto", "xai"] as const) {
        await expect(
          page.locator(`.sector__journey a[href="${PRODUCTS[id].landingUrl}"]`)
        ).toHaveCount(1);
      }
      // visible FAQs and the honest status note
      expect(await page.locator(".sector__faq dt").count()).toBeGreaterThanOrEqual(3);
      await expect(page.locator(".subpage__note").last()).toContainText("availability varies");
      // XBrain linked with governed language
      await expect(page.locator('a[href="/xbrain"]').first()).toBeVisible();
      const text = await page.locator("main").textContent();
      expect(text).toMatch(/human-governed/i);
    });
  }

  test("sector content invents no clients, stats, or ROI figures", async ({ page }) => {
    for (const sector of publishedSectors()) {
      await page.goto(`/digital-transformation/${sector.slug}`);
      const text = (await page.locator("main").textContent()) ?? "";
      expect(text).not.toMatch(/testimonial|case study/i);
      expect(text).not.toMatch(/\d+x ROI|\+\d+% (revenue|sales|bookings|covers)/i);
      expect(text).not.toMatch(/\$\d/);
    }
  });

  test("unpublished sectors return the 404 view", async ({ page }) => {
    await page.goto("/digital-transformation/hotels");
    await expect(page.locator("h1")).toContainText("404");
    await page.goto("/digital-transformation/not-a-sector");
    await expect(page.locator("h1")).toContainText("404");
  });

  test("sector routes are English-only for now (localized paths 404)", async ({ page }) => {
    await page.goto("/ar/digital-transformation/restaurants");
    await expect(page.locator("h1")).toContainText("404");
  });

  test("footer links to published sectors from the journey", async ({ page }) => {
    await page.goto("/");
    for (const sector of publishedSectors()) {
      await expect(
        page.locator(`.footer__col a[href="/digital-transformation/${sector.slug}"]`)
      ).toHaveCount(1);
    }
  });

  test("sector pages cross-link to the other published sector", async ({ page }) => {
    await page.goto("/digital-transformation/restaurants");
    await expect(page.locator('.sector__others a[href="/digital-transformation/clinics"]')).toHaveCount(1);
  });
});
