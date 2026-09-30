import type { ReactNode } from "react";
import type { ConceptColor } from "@/schema/content";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { ConceptMark, ConceptShape } from "@/visuals/shared/concept-mark";
import { decorative } from "@/visuals/shared/markers";

type Part = { value: number; color: ConceptColor; tag: string };

const FACTOR = "Thừa số";
const PRODUCT = "Tích";
const DIVIDEND = "Số bị chia";
const DIVISOR = "Số chia";
const QUOTIENT = "Thương";

function Column({ part }: { part: Part }) {
  return (
    <span className="flex flex-col items-center">
      <span
        className={`font-heading text-title font-bold ${CONCEPT_CLASSES[part.color].text}`}
      >
        {part.value}
      </span>
      <span className="flex items-center gap-1 text-caption text-muted-foreground">
        <ConceptMark color={part.color} className="size-4" />
        {part.tag}
      </span>
    </span>
  );
}

function Sign({ children }: { children: ReactNode }) {
  return (
    <span className="pt-0.5 font-heading text-title font-bold">{children}</span>
  );
}

function Equation({
  left,
  sign,
  middle,
  result,
}: {
  left: Part;
  sign: string;
  middle: Part;
  result: Part;
}) {
  return (
    <li
      className="flex items-start justify-center gap-1.5"
      aria-label={`${left.value} ${sign === "·" ? "nhân" : "chia"} ${middle.value} bằng ${result.value}`}
    >
      <Column part={left} />
      <Sign>{sign}</Sign>
      <Column part={middle} />
      <Sign>=</Sign>
      <Column part={result} />
    </li>
  );
}

const NODE_R = 27;
const VIEW_W = 240;
const VIEW_H = 140;

function Node({
  color,
  cx,
  cy,
  value,
}: {
  color: ConceptColor;
  cx: number;
  cy: number;
  value: number;
}) {
  return (
    <g>
      <ConceptShape {...decorative} color={color} cx={cx} cy={cy} r={NODE_R} />
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={24}
        fontWeight={700}
        className="fill-surface"
      >
        {value}
      </text>
    </g>
  );
}

// Triangle of a, b and their product c = a · b with the equations they give.
export default function FactFamily({ a, b }: { a: number; b: number }) {
  const c = a * b;
  const factorA: Part = { value: a, color: "blue", tag: FACTOR };
  const factorB: Part = { value: b, color: "blue", tag: FACTOR };
  const product: Part = { value: c, color: "amber", tag: PRODUCT };
  const dividend: Part = { value: c, color: "blue", tag: DIVIDEND };
  const divisorA: Part = { value: a, color: "violet", tag: DIVISOR };
  const divisorB: Part = { value: b, color: "violet", tag: DIVISOR };
  const quotientA: Part = { value: a, color: "amber", tag: QUOTIENT };
  const quotientB: Part = { value: b, color: "amber", tag: QUOTIENT };
  const same = a === b;

  return (
    <figure
      className="flex w-full flex-col items-center gap-3"
      aria-label={`Gia đình phép tính của ${a}, ${b} và ${c}`}
    >
      <svg
        role="img"
        aria-label={`Tam giác: ${a} và ${b} ở đáy, ${c} ở đỉnh`}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="h-auto w-full max-w-60"
      >
        <polygon
          {...decorative}
          points={`${VIEW_W / 2},${NODE_R + 4} ${NODE_R + 6},${VIEW_H - NODE_R - 4} ${VIEW_W - NODE_R - 6},${VIEW_H - NODE_R - 4}`}
          className="fill-muted stroke-muted-foreground"
          strokeWidth={2}
          strokeLinejoin="round"
        />
        <Node color="amber" cx={VIEW_W / 2} cy={NODE_R + 4} value={c} />
        <Node color="blue" cx={NODE_R + 6} cy={VIEW_H - NODE_R - 4} value={a} />
        <Node
          color="blue"
          cx={VIEW_W - NODE_R - 6}
          cy={VIEW_H - NODE_R - 4}
          value={b}
        />
      </svg>
      <ul className="grid w-full grid-cols-1 gap-x-6 gap-y-2 md:grid-cols-2">
        <Equation left={factorA} sign="·" middle={factorB} result={product} />
        {!same && (
          <Equation left={factorB} sign="·" middle={factorA} result={product} />
        )}
        <Equation
          left={dividend}
          sign=":"
          middle={divisorA}
          result={quotientB}
        />
        {!same && (
          <Equation
            left={dividend}
            sign=":"
            middle={divisorB}
            result={quotientA}
          />
        )}
      </ul>
    </figure>
  );
}
