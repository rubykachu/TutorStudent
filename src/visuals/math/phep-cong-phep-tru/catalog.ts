import type { Op, StepsMode } from "./types";

// Every picture of the lesson that is drawn from numbers: the registry builds
// one entry per item (id `phep-cong-phep-tru.visual.<key>`), so a new example
// is one line here and its id in lesson.json.

export const LESSON_SLUG = "phep-cong-phep-tru";

export type VisualSpec =
  | { kind: "labels"; op: Op; a: number; b: number }
  | { kind: "tap-parts"; op: Op; a: number; b: number }
  | { kind: "bar"; op: Op; a: number; b: number; mode: StepsMode }
  | { kind: "swap"; a: number; b: number; mode: StepsMode }
  | { kind: "zero"; n: number }
  | { kind: "sticker" }
  | {
      kind: "regroup";
      numbers: readonly number[];
      groups: readonly (readonly number[])[];
      mode: StepsMode;
    }
  | { kind: "pair-try"; numbers: readonly number[]; unit: number }
  | {
      kind: "shift";
      op: Op;
      a: number;
      b: number;
      delta: number;
      mode: StepsMode;
    }
  | { kind: "shift-try"; a: number; b: number; unit: number }
  | { kind: "column"; op: Op; a: number; b: number; mode: StepsMode }
  | { kind: "column-try"; op: Op; a: number; b: number; column: number }
  | {
      kind: "find";
      form: "add" | "subLeft" | "subRight";
      a: number;
      t: number;
      mode: StepsMode;
    }
  | {
      kind: "family";
      total: number;
      p1: number;
      p2: number;
      mode: StepsMode;
      names?: "sum" | "difference";
    }
  | { kind: "check-sum"; a: number; b: number; mode: StepsMode }
  | { kind: "last-digit"; numbers: readonly number[] }
  | { kind: "upper-bound"; numbers: readonly number[]; limit: number };

// Region ids of a "tap a part of the equation" picture, in drawing order.
export const TAP_PARTS_REGIONS = ["first", "second", "result"] as const;

export const VISUAL_SPECS: Readonly<Record<string, VisualSpec>> = {
  "cham-cong-16-7": { kind: "tap-parts", op: "add", a: 16, b: 7 },
  "cong-ten": { kind: "labels", op: "add", a: 32, b: 15 },
  "cong-thanh-bar": { kind: "bar", op: "add", a: 14, b: 9, mode: "full" },
  "cong-ten-tom-tat": { kind: "labels", op: "add", a: 28, b: 14 },
  "hint-bar-cong-15-7": { kind: "bar", op: "add", a: 15, b: 7, mode: "hint" },
  "giai-bar-cong-17-6": { kind: "bar", op: "add", a: 17, b: 6, mode: "full" },
  "cham-tru-31-12": { kind: "tap-parts", op: "sub", a: 31, b: 12 },
  "tru-ten-tom-tat": { kind: "labels", op: "sub", a: 40, b: 15 },
  "tru-ten": { kind: "labels", op: "sub", a: 47, b: 15 },
  "tru-thanh-bar": { kind: "bar", op: "sub", a: 20, b: 8, mode: "full" },
  "hint-bar-tru-45-20": { kind: "bar", op: "sub", a: 45, b: 20, mode: "hint" },
  "giai-bar-tru-50-35": { kind: "bar", op: "sub", a: 50, b: 35, mode: "full" },
  "giao-hoan-tom-tat": { kind: "swap", a: 6, b: 17, mode: "still" },
  "giao-hoan-doi-cho": { kind: "swap", a: 8, b: 15, mode: "full" },
  "hint-swap-16-25": { kind: "swap", a: 16, b: 25, mode: "hint" },
  "giai-swap-13-28": { kind: "swap", a: 13, b: 28, mode: "full" },
  "ket-hop-tom-tat": {
    kind: "regroup",
    numbers: [9, 4, 6],
    groups: [[1, 2]],
    mode: "still",
  },
  "ket-hop-nhom": {
    kind: "regroup",
    numbers: [7, 5, 5],
    groups: [[1, 2]],
    mode: "full",
  },
  "ket-hop-tu-lam": { kind: "pair-try", numbers: [9, 4, 6], unit: 10 },
  "hint-regroup-6-3-7": {
    kind: "regroup",
    numbers: [6, 3, 7],
    groups: [[1, 2]],
    mode: "hint",
  },
  "giai-regroup-8-5-5": {
    kind: "regroup",
    numbers: [8, 5, 5],
    groups: [[1, 2]],
    mode: "full",
  },
  "cong-0-tom-tat": { kind: "zero", n: 4 },
  "cong-0-vi": { kind: "zero", n: 5 },
  "ghep-tron-tom-tat": {
    kind: "regroup",
    numbers: [58, 137, 42],
    groups: [[0, 2]],
    mode: "still",
  },
  "ghep-tron-mau": {
    kind: "regroup",
    numbers: [34, 268, 66],
    groups: [[0, 2]],
    mode: "full",
  },
  "ghep-tron-tu-lam": { kind: "pair-try", numbers: [35, 128, 65], unit: 100 },
  "hint-regroup-15-142-85": {
    kind: "regroup",
    numbers: [15, 142, 85],
    groups: [[0, 2]],
    mode: "hint",
  },
  "giai-regroup-25-168-75": {
    kind: "regroup",
    numbers: [25, 168, 75],
    groups: [[0, 2]],
    mode: "full",
  },
  "ghep-tron-cham": { kind: "pair-try", numbers: [16, 38, 24], unit: 10 },
  "them-bot-tom-tat": {
    kind: "shift",
    op: "add",
    a: 28,
    b: 35,
    delta: 5,
    mode: "still",
  },
  "them-bot-mau": {
    kind: "shift",
    op: "add",
    a: 46,
    b: 38,
    delta: 2,
    mode: "full",
  },
  "them-bot-tu-lam": { kind: "shift-try", a: 36, b: 28, unit: 10 },
  "hint-shift-47-25": {
    kind: "shift",
    op: "add",
    a: 47,
    b: 25,
    delta: 5,
    mode: "hint",
  },
  "giai-shift-57-26": {
    kind: "shift",
    op: "add",
    a: 57,
    b: 26,
    delta: 4,
    mode: "full",
  },
  "them-bot-cham": { kind: "shift-try", a: 45, b: 38, unit: 10 },
  "tru-them-tom-tat": {
    kind: "shift",
    op: "sub",
    a: 56,
    b: 18,
    delta: 2,
    mode: "still",
  },
  "tru-them-mau": {
    kind: "shift",
    op: "sub",
    a: 43,
    b: 15,
    delta: 5,
    mode: "full",
  },
  "tru-them-tron": {
    kind: "shift",
    op: "sub",
    a: 83,
    b: 29,
    delta: 1,
    mode: "still",
  },
  "hint-shift-tru-71-18": {
    kind: "shift",
    op: "sub",
    a: 71,
    b: 18,
    delta: 2,
    mode: "hint",
  },
  "giai-shift-tru-91-38": {
    kind: "shift",
    op: "sub",
    a: 91,
    b: 38,
    delta: 2,
    mode: "full",
  },
  "cot-cong-tom-tat": {
    kind: "column",
    op: "add",
    a: 269,
    b: 58,
    mode: "still",
  },
  "cot-cong-khong-nho": {
    kind: "column",
    op: "add",
    a: 243,
    b: 15,
    mode: "full",
  },
  "cot-cong-co-nho": {
    kind: "column",
    op: "add",
    a: 478,
    b: 256,
    mode: "full",
  },
  "cot-cong-tu-lam": {
    kind: "column-try",
    op: "add",
    a: 358,
    b: 267,
    column: 0,
  },
  "cot-cong-kiem-tra-145-39": {
    kind: "column-try",
    op: "add",
    a: 145,
    b: 39,
    column: 0,
  },
  "hint-cot-cong-247-85": {
    kind: "column",
    op: "add",
    a: 247,
    b: 85,
    mode: "hint",
  },
  "giai-cot-cong-357-68": {
    kind: "column",
    op: "add",
    a: 357,
    b: 68,
    mode: "full",
  },
  "cot-cong-hang-chuc-367-58": {
    kind: "column-try",
    op: "add",
    a: 367,
    b: 58,
    column: 1,
  },
  "cot-tru-tom-tat": {
    kind: "column",
    op: "sub",
    a: 824,
    b: 359,
    mode: "still",
  },
  "cot-tru-khong-muon": {
    kind: "column",
    op: "sub",
    a: 586,
    b: 243,
    mode: "full",
  },
  "cot-tru-co-muon": {
    kind: "column",
    op: "sub",
    a: 532,
    b: 247,
    mode: "full",
  },
  "cot-tru-tu-lam": {
    kind: "column-try",
    op: "sub",
    a: 641,
    b: 356,
    column: 0,
  },
  "cot-tru-kiem-tra-725-48": {
    kind: "column-try",
    op: "sub",
    a: 725,
    b: 48,
    column: 0,
  },
  "hint-cot-tru-361-174": {
    kind: "column",
    op: "sub",
    a: 361,
    b: 174,
    mode: "hint",
  },
  "giai-cot-tru-452-187": {
    kind: "column",
    op: "sub",
    a: 452,
    b: 187,
    mode: "full",
  },
  "cot-tru-hang-chuc-632-178": {
    kind: "column-try",
    op: "sub",
    a: 632,
    b: 178,
    column: 1,
  },
  "quan-he-tom-tat": {
    kind: "family",
    total: 72,
    p1: 25,
    p2: 47,
    mode: "still",
    names: "difference",
  },
  "quan-he-ba-so": {
    kind: "family",
    total: 52,
    p1: 17,
    p2: 35,
    mode: "full",
    names: "difference",
  },
  "quan-he-kiem-tra": { kind: "check-sum", a: 50, b: 18, mode: "still" },
  "hint-family-40-15-25": {
    kind: "family",
    total: 40,
    p1: 15,
    p2: 25,
    mode: "hint",
    names: "difference",
  },
  "giai-family-64-27-37": {
    kind: "family",
    total: 64,
    p1: 27,
    p2: 37,
    mode: "full",
    names: "difference",
  },
  "tim-so-hang-tom-tat": {
    kind: "find",
    form: "add",
    a: 26,
    t: 90,
    mode: "still",
  },
  "tim-so-hang-mau": { kind: "find", form: "add", a: 35, t: 82, mode: "full" },
  "hint-find-cong-118-350": {
    kind: "find",
    form: "add",
    a: 118,
    t: 350,
    mode: "hint",
  },
  "giai-find-cong-135-420": {
    kind: "find",
    form: "add",
    a: 135,
    t: 420,
    mode: "full",
  },
  "tim-so-bi-tru-tom-tat": {
    kind: "find",
    form: "subLeft",
    a: 24,
    t: 30,
    mode: "still",
  },
  "tim-so-bi-tru-mau": {
    kind: "find",
    form: "subLeft",
    a: 18,
    t: 27,
    mode: "full",
  },
  "hint-find-tru-29-40": {
    kind: "find",
    form: "subLeft",
    a: 29,
    t: 40,
    mode: "hint",
  },
  "giai-find-tru-46-35": {
    kind: "find",
    form: "subLeft",
    a: 46,
    t: 35,
    mode: "full",
  },
  "tim-so-tru-tom-tat": {
    kind: "find",
    form: "subRight",
    a: 60,
    t: 25,
    mode: "still",
  },
  "tim-so-tru-mau": {
    kind: "find",
    form: "subRight",
    a: 50,
    t: 32,
    mode: "full",
  },
  "hint-find-so-tru-70-30": {
    kind: "find",
    form: "subRight",
    a: 70,
    t: 30,
    mode: "hint",
  },
  "giai-find-so-tru-92-47": {
    kind: "find",
    form: "subRight",
    a: 92,
    t: 47,
    mode: "full",
  },
  "day-so-tom-tat": {
    kind: "regroup",
    numbers: [2, 4, 6, 8, 10],
    groups: [
      [0, 4],
      [1, 3],
    ],
    mode: "still",
  },
  "day-so-mau": {
    kind: "regroup",
    numbers: [35, 37, 39, 41, 43],
    groups: [
      [0, 4],
      [1, 3],
    ],
    mode: "full",
  },
  "hint-regroup-day-21-27": {
    kind: "regroup",
    numbers: [21, 23, 25, 27],
    groups: [
      [0, 3],
      [1, 2],
    ],
    mode: "hint",
  },
  "giai-regroup-day-11-17": {
    kind: "regroup",
    numbers: [11, 13, 15, 17],
    groups: [
      [0, 3],
      [1, 2],
    ],
    mode: "full",
  },
  "chu-so-cuoi-tom-tat": { kind: "last-digit", numbers: [19, 26, 42] },
  "chu-so-cuoi-mau": { kind: "last-digit", numbers: [23, 14, 35] },
  "uoc-luong-tom-tat": {
    kind: "upper-bound",
    numbers: [45, 82, 67],
    limit: 100,
  },
  "uoc-luong-mau": { kind: "upper-bound", numbers: [68, 74, 91], limit: 100 },
  "lo-trinh-tom-tat": { kind: "bar", op: "sub", a: 90, b: 40, mode: "still" },
  "lo-trinh-mau": {
    kind: "regroup",
    numbers: [8, 22, 2, 8],
    groups: [
      [0, 1],
      [2, 3],
    ],
    mode: "full",
  },
  "hint-bar-gio-70-25": { kind: "bar", op: "sub", a: 70, b: 25, mode: "hint" },
  "giai-bar-gio-80-35": { kind: "bar", op: "sub", a: 80, b: 35, mode: "full" },
  "hook-nham-nhanh": {
    kind: "shift",
    op: "add",
    a: 38,
    b: 47,
    delta: -2,
    mode: "still",
  },
  sticker: { kind: "sticker" },
};
