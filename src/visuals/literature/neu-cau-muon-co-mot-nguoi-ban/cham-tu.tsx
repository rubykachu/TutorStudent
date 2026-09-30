"use client";

import { useState } from "react";
import type { ConceptColor } from "@/schema/content";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { ConceptMark } from "@/visuals/shared/concept-mark";
import { COMPOUND_COLOR, REDUPLICATIVE_COLOR } from "./parts";

type Kind = "ghep" | "lay";

const KINDS: Readonly<Record<Kind, { name: string; color: ConceptColor }>> = {
  ghep: { name: "Từ ghép", color: COMPOUND_COLOR },
  lay: { name: "Từ láy", color: REDUPLICATIVE_COLOR },
};

// Words outside the exercises, so tapping them never gives an answer away.
const WORDS: readonly { word: string; kind: Kind }[] = [
  { word: "bí mật", kind: "ghep" },
  { word: "xinh xắn", kind: "lay" },
  { word: "mặt trời", kind: "ghep" },
  { word: "nhỏ nhắn", kind: "lay" },
  { word: "tiếng nhạc", kind: "ghep" },
  { word: "long lanh", kind: "lay" },
];

// Tap a word to turn it over and see whether it is compound or reduplicative.
export default function ChamTu() {
  const [open, setOpen] = useState<readonly string[]>([]);
  return (
    <ul className="grid w-full max-w-md grid-cols-2 gap-3">
      {WORDS.map(({ word, kind }) => {
        const shown = open.includes(word);
        const { name, color } = KINDS[kind];
        return (
          <li key={word}>
            <button
              type="button"
              aria-pressed={shown}
              onClick={() =>
                setOpen((list) =>
                  list.includes(word) ? list : [...list, word],
                )
              }
              className={`flex min-h-18 w-full flex-col items-center justify-center gap-1 rounded-xl border-2 bg-surface px-2 py-2 motion-safe:transition-transform motion-safe:active:scale-97 ${shown ? CONCEPT_CLASSES[color].border : "border-border"}`}
            >
              <span className="font-heading text-block">{word}</span>
              <span
                className={`flex items-center gap-1 text-caption font-semibold ${shown ? CONCEPT_CLASSES[color].text : "text-muted-foreground"}`}
              >
                {shown ? (
                  <>
                    <ConceptMark color={color} className="size-4" />
                    {name}
                  </>
                ) : (
                  "?"
                )}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
