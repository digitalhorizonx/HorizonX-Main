import { useEffect, useState } from "react";
import { journey } from "../lib/progressStore";
import { WORLDS } from "../lib/worlds";

/**
 * Fixed vertical rail — the visitor's position in the ecosystem.
 * Each node is a stage; the filament fills as the index climbs.
 */
export function ProgressRail() {
  const [progress, setProgress] = useState(0);
  const [world, setWorld] = useState(-1);

  useEffect(
    () =>
      journey.subscribe((s) => {
        setProgress(s.progress);
        setWorld(s.world);
      }),
    []
  );

  return (
    <aside className="rail" aria-hidden>
      <div className="rail__track">
        <div className="rail__fill" style={{ height: `${progress * 100}%` }} />
      </div>
      <div className="rail__nodes">
        {WORLDS.map((w, i) => (
          <a
            key={w.id}
            href={`#${w.id}`}
            className={`rail__node ${world >= i ? "is-lit" : ""}`}
            style={{ ["--w-color" as string]: w.color }}
            title={`${w.name} — ${w.index}%`}
          >
            <span className="rail__dot" />
            <span className="rail__label">
              {w.name} <em>{w.index}%</em>
            </span>
          </a>
        ))}
      </div>
    </aside>
  );
}
