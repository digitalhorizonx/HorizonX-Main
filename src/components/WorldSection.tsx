import { useRef } from "react";
import type { World } from "../lib/worlds";
import { Vignette } from "./vignettes";

/**
 * One stage of the journey. The visitor "arrives" at a world:
 * stage number, narrative, living vignette with pointer-reactive tilt.
 */
export function WorldSection({ world, order }: { world: World; order: number }) {
  const stageRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty("--tilt-x", `${(-y * 7).toFixed(2)}deg`);
    el.style.setProperty("--tilt-y", `${(x * 9).toFixed(2)}deg`);
    el.style.setProperty("--light-x", `${(x * 100 + 50).toFixed(1)}%`);
    el.style.setProperty("--light-y", `${(y * 100 + 50).toFixed(1)}%`);
  };

  const onLeave = () => {
    const el = stageRef.current;
    if (!el) return;
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
  };

  return (
    <section
      id={world.id}
      className={`world world--${world.vignette}`}
      style={{
        ["--w-color" as string]: world.color,
        ["--w-soft" as string]: world.colorSoft,
      }}
    >
      <div className="hx-container world__grid">
        <div className="world__copy">
          <p className="hx-kicker world__kicker hx-reveal">
            World {String(order + 1).padStart(2, "0")} · Stage {world.index}%
          </p>
          <span className="world__index hx-reveal" data-delay="0.05" aria-hidden>
            {world.index}
            <em>%</em>
          </span>
          <h2 className="world__name hx-reveal" data-delay="0.1">
            {world.name}
          </h2>
          <p className="world__tagline hx-reveal" data-delay="0.15">
            {world.tagline}
          </p>
          <p className="world__narrative hx-reveal" data-delay="0.2">
            {world.narrative}
          </p>
          <ul className="world__themes hx-reveal" data-delay="0.25">
            {world.themes.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <div className="world__actions hx-reveal" data-delay="0.3">
            <a
              className="hx-btn hx-btn--glow"
              style={{ ["--btn-glow" as string]: world.color }}
              href={world.url}
              target="_blank"
              rel="noreferrer"
            >
              Explore Platform <span className="hx-btn__arrow">→</span>
            </a>
            <a className="hx-btn hx-btn--ghost" href={world.demoUrl} target="_blank" rel="noreferrer">
              {order === 0 ? "Visit XVerse Demo" : "View Live Demo"}
            </a>
          </div>
        </div>

        <div
          className="world__stage hx-reveal"
          data-delay="0.2"
          ref={stageRef}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
        >
          <div className="world__stage-inner">
            <Vignette world={world} />
          </div>
          <div className="world__stage-light" />
        </div>
      </div>
    </section>
  );
}
