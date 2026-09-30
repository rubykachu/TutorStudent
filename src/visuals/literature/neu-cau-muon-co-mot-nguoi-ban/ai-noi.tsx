"use client";

import { useState } from "react";
import type { ConceptColor } from "@/schema/content";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import {
  CHARACTERS,
  type Character,
  DIALOGUE_COLOR,
  Face,
  Speaker,
} from "./parts";

// Lines of the first meeting, quoted without the narrator's words so the
// child works out who speaks; each hides its speaker until tapped.
const LINES: readonly { text: string; who: Character }[] = [
  { text: "Mình ở đây, dưới cây táo…", who: "fox" },
  { text: "Bạn là ai?", who: "prince" },
  { text: "Mình là cáo.", who: "fox" },
  { text: "Lại đây chơi với mình đi.", who: "prince" },
  { text: "Mình chưa được cảm hoá.", who: "fox" },
];

function borderOf(color: ConceptColor | undefined): string {
  return color
    ? CONCEPT_CLASSES[color].border
    : CONCEPT_CLASSES[DIALOGUE_COLOR].border;
}

function countBy(who: Character): number {
  return LINES.filter((line) => line.who === who).length;
}

// "Who is speaking?": every speech bubble is a button that turns over to show
// the fox or the prince. The instruction and purpose sit in the lesson's
// group note; this picture only counts progress and closes with a summary.
export default function AiNoi() {
  const [shown, setShown] = useState<readonly number[]>([]);
  const done = shown.length === LINES.length;
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <p
        className={`rounded-xl px-3 py-2 text-body font-semibold ${done ? "bg-muted" : ""}`}
        aria-live="polite"
      >
        {done
          ? `Đã xem đủ ${LINES.length} lời thoại: cáo nói ${countBy("fox")} câu, hoàng tử bé nói ${countBy("prince")} câu.`
          : `Đã xem ${shown.length}/${LINES.length}`}
      </p>
      <ul className="flex flex-col gap-2">
        {LINES.map((line, i) => {
          const open = shown.includes(i);
          const color = open ? CHARACTERS[line.who].color : undefined;
          return (
            <li key={line.text}>
              <button
                type="button"
                aria-pressed={open}
                onClick={() =>
                  setShown((list) => (list.includes(i) ? list : [...list, i]))
                }
                className={`flex min-h-touch w-full items-center gap-3 rounded-xl border-2 bg-surface px-3 py-1 text-left motion-safe:transition-transform motion-safe:active:scale-97 ${borderOf(color)}`}
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted font-heading text-block">
                  {open ? <Face who={line.who} className="size-10" /> : "?"}
                </span>
                <span className="flex flex-col">
                  <span className="text-body">“{line.text}”</span>
                  {open ? (
                    <Speaker who={line.who} />
                  ) : (
                    <span className="text-caption text-muted-foreground">
                      Chạm để xem ai nói
                    </span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
