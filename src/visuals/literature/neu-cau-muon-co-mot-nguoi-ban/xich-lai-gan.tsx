"use client";

import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { ACTION_BUTTON } from "@/visuals/shared/action-button";
import { stateStep, stateStepper } from "@/visuals/shared/markers";
import { useVisualTransition } from "@/visuals/shared/motion";
import { Fox, Label, Prince } from "./parts";

// The fox's recipe for taming (p. 23): sit a little way off on the grass
// without a word, and every day sit a little closer.
const DAYS = [
  { gap: 3, label: "Ngồi xa một chút, không nói gì" },
  { gap: 2, label: "Hôm sau, ngồi xích lại gần hơn" },
  { gap: 1, label: "Mỗi ngày lại gần hơn một chút" },
  { gap: 0, label: "Ngồi cạnh nhau: đã thân thiết" },
] as const;
// Width of one step of distance, in rem: at the widest gap the two faces
// still fit a phone.
const STEP_REM = 3.5;
// Room left between the two once they sit together, for the heart.
const HEART_REM = 2.5;

function Meadow({ day }: { day: number }) {
  const transition = useVisualTransition();
  const { gap } = DAYS[day] ?? DAYS[0];
  const close = gap === 0;
  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div className="flex h-20 w-full items-end justify-center border-b-4 border-concept-lime pb-1">
        <Prince mood={close ? "happy" : "calm"} className="size-14" />
        <motion.span
          initial={false}
          animate={{ width: `${close ? HEART_REM : gap * STEP_REM}rem` }}
          transition={transition}
          className="flex h-14 items-center justify-center"
        >
          {close && (
            <Heart
              aria-hidden
              className="size-6 fill-concept-pink text-concept-pink"
            />
          )}
        </motion.span>
        <Fox mood={close ? "happy" : "calm"} className="size-14" />
      </div>
    </div>
  );
}

// Days 1 and 4 side by side, for the recaps.
export function XichLaiGanTomTat() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      {[0, DAYS.length - 1].map((day) => (
        <div key={day} className="flex flex-col items-center gap-1">
          <Label className="font-semibold text-foreground">{`Ngày ${day + 1}`}</Label>
          <Meadow day={day} />
          <Label>{DAYS[day]?.label}</Label>
        </div>
      ))}
    </div>
  );
}

export default function XichLaiGan() {
  const [day, setDay] = useState(0);
  const last = DAYS.length - 1;
  return (
    <figure
      aria-label="Mỗi ngày hoàng tử bé ngồi gần cáo hơn"
      className="flex w-full max-w-md flex-col items-center gap-3"
    >
      <span className="font-heading text-block">{`Ngày ${day + 1}`}</span>
      <Meadow day={day} />
      <p className="text-center text-body" aria-live="polite">
        {DAYS[day]?.label}
      </p>
      <div className="flex gap-3" {...stateStepper("ngay", day + 1)}>
        <button
          type="button"
          className={ACTION_BUTTON}
          disabled={day === 0}
          onClick={() => setDay((d) => Math.max(0, d - 1))}
          {...stateStep("ngay", "down")}
        >
          <ChevronLeft aria-hidden className="size-5" />
          Ngày trước
        </button>
        <button
          type="button"
          className={ACTION_BUTTON}
          disabled={day === last}
          onClick={() => setDay((d) => Math.min(last, d + 1))}
          {...stateStep("ngay", "up")}
        >
          Ngày sau
          <ChevronRight aria-hidden className="size-5" />
        </button>
      </div>
    </figure>
  );
}
