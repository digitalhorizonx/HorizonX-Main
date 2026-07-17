export interface World {
  id: string;
  name: string;
  /** cumulative Digitalization Index reached after this stage */
  index: number;
  /** share of the index this stage contributes */
  weight: number;
  tagline: string;
  narrative: string;
  themes: string[];
  color: string;
  colorSoft: string;
  url: string;
  demoUrl: string;
  /** floating UI vignettes rendered inside the world */
  vignette: "creative" | "web" | "apps" | "automation" | "ai";
  calculatorQuestion: string;
}

export const XVERSE_URL = "https://xverse.horizonx.site";

export const WORLDS: World[] = [
  {
    id: "xability",
    name: "Xability",
    index: 30,
    weight: 30,
    tagline: "Social Media Operating System",
    narrative:
      "The first signal your business sends into the digital world. Xability turns raw creative energy into a living content engine — reels, stories, campaigns — planned, approved, published, and measured from one place.",
    themes: ["Content engine", "Scheduling", "Approvals", "AI content", "Analytics", "Motion graphics"],
    color: "#ff5fa2",
    colorSoft: "rgba(255, 95, 162, 0.14)",
    url: "https://xability.horizonx.site",
    demoUrl: XVERSE_URL,
    vignette: "creative",
    calculatorQuestion: "Is your business active on social media?",
  },
  {
    id: "xsite",
    name: "XSite",
    index: 60,
    weight: 30,
    tagline: "Website Platform",
    narrative:
      "Your permanent address in the digital universe. XSite builds modern web experiences — landing pages, business sites, portals — engineered for speed, SEO, and interfaces that feel a generation ahead.",
    themes: ["Business websites", "Landing pages", "Portals", "SEO", "Performance", "Analytics"],
    color: "#2ea8ff",
    colorSoft: "rgba(46, 168, 255, 0.14)",
    url: "https://xsite.horizonx.site",
    demoUrl: XVERSE_URL,
    vignette: "web",
    calculatorQuestion: "Do you have a website?",
  },
  {
    id: "xapps",
    name: "XApps",
    index: 80,
    weight: 20,
    tagline: "Business Applications",
    narrative:
      "The operating core of your company. XApps delivers ERP, CRM, portals, and custom systems — massive dashboards and mobile apps that put every process, person, and number under your control.",
    themes: ["ERP", "CRM", "Inventory", "POS", "HR & Finance", "Mobile apps"],
    color: "#7c6cff",
    colorSoft: "rgba(124, 108, 255, 0.14)",
    url: "https://xapps.horizonx.site",
    demoUrl: XVERSE_URL,
    vignette: "apps",
    calculatorQuestion: "Do you run business apps (ERP, CRM, custom systems)?",
  },
  {
    id: "xauto",
    name: "XAuto",
    index: 90,
    weight: 10,
    tagline: "Automation Platform",
    narrative:
      "The moment your business starts running itself. XAuto connects every system with workflows, bots, and pipelines — data streams that move value while you sleep.",
    themes: ["Workflows", "Bots", "Integrations", "APIs", "Pipelines", "Data streams"],
    color: "#ffb648",
    colorSoft: "rgba(255, 182, 72, 0.14)",
    url: "https://xauto.horizonx.site",
    demoUrl: XVERSE_URL,
    vignette: "automation",
    calculatorQuestion: "Do you automate workflows between your tools?",
  },
  {
    id: "xai",
    name: "XAI",
    index: 100,
    weight: 10,
    tagline: "Private AI Models",
    narrative:
      "Full digitalization. XAI gives your business its own intelligence — private models, AI employees, custom LLMs, and prediction engines trained on everything you've built along the way.",
    themes: ["Private models", "AI employees", "Custom LLMs", "Knowledge bases", "Voice", "Prediction"],
    color: "#39ffc5",
    colorSoft: "rgba(57, 255, 197, 0.14)",
    url: "https://xai.horizonx.site",
    demoUrl: XVERSE_URL,
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
