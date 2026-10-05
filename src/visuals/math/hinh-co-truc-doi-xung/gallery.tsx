import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { decorative } from "@/visuals/shared/markers";
import { AXIS_CLASS, LineMark, Strokes } from "./draw";
import { type Subject, SubjectDrawing, subjectName } from "./figures";
import { FoldGroup } from "./fold-view";
import { GLYPH_HEIGHT, GLYPH_WIDTH, GLYPHS, type GlyphId } from "./glyphs";
import { PAPERS, type PaperId } from "./paper";
import { FRAME } from "./shapes";

// Pictures side by side, each with a caption: everyday things, shapes with
// their axes, and the digit cards of the workbook.

export type GalleryItem = {
  subject: Subject;
  caption: string;
  // Draws the axes of the subject over it.
  axes?: boolean;
};

export type GallerySpec = {
  label: string;
  items: readonly GalleryItem[];
  // Pictures in a row (default: as many as there are, up to 3).
  columns?: 1 | 2 | 3;
};

const COLUMNS_CLASS = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
} as const;

export function Gallery({ spec }: { spec: GallerySpec }) {
  const columns = spec.columns ?? (spec.items.length >= 3 ? 3 : 2);
  return (
    <figure aria-label={spec.label} className="w-full">
      <ul className={`grid items-start gap-2 ${COLUMNS_CLASS[columns]}`}>
        {spec.items.map((item) => (
          <li
            key={item.caption}
            className="flex min-w-0 flex-col items-center gap-1"
          >
            <div
              className={`w-full ${columns === 3 ? "max-w-36" : "max-w-40"}`}
            >
              <svg
                viewBox={`0 0 ${FRAME} ${FRAME}`}
                role="img"
                aria-label={subjectName(item.subject)}
                className="h-auto w-full"
              >
                <SubjectDrawing subject={item.subject} axes={item.axes} thin />
              </svg>
            </div>
            <span className="text-center text-caption">{item.caption}</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}

// ---------------------------------------------------------------------------
// The digit cards of the exercise on building numbers from three cards.

const CARD_W = 56;
const CARD_H = 88;
const CARD_GAP = 8;

export type DigitCardsSpec = { label: string; digits: readonly GlyphId[] };

export function DigitCards({ spec }: { spec: DigitCardsSpec }) {
  const width =
    spec.digits.length * CARD_W + (spec.digits.length + 1) * CARD_GAP;
  const height = CARD_H + 2 * CARD_GAP;
  const scale = 4.2;
  return (
    <div className="mx-auto w-full" style={{ maxWidth: width * 1.6 }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={spec.label}
        className="h-auto w-full"
      >
        <g {...decorative}>
          {spec.digits.map((digit, n) => {
            const x = CARD_GAP + n * (CARD_W + CARD_GAP);
            const dx = x + (CARD_W - GLYPH_WIDTH * scale) / 2;
            const dy = CARD_GAP + (CARD_H - GLYPH_HEIGHT * scale) / 2;
            return (
              <g key={digit}>
                <rect
                  x={x}
                  y={CARD_GAP}
                  width={CARD_W}
                  height={CARD_H}
                  rx={6}
                  className={CONCEPT_CLASSES.blue.fill}
                  fillOpacity={0.85}
                />
                <g transform={`translate(${dx} ${dy}) scale(${scale})`}>
                  <Strokes
                    strokes={GLYPHS[digit]}
                    lineClass="stroke-surface"
                    fillClass="none"
                    width={3.2}
                  />
                </g>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sheets of paper side by side: folded as they lie, or opened out.

export type PapersSpec = {
  label: string;
  items: readonly { paper: PaperId; open: boolean; caption: string }[];
};

export function Papers({ spec }: { spec: PapersSpec }) {
  return (
    <figure aria-label={spec.label} className="w-full">
      <ul className="grid grid-cols-3 items-start gap-2">
        {spec.items.map((item) => {
          const paper = PAPERS[item.paper];
          return (
            <li
              key={item.caption}
              className="flex min-w-0 flex-col items-center gap-1"
            >
              <div className="w-full max-w-40">
                <svg
                  viewBox={`0 0 ${FRAME} ${FRAME}`}
                  role="img"
                  aria-label={`${paper.name}${item.open ? ", đã mở ra" : ", đã gấp đôi"}`}
                  className="h-auto w-full"
                >
                  <FoldGroup
                    strokes={paper.strokes}
                    axis={paper.fold}
                    t={item.open ? 0 : 1}
                    smoothly={false}
                  />
                  <g {...decorative}>
                    <LineMark
                      axis={paper.fold}
                      className={AXIS_CLASS}
                      dashed={item.open}
                    />
                  </g>
                </svg>
              </div>
              <span className="text-center text-caption">{item.caption}</span>
            </li>
          );
        })}
      </ul>
    </figure>
  );
}

// ---------------------------------------------------------------------------
// Numbers built from digit cards, each with the line it is symmetric about.

export type NumbersSpec = {
  label: string;
  items: readonly {
    digits: readonly GlyphId[];
    // "v": the vertical line through the middle; "h": the horizontal one.
    axis: "v" | "h";
    caption: string;
  }[];
};

const NUMBER_GAP = 4;

export function Numbers({ spec }: { spec: NumbersSpec }) {
  return (
    <figure aria-label={spec.label} className="w-full">
      <ul className="grid grid-cols-2 items-start gap-3">
        {spec.items.map((item) => {
          const width =
            item.digits.length * GLYPH_WIDTH +
            (item.digits.length - 1) * NUMBER_GAP;
          const scale = 5;
          const [w, h] = [(width + 8) * scale, (GLYPH_HEIGHT + 8) * scale];
          return (
            <li
              key={item.caption}
              className="flex min-w-0 flex-col items-center gap-1"
            >
              <svg
                viewBox={`0 0 ${w} ${h}`}
                role="img"
                aria-label={item.caption}
                className="h-auto w-full max-w-56"
              >
                <g {...decorative}>
                  <g
                    transform={`translate(${4 * scale} ${4 * scale}) scale(${scale})`}
                  >
                    {item.digits.map((digit, n) => (
                      <g
                        // biome-ignore lint/suspicious/noArrayIndexKey: a digit may repeat within a number
                        key={`${digit}${n}`}
                        transform={`translate(${n * (GLYPH_WIDTH + NUMBER_GAP)} 0)`}
                      >
                        <Strokes
                          strokes={GLYPHS[digit]}
                          fillClass="none"
                          width={2.4}
                        />
                      </g>
                    ))}
                    <line
                      x1={item.axis === "v" ? width / 2 : -3}
                      y1={item.axis === "v" ? -3 : GLYPH_HEIGHT / 2}
                      x2={item.axis === "v" ? width / 2 : width + 3}
                      y2={
                        item.axis === "v" ? GLYPH_HEIGHT + 3 : GLYPH_HEIGHT / 2
                      }
                      strokeWidth={0.8}
                      strokeDasharray="2 1.6"
                      strokeLinecap="round"
                      className={AXIS_CLASS}
                    />
                  </g>
                </g>
              </svg>
              <span className="text-center text-caption">{item.caption}</span>
            </li>
          );
        })}
      </ul>
    </figure>
  );
}
