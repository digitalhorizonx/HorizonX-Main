import { WORLDS } from "../lib/worlds";

/**
 * The Digitalization Intelligence Network — XBrain at the center, the five
 * products around it, signals traveling between them.
 *
 * Deliberately built from DOM + SVG (not WebGL) so it stays performant,
 * accessible, and works everywhere including the non-WebGL fallback path.
 * Line animation is pure CSS and disabled under prefers-reduced-motion.
 *
 * Node positions (percentages of the container):
 *          XSite
 *   Xability     XApps
 *         XBrain
 *     XAuto     XAI
 */
const NODE_POS: Record<string, { x: number; y: number }> = {
  xsite: { x: 50, y: 8 },
  xability: { x: 8, y: 30 },
  xapps: { x: 92, y: 30 },
  xauto: { x: 18, y: 86 },
  xai: { x: 82, y: 86 },
};

const CENTER = { x: 50, y: 52 };

export function XBrainNetwork({ interactive = true }: { interactive?: boolean }) {
  return (
    <div
      className="xbnet"
      role="img"
      aria-label="Network diagram: XBrain, the HorizonX intelligence layer, sits at the center and connects to all five products — Xability, XSite, XApps, XAuto, and XAI. Business signals flow between each product and XBrain."
    >
      <svg className="xbnet__wires" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        {WORLDS.map((w) => {
          const p = NODE_POS[w.id];
          return (
            <line
              key={w.id}
              className="xbnet__wire"
              x1={CENTER.x}
              y1={CENTER.y}
              x2={p.x}
              y2={p.y}
              stroke={w.color}
            />
          );
        })}
      </svg>

      {WORLDS.map((w, i) => {
        const p = NODE_POS[w.id];
        const label = (
          <>
            <span className="xbnet__node-dot" />
            <span className="xbnet__node-name">{w.name}</span>
            <span className="xbnet__node-role">{w.tagline}</span>
          </>
        );
        const style = {
          ["--w-color" as string]: w.color,
          ["--n" as string]: i,
          left: `${p.x}%`,
          top: `${p.y}%`,
        };
        return interactive ? (
          <a key={w.id} className="xbnet__node" href={`/#${w.id}`} style={style}>
            {label}
          </a>
        ) : (
          <span key={w.id} className="xbnet__node" style={style}>
            {label}
          </span>
        );
      })}

      <div className="xbnet__core" aria-hidden>
        <span className="xbnet__core-ring xbnet__core-ring--1" />
        <span className="xbnet__core-ring xbnet__core-ring--2" />
        <span className="xbnet__core-glow" />
        <span className="xbnet__core-label">XBrain</span>
        <span className="xbnet__core-sub">Intelligence Layer</span>
      </div>
    </div>
  );
}

/**
 * Plain-DOM equivalent of the network for screen readers and as a universal
 * fallback — rendered alongside the visualization.
 */
export function XBrainNetworkList() {
  return (
    <ul className="xbnet-list">
      {WORLDS.map((w) => (
        <li key={w.id} style={{ ["--w-color" as string]: w.color }}>
          <strong>{w.name}</strong> — {w.role}
        </li>
      ))}
    </ul>
  );
}
