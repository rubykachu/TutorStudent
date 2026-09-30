import type { ReactNode } from "react";
import { formatInteger } from "@/lib/number-format";
import type { ConceptColor } from "@/schema/content";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { decorative } from "@/visuals/shared/markers";
import { Region, RegionSvg } from "@/visuals/shared/region";
import {
  type Bracket,
  CLOSER,
  operationIndices,
  type Token,
} from "./expression";

// One line of an expression drawn as an SVG, the single renderer for every
// visual of the lesson: numbers, signs and powers sit on one baseline, each
// bracket pair is a box around what it holds (so ( ) inside [ ] inside { }
// reads as boxes inside boxes), the operation being done is ringed in pink
// and the result of the previous step is amber and underlined.

// Colours of the brackets and of the highlighted parts: the concepts the
// lesson declares (ngoặc tròn, ngoặc vuông, ngoặc nhọn, phép tính làm trước,
// kết quả).
export const BRACKET_COLORS: Readonly<Record<Bracket, ConceptColor>> = {
  "(": "teal",
  "[": "sky",
  "{": "lime",
};
export const NEXT_OPERATION_COLOR: ConceptColor = "pink";
export const RESULT_COLOR: ConceptColor = "amber";

const FS = 48;
const DIGIT_W = FS * 0.6;
const EXPONENT_FS = FS * 0.62;
const SIGN_W = FS * 1.05;
const BRACKET_W = FS * 0.42;
const BOX_PAD = 9;
const BUBBLE_R = 30;
const BUBBLE_W = BUBBLE_R * 2 + 12;
// Height from the baseline centre to the top of a number, plus room.
const HALF_H = FS * 0.78;

// Pixels per drawing unit, so every line of a visual has the same text size
// and only shrinks when it would not fit its column.
const DEFAULT_UNIT = 0.75;

type Node =
  | { kind: "leaf"; index: number; token: Token }
  | {
      kind: "group";
      bracket: Bracket;
      children: Node[];
    };

function toTree(tokens: readonly Token[]): Node[] {
  const root: Node[] = [];
  const stack: { bracket: Bracket; children: Node[] }[] = [];
  tokens.forEach((token, index) => {
    const target = stack.at(-1)?.children ?? root;
    if (token.kind === "open") {
      stack.push({ bracket: token.bracket, children: [] });
    } else if (token.kind === "close") {
      const group = stack.pop();
      if (group) {
        (stack.at(-1)?.children ?? root).push({ kind: "group", ...group });
      }
    } else {
      target.push({ kind: "leaf", index, token });
    }
  });
  return root;
}

function depthOf(nodes: readonly Node[]): number {
  return Math.max(
    0,
    ...nodes.map((n) => (n.kind === "group" ? 1 + depthOf(n.children) : 0)),
  );
}

const SIGN_NAMES = {
  "+": "Phép cộng",
  "-": "Phép trừ",
  "·": "Phép nhân",
  ":": "Phép chia",
} as const;
const SIGN_GLYPHS = { "+": "+", "-": "−", "·": "·", ":": ":" } as const;

export type Emphasis = {
  // Token index range of the operation to do next.
  start: number;
  end: number;
};

type ExprSvgProps = {
  tokens: readonly Token[];
  label: string;
  // The operation to do next, ringed in pink.
  next?: Emphasis;
  // Token of the previous step's result.
  resultIndex?: number;
  // Operations become tappable regions `op1`, `op2`, … from left to right.
  tappable?: boolean;
  unit?: number;
  className?: string;
};

type Placed = { under: ReactNode[]; over: ReactNode[]; width: number };

export function ExprSvg({
  tokens,
  label,
  next,
  resultIndex,
  tappable = false,
  unit = DEFAULT_UNIT,
  className = "",
}: ExprSvgProps) {
  const tree = toTree(tokens);
  const levels = depthOf(tree);
  const opNumber = new Map(
    operationIndices(tokens).map((index, n) => [index, n + 1]),
  );
  const half = HALF_H + levels * BOX_PAD + 4;
  const cy = half;

  function place(nodes: readonly Node[], x0: number): Placed {
    const under: ReactNode[] = [];
    const over: ReactNode[] = [];
    let x = x0;
    let ringFrom: number | undefined;
    let ringTo = 0;
    for (const node of nodes) {
      if (node.kind === "group") {
        const level = depthOf(node.children) + 1;
        const color = CONCEPT_CLASSES[BRACKET_COLORS[node.bracket]];
        const inner = place(node.children, x + BOX_PAD + BRACKET_W);
        const width = BOX_PAD * 2 + BRACKET_W * 2 + inner.width;
        const boxHalf = HALF_H + level * BOX_PAD;
        under.push(
          <rect
            key={`box-${x}`}
            {...decorative}
            x={x}
            y={cy - boxHalf}
            width={width}
            height={boxHalf * 2}
            rx={16}
            className={`fill-transparent ${color.stroke}`}
            strokeWidth={3}
          />,
          ...inner.under,
        );
        over.push(
          <text
            key={`open-${x}`}
            x={x + BOX_PAD + BRACKET_W / 2}
            y={cy}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={FS}
            className={`${color.fill} font-heading font-bold`}
          >
            {node.bracket}
          </text>,
          ...inner.over,
          <text
            key={`close-${x}`}
            x={x + width - BOX_PAD - BRACKET_W / 2}
            y={cy}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={FS}
            className={`${color.fill} font-heading font-bold`}
          >
            {CLOSER[node.bracket]}
          </text>,
        );
        x += width;
        continue;
      }
      const { index, token } = node;
      const inRing =
        next !== undefined && index >= next.start && index <= next.end;
      if (inRing && ringFrom === undefined) ringFrom = x;
      const piece = leaf(index, token, x);
      under.push(...piece.under);
      over.push(...piece.over);
      x += piece.width;
      if (inRing) ringTo = x;
      const following = nodes[nodes.indexOf(node) + 1];
      const ringEnds =
        ringFrom !== undefined &&
        (following === undefined ||
          following.kind === "group" ||
          following.index > (next?.end ?? 0));
      if (ringEnds && ringFrom !== undefined) {
        under.push(
          <rect
            key={`ring-${ringFrom}`}
            {...decorative}
            x={ringFrom - 2}
            y={cy - HALF_H + 2}
            width={ringTo - ringFrom + 4}
            height={HALF_H * 2 - 4}
            rx={14}
            className={`${CONCEPT_CLASSES[NEXT_OPERATION_COLOR].stroke} fill-concept-pink/15`}
            strokeWidth={4}
          />,
        );
        ringFrom = undefined;
      }
    }
    return { under, over, width: x - x0 };
  }

  function leaf(
    index: number,
    token: Token,
    x: number,
  ): { under: ReactNode[]; over: ReactNode[]; width: number } {
    const isResult = index === resultIndex;
    const digitClass = isResult
      ? `${CONCEPT_CLASSES[RESULT_COLOR].fill} font-heading font-bold`
      : "fill-foreground font-heading font-bold";
    const mark = (w: number) =>
      isResult ? (
        <rect
          key={`result-${index}`}
          {...decorative}
          x={x + 3}
          y={cy + FS * 0.46}
          width={w - 6}
          height={5}
          rx={2.5}
          className={CONCEPT_CLASSES[RESULT_COLOR].fill}
        />
      ) : null;
    if (token.kind === "num") {
      const text = formatInteger(token.value);
      const w = text.length * DIGIT_W + 8;
      return {
        under: [],
        over: [
          <text
            key={`t-${index}`}
            x={x + w / 2}
            y={cy}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={FS}
            className={digitClass}
          >
            {text}
          </text>,
          mark(w),
        ],
        width: w,
      };
    }
    if (token.kind === "pow") {
      const baseW = String(token.base).length * DIGIT_W;
      const expW = String(token.exponent).length * EXPONENT_FS * 0.6;
      const w = baseW + expW + 12;
      const body = (
        <g key={`pow-${index}`}>
          <text
            x={x + 4 + baseW / 2}
            y={cy}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={FS}
            stroke="none"
            className={digitClass}
          >
            {token.base}
          </text>
          <text
            x={x + 6 + baseW + expW / 2}
            y={cy - FS * 0.4}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={EXPONENT_FS}
            stroke="none"
            className={digitClass}
          >
            {token.exponent}
          </text>
        </g>
      );
      const n = opNumber.get(index);
      if (tappable && n !== undefined) {
        return {
          under: [],
          over: [
            <Region key={`op-${index}`} id={`op${n}`} label="Luỹ thừa">
              <rect
                {...decorative}
                x={x - 2}
                y={cy - HALF_H}
                width={w + 4}
                height={HALF_H * 2}
                rx={14}
                className="fill-muted"
              />
              {body}
            </Region>,
          ],
          width: w + 8,
        };
      }
      return { under: [], over: [body, mark(w)], width: w };
    }
    if (token.kind === "op") {
      const glyph = SIGN_GLYPHS[token.op];
      const size = token.op === "·" ? FS * 1.25 : FS;
      const n = opNumber.get(index);
      if (tappable && n !== undefined) {
        return {
          under: [],
          over: [
            <Region
              key={`op-${index}`}
              id={`op${n}`}
              label={SIGN_NAMES[token.op]}
            >
              <circle
                {...decorative}
                cx={x + BUBBLE_W / 2}
                cy={cy}
                r={BUBBLE_R}
                className="fill-muted"
              />
              <text
                x={x + BUBBLE_W / 2}
                y={cy}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={size}
                stroke="none"
                className="fill-foreground font-heading font-bold"
              >
                {glyph}
              </text>
            </Region>,
          ],
          width: BUBBLE_W,
        };
      }
      return {
        under: [],
        over: [
          <text
            key={`t-${index}`}
            x={x + SIGN_W / 2}
            y={cy}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={size}
            className="fill-foreground font-heading font-bold"
          >
            {glyph}
          </text>,
        ],
        width: SIGN_W,
      };
    }
    return { under: [], over: [], width: 0 };
  }

  const { under, over, width } = place(tree, 6);
  const total = width + 12;
  return (
    <div className={`max-w-full ${className}`} style={{ width: total * unit }}>
      <RegionSvg
        label={label}
        viewBox={`0 0 ${total} ${half * 2}`}
        className="h-auto w-full"
      >
        {under}
        {over}
      </RegionSvg>
    </div>
  );
}
