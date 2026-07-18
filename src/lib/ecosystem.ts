/**
 * ============================================================
 * HORIZONX ECOSYSTEM CONFIGURATION — single source of truth
 * ============================================================
 *
 * Every external URL, route, and deployment status used anywhere in the
 * flagship experience must come from this module. Do not hardcode
 * horizonx.site / *.horizonx.site URLs inside components.
 *
 * Ecosystem layers (see docs/ECOSYSTEM_ARCHITECTURE.md):
 *   1. HorizonX flagship (this repository)  — ecosystem gateway
 *   2. Product landing pages                — per-product marketing
 *   3. Product applications (tools)         — separate deployments
 *   4. XVerse                               — portfolio / demonstration layer
 */

export type ProductId = "xability" | "xsite" | "xapps" | "xauto" | "xai";

export type DeploymentStatus = "live" | "beta" | "planned";

export interface ProductEcosystemEntry {
  id: ProductId;
  /** Public marketing page for the product. The Digitalization Index routes here. */
  landingUrl: string;
  /**
   * The product application itself. Only present when a tool deployment exists.
   * Never rendered as the product's identity; landing pages own tool access.
   */
  toolUrl?: string;
  /**
   * True when the tool is hosted on a temporary domain that will migrate later.
   * Copy must never brand the product after a temporary domain.
   */
  toolUrlIsTemporary?: boolean;
  /**
   * Intended product-specific XVerse entry point. XVerse does not yet expose
   * verified per-product routes, so `xverseUrl` currently resolves to the
   * XVerse root for every product (see XVERSE below). Keep the intended
   * future path here so switching over is a one-line change.
   */
  xverseUrl: string;
  intendedXverseFutureUrl: string;
  /**
   * Deployment status of the LANDING page, from the product owner's stated
   * architecture (2026-07-18). Statuses marked `verified: false` could not be
   * network-verified from the build environment — see the status matrix in
   * docs/ECOSYSTEM_ARCHITECTURE.md before publicly claiming availability.
   */
  landingStatus: DeploymentStatus;
  toolStatus: DeploymentStatus;
  verified: boolean;
}

/** The flagship's own public origin and routes. */
export const FLAGSHIP = {
  url: "https://horizonx.site",
  routes: {
    home: "/",
    investors: "/investors",
    xbrain: "/xbrain",
  },
} as const;

/** XVerse — the portfolio, demonstration, and experiential proof layer. */
export const XVERSE = {
  url: "https://xverse.horizonx.site",
} as const;

/**
 * Investor access destination. This repository is frontend-only: there is no
 * data room, form processor, or authenticated investor area here. The CTA is a
 * mailto until an external form / data-room destination is configured.
 * Swap the value in ONE place when that destination exists.
 */
export const INVESTOR_CONTACT = {
  kind: "mailto" as const,
  href:
    "mailto:digital.horizonx.tek@gmail.com" +
    "?subject=" +
    encodeURIComponent("HorizonX — Investor Access Request"),
  label: "Request Investor Access",
} as const;

export const PRODUCTS: Record<ProductId, ProductEcosystemEntry> = {
  xability: {
    id: "xability",
    landingUrl: "https://xability.horizonx.site",
    // Temporary hosting domain for the Xability application. The domain WILL
    // change; the product is, and remains, "Xability". Never surface this
    // hostname as a product name in UI copy.
    toolUrl: "https://claude.horizonx.site",
    toolUrlIsTemporary: true,
    xverseUrl: XVERSE.url,
    intendedXverseFutureUrl: `${XVERSE.url}/xability`,
    landingStatus: "live",
    toolStatus: "live",
    verified: false,
  },
  xsite: {
    id: "xsite",
    landingUrl: "https://xsite.horizonx.site",
    xverseUrl: XVERSE.url,
    intendedXverseFutureUrl: `${XVERSE.url}/xsite`,
    landingStatus: "planned",
    toolStatus: "planned",
    verified: false,
  },
  xapps: {
    id: "xapps",
    landingUrl: "https://xapps.horizonx.site",
    xverseUrl: XVERSE.url,
    intendedXverseFutureUrl: `${XVERSE.url}/xapps`,
    landingStatus: "planned",
    toolStatus: "planned",
    verified: false,
  },
  xauto: {
    id: "xauto",
    landingUrl: "https://xauto.horizonx.site",
    xverseUrl: XVERSE.url,
    intendedXverseFutureUrl: `${XVERSE.url}/xauto`,
    landingStatus: "planned",
    toolStatus: "planned",
    verified: false,
  },
  xai: {
    id: "xai",
    landingUrl: "https://xai.horizonx.site",
    xverseUrl: XVERSE.url,
    intendedXverseFutureUrl: `${XVERSE.url}/xai`,
    landingStatus: "planned",
    toolStatus: "planned",
    verified: false,
  },
};

/** Attributes every external link must carry. */
export const EXTERNAL_LINK_REL = "noopener noreferrer";
