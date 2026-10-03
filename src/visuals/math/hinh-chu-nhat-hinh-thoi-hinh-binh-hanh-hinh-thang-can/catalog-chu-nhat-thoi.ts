import type { FigureSpec, Pt } from "@/visuals/shared/plane/figure-spec";
import { lineIntersection } from "@/visuals/shared/plane/geometry";
import {
  angleProbe,
  figure,
  frame,
  gallery,
  MEASURE_ROOM,
  measureY,
  PROBE_MARGIN,
  sideProbe,
  small,
  steps,
} from "@/visuals/shared/quadrilaterals/builders";
import {
  labelSide,
  linesFigure,
  polygonFigure,
  quad,
  textAt,
  textInCorner,
} from "@/visuals/shared/quadrilaterals/figures";
import type { VisualSpec } from "@/visuals/shared/quadrilaterals/spec";

// Pictures of the rectangle and the rhombus: the two shapes of the opening,
// the rectangle, the parallel sides and the rhombus, with their diagonals.

const NAMED = { names: true, fill: true } as const;

// A small picture of two lines, for the cards and the options of the section
// on parallel sides.
const TWO_LINES = { w: 140, h: 100 } as const;
const parallelLines = linesFigure("Hai đường thẳng song song", {
  ...TWO_LINES,
  lines: [
    [
      [14, 32],
      [126, 32],
    ],
    [
      [14, 70],
      [126, 70],
    ],
  ],
  parallel: [[0, 1]],
});
const slantedParallel = linesFigure("Hai đường thẳng nghiêng song song", {
  ...TWO_LINES,
  lines: [
    [
      [20, 86],
      [86, 14],
    ],
    [
      [58, 90],
      [124, 18],
    ],
  ],
  parallel: [[0, 1]],
});
const crossingLines = linesFigure("Hai đường thẳng cắt nhau", {
  ...TWO_LINES,
  lines: [
    [
      [18, 18],
      [122, 82],
    ],
    [
      [18, 82],
      [122, 18],
    ],
  ],
});
// Two lines that come together to the right: they look close to parallel
// and will meet.
const meetingLines = linesFigure(
  "Hai đường thẳng gần nhau dần rồi sẽ cắt nhau",
  {
    ...TWO_LINES,
    lines: [
      [
        [14, 26],
        [126, 44],
      ],
      [
        [14, 74],
        [126, 56],
      ],
    ],
  },
);

// The three pairs of lines of the choice exercise on parallel lines: no
// chevrons, and not the pairs of the cards above, so the child looks at the
// lines themselves.
const choiceParallel = linesFigure("Hai đường thẳng song song", {
  ...TWO_LINES,
  lines: [
    [
      [16, 20],
      [124, 52],
    ],
    [
      [16, 60],
      [124, 92],
    ],
  ],
});
const choiceCrossing = linesFigure("Hai đường thẳng cắt nhau", {
  ...TWO_LINES,
  lines: [
    [
      [16, 22],
      [124, 78],
    ],
    [
      [16, 80],
      [124, 38],
    ],
  ],
});
// Two lines that come together to the left: they look close to parallel and
// will meet.
const choiceMeeting = linesFigure(
  "Hai đường thẳng gần nhau dần rồi sẽ cắt nhau",
  {
    ...TWO_LINES,
    lines: [
      [
        [16, 50],
        [124, 22],
      ],
      [
        [16, 64],
        [124, 96],
      ],
    ],
  },
);

// A rectangle drawn 4 to 3, so that its diagonal is 5 when its sides are 4 and
// 3 centimetres (the sides of the rectangle of the lesson on the rectangle are 6 and 4).
function fourByThree(figure: FigureSpec): FigureSpec {
  return {
    ...figure,
    pts: {
      ...figure.pts,
      A: [60, 40],
      B: [240, 40],
      C: [240, 175],
      D: [60, 175],
    },
  };
}

// Room under a figure for measures written in lines beneath it, so that they
// never touch its strokes.
const ROOM_BELOW = 36;

// A rhombus EFGH lying tilted, whose diagonals EG and FH cross at I.
function tiltedRhombus(label: string): FigureSpec {
  const centre: Pt = [150, 100];
  const half: Pt = [94, 34];
  const across: Pt = [18.7, -51.7];
  const base = polygonFigure(label, {
    points: {
      E: [centre[0] - half[0], centre[1] - half[1]],
      F: [centre[0] + across[0], centre[1] + across[1]],
      G: [centre[0] + half[0], centre[1] + half[1]],
      H: [centre[0] - across[0], centre[1] - across[1]],
    },
    names: true,
    segs: [
      { a: "E", b: "G", tone: "amber", bold: true },
      { a: "F", b: "H", tone: "amber", bold: true },
    ],
  });
  const meet = lineIntersection(
    base.pts.E as Pt,
    base.pts.G as Pt,
    base.pts.F as Pt,
    base.pts.H as Pt,
  );
  if (!meet) throw new Error("The diagonals of the rhombus must cross");
  return {
    ...base,
    pts: { ...base.pts, I: meet },
    dots: ["I"],
    // I is written in the gap between the two diagonals on the lower left.
    texts: [textAt(meet[0] - 26, meet[1] + 12, "I")],
  };
}

// Frames of a figure that gains one mark at a time.
const SIDES_FRAME = { sides: "all" } as const;

export const CHU_NHAT_THOI_SPECS: Record<string, VisualSpec> = {
  // Opening: the two shapes around us
  "hai-vat-doi-song": gallery(
    "Cánh cửa và khung cánh diều",
    [
      { scene: "door", caption: "Cánh cửa" },
      { scene: "kite", caption: "Khung cánh diều" },
    ],
    2,
  ),
  "vat-va-hinh": gallery(
    "Mỗi vật với hình của nó",
    [
      { scene: "door", caption: "Cánh cửa: hình chữ nhật" },
      { scene: "kite", caption: "Khung cánh diều: hình thoi" },
    ],
    2,
  ),
  "xem-vat-tim-hinh": {
    kind: "cards",
    label: "Hai vật quanh nhà và hình của chúng",
    items: [
      { name: "Hình chữ nhật", color: "teal", art: { scene: "door" } },
      { name: "Hình thoi", color: "pink", art: { scene: "kite" } },
    ],
    verb: "xem",
    done: "Bạn đã nhận ra hai hình quanh mình.",
  },
  "chon-chu-nhat-quanh-ta": figure({
    label: "Bốn hình để chạm chọn",
    w: 300,
    h: 200,
    pts: {
      a0: [30, 28],
      a1: [120, 28],
      a2: [120, 78],
      a3: [30, 78],
      b0: [170, 52],
      b1: [225, 24],
      b2: [280, 52],
      b3: [225, 80],
      c0: [35, 176],
      c1: [105, 176],
      c2: [70, 115],
      d0: [255, 150],
      d1: [240, 176],
      d2: [210, 176],
      d3: [195, 150],
      d4: [210, 124],
      d5: [240, 124],
    },
    polys: [
      {
        v: ["a0", "a1", "a2", "a3"],
        fill: "mute",
        region: "cn",
        label: "Hình thứ nhất",
      },
      {
        v: ["b0", "b1", "b2", "b3"],
        fill: "mute",
        region: "thoi",
        label: "Hình thứ hai",
      },
      {
        v: ["c0", "c1", "c2"],
        fill: "mute",
        region: "tg",
        label: "Hình thứ ba",
      },
      {
        v: ["d0", "d1", "d2", "d3", "d4", "d5"],
        fill: "mute",
        region: "luc",
        label: "Hình thứ tư",
      },
    ],
  }),

  // Hình chữ nhật
  "chu-nhat-cac-buoc": steps(
    "Hình chữ nhật ABCD có bốn góc vuông và các cạnh đối bằng nhau",
    [
      frame(
        quad("chu-nhat", { label: "Hình chữ nhật ABCD", ...NAMED }),
        "Hình chữ nhật ABCD",
      ),
      frame(
        quad("chu-nhat", { label: "Bốn góc vuông", ...NAMED, rights: true }),
        "Bốn góc vuông, mỗi góc 90°",
      ),
      frame(
        quad("chu-nhat", {
          label: "Các cạnh đối bằng nhau",
          ...NAMED,
          sides: "opposite",
        }),
        "Các cạnh đối bằng nhau",
      ),
    ],
  ),
  "chu-nhat-quy-tac": figure(
    quad("chu-nhat", {
      label: "Hình chữ nhật: bốn góc vuông, các cạnh đối bằng nhau",
      ...NAMED,
      rights: true,
      sides: "opposite",
    }),
  ),
  "do-chu-nhat": {
    kind: "probe",
    figure: quad("chu-nhat", {
      label: "Hình chữ nhật ABCD",
      ...NAMED,
      margin: PROBE_MARGIN,
    }),
    parts: [
      ...angleProbe(
        [
          ["A", "D", "B"],
          ["B", "A", "C"],
          ["C", "B", "D"],
          ["D", "C", "A"],
        ],
        "90°",
        { right: true },
      ),
      ...sideProbe(
        [
          ["A", "B", "6 cm"],
          ["B", "C", "4 cm"],
          ["C", "D", "6 cm"],
          ["D", "A", "4 cm"],
        ],
        "",
      ),
    ],
    verb: "đo",
    done: "Bốn góc đều bằng 90° và các cạnh đối có số đo bằng nhau.",
  },
  "chu-nhat-ab-7": figure(
    labelSide(
      quad("chu-nhat", {
        label: "Hình chữ nhật ABCD có AB = 7 cm",
        names: true,
        margin: 44,
      }),
      "A",
      "B",
      "7 cm",
    ),
  ),
  "chu-nhat-mnpq-9-4": figure(
    labelSide(
      labelSide(
        quad("chu-nhat", {
          label: "Hình chữ nhật có hai cạnh liền nhau dài 9 cm và 4 cm",
          names: true,
          margin: 44,
        }),
        "A",
        "B",
        "9 cm",
      ),
      "B",
      "C",
      "4 cm",
    ),
  ),
  "chu-nhat-ten": figure(
    quad("chu-nhat", { label: "Hình chữ nhật ABCD", names: true }),
  ),
  "chu-nhat-song-song": figure(
    quad("chu-nhat", { label: "Hình chữ nhật ABCD", names: true }),
  ),
  // Đường chéo của hình chữ nhật
  "cheo-chu-nhat-cac-buoc": steps("Hai đường chéo của hình chữ nhật ABCD", [
    frame(
      quad("chu-nhat", { label: "Hình chữ nhật ABCD", ...NAMED }),
      "Hình chữ nhật ABCD",
    ),
    frame(
      quad("chu-nhat", {
        label: "Đường chéo AC",
        ...NAMED,
        segs: [{ a: "A", b: "C", tone: "amber", bold: true }],
      }),
      "Đường chéo AC nối A với C",
    ),
    frame(
      quad("chu-nhat", {
        label: "Hai đường chéo AC và BD",
        ...NAMED,
        diagonals: "plain",
      }),
      "Đường chéo BD nối B với D",
    ),
    frame(
      quad("chu-nhat", {
        label: "Hai đường chéo bằng nhau",
        ...NAMED,
        diagonals: "equal",
      }),
      "Hai đường chéo bằng nhau",
    ),
  ]),
  "cheo-chu-nhat-quy-tac": figure(
    quad("chu-nhat", {
      label: "Hình chữ nhật có hai đường chéo bằng nhau",
      ...NAMED,
      diagonals: "equal",
    }),
  ),
  "do-cheo-chu-nhat": {
    kind: "probe",
    figure: {
      ...fourByThree(
        quad("chu-nhat", {
          label: "Hình chữ nhật ABCD",
          ...NAMED,
          segs: [
            { a: "A", b: "C", tone: "mute", dash: true },
            { a: "B", b: "D", tone: "mute", dash: true },
          ],
        }),
      ),
      h: 200 + MEASURE_ROOM,
    },
    // The measures stand on two lines under the figure, away from its sides.
    parts: [
      {
        kind: "seg",
        a: "A",
        b: "C",
        text: "AC = 5 cm",
        label: "Đường chéo AC",
        tone: "amber",
        at: 0.28,
        textAt: [150, measureY(0)],
      },
      {
        kind: "seg",
        a: "B",
        b: "D",
        text: "BD = 5 cm",
        label: "Đường chéo BD",
        tone: "amber",
        at: 0.28,
        textAt: [150, measureY(1)],
      },
    ],
    verb: "đo",
    done: "Hai đường chéo đều dài 5 cm.",
  },
  "chu-nhat-cheo-ac-8": figure({
    ...quad("chu-nhat", {
      label: "Hình chữ nhật ABCD có đường chéo AC = 8 cm",
      names: true,
      segs: [{ a: "A", b: "C", tone: "amber", bold: true }],
    }),
    h: 200 + ROOM_BELOW,
    texts: [textAt(150, 218, "AC = 8 cm", "amber")],
  }),
  // Hai cạnh song song
  "ray-tau": steps("Hai thanh ray tàu hỏa song song", [
    frame(
      linesFigure("Hai thanh ray tàu hỏa", {
        lines: [
          [
            [20, 70],
            [280, 70],
          ],
          [
            [20, 130],
            [280, 130],
          ],
        ],
        ties: [60, 100, 140, 180, 220].map(
          (x) =>
            [
              [x, 62],
              [x, 138],
            ] as const,
        ),
      }),
      "Hai thanh ray luôn cách nhau một khoảng như nhau",
    ),
    frame(
      linesFigure("Hai đường thẳng cắt nhau", {
        lines: [
          [
            [30, 160],
            [270, 40],
          ],
          [
            [30, 40],
            [270, 160],
          ],
        ],
      }),
      "Hai đường này cắt nhau, nên không song song",
    ),
    frame(
      linesFigure("Hai đường thẳng song song", {
        lines: [
          [
            [30, 150],
            [200, 40],
          ],
          [
            [100, 170],
            [270, 60],
          ],
        ],
        parallel: [[0, 1]],
      }),
      "Hai đường song song, đánh dấu bằng hai mũi tên giống nhau",
    ),
  ]),
  "song-song-quy-tac": figure({
    ...quad("chu-nhat", {
      label: "Hình chữ nhật ABCD: AB song song với CD, BC song song với DA",
      names: true,
      parallel: "opposite",
    }),
    h: 200 + ROOM_BELOW,
    texts: [textAt(150, 218, "AB song song với CD", "slate")],
  }),
  "xem-song-song": {
    kind: "cards",
    label: "Bốn cặp đường thẳng: song song hay cắt nhau",
    items: [
      {
        name: "Song song",
        color: "slate",
        art: { figure: { ...parallelLines, maxScale: 1 } },
        facts: ["Không bao giờ chạm nhau"],
      },
      {
        name: "Cắt nhau",
        color: "slate",
        art: { figure: { ...crossingLines, maxScale: 1 } },
        facts: ["Chạm nhau tại một điểm"],
      },
      {
        name: "Song song",
        color: "slate",
        art: { figure: { ...slantedParallel, maxScale: 1 } },
        facts: ["Không bao giờ chạm nhau"],
      },
      {
        name: "Cắt nhau",
        color: "slate",
        art: { figure: { ...meetingLines, maxScale: 1 } },
        facts: ["Kéo dài ra sẽ chạm nhau"],
      },
    ],
    verb: "xem",
    done: "Bạn đã phân biệt đường song song với đường cắt nhau.",
  },
  "hai-duong-vuong-goc": figure({
    ...linesFigure("Hai đường thẳng cắt nhau tạo thành góc vuông", {
      lines: [
        [
          [40, 100],
          [260, 100],
        ],
        [
          [150, 20],
          [150, 180],
        ],
      ],
    }),
    pts: {
      l0a: [40, 100],
      l0b: [260, 100],
      l1a: [150, 20],
      l1b: [150, 180],
      O: [150, 100],
    },
    rights: [{ at: "O", a: "l0b", b: "l1a", tone: "violet" }],
  }),
  "th-hai-duong-song-song": small(choiceParallel),
  "th-hai-duong-cat-nhau": small(choiceCrossing),
  "th-hai-duong-gan-nhau": small(choiceMeeting),
  // Hình thoi
  "thoi-cac-buoc": steps("Hình thoi ABCD có bốn cạnh bằng nhau", [
    frame(
      quad("thoi", { label: "Hình thoi ABCD", ...NAMED }),
      "Hình thoi ABCD",
    ),
    frame(
      quad("thoi", { label: "Bốn cạnh bằng nhau", ...NAMED, ...SIDES_FRAME }),
      "Bốn cạnh bằng nhau",
    ),
    frame(
      quad("thoi", {
        label: "Các cạnh đối song song",
        ...NAMED,
        parallel: "opposite",
      }),
      "Các cạnh đối song song",
    ),
    frame(
      quad("thoi", {
        label: "Các góc đối bằng nhau",
        ...NAMED,
        angles: { A: "60°", B: "120°", C: "60°", D: "120°" },
      }),
      "Các góc đối bằng nhau",
    ),
  ]),
  "thoi-quy-tac": figure(
    quad("thoi", {
      label:
        "Hình thoi: bốn cạnh bằng nhau, cạnh đối song song, góc đối bằng nhau",
      ...NAMED,
      sides: "all",
      parallel: "opposite",
      angles: { A: "60°", B: "120°", C: "60°", D: "120°" },
    }),
  ),
  "do-thoi": {
    kind: "probe",
    figure: quad("thoi", {
      label: "Hình thoi ABCD",
      ...NAMED,
      acute: 75,
      margin: PROBE_MARGIN,
    }),
    parts: [
      ...sideProbe(
        [
          ["A", "B"],
          ["B", "C"],
          ["C", "D"],
          ["D", "A"],
        ],
        "3 cm",
      ),
      ...angleProbe(
        [
          ["A", "D", "B", "75°"],
          ["B", "A", "C", "105°"],
          ["C", "B", "D", "75°"],
          ["D", "C", "A", "105°"],
        ],
        "",
        { textDistance: 40 },
      ),
    ],
    verb: "đo",
    done: "Bốn cạnh đều dài 3 cm, và các góc đối có số đo bằng nhau.",
  },
  "thoi-ab-5": figure(
    labelSide(
      quad("thoi", {
        label: "Hình thoi ABCD có AB = 5 cm",
        names: true,
        margin: 44,
      }),
      "A",
      "B",
      "5 cm",
    ),
  ),
  "thoi-goc-b-110": figure(
    textInCorner(
      quad("thoi", {
        label: "Hình thoi ABCD có góc B bằng 110°",
        names: true,
        acute: 70,
        angles: { B: "110°" },
      }),
      "D",
      "?",
    ),
  ),
  // Đường chéo của hình thoi
  "cheo-thoi-cac-buoc": steps("Hai đường chéo của hình thoi ABCD", [
    frame(
      quad("thoi", { label: "Hình thoi ABCD", ...NAMED }),
      "Hình thoi ABCD",
    ),
    frame(
      quad("thoi", {
        label: "Đường chéo AC",
        ...NAMED,
        segs: [{ a: "A", b: "C", tone: "amber", bold: true }],
      }),
      "Đường chéo AC nối A với C",
    ),
    frame(
      quad("thoi", {
        label: "Hai đường chéo AC và BD",
        ...NAMED,
        diagonals: "plain",
      }),
      "Đường chéo BD nối B với D",
    ),
    frame(
      quad("thoi", {
        label: "Hai đường chéo vuông góc",
        ...NAMED,
        diagonals: "perp",
      }),
      "Hai đường chéo cắt nhau tạo góc vuông",
    ),
  ]),
  "cheo-thoi-quy-tac": figure(
    quad("thoi", {
      label: "Hình thoi có hai đường chéo vuông góc",
      ...NAMED,
      diagonals: "perp",
    }),
  ),
  "hai-tam-giac-deu-thoi": figure({
    ...quad("thoi", {
      label: "Hình thoi có góc 60° ghép từ hai hình tam giác đều",
      names: true,
      tone: "ink",
      angles: { A: "60°", C: "60°" },
      sides: "all",
      segs: [{ a: "B", b: "D", tone: "amber", bold: true }],
    }),
    polys: [
      { v: ["A", "B", "D"], tone: "ink", fill: "mute" },
      { v: ["C", "B", "D"], tone: "ink", fill: "mute" },
    ],
    ticks: [
      {
        segs: [
          ["A", "B"],
          ["B", "C"],
          ["C", "D"],
          ["D", "A"],
          ["B", "D"],
        ],
        count: 1,
        tone: "blue",
      },
    ],
  }),
  "do-cheo-thoi": {
    kind: "probe",
    figure: quad("thoi", {
      label: "Hình thoi ABCD có hai đường chéo cắt nhau tại O",
      ...NAMED,
      centre: true,
      segs: [
        { a: "A", b: "C", tone: "mute", dash: true },
        { a: "B", b: "D", tone: "mute", dash: true },
      ],
    }),
    parts: angleProbe(
      [
        ["O", "A", "B"],
        ["O", "B", "C"],
        ["O", "C", "D"],
        ["O", "D", "A"],
      ],
      "90°",
      { right: true },
    ),
    verb: "đo",
    done: "Cả bốn góc ở chỗ hai đường chéo cắt nhau đều là góc vuông.",
  },
  "thoi-cheo-o": figure(
    quad("thoi", {
      label: "Hình thoi ABCD có hai đường chéo cắt nhau tại O",
      names: true,
      diagonals: "plain",
      centre: true,
    }),
  ),
  "thoi-efgh-cheo": figure(
    tiltedRhombus("Hình thoi EFGH có hai đường chéo EG và FH cắt nhau tại I"),
  ),
};
