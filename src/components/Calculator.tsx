import { useMemo, useState } from "react";
import { WORLDS, XVERSE_URL } from "../lib/worlds";

type Answers = Record<string, boolean | null>;

/**
 * The intelligent assessment: five questions → instant Digitalization
 * Index, recommended next stage, and projected impact.
 */
export function Calculator() {
  const [answers, setAnswers] = useState<Answers>(
    Object.fromEntries(WORLDS.map((w) => [w.id, null]))
  );

  const answeredCount = Object.values(answers).filter((v) => v !== null).length;
  const complete = answeredCount === WORLDS.length;

  const result = useMemo(() => {
    const score = WORLDS.reduce(
      (sum, w) => sum + (answers[w.id] === true ? w.weight : 0),
      0
    );
    const next = WORLDS.find((w) => answers[w.id] !== true) ?? null;
    // Projected impact: closing the next stage compounds on what exists.
    // Earlier stages unlock disproportionate reach; later stages compound margin.
    const roiByStage: Record<string, string> = {
      xability: "3–5× audience reach in 90 days",
      xsite: "+40% qualified inbound leads",
      xapps: "–30% operating overhead",
      xauto: "500+ hours of manual work saved / year",
      xai: "+25% forecast accuracy, decisions in minutes",
    };
    return {
      score,
      next,
      roi: next ? roiByStage[next.id] : "Compounding advantage — you are the benchmark",
    };
  }, [answers]);

  const set = (id: string, value: boolean) =>
    setAnswers((a) => ({ ...a, [id]: value }));

  return (
    <section id="calculator" className="calc">
      <div className="hx-container">
        <div className="calc__head">
          <p className="hx-kicker hx-reveal">Digitalization Calculator</p>
          <h2 className="calc__title hx-reveal" data-delay="0.08">
            Where is <span className="calc__title-accent">your</span> business
            on the index?
          </h2>
          <p className="calc__lead hx-reveal" data-delay="0.16">
            Five questions. Your score, your next step, and the platform built
            for it — instantly.
          </p>
        </div>

        <div className="calc__grid">
          <div className="calc__questions hx-glass hx-reveal" data-delay="0.2">
            {WORLDS.map((w, i) => (
              <div key={w.id} className="calc-q" style={{ ["--w-color" as string]: w.color }}>
                <div className="calc-q__text">
                  <span className="calc-q__num">{String(i + 1).padStart(2, "0")}</span>
                  <span>{w.calculatorQuestion}</span>
                </div>
                <div className="calc-q__toggle" role="group" aria-label={w.calculatorQuestion}>
                  <button
                    className={answers[w.id] === true ? "is-active" : ""}
                    onClick={() => set(w.id, true)}
                    aria-pressed={answers[w.id] === true}
                  >
                    Yes
                  </button>
                  <button
                    className={answers[w.id] === false ? "is-active is-no" : ""}
                    onClick={() => set(w.id, false)}
                    aria-pressed={answers[w.id] === false}
                  >
                    Not yet
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div
            className={`calc__result hx-glass hx-reveal ${complete ? "is-ready" : ""}`}
            data-delay="0.28"
            style={{
              ["--w-color" as string]: result.next?.color ?? "#39ffc5",
            }}
            aria-live="polite"
          >
            <span className="calc__result-kicker">Your Digitalization Index</span>
            <div className="calc__score">
              <span className="calc__score-value">
                {complete ? result.score : "--"}
              </span>
              <span className="calc__score-pct">%</span>
            </div>
            <div className="calc__meter">
              <div
                className="calc__meter-fill"
                style={{ width: complete ? `${result.score}%` : "0%" }}
              />
              {WORLDS.map((w) => (
                <span
                  key={w.id}
                  className="calc__meter-tick"
                  style={{ left: `${w.index}%` }}
                />
              ))}
            </div>

            {complete ? (
              <div className="calc__verdict">
                {result.next ? (
                  <>
                    <div className="calc__verdict-row">
                      <span>Recommended next step</span>
                      <strong style={{ color: result.next.color }}>
                        {result.next.name} — {result.next.tagline}
                      </strong>
                    </div>
                    <div className="calc__verdict-row">
                      <span>Estimated impact</span>
                      <strong>{result.roi}</strong>
                    </div>
                    <div className="calc__verdict-row">
                      <span>Takes you to</span>
                      <strong>{result.next.index}% digitalized</strong>
                    </div>
                    <div className="calc__actions">
                      <a
                        className="hx-btn hx-btn--primary"
                        href={result.next.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Start Now <span className="hx-btn__arrow">→</span>
                      </a>
                      <a
                        className="hx-btn hx-btn--glow"
                        style={{ ["--btn-glow" as string]: result.next.color }}
                        href={result.next.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Explore Platform
                      </a>
                      <a
                        className="hx-btn hx-btn--ghost"
                        href={XVERSE_URL}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View Demo
                      </a>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="calc__verdict-row">
                      <span>Status</span>
                      <strong>Fully digitalized — 100%</strong>
                    </div>
                    <p className="calc__verdict-note">
                      You operate at the frontier. Talk to us about pushing it further.
                    </p>
                    <div className="calc__actions">
                      <a
                        className="hx-btn hx-btn--primary"
                        href={XVERSE_URL}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Launch XVerse <span className="hx-btn__arrow">→</span>
                      </a>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <p className="calc__hint">
                Answer {WORLDS.length - answeredCount} more question
                {WORLDS.length - answeredCount === 1 ? "" : "s"} to reveal your
                score and next step.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
