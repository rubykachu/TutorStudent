import { z } from "zod";

// Content schemas are the single source for TS types, `content:check` and the
// JSON schema handed to external generators, so they stay free of transforms,
// custom validators and dates (all of which `z.toJSONSchema` cannot express).

const SLUG_PATTERN = "[a-z0-9]+(?:-[a-z0-9]+)*";

export const LessonIdSchema = z
  .string()
  .regex(new RegExp(`^${SLUG_PATTERN}$`), "Expected a kebab-case lesson slug");

// Global content ids read `<lesson-slug>.<kind>.<name>`; the kind segment keeps
// ids of different entities from colliding and makes stray references obvious.
const ID_KINDS = [
  "concept",
  "section",
  "card",
  "ex",
  "video",
  "visual",
] as const;
type IdKind = (typeof ID_KINDS)[number];

function scopedId(kind: IdKind) {
  return z
    .string()
    .regex(
      new RegExp(`^${SLUG_PATTERN}\\.${kind}\\.${SLUG_PATTERN}$`),
      `Expected an id like "<lesson-slug>.${kind}.<name>"`,
    );
}

export const ConceptIdSchema = scopedId("concept");
export const SectionIdSchema = scopedId("section");
export const CardIdSchema = scopedId("card");
export const ExerciseIdSchema = scopedId("ex");
export const VideoIdSchema = scopedId("video");
export const VisualIdSchema = scopedId("visual");

// Ids that only need to be unique inside one exercise or block (options,
// blanks, sentences, formula parts, clips). They never leave their container.
export const LocalIdSchema = z
  .string()
  .regex(new RegExp(`^${SLUG_PATTERN}$`), "Expected a kebab-case local id");

const TextSchema = z.string().trim().min(1);

// Token names from the design system; the hex value lives only in CSS.
export const CONCEPT_COLORS = [
  "blue",
  "violet",
  "pink",
  "amber",
  "teal",
  "sky",
  "lime",
  "slate",
] as const;
export const ConceptColorSchema = z.enum(CONCEPT_COLORS);

export const SUBJECT_COLORS = ["math", "literature", "geography"] as const;
export const SubjectColorSchema = z.enum(SUBJECT_COLORS);

export const SeriesSchema = z.object({
  id: LessonIdSchema,
  name: TextSchema,
});

export const SubjectSchema = z.object({
  id: LessonIdSchema,
  name: TextSchema,
  color: SubjectColorSchema,
  series: z.array(SeriesSchema).min(1),
  // A new child profile starts on this series for the subject.
  defaultSeries: LessonIdSchema,
});

export const SubjectsFileSchema = z.object({
  subjects: z.array(SubjectSchema).min(1),
});

export const ConceptSchema = z.object({
  id: ConceptIdSchema,
  name: TextSchema,
  color: ConceptColorSchema,
});

// ---------------------------------------------------------------------------
// Blocks

export const VisualBlockSchema = z.object({
  type: z.literal("visual"),
  visualId: VisualIdSchema,
  caption: TextSchema.optional(),
});

// Parts a hint may highlight are marked in the TeX with `\htmlId{<local-id>}{…}`;
// a concept's symbols are painted with `\concept{<concept colour>}{…}`, e.g.
// `\concept{blue}{2}^{\concept{violet}{5}}` for a blue base, violet exponent.
export const FormulaBlockSchema = z.object({
  type: z.literal("formula"),
  tex: TextSchema,
});

export const SentenceSchema = z.object({
  id: LocalIdSchema,
  text: TextSchema,
});

export const PassageAnnotationSchema = z.object({
  sentenceId: LocalIdSchema,
  // Margin box label printed in the textbook, e.g. "Theo dõi".
  label: TextSchema,
  text: TextSchema,
});

// Paragraphs are split into sentences so `tapText` answers and hint highlights
// can point at a single sentence by id.
export const PassageBlockSchema = z.object({
  type: z.literal("passage"),
  paragraphs: z.array(z.object({ sentences: z.array(SentenceSchema).min(1) })),
  annotations: z.array(PassageAnnotationSchema),
  source: TextSchema.optional(),
});

export const NoteBlockSchema = z.object({
  type: z.literal("note"),
  text: TextSchema,
});

export const VideoBlockSchema = z.object({
  type: z.literal("video"),
  videoId: VideoIdSchema,
  clipId: LocalIdSchema.optional(),
});

// Absolute https URLs point at the media bucket; root-relative paths are files
// shipped with the app.
export const ImageBlockSchema = z.object({
  type: z.literal("image"),
  src: z
    .string()
    .regex(/^(https:\/\/|\/)\S+$/, "Expected an https URL or a /path"),
  alt: TextSchema,
});

export const BlockSchema = z.discriminatedUnion("type", [
  VisualBlockSchema,
  FormulaBlockSchema,
  PassageBlockSchema,
  NoteBlockSchema,
  VideoBlockSchema,
  ImageBlockSchema,
]);

export const RecapBlockSchema = z.discriminatedUnion("type", [
  VisualBlockSchema,
  FormulaBlockSchema,
]);

// Content of a choice option, match item or order item.
export const ItemContentSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("text"), text: TextSchema }),
  FormulaBlockSchema,
  VisualBlockSchema,
  ImageBlockSchema,
]);

export const ItemSchema = z.object({
  id: LocalIdSchema,
  content: ItemContentSchema,
});

// ---------------------------------------------------------------------------
// Hints

// What a first-level hint lights up, resolved inside the exercise it belongs to:
// - block:  a whole prompt block, by position;
// - part:   a formula part (`\htmlId`) or passage sentence in the prompt;
// - option: an element of the answer area (option, item, blank, region, or the
//   numeric slots "value" / "base" / "exponent").
// `conceptId` colours the highlight with that concept's colour.
export const TargetRefSchema = z.discriminatedUnion("target", [
  z.object({
    target: z.literal("block"),
    index: z.int().nonnegative(),
    conceptId: ConceptIdSchema.optional(),
  }),
  z.object({
    target: z.literal("part"),
    id: LocalIdSchema,
    conceptId: ConceptIdSchema.optional(),
  }),
  z.object({
    target: z.literal("option"),
    id: LocalIdSchema,
    conceptId: ConceptIdSchema.optional(),
  }),
]);

export const HintsSchema = z.object({
  highlight: z.array(TargetRefSchema),
  hintVisualId: VisualIdSchema.optional(),
  solutionVisualId: VisualIdSchema.optional(),
});

// ---------------------------------------------------------------------------
// Exercises

const exerciseBase = {
  id: ExerciseIdSchema,
  cardIds: z.array(CardIdSchema),
  prompt: z.array(BlockSchema).min(1),
  hints: HintsSchema,
  difficulty: z.int().min(1).max(3),
};

// Expression the content lint recomputes to verify the stated answer.
export const CheckSchema = z.object({ expr: TextSchema });

export const ChoiceExerciseSchema = z.object({
  ...exerciseBase,
  type: z.literal("choice"),
  options: z.array(ItemSchema).min(2),
  answer: z.array(LocalIdSchema).min(1),
  // Shown up front so the child knows whether to pick one or several.
  multiple: z.boolean(),
  check: CheckSchema.optional(),
});

export const NumericAnswerSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("value"), value: z.number() }),
  // Entered as two slots so base and exponent are graded and hinted separately.
  z.object({
    kind: z.literal("power"),
    base: z.number(),
    exponent: z.int().nonnegative(),
  }),
]);

export const NumericExerciseSchema = z.object({
  ...exerciseBase,
  type: z.literal("numeric"),
  answer: NumericAnswerSchema,
  unit: TextSchema.optional(),
  check: CheckSchema.optional(),
});

// Every left item pairs with exactly one right item; extra right items act as
// distractors.
export const MatchExerciseSchema = z.object({
  ...exerciseBase,
  type: z.literal("match"),
  left: z.array(ItemSchema).min(2),
  right: z.array(ItemSchema).min(2),
  pairs: z.array(z.object({ left: LocalIdSchema, right: LocalIdSchema })),
});

// Items are listed in the correct order; the UI shuffles them.
export const OrderExerciseSchema = z.object({
  ...exerciseBase,
  type: z.literal("order"),
  items: z.array(ItemSchema).min(2),
});

export const FillBlankSegmentSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("text"), text: z.string().min(1) }),
  z.object({
    type: z.literal("blank"),
    id: LocalIdSchema,
    // Any of these is accepted after NFC, whitespace and case normalisation.
    accept: z.array(TextSchema).min(1),
  }),
]);

export const FillBlankExerciseSchema = z.object({
  ...exerciseBase,
  type: z.literal("fillBlank"),
  segments: z.array(FillBlankSegmentSchema).min(1),
  // Present: the child picks words from this bank; absent: the child types.
  bank: z.array(TextSchema).min(2).optional(),
});

// The tappable sentences come from the passage block(s) in the prompt.
export const TapTextExerciseSchema = z.object({
  ...exerciseBase,
  type: z.literal("tapText"),
  answer: z.array(LocalIdSchema).min(1),
});

// Region ids are declared by the visual in the registry.
export const TapRegionExerciseSchema = z.object({
  ...exerciseBase,
  type: z.literal("tapRegion"),
  visualId: VisualIdSchema,
  answer: z.array(LocalIdSchema).min(1),
});

// The visual reports its state; the named validator of that visual decides
// whether the state satisfies `params`.
export const ManipulateExerciseSchema = z.object({
  ...exerciseBase,
  type: z.literal("manipulate"),
  visualId: VisualIdSchema,
  validatorId: LocalIdSchema,
  params: z.record(z.string(), z.number()),
});

export const BASIC_EXERCISE_TYPES = [
  "choice",
  "numeric",
  "match",
  "order",
  "fillBlank",
  "tapText",
  "tapRegion",
  "manipulate",
] as const;

export const BasicExerciseSchema = z.discriminatedUnion("type", [
  ChoiceExerciseSchema,
  NumericExerciseSchema,
  MatchExerciseSchema,
  OrderExerciseSchema,
  FillBlankExerciseSchema,
  TapTextExerciseSchema,
  TapRegionExerciseSchema,
  ManipulateExerciseSchema,
]);

// A guided chain of auto-graded steps followed by a framed writing task.
// It never joins review sessions, so it carries no cards; its steps may.
export const OpenEndedExerciseSchema = z.object({
  ...exerciseBase,
  type: z.literal("openEnded"),
  cardIds: z.array(CardIdSchema).max(0, "openEnded exercises carry no cards"),
  steps: z.array(BasicExerciseSchema),
  writing: z.object({
    starter: TextSchema,
    rubric: z.array(TextSchema).min(1),
  }),
});

export const ExerciseSchema = z.discriminatedUnion("type", [
  ChoiceExerciseSchema,
  NumericExerciseSchema,
  MatchExerciseSchema,
  OrderExerciseSchema,
  FillBlankExerciseSchema,
  TapTextExerciseSchema,
  TapRegionExerciseSchema,
  ManipulateExerciseSchema,
  OpenEndedExerciseSchema,
]);

// ---------------------------------------------------------------------------
// Cards, sections, videos, lessons

// Which exercises train a card is declared only on `Exercise.cardIds`; the
// reverse index is built by the loader.
export const CardSchema = z.object({
  id: CardIdSchema,
  sourceRef: TextSchema,
  conceptIds: z.array(ConceptIdSchema),
  recap: RecapBlockSchema,
});

export const SectionSchema = z.object({
  id: SectionIdSchema,
  title: TextSchema,
  sourceRef: TextSchema,
  minutes: z.int().positive(),
  blocks: z.array(BlockSchema).min(1),
  // Comprehension checks: graded but never rated.
  checkIds: z.array(ExerciseIdSchema).min(1),
  // First encounter of each card; these answers are rated.
  practiceIds: z.array(ExerciseIdSchema),
  recap: RecapBlockSchema,
});

export const VideoSchema = z.object({
  id: VideoIdSchema,
  lessonId: LessonIdSchema,
  url: z.url({ protocol: /^https$/ }),
  vttUrl: z.url({ protocol: /^https$/ }),
  durationSec: z.number().positive(),
  clips: z.array(
    z.object({
      id: LocalIdSchema,
      start: z.number().nonnegative(),
      end: z.number().positive(),
      cardIds: z.array(CardIdSchema),
    }),
  ),
  voice: z.object({
    engine: TextSchema,
    voiceName: TextSchema,
    model: TextSchema,
  }),
});

export const LESSON_STATUSES = ["draft", "published"] as const;

export const LessonSchema = z.object({
  id: LessonIdSchema,
  subject: LessonIdSchema,
  series: LessonIdSchema,
  grade: z.literal(6),
  order: z.int().nonnegative(),
  title: TextSchema,
  sourceRef: TextSchema,
  status: z.enum(LESSON_STATUSES),
  // Hash of the normalised content at the time of the last passed review.
  reviewedHash: z
    .string()
    .regex(/^[0-9a-f]{64}$/, "Expected a sha256 hex digest")
    .optional(),
  concepts: z.array(ConceptSchema),
  sections: z.array(SectionSchema).min(1),
  cards: z.array(CardSchema),
  exercises: z.array(ExerciseSchema).min(1),
  sticker: z.object({ name: TextSchema, visualId: VisualIdSchema }),
  videos: z.array(VideoSchema).optional(),
});

export const IdsLockSchema = z.object({
  ids: z.array(z.string().min(1)),
  // Retired id -> replacement id, or null when the entity was dropped for good.
  retired: z.record(z.string().min(1), z.string().min(1).nullable()),
});

// `content/glossary/<subject>.json`: the one accepted word for each concept of
// a subject, and the colour every lesson must give that concept.
export const GlossaryTermSchema = z.object({
  term: TextSchema,
  // Non-standard synonyms the content lint rejects in favour of `term`.
  forbidden: z.array(TextSchema),
  color: ConceptColorSchema.optional(),
});

export const GlossaryFileSchema = z.object({
  terms: z.array(GlossaryTermSchema),
  // Proper names (characters, places) that are not Vietnamese syllables but
  // may still appear in lesson text.
  names: z.array(TextSchema),
});

// Static files emitted at build time: `/content/index.json` lists what the app
// may show; each lesson is served whole at `/content/<lessonId>.json`.
export const LessonSummarySchema = z.object({
  id: LessonIdSchema,
  subject: LessonIdSchema,
  series: LessonIdSchema,
  order: z.int().nonnegative(),
  title: TextSchema,
  sourceRef: TextSchema,
  sections: z.array(
    z.object({
      id: SectionIdSchema,
      title: TextSchema,
      minutes: z.int().positive(),
    }),
  ),
  cardCount: z.int().nonnegative(),
});

export const ContentIndexSchema = z.object({
  subjects: z.array(SubjectSchema),
  lessons: z.array(LessonSummarySchema),
});

export type Subject = z.infer<typeof SubjectSchema>;
export type LessonSummary = z.infer<typeof LessonSummarySchema>;
export type ContentIndex = z.infer<typeof ContentIndexSchema>;
export type SubjectsFile = z.infer<typeof SubjectsFileSchema>;
export type Concept = z.infer<typeof ConceptSchema>;
export type ConceptColor = z.infer<typeof ConceptColorSchema>;
export type Block = z.infer<typeof BlockSchema>;
export type RecapBlock = z.infer<typeof RecapBlockSchema>;
export type PassageBlock = z.infer<typeof PassageBlockSchema>;
export type FormulaBlock = z.infer<typeof FormulaBlockSchema>;
export type Item = z.infer<typeof ItemSchema>;
export type TargetRef = z.infer<typeof TargetRefSchema>;
export type Hints = z.infer<typeof HintsSchema>;
export type ChoiceExercise = z.infer<typeof ChoiceExerciseSchema>;
export type NumericExercise = z.infer<typeof NumericExerciseSchema>;
export type NumericAnswer = z.infer<typeof NumericAnswerSchema>;
export type MatchExercise = z.infer<typeof MatchExerciseSchema>;
export type OrderExercise = z.infer<typeof OrderExerciseSchema>;
export type FillBlankExercise = z.infer<typeof FillBlankExerciseSchema>;
export type TapTextExercise = z.infer<typeof TapTextExerciseSchema>;
export type TapRegionExercise = z.infer<typeof TapRegionExerciseSchema>;
export type ManipulateExercise = z.infer<typeof ManipulateExerciseSchema>;
export type BasicExercise = z.infer<typeof BasicExerciseSchema>;
export type BasicExerciseType = BasicExercise["type"];
export type OpenEndedExercise = z.infer<typeof OpenEndedExerciseSchema>;
export type Exercise = z.infer<typeof ExerciseSchema>;
export type Card = z.infer<typeof CardSchema>;
export type Section = z.infer<typeof SectionSchema>;
export type Video = z.infer<typeof VideoSchema>;
export type Lesson = z.infer<typeof LessonSchema>;
export type LessonStatus = Lesson["status"];
export type IdsLock = z.infer<typeof IdsLockSchema>;
export type GlossaryTerm = z.infer<typeof GlossaryTermSchema>;
export type GlossaryFile = z.infer<typeof GlossaryFileSchema>;
