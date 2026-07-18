import { useMemo, useState } from "react";
import { WORLDS, XVERSE_URL } from "../lib/worlds";
import { EXTERNAL_LINK_REL } from "../lib/ecosystem";
import { fmt, useI18n } from "../i18n";
import {
  computeAssessment,
  emptyAnswers,
  type AssessmentAnswers,
} from "../lib/assessment";

/**
 * The digitalization assessment — a rules-based, five-question evaluation.
 * Scoring lives in src/lib/assessment.ts; questions, reasons, impacts, and
 * every label render from the active locale's dictionary.
 */
export function Calculator() {
  const { t } = useI18n();
  const [answers, setAnswers] = useState<AssessmentAnswers>(emptyAnswers);
  const [sectorId, setSectorId] = useState<string | null>(null);

  const result = useMemo(() => computeAssessment(answers), [answers]);
  const sector = t.assessment.sectors.find((s) => s.id === sectorId) ?? null;
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
          <p className="hx-kicker hx-reveal">{t.assessment.kicker}</p>
          <h2 className="calc__title hx-reveal" data-delay="0.08">
            {t.assessment.titlePre}
            <span className="calc__title-accent">{t.assessment.titleAccent}</span>
            {t.assessment.titlePost}
          </h2>
          <p className="calc__lead hx-reveal" data-delay="0.16">
            {t.assessment.lead}
          </p>
        </div>

        <div className="calc__sectors hx-reveal" data-delay="0.18" role="group" aria-label={t.assessment.sectorsLabel}>
          <span className="calc__sectors-label">{t.assessment.sectorsLabel}</span>
          <div className="calc__sectors-chips">
            {t.assessment.sectors.map((s) => (
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
            {WORLDS.map((w, i) => (
              <div
                key={w.id}
                className="calc-q"
                style={{ ["--w-color" as string]: w.color }}
              >
                <div className="calc-q__text">
                  <span className="calc-q__num">{String(i + 1).padStart(2, "0")}</span>
                  <span>{t.worlds[w.id].question}</span>
                </div>
                <div className="calc-q__toggle" role="group" aria-label={t.worlds[w.id].question}>
                  <button
                    className={answers[w.id] === true ? "is-active" : ""}
                    onClick={() => set(w.id, true)}
                    aria-pressed={answers[w.id] === true}
                  >
                    {t.assessment.yes}
                  </button>
                  <button
                    className={answers[w.id] === false ? "is-active is-no" : ""}
                    onClick={() => set(w.id, false)}
                    aria-pressed={answers[w.id] === false}
                  >
                    {t.assessment.notYet}
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
            <span className="calc__result-kicker">{t.assessment.resultKicker}</span>
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
                  style={{ ["--tick-pos" as string]: `${w.index}%` }}
                />
              ))}
            </div>

            {result.complete ? (
              <div className="calc__verdict">
                <div className="calc__verdict-row">
                  <span>{t.assessment.currentStage}</span>
                  <strong data-testid="assessment-stage">
                    {t.assessment.stages[result.stageKey]}
                  </strong>
                </div>
                {rec ? (
                  <>
                    <div className="calc__verdict-row">
                      <span>{t.assessment.recommendedNext}</span>
                      <strong style={{ color: rec.product.color }} data-testid="assessment-next">
                        {rec.product.name} — {t.worlds[rec.product.id].tagline}
                      </strong>
                    </div>
                    <div className="calc__verdict-row">
                      <span>{t.assessment.whyThisStep}</span>
                      <strong className="calc__verdict-reason">
                        {t.assessment.reasons[rec.product.id]}
                        {sector?.note ? ` ${sector.note}` : ""}
                      </strong>
                    </div>
                    <div className="calc__verdict-row">
                      <span>{t.assessment.expectedImpact}</span>
                      <strong>{t.assessment.impacts[rec.product.id]}</strong>
                    </div>
                    <div className="calc__verdict-row">
                      <span>{t.assessment.takesYouTo}</span>
                      <strong>{fmt(t.assessment.digitalized, { pct: rec.reachesIndex })}</strong>
                    </div>
                    <div className="calc__actions">
                      <a
                        className="hx-btn hx-btn--primary"
                        href={rec.product.url}
                        target="_blank"
                        rel={EXTERNAL_LINK_REL}
                      >
                        {fmt(t.assessment.continueWith, { name: rec.product.name })}{" "}
                        <span className="hx-btn__arrow">→</span>
                      </a>
                      <a
                        className="hx-btn hx-btn--ghost"
                        href={XVERSE_URL}
                        target="_blank"
                        rel={EXTERNAL_LINK_REL}
                      >
                        {t.assessment.seeExamples}
                      </a>
                      <button className="hx-btn hx-btn--ghost" onClick={reset}>
                        {t.assessment.startOver}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="calc__verdict-row">
                      <span>{t.assessment.statusLabel}</span>
                      <strong>{t.assessment.fullyDigitalized}</strong>
                    </div>
                    <p className="calc__verdict-note">{t.assessment.frontierNote}</p>
                    <div className="calc__actions">
                      <a
                        className="hx-btn hx-btn--primary"
                        href={XVERSE_URL}
                        target="_blank"
                        rel={EXTERNAL_LINK_REL}
                      >
                        {t.assessment.exploreXverse} <span className="hx-btn__arrow">→</span>
                      </a>
                      <button className="hx-btn hx-btn--ghost" onClick={reset}>
                        {t.assessment.startOver}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <p className="calc__hint">
                {fmt(remaining === 1 ? t.assessment.hintOne : t.assessment.hintOther, {
                  n: remaining,
                })}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
