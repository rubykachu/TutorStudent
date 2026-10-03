"use client";

import { RotateCcw } from "lucide-react";
import { useState } from "react";
import type { VisualProps, VisualState } from "@/visuals/registry";
import { isLessonScreen } from "@/visuals/shared/guided-feedback";
import { Board } from "@/visuals/shared/plane/board";
import { type BoardStep, stepDone } from "@/visuals/shared/plane/board-steps";
import { PieceBoard } from "@/visuals/shared/plane/piece-board";
import {
  type BoardShape,
  boardSteps,
  cornerOf,
  isDrawn,
  solvedState,
} from "./construction";
import { boardView } from "./drawing-frames";
import { halvesFigure, trayFigure, triangleStrip } from "./figures";

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
  // A bigger picture: it may grow to a share of the screen's height instead
  // of the board's default cap.
  roomy?: boolean;
};

const ROOMY_MAX_HEIGHT = "min(36vh, 340px)";
const ROOMY_MAX_SCALE = 2;

// The controls of the step to do and of the step before it: a board with a
// control for every step is taller than a phone screen, and one thing at a
// time suits a child who loses focus. The step before stays so that a press
// can be taken back; "Vẽ lại từ đầu" starts the board over.
function nearbySteps(
  steps: readonly BoardStep[],
  state: VisualState,
): BoardStep[] {
  const next = steps.findIndex((step) => !stepDone(step, state));
  const at = next === -1 ? steps.length - 1 : next;
  return steps.slice(Math.max(0, at - 1), at + 1);
}

export function BoardVisual({
  spec,
  params,
  ...rest
}: VisualProps & { spec: BoardSpec }) {
  const guided = isLessonScreen(params) && spec.goal !== undefined;
  const target = guided ? (spec.goal ?? {}) : (params ?? {});
  // The state the board reports, to know which steps to show; a new round
  // empties the board.
  const [own, setOwn] = useState<VisualState>({});
  const [round, setRound] = useState(0);
  const state = rest.shownState ?? own;
  const locked = rest.disabled === true || rest.shownState !== undefined;
  function change(next: VisualState) {
    setOwn(next);
    rest.onStateChange?.(next);
  }
  return (
    <div className="flex w-full flex-col items-center gap-2">
      <Board
        key={round}
        {...rest}
        onStateChange={change}
        params={params}
        steps={nearbySteps(boardSteps(spec.shape, spec.names), state)}
        maxHeight={spec.roomy ? ROOMY_MAX_HEIGHT : undefined}
        figureOf={(shown) => {
          const view = boardView(spec.shape, spec.names, shown);
          return spec.roomy ? { ...view, maxScale: ROOMY_MAX_SCALE } : view;
        }}
        guided={guided}
        met={(shown) => isDrawn(spec.shape, shown, target)}
        solved={() => solvedState(spec.shape, target)}
        warning={(shown, current) => {
          if (
            spec.shape === "parallelogram-diagonal" &&
            current?.key === "pointC" &&
            cornerOf(shown) === undefined
          ) {
            return {
              text: "Hai cung chưa gặp nhau. Hãy chọn lại độ mở compa.",
              blocks: "pointC",
            };
          }
          // Every step is done on a lesson screen but the numbers are not
          // those the screen asks for: say so, not "done".
          if (
            guided &&
            current === undefined &&
            !isDrawn(spec.shape, shown, target)
          ) {
            return {
              text: "Bạn đã làm đủ các bước, nhưng số đo chưa đúng. Hãy chọn lại.",
              blocks: "",
            };
          }
          return undefined;
        }}
        finished="Bạn đã bấm đủ các bước. Hãy bấm Kiểm tra."
        done={spec.done ?? "Bạn đã vẽ xong hình."}
      />
      {!locked && Object.keys(own).length > 0 && (
        <button
          type="button"
          className="inline-flex min-h-touch items-center justify-center gap-2 rounded-lg border-2 border-border bg-surface px-4 font-semibold text-foreground motion-safe:transition-transform motion-safe:active:scale-97"
          onClick={() => {
            setRound(round + 1);
            change({});
          }}
        >
          <RotateCcw aria-hidden className="size-5" />
          Vẽ lại từ đầu
        </button>
      )}
    </div>
  );
}

export type PiecesSpec = {
  // Three triangles into a trapezoid, two trapezoids into a hexagon, or eight
  // trapezoids into a tray.
  which: "strip" | "halves" | "tray";
  // Lesson screen only: how many pieces to place before "Tiếp" works.
  goal?: number;
  done?: string;
};

const PIECES = {
  strip: {
    total: 3,
    name: "Số miếng tam giác đã ghép",
    // Grey like the pieces, not the colour of any of the four shapes.
    color: "slate",
    label: "Ba hình tam giác đều ghép thành một hình thang cân",
    done: "Ba miếng ghép thành một hình thang cân.",
  },
  halves: {
    total: 2,
    name: "Số miếng hình thang cân đã ghép",
    color: "sky",
    label: "Hai hình thang cân ghép thành một hình lục giác đều",
    done: "Hai miếng ghép thành một hình lục giác đều.",
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
          : spec.which === "halves"
            ? halvesFigure(piece.label, n)
            : trayFigure(piece.label, n)
      }
    />
  );
}
