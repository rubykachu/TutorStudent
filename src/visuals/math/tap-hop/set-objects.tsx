"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { ConceptMark } from "@/visuals/shared/concept-mark";
import { Reveal } from "@/visuals/shared/reveal";
import { StepPlayer } from "@/visuals/shared/step-player";
import {
  CASE_ITEMS,
  Chip,
  Figure,
  ITEM_LABELS,
  ItemIcon,
  LabelledChip,
  Pending,
  SetBox,
  Tag,
} from "./set-parts";

// Figures of everyday sets: the pencil case, a team, the days of the week.

// The open pencil case with its items. `setShown` shows the teal label of the
// whole case; `elementShown(i)` the amber label of item i. With `pending`, a
// label still to come shows as a dim "?" instead of a blank gap.
function PencilCase({
  setShown,
  elementShown,
  pending,
}: {
  setShown: boolean;
  elementShown: (index: number) => boolean;
  pending: boolean;
}) {
  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-1">
      <Reveal
        shown={setShown}
        placeholder={pending ? <Pending /> : undefined}
        className="flex min-h-12 flex-col items-center"
      >
        <Tag color="teal">Tập hợp</Tag>
        <ArrowDown
          aria-hidden
          className={`size-5 ${CONCEPT_CLASSES.teal.text}`}
        />
      </Reveal>
      <div className="flex w-full justify-around rounded-3xl border-4 border-concept-teal bg-muted px-2 py-3">
        {CASE_ITEMS.map((kind, i) => (
          <div key={kind} className="flex flex-col items-center gap-1">
            <ItemIcon kind={kind} />
            <span
              className={`text-caption font-semibold ${CONCEPT_CLASSES.amber.text}`}
            >
              {ITEM_LABELS[kind]}
            </span>
            <Reveal
              shown={elementShown(i)}
              placeholder={pending ? <Pending /> : undefined}
              className="flex min-h-12 flex-col items-center"
            >
              <ArrowUp
                aria-hidden
                className={`size-5 ${CONCEPT_CLASSES.amber.text}`}
              />
              <Tag color="amber">Phần tử</Tag>
            </Reveal>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HopBut() {
  return (
    <StepPlayer
      steps={3}
      label="Hộp bút là một tập hợp, mỗi món đồ là một phần tử"
    >
      {(step) => (
        <PencilCase
          setShown={step >= 1}
          elementShown={() => step >= 2}
          pending
        />
      )}
    </StepPlayer>
  );
}

export function TomTatTapHop() {
  return (
    <Figure label="Hộp bút gồm bút, thước, tẩy: cả hộp là tập hợp, mỗi món là phần tử">
      <PencilCase setShown elementShown={(i) => i === 0} pending={false} />
    </Figure>
  );
}

const DAYS = [
  "thứ Hai",
  "thứ Ba",
  "thứ Tư",
  "thứ Năm",
  "thứ Sáu",
  "thứ Bảy",
  "Chủ nhật",
] as const;
const TEAM = ["Nam", "Mai", "Sơn"] as const;

export function ViDuTapHop() {
  return (
    <Figure label="Ba tập hợp: hộp bút, đội bóng, các ngày trong tuần">
      <SetBox name="hộp bút">
        {CASE_ITEMS.map((kind) => (
          <Chip key={kind}>{ITEM_LABELS[kind]}</Chip>
        ))}
      </SetBox>
      <SetBox name="đội bóng">
        {TEAM.map((name) => (
          <Chip key={name} round>
            {name}
          </Chip>
        ))}
      </SetBox>
      <SetBox name="các ngày trong tuần">
        {DAYS.slice(0, 3).map((day) => (
          <Chip key={day}>{day}</Chip>
        ))}
        <span className="self-center font-heading text-block font-bold text-muted-foreground">
          …
        </span>
      </SetBox>
    </Figure>
  );
}

export function ViDuPhanTu() {
  return (
    <Figure label="Các ngày trong tuần là một tập hợp, mỗi ngày là một phần tử">
      <SetBox name="các ngày trong tuần">
        {DAYS.map((day) => (
          <Chip key={day}>{day}</Chip>
        ))}
      </SetBox>
      <p className="flex items-center gap-2 text-body font-semibold text-concept-amber">
        <ConceptMark color="amber" className="size-5" />
        mỗi thẻ là một phần tử
      </p>
    </Figure>
  );
}

export function TheTapHop() {
  return (
    <Figure label="Đội bóng là một tập hợp">
      <SetBox name="đội bóng">
        {TEAM.map((name) => (
          <Chip key={name} round>
            {name}
          </Chip>
        ))}
      </SetBox>
      <Tag color="teal">tập hợp</Tag>
    </Figure>
  );
}

export function ThePhanTu() {
  return (
    <Figure label="Nam là một phần tử của tập hợp đội bóng">
      <SetBox name="đội bóng">
        {TEAM.map((name, i) =>
          i === 0 ? (
            <LabelledChip
              key={name}
              chip={
                <Chip round emphasis>
                  {name}
                </Chip>
              }
              label={<Tag color="amber">phần tử</Tag>}
            />
          ) : (
            <Chip key={name} round>
              {name}
            </Chip>
          ),
        )}
      </SetBox>
    </Figure>
  );
}
