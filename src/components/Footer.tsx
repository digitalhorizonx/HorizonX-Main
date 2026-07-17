import { WORLDS, XVERSE_URL } from "../lib/worlds";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="footer">
      <div className="hx-container footer__grid">
        <div className="footer__brand">
          <Logo size={26} />
          <p>
            An ecosystem of specialized AI-powered platforms.
            <br />
            From 0% to 100% digitalization.
          </p>
        </div>
        <nav className="footer__col" aria-label="Platforms">
          <span className="footer__col-title">Platforms</span>
          {WORLDS.map((w) => (
            <a key={w.id} href={w.url} target="_blank" rel="noreferrer">
              {w.name}
              <em>{w.index}%</em>
            </a>
          ))}
        </nav>
        <nav className="footer__col" aria-label="Experience">
          <span className="footer__col-title">Experience</span>
          <a href="#index">The Index</a>
          <a href="#calculator">Calculator</a>
          <a href={XVERSE_URL} target="_blank" rel="noreferrer">
            XVerse Demo
          </a>
        </nav>
        <div className="footer__col footer__meter" aria-hidden>
          <span className="footer__col-title">The journey</span>
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
        <span>© {new Date().getFullYear()} HorizonX. All systems evolving.</span>
        <span className="footer__base-mono">DIGITALIZATION_INDEX :: ONLINE</span>
      </div>
    </footer>
  );
}
