# HorizonX — The Flagship Experience

The interactive home of the HorizonX ecosystem. Not a company website — a
journey that carries every visitor from **0% to 100% digitalization** and lands
them on their next step.

![Stack](https://img.shields.io/badge/React-18-blue) ![Three.js](https://img.shields.io/badge/Three.js-R3F-black) ![GSAP](https://img.shields.io/badge/GSAP-ScrollTrigger-88ce02)

## The experience

1. **Darkness → pulse → sphere.** A preloader condenses the HorizonX mark, a
   digital pulse expands, and the Digitalization Sphere appears at 0%.
2. **Scroll = travel.** Lenis + GSAP ScrollTrigger move a WebGL camera through
   the ecosystem. The sphere charges, shifts color through the five stage hues,
   recedes while each world plays, and returns fully energized at 100%.
3. **The Digitalization Index.** An interactive dial (30/30/20/10/10 sectors)
   — sectors light as stages are reached; clicking one enters its world.
4. **Five worlds** — Xability (30%), XSite (60%), XApps (80%), XAuto (90%),
   XAI (100%) — each a themed diorama of floating UI with pointer-reactive
   tilt and lighting, linking to its platform and the XVerse demo.
5. **The Calculator.** Five questions → instant index, recommended next
   platform, estimated impact, and CTAs.
6. **XVerse.** The live demo universe: [xverse.horizonx.site](https://xverse.horizonx.site).

## Platforms

| Stage | Platform | URL |
|---|---|---|
| 30% | Xability — Social Media OS | https://xability.horizonx.site |
| 60% | XSite — Website Platform | https://xsite.horizonx.site |
| 80% | XApps — Business Applications | https://xapps.horizonx.site |
| 90% | XAuto — Automation Platform | https://xauto.horizonx.site |
| 100% | XAI — Private AI Models | https://xai.horizonx.site |

## Run it

```bash
npm install
npm run dev        # local dev server
npm run build      # production build → dist/
npm run preview    # serve the production build
```

## Architecture

```
src/
├── lib/
│   ├── worlds.ts          # the five worlds — copy, colors, links, weights
│   ├── progressStore.ts   # frame-rate-friendly journey state (no re-renders in the render loop)
│   └── useJourney.ts      # Lenis smooth scroll + ScrollTrigger + index math
├── three/
│   ├── Scene.tsx          # fixed canvas, camera rig, bloom
│   ├── IndexSphere.tsx    # 15k-particle GLSL sphere driven by journey progress
│   └── Starfield.tsx      # ambient deep-space particles
├── components/            # Preloader, Nav, ProgressRail, Hero, IndexDial,
│                          # WorldSection + vignettes, Calculator, XVerse, Footer
└── styles/
    ├── tokens.css         # the design system source of truth
    ├── global.css         # primitives: glass, buttons, reveals
    └── components.css     # per-section styling
```

Design language: see [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md).

Fonts are self-hosted (Fontsource) — no external font requests. The WebGL layer
respects `prefers-reduced-motion` (demand rendering, zeroed durations).
