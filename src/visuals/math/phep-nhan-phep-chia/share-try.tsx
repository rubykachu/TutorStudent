"use client";

import { RotateCcw } from "lucide-react";
import { useState } from "react";
import type { VisualProps } from "@/visuals/registry";
import { ACTION_BUTTON } from "@/visuals/shared/action-button";
import { DivisionEquation, Sentence } from "./chia-parts";
import { remainderCaption, roundCaption } from "./share-logic";
import { SharePicture } from "./share-picture";

// Hands-on dealing: each press of "Chia một vòng" gives every plate one item,
// until fewer items are left than plates; what remains is the remainder.
export default function ShareTry({
  total,
  people,
  onStateChange,
}: { total: number; people: number } & Pick<VisualProps, "onStateChange">) {
  const [rounds, setRounds] = useState(0);
  const left = total - rounds * people;
  const canDeal = left >= people;

  function deal() {
    if (!canDeal) return;
    setRounds(rounds + 1);
    onStateChange?.({ rounds: rounds + 1 });
  }

  function restart() {
    setRounds(0);
    onStateChange?.({ rounds: 0 });
  }

  let message: string;
  if (!canDeal) message = remainderCaption(left, people);
  else if (rounds === 0) {
    message = `Có ${total} cái, chia cho ${people} bạn. Chạm "Chia một vòng": mỗi bạn nhận 1 cái.`;
  } else message = roundCaption(rounds, left, 1);

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <SharePicture
        people={people}
        perPlate={rounds}
        pool={left}
        apart={!canDeal && left > 0}
        poolCapacity={total}
        label={`Chia ${total} cái cho ${people} bạn: mỗi bạn ${rounds} cái, ${!canDeal ? "dư" : "còn"} ${left} cái`}
      />
      <Sentence>{message}</Sentence>
      <p className="text-caption" aria-live="polite">
        Đã chia {rounds} vòng
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {canDeal && (
          <button
            type="button"
            onClick={deal}
            className={`${ACTION_BUTTON} px-4`}
          >
            Chia một vòng
          </button>
        )}
        <button
          type="button"
          onClick={restart}
          disabled={rounds === 0}
          className={`${ACTION_BUTTON} px-4`}
        >
          <RotateCcw aria-hidden className="size-5" />
          Chia lại
        </button>
      </div>
      {!canDeal && (
        <DivisionEquation
          dividend={total}
          divisor={people}
          quotient={rounds}
          remainder={left}
          withRemainder={left > 0}
        />
      )}
    </div>
  );
}
