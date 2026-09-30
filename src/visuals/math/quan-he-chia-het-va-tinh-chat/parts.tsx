"use client";

import { Formula } from "@/components/blocks/formula";
import type { ConceptColor } from "@/schema/content";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { ConceptShape } from "@/visuals/shared/concept-mark";

// Pieces shared by the pictures of this lesson.

// A row of a picture: a formula and, beside it, a short tag in a concept
// colour saying what it shows.
export type Row = {
  tex: string;
  tag?: { text: string; color: ConceptColor };
  // Starts a new group: leaves extra space above the row.
  gapBefore?: boolean;
  // A side fact that the next row uses ("vì ..."): smaller, in a dashed box,
  // so it does not read as a link of the chain of equalities.
  aside?: boolean;
};

export function TagChip({
  text,
  color,
}: {
  text: string;
  color: ConceptColor;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border-2 px-3 py-0.5 text-caption ${CONCEPT_CLASSES[color].border}`}
    >
      <svg aria-hidden viewBox="0 0 16 16" className="size-4 shrink-0">
        <ConceptShape color={color} cx={8} cy={8} r={7} />
      </svg>
      {text}
    </span>
  );
}

// A formula with its tag on the right; the pair wraps on a narrow screen.
export function FormulaRow({ row }: { row: Row }) {
  if (row.aside) {
    return (
      <div className="mx-auto flex w-fit items-center justify-center gap-2 rounded-xl border-2 border-muted-foreground border-dashed bg-muted px-3 py-1">
        <span className="text-caption text-muted-foreground">vì</span>
        <Formula tex={row.tex} className="text-body-lg" />
      </div>
    );
  }
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
      <Formula tex={row.tex} className="text-block md:text-block-lg" />
      {row.tag && <TagChip text={row.tag.text} color={row.tag.color} />}
    </div>
  );
}

const DOT_CELL = 32;

// `count` dots in `columns` columns, in a concept colour; the first `gone`
// are drawn as empty slots (taken away). Its width follows the columns, so
// bags of the same size line up.
export function DotBlock({
  count,
  columns,
  color,
  label,
  gone = 0,
}: {
  count: number;
  columns: number;
  color: ConceptColor;
  label: string;
  gone?: number;
}) {
  const rows = Math.max(1, Math.ceil(count / columns));
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`0 0 ${columns * DOT_CELL} ${rows * DOT_CELL}`}
      className="h-auto w-full"
    >
      {Array.from({ length: count }, (_, i) => (
        <ConceptShape
          // biome-ignore lint/suspicious/noArrayIndexKey: dots are placed by position
          key={i}
          color={color}
          variant={i < gone ? "outline" : "filled"}
          cx={(i % columns) * DOT_CELL + DOT_CELL / 2}
          cy={Math.floor(i / columns) * DOT_CELL + DOT_CELL / 2}
          r={DOT_CELL * 0.36}
        />
      ))}
    </svg>
  );
}

// Columns of a bag holding `size` dots: one row up to 4, then a squarer block.
export function bagColumns(size: number): number {
  if (size <= 4) return size;
  if (size <= 6) return 3;
  if (size <= 8) return 4;
  return 5;
}

const BOX_TONES = {
  bag: "border-concept-violet bg-surface",
  left: "border-concept-pink border-dashed bg-surface",
  pending: "border-muted-foreground border-dashed bg-muted",
} as const;
export type BoxTone = keyof typeof BOX_TONES;

// A bag of items: solid violet box with blue dots, the left-over items in a
// dashed pink box with pink dots, or a dashed grey box still to be filled.
export function BagBox({
  count,
  size,
  tone,
  label,
  compact = false,
  gone = 0,
}: {
  count: number;
  size: number;
  tone: BoxTone;
  label: string;
  // Smaller dots, for pictures that stack several rows of bags.
  compact?: boolean;
  // How many of the first dots were taken away (drawn as empty slots).
  gone?: number;
}) {
  const columns = Math.min(bagColumns(size), Math.max(count, 1));
  return (
    <div
      className={`rounded-xl border-2 p-1.5 ${BOX_TONES[tone]}`}
      style={{
        width: `calc(${columns} * ${compact ? 0.85 : 1.25}rem + ${compact ? 1 : 1.25}rem)`,
      }}
    >
      {tone === "pending" ? (
        <p
          role="img"
          aria-label={label}
          className="py-1 text-center font-heading text-block font-bold text-muted-foreground"
        >
          ?
        </p>
      ) : (
        <DotBlock
          count={count}
          columns={columns}
          color={tone === "left" ? "pink" : "blue"}
          label={label}
          gone={gone}
        />
      )}
    </div>
  );
}
