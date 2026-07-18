import { WORLDS, XVERSE_URL } from "../lib/worlds";

/**
 * Final beat: the whole ecosystem, one portal.
 */
export function XVerse() {
  return (
    <section id="xverse" className="xverse">
      <div className="hx-container xverse__inner">
        <p className="hx-kicker hx-reveal">XVerse</p>
        <h2 className="xverse__title hx-reveal" data-delay="0.08">
          Step inside the
          <br />
          <span className="xverse__title-gradient">entire ecosystem.</span>
        </h2>
        <p className="xverse__lead hx-reveal" data-delay="0.16">
          XVerse is the live demo universe of HorizonX — every platform, every
          stage, running. See what 100% feels like before you begin.
        </p>
        <div className="xverse__actions hx-reveal" data-delay="0.24">
          <a className="hx-btn hx-btn--primary" href={XVERSE_URL} target="_blank" rel="noopener noreferrer">
            Launch XVerse <span className="hx-btn__arrow">→</span>
          </a>
          <a className="hx-btn hx-btn--ghost" href="#calculator">
            Calculate your Index
          </a>
        </div>

        <div className="xverse__constellation hx-reveal" data-delay="0.3" aria-hidden>
          {WORLDS.map((w, i) => (
            <a
              key={w.id}
              className="xverse__node"
              href={w.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ["--w-color" as string]: w.color,
                ["--n" as string]: i,
              }}
            >
              <span className="xverse__node-dot" />
              <span className="xverse__node-name">{w.name}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
