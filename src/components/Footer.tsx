import { WORLDS, XVERSE_URL } from "../lib/worlds";
import { useI18n } from "../i18n";
import { SECTORS_CONTENT, SECTOR_BASE } from "../content/sectors";
import { Logo } from "./Logo";

export function Footer() {
  const { t, href, locale } = useI18n();

  return (
    <footer className="footer">
      <div className="hx-container footer__grid">
        <div className="footer__brand">
          <Logo size={26} />
          <p>
            {t.footer.tagline1}
            <br />
            {t.footer.tagline2}
          </p>
        </div>
        <nav className="footer__col" aria-label={t.footer.platforms}>
          <span className="footer__col-title">{t.footer.platforms}</span>
          {WORLDS.map((w) => (
            <a key={w.id} href={w.url} target="_blank" rel="noopener noreferrer">
              {w.name}
              <em>{w.index}%</em>
            </a>
          ))}
        </nav>
        <nav className="footer__col" aria-label={t.footer.experience}>
          <span className="footer__col-title">{t.footer.experience}</span>
          <a href={href("/#index")}>{t.footer.theIndex}</a>
          <a href={href("/xbrain")}>XBrain</a>
          <a href={href("/#calculator")}>{t.footer.calculator}</a>
          <a href={href("/investors")}>{t.investors.kicker}</a>
          <a href={XVERSE_URL} target="_blank" rel="noopener noreferrer">
            {t.footer.xverseDemo}
          </a>
        </nav>
        <nav className="footer__col" aria-label={t.footer.sectors}>
          <span className="footer__col-title">{t.footer.sectors}</span>
          {SECTORS_CONTENT.filter((s) => s.published).map((sector) => (
            // sector pages are English-only for now (see docs/CONTENT_SEO_ROADMAP.md)
            <a key={sector.slug} href={`${SECTOR_BASE}/${sector.slug}`} lang="en">
              {sector.name}
            </a>
          ))}
        </nav>
        <div className="footer__col footer__meter" aria-hidden>
          <span className="footer__col-title">{t.footer.journey}</span>
          <div className="footer__scale">
            <span className="footer__scale-bar" />
            <div className="footer__scale-labels">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </div>
      <div className="hx-container footer__base">
        <span>
          © {new Date().getFullYear()} HorizonX. {t.footer.rights}
        </span>
        <span className="footer__base-mono" dir="ltr">
          {t.footer.online}
        </span>
      </div>
    </footer>
  );
}
