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

// Sits behind the tile's content (the tile is its own stacking context) and
// is clipped to its rounded corners by the tile.
export function SubjectTileArt({ color }: { color: SubjectColor }) {
  const clip = useId();
  return (
    <svg
      aria-hidden
      focusable="false"
      data-subject-art={color}
      viewBox="0 0 320 200"
      preserveAspectRatio="xMaxYMax slice"
      className="pointer-events-none absolute inset-0 -z-10 size-full text-foreground"
    >
      {SCENES[color](clip)}
    </svg>
  );
}
