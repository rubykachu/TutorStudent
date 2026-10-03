import {
  board,
  figure,
  frame,
  steps,
} from "@/visuals/shared/quadrilaterals/builders";
import {
  finished,
  stage,
} from "@/visuals/shared/quadrilaterals/drawing-frames";
import { textAt } from "@/visuals/shared/quadrilaterals/figures";
import type { VisualSpec } from "@/visuals/shared/quadrilaterals/spec";

// Pictures of drawing the parallelogram with ruler, set square and
// compass. The boards of the exercises are listed by the corner names the
// exercise writes, so the picture and the wording agree.

const ABCD = ["A", "B", "C", "D"] as const;

export const DRAWING_SPECS: Record<string, VisualSpec> = {
  // Vẽ hình bình hành
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
        "Hai đường gặp nhau tại C. Nối C với D và với B",
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
    dots: ["a0", "b0"],
    // The first position of the set square lies along the side AD that is
    // already drawn; the second position is carried to B, and the stroke
    // along its edge is the new parallel line.
    texts: [
      textAt(150, 198, "Thước giữ yên"),
      textAt(150, 36, "Êke trượt sang phải"),
      textAt(42, 134, "A"),
      textAt(42, 66, "D"),
      textAt(146, 134, "B"),
    ],
  }),
  "ve-binh-hanh-tap-lam": board("parallelogram", ["M", "N", "P", "Q"], {
    a: 4,
    b: 6,
  }),
  "ve-binh-hanh-abcd": board("parallelogram", ABCD),
  "ve-binh-hanh-pqrs": board("parallelogram", ["P", "Q", "R", "S"]),
  // Vẽ hình bình hành biết đường chéo
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
