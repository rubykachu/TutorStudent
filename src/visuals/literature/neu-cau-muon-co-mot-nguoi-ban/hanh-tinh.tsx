"use client";

import { Reveal } from "@/visuals/shared/reveal";
import { StepPlayer } from "@/visuals/shared/step-player";
import { Fox, Label, type Mood, Speaker } from "./parts";

type Exchange = {
  question: string;
  answer?: string;
  mood: Mood;
  feeling: string;
};

// The fox asks about the prince's planet: no hunters pleases it, no chickens
// disappoints it, and it sighs.
const EXCHANGES: readonly Exchange[] = [
  {
    question: "Có thợ săn không?",
    answer: "Không.",
    mood: "happy",
    feeling: "Cáo thích: thú vị!",
  },
  {
    question: "Còn gà?",
    answer: "Không.",
    mood: "sad",
    feeling: "Cáo tiếc: không có gà",
  },
  {
    question: "Chẳng có gì là hoàn hảo.",
    mood: "calm",
    feeling: "Cáo thở dài",
  },
];

function ExchangeRow({ question, answer, mood, feeling }: Exchange) {
  return (
    <div className="flex items-center gap-3 rounded-xl border-2 border-border bg-surface p-2">
      <Fox mood={mood} className="size-12 shrink-0" />
      <div className="flex flex-col gap-1">
        <span className="flex flex-wrap items-center gap-x-2">
          <Speaker who="fox" />
          <span className="text-body">{question}</span>
        </span>
        {answer && (
          <span className="flex flex-wrap items-center gap-x-2">
            <Speaker who="prince" />
            <span className="text-body">{answer}</span>
          </span>
        )}
        <Label className="font-semibold text-foreground">{feeling}</Label>
      </div>
    </div>
  );
}

function PendingRow() {
  return (
    <div className="flex h-24 items-center justify-center rounded-xl border-2 border-dashed border-border font-heading text-title">
      ?
    </div>
  );
}

function Exchanges({ step }: { step: number }) {
  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      {EXCHANGES.map((exchange, i) => (
        <Reveal
          key={exchange.question}
          shown={step >= i}
          placeholder={<PendingRow />}
        >
          <ExchangeRow {...exchange} />
        </Reveal>
      ))}
    </div>
  );
}

// All three moments at once, for the recap.
export function HanhTinhTomTat() {
  return <Exchanges step={EXCHANGES.length} />;
}

export default function HanhTinh() {
  return (
    <StepPlayer
      steps={EXCHANGES.length}
      label="Cáo hỏi về hành tinh của hoàng tử bé"
    >
      {(step) => <Exchanges step={step} />}
    </StepPlayer>
  );
}
