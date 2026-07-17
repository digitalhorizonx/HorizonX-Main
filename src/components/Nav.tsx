import { useEffect, useState } from "react";
import { journey } from "../lib/progressStore";
import { WORLDS } from "../lib/worlds";
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

  const accent = world >= 0 ? WORLDS[world].color : "#5a5e8a";

  return (
    <header className="nav">
      <a href="#hero" className="nav__brand" aria-label="HorizonX — back to start">
        <Logo />
      </a>

      <nav className={`nav__links ${open ? "is-open" : ""}`} aria-label="Worlds">
        {WORLDS.map((w) => (
          <a
            key={w.id}
            href={`#${w.id}`}
            className="nav__link"
            style={{ ["--w-color" as string]: w.color }}
            onClick={() => setOpen(false)}
          >
            <span className="nav__link-index">{w.index}%</span>
            {w.name}
          </a>
        ))}
        <a href="#calculator" className="nav__link nav__link--cta" onClick={() => setOpen(false)}>
          Your Index
        </a>
      </nav>

      <div className="nav__meta">
        <div className="nav__index" style={{ ["--accent" as string]: accent }}>
          <span className="nav__index-label">Index</span>
          <span className="nav__index-value">{String(index).padStart(2, "0")}%</span>
        </div>
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
