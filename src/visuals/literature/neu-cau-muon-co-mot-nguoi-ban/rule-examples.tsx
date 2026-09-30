import {
  Hand,
  HandHeart,
  Heart,
  Hourglass,
  Pointer,
  Repeat,
  Star,
} from "lucide-react";
import type { ReactNode } from "react";
import type { ConceptColor } from "@/schema/content";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { ConceptMark } from "@/visuals/shared/concept-mark";
import { decorative } from "@/visuals/shared/markers";
import {
  Chip,
  COMPOUND_COLOR,
  DIALOGUE_COLOR,
  Example,
  Flow,
  FOX_COLOR,
  Fox,
  Label,
  Prince,
  REDUPLICATIVE_COLOR,
  SIMILE_COLOR,
  TAMING_COLOR,
} from "./parts";

// Labelled examples of the rule screens (shown in a section group under the
// rule's note), the recaps and the hint pictures. The sentences themselves
// live in lesson.json, where the content lint and review read them; these
// draw only pictures and short labels.

// ---------------------------------------------------------------------------
// Dialogue

// "– Mình là cáo – con cáo trả lời.": the dash, the spoken words and the
// narrator's words that say who speaks.
export function LoiThoaiMau() {
  return (
    <Example>
      <p className="text-center font-heading text-block md:text-block-lg">
        <span className="text-muted-foreground">– </span>
        <span
          className={`underline decoration-4 underline-offset-4 ${CONCEPT_CLASSES[DIALOGUE_COLOR].decoration}`}
        >
          Mình là cáo
        </span>
        <span className="text-muted-foreground"> – </span>
        <span className={CONCEPT_CLASSES[FOX_COLOR].text}>con cáo trả lời</span>
        .
      </p>
      <ul className="flex w-full flex-col gap-3">
        <li className="flex items-center gap-3">
          <span className="w-12 shrink-0 text-center font-heading text-block">
            –
          </span>
          <Label>Dấu gạch ngang: bắt đầu lời thoại</Label>
        </li>
        <li className="flex items-center gap-3">
          <span className="flex w-12 shrink-0 justify-center">
            <ConceptMark color={DIALOGUE_COLOR} className="size-6" />
          </span>
          <Label>Lời thoại: điều nhân vật nói</Label>
        </li>
        <li className="flex items-center gap-3">
          <Fox className="size-12 shrink-0" />
          <Label>Lời dẫn “con cáo trả lời”: cáo đang nói</Label>
        </li>
      </ul>
    </Example>
  );
}

// Tap-a-sentence exercises: a chosen sentence turns yellow. Uses a made-up
// text so it never gives away an exercise.
export function HuongDanChamCau() {
  return (
    <Example>
      <div className="relative flex flex-col gap-2 rounded-xl border-2 border-border bg-surface p-4 text-body leading-tap">
        <span>Sáng nay trời nắng đẹp.</span>
        <span className="flex items-center gap-2">
          <span className="rounded-sm bg-highlight px-1">
            Em đi học thật sớm.
          </span>
          <Pointer aria-hidden className="size-7 shrink-0 text-foreground" />
        </span>
        <span>Chim hót trên cành cây.</span>
      </div>
      <Label>Câu đã chọn được tô vàng</Label>
    </Example>
  );
}

// Matching: a left box joined to the right box that goes with it.
export function HuongDanNoi() {
  const pair = "border-primary bg-primary/10";
  return (
    <Example>
      <div className="grid w-full max-w-sm grid-cols-2 gap-x-6 gap-y-3 text-body">
        <span
          className={`flex items-center gap-2 rounded-lg border-2 px-3 py-2 ${pair}`}
        >
          <span className="font-semibold text-primary">1</span> Mặt trời
        </span>
        <span className="rounded-lg border-2 border-border px-3 py-2">
          ban đêm
        </span>
        <span className="rounded-lg border-2 border-border px-3 py-2">
          Mặt trăng
        </span>
        <span
          className={`flex items-center gap-2 rounded-lg border-2 px-3 py-2 ${pair}`}
        >
          <span className="font-semibold text-primary">1</span> ban ngày
        </span>
      </div>
      <Label>Hai ô cùng số 1 là một cặp đã nối</Label>
    </Example>
  );
}

// Ordering: cards moved into place, numbered from the top.
export function HuongDanXep() {
  const steps = ["Thức dậy", "Đánh răng", "Đi học"];
  return (
    <Example>
      <ol className="flex w-full max-w-xs flex-col gap-3 text-body">
        {steps.map((step, i) => (
          <li
            key={step}
            className="flex items-center gap-3 rounded-lg border-2 border-border bg-surface px-3 py-2"
          >
            <span className="font-semibold text-primary">{i + 1}</span>
            {step}
            {i === 1 && (
              <Hand aria-hidden className="ml-auto size-6 text-foreground" />
            )}
          </li>
        ))}
      </ol>
      <Label>Thẻ trên cùng là việc làm trước</Label>
    </Example>
  );
}

// Fill-in exercises: a word from the bank dropped into the gap.
export function HuongDanDien() {
  return (
    <Example>
      <p className="text-body">
        Bầu trời{" "}
        <span className="inline-block min-w-24 rounded-lg border-2 border-primary px-3 text-center font-semibold">
          xanh biếc
        </span>{" "}
        không một gợn mây.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Chip className="opacity-40">xanh biếc</Chip>
        <Chip>con đường</Chip>
        <Chip>chạy nhảy</Chip>
      </div>
      <Label>Từ đã đặt vào chỗ trống mờ đi ở dưới</Label>
    </Example>
  );
}

// ---------------------------------------------------------------------------
// Taming

function TamingArrow() {
  return (
    <span
      className={`flex flex-col items-center gap-1 ${CONCEPT_CLASSES[TAMING_COLOR].text}`}
    >
      <ConceptMark color={TAMING_COLOR} className="size-5" />
      <span className="text-caption font-semibold">cảm hoá</span>
      <Flow />
    </span>
  );
}

// Far apart and strangers, then side by side and close.
export function CamHoa() {
  return (
    <Example>
      <div className="flex items-center justify-center gap-3">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-end gap-8">
            <Fox className="size-12" />
            <Prince className="size-12" />
          </div>
          <Label>xa lạ</Label>
        </div>
        <TamingArrow />
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-end gap-1">
            <Fox mood="happy" className="size-12" />
            <Heart
              aria-hidden
              className="size-6 fill-concept-pink text-concept-pink"
            />
            <Prince mood="happy" className="size-12" />
          </div>
          <Label>gần gũi</Label>
        </div>
      </div>
    </Example>
  );
}

const CROWD = 9;

// One fox among many alike, then the one fox that is unique.
export function DuyNhat() {
  return (
    <Example>
      <div className="flex items-center justify-center gap-3">
        <div className="flex flex-col items-center gap-2">
          <div className="grid grid-cols-3 gap-1">
            {Array.from({ length: CROWD }, (_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: identical faces
              <Fox key={i} className="size-8 opacity-60" />
            ))}
          </div>
          <Label className="text-center">một trong trăm nghìn</Label>
        </div>
        <TamingArrow />
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <Fox mood="happy" className="size-20" />
            <Star
              {...decorative}
              aria-hidden
              className="absolute -top-1 -right-2 size-6 fill-concept-lime text-concept-lime"
            />
          </div>
          <Label className="text-center">duy nhất trên đời</Label>
        </div>
      </div>
    </Example>
  );
}

// ---------------------------------------------------------------------------
// Comparison

type ComparisonProps = {
  compared: string;
  word: string;
  image: string;
  // Words between the compared thing and the comparison word, unlabelled.
  middle?: string;
};

function ComparisonPart({
  children,
  label,
  color,
}: {
  children: ReactNode;
  label: string;
  color?: ConceptColor;
}) {
  return (
    <div className="flex max-w-36 flex-col items-center gap-2 text-center">
      <Chip color={color}>{children}</Chip>
      <Label>{label}</Label>
    </div>
  );
}

// The three named parts of a comparison, e.g. "Mặt trăng … như … quả bóng".
export function ComparisonParts({
  compared,
  word,
  image,
  middle,
}: ComparisonProps) {
  return (
    <Example>
      <p className="text-center font-heading text-block md:text-block-lg">
        {compared}
        {middle ? ` ${middle}` : ""}{" "}
        <span className={CONCEPT_CLASSES[SIMILE_COLOR].text}>{word}</span>{" "}
        {image}.
      </p>
      <div className="flex flex-wrap items-start justify-center gap-3">
        <ComparisonPart label="Sự vật được so sánh">{compared}</ComparisonPart>
        <ComparisonPart label="Từ so sánh" color={SIMILE_COLOR}>
          {word}
        </ComparisonPart>
        <ComparisonPart label="Sự vật dùng để so sánh">{image}</ComparisonPart>
      </div>
    </Example>
  );
}

// Hint: the words that usually join the two sides of a comparison.
export function DauHieuSoSanh() {
  return (
    <Example>
      <Label>Tìm từ so sánh</Label>
      <div className="flex flex-wrap justify-center gap-3">
        {["như", "như là", "giống như"].map((word) => (
          <Chip key={word} color={SIMILE_COLOR}>
            {word}
          </Chip>
        ))}
      </div>
    </Example>
  );
}

// ---------------------------------------------------------------------------
// The fox's secret and lessons

const LESSONS = [
  { icon: Heart, text: "Nhìn bằng trái tim" },
  { icon: Hourglass, text: "Dành thời gian cho bạn" },
  { icon: HandHeart, text: "Có trách nhiệm với bạn" },
] as const;

export function BaiHoc() {
  return (
    <Example>
      <Fox mood="happy" className="size-14" />
      <ul className="flex w-full max-w-sm flex-col gap-3">
        {LESSONS.map(({ icon: Icon, text }) => (
          <li
            key={text}
            className="flex items-center gap-3 rounded-lg border-2 border-concept-pink bg-surface px-3 py-2 text-body"
          >
            <Icon aria-hidden className="size-6 shrink-0 text-concept-pink" />
            {text}
          </li>
        ))}
      </ul>
    </Example>
  );
}

const WORD_MEANINGS = [
  { word: "cốt lõi", meaning: "phần chính, quan trọng hơn cả" },
  { word: "mắt trần", meaning: "cái nhìn thường, chưa thấu hiểu" },
  { word: "đơn điệu", meaning: "lặp lại một kiểu, buồn chán" },
] as const;

export function NghiaTu() {
  return (
    <Example>
      <ul className="flex w-full max-w-md flex-col gap-3">
        {WORD_MEANINGS.map(({ word, meaning }) => (
          <li key={word} className="flex flex-wrap items-center gap-2">
            <Chip>{word}</Chip>
            <Flow />
            <span className="text-body">{meaning}</span>
          </li>
        ))}
      </ul>
    </Example>
  );
}

// ---------------------------------------------------------------------------
// Repeated lines

export const REPEATED_LINES = [
  { line: "“Cảm hoá” nghĩa là gì?", times: 3 },
  { line: "… cảm hoá mình đi!", times: 2 },
  { line: "Tất nhiên rồi", times: 2 },
  { line: "… lặp lại, để cho nhớ", times: 3 },
] as const;

export function RepeatBadge({ times }: { times: number }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full border-2 px-2 font-semibold ${CONCEPT_CLASSES[DIALOGUE_COLOR].border} ${CONCEPT_CLASSES[DIALOGUE_COLOR].text}`}
    >
      <Repeat aria-hidden className="size-4" />
      {times} lần
    </span>
  );
}

export function LoiLapLai() {
  return (
    <Example>
      <ul className="flex w-full max-w-md flex-col gap-3">
        {REPEATED_LINES.map(({ line, times }) => (
          <li
            key={line}
            className="flex items-center justify-between gap-3 rounded-lg border-2 border-border bg-surface px-3 py-2 text-body"
          >
            <span className="flex items-center gap-2">
              <ConceptMark color={DIALOGUE_COLOR} className="size-4" />
              {line}
            </span>
            <RepeatBadge times={times} />
          </li>
        ))}
      </ul>
    </Example>
  );
}

// ---------------------------------------------------------------------------
// Compound and reduplicative words

// A word whose syllables are shown apart, with the matching sound (for a
// reduplicative word) underlined in its colour.
function Syllables({
  parts,
  color,
  sound,
}: {
  parts: readonly [string, string];
  color: ConceptColor;
  // Length of the shared sound at the start (initial) or end (rhyme) of both
  // syllables, e.g. "l" of "lung linh".
  sound?: { at: "start" | "end"; length: number };
}) {
  const mark = (text: string) => {
    if (!sound) return text;
    const cut =
      sound.at === "start" ? sound.length : text.length - sound.length;
    const [a, b] = [text.slice(0, cut), text.slice(cut)];
    const shared = sound.at === "start" ? a : b;
    const underline = (
      <span
        className={`underline decoration-4 underline-offset-4 ${CONCEPT_CLASSES[color].decoration}`}
      >
        {shared}
      </span>
    );
    return sound.at === "start" ? (
      <>
        {underline}
        {b}
      </>
    ) : (
      <>
        {a}
        {underline}
      </>
    );
  };
  return (
    <span className="inline-flex items-center gap-2 font-heading text-block">
      <span>{mark(parts[0])}</span>
      <span className="text-muted-foreground">+</span>
      <span>{mark(parts[1])}</span>
    </span>
  );
}

type WordColumnProps = {
  title: string;
  color: ConceptColor;
  words: readonly {
    parts: readonly [string, string];
    sound?: { at: "start" | "end"; length: number };
  }[];
  label: string;
};

function WordColumn({ title, color, words, label }: WordColumnProps) {
  return (
    <div
      className={`flex min-w-36 flex-1 flex-col items-center gap-3 rounded-xl border-2 bg-surface p-3 ${CONCEPT_CLASSES[color].border}`}
    >
      <span
        className={`flex items-center gap-2 font-semibold ${CONCEPT_CLASSES[color].text}`}
      >
        <ConceptMark color={color} className="size-5" />
        {title}
      </span>
      {words.map((word) => (
        <Syllables
          key={word.parts.join(" ")}
          parts={word.parts}
          color={color}
          sound={word.sound}
        />
      ))}
      <Label className="text-center">{label}</Label>
    </div>
  );
}

export function TuGhepTuLay() {
  return (
    <Example>
      <div className="flex w-full flex-wrap justify-center gap-3">
        <WordColumn
          title="Từ ghép"
          color={COMPOUND_COLOR}
          words={[{ parts: ["mái", "tóc"] }, { parts: ["bông", "hoa"] }]}
          label="ghép theo nghĩa"
        />
        <WordColumn
          title="Từ láy"
          color={REDUPLICATIVE_COLOR}
          words={[
            { parts: ["buồn", "bã"], sound: { at: "start", length: 1 } },
            { parts: ["lung", "linh"], sound: { at: "start", length: 1 } },
          ]}
          label="giống âm hoặc vần"
        />
      </div>
    </Example>
  );
}

// Hint: a reduplicative word repeats a sound, shown on words from outside
// the exercises.
export function GoiYTuLay() {
  return (
    <Example>
      <WordColumn
        title="Từ láy"
        color={REDUPLICATIVE_COLOR}
        words={[
          { parts: ["xinh", "xắn"], sound: { at: "start", length: 1 } },
          { parts: ["bồi", "hồi"], sound: { at: "end", length: 2 } },
        ]}
        label="hai tiếng giống âm đầu hoặc vần"
      />
    </Example>
  );
}

// Hint: a compound word joins syllables that each carry meaning.
export function GoiYTuGhep() {
  return (
    <Example>
      <WordColumn
        title="Từ ghép"
        color={COMPOUND_COLOR}
        words={[{ parts: ["sân", "trường"] }, { parts: ["bút", "chì"] }]}
        label="mỗi tiếng đều góp nghĩa"
      />
    </Example>
  );
}

// ---------------------------------------------------------------------------
// Writing

const PLAN = [
  "Cáo nhìn theo bạn đi xa",
  "Cáo buồn, nhớ bạn",
  "Lúa mì, tiếng gió gợi nhớ bạn",
  "Cáo vẫn vui vì có một người bạn",
] as const;

export function DanY() {
  return (
    <Example>
      <ol className="flex w-full max-w-sm flex-col gap-2">
        {PLAN.map((idea, i) => (
          <li
            key={idea}
            className="flex items-center gap-3 rounded-lg border-2 border-border bg-surface px-3 py-2 text-body"
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-concept-pink font-semibold text-white">
              {i + 1}
            </span>
            {idea}
          </li>
        ))}
      </ol>
    </Example>
  );
}

// A model sentence with its reduplicative and compound words marked.
export function CauMau() {
  const mark = (color: ConceptColor, word: string) => (
    <span
      className={`underline decoration-4 underline-offset-4 ${CONCEPT_CLASSES[color].decoration}`}
    >
      {word}
    </span>
  );
  return (
    <Example>
      <p className="text-center font-heading text-block md:text-block-lg">
        Cáo {mark(REDUPLICATIVE_COLOR, "ngẩn ngơ")} nhìn theo con{" "}
        {mark(COMPOUND_COLOR, "đường mòn")}, nơi bạn vừa đi khuất.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Chip color={REDUPLICATIVE_COLOR}>từ láy: ngẩn ngơ</Chip>
        <Chip color={COMPOUND_COLOR}>từ ghép: đường mòn</Chip>
      </div>
    </Example>
  );
}
