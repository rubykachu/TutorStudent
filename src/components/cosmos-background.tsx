// A faint "multiverse" behind the child's screens: two soft nebula glows, a
// scatter of tiny stars, a ringed planet in the top-right corner and a banded
// planet with its orbit in the bottom-left, with a small moon on each side.
// Decoration only: it sits behind everything, never takes a tap, is hidden
// from screen readers and carries no text. Every shape is a low-opacity tint
// of the concept colours, so text on the page background keeps its contrast
// (checked at the strongest tint, see docs/design-system.md). Nothing moves.

const NEBULA = [
  "radial-gradient(60vmax 48vmax at 100% 0%, color-mix(in srgb, var(--color-concept-violet) 8%, transparent), transparent 70%)",
  "radial-gradient(55vmax 44vmax at 0% 100%, color-mix(in srgb, var(--color-concept-blue) 7%, transparent), transparent 70%)",
].join(", ");

// Star positions in a 360 x 360 tile: [x, y, radius].
const STARS: readonly (readonly [number, number, number])[] = [
  [24, 40, 1.2],
  [96, 14, 0.8],
  [150, 88, 1.4],
  [212, 30, 0.9],
  [300, 62, 1.1],
  [336, 140, 0.8],
  [60, 150, 0.9],
  [118, 210, 1.3],
  [190, 164, 0.8],
  [262, 226, 1.2],
  [330, 296, 0.9],
  [30, 262, 1.1],
  [92, 330, 0.8],
  [176, 300, 1.2],
  [240, 340, 0.8],
];

export function CosmosBackground() {
  return (
    <div
      aria-hidden
      data-cosmos
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0" style={{ backgroundImage: NEBULA }} />

      <svg
        className="absolute inset-0 size-full text-concept-slate"
        aria-hidden
        focusable="false"
      >
        <defs>
          <pattern
            id="cosmos-stars"
            width="360"
            height="360"
            patternUnits="userSpaceOnUse"
          >
            {STARS.map(([x, y, r]) => (
              <circle
                key={`${x}-${y}`}
                cx={x}
                cy={y}
                r={r}
                fill="currentColor"
                opacity={0.16}
              />
            ))}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cosmos-stars)" />
      </svg>

      {/* Ringed planet, half out of the top-right corner, with a far orbit
          and a moon on it. */}
      <svg
        viewBox="0 0 400 400"
        className="absolute -top-[17vmin] -right-[12vmin] w-[clamp(150px,38vmin,420px)] md:-top-[7vmin] md:-right-[9vmin] md:w-[clamp(200px,44vmin,420px)] text-concept-violet"
        aria-hidden
        focusable="false"
      >
        <ellipse
          cx="200"
          cy="200"
          rx="196"
          ry="74"
          transform="rotate(-24 200 200)"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="3 7"
          opacity={0.13}
        />
        <circle cx="64" cy="262" r="9" fill="currentColor" opacity={0.13} />
        <circle cx="200" cy="200" r="86" fill="currentColor" opacity={0.07} />
        <path
          d="M130 168a86 86 0 0 1 120-34"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          opacity={0.05}
        />
        <ellipse
          cx="200"
          cy="200"
          rx="140"
          ry="38"
          transform="rotate(-24 200 200)"
          fill="none"
          stroke="currentColor"
          strokeWidth="9"
          opacity={0.09}
        />
      </svg>

      {/* Banded planet in the bottom-left corner on a curved orbit with two
          tiny moons. */}
      <svg
        viewBox="0 0 400 400"
        className="absolute -bottom-[8vmin] -left-[9vmin] w-[clamp(180px,40vmin,380px)] text-concept-teal"
        aria-hidden
        focusable="false"
      >
        <circle
          cx="170"
          cy="230"
          r="190"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="2 8"
          opacity={0.13}
        />
        <circle cx="318" cy="112" r="8" fill="currentColor" opacity={0.13} />
        <circle cx="46" cy="98" r="5" fill="currentColor" opacity={0.13} />
        <circle cx="170" cy="230" r="96" fill="currentColor" opacity={0.06} />
        <path
          d="M80 210h180M76 244h188M94 278h152"
          fill="none"
          stroke="currentColor"
          strokeWidth="9"
          strokeLinecap="round"
          opacity={0.05}
        />
      </svg>

      {/* One small moon on each side edge, in warm colours that balance the
          cool corners. */}
      <svg
        viewBox="0 0 80 80"
        className="absolute top-[46%] -left-[3vmin] w-[clamp(36px,8vmin,72px)] text-concept-amber"
        aria-hidden
        focusable="false"
      >
        <circle cx="40" cy="40" r="34" fill="currentColor" opacity={0.08} />
        <circle cx="52" cy="30" r="8" fill="currentColor" opacity={0.05} />
      </svg>
      <svg
        viewBox="0 0 80 80"
        className="absolute top-[68%] -right-[3vmin] w-[clamp(32px,7vmin,64px)] text-concept-pink"
        aria-hidden
        focusable="false"
      >
        <circle cx="40" cy="40" r="34" fill="currentColor" opacity={0.07} />
        <circle cx="28" cy="48" r="7" fill="currentColor" opacity={0.05} />
      </svg>
    </div>
  );
}

// Star positions in the horizon's 800 x 160 frame: [x, y, radius].
const HORIZON_STARS: readonly (readonly [number, number, number])[] = [
  [40, 30, 1.4],
  [96, 92, 1],
  [150, 22, 1.2],
  [214, 64, 0.9],
  [268, 118, 1.3],
  [372, 40, 1],
  [430, 104, 0.9],
  [484, 18, 1.2],
  [690, 36, 1.1],
  [744, 84, 0.9],
  [770, 130, 1.2],
];

// Where the page ends: a band of sky in the normal flow after the last
// content (a planet rising from the bottom edge with its ring, a moon and a
// few stars), pushed to the bottom of the screen when the page is short. It
// takes its own room, so it is never under or against content; tints of the
// concept colours at low opacity, no text, nothing moves.
export function CosmosHorizon({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      data-cosmos-horizon
      className={`pointer-events-none h-28 shrink-0 overflow-hidden md:h-36 ${className}`}
    >
      <svg
        viewBox="0 0 800 160"
        preserveAspectRatio="xMidYMax slice"
        className="size-full text-concept-violet"
        aria-hidden
        focusable="false"
      >
        <g className="text-concept-slate" fill="currentColor">
          {HORIZON_STARS.map(([x, y, r]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={r} opacity={0.18} />
          ))}
        </g>
        <ellipse
          cx="560"
          cy="196"
          rx="330"
          ry="62"
          transform="rotate(-6 560 196)"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="3 8"
          opacity={0.14}
        />
        <circle cx="560" cy="210" r="118" fill="currentColor" opacity={0.08} />
        <ellipse
          cx="560"
          cy="196"
          rx="196"
          ry="30"
          transform="rotate(-6 560 196)"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          opacity={0.1}
        />
        <circle
          cx="318"
          cy="78"
          r="16"
          className="text-concept-amber"
          fill="currentColor"
          opacity={0.14}
        />
        <circle
          cx="326"
          cy="72"
          r="5"
          className="text-concept-amber"
          fill="currentColor"
          opacity={0.1}
        />
        <circle
          cx="140"
          cy="182"
          r="52"
          className="text-concept-teal"
          fill="currentColor"
          opacity={0.08}
        />
        <circle
          cx="214"
          cy="128"
          r="7"
          className="text-concept-teal"
          fill="currentColor"
          opacity={0.14}
        />
      </svg>
    </div>
  );
}
