import { expect, test } from "@playwright/test";
import { gotoHome } from "./helpers";

test.describe("Navigation (desktop)", () => {
  test("nav provides Index, products, XBrain, XVerse, and Investors", async ({ page }) => {
    await gotoHome(page);
    const nav = page.locator(".nav__links");
    for (const label of ["Xability", "XSite", "XApps", "XAuto", "XAI", "XBrain", "XVerse", "Investors", "Your Index"]) {
      await expect(nav.locator("a", { hasText: label }).first()).toBeVisible();
    }
  });

  test("Investors nav entry routes to /investors as SPA navigation", async ({ page }) => {
    await gotoHome(page);
    await page.locator(".nav__links a", { hasText: "Investors" }).click();
    await expect(page).toHaveURL(/\/investors$/);
    await expect(page.locator("h1")).toContainText("digitalization");
  });

  test("XBrain nav entry routes to /xbrain", async ({ page }) => {
    await gotoHome(page);
    await page.locator(".nav__links a", { hasText: "XBrain" }).click();
    await expect(page).toHaveURL(/\/xbrain$/);
    await expect(page.locator("h1")).toContainText("XBrain");
  });

  test("anchor navigation scrolls to the calculator", async ({ page }) => {
    await gotoHome(page);
    await page.locator(".nav__link--cta", { hasText: "Your Index" }).click();
    await page.waitForTimeout(2200); // smooth scroll
    const inView = await page.evaluate(() => {
      const el = document.querySelector("#calculator")!;
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0;
    });
    expect(inView).toBe(true);
  });

  test("brand returns from a subpage to the journey", async ({ page }) => {
    await page.goto("/investors");
    await page.locator(".nav__brand").click();
    await expect(page.locator(".hero__title")).toBeVisible({ timeout: 10_000 });
  });
});

test.describe("Navigation (mobile)", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("burger menu opens with XBrain, XVerse, and Investors reachable", async ({ page }) => {
    await gotoHome(page);
    await page.locator(".nav__burger").click();
    const menu = page.locator(".nav__links.is-open");
    await expect(menu).toBeVisible();
    for (const label of ["XBrain", "XVerse", "Investors"]) {
      await expect(menu.locator("a", { hasText: label }).first()).toBeVisible();
    }
  });

  test("menu closes on Escape", async ({ page }) => {
    await gotoHome(page);
    await page.locator(".nav__burger").click();
    await expect(page.locator(".nav__links.is-open")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator(".nav__links.is-open")).toHaveCount(0);
  });

  test("menu closes after navigating to Investors", async ({ page }) => {
    await gotoHome(page);
    await page.locator(".nav__burger").click();
    await page.locator(".nav__links a", { hasText: "Investors" }).click();
    await expect(page).toHaveURL(/\/investors$/);
    await expect(page.locator(".nav__links.is-open")).toHaveCount(0);
  });
});
