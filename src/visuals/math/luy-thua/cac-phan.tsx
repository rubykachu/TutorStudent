import { FactorCount, FactorRow, MATH_LINE, PowerAnatomy } from "./parts";

// Static summary of what a power means, for recaps: 2⁵ with its parts named
// and the five factors it stands for.
export default function CacPhan() {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <PowerAnatomy base={2} exponent={5} />
      <p className={MATH_LINE}>
        <span>=</span>
        <FactorRow base={2} count={5} />
      </p>
      <FactorCount count={5} />
    </div>
  );
}
