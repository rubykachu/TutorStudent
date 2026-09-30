// Layout helpers for pictures that draw many small items: dots packed into a
// box, and plates arranged in rows. Pure numbers, no React.

export type Point = { x: number; y: number };

export type DotGrid = { cols: number; rows: number; pitch: number };

// The grid of `count` dots that fits `width` x `height` with the widest
// spacing; among equal spacings the squarer one wins.
export function fitGrid(
  count: number,
  width: number,
  height: number,
  maxPitch: number,
): DotGrid {
  const n = Math.max(count, 1);
  let best: DotGrid = { cols: 1, rows: n, pitch: -1 };
  for (let cols = 1; cols <= n; cols++) {
    const rows = Math.ceil(n / cols);
    const pitch = Math.min(maxPitch, width / cols, height / rows);
    const wider = pitch > best.pitch + 1e-9;
    const equal = Math.abs(pitch - best.pitch) <= 1e-9;
    const squarer = Math.abs(cols - rows) < Math.abs(best.cols - best.rows);
    if (wider || (equal && squarer)) best = { cols, rows, pitch };
  }
  return best;
}

// Centres of the dots of a grid, row by row, the whole block centred on
// (cx, cy); a last row that is not full is centred too.
export function gridPoints(
  count: number,
  cx: number,
  cy: number,
  grid: DotGrid,
): Point[] {
  return Array.from({ length: count }, (_, i) => {
    const row = Math.floor(i / grid.cols);
    const inRow = Math.min(grid.cols, count - row * grid.cols);
    const col = i % grid.cols;
    return {
      x: cx + (col - (inRow - 1) / 2) * grid.pitch,
      y: cy + (row - (grid.rows - 1) / 2) * grid.pitch,
    };
  });
}

// Dots laid left to right from (left, top), wrapping after `cols`.
export function rowPoints(
  count: number,
  left: number,
  top: number,
  cols: number,
  pitch: number,
): Point[] {
  return Array.from({ length: count }, (_, i) => ({
    x: left + (i % cols) * pitch + pitch / 2,
    y: top + Math.floor(i / cols) * pitch + pitch / 2,
  }));
}

// Plates in rows: up to `singleRowMax` share one row, more are split over two.
export function plateColumns(people: number, singleRowMax = 5): number {
  return people <= singleRowMax ? people : Math.ceil(people / 2);
}
