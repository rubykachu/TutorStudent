import { PowerText } from "@/visuals/shared/power-text";
import { FactorCount, FactorRow, MATH_LINE, PowerAnatomy } from "./parts";

// Static summary of what a power means, for recaps: 2⁵ with its parts named
// and the five factors it stands for, then 6¹ = 6 for a power whose exponent
// is 1.
export default function CacPhan() {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <PowerAnatomy base={2} exponent={5} />
      <p className={MATH_LINE}>
        <span>=</span>
        <FactorRow base={2} count={5} />
      </p>
      <FactorCount count={5} />
      <p className={MATH_LINE}>
        <PowerText base={6} exponent={1} />
        <span>=</span>
        <span className="text-concept-blue">6</span>
      </p>
    </div>
  );
}
