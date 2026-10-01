// The "multiverse" of the page background, carried onto the white cards and
// sheets that cover it, so a card is part of the same sky: a ringed planet
// half out of the top-right corner, a banded moon in the bottom-left, a few
// stars and a faint nebula glow. Decoration only: it sits behind the panel's
// content (the panel must be `relative isolate overflow-hidden`), never takes
// a tap, is hidden from screen readers and carries no text. Every shape is a
// low-opacity tint of the concept colours (at most 0.16), so text on the
// panel keeps the contrast it has on plain white. Nothing moves.

const NEBULA = [
  "radial-gradient(70% 60% at 100% 0%, color-mix(in srgb, var(--color-concept-violet) 9%, transparent), transparent 70%)",
  "radial-gradient(60% 50% at 0% 100%, color-mix(in srgb, var(--color-concept-teal) 7%, transparent), transparent 70%)",
].join(", ");

// Star positions as shares of the panel: [x %, y %, radius].
const STARS: readonly (readonly [number, number, number])[] = [
  [8, 14, 1.4],
  [22, 8, 1],
  [38, 20, 1.2],
  [58, 10, 0.9],
  [74, 26, 1.1],
  [14, 58, 1],
  [30, 86, 1.3],
  [52, 92, 0.9],
  [68, 78, 1.2],
  [90, 64, 1],
  [84, 92, 1.3],
];

export function PanelArt() {
  return (
    <div
      aria-hidden
      data-panel-art
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0" style={{ backgroundImage: NEBULA }} />
      <svg
        className="absolute inset-0 size-full text-concept-slate"
        aria-hidden
        focusable="false"
      >
        {STARS.map(([x, y, r]) => (
          <circle
            key={`${x}-${y}`}
            cx={`${x}%`}
            cy={`${y}%`}
            r={r}
            fill="currentColor"
            opacity={0.16}
          />
        ))}
      </svg>
      <svg
        viewBox="0 0 160 160"
        className="absolute -top-8 -right-10 w-36 text-concept-violet md:w-44"
        aria-hidden
        focusable="false"
      >
        <ellipse
          cx="80"
          cy="80"
          rx="76"
          ry="28"
          transform="rotate(-24 80 80)"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeDasharray="3 6"
          opacity={0.14}
        />
        <circle cx="80" cy="80" r="34" fill="currentColor" opacity={0.08} />
        <ellipse
          cx="80"
          cy="80"
          rx="54"
          ry="14"
          transform="rotate(-24 80 80)"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          opacity={0.1}
        />
        <circle cx="22" cy="104" r="4" fill="currentColor" opacity={0.14} />
      </svg>
      <svg
        viewBox="0 0 120 120"
        className="absolute -bottom-8 -left-8 w-28 text-concept-teal md:w-32"
        aria-hidden
        focusable="false"
      >
        <circle cx="60" cy="60" r="46" fill="currentColor" opacity={0.07} />
        <path
          d="M26 52h68M22 68h76M32 84h56"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          opacity={0.06}
        />
        <circle
          cx="60"
          cy="60"
          r="58"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeDasharray="2 7"
          opacity={0.14}
        />
        <circle cx="106" cy="30" r="5" fill="currentColor" opacity={0.14} />
      </svg>
    </div>
  );
}
