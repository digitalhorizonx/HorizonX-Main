import { useEffect, useState } from "react";
import { journey } from "../lib/progressStore";
import { WORLDS } from "../lib/worlds";
import { EXTERNAL_LINK_REL, FLAGSHIP, XVERSE } from "../lib/ecosystem";
import { useRoute } from "../lib/router";
import { Logo } from "./Logo";

export function Nav() {
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
  const onHome = useRoute() === FLAGSHIP.routes.home;

  return (
    <header className="nav">
      <a href="/#hero" className="nav__brand" aria-label="HorizonX — back to start">
        <Logo />
      </a>

      <nav className={`nav__links ${open ? "is-open" : ""}`} aria-label="Main navigation">
        {WORLDS.map((w) => (
          <a
            key={w.id}
            href={`/#${w.id}`}
            className="nav__link"
            style={{ ["--w-color" as string]: w.color }}
            onClick={close}
          >
            <span className="nav__link-index">{w.index}%</span>
            {w.name}
          </a>
        ))}
        <span className="nav__divider" aria-hidden />
        <a href={FLAGSHIP.routes.xbrain} className="nav__link" onClick={close}>
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
        <a href={FLAGSHIP.routes.investors} className="nav__link" onClick={close}>
          Investors
        </a>
        <a href="/#calculator" className="nav__link nav__link--cta" onClick={close}>
          Your Index
        </a>
      </nav>

      <div className="nav__meta">
        {onHome && (
          <div className="nav__index" style={{ ["--accent" as string]: accent }}>
            <span className="nav__index-label">Index</span>
            <span className="nav__index-value">{String(index).padStart(2, "0")}%</span>
          </div>
        )}
        <button
          className={`nav__burger ${open ? "is-open" : ""}`}
          aria-label="Menu"
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
