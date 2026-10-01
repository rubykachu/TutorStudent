"use client";

import { Formula } from "@/components/blocks/formula";
import { FormulaRow, Pending } from "@/visuals/shared/formula-rows";
import { Reveal } from "@/visuals/shared/reveal";
import { StepPlayer } from "@/visuals/shared/step-player";
import type { SpecOf } from "./catalog";
import { divisorsOf, texList } from "./logic";

const CELL = 22;
const GAP = 3;
// Height of the caption and the formula under a rectangle.
const TEXT_HEIGHT = 76;

// What the verdict row says once the divisors are listed.
const VERDICTS = {
  prime: { text: "Có đúng hai ước: số nguyên tố", color: "sky" },
  composite: { text: "Có nhiều hơn hai ước: hợp số", color: "pink" },
} as const;

// One way to lay out the squares: `rows` rows of `perRow` squares, with the
// product that counts them (perRow taken `rows` times).
function Arrangement({
  n,
  rows,
  perRow,
}: {
  n: number;
  rows: number;
  perRow: number;
}) {
  const width = perRow * (CELL + GAP) - GAP;
  const height = rows * (CELL + GAP) - GAP;
  const label = `${rows} hàng, mỗi hàng ${perRow} ô`;
  return (
    <figure className="flex flex-col items-center gap-1">
      <svg
        role="img"
        aria-label={label}
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        style={{ maxWidth: "100%", height: "auto" }}
      >
        {Array.from({ length: rows * perRow }, (_, i) => (
          <rect
            // biome-ignore lint/suspicious/noArrayIndexKey: squares are placed by position
            key={i}
            x={(i % perRow) * (CELL + GAP)}
            y={Math.floor(i / perRow) * (CELL + GAP)}
            width={CELL}
            height={CELL}
            rx={4}
            className="fill-highlight stroke-muted-foreground"
            strokeWidth={1.5}
          />
        ))}
      </svg>
      <figcaption className="text-caption">{label}</figcaption>
      <Formula tex={`${n} = ${perRow} \\cdot ${rows}`} className="text-block" />
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
  const listStep = ways.length;
  const verdictStep = ways.length + 1;
  const total = ways.length + 1 + (verdict ? 1 : 0);
  const label = `${n} ô vuông xếp thành hình chữ nhật: ${ways
    .map(([rows, perRow]) => `${rows} hàng, mỗi hàng ${perRow} ô`)
    .join("; ")}`;

  const draw = (step: number) => {
    const still = mode === "still";
    return (
      <div className="flex w-full flex-col items-center gap-4">
        <ul className="flex flex-wrap items-start justify-center gap-4">
          {ways.map(([rows, perRow], i) => (
            <li
              key={`${rows}-${perRow}`}
              className="flex items-center justify-center"
              style={{
                minWidth: Math.min(perRow * (CELL + GAP), 160),
                minHeight: rows * (CELL + GAP) + TEXT_HEIGHT,
              }}
            >
              <Reveal shown={still || step >= i} placeholder={<Pending />}>
                <Arrangement n={n} rows={rows} perRow={perRow} />
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
