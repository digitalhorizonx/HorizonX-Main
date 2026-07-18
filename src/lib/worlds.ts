import { PRODUCTS, XVERSE, type ProductId } from "./ecosystem";

/**
 * Display model for the five product worlds of the Digitalization Index.
 *
 * URLs and deployment statuses live in ./ecosystem.ts (the single source of
 * truth) — this module owns narrative, theming, and index math only.
 *
 * The index weights 30/30/20/10/10 (cumulative 30/60/80/90/100) are a fixed
 * product decision. They are mirrored by the shader color stops, the journey
 * progress math, the assessment scoring, and the E2E tests. Do not change
 * them here without changing all of those together.
 */
export interface World {
  id: ProductId;
  name: string;
  /** cumulative Digitalization Index reached after this stage */
  index: number;
  /** share of the index this stage contributes */
  weight: number;
  tagline: string;
  /** one-line role of this product inside the network */
  role: string;
  narrative: string;
  themes: string[];
  color: string;
  colorSoft: string;
  /** public product landing page (from ecosystem config) */
  url: string;
  /** XVerse demonstrations entry point (from ecosystem config) */
  demoUrl: string;
  /** floating UI vignettes rendered inside the world */
  vignette: "creative" | "web" | "apps" | "automation" | "ai";
  calculatorQuestion: string;
}

export const XVERSE_URL = XVERSE.url;

export const WORLDS: World[] = [
  {
    id: "xability",
    name: "Xability",
    index: 30,
    weight: 30,
    tagline: "Social Media Operating System",
    role: "The digital presence and marketing operating system — and a primary data-entry point into XBrain.",
    narrative:
      "The first signal your business sends into the digital world. Xability turns raw creative energy into a living content engine — brand context, content intelligence, publishing, approvals, campaigns, and performance analytics — while collecting the first structured business and audience data in the network.",
    themes: ["Content engine", "Scheduling", "Approvals", "AI content", "Analytics", "Brand context"],
    color: "#ff5fa2",
    colorSoft: "rgba(255, 95, 162, 0.14)",
    url: PRODUCTS.xability.landingUrl,
    demoUrl: PRODUCTS.xability.xverseUrl,
    vignette: "creative",
    calculatorQuestion: "Is your business active on social media?",
  },
  {
    id: "xsite",
    name: "XSite",
    index: 60,
    weight: 30,
    tagline: "Website Platform",
    role: "The conversion, website, SEO, and digital-presence infrastructure.",
    narrative:
      "Your permanent address in the digital universe. XSite builds modern web experiences — business sites, landing pages, portals — engineered for speed, SEO, and lead capture, reusing the approved business and brand data your network already holds.",
    themes: ["Business websites", "Landing pages", "SEO", "Lead capture", "Conversion analytics", "Performance"],
    color: "#2ea8ff",
    colorSoft: "rgba(46, 168, 255, 0.14)",
    url: PRODUCTS.xsite.landingUrl,
    demoUrl: PRODUCTS.xsite.xverseUrl,
    vignette: "web",
    calculatorQuestion: "Do you have a website?",
  },
  {
    id: "xapps",
    name: "XApps",
    index: 80,
    weight: 20,
    tagline: "Business Applications",
    role: "The application and operational-system layer.",
    narrative:
      "The operating core of your company. XApps delivers CRM, booking, e-commerce, customer portals, and internal dashboards — operational applications that put your processes, people, and numbers in one connected place.",
    themes: ["CRM", "Booking", "E-commerce", "Customer portals", "Dashboards", "Operations"],
    color: "#7c6cff",
    colorSoft: "rgba(124, 108, 255, 0.14)",
    url: PRODUCTS.xapps.landingUrl,
    demoUrl: PRODUCTS.xapps.xverseUrl,
    vignette: "apps",
    calculatorQuestion: "Do you run business apps (CRM, portals, custom systems)?",
  },
  {
    id: "xauto",
    name: "XAuto",
    index: 90,
    weight: 10,
    tagline: "Automation Platform",
    role: "The workflow automation and integration layer.",
    narrative:
      "The moment your business starts running itself. XAuto connects your systems with workflows and integrations — lead routing, CRM sync, messaging flows, reporting, alerts — moving value between products while you sleep.",
    themes: ["Lead routing", "CRM sync", "Messaging flows", "Integrations", "Reporting", "Alerts"],
    color: "#ffb648",
    colorSoft: "rgba(255, 182, 72, 0.14)",
    url: PRODUCTS.xauto.landingUrl,
    demoUrl: PRODUCTS.xauto.xverseUrl,
    vignette: "automation",
    calculatorQuestion: "Do you automate workflows between your tools?",
  },
  {
    id: "xai",
    name: "XAI",
    index: 100,
    weight: 10,
    tagline: "AI Agents for Your Business",
    role: "The client-facing AI agent and private-intelligence deployment layer.",
    narrative:
      "Full digitalization. XAI deploys AI capabilities for your business — marketing analysts, sales follow-up agents, support agents, operations intelligence — grounded in the data everything before it produced. XBrain is HorizonX's own intelligence layer; XAI is how that capability is deployed for you.",
    themes: ["Marketing analyst", "Sales follow-up", "Support agents", "Operations intelligence", "Private models", "Prediction"],
    color: "#39ffc5",
    colorSoft: "rgba(57, 255, 197, 0.14)",
    url: PRODUCTS.xai.landingUrl,
    demoUrl: PRODUCTS.xai.xverseUrl,
    vignette: "ai",
    calculatorQuestion: "Do you use AI trained on your own business?",
  },
];

/** Stage color stops for the index gradient, as [t 0..1, hex] */
export const STAGE_STOPS: Array<[number, string]> = [
  [0.0, "#3d4066"],
  [0.3, "#ff5fa2"],
  [0.6, "#2ea8ff"],
  [0.8, "#7c6cff"],
  [0.9, "#ffb648"],
  [1.0, "#39ffc5"],
];
