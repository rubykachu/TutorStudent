import type {
  FigurePoly,
  FigureSpec,
  FigureText,
  Pt,
  Tone,
} from "@/visuals/shared/plane/figure-spec";
import type { StagePiece, StageSpec, StageText } from "./models";
import {
  type Geometry,
  parallelogramGeo,
  rhombusGeo,
  trapezoidGeo,
} from "./shapes";

// The three pictures where something is cut, copied or turned: a
// parallelogram becomes a rectangle, a rhombus fits in half of a box (its four
// outer triangles turn half a turn about the middle of a side and land inside
// it), two
// trapezoids make a parallelogram. Each is a `StageSpec` (pressed or tapped)
// and a list of still frames (played by the step player), from one geometry.

const at = (g: Geometry, name: string): Pt => {
  const p = g.pts[name];
  if (!p) throw new Error(`No point ${name}`);
  return p;
};
const poly = (g: Geometry, names: readonly string[]): Pt[] =>
  names.map((n) => at(g, n));

function baseFigure(
  label: string,
  g: Geometry,
  polys: readonly FigurePoly[],
  texts: readonly FigureText[],
  extra: Partial<FigureSpec> = {},
): FigureSpec {
  return {
    label,
    w: g.w,
    h: g.h,
    pts: g.pts,
    polys,
    texts,
    ...extra,
  };
}

const text = (
  x: number,
  y: number,
  t: string,
  tone: Tone = "ink",
): FigureText => ({ x, y, text: t, tone });

// The measure of the height of the trapezoid, written beside the dashed
// segment from TL to its foot F (inside the shape, clear of its sides).
const HEIGHT_LABEL_OFFSET = 30;

function heightLabel(g: Geometry, t: string): FigureText {
  const [fx, fy] = at(g, "F");
  return text(fx + HEIGHT_LABEL_OFFSET, (at(g, "TL")[1] + fy) / 2, t, "violet");
}

// ------------------------------------------------------- parallelogram -> rectangle

export const PARALLELOGRAM = { base: 6, height: 3, shift: 2 } as const;
// Room under the shape for its base and the result written there.
const PARALLELOGRAM_CANVAS = { h: 232, reserve: 56 } as const;

export function parallelogramSlide(): StageSpec {
  const { base, height, shift } = PARALLELOGRAM;
  const g = parallelogramGeo(base, height, shift, PARALLELOGRAM_CANVAS);
  const slide = at(g, "BR")[0] - at(g, "BL")[0];
  const [fx, fy] = at(g, "F");
  const mid = (at(g, "TL")[1] + fy) / 2;
  const pieces: StagePiece[] = [
    {
      id: "chieu-cao",
      v: poly(g, ["TL", "F"]),
      tone: "violet",
      dash: true,
      appearAt: 1,
    },
    {
      id: "tam-giac",
      v: poly(g, ["BL", "TL", "F"]),
      tone: "amber",
      filled: true,
      appearAt: 2,
      moveAt: 3,
      move: { dx: slide, dy: 0 },
    },
    {
      id: "chu-nhat",
      v: [at(g, "TL"), at(g, "TR"), [at(g, "TR")[0], fy], at(g, "F")],
      tone: "teal",
      dash: true,
      appearAt: 3,
    },
  ];
  const texts: StageText[] = [
    {
      x: fx + 24,
      y: mid,
      text: `${height} cm`,
      tone: "violet",
      appearAt: 1,
    },
  ];
  return {
    label: "Hình bình hành được cắt và ghép thành hình chữ nhật",
    base: baseFigure(
      "Hình bình hành đáy 6 cm, chiều cao 3 cm",
      g,
      [{ v: ["TL", "TR", "BR", "BL"] }],
      [
        text(
          (at(g, "BL")[0] + at(g, "BR")[0]) / 2,
          fy + 24,
          `${base} cm`,
          "blue",
        ),
      ],
    ),
    pieces,
    texts,
    actions: ["Kẻ chiều cao", "Cắt tam giác", "Trượt sang phải"],
    captions: [
      "Đây là một hình bình hành. Cạnh đáy dài 6 cm.",
      "Kẻ chiều cao từ đỉnh xuống cạnh đáy. Chiều cao là 3 cm.",
      "Cắt phần tam giác nằm bên trái đường chiều cao.",
      "Trượt tam giác sang phải: ta được hình chữ nhật 6 cm và 3 cm.",
    ],
    done: "Hình chữ nhật có diện tích 6 · 3 = 18 cm², nên hình bình hành cũng có diện tích 18 cm².",
  };
}

// The five frames of the same cut, played by the step player.
export function parallelogramFrames(): {
  figure: FigureSpec;
  caption: string;
}[] {
  const { base, height, shift } = PARALLELOGRAM;
  const g = parallelogramGeo(base, height, shift, PARALLELOGRAM_CANVAS);
  const [fx, fy] = at(g, "F");
  const baseText = text(
    (at(g, "BL")[0] + at(g, "BR")[0]) / 2,
    fy + 24,
    `${base} cm`,
    "blue",
  );
  const heightText = text(
    fx + 24,
    (at(g, "TL")[1] + fy) / 2,
    `${height} cm`,
    "violet",
  );
  // Once the rectangle is made its sides are written along its own sides.
  const rectBase = text(
    (at(g, "TL")[0] + at(g, "TR")[0]) / 2,
    fy + 24,
    `${base} cm`,
    "blue",
  );
  const rectHeight = text(
    at(g, "TL")[0] - 28,
    (at(g, "TL")[1] + fy) / 2,
    `${height} cm`,
    "violet",
  );
  const slide = at(g, "BR")[0] - at(g, "BL")[0];
  const moved = (name: string): Pt => [at(g, name)[0] + slide, at(g, name)[1]];
  const shapeOutline: FigurePoly = { v: ["TL", "TR", "BR", "BL"] };
  const heightSeg = [{ a: "TL", b: "F", tone: "violet" as Tone, dash: true }];
  const pts = { ...g.pts, FS: moved("F") };
  const frame = (
    label: string,
    polys: readonly FigurePoly[],
    texts: readonly FigureText[],
    segs: FigureSpec["segs"] = [],
  ): FigureSpec => ({
    label,
    w: g.w,
    h: g.h,
    pts,
    polys,
    segs,
    texts,
  });
  return [
    {
      figure: frame("Hình bình hành đáy 6 cm", [shapeOutline], [baseText]),
      caption: "Đây là một hình bình hành. Cạnh đáy dài 6 cm.",
    },
    {
      figure: frame(
        "Hình bình hành với chiều cao 3 cm",
        [shapeOutline],
        [baseText, heightText],
        heightSeg,
      ),
      caption: "Kẻ chiều cao từ đỉnh xuống cạnh đáy: dài 3 cm.",
    },
    {
      figure: frame(
        "Tam giác bên trái chiều cao được tô màu",
        [shapeOutline, { v: ["BL", "TL", "F"], tone: "amber", fill: "amber" }],
        [baseText, heightText],
        heightSeg,
      ),
      caption: "Cắt phần tam giác bên trái chiều cao.",
    },
    {
      figure: frame(
        "Tam giác đã trượt sang phải, hình chữ nhật 6 cm và 3 cm",
        [
          { v: ["TL", "TR", "FS", "F"], tone: "teal", fill: "teal" },
          { v: ["BR", "TR", "FS"], tone: "amber", fill: "amber" },
        ],
        [rectBase, rectHeight],
      ),
      caption: "Trượt tam giác sang phải: ta được hình chữ nhật 6 cm và 3 cm.",
    },
    {
      figure: frame(
        "Hình chữ nhật 6 cm và 3 cm",
        [{ v: ["TL", "TR", "FS", "F"], tone: "teal", fill: "teal" }],
        [
          rectBase,
          rectHeight,
          text(
            (at(g, "TL")[0] + at(g, "TR")[0]) / 2,
            fy + 54,
            `${base} · ${height} = ${base * height} cm²`,
            "teal",
          ),
        ],
      ),
      caption:
        "Diện tích hình bình hành bằng cạnh đáy nhân với chiều cao: 6 · 3 = 18 cm².",
    },
  ];
}

// ------------------------------------------------------ rhombus in its box

export const RHOMBUS = { d1: 8, d2: 6 } as const;
const RHOMBUS_CANVAS = { h: 240, reserve: 60 } as const;

const RHOMBUS_CORNERS = [
  { id: "tl", corner: "BOX_TL", a: "T", b: "L", name: "phía trên bên trái" },
  { id: "tr", corner: "BOX_TR", a: "T", b: "R", name: "phía trên bên phải" },
  { id: "br", corner: "BOX_BR", a: "R", b: "B", name: "phía dưới bên phải" },
  { id: "bl", corner: "BOX_BL", a: "L", b: "B", name: "phía dưới bên trái" },
] as const;

// The names of the two diagonals, written inside the rhombus: a under the
// across diagonal, b beside the up-and-down one, each where the rhombus is wide
// enough to hold it clear of its sides.
function rhombusLabels(g: Geometry): FigureText[] {
  const centre = at(g, "C");
  const halfWidth = (at(g, "R")[0] - at(g, "L")[0]) / 2;
  const halfHeight = (at(g, "B")[1] - at(g, "T")[1]) / 2;
  return [
    text(centre[0] - 0.34 * halfWidth, centre[1] + 20, "a", "amber"),
    text(centre[0] + 17, centre[1] - 0.48 * halfHeight, "b", "amber"),
  ];
}

function rhombusBase(
  g: Geometry,
  withBox: boolean,
  withLabels = true,
): FigureSpec {
  const { d1, d2 } = RHOMBUS;
  return baseFigure(
    `Hình thoi có hai đường chéo ${d1} cm và ${d2} cm`,
    g,
    [
      ...(withBox
        ? [
            {
              v: ["BOX_TL", "BOX_TR", "BOX_BR", "BOX_BL"],
              tone: "mute" as Tone,
            },
          ]
        : []),
      { v: ["T", "R", "B", "L"] },
    ],
    withLabels ? rhombusLabels(g) : [],
    {
      segs: [
        { a: "L", b: "R", tone: "amber", dash: true },
        { a: "T", b: "B", tone: "amber", dash: true },
      ],
    },
  );
}

export function rhombusFold(): StageSpec {
  const g = rhombusGeo(RHOMBUS.d1, RHOMBUS.d2, RHOMBUS_CANVAS);
  // A corner triangle turned half a turn about the middle of the rhombus's
  // side lands on the quarter of the rhombus that shares that side.
  const pieces: StagePiece[] = RHOMBUS_CORNERS.map(
    ({ id, corner, a, b, name }) => {
      const [ax, ay] = at(g, a);
      const [bx, by] = at(g, b);
      return {
        id,
        v: poly(g, [corner, a, b]),
        tone: "lime" as Tone,
        filled: true,
        moveAt: "tap" as const,
        move: { turn: 180, cx: (ax + bx) / 2, cy: (ay + by) / 2 },
        label: `Xoay tam giác ${name}`,
      };
    },
  );
  return {
    label: "Bốn tam giác nằm ngoài hình thoi xoay vào trong hình thoi",
    base: rhombusBase(g, true, false),
    pieces,
    texts: rhombusLabels(g),
    verb: "Đã xoay",
    done: "Bốn tam giác lấp đầy hình thoi. Hình thoi bằng một nửa hình chữ nhật: 8 · 6 : 2 = 24 cm².",
  };
}

export function rhombusFrames(): { figure: FigureSpec; caption: string }[] {
  const { d1, d2 } = RHOMBUS;
  const g = rhombusGeo(d1, d2, RHOMBUS_CANVAS);
  const baseBox = at(g, "BOX_BL")[1];
  const boxText = (t: string, tone: Tone) =>
    text((at(g, "L")[0] + at(g, "R")[0]) / 2, baseBox + 46, t, tone);
  const corners = RHOMBUS_CORNERS.map((c) => ({
    v: [c.corner, c.a, c.b],
    tone: "lime" as Tone,
    fill: "lime" as Tone,
  }));
  const inner = RHOMBUS_CORNERS.map((c) => ({
    v: [c.a, c.b, "C"],
    tone: "lime" as Tone,
    fill: "lime" as Tone,
  }));
  const plain = rhombusBase(g, false);
  const boxed = rhombusBase(g, true);
  const withPolys = (
    f: FigureSpec,
    extra: readonly FigurePoly[],
    more: readonly FigureText[] = [],
  ): FigureSpec => {
    // A polygon drawn again replaces the earlier one (two polygons of one
    // drawing never share their corners' names).
    const again = new Set(extra.map((p) => p.v.join("")));
    return {
      ...f,
      polys: [
        ...(f.polys ?? []).filter((p) => !again.has(p.v.join(""))),
        ...extra,
      ],
      texts: [...(f.texts ?? []), ...more],
    };
  };
  return [
    {
      figure: plain,
      caption: "Hình thoi có hai đường chéo: a = 8 cm và b = 6 cm.",
    },
    {
      figure: withPolys(
        boxed,
        [],
        [boxText(`Hình chữ nhật: ${d1} · ${d2} = ${d1 * d2} cm²`, "teal")],
      ),
      caption: "Vẽ hình chữ nhật đi qua bốn đỉnh: dài 8 cm, rộng 6 cm.",
    },
    {
      figure: withPolys(boxed, corners, [
        boxText(`Hình chữ nhật: ${d1} · ${d2} = ${d1 * d2} cm²`, "teal"),
      ]),
      caption: "Bốn tam giác nằm ngoài hình thoi.",
    },
    {
      figure: withPolys(boxed, inner, [
        boxText(`Hình chữ nhật: ${d1} · ${d2} = ${d1 * d2} cm²`, "teal"),
      ]),
      caption: "Xoay bốn tam giác vào trong: chúng lấp đầy hình thoi.",
    },
    {
      figure: withPolys(
        boxed,
        [{ v: ["T", "R", "B", "L"], tone: "teal", fill: "teal" }],
        [boxText(`Hình thoi: ${d1 * d2} : 2 = ${(d1 * d2) / 2} cm²`, "teal")],
      ),
      caption: "Hình thoi bằng một nửa hình chữ nhật.",
    },
  ];
}

// -------------------------------------------- two trapezoids -> parallelogram

export const TRAPEZOID = { bottom: 8, top: 4, height: 3 } as const;
const TRAPEZOID_CANVAS = { h: 240, reserve: 70 } as const;

export function trapezoidJoin(): StageSpec {
  const { bottom, top, height } = TRAPEZOID;
  const g = trapezoidGeo(bottom, top, height, TRAPEZOID_CANVAS);
  const [mx, my] = at(g, "M");
  const body = ["BL", "TL", "TR", "BR"];
  const sum = top + bottom;
  const labelUp = (
    a: string,
    b: string,
    t: string,
    appearAt?: number,
  ): StageText => ({
    x: (at(g, a)[0] + at(g, b)[0]) / 2,
    y: at(g, a)[1] - 20,
    text: t,
    tone: "blue",
    ...(appearAt === undefined ? {} : { appearAt }),
  });
  const labelDown = (
    a: string,
    b: string,
    t: string,
    appearAt?: number,
  ): StageText => ({
    x: (at(g, a)[0] + at(g, b)[0]) / 2,
    y: at(g, a)[1] + 22,
    text: t,
    tone: "blue",
    ...(appearAt === undefined ? {} : { appearAt }),
  });
  return {
    label: "Hai hình thang cân giống nhau ghép thành một hình bình hành",
    base: baseFigure(
      `Hình thang cân có hai đáy ${top} cm và ${bottom} cm, chiều cao ${height} cm`,
      g,
      [{ v: body, fill: "sky", tone: "ink" }],
      [
        text(
          (at(g, "TL")[0] + at(g, "TR")[0]) / 2,
          at(g, "TL")[1] - 20,
          `${top} cm`,
          "blue",
        ),
        text(
          (at(g, "BL")[0] + at(g, "BR")[0]) / 2,
          at(g, "BL")[1] + 22,
          `${bottom} cm`,
          "blue",
        ),
      ],
    ),
    pieces: [
      {
        id: "chieu-cao",
        v: poly(g, ["TL", "F"]),
        tone: "violet",
        dash: true,
      },
      {
        id: "ban-sao",
        v: poly(g, body),
        tone: "sky",
        filled: true,
        appearAt: 1,
        moveAt: 1,
        move: { turn: 180, cx: mx, cy: my },
      },
      {
        id: "hinh-binh-hanh",
        v: poly(g, ["W_TL", "W_TR", "W_BR", "W_BL"]),
        tone: "teal",
        dash: true,
        appearAt: 2,
      },
    ],
    texts: [
      heightLabel(g, `${height} cm`),
      labelUp("CBL", "CTL", `${bottom} cm`, 1),
      labelDown("CTL", "CBL", `${top} cm`, 1),
      {
        x: (at(g, "W_BL")[0] + at(g, "W_BR")[0]) / 2,
        y: at(g, "W_BL")[1] + 52,
        text: `${top} + ${bottom} = ${sum} cm`,
        tone: "teal",
        appearAt: 2,
      },
    ],
    actions: ["Ghép thêm", "Đo đáy"],
    captions: [
      "Đây là một hình thang cân. Hai đáy là 4 cm và 8 cm.",
      "Xoay ngược một hình thang giống hệt cho đáy lớn lên trên, rồi ghép vào: ta được hình bình hành.",
      "Đáy hình bình hành dài 4 + 8 = 12 cm. Chiều cao vẫn là 3 cm.",
    ],
    done: "Hình bình hành có diện tích 12 · 3 = 36 cm². Hình thang chỉ bằng một nửa: 18 cm².",
  };
}

export function trapezoidFrames(): { figure: FigureSpec; caption: string }[] {
  const { bottom, top, height } = TRAPEZOID;
  const g = trapezoidGeo(bottom, top, height, TRAPEZOID_CANVAS);
  const body = ["BL", "TL", "TR", "BR"];
  const copy = ["CBL", "CTL", "CTR", "CBR"];
  const whole = ["W_TL", "W_TR", "W_BR", "W_BL"];
  const sum = top + bottom;
  const heightSeg = [{ a: "TL", b: "F", tone: "violet" as Tone, dash: true }];
  const heightMark = [{ at: "F", a: "TL", b: "BR", tone: "violet" as Tone }];
  const heightText = heightLabel(g, `${height} cm`);
  // Every frame draws the height, the one measure the area needs besides the
  // bases.
  const mk = (
    label: string,
    polys: readonly FigurePoly[],
    texts: readonly FigureText[],
  ): FigureSpec => ({
    label,
    w: g.w,
    h: g.h,
    pts: g.pts,
    polys,
    segs: heightSeg,
    rights: heightMark,
    texts: [...texts, heightText],
  });
  const topA = text(
    (at(g, "TL")[0] + at(g, "TR")[0]) / 2,
    at(g, "TL")[1] - 20,
    `${top} cm`,
    "blue",
  );
  const botA = text(
    (at(g, "BL")[0] + at(g, "BR")[0]) / 2,
    at(g, "BL")[1] + 22,
    `${bottom} cm`,
    "blue",
  );
  const topB = text(
    (at(g, "CBL")[0] + at(g, "CTL")[0]) / 2,
    at(g, "CBL")[1] - 20,
    `${bottom} cm`,
    "blue",
  );
  const botB = text(
    (at(g, "CTL")[0] + at(g, "CBL")[0]) / 2,
    at(g, "CTL")[1] + 22,
    `${top} cm`,
    "blue",
  );
  const sumText = (t: string) =>
    text(
      (at(g, "W_BL")[0] + at(g, "W_BR")[0]) / 2,
      at(g, "W_BL")[1] + 52,
      t,
      "teal",
    );
  return [
    {
      figure: mk(
        `Hình thang cân đáy ${top} cm và ${bottom} cm`,
        [{ v: body, fill: "sky" }],
        [topA, botA],
      ),
      caption: "Đây là hình thang cân: hai đáy 4 cm và 8 cm, chiều cao 3 cm.",
    },
    {
      figure: mk(
        "Hai hình thang cân giống nhau ghép thành hình bình hành",
        [
          { v: body, fill: "sky" },
          { v: copy, fill: "sky" },
        ],
        [topA, botA, topB, botB],
      ),
      caption:
        "Xoay ngược một hình thang giống hệt cho đáy lớn lên trên, rồi ghép vào.",
    },
    {
      figure: mk(
        "Hình bình hành có đáy 12 cm",
        [
          { v: body, fill: "sky" },
          { v: copy, fill: "sky" },
          { v: whole, tone: "teal" },
        ],
        [topA, botA, topB, botB, sumText(`${top} + ${bottom} = ${sum} cm`)],
      ),
      caption: "Ta được hình bình hành có đáy 4 + 8 = 12 cm.",
    },
    {
      figure: mk(
        "Hình bình hành đáy 12 cm, chiều cao 3 cm, diện tích 36 cm²",
        [{ v: whole, tone: "teal", fill: "teal" }],
        [sumText(`${sum} · ${height} = ${sum * height} cm²`)],
      ),
      caption: "Hình bình hành có diện tích 12 · 3 = 36 cm².",
    },
    {
      figure: mk(
        "Hình thang cân bằng một nửa hình bình hành",
        [
          { v: body, tone: "sky", fill: "sky" },
          { v: copy, tone: "mute" },
        ],
        [sumText(`${sum * height} : 2 = ${(sum * height) / 2} cm²`)],
      ),
      caption: "Hình thang là một nửa: 36 : 2 = 18 cm².",
    },
  ];
}
