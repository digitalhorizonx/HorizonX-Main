# HorizonX Design System

The design language of the HorizonX flagship experience. One narrative drives every
decision: **HorizonX transforms businesses from 0% to 100% digitalization.**
Nothing here presents services — everything presents *progress*.

All tokens live in [`src/styles/tokens.css`](src/styles/tokens.css) and are the
single source of truth for product surfaces across the ecosystem.

---

## 1. Narrative architecture

The experience is a journey, not a page. The visitor travels the Digitalization
Index; the interface physically evolves with it.

| Stage | Platform | Index reached | Weight | Signature color |
|---|---|---|---|---|
| Offline | — | 0% | — | `#3d4066` dormant slate |
| Social OS | **Xability** | 30% | +30 | `#ff5fa2` creative magenta |
| Web | **XSite** | 60% | +30 | `#2ea8ff` web cyan |
| Applications | **XApps** | 80% | +20 | `#7c6cff` systems violet |
| Automation | **XAuto** | 90% | +10 | `#ffb648` kinetic amber |
| Intelligence | **XAI** | 100% | +10 | `#39ffc5` intelligence mint |

The **index gradient** (`--hx-gradient-index`) sweeps through all five stage
colors and is reserved for moments that represent the *whole* journey (hero
accent, progress meters, the footer scale). Individual worlds use only their own
stage color.

## 2. Environment

- `--hx-void #030309` — infinite space. The page background; never pure black in
  large fields (the WebGL starfield provides the depth).
- `--hx-deep`, `--hx-surface` — panel backgrounds for layered UI.
- Light theme exists as a token layer (`[data-theme="light"]`) for embedded
  product surfaces and documents; the flagship journey itself remains dark.

## 3. Glass materials

Panels are volumetric, not flat:

```css
background: var(--hx-glass);            /* 4% white */
border: var(--hx-glass-border);         /* 10% white hairline */
backdrop-filter: blur(var(--hx-glass-blur));  /* 22px */
+ ::before highlight sweep (--hx-glass-highlight)
```

Use `.hx-glass` for any floating panel. Stronger surfaces (`--hx-glass-strong`)
are for small floating cards inside vignettes.

## 4. Lighting & elevation

Light is interactive state. Hover **adds light**, never borders alone:

- Resting: `--hx-shadow-1/2/3` (ambient depth).
- Hover/active: stage-colored glow — `box-shadow: 0 0 Npx color-mix(in srgb, var(--w-color) 25%, transparent)`.
- The world stages carry a pointer-tracked light field (`.world__stage-light`)
  so the environment responds to the cursor.

## 5. Typography

| Role | Token | Face |
|---|---|---|
| Display / headlines | `--hx-font-display` | Space Grotesk Variable |
| Body | `--hx-font-body` | Inter Variable |
| Data / labels / HUD | `--hx-font-mono` | JetBrains Mono |

Scale: `--hx-text-hero` (clamp ≤ 8.5rem) → `display` → `title` → `lead` →
`body` → `small` → `micro`. Headlines are tight (`--hx-tracking-tight`),
HUD labels are wide uppercase mono (`--hx-tracking-wide`). Numbers that change
live use `font-variant-numeric: tabular-nums`.

## 6. Spacing & grid

8pt scale `--hx-s1 … --hx-s10` (4px → 160px). Content column:
`.hx-container` = `min(1280px, 100% − 2·gutter)`, gutter fluid
`clamp(1.25rem, 4vw, 3rem)`. Worlds use a 5/6 asymmetric grid: narrative left,
diorama right (stacked, diorama-first, under 980px).

## 7. Motion

| Token | Value | Use |
|---|---|---|
| `--hx-ease-out` | `cubic-bezier(.16,1,.3,1)` | entrances, reveals |
| `--hx-ease-inout` | `cubic-bezier(.65,0,.35,1)` | camera moves, meters |
| `--hx-ease-spring` | `cubic-bezier(.34,1.56,.64,1)` | button pops, dots |
| `--hx-dur-fast/base/slow/cinematic` | 180/320/700/1400ms | scale by mass |

Principles:

1. **Scroll is travel.** Lenis + GSAP ScrollTrigger drive a camera through the
   scene; sections reveal with `expo.out` rises (`.hx-reveal`).
2. **Everything breathes.** Floating cards drift (`vg-drift` 7–10s loops,
   staggered phases); nothing is static.
3. **The sphere is the protagonist.** It charges with the index, recedes into
   deep space while worlds play, and returns fully energized at 100%.
4. **Reduced motion is honored everywhere** — durations collapse to 0, the
   canvas drops to demand-rendering, drifts disable.

## 8. 3D scene grammar

- Particle sphere: 15k-point Fibonacci shell, custom GLSL. `uProgress` drives
  scatter→coherence, color along the stage spectrum, energy waves.
- Starfield: 2.6k twinkling points in a hollow shell, slow parallax.
- Camera rig: scroll progress + pointer parallax, damped (`THREE.MathUtils.damp`).
- Post: single Bloom pass (threshold .32, intensity .65) — glow must stay
  below text-contrast-breaking levels.
- Budget: DPR ≤ 1.75, no antialias (bloom covers it), additive blending with
  `depthWrite: false`.

## 9. Components

- **Buttons**: pill, display face. Variants: `--primary` (ink on light),
  `--glow` (stage-colored glass, takes `--btn-glow`), `--ghost` (hairline +
  dark blur so it survives bright backdrops). Arrows translate on hover.
- **Chips** (`.vg-chip`, theme tags): uppercase mono micro, hairline border.
- **HUD readouts** (nav index, rail): mono, tabular, stage-colored accents.
- **Dial**: SVG donut, sectors weighted 30/30/20/10/10, lit state =
  full opacity + stage glow; hover thickens stroke and raises glow.

## 10. Accessibility

- Focus: 2px `--hx-xsite` outline, 3px offset, on every interactive element.
- The dial carries a full `aria-label`; live values (`index readouts`,
  calculator result) use `aria-live="polite"`.
- Decorative layers (canvas, rail, constellation) are `aria-hidden`.
- Toggle groups expose `aria-pressed`; menu button exposes `aria-expanded`.
- Contrast: body text ≥ 4.5:1 against `--hx-void`; dimmed ink reserved for
  ≥ 18px or non-essential labels.

## 11. Voice

Short declaratives. Progress, never features. Numbers are characters in the
story ("Takes you to 80% digitalized"). Every CTA answers the visitor's one
question: *what is my next step?*
