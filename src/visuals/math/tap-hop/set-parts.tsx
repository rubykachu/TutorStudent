import type { ReactNode } from "react";
import type { ConceptColor } from "@/schema/content";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { ConceptMark } from "@/visuals/shared/concept-mark";

// Pieces shared by the set visuals of this lesson. Colours follow the lesson's
// concepts: the set and its name are teal, elements and numbers inside a set
// are amber, the characteristic property is lime; braces, "|" and ";" stay in
// the plain text colour.

// The large line of maths every set visual centres on.
export const MATH_LINE =
  "flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1 font-heading text-block font-bold md:text-block-lg";

// Root of a static figure: one image for screen readers.
export function Figure({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`flex w-full flex-col items-center gap-4 ${className}`}
    >
      {children}
    </div>
  );
}

// "▲ Tập hợp": a short label led by its concept's mark.
export function Tag({
  color,
  children,
  className = "",
}: {
  color: ConceptColor;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-caption font-semibold ${CONCEPT_CLASSES[color].text} ${className}`}
    >
      <ConceptMark color={color} className="size-4" />
      {children}
    </span>
  );
}

// A dim "?" standing where a label or a piece is still to come.
export function Pending({ children = "?" }: { children?: ReactNode }) {
  return (
    <span className="text-caption font-semibold text-muted-foreground">
      {children}
    </span>
  );
}

// An element of a set as a card: amber, round for names of people.
export function Chip({
  children,
  round = false,
  emphasis = false,
  faded = false,
}: {
  children: ReactNode;
  round?: boolean;
  emphasis?: boolean;
  faded?: boolean;
}) {
  return (
    <span
      className={`inline-flex min-h-11 min-w-11 items-center justify-center border-2 border-concept-amber bg-surface px-3 font-heading text-block font-bold text-concept-amber ${
        round ? "rounded-full" : "rounded-xl"
      } ${emphasis ? "ring-4 ring-highlight" : ""} ${
        faded ? "line-through opacity-40" : ""
      }`}
    >
      {children}
    </span>
  );
}

// A chip with a short label under it.
export function LabelledChip({
  chip,
  label,
}: {
  chip: ReactNode;
  label: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      {chip}
      {label}
    </div>
  );
}

// The teal box of a set: its name on top, its elements inside.
export function SetBox({
  name,
  children,
  className = "",
}: {
  name: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`w-full max-w-md rounded-2xl border-2 border-concept-teal bg-surface p-3 ${className}`}
    >
      <p className="mb-2 flex items-center gap-2 font-heading text-block font-bold text-concept-teal md:text-block-lg">
        <ConceptMark color="teal" className="size-5" />
        {name}
      </p>
      <div className="flex flex-wrap items-start gap-2">{children}</div>
    </div>
  );
}

// Tokens of a line of maths.
export function Dim({ dim, children }: { dim?: boolean; children: ReactNode }) {
  return (
    <span
      className={`motion-safe:transition-opacity ${dim ? "opacity-30" : ""}`}
    >
      {children}
    </span>
  );
}

// "∈" / "∉" between an element and its set, enlarged: the glyphs are thin in
// the heading font.
export function Sign({ inside }: { inside: boolean }) {
  return (
    <span className="mx-0.5 font-sans text-[1.3em] leading-none font-semibold">
      {inside ? "∈" : "∉"}
    </span>
  );
}

export function SetName({ children }: { children: ReactNode }) {
  return <span className={CONCEPT_CLASSES.teal.text}>{children}</span>;
}

export function Element({ children }: { children: ReactNode }) {
  return <span className={CONCEPT_CLASSES.amber.text}>{children}</span>;
}

// A phrase that may wrap: every word flows as its own piece of the line.
export function Words({
  text,
  className = "",
  dim,
}: {
  text: string;
  className?: string;
  dim?: boolean;
}) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: words never reorder
        <Dim key={i} dim={dim}>
          <span className={className}>{word}</span>
        </Dim>
      ))}
    </>
  );
}

// "A = { 2 ; 4 ; 6 }": a set written by listing its elements; `name` is left
// out for a set with none.
export function ListLine({
  name,
  elements,
}: {
  name?: string;
  elements: readonly (string | number)[];
}) {
  return (
    <p className={MATH_LINE}>
      {name && <SetName>{name}</SetName>}
      {name && <span>=</span>}
      <span>{"{"}</span>
      {elements.map((element, i) => (
        <span key={element} className="whitespace-nowrap">
          <Element>{element}</Element>
          {i < elements.length - 1 && " ;"}
        </span>
      ))}
      <span>{"}"}</span>
    </p>
  );
}

// "B = { x | x là số lẻ }": a set written by its characteristic property.
// `emphasis` keeps one part at full strength and dims the rest.
export function PropertyLine({
  name,
  property,
  emphasis,
}: {
  name?: string;
  property: string;
  emphasis?: "x" | "property";
}) {
  const dimX = emphasis === "property";
  const dimProperty = emphasis === "x";
  const dimRest = emphasis !== undefined;
  return (
    <p className={MATH_LINE}>
      {name && (
        <Dim dim={dimRest}>
          <SetName>{name}</SetName>
        </Dim>
      )}
      {name && (
        <Dim dim={dimRest}>
          <span>=</span>
        </Dim>
      )}
      <Dim dim={dimRest}>
        <span>{"{"}</span>
      </Dim>
      <Dim dim={dimX}>
        <Element>x</Element>
      </Dim>
      <Dim dim={dimRest}>
        <span>|</span>
      </Dim>
      <Words
        text={property}
        className={CONCEPT_CLASSES.lime.text}
        dim={dimProperty}
      />
      <Dim dim={dimRest}>
        <span>{"}"}</span>
      </Dim>
    </p>
  );
}

// Everyday objects of the pencil case, drawn flat in a 48 x 48 box. Strokes
// set their own width and dash, so the shapes also work inside a tappable
// region whose group stroke is the selection ring.
export type ItemKind = "but" | "thuoc" | "tay";

export const ITEM_LABELS: Readonly<Record<ItemKind, string>> = {
  but: "bút",
  thuoc: "thước",
  tay: "tẩy",
};

const LINE = {
  strokeWidth: 2,
  strokeDasharray: "none",
  strokeLinejoin: "round",
} as const;

const RULER_TICKS = [10, 16, 22, 28, 34, 40] as const;

export function ItemShape({ kind }: { kind: ItemKind }) {
  switch (kind) {
    case "but":
      return (
        <g transform="rotate(25 24 24)">
          <rect
            x={18}
            y={3}
            width={12}
            height={30}
            className="fill-surface stroke-foreground"
            {...LINE}
          />
          <polygon
            points="18,33 30,33 24,45"
            className="fill-muted-foreground/40 stroke-foreground"
            {...LINE}
          />
          <rect
            x={18}
            y={3}
            width={12}
            height={6}
            className="fill-foreground stroke-foreground"
            {...LINE}
          />
        </g>
      );
    case "thuoc":
      return (
        <g>
          <rect
            x={14}
            y={3}
            width={20}
            height={42}
            rx={2}
            className="fill-surface stroke-foreground"
            {...LINE}
          />
          {RULER_TICKS.map((y, i) => (
            <line
              key={y}
              x1={14}
              y1={y}
              x2={i % 2 === 0 ? 26 : 22}
              y2={y}
              className="stroke-foreground"
              {...LINE}
            />
          ))}
        </g>
      );
    case "tay":
      return (
        <g transform="rotate(-20 24 24)">
          <rect
            x={6}
            y={14}
            width={36}
            height={20}
            rx={5}
            className="fill-surface stroke-foreground"
            {...LINE}
          />
          <rect
            x={6}
            y={14}
            width={14}
            height={20}
            rx={5}
            className="fill-muted-foreground/40 stroke-foreground"
            {...LINE}
          />
        </g>
      );
  }
}

export function ItemIcon({ kind }: { kind: ItemKind }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className="size-12">
      <ItemShape kind={kind} />
    </svg>
  );
}

export const CASE_ITEMS: readonly ItemKind[] = ["but", "thuoc", "tay"];
