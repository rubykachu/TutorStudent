"use client";

import { createContext, type ReactNode, useContext } from "react";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import type { HighlightColor } from "@/visuals/shared/highlight";

export type RegionMark = { color: HighlightColor; strong: boolean };

// What a `tapRegion` answer hands to the visual it renders. Without it the
// same visual draws its regions as plain, non-interactive shapes.
export type RegionInteraction = {
  selected: ReadonlySet<string>;
  // Regions shown as the correct answer.
  revealed: ReadonlySet<string>;
  // Hint and mistake marks by region id.
  marks: ReadonlyMap<string, RegionMark>;
  disabled: boolean;
  onToggle: (id: string) => void;
};

const RegionContext = createContext<RegionInteraction | null>(null);

export function RegionProvider({
  value,
  children,
}: {
  value: RegionInteraction;
  children: ReactNode;
}) {
  return <RegionContext value={value}>{children}</RegionContext>;
}

// Ring widths in screen pixels (the stroke does not scale with the SVG). The
// ring is painted under the shape, so half of it shows around the edge and
// widens the hit area by that much on every side, keeping small regions
// comfortably above the 48px touch minimum.
const RING = 20;
const RING_STRONG = 32;

type RegionSvgProps = {
  label: string;
  viewBox: string;
  className?: string;
  children: ReactNode;
};

// Root of a visual with regions: a single image when static, a group of
// buttons when tappable. Rings may extend past the drawing, so they are not
// clipped while tappable.
export function RegionSvg({
  label,
  viewBox,
  className = "",
  children,
}: RegionSvgProps) {
  const interactive = useContext(RegionContext) !== null;
  return (
    <svg
      role={interactive ? "group" : "img"}
      aria-label={label}
      viewBox={viewBox}
      className={interactive ? `overflow-visible ${className}` : className}
    >
      {children}
    </svg>
  );
}

function ringClass(
  interaction: RegionInteraction,
  id: string,
  mark: RegionMark | undefined,
): string {
  if (interaction.revealed.has(id)) return "stroke-correct";
  if (mark) {
    return mark.color === "highlight"
      ? "stroke-highlight"
      : CONCEPT_CLASSES[mark.color].stroke;
  }
  // Foreground rather than primary: a blue concept shape would swallow a
  // primary ring.
  return interaction.selected.has(id)
    ? "stroke-foreground"
    : "stroke-transparent";
}

type RegionProps = {
  // Must be one of the `regions` the visual declares in the registry.
  id: string;
  // Spoken name of the region when it is tappable.
  label: string;
  // Shapes of the region; they must not set a stroke of their own, since the
  // selection ring and the enlarged hit area are drawn with it.
  children: ReactNode;
};

export function Region({ id, label, children }: RegionProps) {
  const interaction = useContext(RegionContext);
  if (!interaction) return <g data-region={id}>{children}</g>;

  const { disabled, onToggle } = interaction;
  const selected = interaction.selected.has(id);
  const mark = interaction.marks.get(id);
  const toggle = () => {
    if (!disabled) onToggle(id);
  };

  return (
    // SVG has no <button>; a focusable group with the button role is the
    // accessible equivalent inside a drawing.
    // biome-ignore lint/a11y/useSemanticElements: see above
    <g
      data-region={id}
      data-selected={selected || undefined}
      data-revealed={interaction.revealed.has(id) || undefined}
      data-highlighted={mark !== undefined || undefined}
      data-highlight-strong={mark?.strong || undefined}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={label}
      aria-pressed={selected}
      aria-disabled={disabled || undefined}
      strokeWidth={mark?.strong ? RING_STRONG : RING}
      strokeLinejoin="round"
      paintOrder="stroke"
      className={`${ringClass(interaction, id, mark)} outline-none focus-visible:stroke-ring **:[vector-effect:non-scaling-stroke] ${disabled ? "" : "cursor-pointer"}`}
      onClick={toggle}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        toggle();
      }}
    >
      {children}
    </g>
  );
}
