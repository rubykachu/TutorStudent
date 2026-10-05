import type { EdgeBoardSpec } from "./edges";
import type { MirrorSpec } from "./mirror-model";

// The lattice boards of the lesson: halves of a drawing to mirror, and the
// polylines to complete. Each board is one picture of the catalog; a board
// used on a lesson screen carries `done`, one used in an exercise does not.
// Pure data, no React.

// ---------------------------------------------------------------------------
// Boards with a vertical axis

// Example of the lesson on points: A and B, one segment between them.
export const POINTS_GUIDED: MirrorSpec = {
  label: "Hai điểm A, B bên trái đường thẳng d",
  cols: 7,
  rows: 5,
  axis: { kind: "v", at: 3 },
  parts: [
    {
      kind: "line",
      pts: [
        [1, 3],
        [2, 1],
      ],
    },
  ],
  names: { A: [1, 3], B: [2, 1] },
  nameShift: { A: [-0.4, 0.3], B: [-0.4, -0.3] },
  done: "Bạn đã tìm đúng điểm A′ và điểm B′.",
};

// Rule picture: the same kind of drawing finished, with the walk to each image.
export const POINTS_RULE: MirrorSpec = {
  label: "Điểm A, điểm B và hai điểm đối xứng A′, B′ qua đường thẳng d",
  cols: 7,
  rows: 4,
  axis: { kind: "v", at: 3 },
  parts: [
    {
      kind: "line",
      pts: [
        [1, 1],
        [2, 3],
      ],
    },
  ],
  names: { A: [1, 1], B: [2, 3] },
  nameShift: { A: [-0.4, -0.3], B: [-0.4, 0.3] },
};

// Exercise: one point.
export const POINT_EXERCISE: MirrorSpec = {
  label: "Điểm A bên trái đường thẳng d",
  cols: 7,
  rows: 5,
  axis: { kind: "v", at: 4 },
  parts: [{ kind: "dot", c: [2, 2] }],
  names: { A: [2, 2] },
  nameShift: { A: [-0.4, -0.35] },
};

// A question that names a column: the columns are numbered from 1.
export const COLUMN_QUESTION: MirrorSpec = {
  label:
    "Lưới có các cột đánh số từ 1, đường thẳng d đi qua cột 5 và điểm P ở cột 2",
  cols: 9,
  rows: 3,
  axis: { kind: "v", at: 4 },
  parts: [{ kind: "dot", c: [1, 1] }],
  names: { P: [1, 1] },
  nameShift: { P: [0, -0.5] },
  numbering: "cols",
};

// A question that names a row: the rows are numbered from 1.
export const ROW_QUESTION: MirrorSpec = {
  label:
    "Lưới có các hàng đánh số từ 1, đường thẳng d nằm ngang đi qua hàng 4 và điểm Q ở hàng 1",
  cols: 5,
  rows: 8,
  axis: { kind: "h", at: 3 },
  parts: [{ kind: "dot", c: [2, 0] }],
  names: { Q: [2, 0] },
  nameShift: { Q: [0.5, 0] },
  numbering: "rows",
};

// Hint of the tip on a horizontal axis: how to count, with other numbers
// than the exercises.
export const POINT_DEMO_HORIZONTAL: MirrorSpec = {
  label: "Cách đếm ô từ điểm tới đường thẳng d nằm ngang",
  cols: 5,
  rows: 7,
  axis: { kind: "h", at: 3 },
  parts: [{ kind: "dot", c: [2, 1] }],
};

// Hint: how to count, with other numbers than the exercise.
export const POINT_DEMO: MirrorSpec = {
  label: "Cách đếm ô từ điểm tới đường thẳng d",
  cols: 7,
  rows: 3,
  axis: { kind: "v", at: 3 },
  parts: [{ kind: "dot", c: [0, 1] }],
};

// The bracket drawn step by step: a plus sign from its left half.
export const PLUS_STEPS: MirrorSpec = {
  label: "Nửa trái của dấu cộng và đường thẳng d",
  cols: 7,
  rows: 5,
  axis: { kind: "v", at: 3 },
  parts: [
    {
      kind: "line",
      pts: [
        [3, 0],
        [2, 0],
        [2, 1],
        [0, 1],
        [0, 3],
        [2, 3],
        [2, 4],
        [3, 4],
      ],
    },
  ],
  names: { A: [2, 0], B: [2, 1], C: [0, 1], D: [0, 3], E: [2, 3], F: [2, 4] },
  nameShift: {
    A: [-0.4, -0.3],
    B: [-0.4, -0.3],
    C: [-0.4, -0.3],
    D: [-0.4, 0.3],
    E: [-0.4, 0.3],
    F: [-0.4, 0.3],
  },
};

// Rule picture of the lesson on completing a drawing: a vase.
export const VASE_RULE: MirrorSpec = {
  label: "Nửa trái của chiếc bình và hình đầy đủ khi vẽ thêm nửa phải",
  cols: 7,
  rows: 5,
  axis: { kind: "v", at: 3 },
  parts: [
    {
      kind: "line",
      pts: [
        [3, 0],
        [1, 1],
        [1, 3],
        [3, 4],
      ],
    },
  ],
  names: { P: [1, 1], Q: [1, 3] },
  nameShift: { P: [-0.4, -0.3], Q: [-0.4, 0.3] },
};

export const COMPLETE_GUIDED: MirrorSpec = {
  label: "Nửa trái của một hình và đường thẳng d",
  cols: 7,
  rows: 5,
  axis: { kind: "v", at: 3 },
  parts: [
    {
      kind: "line",
      pts: [
        [3, 0],
        [1, 0],
        [1, 2],
        [2, 2],
        [2, 4],
        [3, 4],
      ],
    },
  ],
  names: { A: [1, 0], B: [1, 2], C: [2, 2], D: [2, 4] },
  nameShift: {
    A: [-0.4, -0.3],
    B: [-0.4, 0.3],
    C: [0.3, 0.4],
    D: [-0.4, 0.3],
  },
  done: "Bạn đã vẽ xong nửa còn lại.",
};

export const COMPLETE_EXERCISE: MirrorSpec = {
  label: "Nửa trái của một hình và đường thẳng d",
  cols: 7,
  rows: 5,
  axis: { kind: "v", at: 3 },
  parts: [
    {
      kind: "line",
      pts: [
        [3, 0],
        [0, 0],
        [0, 2],
        [2, 2],
        [2, 4],
        [3, 4],
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Boards with a diagonal axis

const DIAGONAL_STEPS: MirrorSpec = {
  label: "Nửa hình bên trái trục nghiêng d",
  cols: 6,
  rows: 6,
  axis: { kind: "d", at: 0 },
  parts: [
    {
      kind: "line",
      pts: [
        [1, 1],
        [0, 3],
        [2, 4],
        [3, 3],
      ],
    },
  ],
  names: { A: [0, 3], B: [2, 4] },
  nameShift: { A: [-0.4, 0.3], B: [-0.3, 0.4] },
};
export const DIAGONAL_STEPS_BOARD = DIAGONAL_STEPS;

export const DIAGONAL_RULE: MirrorSpec = {
  label: "Điểm A, điểm B và hai điểm đối xứng A′, B′ qua trục nghiêng d",
  cols: 6,
  rows: 6,
  axis: { kind: "a", at: 5 },
  parts: [
    {
      kind: "line",
      pts: [
        [1, 4],
        [0, 2],
        [2, 1],
      ],
    },
  ],
  names: { A: [0, 2], B: [2, 1] },
  nameShift: { A: [-0.4, -0.3], B: [-0.1, -0.45] },
};

export const DIAGONAL_DEMO: MirrorSpec = {
  label: "Cách đi từ điểm tới trục nghiêng d",
  cols: 6,
  rows: 6,
  axis: { kind: "d", at: 0 },
  parts: [{ kind: "dot", c: [5, 1] }],
};

export const DIAGONAL_GUIDED: MirrorSpec = {
  label: "Nửa hình bên trái trục nghiêng d",
  cols: 6,
  rows: 6,
  axis: { kind: "d", at: 0 },
  parts: [
    {
      kind: "line",
      pts: [
        [3, 3],
        [1, 3],
        [0, 5],
      ],
    },
  ],
  names: { A: [1, 3], B: [0, 5] },
  nameShift: { A: [-0.4, 0.3], B: [-0.4, 0.3] },
  done: "Bạn đã vẽ xong nửa còn lại.",
};

export const DIAGONAL_EXERCISE: MirrorSpec = {
  label: "Nửa hình bên trái trục nghiêng d",
  cols: 6,
  rows: 6,
  axis: { kind: "d", at: 0 },
  parts: [
    {
      kind: "line",
      pts: [
        [4, 4],
        [1, 4],
        [0, 2],
        [1, 2],
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// The workbook's figures, redrawn on a lattice (exercises 5.6 and 5.8)

// 5.6, left: half of a house, the roof and a wall.
export const BOOK_56A: MirrorSpec = {
  label: "Nửa trái của ngôi nhà và đường thẳng d",
  cols: 7,
  rows: 6,
  axis: { kind: "v", at: 3 },
  parts: [
    {
      kind: "line",
      pts: [
        [3, 0],
        [0, 2],
        [3, 2],
      ],
    },
    {
      kind: "line",
      pts: [
        [1, 2],
        [1, 5],
        [3, 5],
      ],
    },
  ],
};

// 5.6, middle: half of a face, with an eye and a mouth.
export const BOOK_56B: MirrorSpec = {
  label: "Nửa trái của mặt cười và đường thẳng d",
  cols: 7,
  rows: 7,
  axis: { kind: "v", at: 3 },
  parts: [
    { kind: "arc", c: [3, 3], r: 3, from: 90, to: 270, anchor: [0, 3] },
    { kind: "ring", c: [1, 2], r: 0.5 },
    { kind: "dot", c: [1, 2] },
    {
      kind: "line",
      pts: [
        [3, 4],
        [2, 4],
      ],
    },
    { kind: "arc", c: [3, 4], r: 1, from: 90, to: 180, anchor: [2, 4] },
  ],
};

// 5.6, right: a polyline hanging below a horizontal axis.
export const BOOK_56C: MirrorSpec = {
  label: "Đường gấp khúc phía dưới đường thẳng d nằm ngang",
  cols: 7,
  rows: 6,
  axis: { kind: "h", at: 3 },
  parts: [
    {
      kind: "line",
      pts: [
        [0, 3],
        [4, 5],
        [6, 4],
        [6, 3],
      ],
    },
  ],
};

// 5.8, left: a fan of leaflets from a point on the axis running down to the right.
export const BOOK_58A: MirrorSpec = {
  label: "Chiếc lá bên trái trục nghiêng d",
  cols: 7,
  rows: 7,
  axis: { kind: "d", at: 0 },
  parts: [
    {
      kind: "line",
      pts: [
        [5, 5],
        [2, 5],
        [1, 4],
        [2, 3],
      ],
    },
    {
      kind: "line",
      pts: [
        [5, 5],
        [3, 6],
        [1, 6],
      ],
    },
    {
      kind: "line",
      pts: [
        [5, 5],
        [2, 4],
      ],
    },
    {
      kind: "line",
      pts: [
        [5, 5],
        [1, 2],
      ],
    },
  ],
};

// 5.8, right: a fan from a point on the axis running up to the right.
export const BOOK_58B: MirrorSpec = {
  label: "Chiếc lá bên trên trục nghiêng d",
  cols: 7,
  rows: 7,
  axis: { kind: "a", at: 6 },
  parts: [
    {
      kind: "line",
      pts: [
        [1, 5],
        [1, 2],
        [2, 1],
      ],
    },
    {
      kind: "line",
      pts: [
        [1, 5],
        [0, 3],
        [0, 2],
      ],
    },
    {
      kind: "line",
      pts: [
        [1, 5],
        [2, 3],
        [3, 1],
      ],
    },
    {
      kind: "line",
      pts: [
        [1, 5],
        [4, 0],
      ],
    },
  ],
};

// Lead-ins: smaller figures with the same kind of axis.
export const LEAD_56A: MirrorSpec = {
  label: "Nửa trái của một hình và đường thẳng d",
  cols: 7,
  rows: 5,
  axis: { kind: "v", at: 3 },
  parts: [
    {
      kind: "line",
      pts: [
        [3, 0],
        [1, 0],
        [1, 3],
        [3, 3],
      ],
    },
  ],
};

export const LEAD_56B: MirrorSpec = {
  label: "Nửa trái của một vòng tròn có chấm và đường thẳng d",
  cols: 7,
  rows: 5,
  axis: { kind: "v", at: 3 },
  parts: [
    { kind: "arc", c: [3, 2], r: 2, from: 90, to: 270, anchor: [1, 2] },
    { kind: "dot", c: [2, 1] },
  ],
};

export const LEAD_56C: MirrorSpec = {
  label: "Đường gấp khúc phía dưới đường thẳng d nằm ngang",
  cols: 6,
  rows: 5,
  axis: { kind: "h", at: 2 },
  parts: [
    {
      kind: "line",
      pts: [
        [0, 2],
        [2, 4],
        [4, 2],
      ],
    },
  ],
};

export const LEAD_58A: MirrorSpec = {
  label: "Hình bên trái trục nghiêng d",
  cols: 6,
  rows: 6,
  axis: { kind: "d", at: 0 },
  parts: [
    {
      kind: "line",
      pts: [
        [2, 2],
        [0, 2],
        [1, 4],
      ],
    },
  ],
};

export const LEAD_58B: MirrorSpec = {
  label: "Hình bên trên trục nghiêng d",
  cols: 6,
  rows: 6,
  axis: { kind: "a", at: 5 },
  parts: [
    {
      kind: "line",
      pts: [
        [1, 4],
        [0, 1],
        [2, 0],
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Boards of exercise 5.9 and its lead-ins: a polyline to add to a given one

export const BOOK_59: EdgeBoardSpec = {
  label: "Đường gấp khúc dài 4 đơn vị trên lưới ô vuông",
  cols: 6,
  rows: 5,
  given: [
    [2, 1],
    [2, 2],
    [1, 2],
    [1, 3],
    [2, 3],
  ],
};

// The lead-ins draw on the same short polyline (two sides of a unit square
// turned like the corner of a bracket). Length 1 with one axis: join its ends
// with a piece going down from the left end (an arch with a vertical axis);
// length 2 with four axes: close the unit square; length 4 with two axes:
// close a rectangle two squares wide or two squares tall, the only two ways.
export const LEAD_59: EdgeBoardSpec = {
  label: "Đường gấp khúc ngắn trên lưới ô vuông",
  cols: 5,
  rows: 4,
  given: [
    [1, 1],
    [2, 1],
    [2, 2],
  ],
};
