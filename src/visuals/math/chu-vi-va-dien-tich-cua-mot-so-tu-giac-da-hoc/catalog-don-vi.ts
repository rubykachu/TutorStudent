import type { FigureSpec, Pt } from "@/visuals/shared/plane/figure-spec";
import { lerp } from "@/visuals/shared/plane/geometry";
import { calc, figure, gallery, row } from "./builders";
import { gridFigure, shape, units } from "./figures";
import type { VisualSpec } from "./spec";

// Pictures of the unit conversions and of the everyday problems: a metre of
// ten parts, a square metre of ten thousand square centimetres, the three
// bars to convert, a fenced garden with a gate, a tiled floor, and the four
// jobs sorted into perimeter and area.

const RULE_PARTS = 10;
const NBSP = " ";

// A metre rule cut into ten parts of 10 cm.
function metreRule(): FigureSpec {
  const cell = 28;
  const grid = gridFigure({
    label: "Thước một mét chia thành mười phần, mỗi phần dài 10 cm",
    cols: RULE_PARTS,
    rows: 1,
    cell,
    x: 20,
    y: 46,
    w: 320,
    h: 120,
    fill: "sky",
  });
  return {
    ...grid,
    texts: [
      { x: 160, y: 20, text: "1 m = 100 cm", tone: "sky" },
      ...Array.from({ length: RULE_PARTS }, (_, i) => ({
        x: 20 + i * cell + cell / 2,
        y: 46 + cell / 2,
        text: "10",
        tone: "ink" as const,
      })),
      { x: 160, y: 100, text: "Mỗi phần: 10 cm = 0,1 m", tone: "ink" },
    ],
  };
}

// A square metre cut into 100 by 100 squares of 1 cm², drawn as 10 by 10
// blocks of 10 cm.
function squareMetre(): FigureSpec {
  const cell = 22;
  const grid = gridFigure({
    label: "Một mét vuông là hình vuông cạnh 100 cm",
    cols: 10,
    rows: 10,
    cell,
    x: 50,
    y: 40,
    w: 320,
    h: 300,
    fill: "teal",
  });
  return {
    ...grid,
    texts: [
      { x: 160, y: 20, text: "Cạnh 1 m = 100 cm", tone: "sky" },
      { x: 160, y: 150, text: "1 m²", tone: "ink" },
      { x: 160, y: 280, text: `100 · 100 = 10${NBSP}000 cm²`, tone: "teal" },
    ],
  };
}

// Three bars of 0,3 m, 0,6 m and 1 m, each to be converted to cm by a tap.
function bars(): VisualSpec {
  const x0 = 88;
  const perMetre = 208;
  const rows = [
    { name: "a", y: 52, metres: 0.3, text: "0,3 m", cm: "30 cm" },
    { name: "b", y: 108, metres: 0.6, text: "0,6 m", cm: "60 cm" },
    { name: "c", y: 164, metres: 1, text: "1 m", cm: "100 cm" },
  ];
  const pts: Record<string, Pt> = {};
  for (const r of rows) {
    pts[`${r.name}1`] = [x0, r.y];
    pts[`${r.name}2`] = [x0 + r.metres * perMetre, r.y];
  }
  return {
    kind: "probe",
    figure: {
      label: "Ba thanh dài 0,3 m, 0,6 m và 1 m",
      w: 320,
      h: 196,
      pts,
      segs: rows.map((r) => ({
        a: `${r.name}1`,
        b: `${r.name}2`,
        tone: "sky" as const,
        bold: true,
      })),
      texts: rows.map((r) => ({
        x: 44,
        y: r.y,
        text: r.text,
        tone: "ink" as const,
      })),
    },
    parts: rows.map((r) => ({
      kind: "seg" as const,
      a: `${r.name}1`,
      b: `${r.name}2`,
      text: `= ${r.cm}`,
      label: `Thanh dài ${r.text}`,
      tone: "sky" as const,
    })),
    verb: "đổi",
    done: "Một mét có 100 cm, nên đổi được mọi số đo từ m ra cm.",
  };
}

// Canvas of the pictures above a worked calculation: small, so their writing
// stays above 16px when the calculation's lines take the rest of the frame.
const CALC_FIGURE = { w: 280, h: 150 } as const;

// A garden of 20 m by 12 m, fenced on all sides but a gate of 3 m in the
// bottom side.
function gardenWithGate(): FigureSpec {
  return shape({
    label: "Vườn hình chữ nhật dài 20 m, rộng 12 m, có cửa rộng 3 m",
    corners: units.rect(20, 12),
    ...CALC_FIGURE,
    sides: [
      { i: 0, text: "20 m" },
      { i: 3, text: "12 m" },
    ],
    extra: (pts) => {
      const c = pts.C as Pt;
      const d = pts.D as Pt;
      const e = lerp(c, d, 0.25);
      const f = lerp(c, d, 0.4);
      return {
        pts: { E: e, F: f },
        segs: [
          { a: "A", b: "B", tone: "blue", bold: true },
          { a: "B", b: "C", tone: "blue", bold: true },
          { a: "C", b: "E", tone: "blue", bold: true },
          { a: "F", b: "D", tone: "blue", bold: true },
          { a: "D", b: "A", tone: "blue", bold: true },
          { a: "E", b: "F", tone: "slate", dash: true },
        ],
        texts: [
          {
            x: (e[0] + f[0]) / 2,
            y: e[1] + 24,
            text: "cửa 3 m",
            tone: "slate",
          },
        ],
      };
    },
  });
}

// A floor of 6 m by 4 m cut into tiles of 50 cm.
function tiledFloor(): FigureSpec {
  const cell = 14;
  const grid = gridFigure({
    label: "Sàn dài 6 m, rộng 4 m, lát gạch vuông cạnh 50 cm",
    cols: 12,
    rows: 8,
    cell,
    x: 62,
    y: 26,
    w: 260,
    h: 148,
    fill: "teal",
  });
  return {
    ...grid,
    texts: [
      { x: 130, y: 12, text: "6 m", tone: "ink" },
      { x: 34, y: 26 + 4 * cell, text: "4 m", tone: "ink" },
    ],
  };
}

const JOB_THUMB = { w: 150, h: 112, margin: 26 } as const;

export const DON_VI_SPECS: Record<string, VisualSpec> = {
  // Section 9: units.
  "thuoc-mot-met": figure(metreRule()),
  "m2-cm2": figure(squareMetre()),
  "doi-thanh": bars(),
  // Section 10: everyday problems.
  "rao-vuon-giai": calc(
    "Rào vườn có cửa: chu vi rồi trừ chỗ cửa",
    [
      row("C = 2 \\cdot (20 + 12) = 64\\ \\mathrm{m}", ["chu vi vườn", "blue"]),
      row("64 - 3 = 61\\ \\mathrm{m}", ["trừ chỗ cửa", "slate"]),
    ],
    "steps",
    gardenWithGate(),
  ),
  "lat-san-giai": calc(
    "Lát sàn: đổi ra cm rồi đếm theo hàng",
    [
      row(
        "\\begin{gathered} 6\\ \\mathrm{m} = 600\\ \\mathrm{cm} \\\\ 600 : 50 = 12 \\end{gathered}",
        ["viên mỗi hàng", "blue"],
      ),
      row(
        "\\begin{gathered} 4\\ \\mathrm{m} = 400\\ \\mathrm{cm} \\\\ 400 : 50 = 8 \\end{gathered}",
        ["số hàng", "blue"],
      ),
      row("12 \\cdot 8 = 96", ["số viên gạch", "teal"]),
    ],
    "steps",
    tiledFloor(),
  ),
  "chon-chu-vi-dien-tich": gallery(
    "Rào vườn và viền khung là chu vi, lát sàn và sơn tường là diện tích",
    [
      {
        caption: "Rào vườn: chu vi",
        figure: shape({
          label: "Hàng rào quanh một mảnh vườn",
          corners: units.rect(6, 4),
          ...JOB_THUMB,
          tone: "blue",
        }),
      },
      {
        caption: "Lát sàn: diện tích",
        figure: gridFigure({
          label: "Gạch lát kín một sàn nhà",
          cols: 6,
          rows: 4,
          cell: 17,
          x: 24,
          y: 22,
          w: 150,
          h: 112,
          fill: "teal",
        }),
      },
      {
        caption: "Viền khung ảnh: chu vi",
        figure: shape({
          label: "Viền quanh một khung ảnh",
          corners: units.rect(5, 4),
          ...JOB_THUMB,
          tone: "blue",
        }),
      },
      {
        caption: "Sơn tường: diện tích",
        figure: shape({
          label: "Sơn kín một bức tường",
          corners: units.rect(6, 4),
          ...JOB_THUMB,
          fill: "teal",
        }),
      },
    ],
    2,
  ),
};
