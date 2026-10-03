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
import type { VisualSpec } from "@/visuals/shared/quadrilaterals/spec";

// Pictures of drawing the rectangle and the rhombus with ruler, set square and
// compass. The boards of the exercises are listed by the corner names the
// exercise writes, so the picture and the wording agree.

const ABCD = ["A", "B", "C", "D"] as const;

export const DRAWING_SPECS: Record<string, VisualSpec> = {
  // Vẽ hình chữ nhật
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
  // Vẽ hình thoi
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
};
