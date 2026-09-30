"use client";

import type { ReactNode } from "react";
import { ConceptMark } from "@/visuals/shared/concept-mark";
import { Reveal } from "@/visuals/shared/reveal";
import { StepPlayer } from "@/visuals/shared/step-player";
import {
  Chip,
  Element,
  Figure,
  LabelledChip,
  ListLine,
  Pending,
  SetBox,
  SetName,
  Sign,
  Tag,
} from "./set-parts";

// Figures of the two ways a set is written that start from its elements:
// listing them, and checking whether something belongs.

const BUILD_LINE =
  "flex flex-wrap items-baseline justify-center gap-x-2 font-heading text-title font-bold md:text-title-lg";

type BuildPiece = {
  id: string;
  shownAt: number;
  piece: ReactNode;
  pending: ReactNode;
  // Starts with ";", which sits right after the previous element.
  joined?: boolean;
};

const BUILD_PIECES: readonly BuildPiece[] = [
  {
    id: "name",
    shownAt: 0,
    piece: (
      <span>
        <SetName>A</SetName> =
      </span>
    ),
    pending: <span>A =</span>,
  },
  {
    id: "open",
    shownAt: 0,
    piece: <span>{"{"}</span>,
    pending: <span>{"{"}</span>,
  },
  {
    id: "first",
    shownAt: 1,
    piece: <Element>2</Element>,
    pending: <span>?</span>,
  },
  {
    id: "second",
    shownAt: 2,
    piece: (
      <span>
        ; <Element>4</Element>
      </span>
    ),
    pending: <span>; ?</span>,
    joined: true,
  },
  {
    id: "third",
    shownAt: 3,
    piece: (
      <span>
        ; <Element>6</Element>
      </span>
    ),
    pending: <span>; ?</span>,
    joined: true,
  },
  {
    id: "close",
    shownAt: 4,
    piece: <span>{"}"}</span>,
    pending: <span>?</span>,
  },
];

const BUILD_LEGEND: readonly { shownAt: number; name: string }[] = [
  { shownAt: 0, name: "mở ngoặc nhọn" },
  { shownAt: 2, name: "dấu chấm phẩy" },
  { shownAt: 4, name: "đóng ngoặc nhọn" },
];

// "A = { 2 ; 4 ; 6 }" written piece by piece; pieces still to come wait as "?".
export function LapGhepLietKe() {
  return (
    <StepPlayer steps={5} label="Viết tập hợp A bằng cách liệt kê từng phần tử">
      {(step) => (
        <div className="flex w-full flex-col items-center gap-4">
          <div className={BUILD_LINE}>
            {BUILD_PIECES.map(({ id, shownAt, piece, pending, joined }) => (
              <Reveal
                key={id}
                shown={step >= shownAt}
                placeholder={pending}
                className={joined ? "-ml-2" : ""}
              >
                {piece}
              </Reveal>
            ))}
          </div>
          <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            {BUILD_LEGEND.map(({ shownAt, name }) => (
              <li key={name}>
                <Reveal shown={step >= shownAt}>
                  <span className="text-caption font-semibold">{name}</span>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      )}
    </StepPlayer>
  );
}

function LetterTile({
  letter,
  faded = false,
}: {
  letter: string;
  faded?: boolean;
}) {
  return (
    <span
      className={`inline-flex size-12 items-center justify-center rounded-lg border-2 border-muted-foreground bg-surface font-heading text-title font-bold text-concept-amber ${
        faded ? "line-through opacity-40" : ""
      }`}
    >
      {letter}
    </span>
  );
}

// The letters of SA PA, then the set of different letters: A is written once.
export function ViDuLietKe() {
  return (
    <Figure label="Từ SA PA có các chữ S, A, P, A; tập hợp các chữ là S, A, P, chữ A chỉ viết một lần">
      <p className="text-caption font-semibold">Các chữ cái trong từ SA PA</p>
      <div className="flex gap-2">
        <LetterTile letter="S" />
        <LetterTile letter="A" />
        <LetterTile letter="P" />
        <LetterTile letter="A" faded />
      </div>
      <ListLine elements={["S", "A", "P"]} />
      <Tag color="amber">A chỉ viết một lần</Tag>
    </Figure>
  );
}

export function TheLietKe() {
  return (
    <Figure label="Tập hợp K gồm các phần tử 1, 7, 8 viết trong dấu ngoặc nhọn">
      <ListLine name="K" elements={[1, 7, 8]} />
      <ul className="flex flex-col gap-1 text-caption font-semibold">
        <li>
          <span className="font-heading text-block font-bold">{"{ }"}</span> bao
          ngoài
        </li>
        <li>
          <span className="font-heading text-block font-bold">;</span> ngăn cách
        </li>
        <li>
          <Tag color="amber">mỗi phần tử một lần</Tag>
        </li>
      </ul>
    </Figure>
  );
}

const ROW_LINE = "font-heading text-block font-bold md:text-block-lg";

function Verdict({
  value,
  digits,
  inside,
}: {
  value: number;
  digits: string;
  inside: boolean;
}) {
  return (
    <p className={ROW_LINE}>
      <Element>{value}</Element>: {digits},{" "}
      <span className="whitespace-nowrap">
        <Element>{value}</Element> <Sign inside={inside} /> <SetName>Q</SetName>
      </span>
    </p>
  );
}

const VERDICTS = [
  { value: 27, digits: "hai chữ số", inside: true },
  { value: 6, digits: "một chữ số", inside: false },
  { value: 130, digits: "ba chữ số", inside: false },
] as const;

// Testing numbers against "Q: số có hai chữ số", one row per step.
export function XetMau() {
  return (
    <StepPlayer steps={4} label="Xét từng số có thuộc tập hợp Q không">
      {(step) => (
        <div className="flex w-full flex-col items-center gap-3">
          <p className="flex items-center gap-2 rounded-xl border-2 border-concept-teal px-3 py-1 font-heading text-block font-bold md:text-block-lg">
            <ConceptMark color="teal" className="size-5" />
            <span>
              <SetName>Q</SetName>: số có hai chữ số
            </span>
          </p>
          {VERDICTS.map((row, i) => (
            <Reveal
              key={row.value}
              shown={step >= i + 1}
              placeholder={
                <p className={ROW_LINE}>
                  <Element>{row.value}</Element>: <Pending>?</Pending>
                </p>
              }
            >
              <Verdict {...row} />
            </Reveal>
          ))}
        </div>
      )}
    </StepPlayer>
  );
}

function MembershipSign({
  value,
  name,
  inside,
}: {
  value: number;
  name: string;
  inside: boolean;
}) {
  return (
    <span className="font-heading text-block font-bold md:text-block-lg">
      <Element>{value}</Element> <Sign inside={inside} />{" "}
      <SetName>{name}</SetName>
    </span>
  );
}

// A set as a teal box of amber chips: one chip inside is marked "∈", and a
// chip left outside the box "∉".
function MembershipFigure({
  name,
  elements,
  inside,
  outside,
}: {
  name: string;
  elements: readonly number[];
  inside: number;
  outside: number;
}) {
  return (
    <Figure
      label={`Tập hợp ${name} gồm ${elements.join(", ")}: ${inside} thuộc ${name}, ${outside} không thuộc ${name}`}
    >
      <SetBox name={name}>
        {elements.map((value) =>
          value === inside ? (
            <LabelledChip
              key={value}
              chip={<Chip emphasis>{value}</Chip>}
              label={<MembershipSign value={value} name={name} inside />}
            />
          ) : (
            <Chip key={value}>{value}</Chip>
          ),
        )}
      </SetBox>
      <LabelledChip
        chip={<Chip>{outside}</Chip>}
        label={<MembershipSign value={outside} name={name} inside={false} />}
      />
    </Figure>
  );
}

export function XetViDu() {
  return (
    <MembershipFigure name="P" elements={[2, 4, 6, 8]} inside={4} outside={5} />
  );
}

export function TheXetThuoc() {
  return (
    <MembershipFigure name="A" elements={[1, 3, 5]} inside={3} outside={4} />
  );
}

const RESULT_LINE = "font-heading text-title font-bold md:text-title-lg";

// One chip of the set singled out over three steps: marked inside, then
// written "2 ∈ A" with its reading.
export function ThuocHopBut() {
  return (
    <StepPlayer steps={3} label="Số 2 nằm trong tập hợp A nên 2 thuộc A">
      {(step) => (
        <div className="flex w-full flex-col items-center gap-4">
          <SetBox name="A">
            <Chip>1</Chip>
            <LabelledChip
              chip={<Chip emphasis={step >= 1}>2</Chip>}
              label={
                <Reveal
                  shown={step >= 1}
                  placeholder={<Pending>?</Pending>}
                  className="min-h-6"
                >
                  <span className="text-caption font-semibold">
                    <Element>2</Element> nằm trong <SetName>A</SetName>
                  </span>
                </Reveal>
              }
            />
            <Chip>3</Chip>
          </SetBox>
          <Reveal
            shown={step >= 2}
            placeholder={<p className={RESULT_LINE}>?</p>}
            className="flex min-h-20 flex-col items-center gap-1 text-center"
          >
            <p className={RESULT_LINE}>
              <Element>2</Element> <Sign inside /> <SetName>A</SetName>
            </p>
            <p className="text-body font-semibold">2 thuộc A</p>
          </Reveal>
        </div>
      )}
    </StepPlayer>
  );
}
