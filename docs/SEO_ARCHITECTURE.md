# SEO Architecture

## Metadata pipeline

`src/lib/usePageMeta.ts` manages, per route × locale:

- `<title>` and meta description (from the locale dictionaries)
- canonical URL — always the locale's **own** URL, never collapsed to English
- hreflang alternates for all six locales + `x-default` → English
- `og:locale` (+ `og:locale:alternate`), og/twitter titles and descriptions
- `<html lang dir>` (set by the i18n provider)

English-only routes (sector pages) emit self-canonical + `en`/`x-default`
alternates only.

## Prerendering (static HTML per route)

`scripts/prerender.mjs` runs at the end of `npm run build`. It serves the
production build, renders every route in `src/seo/routes.json` (all
locale × route combinations plus the sector pages — 20 URLs) in headless
Chromium, and writes the finished HTML to `dist/<route>.html` and
`dist/<route>/index.html`. Each file carries the route's own text, title,
description, canonical, hreflang graph, `<html lang dir>` and JSON-LD, so:

- every public URL answers **HTTP 200** (before, everything except `/` was
  served through the `404.html` fallback, i.e. with a 404 status);
- crawlers that do not execute JavaScript — most AI answer-engine crawlers
  (GPTBot, ClaudeBot, PerplexityBot, …) — read the real content and
  structured data.

The browser then boots the app normally: `createRoot()` replaces `#root`
and `usePageMeta()` rewrites the managed head tags, so nothing duplicates.
The plain app shell is kept as `404.html` for genuinely unknown URLs. CI
installs Chromium before the build for this step. `tests/seo.spec.ts`
reads the raw HTML of every route (no rendering) to keep this true.

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
crawlers, names the main AI search/assistant crawlers explicitly (owner
decision 2026-09-29: HorizonX wants to be read and cited by answer
engines), and references the sitemap. `public/llms.txt` is a
plain-language summary for language models — products, key pages,
languages and the facts to rely on — kept to published, verifiable facts.

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
