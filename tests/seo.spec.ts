import { expect, test } from "@playwright/test";
import routesData from "../src/seo/routes.json" with { type: "json" };
import { LOCALE_CODES } from "../src/i18n";
import { publishedSectors, SECTOR_BASE } from "../src/content/sectors";

/**
 * Localized SEO: canonical URLs, hreflang graphs, og:locale, structured
 * data validity, sitemap/robots availability, and content-integrity rules
 * (no temporary domains, no autonomy or invented-metric claims).
 */

async function headLinks(page: import("@playwright/test").Page, rel: string) {
  return page.evaluate(
    (r) =>
      Array.from(document.head.querySelectorAll(`link[rel="${r}"]`)).map((l) => ({
        href: l.getAttribute("href"),
        hreflang: l.getAttribute("hreflang"),
      })),
    rel
  );
}

test.describe("Route metadata", () => {
  test("titles are unique per route and locale", async ({ page }) => {
    const titles = new Set<string>();
    for (const route of ["/", "/xbrain", "/investors", "/ar", "/ar/xbrain", "/fr/investors"]) {
      await page.goto(route);
      await page.waitForTimeout(600);
      const title = await page.title();
      expect(titles.has(title), `duplicate title on ${route}: ${title}`).toBe(false);
      titles.add(title);
    }
  });

  test("canonical points at the locale's own URL, never all to English", async ({ page }) => {
    await page.goto("/ar/investors");
    await page.waitForTimeout(600);
    const canonical = await page.evaluate(
      () => document.querySelector('link[rel="canonical"]')?.getAttribute("href")
    );
    expect(canonical).toBe("https://horizonx.site/ar/investors");
    const ogLocale = await page.evaluate(
      () => document.querySelector('meta[property="og:locale"]')?.getAttribute("content")
    );
    expect(ogLocale).toBe("ar_AR");
  });

  test("localized routes carry a full hreflang graph with x-default", async ({ page }) => {
    await page.goto("/fr/xbrain");
    await page.waitForTimeout(600);
    const alternates = await headLinks(page, "alternate");
    const langs = alternates.map((a) => a.hreflang).sort();
    expect(langs).toEqual(["ar", "de", "en", "es", "fr", "tr", "x-default"].sort());
    expect(alternates.find((a) => a.hreflang === "x-default")?.href).toBe(
      "https://horizonx.site/xbrain"
    );
    expect(alternates.find((a) => a.hreflang === "ar")?.href).toBe(
      "https://horizonx.site/ar/xbrain"
    );
  });

  test("English-only sector pages self-canonicalize with x-default only", async ({ page }) => {
    await page.goto("/digital-transformation/restaurants");
    await page.waitForTimeout(600);
    const canonical = await page.evaluate(
      () => document.querySelector('link[rel="canonical"]')?.getAttribute("href")
    );
    expect(canonical).toBe("https://horizonx.site/digital-transformation/restaurants");
    const alternates = await headLinks(page, "alternate");
    expect(alternates.map((a) => a.hreflang).sort()).toEqual(["en", "x-default"]);
  });
});

test.describe("Structured data", () => {
  async function jsonLd(page: import("@playwright/test").Page): Promise<any[]> {
    const blocks = await page.evaluate(() =>
      Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map(
        (s) => s.textContent ?? ""
      )
    );
    return blocks.map((b) => JSON.parse(b)); // throws on invalid JSON
  }

  test("home carries Organization, WebSite, and the product ItemList", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(800);
    const data = await jsonLd(page);
    const types = data.map((d) => d["@type"]);
    expect(types).toContain("Organization");
    expect(types).toContain("WebSite");
    expect(types).toContain("ItemList");
    const org = data.find((d) => d["@type"] === "Organization");
    expect(org.name).toBe("HorizonX");
    expect(org.url).toBe("https://horizonx.site/");
    // truthfulness: no invented commercial facts anywhere in the schema
    const flat = JSON.stringify(data);
    for (const banned of ["aggregateRating", "review", "offers", "price", "funder", "numberOfEmployees", "address"]) {
      expect(flat).not.toContain(banned);
    }
    const list = data.find((d) => d["@type"] === "ItemList");
    expect(list.itemListElement).toHaveLength(5);
  });

  test("sector page carries FAQPage matching visible FAQs", async ({ page }) => {
    await page.goto("/digital-transformation/clinics");
    await page.waitForTimeout(600);
    const data = await jsonLd(page);
    const faq = data.find((d) => d["@type"] === "FAQPage");
    const visible = await page.locator(".sector__faq dt").allTextContents();
    expect(faq.mainEntity.map((q: any) => q.name)).toEqual(visible);
  });

  test("investors page carries WebPage and BreadcrumbList", async ({ page }) => {
    await page.goto("/investors");
    await page.waitForTimeout(600);
    const data = await jsonLd(page);
    expect(data.map((d) => d["@type"])).toEqual(
      expect.arrayContaining(["WebPage", "BreadcrumbList"])
    );
  });
});

test.describe("Sitemap and robots", () => {
  test("sitemap is served and covers localized + sector routes", async ({ page }) => {
    const res = await page.request.get("/sitemap.xml");
    expect(res.status()).toBe(200);
    const xml = await res.text();
    expect(xml).toContain("<loc>https://horizonx.site/ar/xbrain</loc>");
    expect(xml).toContain("<loc>https://horizonx.site/tr/investors</loc>");
    expect(xml).toContain("<loc>https://horizonx.site/digital-transformation/restaurants</loc>");
    expect(xml).toContain('hreflang="x-default"');
    expect(xml).not.toContain("claude.horizonx.site");
  });

  test("robots.txt allows crawling and points at the sitemap", async ({ page }) => {
    const res = await page.request.get("/robots.txt");
    expect(res.status()).toBe(200);
    const text = await res.text();
    expect(text).toContain("Allow: /");
    expect(text).toContain("Sitemap: https://horizonx.site/sitemap.xml");
    expect(text).not.toMatch(/Disallow: \/(?!\s*$)/);
  });

  test("shared route data matches the app's real registries", () => {
    expect([...routesData.locales].sort()).toEqual([...LOCALE_CODES].sort());
    expect(routesData.defaultLocale).toBe("en");
    expect([...routesData.englishOnlyRoutes].sort()).toEqual(
      publishedSectors()
        .map((s) => `${SECTOR_BASE}/${s.slug}`)
        .sort()
    );
  });
});

test.describe("Content integrity", () => {
  test("no temporary tool domain or autonomy claims on any public route", async ({ page }) => {
    for (const route of ["/", "/xbrain", "/investors", "/ar", "/digital-transformation/restaurants"]) {
      await page.goto(route);
      await page.waitForTimeout(800);
      const html = await page.content();
      expect(html, `${route} leaks the temporary domain`).not.toContain("claude.horizonx.site");
      expect(html, `${route} makes autonomy claims`).not.toMatch(
        /fully autonomous|self-aware|deploys itself|rewrites itself/i
      );
    }
  });
});
