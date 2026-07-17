import { useEffect, useMemo, useState } from "react";
import { journey } from "../lib/progressStore";
import { WORLDS } from "../lib/worlds";

const SIZE = 560;
const CENTER = SIZE / 2;
const RADIUS = 218;
const STROKE = 34;
const GAP_DEG = 3.2;

function polar(angleDeg: number, radius: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(rad),
    y: CENTER + radius * Math.sin(rad),
  };
}

function arcPath(startDeg: number, endDeg: number, radius: number) {
  const start = polar(startDeg, radius);
  const end = polar(endDeg, radius);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${large} 1 ${end.x} ${end.y}`;
}

interface Sector {
  id: string;
  name: string;
  weight: number;
  index: number;
  color: string;
  path: string;
  labelPos: { x: number; y: number };
  midDeg: number;
}

export function IndexDial() {
  const [index, setIndex] = useState(0);
  const [world, setWorld] = useState(-1);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(
    () =>
      journey.subscribe((s) => {
        setIndex(s.index);
        setWorld(s.world);
      }),
    []
  );

  const sectors = useMemo<Sector[]>(() => {
    let angle = 0;
    return WORLDS.map((w) => {
      const span = (w.weight / 100) * 360;
      const start = angle + GAP_DEG / 2;
      const end = angle + span - GAP_DEG / 2;
      const midDeg = angle + span / 2;
      angle += span;
      return {
        id: w.id,
        name: w.name,
        weight: w.weight,
        index: w.index,
        color: w.color,
        path: arcPath(start, end, RADIUS),
        labelPos: polar(midDeg, RADIUS + STROKE + 26),
        midDeg,
      };
    });
  }, []);

  return (
    <section id="index" className="dial-section">
      <div className="hx-container dial-section__head">
        <p className="hx-kicker hx-reveal">The Digitalization Index</p>
        <h2 className="dial-section__title hx-reveal" data-delay="0.08">
          One index. Five stages.
          <br />
          Your entire transformation.
        </h2>
        <p className="dial-section__lead hx-reveal" data-delay="0.16">
          Every HorizonX platform advances your business one stage further.
          Explore a sector to enter its world.
        </p>
      </div>

      <div className="dial hx-reveal" data-delay="0.2">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="dial__svg"
          role="img"
          aria-label="Digitalization Index — five stages: Xability 30%, XSite 60%, XApps 80%, XAuto 90%, XAI 100%"
        >
          {/* dormant track */}
          {sectors.map((s) => (
            <path
              key={`track-${s.id}`}
              d={s.path}
              fill="none"
              stroke="rgba(255,255,255,0.07)"
              strokeWidth={STROKE}
              strokeLinecap="round"
            />
          ))}
          {/* lit sectors */}
          {sectors.map((s, i) => {
            const lit = world >= i;
            const hover = hovered === s.id;
            return (
              <a key={s.id} href={`#${s.id}`} aria-label={`${s.name} — reach ${s.index}%`}>
                <path
                  d={s.path}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={hover ? STROKE + 6 : STROKE}
                  strokeLinecap="round"
                  className={`dial__sector ${lit ? "is-lit" : ""}`}
                  style={{
                    filter: hover
                      ? `drop-shadow(0 0 26px ${s.color})`
                      : lit
                        ? `drop-shadow(0 0 12px ${s.color}66)`
                        : "none",
                    opacity: lit ? 1 : hover ? 0.75 : 0.28,
                  }}
                  onMouseEnter={() => setHovered(s.id)}
                  onMouseLeave={() => setHovered(null)}
                />
              </a>
            );
          })}
          {/* sector labels */}
          {sectors.map((s) => (
            <text
              key={`label-${s.id}`}
              x={s.labelPos.x}
              y={s.labelPos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className={`dial__label ${hovered === s.id ? "is-hover" : ""}`}
              fill={hovered === s.id ? s.color : "rgba(230,233,255,0.55)"}
            >
              <tspan x={s.labelPos.x} dy="-0.4em" className="dial__label-name">
                {s.name}
              </tspan>
              <tspan x={s.labelPos.x} dy="1.3em" className="dial__label-pct">
                +{s.weight}%
              </tspan>
            </text>
          ))}
        </svg>

        <div className="dial__center">
          <span className="dial__center-kicker">Digitalization Index</span>
          <span className="dial__center-value">{String(index).padStart(2, "0")}%</span>
          <span className="dial__center-hint">
            {hovered
              ? WORLDS.find((w) => w.id === hovered)?.tagline
              : "Click a sector to enter its world"}
          </span>
        </div>
      </div>
    </section>
  );
}
