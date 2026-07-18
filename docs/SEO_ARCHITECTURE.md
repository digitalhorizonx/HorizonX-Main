# SEO Architecture

## Metadata pipeline

`src/lib/usePageMeta.ts` manages, per route × locale:

- `<title>` and meta description (from the locale dictionaries)
- canonical URL — always the locale's **own** URL, never collapsed to English
- hreflang alternates for all six locales + `x-default` → English
- `og:locale` (+ `og:locale:alternate`), og/twitter titles and descriptions
- `<html lang dir>` (set by the i18n provider)

English-only routes (sector pages) emit self-canonical + `en`/`x-default`
alternates only. Static tags in `index.html` carry the English homepage
defaults — that is what non-JS crawlers see on every route, a documented
limitation of static SPA hosting on GitHub Pages; JS-rendering crawlers
(Google, Bing) receive the specialized per-route set.

## Structured data

Centralized in `src/seo/schema.ts`; rendered via `<JsonLd>` (JSON-LD data
blocks are not executable scripts, so the CSP `script-src` does not apply):

| Route | Schema |
|---|---|
| Home | `Organization` (name/url/logo only), `WebSite`, `ItemList` of five minimal `SoftwareApplication` entries |
| /xbrain, /investors | `WebPage` + `BreadcrumbList` |
| Sector pages | `WebPage`, `BreadcrumbList`, `FAQPage` mirroring the **visible** FAQs |

Hard rules (test-enforced in `tests/seo.spec.ts`): no `aggregateRating`,
`review`, `offers`, `price`, funding, employee counts, or addresses —
none of these are published facts. FAQ schema only where the FAQ content is
visible on the same page.

## Sitemap and robots

`scripts/generate-sitemap.mjs` runs inside `npm run build`, reading
`src/seo/routes.json` (shared route data) and emitting one `<url>` per
locale-route combination with `xhtml:link` hreflang alternates — currently
20 URLs. A Playwright spec pins `routes.json` to the app's real locale and
sector registries so the sitemap cannot drift. `robots.txt` allows all
standard crawlers and references the sitemap; no speculative AI-crawler
directives were added (nothing to gain, easy to get wrong).

## AI-search / answer-engine readiness

Content is structured for extraction rather than claimed as "optimized for"
any engine (no such official integrations exist):

- All narrative content is crawlable DOM text; nothing essential lives only
  in the canvas or animations.
- Direct definition beats: the problem section, per-product role lines, the
  XBrain vs XAI distinction, sector FAQs with visible Q/A pairs.
- Semantic heading hierarchies on every page; breadcrumbs on subpages.
- Honest availability language — live vs planned is never blurred.

## Ownership

Public URLs come from `src/lib/ecosystem.ts`; SEO route data from
`src/seo/routes.json`; schema facts from `src/seo/schema.ts`. The temporary
tool domain must never appear in metadata or content (test-enforced).
