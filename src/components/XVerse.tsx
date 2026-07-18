import { WORLDS, XVERSE_URL } from "../lib/worlds";
import { useI18n } from "../i18n";

/**
 * Final beat: the whole ecosystem, one portal.
 */
export function XVerse() {
  const { t, href } = useI18n();

  return (
    <section id="xverse" className="xverse">
      <div className="hx-container xverse__inner">
        <p className="hx-kicker hx-reveal">{t.xverse.kicker}</p>
        <h2 className="xverse__title hx-reveal" data-delay="0.08">
          {t.xverse.titleA}
          <br />
          <span className="xverse__title-gradient">{t.xverse.titleB}</span>
        </h2>
        <p className="xverse__lead hx-reveal" data-delay="0.16">
          {t.xverse.lead}
        </p>
        <div className="xverse__actions hx-reveal" data-delay="0.24">
          <a className="hx-btn hx-btn--primary" href={XVERSE_URL} target="_blank" rel="noopener noreferrer">
            {t.xverse.launch} <span className="hx-btn__arrow">→</span>
          </a>
          <a className="hx-btn hx-btn--ghost" href={href("/#calculator")}>
            {t.xverse.calculate}
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
