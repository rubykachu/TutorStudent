"use client";

import { RotateCcw, Star } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { ACTION_BUTTON } from "@/visuals/shared/action-button";
import { ConceptMark } from "@/visuals/shared/concept-mark";
import { useVisualTransition } from "@/visuals/shared/motion";
import { type Character, Face, Label, TAMING_COLOR } from "./parts";

const CROWD = 8;
// Which face of each crowd becomes the unique one.
const CHOSEN = 5;
const FADED_OPACITY = 0.25;

function Crowd({
  who,
  tamed,
  title,
}: {
  who: Character;
  tamed: boolean;
  title: string;
}) {
  const transition = useVisualTransition();
  return (
    <div className="flex flex-col items-center gap-2">
      <Label className="text-foreground">{title}</Label>
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: CROWD }, (_, i) => {
          const chosen = i === CHOSEN;
          return (
            <motion.span
              // biome-ignore lint/suspicious/noArrayIndexKey: identical faces
              key={i}
              initial={false}
              animate={{
                opacity: tamed && !chosen ? FADED_OPACITY : 1,
                scale: tamed && chosen ? 1.35 : 1,
              }}
              transition={transition}
              className="relative flex"
            >
              <Face
                who={who}
                mood={tamed && chosen ? "happy" : "calm"}
                className="size-9"
              />
              {tamed && chosen && (
                <Star
                  aria-hidden
                  className="absolute -top-2 -right-2 size-4 fill-concept-lime text-concept-lime"
                />
              )}
            </motion.span>
          );
        })}
      </div>
      <Label>{tamed ? "duy nhất trên đời" : "một trong trăm nghìn"}</Label>
    </div>
  );
}

// Before taming, the prince is one boy among a hundred thousand to the fox,
// and the fox one fox among a hundred thousand to him; "Cảm hoá" makes one of
// each stand out.
export default function TramNghin() {
  const [tamed, setTamed] = useState(false);
  return (
    <figure
      aria-label="Trăm nghìn cậu bé, trăm nghìn con cáo, và một người bạn duy nhất"
      className="flex w-full flex-col items-center gap-4"
    >
      <div className="flex flex-wrap justify-center gap-6">
        <Crowd who="prince" tamed={tamed} title="Cáo nhìn các cậu bé" />
        <Crowd who="fox" tamed={tamed} title="Hoàng tử bé nhìn các con cáo" />
      </div>
      <p className="sr-only" aria-live="polite">
        {tamed
          ? "Đã cảm hoá: mỗi bạn là duy nhất với bạn kia."
          : "Chưa cảm hoá."}
      </p>
      {tamed ? (
        <button
          type="button"
          className={ACTION_BUTTON}
          onClick={() => setTamed(false)}
        >
          <RotateCcw aria-hidden className="size-5" />
          Xem lại
        </button>
      ) : (
        <button
          type="button"
          className={ACTION_BUTTON}
          onClick={() => setTamed(true)}
        >
          <ConceptMark color={TAMING_COLOR} className="size-5" />
          Cảm hoá
        </button>
      )}
    </figure>
  );
}
