import { useEffect, useState } from "react";

/**
 * The opening beat: complete darkness → the HorizonX mark condenses
 * → a digital pulse expands → the experience is revealed.
 */
export function Preloader({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"dark" | "logo" | "pulse" | "exit">("dark");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      onDone();
      setPhase("exit");
      return;
    }
    const t1 = setTimeout(() => setPhase("logo"), 350);
    const t2 = setTimeout(() => setPhase("pulse"), 1500);
    const t3 = setTimeout(() => {
      setPhase("exit");
      onDone();
    }, 2450);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onDone]);

  return (
    <div className={`preloader preloader--${phase}`} aria-hidden={phase === "exit"}>
      <div className="preloader__pulse" />
      <div className="preloader__mark">
        <svg viewBox="0 0 64 64" width="56" height="56">
          <circle
            className="preloader__ring"
            cx="32"
            cy="32"
            r="29"
            fill="none"
            stroke="url(#plg)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="182"
            transform="rotate(-90 32 32)"
          />
          <path
            d="M22 18v28M42 18v28M22 32h20"
            stroke="url(#plg)"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          <defs>
            <linearGradient id="plg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#7c6cff" />
              <stop offset="0.5" stopColor="#2ea8ff" />
              <stop offset="1" stopColor="#39ffc5" />
            </linearGradient>
          </defs>
        </svg>
        <span className="preloader__word">HorizonX</span>
      </div>
    </div>
  );
}
