"use client";

import { Footprints, Music, Wheat } from "lucide-react";
import { type ReactNode, useState } from "react";
import { ACTION_BUTTON } from "@/visuals/shared/action-button";
import { ConceptMark } from "@/visuals/shared/concept-mark";
import { stateSet } from "@/visuals/shared/markers";
import { Flow, Fox, Label, Prince, TAMING_COLOR } from "./parts";

type Stage = "before" | "after";

type Row = {
  cause: { icon: ReactNode; label: string };
  before: { picture: ReactNode; label: string };
  after: { picture: ReactNode; label: string };
};

// How the fox's life would change once tamed (its speech on p. 22–23): the
// prince's footsteps and the wheat field, before and after.
const ROWS: readonly Row[] = [
  {
    cause: {
      icon: <Footprints aria-hidden className="size-8 text-concept-amber" />,
      label: "Tiếng bước chân",
    },
    before: {
      picture: <Fox mood="sad" className="size-10" />,
      label: "trốn vào lòng đất",
    },
    after: {
      picture: (
        <span className="flex items-center">
          <Fox mood="happy" className="size-10" />
          <Music aria-hidden className="size-6 text-concept-sky" />
        </span>
      ),
      label: "ra khỏi hang, như tiếng nhạc",
    },
  },
  {
    cause: {
      icon: <Wheat aria-hidden className="size-8 text-concept-amber" />,
      label: "Đồng lúa mì",
    },
    before: {
      picture: <Fox mood="sad" className="size-10" />,
      label: "chẳng gợi nhớ gì, buồn",
    },
    after: {
      picture: (
        <span className="flex items-center">
          <Fox mood="happy" className="size-10" />
          <Prince mood="happy" className="size-10" />
        </span>
      ),
      label: "nhớ mái tóc vàng của bạn",
    },
  },
];

function Effect({ picture, label }: { picture: ReactNode; label: string }) {
  return (
    <span className="flex min-w-0 flex-1 flex-col items-center gap-1 text-center">
      {picture}
      <Label className="text-foreground">{label}</Label>
    </span>
  );
}

function RowView({ row, stage }: { row: Row; stage: Stage }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border-2 border-border bg-surface p-2">
      <span className="flex w-24 shrink-0 flex-col items-center gap-1 text-center">
        {row.cause.icon}
        <Label className="text-foreground">{row.cause.label}</Label>
      </span>
      <Flow />
      <Effect {...row[stage]} />
    </div>
  );
}

// Both stages side by side, for the recaps.
export function TruocSauTomTat() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-2">
      <div className="grid grid-cols-[6rem_1fr_1fr] items-end gap-2 text-center">
        <span />
        <Label className="font-semibold">Chưa cảm hoá</Label>
        <span
          className={`flex items-center justify-center gap-1 text-caption font-semibold text-concept-lime`}
        >
          <ConceptMark color={TAMING_COLOR} className="size-4" />
          Đã cảm hoá
        </span>
      </div>
      {ROWS.map((row) => (
        <div
          key={row.cause.label}
          className="grid grid-cols-[6rem_1fr_1fr] items-center gap-2 rounded-xl border-2 border-border bg-surface p-2"
        >
          <span className="flex flex-col items-center gap-1 text-center">
            {row.cause.icon}
            <Label className="text-foreground">{row.cause.label}</Label>
          </span>
          <Effect {...row.before} />
          <Effect {...row.after} />
        </div>
      ))}
    </div>
  );
}

const STAGE_VALUE: Readonly<Record<Stage, number>> = { before: 0, after: 1 };

export default function TruocSau() {
  const [stage, setStage] = useState<Stage>("before");
  const toggle = (value: Stage, text: string) => (
    <button
      type="button"
      aria-pressed={stage === value}
      onClick={() => setStage(value)}
      className={`${ACTION_BUTTON} ${stage === value ? "border-primary bg-primary/10" : ""}`}
      {...stateSet("stage", STAGE_VALUE[value])}
    >
      {value === "after" && (
        <ConceptMark color={TAMING_COLOR} className="size-4" />
      )}
      {text}
    </button>
  );
  return (
    <figure
      aria-label="Cuộc sống của cáo trước và sau khi được cảm hoá"
      className="flex w-full max-w-md flex-col items-center gap-3"
    >
      <div className="flex gap-3">
        {toggle("before", "Chưa cảm hoá")}
        {toggle("after", "Đã cảm hoá")}
      </div>
      <div className="flex w-full flex-col gap-2">
        {ROWS.map((row) => (
          <RowView key={row.cause.label} row={row} stage={stage} />
        ))}
      </div>
    </figure>
  );
}
