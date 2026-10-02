"use client";

import type { VisualProps } from "@/visuals/registry";
import { isLessonScreen } from "@/visuals/shared/guided-feedback";
import { Board } from "@/visuals/shared/plane/board";
import {
  apexOf,
  type ConstructShape,
  constructFigure,
  constructSteps,
  solvedState,
} from "./construction";
import { isConstructed } from "./logic";

// The two drawing boards of the lesson (see `construction.ts`), shown by the
// shared `Board`. On a lesson screen with a `goal` side it is a guided "cùng
// làm" step: "Tiếp" waits until the figure of that side is drawn.

export type ConstructSpec = {
  shape: ConstructShape;
  // Corners: base left, base right, then the apex (triangle) or the corner
  // above the right one and the corner above the left one (square).
  names: readonly string[];
  // Also draw the two diagonals and ask whether they are perpendicular.
  diagonals?: boolean;
  // Lesson screen only: the side length to draw before "Tiếp" works.
  goal?: number;
  done?: string;
};

export function Construct({
  spec,
  params,
  ...rest
}: VisualProps & { spec: ConstructSpec }) {
  const diagonals = spec.diagonals ?? false;
  const guided = isLessonScreen(params) && spec.goal !== undefined;
  const side = guided ? (spec.goal as number) : (params?.side ?? 0);
  return (
    <Board
      {...rest}
      params={params}
      steps={constructSteps(spec.shape, spec.names, diagonals)}
      figureOf={(state) => constructFigure(spec.shape, spec.names, state)}
      guided={guided}
      met={(state) => isConstructed(spec.shape, diagonals)(state, { side })}
      solved={() => solvedState(spec.shape, side, diagonals)}
      warning={(state, current) =>
        spec.shape === "triangle" &&
        current?.key === "apex" &&
        apexOf(state) === undefined
          ? {
              text: "Hai cung chưa gặp nhau. Hãy mở compa rộng hơn.",
              blocks: "apex",
            }
          : undefined
      }
      done={spec.done ?? "Bạn đã vẽ xong hình."}
    />
  );
}
