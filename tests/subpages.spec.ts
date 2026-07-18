import { expect, test } from "@playwright/test";
import { watchPage } from "./helpers";

test.describe("Investor gateway", () => {
  test("direct navigation to /investors works (SPA fallback)", async ({ page }) => {
    const { consoleErrors } = watchPage(page);
    await page.goto("/investors");
    await expect(page.locator("h1")).toContainText("digitalization");
    await expect(page).toHaveTitle(/Investors — HorizonX/);
    expect(consoleErrors).toEqual([]);
  });

  test("contains the required sections in heading order", async ({ page }) => {
    await page.goto("/investors");
    const headings = await page.locator("h2").allTextContents();
    expect(headings).toEqual([
      "The problem",
      "The solution: XBrain + the product network",
      "Market approach",
      "Traction",
      "Founder vision",
      "Milestones",
      "Investor updates",
      "Request access",
    ]);
  });

  test("traction shows the data-room state, never invented numbers", async ({ page }) => {
    await page.goto("/investors");
    const values = await page.locator(".subpage__metric-value").allTextContents();
    expect(values.every((v) => v.trim() === "—")).toBe(true);
    await expect(page.locator("#investors")).toContainText("investor data room");
  });

  test("milestones distinguish completed / in progress / planned", async ({ page }) => {
    await page.goto("/investors");
    await expect(page.locator(".subpage__milestone.is-completed")).toHaveCount(1);
    await expect(page.locator(".subpage__milestone.is-in-progress")).toHaveCount(1);
    const planned = await page.locator(".subpage__milestone.is-planned").count();
    expect(planned).toBeGreaterThanOrEqual(5);
  });

  test("market approach names the sequence without invented market sizes", async ({ page }) => {
    await page.goto("/investors");
    const section = page.locator("#investors");
    await expect(section).toContainText("Jordan");
    await expect(section).toContainText("GCC");
    const text = await section.textContent();
    // no TAM/SAM/SOM style fabrications
    expect(text).not.toMatch(/TAM|SAM|SOM|\$\d+[MB]/);
  });
});

test.describe("XBrain route", () => {
  test("direct navigation to /xbrain works with its own metadata", async ({ page }) => {
    const { consoleErrors } = watchPage(page);
    await page.goto("/xbrain");
    await expect(page.locator("h1")).toContainText("XBrain");
    await expect(page).toHaveTitle(/XBrain/);
    const desc = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(desc).toContain("intelligence layer");
    expect(consoleErrors).toEqual([]);
  });

  test("presents the network and the XBrain/XAI distinction", async ({ page }) => {
    await page.goto("/xbrain");
    await expect(page.locator(".xbnet__node")).toHaveCount(5);
    await expect(page.locator("#xbrain")).toContainText("XBrain is not XAI");
    // governed-language check: no autonomy claims
    const text = await page.locator("#xbrain").textContent();
    expect(text).toMatch(/human-approved|human-governed/);
    expect(text).not.toMatch(/fully autonomous|self-aware/i);
  });
});

test.describe("404 fallback", () => {
  test("unknown routes render the branded 404 with a way home", async ({ page }) => {
    await page.goto("/this-route-does-not-exist");
    await expect(page.locator("h1")).toContainText("404");
    await expect(page).toHaveTitle(/not found/i);
    await page.locator("a", { hasText: "Return to the journey" }).click();
    await expect(page.locator(".hero__title")).toBeVisible({ timeout: 10_000 });
  });
});
