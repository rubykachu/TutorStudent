import type { ConceptColor } from "@/schema/content";
import type { Row } from "@/visuals/shared/formula-rows";
import type { FigureSpec, Pt } from "@/visuals/shared/plane/figure-spec";
import { calc, figure, row } from "./builders";
import { boxOf, fitInto, gridFigure, shape, units } from "./figures";
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
        // The side's length goes in the corner triangle outside the rhombus.
        texts: [
          {
            x: 0.35 * a[0] + 0.35 * top[0] + 0.3 * left[0],
            y: 0.35 * a[1] + 0.35 * top[1] + 0.3 * left[1],
            text: `${side} cm`,
            tone: "ink",
          },
        ],
      };
    },
  });
}

// A rectangle w by h with a rectangle nw by nh taken out of its bottom right
// corner. Corners A (bottom left), B, C, D, E, F go round the shape.
function notched(
  label: string,
  o: { w: number; h: number; nw: number; nh: number },
  sides: readonly { i: number; text: string }[],
  completed: boolean,
  canvas: { w: number; h: number } | undefined = undefined,
): FigureSpec {
  const { w, h, nw, nh } = o;
  return shape({
    label,
    ...(canvas ?? {}),
    corners: [
      [0, h],
      [0, 0],
      [w, 0],
      [w, h - nh],
      [w - nw, h - nh],
      [w - nw, h],
    ],
    names: true,
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
        ],
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

// Canvas of the pictures above a worked solution: small, so their writing stays
// above 16px when the solution's lines take the rest of the frame.
const CALC_CANVAS = { w: 270, h: 160 } as const;

// ---------------------------------------------------------------- the rows

const sTag = (text: string): readonly [string, ConceptColor] => [text, "teal"];
const cTag = (text: string): readonly [string, ConceptColor] => [text, "blue"];

type Pair = {
  hint: readonly Row[];
  solution: readonly Row[];
  hintFigure?: FigureSpec;
  solutionFigure?: FigureSpec;
};

// For each book exercise: the hint shows the same steps with other numbers and
// ends on a row that stays a "?"; the solution runs the exercise's numbers.
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
      row(`56 : 8 = 7\\ ${TEX.cm}`, sTag("chiều còn lại")),
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
      row(`2 \\cdot (24 + 18) = 84\\ ${TEX.cm}`, cTag("chu vi hình chữ nhật")),
      row(`4 \\cdot 15 = 60\\ ${TEX.cm}`, cTag("chu vi hình thoi")),
      row(`24 + 18 = 42\\ ${TEX.cm}`, cTag("hai đường chéo")),
      row(`84 + 60 + 42 = 186\\ ${TEX.cm}`),
    ],
    solution: [
      row(`2 \\cdot (80 + 60) = 280\\ ${TEX.cm}`, cTag("chu vi hình chữ nhật")),
      row(`50 \\cdot 4 = 200\\ ${TEX.cm}`, cTag("chu vi hình thoi")),
      row(`60 + 80 = 140\\ ${TEX.cm}`, cTag("hai đường chéo")),
      row(
        `\\begin{gathered} 280 + 200 + 140 \\\\ = 620\\ ${TEX.cm} = 6{,}2\\ ${TEX.m} \\end{gathered}`,
        cTag("tổng"),
      ),
      row(`6{,}2\\ ${TEX.m} > 6\\ ${TEX.m}`, ["không đủ", "slate"]),
    ],
  },
  "4-24": {
    hint: [
      row(`C = 2 \\cdot (9 + 5) = 28\\ ${TEX.m}`, cTag("chu vi")),
      row(`S = 9 \\cdot 5 - 2 \\cdot 2`, sTag("hình lớn trừ phần khuyết")),
      row(`S = 41\\ ${TEX.m2}`),
    ],
    solution: [
      row(`C = 2 \\cdot (6 + 8) = 28\\ ${TEX.m}`, cTag("chu vi")),
      row(
        `S = 6 \\cdot 8 - 2 \\cdot 2 = 44\\ ${TEX.m2}`,
        sTag("hình lớn trừ phần khuyết"),
      ),
    ],
    solutionFigure: notched(
      "Mảnh vườn kẻ thêm để thành hình chữ nhật 6 m và 8 m",
      { w: 8, h: 6, nw: 2, nh: 2 },
      [
        { i: 1, text: "8 m" },
        { i: 0, text: "6 m" },
      ],
      true,
      CALC_CANVAS,
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
      row(`1\\,200 : 30 = 40\\ ${TEX.m}`, sTag("chiều dài vườn")),
      row(`2 \\cdot (30 + 40) - 4 = 136\\ ${TEX.m}`, cTag("chu vi trừ cửa")),
      row(`136 \\cdot 3 = 408\\ ${TEX.m}`),
    ],
    solution: [
      row(`3\\,600 : 40 = 90\\ ${TEX.m}`, sTag("chiều dài vườn")),
      row(`2 \\cdot (40 + 90) = 260\\ ${TEX.m}`, cTag("chu vi")),
      row(`260 - 5 = 255\\ ${TEX.m}`, cTag("trừ chỗ cửa")),
      row(`255 \\cdot 2 = 510\\ ${TEX.m}`, ["hai tầng dây", "slate"]),
    ],
  },
  "4-27": {
    hint: [
      row(
        `\\begin{gathered} 18\\ ${TEX.m} = 1\\,800\\ ${TEX.cm} \\\\ 1\\,800 : 40 = 45 \\end{gathered}`,
        cTag("viên mỗi hàng"),
      ),
      row(
        `\\begin{gathered} 10\\ ${TEX.m} = 1\\,000\\ ${TEX.cm} \\\\ 1\\,000 : 40 = 25 \\end{gathered}`,
        cTag("số hàng"),
      ),
      row(
        `\\begin{gathered} 45 \\cdot 25 = 1\\,125 \\\\ 1\\,125 : 5 = 225 \\end{gathered}`,
      ),
    ],
    solution: [
      row(
        `\\begin{gathered} 15\\ ${TEX.m} = 1\\,500\\ ${TEX.cm} \\\\ 1\\,500 : 60 = 25 \\end{gathered}`,
        cTag("viên mỗi hàng"),
      ),
      row(
        `\\begin{gathered} 9\\ ${TEX.m} = 900\\ ${TEX.cm} \\\\ 900 : 60 = 15 \\end{gathered}`,
        cTag("số hàng"),
      ),
      row(`25 \\cdot 15 = 375`, sTag("số viên gạch")),
      row(`375 : 5 = 75`, ["số thùng gạch", "slate"]),
    ],
  },
  "4-28": {
    hint: [
      row(`12 \\cdot 5 = 60\\ ${TEX.m2}`, sTag("diện tích sân")),
      row(
        `0{,}5 \\cdot 0{,}5 \\cdot 200 = 50\\ ${TEX.m2}`,
        sTag("diện tích đá lát"),
      ),
      row(
        `\\begin{gathered} 60 - 50 = 10\\ ${TEX.m2} \\\\ 10 \\cdot 20\\,000 = 200\\,000 \\end{gathered}`,
      ),
    ],
    solution: [
      row(`20 \\cdot 30 = 600\\ ${TEX.m2}`, sTag("diện tích sân")),
      row(
        `0{,}6 \\cdot 0{,}6 \\cdot 1\\,400 = 504\\ ${TEX.m2}`,
        sTag("diện tích đá lát"),
      ),
      row(`600 - 504 = 96\\ ${TEX.m2}`, sTag("diện tích trồng cỏ")),
      row(`96 \\cdot 30\\,000 = 2\\,880\\,000`, ["đồng", "slate"]),
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
      "Mảnh vườn có hình dạng như hình chữ nhật bị khuyết một góc",
      { w: 8, h: 6, nw: 2, nh: 2 },
      [
        { i: 1, text: "8 m" },
        { i: 0, text: "6 m" },
        { i: 2, text: "4 m" },
        { i: 5, text: "6 m" },
      ],
      false,
    ),
  ),
  "sbt-hinh-4-25": figure(
    trapezoidHexagon(
      "Viên đá lát hình lục giác đều ghép từ tám viên đá hình thang cân",
    ),
  ),
  // Figures of the lead-in steps.
  "dan-khung-40-30": figure(
    windowFrame(
      "Khung hình chữ nhật 40 cm và 30 cm có khung sắt hình thoi",
      40,
      30,
      25,
    ),
  ),
  "dan-khuyet-10-6": figure(
    notched(
      "Mảnh vườn hình chữ nhật 10 m và 6 m bị cắt mất một góc hình vuông",
      { w: 10, h: 6, nw: 3, nh: 3 },
      [
        { i: 1, text: "10 m" },
        { i: 0, text: "6 m" },
      ],
      false,
    ),
  ),
  // Hints and solutions.
  ...Object.fromEntries(
    Object.keys(PAIRS).flatMap((key) => [
      [`goi-y-${key}`, hintOf(key)],
      [`giai-${key}`, solutionOf(key)],
    ]),
  ),
  // Reminders at the head of the section.
  "nam-hinh-cong-thuc": {
    kind: "rows",
    label: "Công thức diện tích của năm hình",
    rows: [
      row("S = a \\cdot a", ["Hình vuông", "teal"]),
      row("S = a \\cdot b", ["Hình chữ nhật", "teal"]),
      row("S = a \\cdot b : 2", ["Hình thoi", "teal"]),
      row("S = a \\cdot h", ["Hình bình hành", "teal"]),
      row("S = (a + b) \\cdot h : 2", ["Hình thang cân", "teal"]),
    ],
  },
  "khuyet-nhac-lai": figure(
    notched(
      "Hình chữ nhật bị khuyết một góc, kẻ thêm để thành hình chữ nhật lớn",
      { w: 9, h: 6, nw: 3, nh: 2 },
      [],
      true,
    ),
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
      y: 30,
      w: 320,
      h: 168,
      fill: "teal",
      texts: [
        { x: 160, y: 12, text: "dài", tone: "ink" },
        { x: 34, y: 30 + 54, text: "rộng", tone: "ink" },
      ],
    }),
  ),
};

// The exercises that have a hint and a solution picture, for the tests.
export const BOOK_PAIR_KEYS: readonly string[] = Object.keys(PAIRS);
