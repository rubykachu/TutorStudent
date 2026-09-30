"use client";

import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { EQUATION_LINE, NamedMark } from "./arrange-parts";
import { formatNumber } from "./types";

// Two pictures for checking a sum quickly: the last digit of the sum follows
// from the units digits of the addends, and a sum of n numbers that are each
// below a limit stays below n times that limit.

const NUMBER_ROW =
  "flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-heading text-title font-bold tabular-nums md:text-title-lg";

function unitsDigit(value: number): number {
  return value % 10;
}

// The addends with their last digit in amber, then the sum of those digits
// and the digit the sum ends in.
export function LastDigit({ numbers }: { numbers: readonly number[] }) {
  const digits = numbers.map(unitsDigit);
  const digitSum = digits.reduce((total, digit) => total + digit, 0);
  const amber = CONCEPT_CLASSES.amber.text;
  return (
    <figure
      className="flex w-full max-w-md flex-col items-center gap-4"
      aria-label={`Chữ số cuối của tổng ${numbers.join(" cộng ")} là ${unitsDigit(digitSum)}`}
    >
      <p className={NUMBER_ROW}>
        {numbers.map((value, i) => {
          const text = formatNumber(value);
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: addends never reorder
            <span key={i} className="flex items-baseline gap-3">
              {i > 0 && <span aria-hidden>+</span>}
              <span>
                {text.slice(0, -1)}
                <span className={amber}>{text.slice(-1)}</span>
              </span>
            </span>
          );
        })}
      </p>
      <NamedMark color="amber" name="Chữ số hàng đơn vị" />
      <p className={EQUATION_LINE}>
        <span className={amber}>{digits.join(" + ")}</span>
        <span>=</span>
        <span className={amber}>{digitSum}</span>
      </p>
      <p className={EQUATION_LINE}>
        <span className="text-body font-normal md:text-body-lg">
          Chữ số cuối
        </span>
        <span className={amber}>{unitsDigit(digitSum)}</span>
      </p>
    </figure>
  );
}

// The addends each marked "< limit", then the bound the whole sum stays under.
export function UpperBound({
  numbers,
  limit,
}: {
  numbers: readonly number[];
  limit: number;
}) {
  const bound = numbers.length * limit;
  const amber = CONCEPT_CLASSES.amber.text;
  return (
    <figure
      className="flex w-full max-w-md flex-col items-center gap-4"
      aria-label={`${numbers.length} số hạng đều nhỏ hơn ${formatNumber(limit)}, nên tổng nhỏ hơn ${formatNumber(bound)}`}
    >
      <ul className="flex flex-wrap justify-center gap-3">
        {numbers.map((value, i) => (
          <li
            // biome-ignore lint/suspicious/noArrayIndexKey: addends never reorder
            key={i}
            className="flex min-w-20 flex-col items-center rounded-xl border-2 border-border bg-surface px-3 py-1.5 font-heading font-bold tabular-nums"
          >
            <span className="text-title md:text-title-lg">
              {formatNumber(value)}
            </span>
            <span className="text-caption font-semibold text-muted-foreground">
              {`< ${formatNumber(limit)}`}
            </span>
          </li>
        ))}
      </ul>
      <NamedMark color="amber" name="Giới hạn của tổng" />
      <p className={EQUATION_LINE}>
        <span>{`${numbers.length} số, mỗi số < ${formatNumber(limit)}`}</span>
      </p>
      <p className={EQUATION_LINE}>
        <span>Tổng</span>
        <span className={amber}>{`< ${formatNumber(bound)}`}</span>
      </p>
    </figure>
  );
}
