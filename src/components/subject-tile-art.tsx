import { type ReactNode, useId } from "react";
import type { Subject } from "@/schema/content";

type SubjectColor = Subject["color"];

// The "multiverse" of the app background, inside a subject tile: each tile
// colour has its own scene (a ringed planet, a cratered moon, a banded planet)
// drawn in a 320 x 200 frame that is anchored to the tile's bottom-right corner,
// where a tile has room (text sits left, the ring and icon in the top corners).
// Every shape is the dark foreground colour at low opacity, so it can only
// darken the tile under the white text and never lowers its contrast. Static:
// nothing to turn off under reduced motion.
// `clip` is an id unique to the tile, for shapes that cut another.
const SCENES: Readonly<Record<SubjectColor, (clip: string) => ReactNode>> = {
  blue: () => (
    <>
      <ellipse
        cx="270"
        cy="160"
        rx="124"
        ry="30"
        transform="rotate(-18 270 160)"
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
        opacity={0.12}
      />
      <circle cx="270" cy="168" r="66" fill="currentColor" opacity={0.14} />
      <circle cx="176" cy="54" r="11" fill="currentColor" opacity={0.12} />
      <path
        d="M246 36h14M253 29v14M300 92h10M305 87v10M150 150h10M155 145v10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity={0.16}
      />
    </>
  ),
  terracotta: () => (
    <>
      <circle
        cx="262"
        cy="128"
        r="104"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="3 9"
        opacity={0.2}
      />
      <circle cx="262" cy="128" r="58" fill="currentColor" opacity={0.13} />
      <circle cx="244" cy="110" r="12" fill="currentColor" opacity={0.1} />
      <circle cx="282" cy="146" r="8" fill="currentColor" opacity={0.1} />
      <circle cx="270" cy="102" r="5" fill="currentColor" opacity={0.1} />
      <circle cx="150" cy="40" r="8" fill="currentColor" opacity={0.12} />
      <path
        d="M196 66h10M201 61v10M118 150h12M124 144v12M300 36h10M305 31v10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity={0.16}
      />
    </>
  ),
  teal: (clip) => (
    <>
      <clipPath id={clip}>
        <circle cx="236" cy="186" r="78" />
      </clipPath>
      <circle cx="236" cy="186" r="78" fill="currentColor" opacity={0.12} />
      <g clipPath={`url(#${clip})`}>
        <path
          d="M140 150h190M140 176h190M140 202h190"
          stroke="currentColor"
          strokeWidth="12"
          opacity={0.1}
        />
      </g>
      <path
        d="M100 200A140 140 0 0 1 300 70"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="3 9"
        opacity={0.2}
      />
      <circle cx="302" cy="72" r="9" fill="currentColor" opacity={0.13} />
      <circle cx="158" cy="44" r="6" fill="currentColor" opacity={0.12} />
      <path
        d="M214 40h12M220 34v12M120 118h10M125 113v10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity={0.16}
      />
    </>
  ),
};

// The scene of each subject colour, in the order lesson cards cycle through
// them.
const SCENE_ORDER: readonly SubjectColor[] = ["blue", "terracotta", "teal"];

// Sits behind the tile's content (the tile is its own stacking context) and
// is clipped to its rounded corners by the tile. On a phone the dome behind
// the progress ring is held back so the ring and its count stay calm.
export function SubjectTileArt({ color }: { color: SubjectColor }) {
  const clip = useId();
  return (
    <svg
      aria-hidden
      focusable="false"
      data-subject-art={color}
      viewBox="0 0 320 200"
      preserveAspectRatio="xMaxYMax slice"
      className="pointer-events-none absolute inset-0 -z-10 size-full text-foreground max-md:opacity-60"
    >
      {SCENES[color](clip)}
    </svg>
  );
}

const SOFT_EDGE = "linear-gradient(to right, transparent, black 40%)";

// How a lesson card shows the scene: the bottom of the frame (planet dome)
// or its middle (planet and ring whole), so neighbours never look alike.
const CARD_VIEWS = [
  { scene: 0, anchor: "bottom" },
  { scene: 1, anchor: "middle" },
  { scene: 2, anchor: "bottom" },
  { scene: 0, anchor: "middle" },
  { scene: 1, anchor: "bottom" },
  { scene: 2, anchor: "middle" },
] as const;

// The same scenes as the subject tiles, at the same scale (the 320 x 200
// frame drawn about 350px wide), inside a lesson card, tinted with the
// subject's colour. They live in the card's right-hand 40%, which holds only
// the state badge (the card's text stops short of it), so no shape is ever
// under a word, and what shows of a scene varies from card to card. The card
// must be `relative isolate overflow-hidden`. `tint` is a text colour class
// (`subjectStyle(subject).text`).
export function LessonCardArt({
  position,
  tint,
}: {
  position: number;
  tint: string;
}) {
  const clip = useId();
  const view = CARD_VIEWS[
    position % CARD_VIEWS.length
  ] as (typeof CARD_VIEWS)[number];
  const scene = SCENE_ORDER[view.scene] as SubjectColor;
  return (
    <div
      aria-hidden
      data-lesson-art={position % CARD_VIEWS.length}
      className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-2/5 overflow-hidden"
      // Fades in from the left, so the column has no hard edge.
      style={{ maskImage: SOFT_EDGE, WebkitMaskImage: SOFT_EDGE }}
    >
      <svg
        aria-hidden
        focusable="false"
        viewBox="0 0 320 200"
        className={`absolute right-0 h-[220px] w-[352px] md:h-[240px] md:w-[384px] ${tint} ${
          view.anchor === "bottom" ? "bottom-0" : "top-1/2 -translate-y-1/2"
        }`}
      >
        {SCENES[scene](clip)}
      </svg>
    </div>
  );
}
