import type { ComponentType } from "react";
import {
  countEquals,
  solveCountEquals,
} from "@/visuals/_fixture/dot-counter-validators";
import {
  solveSquareOf,
  squareOf,
} from "@/visuals/_fixture/dot-square-validators";
import { grainsEqual, solveGrainsEqual } from "@/visuals/math/luy-thua/grains";
import {
  exponentDifference,
  exponentSum,
  powerIs,
  solveExponentDifference,
  solveExponentSum,
  solvePowerIs,
} from "@/visuals/math/luy-thua/validators";

// State an interactive visual reports while the child manipulates it.
export type VisualState = Record<string, number>;

export type VisualProps = {
  onStateChange?: (state: VisualState) => void;
  // Shown instead of the child's own state, read-only: the revealed answer of
  // a `manipulate` exercise.
  shownState?: VisualState;
  // Locks an interactive visual once its answer is accepted or shown.
  disabled?: boolean;
};

// Decides whether the reported state satisfies a `manipulate` exercise's params.
export type ManipulateValidator = (
  state: VisualState,
  params: Record<string, number>,
) => boolean;

// Builds a state the validator of the same id accepts, so a `manipulate`
// exercise without a solution visual can reveal its answer inside the visual.
export type ManipulateSolver = (params: Record<string, number>) => VisualState;

// Everything `content:check` needs to know about a visual, without React.
export type VisualMeta = {
  // Counted by `content:check --stats`: the child acts on it, not just watches.
  interactive: boolean;
  // Tappable region ids, for `tapRegion` exercises.
  regions?: readonly string[];
  validators?: Readonly<Record<string, ManipulateValidator>>;
  // Keyed by validator id; listed when the visual can show a solved state.
  solutions?: Readonly<Record<string, ManipulateSolver>>;
};

export type VisualEntry = VisualMeta & {
  // Dynamic import keeps each visual out of the bundle until a lesson uses it.
  load: () => Promise<{ default: ComponentType<VisualProps> }>;
};

export type VisualCatalog = Readonly<Record<string, VisualMeta>>;

export const visualRegistry: Readonly<Record<string, VisualEntry>> = {
  "fixture.visual.dot-grid": {
    interactive: false,
    load: () => import("@/visuals/_fixture/dot-grid"),
  },
  "fixture.visual.shapes": {
    interactive: false,
    regions: ["circle", "square", "triangle"],
    load: () => import("@/visuals/_fixture/shapes"),
  },
  "fixture.visual.dot-counter": {
    interactive: true,
    validators: { "count-equals": countEquals },
    solutions: { "count-equals": solveCountEquals },
    load: () => import("@/visuals/_fixture/dot-counter"),
  },
  "fixture.visual.dot-square": {
    interactive: true,
    validators: { "square-of": squareOf },
    solutions: { "square-of": solveSquareOf },
    load: () => import("@/visuals/_fixture/dot-square"),
  },
  "fixture.visual.star-sticker": {
    interactive: false,
    load: () => import("@/visuals/_fixture/star-sticker"),
  },
  "fixture.visual.bead-merge": {
    interactive: false,
    load: () => import("@/visuals/_fixture/bead-merge"),
  },
  "luy-thua.visual.ban-co": {
    interactive: true,
    validators: { "so-hat": grainsEqual },
    solutions: { "so-hat": solveGrainsEqual },
    load: () => import("@/visuals/math/luy-thua/ban-co"),
  },
  "luy-thua.visual.la-gi": {
    interactive: false,
    load: () => import("@/visuals/math/luy-thua/la-gi"),
  },
  "luy-thua.visual.tao-luy-thua": {
    interactive: true,
    validators: { "luy-thua-la": powerIs },
    solutions: { "luy-thua-la": solvePowerIs },
    load: () => import("@/visuals/math/luy-thua/tao-luy-thua"),
  },
  "luy-thua.visual.cham-luy-thua": {
    interactive: false,
    regions: ["base", "exponent"],
    load: () => import("@/visuals/math/luy-thua/cham-luy-thua"),
  },
  "luy-thua.visual.cham-luy-thua-3-mu-5": {
    interactive: false,
    regions: ["base", "exponent"],
    load: () => lessonExample((m) => m.tapPower(3, 5)),
  },
  "luy-thua.visual.binh-phuong-lap-phuong": {
    interactive: true,
    validators: { "luy-thua-la": powerIs },
    solutions: { "luy-thua-la": solvePowerIs },
    load: () => import("@/visuals/math/luy-thua/binh-phuong-lap-phuong"),
  },
  "luy-thua.visual.tinh-3-mu-3-goi-y": {
    interactive: false,
    load: () => lessonExample((m) => m.repeatedProduct(3, 3, "hint")),
  },
  "luy-thua.visual.tinh-3-mu-3": {
    interactive: false,
    load: () => lessonExample((m) => m.repeatedProduct(3, 3, "solution")),
  },
  "luy-thua.visual.tinh-4-mu-3-goi-y": {
    interactive: false,
    load: () => lessonExample((m) => m.repeatedProduct(4, 3, "hint")),
  },
  "luy-thua.visual.tinh-8-mu-2-goi-y": {
    interactive: false,
    load: () => lessonExample((m) => m.repeatedProduct(8, 2, "hint")),
  },
  "luy-thua.visual.tinh-10-mu-3-goi-y": {
    interactive: false,
    load: () => lessonExample((m) => m.repeatedProduct(10, 3, "hint")),
  },
  "luy-thua.visual.tinh-5-mu-3-goi-y": {
    interactive: false,
    load: () => lessonExample((m) => m.repeatedProduct(5, 3, "hint")),
  },
  "luy-thua.visual.phan-tich": {
    interactive: false,
    load: () =>
      lessonExample((m) =>
        m.factorList([
          { base: 5, exponent: 2 },
          { base: 2, exponent: 3 },
          { base: 2, exponent: 4 },
          { base: 3, exponent: 2 },
        ]),
      ),
  },
  "luy-thua.visual.phan-tich-binh-phuong": {
    interactive: false,
    load: () =>
      lessonExample((m) =>
        m.factorList([
          { base: 9, exponent: 2 },
          { base: 3, exponent: 2 },
          { base: 5, exponent: 2 },
        ]),
      ),
  },
  "luy-thua.visual.phan-tich-luy-thua-10": {
    interactive: false,
    load: () =>
      lessonExample((m) =>
        m.factorList([
          { base: 10, exponent: 4 },
          { base: 10, exponent: 2 },
          { base: 10, exponent: 3 },
        ]),
      ),
  },
  "luy-thua.visual.so-mu-1": {
    interactive: false,
    load: () => import("@/visuals/math/luy-thua/so-mu-1"),
  },
  "luy-thua.visual.tinh-4-mu-3": {
    interactive: false,
    load: () => lessonExample((m) => m.repeatedProduct(4, 3, "solution")),
  },
  "luy-thua.visual.nhan-hai-luy-thua": {
    interactive: false,
    load: () => import("@/visuals/math/luy-thua/nhan-hai-luy-thua"),
  },
  "luy-thua.visual.ghep-luy-thua": {
    interactive: true,
    validators: { "tong-so-mu": exponentSum },
    solutions: { "tong-so-mu": solveExponentSum },
    load: () => import("@/visuals/math/luy-thua/ghep-luy-thua"),
  },
  "luy-thua.visual.chia-hai-luy-thua": {
    interactive: false,
    load: () => import("@/visuals/math/luy-thua/chia-hai-luy-thua"),
  },
  "luy-thua.visual.so-mu-0-goi-y": {
    interactive: false,
    load: () => lessonExample((m) => m.zeroExponent("hint")),
  },
  "luy-thua.visual.so-mu-an-3": {
    interactive: false,
    load: () => lessonExample((m) => m.hiddenExponentOne(3, [4, 1])),
  },
  "luy-thua.visual.so-mu-an-10": {
    interactive: false,
    load: () => lessonExample((m) => m.hiddenExponentOne(10, [2, 1, 4])),
  },
  "luy-thua.visual.bot-luy-thua": {
    interactive: true,
    validators: { "hieu-so-mu": exponentDifference },
    solutions: { "hieu-so-mu": solveExponentDifference },
    load: () => import("@/visuals/math/luy-thua/bot-luy-thua"),
  },
  "luy-thua.visual.luy-thua-cua-10": {
    interactive: true,
    validators: { "luy-thua-la": powerIs },
    solutions: { "luy-thua-la": solvePowerIs },
    load: () => import("@/visuals/math/luy-thua/luy-thua-cua-10"),
  },
  "luy-thua.visual.tong-hang-5-247": {
    interactive: false,
    load: () => lessonExample((m) => m.placeValueSum(5247)),
  },
  "luy-thua.visual.dinh-nghia": {
    interactive: false,
    load: () => ruleExample("DinhNghia"),
  },
  "luy-thua.visual.ket-ban-co": {
    interactive: false,
    load: () => ruleExample("KetBanCo"),
  },
  "luy-thua.visual.quy-tac-so-mu-1": {
    interactive: false,
    load: () => ruleExample("QuyTacSoMu1"),
  },
  "luy-thua.visual.bam-mu": {
    interactive: false,
    load: () => ruleExample("BamMu"),
  },
  "luy-thua.visual.doc-binh-phuong": {
    interactive: false,
    load: () => lessonExample((m) => m.squareAndCube(2)),
  },
  "luy-thua.visual.tinh-tung-buoc": {
    interactive: false,
    load: () => lessonExample((m) => m.repeatedProduct(2, 5, "solution")),
  },
  "luy-thua.visual.quy-tac-nhan": {
    interactive: false,
    load: () => ruleExample("QuyTacNhan"),
  },
  "luy-thua.visual.quy-tac-so-mu-an": {
    interactive: false,
    load: () => ruleExample("QuyTacSoMuAn"),
  },
  "luy-thua.visual.quy-tac-chia": {
    interactive: false,
    load: () => ruleExample("QuyTacChia"),
  },
  "luy-thua.visual.quy-tac-so-mu-0": {
    interactive: false,
    load: () => lessonExample((m) => m.zeroExponent("solution")),
  },
  "luy-thua.visual.quy-tac-luy-thua-10": {
    interactive: false,
    load: () => ruleExample("QuyTacLuyThua10"),
  },
  "luy-thua.visual.quy-tac-tach-so": {
    interactive: false,
    load: () => import("@/visuals/math/luy-thua/tach-so"),
  },
  "luy-thua.visual.tom-tat-luy-thua": {
    interactive: false,
    load: () => import("@/visuals/math/luy-thua/cac-phan"),
  },
  "luy-thua.visual.tom-tat-binh-phuong": {
    interactive: false,
    load: () => lessonExample((m) => m.squareAndCube(3)),
  },
  "luy-thua.visual.tom-tat-nhan": {
    interactive: false,
    load: () => ruleExample("TomTatNhan"),
  },
  "luy-thua.visual.tom-tat-chia": {
    interactive: false,
    load: () => ruleExample("TomTatChia"),
  },
  "luy-thua.visual.tom-tat-luy-thua-10": {
    interactive: false,
    load: () => ruleExample("TomTatLuyThua10"),
  },
  "luy-thua.visual.the-viet-luy-thua": {
    interactive: false,
    load: () => ruleExample("TheVietLuyThua"),
  },
  "luy-thua.visual.the-co-so-so-mu": {
    interactive: false,
    load: () => ruleExample("TheCoSoSoMu"),
  },
  "luy-thua.visual.the-so-mu-1": {
    interactive: false,
    load: () => ruleExample("TheSoMu1"),
  },
  "luy-thua.visual.the-binh-phuong": {
    interactive: false,
    load: () => ruleExample("TheBinhPhuong"),
  },
  "luy-thua.visual.the-lap-phuong": {
    interactive: false,
    load: () => ruleExample("TheLapPhuong"),
  },
  "luy-thua.visual.the-tinh-gia-tri": {
    interactive: false,
    load: () => ruleExample("TheTinhGiaTri"),
  },
  "luy-thua.visual.the-nhan-cung-co-so": {
    interactive: false,
    load: () => ruleExample("TheNhanCungCoSo"),
  },
  "luy-thua.visual.the-nhan-so-mu-1": {
    interactive: false,
    load: () => ruleExample("TheNhanSoMu1"),
  },
  "luy-thua.visual.the-chia-cung-co-so": {
    interactive: false,
    load: () => ruleExample("TheChiaCungCoSo"),
  },
  "luy-thua.visual.the-so-mu-0": {
    interactive: false,
    load: () => ruleExample("TheSoMu0"),
  },
  "luy-thua.visual.the-luy-thua-10": {
    interactive: false,
    load: () => ruleExample("TheLuyThua10"),
  },
  "luy-thua.visual.the-tong-luy-thua-10": {
    interactive: false,
    load: () => ruleExample("TheTongLuyThua10"),
  },
  "luy-thua.visual.sticker": {
    interactive: false,
    load: () => import("@/visuals/math/luy-thua/sticker"),
  },
};

type LessonExamples = typeof import("@/visuals/math/luy-thua/examples");

// Worked examples that share one component with different numbers.
async function lessonExample(
  pick: (examples: LessonExamples) => ComponentType<VisualProps>,
): Promise<{ default: ComponentType<VisualProps> }> {
  return { default: pick(await import("@/visuals/math/luy-thua/examples")) };
}

type RuleExamples = typeof import("@/visuals/math/luy-thua/rule-examples");

// Labelled examples of rule screens and recaps; their sentences are in
// lesson.json.
async function ruleExample(
  name: keyof RuleExamples,
): Promise<{ default: ComponentType<VisualProps> }> {
  return {
    default: (await import("@/visuals/math/luy-thua/rule-examples"))[name],
  };
}

// Own keys only, so a URL like /dev/visuals/constructor never resolves to an
// Object.prototype member.
export function findVisual(id: string): VisualEntry | undefined {
  return Object.hasOwn(visualRegistry, id) ? visualRegistry[id] : undefined;
}
