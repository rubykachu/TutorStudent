"use client";

import type { ConceptColor } from "@/schema/content";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { ConceptShape } from "@/visuals/shared/concept-mark";
import { decorative } from "@/visuals/shared/markers";
import type { SpecOf } from "./catalog";
import { fmt, TIMES } from "./logic-nhan";

type Spec = SpecOf<"tags">;

const WIDTH = 490;
const NUMBER_SIZE = 44;
const LABEL_SIZE = 25;
const NUMBER_Y = 56;
const ARROW_TOP = 74;
const ARROW_BOTTOM = 112;
const MARK_Y = 128;
const LABEL_Y = 166;
const BLOCK_HEIGHT = 210;
const LABEL_LINE = 34;
// Labels longer than this break before their last word.
const LABEL_BREAK_CHARS = 8;
const SECOND_LINE_SIZE = 36;
const SECOND_LINE_GAP = 50;

type Token = {
  text: string;
  x: number;
  // A number tied to a concept: coloured, with an arrow from its label.
  tag?: { color: ConceptColor; label: string };
};

const MUL_DIV_X = [85, 165, 245, 325, 405] as const;
const REM_X = [54, 116, 180, 248, 314, 390, 455] as const;

// a · b = c, where both factors are "Thừa số" and c is "Tích".
function mulTokens(a: number, b: number, c: number): Token[] {
  const [x0, x1, x2, x3, x4] = MUL_DIV_X;
  return [
    { text: fmt(a), x: x0, tag: { color: "blue", label: "Thừa số" } },
    { text: TIMES, x: x1 },
    { text: fmt(b), x: x2, tag: { color: "blue", label: "Thừa số" } },
    { text: "=", x: x3 },
    { text: fmt(c), x: x4, tag: { color: "amber", label: "Tích" } },
  ];
}

// a : b = c.
function divTokens(a: number, b: number, c: number): Token[] {
  const [x0, x1, x2, x3, x4] = MUL_DIV_X;
  return [
    { text: fmt(a), x: x0, tag: { color: "blue", label: "Số bị chia" } },
    { text: ":", x: x1 },
    { text: fmt(b), x: x2, tag: { color: "violet", label: "Số chia" } },
    { text: "=", x: x3 },
    { text: fmt(c), x: x4, tag: { color: "amber", label: "Thương" } },
  ];
}

// a : b = q dư r.
function remTokens(a: number, b: number, q: number, r: number): Token[] {
  const [x0, x1, x2, x3, x4, x5, x6] = REM_X;
  return [
    { text: fmt(a), x: x0, tag: { color: "blue", label: "Số bị chia" } },
    { text: ":", x: x1 },
    { text: fmt(b), x: x2, tag: { color: "violet", label: "Số chia" } },
    { text: "=", x: x3 },
    { text: fmt(q), x: x4, tag: { color: "amber", label: "Thương" } },
    { text: "dư", x: x5 },
    { text: fmt(r), x: x6, tag: { color: "pink", label: "Số dư" } },
  ];
}

function labelLines(label: string): string[] {
  const cut = label.lastIndexOf(" ");
  if (label.length <= LABEL_BREAK_CHARS || cut < 0) return [label];
  return [label.slice(0, cut), label.slice(cut + 1)];
}

// One equation with an arrow from each tagged number down to the shape and
// name of the concept it stands for.
function EquationRow({ tokens, top }: { tokens: Token[]; top: number }) {
  return (
    <g>
      {tokens.map(({ text, x, tag }) => (
        <g key={`${x}-${text}`}>
          <text
            x={x}
            y={top + NUMBER_Y}
            textAnchor="middle"
            fontSize={NUMBER_SIZE}
            className={`font-heading font-bold ${tag ? CONCEPT_CLASSES[tag.color].fill : "fill-foreground"}`}
          >
            {text}
          </text>
          {tag && (
            <>
              <line
                {...decorative}
                x1={x}
                x2={x}
                y1={top + ARROW_BOTTOM}
                y2={top + ARROW_TOP + 6}
                className="stroke-muted-foreground"
                strokeWidth={3}
              />
              <polygon
                {...decorative}
                points={`${x},${top + ARROW_TOP} ${x - 7},${top + ARROW_TOP + 12} ${x + 7},${top + ARROW_TOP + 12}`}
                className="fill-muted-foreground"
              />
              <ConceptShape color={tag.color} cx={x} cy={top + MARK_Y} r={11} />
              <text
                x={x}
                y={top + LABEL_Y}
                textAnchor="middle"
                fontSize={LABEL_SIZE}
                className="fill-foreground font-semibold"
              >
                {labelLines(tag.label).map((line, i) => (
                  <tspan key={line} x={x} dy={i === 0 ? 0 : LABEL_LINE}>
                    {line}
                  </tspan>
                ))}
              </text>
            </>
          )}
        </g>
      ))}
    </g>
  );
}

// "38 = 7 · 5 + 3" in the same colours as the equation above it.
function CheckLine({
  a,
  b,
  q,
  r,
  y,
}: {
  a: number;
  b: number;
  q: number;
  r: number;
  y: number;
}) {
  const pieces = [
    { text: fmt(a), color: "blue" },
    { text: " = " },
    { text: fmt(b), color: "violet" },
    { text: ` ${TIMES} ` },
    { text: fmt(q), color: "amber" },
    { text: " + " },
    { text: fmt(r), color: "pink" },
  ] as const;
  return (
    <text
      x={WIDTH / 2}
      y={y}
      textAnchor="middle"
      fontSize={SECOND_LINE_SIZE}
      className="fill-foreground font-heading font-bold whitespace-pre"
    >
      {pieces.map((piece) => (
        <tspan
          key={piece.text}
          className={"color" in piece ? CONCEPT_CLASSES[piece.color].fill : ""}
        >
          {piece.text}
        </tspan>
      ))}
    </text>
  );
}

function describe(spec: Spec): string {
  const { a, b } = spec;
  switch (spec.form) {
    case "mul":
      return `${a} nhân ${b} bằng ${a * b}: ${a} và ${b} là thừa số, ${a * b} là tích`;
    case "div":
      return `${a} chia ${b} bằng ${a / b}: ${a} là số bị chia, ${b} là số chia, ${a / b} là thương`;
    case "divRem":
      return `${a} chia ${b} được thương ${Math.floor(a / b)}, số dư ${a % b}`;
    case "both":
      return `${a} nhân ${b} bằng ${a * b}, và ${a * b} chia ${a} bằng ${b}`;
  }
}

export function Tags({ spec }: { spec: Spec }) {
  const { a, b } = spec;
  const label = describe(spec);
  switch (spec.form) {
    case "mul":
      return (
        <svg
          role="img"
          aria-label={label}
          viewBox={`0 0 ${WIDTH} ${BLOCK_HEIGHT}`}
          className="h-auto w-full max-w-md"
        >
          <EquationRow tokens={mulTokens(a, b, a * b)} top={0} />
        </svg>
      );
    case "div":
      return (
        <svg
          role="img"
          aria-label={label}
          viewBox={`0 0 ${WIDTH} ${BLOCK_HEIGHT}`}
          className="h-auto w-full max-w-md"
        >
          <EquationRow tokens={divTokens(a, b, a / b)} top={0} />
        </svg>
      );
    case "divRem": {
      const q = Math.floor(a / b);
      const r = a % b;
      return (
        <svg
          role="img"
          aria-label={label}
          viewBox={`0 0 ${WIDTH} ${BLOCK_HEIGHT + SECOND_LINE_GAP}`}
          className="h-auto w-full max-w-md"
        >
          <EquationRow tokens={remTokens(a, b, q, r)} top={0} />
          <CheckLine
            a={a}
            b={b}
            q={q}
            r={r}
            y={BLOCK_HEIGHT + SECOND_LINE_GAP - 6}
          />
        </svg>
      );
    }
    case "both":
      return (
        <svg
          role="img"
          aria-label={label}
          viewBox={`0 0 ${WIDTH} ${BLOCK_HEIGHT * 2 + 10}`}
          className="h-auto w-full max-w-md"
        >
          <EquationRow tokens={mulTokens(a, b, a * b)} top={0} />
          <EquationRow
            tokens={divTokens(a * b, a, b)}
            top={BLOCK_HEIGHT + 10}
          />
        </svg>
      );
  }
}
