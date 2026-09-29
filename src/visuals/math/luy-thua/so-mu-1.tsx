import { BeadGroup } from "@/visuals/shared/bead-group";
import { PowerText } from "@/visuals/shared/power-text";
import { FactorCount, MATH_LINE } from "./parts";

const BASE = 5;

// Exponent 1 means a single factor, so the power is the base itself. Drawn
// with 5 so it can hint at questions about other bases without answering them.
export default function SoMu1() {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <BeadGroup
        groups={[{ color: "blue", count: 1, text: String(BASE) }]}
        merged
        label="Một hạt số 5"
        scale={1}
        className="h-auto"
      />
      <FactorCount count={1} />
      <p className={MATH_LINE}>
        <PowerText base={BASE} exponent={1} />
        <span>=</span>
        <span className="text-concept-blue">{BASE}</span>
      </p>
    </div>
  );
}
