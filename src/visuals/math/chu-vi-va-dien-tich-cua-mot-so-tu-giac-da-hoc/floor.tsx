"use client";

import { useState } from "react";
import type { VisualProps, VisualState } from "@/visuals/registry";
import {
  DoneLine,
  isLessonScreen,
  ShownLine,
  useGuidedGoal,
} from "@/visuals/shared/guided-feedback";
import { decorative } from "@/visuals/shared/markers";
import { NumberStepper } from "@/visuals/shared/number-stepper";
import { FLOOR_EXTRA, type FloorSpec } from "./models";

// A floor covered with square tiles in rows. The child sets how many tiles
// go in a row and how many rows; the tiles inside the floor are painted, a
// tile past its edge is only outlined. State { perRow, rows }. An exercise
// passes its own floor as params { perRow, rows }.

const WIDTH = 320;
const SIDE = 24;
const MAX_CELL = 44;
const MIN_CELL = 24;

export function Floor({
  spec,
  onStateChange,
  shownState,
  disabled = false,
  params,
}: VisualProps & { spec: FloorSpec }) {
  const goal = {
    perRow: params?.perRow ?? spec.goal.perRow,
    rows: params?.rows ?? spec.goal.rows,
  };
  const [own, setOwn] = useState<VisualState>({});
  const state = shownState ?? own;
  const locked = disabled || shownState !== undefined;
  const perRow = state.perRow;
  const rows = state.rows;
  const met = perRow === goal.perRow && rows === goal.rows;

  function change(next: VisualState) {
    setOwn(next);
    onStateChange?.(next);
  }
  const { shown } = useGuidedGoal({
    met,
    guided: isLessonScreen(params),
    reveal: () => change({ perRow: goal.perRow, rows: goal.rows }),
  });

  const cell = Math.max(
    MIN_CELL,
    Math.min(
      MAX_CELL,
      Math.floor((WIDTH - 2 * SIDE) / (goal.perRow + FLOOR_EXTRA)),
    ),
  );
  const height = 2 * SIDE + (goal.rows + FLOOR_EXTRA) * cell;
  const tiles = Array.from({ length: (rows ?? 0) * (perRow ?? 0) }, (_, i) => {
    const r = Math.floor(i / (perRow ?? 1));
    const c = i % (perRow ?? 1);
    return { r, c, inside: c < goal.perRow && r < goal.rows };
  });
  const total = (perRow ?? 0) * (rows ?? 0);
  const lesson = isLessonScreen(params);
  const note =
    !lesson || perRow === undefined || rows === undefined || met
      ? ""
      : perRow > goal.perRow || rows > goal.rows
        ? "Có ô nằm ngoài sàn."
        : "Sàn còn chỗ trống.";
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="w-full max-w-md">
        <svg
          viewBox={`0 0 ${WIDTH} ${height}`}
          role="img"
          aria-label={`Sàn phòng dài ${goal.perRow} m, rộng ${goal.rows} m, chia thành các ô vuông cạnh ${spec.tile}`}
          className="h-auto max-h-72 w-full"
        >
          <rect
            {...decorative}
            x={SIDE}
            y={SIDE}
            width={goal.perRow * cell}
            height={goal.rows * cell}
            strokeWidth={3}
            className="fill-muted stroke-foreground"
          />
          {tiles.map(({ r, c, inside }) => (
            <rect
              key={`${r}-${c}`}
              {...decorative}
              x={SIDE + c * cell}
              y={SIDE + r * cell}
              width={cell}
              height={cell}
              strokeWidth={inside ? 2 : 2.5}
              strokeDasharray={inside ? undefined : "6 5"}
              fillOpacity={inside ? 0.5 : 0}
              className={
                inside
                  ? "fill-concept-teal stroke-surface"
                  : "fill-none stroke-concept-amber"
              }
            />
          ))}
        </svg>
      </div>
      <div className="flex flex-wrap items-start justify-center gap-x-8 gap-y-2">
        <NumberStepper
          label="Số ô mỗi hàng"
          value={perRow}
          min={1}
          max={goal.perRow + FLOOR_EXTRA}
          disabled={locked}
          stateKey="perRow"
          onChange={(value) => change({ ...state, perRow: value })}
        />
        <NumberStepper
          label="Số hàng"
          value={rows}
          min={1}
          max={goal.rows + FLOOR_EXTRA}
          disabled={locked}
          stateKey="rows"
          onChange={(value) => change({ ...state, rows: value })}
        />
      </div>
      <p
        className="min-h-8 text-center font-heading text-block font-semibold"
        aria-live="polite"
      >
        {perRow !== undefined && rows !== undefined
          ? `${perRow} · ${rows} = ${total} ô`
          : "? · ? = ? ô"}
      </p>
      {note !== "" && (
        <p className="text-center text-caption text-muted-foreground">{note}</p>
      )}
      {lesson && met && !shown && <DoneLine>{spec.done}</DoneLine>}
      {lesson && met && shown && <ShownLine>{spec.done}</ShownLine>}
    </div>
  );
}
