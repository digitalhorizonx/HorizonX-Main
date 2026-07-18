# HorizonX — The Digitalization Intelligence Network

The flagship experience of the HorizonX ecosystem: an immersive, scroll-driven
WebGL journey that carries visitors from **0% to 100% digitalization**, shows
how the five products form **one connected network** under the **XBrain**
intelligence layer, and routes every visitor to their next step.

![Stack](https://img.shields.io/badge/React-18-blue) ![Three.js](https://img.shields.io/badge/Three.js-R3F-black) ![GSAP](https://img.shields.io/badge/GSAP-ScrollTrigger-88ce02) ![Tests](https://img.shields.io/badge/Playwright-106%20tests-45ba4b)

## The network

HorizonX is not a collection of services — it is an intelligence and
execution network for SMEs:

```
Business data → XBrain → Digitalization Index & roadmap
      → Xability / XSite / XApps / XAuto / XAI
      → measured outcomes → governed feedback
```

| Stage | Product | Role | Landing |
|---|---|---|---|
| 30% | **Xability** | Digital presence & marketing OS — first data-entry point | xability.horizonx.site |
| 60% | **XSite** | Conversion, website, SEO infrastructure | xsite.horizonx.site |
| 80% | **XApps** | Applications & operational systems | xapps.horizonx.site |
| 90% | **XAuto** | Workflow automation & integrations | xauto.horizonx.site |
| 100% | **XAI** | Client-facing AI agents & private intelligence | xai.horizonx.site |

**XBrain vs XAI:** XBrain is HorizonX's own central intelligence layer —
company infrastructure that orchestrates the network (`/xbrain`). XAI deploys
AI capabilities for client businesses. XBrain is **not** a sixth index stage.

**The Digitalization Index weights are fixed at 30/30/20/10/10** (cumulative
30/60/80/90/100) and synchronized across `src/lib/worlds.ts`, design tokens,
shader color stops, journey math, assessment scoring, and the test suite. Do
not change them in one place.

## Languages & themes

Six languages — **English** (default, canonical at bare paths), **العربية**
(`/ar`, full RTL with the Cairo face), **Français** (`/fr`), **Español**
(`/es`), **Deutsch** (`/de`), **Türkçe** (`/tr`) — via a typed in-repo i18n
core with compile-time translation completeness and lazy per-locale chunks
(~7 kB gzip each). **System / Light / Dark** themes ride a semantic token
architecture with a hashed no-flash script; the WebGL journey is the dark
experience, light renders a designed static atmosphere. How each works and
how to extend them: [docs/INTERNATIONALIZATION.md](docs/INTERNATIONALIZATION.md)
· [docs/THEME_SYSTEM.md](docs/THEME_SYSTEM.md).

SEO: per-locale metadata with canonical + hreflang/x-default graphs,
centralized truthful JSON-LD, and a build-time generated sitemap (20 URLs)
— [docs/SEO_ARCHITECTURE.md](docs/SEO_ARCHITECTURE.md). Sector landing
pages (`/digital-transformation/*`, Restaurants & Clinics live) use a typed
data-driven content model — [docs/CONTENT_SEO_ROADMAP.md](docs/CONTENT_SEO_ROADMAP.md).

Full ecosystem layering, URL ownership, deployment status matrix, and the
temporary-domain migration plan: [docs/ECOSYSTEM_ARCHITECTURE.md](docs/ECOSYSTEM_ARCHITECTURE.md).
Future platform boundaries: [docs/XBRAIN_ARCHITECTURE.md](docs/XBRAIN_ARCHITECTURE.md).
Strategic milestones: [docs/INVESTOR_READINESS_ROADMAP.md](docs/INVESTOR_READINESS_ROADMAP.md).

## Develop

```bash
npm ci
npm run dev        # dev server
npm run build      # TypeScript validation + production build → dist/
npm run preview    # serve dist/ with SPA fallback (matches production routing)
```

### Test

```bash
npm run build && npm run test:e2e   # 106 Playwright tests against the production build
npm run test:e2e:ui                 # interactive runner
```

The 106-test suite covers the scroll journey, index math, assessment
scoring (all 32 combinations), routing including direct localized-route
refreshes, six-language loading with Arabic RTL, language-selector and
theme-control accessibility and persistence, canonical/hreflang/JSON-LD
integrity, sitemap/robots coverage, sector pages, centralized link
integrity, mobile navigation in LTR and RTL, reduced motion, and
no-horizontal-overflow at 390/768/1440. External product sites are never
navigated to — only generated hrefs are asserted, so third-party
availability can't break CI.

## Architecture

```
src/
├── lib/
│   ├── ecosystem.ts     # SINGLE SOURCE OF TRUTH for all ecosystem URLs & statuses
│   ├── worlds.ts        # five-world display model (narrative, colors, index math)
│   ├── assessment.ts    # typed rules-based scoring + future XBrain boundary
│   ├── router.tsx       # dependency-free SPA router (GitHub Pages 404 fallback)
│   ├── usePageMeta.ts   # per-route title/description/canonical/OG
│   ├── progressStore.ts # frame-rate-friendly journey state
│   └── useJourney.ts    # Lenis + ScrollTrigger + piecewise index math
├── pages/               # HomePage · XBrainPage · InvestorsPage · SectorPage · NotFoundPage
├── i18n/                # typed dictionaries (en·ar·fr·es·de·tr) + provider
├── content/             # data-driven sector registry
├── seo/                 # schema builders + shared route data
├── three/               # SceneLoader (lazy + fallback) · Scene · IndexSphere · Starfield
├── components/          # Nav, worlds, XBrain network, assessment, XVerse, footer…
└── styles/              # tokens.css (design system) · global.css · components.css
```

Design language: [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md).

**Performance:** the Three.js stack (~237 kB gz) loads via dynamic import
after first paint; initial JS is ~123 kB gz (incl. the English dictionary). `SceneLoader` detects WebGL and
falls back to a static CSS deep-space backdrop (also used on scene failure —
no critical information lives only in the canvas). `prefers-reduced-motion`
collapses durations, skips the preloader, and drops the canvas to
demand-rendering.

**Routing on GitHub Pages:** deploy copies `index.html` to `404.html`;
unknown paths serve the app shell and the client router renders `/xbrain`,
`/investors`, or the branded 404. Crawlers without JavaScript see the
homepage metadata on all routes — a documented limitation of static SPA
hosting; per-route metadata is applied client-side.

## Deploy

Pushes to the default branch run **Validate and Deploy**
(`.github/workflows/deploy.yml`): `npm ci` → TypeScript + production build →
Playwright suite → only then is the validated `dist/` published to the
`gh-pages` branch (with `CNAME`, `.nojekyll`, `404.html`). Failures upload
the Playwright report and traces as artifacts and block the deploy.

One-time GitHub Pages setup (repo admin):
1. Settings → Pages → Source: *Deploy from a branch* → `gh-pages` / root
2. Custom domain: `horizonx.site` → Save; enable **Enforce HTTPS** once the
   certificate is issued
3. DNS at the registrar: apex `A` records → `185.199.108.153`,
   `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   (optional `www` CNAME → `digitalhorizonx.github.io`)

Launch process: work through [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md) —
including the manual smoke tests (Safari, iOS, low-powered devices) that
cannot run in CI.

## Security posture & limitations

GitHub Pages serves static files only. Realistic hardening is in place: a
CSP `<meta>` tag (verified compatible with WebGL, self-hosted fonts, and
animations), `noopener noreferrer` on all external links (test-enforced), no
third-party requests at all, and no secrets in the repository.

**Cannot be provided by this repository / GitHub Pages** — requires future
infrastructure: server-controlled HTTP headers (HSTS, frame-ancestors),
authenticated investor data room, secure form processing, rate limiting,
secret management, backend authorization, business-memory storage, AI model
credentials, XBrain execution services.

**Investor page:** frontend-only by design. The access CTA is a centralized
contact destination (`INVESTOR_CONTACT` in `ecosystem.ts`); traction metrics
are deliberately withheld ("available in the investor data room") rather than
invented.

## Known limitations

- External product/XVerse deployments are owner-stated, not network-verified
  from the build environment (see the status matrix in
  docs/ECOSYSTEM_ARCHITECTURE.md).
- The OG image is a temporary implementation of the brand identity — replace
  before the definitive campaign.
- No analytics installed (a launch decision; update the CSP when adding).
- Real-device Safari/iOS/low-end rendering requires the manual checklist.
