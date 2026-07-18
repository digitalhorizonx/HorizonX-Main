import { WORLDS } from "../lib/worlds";
import { useI18n } from "../i18n";

/**
 * The Digitalization Intelligence Network — XBrain at the center, the five
 * products around it, signals traveling between them.
 *
 * Deliberately built from DOM + SVG (not WebGL) so it stays performant,
 * accessible, theme-aware, and works on the non-WebGL fallback path.
 * Line animation is pure CSS and disabled under prefers-reduced-motion.
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
  const { t, href } = useI18n();

  return (
    <div className="xbnet-wrap">
      <div className="xbnet" role="img" aria-label={t.xbrainSection.networkAria}>
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
              <span className="xbnet__node-role">{t.worlds[w.id].tagline}</span>
              {w.id === "xai" && (
                <span className="xbnet__node-badge">{t.xbrainSection.xaiBadge}</span>
              )}
            </>
          );
          const style = {
            ["--w-color" as string]: w.color,
            ["--n" as string]: i,
            ["--x" as string]: `${p.x}%`,
            ["--y" as string]: `${p.y}%`,
          };
          return interactive ? (
            <a key={w.id} className="xbnet__node" href={href(`/#${w.id}`)} style={style}>
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
          <span className="xbnet__core-sub">{t.xbrainSection.coreSub}</span>
        </div>
      </div>
      <p className="xbnet__caption">{t.xbrainSection.governedCaption}</p>
    </div>
  );
}

/**
 * Plain-DOM equivalent of the network for screen readers and as a universal
 * fallback — rendered alongside the visualization.
 */
export function XBrainNetworkList() {
  const { t } = useI18n();
  return (
    <ul className="xbnet-list">
      {WORLDS.map((w) => (
        <li key={w.id} style={{ ["--w-color" as string]: w.color }}>
          <strong>{w.name}</strong> — {t.worlds[w.id].role}
        </li>
      ))}
    </ul>
  );
}
