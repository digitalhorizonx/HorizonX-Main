import { useMemo, useState } from "react";
import { WORLDS, XVERSE_URL } from "../lib/worlds";
import { EXTERNAL_LINK_REL } from "../lib/ecosystem";
import {
  ASSESSMENT_QUESTIONS,
  SECTORS,
  computeAssessment,
  emptyAnswers,
  type AssessmentAnswers,
} from "../lib/assessment";

/**
 * The digitalization assessment — a rules-based, five-question evaluation.
 * All scoring and recommendation logic lives in src/lib/assessment.ts;
 * this component only presents it.
 */
export function Calculator() {
  const [answers, setAnswers] = useState<AssessmentAnswers>(emptyAnswers);
  const [sectorId, setSectorId] = useState<string | null>(null);

  const result = useMemo(() => computeAssessment(answers), [answers]);
  const sector = SECTORS.find((s) => s.id === sectorId) ?? null;
  const worldById = (id: string) => WORLDS.find((w) => w.id === id)!;

  const set = (id: string, value: boolean) =>
    setAnswers((a) => ({ ...a, [id]: value }));

  const reset = () => {
    setAnswers(emptyAnswers());
    setSectorId(null);
  };

  const remaining = WORLDS.length - result.answeredCount;
  const rec = result.recommendation;

  return (
    <section id="calculator" className="calc">
      <div className="hx-container">
        <div className="calc__head">
          <p className="hx-kicker hx-reveal">Digitalization Assessment</p>
          <h2 className="calc__title hx-reveal" data-delay="0.08">
            Where is <span className="calc__title-accent">your</span> business
            on the index?
          </h2>
          <p className="calc__lead hx-reveal" data-delay="0.16">
            A five-question, rules-based assessment. Your score, your current
            stage, and the platform built for your next step — instantly.
          </p>
        </div>

        <div className="calc__sectors hx-reveal" data-delay="0.18" role="group" aria-label="Your sector (optional)">
          <span className="calc__sectors-label">Your sector · optional</span>
          <div className="calc__sectors-chips">
            {SECTORS.map((s) => (
              <button
                key={s.id}
                className={`calc__sector-chip ${sectorId === s.id ? "is-active" : ""}`}
                aria-pressed={sectorId === s.id}
                onClick={() => setSectorId(sectorId === s.id ? null : s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="calc__grid">
          <div className="calc__questions hx-glass hx-reveal" data-delay="0.2">
            {ASSESSMENT_QUESTIONS.map((q, i) => (
              <div
                key={q.id}
                className="calc-q"
                style={{ ["--w-color" as string]: worldById(q.id).color }}
              >
                <div className="calc-q__text">
                  <span className="calc-q__num">{String(i + 1).padStart(2, "0")}</span>
                  <span>{q.text}</span>
                </div>
                <div className="calc-q__toggle" role="group" aria-label={q.text}>
                  <button
                    className={answers[q.id] === true ? "is-active" : ""}
                    onClick={() => set(q.id, true)}
                    aria-pressed={answers[q.id] === true}
                  >
                    Yes
                  </button>
                  <button
                    className={answers[q.id] === false ? "is-active is-no" : ""}
                    onClick={() => set(q.id, false)}
                    aria-pressed={answers[q.id] === false}
                  >
                    Not yet
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div
            className={`calc__result hx-glass hx-reveal ${result.complete ? "is-ready" : ""}`}
            data-delay="0.28"
            style={{
              ["--w-color" as string]: rec?.product.color ?? "#39ffc5",
            }}
            aria-live="polite"
          >
            <span className="calc__result-kicker">Your Digitalization Index</span>
            <div className="calc__score">
              <span className="calc__score-value" data-testid="assessment-score">
                {result.complete ? result.score : "--"}
              </span>
              <span className="calc__score-pct">%</span>
            </div>
            <div className="calc__meter">
              <div
                className="calc__meter-fill"
                style={{ width: result.complete ? `${result.score}%` : "0%" }}
              />
              {WORLDS.map((w) => (
                <span
                  key={w.id}
                  className="calc__meter-tick"
                  style={{ left: `${w.index}%` }}
                />
              ))}
            </div>

            {result.complete ? (
              <div className="calc__verdict">
                <div className="calc__verdict-row">
                  <span>Current stage</span>
                  <strong data-testid="assessment-stage">{result.stageLabel}</strong>
                </div>
                {rec ? (
                  <>
                    <div className="calc__verdict-row">
                      <span>Recommended next step</span>
                      <strong style={{ color: rec.product.color }} data-testid="assessment-next">
                        {rec.product.name} — {rec.product.tagline}
                      </strong>
                    </div>
                    <div className="calc__verdict-row">
                      <span>Why this step</span>
                      <strong className="calc__verdict-reason">
                        {rec.reason}
                        {sector?.note ? ` ${sector.note}` : ""}
                      </strong>
                    </div>
                    <div className="calc__verdict-row">
                      <span>Expected impact</span>
                      <strong>{rec.impact}</strong>
                    </div>
                    <div className="calc__verdict-row">
                      <span>Takes you to</span>
                      <strong>{rec.reachesIndex}% digitalized</strong>
                    </div>
                    <div className="calc__actions">
                      <a
                        className="hx-btn hx-btn--primary"
                        href={rec.product.url}
                        target="_blank"
                        rel={EXTERNAL_LINK_REL}
                      >
                        Continue with {rec.product.name} <span className="hx-btn__arrow">→</span>
                      </a>
                      <a
                        className="hx-btn hx-btn--ghost"
                        href={XVERSE_URL}
                        target="_blank"
                        rel={EXTERNAL_LINK_REL}
                      >
                        See examples in XVerse
                      </a>
                      <button className="hx-btn hx-btn--ghost" onClick={reset}>
                        Start over
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="calc__verdict-row">
                      <span>Status</span>
                      <strong>Fully digitalized — 100%</strong>
                    </div>
                    <p className="calc__verdict-note">
                      You operate at the frontier. Explore what a connected
                      intelligence layer adds on top.
                    </p>
                    <div className="calc__actions">
                      <a
                        className="hx-btn hx-btn--primary"
                        href={XVERSE_URL}
                        target="_blank"
                        rel={EXTERNAL_LINK_REL}
                      >
                        Explore XVerse <span className="hx-btn__arrow">→</span>
                      </a>
                      <button className="hx-btn hx-btn--ghost" onClick={reset}>
                        Start over
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <p className="calc__hint">
                Answer {remaining} more question{remaining === 1 ? "" : "s"} to
                reveal your score and next step.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
