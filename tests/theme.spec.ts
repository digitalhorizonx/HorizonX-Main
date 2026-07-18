import { expect, test } from "@playwright/test";

/**
 * Theme system: System / Light / Dark resolution, persistence, root
 * attributes, keyboard access, no-flash mitigation, and the scene strategy
 * (WebGL journey in dark; designed static atmosphere in light).
 */

test.describe("Theme resolution", () => {
  test("System mode follows a dark OS preference", async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: "dark" });
    const page = await context.newPage();
    await page.goto("/");
    expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe("dark");
    expect(await page.evaluate(() => document.documentElement.dataset.themeSetting)).toBe("system");
    await context.close();
  });

  test("System mode follows a light OS preference", async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: "light" });
    const page = await context.newPage();
    await page.goto("/");
    expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe("light");
    await context.close();
  });

  test("System mode reacts live to OS theme changes", async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: "dark" });
    const page = await context.newPage();
    await page.goto("/");
    await page.emulateMedia({ colorScheme: "light" });
    await expect
      .poll(() => page.evaluate(() => document.documentElement.dataset.theme))
      .toBe("light");
    await context.close();
  });

  test("explicit choice overrides the OS and persists across reload", async ({ page }) => {
    await page.goto("/");
    await page.click(".nav__desktop-controls [data-theme-option=light]");
    expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe("light");
    await page.reload();
    await page.waitForLoadState("domcontentloaded");
    expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe("light");
    expect(await page.evaluate(() => localStorage.getItem("hx-theme"))).toBe("light");
    // and back to dark
    await page.click(".nav__desktop-controls [data-theme-option=dark]");
    expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe("dark");
  });

  test("a no-flash inline script sets the theme before first paint", async ({ page }) => {
    // the pre-paint script must exist in the served HTML itself
    const response = await page.request.get("/");
    const html = await response.text();
    expect(html).toContain('localStorage.getItem("hx-theme")');
    expect(html).toMatch(/dataset\.theme=t/);
    // and the CSP allow-lists it by hash rather than 'unsafe-inline'
    expect(html).toContain("sha256-");
    expect(html).not.toContain("script-src 'self' 'unsafe-inline'");
  });
});

test.describe("Theme controls", () => {
  test("toggle exposes labeled, pressable options", async ({ page }) => {
    await page.goto("/");
    const toggle = page.locator(".nav__desktop-controls [data-testid=theme-toggle]");
    await expect(toggle).toHaveAttribute("role", "group");
    await expect(toggle.locator("button")).toHaveCount(3);
    await expect(toggle.locator("[data-theme-option=system]")).toHaveAttribute("aria-pressed", "true");
    await expect(toggle.locator("[data-theme-option=light]")).toHaveAttribute("aria-label", "Light theme");
  });

  test("toggle is keyboard operable", async ({ page }) => {
    await page.goto("/");
    const light = page.locator(".nav__desktop-controls [data-theme-option=light]");
    await light.focus();
    await page.keyboard.press("Enter");
    expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe("light");
    await expect(light).toHaveAttribute("aria-pressed", "true");
  });
});

test.describe("Theme rendering", () => {
  test("dark theme runs the WebGL journey", async ({ page }) => {
    await page.goto("/"); // context default is dark
    await page.waitForTimeout(4000);
    expect(await page.locator("canvas").count()).toBeGreaterThan(0);
  });

  test("light theme renders the designed static atmosphere instead", async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: "light" });
    const page = await context.newPage();
    await page.goto("/");
    await page.waitForTimeout(2500);
    await expect(page.getByTestId("scene-fallback")).toHaveCount(1);
    expect(await page.locator("canvas").count()).toBe(0);
    // content fully readable
    await expect(page.locator(".hero__title")).toBeVisible();
    await context.close();
  });

  test("theme works on subpages and the assessment", async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: "light" });
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    for (const route of ["/investors", "/xbrain", "/digital-transformation/restaurants"]) {
      await page.goto(route);
      await expect(page.locator("h1")).toBeVisible();
    }
    expect(errors).toEqual([]);
    await context.close();
  });
});
