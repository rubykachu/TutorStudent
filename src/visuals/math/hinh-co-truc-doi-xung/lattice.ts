import type { Pt } from "./geometry";

// Drawings on a square lattice (the grid of a workbook page): mirror images
// of lattice points in a vertical, horizontal or diagonal line through the
// lattice, and the axes of a figure made of unit pieces of the lattice. Pure,
// so validators and tests read it. Coordinates: x to the right, y downwards,
// a lattice point is [column, row].

// An axis of symmetry that lies on the lattice:
// - "v": the vertical line x = at;
// - "h": the horizontal line y = at;
// - "d": the diagonal y = x + at, running down to the right ("\");
// - "a": the diagonal y = -x + at, running up to the right ("/").
export type LatticeAxis = {
  kind: "v" | "h" | "d" | "a";
  at: number;
};

export function mirrorPoint([x, y]: Pt, axis: LatticeAxis): Pt {
  switch (axis.kind) {
    case "v":
      return [2 * axis.at - x, y];
    case "h":
      return [x, 2 * axis.at - y];
    case "d":
      return [y - axis.at, x + axis.at];
    case "a":
      return [axis.at - y, axis.at - x];
  }
}

export function onAxis(point: Pt, axis: LatticeAxis): boolean {
  const [x, y] = mirrorPoint(point, axis);
  return x === point[0] && y === point[1];
}

// Which side of the axis a point lies on (0 on it): the sign of its distance.
export function sideOfAxis([x, y]: Pt, axis: LatticeAxis): number {
  switch (axis.kind) {
    case "v":
      return Math.sign(x - axis.at);
    case "h":
      return Math.sign(y - axis.at);
    case "d":
      return Math.sign(y - x - axis.at);
    case "a":
      return Math.sign(x + y - axis.at);
  }
}

// The axis as a segment between the edges of a lattice `cols` points wide and
// `rows` points tall, stretched to the picture.
export function axisSegment(
  axis: LatticeAxis,
  cols: number,
  rows: number,
): [Pt, Pt] {
  const [maxX, maxY] = [cols - 1, rows - 1];
  switch (axis.kind) {
    case "v":
      return [
        [axis.at, 0],
        [axis.at, maxY],
      ];
    case "h":
      return [
        [0, axis.at],
        [maxX, axis.at],
      ];
    case "d": {
      // y = x + at, from the top or left edge to the bottom or right edge.
      const x0 = Math.max(0, -axis.at);
      const x1 = Math.min(maxX, maxY - axis.at);
      return [
        [x0, x0 + axis.at],
        [x1, x1 + axis.at],
      ];
    }
    case "a": {
      // y = -x + at, from the bottom or left edge to the top or right edge.
      const x0 = Math.max(0, axis.at - maxY);
      const x1 = Math.min(maxX, axis.at);
      return [
        [x0, axis.at - x0],
        [x1, axis.at - x1],
      ];
    }
  }
}

// ---------------------------------------------------------------------------
// Figures made of unit pieces: an edge joins two neighbouring lattice points.

export type Edge = readonly [Pt, Pt];

const key = (p: Pt) => `${p[0]},${p[1]}`;

// An edge as one string, the same whichever end is named first.
export function edgeKey(edge: Edge): string {
  const [a, b] = [key(edge[0]), key(edge[1])];
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

// The edges of a chain of lattice points (each step one unit up, down,
// left or right).
export function chain(points: readonly Pt[]): Edge[] {
  return points.slice(1).map((p, i) => [points[i] as Pt, p] as const);
}

// A set of edges is a single chain: connected, every point on at most two
// edges, no loop.
export function isChain(edges: readonly Edge[]): boolean {
  if (edges.length === 0) return false;
  const degree = new Map<string, number>();
  const neighbours = new Map<string, string[]>();
  for (const [a, b] of edges) {
    for (const [p, q] of [
      [a, b],
      [b, a],
    ] as const) {
      degree.set(key(p), (degree.get(key(p)) ?? 0) + 1);
      neighbours.set(key(p), [...(neighbours.get(key(p)) ?? []), key(q)]);
    }
  }
  if ([...degree.values()].some((d) => d > 2)) return false;
  // A chain has one more point than edges (a loop has as many).
  if (degree.size !== edges.length + 1) return false;
  const first = [...degree.keys()][0] as string;
  const seen = new Set<string>([first]);
  const stack = [first];
  while (stack.length > 0) {
    const at = stack.pop() as string;
    for (const next of neighbours.get(at) ?? []) {
      if (!seen.has(next)) {
        seen.add(next);
        stack.push(next);
      }
    }
  }
  return seen.size === degree.size;
}

// The axes of a figure of unit edges: the vertical and horizontal lines
// through lattice points or through the middle of a cell, and the diagonals
// through lattice points, that fold the figure onto itself.
export function latticeAxes(edges: readonly Edge[]): LatticeAxis[] {
  const wanted = new Set(edges.map(edgeKey));
  const points = edges.flat();
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const [minX, maxX] = [Math.min(...xs), Math.max(...xs)];
  const [minY, maxY] = [Math.min(...ys), Math.max(...ys)];
  const candidates: LatticeAxis[] = [];
  for (let at = minX; at <= maxX; at += 0.5) candidates.push({ kind: "v", at });
  for (let at = minY; at <= maxY; at += 0.5) candidates.push({ kind: "h", at });
  for (let at = minY - maxX; at <= maxY - minX; at++) {
    candidates.push({ kind: "d", at });
  }
  for (let at = minX + minY; at <= maxX + maxY; at++) {
    candidates.push({ kind: "a", at });
  }
  return candidates.filter((axis) =>
    edges.every(([a, b]) =>
      wanted.has(edgeKey([mirrorPoint(a, axis), mirrorPoint(b, axis)])),
    ),
  );
}
