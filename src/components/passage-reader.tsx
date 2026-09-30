"use client";

import { Eye } from "lucide-react";
import { type KeyboardEvent, useId } from "react";
import type { HighlightSpec } from "@/exercises/feedback";
import type { PassageBlock } from "@/schema/content";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";

type Annotation = PassageBlock["annotations"][number];
type Sentence = PassageBlock["paragraphs"][number]["sentences"][number];

// Reading mode shows the text; tap mode turns every sentence into a toggle so
// the same reader serves sentence-picking exercises.
type SelectionProps =
  | { selectable?: false }
  | {
      selectable: true;
      selected: readonly string[];
      onToggle: (sentenceId: string) => void;
      disabled?: boolean;
    };

export type PassageReaderProps = {
  passage: PassageBlock;
  // Sentence id -> how a hint lights it up.
  highlight?: ReadonlyMap<string, HighlightSpec>;
} & SelectionProps;

const NO_HIGHLIGHT: ReadonlyMap<string, HighlightSpec> = new Map();

export const SENTENCE_ATTR = "data-sentence-id";

// Sentences stay plain inline text so a long one wraps like prose; the
// background and outline repeat on every line it spans.
// A sentence a margin note is about: a dashed underline in the notes' accent,
// thinner than a hint's solid one, so it reads as "look here", not as a hint
// or a selection.
const NOTED_CLASS =
  "underline decoration-dashed decoration-2 underline-offset-6 decoration-concept-amber";

function sentenceClass(
  spec: HighlightSpec | undefined,
  selected: boolean,
  selectable: boolean,
  noted: boolean,
): string {
  const classes = ["box-decoration-clone rounded-sm"];
  if (selectable) {
    classes.push(
      "cursor-pointer px-0.5 py-2 motion-safe:transition-colors motion-safe:duration-100",
    );
  }
  // The highlight fill means "selected"; a hint is an underline in the
  // concept's colour and never fills the sentence.
  if (selected) classes.push("bg-highlight");
  if (noted && !spec) classes.push(NOTED_CLASS);
  if (spec) {
    classes.push(
      `underline decoration-4 underline-offset-4 ${CONCEPT_CLASSES[spec.color].decoration}`,
    );
  }
  if (spec?.strong) classes.push("outline-3 outline-foreground");
  return classes.join(" ");
}

type SentenceViewProps = {
  sentence: Sentence;
  spec: HighlightSpec | undefined;
  // The margin notes about this sentence: their ids are read after its text
  // and their numbers follow it as badges.
  notes: readonly IdentifiedNote[];
  selection: SelectionProps;
};

function SentenceView({ sentence, spec, notes, selection }: SentenceViewProps) {
  const noted = notes.length > 0;
  const noteIds = noted ? notes.map((entry) => entry.id).join(" ") : undefined;
  const common = {
    [SENTENCE_ATTR]: sentence.id,
    "data-highlighted": spec ? true : undefined,
    "data-highlight-strong": spec?.strong || undefined,
    "aria-describedby": noteIds,
  };
  if (!selection.selectable) {
    return (
      <span {...common} className={sentenceClass(spec, false, false, noted)}>
        {sentence.text}
      </span>
    );
  }
  const { selected, onToggle, disabled = false } = selection;
  const isSelected = selected.includes(sentence.id);
  const toggle = () => {
    if (!disabled) onToggle(sentence.id);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    toggle();
  };
  return (
    // A <button> would turn the sentence into one unbreakable box; an inline
    // span with button semantics keeps it wrapping like the rest of the text.
    // biome-ignore lint/a11y/useSemanticElements: see above
    <span
      {...common}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-pressed={isSelected}
      aria-disabled={disabled || undefined}
      data-selected={isSelected || undefined}
      className={sentenceClass(spec, isSelected, true, noted)}
      onClick={toggle}
      onKeyDown={onKeyDown}
    >
      {sentence.text}
    </span>
  );
}

type IdentifiedNote = { id: string; number: number; note: Annotation };

// The number that ties a note to its sentence, drawn the same at both ends.
function NoteBadge({ number }: { number: number }) {
  return (
    <span
      aria-hidden
      data-note-badge={number}
      className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-concept-amber align-middle font-sans text-caption font-bold leading-none text-white no-underline"
    >
      {number}
    </span>
  );
}

// The textbook prints these boxes as "Theo dõi" (kept in the content as the
// note's label); children read that as "follow", so the box says "Để ý"
// ("notice"). Spans only, so the phone copy may sit inside the paragraph.
function AnnotationCard({ entry, id }: { entry: IdentifiedNote; id?: string }) {
  const { note, number } = entry;
  return (
    <span
      id={id}
      data-annotation-for={note.sentenceId}
      data-annotation-label={note.label}
      className="flex flex-col gap-1 rounded-sm border-2 border-l-4 border-border border-l-concept-amber bg-muted p-3 text-caption"
    >
      <span className="flex items-center gap-2 font-semibold text-concept-amber">
        <NoteBadge number={number} />
        <Eye aria-hidden className="size-5" />
        Để ý
      </span>
      <span>{note.text}</span>
    </span>
  );
}

// A reading passage split into sentences, with the textbook's margin notes
// and the source it is quoted from. Each note is tied to its sentence by a
// dashed underline and a number badge at both ends; tablets show the notes in
// a margin beside the paragraph, phones right under the sentence.
export function PassageReader({
  passage,
  highlight = NO_HIGHLIGHT,
  ...selection
}: PassageReaderProps) {
  const baseId = useId();
  const notesBySentence = new Map<string, IdentifiedNote[]>();
  passage.annotations.forEach((note, index) => {
    const list = notesBySentence.get(note.sentenceId) ?? [];
    list.push({ id: `${baseId}-note-${index}`, number: index + 1, note });
    notesBySentence.set(note.sentenceId, list);
  });
  const tapMode = selection.selectable === true;

  return (
    <figure
      className="flex w-full flex-col gap-6 text-passage md:text-passage-lg"
      data-passage
      data-selectable={tapMode || undefined}
    >
      {passage.paragraphs.map((paragraph) => {
        const notes = paragraph.sentences.flatMap(
          (sentence) => notesBySentence.get(sentence.id) ?? [],
        );
        return (
          <div
            key={paragraph.sentences[0]?.id}
            className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_12rem] md:gap-6"
            data-paragraph
          >
            <p className={`max-w-[60ch] ${tapMode ? "leading-tap" : ""}`}>
              {paragraph.sentences.map((sentence, index) => {
                const own = notesBySentence.get(sentence.id) ?? [];
                return (
                  <span key={sentence.id}>
                    {index > 0 && " "}
                    <SentenceView
                      sentence={sentence}
                      spec={highlight.get(sentence.id)}
                      notes={own}
                      selection={selection}
                    />
                    {own.map((entry) => (
                      <span key={entry.id}>
                        {" "}
                        <NoteBadge number={entry.number} />
                      </span>
                    ))}
                    {own.length > 0 && (
                      // Phones: the notes right under their sentence. The
                      // margin copies carry the ids screen readers use.
                      <span
                        aria-hidden
                        className="mt-3 flex flex-col gap-3 md:hidden"
                        data-annotations-inline
                      >
                        {own.map((entry) => (
                          <AnnotationCard key={entry.id} entry={entry} />
                        ))}
                      </span>
                    )}
                  </span>
                );
              })}
            </p>
            {notes.length > 0 && (
              <aside
                data-annotations
                className="hidden flex-col gap-3 md:col-start-2 md:row-start-1 md:flex md:self-start"
              >
                {notes.map((entry) => (
                  <AnnotationCard key={entry.id} id={entry.id} entry={entry} />
                ))}
              </aside>
            )}
          </div>
        );
      })}
      {passage.source && (
        <figcaption className="text-right text-caption text-muted-foreground">
          <cite className="not-italic">{passage.source}</cite>
        </figcaption>
      )}
    </figure>
  );
}
