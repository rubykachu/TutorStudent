"use client";

import { useMemo, useState } from "react";
import type { VisualProps, VisualState } from "@/visuals/registry";
import { NumberStepper } from "@/visuals/shared/number-stepper";
import {
  DivisionEquation,
  QUOTIENT_COLOR,
  REMAINDER_COLOR,
} from "./chia-parts";
import { DivisionFigure } from "./division-figure";
import {
  buildFigure,
  divide,
  type Figure,
  type FigureCell,
  fillPlaces,
  MIN_FILL_PLACES,
  placeKey,
  progressStart,
  readNumber,
} from "./long-division";

const PLACE_NAMES = ["đơn vị", "chục", "trăm", "nghìn"] as const;
const MAX_DIGIT = 9;
const FRAME_ROWS = 3;
// Shape of the frame drawn when the exercise's numbers are not known: a
// three-digit dividend over a two-digit divisor, every digit a "?".
const GENERIC_DIVISION = divide(100, 10);

const EMPTY: VisualState = {};

function placeName(place: number): string {
  return PLACE_NAMES[place] ?? `hàng ${place}`;
}

type Places = { quotient: number; remainder: number };

// The empty frame of the division with the child's quotient digits under the
// divisor and the remainder digits stacked under the dividend.
function fillFigure(
  division: ReturnType<typeof divide>,
  known: boolean,
  state: VisualState,
  places: Places,
): Figure {
  const base = buildFigure(division, progressStart());
  const unknown = (cell: FigureCell): FigureCell =>
    known || (cell.role !== "dividend" && cell.role !== "divisor")
      ? cell
      : { ...cell, kind: "unknown", text: "?" };
  const quotientCells: FigureCell[] = Array.from(
    { length: places.quotient },
    (_, k) => ({
      key: `q${k}`,
      zone: "right",
      col: k,
      row: 1,
      role: "quotient",
      kind: "text",
      text: String(state[placeKey("q", places.quotient - 1 - k)] ?? 0),
      highlighted: false,
    }),
  );
  const dividendEnd = base.leftCols - 1;
  const remainderCells: FigureCell[] = Array.from(
    { length: places.remainder },
    (_, k) => ({
      key: `r0.${k}`,
      zone: "left",
      col: dividendEnd - (places.remainder - 1) + k,
      row: 2,
      role: "remainder",
      kind: "text",
      text: String(state[placeKey("r", places.remainder - 1 - k)] ?? 0),
      highlighted: false,
    }),
  );
  return {
    cells: [...base.cells.map(unknown), ...quotientCells, ...remainderCells],
    rules: base.rules.map((rule) =>
      rule.zone === "right"
        ? { ...rule, to: Math.max(rule.to, places.quotient - 1) }
        : rule,
    ),
    leftCols: Math.max(base.leftCols, places.remainder + 1),
    rightCols: Math.max(base.rightCols, places.quotient),
    rows: FRAME_ROWS,
  };
}

// `manipulate` exercise: set up the division, then set the digits of the
// quotient (as many places as the real quotient has, at least tens and ones)
// and of the remainder. Reports { q<place>, r<place> } with place 0 the ones:
// q0, q1, q2 … for the quotient and r0, r1 … for the remainder.
export default function ColDivFill({
  params,
  onStateChange,
  shownState,
  disabled = false,
}: VisualProps) {
  const dividend = params?.dividend;
  const divisor = params?.divisor;
  const known = dividend !== undefined && divisor !== undefined;
  const division = useMemo(
    () => (known ? divide(dividend, divisor) : GENERIC_DIVISION),
    [known, dividend, divisor],
  );
  const places: Places = known
    ? fillPlaces(dividend, divisor)
    : { quotient: MIN_FILL_PLACES, remainder: MIN_FILL_PLACES };
  const [state, setState] = useState<VisualState>(EMPTY);
  const view = shownState ?? state;
  const locked = disabled || shownState !== undefined;
  const quotient = readNumber(view, "q", places.quotient);
  const remainder = readNumber(view, "r", places.remainder);

  function change(key: string, value: number) {
    const next = { ...state, [key]: value };
    setState(next);
    onStateChange?.(next);
  }

  const groups = [
    {
      kind: "q",
      name: "Thương",
      color: QUOTIENT_COLOR,
      count: places.quotient,
    },
    {
      kind: "r",
      name: "Số dư",
      color: REMAINDER_COLOR,
      count: places.remainder,
    },
  ] as const;

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <DivisionFigure
        figure={fillFigure(division, known, view, places)}
        label={
          known
            ? `Đặt tính ${dividend} chia ${divisor}, thương ${quotient}, số dư ${remainder}`
            : `Khung đặt tính phép chia, thương ${quotient}, số dư ${remainder}`
        }
        zoom={1.1}
        finalRemainderStep={0}
      />
      {known && (
        <DivisionEquation
          dividend={dividend}
          divisor={divisor}
          quotient={quotient}
          remainder={remainder}
          withRemainder
        />
      )}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
        {groups.flatMap(({ kind, name, color, count }) =>
          Array.from({ length: count }, (_, k) => {
            const place = count - 1 - k;
            const key = placeKey(kind, place);
            return (
              <NumberStepper
                key={key}
                label={`${name}: ${placeName(place)}`}
                color={color}
                value={view[key] ?? 0}
                min={0}
                max={MAX_DIGIT}
                disabled={locked}
                stateKey={key}
                onChange={(value) => change(key, value)}
              />
            );
          }),
        )}
      </div>
    </div>
  );
}
