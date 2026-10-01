"use client";

import { Formula } from "@/components/blocks/formula";
import { FormulaRow, Pending } from "@/visuals/shared/formula-rows";
import { Reveal } from "@/visuals/shared/reveal";
import { StepPlayer } from "@/visuals/shared/step-player";
import type { SpecOf } from "./catalog";
import { divisorsOf, texList } from "./logic";

const CELL = 14;
const GAP = 2;
// Widest a square may be drawn, in px, where the screen has room to spare.
const MAX_CELL = 18;
// Height of the caption line under a rectangle.
const CAPTION_HEIGHT = 32;

// What the verdict row says once the divisors are listed.
const VERDICTS = {
  prime: { text: "Chỉ chia hết cho 1 và chính nó: số nguyên tố", color: "sky" },
  composite: { text: "Có từ ba ước trở lên: hợp số", color: "pink" },
} as const;

// One way to lay out the squares: `rows` rows of `perRow` squares, with the
// product that counts them (perRow taken `rows` times).
function Arrangement({
  n,
  rows,
  perRow,
  widest,
}: {
  n: number;
  rows: number;
  perRow: number;
  // Squares per row of the longest rectangle: all rectangles share one square
  // size, so each is drawn as wide as its share of that row.
  widest: number;
}) {
  const width = perRow * (CELL + GAP) - GAP;
  const height = rows * (CELL + GAP) - GAP;
  const label = `${rows} hàng, mỗi hàng ${perRow} ô`;
  return (
    <figure className="flex w-full flex-col items-center gap-1">
      <svg
        role="img"
        aria-label={label}
        viewBox={`0 0 ${width} ${height}`}
        style={{
          width: `${(perRow / widest) * 100}%`,
          maxWidth: perRow * (MAX_CELL + GAP),
          height: "auto",
        }}
      >
        {Array.from({ length: rows * perRow }, (_, i) => (
          <rect
            // biome-ignore lint/suspicious/noArrayIndexKey: squares are placed by position
            key={i}
            x={(i % perRow) * (CELL + GAP)}
            y={Math.floor(i / perRow) * (CELL + GAP)}
            width={CELL}
            height={CELL}
            rx={3}
            className="fill-highlight stroke-muted-foreground"
            strokeWidth={1.5}
          />
        ))}
      </svg>
      <figcaption className="flex flex-wrap items-baseline justify-center gap-x-3">
        <span className="text-caption">{label}</span>
        <Formula
          tex={`${n} = ${perRow} \\cdot ${rows}`}
          className="whitespace-nowrap text-body-lg"
        />
      </figcaption>
    </figure>
  );
}

// The ways to lay `n` squares into a rectangle, one more on every step, then
// the divisors they give and, with a verdict, whether `n` is prime or
// composite. In a hint the divisors stay a dimmed "?" and are never shown.
export function Rects({ spec }: { spec: SpecOf<"rects"> }) {
  const { n, ways, mode, verdict } = spec;
  const hint = mode === "hint";
  const divisors = divisorsOf(n);
  const widest = Math.max(...ways.map(([, perRow]) => perRow));
  const listStep = ways.length;
  const verdictStep = ways.length + 1;
  const total = ways.length + 1 + (verdict ? 1 : 0);
  const label = `${n} ô vuông xếp thành hình chữ nhật: ${ways
    .map(([rows, perRow]) => `${rows} hàng, mỗi hàng ${perRow} ô`)
    .join("; ")}`;

  const draw = (step: number) => {
    const still = mode === "still";
    return (
      <div className="flex w-full flex-col items-center gap-3">
        <ul className="flex w-full flex-col gap-3">
          {ways.map(([rows, perRow], i) => (
            <li
              key={`${rows}-${perRow}`}
              className="flex items-center justify-center"
              style={{
                minHeight: rows * (MAX_CELL + GAP) + CAPTION_HEIGHT,
              }}
            >
              <Reveal shown={still || step >= i} placeholder={<Pending />}>
                <Arrangement
                  n={n}
                  rows={rows}
                  perRow={perRow}
                  widest={widest}
                />
              </Reveal>
            </li>
          ))}
        </ul>
        <div className="w-full" aria-live="polite">
          <Reveal
            shown={still || (!hint && step >= listStep)}
            placeholder={<Pending />}
          >
            <FormulaRow
              row={{
                tex: texList(divisors),
                tag: { text: `Các ước của ${n}`, color: "violet" },
              }}
            />
          </Reveal>
        </div>
        {verdict && (
          <div className="w-full">
            <Reveal
              shown={still || (!hint && step >= verdictStep)}
              placeholder={<Pending />}
            >
              <FormulaRow
                row={{
                  tex: "",
                  tag: VERDICTS[verdict],
                }}
              />
            </Reveal>
          </div>
        )}
      </div>
    );
  };

  if (mode === "still") {
    return (
      <figure aria-label={label} className="w-full">
        {draw(total - 1)}
      </figure>
    );
  }
  return (
    <StepPlayer steps={total - (hint ? 1 : 0)} label={label}>
      {draw}
    </StepPlayer>
  );
}
