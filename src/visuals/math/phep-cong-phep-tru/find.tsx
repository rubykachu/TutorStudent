"use client";

import { Check } from "lucide-react";
import type { ConceptColor } from "@/schema/content";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { Reveal } from "@/visuals/shared/reveal";
import { StepPlayer } from "@/visuals/shared/step-player";
import { BAR_FILL, EQUATION_LINE, NamedMark } from "./arrange-parts";
import { formatNumber, type StepsMode } from "./types";

// A part never draws narrower than this share of its bar, so an unknown or
// small number stays readable.
const MIN_SHARE = 0.28;

type BarItem = {
  color: ConceptColor;
  // Short concept name under (or over) the box.
  name: string;
  // Number shown in the box; "?" for the unknown.
  text: string;
  unknown: boolean;
  // Relative length of the box among its siblings.
  value: number;
};

function Box({ item }: { item: BarItem }) {
  const classes = CONCEPT_CLASSES[item.color];
  return (
    <div
      className={`flex min-h-14 w-full items-center justify-center rounded-xl border-2 font-heading text-block font-bold tabular-nums md:text-block-lg ${BAR_FILL[item.color].tint} ${classes.border} ${
        item.unknown ? "border-dashed text-foreground" : classes.text
      }`}
    >
      {item.text}
    </div>
  );
}

function Labelled({
  item,
  nameFirst = false,
}: {
  item: BarItem;
  nameFirst?: boolean;
}) {
  const name = (
    <NamedMark
      color={item.color}
      name={item.name}
      className="flex-wrap justify-center text-center"
    />
  );
  return (
    <div className="flex w-full flex-col items-center gap-1">
      {nameFirst && name}
      <Box item={item} />
      {!nameFirst && name}
    </div>
  );
}

// A whole bar over the parts it is split into, each box as long as its share
// (with a readable minimum).
function SplitBar({
  whole,
  parts,
}: {
  whole: BarItem;
  parts: readonly BarItem[];
}) {
  const sum = parts.reduce((total, p) => total + p.value, 0);
  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <Labelled item={whole} nameFirst />
      <div className="flex w-full gap-1">
        {parts.map((part, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: parts never reorder
            key={i}
            style={{ flex: `${Math.max(part.value, MIN_SHARE * sum)} 1 0%` }}
            className="min-w-0"
          >
            <Labelled item={part} />
          </div>
        ))}
      </div>
    </div>
  );
}

type Token = { text: string; color?: ConceptColor };

// A line of maths whose numbers take their concept colour.
function Tokens({
  tokens,
  className = EQUATION_LINE,
}: {
  tokens: readonly Token[];
  className?: string;
}) {
  return (
    <p className={className}>
      {tokens.map((token, i) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: tokens never reorder
          key={i}
          className={
            token.color ? CONCEPT_CLASSES[token.color].text : undefined
          }
        >
          {token.text}
        </span>
      ))}
    </p>
  );
}

export type FindForm = "add" | "subLeft" | "subRight";

type FindXProps = {
  // add: x + a = t; subLeft: x − a = t; subRight: a − x = t.
  form: FindForm;
  a: number;
  t: number;
  mode: StepsMode;
};

type PlanPart = {
  color: ConceptColor;
  name: string;
  // The number in the box, or undefined for the unknown.
  known: number | undefined;
  size: number;
};

type Plan = {
  x: number;
  xColor: ConceptColor;
  equation: Token[];
  working: Token[];
  // The working line while it is still to come.
  workingHint: string;
  whole: PlanPart;
  parts: PlanPart[];
};

// What each form looks like: the equation, the bar model, the working line,
// and the unknown's value.
function plan({ form, a, t }: Omit<FindXProps, "mode">): Plan {
  const n = formatNumber;
  switch (form) {
    case "add": {
      const x = t - a;
      return {
        x,
        xColor: "blue",
        equation: [
          { text: "x", color: "blue" },
          { text: "+" },
          { text: n(a), color: "blue" },
          { text: "=" },
          { text: n(t), color: "amber" },
        ],
        working: [
          { text: "x =" },
          { text: n(t), color: "amber" },
          { text: "−" },
          { text: n(a), color: "blue" },
        ],
        workingHint: "x = ? − ?",
        whole: { color: "amber", name: "Tổng", known: t, size: t },
        parts: [
          { color: "blue", name: "Số hạng", known: undefined, size: x },
          { color: "blue", name: "Số hạng", known: a, size: a },
        ],
      };
    }
    case "subLeft": {
      const x = t + a;
      return {
        x,
        xColor: "violet",
        equation: [
          { text: "x", color: "violet" },
          { text: "−" },
          { text: n(a), color: "pink" },
          { text: "=" },
          { text: n(t), color: "teal" },
        ],
        working: [
          { text: "x =" },
          { text: n(t), color: "teal" },
          { text: "+" },
          { text: n(a), color: "pink" },
        ],
        workingHint: "x = ? + ?",
        whole: {
          color: "violet",
          name: "Số bị trừ",
          known: undefined,
          size: x,
        },
        parts: [
          { color: "teal", name: "Hiệu", known: t, size: t },
          { color: "pink", name: "Số trừ", known: a, size: a },
        ],
      };
    }
    case "subRight": {
      const x = a - t;
      return {
        x,
        xColor: "pink",
        equation: [
          { text: n(a), color: "violet" },
          { text: "−" },
          { text: "x", color: "pink" },
          { text: "=" },
          { text: n(t), color: "teal" },
        ],
        working: [
          { text: "x =" },
          { text: n(a), color: "violet" },
          { text: "−" },
          { text: n(t), color: "teal" },
        ],
        workingHint: "x = ? − ?",
        whole: { color: "violet", name: "Số bị trừ", known: a, size: a },
        parts: [
          { color: "teal", name: "Hiệu", known: t, size: t },
          { color: "pink", name: "Số trừ", known: undefined, size: x },
        ],
      };
    }
  }
}

const FORM_NAMES: Record<FindForm, string> = {
  add: "x cộng số hạng đã biết bằng tổng",
  subLeft: "x trừ số trừ bằng hiệu",
  subRight: "số bị trừ trừ x bằng hiệu",
};

const WORKING_STEP = 1;
const RESULT_STEP = 2;

// The bar model of a find-the-unknown equation with x drawn as the "?" box.
// Steps: the equation and bar, the working line in numbers, the result. "hint"
// stops after the working line (2 steps) and never shows x; "full" has 3
// steps; "still" shows everything at once.
export function FindX({ form, a, t, mode }: FindXProps) {
  const p = plan({ form, a, t });
  const label = `Tìm x: ${FORM_NAMES[form]}`;

  function bar(showX: boolean) {
    const item = (part: PlanPart, value: number): BarItem => {
      const unknown = part.known === undefined;
      return {
        color: part.color,
        name: part.name,
        unknown: unknown && !showX,
        text:
          part.known !== undefined
            ? formatNumber(part.known)
            : showX
              ? formatNumber(p.x)
              : "?",
        value,
      };
    };
    return (
      <SplitBar
        whole={item(p.whole, p.whole.known ?? p.x)}
        parts={p.parts.map((part) => item(part, part.size))}
      />
    );
  }

  const result = (
    <Tokens
      tokens={[
        { text: "x", color: p.xColor },
        { text: "=" },
        { text: formatNumber(p.x), color: p.xColor },
      ]}
    />
  );

  if (mode === "still") {
    return (
      <figure
        aria-label={label}
        className="flex w-full flex-col items-center gap-3"
      >
        <Tokens tokens={p.equation} />
        {bar(true)}
        <Tokens tokens={p.working} />
        {result}
      </figure>
    );
  }

  const steps = mode === "hint" ? WORKING_STEP + 1 : RESULT_STEP + 1;
  return (
    <StepPlayer steps={steps} label={label}>
      {(step) => (
        <div className="flex w-full flex-col items-center gap-4">
          <Tokens tokens={p.equation} />
          {bar(mode === "full" && step >= RESULT_STEP)}
          <Reveal
            shown={step >= WORKING_STEP}
            placeholder={<p className={EQUATION_LINE}>{p.workingHint}</p>}
          >
            <Tokens tokens={p.working} />
          </Reveal>
          <Reveal
            shown={mode === "full" && step >= RESULT_STEP}
            placeholder={<p className={EQUATION_LINE}>x = ?</p>}
          >
            {result}
          </Reveal>
        </div>
      )}
    </StepPlayer>
  );
}

const FAMILY_LINE =
  "flex flex-wrap items-center justify-center gap-x-2 font-heading text-block font-bold md:text-block-lg";
const ADDITION_STEP = 1;
const SUBTRACTION_STEP = 2;

type FactFamilyProps = {
  total: number;
  p1: number;
  p2: number;
  mode: StepsMode;
  // "sum": the parts are addends of the total (default). "difference": the
  // total is a minuend, p1 the subtrahend and p2 the difference.
  names?: "sum" | "difference";
};

type Role = { color: ConceptColor; name: string };

const FAMILY_ROLES: Record<
  "sum" | "difference",
  { whole: Role; p1: Role; p2: Role }
> = {
  sum: {
    whole: { color: "amber", name: "Tổng" },
    p1: { color: "blue", name: "Số hạng" },
    p2: { color: "blue", name: "Số hạng" },
  },
  difference: {
    whole: { color: "violet", name: "Số bị trừ" },
    p1: { color: "pink", name: "Số trừ" },
    p2: { color: "teal", name: "Hiệu" },
  },
};

// A total split into two parts, and the four equations that family gives:
// two additions, two subtractions. 3 steps (the bar, the additions, the
// subtractions); "hint" leaves the result of the last subtraction as "?".
export function FactFamily({
  total,
  p1,
  p2,
  mode,
  names = "sum",
}: FactFamilyProps) {
  const n = formatNumber;
  const roles = FAMILY_ROLES[names];
  const label = `Bốn phép tính của ${n(p1)}, ${n(p2)} và ${n(total)}`;
  const part = (value: number, role: Role): Token => ({
    text: n(value),
    color: role.color,
  });
  const additions: Token[][] = [
    [part(p1, roles.p1), part(p2, roles.p2)],
    [part(p2, roles.p2), part(p1, roles.p1)],
  ].map(([x, y]) => [
    x as Token,
    { text: "+" },
    y as Token,
    { text: "=" },
    part(total, roles.whole),
  ]);
  // The subtractions always read: whole in violet, the part taken away in
  // pink, what is left in teal.
  const subtract = (taken: number, rest: number, hidden: boolean): Token[] => [
    { text: n(total), color: "violet" },
    { text: "−" },
    { text: n(taken), color: "pink" },
    { text: "=" },
    hidden ? { text: "?" } : { text: n(rest), color: "teal" },
  ];
  const subtractions = [
    subtract(p1, p2, false),
    subtract(p2, p1, mode === "hint"),
  ];

  const bar = (
    <SplitBar
      whole={{
        ...roles.whole,
        text: n(total),
        unknown: false,
        value: total,
      }}
      parts={[
        { ...roles.p1, text: n(p1), unknown: false, value: p1 },
        { ...roles.p2, text: n(p2), unknown: false, value: p2 },
      ]}
    />
  );
  const lines = (rows: Token[][]) => (
    <div className="flex flex-col items-center gap-1">
      {rows.map((tokens, i) => (
        <Tokens
          // biome-ignore lint/suspicious/noArrayIndexKey: rows never reorder
          key={i}
          tokens={tokens}
          className={FAMILY_LINE}
        />
      ))}
    </div>
  );

  if (mode === "still") {
    return (
      <figure
        aria-label={label}
        className="flex w-full flex-col items-center gap-4"
      >
        {bar}
        {lines(additions)}
        {lines(subtractions)}
      </figure>
    );
  }

  return (
    <StepPlayer steps={SUBTRACTION_STEP + 1} label={label}>
      {(step) => (
        <div className="flex w-full flex-col items-center gap-4">
          {bar}
          <Reveal
            shown={step >= ADDITION_STEP}
            placeholder={lines([
              [{ text: "? + ? = ?" }],
              [{ text: "? + ? = ?" }],
            ])}
          >
            {lines(additions)}
          </Reveal>
          <Reveal
            shown={step >= SUBTRACTION_STEP}
            placeholder={lines([
              [{ text: "? − ? = ?" }],
              [{ text: "? − ? = ?" }],
            ])}
          >
            {lines(subtractions)}
          </Reveal>
        </div>
      )}
    </StepPlayer>
  );
}

const CHECK_STEP = 1;
const CHECK_RESULT_STEP = 2;

type CheckBySumProps = {
  // a − b = c, with a >= b.
  a: number;
  b: number;
  mode: StepsMode;
};

// Checking a subtraction by adding back: "a − b = c", then "c + b = a" with a
// tick. 3 steps (the subtraction, the check line, its result with the tick);
// "hint" leaves the final "a" as "?" and shows no tick, "still" shows it all.
export function CheckBySum({ a, b, mode }: CheckBySumProps) {
  const n = formatNumber;
  const c = a - b;
  const label = `Thử lại phép trừ ${n(a)} − ${n(b)} = ${n(c)} bằng phép cộng`;
  const subtraction: Token[] = [
    { text: n(a), color: "violet" },
    { text: "−" },
    { text: n(b), color: "pink" },
    { text: "=" },
    { text: n(c), color: "teal" },
  ];
  const check = (hidden: boolean): Token[] => [
    { text: n(c), color: "teal" },
    { text: "+" },
    { text: n(b), color: "pink" },
    { text: "=" },
    hidden ? { text: "?" } : { text: n(a), color: "violet" },
  ];
  const legend = (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
      <NamedMark color="violet" name="Số bị trừ" />
      <NamedMark color="pink" name="Số trừ" />
      <NamedMark color="teal" name="Hiệu" />
    </div>
  );
  const tick = (
    <span className="inline-flex items-center text-correct">
      <Check aria-hidden className="size-7" strokeWidth={3} />
      <span className="sr-only">Đúng</span>
    </span>
  );
  const checkLine = (hidden: boolean) => (
    <div className="flex items-center justify-center gap-2">
      <Tokens tokens={check(hidden)} />
      {hidden ? <span aria-hidden className="size-7" /> : tick}
    </div>
  );

  if (mode === "still") {
    return (
      <figure
        aria-label={label}
        className="flex w-full flex-col items-center gap-3"
      >
        <Tokens tokens={subtraction} />
        {checkLine(false)}
        {legend}
      </figure>
    );
  }

  return (
    <StepPlayer steps={CHECK_RESULT_STEP + 1} label={label}>
      {(step) => (
        <div className="flex w-full flex-col items-center gap-4">
          <Tokens tokens={subtraction} />
          <Reveal
            shown={step >= CHECK_STEP}
            placeholder={<p className={EQUATION_LINE}>? + ? = ?</p>}
          >
            {checkLine(mode === "hint" || step < CHECK_RESULT_STEP)}
          </Reveal>
          {legend}
        </div>
      )}
    </StepPlayer>
  );
}
