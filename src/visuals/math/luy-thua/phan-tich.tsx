import { PowerText } from "@/visuals/shared/power-text";
import { FactorRow } from "./parts";

export type PowerSpec = { base: number; exponent: number };

// Hint for questions that ask for the values of several powers: each power
// written out as its factors, without values, so the child still multiplies.
// Callers list the powers out of value order so the hint never sorts them.
export function FactorList({ powers }: { powers: readonly PowerSpec[] }) {
  return (
    <div className="grid grid-cols-[auto_auto_1fr] items-baseline gap-x-3 gap-y-3 font-heading text-block font-bold md:text-block-lg">
      {powers.map(({ base, exponent }) => (
        <div
          key={`${base}-${exponent}`}
          className="col-span-3 grid grid-cols-subgrid"
        >
          <PowerText base={base} exponent={exponent} className="text-right" />
          <span>=</span>
          <FactorRow base={base} count={exponent} maxShown={4} />
        </div>
      ))}
    </div>
  );
}
