import {
  angleProbe,
  figure,
  frame,
  gallery,
  PROBE_MARGIN,
  sideProbe,
  small,
  steps,
} from "./builders";
import { labelSide, linesFigure, quad, textAt, textInCorner } from "./figures";
import type { VisualSpec } from "./spec";

// Pictures of sections 1 to 6: the four shapes of the opening, the rectangle,
// the parallel sides and the rhombus, with their diagonals.

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

// Frames of a figure that gains one mark at a time.
const SIDES_FRAME = { sides: "all" } as const;

export const CHU_NHAT_THOI_SPECS: Record<string, VisualSpec> = {
  // 1. Bốn hình quanh ta
  "bon-vat-doi-song": gallery(
    "Cánh cửa, khung cánh diều, gạch lát nghiêng và thang chữ A",
    [
      { scene: "door", caption: "Cánh cửa" },
      { scene: "kite", caption: "Khung cánh diều" },
      { scene: "tiles", caption: "Gạch lát nghiêng" },
      { scene: "ladder", caption: "Thang chữ A" },
    ],
    2,
  ),
  "vat-va-hinh": gallery(
    "Mỗi vật với hình của nó",
    [
      { scene: "door", caption: "Cánh cửa: hình chữ nhật" },
      { scene: "kite", caption: "Khung cánh diều: hình thoi" },
      { scene: "tiles", caption: "Gạch lát nghiêng: hình bình hành" },
      { scene: "ladder", caption: "Thang chữ A: hình thang cân" },
    ],
    2,
  ),
  "xem-vat-tim-hinh": {
    kind: "cards",
    label: "Bốn vật quanh nhà và hình của chúng",
    items: [
      { name: "Hình chữ nhật", color: "teal", art: { scene: "door" } },
      { name: "Hình thoi", color: "pink", art: { scene: "kite" } },
      { name: "Hình bình hành", color: "lime", art: { scene: "tiles" } },
      { name: "Hình thang cân", color: "sky", art: { scene: "ladder" } },
    ],
    verb: "xem",
    done: "Bạn đã nhận ra bốn hình quanh mình.",
  },
  "chon-hinh-thang-can": figure({
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
      c0: [55, 122],
      c1: [125, 122],
      c2: [105, 176],
      c3: [35, 176],
      d0: [195, 122],
      d1: [255, 122],
      d2: [285, 176],
      d3: [165, 176],
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
        v: ["c0", "c1", "c2", "c3"],
        fill: "mute",
        region: "bh",
        label: "Hình thứ ba",
      },
      {
        v: ["d0", "d1", "d2", "d3"],
        fill: "mute",
        region: "tc",
        label: "Hình thứ tư",
      },
    ],
  }),

  // 2. Hình chữ nhật
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

  // 3. Đường chéo của hình chữ nhật
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
    figure: quad("chu-nhat", {
      label: "Hình chữ nhật ABCD",
      ...NAMED,
      segs: [
        { a: "A", b: "C", tone: "mute", dash: true },
        { a: "B", b: "D", tone: "mute", dash: true },
      ],
    }),
    parts: [
      {
        kind: "seg",
        a: "A",
        b: "C",
        text: "5 cm",
        label: "Đường chéo AC",
        tone: "amber",
        at: 0.28,
      },
      {
        kind: "seg",
        a: "B",
        b: "D",
        text: "5 cm",
        label: "Đường chéo BD",
        tone: "amber",
        at: 0.28,
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
    texts: [textAt(150, 190, "AC = 8 cm", "amber")],
  }),

  // 4. Hai cạnh song song
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
  "song-song-quy-tac": figure(
    linesFigure("Hai đường thẳng song song không bao giờ cắt nhau", {
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
  ),
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
  "th-hai-duong-song-song": small(parallelLines),
  "th-hai-duong-cat-nhau": small(crossingLines),
  "th-hai-duong-gan-nhau": small(meetingLines),

  // 5. Hình thoi
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
          ["A", "D", "B", "60°"],
          ["B", "A", "C", "120°"],
          ["C", "B", "D", "60°"],
          ["D", "C", "A", "120°"],
        ],
        "",
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
  "thoi-goc-a-60": figure(
    textInCorner(
      quad("thoi", {
        label: "Hình thoi ABCD có góc A bằng 60°",
        names: true,
        angles: { A: "60°" },
      }),
      "C",
      "?",
    ),
  ),

  // 6. Đường chéo của hình thoi
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
  "thoi-a-60-ab-4": figure(
    labelSide(
      quad("thoi", {
        label: "Hình thoi ABCD có cạnh 4 cm và góc A bằng 60°",
        names: true,
        margin: 44,
        angles: { A: "60°" },
      }),
      "A",
      "B",
      "4 cm",
    ),
  ),
};
