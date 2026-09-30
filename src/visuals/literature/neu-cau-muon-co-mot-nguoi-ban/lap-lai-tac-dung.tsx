"use client";

import { Reveal } from "@/visuals/shared/reveal";
import { StepPlayer } from "@/visuals/shared/step-player";
import { type Character, Flow, Label, Speaker } from "./parts";
import { RepeatBadge } from "./rule-examples";

type Repeat = { who: Character; line: string; times: number; meaning: string };

// What each repeated line tells the reader (textbook question 4, p. 26).
const REPEATS: readonly Repeat[] = [
  {
    who: "prince",
    line: "“Cảm hoá” nghĩa là gì?",
    times: 3,
    meaning: "rất muốn biết",
  },
  {
    who: "fox",
    line: "Tất nhiên rồi",
    times: 2,
    meaning: "chấp nhận buồn vì bạn",
  },
  {
    who: "prince",
    line: "… lặp lại, để cho nhớ",
    times: 3,
    meaning: "ghi nhớ lời cáo",
  },
];

function RepeatRow({ who, line, times, meaning }: Repeat) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border-2 border-border bg-surface px-3 py-2">
      <span className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-body font-semibold">{line}</span>
        <RepeatBadge times={times} />
      </span>
      <span className="flex flex-wrap items-center gap-2">
        <Flow />
        <Speaker who={who} />
        <Label className="text-foreground">{meaning}</Label>
      </span>
    </div>
  );
}

function PendingRow() {
  return (
    <div className="flex h-22 items-center justify-center rounded-xl border-2 border-dashed border-border font-heading text-block">
      ?
    </div>
  );
}

export default function LapLaiTacDung() {
  return (
    <StepPlayer steps={REPEATS.length} label="Mỗi lời lặp lại cho biết điều gì">
      {(step) => (
        <div className="flex w-full max-w-md flex-col gap-2">
          {REPEATS.map((repeat, i) => (
            <Reveal
              key={repeat.line}
              shown={step >= i}
              placeholder={<PendingRow />}
            >
              <RepeatRow {...repeat} />
            </Reveal>
          ))}
        </div>
      )}
    </StepPlayer>
  );
}
