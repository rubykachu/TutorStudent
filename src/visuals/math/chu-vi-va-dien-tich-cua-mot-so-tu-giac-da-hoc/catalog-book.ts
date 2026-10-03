import type { ConceptColor } from "@/schema/content";
import type { Row } from "@/visuals/shared/formula-rows";
import type { FigureSpec, Pt } from "@/visuals/shared/plane/figure-spec";
import { calc, figure, row, steps } from "./builders";
import {
  boxOf,
  centroid,
  fitInto,
  gridFigure,
  shape,
  sideTextAt,
  units,
} from "./figures";
import type { VisualSpec } from "./spec";

// Pictures of the book-practice section: the figures of the workbook's
// exercises redrawn, the figures of their lead-in steps, the reminder
// pictures, and for every book exercise the hint (the same steps with other
// numbers, stopping at a "?") and the solution (the steps with its numbers).

const TEX = {
  cm: "\\mathrm{cm}",
  m: "\\mathrm{m}",
  cm2: "\\mathrm{cm}^{2}",
  m2: "\\mathrm{m}^{2}",
} as const;

// A rectangle w by h whose sides' middles are joined into a rhombus, with
// the two lines between opposite middles (the diagonals of the rhombus).
function windowFrame(
  label: string,
  w: number,
  h: number,
  side: number,
): FigureSpec {
  return shape({
    label,
    corners: units.rect(w, h),
    sides: [
      { i: 0, text: `${w} cm` },
      { i: 3, text: `${h} cm` },
    ],
    extra: (pts) => {
      const [a, b, c, d] = [pts.A, pts.B, pts.C, pts.D] as [Pt, Pt, Pt, Pt];
      const top: Pt = [(a[0] + b[0]) / 2, a[1]];
      const right: Pt = [b[0], (b[1] + c[1]) / 2];
      const bottom: Pt = [(c[0] + d[0]) / 2, c[1]];
      const left: Pt = [a[0], (a[1] + d[1]) / 2];
      return {
        pts: { MT: top, MR: right, MB: bottom, ML: left },
        polys: [{ v: ["MT", "MR", "MB", "ML"], tone: "ink" }],
        segs: [
          { a: "MT", b: "MB", tone: "ink" },
          { a: "ML", b: "MR", tone: "ink" },
        ],
        // The side's length goes in the corner triangle outside the rhombus,
        // beside the side it measures.
        texts: [
          (() => {
            const [x, y] = sideTextAt(
              left,
              top,
              centroid([a, b, c, d]),
              `${side} cm`,
            );
            return { x, y, text: `${side} cm`, tone: "ink" as const };
          })(),
        ],
      };
    },
  });
}

type NotchedOptions = {
  sides: readonly { i: number; text: string }[];
  // Dashes that complete the rectangle the notch was cut from.
  completed?: boolean;
  // Marks the two new sides of the notch and the two stretches they replace
  // as equal pairwise (needs `completed`).
  pairs?: boolean;
  // Writes the corner names A, B, C, … beside the corners.
  names?: boolean;
  canvas?: { w: number; h: number };
};

// A rectangle w by h with a rectangle nw by nh taken out of its bottom right
// corner. Corners A (bottom left), B, C, D, E, F go round the shape; G is the
// corner of the rectangle the notch was cut from.
function notched(
  label: string,
  o: { w: number; h: number; nw: number; nh: number },
  options: NotchedOptions,
): FigureSpec {
  const { w, h, nw, nh } = o;
  const { sides, completed = false, pairs = false, names = false } = options;
  return shape({
    label,
    ...(options.canvas ?? {}),
    corners: [
      [0, h],
      [0, 0],
      [w, 0],
      [w, h - nh],
      [w - nw, h - nh],
      [w - nw, h],
    ],
    names,
    sides,
    extra: (pts) => {
      if (!completed) return {};
      const d = pts.D as Pt;
      const f = pts.F as Pt;
      const g: Pt = [d[0], f[1]];
      return {
        pts: { G: g },
        segs: [
          { a: "D", b: "G", tone: "slate", dash: true },
          { a: "F", b: "G", tone: "slate", dash: true },
          ...(pairs
            ? [
                { a: "D", b: "E", tone: "blue" as const, bold: true },
                { a: "E", b: "F", tone: "blue" as const, bold: true },
              ]
            : []),
        ],
        ...(pairs
          ? {
              ticks: [
                {
                  segs: [
                    ["D", "G"],
                    ["E", "F"],
                  ] as const,
                  count: 1,
                  tone: "blue" as const,
                },
                {
                  segs: [
                    ["F", "G"],
                    ["D", "E"],
                  ] as const,
                  count: 2,
                  tone: "blue" as const,
                },
              ],
            }
          : {}),
      };
    },
  });
}

// A regular hexagon made of eight isosceles trapezoids with bases 10 and 20:
// two make the middle hexagon, six more go round it.
function trapezoidHexagon(label: string): FigureSpec {
  const r = 10;
  const rise = (r * Math.sqrt(3)) / 2;
  const angle = (deg: number) => (deg * Math.PI) / 180;
  const v = (k: number): Pt => [
    r * Math.cos(angle(60 * k)),
    r * Math.sin(angle(60 * k)),
  ];
  const outer = Array.from({ length: 6 }, (_, k) => {
    const from = v(k);
    const to = v(k + 1);
    const nx = Math.cos(angle(60 * k + 30));
    const ny = Math.sin(angle(60 * k + 30));
    const tx = (to[0] - from[0]) / r;
    const ty = (to[1] - from[1]) / r;
    const p: Pt = [
      from[0] + rise * nx - (r / 2) * tx,
      from[1] + rise * ny - (r / 2) * ty,
    ];
    const q: Pt = [
      to[0] + rise * nx + (r / 2) * tx,
      to[1] + rise * ny + (r / 2) * ty,
    ];
    return { p, q };
  });
  const raw: Record<string, Pt> = {};
  for (let k = 0; k < 6; k++) {
    raw[`V${k}`] = v(k);
    raw[`P${k}`] = (outer[k] as { p: Pt }).p;
    raw[`Q${k}`] = (outer[k] as { q: Pt }).q;
  }
  const names = Object.keys(raw);
  const { pts: fitted } = fitInto(
    names.map((name) => raw[name] as Pt),
    boxOf(320, 260, 30),
  );
  const pts: Record<string, Pt> = Object.fromEntries(
    names.map((name, i) => [name, fitted[i] as Pt]),
  );
  const polys: NonNullable<FigureSpec["polys"]> = [
    ...Array.from({ length: 6 }, (_, k) => ({
      v: [`V${k}`, `V${(k + 1) % 6}`, `Q${k}`, `P${k}`],
      tone: "ink" as const,
      fill: "sky" as const,
    })),
    { v: ["V0", "V1", "V2", "V3"], tone: "ink", fill: "slate" },
    { v: ["V3", "V4", "V5", "V0"], tone: "ink", fill: "slate" },
  ];
  return { label, w: 320, h: 260, pts, polys };
}

// A regular hexagon made of three rhombuses round its middle, the last one
// grey: a stone of another colour is still a stone to count.
function rhombusHexagon(label: string): FigureSpec {
  const r = 10;
  const angle = (deg: number) => (deg * Math.PI) / 180;
  const raw: Record<string, Pt> = { O: [0, 0] };
  for (let k = 0; k < 6; k++) {
    raw[`V${k}`] = [r * Math.cos(angle(60 * k)), r * Math.sin(angle(60 * k))];
  }
  const names = Object.keys(raw);
  const { pts: fitted } = fitInto(
    names.map((name) => raw[name] as Pt),
    boxOf(320, 200, 30),
  );
  const pts: Record<string, Pt> = Object.fromEntries(
    names.map((name, i) => [name, fitted[i] as Pt]),
  );
  const polys: NonNullable<FigureSpec["polys"]> = [0, 2, 4].map((k) => ({
    v: ["O", `V${k}`, `V${k + 1}`, `V${(k + 2) % 6}`],
    tone: "ink" as const,
    fill: k === 4 ? ("slate" as const) : ("sky" as const),
  }));
  return { label, w: 320, h: 200, pts, polys };
}

// Canvas of the pictures above a worked solution: small, so their writing stays
// above 16px when the solution's lines take the rest of the frame.
const CALC_CANVAS = { w: 270, h: 160 } as const;

// ---------------------------------------------------------------- the rows

// The tag of a row says what the row finds, in the colour of that thing: the
// perimeter blue, the area teal, a diagonal amber.
// Anything else (a side to find, a count of tiles or boxes, money) is slate.
const sTag = (text: string): readonly [string, ConceptColor] => [text, "teal"];
const cTag = (text: string): readonly [string, ConceptColor] => [text, "blue"];
const dTag = (text: string): readonly [string, ConceptColor] => [text, "amber"];
const nTag = (text: string): readonly [string, ConceptColor] => [text, "slate"];

type Pair = {
  hint: readonly Row[];
  solution: readonly Row[];
  hintFigure?: FigureSpec;
  solutionFigure?: FigureSpec;
};

// For each book exercise: the hint shows the same steps with other numbers and
// ends on a row that stays a "?"; the solution runs the exercise's numbers.
// A row writes its factors in the order of the lesson's rule sentences
// (length times width, 4 times a side, the two bases added then times the
// height). No row shown in a hint equals a number the solution finds (a test
// checks it).
const PAIRS: Record<string, Pair> = {
  "4-20": {
    hint: [
      row(`S = 7 \\cdot 5`, sTag("diện tích")),
      row(`C = 2 \\cdot (7 + 5)`, cTag("chu vi")),
      row(
        `\\begin{gathered} S = 35\\ ${TEX.cm2} \\\\ C = 24\\ ${TEX.cm} \\end{gathered}`,
      ),
    ],
    solution: [
      row(`S = 10 \\cdot 8 = 80\\ ${TEX.cm2}`, sTag("diện tích")),
      row(`C = 2 \\cdot (10 + 8) = 36\\ ${TEX.cm}`, cTag("chu vi")),
    ],
    solutionFigure: shape({
      label: "Hình chữ nhật dài 10 cm, rộng 8 cm",
      corners: units.rect(10, 8),
      ...CALC_CANVAS,
      fill: "teal",
      sides: [
        { i: 0, text: "10 cm" },
        { i: 3, text: "8 cm" },
      ],
    }),
  },
  "4-21": {
    hint: [
      row(
        `45\\ ${TEX.cm2} = 9\\ ${TEX.cm} \\cdot ?`,
        sTag("diện tích = dài · rộng"),
      ),
      row(`45 : 9 = 5\\ ${TEX.cm}`),
    ],
    solution: [
      row(
        `56\\ ${TEX.cm2} = 8\\ ${TEX.cm} \\cdot ?`,
        sTag("diện tích = dài · rộng"),
      ),
      row(`56 : 8 = 7\\ ${TEX.cm}`, nTag("chiều còn lại")),
    ],
  },
  "4-22a": {
    hint: [
      row(`S = 7 \\cdot 7`, sTag("cạnh nhân cạnh")),
      row(`S = 49\\ ${TEX.cm2}`),
    ],
    solution: [row(`S = 5 \\cdot 5 = 25\\ ${TEX.cm2}`, sTag("cạnh nhân cạnh"))],
  },
  "4-22b": {
    hint: [
      row(`S = (4 + 8) \\cdot 5 : 2`, sTag("tổng hai đáy, nhân chiều cao")),
      row(`S = 30\\ ${TEX.cm2}`),
    ],
    solution: [
      row(`(6 + 10) \\cdot 4 = 64`, sTag("tổng hai đáy, nhân chiều cao")),
      row(`S = 64 : 2 = 32\\ ${TEX.cm2}`, sTag("chia cho 2")),
    ],
  },
  "4-22c": {
    hint: [
      row(`S = 8 \\cdot 5 : 2`, sTag("hai đường chéo, chia cho 2")),
      row(`S = 20\\ ${TEX.cm2}`),
    ],
    solution: [
      row(`6 \\cdot 10 = 60`, sTag("nhân hai đường chéo")),
      row(`S = 60 : 2 = 30\\ ${TEX.cm2}`, sTag("chia cho 2")),
    ],
  },
  "4-22d": {
    hint: [
      row(`S = 9 \\cdot 5`, sTag("cạnh đáy nhân chiều cao")),
      row(`S = 45\\ ${TEX.cm2}`),
    ],
    solution: [
      row(`S = 12 \\cdot 4 = 48\\ ${TEX.cm2}`, sTag("cạnh đáy nhân chiều cao")),
    ],
  },
  "4-23": {
    hint: [
      row(`2 \\cdot (16 + 12) = 56\\ ${TEX.cm}`, cTag("chu vi hình chữ nhật")),
      row(`4 \\cdot 10 = 40\\ ${TEX.cm}`, cTag("chu vi hình thoi")),
      row(`16 + 12 = 28\\ ${TEX.cm}`, dTag("hai đường chéo")),
      row(`56 + 40 + 28 = 124\\ ${TEX.cm}`),
    ],
    solution: [
      row(`2 \\cdot (80 + 60) = 280\\ ${TEX.cm}`, cTag("chu vi hình chữ nhật")),
      row(`4 \\cdot 50 = 200\\ ${TEX.cm}`, cTag("chu vi hình thoi")),
      row(`80 + 60 = 140\\ ${TEX.cm}`, dTag("hai đường chéo")),
      row(
        `\\begin{gathered} 280 + 200 + 140 \\\\ = 620\\ ${TEX.cm} = 6{,}2\\ ${TEX.m} \\end{gathered}`,
        nTag("tổng"),
      ),
      row(`6{,}2\\ ${TEX.m} > 6\\ ${TEX.m}`, nTag("không đủ")),
    ],
  },
  "4-24": {
    hint: [
      row(`C = 10 + 5 + 10 + 5 = 30\\ ${TEX.m}`, cTag("chu vi")),
      row(
        `\\begin{gathered} 10 - 7 = 3\\ ${TEX.m} \\\\ 5 - 4 = 1\\ ${TEX.m} \\end{gathered}`,
        nTag("cạnh phần bị cắt"),
      ),
      row(
        `S = 10 \\cdot 5 - 3 \\cdot 1`,
        sTag("hình chữ nhật trừ phần bị cắt"),
      ),
      row(`S = 47\\ ${TEX.m2}`),
    ],
    solution: [
      // No tag on the sides of the cut piece: the hint already named them,
      // and the solution with its picture must still fit a phone.
      row(
        `\\begin{gathered} 8 - 6 = 2\\ ${TEX.m} \\\\ 6 - 4 = 2\\ ${TEX.m} \\end{gathered}`,
      ),
      row(`C = 2 \\cdot (8 + 6) = 28\\ ${TEX.m}`, cTag("chu vi")),
      row(
        `S = 8 \\cdot 6 - 2 \\cdot 2 = 44\\ ${TEX.m2}`,
        sTag("hình chữ nhật trừ phần bị cắt"),
      ),
    ],
    solutionFigure: notched(
      "Mảnh vườn vẽ thêm hai đoạn bù vào chỗ bị cắt, thành hình chữ nhật 8 m và 6 m",
      { w: 8, h: 6, nw: 2, nh: 2 },
      {
        sides: [
          { i: 1, text: "8 m" },
          { i: 0, text: "6 m" },
          { i: 2, text: "4 m" },
          { i: 5, text: "6 m" },
        ],
        completed: true,
        canvas: CALC_CANVAS,
      },
    ),
  },
  "4-25": {
    hint: [
      row(`(4 + 12) \\cdot 6 : 2 = 48\\ ${TEX.cm2}`, sTag("một hình thang")),
      row(`48 \\cdot 8 = 384\\ ${TEX.cm2}`),
    ],
    solution: [
      row(`(10 + 20) \\cdot 8{,}6 : 2 = 129\\ ${TEX.cm2}`, sTag("một viên đá")),
      row(`129 \\cdot 8 = 1\\,032\\ ${TEX.cm2}`, sTag("8 viên đá")),
    ],
  },
  "4-26": {
    hint: [
      row(`1\\,500 : 30 = 50\\ ${TEX.m}`, nTag("chiều dài vườn")),
      row(`2 \\cdot (50 + 30) - 4 = 156\\ ${TEX.m}`, nTag("chu vi trừ cửa")),
      row(`156 \\cdot 3 = 468\\ ${TEX.m}`),
    ],
    solution: [
      row(`3\\,600 : 40 = 90\\ ${TEX.m}`, nTag("chiều dài vườn")),
      row(`2 \\cdot (90 + 40) = 260\\ ${TEX.m}`, cTag("chu vi")),
      row(`260 - 5 = 255\\ ${TEX.m}`, nTag("trừ chỗ cửa")),
      row(`255 \\cdot 2 = 510\\ ${TEX.m}`, nTag("hai tầng dây")),
    ],
  },
  "4-27": {
    hint: [
      row(
        `\\begin{gathered} 18\\ ${TEX.m} = 1\\,800\\ ${TEX.cm} \\\\ 1\\,800 : 50 = 36 \\end{gathered}`,
        nTag("viên mỗi hàng"),
      ),
      row(
        `\\begin{gathered} 10\\ ${TEX.m} = 1\\,000\\ ${TEX.cm} \\\\ 1\\,000 : 50 = 20 \\end{gathered}`,
        nTag("số hàng"),
      ),
      row(
        `\\begin{gathered} 36 \\cdot 20 = 720 \\\\ 720 : 5 = 144 \\end{gathered}`,
      ),
    ],
    solution: [
      row(
        `\\begin{gathered} 15\\ ${TEX.m} = 1\\,500\\ ${TEX.cm} \\\\ 1\\,500 : 60 = 25 \\end{gathered}`,
        nTag("viên mỗi hàng"),
      ),
      row(
        `\\begin{gathered} 9\\ ${TEX.m} = 900\\ ${TEX.cm} \\\\ 900 : 60 = 15 \\end{gathered}`,
        nTag("số hàng"),
      ),
      row(`25 \\cdot 15 = 375`, nTag("số viên gạch")),
      row(`375 : 5 = 75`, nTag("số thùng gạch")),
    ],
  },
  "4-28": {
    hint: [
      row(
        `0{,}4 \\cdot 0{,}4 = 0{,}16\\ ${TEX.m2}`,
        sTag("một viên: 40 cm = 0,4 m"),
      ),
      row(`11 \\cdot 6 = 66\\ ${TEX.m2}`, sTag("diện tích sân")),
      row(`0{,}16 \\cdot 150 = 24\\ ${TEX.m2}`, sTag("diện tích đá lát")),
      row(
        `\\begin{gathered} 66 - 24 = 42\\ ${TEX.m2} \\\\ 42 \\cdot 20\\,000 = 840\\,000 \\end{gathered}`,
      ),
    ],
    solution: [
      row(
        `0{,}6 \\cdot 0{,}6 = 0{,}36\\ ${TEX.m2}`,
        sTag("một viên: 60 cm = 0,6 m"),
      ),
      row(`30 \\cdot 20 = 600\\ ${TEX.m2}`, sTag("diện tích sân")),
      row(`0{,}36 \\cdot 1\\,400 = 504\\ ${TEX.m2}`, sTag("diện tích đá")),
      row(`600 - 504 = 96\\ ${TEX.m2}`, sTag("diện tích cỏ")),
      row(`96 \\cdot 30\\,000 = 2\\,880\\,000`),
    ],
  },
};

const hintOf = (key: string): VisualSpec => {
  const pair = PAIRS[key] as Pair;
  return calc(`Gợi ý bài ${key}`, pair.hint, "hint", pair.hintFigure);
};
const solutionOf = (key: string): VisualSpec => {
  const pair = PAIRS[key] as Pair;
  return calc(
    `Lời giải bài ${key}`,
    pair.solution,
    "steps",
    pair.solutionFigure,
  );
};

// The notch of the reminder: a rectangle 9 m by 6 m with a corner 3 m wide and
// 2 m high cut out.
const REMINDER = { w: 9, h: 6, nw: 3, nh: 2 } as const;

// The picture that shows why the perimeter of a rectangle with a notch is that
// of the rectangle: the two new sides replace two stretches of the same
// length.
function notchPairs(): FigureSpec[] {
  const base = (label: string, options: NotchedOptions) =>
    notched(label, REMINDER, options);
  const rectangleSides = [
    { i: 1, text: "9 m" },
    { i: 0, text: "6 m" },
  ];
  const whole = base("Hình chữ nhật 9 m và 6 m", {
    sides: rectangleSides,
    completed: true,
  });
  return [
    {
      ...whole,
      polys: [{ v: ["A", "B", "C", "G"], tone: "ink" }],
      segs: [],
    },
    base(
      "Hình chữ nhật bị cắt đi một hình chữ nhật nhỏ ở góc, rộng 3 m, cao 2 m",
      {
        sides: rectangleSides,
        completed: true,
      },
    ),
    base("Hai cạnh mới của chỗ cắt bằng hai đoạn đã mất", {
      sides: rectangleSides,
      completed: true,
      pairs: true,
    }),
    {
      ...whole,
      polys: [{ v: ["A", "B", "C", "G"], tone: "blue" }],
      segs: [],
    },
  ];
}

const NOTCH_FRAMES = notchPairs();

export const BOOK_SPECS: Record<string, VisualSpec> = {
  // Figures of the exercises.
  "sbt-hinh-4-19": figure(
    windowFrame(
      "Ô thoáng hình chữ nhật 80 cm và 60 cm có khung sắt hình thoi",
      80,
      60,
      50,
    ),
  ),
  "sbt-hinh-4-20": figure(
    notched(
      "Mảnh vườn có hình dạng như hình chữ nhật bị cắt mất một góc",
      { w: 8, h: 6, nw: 2, nh: 2 },
      {
        sides: [
          { i: 1, text: "8 m" },
          { i: 0, text: "6 m" },
          { i: 2, text: "4 m" },
          { i: 5, text: "6 m" },
        ],
        names: true,
      },
    ),
  ),
  "sbt-hinh-4-25": figure(
    trapezoidHexagon(
      "Viên đá lát hình lục giác đều ghép từ tám viên đá hình thang cân",
    ),
  ),
  // Figures of the lead-in steps.
  "dan-khung-32-24": figure(
    windowFrame(
      "Khung hình chữ nhật 32 cm và 24 cm có khung sắt hình thoi",
      32,
      24,
      20,
    ),
  ),
  "dan-khuyet-10-6": figure(
    notched(
      "Mảnh vườn hình chữ nhật 10 m và 6 m bị cắt mất một hình vuông cạnh 3 m ở góc",
      { w: 10, h: 6, nw: 3, nh: 3 },
      {
        sides: [
          { i: 1, text: "10 m" },
          { i: 0, text: "6 m" },
          { i: 3, text: "3 m" },
          { i: 4, text: "3 m" },
        ],
      },
    ),
  ),
  "dan-luc-giac-3": figure(
    rhombusHexagon(
      "Hình lục giác đều ghép từ ba viên đá hình thoi, hai viên màu xanh nhạt và một viên màu xám",
    ),
  ),
  // Hints and solutions.
  ...Object.fromEntries(
    Object.keys(PAIRS).flatMap((key) => [
      [`goi-y-${key}`, hintOf(key)],
      [`giai-${key}`, solutionOf(key)],
    ]),
  ),
  // The two new sides of the cut are as long as the two stretches they
  // replace, for the lead-in step with a cut corner.
  "khuyet-hai-cap-10-6": figure(
    notched(
      "Hai cạnh mới của chỗ cắt dài 3 m và 3 m, bằng hai đoạn đã mất",
      { w: 10, h: 6, nw: 3, nh: 3 },
      {
        sides: [
          { i: 1, text: "10 m" },
          { i: 0, text: "6 m" },
        ],
        completed: true,
        pairs: true,
      },
    ),
  ),
  // Reminders at the head of the section.
  "nam-hinh-cong-thuc": {
    kind: "rows",
    label: "Công thức diện tích của năm hình",
    rows: [
      row("S = a \\cdot a = a^{2}", ["Hình vuông: a là cạnh", "teal"]),
      row("S = a \\cdot b", ["Hình chữ nhật: a, b là hai cạnh", "teal"]),
      row("S = a \\cdot b : 2", ["Hình thoi: a, b là hai đường chéo", "teal"]),
      row("S = a \\cdot h", [
        "Hình bình hành: a là cạnh đáy, h là chiều cao",
        "teal",
      ]),
      row("S = (a + b) \\cdot h : 2", [
        "Hình thang cân: a, b là hai đáy, h là chiều cao",
        "teal",
      ]),
    ],
  },
  "khuyet-cach-lam": steps(
    "Chu vi hình chữ nhật bị cắt đi một hình chữ nhật nhỏ ở góc",
    [
      "Hình chữ nhật 9 m và 6 m.",
      "Cắt đi một hình chữ nhật nhỏ ở góc, rộng 3 m, cao 2 m.",
      "Hai cạnh mới dài 3 m và 2 m, bằng hai đoạn đã mất.",
      "Nên chu vi không đổi: 2 · (9 + 6) = 30 m.",
    ].map((caption, k) => ({
      figure: NOTCH_FRAMES[k] as FigureSpec,
      caption,
    })),
  ),
  "luc-giac-nhac-lai": figure(
    trapezoidHexagon("Hình lục giác đều ghép từ các hình thang cân giống nhau"),
  ),
  "lat-gach-nhac-lai": figure(
    gridFigure({
      label: "Sân hình chữ nhật lát gạch vuông, đếm số viên theo dài và rộng",
      cols: 5,
      rows: 3,
      cell: 36,
      x: 70,
      y: 32,
      w: 320,
      h: 180,
      fill: "teal",
      texts: [
        { x: 160, y: 14, text: "5 viên mỗi hàng", tone: "ink" },
        { x: 34, y: 32 + 54, text: "3 hàng", tone: "ink" },
        { x: 160, y: 164, text: "5 · 3 = 15 viên", tone: "ink" },
      ],
    }),
  ),
};

// The exercises that have a hint and a solution picture, for the tests.
export const BOOK_PAIR_KEYS: readonly string[] = Object.keys(PAIRS);
