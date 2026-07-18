# Content & Sector SEO Roadmap

## Model

`src/content/sectors.ts` is a typed, data-driven sector registry; one
template (`src/pages/SectorPage.tsx`) renders every published sector. A
sector ships only when `published: true` — the gate is **enough truthful,
differentiated content**, never page count. Unpublished sectors are excluded
from routing, navigation, and the sitemap.

Content rules (test-enforced where automatable): no invented clients, case
studies, statistics, ROI percentages, or testimonials; FAQs describe real
product positioning; every page carries the honest availability note.

## Status

| Sector | Route | Status |
|---|---|---|
| Restaurants | `/digital-transformation/restaurants` | ✅ Published (EN) |
| Clinics | `/digital-transformation/clinics` | ✅ Published (EN) |
| Hotels | `/digital-transformation/hotels` | Registered, unpublished |
| Universities | `/digital-transformation/universities` | Registered, unpublished |
| NGOs | `/digital-transformation/ngos` | Registered, unpublished |
| Manufacturing | `/digital-transformation/manufacturing` | Registered, unpublished |

Restaurants and Clinics shipped first because their journeys are genuinely
differentiated (ordering/reservations vs trust/booking/no-shows). The
remaining four need the same standard of sector-specific problems, journey
readings, workflows, and FAQs before flipping `published`.

## Publishing a new sector

1. Fill the `SectorContent` fields in `sectors.ts` with differentiated copy
   (problems, per-product journey roles, an example workflow, FAQs, status
   note). If it reads like a template with nouns swapped, it isn't ready.
2. Set `published: true`.
3. Add the route to `englishOnlyRoutes` in `src/seo/routes.json` (a test
   fails until you do; the sitemap regenerates on build).
4. Run the sector + SEO Playwright specs.

## Localizing sector pages (deferred)

Sector pages are English-only. Rationale: shipping five machine-thin
translations of long-form content would violate the quality bar that
justifies these pages existing. The model is localization-ready — replace
the flat strings with per-locale records (mirroring the `Messages` pattern),
route them under `/{locale}/digital-transformation/...`, move the routes
into `localizedRoutes`, and extend hreflang. Do this per-language with a
human-quality translation pass, Arabic first.

## Internal-linking map (current)

- Footer → published sector pages (every locale's footer; links marked `lang="en"`)
- Sector pages → the five product landing pages, `/xbrain`, the assessment,
  XVerse, and each other
- Homepage journey → product landing pages + XVerse; XBrain section → `/xbrain`
- `/xbrain` → products (network nodes), `/investors`, home index
- `/investors` → `/xbrain`, XVerse, investor contact
- No orphan pages: every published route is reachable from the footer or nav.
