import { expect, test } from "@playwright/test";

/**
 * Internationalization: locale routing, RTL, selector behavior, persistence,
 * and fallbacks. Titles are asserted against each dictionary's real values.
 */

const LOCALE_TITLES: Record<string, RegExp> = {
  en: /The Digitalization Intelligence Network/,
  ar: /شبكة ذكاء التحوّل الرقمي/,
  fr: /Le réseau d'intelligence de digitalisation/,
  es: /La red de inteligencia de digitalización/,
  de: /Das Digitalisierungs-Intelligenznetzwerk/,
  tr: /Dijitalleşme Zekâ Ağı/,
};

test.describe("Locale routing", () => {
  test("default locale is English at the bare root", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/localhost:4173\/$/);
    expect(await page.evaluate(() => document.documentElement.lang)).toBe("en");
    expect(await page.evaluate(() => document.documentElement.dir)).toBe("ltr");
    await expect(page).toHaveTitle(LOCALE_TITLES.en);
  });

  for (const locale of ["ar", "fr", "es", "de", "tr"]) {
    test(`/${locale} loads localized home with correct lang`, async ({ page }) => {
      await page.goto(`/${locale}`);
      await expect(page).toHaveTitle(LOCALE_TITLES[locale]);
      expect(await page.evaluate(() => document.documentElement.lang)).toBe(locale);
    });
  }

  test("Arabic renders full RTL", async ({ page }) => {
    await page.goto("/ar");
    expect(await page.evaluate(() => document.documentElement.dir)).toBe("rtl");
    // the hero heading is Arabic text
    await expect(page.locator(".hero__title")).toContainText("كل عمل تجاري يبدأ");
  });

  test("localized subpages survive direct refresh", async ({ page }) => {
    await page.goto("/ar/xbrain");
    await expect(page).toHaveTitle(/طبقة الذكاء/);
    await page.goto("/fr/investors");
    await expect(page).toHaveTitle(/Investisseurs — HorizonX/);
    await expect(page.locator("h1")).toContainText("digitalisation");
  });

  test("unknown locale prefix falls back to the English 404", async ({ page }) => {
    await page.goto("/xx");
    await expect(page).toHaveTitle(/Page not found/);
    expect(await page.evaluate(() => document.documentElement.lang)).toBe("en");
  });

  test("unknown route under a locale renders the localized 404", async ({ page }) => {
    await page.goto("/ar/does-not-exist");
    await expect(page).toHaveTitle(/الصفحة غير موجودة/);
    await expect(page.locator("h1")).toContainText("404");
    // and the way home stays in-locale
    await page.locator(".subpage__cta-row a").first().click();
    await expect(page).toHaveURL(/\/ar$/);
  });
});

test.describe("Language selector", () => {
  test("switching language preserves the current page", async ({ page }) => {
    await page.goto("/xbrain");
    await page.click(".nav__desktop-controls [data-testid=language-selector] button");
    await page.click('.langsel__option:has-text("Türkçe")');
    await expect(page).toHaveURL(/\/tr\/xbrain$/);
    await expect(page).toHaveTitle(/XBrain — HorizonX Zekâ Katmanı/);
  });

  test("choice persists and re-applies on a bare-root visit", async ({ page }) => {
    await page.goto("/");
    await page.click(".nav__desktop-controls [data-testid=language-selector] button");
    await page.click('.langsel__option:has-text("Deutsch")');
    await expect(page).toHaveURL(/\/de$/);
    await page.goto("/");
    await expect(page).toHaveURL(/\/de$/);
    // deep links are never rewritten
    await page.goto("/investors");
    await expect(page).toHaveURL(/\/investors$/);
    await expect(page).toHaveTitle(/Investors — HorizonX/);
  });

  test("selector is keyboard and screen-reader accessible", async ({ page }) => {
    await page.goto("/");
    const button = page.locator(".nav__desktop-controls [data-testid=language-selector] button");
    await expect(button).toHaveAttribute("aria-haspopup", "listbox");
    await button.focus();
    await page.keyboard.press("Enter");
    const menu = page.locator(".nav__desktop-controls .langsel__menu");
    await expect(menu).toBeVisible();
    await expect(menu.locator('[role="option"]')).toHaveCount(6);
    await page.keyboard.press("Escape");
    await expect(menu).toHaveCount(0);
  });

  test("mobile navigation exposes language and theme controls", async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      colorScheme: "dark",
    });
    const page = await context.newPage();
    await page.goto("/");
    await page.click(".nav__burger");
    await expect(page.locator(".nav__mobile-controls [data-testid=language-selector]")).toBeVisible();
    await expect(page.locator(".nav__mobile-controls [data-testid=theme-toggle]")).toBeVisible();
    await context.close();
  });

  test("Arabic mobile menu works in RTL", async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      colorScheme: "dark",
    });
    const page = await context.newPage();
    await page.goto("/ar");
    await page.click(".nav__burger");
    await expect(page.locator(".nav__links.is-open")).toBeVisible();
    await expect(page.locator(".nav__links a", { hasText: "المستثمرون" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator(".nav__links.is-open")).toHaveCount(0);
    await context.close();
  });
});
