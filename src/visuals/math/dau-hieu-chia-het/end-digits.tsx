"use client";

import { Legend } from "@/visuals/shared/math-parts";
import type { SpecOf } from "./catalog";
import { divisible, endingDigitsFor, listDivisors } from "./logic";
import { DigitTile } from "./tiles";

const DIGITS = Array.from({ length: 10 }, (_, d) => d);

// One row of the ten tiles 0..9; the ones in `fit` are picked out.
function TileRow({ title, fit }: { title: string; fit: readonly number[] }) {
  return (
    <li className="flex flex-col gap-1">
      <p className="text-caption font-semibold">{title}</p>
      <div
        role="img"
        aria-label={`${title}: tận cùng là ${fit.join(", ")}`}
        className="grid grid-cols-10 gap-1"
      >
        {DIGITS.map((d) => (
          <DigitTile
            key={d}
            digit={d}
            size="cell"
            tone={fit.includes(d) ? "concept" : "plain"}
          />
        ))}
      </div>
    </li>
  );
}

// Still picture: which last digits make a number divisible, one row per
// divisor and, for several divisors, a last row for the digits that fit all.
export function EndDigits({ spec }: { spec: SpecOf<"endDigits"> }) {
  const { divisors } = spec;
  const both = DIGITS.filter((d) =>
    divisors.every((divisor) => divisible(d, divisor)),
  );
  return (
    <figure
      aria-label={`Chữ số tận cùng của số chia hết cho ${listDivisors(divisors)}`}
      className="flex w-full max-w-md flex-col items-center gap-3"
    >
      <ul className="flex w-full flex-col gap-3">
        {divisors.map((divisor) => (
          <TileRow
            key={divisor}
            title={`Tận cùng tô màu thì chia hết cho ${divisor}`}
            fit={endingDigitsFor(divisor)}
          />
        ))}
        {divisors.length > 1 && (
          <TileRow
            title={`Tận cùng tô màu thì chia hết cho cả ${listDivisors(divisors)}`}
            fit={both}
          />
        )}
      </ul>
      <Legend items={[{ color: "teal", name: "Chữ số tận cùng" }]} />
    </figure>
  );
}
