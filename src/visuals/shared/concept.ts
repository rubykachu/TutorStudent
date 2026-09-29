import type { ConceptColor } from "@/schema/content";

// Class names are spelled out in full because Tailwind only generates
// utilities it can find as literal strings in the source.
export const CONCEPT_CLASSES: Readonly<
  Record<
    ConceptColor,
    {
      fill: string;
      stroke: string;
      text: string;
      border: string;
      decoration: string;
    }
  >
> = {
  blue: {
    fill: "fill-concept-blue",
    stroke: "stroke-concept-blue",
    text: "text-concept-blue",
    border: "border-concept-blue",
    decoration: "decoration-concept-blue",
  },
  violet: {
    fill: "fill-concept-violet",
    stroke: "stroke-concept-violet",
    text: "text-concept-violet",
    border: "border-concept-violet",
    decoration: "decoration-concept-violet",
  },
  pink: {
    fill: "fill-concept-pink",
    stroke: "stroke-concept-pink",
    text: "text-concept-pink",
    border: "border-concept-pink",
    decoration: "decoration-concept-pink",
  },
  amber: {
    fill: "fill-concept-amber",
    stroke: "stroke-concept-amber",
    text: "text-concept-amber",
    border: "border-concept-amber",
    decoration: "decoration-concept-amber",
  },
  teal: {
    fill: "fill-concept-teal",
    stroke: "stroke-concept-teal",
    text: "text-concept-teal",
    border: "border-concept-teal",
    decoration: "decoration-concept-teal",
  },
  sky: {
    fill: "fill-concept-sky",
    stroke: "stroke-concept-sky",
    text: "text-concept-sky",
    border: "border-concept-sky",
    decoration: "decoration-concept-sky",
  },
  lime: {
    fill: "fill-concept-lime",
    stroke: "stroke-concept-lime",
    text: "text-concept-lime",
    border: "border-concept-lime",
    decoration: "decoration-concept-lime",
  },
  slate: {
    fill: "fill-concept-slate",
    stroke: "stroke-concept-slate",
    text: "text-concept-slate",
    border: "border-concept-slate",
    decoration: "decoration-concept-slate",
  },
};

export type ConceptShapeName =
  | "circle"
  | "triangle"
  | "diamond"
  | "square"
  | "pentagon"
  | "cross"
  | "star"
  | "bar";

// Every concept color pairs with a shape so meaning never rests on color alone
// (design system, concept colors table).
export const CONCEPT_SHAPES: Readonly<Record<ConceptColor, ConceptShapeName>> =
  {
    blue: "circle",
    violet: "triangle",
    pink: "diamond",
    amber: "square",
    teal: "pentagon",
    sky: "cross",
    lime: "star",
    slate: "bar",
  };

export type Point = readonly [number, number];

function regularPolygon(
  sides: number,
  radius: number,
  innerRadius?: number,
): Point[] {
  const count = innerRadius === undefined ? sides : sides * 2;
  return Array.from({ length: count }, (_, i) => {
    const r = innerRadius !== undefined && i % 2 === 1 ? innerRadius : radius;
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / count;
    return [r * Math.cos(angle), r * Math.sin(angle)] as const;
  });
}

// Outline of each polygonal shape centred on (0, 0) and fitting a circle of
// radius `r`, so every shape reads at the same visual size.
export function shapeOutline(
  shape: Exclude<ConceptShapeName, "circle">,
  r: number,
): Point[] {
  switch (shape) {
    case "triangle": {
      // Centred on its bounding box rather than its centroid so it lines up
      // with round neighbours in a row.
      const half = r * 0.95;
      return [
        [0, -half],
        [half * 1.1, half],
        [-half * 1.1, half],
      ];
    }
    case "diamond":
      return [
        [0, -r],
        [r * 0.8, 0],
        [0, r],
        [-r * 0.8, 0],
      ];
    case "square": {
      const half = r * 0.8;
      return [
        [-half, -half],
        [half, -half],
        [half, half],
        [-half, half],
      ];
    }
    case "pentagon":
      return regularPolygon(5, r);
    case "cross": {
      const arm = r * 0.34;
      return [
        [-arm, -r],
        [arm, -r],
        [arm, -arm],
        [r, -arm],
        [r, arm],
        [arm, arm],
        [arm, r],
        [-arm, r],
        [-arm, arm],
        [-r, arm],
        [-r, -arm],
        [-arm, -arm],
      ];
    }
    case "star":
      return regularPolygon(5, r, r * 0.45);
    case "bar": {
      const halfHeight = r * 0.4;
      return [
        [-r, -halfHeight],
        [r, -halfHeight],
        [r, halfHeight],
        [-r, halfHeight],
      ];
    }
  }
}

export function toPoints(points: readonly Point[], cx: number, cy: number) {
  return points.map(([x, y]) => `${round(cx + x)},${round(cy + y)}`).join(" ");
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
