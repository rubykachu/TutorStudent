import { ArrowDown, ArrowUp } from "lucide-react";
import type { ReactNode } from "react";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { Glyph, type GlyphKey } from "./glyphs";

// A line of maths made of tokens: marks drawn from the glyph paths, and text
// in the lesson's concept colours (elements amber, set names teal, the rest
// plain). A token may carry a short label that hangs under or over it.

export type Note = {
  text: string;
  side: "above" | "below";
  // Where the label sits against its token; "start" and "end" keep a label
  // under a token at the line's edge inside the line.
  align?: "center" | "start" | "end";
};

type TokenBase = { note?: Note };

export type Token = TokenBase &
  (
    | { kind: "glyph"; key: GlyphKey; emphasis?: "highlight" | "ring" }
    | { kind: "text"; text: string; tone?: "element" | "set" }
  );

export type LineSize = "md" | "lg";

const TEXT_SIZE: Record<LineSize, string> = {
  md: "text-block md:text-block-lg",
  lg: "text-title md:text-title-lg",
};
const GLYPH_SIZE: Record<LineSize, string> = {
  md: "h-10 md:h-12",
  lg: "h-12 md:h-14",
};

const TONE: Record<"element" | "set", string> = {
  element: CONCEPT_CLASSES.amber.text,
  set: CONCEPT_CLASSES.teal.text,
};

const ALIGN: Record<NonNullable<Note["align"]>, string> = {
  center: "left-1/2 -translate-x-1/2 items-center text-center",
  start: "left-0 items-start text-left",
  end: "right-0 items-end text-right",
};

function NoteLabel({ note }: { note: Note }) {
  const above = note.side === "above";
  const Arrow = above ? ArrowDown : ArrowUp;
  return (
    <>
      <Arrow
        aria-hidden
        className={`absolute left-1/2 size-6 -translate-x-1/2 text-muted-foreground ${above ? "bottom-full" : "top-full"}`}
      />
      <span
        className={`absolute flex w-max max-w-24 text-base font-semibold leading-tight ${ALIGN[note.align ?? "center"]} ${above ? "bottom-full mb-7" : "top-full mt-7"}`}
      >
        {note.text}
      </span>
    </>
  );
}

function TokenView({ token, size }: { token: Token; size: LineSize }) {
  let content: ReactNode;
  if (token.kind === "glyph") {
    const frame =
      token.emphasis === "highlight"
        ? "rounded-lg bg-highlight px-1"
        : token.emphasis === "ring"
          ? "rounded-full border-3 border-foreground px-1"
          : "";
    content = (
      <span className={`inline-flex items-center ${frame}`}>
        <Glyph name={token.key} sizeClass={GLYPH_SIZE[size]} />
      </span>
    );
  } else {
    content = (
      <span className={token.tone ? TONE[token.tone] : undefined}>
        {token.text}
      </span>
    );
  }
  if (!token.note) return content;
  return (
    <span className="relative inline-flex">
      {content}
      <NoteLabel note={token.note} />
    </span>
  );
}

// Room a label needs above or below the line, so it never meets a neighbour.
const NOTE_ROOM = { above: "pt-20", below: "pb-20" } as const;

export function SymbolLine({
  tokens,
  label,
  size = "lg",
  spread = false,
}: {
  tokens: readonly Token[];
  // Spoken reading of the whole line.
  label: string;
  size?: LineSize;
  // Widens the gaps, so labels hung under the ends of a short line stay apart.
  spread?: boolean;
}) {
  const sides = new Set(tokens.flatMap((t) => (t.note ? [t.note.side] : [])));
  const room = [...sides].map((side) => NOTE_ROOM[side]).join(" ");
  return (
    <div role="img" aria-label={label} className="flex w-full justify-center">
      <div
        aria-hidden
        className={`flex flex-nowrap items-center justify-center ${spread ? "gap-x-5 md:gap-x-6" : "gap-x-2 md:gap-x-3"} font-heading font-bold ${TEXT_SIZE[size]} ${room}`}
      >
        {tokens.map((token, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: tokens never reorder
          <TokenView key={i} token={token} size={size} />
        ))}
      </div>
    </div>
  );
}

// Token shorthands for the examples.
export const glyph = (
  key: GlyphKey,
  extra: Partial<Extract<Token, { kind: "glyph" }>> = {},
): Token => ({ kind: "glyph", key, ...extra });

export const text = (
  value: string,
  tone?: "element" | "set",
  note?: Note,
): Token => ({ kind: "text", text: value, tone, note });

export const element = (value: string | number, note?: Note): Token =>
  text(String(value), "element", note);

export const setName = (value: string): Token => text(value, "set");
