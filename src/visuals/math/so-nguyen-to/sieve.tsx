"use client";

import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { ConceptShape } from "@/visuals/shared/concept-mark";
import { Legend } from "@/visuals/shared/math-parts";
import { StepPlayer } from "@/visuals/shared/step-player";
import type { SpecOf } from "./catalog";
import { isPrime, SIEVE_LIMIT, SIEVE_PRIMES } from "./logic";

const COLS = 10;
const CELL_W = 36;
const CELL_H = 32;
const FONT = 18;
const MARK = 5;
const WIDTH = COLS * CELL_W;
const HEIGHT = (SIEVE_LIMIT / COLS) * CELL_H;

// The numbers 1..100 in ten rows. Step 0 shows the plain table; each next
// step crosses out the multiples of 2, 3, 5 and 7 (not those numbers
// themselves); the last step marks the numbers left as the primes.
const STEP_LABELS = [
  "Bảng các số từ 1 đến 100",
  ...SIEVE_PRIMES.map((p) => `Gạch các bội của ${p}`),
  "Số không bị gạch là số nguyên tố",
] as const;

function crossedAt(n: number, step: number): boolean {
  return SIEVE_PRIMES.some((p, i) => i < step && n > p && n % p === 0);
}

function Cell({ n, step }: { n: number; step: number }) {
  const col = (n - 1) % COLS;
  const row = Math.floor((n - 1) / COLS);
  const x = col * CELL_W;
  const y = row * CELL_H;
  const final = step >= STEP_LABELS.length - 1;
  const crossed = n > 1 && crossedAt(n, step);
  const prime = final && isPrime(n);
  const text = prime
    ? CONCEPT_CLASSES.sky.fill
    : crossed || n === 1
      ? "fill-muted-foreground"
      : "fill-foreground";
  return (
    <g>
      <rect
        x={x + 1}
        y={y + 1}
        width={CELL_W - 2}
        height={CELL_H - 2}
        rx={4}
        className={
          prime
            ? `fill-concept-sky/20 ${CONCEPT_CLASSES.sky.stroke}`
            : "fill-surface stroke-border"
        }
        strokeWidth={prime ? 2 : 1}
      />
      <text
        x={x + CELL_W / 2}
        y={y + CELL_H / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={FONT}
        fontWeight={prime ? 700 : 500}
        className={`font-heading tabular-nums ${text}`}
        opacity={crossed ? 0.55 : 1}
      >
        {n}
      </text>
      {crossed && (
        <>
          <line
            x1={x + 5}
            y1={y + CELL_H - 5}
            x2={x + CELL_W - 5}
            y2={y + 5}
            className={CONCEPT_CLASSES.pink.stroke}
            strokeWidth={2}
          />
          <ConceptShape
            color="pink"
            cx={x + CELL_W - MARK - 3}
            cy={y + MARK + 3}
            r={MARK}
          />
        </>
      )}
      {prime && (
        <ConceptShape
          color="sky"
          cx={x + CELL_W - MARK - 3}
          cy={y + MARK + 3}
          r={MARK}
        />
      )}
    </g>
  );
}

function Table({ step }: { step: number }) {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <svg
        role="img"
        aria-label={STEP_LABELS[step]}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-auto w-full max-w-md"
      >
        {Array.from({ length: SIEVE_LIMIT }, (_, i) => (
          <Cell key={i + 1} n={i + 1} step={step} />
        ))}
      </svg>
      <p
        className="min-h-8 text-center text-caption font-semibold"
        aria-live="polite"
      >
        {STEP_LABELS[step]}
      </p>
      <Legend
        items={[
          { color: "sky", name: "Số nguyên tố" },
          { color: "pink", name: "Hợp số (bị gạch)" },
        ]}
      />
    </div>
  );
}

// Still table of the primes below 100, or the walk that builds it.
export function Sieve({ spec }: { spec: SpecOf<"sieve"> }) {
  const last = STEP_LABELS.length - 1;
  if (spec.mode === "still") {
    return (
      <figure aria-label="Bảng các số nguyên tố nhỏ hơn 100" className="w-full">
        <Table step={last} />
      </figure>
    );
  }
  return (
    <StepPlayer steps={last + 1} label="Cách lập bảng số nguyên tố nhỏ hơn 100">
      {(step) => <Table step={step} />}
    </StepPlayer>
  );
}
