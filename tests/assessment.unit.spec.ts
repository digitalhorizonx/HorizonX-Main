import { expect, test } from "@playwright/test";
import {
  computeAssessment,
  emptyAnswers,
  ASSESSMENT_QUESTIONS,
} from "../src/lib/assessment";
import { WORLDS } from "../src/lib/worlds";
import type { AssessmentAnswers } from "../src/lib/assessment";

/**
 * Unit-level coverage of the scoring model, run in Node by the Playwright
 * runner (no browser). This is the single source of scoring truth the E2E
 * calculator tests rely on — the logic itself is not duplicated there.
 */

function answersWith(yes: string[]): AssessmentAnswers {
  const a = emptyAnswers();
  for (const w of WORLDS) a[w.id] = yes.includes(w.id);
  return a;
}

test.describe("Digitalization Index model", () => {
  test("weights are 30/30/20/10/10 and sum to 100", () => {
    expect(WORLDS.map((w) => w.weight)).toEqual([30, 30, 20, 10, 10]);
    expect(WORLDS.reduce((s, w) => s + w.weight, 0)).toBe(100);
  });

  test("cumulative index is 30/60/80/90/100", () => {
    expect(WORLDS.map((w) => w.index)).toEqual([30, 60, 80, 90, 100]);
  });

  test("questions mirror the five worlds in order", () => {
    expect(ASSESSMENT_QUESTIONS.map((q) => q.id)).toEqual(WORLDS.map((w) => w.id));
    expect(ASSESSMENT_QUESTIONS.map((q) => q.weight)).toEqual(WORLDS.map((w) => w.weight));
  });
});

test.describe("computeAssessment", () => {
  test("all 'no' → 0%, Offline, recommends Xability", () => {
    const r = computeAssessment(answersWith([]));
    expect(r.score).toBe(0);
    expect(r.complete).toBe(true);
    expect(r.stageLabel).toBe("Offline");
    expect(r.recommendation?.product.id).toBe("xability");
    expect(r.recommendation?.reachesIndex).toBe(30);
  });

  test("two 'yes' (xability, xsite) → 60%, recommends XApps", () => {
    const r = computeAssessment(answersWith(["xability", "xsite"]));
    expect(r.score).toBe(60);
    expect(r.stageLabel).toBe("Connected");
    expect(r.recommendation?.product.id).toBe("xapps");
    expect(r.recommendation?.reachesIndex).toBe(80);
  });

  test("all 'yes' → 100%, no further recommendation", () => {
    const r = computeAssessment(answersWith(WORLDS.map((w) => w.id)));
    expect(r.score).toBe(100);
    expect(r.stageLabel).toBe("Intelligent");
    expect(r.recommendation).toBeNull();
  });

  test("recommendation is always the EARLIEST uncovered stage", () => {
    // covered later stages don't change the earliest gap
    const r = computeAssessment(answersWith(["xsite", "xauto", "xai"]));
    expect(r.score).toBe(50);
    expect(r.recommendation?.product.id).toBe("xability");
  });

  test("score can never exceed 100 or drop below 0", () => {
    const ids = WORLDS.map((w) => w.id);
    for (let mask = 0; mask < 1 << ids.length; mask++) {
      const yes = ids.filter((_, i) => mask & (1 << i));
      const r = computeAssessment(answersWith(yes));
      expect(r.score).toBeGreaterThanOrEqual(0);
      expect(r.score).toBeLessThanOrEqual(100);
    }
  });

  test("incomplete answers are reported, not scored as complete", () => {
    const a = emptyAnswers();
    a.xability = true;
    const r = computeAssessment(a);
    expect(r.complete).toBe(false);
    expect(r.answeredCount).toBe(1);
  });

  test("every recommendation carries a reason and impact category", () => {
    for (const w of WORLDS) {
      const yes = WORLDS.filter((x) => x.index < w.index).map((x) => x.id);
      const r = computeAssessment(answersWith(yes));
      expect(r.recommendation?.product.id).toBe(w.id);
      expect(r.recommendation?.reason.length).toBeGreaterThan(20);
      expect(r.recommendation?.impact.length).toBeGreaterThan(3);
    }
  });
});
