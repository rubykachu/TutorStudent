"use client";

import type { VisualProps, VisualState } from "@/visuals/registry";
import { isLessonScreen } from "@/visuals/shared/guided-feedback";
import { Board, type BoardWarning } from "@/visuals/shared/plane/board";
import type { BoardStep } from "@/visuals/shared/plane/board-steps";
import {
  apexOf,
  type ConstructShape,
  constructFigure,
  constructSteps,
  solvedState,
} from "./construction";
import { isConstructed } from "./logic";

// The picture of a board is capped so it, the instruction and the controls
// fit one frame: 188px on a phone, up to 282px where the screen is wide.
const BOARD_MAX_HEIGHT = "max(188px, min(46vw, 282px))";

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

// What the board says instead of the instruction. Two compass arcs must meet
// before the apex is marked, and on a lesson screen the compass opening, the
// two segments taken on the square's perpendiculars and the side itself must
// be what the screen asks for. An exercise never says whether the figure is
// right (the frame does, after "Kiểm tra"); the board only tells the child
// the steps are done (`finished`).
function warningOf(
  spec: ConstructSpec,
  state: VisualState,
  current: BoardStep | undefined,
  guided: boolean,
): BoardWarning | undefined {
  const [first = "", second = ""] = spec.names;
  const { len, open, h } = state;
  const wrongLength =
    guided && spec.goal !== undefined && len !== undefined && len !== spec.goal;
  const lengthWarning = (blocks: string): BoardWarning => ({
    text: `Cạnh ${first}${second} phải dài ${spec.goal} cm.`,
    blocks,
  });
  if (spec.shape === "triangle") {
    if (current?.key === "apex" && apexOf(state) === undefined) {
      return {
        text: "Hai cung chưa gặp nhau. Hãy mở compa rộng hơn.",
        blocks: "apex",
      };
    }
    const late =
      current === undefined || ["apex", "join"].includes(current.key);
    if (
      guided &&
      len !== undefined &&
      open !== undefined &&
      open !== len &&
      late
    ) {
      return {
        text: `Độ mở compa phải bằng cạnh ${first}${second}.`,
        blocks: "apex",
      };
    }
    if (wrongLength && late) return lengthWarning("apex");
  } else {
    if (guided && len !== undefined && h !== undefined && h !== len) {
      return {
        text: `Hai đoạn lấy thêm phải bằng cạnh ${first}${second}.`,
        blocks: "join",
      };
    }
    if (wrongLength && (current === undefined || current.key === "join")) {
      return lengthWarning("join");
    }
  }
  return undefined;
}

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
      warning={(state, current) => warningOf(spec, state, current, guided)}
      maxHeight={BOARD_MAX_HEIGHT}
      done={spec.done ?? "Bạn đã vẽ xong hình."}
      finished="Bạn đã bấm đủ các bước. Hãy bấm Kiểm tra."
    />
  );
}
