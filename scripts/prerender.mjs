/**
 * Build-time prerendering (GEO / AI-search readiness).
 *
 * GitHub Pages serves static files only. Before this step, every route
 * except "/" existed only through the 404.html app-shell fallback, so
 * /ar, /xbrain, /investors, the sector pages, … answered crawlers with HTTP
 * 404 and an empty <div id="root">. Answer engines (GPTBot, ClaudeBot,
 * PerplexityBot, …) mostly do not run JavaScript, so they saw almost no
 * content and no structured data.
 *
 * This step renders each route of src/seo/routes.json in headless Chromium
 * against the production build and writes the finished HTML — real text,
 * per-route title/description/canonical/hreflang, and the JSON-LD blocks —
 * as a static file served with HTTP 200. The browser then boots the app as
 * before: createRoot() replaces #root, and usePageMeta() rewrites the
 * managed head tags, so nothing is duplicated.
 *
 * Output per route: "<path>.html" and "<path>/index.html" (same content),
 * so the URL resolves with or without a trailing slash. The unrendered app
 * shell is kept as 404.html for genuinely unknown URLs.
 */
import { createServer } from "node:http";
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const routes = JSON.parse(readFileSync(join(root, "src/seo/routes.json"), "utf8"));
const { defaultLocale, locales, localizedRoutes, englishOnlyRoutes } = routes;

const localePath = (locale, path) =>
  locale === defaultLocale ? path : path === "/" ? `/${locale}` : `/${locale}${path}`;

const paths = [
  ...localizedRoutes.flatMap((route) => locales.map((code) => localePath(code, route))),
  ...englishOnlyRoutes,
];

const shell = readFileSync(join(dist, "index.html"), "utf8");
// Unknown URLs keep getting the plain app shell (client router shows 404).
writeFileSync(join(dist, "404.html"), shell);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
};

// Minimal static server over dist/ with the same SPA fallback GitHub Pages
// gives via 404.html — always the unrendered shell, never a prerendered page.
const server = createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  const file = normalize(join(dist, decodeURIComponent(url.pathname)));
  if (file.startsWith(dist) && existsSync(file) && statSync(file).isFile()) {
    res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" });
    res.end(readFileSync(file));
    return;
  }
  res.writeHead(200, { "content-type": TYPES[".html"] });
  res.end(shell);
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;

const LOCAL_CHROMIUM = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const browser = await chromium.launch({
  executablePath: !process.env.CI && existsSync(LOCAL_CHROMIUM) ? LOCAL_CHROMIUM : undefined,
  args: ["--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});

let failures = 0;
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: "dark",
    reducedMotion: "reduce",
  });
  for (const path of paths) {
    const page = await context.newPage();
    try {
      await page.goto(origin + path, { waitUntil: "domcontentloaded" });
      // Ready = the route's own canonical is set and its JSON-LD is in the DOM.
      await page.waitForFunction(
        (expected) =>
          document.querySelector('link[rel="canonical"]')?.getAttribute("href") === expected &&
          document.querySelector('script[type="application/ld+json"]') !== null &&
          (document.getElementById("root")?.innerText.trim().length ?? 0) > 200,
        `https://horizonx.site${path}`,
        { timeout: 30_000 },
      );
      await page.waitForTimeout(300);
      let html = await page.content();
      // Runtime-only state must not be baked in: the theme script sets the
      // theme before first paint, and smooth-scroll classes belong to the
      // live session.
      html = html.replace(/<html([^>]*)>/, (_m, attrs) =>
        `<html${attrs.replace(/\s(class|style|data-theme|data-theme-setting)="[^"]*"/g, "")}>`,
      );
      html = html.replace(/<canvas\b[^>]*>\s*<\/canvas>/g, "");
      const target = path === "/" ? "index" : path.slice(1);
      const outputs = path === "/" ? ["index.html"] : [`${target}.html`, `${target}/index.html`];
      for (const rel of outputs) {
        const out = join(dist, rel);
        mkdirSync(dirname(out), { recursive: true });
        writeFileSync(out, html.startsWith("<!DOCTYPE") ? html : `<!DOCTYPE html>\n${html}`);
      }
      console.log(`prerendered ${path}`);
    } catch (err) {
      failures += 1;
      console.error(`FAILED ${path}: ${err.message}`);
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
  server.close();
}

if (failures > 0) {
  console.error(`${failures} route(s) failed to prerender`);
  process.exit(1);
}
console.log(`${paths.length} routes prerendered`);
