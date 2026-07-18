# HorizonX Ecosystem Architecture

The source of truth for how the HorizonX web estate is organized, which
deployment owns which responsibility, and how URLs flow through the flagship
codebase. Code-level truth lives in [`src/lib/ecosystem.ts`](../src/lib/ecosystem.ts) —
keep the two in sync.

## The four layers

| # | Layer | Deployment | Responsibility |
|---|---|---|---|
| 1 | **HorizonX flagship** | `https://horizonx.site` (this repository) | Ecosystem gateway: Digitalization Index, XBrain narrative, investor gateway, routing visitors to the right product |
| 2 | **Product landing pages** | `https://{product}.horizonx.site` | Per-product marketing and explanation; the only layer that links into product tools |
| 3 | **Product applications (tools)** | separate deployments (e.g. Xability's current temporary host) | The actual SaaS products; operate independently of marketing surfaces |
| 4 | **XVerse** | `https://xverse.horizonx.site` | Portfolio, demonstrations, and experiential proof; returns visitors to landing pages or tools |

The flagship must never absorb layers 2–4: it does not replicate full product
marketing, embed applications, or host the portfolio.

## Deployment status matrix

Statuses come from the product owner's stated architecture (2026-07-18).
"Verified" means network-verified from this repository's build environment —
which blocks outbound requests to these hosts, so **nothing below is
network-verified**; re-verify from an unrestricted machine before public
claims (tracked in LAUNCH_CHECKLIST.md).

| Surface | URL | Stated status | Verified |
|---|---|---|---|
| HorizonX flagship | https://horizonx.site | Live | ❌ (owner-stated) |
| Xability landing | https://xability.horizonx.site | Live | ❌ (owner-stated) |
| Xability tool | https://claude.horizonx.site | Live, **temporary domain** | ❌ (owner-stated) |
| XVerse | https://xverse.horizonx.site | Live | ❌ (owner-stated) |
| XSite landing / tool | https://xsite.horizonx.site | Planned — verify | ❌ |
| XApps landing / tool | https://xapps.horizonx.site | Planned — verify | ❌ |
| XAuto landing / tool | https://xauto.horizonx.site | Planned — verify | ❌ |
| XAI landing / tool | https://xai.horizonx.site | Planned — verify | ❌ |

UI policy for planned surfaces: the flagship links to the intended landing
URLs (they are reserved and centralized) and makes **no availability claims
either way** in UI copy; this matrix carries the truth. If a planned landing
page is confirmed missing at launch, add an availability state in
`ecosystem.ts` rather than removing the link.

## Routing principles

1. The Digitalization Index and world CTAs route to **product landing pages**
   — never directly into application internals.
2. Landing pages own tool access ("Open <Product>") and XVerse exploration.
3. XVerse may return users to landing pages or tools.
4. `Explore in XVerse` links use the **XVerse root**. Product-specific entry
   points (`xverse.horizonx.site/xability` …) are NOT yet verified to exist;
   the intended future URLs are centralized in `ecosystem.ts`
   (`intendedXverseFutureUrl`) and switching over is a one-line change once
   XVerse supports them. **XVerse follow-up work:** implement per-product
   routes in the XVerse deployment, then flip `xverseUrl` to the future URLs.
5. Flagship-internal routes: `/` (journey), `/xbrain`, `/investors`. GitHub
   Pages serves unknown paths via `404.html` (a copy of the app shell) and
   the client router renders the right page.
6. The investor CTA goes to `/investors`; investor contact is a centralized
   destination in `ecosystem.ts` (`INVESTOR_CONTACT`) — currently a mailto,
   swappable in one place for a form or data-room URL.

## URL ownership

Every external URL in the flagship comes from `src/lib/ecosystem.ts`.
Components must not hardcode `*.horizonx.site` URLs — the E2E suite
(`tests/links.spec.ts`) enforces that rendered links match the config.

## Product naming rules

- The five products are **Xability, XSite, XApps, XAuto, XAI** — exactly
  these spellings. `XApps` is plural; never `XApp`.
- **XBrain** is the HorizonX intelligence layer — company infrastructure. It
  is not a sixth Digitalization Index stage and never carries a percentage.
- The Digitalization Index weights are fixed: **30/30/20/10/10**
  (cumulative 30/60/80/90/100), synchronized across `worlds.ts`, design
  tokens, shader stops, journey math, assessment scoring, and tests.
- Products are never named after hosting domains. In particular:

## Temporary tool domain & migration plan

The Xability application is currently hosted at `https://claude.horizonx.site`.
**This domain is temporary.** The product is, and remains, "Xability" — no
user-facing copy may brand the tool as "Claude", and the flagship currently
renders the tool URL **nowhere** (landing pages own tool access). The URL
exists only in `ecosystem.ts` (`PRODUCTS.xability.toolUrl`,
`toolUrlIsTemporary: true`).

Migration to the permanent domain, when scheduled:

1. **This repository:** change `toolUrl` in `ecosystem.ts` (one line); flip
   `toolUrlIsTemporary` to `false`. Nothing else in this repo references it.
2. **Landing page repo (xability.horizonx.site):** update its tool links.
3. **Application repository:** review authentication callback/redirect URLs.
4. **Application backend:** review CORS / allowed-origin configuration.
5. **DNS / hosting:** keep `claude.horizonx.site` serving redirects to the
   permanent domain for a transition window if operationally required.
6. **SEO:** decide whether the tool domain should be indexed at all (an app
   behind auth usually should not — prefer `noindex` on the tool). This
   cannot be controlled from the flagship repository; it is a deployment
   decision in the application's hosting.
7. **Analytics:** if the tool carries analytics, plan property/stream
   continuity across the domain change.

The migration itself is **not** performed from HorizonX-Main; only step 1
lives here.
