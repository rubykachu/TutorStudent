// A faint "multiverse" corner for a lesson page's section card, in the
// family of the page background (`cosmos-background.tsx`): a planet, an orbit
// and a few stars in the top-right corner, a different one for each card.
// It fills the right-hand column of the card that holds the chevron, which
// the card's text never enters (the text column ends where this one starts),
// and the planets stay in the top part, above the chevron. Decoration only:
// hidden from screen readers, no text, no motion, every shape a low-opacity
// tint of a concept colour on the white card.

import type { ReactNode } from "react";

type Sky = {
  // Concept colour token the whole picture is tinted with.
  tint: string;
  shapes: ReactNode;
};

const SKIES: readonly Sky[] = [
  {
    // Ringed planet with a far star.
    tint: "text-concept-violet",
    shapes: (
      <>
        <circle cx="46" cy="13" r="13" fill="currentColor" opacity={0.12} />
        <ellipse
          cx="46"
          cy="13"
          rx="25"
          ry="7"
          transform="rotate(-24 46 13)"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          opacity={0.16}
        />
        <circle cx="59" cy="42" r="1.4" fill="currentColor" opacity={0.16} />
        <circle cx="58" cy="80" r="1.1" fill="currentColor" opacity={0.14} />
      </>
    ),
  },
  {
    // Banded planet on a dashed orbit with a small moon.
    tint: "text-concept-teal",
    shapes: (
      <>
        <circle
          cx="50"
          cy="6"
          r="32"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeDasharray="2 5"
          opacity={0.14}
        />
        <circle cx="50" cy="6" r="17" fill="currentColor" opacity={0.1} />
        <path
          d="M36 4h28M34 11h30"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          opacity={0.08}
        />
        <circle cx="22" cy="24" r="3" fill="currentColor" opacity={0.14} />
        <circle cx="60" cy="60" r="1.2" fill="currentColor" opacity={0.14} />
      </>
    ),
  },
  {
    // Cratered moon with sparkles.
    tint: "text-concept-amber",
    shapes: (
      <>
        <circle cx="48" cy="15" r="12" fill="currentColor" opacity={0.12} />
        <circle cx="52" cy="11" r="3" fill="currentColor" opacity={0.08} />
        <circle cx="44" cy="20" r="2" fill="currentColor" opacity={0.08} />
        <path
          d="M16 8l1.6 4.4L22 14l-4.4 1.6L16 20l-1.6-4.4L10 14l4.4-1.6z"
          fill="currentColor"
          opacity={0.14}
        />
        <path
          d="M25 30l1 2.6L28.6 34l-2.6 1-1 2.6-1-2.6-2.6-1 2.6-1.4z"
          fill="currentColor"
          opacity={0.12}
        />
        <circle cx="59" cy="70" r="1.3" fill="currentColor" opacity={0.14} />
      </>
    ),
  },
  {
    // Small planet on a tilted orbit among stars.
    tint: "text-concept-sky",
    shapes: (
      <>
        <ellipse
          cx="44"
          cy="18"
          rx="30"
          ry="12"
          transform="rotate(20 44 18)"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeDasharray="2 5"
          opacity={0.14}
        />
        <circle cx="52" cy="14" r="9" fill="currentColor" opacity={0.12} />
        <circle cx="20" cy="30" r="2.4" fill="currentColor" opacity={0.14} />
        <circle cx="12" cy="9" r="1.2" fill="currentColor" opacity={0.16} />
        <circle cx="60" cy="52" r="1.3" fill="currentColor" opacity={0.14} />
      </>
    ),
  },
];

// The picture for the card at `position` in its list; they repeat after the
// last one.
export function SectionCardArt({ position }: { position: number }) {
  const sky = SKIES[position % SKIES.length] as Sky;
  return (
    <svg
      viewBox="0 0 64 96"
      aria-hidden="true"
      focusable="false"
      data-section-art={position % SKIES.length}
      className={`pointer-events-none absolute top-0 right-0 w-14 md:w-16 ${sky.tint}`}
    >
      {sky.shapes}
    </svg>
  );
}
