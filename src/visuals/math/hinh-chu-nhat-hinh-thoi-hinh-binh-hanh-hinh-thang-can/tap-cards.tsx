"use client";

import { useState } from "react";
import type { ConceptColor } from "@/schema/content";
import type { VisualProps, VisualState } from "@/visuals/registry";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { ConceptMark } from "@/visuals/shared/concept-mark";
import { DoneLine, ShownLine } from "@/visuals/shared/guided-feedback";
import { useGuidedTask } from "@/visuals/shared/guided-step";
import { stateSet } from "@/visuals/shared/markers";
import { Figure } from "@/visuals/shared/plane/figure";
import type { FigureSpec } from "@/visuals/shared/plane/figure-spec";
import { Scene, type SceneKind } from "./scene";

// Cards the child taps one by one ("chạm để xem"): a tapped card shows the
// name of its shape and, when it has them, what the shape is known for. State
// is one key per card, { i0, i1, … }, with 1 = seen. It serves lesson
// screens: "Tiếp" waits until every card is seen, or until "Xem cách làm"
// shows them all.

export type TapCardItem = {
  name: string;
  color: ConceptColor;
  art: { scene: SceneKind } | { figure: FigureSpec };
  // Short lines shown under the name once the card is tapped.
  facts?: readonly string[];
};

export type TapCardsSpec = {
  label: string;
  items: readonly TapCardItem[];
  // The word in the progress line: "Đã xem 2/4".
  verb: string;
  // Closing line once every card is seen.
  done: string;
};

const CARD =
  "flex min-h-touch w-full flex-col items-center gap-1 rounded-xl border-2 bg-surface p-2 text-center motion-safe:transition-transform motion-safe:active:scale-97";

function allSeen(total: number): VisualState {
  return Object.fromEntries(
    Array.from({ length: total }, (_, i) => [`i${i}`, 1]),
  );
}

export function TapCards({
  spec,
  onStateChange,
  shownState,
  disabled = false,
}: VisualProps & { spec: TapCardsSpec }) {
  const [own, setOwn] = useState<VisualState>({});
  const [shown, setShown] = useState(false);
  const total = spec.items.length;
  const seenAt = (i: number) =>
    (shownState ?? (shown ? allSeen(total) : own))[`i${i}`] === 1;
  const count = spec.items.filter((_, i) => seenAt(i)).length;
  const finished = count === total;
  const locked = disabled || shownState !== undefined;

  function tap(index: number) {
    const next = { ...own, [`i${index}`]: 1 };
    setOwn(next);
    onStateChange?.(next);
  }
  function show() {
    setShown(true);
    onStateChange?.(allSeen(total));
  }
  useGuidedTask(finished, show);

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <ul className="grid w-full max-w-md grid-cols-2 gap-2">
        {spec.items.map((item, i) => {
          const seen = seenAt(i);
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: two cards may carry the same name
            <li key={i} className="flex min-w-0">
              <button
                type="button"
                className={`${CARD} ${seen ? CONCEPT_CLASSES[item.color].border : "border-border"}`}
                disabled={locked || seen}
                aria-pressed={seen}
                aria-label={seen ? item.name : "Chạm để xem tên hình"}
                onClick={() => tap(i)}
                {...stateSet(`i${i}`, 1)}
              >
                <div className="w-full max-w-36">
                  {"scene" in item.art ? (
                    <Scene kind={item.art.scene} />
                  ) : (
                    <Figure spec={item.art.figure} />
                  )}
                </div>
                {seen ? (
                  <>
                    <span className="flex items-center gap-2 font-heading text-block font-semibold">
                      <ConceptMark color={item.color} className="size-5" />
                      {item.name}
                    </span>
                    {item.facts?.map((fact) => (
                      <span key={fact} className="text-caption">
                        {fact}
                      </span>
                    ))}
                  </>
                ) : (
                  <span className="font-heading text-block font-semibold text-muted-foreground">
                    ?
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
      <p
        className="text-center text-caption text-muted-foreground"
        aria-live="polite"
      >
        {`Đã ${spec.verb} ${count}/${total}`}
      </p>
      {finished && !shown && shownState === undefined && (
        <DoneLine>{spec.done}</DoneLine>
      )}
      {finished && (shown || shownState !== undefined) && (
        <ShownLine>{spec.done}</ShownLine>
      )}
    </div>
  );
}
