"use client";

import type { VisualProps } from "@/visuals/registry";
import { isLessonScreen } from "@/visuals/shared/guided-feedback";
import { Board } from "@/visuals/shared/plane/board";
import { PieceBoard } from "@/visuals/shared/plane/piece-board";
import {
  type BoardShape,
  boardFigure,
  boardSteps,
  cornerOf,
  isDrawn,
  solvedState,
} from "./construction";
import { trayFigure, triangleStrip } from "./figures";

// The drawing boards and the piece boards of the lesson, on the shared
// `Board` and `PieceBoard`.

export type BoardSpec = {
  shape: BoardShape;
  // Corners: base left, base right, then the corner above the right one and
  // the corner above the left one.
  names: readonly string[];
  // Lesson screen only: the params to draw before "Tiếp" works.
  goal?: Readonly<Record<string, number>>;
  done?: string;
};

export function BoardVisual({
  spec,
  params,
  ...rest
}: VisualProps & { spec: BoardSpec }) {
  const guided = isLessonScreen(params) && spec.goal !== undefined;
  const target = guided ? (spec.goal ?? {}) : (params ?? {});
  return (
    <Board
      {...rest}
      params={params}
      steps={boardSteps(spec.shape, spec.names)}
      figureOf={(state) => boardFigure(spec.shape, spec.names, state)}
      guided={guided}
      met={(state) => isDrawn(spec.shape, state, target)}
      solved={() => solvedState(spec.shape, target)}
      warning={(state, current) =>
        spec.shape === "parallelogram-diagonal" &&
        current?.key === "pointC" &&
        cornerOf(state) === undefined
          ? {
              text: "Hai cung chưa gặp nhau. Hãy chọn lại độ mở compa.",
              blocks: "pointC",
            }
          : undefined
      }
      done={spec.done ?? "Bạn đã vẽ xong hình."}
    />
  );
}

export type PiecesSpec = {
  // Three triangles into a trapezoid, or eight trapezoids into a tray.
  which: "strip" | "tray";
  // Lesson screen only: how many pieces to place before "Tiếp" works.
  goal?: number;
  done?: string;
};

const PIECES = {
  strip: {
    total: 3,
    name: "Số miếng tam giác đã ghép",
    color: "teal",
    label: "Ba hình tam giác đều ghép thành một hình thang cân",
    done: "Ba miếng ghép thành một hình thang cân.",
  },
  tray: {
    total: 8,
    name: "Số miếng hình thang cân đã ghép",
    color: "sky",
    label: "Tám hình thang cân ghép thành mặt khay hình lục giác",
    done: "Tám miếng ghép thành mặt khay hình lục giác.",
  },
} as const;

export function PiecesVisual({
  spec,
  ...rest
}: VisualProps & { spec: PiecesSpec }) {
  const piece = PIECES[spec.which];
  return (
    <PieceBoard
      {...rest}
      total={piece.total}
      pieceName={piece.name}
      color={piece.color}
      goal={spec.goal}
      done={spec.done ?? piece.done}
      figureOf={(n) =>
        spec.which === "strip"
          ? triangleStrip(piece.label, { count: n, finished: n === 3 })
          : trayFigure(piece.label, n)
      }
    />
  );
}
