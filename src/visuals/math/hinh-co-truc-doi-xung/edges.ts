import type { VisualState } from "@/visuals/registry";
import type { Pt } from "./geometry";
import {
  chain,
  type Edge,
  edgeKey,
  isChain,
  type LatticeAxis,
  latticeAxes,
} from "./lattice";

// What a "vẽ thêm đường gấp khúc" board is made of: a fixed polyline on a
// lattice, and unit pieces of the lattice the child switches on one by one
// to add a polyline of a given length, so that the whole figure has a given
// number of axes. Pure data and logic.

export type EdgeBoardSpec = {
  label: string;
  // Lattice points: columns x = 0 … cols - 1, rows y = 0 … rows - 1.
  cols: number;
  rows: number;
  // The fixed polyline, as the chain of its lattice points.
  given: readonly Pt[];
  // Lesson screen only: the polyline to add and the closing line once the
  // child has drawn it. Without it the board is free (an exercise, whose
  // params are { length, axes }).
  goal?: { length: number; axes: number; done: string };
};

export type EdgeParams = { length: number; axes: number };

// The pieces the child may switch on: every unit piece of the lattice that is
// not already part of the given polyline. Horizontal pieces first, row by
// row, then vertical pieces, row by row.
export function candidateEdges(spec: EdgeBoardSpec): Edge[] {
  const given = new Set(chain(spec.given).map(edgeKey));
  const edges: Edge[] = [];
  for (let y = 0; y < spec.rows; y++) {
    for (let x = 0; x < spec.cols - 1; x++) {
      edges.push([
        [x, y],
        [x + 1, y],
      ]);
    }
  }
  for (let y = 0; y < spec.rows - 1; y++) {
    for (let x = 0; x < spec.cols; x++) {
      edges.push([
        [x, y],
        [x, y + 1],
      ]);
    }
  }
  return edges.filter((edge) => !given.has(edgeKey(edge)));
}

export const edgeStateKey = (index: number) => `e${index}`;

// The pieces switched on in a state.
export function chosenEdges(spec: EdgeBoardSpec, state: VisualState): Edge[] {
  return candidateEdges(spec).filter((_, i) => state[edgeStateKey(i)] === 1);
}

// The axes of the whole figure: the given polyline and the chosen pieces.
export function figureAxes(
  spec: EdgeBoardSpec,
  chosen: readonly Edge[],
): LatticeAxis[] {
  return latticeAxes([...chain(spec.given), ...chosen]);
}

// Right when the chosen pieces make one polyline of the wanted length and the
// whole figure has exactly the wanted number of axes.
export function isDrawnRight(
  spec: EdgeBoardSpec,
  state: VisualState,
  params: EdgeParams,
): boolean {
  const chosen = chosenEdges(spec, state);
  return (
    chosen.length === params.length &&
    isChain(chosen) &&
    figureAxes(spec, chosen).length === params.axes
  );
}

// The state that switches on exactly `chosen`.
export function stateOfEdges(
  spec: EdgeBoardSpec,
  chosen: readonly Edge[],
): VisualState {
  const want = new Set(chosen.map(edgeKey));
  return Object.fromEntries(
    candidateEdges(spec).flatMap((edge, i) =>
      want.has(edgeKey(edge)) ? [[edgeStateKey(i), 1]] : [],
    ),
  );
}

const key = (p: Pt) => `${p[0]},${p[1]}`;

// A polyline of `length` pieces that makes the figure have `axes` axes: the
// first one found, trying the ends of the given polyline first so the new
// part joins it.
export function solveEdges(
  spec: EdgeBoardSpec,
  params: EdgeParams,
): Edge[] | undefined {
  const free = candidateEdges(spec);
  const neighbours = new Map<string, { to: Pt; edge: Edge }[]>();
  for (const edge of free) {
    for (const [from, to] of [
      [edge[0], edge[1]],
      [edge[1], edge[0]],
    ] as const) {
      neighbours.set(key(from), [
        ...(neighbours.get(key(from)) ?? []),
        { to, edge },
      ]);
    }
  }
  const ends = [spec.given[0], spec.given[spec.given.length - 1]].filter(
    (p): p is Pt => p !== undefined,
  );
  const starts: Pt[] = [...ends];
  for (let y = 0; y < spec.rows; y++) {
    for (let x = 0; x < spec.cols; x++) {
      if (!starts.some((p) => p[0] === x && p[1] === y)) starts.push([x, y]);
    }
  }
  const path: Edge[] = [];
  const visited = new Set<string>();
  function walk(at: Pt): boolean {
    if (path.length === params.length) {
      return figureAxes(spec, path).length === params.axes;
    }
    for (const step of neighbours.get(key(at)) ?? []) {
      if (visited.has(key(step.to))) continue;
      visited.add(key(step.to));
      path.push(step.edge);
      if (walk(step.to)) return true;
      path.pop();
      visited.delete(key(step.to));
    }
    return false;
  }
  for (const start of starts) {
    visited.clear();
    visited.add(key(start));
    path.length = 0;
    if (walk(start)) return [...path];
  }
  return undefined;
}
