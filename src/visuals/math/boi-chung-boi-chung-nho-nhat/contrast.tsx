"use client";

import type { ConceptColor } from "@/schema/content";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { ConceptMark } from "@/visuals/shared/concept-mark";
import { Reveal } from "@/visuals/shared/reveal";
import { StepPlayer } from "@/visuals/shared/step-player";

// Two kinds of question side by side, one card each: what the story says,
// which tool it asks for and the answer it gives for the same numbers.

export type ContrastCard = {
  color: ConceptColor;
  heading: string;
  story: string;
  tool: string;
  result: string;
};

export type ContrastSpec = {
  label: string;
  cards: readonly [ContrastCard, ContrastCard];
  mode: "steps" | "still";
};

function Card({ card }: { card: ContrastCard }) {
  return (
    <div
      className={`flex h-full flex-col gap-2 rounded-xl border-2 bg-surface p-3 ${CONCEPT_CLASSES[card.color].border}`}
    >
      <p className="flex items-center gap-2 font-heading text-body font-bold">
        <ConceptMark color={card.color} className="size-4" />
        {card.heading}
      </p>
      <p className="text-body">{card.story}</p>
      <p className="font-heading text-body font-bold">{card.tool}</p>
      <p
        className={`font-heading text-block font-bold ${CONCEPT_CLASSES[card.color].text}`}
      >
        {card.result}
      </p>
    </div>
  );
}

export function Contrast({ spec }: { spec: ContrastSpec }) {
  const { cards, mode, label } = spec;
  const draw = (step: number) => (
    <ul className="grid w-full max-w-xl gap-3 md:grid-cols-2">
      {cards.map((card, i) => (
        <li key={card.heading}>
          <Reveal shown={mode === "still" || step >= i} className="h-full">
            <Card card={card} />
          </Reveal>
        </li>
      ))}
    </ul>
  );
  if (mode === "still") {
    return (
      <figure aria-label={label} className="flex w-full justify-center">
        {draw(cards.length)}
      </figure>
    );
  }
  return (
    <StepPlayer steps={cards.length} label={label}>
      {draw}
    </StepPlayer>
  );
}
