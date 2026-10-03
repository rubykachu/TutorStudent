import type { VisualState } from "@/visuals/registry";
import type { FigureSpec } from "@/visuals/shared/plane/figure-spec";
import { board, figure, frame, steps } from "./builders";
import { type BoardShape, boardFigure, solvedState } from "./construction";
import { textAt } from "./figures";
import type { VisualSpec } from "./spec";

// Pictures of sections 12 to 15: drawing the shapes with ruler, set square and
// compass. The boards of the exercises are listed by the corner names the
// exercise writes, so the picture and the wording agree.

const ABCD = ["A", "B", "C", "D"] as const;

// The drawing board in a state: ruler, guide lines and compass arcs included.
export const stage = (
  shape: BoardShape,
  names: readonly string[],
  state: VisualState,
) => boardFigure(shape, names, state);

// Longest side of a cropped finished drawing, and the room round it for the
// names, strokes and chevrons (drawing units).
const CROP_CONTENT = 150;
const CROP_MARGIN = 34;

// A finished drawing without the tools: only its sides (and the right-angle
// squares, strokes and chevrons that mark them), as the picture of the rule.
// `crop` cuts the frame to the drawing and scales it up, for a rule picture
// shown alone or beside others (a step frame keeps the frame of the board, so
// that the frames of a drawing do not change size).
export function finished(
  shape: BoardShape,
  names: readonly string[],
  params: Readonly<Record<string, number>>,
  label: string,
  crop = false,
): FigureSpec {
  const board = boardFigure(shape, names, solvedState(shape, params));
  const segs = (board.segs ?? []).filter((seg) => !seg.dash);
  const {
    ruler: _ruler,
    dots: _dots,
    texts: _texts,
    arcs: _arcs,
    angles: _angles,
    ...rest
  } = board;
  const used = new Set<string>([
    ...names,
    ...segs.flatMap((seg) => [seg.a, seg.b]),
    ...(rest.rights ?? []).flatMap((mark) => [mark.at, mark.a, mark.b]),
    ...(rest.ticks ?? []).flatMap((tick) => tick.segs.flat()),
    ...(rest.arrows ?? []).flatMap((arrow) => arrow.segs.flat()),
  ]);
  const kept = Object.entries(board.pts).filter(([name]) => used.has(name));
  const figure: FigureSpec = {
    ...rest,
    label,
    pts: Object.fromEntries(kept),
    segs,
    names: rest.names ?? [...names],
  };
  return crop ? cropped(figure) : figure;
}

// The figure with its frame cut to its points and scaled up.
function cropped(figure: FigureSpec): FigureSpec {
  const points = Object.values(figure.pts);
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const [minX, minY] = [Math.min(...xs), Math.min(...ys)];
  const [width, height] = [Math.max(...xs) - minX, Math.max(...ys) - minY];
  const scale = CROP_CONTENT / Math.max(width, height);
  return {
    ...figure,
    w: Math.round(width * scale + 2 * CROP_MARGIN),
    h: Math.round(height * scale + 2 * CROP_MARGIN),
    pts: Object.fromEntries(
      Object.entries(figure.pts).map(([name, [x, y]]) => [
        name,
        [(x - minX) * scale + CROP_MARGIN, (y - minY) * scale + CROP_MARGIN],
      ]),
    ),
  };
}

export const DRAWING_SPECS: Record<string, VisualSpec> = {
  // 12. Vẽ hình chữ nhật
  "ve-chu-nhat-cac-buoc": steps(
    "Các bước vẽ hình chữ nhật ABCD có AB = 4 cm và BC = 3 cm",
    [
      frame(
        stage("rectangle", ABCD, { len: 4 }),
        "Dùng thước vẽ cạnh AB dài 4 cm",
      ),
      frame(
        stage("rectangle", ABCD, { len: 4, perpD: 1, perpE: 1 }),
        "Dùng êke vẽ hai đường vuông góc ở A và ở B",
      ),
      frame(
        stage("rectangle", ABCD, { len: 4, perpD: 1, perpE: 1, h: 3 }),
        "Lấy C và D cách AB đúng 3 cm",
      ),
      frame(
        finished(
          "rectangle",
          ABCD,
          { a: 4, b: 3 },
          "Hình chữ nhật ABCD vẽ xong",
        ),
        "Nối D với C",
      ),
    ],
  ),
  "ve-chu-nhat-quy-tac": figure(
    finished(
      "rectangle",
      ABCD,
      { a: 4, b: 3 },
      "Hình chữ nhật vẽ bằng thước và êke",
      true,
    ),
  ),
  "ve-chu-nhat-tap-lam": board("rectangle", ["M", "N", "P", "Q"], {
    a: 6,
    b: 2,
  }),
  "ve-chu-nhat-abcd": board("rectangle", ABCD),
  "ve-chu-nhat-efgh": board("rectangle", ["E", "F", "G", "H"]),

  // 13. Vẽ hình thoi
  "ve-thoi-cac-buoc": steps(
    "Các bước vẽ hình thoi ABCD có AB = 3 cm và góc BAD bằng 75°",
    [
      frame(
        stage("rhombus", ABCD, { len: 3 }),
        "Dùng thước vẽ cạnh AB dài 3 cm",
      ),
      frame(
        stage("rhombus", ABCD, { len: 3, angle: 75 }),
        "Dùng thước đo góc kẻ đường AD tạo với AB một góc 75°",
      ),
      frame(
        stage("rhombus", ABCD, { len: 3, angle: 75, markQ: 1 }),
        "Mở compa bằng AB = 3 cm, đặt kim ở A, vẽ cung cắt đường AD tại D",
      ),
      frame(
        stage("rhombus", ABCD, {
          len: 3,
          angle: 75,
          markQ: 1,
          arcQ: 1,
          arcN: 1,
        }),
        "Giữ nguyên độ mở, đặt kim ở D rồi ở B, vẽ hai cung",
      ),
      frame(
        stage("rhombus", ABCD, {
          len: 3,
          angle: 75,
          markQ: 1,
          arcQ: 1,
          arcN: 1,
          pointP: 1,
        }),
        "Hai cung gặp nhau tại C",
      ),
      frame(
        finished(
          "rhombus",
          ABCD,
          { side: 3, angle: 75 },
          "Hình thoi ABCD vẽ xong",
        ),
        "Nối C với D và với B",
      ),
    ],
  ),
  "ve-thoi-quy-tac": figure(
    finished(
      "rhombus",
      ABCD,
      { side: 3, angle: 75 },
      "Hình thoi vẽ bằng thước, thước đo góc và compa",
      true,
    ),
  ),
  "ve-thoi-tap-lam": board("rhombus", ["E", "F", "G", "H"], {
    side: 6,
    angle: 45,
  }),
  "ve-thoi-efgh": board("rhombus", ["E", "F", "G", "H"]),
  "ve-thoi-abcd": board("rhombus", ABCD),
  "ve-thoi-mnpq": board("rhombus", ["M", "N", "P", "Q"]),

  // 14. Vẽ hình bình hành
  "ve-binh-hanh-cac-buoc": steps(
    "Các bước vẽ hình bình hành ABCD có AB = 5 cm và AD = 3 cm",
    [
      frame(
        stage("parallelogram", ABCD, { len: 5 }),
        "Dùng thước vẽ cạnh AB dài 5 cm",
      ),
      frame(
        stage("parallelogram", ABCD, { len: 5, angle: 60 }),
        "Dùng thước đo góc kẻ đường AD tạo với AB một góc 60°",
      ),
      frame(
        stage("parallelogram", ABCD, { len: 5, angle: 60, side: 3 }),
        "Lấy D trên đường AD, AD dài 3 cm",
      ),
      frame(
        stage("parallelogram", ABCD, {
          len: 5,
          angle: 60,
          side: 3,
          parF: 1,
        }),
        "Dùng êke vẽ qua B đường song song với AD",
      ),
      frame(
        stage("parallelogram", ABCD, {
          len: 5,
          angle: 60,
          side: 3,
          parF: 1,
          parK: 1,
        }),
        "Dùng êke vẽ qua D đường song song với AB",
      ),
      frame(
        finished(
          "parallelogram",
          ABCD,
          { a: 5, b: 3 },
          "Hình bình hành ABCD vẽ xong",
        ),
        "Hai đường gặp nhau tại C. Nối D với C và B với C",
      ),
    ],
  ),
  "ve-binh-hanh-quy-tac": figure(
    finished(
      "parallelogram",
      ABCD,
      { a: 5, b: 3 },
      "Hình bình hành vẽ bằng thước, thước đo góc và êke",
      true,
    ),
  ),
  // A set square sliding along a ruler draws parallel lines.
  "truot-eke": figure({
    label: "Êke trượt dọc theo thước vẽ hai đường song song",
    w: 300,
    h: 210,
    pts: {
      r0: [30, 150],
      r1: [270, 150],
      r2: [270, 178],
      r3: [30, 178],
      a0: [60, 150],
      a1: [130, 150],
      a2: [60, 70],
      b0: [160, 150],
      b1: [230, 150],
      b2: [160, 70],
    },
    polys: [
      { v: ["r0", "r1", "r2", "r3"], fill: "mute" },
      { v: ["a0", "a1", "a2"], fill: "sky" },
      { v: ["b0", "b1", "b2"], fill: "sky" },
    ],
    segs: [
      { a: "a0", b: "a2", tone: "slate", bold: true },
      { a: "b0", b: "b2", tone: "slate", bold: true },
    ],
    arrows: [
      {
        segs: [
          ["a0", "a2"],
          ["b0", "b2"],
        ],
        count: 1,
        tone: "slate",
      },
    ],
    texts: [
      textAt(150, 198, "Thước giữ yên"),
      textAt(150, 36, "Êke trượt sang phải"),
    ],
  }),
  "ve-binh-hanh-tap-lam": board("parallelogram", ["M", "N", "P", "Q"], {
    a: 4,
    b: 6,
  }),
  "ve-binh-hanh-abcd": board("parallelogram", ABCD),
  "ve-binh-hanh-pqrs": board("parallelogram", ["P", "Q", "R", "S"]),

  // 15. Vẽ hình bình hành biết đường chéo
  "ve-bh-cheo-cac-buoc": steps(
    "Các bước vẽ hình bình hành ABCD có AB = 4 cm, BC = 3 cm và AC = 6 cm",
    [
      frame(
        stage("parallelogram-diagonal", ABCD, { len: 4 }),
        "Dùng thước vẽ cạnh AB dài 4 cm",
      ),
      frame(
        stage("parallelogram-diagonal", ABCD, { len: 4, rBC: 3, arcB: 1 }),
        "Mở compa bằng BC = 3 cm, đặt kim ở B, vẽ một cung tròn",
      ),
      frame(
        stage("parallelogram-diagonal", ABCD, {
          len: 4,
          rBC: 3,
          arcB: 1,
          rAC: 6,
          arcA: 1,
        }),
        "Mở compa bằng AC = 6 cm, đặt kim ở A, vẽ một cung tròn",
      ),
      frame(
        stage("parallelogram-diagonal", ABCD, {
          len: 4,
          rBC: 3,
          arcB: 1,
          rAC: 6,
          arcA: 1,
          pointC: 1,
        }),
        "Hai cung gặp nhau tại C",
      ),
      frame(
        stage("parallelogram-diagonal", ABCD, {
          len: 4,
          rBC: 3,
          arcB: 1,
          rAC: 6,
          arcA: 1,
          pointC: 1,
          parC: 1,
          parA: 1,
        }),
        "Dùng êke vẽ qua C đường song song với AB và qua A đường song song với BC",
      ),
      frame(
        finished(
          "parallelogram-diagonal",
          ABCD,
          { ab: 4, bc: 3, ac: 6 },
          "Hình bình hành ABCD vẽ xong",
        ),
        "Hai đường gặp nhau tại D. Nối D với C và với A",
      ),
    ],
  ),
  "ve-bh-cheo-quy-tac": figure(
    finished(
      "parallelogram-diagonal",
      ABCD,
      { ab: 4, bc: 3, ac: 6 },
      "Hình bình hành vẽ bằng thước, compa và êke",
      true,
    ),
  ),
  "ve-bh-cheo-tap-lam": board("parallelogram-diagonal", ["M", "N", "P", "Q"], {
    ab: 5,
    bc: 4,
    ac: 7,
  }),
  "ve-bh-cheo-mnpq": board("parallelogram-diagonal", ["M", "N", "P", "Q"]),
  "ve-bh-cheo-efgh": board("parallelogram-diagonal", ["E", "F", "G", "H"]),
  "ve-bh-cheo-abcd": board("parallelogram-diagonal", ABCD),
};
