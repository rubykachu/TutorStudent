"use client";

import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { ConceptShape } from "@/visuals/shared/concept-mark";
import { FormulaRow, Pending } from "@/visuals/shared/formula-rows";
import { Legend } from "@/visuals/shared/math-parts";
import { Reveal } from "@/visuals/shared/reveal";
import { StepPlayer } from "@/visuals/shared/step-player";
import type { SpecOf } from "./catalog";
import {
  flattenTree,
  isPrime,
  primeFactors,
  productTex,
  type TreeNode,
  treeDepth,
  treeLeaves,
} from "./logic";

const COL_W = 64;
const ROW_H = 74;
const RADIUS = 23;
const PAD = 8;
const FONT = 21;
const MARK = 6;

type Placed = { node: TreeNode; index: number; x: number; depth: number };
type Edge = { from: Placed; to: Placed };

// Leaves sit in equal columns from left to right; a parent sits above the
// middle of its children.
function place(root: TreeNode): { nodes: Placed[]; edges: Edge[] } {
  const order = flattenTree(root);
  const leafX = new Map(
    treeLeaves(root).map((leaf, i) => [leaf, PAD + RADIUS + i * COL_W]),
  );
  const nodes: Placed[] = [];
  const edges: Edge[] = [];
  const walk = (node: TreeNode, depth: number): Placed => {
    const kids = (node.kids ?? []).map((kid) => walk(kid, depth + 1));
    const x = node.kids
      ? ((kids[0]?.x ?? 0) + (kids[kids.length - 1]?.x ?? 0)) / 2
      : (leafX.get(node) ?? 0);
    const placed = { node, index: order.indexOf(node), x, depth };
    nodes.push(placed);
    for (const kid of kids) edges.push({ from: placed, to: kid });
    return placed;
  };
  walk(root, 0);
  return { nodes, edges };
}

function NodeShape({
  placed,
  state,
}: {
  placed: Placed;
  // "shown": the number; "pending": a dimmed "?" to come; "masked": a "?"
  // the exercise asks for.
  state: "shown" | "pending" | "masked";
}) {
  const { node, x, depth } = placed;
  const y = PAD + RADIUS + depth * ROW_H;
  const prime = isPrime(node.n);
  const color = prime ? "sky" : "pink";
  if (state !== "shown") {
    return (
      <g opacity={state === "pending" ? 0.4 : 1}>
        <circle
          cx={x}
          cy={y}
          r={RADIUS}
          className="fill-surface stroke-muted-foreground"
          strokeWidth={2}
          strokeDasharray="5 4"
        />
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={FONT}
          fontWeight={700}
          className="fill-muted-foreground font-heading"
        >
          ?
        </text>
      </g>
    );
  }
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={RADIUS}
        className={`${prime ? "fill-concept-sky/20" : "fill-concept-pink/15"} ${CONCEPT_CLASSES[color].stroke}`}
        strokeWidth={2.5}
      />
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={FONT}
        fontWeight={700}
        className="fill-foreground font-heading tabular-nums"
      >
        {node.n}
      </text>
      <ConceptShape
        color={color}
        cx={x + RADIUS - 2}
        cy={y - RADIUS + 2}
        r={MARK}
        className="stroke-surface"
        strokeWidth={1}
      />
    </g>
  );
}

// A factor tree: every number splits into two factors until all are primes.
// One level appears per step, then the product of the primes. In a hint the
// last level and the product stay "?"; `hide` lists nodes (by drawing order)
// that stay "?" for an exercise to ask.
export function Tree({ spec }: { spec: SpecOf<"tree"> }) {
  const { root, hide, mode } = spec;
  const hint = mode === "hint";
  const { nodes, edges } = place(root);
  const depth = treeDepth(root);
  const leaves = treeLeaves(root);
  const width = PAD * 2 + RADIUS * 2 + (leaves.length - 1) * COL_W;
  const height = PAD * 2 + RADIUS * 2 + depth * ROW_H;
  const showProduct = hide.length === 0;
  const factors = primeFactors(root.n);
  const label = `Sơ đồ cây của ${root.n}: ${flattenTree(root)
    .map((node, i) => (hide.includes(i) ? "?" : node.n))
    .join(", ")}`;
  const lastShown = hint ? depth - 1 : depth;

  const draw = (step: number) => {
    const reach = mode === "still" ? depth : step;
    const stateOf = (p: Placed): "shown" | "pending" | "masked" | undefined => {
      if (hide.includes(p.index)) return "masked";
      if (p.depth <= Math.min(reach, lastShown)) return "shown";
      if (mode !== "still" && p.depth === Math.min(reach, lastShown) + 1) {
        return "pending";
      }
      return undefined;
    };
    return (
      <div className="flex w-full flex-col items-center gap-3">
        <svg
          role="img"
          aria-label={label}
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          style={{ maxWidth: "100%", height: "auto" }}
        >
          {edges.map(({ from, to }) => {
            const visible =
              stateOf(to) !== undefined && stateOf(from) !== undefined;
            const y1 = PAD + RADIUS + from.depth * ROW_H + RADIUS;
            const y2 = PAD + RADIUS + to.depth * ROW_H - RADIUS;
            return (
              <line
                key={`${from.index}-${to.index}`}
                x1={from.x}
                y1={y1}
                x2={to.x}
                y2={y2}
                className="stroke-muted-foreground"
                strokeWidth={2}
                opacity={visible ? (stateOf(to) === "pending" ? 0.4 : 1) : 0}
              />
            );
          })}
          {nodes.map((p) => {
            const state = stateOf(p);
            return state ? (
              <NodeShape key={p.index} placed={p} state={state} />
            ) : null;
          })}
        </svg>
        {showProduct && (
          <div className="w-full" aria-live="polite">
            <Reveal
              shown={mode === "still" || (!hint && step > depth)}
              placeholder={<Pending />}
            >
              <FormulaRow
                row={{
                  tex: `${root.n} = ${productTex(factors)}`,
                  tag: { text: "Tích các thừa số nguyên tố", color: "amber" },
                }}
              />
            </Reveal>
          </div>
        )}
        <Legend
          items={[
            { color: "sky", name: "Số nguyên tố" },
            { color: "pink", name: "Hợp số" },
          ]}
        />
      </div>
    );
  };

  if (mode === "still") {
    return (
      <figure aria-label={label} className="w-full">
        {draw(depth + 1)}
      </figure>
    );
  }
  const total = depth + 1 + (showProduct ? 1 : 0);
  return (
    <StepPlayer steps={total - (hint ? 1 : 0)} label={label}>
      {draw}
    </StepPlayer>
  );
}
