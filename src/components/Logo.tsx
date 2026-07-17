export function Logo({ size = 30 }: { size?: number }) {
  return (
    <span className="logo">
      <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden>
        <circle
          cx="32"
          cy="32"
          r="29"
          fill="none"
          stroke="url(#lg)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="136 46"
          transform="rotate(-90 32 32)"
        />
        <path
          d="M22 18v28M42 18v28M22 32h20"
          stroke="url(#lg)"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
        <defs>
          <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#7c6cff" />
            <stop offset="0.5" stopColor="#2ea8ff" />
            <stop offset="1" stopColor="#39ffc5" />
          </linearGradient>
        </defs>
      </svg>
      <span className="logo__word">HorizonX</span>
    </span>
  );
}
