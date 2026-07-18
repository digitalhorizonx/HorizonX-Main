/**
 * Build-time sitemap generation.
 *
 * Reads the shared route data (src/seo/routes.json — the same file the app
 * and the SEO tests consume) and writes public/sitemap.xml with one <url>
 * per locale-route combination, carrying xhtml:link hreflang alternates
 * (including x-default → English). Runs as part of `npm run build`, so the
 * sitemap can never drift from the declared routes; a Playwright spec
 * asserts routes.json itself matches the app's actual route registry.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const routes = JSON.parse(readFileSync(join(root, "src/seo/routes.json"), "utf8"));

const { origin, defaultLocale, locales, localizedRoutes, englishOnlyRoutes } = routes;

function localePath(locale, path) {
  if (locale === defaultLocale) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

function urlEntry(loc, alternates) {
  const links = alternates
    .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${a.href}"/>`)
    .join("\n");
  return `  <url>\n    <loc>${loc}</loc>\n${links}\n  </url>`;
}

const entries = [];

for (const route of localizedRoutes) {
  const alternates = [
    ...locales.map((code) => ({ hreflang: code, href: origin + localePath(code, route) })),
    { hreflang: "x-default", href: origin + localePath(defaultLocale, route) },
  ];
  for (const code of locales) {
    entries.push(urlEntry(origin + localePath(code, route), alternates));
  }
}

for (const route of englishOnlyRoutes) {
  const href = origin + route;
  entries.push(
    urlEntry(href, [
      { hreflang: "en", href },
      { hreflang: "x-default", href },
    ])
  );
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join("\n")}
</urlset>
`;

writeFileSync(join(root, "public/sitemap.xml"), xml);
console.log(
  `sitemap.xml: ${localizedRoutes.length * locales.length + englishOnlyRoutes.length} URLs (` +
    `${localizedRoutes.length} localized routes × ${locales.length} locales + ` +
    `${englishOnlyRoutes.length} English-only)`
);
