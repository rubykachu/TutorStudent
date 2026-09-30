"use client";

import { ArrowDownUp } from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import type { ConceptColor } from "@/schema/content";
import {
  formatNumber,
  type Op,
  type StepsMode,
} from "@/visuals/math/phep-cong-phep-tru/types";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { ConceptMark, ConceptShape } from "@/visuals/shared/concept-mark";
import { decorative } from "@/visuals/shared/markers";
import { useVisualTransition } from "@/visuals/shared/motion";
import { Region, RegionSvg } from "@/visuals/shared/region";
import { Reveal } from "@/visuals/shared/reveal";
import { StepPlayer } from "@/visuals/shared/step-player";

// Pieces of the pictures of the addition and subtraction lesson.

// ---------------------------------------------------------------------------
// Roles: the name and colour of every number of an equation, in one place.

type Role = { name: string; color: ConceptColor };

const ROLES: Readonly<
  Record<Op, { first: Role; second: Role; result: Role; symbol: string }>
> = {
  add: {
    first: { name: "Số hạng", color: "blue" },
    second: { name: "Số hạng", color: "blue" },
    result: { name: "Tổng", color: "amber" },
    symbol: "+",
  },
  sub: {
    first: { name: "Số bị trừ", color: "violet" },
    second: { name: "Số trừ", color: "pink" },
    result: { name: "Hiệu", color: "teal" },
    symbol: "−",
  },
};

const PLUS = ROLES.add.symbol;

function resultOf(op: Op, a: number, b: number): number {
  return op === "add" ? a + b : a - b;
}

// "a + b = c" as HTML, every number in its concept colour. `result` may be "?"
// while the picture still keeps the answer back.
function EquationLine({
  op,
  a,
  b,
  result,
}: {
  op: Op;
  a: number;
  b: number;
  result: number | "?";
}) {
  const roles = ROLES[op];
  const number = (role: Role, value: number | "?") => (
    <span
      className={value === "?" ? "" : CONCEPT_CLASSES[role.color].text}
      key={role.name + String(value)}
    >
      {value === "?" ? "?" : formatNumber(value)}
    </span>
  );
  return (
    <p className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 whitespace-nowrap font-heading text-title font-bold md:text-title-lg">
      {number(roles.first, a)}
      <span>{roles.symbol}</span>
      {number(roles.second, b)}
      <span>=</span>
      {number(roles.result, result)}
    </p>
  );
}

// "● Số hạng  ■ Tổng": the legend under a picture that names the parts.
function RoleLegend({ op }: { op: Op }) {
  const roles = ROLES[op];
  const items =
    op === "add"
      ? [roles.first, roles.result]
      : [roles.first, roles.second, roles.result];
  return (
    <ul className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-body md:text-body-lg">
      {items.map((role) => (
        <li key={role.name} className="flex items-center gap-2">
          <ConceptMark color={role.color} className="size-5" />
          {role.name}
        </li>
      ))}
    </ul>
  );
}

// ---------------------------------------------------------------------------
// Equation drawn in SVG, shared by the labelled and the tappable pictures.

const VIEW_W = 340;
// Average width of a bold heading glyph, in em, for sizing text to fit.
const GLYPH_EM = 0.62;

type EquationItem = {
  text: string;
  // Centre and width of the item's box (the text plus its padding).
  cx: number;
  width: number;
};

// Lays "a ∘ b = c" out in one row that fits `maxWidth`, shrinking the font
// (down to `minFs`) when the numbers are long. `pad` widens each number's box
// on both sides; `gap` separates neighbouring boxes.
function layoutEquation(
  texts: readonly [string, string, string, string, string],
  {
    maxWidth,
    maxFs,
    minFs,
    pad,
    gap,
  }: {
    maxWidth: number;
    maxFs: number;
    minFs: number;
    pad: number;
    gap: number;
  },
) {
  const chars = texts.reduce((sum, text) => sum + text.length, 0);
  const fixed = 3 * 2 * pad + 4 * gap;
  const fs = Math.max(
    minFs,
    Math.min(maxFs, Math.floor((maxWidth - fixed) / (chars * GLYPH_EM))),
  );
  let x = 0;
  const items: EquationItem[] = texts.map((text, i) => {
    const isNumber = i % 2 === 0;
    const width = text.length * fs * GLYPH_EM + (isNumber ? 2 * pad : 0);
    const item = { text, cx: x + width / 2, width };
    x += width + gap;
    return item;
  });
  const width = x - gap;
  const left = (VIEW_W - width) / 2;
  return {
    fs,
    width,
    items: items.map((item) => ({ ...item, cx: item.cx + left })),
  };
}

function equationTexts(op: Op, a: number, b: number) {
  return [
    formatNumber(a),
    ROLES[op].symbol,
    formatNumber(b),
    "=",
    formatNumber(resultOf(op, a, b)),
  ] as const;
}

// ---------------------------------------------------------------------------
// EquationLabels

const TAG_FS = 18;
const TAG_H = 34;
const TAG_PAD = 13;
const TAG_MARK_R = 8;
const TAG_GAP = 8;
const ARROW_LEN = 24;
const HEAD = 7;

type Tag = {
  role: Role;
  // Horizontal centre of the number(s) the tag points at.
  targets: number[];
};

function tagWidth(name: string): number {
  return name.length * TAG_FS * 0.56 + 2 * TAG_PAD + 2 * TAG_MARK_R + 6;
}

// Spreads tags left to right so that none overlaps its neighbour, each as
// close to its wanted centre as it can be, and inside the picture.
function placeTags(tags: readonly Tag[]) {
  let right = 2;
  const placed = tags.map((tag) => {
    const width = tagWidth(tag.role.name);
    const wanted =
      tag.targets.reduce((sum, t) => sum + t, 0) / tag.targets.length;
    const cx = Math.max(wanted, right + width / 2);
    right = cx + width / 2 + TAG_GAP;
    return { ...tag, width, cx };
  });
  const overflow = right - TAG_GAP - (VIEW_W - 2);
  return overflow > 0
    ? placed.map((tag) => ({ ...tag, cx: tag.cx - overflow }))
    : placed;
}

function Arrow({
  from,
  to,
  color,
}: {
  from: readonly [number, number];
  to: readonly [number, number];
  color: ConceptColor;
}) {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const back = (side: number) =>
    `${x2 - HEAD * Math.cos(angle - side)},${y2 - HEAD * Math.sin(angle - side)}`;
  const side = Math.PI / 6;
  return (
    <g {...decorative}>
      <line
        x1={x1}
        y1={y1}
        x2={x2 - 2 * Math.cos(angle)}
        y2={y2 - 2 * Math.sin(angle)}
        strokeWidth={2.5}
        strokeLinecap="round"
        className={CONCEPT_CLASSES[color].stroke}
      />
      <polygon
        points={`${x2},${y2} ${back(side)} ${back(-side)}`}
        className={CONCEPT_CLASSES[color].fill}
      />
    </g>
  );
}

function NameTag({
  role,
  cx,
  y,
  width,
}: {
  role: Role;
  cx: number;
  y: number;
  width: number;
}) {
  const left = cx - width / 2;
  return (
    <g>
      <rect
        x={left}
        y={y}
        width={width}
        height={TAG_H}
        rx={TAG_H / 2}
        strokeWidth={2.5}
        className={`fill-surface ${CONCEPT_CLASSES[role.color].stroke}`}
      />
      <ConceptShape
        color={role.color}
        cx={left + TAG_PAD + TAG_MARK_R}
        cy={y + TAG_H / 2}
        r={TAG_MARK_R}
      />
      <text
        x={left + TAG_PAD + 2 * TAG_MARK_R + 6}
        y={y + TAG_H / 2}
        dominantBaseline="central"
        fontSize={TAG_FS}
        className="fill-foreground font-heading font-bold"
      >
        {role.name}
      </text>
    </g>
  );
}

// A worked equation with its parts named, like a textbook diagram: name tags
// point at the numbers, each number and tag in the part's colour and shape.
// Addition names the two addends once, above both; subtraction names the
// minuend above and the subtrahend and difference below.
export function EquationLabels({ op, a, b }: { op: Op; a: number; b: number }) {
  const roles = ROLES[op];
  const texts = equationTexts(op, a, b);
  const { fs, items } = layoutEquation(texts, {
    maxWidth: VIEW_W - 16,
    maxFs: 44,
    minFs: 26,
    pad: 0,
    gap: 14,
  });
  const [first, , second, , result] = items;
  if (!first || !second || !result) return null;

  const above: Tag[] =
    op === "add"
      ? [{ role: roles.first, targets: [first.cx, second.cx] }]
      : [{ role: roles.first, targets: [first.cx] }];
  const below: Tag[] =
    op === "add"
      ? [{ role: roles.result, targets: [result.cx] }]
      : [
          { role: roles.second, targets: [second.cx] },
          { role: roles.result, targets: [result.cx] },
        ];

  const tagTop = 4;
  const cy = tagTop + TAG_H + ARROW_LEN + 6 + fs * 0.55;
  const glyphHalf = fs * 0.55;
  const topTip = cy - glyphHalf;
  const bottomTip = cy + glyphHalf;
  const bottomTagTop = bottomTip + ARROW_LEN;
  const height = bottomTagTop + TAG_H + 4;

  return (
    <svg
      role="img"
      aria-label={`Phép ${op === "add" ? "cộng" : "trừ"} ${formatNumber(a)} ${roles.symbol} ${formatNumber(b)} với tên từng phần`}
      viewBox={`0 0 ${VIEW_W} ${height}`}
      className="h-auto w-full max-w-sm"
    >
      {items.map((item, i) => {
        const role =
          i === 0
            ? roles.first
            : i === 2
              ? roles.second
              : i === 4
                ? roles.result
                : null;
        return (
          <text
            key={`${item.text}-${item.cx}`}
            x={item.cx}
            y={cy}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={fs}
            className={`${role ? CONCEPT_CLASSES[role.color].fill : "fill-foreground"} font-heading font-bold`}
          >
            {item.text}
          </text>
        );
      })}
      {placeTags(above).map((tag) => (
        <g key={`above-${tag.role.name}`}>
          <NameTag role={tag.role} cx={tag.cx} y={tagTop} width={tag.width} />
          {tag.targets.map((target) => (
            <Arrow
              key={target}
              from={[tag.cx + (target - tag.cx) * 0.25, tagTop + TAG_H]}
              to={[target, topTip]}
              color={tag.role.color}
            />
          ))}
        </g>
      ))}
      {placeTags(below).map((tag) => (
        <g key={`below-${tag.role.name}`}>
          <NameTag
            role={tag.role}
            cx={tag.cx}
            y={bottomTagTop}
            width={tag.width}
          />
          {tag.targets.map((target) => (
            <Arrow
              key={target}
              from={[tag.cx + (target - tag.cx) * 0.25, bottomTagTop]}
              to={[target, bottomTip]}
              color={tag.role.color}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// EquationTap

const TAP_BOX_H = 72;
const TAP_PAD = 12;

// The same equation with no names and no concept colours, for "tap the ...":
// the three numbers are the regions "first", "second" and "result" in reading
// order; the operator and equals sign are plain text.
export function EquationTap({ op, a, b }: { op: Op; a: number; b: number }) {
  const texts = equationTexts(op, a, b);
  const { fs, items } = layoutEquation(texts, {
    maxWidth: VIEW_W - 8,
    maxFs: 44,
    minFs: 26,
    pad: TAP_PAD,
    gap: 6,
  });
  const cy = TAP_BOX_H / 2;
  const regions = [
    { id: "first", label: "Số thứ nhất" },
    { id: "second", label: "Số thứ hai" },
    { id: "result", label: "Kết quả" },
  ] as const;
  const [first, sign, second, equals, result] = items;
  if (!first || !sign || !second || !equals || !result) return null;
  const numbers = [first, second, result];

  const plain = (item: EquationItem) => (
    <text
      x={item.cx}
      y={cy}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={fs}
      className="fill-foreground font-heading font-bold"
    >
      {item.text}
    </text>
  );

  return (
    <RegionSvg
      label={`Phép ${op === "add" ? "cộng" : "trừ"} ${formatNumber(a)} ${ROLES[op].symbol} ${formatNumber(b)}`}
      viewBox={`0 0 ${VIEW_W} ${TAP_BOX_H}`}
      className="h-auto w-full max-w-sm"
    >
      {numbers.map((item, i) => {
        const region = regions[i];
        if (!region) return null;
        return (
          <Region
            key={region.id}
            id={region.id}
            label={`${region.label} ${item.text}`}
          >
            <rect
              {...decorative}
              x={item.cx - item.width / 2}
              y={4}
              width={item.width}
              height={TAP_BOX_H - 8}
              rx={14}
              className="fill-muted"
            />
            {plain(item)}
          </Region>
        );
      })}
      {plain(sign)}
      {plain(equals)}
    </RegionSvg>
  );
}

// ---------------------------------------------------------------------------
// BarModel

// Steps of the bar model: the bars, then the brace (or the cut) with the
// result still "?", then the result and the equation line.
const BAR_BRACE_STEP = 1;
const BAR_RESULT_STEP = 2;

// Opacity of a part still to come, as in `Reveal`.
const PENDING_OPACITY = 0.35;

const BAR_PAD = 20;
const BAR_AVAIL = VIEW_W - 2 * BAR_PAD;
const BAR_H = 40;
const BAR_LABEL_FS = 20;
const BAR_LABEL_Y = 18;
const BAR_TOP = 30;
const BRACE_Y = BAR_TOP + BAR_H + 10;
const BRACE_DEPTH = 12;
const SEGMENT_SLACK = 14;

function SvgReveal({
  shown,
  pending = false,
  children,
}: {
  shown: boolean;
  pending?: boolean;
  children: ReactNode;
}) {
  const transition = useVisualTransition();
  return (
    <motion.g
      initial={false}
      animate={{ opacity: shown ? 1 : pending ? PENDING_OPACITY : 0 }}
      transition={transition}
    >
      {children}
    </motion.g>
  );
}

// Widths of two side-by-side segments proportional to `values`, but never
// narrower than their label, filling `total` together.
function segmentWidths(
  values: readonly [number, number],
  labels: readonly [string, string],
  total: number,
): [number, number] {
  const min = labels.map(
    (label) => label.length * BAR_LABEL_FS * GLYPH_EM + SEGMENT_SLACK,
  );
  const sum = values[0] + values[1];
  const raw = values.map((value, i) =>
    Math.max(min[i] ?? 0, (value / sum) * total),
  );
  const scale = total / ((raw[0] ?? 0) + (raw[1] ?? 0));
  return [(raw[0] ?? 0) * scale, (raw[1] ?? 0) * scale];
}

function Brace({ x0, x1, y }: { x0: number; x1: number; y: number }) {
  const mid = (x0 + x1) / 2;
  const r = 7;
  return (
    <path
      d={`M${x0},${y} v${BRACE_DEPTH - r} q0,${r} ${r},${r} H${mid - r} q${r},0 ${r},${r} q0,-${r} ${r},-${r} H${x1 - r} q${r},0 ${r},-${r} v-${BRACE_DEPTH - r}`}
      fill="none"
      strokeWidth={3}
      strokeLinecap="round"
      className={CONCEPT_CLASSES.amber.stroke}
    />
  );
}

function BarLabel({
  x,
  y,
  color,
  children,
  size = BAR_LABEL_FS,
}: {
  x: number;
  y: number;
  color: ConceptColor;
  children: ReactNode;
  size?: number;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={size}
      className={`${CONCEPT_CLASSES[color].fill} font-heading font-bold`}
    >
      {children}
    </text>
  );
}

const RESULT_LABEL_FS = 26;

function AddBars({
  a,
  b,
  step,
  answer,
}: {
  a: number;
  b: number;
  step: number;
  answer: string;
}) {
  const gap = 10;
  const [wa, wb] = segmentWidths(
    [a, b],
    [formatNumber(a), formatNumber(b)],
    BAR_AVAIL - gap,
  );
  const xa = BAR_PAD;
  const xb = BAR_PAD + wa + gap;
  const braceShown = step >= BAR_BRACE_STEP;
  const mid = BAR_PAD + (wa + gap + wb) / 2;
  return (
    <>
      <rect
        x={xa}
        y={BAR_TOP}
        width={wa}
        height={BAR_H}
        rx={6}
        className={CONCEPT_CLASSES.blue.fill}
      />
      <rect
        x={xb}
        y={BAR_TOP}
        width={wb}
        height={BAR_H}
        rx={6}
        className={CONCEPT_CLASSES.blue.fill}
      />
      <BarLabel x={xa + wa / 2} y={BAR_LABEL_Y} color="blue">
        {formatNumber(a)}
      </BarLabel>
      <BarLabel x={xb + wb / 2} y={BAR_LABEL_Y} color="blue">
        {formatNumber(b)}
      </BarLabel>
      <SvgReveal shown={braceShown} pending>
        <Brace x0={xa} x1={xb + wb} y={BRACE_Y} />
        <BarLabel
          x={mid}
          y={BRACE_Y + BRACE_DEPTH + 26}
          color="amber"
          size={RESULT_LABEL_FS}
        >
          {answer}
        </BarLabel>
      </SvgReveal>
    </>
  );
}

function SubBars({
  a,
  b,
  step,
  answer,
}: {
  a: number;
  b: number;
  step: number;
  answer: string;
}) {
  const rest = a - b;
  const [wr, wb] = segmentWidths(
    [rest, b],
    [formatNumber(rest), formatNumber(b)],
    BAR_AVAIL,
  );
  const cutX = BAR_PAD + wr;
  const cutShown = step >= BAR_BRACE_STEP;
  const lowerTop = BRACE_Y;
  const lowerH = 32;
  return (
    <>
      <rect
        x={BAR_PAD}
        y={BAR_TOP}
        width={BAR_AVAIL}
        height={BAR_H}
        rx={6}
        className={CONCEPT_CLASSES.violet.fill}
      />
      <BarLabel x={BAR_PAD + BAR_AVAIL / 2} y={BAR_LABEL_Y} color="violet">
        {formatNumber(a)}
      </BarLabel>
      <rect
        x={cutX}
        y={lowerTop}
        width={wb}
        height={lowerH}
        rx={6}
        className={CONCEPT_CLASSES.pink.fill}
      />
      <BarLabel x={cutX + wb / 2} y={lowerTop + lowerH + 18} color="pink">
        {formatNumber(b)}
      </BarLabel>
      <SvgReveal shown={cutShown}>
        <rect
          x={BAR_PAD}
          y={BAR_TOP}
          width={wr}
          height={BAR_H}
          rx={6}
          className={CONCEPT_CLASSES.teal.fill}
        />
        <rect
          x={cutX}
          y={BAR_TOP}
          width={wb}
          height={BAR_H}
          rx={6}
          className={CONCEPT_CLASSES.pink.fill}
        />
        <line
          x1={cutX + 8}
          y1={BAR_TOP + 8}
          x2={cutX + wb - 8}
          y2={BAR_TOP + BAR_H - 8}
          strokeWidth={4}
          strokeLinecap="round"
          className="stroke-surface"
        />
        <line
          x1={cutX + wb - 8}
          y1={BAR_TOP + 8}
          x2={cutX + 8}
          y2={BAR_TOP + BAR_H - 8}
          strokeWidth={4}
          strokeLinecap="round"
          className="stroke-surface"
        />
      </SvgReveal>
      <SvgReveal shown={cutShown} pending>
        <Brace x0={BAR_PAD} x1={cutX} y={BRACE_Y} />
        <BarLabel
          x={BAR_PAD + wr / 2}
          y={BRACE_Y + BRACE_DEPTH + 26}
          color="teal"
          size={RESULT_LABEL_FS}
        >
          {answer}
        </BarLabel>
      </SvgReveal>
    </>
  );
}

function BarFigure({
  op,
  a,
  b,
  step,
  showAnswer,
  legend,
}: {
  op: Op;
  a: number;
  b: number;
  step: number;
  showAnswer: boolean;
  legend: boolean;
}) {
  const value = resultOf(op, a, b);
  const answerShown = showAnswer && step >= BAR_RESULT_STEP;
  const answer = answerShown ? formatNumber(value) : "?";
  const height = op === "add" ? 136 : 160;
  const Bars = op === "add" ? AddBars : SubBars;
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <svg
        role="img"
        aria-label={`Mô hình thanh của phép ${op === "add" ? "cộng" : "trừ"} ${formatNumber(a)} ${ROLES[op].symbol} ${formatNumber(b)}`}
        viewBox={`0 0 ${VIEW_W} ${height}`}
        className="h-auto w-full max-w-sm"
      >
        <Bars a={a} b={b} step={step} answer={answer} />
      </svg>
      <Reveal
        shown={step >= BAR_BRACE_STEP}
        placeholder={<EquationLine op={op} a={a} b={b} result="?" />}
      >
        <EquationLine op={op} a={a} b={b} result={answerShown ? value : "?"} />
      </Reveal>
      {legend && <RoleLegend op={op} />}
    </div>
  );
}

// Bar model of the meaning of an operation. Addition: two blue bars side by
// side, then a brace over both with the total. Subtraction: one violet bar,
// the subtrahend crossed out of it in pink, the teal rest with the
// difference. Steps: 0 the bars, 1 the brace or cut with "?" as the result,
// 2 the result and the equation line (3 steps in "full", 2 in "hint", which
// stops at "?"; "still" draws the last step without a player).
export function BarModel({
  op,
  a,
  b,
  mode,
}: {
  op: Op;
  a: number;
  b: number;
  mode: StepsMode;
}) {
  if (mode === "still") {
    return (
      <BarFigure op={op} a={a} b={b} step={BAR_RESULT_STEP} showAnswer legend />
    );
  }
  const showAnswer = mode === "full";
  return (
    <StepPlayer
      steps={showAnswer ? BAR_RESULT_STEP + 1 : BAR_RESULT_STEP}
      label={`Mô hình thanh của phép ${op === "add" ? "cộng" : "trừ"} ${formatNumber(a)} ${ROLES[op].symbol} ${formatNumber(b)}`}
    >
      {(step) => (
        <BarFigure
          op={op}
          a={a}
          b={b}
          step={step}
          showAnswer={showAnswer}
          legend={showAnswer}
        />
      )}
    </StepPlayer>
  );
}

// ---------------------------------------------------------------------------
// Swap

// Steps of the commutative picture: the sum, the second row whose numbers
// slide past each other, then both totals with "=" between them.
const SWAP_SLIDE_STEP = 1;
const SWAP_EQUAL_STEP = 2;
const SWAP_STEPS = 3;

const CHIP_CHAR_PX = 22;
const CHIP_PAD_PX = 28;
const CHIP_MIN_PX = 64;
const PLUS_BOX_PX = 40;

function chipWidth(value: number): number {
  return Math.max(
    CHIP_MIN_PX,
    formatNumber(value).length * CHIP_CHAR_PX + CHIP_PAD_PX,
  );
}

function Chip({
  value,
  width,
  startX = 0,
}: {
  value: number;
  width: number;
  // Offset the chip starts from and slides out of, to reach its place.
  startX?: number;
}) {
  const transition = useVisualTransition();
  return (
    <motion.span
      initial={startX === 0 ? false : { x: startX }}
      animate={{ x: 0 }}
      transition={transition}
      style={{ width }}
      className="inline-flex h-14 shrink-0 items-center justify-center rounded-xl border-2 border-concept-blue bg-surface font-heading text-title font-bold text-concept-blue"
    >
      {formatNumber(value)}
    </motion.span>
  );
}

function PlusBox() {
  return (
    <span
      style={{ width: PLUS_BOX_PX }}
      className="inline-flex shrink-0 justify-center font-heading text-title font-bold"
    >
      {PLUS}
    </span>
  );
}

function Total({ children }: { children: ReactNode }) {
  return (
    <span className="min-w-16 text-left font-heading text-title font-bold text-concept-amber">
      {children}
    </span>
  );
}

function SwapFigure({
  a,
  b,
  step,
  slide,
  showTotal,
}: {
  a: number;
  b: number;
  step: number;
  // Whether the second row's chips slide into place (played) or just sit
  // there (still).
  slide: boolean;
  showTotal: boolean;
}) {
  const wa = chipWidth(a);
  const wb = chipWidth(b);
  const total = showTotal ? formatNumber(a + b) : "?";
  const secondShown = step >= SWAP_SLIDE_STEP;
  const equalShown = step >= SWAP_EQUAL_STEP;
  return (
    <div
      role="img"
      aria-label={`Đổi chỗ hai số hạng ${formatNumber(a)} và ${formatNumber(b)}`}
      className="flex w-full flex-col items-center gap-2"
    >
      <div className="flex items-center justify-center gap-3">
        <div className="flex items-center">
          <Chip value={a} width={wa} />
          <PlusBox />
          <Chip value={b} width={wb} />
        </div>
        <Total>= {total}</Total>
      </div>
      <div className="flex min-h-touch items-center justify-center gap-3">
        <Reveal shown={secondShown}>
          <span className="flex items-center gap-2 text-body text-concept-sky md:text-body-lg">
            <ConceptMark color="sky" className="size-5" />
            <ArrowDownUp aria-hidden className="size-6" />
            <span className="text-foreground">Đổi chỗ</span>
          </span>
        </Reveal>
        <Reveal shown={equalShown}>
          <span className="font-heading text-title font-bold">=</span>
        </Reveal>
      </div>
      <Reveal
        shown={secondShown}
        placeholder={
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center">
              <span style={{ width: wb }} className="text-center">
                ?
              </span>
              <PlusBox />
              <span style={{ width: wa }} className="text-center">
                ?
              </span>
            </div>
            <Total>= ?</Total>
          </div>
        }
      >
        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center">
            <Chip value={b} width={wb} startX={slide ? wa + PLUS_BOX_PX : 0} />
            <PlusBox />
            <Chip
              value={a}
              width={wa}
              startX={slide ? -(wb + PLUS_BOX_PX) : 0}
            />
          </div>
          {equalShown || !slide ? <Total>= {total}</Total> : <Total>= ?</Total>}
        </div>
      </Reveal>
    </div>
  );
}

// Commutative property: "a + b" and "b + a" give the same total. Step 0 the
// sum a + b; step 1 a second row whose two chips slide past each other while
// the plus stays (a sky swap mark shows the swap); step 2 the totals with "="
// between them. "hint" keeps both totals as "?"; "still" draws everything at
// once without a player.
export function Swap({
  a,
  b,
  mode,
}: {
  a: number;
  b: number;
  mode: StepsMode;
}) {
  if (mode === "still") {
    return (
      <SwapFigure a={a} b={b} step={SWAP_STEPS - 1} slide={false} showTotal />
    );
  }
  return (
    <StepPlayer
      steps={SWAP_STEPS}
      label={`Đổi chỗ hai số hạng ${formatNumber(a)} và ${formatNumber(b)}`}
    >
      {(step) => (
        <SwapFigure a={a} b={b} step={step} slide showTotal={mode === "full"} />
      )}
    </StepPlayer>
  );
}

// ---------------------------------------------------------------------------
// ZeroWallet

// Coins drawn per wallet at most; a bigger n still reads from its equation.
const MAX_COINS = 6;
const COIN_R = 10;
const COIN_STEP = 26;
const WALLET_PAD = 10;
const WALLET_H = COIN_R * 2 + 2 * WALLET_PAD;

// A wallet: `coins` filled coins, plus an empty dashed slot for 0, before or
// after them.
function Wallet({ coins, slotFirst }: { coins: number; slotFirst: boolean }) {
  const cells = coins + 1;
  const width = cells * COIN_STEP + 2 * WALLET_PAD - (COIN_STEP - 2 * COIN_R);
  const slots = Array.from({ length: cells }, (_, i) => i);
  const slotIndex = slotFirst ? 0 : coins;
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${width} ${WALLET_H}`}
      style={{ width }}
      className="h-auto max-w-full shrink-0"
    >
      <rect
        x={1}
        y={1}
        width={width - 2}
        height={WALLET_H - 2}
        rx={12}
        strokeWidth={2}
        className="fill-muted stroke-border"
      />
      {slots.map((i) => {
        const cx = WALLET_PAD + COIN_R + i * COIN_STEP;
        return i === slotIndex ? (
          <circle
            key={i}
            cx={cx}
            cy={WALLET_H / 2}
            r={COIN_R - 1}
            strokeWidth={2}
            strokeDasharray="4 3"
            className="fill-none stroke-muted-foreground"
          />
        ) : (
          <circle
            key={i}
            cx={cx}
            cy={WALLET_H / 2}
            r={COIN_R}
            className="fill-concept-amber stroke-surface"
            strokeWidth={1.5}
          />
        );
      })}
    </svg>
  );
}

// Three rows, "n + 0 = n", "0 + n = n" and "n − 0 = n", each with a wallet of
// n coins and an empty dashed slot for the 0.
export function ZeroWallet({ n }: { n: number }) {
  const coins = Math.min(n, MAX_COINS);
  const rows = [
    { op: "add", a: n, b: 0, slotFirst: false },
    { op: "add", a: 0, b: n, slotFirst: true },
    { op: "sub", a: n, b: 0, slotFirst: false },
  ] as const;
  return (
    <div
      role="img"
      aria-label={`Số 0 trong phép cộng và phép trừ với số ${formatNumber(n)}`}
      className="flex w-full flex-col items-center gap-4"
    >
      {rows.map((row) => (
        <div
          key={`${row.op}-${row.a}-${row.b}`}
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2"
        >
          <Wallet coins={coins} slotFirst={row.slotFirst} />
          <EquationLine
            op={row.op}
            a={row.a}
            b={row.b}
            result={resultOf(row.op, row.a, row.b)}
          />
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sticker

// Lesson sticker: a medal with a plus and a minus on it, hung from a ribbon.
export function Sticker() {
  return (
    <svg
      role="img"
      aria-label="Huy chương có dấu cộng và dấu trừ"
      viewBox="0 0 100 100"
      className="h-auto w-full max-w-32"
    >
      <g {...decorative}>
        <circle cx={50} cy={50} r={48} className="fill-highlight" />
        <polygon
          points="36,60 50,60 46,92 40,86 32,90"
          className="fill-concept-pink stroke-surface"
          strokeWidth={1.5}
        />
        <polygon
          points="50,60 64,60 68,90 60,86 54,92"
          className="fill-concept-violet stroke-surface"
          strokeWidth={1.5}
        />
        <circle
          cx={50}
          cy={42}
          r={32}
          strokeWidth={4}
          className="fill-surface stroke-concept-amber"
        />
        <rect
          x={29}
          y={38.5}
          width={20}
          height={7}
          rx={2}
          className="fill-concept-blue"
        />
        <rect
          x={35.5}
          y={32}
          width={7}
          height={20}
          rx={2}
          className="fill-concept-blue"
        />
        <rect
          x={55}
          y={38.5}
          width={20}
          height={7}
          rx={2}
          className="fill-concept-teal"
        />
      </g>
    </svg>
  );
}
