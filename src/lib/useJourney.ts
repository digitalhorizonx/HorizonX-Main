import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { journey } from "./progressStore";
import { WORLDS } from "./worlds";

gsap.registerPlugin(ScrollTrigger);

/**
 * Boots the motion system: Lenis smooth scroll driving GSAP ScrollTrigger,
 * plus the global journey progress (0 → 1 across the world sections).
 */
export function useJourney(ready: boolean) {
  useEffect(() => {
    if (!ready) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: !reducedMotion,
    });

    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Global journey progress: from hero top to final world end.
    const journeyTrigger = ScrollTrigger.create({
      trigger: "#journey",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const p = self.progress;
        // Each world spans an equal slice of the journey; the index climbs
        // piecewise through the cumulative stages 0 → 30 → 60 → 80 → 90 → 100.
        const n = WORLDS.length;
        const slice = Math.min(Math.floor(p * n), n - 1);
        const local = p * n - slice;
        const from = slice === 0 ? 0 : WORLDS[slice - 1].index;
        const to = WORLDS[slice].index;
        const index = Math.round(from + (to - from) * local);
        journey.set({ progress: p, index, world: p <= 0.001 ? -1 : slice });
      },
    });

    // Generic reveal animations
    const reveals = gsap.utils.toArray<HTMLElement>(".hx-reveal");
    const revealTweens = reveals.map((el) =>
      gsap.fromTo(
        el,
        { opacity: 0, y: 42 },
        {
          opacity: 1,
          y: 0,
          duration: reducedMotion ? 0 : 1.1,
          ease: "expo.out",
          delay: parseFloat(el.dataset.delay ?? "0"),
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
          },
        }
      )
    );

    // Smooth anchor navigation through Lenis. Handles "#id" and same-page
    // "/path#id" links in any locale (the router owns cross-page navigation).
    const onAnchor = (e: Event) => {
      const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[href*='#']");
      if (!anchor) return;
      const href = anchor.getAttribute("href")!;
      const [pathPart, hash] = href.split("#");
      if (!hash) return;
      // only intercept when the link targets the CURRENT page's anchors
      if (pathPart && pathPart !== "" ) {
        const current = window.location.pathname.replace(/\/$/, "") || "/";
        const target = pathPart.replace(/\/$/, "") || "/";
        if (target !== current) return;
      }
      const el = document.getElementById(hash);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: 0, duration: 1.6 });
    };
    document.addEventListener("click", onAnchor);

    ScrollTrigger.refresh();

    return () => {
      document.removeEventListener("click", onAnchor);
      revealTweens.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
      journeyTrigger.kill();
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, [ready]);
}
