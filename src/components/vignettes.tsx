import type { World } from "../lib/worlds";

/* ============================================================
   WORLD VIGNETTES — floating holographic UI, built from CSS.
   Each vignette is a small diorama of the platform's universe.
   ============================================================ */

function CreativeVignette() {
  return (
    <div className="vg vg--creative">
      <div className="vg__float vg-reel vg-reel--a">
        <div className="vg-reel__cover vg-reel__cover--a">
          <span className="vg-reel__play" />
        </div>
        <div className="vg-reel__meta">
          <span className="vg-chip vg-chip--live">Reel · Live</span>
          <span className="vg-reel__stat">▲ 12.4k</span>
        </div>
      </div>
      <div className="vg__float vg-reel vg-reel--b">
        <div className="vg-reel__cover vg-reel__cover--b">
          <span className="vg-reel__play" />
        </div>
        <div className="vg-reel__meta">
          <span className="vg-chip">Story · Draft</span>
          <span className="vg-reel__stat">9:16</span>
        </div>
      </div>
      <div className="vg__float vg-card vg-schedule">
        <span className="vg-schedule__dot" />
        <div>
          <strong>Scheduled</strong>
          <span>Instagram · Today 18:00</span>
        </div>
      </div>
      <div className="vg__float vg-card vg-approve">
        <span className="vg-approve__check">✓</span>
        <div>
          <strong>Approved</strong>
          <span>Campaign / Summer drop</span>
        </div>
      </div>
      <div className="vg__float vg-card vg-analytics">
        <strong>Reach</strong>
        <div className="vg-analytics__bars">
          {[38, 62, 45, 80, 58, 92, 74].map((h, i) => (
            <span key={i} style={{ height: `${h}%` }} />
          ))}
        </div>
        <span className="vg-analytics__delta">+218% this month</span>
      </div>
    </div>
  );
}

function WebVignette() {
  return (
    <div className="vg vg--web">
      <div className="vg__float vg-browser">
        <div className="vg-browser__bar">
          <span className="vg-browser__dots">
            <i />
            <i />
            <i />
          </span>
          <span className="vg-browser__url">yourbusiness.com</span>
        </div>
        <div className="vg-browser__body">
          <span className="vg-skel vg-skel--kicker" />
          <span className="vg-skel vg-skel--h1" />
          <span className="vg-skel vg-skel--h1b" />
          <span className="vg-skel vg-skel--p" />
          <span className="vg-skel vg-skel--btn" />
          <div className="vg-browser__cards">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
      <div className="vg__float vg-phone vg-phone--web">
        <div className="vg-phone__screen">
          <span className="vg-skel vg-skel--h1 vg-skel--sm" />
          <span className="vg-skel vg-skel--p vg-skel--sm" />
          <span className="vg-skel vg-skel--btn vg-skel--sm" />
        </div>
      </div>
      <div className="vg__float vg-card vg-score">
        <svg viewBox="0 0 60 60" width="52" height="52">
          <circle cx="30" cy="30" r="25" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
          <circle
            cx="30"
            cy="30"
            r="25"
            fill="none"
            stroke="#2ea8ff"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="155 157"
            transform="rotate(-90 30 30)"
          />
          <text x="30" y="35" textAnchor="middle" fill="#f4f5ff" fontSize="16" fontWeight="600">
            99
          </text>
        </svg>
        <div>
          <strong>Performance</strong>
          <span>SEO · Core Web Vitals</span>
        </div>
      </div>
    </div>
  );
}

function AppsVignette() {
  return (
    <div className="vg vg--apps">
      <div className="vg__float vg-dash">
        <div className="vg-dash__side">
          <span className="vg-dash__logo" />
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="vg-dash__main">
          <div className="vg-dash__kpis">
            <div className="vg-kpi">
              <span>Revenue</span>
              <strong>$1.24M</strong>
              <em className="up">+18%</em>
            </div>
            <div className="vg-kpi">
              <span>Orders</span>
              <strong>8,412</strong>
              <em className="up">+6%</em>
            </div>
            <div className="vg-kpi">
              <span>Stock</span>
              <strong>96%</strong>
              <em>OK</em>
            </div>
          </div>
          <div className="vg-dash__chart">
            {[30, 52, 44, 68, 60, 84, 76, 95].map((h, i) => (
              <span key={i} style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </div>
      <div className="vg__float vg-phone vg-phone--apps">
        <div className="vg-phone__screen">
          <div className="vg-row">
            <span className="vg-row__avatar" />
            <span className="vg-row__lines" />
          </div>
          <div className="vg-row">
            <span className="vg-row__avatar" />
            <span className="vg-row__lines" />
          </div>
          <div className="vg-row">
            <span className="vg-row__avatar" />
            <span className="vg-row__lines" />
          </div>
        </div>
      </div>
      <div className="vg__float vg-card vg-module">
        <strong>Modules</strong>
        <div className="vg-module__grid">
          <span>ERP</span>
          <span>CRM</span>
          <span>POS</span>
          <span>HR</span>
        </div>
      </div>
    </div>
  );
}

function AutomationVignette() {
  return (
    <div className="vg vg--auto">
      <svg className="vg-flow" viewBox="0 0 420 300" fill="none">
        <path className="vg-flow__wire" d="M70 60 C 140 60, 140 150, 210 150" />
        <path className="vg-flow__wire" d="M70 240 C 140 240, 140 150, 210 150" />
        <path className="vg-flow__wire" d="M250 150 C 300 150, 300 90, 355 90" />
        <path className="vg-flow__wire" d="M250 150 C 300 150, 300 210, 355 210" />
        <circle className="vg-flow__pulse vg-flow__pulse--1" r="4" />
        <circle className="vg-flow__pulse vg-flow__pulse--2" r="4" />
      </svg>
      <div className="vg__float vg-node" style={{ top: "9%", left: "0%" }}>
        <span className="vg-node__icon">⚡</span>
        <div>
          <strong>Trigger</strong>
          <span>New order</span>
        </div>
      </div>
      <div className="vg__float vg-node" style={{ bottom: "9%", left: "0%" }}>
        <span className="vg-node__icon">⏱</span>
        <div>
          <strong>Schedule</strong>
          <span>Every hour</span>
        </div>
      </div>
      <div className="vg__float vg-node vg-node--core" style={{ top: "41%", left: "42%" }}>
        <span className="vg-node__icon">⚙</span>
        <div>
          <strong>XAuto Bot</strong>
          <span>Route &amp; enrich</span>
        </div>
      </div>
      <div className="vg__float vg-node" style={{ top: "18%", right: "0%" }}>
        <span className="vg-node__icon">API</span>
        <div>
          <strong>Invoice API</strong>
          <span>200 OK</span>
        </div>
      </div>
      <div className="vg__float vg-node" style={{ bottom: "18%", right: "0%" }}>
        <span className="vg-node__icon">✉</span>
        <div>
          <strong>Notify team</strong>
          <span>Slack · CRM</span>
        </div>
      </div>
      <div className="vg__float vg-card vg-runs">
        <strong>24,180</strong>
        <span>runs this week · 0 failures</span>
      </div>
    </div>
  );
}

function AiVignette() {
  return (
    <div className="vg vg--ai">
      <div className="vg-core">
        <span className="vg-core__ring vg-core__ring--1" />
        <span className="vg-core__ring vg-core__ring--2" />
        <span className="vg-core__ring vg-core__ring--3" />
        <span className="vg-core__nucleus" />
        <span className="vg-core__orbit vg-core__orbit--1">
          <i />
        </span>
        <span className="vg-core__orbit vg-core__orbit--2">
          <i />
        </span>
      </div>
      <div className="vg__float vg-chat">
        <div className="vg-chat__head">
          <span className="vg-chat__status" />
          AI Employee · Online
        </div>
        <div className="vg-chat__msg vg-chat__msg--in">
          Forecast Q3 demand for the Riyadh branch.
        </div>
        <div className="vg-chat__msg vg-chat__msg--out">
          Projected +23% — restock 3 SKUs by June 12. Draft PO ready.
        </div>
      </div>
      <div className="vg__float vg-card vg-model">
        <strong>Private model</strong>
        <span>Trained on 4.2M business records</span>
        <div className="vg-model__bar">
          <i style={{ width: "87%" }} />
        </div>
        <em>Fine-tune · 87%</em>
      </div>
    </div>
  );
}

export function Vignette({ world }: { world: World }) {
  switch (world.vignette) {
    case "creative":
      return <CreativeVignette />;
    case "web":
      return <WebVignette />;
    case "apps":
      return <AppsVignette />;
    case "automation":
      return <AutomationVignette />;
    case "ai":
      return <AiVignette />;
  }
}
