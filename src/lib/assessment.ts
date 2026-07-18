import { WORLDS, type World } from "./worlds";
import type { ProductId } from "./ecosystem";

/**
 * ============================================================
 * DIGITALIZATION ASSESSMENT — typed domain model
 * ============================================================
 *
 * A rules-based digitalization assessment. It is deterministic: the score is
 * the sum of the stage weights the business already covers (30/30/20/10/10),
 * and the recommendation is the earliest uncovered stage. There is no AI
 * analysis in this phase and copy must not claim otherwise.
 *
 * FUTURE INTEGRATION BOUNDARY
 * ---------------------------
 * This module is the seam where a future backend plugs in. Planned (NOT
 * implemented here — requires services outside this repository):
 *   - Business-profile persistence (unified business memory)
 *   - Dynamic sector-specific question sets
 *   - Lead qualification and routing
 *   - XBrain-driven recommendations and generated digitalization roadmaps
 * The `AssessmentResult` shape is the contract those services would fulfill;
 * UI components must depend on this module, never on scoring details.
 */

export interface AssessmentQuestion {
  /** Stage the question probes — one per product world. */
  id: ProductId;
  text: string;
  /** Index weight contributed when answered "yes". */
  weight: number;
}

export type AssessmentAnswers = Record<ProductId, boolean | null>;

export type ImpactCategory =
  | "Audience & reach"
  | "Inbound & conversion"
  | "Operational efficiency"
  | "Time & consistency"
  | "Decision intelligence";

export interface AssessmentRecommendation {
  product: World;
  /** why this stage is the next highest-impact action */
  reason: string;
  /** category of expected impact — a direction, not an invented statistic */
  impact: ImpactCategory;
  /** cumulative index reached once the stage is covered */
  reachesIndex: number;
}

export interface AssessmentResult {
  /** 0–100, always a multiple of the stage weights */
  score: number;
  /** the stage band the business currently sits in */
  stageLabel: string;
  complete: boolean;
  answeredCount: number;
  recommendation: AssessmentRecommendation | null;
}

export interface Sector {
  id: string;
  label: string;
  /** one tailored explanatory line — copy only, not sector-specific logic */
  note: string;
}

/** Broad sectors. These tailor explanatory copy only; the scoring model is identical for all. */
export const SECTORS: Sector[] = [
  { id: "fnb", label: "Food & beverage", note: "For F&B businesses, digital presence and ordering journeys usually move first." },
  { id: "healthcare", label: "Healthcare", note: "For healthcare, trusted presence and booking systems usually move first." },
  { id: "automotive", label: "Automotive", note: "For automotive businesses, inventory visibility and lead follow-up usually move first." },
  { id: "realestate", label: "Real estate", note: "For real estate, listing reach and lead routing usually move first." },
  { id: "retail", label: "Retail", note: "For retail, content reach and e-commerce usually move first." },
  { id: "services", label: "Professional services", note: "For service firms, credibility and inbound conversion usually move first." },
  { id: "tech", label: "Startup / technology", note: "For startups, speed from presence to product usually matters most." },
  { id: "other", label: "Other", note: "" },
];

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = WORLDS.map((w) => ({
  id: w.id,
  text: w.calculatorQuestion,
  weight: w.weight,
}));

export function emptyAnswers(): AssessmentAnswers {
  return Object.fromEntries(WORLDS.map((w) => [w.id, null])) as AssessmentAnswers;
}

const RECOMMENDATION_DETAIL: Record<ProductId, { reason: string; impact: ImpactCategory }> = {
  xability: {
    reason:
      "Without an active digital presence, nothing else in the network has an audience or data to work with. Presence is the first structured signal your business produces.",
    impact: "Audience & reach",
  },
  xsite: {
    reason:
      "Your audience exists but has no permanent destination you own. A conversion-focused site turns attention into measurable inbound demand.",
    impact: "Inbound & conversion",
  },
  xapps: {
    reason:
      "Demand is arriving but operations still live in disconnected spreadsheets and chats. Operational systems put your processes and numbers in one place.",
    impact: "Operational efficiency",
  },
  xauto: {
    reason:
      "Your systems exist but people still move data between them by hand. Automation connects the tools you already run and removes repeated manual work.",
    impact: "Time & consistency",
  },
  xai: {
    reason:
      "Your business now produces connected, structured data — the prerequisite for AI agents that answer, follow up, and forecast using your own operations.",
    impact: "Decision intelligence",
  },
};

function stageLabelFor(score: number): string {
  if (score <= 0) return "Offline";
  if (score < 60) return "Present";
  if (score < 80) return "Connected";
  if (score < 90) return "Operational";
  if (score < 100) return "Automated";
  return "Intelligent";
}

/**
 * Deterministic scoring: sum of covered stage weights; recommendation is the
 * earliest stage not yet covered. Guaranteed 0 ≤ score ≤ 100.
 */
export function computeAssessment(answers: AssessmentAnswers): AssessmentResult {
  const answeredCount = WORLDS.filter((w) => answers[w.id] !== null).length;
  const complete = answeredCount === WORLDS.length;

  const score = WORLDS.reduce(
    (sum, w) => sum + (answers[w.id] === true ? w.weight : 0),
    0
  );

  const nextWorld = WORLDS.find((w) => answers[w.id] !== true) ?? null;

  const recommendation: AssessmentRecommendation | null = nextWorld
    ? {
        product: nextWorld,
        reason: RECOMMENDATION_DETAIL[nextWorld.id].reason,
        impact: RECOMMENDATION_DETAIL[nextWorld.id].impact,
        reachesIndex: nextWorld.index,
      }
    : null;

  return {
    score: Math.min(100, Math.max(0, score)),
    stageLabel: stageLabelFor(score),
    complete,
    answeredCount,
    recommendation,
  };
}
