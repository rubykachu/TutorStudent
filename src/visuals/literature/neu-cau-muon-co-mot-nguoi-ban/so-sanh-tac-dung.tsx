"use client";

import { Footprints, Music, Smile } from "lucide-react";
import type { ReactNode } from "react";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { Reveal } from "@/visuals/shared/reveal";
import { StepPlayer } from "@/visuals/shared/step-player";
import { Fox, Label, SIMILE_COLOR } from "./parts";

type Idea = { icon: ReactNode; text: ReactNode; label: string };

// Why the fox compares the prince's footsteps to music: what music is like,
// and so what the footsteps will mean to the fox.
const IDEAS: readonly Idea[] = [
  {
    icon: <Footprints aria-hidden className="size-8 text-concept-amber" />,
    text: "Bước chân của bạn",
    label: "sự vật được so sánh",
  },
  {
    icon: (
      <Music
        aria-hidden
        className={`size-8 ${CONCEPT_CLASSES[SIMILE_COLOR].text}`}
      />
    ),
    text: (
      <>
        <span className={CONCEPT_CLASSES[SIMILE_COLOR].text}>như là</span> tiếng
        nhạc
      </>
    ),
    label: "sự vật dùng để so sánh",
  },
  {
    icon: <Smile aria-hidden className="size-8 text-concept-sky" />,
    text: "Tiếng nhạc vui tai, ai cũng muốn nghe",
    label: "tiếng nhạc gợi điều gì?",
  },
  {
    icon: <Fox mood="happy" className="size-9" />,
    text: "Cáo sẽ vui mừng, háo hức chờ bạn",
    label: "cáo sẽ thấy thế nào?",
  },
];

function IdeaRow({ icon, text, label }: Idea) {
  return (
    <div className="flex items-center gap-3 rounded-xl border-2 border-border bg-surface px-3 py-2">
      <span className="flex w-9 shrink-0 justify-center">{icon}</span>
      <span className="flex flex-col">
        <span className="text-body font-semibold">{text}</span>
        <Label>{label}</Label>
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

function Ideas({ step }: { step: number }) {
  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      {IDEAS.map((idea, i) => (
        <Reveal key={idea.label} shown={step >= i} placeholder={<PendingRow />}>
          <IdeaRow {...idea} />
        </Reveal>
      ))}
    </div>
  );
}

export function SoSanhTacDungTomTat() {
  return <Ideas step={IDEAS.length} />;
}

export default function SoSanhTacDung() {
  return (
    <StepPlayer
      steps={IDEAS.length}
      label="Vì sao cáo ví bước chân của bạn với tiếng nhạc"
    >
      {(step) => <Ideas step={step} />}
    </StepPlayer>
  );
}
