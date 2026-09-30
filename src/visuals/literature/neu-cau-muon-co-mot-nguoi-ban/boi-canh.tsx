"use client";

import { Flower2, Globe, TreeDeciduous } from "lucide-react";
import type { ReactNode } from "react";
import { Reveal } from "@/visuals/shared/reveal";
import { StepPlayer } from "@/visuals/shared/step-player";
import { Fox, Label, Prince } from "./parts";

const ROSES = 6;

type Scene = { picture: ReactNode; label: string };

// What happened right before the fox appears (the textbook's note on the
// word "xuất hiện"): one rose at home, a whole garden on Earth, the prince
// crying on the grass, then the fox.
const SCENES: readonly Scene[] = [
  {
    picture: (
      <span className="flex items-end gap-1">
        <Globe aria-hidden className="size-10 text-concept-amber" />
        <Flower2 aria-hidden className="size-7 text-concept-pink" />
      </span>
    ),
    label: "Ở nhà: một bông hồng",
  },
  {
    picture: (
      <span className="grid grid-cols-3 gap-0.5">
        {Array.from({ length: ROSES }, (_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: identical roses
          <Flower2 key={i} aria-hidden className="size-5 text-concept-pink" />
        ))}
      </span>
    ),
    label: "Trái Đất: cả vườn hồng",
  },
  {
    picture: <Prince mood="sad" className="size-12" />,
    label: "Hoàng tử bé buồn, khóc",
  },
  {
    picture: (
      <span className="flex items-end">
        <TreeDeciduous aria-hidden className="size-10 text-concept-lime" />
        <Fox className="size-10" />
      </span>
    ),
    label: "Cáo xuất hiện",
  },
];

function SceneCard({ picture, label }: Scene) {
  return (
    <div className="flex h-32 flex-col items-center justify-center gap-2 rounded-xl border-2 border-border bg-surface p-2 text-center">
      {picture}
      <Label className="text-foreground">{label}</Label>
    </div>
  );
}

function PendingCard() {
  return (
    <div className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-border font-heading text-title">
      ?
    </div>
  );
}

export default function BoiCanh() {
  return (
    <StepPlayer
      steps={SCENES.length}
      label="Chuyện xảy ra trước khi cáo xuất hiện"
    >
      {(step) => (
        <div className="grid w-full max-w-xl grid-cols-2 gap-3 md:grid-cols-4">
          {SCENES.map((scene, i) => (
            <Reveal
              key={scene.label}
              shown={step >= i}
              placeholder={<PendingCard />}
            >
              <SceneCard {...scene} />
            </Reveal>
          ))}
        </div>
      )}
    </StepPlayer>
  );
}
