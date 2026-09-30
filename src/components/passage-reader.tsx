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
function sentenceClass(
  spec: HighlightSpec | undefined,
  selected: boolean,
  selectable: boolean,
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
  // Ids of the margin notes about this sentence, read after its text.
  noteIds: string | undefined;
  selection: SelectionProps;
};

function SentenceView({
  sentence,
  spec,
  noteIds,
  selection,
}: SentenceViewProps) {
  const common = {
    [SENTENCE_ATTR]: sentence.id,
    "data-highlighted": spec ? true : undefined,
    "data-highlight-strong": spec?.strong || undefined,
    "aria-describedby": noteIds,
  };
  if (!selection.selectable) {
    return (
      <span {...common} className={sentenceClass(spec, false, false)}>
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
      className={sentenceClass(spec, isSelected, true)}
      onClick={toggle}
      onKeyDown={onKeyDown}
    >
      {sentence.text}
    </span>
  );
}

type IdentifiedNote = { id: string; note: Annotation };

function AnnotationCard({ id, note }: IdentifiedNote) {
  return (
    <div
      id={id}
      data-annotation-for={note.sentenceId}
      className="flex flex-col gap-1 rounded-sm border-2 border-border bg-muted p-3 text-caption"
    >
      <span className="flex items-center gap-2 font-semibold text-muted-foreground">
        <Eye aria-hidden className="size-5" />
        {note.label}
      </span>
      <span>{note.text}</span>
    </div>
  );
}

// A reading passage split into sentences, with the textbook's margin notes
// ("Theo dõi") beside the paragraph on tablets and under it on phones, and
// the source it is quoted from.
export function PassageReader({
  passage,
  highlight = NO_HIGHLIGHT,
  ...selection
}: PassageReaderProps) {
  const baseId = useId();
  const notesBySentence = new Map<string, IdentifiedNote[]>();
  passage.annotations.forEach((note, index) => {
    const list = notesBySentence.get(note.sentenceId) ?? [];
    list.push({ id: `${baseId}-note-${index}`, note });
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
              {paragraph.sentences.map((sentence, index) => (
                <span key={sentence.id}>
                  {index > 0 && " "}
                  <SentenceView
                    sentence={sentence}
                    spec={highlight.get(sentence.id)}
                    noteIds={notesBySentence
                      .get(sentence.id)
                      ?.map((entry) => entry.id)
                      .join(" ")}
                    selection={selection}
                  />
                </span>
              ))}
            </p>
            {notes.length > 0 && (
              <aside
                data-annotations
                className="flex flex-col gap-3 md:col-start-2 md:row-start-1 md:self-start"
              >
                {notes.map((entry) => (
                  <AnnotationCard key={entry.id} {...entry} />
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
