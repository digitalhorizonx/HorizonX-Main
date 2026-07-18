import { expect, test } from "@playwright/test";
import { PRODUCTS, XVERSE, INVESTOR_CONTACT } from "../src/lib/ecosystem";
import { WORLDS } from "../src/lib/worlds";
import { gotoHome, scrollToSelector } from "./helpers";

/**
 * Link integrity: every external URL must come from the centralized
 * ecosystem configuration, carry security attributes, and never be
 * navigated to (external sites must not make this suite fragile).
 */

test.describe("Ecosystem link integrity", () => {
  test("world CTAs point at product LANDING pages from the central config", async ({ page }) => {
    await gotoHome(page);
    for (const world of WORLDS) {
      const primary = page.locator(`#${world.id} .world__actions .hx-btn--glow`);
      await expect(primary).toHaveAttribute("href", PRODUCTS[world.id].landingUrl);
      await expect(primary).toHaveAttribute("target", "_blank");
      await expect(primary).toHaveAttribute("rel", /noopener/);
      await expect(primary).toHaveAttribute("rel", /noreferrer/);

      const demo = page.locator(`#${world.id} .world__actions .hx-btn--ghost`);
      await expect(demo).toHaveAttribute("href", XVERSE.url);
      await expect(demo).toHaveAttribute("rel", /noopener/);
    }
  });

  test("nav XVerse link uses the confirmed XVerse root URL", async ({ page }) => {
    await gotoHome(page);
    const link = page.locator(".nav__links a", { hasText: "XVerse" });
    await expect(link).toHaveAttribute("href", XVERSE.url);
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /noopener/);
  });

  test("footer platform links match the central config", async ({ page }) => {
    await gotoHome(page);
    for (const world of WORLDS) {
      const link = page.locator(`.footer__col a[href="${PRODUCTS[world.id].landingUrl}"]`);
      await expect(link).toHaveCount(1);
    }
  });

  test("the temporary tool domain is never presented in UI content", async ({ page }) => {
    // claude.horizonx.site is a temporary hosting domain, not a product name.
    // It must not appear anywhere in rendered content on any route.
    for (const route of ["/", "/xbrain", "/investors"]) {
      await page.goto(route);
      await page.waitForTimeout(1500);
      const html = await page.content();
      expect(html, `route ${route} must not surface the temporary tool domain`).not.toContain(
        "claude.horizonx.site"
      );
    }
  });

  test("investor CTA uses the centralized contact destination", async ({ page }) => {
    await page.goto("/investors");
    const cta = page.locator(`a[href^="mailto:"]`).first();
    await expect(cta).toHaveAttribute("href", INVESTOR_CONTACT.href);
  });

  test("all external http(s) links carry noopener noreferrer", async ({ page }) => {
    await gotoHome(page);
    await scrollToSelector(page, "#xverse");
    const bad = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href^='http']"));
      return anchors
        .filter((a) => new URL(a.href).origin !== window.location.origin)
        .filter((a) => !/noopener/.test(a.rel) || !/noreferrer/.test(a.rel))
        .map((a) => a.href);
    });
    expect(bad).toEqual([]);
  });
});
