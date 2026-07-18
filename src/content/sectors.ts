import type { ProductId } from "../lib/ecosystem";

/**
 * ============================================================
 * SECTOR CONTENT ARCHITECTURE — typed, data-driven
 * ============================================================
 *
 * One typed model drives every sector landing page (SectorPage.tsx renders
 * it) — no per-sector components. A sector page ships ONLY when it carries
 * enough truthful, differentiated content (`published: true`); registered but
 * unpublished sectors are excluded from routing, navigation, and the sitemap.
 *
 * Approved sectors: restaurants, clinics, hotels, universities, ngos,
 * manufacturing. Published in this milestone: restaurants, clinics — the two
 * with the strongest differentiated narratives. The rest are structured
 * placeholders documented in docs/CONTENT_SEO_ROADMAP.md.
 *
 * Language: sector pages are ENGLISH-ONLY for now. The model is
 * localization-ready (swap the strings for a per-locale record), but shipping
 * machine-thin translations would violate the quality bar; see the roadmap.
 *
 * Content rules (enforced by review + tests): no invented clients, case
 * studies, statistics, ROI percentages, or testimonials. FAQs describe real
 * product positioning only.
 */

export interface SectorFAQ {
  q: string;
  a: string;
}

export interface SectorContent {
  slug: string;
  name: string;
  published: boolean;
  metaTitle: string;
  metaDescription: string;
  kicker: string;
  title: string;
  lead: string;
  problemTitle: string;
  problems: string[];
  journeyTitle: string;
  journeyIntro: string;
  /** sector-specific role of each product along the index */
  productRoles: Record<ProductId, string>;
  workflowTitle: string;
  workflow: string[];
  xbrainNote: string;
  faqTitle: string;
  faqs: SectorFAQ[];
  statusNote: string;
}

export const SECTOR_BASE = "/digital-transformation";

const restaurants: SectorContent = {
  slug: "restaurants",
  name: "Restaurants",
  published: true,
  metaTitle: "Digital Transformation for Restaurants — HorizonX",
  metaDescription:
    "How restaurants move from 0% to 100% digitalization with HorizonX: social presence, ordering-ready websites, operational systems, automation, and AI — one connected journey instead of five disconnected vendors.",
  kicker: "Digital transformation · Restaurants",
  title: "From full tables to a full digital operation.",
  lead: "Most restaurants already fight for attention on social media — and then lose the rest of the journey to missed messages, manual orders, and numbers nobody sees. The HorizonX journey connects presence, ordering, operations, and intelligence in one path.",
  problemTitle: "Where restaurant operations fragment",
  problems: [
    "Menus and prices live in three places that never agree — profiles, PDFs, and the counter",
    "Reservations and orders arrive in DMs, calls, and walk-ins with no single record",
    "Delivery-platform data never reaches the kitchen's planning",
    "Daily revenue is known; per-dish, per-hour, per-channel performance is not",
    "Marketing posts are effort-in with no measurable path to covers or orders",
  ],
  journeyTitle: "The restaurant journey along the Digitalization Index",
  journeyIntro:
    "The index applies to a restaurant exactly as it does to any business — the same five stages, weighted 30/30/20/10/10 — but each stage has a distinctly gastronomic meaning:",
  productRoles: {
    xability:
      "Xability (→ 30%): a consistent feed of dishes, offers, and stories — planned, approved, and published on schedule, with the first structured data on what your audience responds to.",
    xsite:
      "XSite (→ 60%): a fast website that answers the three questions every guest has — menu, hours, location — and captures reservations and order intent instead of leaving them in comments.",
    xapps:
      "XApps (→ 80%): reservations, orders, and inventory in one operational view — the counter, the kitchen, and the office finally reading from the same numbers.",
    xauto:
      "XAuto (→ 90%): confirmations, reminders, review requests, and daily summaries that send themselves; supplier reorders triggered by stock levels, not memory.",
    xai:
      "XAI (→ 100%): agents grounded in your own service data — answering guest questions, forecasting busy hours, and flagging dishes whose demand is shifting.",
  },
  workflowTitle: "An example connected workflow",
  workflow: [
    "A weekend special is planned and approved in Xability, published across profiles",
    "The website's menu updates from the same approved content — no second edit",
    "Reservations from the site land in the XApps book with guest history attached",
    "XAuto confirms each booking, sends a reminder, and requests a review after the visit",
    "Weekly, the numbers return as structured data: which content produced which covers",
  ],
  xbrainNote:
    "Across every stage, XBrain — the human-governed HorizonX intelligence layer — evaluates where your restaurant sits on the index and which step earns the most next. It recommends; your team decides.",
  faqTitle: "Restaurant digitalization FAQs",
  faqs: [
    {
      q: "Does a restaurant need a website if it's active on Instagram?",
      a: "Social presence rents attention; a website owns it. On the Digitalization Index, social presence takes a restaurant to 30% — a fast site with the menu, hours, and a reservation path is what turns that attention into bookings you can count, which is the 60% stage.",
    },
    {
      q: "In what order should a restaurant digitalize?",
      a: "The index order exists because each stage feeds the next: presence first (audience and data), then the website (conversion), then operational systems (orders, reservations, inventory), then automation between them, and AI last — because agents are only as useful as the data the earlier stages produce.",
    },
    {
      q: "Is the assessment on this site AI-powered?",
      a: "No — it's a transparent, rules-based assessment: five questions weighted 30/30/20/10/10. It tells you your current stage and the next highest-impact step, with the reasoning stated openly.",
    },
    {
      q: "What is XBrain's role for a restaurant?",
      a: "XBrain is HorizonX's own intelligence layer — it orchestrates the journey and improves recommendations from measured outcomes under human governance. It is not a product you install; the client-facing AI capability is XAI, deployed at the final stage.",
    },
  ],
  statusNote:
    "Product availability varies by stage — Xability is live; see each product's landing page for current status. This page describes the journey model, not live features of every product.",
};

const clinics: SectorContent = {
  slug: "clinics",
  name: "Clinics",
  published: true,
  metaTitle: "Digital Transformation for Clinics — HorizonX",
  metaDescription:
    "How clinics and medical practices move from 0% to 100% digitalization with HorizonX: trusted presence, booking-first websites, patient-flow systems, automated reminders, and governed AI — one connected journey.",
  kicker: "Digital transformation · Clinics",
  title: "From a waiting room to a connected practice.",
  lead: "Clinics live or die on trust and time: patients need to find you, believe you, book you, and be reminded — and the practice needs every one of those steps to feed the next. That is a digitalization journey, not a collection of tools.",
  problemTitle: "Where clinic operations fragment",
  problems: [
    "Patients discover the clinic on social media but book by phone — or give up",
    "Appointment books, patient contact details, and follow-ups live in separate places",
    "No-shows cost hours because reminders depend on someone remembering to send them",
    "Repeat visits and recalls aren't systematically triggered",
    "The practice knows it is busy, but not which services, hours, or channels drive demand",
  ],
  journeyTitle: "The clinic journey along the Digitalization Index",
  journeyIntro:
    "The same five stages, weighted 30/30/20/10/10, read differently in a practice where trust and scheduling dominate:",
  productRoles: {
    xability:
      "Xability (→ 30%): a credible, consistent public presence — educational content, service explanations, and updates that build trust before the first visit, with approval workflows suited to a regulated field.",
    xsite:
      "XSite (→ 60%): a booking-first website: services, practitioners, insurance and hours answered clearly, with an appointment request path that captures demand measurably.",
    xapps:
      "XApps (→ 80%): appointments, patient contact records, and the day's schedule in one operational system the front desk and practitioners share.",
    xauto:
      "XAuto (→ 90%): confirmations, reminders, recall notices, and follow-up messages that send themselves — fewer no-shows without adding front-desk work.",
    xai:
      "XAI (→ 100%): governed agents grounded in the practice's own operational data — answering routine patient questions, surfacing schedule pressure, and forecasting demand by service.",
  },
  workflowTitle: "An example connected workflow",
  workflow: [
    "An educational post about a seasonal service is approved and published via Xability",
    "The website presents the service with a clear appointment-request path",
    "The request lands in the XApps schedule with the patient's contact record",
    "XAuto confirms, reminds before the visit, and schedules the recall afterward",
    "Demand per service and channel returns as structured data for the next month's planning",
  ],
  xbrainNote:
    "XBrain — the human-governed HorizonX intelligence layer — evaluates where the practice sits on the index and recommends the next highest-impact step. Recommendations are explainable and decisions stay with your team; patient-data handling remains within the practice's systems and policies.",
  faqTitle: "Clinic digitalization FAQs",
  faqs: [
    {
      q: "Where should a clinic start if it has no digital presence at all?",
      a: "At the first stage: a trustworthy public presence. On the Digitalization Index that is the 30% stage — before websites or systems, because presence produces the audience and the first data every later stage builds on.",
    },
    {
      q: "Why a booking-first website rather than a brochure site?",
      a: "Because the 60% stage of the index is conversion: turning attention into measurable appointment demand. A clinic site that answers services, practitioners, insurance, and hours — and captures a booking request — does the job a brochure cannot.",
    },
    {
      q: "How do automated reminders help a small practice?",
      a: "Reminders and recalls are the classic 90% stage win: repeated manual work that software sends reliably. Fewer no-shows and systematic recalls without adding front-desk load — using the systems installed at earlier stages.",
    },
    {
      q: "Is patient data used to train AI models?",
      a: "No. The XAI stage deploys agents grounded in a practice's own operational data under human governance, and HorizonX's architecture principles exclude using client data to train shared models without explicit consent.",
    },
  ],
  statusNote:
    "Product availability varies by stage — Xability is live; see each product's landing page for current status. This page describes the journey model, not live features of every product.",
};

/** Registered but unpublished — structured placeholders; see docs/CONTENT_SEO_ROADMAP.md. */
const placeholder = (slug: string, name: string): SectorContent => ({
  slug,
  name,
  published: false,
  metaTitle: `Digital Transformation for ${name} — HorizonX`,
  metaDescription: "",
  kicker: "",
  title: "",
  lead: "",
  problemTitle: "",
  problems: [],
  journeyTitle: "",
  journeyIntro: "",
  productRoles: { xability: "", xsite: "", xapps: "", xauto: "", xai: "" },
  workflowTitle: "",
  workflow: [],
  xbrainNote: "",
  faqTitle: "",
  faqs: [],
  statusNote: "",
});

export const SECTORS_CONTENT: SectorContent[] = [
  restaurants,
  clinics,
  placeholder("hotels", "Hotels"),
  placeholder("universities", "Universities"),
  placeholder("ngos", "NGOs"),
  placeholder("manufacturing", "Manufacturing"),
];

export function getSector(slug: string): SectorContent | undefined {
  return SECTORS_CONTENT.find((s) => s.slug === slug && s.published);
}

export function publishedSectors(): SectorContent[] {
  return SECTORS_CONTENT.filter((s) => s.published);
}
