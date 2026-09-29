"use client";

import { motion } from "motion/react";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { ConceptMark } from "@/visuals/shared/concept-mark";
import { useVisualTransition } from "@/visuals/shared/motion";
import { StepPlayer } from "@/visuals/shared/step-player";

// Explainer skeleton: copy to src/visuals/<subject>/<slug>/<name>.tsx and
// register it as "<slug>.visual.<name>". Each step adds one idea; hidden
// rows keep their space so later steps never push earlier ones around.
const FACTOR = 2;
const COUNT = 3;
const PRODUCT_STEP = 1;
const RESULT_STEP = 2;

export default function Explainer() {
  const transition = useVisualTransition();
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
          {[PRODUCT_STEP, RESULT_STEP].map((shownFrom) => (
            <motion.p
              key={shownFrom}
              initial={false}
              animate={{ opacity: step >= shownFrom ? 1 : 0 }}
              transition={transition}
              className={`text-body md:text-body-lg ${step >= shownFrom ? "" : "invisible"}`}
            >
              {shownFrom === PRODUCT_STEP
                ? `${COUNT} thừa số bằng nhau`
                : `= ${FACTOR ** COUNT}`}
            </motion.p>
          ))}
        </div>
      )}
    </StepPlayer>
  );
}
