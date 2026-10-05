// The widest a picture of a lattice board may be shown: it may grow to 1.5
// times its size, but not so tall that the text and buttons that come with it
// no longer fit a frame. `tallest` is the most height the picture may take.
export function widthOf(
  size: { width: number; height: number },
  tallest: number,
): number {
  return Math.min((size.width * tallest) / size.height, size.width * 1.5);
}

// A thin rectangle round the segment from (x1, y1) to (x2, y2), `half` wide to
// each side, as an SVG `points` list. A tap target for a line: a line has no
// area of its own, so a browser would take a horizontal or vertical one for
// invisible.
export function bandPoints(
  [x1, y1]: readonly [number, number],
  [x2, y2]: readonly [number, number],
  half: number,
): string {
  const length = Math.hypot(x2 - x1, y2 - y1) || 1;
  const nx = (-(y2 - y1) / length) * half;
  const ny = ((x2 - x1) / length) * half;
  return [
    [x1 + nx, y1 + ny],
    [x2 + nx, y2 + ny],
    [x2 - nx, y2 - ny],
    [x1 - nx, y1 - ny],
  ]
    .map(([x, y]) => `${x},${y}`)
    .join(" ");
}
