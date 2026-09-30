"use client";

import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { cellId, planMultiplication } from "./col-mul-digits";
import { ColMulFigure } from "./col-mul-figure";

// Three worked examples that are wrong, one card each: what went wrong drawn
// in the picture, the reason in one sentence, and the right answer under it.
// Wrong parts carry the orange dashed "try again" ring, never red.

const WRONG_RING =
  "rounded-lg border-2 border-dashed border-retry bg-retry-soft";
const CHIP = `inline-flex min-h-8 items-center px-3 text-caption font-semibold text-retry-soft-foreground rounded-full ${WRONG_RING}`;
const MATH = "font-heading text-title font-bold tabular-nums";

function Card({
  name,
  reason,
  right,
  children,
}: {
  name: string;
  reason: string;
  right: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col items-center gap-3 rounded-xl border-2 border-border bg-surface p-3 md:p-4">
      <h3 className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-heading text-block font-semibold">
        <span className={CHIP}>Sai</span>
        {name}
      </h3>
      {children}
      <p className="text-center text-body">{reason}</p>
      <p className="flex items-start gap-2 text-center text-body font-semibold text-correct-soft-foreground">
        <Check aria-hidden className="mt-1 size-5 shrink-0 text-correct" />
        <span>{right}</span>
      </p>
    </section>
  );
}

// 47 · 6 written 242: the carry 4 of 7 · 6 = 42 was left out, so the tens
// place got 4 · 6 = 24 instead of 28.
const FORGOT_CARRY = planMultiplication(47, 6);
const FORGOT_CARRY_SHOWN = new Set([
  cellId.partial(0, 0),
  cellId.partial(0, 1),
  cellId.partial(0, 2),
]);
const FORGOT_CARRY_OVERRIDE = new Map([[cellId.partial(0, 1), "4"]]);
const FORGOT_CARRY_RINGED = new Set([cellId.carry(0, 1), cellId.partial(0, 1)]);

function ForgotCarry() {
  return (
    <Card
      name="Quên số nhớ"
      reason="Bài làm ra 242 vì quên cộng số nhớ 4 vào 4 · 6 = 24."
      right="Đúng: 4 · 6 = 24, cộng 4 được 28. Tích là 282."
    >
      <ColMulFigure
        plan={FORGOT_CARRY}
        shown={FORGOT_CARRY_SHOWN}
        ringed={FORGOT_CARRY_RINGED}
        override={FORGOT_CARRY_OVERRIDE}
        mono
        compact
        label="Đặt tính 47 nhân 6 viết 242: thiếu số nhớ 4 trên chữ số 4, nên hàng chục sai"
      />
    </Card>
  );
}

function BigEquation({ children }: { children: ReactNode }) {
  return <p className={`${MATH} text-center`}>{children}</p>;
}

function RemainderTooBig() {
  return (
    <Card
      name="Số dư lớn hơn số chia"
      reason="Số dư 6 không nhỏ hơn số chia 5."
      right="Đúng: 36 : 5 = 7 dư 1, vì 5 · 7 + 1 = 36."
    >
      <BigEquation>
        36 : 5 = 6{" "}
        <span
          className={`${WRONG_RING} whitespace-nowrap px-2`}
          role="img"
          aria-label="dư 6, sai"
        >
          dư 6
        </span>
      </BigEquation>
    </Card>
  );
}

// Long division 367 : 9 as the wrong answer wrote it: quotient 4 with the
// place of the 0 left empty.
const DIGIT_W = 34;
const ROW_H = 40;
const PAD = 6;
const BAR_X = PAD + 3 * DIGIT_W + 8;
const QUOTIENT_X = BAR_X + 8;
const LONG_DIVISION_WIDTH = QUOTIENT_X + 2 * DIGIT_W + PAD;
const LONG_DIVISION_HEIGHT = 5 * ROW_H + 2 * PAD;

function Digit({
  x,
  row,
  children,
}: {
  x: number;
  row: number;
  children: string;
}) {
  return (
    <text
      x={x}
      y={PAD + row * ROW_H + ROW_H / 2}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={28}
      className="fill-foreground font-bold tabular-nums"
    >
      {children}
    </text>
  );
}

function Rule({ x1, x2, row }: { x1: number; x2: number; row: number }) {
  const y = PAD + row * ROW_H;
  return (
    <line
      x1={x1}
      x2={x2}
      y1={y}
      y2={y}
      strokeWidth={2.5}
      strokeLinecap="round"
      className="stroke-foreground"
    />
  );
}

const columnX = (column: number) => PAD + column * DIGIT_W + DIGIT_W / 2;

function MissingZeroPicture() {
  return (
    <svg
      role="img"
      aria-label="Chia 367 cho 9: thương mới viết 4, còn thiếu chữ số 0 ở hàng đơn vị"
      viewBox={`0 0 ${LONG_DIVISION_WIDTH} ${LONG_DIVISION_HEIGHT}`}
      className="h-auto w-full max-w-56"
    >
      {["3", "6", "7"].map((d, i) => (
        <Digit key={d} x={columnX(i)} row={0}>
          {d}
        </Digit>
      ))}
      <line
        x1={BAR_X}
        x2={BAR_X}
        y1={PAD}
        y2={PAD + ROW_H}
        strokeWidth={2.5}
        strokeLinecap="round"
        className="stroke-foreground"
      />
      <Digit x={QUOTIENT_X + DIGIT_W / 2} row={0}>
        9
      </Digit>
      <Rule x1={BAR_X} x2={LONG_DIVISION_WIDTH - PAD} row={1} />
      <Digit x={QUOTIENT_X + DIGIT_W / 2} row={1}>
        4
      </Digit>
      <rect
        x={QUOTIENT_X + DIGIT_W + 2}
        y={PAD + ROW_H + 4}
        width={DIGIT_W - 4}
        height={ROW_H - 8}
        rx={8}
        strokeWidth={2.5}
        strokeDasharray="5 4"
        className="fill-retry-soft stroke-retry"
      />
      <Digit x={columnX(0)} row={1}>
        3
      </Digit>
      <Digit x={columnX(1)} row={1}>
        6
      </Digit>
      <Rule x1={PAD} x2={PAD + 2 * DIGIT_W} row={2} />
      <Digit x={columnX(1)} row={2}>
        0
      </Digit>
      <Digit x={columnX(2)} row={2}>
        7
      </Digit>
      <Digit x={columnX(2)} row={3}>
        0
      </Digit>
      <Rule x1={PAD + DIGIT_W} x2={PAD + 3 * DIGIT_W} row={4} />
      <Digit x={columnX(2)} row={4}>
        7
      </Digit>
    </svg>
  );
}

function MissingZero() {
  return (
    <Card
      name="Quên chữ số 0 ở thương"
      reason="7 nhỏ hơn 9 nên thương ở hàng đơn vị là 0. Thiếu số 0 thì thương chỉ còn 4."
      right="Đúng: 367 : 9 = 40 dư 7, vì 9 · 40 + 7 = 367."
    >
      <MissingZeroPicture />
    </Card>
  );
}

export function Mistakes() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <ForgotCarry />
      <RemainderTooBig />
      <MissingZero />
    </div>
  );
}
