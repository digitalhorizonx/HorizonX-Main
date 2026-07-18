import { expect, test } from "@playwright/test";
import { gotoHome, scrollToSelector, watchPage } from "./helpers";

test.describe("Home", () => {
  test("loads with hero, nav, and no console or first-party network errors", async ({ page }) => {
    const { consoleErrors, failedRequests } = watchPage(page);
    await gotoHome(page);

    await expect(page.locator(".hero__title")).toContainText("Every business begins");
    await expect(page.locator(".nav__brand")).toBeVisible();
    await expect(page.locator(".hero__sphere-kicker")).toHaveText("Digitalization Index");

    // give the lazy WebGL chunk time to arrive, then re-check health
    await page.waitForTimeout(4000);
    expect(consoleErrors).toEqual([]);
    expect(failedRequests).toEqual([]);
  });

  test("core sections are reachable", async ({ page }) => {
    await gotoHome(page);
    for (const id of ["#problem", "#index", "#journey", "#xbrain-network", "#calculator", "#xverse"]) {
      await expect(page.locator(id)).toHaveCount(1);
    }
  });

  test("the Digitalization Index dial has exactly five weighted sectors", async ({ page }) => {
    await gotoHome(page);
    await scrollToSelector(page, "#index");
    await expect(page.locator(".dial__sector")).toHaveCount(5);
    const labels = await page.locator(".dial__label-pct").allTextContents();
    expect(labels).toEqual(["+30%", "+30%", "+20%", "+10%", "+10%"]);
    await expect(page.locator(".dial__center-kicker")).toHaveText("Digitalization Index");
  });

  test("XBrain section renders as the intelligence layer, not a sixth stage", async ({ page }) => {
    await gotoHome(page);
    await scrollToSelector(page, "#xbrain-network");
    await expect(page.locator("#xbrain-title")).toContainText("One intelligence layer");
    // network shows XBrain core + five product nodes
    await expect(page.locator(".xbnet__core-label")).toHaveText("XBrain");
    await expect(page.locator(".xbnet__node")).toHaveCount(5);
    // the dial still has five sectors — XBrain never becomes a percentage stage
    await expect(page.locator(".dial__sector")).toHaveCount(5);
    // the loop and the XAI distinction are present
    await expect(page.locator(".xbrain__loop-step")).toHaveCount(6);
    await expect(page.locator(".xbrain__distinction")).toContainText("XBrain vs XAI");
  });

  test("problem section states the fragmentation problem", async ({ page }) => {
    await gotoHome(page);
    await expect(page.locator("#problem")).toContainText("disconnected pieces");
    await expect(page.locator(".problem__list li")).toHaveCount(6);
  });

  test("works under prefers-reduced-motion (preloader skipped, content visible)", async ({ browser }) => {
    const context = await browser.newContext({
      reducedMotion: "reduce",
      viewport: { width: 1440, height: 900 },
    });
    const page = await context.newPage();
    const { consoleErrors } = watchPage(page);
    await page.goto("/");
    await expect(page.locator(".hero__title")).toBeVisible({ timeout: 10_000 });
    await scrollToSelector(page, "#calculator");
    await expect(page.locator("#calculator")).toBeVisible();
    expect(consoleErrors).toEqual([]);
    await context.close();
  });

  test("keyboard focus is reachable and visible", async ({ page }) => {
    await gotoHome(page);
    await page.keyboard.press("Tab");
    const focused = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      return el ? { tag: el.tagName, label: el.getAttribute("aria-label") } : null;
    });
    expect(focused?.tag).toBe("A");
  });
});
