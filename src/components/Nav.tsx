import { useEffect, useState } from "react";
import { journey } from "../lib/progressStore";
import { WORLDS } from "../lib/worlds";
import { EXTERNAL_LINK_REL, FLAGSHIP, XVERSE } from "../lib/ecosystem";
import { useRoute } from "../lib/router";
import { useI18n, splitLocalePath } from "../i18n";
import { Logo } from "./Logo";
import { LanguageSelector } from "./LanguageSelector";
import { ThemeToggle } from "./ThemeToggle";

export function Nav() {
  const { t, href } = useI18n();
  const [index, setIndex] = useState(0);
  const [world, setWorld] = useState(-1);
  const [open, setOpen] = useState(false);

  useEffect(
    () =>
      journey.subscribe((s) => {
        setIndex(s.index);
        setWorld(s.world);
      }),
    []
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const accent = world >= 0 ? WORLDS[world].color : "#5a5e8a";
  const close = () => setOpen(false);
  const onHome = splitLocalePath(useRoute()).path === FLAGSHIP.routes.home;

  return (
    <header className="nav">
      <a href={href("/#hero")} className="nav__brand" aria-label={t.nav.backToStart}>
        <Logo />
      </a>

      <nav className={`nav__links ${open ? "is-open" : ""}`} aria-label={t.nav.mainNav}>
        {WORLDS.map((w) => (
          <a
            key={w.id}
            href={href(`/#${w.id}`)}
            className="nav__link"
            style={{ ["--w-color" as string]: w.color }}
            onClick={close}
          >
            <span className="nav__link-index">{w.index}%</span>
            {w.name}
          </a>
        ))}
        <span className="nav__divider" aria-hidden />
        <a href={href(FLAGSHIP.routes.xbrain)} className="nav__link" onClick={close}>
          XBrain
        </a>
        <a
          href={XVERSE.url}
          className="nav__link"
          target="_blank"
          rel={EXTERNAL_LINK_REL}
          onClick={close}
        >
          XVerse
        </a>
        <a href={href(FLAGSHIP.routes.investors)} className="nav__link" onClick={close}>
          {t.investors.kicker}
        </a>
        <a href={href("/#calculator")} className="nav__link nav__link--cta" onClick={close}>
          {t.nav.yourIndex}
        </a>
        <div className="nav__mobile-controls">
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </nav>

      <div className="nav__meta">
        {onHome && (
          <div className="nav__index" style={{ ["--accent" as string]: accent }}>
            <span className="nav__index-label">{t.nav.indexLabel}</span>
            <span className="nav__index-value">{String(index).padStart(2, "0")}%</span>
          </div>
        )}
        <div className="nav__desktop-controls">
          <LanguageSelector />
          <ThemeToggle />
        </div>
        <button
          className={`nav__burger ${open ? "is-open" : ""}`}
          aria-label={t.nav.menu}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
