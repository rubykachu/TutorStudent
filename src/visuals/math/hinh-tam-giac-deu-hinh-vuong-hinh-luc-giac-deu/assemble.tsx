"use client";

import type { VisualProps } from "@/visuals/registry";
import { PieceBoard } from "@/visuals/shared/plane/piece-board";
import { hexTriangles } from "./figures";

// Six equilateral triangles put together round one point into a hexagon, on
// the shared `PieceBoard`.

export type AssembleSpec = {
  label: string;
  // Lesson screen only: how many triangles to place before "Tiếp" works.
  goal?: number;
  done?: string;
};

const PIECES = 6;

export function Assemble({
  spec,
  ...rest
}: VisualProps & { spec: AssembleSpec }) {
  return (
    <PieceBoard
      {...rest}
      total={PIECES}
      pieceName="Số miếng tam giác đã ghép"
      color="teal"
      goal={spec.goal}
      done={spec.done ?? "Sáu miếng ghép thành hình lục giác đều."}
      figureOf={(n) =>
        hexTriangles(spec.label, {
          w: 320,
          h: 240,
          cx: 160,
          cy: 120,
          r: 100,
          count: n,
        })
      }
    />
  );
}
