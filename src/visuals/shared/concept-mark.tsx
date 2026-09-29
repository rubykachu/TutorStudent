import type { SVGAttributes } from "react";
import type { ConceptColor } from "@/schema/content";
import {
  CONCEPT_CLASSES,
  CONCEPT_SHAPES,
  shapeOutline,
  toPoints,
} from "@/visuals/shared/concept";

type ConceptShapeProps = {
  color: ConceptColor;
  cx: number;
  cy: number;
  // Radius of the circle the shape fits in, in the parent SVG's units.
  r: number;
  // "outline" draws an empty slot in the concept's shape.
  variant?: "filled" | "outline";
} & Omit<SVGAttributes<SVGElement>, "color" | "cx" | "cy" | "r" | "points">;

// The concept's shape as a bare SVG element, for use inside a larger SVG.
export function ConceptShape({
  color,
  cx,
  cy,
  r,
  variant = "filled",
  className,
  ...rest
}: ConceptShapeProps) {
  const shape = CONCEPT_SHAPES[color];
  const paint =
    variant === "filled"
      ? CONCEPT_CLASSES[color].fill
      : "fill-none stroke-muted-foreground";
  const classes = className ? `${paint} ${className}` : paint;
  const common = {
    ...rest,
    "data-shape": shape,
    className: classes,
    strokeWidth: variant === "outline" ? 1.5 : undefined,
  };
  if (shape === "circle") {
    return <circle {...common} cx={cx} cy={cy} r={r} />;
  }
  return (
    <polygon {...common} points={toPoints(shapeOutline(shape, r), cx, cy)} />
  );
}

type ConceptMarkProps = {
  color: ConceptColor;
  // Spoken name; omit when visible text next to the mark already names it.
  label?: string;
  className?: string;
};

// Colour + shape marker for a concept, e.g. next to its name in a chip.
export function ConceptMark({
  color,
  label,
  className = "size-6",
}: ConceptMarkProps) {
  const shape = <ConceptShape color={color} cx={12} cy={12} r={10} />;
  const classes = `inline-block shrink-0 ${className}`;
  return label ? (
    <svg viewBox="0 0 24 24" className={classes} role="img" aria-label={label}>
      {shape}
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className={classes} aria-hidden>
      {shape}
    </svg>
  );
}
