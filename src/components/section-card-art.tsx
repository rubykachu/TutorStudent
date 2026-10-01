// The "multiverse" of the page background (`cosmos-background.tsx`) inside a
// lesson page's section card, as present as the scenes of the home subject
// tiles: a column at the card's right end, a different sky for each card
// (a ringed planet, a banded planet on a dashed orbit, a cratered moon, a
// small planet on a tilted orbit), tinted with a concept colour. The card's
// text column ends where this one starts, and the chevron sits in its free
// middle band, so no shape is ever under a word or the chevron: the planets
// take the top, a moon and stars the bottom. Decoration only: hidden from
// screen readers, no text, no motion, every shape a tint of a concept colour
// (at most 0.24) on the white card.

import type { ReactNode } from "react";

type Sky = {
  // Concept colour token the whole picture is tinted with.
  tint: string;
  shapes: ReactNode;
};

const SKIES: readonly Sky[] = [
  {
    // Ringed planet above, a small moon and stars below.
    tint: "text-concept-violet",
    shapes: (
      <>
        <circle cx="62" cy="20" r="18" fill="currentColor" opacity={0.2} />
        <ellipse
          cx="62"
          cy="20"
          rx="36"
          ry="10"
          transform="rotate(-24 62 20)"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          opacity={0.24}
        />
        <circle cx="26" cy="80" r="7" fill="currentColor" opacity={0.18} />
        <circle cx="76" cy="72" r="1.8" fill="currentColor" opacity={0.24} />
        <circle cx="14" cy="38" r="1.4" fill="currentColor" opacity={0.22} />
      </>
    ),
  },
  {
    // Banded planet on a dashed orbit above, a far moon below.
    tint: "text-concept-teal",
    shapes: (
      <>
        <circle
          cx="66"
          cy="10"
          r="32"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeDasharray="2.5 6"
          opacity={0.22}
        />
        <circle cx="66" cy="10" r="25" fill="currentColor" opacity={0.18} />
        <path
          d="M46 8h40M44 18h40"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          opacity={0.14}
        />
        <circle cx="22" cy="36" r="3.4" fill="currentColor" opacity={0.22} />
        <circle cx="70" cy="82" r="9" fill="currentColor" opacity={0.18} />
        <circle cx="30" cy="88" r="1.6" fill="currentColor" opacity={0.22} />
      </>
    ),
  },
  {
    // Cratered moon above with sparkles, a star below.
    tint: "text-concept-amber",
    shapes: (
      <>
        <circle cx="62" cy="22" r="18" fill="currentColor" opacity={0.2} />
        <circle cx="68" cy="16" r="4.5" fill="currentColor" opacity={0.14} />
        <circle cx="56" cy="29" r="3" fill="currentColor" opacity={0.14} />
        <path
          d="M18 14l2.2 6L26 22l-5.8 2.2L18 30l-2.2-5.8L10 22l5.8-2z"
          fill="currentColor"
          opacity={0.24}
        />
        <path
          d="M28 48l1.4 3.6L33 53l-3.6 1.4L28 58l-1.4-3.6L23 53l3.6-1.4z"
          fill="currentColor"
          opacity={0.22}
        />
        <path
          d="M70 74l2 5.4L77.4 81.4 72 83.4 70 88.8l-2-5.4L62.6 81.4 68 79.4z"
          fill="currentColor"
          opacity={0.22}
        />
      </>
    ),
  },
  {
    // Small planet on a tilted orbit above, a planet rising below.
    tint: "text-concept-sky",
    shapes: (
      <>
        <ellipse
          cx="58"
          cy="24"
          rx="34"
          ry="12"
          transform="rotate(20 58 24)"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeDasharray="2.5 6"
          opacity={0.22}
        />
        <circle cx="70" cy="18" r="13" fill="currentColor" opacity={0.2} />
        <circle cx="18" cy="42" r="3" fill="currentColor" opacity={0.22} />
        <circle cx="12" cy="12" r="1.6" fill="currentColor" opacity={0.24} />
        <circle cx="74" cy="96" r="20" fill="currentColor" opacity={0.16} />
        <circle cx="38" cy="82" r="1.6" fill="currentColor" opacity={0.22} />
      </>
    ),
  },
];

const SOFT_EDGE = "linear-gradient(to right, transparent, black 45%)";

// The picture for the card at `position` in its list; they repeat after the
// last one. Fills its parent, the card's right-hand column (`relative`).
export function SectionCardArt({ position }: { position: number }) {
  const sky = SKIES[position % SKIES.length] as Sky;
  return (
    <svg
      viewBox="0 0 90 100"
      preserveAspectRatio="xMaxYMid slice"
      aria-hidden="true"
      focusable="false"
      data-section-art={position % SKIES.length}
      className={`pointer-events-none absolute inset-0 size-full ${sky.tint}`}
      // Fades in from the left, so the column has no hard edge.
      style={{ maskImage: SOFT_EDGE, WebkitMaskImage: SOFT_EDGE }}
    >
      {sky.shapes}
    </svg>
  );
}
