"use client";

import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { ConceptMark } from "@/visuals/shared/concept-mark";
import { Reveal } from "@/visuals/shared/reveal";
import { StepPlayer } from "@/visuals/shared/step-player";

// Explainer skeleton: copy to src/visuals/<subject>/<slug>/<name>.tsx and
// register it as "<slug>.visual.<name>". Each step adds one idea; a row still
// to come shows dimmed with "?" in place of its result, so the child sees
// what is coming and later steps never push earlier rows around.
const FACTOR = 2;
const COUNT = 3;
const PRODUCT_STEP = 1;
const RESULT_STEP = 2;

export default function Explainer() {
  return (
    <StepPlayer steps={RESULT_STEP + 1} label="Nhân ba thừa số 2">
      {(step) => (
        <div className="flex w-full flex-col items-center gap-4">
          <p className="flex items-center gap-2 text-caption text-muted-foreground">
            <ConceptMark color="blue" className="size-4" />
            Thừa số
          </p>
          <p className="font-heading text-title font-bold md:text-title-lg">
            <span className={CONCEPT_CLASSES.blue.text}>
              {Array.from({ length: COUNT }, () => FACTOR).join(" · ")}
            </span>
          </p>
          <Reveal
            shown={step >= PRODUCT_STEP}
            placeholder={<p className="text-body md:text-body-lg">? thừa số</p>}
          >
            <p className="text-body md:text-body-lg">
              {COUNT} thừa số bằng nhau
            </p>
          </Reveal>
          <Reveal
            shown={step >= RESULT_STEP}
            placeholder={<p className="text-body md:text-body-lg">= ?</p>}
          >
            <p className="text-body md:text-body-lg">= {FACTOR ** COUNT}</p>
          </Reveal>
        </div>
      )}
    </StepPlayer>
  );
}
