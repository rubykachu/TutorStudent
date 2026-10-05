import type { FigureSpec } from "@/visuals/shared/plane/figure-spec";
import type { StepsSpec } from "@/visuals/shared/plane/figure-steps";
import {
  BOOK_56A,
  BOOK_56B,
  BOOK_56C,
  BOOK_58A,
  BOOK_58B,
  BOOK_59,
  COLUMN_QUESTION,
  COMPLETE_EXERCISE,
  COMPLETE_GUIDED,
  DIAGONAL_DEMO,
  DIAGONAL_EXERCISE,
  DIAGONAL_GUIDED,
  DIAGONAL_RULE,
  DIAGONAL_STEPS_BOARD,
  LEAD_56A,
  LEAD_56B,
  LEAD_56C,
  LEAD_58A,
  LEAD_58B,
  LEAD_59,
  PLUS_STEPS,
  POINT_DEMO,
  POINT_DEMO_HORIZONTAL,
  POINT_EXERCISE,
  POINTS_GUIDED,
  POINTS_RULE,
  ROW_QUESTION,
  VASE_RULE,
} from "./boards";
import type { VisualSpec } from "./catalog";
import type { StripItem, Subject } from "./figures";
import type { GlyphId } from "./glyphs";
import type { LineRef } from "./lines";
import type { ShapeId } from "./shapes";

// Every picture of the lesson, by the key its id ends with
// (`hinh-co-truc-doi-xung.visual.<key>`). Pure data, no React.

const axis = (i: number): LineRef => ({ src: "axis", i });
const fake = (i: number): LineRef => ({ src: "fake", i });

const shape = (id: ShapeId): Subject => ({ shape: id });
const glyph = (id: GlyphId): Subject => ({ glyph: id });

// Pictures that are the options of a question: small enough that four of
// them fit one above the other on a landscape iPad.
const THUMB_WIDTH = 84;
const PICTURE_WIDTH = 250;

const thumbs: Record<string, VisualSpec> = {
  ...Object.fromEntries(
    (
      [
        "bottle",
        "cloud",
        "flag",
        "gate",
        "glass",
        "hexagon",
        "key",
        "leaf",
        "mask",
        "parallelogram",
        "pine",
        "plus",
        "rectangle",
        "rhombus",
        "scalene",
        "slantleft",
        "square",
        "trapezoid",
        "triangle",
      ] as const
    ).map((id) => [
      `thumb-${id}`,
      { kind: "subject", subject: shape(id), width: THUMB_WIDTH },
    ]),
  ),
  ...Object.fromEntries(
    (["C", "J", "N", "P", "R", "S"] as const).map((id) => [
      `thumb-glyph-${id.toLowerCase()}`,
      { kind: "subject", subject: glyph(id), width: THUMB_WIDTH },
    ]),
  ),
};

// A number of three digits built from cards, with the line it is symmetric
// about named in its caption.
function numberItem(
  digits: string,
  axis: "h" | "v",
): { digits: GlyphId[]; axis: "h" | "v"; caption: string } {
  return {
    digits: [...digits] as GlyphId[],
    axis,
    caption: `${digits}: ${axis === "h" ? "ngang" : "đứng"}`,
  };
}

const bigGlyph = (id: GlyphId): VisualSpec => ({
  kind: "subject",
  subject: glyph(id),
  width: 140,
});

// A letter or a digit as a region of a strip, named for a screen reader.
const glyphItem = (id: string, g: GlyphId, label: string): StripItem => ({
  id,
  label,
  glyph: g,
});
const shapeItem = (id: string, s: ShapeId, label: string): StripItem => ({
  id,
  label,
  shape: s,
});

const BOOK_LETTERS: readonly [string, GlyphId, string][] = [
  ["a", "A", "Chữ A"],
  ["b", "B", "Chữ B"],
  ["h", "H", "Chữ H"],
  ["m", "M", "Chữ M"],
  ["n", "N", "Chữ N"],
  ["x", "X", "Chữ X"],
  ["y", "Y", "Chữ Y"],
  ["z", "Z", "Chữ Z"],
  ["so-0", "0", "Chữ số 0"],
  ["so-2", "2", "Chữ số 2"],
  ["so-3", "3", "Chữ số 3"],
  ["so-8", "8", "Chữ số 8"],
  ["so-9", "9", "Chữ số 9"],
];
const bookLetterItems = BOOK_LETTERS.map(([id, g, label]) =>
  glyphItem(id, g, label),
);

// The construction of the lesson on points (compass and ruler), frame by
// frame: a point A, the line d, the line through A at right angles to d, the
// circle round O, and the point A′ where it meets that line again.
const D1 = [150, 16] as const;
const D2 = [150, 224] as const;
const BASE_POINTS = {
  D1,
  D2,
  A: [70, 96],
  O: [150, 96],
  "A′": [230, 96],
  B1: [24, 96],
  B2: [276, 96],
} as const;

function constructionFrame(
  frame: number,
  caption: string,
): { figure: FigureSpec; caption: string } {
  const withO = frame >= 1;
  const withCircle = frame >= 2;
  const withImage = frame >= 3;
  const figure: FigureSpec = {
    label: "Dựng điểm đối xứng của A qua đường thẳng d bằng thước và compa",
    w: 300,
    h: 240,
    pts: BASE_POINTS,
    segs: [
      { a: "D1", b: "D2", tone: "pink" },
      ...(withO ? [{ a: "B1", b: "B2", tone: "ink" as const }] : []),
    ],
    arcs: withCircle
      ? [
          { c: "O", r: 80, from: -90, to: 90, dash: true, tone: "teal" },
          { c: "O", r: 80, from: 90, to: 270, dash: true, tone: "teal" },
        ]
      : [],
    rights: withO ? [{ at: "O", a: "A", b: "D1", tone: "violet" }] : [],
    dots: ["A", ...(withO ? ["O"] : []), ...(withImage ? ["A′"] : [])],
    names: ["A", ...(withO ? ["O"] : []), ...(withImage ? ["A′"] : [])],
    nameShift: { A: [0, -16], "A′": [0, -16], O: [16, 16] },
    texts: [{ x: 170, y: 30, text: "d", tone: "pink" }],
  };
  return { figure, caption };
}

const POINT_STEPS: StepsSpec = {
  label: "Dựng điểm đối xứng của A qua đường thẳng d bằng thước và compa",
  frames: [
    constructionFrame(0, "Cho điểm A và đường thẳng d."),
    constructionFrame(
      1,
      "Dựng đường thẳng qua A vuông góc với d. Nó cắt d tại O.",
    ),
    constructionFrame(2, "Vẽ đường tròn tâm O, bán kính OA."),
    constructionFrame(
      3,
      "Đường tròn cắt lại đường thẳng vừa dựng tại A′, khác A. Điểm A′ đối xứng với A qua d.",
    ),
  ],
};

export const VISUAL_SPECS: Readonly<Record<string, VisualSpec>> = {
  ...thumbs,
  "big-parallelogram": {
    kind: "subject",
    subject: shape("slantleft"),
    width: PICTURE_WIDTH,
  },
  "big-star": { kind: "subject", subject: shape("star"), width: PICTURE_WIDTH },
  "chu-e": bigGlyph("E"),
  "chu-f": bigGlyph("F"),
  "chu-u": bigGlyph("U"),
  "chu-so-1": bigGlyph("1"),

  // Section 1: shapes around us that fold in half
  "quanh-ta": {
    kind: "gallery",
    label: "Cánh bướm, chiếc lá, cổng đền và ngôi nhà",
    columns: 2,
    items: [
      { subject: shape("butterfly"), caption: "Cánh bướm" },
      { subject: shape("leaf"), caption: "Chiếc lá" },
      { subject: shape("gate"), caption: "Cổng đền" },
      { subject: shape("house"), caption: "Ngôi nhà" },
    ],
  },
  "gap-doi-vat": {
    kind: "foldCards",
    label:
      "Bốn thẻ để gấp đôi: cánh bướm, cổng đền, chiếc lá và hình bình hành",
    items: [
      { shape: "butterfly", line: axis(0) },
      { shape: "gate", line: axis(0) },
      { shape: "leaf", line: axis(0) },
      { shape: "parallelogram", line: fake(0) },
    ],
    verb: "gấp",
    done: "Bạn đã gấp cả bốn hình.",
  },
  "cham-gap-doi": {
    kind: "strip",
    label: "Chiếc ô, cái chuông, chữ Z và tam giác lệch",
    mode: "tap",
    columns: 2,
    items: [
      shapeItem("chiec-o", "umbrella", "Chiếc ô"),
      shapeItem("cai-chuong", "bell", "Cái chuông"),
      glyphItem("chu-z", "Z", "Chữ Z"),
      shapeItem("tam-giac-lech", "scalene", "Tam giác lệch"),
    ],
  },

  // Section 2: the axis of symmetry
  "truc-nha-cac-buoc": {
    kind: "foldSteps",
    shape: "house",
    axis: 0,
    frames: [
      { t: 0, caption: "Ngôi nhà và đường thẳng d chia nó thành hai nửa." },
      { t: 0.5, caption: "Gấp nửa bên phải sang trái theo đường d." },
      { t: 1, caption: "Hai nửa chồng khít nhau. Đường d là trục đối xứng." },
    ],
  },
  "truc-nha-quy-tac": {
    kind: "subject",
    subject: shape("house"),
    axes: true,
    axisLabel: "d",
    width: PICTURE_WIDTH,
  },
  "gap-thu-ngoi-nha": {
    kind: "foldLab",
    shape: "house",
    lines: [axis(0), fake(0), fake(2), fake(1)],
    done: "Bạn đã gấp thử cả bốn đường. Chỉ đường thẳng đứng ở giữa là trục.",
  },
  "lines-butterfly": {
    kind: "lines",
    shape: "butterfly",
    lines: [fake(0), fake(1), axis(0), fake(2)],
  },
  "lines-gate": {
    kind: "lines",
    shape: "gate",
    lines: [fake(1), axis(0), fake(0), fake(2)],
  },

  // Section 3: the rectangle and the rhombus
  "chu-nhat-gap-thu": {
    kind: "foldLab",
    shape: "rectangle",
    lines: [axis(0), fake(0), axis(1), fake(1)],
    done: "Hình chữ nhật này có hai trục. Đường chéo của nó không phải trục.",
  },
  "thoi-gap-thu": {
    kind: "foldLab",
    shape: "rhombus",
    lines: [axis(0), axis(1), fake(0), fake(1)],
    done: "Hình thoi có hai trục, là hai đường chéo.",
  },
  "chu-nhat-thoi-quy-tac": {
    kind: "gallery",
    label: "Hình chữ nhật và hình thoi, mỗi hình có hai trục đối xứng",
    columns: 2,
    items: [
      {
        subject: shape("rectangle"),
        axes: true,
        caption: "Hình chữ nhật: 2 trục",
      },
      { subject: shape("rhombus"), axes: true, caption: "Hình thoi: 2 trục" },
    ],
  },
  "lines-rectangle": {
    kind: "lines",
    shape: "tallrect",
    lines: [fake(0), axis(0), fake(1), axis(1)],
  },
  "chon-truc-thoi": {
    kind: "axisPicker",
    groups: [
      { shape: "flatrhombus", lines: [fake(0), axis(1), fake(1), axis(0)] },
    ],
  },

  // Section 4: the isosceles trapezoid and the parallelogram
  "thang-can-gap-thu": {
    kind: "foldLab",
    shape: "trapezoid",
    lines: [fake(0), axis(0), fake(1), fake(2)],
    done: "Hình thang cân chỉ có một trục.",
  },
  "binh-hanh-gap-thu": {
    kind: "foldLab",
    shape: "parallelogram",
    lines: [fake(0), fake(2), fake(1), fake(3)],
    done: "Gấp theo đường nào hai nửa cũng lệch nhau. Hình bình hành này không có trục.",
  },
  "thang-can-binh-hanh-quy-tac": {
    kind: "gallery",
    label: "Hình thang cân có một trục, hình bình hành lệch không có trục",
    columns: 2,
    items: [
      {
        subject: shape("trapezoid"),
        axes: true,
        caption: "Hình thang cân: 1 trục",
      },
      {
        subject: shape("parallelogram"),
        caption: "Hình bình hành lệch: không có trục",
      },
    ],
  },

  // Section 5: the regular shapes
  "hinh-deu-the": {
    kind: "axisCards",
    label:
      "Bốn thẻ: hình tam giác đều, hình vuông, hình lục giác đều và hình tròn",
    items: [
      shape("triangle"),
      shape("square"),
      shape("hexagon"),
      shape("circle"),
    ],
    verb: "xem",
    done: "Bạn đã xem cả bốn hình.",
  },
  "hinh-deu-quy-tac": {
    kind: "gallery",
    label: "Số trục đối xứng của các hình đều",
    columns: 2,
    items: [
      {
        subject: shape("triangle"),
        axes: true,
        caption: "Hình tam giác đều: 3 trục",
      },
      { subject: shape("square"), axes: true, caption: "Hình vuông: 4 trục" },
      {
        subject: shape("hexagon"),
        axes: true,
        caption: "Hình lục giác đều: 6 trục",
      },
      {
        subject: shape("circle"),
        axes: true,
        caption: "Hình tròn: vô số trục",
      },
    ],
  },
  "chon-truc-tam-giac": {
    kind: "axisPicker",
    groups: [
      {
        shape: "triangle",
        lines: [axis(1), fake(0), axis(0), axis(2), fake(1)],
      },
    ],
    done: "Hình tam giác đều có 3 trục.",
  },

  // Section 6: letters and digits
  "chu-cai-the": {
    kind: "axisCards",
    label: "Bốn thẻ chữ: T, E, I và L",
    items: [glyph("T"), glyph("E"), glyph("I"), glyph("L")],
    verb: "xem",
    done: "Bạn đã xem cả bốn chữ.",
  },
  "chu-cai-quy-tac": {
    kind: "gallery",
    label: "Trục đối xứng của các chữ T, E, I và L",
    columns: 2,
    items: [
      { subject: glyph("T"), axes: true, caption: "Chữ T: 1 trục thẳng đứng" },
      { subject: glyph("E"), axes: true, caption: "Chữ E: 1 trục nằm ngang" },
      { subject: glyph("I"), axes: true, caption: "Chữ I: 2 trục" },
      { subject: glyph("L"), axes: true, caption: "Chữ L: không có trục" },
    ],
  },
  "cham-chu-mot-truc": {
    kind: "strip",
    label: "Bốn chữ cái: K, W, G và P",
    mode: "tap",
    columns: 2,
    items: [
      glyphItem("chu-k", "K", "Chữ K"),
      glyphItem("chu-w", "W", "Chữ W"),
      glyphItem("chu-g", "G", "Chữ G"),
      glyphItem("chu-p", "P", "Chữ P"),
    ],
  },

  // Section 7: everyday things and symbols
  "bieu-tuong-the": {
    kind: "axisCards",
    label:
      "Bốn thẻ: biển cấm đi ngược chiều, trái tim, mũi tên và đám mây bị gió thổi lệch",
    items: [shape("nosign"), shape("heart"), shape("arrow"), shape("cloud")],
    verb: "xem",
    done: "Bạn đã xem cả bốn hình.",
  },
  "do-vat-quy-tac": {
    kind: "gallery",
    label:
      "Trái tim có một trục, biển cấm có hai trục, đám mây lệch không có trục",
    columns: 3,
    items: [
      { subject: shape("heart"), axes: true, caption: "Trái tim: 1 trục" },
      { subject: shape("nosign"), axes: true, caption: "Biển cấm: 2 trục" },
      { subject: shape("cloud"), caption: "Đám mây lệch: không có trục" },
    ],
  },
  "so-truc-tong-hop": {
    kind: "gallery",
    label: "Số trục đối xứng của sáu hình",
    columns: 3,
    items: [
      { subject: shape("parallelogram"), caption: "Không có trục" },
      { subject: shape("trapezoid"), axes: true, caption: "1 trục" },
      { subject: shape("rectangle"), axes: true, caption: "2 trục" },
      { subject: shape("plus"), axes: true, caption: "4 trục" },
      { subject: shape("hexagon"), axes: true, caption: "6 trục" },
      { subject: shape("circle"), axes: true, caption: "Vô số trục" },
    ],
  },

  // Section 8: the mirror image of a point
  "diem-cac-buoc": { kind: "steps", ...POINT_STEPS },
  "diem-quy-tac": {
    kind: "mirrorStill",
    board: POINTS_RULE,
    show: "solved",
    links: true,
  },
  "diem-dem-o": {
    kind: "mirrorStill",
    board: POINT_DEMO,
    show: "demo",
    from: [0, 1],
  },
  "diem-dem-o-ngang": {
    kind: "mirrorStill",
    board: POINT_DEMO_HORIZONTAL,
    show: "demo",
    from: [2, 1],
  },
  "cot-cua-diem": {
    kind: "mirrorStill",
    board: COLUMN_QUESTION,
    show: "given",
  },
  "hang-cua-diem": { kind: "mirrorStill", board: ROW_QUESTION, show: "given" },
  "diem-cung-lam": { kind: "mirror", board: POINTS_GUIDED },
  "diem-tap-lam": { kind: "mirror", board: POINT_EXERCISE },

  // Section 9: completing a drawing
  "ve-cac-buoc": {
    kind: "mirrorSteps",
    board: PLUS_STEPS,
    start: "Đây là nửa trái của dấu cộng và đường thẳng d.",
    end: "Các đoạn đã nối: ta được dấu cộng có trục đối xứng d. Đỉnh nằm trên d thì giữ nguyên.",
  },
  "ve-quy-tac": { kind: "mirrorStill", board: VASE_RULE, show: "solved" },
  "ve-cung-lam": { kind: "mirror", board: COMPLETE_GUIDED },
  "ve-tap-lam": { kind: "mirror", board: COMPLETE_EXERCISE },

  // Section 10: an axis that runs along the diagonal of the squares
  "cheo-cac-buoc": {
    kind: "mirrorSteps",
    board: DIAGONAL_STEPS_BOARD,
    start: "Đây là nửa hình và trục nghiêng d.",
    end: "Các đoạn đã nối: ta được hình có trục đối xứng d.",
  },
  "cheo-quy-tac": {
    kind: "mirrorStill",
    board: DIAGONAL_RULE,
    show: "solved",
    links: true,
  },
  "cheo-dem-o": {
    kind: "mirrorStill",
    board: DIAGONAL_DEMO,
    show: "demo",
    from: [5, 1],
  },
  "cheo-cung-lam": { kind: "mirror", board: DIAGONAL_GUIDED },
  "cheo-tap-lam": { kind: "mirror", board: DIAGONAL_EXERCISE },

  // Section 11: paper folded and cut
  "gap-giay-cac-buoc": {
    kind: "paperTwice",
    frames: [
      {
        t: 1,
        u: 1,
        caption: "Tờ giấy gấp hai lần, cắt một hình chữ nhật nhỏ ở góc.",
      },
      { t: 1, u: 0, caption: "Mở nếp gấp thứ hai ra." },
      { t: 0, u: 0, caption: "Mở nếp gấp thứ nhất ra: hình giống chữ số 0." },
    ],
  },
  "gap-giay-quy-tac": {
    kind: "paperOpen",
    paper: "h",
    frames: [
      {
        t: 1,
        caption: "Gấp đôi tờ giấy, cắt một lỗ tròn không chạm nếp gấp.",
      },
      { t: 0.5, caption: "Mở tờ giấy ra." },
      {
        t: 0,
        caption:
          "Có thêm một lỗ đối xứng với lỗ vừa cắt qua nếp gấp: tất cả 2 lỗ.",
      },
    ],
  },
  "gap-giay-lo-hai-lan": {
    kind: "paperTwice",
    sheet: "holes",
    frames: [
      {
        t: 1,
        u: 1,
        caption: "Gấp hai lần rồi cắt một lỗ nhỏ, lỗ không chạm nếp nào.",
      },
      {
        t: 1,
        u: 0,
        caption: "Mở nếp gấp thứ hai. Mở nốt nếp thứ nhất thì có thêm mấy lỗ?",
      },
    ],
  },
  "goi-y-gap-giay": {
    kind: "paperOpen",
    paper: "t",
    frames: [
      { t: 1, caption: "Gấp đôi tờ giấy rồi cắt một hình tam giác." },
      { t: 0.5, caption: "Mở tờ giấy ra." },
      { t: 0, caption: "Được hình thoi có trục đối xứng là nếp gấp." },
    ],
  },
  "gap-giay-cung-lam": {
    kind: "axisPicker",
    groups: [{ shape: "sheet", lines: [fake(0), axis(1), axis(0), fake(1)] }],
    done: "Hai nếp gấp là hai trục đối xứng của hình.",
  },

  // The workbook: pickers, strips and still pictures
  "chon-truc-cong": {
    kind: "axisPicker",
    groups: [{ shape: "gate", lines: [axis(0), fake(1), fake(0), fake(2)] }],
  },
  "chon-truc-la": {
    kind: "axisPicker",
    groups: [{ shape: "leaf", lines: [fake(1), fake(2), axis(0), fake(0)] }],
  },
  "chon-truc-chu-thap": {
    kind: "axisPicker",
    groups: [{ shape: "cross", lines: [axis(0), fake(0), axis(1), fake(1)] }],
  },
  "sbt-5-2-chon": {
    kind: "axisPicker",
    groups: [
      { shape: "parallelogram", lines: [fake(0), fake(1), fake(2), fake(3)] },
      { shape: "trapezoid", lines: [fake(0), axis(0), fake(1), fake(2)] },
      { shape: "rectangle", lines: [fake(0), axis(0), fake(1), axis(1)] },
      { shape: "rhombus", lines: [axis(0), fake(0), axis(1), fake(1)] },
    ],
  },
  "sbt-5-2-giai": {
    kind: "gallery",
    label: "Trục đối xứng của bốn hình",
    columns: 2,
    items: [
      {
        subject: shape("parallelogram"),
        caption: "Hình bình hành: không có trục",
      },
      {
        subject: shape("trapezoid"),
        axes: true,
        caption: "Hình thang cân: 1 trục",
      },
      {
        subject: shape("rectangle"),
        axes: true,
        caption: "Hình chữ nhật: 2 trục",
      },
      { subject: shape("rhombus"), axes: true, caption: "Hình thoi: 2 trục" },
    ],
  },
  "sbt-5-1-giai": {
    kind: "gallery",
    label: "Số trục đối xứng của bốn hình",
    columns: 2,
    items: [
      {
        subject: shape("triangle"),
        axes: true,
        caption: "Hình tam giác đều: 3 trục",
      },
      { subject: shape("square"), axes: true, caption: "Hình vuông: 4 trục" },
      {
        subject: shape("hexagon"),
        axes: true,
        caption: "Hình lục giác đều: 6 trục",
      },
      {
        subject: shape("circle"),
        axes: true,
        caption: "Hình tròn: vô số trục",
      },
    ],
  },
  "goi-y-dem-truc": {
    kind: "gallery",
    label: "Dấu cộng và bốn trục đối xứng của nó",
    columns: 1,
    items: [
      {
        subject: shape("plus"),
        axes: true,
        caption: "Dấu cộng: gấp theo từng đường hồng, đếm được 4 trục",
      },
    ],
  },
  "goi-y-gap-thu": {
    kind: "foldSteps",
    shape: "leaf",
    axis: 0,
    frames: [
      { t: 0, caption: "Thử gấp đôi hình theo một đường thẳng." },
      { t: 0.5, caption: "Nhìn mép của hai nửa: có trùng nhau không?" },
    ],
  },
  "goi-y-gap-sai": {
    kind: "foldSteps",
    shape: "leaf",
    axis: 0,
    fake: 2,
    frames: [
      { t: 0, caption: "Thử gấp chiếc lá này theo một đường nghiêng." },
      { t: 0.5, caption: "Nhìn mép của hai nửa: có trùng nhau không?" },
    ],
  },
  "goi-y-ve-hinh": {
    kind: "gallery",
    label: "Chữ T và trục đối xứng thẳng đứng của nó",
    columns: 1,
    items: [
      {
        subject: glyph("T"),
        axes: true,
        caption: "Hình có trục: hai nửa giống hệt nhau, gấp đôi là khít",
      },
    ],
  },
  "goi-y-chu": {
    kind: "gallery",
    label: "Trục đối xứng của các chữ E, T và L",
    columns: 3,
    items: [
      { subject: glyph("E"), axes: true, caption: "Chữ E: 1 trục" },
      { subject: glyph("T"), axes: true, caption: "Chữ T: 1 trục" },
      { subject: glyph("L"), axes: true, caption: "Chữ L: không có trục" },
    ],
  },
  "goi-y-ba-the": {
    kind: "gallery",
    label: "Các thẻ số 0, 1 và 8 đều có trục nằm ngang",
    columns: 3,
    items: [
      { subject: glyph("0"), axes: true, caption: "Số 0: 2 trục" },
      { subject: glyph("1"), axes: true, caption: "Số 1: 2 trục" },
      { subject: glyph("8"), axes: true, caption: "Số 8: 2 trục" },
    ],
  },
  "sbt-5-3-chu": {
    kind: "strip",
    label: "Các chữ cái A, B, H, M, N, X, Y, Z và các chữ số 0, 2, 3, 8, 9",
    mode: "tap",
    columns: 5,
    items: bookLetterItems,
  },
  "sbt-5-3-giai": {
    kind: "strip",
    label: "Trục đối xứng của các chữ cái và chữ số",
    mode: "still",
    axes: true,
    columns: 5,
    items: bookLetterItems,
  },
  "cham-chu-d-v": {
    kind: "strip",
    label: "Bốn chữ cái: D, V, P và L",
    mode: "tap",
    columns: 2,
    items: [
      glyphItem("chu-d", "D", "Chữ D"),
      glyphItem("chu-v", "V", "Chữ V"),
      glyphItem("chu-p", "P", "Chữ P"),
      glyphItem("chu-l", "L", "Chữ L"),
    ],
  },
  "sbt-5-4-bieu-tuong": {
    kind: "gallery",
    label: "Ba biểu tượng: Hòa bình, Hội Chữ thập đỏ và ngành Y Dược",
    columns: 3,
    items: [
      { subject: shape("peace"), caption: "Biểu tượng Hòa bình" },
      { subject: shape("plus"), caption: "Biểu tượng Hội Chữ thập đỏ" },
      { subject: shape("medical"), caption: "Biểu tượng ngành Y Dược" },
    ],
  },
  "sbt-5-4-giai": {
    kind: "gallery",
    label: "Trục đối xứng của ba biểu tượng",
    columns: 3,
    items: [
      { subject: shape("peace"), axes: true, caption: "Hòa bình: 1 trục" },
      { subject: shape("plus"), axes: true, caption: "Chữ thập đỏ: 4 trục" },
      { subject: shape("medical"), caption: "Y Dược: không có trục" },
    ],
  },
  "sbt-5-5-chon": {
    kind: "axisPicker",
    groups: [
      { shape: "pentomino", lines: [fake(0), fake(1), fake(2), fake(3)] },
      {
        shape: "star",
        lines: [axis(0), fake(0), axis(1), axis(2), axis(3), axis(4)],
      },
      { shape: "staircase", lines: [axis(0), fake(0), axis(1), fake(1)] },
    ],
  },
  "sbt-5-5-giai": {
    kind: "gallery",
    label: "Trục đối xứng của ba hình",
    columns: 3,
    items: [
      { subject: shape("pentomino"), caption: "Không có trục" },
      { subject: shape("star"), axes: true, caption: "5 trục" },
      { subject: shape("staircase"), axes: true, caption: "2 trục" },
    ],
  },
  l56a: { kind: "mirror", board: LEAD_56A },
  l56b: { kind: "mirror", board: LEAD_56B },
  l56c: { kind: "mirror", board: LEAD_56C },
  "sbt-5-6a-ve": { kind: "mirror", board: BOOK_56A },
  "sbt-5-6a-giai": { kind: "mirrorStill", board: BOOK_56A, show: "solved" },
  "sbt-5-6b-ve": { kind: "mirror", board: BOOK_56B },
  "sbt-5-6b-giai": { kind: "mirrorStill", board: BOOK_56B, show: "solved" },
  "sbt-5-6c-ve": { kind: "mirror", board: BOOK_56C },
  "sbt-5-6c-giai": { kind: "mirrorStill", board: BOOK_56C, show: "solved" },
  "paper-t": { kind: "paperFolded", paper: "t" },
  "sbt-5-7-hinh": {
    kind: "papers",
    label: "Ba tờ giấy đã gấp đôi và cắt: tờ a, tờ b và tờ c",
    items: [
      { paper: "v", open: false, caption: "Tờ giấy a" },
      { paper: "m", open: false, caption: "Tờ giấy b" },
      { paper: "o", open: false, caption: "Tờ giấy c" },
    ],
  },
  "sbt-5-7-giai": {
    kind: "papers",
    label: "Ba tờ giấy mở ra: chữ V, chữ M và chữ O",
    items: [
      { paper: "v", open: true, caption: "Tờ a: chữ V" },
      { paper: "m", open: true, caption: "Tờ b: chữ M" },
      { paper: "o", open: true, caption: "Tờ c: chữ O" },
    ],
  },
  l58a: { kind: "mirror", board: LEAD_58A },
  l58b: { kind: "mirror", board: LEAD_58B },
  "sbt-5-8a-ve": { kind: "mirror", board: BOOK_58A },
  "sbt-5-8a-giai": { kind: "mirrorStill", board: BOOK_58A, show: "solved" },
  "sbt-5-8b-ve": { kind: "mirror", board: BOOK_58B },
  "sbt-5-8b-giai": { kind: "mirrorStill", board: BOOK_58B, show: "solved" },
  l59: { kind: "edges", board: LEAD_59 },
  "sbt-5-9-ve": { kind: "edges", board: BOOK_59 },
  "sbt-5-9a-giai": {
    kind: "edgesStill",
    board: BOOK_59,
    params: { length: 4, axes: 1 },
    path: [
      [2, 1],
      [3, 1],
      [3, 2],
      [3, 3],
      [2, 3],
    ],
  },
  "sbt-5-9b-giai": {
    kind: "edgesStill",
    board: BOOK_59,
    params: { length: 4, axes: 2 },
    path: [
      [2, 1],
      [3, 1],
      [3, 2],
      [2, 2],
      [2, 3],
    ],
  },
  "sbt-5-9c-giai": {
    kind: "edgesStill",
    board: BOOK_59,
    params: { length: 8, axes: 4 },
  },
  "sbt-5-10-the": {
    kind: "digitCards",
    label: "Bảy thẻ số: 0, 1, 2, 5, 6, 8 và 9",
    digits: ["0", "1", "2", "5", "6", "8", "9"],
  },
  "sbt-5-10-giai": {
    kind: "numbers",
    label: "Mười số ghép được từ các thẻ và trục đối xứng của chúng",
    columns: 5,
    items: [
      ...(["180", "810", "108", "801"] as const).map((n) => numberItem(n, "h")),
      ...(["205", "502", "215", "512", "285", "582"] as const).map((n) =>
        numberItem(n, "v"),
      ),
    ],
  },
  "l510-the": {
    kind: "digitCards",
    label: "Ba thẻ chữ chưa xếp: b, d và H",
    digits: ["H", "b", "d"],
    loose: true,
  },
  sticker: { kind: "sticker" },
};
