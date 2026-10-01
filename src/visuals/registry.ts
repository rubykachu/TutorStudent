import type { ComponentType } from "react";
import {
  countEquals,
  solveCountEquals,
} from "@/visuals/_fixture/dot-counter-validators";
import {
  solveSquareOf,
  squareOf,
} from "@/visuals/_fixture/dot-square-validators";
import {
  INTERACTIVE_KINDS as MULTIPLE_INTERACTIVE_KINDS,
  LESSON_SLUG as MULTIPLE_SLUG,
  VISUAL_SPECS as MULTIPLE_SPECS,
  VALIDATOR_IDS as MULTIPLE_VALIDATOR_IDS,
} from "@/visuals/math/boi-chung-boi-chung-nho-nhat/catalog";
import {
  solutions as multipleSolutions,
  validators as multipleValidators,
} from "@/visuals/math/boi-chung-boi-chung-nho-nhat/logic";
import {
  INTERACTIVE_KINDS as SIGN_INTERACTIVE_KINDS,
  LESSON_SLUG as SIGN_SLUG,
  VISUAL_SPECS as SIGN_SPECS,
  VALIDATOR_IDS as SIGN_VALIDATOR_IDS,
} from "@/visuals/math/dau-hieu-chia-het/catalog";
import {
  solutions as signSolutions,
  validators as signValidators,
} from "@/visuals/math/dau-hieu-chia-het/logic";
import { grainsEqual, solveGrainsEqual } from "@/visuals/math/luy-thua/grains";
import {
  exponentDifference,
  exponentSum,
  powerIs,
  solveExponentDifference,
  solveExponentSum,
  solvePowerIs,
} from "@/visuals/math/luy-thua/validators";
import {
  LESSON_SLUG as CONG_TRU_SLUG,
  VISUAL_SPECS as CONG_TRU_SPECS,
  TAP_PARTS_REGIONS,
} from "@/visuals/math/phep-cong-phep-tru/catalog";
import {
  columnStep,
  solveColumnStep,
} from "@/visuals/math/phep-cong-phep-tru/column-validators";
import {
  pairRound,
  shiftRound,
  solvePairRound,
  solveShiftRound,
} from "@/visuals/math/phep-cong-phep-tru/pair-validators";
import {
  INTERACTIVE_KINDS,
  mulTableRegions,
  LESSON_SLUG as NHAN_CHIA_SLUG,
  VISUAL_SPECS as NHAN_CHIA_SPECS,
  VALIDATOR_IDS,
} from "@/visuals/math/phep-nhan-phep-chia/catalog";
import {
  solutions as chiaSolutions,
  validators as chiaValidators,
} from "@/visuals/math/phep-nhan-phep-chia/validators-chia";
import {
  solutions as cotSolutions,
  validators as cotValidators,
} from "@/visuals/math/phep-nhan-phep-chia/validators-cot";
import {
  solutions as nhanSolutions,
  validators as nhanValidators,
} from "@/visuals/math/phep-nhan-phep-chia/validators-nhan";
import {
  INTERACTIVE_KINDS as DIVISIBILITY_INTERACTIVE_KINDS,
  LESSON_SLUG as DIVISIBILITY_SLUG,
  VISUAL_SPECS as DIVISIBILITY_SPECS,
  VALIDATOR_IDS as DIVISIBILITY_VALIDATOR_IDS,
} from "@/visuals/math/quan-he-chia-het-va-tinh-chat/catalog";
import {
  solutions as divisibilitySolutions,
  validators as divisibilityValidators,
} from "@/visuals/math/quan-he-chia-het-va-tinh-chat/logic";
import {
  INTERACTIVE_KINDS as PRIME_INTERACTIVE_KINDS,
  LESSON_SLUG as PRIME_SLUG,
  VISUAL_SPECS as PRIME_SPECS,
  VALIDATOR_IDS as PRIME_VALIDATOR_IDS,
} from "@/visuals/math/so-nguyen-to/catalog";
import {
  pickMatches,
  solvePickMatches,
  solveXIsMember,
  xIsMember,
} from "@/visuals/math/tap-hop/set-validators";

import {
  gapsFilled,
  solveGapsFilled,
  solveStrokesDone,
  strokesDone,
} from "@/visuals/math/tap-hop/symbol-validators";
import {
  LESSON_SLUG as THU_TU_SLUG,
  VISUAL_SPECS as THU_TU_SPECS,
  tapRegions,
} from "@/visuals/math/thu-tu-thuc-hien-phep-tinh/catalog";
import {
  INTERACTIVE_KINDS as COMMON_INTERACTIVE_KINDS,
  LESSON_SLUG as COMMON_SLUG,
  VISUAL_SPECS as COMMON_SPECS,
  VALIDATOR_IDS as COMMON_VALIDATOR_IDS,
} from "@/visuals/math/uoc-chung-uoc-chung-lon-nhat/catalog";
import {
  solutions as commonSolutions,
  validators as commonValidators,
} from "@/visuals/math/uoc-chung-uoc-chung-lon-nhat/logic";

// State an interactive visual reports while the child manipulates it.
export type VisualState = Record<string, number>;

export type VisualProps = {
  onStateChange?: (state: VisualState) => void;
  // Shown instead of the child's own state, read-only: the revealed answer of
  // a `manipulate` exercise.
  shownState?: VisualState;
  // Locks an interactive visual once its answer is accepted or shown.
  disabled?: boolean;
  // The numbers of the `manipulate` exercise being answered, so a picture can
  // draw the task's own numbers. Absent on a lesson screen; a visual that
  // reads it falls back to a generic frame.
  params?: Record<string, number>;
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

// Entries of "thu-tu-thuc-hien-phep-tinh": one per item of its catalog, the
// pictures drawn from an expression. Only the "cùng làm" pictures, where the
// child taps the next operation, count as interactive.
const thuTuEntries: Record<string, VisualEntry> = Object.fromEntries(
  Object.entries(THU_TU_SPECS).map(([key, spec]) => [
    `${THU_TU_SLUG}.visual.${key}`,
    {
      interactive: spec.kind === "try",
      ...(spec.kind === "tap" ? { regions: tapRegions(spec.source) } : {}),
      load: () => lessonExample(THU_TU_SLUG, (m) => m.fromSpec(spec)),
    },
  ]),
);

const nhanChiaValidators = {
  ...nhanValidators,
  ...cotValidators,
  ...chiaValidators,
};
const nhanChiaSolutions = {
  ...nhanSolutions,
  ...cotSolutions,
  ...chiaSolutions,
};

// Entries of "phep-nhan-phep-chia": one per item of its catalog. Hands-on
// screens and `manipulate` exercises count as interactive; the `manipulate`
// kinds carry the validator and solver of their id.
const nhanChiaEntries: Record<string, VisualEntry> = Object.fromEntries(
  Object.entries(NHAN_CHIA_SPECS).map(([key, spec]) => {
    const validatorId =
      spec.kind in VALIDATOR_IDS
        ? VALIDATOR_IDS[spec.kind as keyof typeof VALIDATOR_IDS]
        : undefined;
    const entry: VisualEntry = {
      interactive: INTERACTIVE_KINDS.has(spec.kind),
      ...(spec.kind === "mulTableTap"
        ? { regions: mulTableRegions(spec) }
        : {}),
      ...(validatorId === undefined
        ? {}
        : {
            validators: { [validatorId]: nhanChiaValidators[validatorId] },
            solutions: { [validatorId]: nhanChiaSolutions[validatorId] },
          }),
      load: () => lessonExample(NHAN_CHIA_SLUG, (m) => m.fromSpec(spec)),
    };
    return [`${NHAN_CHIA_SLUG}.visual.${key}`, entry];
  }),
);

// Entries of "phep-cong-phep-tru": one per item of its catalog. The pictures
// the child acts on (pick a pair, choose a shift, fill a column) are
// interactive and carry the validator of the `manipulate` exercises built on
// them.
function congTruMeta(spec: (typeof CONG_TRU_SPECS)[string]): VisualMeta {
  switch (spec.kind) {
    case "tap-parts":
      return { interactive: false, regions: TAP_PARTS_REGIONS };
    case "pair-try":
      return {
        interactive: true,
        validators: { "cap-tron": pairRound },
        solutions: { "cap-tron": solvePairRound },
      };
    case "shift-try":
      return {
        interactive: true,
        validators: { "them-bot-tron": shiftRound },
        solutions: { "them-bot-tron": solveShiftRound },
      };
    case "column-try":
      return {
        interactive: true,
        validators: { "cot-tinh": columnStep },
        solutions: { "cot-tinh": solveColumnStep },
      };
    default:
      return { interactive: false };
  }
}

const congTruEntries: Record<string, VisualEntry> = Object.fromEntries(
  Object.entries(CONG_TRU_SPECS).map(([key, spec]) => [
    `${CONG_TRU_SLUG}.visual.${key}`,
    {
      ...congTruMeta(spec),
      load: () => lessonExample(CONG_TRU_SLUG, (m) => m.fromSpec(spec)),
    },
  ]),
);

// Entries of "quan-he-chia-het-va-tinh-chat": one per item of its catalog. The
// bag-size screen has its own validator; the pick screens reuse the set
// lesson's "chon-dung" validator (one key per chip, 1 = picked).
const divisibilityPickValidators = {
  tui: divisibilityValidators.tui,
  "chon-dung": pickMatches,
};
const divisibilityPickSolutions = {
  tui: divisibilitySolutions.tui,
  "chon-dung": solvePickMatches,
};

const divisibilityEntries: Record<string, VisualEntry> = Object.fromEntries(
  Object.entries(DIVISIBILITY_SPECS).map(([key, spec]) => {
    const validatorId =
      spec.kind in DIVISIBILITY_VALIDATOR_IDS
        ? DIVISIBILITY_VALIDATOR_IDS[
            spec.kind as keyof typeof DIVISIBILITY_VALIDATOR_IDS
          ]
        : undefined;
    const entry: VisualEntry = {
      interactive: DIVISIBILITY_INTERACTIVE_KINDS.has(spec.kind),
      ...(validatorId === undefined
        ? {}
        : {
            validators: {
              [validatorId]: divisibilityPickValidators[validatorId],
            },
            solutions: {
              [validatorId]: divisibilityPickSolutions[validatorId],
            },
          }),
      load: () => lessonExample(DIVISIBILITY_SLUG, (m) => m.fromSpec(spec)),
    };
    return [`${DIVISIBILITY_SLUG}.visual.${key}`, entry];
  }),
);

// Entries of "dau-hieu-chia-het": one per item of its catalog. The box screen
// has its own validator; the pick screens reuse "chon-dung".
const signPickValidators = {
  "chia-het": signValidators["chia-het"],
  "chon-dung": pickMatches,
};
const signPickSolutions = {
  "chia-het": signSolutions["chia-het"],
  "chon-dung": solvePickMatches,
};

const signEntries: Record<string, VisualEntry> = Object.fromEntries(
  Object.entries(SIGN_SPECS).map(([key, spec]) => {
    const validatorId =
      spec.kind in SIGN_VALIDATOR_IDS
        ? SIGN_VALIDATOR_IDS[spec.kind as keyof typeof SIGN_VALIDATOR_IDS]
        : undefined;
    const entry: VisualEntry = {
      interactive: SIGN_INTERACTIVE_KINDS.has(spec.kind),
      ...(validatorId === undefined
        ? {}
        : {
            validators: { [validatorId]: signPickValidators[validatorId] },
            solutions: { [validatorId]: signPickSolutions[validatorId] },
          }),
      load: () => lessonExample(SIGN_SLUG, (m) => m.fromSpec(spec)),
    };
    return [`${SIGN_SLUG}.visual.${key}`, entry];
  }),
);

// Entries of "so-nguyen-to": one per item of its catalog. The pick screens
// reuse "chon-dung".
const primeEntries: Record<string, VisualEntry> = Object.fromEntries(
  Object.entries(PRIME_SPECS).map(([key, spec]) => {
    const validatorId =
      spec.kind in PRIME_VALIDATOR_IDS
        ? PRIME_VALIDATOR_IDS[spec.kind as keyof typeof PRIME_VALIDATOR_IDS]
        : undefined;
    const entry: VisualEntry = {
      interactive: PRIME_INTERACTIVE_KINDS.has(spec.kind),
      ...(validatorId === undefined
        ? {}
        : {
            validators: { [validatorId]: pickMatches },
            solutions: { [validatorId]: solvePickMatches },
          }),
      load: () => lessonExample(PRIME_SLUG, (m) => m.fromSpec(spec)),
    };
    return [`${PRIME_SLUG}.visual.${key}`, entry];
  }),
);

// Entries of "uoc-chung-uoc-chung-lon-nhat": one per item of its catalog. The
// strip screen has its own validator; the pick screens reuse "chon-dung".
const commonPickValidators = {
  "cat-vua-het": commonValidators["cat-vua-het"],
  "chon-dung": pickMatches,
};
const commonPickSolutions = {
  "cat-vua-het": commonSolutions["cat-vua-het"],
  "chon-dung": solvePickMatches,
};

const commonEntries: Record<string, VisualEntry> = Object.fromEntries(
  Object.entries(COMMON_SPECS).map(([key, spec]) => {
    const validatorId =
      spec.kind in COMMON_VALIDATOR_IDS
        ? COMMON_VALIDATOR_IDS[spec.kind as keyof typeof COMMON_VALIDATOR_IDS]
        : undefined;
    const entry: VisualEntry = {
      interactive: COMMON_INTERACTIVE_KINDS.has(spec.kind),
      ...(validatorId === undefined
        ? {}
        : {
            validators: { [validatorId]: commonPickValidators[validatorId] },
            solutions: { [validatorId]: commonPickSolutions[validatorId] },
          }),
      load: () => lessonExample(COMMON_SLUG, (m) => m.fromSpec(spec)),
    };
    return [`${COMMON_SLUG}.visual.${key}`, entry];
  }),
);

// Entries of "boi-chung-boi-chung-nho-nhat": one per item of its catalog. The
// rounds screen has its own validator; the pick screens reuse "chon-dung".
const multiplePickValidators = {
  "gap-nhau": multipleValidators["gap-nhau"],
  "chon-dung": pickMatches,
};
const multiplePickSolutions = {
  "gap-nhau": multipleSolutions["gap-nhau"],
  "chon-dung": solvePickMatches,
};

const multipleEntries: Record<string, VisualEntry> = Object.fromEntries(
  Object.entries(MULTIPLE_SPECS).map(([key, spec]) => {
    const validatorId =
      spec.kind in MULTIPLE_VALIDATOR_IDS
        ? MULTIPLE_VALIDATOR_IDS[
            spec.kind as keyof typeof MULTIPLE_VALIDATOR_IDS
          ]
        : undefined;
    const entry: VisualEntry = {
      interactive: MULTIPLE_INTERACTIVE_KINDS.has(spec.kind),
      ...(validatorId === undefined
        ? {}
        : {
            validators: { [validatorId]: multiplePickValidators[validatorId] },
            solutions: { [validatorId]: multiplePickSolutions[validatorId] },
          }),
      load: () => lessonExample(MULTIPLE_SLUG, (m) => m.fromSpec(spec)),
    };
    return [`${MULTIPLE_SLUG}.visual.${key}`, entry];
  }),
);

export const visualRegistry: Readonly<Record<string, VisualEntry>> = {
  ...primeEntries,
  ...thuTuEntries,
  ...nhanChiaEntries,
  ...congTruEntries,
  ...divisibilityEntries,
  ...signEntries,
  ...commonEntries,
  ...multipleEntries,
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
  "tap-hop.visual.hop-but": {
    interactive: false,
    load: () => lessonExample("tap-hop", (m) => m.HopBut),
  },
  "tap-hop.visual.thuoc-hop-but": {
    interactive: false,
    load: () => lessonExample("tap-hop", (m) => m.ThuocHopBut),
  },
  "tap-hop.visual.vi-du-tap-hop": {
    interactive: false,
    load: () => lessonExample("tap-hop", (m) => m.ViDuTapHop),
  },
  "tap-hop.visual.vi-du-phan-tu": {
    interactive: false,
    load: () => lessonExample("tap-hop", (m) => m.ViDuPhanTu),
  },
  "tap-hop.visual.tom-tat-tap-hop": {
    interactive: false,
    load: () => lessonExample("tap-hop", (m) => m.TomTatTapHop),
  },
  "tap-hop.visual.the-tap-hop": {
    interactive: false,
    load: () => lessonExample("tap-hop", (m) => m.TheTapHop),
  },
  "tap-hop.visual.the-phan-tu": {
    interactive: false,
    load: () => lessonExample("tap-hop", (m) => m.ThePhanTu),
  },
  "tap-hop.visual.lap-ghep-liet-ke": {
    interactive: false,
    load: () => lessonExample("tap-hop", (m) => m.LapGhepLietKe),
  },
  "tap-hop.visual.vi-du-liet-ke": {
    interactive: false,
    load: () => lessonExample("tap-hop", (m) => m.ViDuLietKe),
  },
  "tap-hop.visual.the-liet-ke": {
    interactive: false,
    load: () => lessonExample("tap-hop", (m) => m.TheLietKe),
  },
  "tap-hop.visual.xet-mau": {
    interactive: false,
    load: () => lessonExample("tap-hop", (m) => m.XetMau),
  },
  "tap-hop.visual.xet-vi-du": {
    interactive: false,
    load: () => lessonExample("tap-hop", (m) => m.XetViDu),
  },
  "tap-hop.visual.the-xet-thuoc": {
    interactive: false,
    load: () => lessonExample("tap-hop", (m) => m.TheXetThuoc),
  },
  "tap-hop.visual.dau-hieu-vi-du": {
    interactive: false,
    load: () => lessonExample("tap-hop", (m) => m.DauHieuViDu),
  },
  "tap-hop.visual.doc-dau-hieu": {
    interactive: false,
    load: () => lessonExample("tap-hop", (m) => m.DocDauHieu),
  },
  "tap-hop.visual.the-dau-hieu": {
    interactive: false,
    load: () => lessonExample("tap-hop", (m) => m.TheDauHieu),
  },
  "tap-hop.visual.hai-cach-vi-du": {
    interactive: false,
    load: () => lessonExample("tap-hop", (m) => m.HaiCachViDu),
  },
  "tap-hop.visual.doi-tu-liet-ke": {
    interactive: false,
    load: () => lessonExample("tap-hop", (m) => m.DoiTuLietKe),
  },
  "tap-hop.visual.the-hai-cach": {
    interactive: false,
    load: () => lessonExample("tap-hop", (m) => m.TheHaiCach),
  },
  "tap-hop.visual.the-doi-cach": {
    interactive: false,
    load: () => lessonExample("tap-hop", (m) => m.TheDoiCach),
  },
  "tap-hop.visual.sticker": {
    interactive: false,
    load: () => lessonExample("tap-hop", (m) => m.Sticker),
  },
  "tap-hop.visual.ve-mo-ngoac": {
    interactive: false,
    load: () => lessonExample("tap-hop", (m) => m.VeMoNgoac),
  },
  "tap-hop.visual.ve-dong-ngoac": {
    interactive: false,
    load: () => lessonExample("tap-hop", (m) => m.VeDongNgoac),
  },
  "tap-hop.visual.ve-cham-phay": {
    interactive: false,
    load: () => lessonExample("tap-hop", (m) => m.VeChamPhay),
  },
  "tap-hop.visual.ve-thuoc": {
    interactive: false,
    load: () => lessonExample("tap-hop", (m) => m.VeThuoc),
  },
  "tap-hop.visual.ve-khong-thuoc": {
    interactive: false,
    load: () => lessonExample("tap-hop", (m) => m.VeKhongThuoc),
  },
  "tap-hop.visual.the-ngoac-mo": {
    interactive: false,
    load: () => lessonExample("tap-hop", (m) => m.TheNgoacMo),
  },
  "tap-hop.visual.the-ngoac-dong": {
    interactive: false,
    load: () => lessonExample("tap-hop", (m) => m.TheNgoacDong),
  },
  "tap-hop.visual.the-cham-phay": {
    interactive: false,
    load: () => lessonExample("tap-hop", (m) => m.TheChamPhay),
  },
  "tap-hop.visual.the-thuoc": {
    interactive: false,
    load: () => lessonExample("tap-hop", (m) => m.TheThuoc),
  },
  "tap-hop.visual.the-khong-thuoc": {
    interactive: false,
    load: () => lessonExample("tap-hop", (m) => m.TheKhongThuoc),
  },
  "tap-hop.visual.ngoac-vi-du": {
    interactive: false,
    load: () => lessonExample("tap-hop", (m) => m.NgoacViDu),
  },
  "tap-hop.visual.ngoac-du-hai-dau": {
    interactive: false,
    load: () => lessonExample("tap-hop", (m) => m.NgoacDuHaiDau),
  },
  "tap-hop.visual.cham-phay-vi-du": {
    interactive: false,
    load: () => lessonExample("tap-hop", (m) => m.ChamPhayViDu),
  },
  "tap-hop.visual.vi-du-thuoc": {
    interactive: false,
    load: () => lessonExample("tap-hop", (m) => m.ViDuThuoc),
  },
  "tap-hop.visual.vi-du-khong-thuoc": {
    interactive: false,
    load: () => lessonExample("tap-hop", (m) => m.ViDuKhongThuoc),
  },
  "tap-hop.visual.huong-dan-chip": {
    interactive: false,
    load: () => lessonExample("tap-hop", (m) => m.HuongDanChip),
  },
  "tap-hop.visual.chon-hop-but": {
    interactive: true,
    load: () =>
      lessonExample("tap-hop", (m) =>
        m.pickItems(["bút chì", "cục tẩy", "quả cam", "thước kẻ", "con mèo"]),
      ),
  },
  "tap-hop.visual.chon-do-dung": {
    interactive: true,
    validators: { "chon-dung": pickMatches },
    solutions: { "chon-dung": solvePickMatches },
    load: () =>
      lessonExample("tap-hop", (m) =>
        m.pickItems(["thước", "quả bóng", "tẩy", "đĩa", "vở", "bút"]),
      ),
  },
  "tap-hop.visual.hop-cham": {
    interactive: false,
    regions: ["but", "thuoc", "tay"],
    load: () => lessonExample("tap-hop", (m) => m.HopCham),
  },
  "tap-hop.visual.cham-dau-hieu": {
    interactive: false,
    regions: ["phan-tu-mau", "vach-dung", "dau-hieu"],
    load: () => lessonExample("tap-hop", (m) => m.DauHieuCham),
  },
  "tap-hop.visual.chon-x-tu-do": {
    interactive: true,
    load: () =>
      lessonExample("tap-hop", (m) => m.chooseX([1, 2, 3], 5, true, 4)),
  },
  "tap-hop.visual.chon-x-thuoc": {
    interactive: true,
    validators: { "x-thuoc": xIsMember },
    solutions: { "x-thuoc": solveXIsMember },
    load: () =>
      lessonExample("tap-hop", (m) => m.chooseX([2, 4, 6, 8], 9, false, 0)),
  },
  "tap-hop.visual.chon-x-khong-thuoc": {
    interactive: true,
    validators: { "x-thuoc": xIsMember },
    solutions: { "x-thuoc": solveXIsMember },
    load: () =>
      lessonExample("tap-hop", (m) => m.chooseX([1, 3, 5], 7, false, 1)),
  },
  "tap-hop.visual.tap-net-ngoac-mo": {
    interactive: true,
    validators: { "ve-xong": strokesDone },
    solutions: { "ve-xong": solveStrokesDone },
    load: () => lessonExample("tap-hop", (m) => m.tapNet("ngoac-mo")),
  },
  "tap-hop.visual.tap-net-ngoac-dong": {
    interactive: true,
    validators: { "ve-xong": strokesDone },
    solutions: { "ve-xong": solveStrokesDone },
    load: () => lessonExample("tap-hop", (m) => m.tapNet("ngoac-dong")),
  },
  "tap-hop.visual.tap-net-khong-thuoc": {
    interactive: true,
    load: () => lessonExample("tap-hop", (m) => m.tapNet("khong-thuoc")),
  },
  "tap-hop.visual.huong-dan-cham": {
    interactive: false,
    load: () => lessonExample("tap-hop", (m) => m.HuongDanCham),
  },
  "tap-hop.visual.cham-dau-giua": {
    interactive: false,
    regions: ["hai-cham", "cham-phay", "cham", "phay"],
    load: () =>
      lessonExample("tap-hop", (m) =>
        m.symbolTap(["hai-cham", "cham-phay", "cham", "phay"]),
      ),
  },
  "tap-hop.visual.tap-net-thuoc": {
    interactive: true,
    load: () => lessonExample("tap-hop", (m) => m.tapNet("thuoc")),
  },
  "tap-hop.visual.dat-cham-phay": {
    interactive: true,
    load: () => lessonExample("tap-hop", (m) => m.datChamPhay(3, 1)),
  },
  "tap-hop.visual.dat-cham-phay-bon": {
    interactive: true,
    validators: { "du-cham-phay": gapsFilled },
    solutions: { "du-cham-phay": solveGapsFilled },
    load: () => lessonExample("tap-hop", (m) => m.datChamPhay(4, 5)),
  },
  "tap-hop.visual.cham-ngoac": {
    interactive: false,
    regions: [
      "ngoac-tron-mo",
      "ngoac-vuong-mo",
      "ngoac-nhon-mo",
      "ngoac-nhon-dong",
      "ngoac-tron-dong",
    ],
    load: () =>
      lessonExample("tap-hop", (m) =>
        m.symbolTap([
          "ngoac-tron-mo",
          "ngoac-vuong-mo",
          "ngoac-nhon-mo",
          "ngoac-nhon-dong",
          "ngoac-tron-dong",
        ]),
      ),
  },
  "tap-hop.visual.cham-dau-ngan": {
    interactive: false,
    regions: ["nho-hon", "phay", "cham-phay", "bang"],
    load: () =>
      lessonExample("tap-hop", (m) =>
        m.symbolTap(["nho-hon", "phay", "cham-phay", "bang"]),
      ),
  },
  "tap-hop.visual.cham-ki-hieu-thuoc": {
    interactive: false,
    regions: ["bang", "thuoc", "cham-phay", "ngoac-nhon-mo"],
    load: () =>
      lessonExample("tap-hop", (m) =>
        m.symbolTap(["bang", "thuoc", "cham-phay", "ngoac-nhon-mo"]),
      ),
  },
  "tap-hop.visual.cham-ki-hieu-khong-thuoc": {
    interactive: false,
    regions: ["nho-hon", "thuoc", "khong-thuoc", "bang"],
    load: () =>
      lessonExample("tap-hop", (m) =>
        m.symbolTap(["nho-hon", "thuoc", "khong-thuoc", "bang"]),
      ),
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
    load: () => lessonExample("luy-thua", (m) => m.tapPower(3, 5)),
  },
  "luy-thua.visual.binh-phuong-lap-phuong": {
    interactive: true,
    validators: { "luy-thua-la": powerIs },
    solutions: { "luy-thua-la": solvePowerIs },
    load: () => import("@/visuals/math/luy-thua/binh-phuong-lap-phuong"),
  },
  "luy-thua.visual.tinh-3-mu-3-goi-y": {
    interactive: false,
    load: () =>
      lessonExample("luy-thua", (m) => m.repeatedProduct(3, 3, "hint")),
  },
  "luy-thua.visual.tinh-3-mu-3": {
    interactive: false,
    load: () =>
      lessonExample("luy-thua", (m) => m.repeatedProduct(3, 3, "solution")),
  },
  "luy-thua.visual.tinh-4-mu-3-goi-y": {
    interactive: false,
    load: () =>
      lessonExample("luy-thua", (m) => m.repeatedProduct(4, 3, "hint")),
  },
  "luy-thua.visual.tinh-8-mu-2-goi-y": {
    interactive: false,
    load: () =>
      lessonExample("luy-thua", (m) => m.repeatedProduct(8, 2, "hint")),
  },
  "luy-thua.visual.tinh-10-mu-3-goi-y": {
    interactive: false,
    load: () =>
      lessonExample("luy-thua", (m) => m.repeatedProduct(10, 3, "hint")),
  },
  "luy-thua.visual.tinh-5-mu-3-goi-y": {
    interactive: false,
    load: () =>
      lessonExample("luy-thua", (m) => m.repeatedProduct(5, 3, "hint")),
  },
  "luy-thua.visual.phan-tich-xep-gia-tri": {
    interactive: false,
    load: () =>
      lessonExample("luy-thua", (m) =>
        m.factorList([
          { base: 5, exponent: 2 },
          { base: 2, exponent: 3 },
          { base: 4, exponent: 2 },
          { base: 3, exponent: 2 },
        ]),
      ),
  },
  "luy-thua.visual.phan-tich-binh-phuong": {
    interactive: false,
    load: () =>
      lessonExample("luy-thua", (m) =>
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
      lessonExample("luy-thua", (m) =>
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
    load: () =>
      lessonExample("luy-thua", (m) => m.repeatedProduct(4, 3, "solution")),
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
    load: () => lessonExample("luy-thua", (m) => m.zeroExponent("hint")),
  },
  "luy-thua.visual.so-mu-an-3": {
    interactive: false,
    load: () =>
      lessonExample("luy-thua", (m) => m.hiddenExponentOne(3, [4, 1])),
  },
  "luy-thua.visual.so-mu-an-10": {
    interactive: false,
    load: () =>
      lessonExample("luy-thua", (m) => m.hiddenExponentOne(10, [2, 1, 4])),
  },
  "luy-thua.visual.so-mu-an-7": {
    interactive: false,
    load: () =>
      lessonExample("luy-thua", (m) => m.hiddenExponentOne(7, [1, 3])),
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
    load: () => lessonExample("luy-thua", (m) => m.placeValueSum(5247)),
  },
  "luy-thua.visual.dinh-nghia": {
    interactive: false,
    load: () => lessonExample("luy-thua", (m) => m.DinhNghia),
  },
  "luy-thua.visual.ket-ban-co": {
    interactive: false,
    load: () => lessonExample("luy-thua", (m) => m.KetBanCo),
  },
  "luy-thua.visual.quy-tac-so-mu-1": {
    interactive: false,
    load: () => lessonExample("luy-thua", (m) => m.QuyTacSoMu1),
  },
  "luy-thua.visual.bam-mu": {
    interactive: false,
    load: () => lessonExample("luy-thua", (m) => m.BamMu),
  },
  "luy-thua.visual.doc-binh-phuong": {
    interactive: false,
    load: () => lessonExample("luy-thua", (m) => m.squareAndCube(2)),
  },
  "luy-thua.visual.tinh-tung-buoc": {
    interactive: false,
    load: () =>
      lessonExample("luy-thua", (m) => m.repeatedProduct(2, 5, "solution")),
  },
  "luy-thua.visual.quy-tac-nhan": {
    interactive: false,
    load: () => lessonExample("luy-thua", (m) => m.QuyTacNhan),
  },
  "luy-thua.visual.quy-tac-so-mu-an": {
    interactive: false,
    load: () => lessonExample("luy-thua", (m) => m.QuyTacSoMuAn),
  },
  "luy-thua.visual.quy-tac-chia": {
    interactive: false,
    load: () => lessonExample("luy-thua", (m) => m.QuyTacChia),
  },
  "luy-thua.visual.quy-tac-so-mu-0": {
    interactive: false,
    load: () => lessonExample("luy-thua", (m) => m.zeroExponent("solution")),
  },
  "luy-thua.visual.quy-tac-luy-thua-10": {
    interactive: false,
    load: () => lessonExample("luy-thua", (m) => m.QuyTacLuyThua10),
  },
  "luy-thua.visual.quy-tac-tach-so": {
    interactive: false,
    load: () => import("@/visuals/math/luy-thua/tach-so"),
  },
  "luy-thua.visual.tom-tat-dinh-nghia": {
    interactive: false,
    load: () => lessonExample("luy-thua", (m) => m.TomTatDinhNghia),
  },
  "luy-thua.visual.tom-tat-binh-phuong": {
    interactive: false,
    load: () => lessonExample("luy-thua", (m) => m.TomTatBinhPhuong),
  },
  "luy-thua.visual.tom-tat-nhan": {
    interactive: false,
    load: () => lessonExample("luy-thua", (m) => m.TomTatNhan),
  },
  "luy-thua.visual.tom-tat-chia": {
    interactive: false,
    load: () => lessonExample("luy-thua", (m) => m.TomTatChia),
  },
  "luy-thua.visual.tom-tat-luy-thua-10": {
    interactive: false,
    load: () => lessonExample("luy-thua", (m) => m.TomTatLuyThua10),
  },
  "luy-thua.visual.the-viet-luy-thua": {
    interactive: false,
    load: () => lessonExample("luy-thua", (m) => m.TheVietLuyThua),
  },
  "luy-thua.visual.the-co-so-so-mu": {
    interactive: false,
    load: () => lessonExample("luy-thua", (m) => m.TheCoSoSoMu),
  },
  "luy-thua.visual.the-so-mu-1": {
    interactive: false,
    load: () => lessonExample("luy-thua", (m) => m.TheSoMu1),
  },
  "luy-thua.visual.the-binh-phuong": {
    interactive: false,
    load: () => lessonExample("luy-thua", (m) => m.TheBinhPhuong),
  },
  "luy-thua.visual.the-lap-phuong": {
    interactive: false,
    load: () => lessonExample("luy-thua", (m) => m.TheLapPhuong),
  },
  "luy-thua.visual.the-tinh-gia-tri": {
    interactive: false,
    load: () => lessonExample("luy-thua", (m) => m.TheTinhGiaTri),
  },
  "luy-thua.visual.the-nhan-cung-co-so": {
    interactive: false,
    load: () => lessonExample("luy-thua", (m) => m.TheNhanCungCoSo),
  },
  "luy-thua.visual.the-nhan-so-mu-1": {
    interactive: false,
    load: () => lessonExample("luy-thua", (m) => m.TheNhanSoMu1),
  },
  "luy-thua.visual.the-chia-cung-co-so": {
    interactive: false,
    load: () => lessonExample("luy-thua", (m) => m.TheChiaCungCoSo),
  },
  "luy-thua.visual.the-so-mu-0": {
    interactive: false,
    load: () => lessonExample("luy-thua", (m) => m.TheSoMu0),
  },
  "luy-thua.visual.the-luy-thua-10": {
    interactive: false,
    load: () => lessonExample("luy-thua", (m) => m.TheLuyThua10),
  },
  "luy-thua.visual.the-tong-luy-thua-10": {
    interactive: false,
    load: () => lessonExample("luy-thua", (m) => m.TheTongLuyThua10),
  },
  "luy-thua.visual.sticker": {
    interactive: false,
    load: () => import("@/visuals/math/luy-thua/sticker"),
  },
  "neu-cau-muon-co-mot-nguoi-ban.visual.boi-canh": {
    interactive: false,
    load: () =>
      import("@/visuals/literature/neu-cau-muon-co-mot-nguoi-ban/boi-canh"),
  },
  "neu-cau-muon-co-mot-nguoi-ban.visual.ai-noi": {
    interactive: true,
    load: () =>
      import("@/visuals/literature/neu-cau-muon-co-mot-nguoi-ban/ai-noi"),
  },
  "neu-cau-muon-co-mot-nguoi-ban.visual.tram-nghin": {
    interactive: true,
    load: () =>
      import("@/visuals/literature/neu-cau-muon-co-mot-nguoi-ban/tram-nghin"),
  },
  "neu-cau-muon-co-mot-nguoi-ban.visual.hanh-tinh": {
    interactive: false,
    load: () =>
      import("@/visuals/literature/neu-cau-muon-co-mot-nguoi-ban/hanh-tinh"),
  },
  "neu-cau-muon-co-mot-nguoi-ban.visual.truoc-sau": {
    interactive: true,
    load: () =>
      import("@/visuals/literature/neu-cau-muon-co-mot-nguoi-ban/truoc-sau"),
  },
  "neu-cau-muon-co-mot-nguoi-ban.visual.so-sanh-tac-dung": {
    interactive: false,
    load: () =>
      import(
        "@/visuals/literature/neu-cau-muon-co-mot-nguoi-ban/so-sanh-tac-dung"
      ),
  },
  "neu-cau-muon-co-mot-nguoi-ban.visual.xich-lai-gan": {
    interactive: true,
    load: () =>
      import("@/visuals/literature/neu-cau-muon-co-mot-nguoi-ban/xich-lai-gan"),
  },
  "neu-cau-muon-co-mot-nguoi-ban.visual.cam-xuc-cao": {
    interactive: false,
    load: () =>
      import("@/visuals/literature/neu-cau-muon-co-mot-nguoi-ban/cam-xuc-cao"),
  },
  "neu-cau-muon-co-mot-nguoi-ban.visual.lap-lai-tac-dung": {
    interactive: false,
    load: () =>
      import(
        "@/visuals/literature/neu-cau-muon-co-mot-nguoi-ban/lap-lai-tac-dung"
      ),
  },
  "neu-cau-muon-co-mot-nguoi-ban.visual.cham-tu": {
    interactive: true,
    load: () =>
      import("@/visuals/literature/neu-cau-muon-co-mot-nguoi-ban/cham-tu"),
  },
  "neu-cau-muon-co-mot-nguoi-ban.visual.sticker": {
    interactive: false,
    load: () =>
      import("@/visuals/literature/neu-cau-muon-co-mot-nguoi-ban/sticker"),
  },
  "neu-cau-muon-co-mot-nguoi-ban.visual.loi-thoai-mau": {
    interactive: false,
    load: () =>
      lessonExample("neu-cau-muon-co-mot-nguoi-ban", (m) => m.LoiThoaiMau),
  },
  "neu-cau-muon-co-mot-nguoi-ban.visual.huong-dan-cham-cau": {
    interactive: false,
    load: () =>
      lessonExample("neu-cau-muon-co-mot-nguoi-ban", (m) => m.HuongDanChamCau),
  },
  "neu-cau-muon-co-mot-nguoi-ban.visual.huong-dan-noi": {
    interactive: false,
    load: () =>
      lessonExample("neu-cau-muon-co-mot-nguoi-ban", (m) => m.HuongDanNoi),
  },
  "neu-cau-muon-co-mot-nguoi-ban.visual.huong-dan-xep": {
    interactive: false,
    load: () =>
      lessonExample("neu-cau-muon-co-mot-nguoi-ban", (m) => m.HuongDanXep),
  },
  "neu-cau-muon-co-mot-nguoi-ban.visual.huong-dan-dien": {
    interactive: false,
    load: () =>
      lessonExample("neu-cau-muon-co-mot-nguoi-ban", (m) => m.HuongDanDien),
  },
  "neu-cau-muon-co-mot-nguoi-ban.visual.cam-hoa": {
    interactive: false,
    load: () => lessonExample("neu-cau-muon-co-mot-nguoi-ban", (m) => m.CamHoa),
  },
  "neu-cau-muon-co-mot-nguoi-ban.visual.duy-nhat": {
    interactive: false,
    load: () =>
      lessonExample("neu-cau-muon-co-mot-nguoi-ban", (m) => m.DuyNhat),
  },
  "neu-cau-muon-co-mot-nguoi-ban.visual.hanh-tinh-tom-tat": {
    interactive: false,
    load: () =>
      lessonExample("neu-cau-muon-co-mot-nguoi-ban", (m) => m.HanhTinhTomTat),
  },
  "neu-cau-muon-co-mot-nguoi-ban.visual.truoc-sau-tom-tat": {
    interactive: false,
    load: () =>
      lessonExample("neu-cau-muon-co-mot-nguoi-ban", (m) => m.TruocSauTomTat),
  },
  "neu-cau-muon-co-mot-nguoi-ban.visual.so-sanh-buoc-chan": {
    interactive: false,
    load: () =>
      lessonExample("neu-cau-muon-co-mot-nguoi-ban", (m) => m.SoSanhBuocChan),
  },
  "neu-cau-muon-co-mot-nguoi-ban.visual.so-sanh-tac-dung-tom-tat": {
    interactive: false,
    load: () =>
      lessonExample(
        "neu-cau-muon-co-mot-nguoi-ban",
        (m) => m.SoSanhTacDungTomTat,
      ),
  },
  "neu-cau-muon-co-mot-nguoi-ban.visual.so-sanh-cho-trong": {
    interactive: false,
    load: () =>
      lessonExample("neu-cau-muon-co-mot-nguoi-ban", (m) => m.SoSanhChoTrong),
  },
  "neu-cau-muon-co-mot-nguoi-ban.visual.xich-lai-gan-tom-tat": {
    interactive: false,
    load: () =>
      lessonExample("neu-cau-muon-co-mot-nguoi-ban", (m) => m.XichLaiGanTomTat),
  },
  "neu-cau-muon-co-mot-nguoi-ban.visual.cam-xuc-tom-tat": {
    interactive: false,
    load: () =>
      lessonExample("neu-cau-muon-co-mot-nguoi-ban", (m) => m.CamXucTomTat),
  },
  "neu-cau-muon-co-mot-nguoi-ban.visual.bai-hoc": {
    interactive: false,
    load: () => lessonExample("neu-cau-muon-co-mot-nguoi-ban", (m) => m.BaiHoc),
  },
  "neu-cau-muon-co-mot-nguoi-ban.visual.nghia-tu": {
    interactive: false,
    load: () =>
      lessonExample("neu-cau-muon-co-mot-nguoi-ban", (m) => m.NghiaTu),
  },
  "neu-cau-muon-co-mot-nguoi-ban.visual.loi-lap-lai": {
    interactive: false,
    load: () =>
      lessonExample("neu-cau-muon-co-mot-nguoi-ban", (m) => m.LoiLapLai),
  },
  "neu-cau-muon-co-mot-nguoi-ban.visual.tu-ghep-tu-lay": {
    interactive: false,
    load: () =>
      lessonExample("neu-cau-muon-co-mot-nguoi-ban", (m) => m.TuGhepTuLay),
  },
  "neu-cau-muon-co-mot-nguoi-ban.visual.goi-y-tu-lay": {
    interactive: false,
    load: () =>
      lessonExample("neu-cau-muon-co-mot-nguoi-ban", (m) => m.GoiYTuLay),
  },
  "neu-cau-muon-co-mot-nguoi-ban.visual.goi-y-tu-ghep": {
    interactive: false,
    load: () =>
      lessonExample("neu-cau-muon-co-mot-nguoi-ban", (m) => m.GoiYTuGhep),
  },
  "neu-cau-muon-co-mot-nguoi-ban.visual.dan-y": {
    interactive: false,
    load: () => lessonExample("neu-cau-muon-co-mot-nguoi-ban", (m) => m.DanY),
  },
  "neu-cau-muon-co-mot-nguoi-ban.visual.cau-mau": {
    interactive: false,
    load: () => lessonExample("neu-cau-muon-co-mot-nguoi-ban", (m) => m.CauMau),
  },
};

// Each lesson's examples module (src/visuals/<subject>/<slug>/examples.tsx):
// components and factories that several registry entries share, e.g. one
// component drawn with different numbers. Listed statically so the bundler
// splits each into its own chunk; a new lesson adds its slug here. The module
// has no "use client", so the dev visual page (a server component) may call
// its factories while loading a visual.
type Loaders<T> = { [S in keyof T]: () => Promise<T[S]> };
// Identity at runtime; types each slug's loader with its own module.
const lessonModules = <T>(loaders: Loaders<T>): Loaders<T> => loaders;

const EXAMPLE_MODULES = lessonModules({
  "tap-hop": () => import("@/visuals/math/tap-hop/examples"),
  "luy-thua": () => import("@/visuals/math/luy-thua/examples"),
  "phep-cong-phep-tru": () =>
    import("@/visuals/math/phep-cong-phep-tru/examples"),
  "thu-tu-thuc-hien-phep-tinh": () =>
    import("@/visuals/math/thu-tu-thuc-hien-phep-tinh/examples"),
  "phep-nhan-phep-chia": () =>
    import("@/visuals/math/phep-nhan-phep-chia/examples"),
  "quan-he-chia-het-va-tinh-chat": () =>
    import("@/visuals/math/quan-he-chia-het-va-tinh-chat/examples"),
  "dau-hieu-chia-het": () =>
    import("@/visuals/math/dau-hieu-chia-het/examples"),
  "so-nguyen-to": () => import("@/visuals/math/so-nguyen-to/examples"),
  "uoc-chung-uoc-chung-lon-nhat": () =>
    import("@/visuals/math/uoc-chung-uoc-chung-lon-nhat/examples"),
  "boi-chung-boi-chung-nho-nhat": () =>
    import("@/visuals/math/boi-chung-boi-chung-nho-nhat/examples"),
  "neu-cau-muon-co-mot-nguoi-ban": () =>
    import("@/visuals/literature/neu-cau-muon-co-mot-nguoi-ban/examples"),
});
type ExampleModules =
  typeof EXAMPLE_MODULES extends Loaders<infer T> ? T : never;

// `pick` returns an export of the lesson's examples module or calls one of its
// factories: lessonExample("luy-thua", (m) => m.repeatedProduct(3, 3, "hint")).
async function lessonExample<S extends keyof ExampleModules>(
  slug: S,
  pick: (examples: ExampleModules[S]) => ComponentType<VisualProps>,
): Promise<{ default: ComponentType<VisualProps> }> {
  return { default: pick(await EXAMPLE_MODULES[slug]()) };
}

// Own keys only, so a URL like /dev/visuals/constructor never resolves to an
// Object.prototype member.
export function findVisual(id: string): VisualEntry | undefined {
  return Object.hasOwn(visualRegistry, id) ? visualRegistry[id] : undefined;
}
