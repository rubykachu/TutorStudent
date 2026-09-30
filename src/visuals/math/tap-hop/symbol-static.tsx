import { Hand } from "lucide-react";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { ConceptMark } from "@/visuals/shared/concept-mark";
import { Glyph, type GlyphKey } from "./glyphs";
import { SymbolCard, type SymbolCardData } from "./symbol-card";
import {
  element,
  glyph,
  SymbolLine,
  setName,
  type Token,
  text,
} from "./symbol-line";

// Labelled examples of the symbols section (under a rule's note or a recap's
// caption) and the recap cards of the marks. The sentences are in
// lesson.json; these draw only the marks, the numbers and short labels.

const OPEN = "ngoac-nhon-mo";
const CLOSE = "ngoac-nhon-dong";
const SEMICOLON = "cham-phay";

export function NgoacViDu() {
  return (
    <SymbolLine
      spread
      label="Mở ngoặc nhọn, 1, chấm phẩy, 2, chấm phẩy, 3, đóng ngoặc nhọn"
      tokens={[
        glyph(OPEN, {
          note: { text: "mở ngoặc nhọn", side: "below", align: "start" },
        }),
        element(1),
        glyph(SEMICOLON),
        element(2),
        glyph(SEMICOLON),
        element(3),
        glyph(CLOSE, {
          note: { text: "đóng ngoặc nhọn", side: "below", align: "end" },
        }),
      ]}
    />
  );
}

export function NgoacDuHaiDau() {
  return (
    <SymbolLine
      label="A bằng mở ngoặc nhọn, 5, chấm phẩy, 6, đóng ngoặc nhọn. Dấu mở ở đầu, dấu đóng ở cuối"
      tokens={[
        setName("A"),
        text("="),
        glyph(OPEN, { note: { text: "đầu", side: "below" } }),
        element(5),
        glyph(SEMICOLON),
        element(6),
        glyph(CLOSE, { note: { text: "cuối", side: "below" } }),
      ]}
    />
  );
}

export function ChamPhayViDu() {
  return (
    <SymbolLine
      label="Mở ngoặc nhọn, 1, chấm phẩy, 2 phẩy 5, chấm phẩy, 6, đóng ngoặc nhọn"
      tokens={[
        glyph(OPEN),
        element(1),
        glyph(SEMICOLON, {
          emphasis: "ring",
          note: { text: "dấu chấm phẩy", side: "above" },
        }),
        element("2,5", { text: "số thập phân có dấu phẩy", side: "below" }),
        glyph(SEMICOLON, { emphasis: "ring" }),
        element(6),
        glyph(CLOSE),
      ]}
    />
  );
}

// The set drawn as a teal box named A that holds its elements as amber chips.
function ElementChip({ value }: { value: number }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border-2 bg-surface px-3 py-1 font-heading text-block font-bold tabular-nums ${CONCEPT_CLASSES.amber.border} ${CONCEPT_CLASSES.amber.text}`}
    >
      <ConceptMark color="amber" className="size-4" />
      {value}
    </span>
  );
}

function SetBox({ elements }: { elements: readonly number[] }) {
  return (
    <div
      className={`flex flex-col items-center gap-2 rounded-2xl border-3 bg-surface px-4 py-3 ${CONCEPT_CLASSES.teal.border}`}
    >
      <span
        className={`flex items-center gap-2 font-heading text-block font-bold ${CONCEPT_CLASSES.teal.text}`}
      >
        <ConceptMark color="teal" className="size-5" />A
      </span>
      <span className="flex gap-2">
        {elements.map((value) => (
          <ElementChip key={value} value={value} />
        ))}
      </span>
    </div>
  );
}

const SET_A = [1, 2, 3] as const;

function MemberStatement({
  value,
  mark,
  reading,
}: {
  value: number;
  mark: GlyphKey;
  reading: string;
}) {
  return (
    <>
      <SymbolLine
        label={`${value} ${reading} A`}
        tokens={[element(value), glyph(mark), setName("A")]}
      />
      <p
        aria-hidden
        className="text-center font-heading text-block font-bold md:text-block-lg"
      >
        <span className={CONCEPT_CLASSES.amber.text}>{value}</span>
        {` ${reading} `}
        <span className={CONCEPT_CLASSES.teal.text}>A</span>
      </p>
    </>
  );
}

export function ViDuThuoc() {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div role="img" aria-label="Tập hợp A có các phần tử 1, 2, 3">
        <div aria-hidden>
          <SetBox elements={SET_A} />
        </div>
      </div>
      <MemberStatement value={2} mark="thuoc" reading="thuộc" />
    </div>
  );
}

export function ViDuKhongThuoc() {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div
        role="img"
        aria-label="Tập hợp A có các phần tử 1, 2, 3; số 5 nằm ngoài tập hợp A"
        className="flex flex-wrap items-center justify-center gap-6"
      >
        <div aria-hidden>
          <SetBox elements={SET_A} />
        </div>
        <div aria-hidden>
          <ElementChip value={5} />
        </div>
      </div>
      <MemberStatement value={5} mark="khong-thuoc" reading="không thuộc" />
    </div>
  );
}

const CHIP =
  "inline-flex min-h-12 min-w-12 items-center justify-center rounded-full border-2 px-3";
const SLOT =
  "inline-flex min-h-12 min-w-12 items-center justify-center rounded-lg border-2 px-1";

const BANK: readonly { key: GlyphKey; picked?: boolean }[] = [
  { key: OPEN },
  { key: CLOSE, picked: true },
  { key: SEMICOLON },
];

// How the fill-in question works: a sentence with a filled and an empty slot,
// the row of mark chips to pick from with one chip picked, and a hand on it.
export function HuongDanChip() {
  return (
    <div
      role="img"
      aria-label="Bài điền kí hiệu: chạm một kí hiệu ở dưới, rồi chạm ô trống để đặt vào"
      className="flex w-full flex-col items-center gap-5"
    >
      <div
        aria-hidden
        className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 font-heading text-title font-bold md:text-title-lg"
      >
        <span className={CONCEPT_CLASSES.teal.text}>A</span>
        <span>=</span>
        <span className={`${SLOT} border-foreground bg-surface`}>
          <Glyph name={OPEN} sizeClass="h-9" />
        </span>
        <span className={CONCEPT_CLASSES.amber.text}>1</span>
        <Glyph name={SEMICOLON} />
        <span className={CONCEPT_CLASSES.amber.text}>2</span>
        <span className={`${SLOT} border-dashed border-muted-foreground`} />
      </div>
      <div aria-hidden className="flex items-start justify-center gap-4">
        {BANK.map(({ key, picked }) => (
          <div key={key} className="flex flex-col items-center gap-1">
            <span
              className={`${CHIP} ${picked ? "border-primary bg-primary" : "border-border bg-surface"}`}
            >
              <Glyph
                name={key}
                sizeClass="h-9"
                className={
                  picked ? "stroke-primary-foreground" : "stroke-foreground"
                }
              />
            </span>
            {picked ? <Hand className="size-8 text-primary" /> : null}
          </div>
        ))}
      </div>
      <p aria-hidden className="text-center text-body font-semibold">
        Chạm kí hiệu, rồi chạm ô trống
      </p>
    </div>
  );
}

// Recap cards.

const THE_EXAMPLE = (emphasis: {
  open?: boolean;
  close?: boolean;
}): Token[] => [
  setName("A"),
  text("="),
  glyph(OPEN, emphasis.open ? { emphasis: "highlight" } : {}),
  element(1),
  glyph(SEMICOLON),
  element(2),
  glyph(CLOSE, emphasis.close ? { emphasis: "highlight" } : {}),
];

const BRACE_LABEL = "A bằng mở ngoặc nhọn, 1, chấm phẩy, 2, đóng ngoặc nhọn";

const NGOAC_MO: SymbolCardData = {
  glyph: OPEN,
  reading: "mở ngoặc nhọn",
  example: { tokens: THE_EXAMPLE({ open: true }), label: BRACE_LABEL },
  how: "3 nét, từ trên xuống",
};

const NGOAC_DONG: SymbolCardData = {
  glyph: CLOSE,
  reading: "đóng ngoặc nhọn",
  example: { tokens: THE_EXAMPLE({ close: true }), label: BRACE_LABEL },
  how: "3 nét, từ trên xuống",
};

const CHAM_PHAY: SymbolCardData = {
  glyph: SEMICOLON,
  reading: "dấu chấm phẩy",
  example: {
    tokens: [
      glyph(OPEN),
      element(3),
      glyph(SEMICOLON, { emphasis: "highlight" }),
      element(6),
      glyph(SEMICOLON, { emphasis: "highlight" }),
      element(8),
      glyph(CLOSE),
    ],
    label: "Mở ngoặc nhọn, 3, chấm phẩy, 6, chấm phẩy, 8, đóng ngoặc nhọn",
  },
  how: "chấm ở trên, phẩy ở dưới",
};

function memberCard(
  mark: "thuoc" | "khong-thuoc",
  value: number,
  reading: string,
  how: string,
): SymbolCardData {
  return {
    glyph: mark,
    reading,
    example: {
      tokens: [
        element(value),
        glyph(mark, { emphasis: "highlight" }),
        setName("A"),
      ],
      label: `${value} ${reading} A`,
    },
    how,
  };
}

export function TheNgoacMo() {
  return <SymbolCard {...NGOAC_MO} />;
}

export function TheNgoacDong() {
  return <SymbolCard {...NGOAC_DONG} />;
}

export function TheChamPhay() {
  return <SymbolCard {...CHAM_PHAY} />;
}

export function TheThuoc() {
  return (
    <SymbolCard {...memberCard("thuoc", 2, "thuộc", "chữ C và gạch ngang")} />
  );
}

export function TheKhongThuoc() {
  return (
    <SymbolCard
      {...memberCard("khong-thuoc", 5, "không thuộc", "dấu ∈ và gạch chéo")}
    />
  );
}

const TILE =
  "flex size-20 items-center justify-center rounded-2xl bg-muted md:size-24";
// The look of a selected region: a foreground ring around the shape.
const SELECTED = "outline outline-4 outline-offset-2 outline-foreground";

const TAP_SHAPES = [
  <circle key="circle" cx={20} cy={20} r={16} />,
  <rect key="square" x={5} y={5} width={30} height={30} rx={3} />,
  <polygon key="triangle" points="20,4 37,35 3,35" />,
] as const;

// How a tap-the-shape question works: three neutral shapes, the middle one
// ringed as a tapped region is, and a hand on it.
export function HuongDanCham() {
  return (
    <div
      role="img"
      aria-label="Bài chạm vào hình: chạm vào hình, vòng sáng hiện ra quanh hình đó"
      className="flex w-full flex-col items-center gap-5"
    >
      <div aria-hidden className="flex items-start justify-center gap-4">
        {TAP_SHAPES.map((shape, i) => (
          <div key={shape.key} className="flex flex-col items-center gap-2">
            <span className={`${TILE} ${i === 1 ? SELECTED : ""}`}>
              <svg
                aria-hidden
                viewBox="0 0 40 40"
                className="size-12 fill-foreground"
              >
                {shape}
              </svg>
            </span>
            {i === 1 ? <Hand className="size-8 text-primary" /> : null}
          </div>
        ))}
      </div>
      <p aria-hidden className="text-center text-body font-semibold">
        Chạm vào hình, vòng sáng hiện ra
      </p>
    </div>
  );
}
