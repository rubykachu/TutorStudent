"use client";

import { ArrowDown, BookOpen, Check, Pencil, X } from "lucide-react";
import type { ReactNode } from "react";
import type { ConceptColor } from "@/schema/content";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { ConceptMark } from "@/visuals/shared/concept-mark";
import { DotGrid } from "@/visuals/shared/dot-grid";
import { decorative } from "@/visuals/shared/markers";
import {
  type RegionInteraction,
  RegionProvider,
} from "@/visuals/shared/region";
import { Reveal } from "@/visuals/shared/reveal";
import { StepPlayer } from "@/visuals/shared/step-player";
import { BRACKET_COLORS, ExprSvg } from "./expr-svg";
import { displayText, expressionValue, parseExpression } from "./expression";
import { ExprSteps, type StepsMode, spokenExpression } from "./steps";

// Hand-drawn pictures of the lesson that are not one expression worked out
// step by step. They carry only maths and short labels; every sentence to
// remember is in lesson.json.

const BIG_LINE =
  "font-heading text-title font-bold md:text-title-lg flex flex-wrap items-baseline justify-center gap-x-3";

function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex min-w-0 flex-col items-center gap-2 rounded-2xl border-2 border-border bg-surface p-3 ${className}`}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shopping bill

const BILL_SOURCE = "2·8+5";
// Index of the "+" in "2 · 8 + 5", which the second child does first.
const BILL_PLUS_AT = 3;

function Bill() {
  return (
    <Card className="w-full max-w-md items-stretch gap-1 py-2">
      <p className="flex items-center gap-3 text-body md:text-body-lg">
        <BookOpen aria-hidden className="size-6 shrink-0" />2 vở, mỗi vở 8 nghìn
        đồng
      </p>
      <p className="flex items-center gap-3 text-body md:text-body-lg">
        <Pencil aria-hidden className="size-6 shrink-0" />1 bút, 5 nghìn đồng
      </p>
    </Card>
  );
}

function Child({
  name,
  firstAt,
  verdict,
}: {
  name: string;
  firstAt?: number;
  // Once both totals are on screen: who did it right.
  verdict?: "right" | "wrong";
}) {
  return (
    <Card className="w-full">
      <p className="flex items-center gap-2 font-heading text-block font-bold">
        {verdict === "right" && (
          <Check aria-hidden className="size-5 text-correct" />
        )}
        {verdict === "wrong" && (
          <X aria-hidden className="size-5 text-muted-foreground" />
        )}
        {name}
      </p>
      <ExprSteps
        source={BILL_SOURCE}
        mode="still"
        firstAt={firstAt}
        legend={false}
        unit={0.6}
        tone={verdict === "wrong" ? "wrong" : "normal"}
      />
    </Card>
  );
}

// Two children add up the same bill in different orders and get two totals.
export function HoaDonHaiBan() {
  return (
    <StepPlayer steps={4} label="Hai bạn tính cùng một hoá đơn">
      {(step) => (
        <div className="flex w-full flex-col items-center gap-3">
          <Bill />
          <div className="grid w-full grid-cols-2 gap-2">
            <Reveal
              shown={step >= 1}
              placeholder={<Card className="h-full min-h-24">Nam</Card>}
            >
              <Child name="Nam" verdict={step >= 3 ? "right" : undefined} />
            </Reveal>
            <Reveal
              shown={step >= 2}
              placeholder={<Card className="h-full min-h-24">Lan</Card>}
            >
              <Child
                name="Lan"
                firstAt={BILL_PLUS_AT}
                verdict={step >= 3 ? "wrong" : undefined}
              />
            </Reveal>
          </div>
          <Reveal
            shown={step >= 3}
            placeholder={<p className={BIG_LINE}>? ≠ ?</p>}
          >
            <p className={BIG_LINE}>
              <span>21</span>
              <span>≠</span>
              <span>26</span>
            </p>
          </Reveal>
        </div>
      )}
    </StepPlayer>
  );
}

// ---------------------------------------------------------------------------
// Signs and how to read and write them

const SIGNS = [
  { glyph: "+", name: "Dấu cộng", how: "Hai nét: ngang và dọc" },
  { glyph: "−", name: "Dấu trừ", how: "Một nét ngang" },
  { glyph: "·", name: "Dấu nhân", how: "Một chấm ở giữa hai số" },
  { glyph: ":", name: "Dấu chia", how: "Hai chấm: trên và dưới" },
] as const;

export function BangDau() {
  return (
    <div className="grid w-full max-w-lg grid-cols-2 gap-3">
      {SIGNS.map(({ glyph, name, how }) => (
        <Card key={name}>
          <span
            aria-hidden
            className={`font-heading font-bold leading-none ${glyph === "·" ? "text-[5rem]" : "text-[4rem]"}`}
          >
            {glyph}
          </span>
          <span className="font-heading text-block font-bold">{name}</span>
          <span className="text-center text-caption">{how}</span>
        </Card>
      ))}
    </div>
  );
}

const SPOKEN = ["hai", "nhân", "tám", "cộng", "năm"] as const;
const SPOKEN_SOURCE = "2·8+5";

// An expression with how it is read aloud, piece by piece, left to right.
export function DocBieuThuc() {
  const tokens = parseExpression(SPOKEN_SOURCE);
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <ExprSvg tokens={tokens} label={spokenExpression(tokens)} unit={1.1} />
      <ul className="flex flex-wrap justify-center gap-2">
        {SPOKEN.map((word) => (
          <li
            key={word}
            className="min-w-16 rounded-lg bg-muted px-3 py-1 text-center font-semibold text-body md:text-body-lg"
          >
            {word}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Multiplication and division refresher

export function NhanChiaOn() {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <DotGrid
        rows={6}
        columns={7}
        color="slate"
        label="6 hàng, mỗi hàng 7 chấm"
        className="h-auto w-full max-w-48"
      />
      <ul className="flex flex-col items-center gap-1 font-heading text-block font-bold md:text-block-lg">
        <li>6 · 7 = 42</li>
        <li>42 : 6 = 7</li>
        <li>42 : 7 = 6</li>
      </ul>
    </div>
  );
}

function Hole() {
  return (
    <span className="inline-block min-w-12 rounded-md border-2 border-muted-foreground border-dashed px-2 text-center text-muted-foreground">
      ?
    </span>
  );
}

// Rows of a worked calculation; in a "hint" the last row shown keeps a box
// where its result would be. `answerRow` is the last row of a full example.
function Rows({ rows, hint }: { rows: readonly ReactNode[]; hint: boolean }) {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      {rows.map((row, i) => (
        <p
          // biome-ignore lint/suspicious/noArrayIndexKey: rows never reorder
          key={i}
          className={`${BIG_LINE} ${!hint && i === rows.length - 1 ? "rounded-lg bg-highlight px-4 py-1" : ""}`}
        >
          {row}
        </p>
      ))}
    </div>
  );
}

export type WorkedMode = "still" | "hint";

// Dividing as a question about multiplying: what times the divisor is the
// dividend? `divisor · quotient = dividend` for an exact division.
export function ChiaHoiNguoc({
  dividend,
  divisor,
  mode,
}: {
  dividend: number;
  divisor: number;
  mode: WorkedMode;
}) {
  const quotient = dividend / divisor;
  const hint = mode === "hint";
  const rows: ReactNode[] = [
    <>
      {dividend} : {divisor} = <Hole />
    </>,
    <>
      {divisor} · <Hole /> = {dividend}
    </>,
    ...(hint
      ? []
      : [
          <>
            {divisor} · {quotient} = {dividend}
          </>,
          <>
            {dividend} : {divisor} = {quotient}
          </>,
        ]),
  ];
  return <Rows rows={rows} hint={hint} />;
}

// A two-digit number times one digit, worked a digit at a time.
export function NhanHaiChuSo({
  factor,
  digit,
  mode,
}: {
  factor: number;
  digit: number;
  mode: WorkedMode;
}) {
  const tens = Math.floor(factor / 10) * 10;
  const units = factor % 10;
  const hint = mode === "hint";
  const rows: ReactNode[] = [
    <>
      {factor} · {digit} = <Hole />
    </>,
    `${factor} = ${tens} + ${units}`,
    `${tens} · ${digit} = ${tens * digit}`,
    hint ? (
      <>
        {units} · {digit} = <Hole />
      </>
    ) : (
      `${units} · ${digit} = ${units * digit}`
    ),
    ...(hint ? [] : [`${tens * digit} + ${units * digit} = ${factor * digit}`]),
  ];
  return <Rows rows={rows} hint={hint} />;
}

// Three neighbouring products of one factor, the last one the question:
// 7 · 6, 7 · 7, then 7 · 8.
export function BangNhanDong({
  factor,
  last,
  mode,
}: {
  factor: number;
  last: number;
  mode: WorkedMode;
}) {
  const hint = mode === "hint";
  const rows: ReactNode[] = [last - 2, last - 1, last].map((k) =>
    hint && k === last ? (
      <>
        {factor} · {k} = <Hole />
      </>
    ) : (
      `${factor} · ${k} = ${factor * k}`
    ),
  );
  return <Rows rows={rows} hint={hint} />;
}

// Finding the unknown in `coef · x + add = right side`: work the right side
// first, then undo the addition and the multiplication.
export function TimSoChuaBiet({
  coef,
  add,
  rhs,
  mode,
}: {
  coef: number;
  add: number;
  rhs: string;
  mode: StepsMode;
}) {
  const total = expressionValue(rhs);
  const product = total - add;
  const hint = mode === "hint";
  return (
    <div className="flex w-full flex-col items-center gap-2">
      <p className={BIG_LINE}>
        <span className="italic">
          {coef}x + {add} = {displayText(parseExpression(rhs))}
        </span>
      </p>
      {parseExpression(rhs).length > 1 && (
        <ExprSteps
          source={rhs}
          mode={hint ? "hint" : "still"}
          legend={false}
          unit={0.56}
        />
      )}
      {!hint && (
        <Rows
          hint={false}
          rows={[
            <span key="a" className="italic">
              {coef}x + {add} = {total}
            </span>,
            <span key="b" className="italic">
              {coef}x = {total} − {add} = {product}
            </span>,
            <span key="c" className="italic">
              x = {product} : {coef} = {product / coef}
            </span>,
          ]}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Order of operations

export const RUNGS = {
  ngoac: { name: "Trong ngoặc", signs: "( ) [ ] { }" },
  mu: { name: "Luỹ thừa", signs: "2³" },
  nhanChia: { name: "Nhân, chia", signs: "· :", note: "Từ trái sang phải" },
  congTru: { name: "Cộng, trừ", signs: "+ −", note: "Từ trái sang phải" },
} as const;
export type RungName = keyof typeof RUNGS;

// The operations an expression can hold, top to bottom in the order they are
// done.
export function BacUuTien({ rungs }: { rungs: readonly RungName[] }) {
  return (
    <ol className="flex w-full max-w-sm flex-col items-stretch gap-1">
      {rungs.map((name, i) => {
        const rung = RUNGS[name];
        return (
          <li key={name} className="flex flex-col items-center gap-1">
            <div className="flex w-full items-center gap-3 rounded-2xl border-2 border-border bg-surface px-3 py-2">
              <span
                aria-hidden
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground font-heading font-bold text-surface"
              >
                {i + 1}
              </span>
              <span className="flex flex-col">
                <span className="font-heading text-block font-bold">
                  {rung.name}
                </span>
                {"note" in rung && (
                  <span className="text-caption">{rung.note}</span>
                )}
              </span>
              <span className="ml-auto font-heading text-block font-bold">
                {rung.signs}
              </span>
            </div>
            {i < rungs.length - 1 && (
              <ArrowDown aria-hidden className="size-6 text-muted-foreground" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

// ---------------------------------------------------------------------------
// Brackets

const BRACKET_CARDS = [
  { open: "(", name: "Ngoặc tròn", how: "Hai nét cong" },
  { open: "[", name: "Ngoặc vuông", how: "Hai nét thẳng có chân" },
  { open: "{", name: "Ngoặc nhọn", how: "Hai nét có mũi ở giữa" },
] as const;
const CLOSING = { "(": ")", "[": "]", "{": "}" } as const;

function BracketLegend() {
  return (
    <ul className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-caption">
      {BRACKET_CARDS.map(({ open, name }) => (
        <li key={name} className="flex items-center gap-2">
          <ConceptMark color={BRACKET_COLORS[open]} className="size-4" />
          {name} {open} {CLOSING[open]}
        </li>
      ))}
    </ul>
  );
}

// The three kinds of bracket, each in its colour, with how to write it.
export function BangNgoac() {
  return (
    <div className="grid w-full max-w-xl grid-cols-3 gap-3">
      {BRACKET_CARDS.map(({ open, name, how }) => {
        const color: ConceptColor = BRACKET_COLORS[open];
        return (
          <Card
            key={name}
            className={`border-3 ${CONCEPT_CLASSES[color].border}`}
          >
            <span
              aria-hidden
              className={`font-heading font-bold text-[2.5rem] leading-none ${CONCEPT_CLASSES[color].text}`}
            >
              {open} {CLOSING[open]}
            </span>
            <span className="flex items-center gap-1 text-center font-heading text-body font-bold">
              <ConceptMark color={color} className="size-4" />
              {name}
            </span>
            <span className="text-center text-caption">{how}</span>
          </Card>
        );
      })}
    </div>
  );
}

// Brackets inside brackets drawn as boxes inside boxes.
export function HopLongNhau({ source }: { source: string }) {
  const tokens = parseExpression(source);
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <ExprSvg tokens={tokens} label={spokenExpression(tokens)} unit={0.9} />
      <BracketLegend />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Same expression, two orders

export function SoSanhThuTu({
  source,
  wrongAt,
  wrongSource,
  leftLabel,
  wrongLabel,
  wrongTone,
}: {
  source: string;
  // Token index of the operation done first against the rules; or
  wrongAt?: number;
  // a different expression to set beside the first one.
  wrongSource?: string;
  leftLabel: string;
  wrongLabel: string;
  // "wrong" marks the second column as a mistake (grey, with a cross); with
  // "normal" both columns are right and only differ in the expression.
  wrongTone: "wrong" | "normal";
}) {
  const mistake = wrongTone === "wrong";
  return (
    <div className="grid w-full grid-cols-[minmax(0,1fr)] gap-2 sm:grid-cols-2">
      <Card>
        <p className="flex items-center gap-2 font-heading text-block font-bold">
          <Check aria-hidden className="size-5 text-correct" />
          {leftLabel}
        </p>
        <ExprSteps source={source} mode="still" legend={false} unit={0.55} />
      </Card>
      <Card>
        <p className="flex items-center gap-2 font-heading text-block font-bold">
          {mistake ? (
            <X aria-hidden className="size-5 text-muted-foreground" />
          ) : (
            <Check aria-hidden className="size-5 text-correct" />
          )}
          {wrongLabel}
        </p>
        <ExprSteps
          source={wrongSource ?? source}
          mode="still"
          firstAt={wrongAt}
          legend={false}
          unit={0.55}
          tone={wrongTone}
        />
      </Card>
    </div>
  );
}

// A letter expression with the number each letter stands for, then the
// number expression worked out. `display` is the short way it is written,
// `expanded` spells out the hidden multiplications.
export function ThayChu({
  display,
  expanded,
  values,
  source,
  mode,
}: {
  display: string;
  expanded?: string;
  values: readonly (readonly [string, number])[];
  source: string;
  mode: StepsMode;
}) {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="flex flex-col items-center gap-1 font-heading text-title font-bold md:text-title-lg">
        <p className="italic">{display}</p>
        {expanded && <p className="italic">{expanded}</p>}
        <p className="flex flex-wrap justify-center gap-x-4 text-block md:text-block-lg">
          {values.map(([letter, value]) => (
            <span key={letter}>
              <i>{letter}</i> = {value}
            </span>
          ))}
        </p>
      </div>
      <ExprSteps source={source} mode={mode} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// How to answer by tapping

const NOOP = () => {};
const PICKED: RegionInteraction = {
  selected: new Set(["op1"]),
  revealed: new Set(),
  marks: new Map(),
  disabled: true,
  onToggle: NOOP,
};

// What a tap answer looks like: the chosen sign wears the dark ring.
export function HuongDanChamPhepTinh() {
  const tokens = parseExpression("9-4+3");
  return (
    <div className="flex w-full flex-col items-center gap-2">
      <RegionProvider value={PICKED}>
        <ExprSvg
          tokens={tokens}
          label="Phép trừ đang được chọn"
          tappable
          unit={0.9}
        />
      </RegionProvider>
      <p className="text-caption">Vòng đen: phép tính bạn chọn</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sticker

export function Sticker() {
  return (
    <svg
      role="img"
      aria-label="Ba bậc thang và ngôi sao"
      viewBox="0 0 100 100"
      className="h-auto w-full max-w-32"
    >
      <g {...decorative}>
        <circle cx={50} cy={50} r={48} className="fill-highlight" />
        <rect
          x={16}
          y={62}
          width={22}
          height={18}
          className="fill-foreground/70"
        />
        <rect
          x={38}
          y={50}
          width={22}
          height={30}
          className="fill-foreground/80"
        />
        <rect
          x={60}
          y={38}
          width={22}
          height={42}
          className="fill-foreground"
        />
        <polygon
          points="71,14 74.5,24 85,24 76.5,30 79.5,40 71,34 62.5,40 65.5,30 57,24 67.5,24"
          className="fill-concept-amber stroke-surface"
          strokeWidth={1.5}
        />
      </g>
      {["1", "2", "3"].map((n, i) => (
        <text
          key={n}
          x={27 + i * 22}
          y={76}
          textAnchor="middle"
          fontSize={12}
          className="fill-surface font-heading font-bold"
        >
          {n}
        </text>
      ))}
    </svg>
  );
}
