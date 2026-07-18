import type { ProductId } from "../lib/ecosystem";

/**
 * The complete message schema for one locale.
 *
 * Every locale file implements this interface, so TypeScript enforces
 * translation completeness at compile time — a missing or extra key in any
 * language fails `tsc`. Add new UI copy here first, then to every locale.
 *
 * Placeholders use {n} / {name} and are replaced by the tiny `fmt` helper.
 */

export interface WorldCopy {
  tagline: string;
  role: string;
  narrative: string;
  /** the business outcome this stage buys, in one honest sentence */
  outcome: string;
  themes: string[];
  question: string;
}

export interface PageMetaCopy {
  title: string;
  description: string;
}

export interface Messages {
  meta: {
    home: PageMetaCopy;
    xbrain: PageMetaCopy;
    investors: PageMetaCopy;
    notFound: PageMetaCopy;
  };
  nav: {
    yourIndex: string;
    backToStart: string;
    mainNav: string;
    menu: string;
    indexLabel: string;
  };
  hero: {
    kicker: string;
    titleA: string;
    titleZeroPrefix: string;
    titleZero: string;
    titleZeroSuffix: string;
    lead1: string;
    leadStrong: string;
    lead2: string;
    sphereKicker: string;
    scrollHint: string;
  };
  problem: {
    kicker: string;
    titleA: string;
    titleB: string;
    items: string[];
    resolutionPre: string;
    resolutionChain: string;
    resolutionPost: string;
  };
  dial: {
    kicker: string;
    titleA: string;
    titleB: string;
    lead: string;
    centerKicker: string;
    centerHint: string;
    ariaLabel: string;
  };
  worldUi: {
    /** e.g. "World {n} · Stage {pct}%" */
    kicker: string;
    visit: string;
    exploreXverse: string;
    outcomeLabel: string;
  };
  worlds: Record<ProductId, WorldCopy>;
  xbrainSection: {
    kicker: string;
    titleA: string;
    titleB: string;
    lead: string;
    loop: Array<{ label: string; detail: string }>;
    loopAria: string;
    distinction: string;
    distinctionLabel: string;
    insideCta: string;
    governedCaption: string;
    xaiBadge: string;
    coreSub: string;
    networkAria: string;
  };
  xbrainPage: {
    kicker: string;
    lead: string;
    netTitle: string;
    pillarsTitle: string;
    pillars: Array<{ title: string; body: string }>;
    distinctTitle: string;
    xbrainCard: string;
    xaiCard: string;
    investorCta: string;
    backCta: string;
  };
  assessment: {
    kicker: string;
    titlePre: string;
    titleAccent: string;
    titlePost: string;
    lead: string;
    sectorsLabel: string;
    sectors: Array<{ id: string; label: string; note: string }>;
    yes: string;
    notYet: string;
    resultKicker: string;
    currentStage: string;
    recommendedNext: string;
    whyThisStep: string;
    expectedImpact: string;
    takesYouTo: string;
    /** "{pct}% digitalized" */
    digitalized: string;
    /** "Continue with {name}" */
    continueWith: string;
    seeExamples: string;
    startOver: string;
    statusLabel: string;
    fullyDigitalized: string;
    frontierNote: string;
    exploreXverse: string;
    /** "{n} more question(s)" – one/other forms */
    hintOne: string;
    hintOther: string;
    stages: {
      offline: string;
      present: string;
      connected: string;
      operational: string;
      automated: string;
      intelligent: string;
    };
    reasons: Record<ProductId, string>;
    impacts: Record<ProductId, string>;
  };
  xverse: {
    kicker: string;
    titleA: string;
    titleB: string;
    lead: string;
    launch: string;
    calculate: string;
  };
  investors: {
    kicker: string;
    titleA: string;
    titleB: string;
    lead: string;
    requestAccess: string;
    understandXbrain: string;
    problemTitle: string;
    problemBody: string;
    solutionTitle: string;
    solutionBody: string;
    marketTitle: string;
    marketSteps: Array<{ strong: string; body: string }>;
    marketNote: string;
    tractionTitle: string;
    tractionBody: string;
    metrics: string[];
    tractionNote: string;
    visionTitle: string;
    visionBody: string;
    milestonesTitle: string;
    milestones: Array<{ title: string; detail: string }>;
    statusCompleted: string;
    statusInProgress: string;
    statusPlanned: string;
    updatesTitle: string;
    updatesBody: string;
    accessTitle: string;
    accessBody: string;
    seeWork: string;
  };
  notFound: {
    kicker: string;
    lead: string;
    home: string;
    investors: string;
  };
  footer: {
    tagline1: string;
    tagline2: string;
    platforms: string;
    experience: string;
    theIndex: string;
    calculator: string;
    xverseDemo: string;
    sectors: string;
    journey: string;
    rights: string;
    online: string;
  };
  sectorsNav: {
    /** section title used for internal links to sector pages */
    title: string;
    lead: string;
  };
  a11y: {
    languageSelector: string;
    themeSelector: string;
    themeSystem: string;
    themeLight: string;
    themeDark: string;
    railAria: string;
  };
}
