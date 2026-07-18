# Internationalization

## Supported languages

| Code | Language | Native name | Direction | Route prefix |
|---|---|---|---|---|
| `en` | English (default) | English | LTR | none — canonical at bare paths |
| `ar` | Arabic | العربية | **RTL** | `/ar` |
| `fr` | French | Français | LTR | `/fr` |
| `es` | Spanish | Español | LTR | `/es` |
| `de` | German | Deutsch | LTR | `/de` |
| `tr` | Turkish | Türkçe | LTR | `/tr` |

Localized routes: home, `/xbrain`, `/investors`, and the 404 view.
Sector pages under `/digital-transformation/*` are **English-only** for now
(see docs/CONTENT_SEO_ROADMAP.md).

## Architecture

A typed in-repo system (`src/i18n/`), deliberately **not** an i18n library:

- The custom path router already owns locale routing; a library's routing/
  detection layers would duplicate it.
- `src/i18n/types.ts` defines the `Messages` interface; every locale file
  implements it, so **translation completeness is enforced by `tsc`** — a
  missing or extra key in any language fails the build. This is a stronger
  guarantee than JSON resource files provide.
- English (`en.ts`) ships in the main bundle as the always-available
  fallback. The other five locales load on demand via dynamic import
  (~7 kB gzip each), so the initial bundle carries exactly one language.
- `fmt()` handles `{placeholder}` interpolation. Plurals use explicit
  one/other message pairs — sufficient for the UI's counting strings.

Key modules:

| Module | Responsibility |
|---|---|
| `src/i18n/index.tsx` | locale registry, lazy loaders, `I18nProvider`, `useI18n()`, path helpers, storage |
| `src/i18n/{en,ar,fr,es,de,tr}.ts` | one complete `Messages` dictionary each |
| `src/lib/router.tsx` | locale-prefixed SPA routing + stored-preference root redirect |
| `src/components/LanguageSelector.tsx` | accessible listbox of native names |

## Routing behavior

- `splitLocalePath("/ar/xbrain")` → `{ locale: "ar", path: "/xbrain" }`;
  unprefixed paths are English.
- Switching language preserves the current inner path and persists to
  `localStorage("hx-locale")` (safe when storage is unavailable).
- The stored preference re-applies **only on exact bare-root visits** (`/`),
  via `history.replaceState` — deep links, localized URLs, and crawler
  requests are never rewritten, so there is no cloaking or redirect loop.
- Unknown locale prefixes (`/xx`) fall through to the English 404; unknown
  routes under a valid locale render that locale's 404.

## Arabic / RTL

- `I18nProvider` sets `<html lang dir>`; `dir="rtl"` flips flex/grid layouts
  automatically. Physical-position elements carry explicit `[dir="rtl"]`
  overrides (journey rail moves to the right edge, arrows mirror via
  `scaleX(-1)`, kicker rules flip, logical properties used for new CSS).
- Numeric HUD readouts (`INDEX 00%`, dial, score) stay LTR by design.
- Typography: the **Cairo** variable face (self-hosted via Fontsource) is
  loaded only when the Arabic locale is active and applied to headings and
  body via `[lang="ar"]` rules; letter-spacing is zeroed (tracking is a
  Latin-typography device).

## Adding a language

1. Add the locale to `LOCALES` in `src/i18n/index.tsx` (+ the `Locale` union).
2. Create `src/i18n/<code>.ts` implementing `Messages` — `tsc` lists every
   key you must translate.
3. Register the loader in `loaders`.
4. Add the code to `src/seo/routes.json` (sitemap + SEO tests pick it up).
5. If RTL, verify the `[dir="rtl"]` overrides; add script-specific fonts
   behind a lazy import if needed.
6. Run the i18n and SEO Playwright specs; add a title regex to
   `tests/i18n.spec.ts`.

## Rules

Localization never alters: product names, index weights (30/30/20/10/10),
assessment scoring, XBrain's architectural role, or factual claims. Facts
(milestone statuses) live in code, not in dictionaries.
