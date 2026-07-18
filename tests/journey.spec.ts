import { expect, test } from "@playwright/test";
import { WORLDS } from "../src/lib/worlds";
import { gotoHome, scrollIntoWorld, scrollToFraction, watchPage } from "./helpers";

/**
 * The scroll journey: the index climbs 0 → 100 through the five worlds.
 * Assertions use the nav HUD readout and the progress rail — stable DOM
 * state, not screenshots of the WebGL scene.
 */

test.describe("Digitalization journey", () => {
  test("index starts at 00% and the rail is unlit", async ({ page }) => {
    await gotoHome(page);
    await expect(page.locator(".nav__index-value")).toHaveText("00%");
    await expect(page.locator(".rail__node.is-lit")).toHaveCount(0);
  });

  test("scrolling through each world lights it and advances the index", async ({ page }) => {
    await gotoHome(page);

    for (let i = 0; i < WORLDS.length; i++) {
      const world = WORLDS[i];
      await scrollIntoWorld(page, world.id);
      // journey progress needs a beat for ScrollTrigger to settle
      await page.waitForTimeout(600);

      await expect(page.locator(`.rail__node.is-lit`)).toHaveCount(i + 1, {
        timeout: 10_000,
      });
      await expect(page.locator(`#${world.id} .world__name`)).toContainText(world.name);
      await expect(page.locator(`#${world.id} .world__kicker`)).toContainText(
        `Stage ${world.index}%`
      );
      // primary CTA is present and visible for the active world
      await expect(
        page.locator(`#${world.id} .world__actions .hx-btn--glow`)
      ).toContainText(`Visit ${world.name}`);
    }
  });

  test("completing the journey reaches 100%", async ({ page }) => {
    await gotoHome(page);
    // bottom of the journey container = end of the index climb
    await page.evaluate(() => {
      const journey = document.querySelector("#journey") as HTMLElement;
      window.scrollTo(0, journey.offsetTop + journey.offsetHeight - window.innerHeight);
    });
    await expect(page.locator(".nav__index-value")).toHaveText("100%", { timeout: 10_000 });
    await expect(page.locator(".rail__node.is-lit")).toHaveCount(5);
  });

  test("index percentages match stage labels on the rail", async ({ page }) => {
    await gotoHome(page);
    await scrollToFraction(page, 0.5);
    const labels = await page.locator(".rail__label").allTextContents();
    expect(labels.map((l) => l.trim())).toEqual([
      "Xability 30%",
      "XSite 60%",
      "XApps 80%",
      "XAuto 90%",
      "XAI 100%",
    ]);
  });

  test("full scroll pass produces no console errors", async ({ page }) => {
    const { consoleErrors } = watchPage(page);
    await gotoHome(page);
    for (const f of [0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1]) {
      await scrollToFraction(page, f);
      await page.waitForTimeout(400);
    }
    expect(consoleErrors).toEqual([]);
  });
});
