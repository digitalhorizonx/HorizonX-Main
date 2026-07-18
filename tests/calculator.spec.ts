import { expect, test } from "@playwright/test";
import { gotoHome, scrollToSelector } from "./helpers";

/**
 * E2E coverage of the assessment UI. Expected values follow the scoring
 * model verified in assessment.unit.spec.ts — the logic itself lives only
 * in src/lib/assessment.ts.
 */

async function openCalculator(page: import("@playwright/test").Page) {
  await gotoHome(page);
  await scrollToSelector(page, "#calculator");
  await page.waitForTimeout(400);
}

async function answer(page: import("@playwright/test").Page, index: number, yes: boolean) {
  await page
    .locator(".calc-q")
    .nth(index)
    .locator("button", { hasText: yes ? "Yes" : "Not yet" })
    .click();
}

test.describe("Digitalization assessment", () => {
  test("shows placeholder until all five questions are answered", async ({ page }) => {
    await openCalculator(page);
    await expect(page.getByTestId("assessment-score")).toHaveText("--");
    await answer(page, 0, true);
    await expect(page.locator(".calc__hint")).toContainText("4 more");
  });

  test("all 'Not yet' → 0%, recommends Xability", async ({ page }) => {
    await openCalculator(page);
    for (let i = 0; i < 5; i++) await answer(page, i, false);
    await expect(page.getByTestId("assessment-score")).toHaveText("0");
    await expect(page.getByTestId("assessment-stage")).toHaveText("Offline");
    await expect(page.getByTestId("assessment-next")).toContainText("Xability");
  });

  test("first two 'Yes' → 60%, recommends XApps with reason and impact", async ({ page }) => {
    await openCalculator(page);
    await answer(page, 0, true);
    await answer(page, 1, true);
    await answer(page, 2, false);
    await answer(page, 3, false);
    await answer(page, 4, false);
    await expect(page.getByTestId("assessment-score")).toHaveText("60");
    await expect(page.getByTestId("assessment-next")).toContainText("XApps");
    await expect(page.locator(".calc__verdict")).toContainText("80% digitalized");
    await expect(page.locator(".calc__verdict")).toContainText("Operational efficiency");
    // CTA leads onward
    await expect(
      page.locator(".calc__actions .hx-btn--primary")
    ).toContainText("Continue with XApps");
  });

  test("all 'Yes' → 100%, fully digitalized state", async ({ page }) => {
    await openCalculator(page);
    for (let i = 0; i < 5; i++) await answer(page, i, true);
    await expect(page.getByTestId("assessment-score")).toHaveText("100");
    await expect(page.getByTestId("assessment-stage")).toHaveText("Intelligent");
    await expect(page.locator(".calc__verdict")).toContainText("Fully digitalized");
  });

  test("reset returns the assessment to its initial state", async ({ page }) => {
    await openCalculator(page);
    for (let i = 0; i < 5; i++) await answer(page, i, true);
    await page.locator("button", { hasText: "Start over" }).click();
    await expect(page.getByTestId("assessment-score")).toHaveText("--");
  });

  test("sector choice tailors copy without changing the score", async ({ page }) => {
    await openCalculator(page);
    await page.locator(".calc__sector-chip", { hasText: "Retail" }).click();
    for (let i = 0; i < 5; i++) await answer(page, i, false);
    await expect(page.getByTestId("assessment-score")).toHaveText("0");
    await expect(page.locator(".calc__verdict")).toContainText("For retail");
  });

  test("the assessment presents itself as rules-based, not AI analysis", async ({ page }) => {
    await openCalculator(page);
    await expect(page.locator(".calc__lead")).toContainText("rules-based");
  });
});
