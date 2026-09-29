"use client";

import { BeadGroup } from "@/visuals/shared/bead-group";
import { StepPlayer } from "@/visuals/shared/step-player";
import {
  FactorCount,
  FactorRow,
  MATH_LINE,
  PowerAnatomy,
  Reveal,
} from "./parts";

const BASE = 2;
const EXPONENT = 5;
// Five equal factors, then their count, then the short form, then how to read it.
const COUNT_STEP = 1;
const POWER_STEP = 2;
const READ_STEP = 3;

export default function LaGi() {
  return (
    <StepPlayer steps={READ_STEP + 1} label="Viết gọn tích của năm thừa số 2">
      {(step) => (
        <div className="flex w-full flex-col items-center gap-4">
          <BeadGroup
            groups={[{ color: "blue", count: EXPONENT, text: String(BASE) }]}
            merged
            label="Năm hạt, mỗi hạt là số 2"
            scale={1}
            className="h-auto"
          />
          <p className={MATH_LINE}>
            <FactorRow base={BASE} count={EXPONENT} />
          </p>
          <Reveal
            shown={step >= COUNT_STEP}
            placeholder={<FactorCount count="?" />}
          >
            <FactorCount count={EXPONENT} />
          </Reveal>
          <Reveal
            shown={step >= POWER_STEP}
            placeholder={<PowerAnatomy base={BASE} exponent="?" />}
          >
            <PowerAnatomy base={BASE} exponent={EXPONENT} />
          </Reveal>
          <Reveal
            shown={step >= READ_STEP}
            placeholder={<p className="text-center">Đọc là: “?”</p>}
          >
            <p className="text-center">
              Đọc là: <strong>“2 mũ 5”</strong> hoặc{" "}
              <strong>“2 luỹ thừa 5”</strong>
            </p>
          </Reveal>
        </div>
      )}
    </StepPlayer>
  );
}
