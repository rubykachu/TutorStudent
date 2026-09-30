"use client";

import { motion } from "motion/react";
import { decorative } from "@/visuals/shared/markers";
import { useVisualTransition } from "@/visuals/shared/motion";
import { Reveal } from "@/visuals/shared/reveal";
import { StepPlayer } from "@/visuals/shared/step-player";
import { Fox, Label, type Mood } from "./parts";

type Moment = { words: string; feeling: string; mood: Mood; level: number };

// The fox's feelings at parting (p. 23–24), placed on a sad-to-happy meter:
// it will cry, it accepts that, and it still gains the colour of the wheat.
const MOMENTS: readonly Moment[] = [
  {
    words: "Mình sẽ khóc mất.",
    feeling: "buồn, muốn khóc",
    mood: "sad",
    level: 0.12,
  },
  {
    words: "Tất nhiên rồi.",
    feeling: "buồn nhưng chấp nhận",
    mood: "calm",
    level: 0.4,
  },
  {
    words: "Mình được chứ… còn có màu lúa mì.",
    feeling: "vẫn còn màu lúa mì để nhớ bạn",
    mood: "happy",
    level: 0.72,
  },
];

function Meter({ step }: { step: number }) {
  const transition = useVisualTransition();
  const current = MOMENTS[Math.min(step, MOMENTS.length - 1)] ?? MOMENTS[0];
  return (
    <div className="flex w-full flex-col gap-1">
      <div className="relative h-14 w-full">
        <div
          {...decorative}
          className="absolute inset-x-0 top-5 h-4 rounded-full bg-gradient-to-r from-concept-sky/40 via-muted to-concept-pink/40"
        />
        <motion.div
          initial={false}
          animate={{ left: `${(current?.level ?? 0) * 100}%` }}
          transition={transition}
          className="absolute top-0 -ml-7 flex"
        >
          <Fox mood={current?.mood} className="size-14" />
        </motion.div>
      </div>
      <div className="flex justify-between">
        <Label>Buồn</Label>
        <Label>Vui</Label>
      </div>
    </div>
  );
}

function MomentRow({ index, moment }: { index: number; moment: Moment }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border-2 border-border bg-surface px-3 py-2">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-concept-pink font-semibold text-white">
        {index + 1}
      </span>
      <span className="flex flex-col">
        <span className="text-body">– {moment.words}</span>
        <Label className="font-semibold text-foreground">
          {moment.feeling}
        </Label>
      </span>
    </div>
  );
}

function PendingRow() {
  return (
    <div className="flex h-18 items-center justify-center rounded-xl border-2 border-dashed border-border font-heading text-block">
      ?
    </div>
  );
}

function Moments({ step }: { step: number }) {
  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <Meter step={step} />
      {MOMENTS.map((moment, i) => (
        <Reveal
          key={moment.words}
          shown={step >= i}
          placeholder={<PendingRow />}
        >
          <MomentRow index={i} moment={moment} />
        </Reveal>
      ))}
    </div>
  );
}

export function CamXucTomTat() {
  return <Moments step={MOMENTS.length - 1} />;
}

export default function CamXucCao() {
  return (
    <StepPlayer steps={MOMENTS.length} label="Cảm xúc của cáo khi chia tay">
      {(step) => <Moments step={step} />}
    </StepPlayer>
  );
}
