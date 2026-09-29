import { Fragment } from "react";
import { formatInteger } from "@/lib/number-format";
import { MATH_LINE } from "./parts";

// Hint for writing a number with powers of 10: the number split by place
// value into plain 1 000, 100 and 10, leaving the child to turn those into
// powers of 10.
export function PlaceValueSum({ value }: { value: number }) {
  const digits = [...String(value)].map(Number);
  const terms = digits.map((digit, i) => {
    const place = 10 ** (digits.length - 1 - i);
    return place === 1 ? String(digit) : `${digit} · ${formatInteger(place)}`;
  });
  return (
    <p className={MATH_LINE}>
      <span className="whitespace-nowrap">{formatInteger(value)}</span>
      <span>=</span>
      {terms.map((term, i) => (
        <Fragment key={term}>
          {i > 0 && <span>+</span>}
          <span className="whitespace-nowrap">{term}</span>
        </Fragment>
      ))}
    </p>
  );
}
