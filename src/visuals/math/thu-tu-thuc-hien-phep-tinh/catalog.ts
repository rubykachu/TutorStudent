import type { PictureName } from "./examples";
import { operationIndices, parseExpression } from "./expression";
import type { RungName } from "./statics";
import type { StepsMode } from "./steps";

// Every picture of the lesson that is drawn from numbers: the registry builds
// one entry per item (id `thu-tu-thuc-hien-phep-tinh.visual.<key>`), so a new example is one
// line here and its id in lesson.json.

export const LESSON_SLUG = "thu-tu-thuc-hien-phep-tinh";

export type VisualSpec =
  | { kind: "picture"; picture: PictureName }
  | { kind: "steps"; source: string; mode: StepsMode; firstAt?: number }
  | { kind: "tap"; source: string }
  | { kind: "try"; source: string }
  | {
      kind: "compare";
      source: string;
      leftLabel: string;
      wrongLabel: string;
      wrongTone: "wrong" | "normal";
      wrongAt?: number;
      wrongSource?: string;
    }
  | { kind: "nested"; source: string }
  | { kind: "ladder"; rungs: readonly RungName[] }
  | {
      kind: "divide";
      dividend: number;
      divisor: number;
      mode: "still" | "hint";
    }
  | { kind: "split"; factor: number; digit: number; mode: "still" | "hint" }
  | { kind: "times"; factor: number; last: number; mode: "still" | "hint" }
  | {
      kind: "findx";
      coef: number;
      add: number;
      rhs: string;
      mode: StepsMode;
    }
  | {
      kind: "letters";
      display: string;
      expanded?: string;
      values: readonly (readonly [string, number])[];
      source: string;
      mode: StepsMode;
    };

// Region ids of a "tap the operation to do first" picture, left to right.
export function tapRegions(source: string): string[] {
  return operationIndices(parseExpression(source)).map((_, i) => `op${i + 1}`);
}

export const VISUAL_SPECS: Readonly<Record<string, VisualSpec>> = {
  "hoa-don-hai-ban": {
    kind: "picture",
    picture: "hoaDonHaiBan",
  },
  "hoa-don-dung": {
    kind: "steps",
    source: "2·8+5",
    mode: "still",
  },
  "hoa-don-tom-tat": {
    kind: "steps",
    source: "3·5+4",
    mode: "still",
  },
  "chon-tong-tien-keo-goi-y": {
    kind: "steps",
    source: "5·2+3",
    mode: "hint",
  },
  "chon-tong-tien-keo-giai": {
    kind: "steps",
    source: "3·4+6",
    mode: "full",
  },
  "tinh-hoa-don-but-goi-y": {
    kind: "steps",
    source: "6·2+9",
    mode: "hint",
  },
  "tinh-hoa-don-but-giai": {
    kind: "steps",
    source: "4·3+7",
    mode: "full",
  },
  "chon-phep-tinh-hoa-don-goi-y": {
    kind: "steps",
    source: "4+3·7",
    mode: "hint",
  },
  "chon-phep-tinh-hoa-don-giai": {
    kind: "steps",
    source: "3+2·9",
    mode: "full",
  },
  "tinh-hoa-don-keo-goi-y": {
    kind: "steps",
    source: "3·5+4",
    mode: "hint",
  },
  "tinh-hoa-don-keo-giai": {
    kind: "steps",
    source: "6·2+8",
    mode: "full",
  },
  "bang-dau": {
    kind: "picture",
    picture: "bangDau",
  },
  "doc-bieu-thuc": {
    kind: "picture",
    picture: "docBieuThuc",
  },
  "cong-tru-xe-buyt": {
    kind: "steps",
    source: "20-6+5-3",
    mode: "still",
  },
  "cong-tru-so-sanh": {
    kind: "compare",
    source: "10-4+3",
    leftLabel: "Đúng thứ tự",
    wrongLabel: "Sai: làm 4 + 3 trước",
    wrongTone: "wrong",
    wrongAt: 3,
  },
  "cong-tru-tu-lam": {
    kind: "try",
    source: "30-9+6-12",
  },
  "huong-dan-cham-phep-tinh": {
    kind: "picture",
    picture: "huongDanChamPhepTinh",
  },
  "cong-tru-tom-tat": {
    kind: "steps",
    source: "45-20+10-5",
    mode: "still",
  },
  "chon-phep-dau-tien-hinh": {
    kind: "tap",
    source: "12-5+4",
  },
  "chon-phep-dau-tien-goi-y": {
    kind: "steps",
    source: "15-6+8",
    mode: "hint",
  },
  "chon-phep-dau-tien-giai": {
    kind: "steps",
    source: "12-5+4",
    mode: "full",
  },
  "tinh-cong-tru-1-goi-y": {
    kind: "steps",
    source: "8+14-5",
    mode: "hint",
  },
  "tinh-cong-tru-1-giai": {
    kind: "steps",
    source: "9+15-6",
    mode: "full",
  },
  "sap-buoc-cong-tru-goi-y": {
    kind: "steps",
    source: "60-10+20-15",
    mode: "hint",
  },
  "sap-buoc-cong-tru-giai": {
    kind: "steps",
    source: "50-20+10-5",
    mode: "full",
  },
  "dien-buoc-cong-tru-goi-y": {
    kind: "steps",
    source: "16-5+8",
    mode: "hint",
  },
  "dien-buoc-cong-tru-giai": {
    kind: "steps",
    source: "18-7+9",
    mode: "full",
  },
  "nhan-chia-on": {
    kind: "picture",
    picture: "nhanChiaOn",
  },
  "chia-hoi-nguoc": {
    kind: "divide",
    dividend: 54,
    divisor: 6,
    mode: "still",
  },
  "nhan-7-8-goi-y": {
    kind: "times",
    factor: 7,
    last: 8,
    mode: "hint",
  },
  "nhan-7-8-giai": {
    kind: "times",
    factor: 7,
    last: 8,
    mode: "still",
  },
  "chia-63-9-goi-y": {
    kind: "divide",
    dividend: 63,
    divisor: 9,
    mode: "hint",
  },
  "chia-63-9-giai": {
    kind: "divide",
    dividend: 63,
    divisor: 9,
    mode: "still",
  },
  "nhan-9-6-goi-y": {
    kind: "times",
    factor: 9,
    last: 6,
    mode: "hint",
  },
  "nhan-9-6-giai": {
    kind: "times",
    factor: 9,
    last: 6,
    mode: "still",
  },
  "nhan-hai-chu-so": {
    kind: "split",
    factor: 14,
    digit: 6,
    mode: "still",
  },
  "nhan-11-7-goi-y": {
    kind: "split",
    factor: 12,
    digit: 7,
    mode: "hint",
  },
  "nhan-11-7-giai": {
    kind: "split",
    factor: 11,
    digit: 7,
    mode: "still",
  },
  "nhan-13-4-goi-y": {
    kind: "split",
    factor: 12,
    digit: 7,
    mode: "hint",
  },
  "nhan-13-4-giai": {
    kind: "split",
    factor: 13,
    digit: 4,
    mode: "still",
  },
  "nhan-25-3-goi-y": {
    kind: "split",
    factor: 15,
    digit: 4,
    mode: "hint",
  },
  "nhan-25-3-giai": {
    kind: "split",
    factor: 25,
    digit: 3,
    mode: "still",
  },
  "chon-tach-chuc-goi-y": {
    kind: "split",
    factor: 15,
    digit: 4,
    mode: "hint",
  },
  "chon-tach-chuc-giai": {
    kind: "split",
    factor: 26,
    digit: 3,
    mode: "still",
  },
  "nhan-chia-cam": {
    kind: "steps",
    source: "6·8:4",
    mode: "still",
  },
  "nhan-chia-so-sanh": {
    kind: "compare",
    source: "48:6·2",
    leftLabel: "Đúng thứ tự",
    wrongLabel: "Sai: làm 6 · 2 trước",
    wrongTone: "wrong",
    wrongAt: 3,
  },
  "nhan-chia-tung-buoc": {
    kind: "steps",
    source: "72:6·3:4",
    mode: "full",
  },
  "nhan-chia-tu-lam": {
    kind: "try",
    source: "5·6:3",
  },
  "nhan-chia-tom-tat": {
    kind: "steps",
    source: "56:8·3",
    mode: "still",
  },
  "chon-phep-nhan-chia-hinh": {
    kind: "tap",
    source: "4·6:3",
  },
  "chon-phep-nhan-chia-goi-y": {
    kind: "steps",
    source: "5·4:2",
    mode: "hint",
  },
  "chon-phep-nhan-chia-giai": {
    kind: "steps",
    source: "4·6:3",
    mode: "full",
  },
  "tinh-nhan-chia-1-goi-y": {
    kind: "steps",
    source: "90:6·4",
    mode: "hint",
  },
  "tinh-nhan-chia-1-giai": {
    kind: "steps",
    source: "84:7·5",
    mode: "full",
  },
  "sap-buoc-nhan-chia-goi-y": {
    kind: "steps",
    source: "4·9:6·2",
    mode: "hint",
  },
  "sap-buoc-nhan-chia-giai": {
    kind: "steps",
    source: "3·8:6·5",
    mode: "full",
  },
  "chon-ket-qua-nhan-chia-goi-y": {
    kind: "steps",
    source: "60:5·4",
    mode: "hint",
  },
  "chon-ket-qua-nhan-chia-giai": {
    kind: "steps",
    source: "100:5·2",
    mode: "full",
  },
  "hon-hop-mua-but": {
    kind: "steps",
    source: "50-3·6",
    mode: "still",
  },
  "hon-hop-so-sanh": {
    kind: "compare",
    source: "20-4·3",
    leftLabel: "Đúng thứ tự",
    wrongLabel: "Sai: làm 20 − 4 trước",
    wrongTone: "wrong",
    wrongAt: 1,
  },
  "hon-hop-tung-buoc": {
    kind: "steps",
    source: "20+6·3-8:4",
    mode: "full",
  },
  "hon-hop-tu-lam": {
    kind: "try",
    source: "18-12:3+5",
  },
  "hon-hop-bac-uu-tien": {
    kind: "ladder",
    rungs: ["nhanChia", "congTru"],
  },
  "chon-phep-hon-hop-hinh": {
    kind: "tap",
    source: "8+6·2-3",
  },
  "chon-phep-hon-hop-goi-y": {
    kind: "steps",
    source: "9+4·2-5",
    mode: "hint",
  },
  "chon-phep-hon-hop-giai": {
    kind: "steps",
    source: "8+6·2-3",
    mode: "full",
  },
  "tinh-hon-hop-1-goi-y": {
    kind: "steps",
    source: "40-3·6+5",
    mode: "hint",
  },
  "tinh-hon-hop-1-giai": {
    kind: "steps",
    source: "30-4·5+6",
    mode: "full",
  },
  "chon-phep-lam-truoc-goi-y": {
    kind: "steps",
    source: "16+8:2",
    mode: "hint",
  },
  "chon-phep-lam-truoc-giai": {
    kind: "steps",
    source: "14+9:3",
    mode: "full",
  },
  "sap-buoc-hon-hop-goi-y": {
    kind: "steps",
    source: "12+5·2-9",
    mode: "hint",
  },
  "sap-buoc-hon-hop-giai": {
    kind: "steps",
    source: "10+4·3-6",
    mode: "full",
  },
  "dien-buoc-hon-hop-goi-y": {
    kind: "steps",
    source: "30-4·6+9",
    mode: "hint",
  },
  "dien-buoc-hon-hop-giai": {
    kind: "steps",
    source: "25-3·5+8",
    mode: "full",
  },
  "ngoac-tron-mua-vo": {
    kind: "steps",
    source: "3·(8+4)",
    mode: "still",
  },
  "ngoac-tron-tung-buoc": {
    kind: "steps",
    source: "40-(12+8):2",
    mode: "full",
  },
  "ngoac-tron-so-sanh": {
    kind: "compare",
    source: "3·(8+4)",
    wrongSource: "3·8+4",
    leftLabel: "Có dấu ngoặc",
    wrongLabel: "Không có dấu ngoặc",
    wrongTone: "normal",
  },
  "ngoac-tron-tu-lam": {
    kind: "try",
    source: "60-(4+5)·3",
  },
  "ngoac-tron-tom-tat": {
    kind: "steps",
    source: "5·(6+2)-9",
    mode: "still",
  },
  "chon-phep-ngoac-hinh": {
    kind: "tap",
    source: "2·(3+4)+5",
  },
  "chon-phep-ngoac-goi-y": {
    kind: "steps",
    source: "4·(1+5)+7",
    mode: "hint",
  },
  "chon-phep-ngoac-giai": {
    kind: "steps",
    source: "2·(3+4)+5",
    mode: "full",
  },
  "tinh-ngoac-tron-1-goi-y": {
    kind: "steps",
    source: "3·(9+2)-15",
    mode: "hint",
  },
  "tinh-ngoac-tron-1-giai": {
    kind: "steps",
    source: "4·(7+5)-20",
    mode: "full",
  },
  "chon-phep-ngoac-2-goi-y": {
    kind: "steps",
    source: "24:(1+3)",
    mode: "hint",
  },
  "chon-phep-ngoac-2-giai": {
    kind: "steps",
    source: "36:(2+7)",
    mode: "full",
  },
  "sap-buoc-ngoac-goi-y": {
    kind: "steps",
    source: "4·(8-3)+7",
    mode: "hint",
  },
  "sap-buoc-ngoac-giai": {
    kind: "steps",
    source: "5·(9-4)+6",
    mode: "full",
  },
  "dien-buoc-ngoac-goi-y": {
    kind: "steps",
    source: "(14-5)·3-8",
    mode: "hint",
  },
  "dien-buoc-ngoac-giai": {
    kind: "steps",
    source: "(15-6)·4-10",
    mode: "full",
  },
  "ngoac-long-hop": {
    kind: "nested",
    source: "{2+3·[4+(10-6)]}",
  },
  "bang-ngoac": {
    kind: "picture",
    picture: "bangNgoac",
  },
  "ngoac-long-tung-buoc": {
    kind: "steps",
    source: "{10+2·[5+(3·2)]}",
    mode: "full",
  },
  "ngoac-long-tu-lam": {
    kind: "try",
    source: "[(9-3)·2+4]:4",
  },
  "ngoac-long-tom-tat": {
    kind: "steps",
    source: "{2+[6-(1+2)]}",
    mode: "still",
  },
  "chon-phep-ngoac-long-hinh": {
    kind: "tap",
    source: "5+[3·(8-6)]",
  },
  "chon-phep-ngoac-long-goi-y": {
    kind: "steps",
    source: "7+[2·(9-6)]",
    mode: "hint",
  },
  "chon-phep-ngoac-long-giai": {
    kind: "steps",
    source: "5+[3·(8-6)]",
    mode: "full",
  },
  "tinh-ngoac-long-1-goi-y": {
    kind: "steps",
    source: "30-[2·(9-6)]",
    mode: "hint",
  },
  "tinh-ngoac-long-1-giai": {
    kind: "steps",
    source: "20-[3·(8-5)]",
    mode: "full",
  },
  "tinh-ngoac-long-3-goi-y": {
    kind: "steps",
    source: "3+[2·(9-5)-2]:3",
    mode: "hint",
  },
  "tinh-ngoac-long-3-giai": {
    kind: "steps",
    source: "2+[3·(10-6)-4]:4",
    mode: "full",
  },
  "sap-thu-tu-ngoac-goi-y": {
    kind: "nested",
    source: "{1+[4+(8-3)]}",
  },
  "tinh-ngoac-long-2-goi-y": {
    kind: "steps",
    source: "3·{2+[10-(4+2)]}",
    mode: "hint",
  },
  "tinh-ngoac-long-2-giai": {
    kind: "steps",
    source: "4·{1+[12-(5+3)]}",
    mode: "full",
  },
  "luy-thua-lat-gach": {
    kind: "steps",
    source: "2·3^2+4",
    mode: "still",
  },
  "luy-thua-so-sanh": {
    kind: "compare",
    source: "2·3^2",
    leftLabel: "Đúng thứ tự",
    wrongLabel: "Sai: làm 2 · 3 trước",
    wrongTone: "wrong",
    wrongSource: "6^2",
  },
  "luy-thua-tung-buoc": {
    kind: "steps",
    source: "10+2·3^2:6-4",
    mode: "full",
  },
  "luy-thua-tu-lam": {
    kind: "try",
    source: "3+2·2^3",
  },
  "luy-thua-bac-uu-tien": {
    kind: "ladder",
    rungs: ["mu", "nhanChia", "congTru"],
  },
  "chon-phep-luy-thua-hinh": {
    kind: "tap",
    source: "5+2·3^2",
  },
  "chon-phep-luy-thua-goi-y": {
    kind: "steps",
    source: "6+3·2^2",
    mode: "hint",
  },
  "chon-phep-luy-thua-giai": {
    kind: "steps",
    source: "5+2·3^2",
    mode: "full",
  },
  "tinh-luy-thua-1-goi-y": {
    kind: "steps",
    source: "6+2·3^2-7",
    mode: "hint",
  },
  "tinh-luy-thua-1-giai": {
    kind: "steps",
    source: "4+3·2^2-5",
    mode: "full",
  },
  "chon-phep-luy-thua-2-goi-y": {
    kind: "steps",
    source: "30-3^2:3",
    mode: "hint",
  },
  "chon-phep-luy-thua-2-giai": {
    kind: "steps",
    source: "20-2^3:4",
    mode: "full",
  },
  "sap-buoc-luy-thua-goi-y": {
    kind: "steps",
    source: "5+2·3^2",
    mode: "hint",
  },
  "sap-buoc-luy-thua-giai": {
    kind: "steps",
    source: "7+3·2^3",
    mode: "full",
  },
  "tinh-luy-thua-2-goi-y": {
    kind: "steps",
    source: "4·2^3-2^2",
    mode: "hint",
  },
  "tinh-luy-thua-2-giai": {
    kind: "steps",
    source: "5·2^3-3^2",
    mode: "full",
  },
  "chu-hai-vo": {
    kind: "letters",
    display: "2x + 5",
    expanded: "2 · x + 5",
    values: [["x", 8]],
    source: "2·8+5",
    mode: "still",
  },
  "chu-bo-dau-nhan": {
    kind: "letters",
    display: "2x",
    expanded: "2 · x",
    values: [["x", 4]],
    source: "2·4",
    mode: "still",
  },
  "chu-tung-buoc": {
    kind: "letters",
    display: "x² + 3x",
    expanded: "x² + 3 · x",
    values: [["x", 4]],
    source: "4^2+3·4",
    mode: "full",
  },
  "chu-tom-tat": {
    kind: "letters",
    display: "3x + 2",
    expanded: "3 · x + 2",
    values: [["x", 6]],
    source: "3·6+2",
    mode: "still",
  },
  "thay-chu-2x-1-goi-y": {
    kind: "letters",
    display: "3x + 2",
    expanded: "3 · x + 2",
    values: [["x", 4]],
    source: "3·4+2",
    mode: "hint",
  },
  "thay-chu-2x-1-giai": {
    kind: "letters",
    display: "2x + 1",
    expanded: "2 · x + 1",
    values: [["x", 3]],
    source: "2·3+1",
    mode: "still",
  },
  "tinh-chu-1-goi-y": {
    kind: "letters",
    display: "4x + 1",
    expanded: "4 · x + 1",
    values: [["x", 6]],
    source: "4·6+1",
    mode: "hint",
  },
  "tinh-chu-1-giai": {
    kind: "letters",
    display: "3x + 4",
    expanded: "3 · x + 4",
    values: [["x", 5]],
    source: "3·5+4",
    mode: "still",
  },
  "tinh-chu-2-goi-y": {
    kind: "letters",
    display: "ab + 2",
    expanded: "a · b + 2",
    values: [
      ["a", 4],
      ["b", 5],
    ],
    source: "4·5+2",
    mode: "hint",
  },
  "tinh-chu-2-giai": {
    kind: "letters",
    display: "ab − 4",
    expanded: "a · b − 4",
    values: [
      ["a", 6],
      ["b", 3],
    ],
    source: "6·3-4",
    mode: "still",
  },
  "tinh-chu-3-goi-y": {
    kind: "letters",
    display: "x² + 3x",
    expanded: "x² + 3 · x",
    values: [["x", 2]],
    source: "2^2+3·2",
    mode: "hint",
  },
  "tinh-chu-3-giai": {
    kind: "letters",
    display: "x² + 2x",
    expanded: "x² + 2 · x",
    values: [["x", 3]],
    source: "3^2+2·3",
    mode: "full",
  },
  "tong-hop-bac-uu-tien": {
    kind: "ladder",
    rungs: ["ngoac", "mu", "nhanChia", "congTru"],
  },
  "tong-hop-mua-but": {
    kind: "steps",
    source: "50-2·3·4",
    mode: "still",
  },
  "tong-hop-tung-buoc": {
    kind: "steps",
    source: "2·3^2+4·5-6",
    mode: "full",
  },
  "tong-hop-dong-viet-lai": {
    kind: "compare",
    source: "5+3·2",
    leftLabel: "Đúng thứ tự",
    wrongLabel: "Sai: làm 5 + 3 trước",
    wrongTone: "wrong",
    wrongAt: 1,
  },
  "tong-hop-tom-tat": {
    kind: "steps",
    source: "4·3^2-7",
    mode: "still",
  },
  "tong-hop-tom-tat-chon": {
    kind: "steps",
    source: "30-2^3:4",
    mode: "still",
  },
  "tinh-day-du-kiem-tra-goi-y": {
    kind: "steps",
    source: "5·10^2+2·10+8",
    mode: "hint",
  },
  "tinh-day-du-kiem-tra-giai": {
    kind: "steps",
    source: "4·10^2+3·10+6",
    mode: "full",
  },
  "chon-dong-dung-1-goi-y": {
    kind: "steps",
    source: "8+3·2^2:4-2",
    mode: "hint",
  },
  "chon-dong-dung-1-giai": {
    kind: "steps",
    source: "6+2·3^2:3-1",
    mode: "full",
  },
  "chon-dong-dung-2-goi-y": {
    kind: "steps",
    source: "25-3·2^2+4",
    mode: "hint",
  },
  "chon-dong-dung-2-giai": {
    kind: "steps",
    source: "30-2·3^2+7",
    mode: "full",
  },
  "chon-dong-dung-3-goi-y": {
    kind: "steps",
    source: "4·(10-2^2)+3",
    mode: "hint",
  },
  "chon-dong-dung-3-giai": {
    kind: "steps",
    source: "5·(12-3^2)+4",
    mode: "full",
  },
  "chon-dong-dung-4-goi-y": {
    kind: "steps",
    source: "20+3·2^2:6",
    mode: "hint",
  },
  "chon-dong-dung-4-giai": {
    kind: "steps",
    source: "16+6·2^3:4",
    mode: "full",
  },
  "tinh-day-du-1-goi-y": {
    kind: "steps",
    source: "2·3^2+5·4-3·5",
    mode: "hint",
  },
  "tinh-day-du-1-giai": {
    kind: "steps",
    source: "3·2^3+5·4-2·7",
    mode: "full",
  },
  "tinh-day-du-2-goi-y": {
    kind: "steps",
    source: "40-3·1^7+2·2·4^2",
    mode: "hint",
  },
  "tinh-day-du-2-giai": {
    kind: "steps",
    source: "50-4·1^9+2·3·3^2",
    mode: "full",
  },
  "tinh-day-du-3-goi-y": {
    kind: "steps",
    source: "2·3^3+5·4-15·3+7",
    mode: "hint",
  },
  "tinh-day-du-3-giai": {
    kind: "steps",
    source: "3·2^3+5·4-14·2+9",
    mode: "full",
  },
  "tinh-ngoac-day-du-goi-y": {
    kind: "steps",
    source: "3^2+2·{5+3·[2·(6-4)-1]}",
    mode: "hint",
  },
  "tinh-ngoac-day-du-giai": {
    kind: "steps",
    source: "2^3+3·{4+2·[5·(7-4)-9]}",
    mode: "full",
  },
  "sap-buoc-day-du-goi-y": {
    kind: "steps",
    source: "3·2^3-5",
    mode: "hint",
  },
  "sap-buoc-day-du-giai": {
    kind: "steps",
    source: "2·3^2-4",
    mode: "full",
  },
  "tim-so-mua-but": {
    kind: "findx",
    coef: 3,
    add: 5,
    rhs: "2·10",
    mode: "still",
  },
  "tim-x-kiem-tra-giai": {
    kind: "findx",
    coef: 2,
    add: 6,
    rhs: "14",
    mode: "still",
  },
  "tim-x-1-goi-y": {
    kind: "findx",
    coef: 4,
    add: 4,
    rhs: "2·2^2+12:3",
    mode: "hint",
  },
  "tim-x-1-giai": {
    kind: "findx",
    coef: 5,
    add: 5,
    rhs: "2·3^2+6:3",
    mode: "still",
  },
  "tim-x-2-goi-y": {
    kind: "findx",
    coef: 4,
    add: 4,
    rhs: "2·2^2+12:3",
    mode: "hint",
  },
  "tim-x-2-giai": {
    kind: "findx",
    coef: 6,
    add: 8,
    rhs: "2·3^2+14",
    mode: "still",
  },
  "tim-x-3-giai": {
    kind: "findx",
    coef: 3,
    add: 5,
    rhs: "5·2^2+9:3",
    mode: "still",
  },
  "tim-x-3-goi-y": {
    kind: "steps",
    source: "4·2^2+6:3",
    mode: "hint",
  },
  sticker: {
    kind: "picture",
    picture: "sticker",
  },
};
