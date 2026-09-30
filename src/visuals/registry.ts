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
    regions: ["hop", "but", "thuoc", "tay"],
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
      lessonExample("tap-hop", (m) => m.chooseX([1, 3, 5], 7, true, 1)),
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
  "tap-hop.visual.tap-net-thuoc": {
    interactive: true,
    load: () => lessonExample("tap-hop", (m) => m.tapNet("thuoc")),
  },
  "tap-hop.visual.dat-cham-phay": {
    interactive: true,
    load: () => lessonExample("tap-hop", (m) => m.datChamPhay(3)),
  },
  "tap-hop.visual.dat-cham-phay-bon": {
    interactive: true,
    validators: { "du-cham-phay": gapsFilled },
    solutions: { "du-cham-phay": solveGapsFilled },
    load: () => lessonExample("tap-hop", (m) => m.datChamPhay(4)),
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
    regions: ["phay", "cham", "cham-phay", "hai-cham"],
    load: () =>
      lessonExample("tap-hop", (m) =>
        m.symbolTap(["phay", "cham", "cham-phay", "hai-cham"]),
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
