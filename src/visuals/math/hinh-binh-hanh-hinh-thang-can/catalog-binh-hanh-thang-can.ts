import {
  angleProbe,
  figure,
  frame,
  gallery,
  MEASURE_ROOM,
  measureY,
  PROBE_MARGIN,
  sideProbe,
  steps,
  THUMB,
} from "@/visuals/shared/quadrilaterals/builders";
import {
  diagonalParallelogram,
  isoTrapezoid,
  labelSide,
  type QuadKind,
  quad,
  renamed,
  textInCorner,
} from "@/visuals/shared/quadrilaterals/figures";
import type { VisualSpec } from "@/visuals/shared/quadrilaterals/spec";

// Pictures of the parallelogram, the isosceles trapezoid,
// their diagonals, and the comparison of the four shapes.

const NAMED = { names: true, fill: true } as const;

// A parallelogram whose diagonals have halves of 3 and 4 units, for the
// lesson part on its diagonals.
const diagonalsOf = (label: string, extra: object = {}) =>
  diagonalParallelogram(label, {
    first: 3,
    second: 4,
    between: 60,
    names: true,
    fill: true,
    ...extra,
  });

// The four shapes with the mark each is known for, as thumbnails with names.
const COMPARE: readonly {
  kind: QuadKind;
  caption: string;
  marks: object;
}[] = [
  { kind: "chu-nhat", caption: "Hình chữ nhật", marks: { rights: true } },
  { kind: "thoi", caption: "Hình thoi", marks: { sides: "all" } },
  {
    kind: "binh-hanh",
    caption: "Hình bình hành",
    marks: { parallel: "opposite" },
  },
  {
    kind: "thang-can",
    caption: "Hình thang cân",
    marks: { sides: "legs", parallel: "bases" },
  },
];

const COMPARE_DIAGONALS = {
  "chu-nhat": { diagonals: "equal", caption: "Hình chữ nhật: bằng nhau" },
  thoi: { diagonals: "perp", caption: "Hình thoi: vuông góc" },
  "binh-hanh": {
    diagonals: "mid",
    caption: "Hình bình hành: cắt nhau tại trung điểm",
  },
  "thang-can": { diagonals: "equal", caption: "Hình thang cân: bằng nhau" },
} as const;

export const BINH_HANH_THANG_CAN_SPECS: Record<string, VisualSpec> = {
  // Hình bình hành
  "binh-hanh-cac-buoc": steps(
    "Hình bình hành ABCD có các cạnh đối bằng nhau và song song",
    [
      frame(
        quad("binh-hanh", { label: "Hình bình hành ABCD", ...NAMED }),
        "Hình bình hành ABCD",
      ),
      frame(
        quad("binh-hanh", {
          label: "Các cạnh đối bằng nhau",
          ...NAMED,
          sides: "opposite",
        }),
        "Các cạnh đối bằng nhau",
      ),
      frame(
        quad("binh-hanh", {
          label: "Các cạnh đối song song",
          ...NAMED,
          parallel: "opposite",
        }),
        "Các cạnh đối song song",
      ),
      frame(
        quad("binh-hanh", {
          label: "Các góc đối bằng nhau",
          ...NAMED,
          angles: { A: "120°", B: "60°", C: "120°", D: "60°" },
        }),
        "Các góc đối bằng nhau",
      ),
    ],
  ),
  "binh-hanh-quy-tac": figure(
    quad("binh-hanh", {
      label:
        "Hình bình hành: các cạnh đối bằng nhau và song song, các góc đối bằng nhau",
      ...NAMED,
      sides: "opposite",
      parallel: "opposite",
      angles: { A: "120°", B: "60°", C: "120°", D: "60°" },
    }),
  ),
  "do-binh-hanh": {
    kind: "probe",
    figure: quad("binh-hanh", {
      label: "Hình bình hành ABCD",
      ...NAMED,
      margin: PROBE_MARGIN,
    }),
    parts: [
      ...sideProbe(
        [
          ["A", "B", "6 cm"],
          ["B", "C", "4 cm"],
          ["C", "D", "6 cm"],
          ["D", "A", "4 cm"],
        ],
        "",
      ),
      ...angleProbe(
        [
          ["A", "D", "B", "120°"],
          ["B", "A", "C", "60°"],
          ["C", "B", "D", "120°"],
          ["D", "C", "A", "60°"],
        ],
        "",
        // The two 120° labels stand close to their corners, not side by side
        // in the middle of the figure.
        { textDistance: 40 },
      ),
    ],
    verb: "đo",
    done: "Các cạnh đối và các góc đối đều có số đo bằng nhau.",
  },
  "binh-hanh-ab-7-bc-5": figure(
    labelSide(
      labelSide(
        quad("binh-hanh", {
          label: "Hình bình hành ABCD có AB = 7 cm và BC = 5 cm",
          names: true,
          margin: 44,
        }),
        "A",
        "B",
        "7 cm",
      ),
      "B",
      "C",
      "5 cm",
    ),
  ),
  "binh-hanh-goc-a-110": figure(
    textInCorner(
      quad("binh-hanh", {
        label: "Hình bình hành ABCD có góc A bằng 110°",
        names: true,
        acute: 70,
        angles: { A: "110°" },
      }),
      "C",
      "?",
    ),
  ),
  // Đường chéo của hình bình hành
  "trung-diem": steps("Trung điểm của đoạn thẳng AB", [
    frame(
      {
        label: "Đoạn thẳng AB",
        w: 300,
        h: 110,
        pts: { A: [40, 60], B: [260, 60] },
        segs: [{ a: "A", b: "B", bold: true }],
        dots: ["A", "B"],
        names: ["A", "B"],
        nameShift: { A: [0, -10], B: [0, -10] },
      },
      "Đoạn thẳng AB",
    ),
    frame(
      {
        label: "Điểm O ở chính giữa đoạn thẳng AB",
        w: 300,
        h: 110,
        pts: { A: [40, 60], B: [260, 60], O: [150, 60] },
        segs: [{ a: "A", b: "B", bold: true }],
        dots: ["A", "B", "O"],
        names: ["A", "B", "O"],
        nameShift: { A: [0, -10], B: [0, -10], O: [12, -30] },
      },
      "Điểm O nằm chính giữa AB",
    ),
    frame(
      {
        label: "O là trung điểm của AB: OA = OB",
        w: 300,
        h: 110,
        pts: { A: [40, 60], B: [260, 60], O: [150, 60] },
        segs: [{ a: "A", b: "B", bold: true }],
        dots: ["A", "B", "O"],
        names: ["A", "B", "O"],
        nameShift: { A: [0, -10], B: [0, -10], O: [12, -30] },
        ticks: [
          {
            segs: [
              ["A", "O"],
              ["O", "B"],
            ],
            count: 1,
            tone: "blue",
          },
        ],
      },
      "OA = OB, nên O là trung điểm của AB",
    ),
  ]),
  "cheo-binh-hanh-quy-tac": figure(
    diagonalsOf(
      "Hình bình hành: hai đường chéo cắt nhau tại trung điểm của mỗi đường",
      { diagonals: "mid" },
    ),
  ),
  "do-cheo-binh-hanh": {
    kind: "probe",
    figure: {
      ...diagonalsOf("Hình bình hành ABCD có hai đường chéo cắt nhau tại O"),
      h: 200 + MEASURE_ROOM,
      segs: [
        { a: "A", b: "C", tone: "mute", dash: true },
        { a: "B", b: "D", tone: "mute", dash: true },
      ],
    },
    // Each half measures its length on a line under the figure, away from
    // the sides, where the two columns are the two diagonals.
    parts: [
      {
        kind: "seg",
        a: "A",
        b: "O",
        text: "AO = 3 cm",
        label: "Đoạn AO",
        tone: "amber",
        textAt: [84, measureY(0)],
      },
      {
        kind: "seg",
        a: "O",
        b: "C",
        text: "OC = 3 cm",
        label: "Đoạn OC",
        tone: "amber",
        textAt: [84, measureY(1)],
      },
      {
        kind: "seg",
        a: "B",
        b: "O",
        text: "BO = 4 cm",
        label: "Đoạn BO",
        tone: "amber",
        textAt: [216, measureY(0)],
      },
      {
        kind: "seg",
        a: "O",
        b: "D",
        text: "OD = 4 cm",
        label: "Đoạn OD",
        tone: "amber",
        textAt: [216, measureY(1)],
      },
    ],
    verb: "đo",
    done: "Mỗi đường chéo bị điểm O chia thành hai nửa bằng nhau.",
  },
  "binh-hanh-cheo-ten": figure(
    diagonalsOf("Hình bình hành ABCD có hai đường chéo cắt nhau tại O"),
  ),
  // The same kind of picture for the practice question, leaning the other way
  // and with other names.
  "binh-hanh-cheo-ghik": figure(
    renamed(
      diagonalParallelogram(
        "Hình bình hành GHIK có hai đường chéo cắt nhau tại O",
        { first: 4, second: 3, between: 70, names: true, fill: true },
      ),
      { A: "G", B: "H", C: "I", D: "K" },
    ),
  ),
  // Hình thang cân
  "thang-can-cac-buoc": steps("Hình thang cân ABCD có hai cạnh đáy song song", [
    frame(
      quad("thang-can", { label: "Hình thang cân ABCD", ...NAMED }),
      "Hình thang cân ABCD",
    ),
    frame(
      quad("thang-can", {
        label: "Hai cạnh đáy song song",
        ...NAMED,
        parallel: "bases",
      }),
      "Hai cạnh đáy AB và DC song song",
    ),
    frame(
      quad("thang-can", {
        label: "Hai cạnh bên bằng nhau",
        ...NAMED,
        sides: "legs",
      }),
      "Hai cạnh bên AD và BC bằng nhau",
    ),
    frame(
      quad("thang-can", {
        label: "Hai góc kề đáy DC bằng nhau",
        ...NAMED,
        angles: { D: "60°", C: "60°" },
      }),
      "Hai góc kề đáy DC bằng nhau",
    ),
  ]),
  "thang-can-quy-tac": figure(
    quad("thang-can", {
      label:
        "Hình thang cân: hai cạnh bên bằng nhau, hai góc kề một đáy bằng nhau",
      ...NAMED,
      parallel: "bases",
      sides: "legs",
      angles: { D: "60°", C: "60°", A: "120°", B: "120°" },
    }),
  ),
  "do-thang-can": {
    kind: "probe",
    figure: quad("thang-can", {
      label: "Hình thang cân ABCD",
      ...NAMED,
      margin: PROBE_MARGIN,
    }),
    parts: [
      ...sideProbe(
        [
          ["D", "A", "4 cm"],
          ["C", "B", "4 cm"],
        ],
        "",
      ),
      ...angleProbe(
        [
          ["D", "C", "A", "60°"],
          ["C", "B", "D", "60°"],
        ],
        "",
      ),
    ],
    verb: "đo",
    done: "Hai cạnh bên đều dài 4 cm và hai góc kề đáy DC đều bằng 60°.",
  },
  "thang-can-doi-song": gallery(
    "Thang chữ A và túi xách",
    [
      { scene: "ladder", caption: "Thang chữ A" },
      { scene: "bag", caption: "Túi xách" },
    ],
    2,
  ),
  "thang-can-ad-5": figure(
    labelSide(
      quad("thang-can", {
        label: "Hình thang cân ABCD có cạnh bên AD = 5 cm",
        names: true,
        margin: 44,
      }),
      "A",
      "D",
      "5 cm",
    ),
  ),
  "thang-can-goc-d-70": figure(
    textInCorner(
      isoTrapezoid("Hình thang cân ABCD có đáy DC và góc D bằng 70°", {
        angle: 70,
        names: true,
        angles: { D: "70°" },
      }),
      "C",
      "?",
    ),
  ),
  "thang-can-ten": figure(
    quad("thang-can", { label: "Hình thang cân ABCD", names: true }),
  ),
  // Đường chéo của hình thang cân
  "cheo-thang-can-cac-buoc": steps("Hai đường chéo của hình thang cân ABCD", [
    frame(
      quad("thang-can", { label: "Hình thang cân ABCD", ...NAMED }),
      "Hình thang cân ABCD",
    ),
    frame(
      quad("thang-can", {
        label: "Đường chéo AC",
        ...NAMED,
        segs: [{ a: "A", b: "C", tone: "amber", bold: true }],
      }),
      "Đường chéo AC nối A với C",
    ),
    frame(
      quad("thang-can", {
        label: "Hai đường chéo AC và BD",
        ...NAMED,
        diagonals: "plain",
      }),
      "Đường chéo BD nối B với D",
    ),
    frame(
      quad("thang-can", {
        label: "Hai đường chéo bằng nhau",
        ...NAMED,
        diagonals: "equal",
      }),
      "Hai đường chéo bằng nhau",
    ),
  ]),
  "cheo-thang-can-quy-tac": figure(
    quad("thang-can", {
      label: "Hình thang cân có hai đường chéo bằng nhau",
      ...NAMED,
      diagonals: "equal",
    }),
  ),
  "do-cheo-thang-can": {
    kind: "probe",
    figure: {
      ...quad("thang-can", {
        label: "Hình thang cân ABCD",
        ...NAMED,
        segs: [
          { a: "A", b: "C", tone: "mute", dash: true },
          { a: "B", b: "D", tone: "mute", dash: true },
        ],
      }),
      h: 200 + MEASURE_ROOM,
    },
    // The measures stand on two lines under the figure, away from its bases.
    parts: [
      {
        kind: "seg",
        a: "A",
        b: "C",
        text: "AC = 7 cm",
        label: "Đường chéo AC",
        tone: "amber",
        at: 0.28,
        textAt: [150, measureY(0)],
      },
      {
        kind: "seg",
        a: "B",
        b: "D",
        text: "BD = 7 cm",
        label: "Đường chéo BD",
        tone: "amber",
        at: 0.28,
        textAt: [150, measureY(1)],
      },
    ],
    verb: "đo",
    done: "Hai đường chéo đều dài 7 cm.",
  },
  "thang-can-cheo-ten": figure(
    quad("thang-can", {
      label: "Hình thang cân ABCD với hai đường chéo AC và BD",
      names: true,
      diagonals: "plain",
    }),
  ),
  // The same picture for the review question, with other names.
  "thang-can-cheo-efgh": figure(
    renamed(
      quad("thang-can", {
        label: "Hình thang cân EFGH với hai đường chéo EG và FH",
        names: true,
        diagonals: "plain",
      }),
      { A: "E", B: "F", C: "G", D: "H" },
    ),
  ),
  // So sánh bốn hình
  "so-sanh-bon-hinh": gallery(
    "Bốn hình đặt cạnh nhau, mỗi hình với dấu riêng của nó",
    COMPARE.map(({ kind, caption, marks }) => ({
      figure: quad(kind, {
        label: caption,
        fill: true,
        ...THUMB,
        ...marks,
      }),
      caption,
    })),
    2,
  ),
  "so-sanh-cheo": gallery(
    "Hai đường chéo của bốn hình",
    (Object.keys(COMPARE_DIAGONALS) as QuadKind[]).map((kind) => {
      const { diagonals, caption } = COMPARE_DIAGONALS[kind];
      return {
        figure: quad(kind, { label: caption, fill: true, ...THUMB, diagonals }),
        caption,
      };
    }),
    2,
  ),
  "so-sanh-the": {
    kind: "cards",
    label: "Bốn hình và điểm riêng của mỗi hình",
    items: [
      {
        name: "Hình chữ nhật",
        color: "teal",
        art: {
          figure: quad("chu-nhat", {
            label: "Hình chữ nhật",
            fill: true,
            ...THUMB,
          }),
        },
        facts: [
          "Bốn góc vuông",
          "Các cạnh đối bằng nhau",
          "Hai đường chéo bằng nhau",
        ],
      },
      {
        name: "Hình thoi",
        color: "pink",
        art: {
          figure: quad("thoi", { label: "Hình thoi", fill: true, ...THUMB }),
        },
        facts: [
          "Bốn cạnh bằng nhau",
          "Các cạnh đối song song",
          "Hai đường chéo vuông góc",
        ],
      },
      {
        name: "Hình bình hành",
        color: "lime",
        art: {
          figure: quad("binh-hanh", {
            label: "Hình bình hành",
            fill: true,
            ...THUMB,
          }),
        },
        facts: [
          "Các cạnh đối bằng nhau và song song",
          "Các góc đối bằng nhau",
          "Hai đường chéo cắt nhau tại trung điểm",
        ],
      },
      {
        name: "Hình thang cân",
        color: "sky",
        art: {
          figure: quad("thang-can", {
            label: "Hình thang cân",
            fill: true,
            ...THUMB,
          }),
        },
        facts: [
          "Hai cạnh đáy song song",
          "Hai cạnh bên bằng nhau",
          "Hai đường chéo bằng nhau",
        ],
      },
    ],
    verb: "xem",
    done: "Bạn đã xem điểm riêng của cả bốn hình.",
  },
};
