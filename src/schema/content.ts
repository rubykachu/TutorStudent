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
  "tip",
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
export const TipIdSchema = scopedId("tip");

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

// Palette of subject accents (`--color-subject-<token>` in globals.css) and
// icons (mapped to components in components/subject-style.ts). A subject
// picks one of each in content/subjects.json; adding a palette entry or icon
// means extending these lists, the CSS token and the style map together.
export const SUBJECT_COLORS = ["blue", "terracotta", "teal"] as const;
export const SubjectColorSchema = z.enum(SUBJECT_COLORS);

export const SUBJECT_ICONS = ["calculator", "book-open", "globe"] as const;
export const SubjectIconSchema = z.enum(SUBJECT_ICONS);

// `vi` lessons are checked against the Vietnamese spelling and reading-level
// rules; other languages skip them.
export const SUBJECT_LANGUAGES = ["vi", "en"] as const;
export const SubjectLanguageSchema = z.enum(SUBJECT_LANGUAGES);

// Authoring rules that only some subjects follow.
export const SubjectRulesSchema = z.object({
  // `numeric` exercises carry `check.expr`, recomputed by content:check.
  checkExpr: z.boolean(),
  // Passages are verbatim source texts compared with `source-passage.txt`.
  verbatimPassage: z.boolean(),
  // Every lesson ends with at least one openEnded (writing) exercise.
  requiresOpenEnded: z.boolean(),
});

export const SeriesSchema = z.object({
  id: LessonIdSchema,
  name: TextSchema,
});

export const SubjectSchema = z.object({
  id: LessonIdSchema,
  name: TextSchema,
  color: SubjectColorSchema,
  icon: SubjectIconSchema,
  language: SubjectLanguageSchema,
  rules: SubjectRulesSchema,
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

// `rule: true` marks the sentence(s) a section teaches as its rule. The
// content lint then requires recaps that restate the rule to repeat it word
// for word, so the child meets one wording on the screen, recap and card.
export const NoteBlockSchema = z.object({
  type: z.literal("note"),
  text: TextSchema,
  rule: z.boolean().optional(),
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

// What a tip is for: a way to solve faster, a way to see the idea at a glance,
// or a way to avoid a typical mistake. The values are the labels the child
// reads on the tip card.
export const TIP_KINDS = ["làm nhanh", "hiểu nhanh", "tránh sai"] as const;
export const TipKindSchema = z.enum(TIP_KINDS);

// A trick for one kind of problem. The same fields serve a `tip` block inside
// a section and an entry of a lesson's `tips.json`, so a tip reads the same
// wherever it is authored. `tex` is the formula that carries the trick;
// `visualId` a picture of it.
export const TipSchema = z.object({
  id: TipIdSchema,
  kind: TipKindSchema,
  // The problem type the trick is for, e.g. "Nhân với 9".
  title: TextSchema,
  text: TextSchema,
  tex: TextSchema.optional(),
  visualId: VisualIdSchema.optional(),
});

// One screen of a section. Allowed in `Section.blocks` only: a tip never
// sits inside an exercise prompt, a group or a recap.
export const TipBlockSchema = TipSchema.extend({ type: z.literal("tip") });

export const BlockSchema = z.discriminatedUnion("type", [
  VisualBlockSchema,
  FormulaBlockSchema,
  PassageBlockSchema,
  NoteBlockSchema,
  VideoBlockSchema,
  ImageBlockSchema,
]);

// Several blocks shown together on one learning screen, in order: a rule
// sentence (`note`) with the formula or picture that shows it. A section
// otherwise shows one block per screen. Only short, still parts may share a
// screen: no passage or video, and no group inside a group. Allowed in
// `Section.blocks` only: an exercise prompt already shows all its blocks on
// one screen, so a `block` hint target keeps counting plain prompt blocks.
export const GroupChildSchema = z.discriminatedUnion("type", [
  NoteBlockSchema,
  FormulaBlockSchema,
  VisualBlockSchema,
  ImageBlockSchema,
]);

// Answer interactions a child must be shown how to use before the first
// exercise that needs them: a tap on a picture region or passage sentence,
// matching, ordering, dragging a manipulable visual, picking words from a
// fill-in bank, and the power key of the numeric keypad.
export const GUIDED_INTERACTIONS = [
  "tapRegion",
  "tapText",
  "match",
  "order",
  "manipulate",
  "fillBlankBank",
  "numericPower",
] as const;
export const GuidedInteractionSchema = z.enum(GUIDED_INTERACTIONS);

export const GroupBlockSchema = z.object({
  type: z.literal("group"),
  // A group of one is just that block.
  children: z.array(GroupChildSchema).min(2),
  // Set on a screen that teaches how to answer with this interaction (a
  // sentence saying what to tap plus a demo picture).
  guide: GuidedInteractionSchema.optional(),
});

// A screen of a section: one block, or a group of blocks.
export const SectionBlockSchema = z.discriminatedUnion("type", [
  ...BlockSchema.options,
  GroupBlockSchema,
  TipBlockSchema,
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

// Why the answer is right, shown after the child answers (a correct answer,
// or the answer revealed after the last wrong check or a skip). Short: the
// reasoning in the lesson's own words, with the formula or picture that
// carries it. An exercise without one shows its solution visual and accepted
// answer instead (`src/exercises/explanation.ts`).
export const ExplanationSchema = z.object({
  text: TextSchema,
  tex: TextSchema.optional(),
  visualId: VisualIdSchema.optional(),
  // `choice` only: why a tempting wrong option is wrong, one short reason
  // per option, shown under the explanation next to that option.
  wrong: z
    .array(z.object({ optionId: LocalIdSchema, text: TextSchema }))
    .optional(),
});

const exerciseBase = {
  id: ExerciseIdSchema,
  cardIds: z.array(CardIdSchema),
  prompt: z.array(BlockSchema).min(1),
  hints: HintsSchema,
  explain: ExplanationSchema.optional(),
  difficulty: z.int().min(1).max(3),
};

// How the content lint verifies a choice from the values of its options:
// - equal (default): the answers are exactly the options equal to `expr`;
// - notEqual: the answers are exactly the options not equal to `expr`
//   ("which result is wrong?");
// - max / min: the answers are the options with the largest / smallest value;
// - holds / fails: every option is a comparison such as "2^{3} = 8"; the
//   answers are exactly the true / false ones.
// Numeric exercises use `equal` only.
export const CHECK_RELATIONS = [
  "equal",
  "notEqual",
  "max",
  "min",
  "holds",
  "fails",
] as const;
export const CheckRelationSchema = z.enum(CHECK_RELATIONS);
export const RELATIONS_WITH_EXPR: readonly CheckRelation[] = [
  "equal",
  "notEqual",
];

// Expression the content lint recomputes to verify the stated answer.
export const CheckSchema = z
  .object({
    expr: TextSchema.optional(),
    relation: CheckRelationSchema.optional(),
  })
  .refine(
    (check) =>
      RELATIONS_WITH_EXPR.includes(check.relation ?? "equal") ===
      (check.expr !== undefined),
    {
      message:
        "check.expr is required for relation equal/notEqual and not allowed for max/min/holds/fails",
    },
  );

export const ChoiceExerciseSchema = z.object({
  ...exerciseBase,
  type: z.literal("choice"),
  // Any order; the UI shuffles them for every attempt.
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
// distractors. The left column shows in the listed order; the UI shuffles the
// right column for every attempt, so pairs may be listed side by side.
export const MatchExerciseSchema = z.object({
  ...exerciseBase,
  type: z.literal("match"),
  left: z.array(ItemSchema).min(2),
  right: z.array(ItemSchema).min(2),
  pairs: z.array(z.object({ left: LocalIdSchema, right: LocalIdSchema })),
});

// Items are listed in the correct order; the UI shuffles them for every
// attempt.
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
  // Present: the child picks words from this bank, which the UI shuffles for
  // every attempt; absent: the child types.
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
  blocks: z.array(SectionBlockSchema).min(1),
  // Comprehension checks: graded but never rated.
  checkIds: z.array(ExerciseIdSchema).min(1),
  // First encounter of each card; these answers are rated.
  practiceIds: z.array(ExerciseIdSchema),
  recap: RecapBlockSchema,
});

// A file in the media store, written as a path under the media base URL
// (`MEDIA_BASE_URL`): files are served from public/media until the media
// bucket goes live, and switching to the bucket then changes config only.
export const MediaPathSchema = z
  .string()
  .regex(
    /^[a-z0-9-]+(?:\/[a-z0-9-]+)*\.[a-z0-9]+$/,
    'Expected a path under the media base, like "video/<lesson>/<name>.mp4"',
  );

// The voice that read a video or an overview narration, as the engine named
// it (`video/tts/types.ts`).
const SpokenVoiceSchema = z.object({
  engine: TextSchema,
  voiceName: TextSchema,
  model: TextSchema,
});

export const VideoSchema = z.object({
  id: VideoIdSchema,
  lessonId: LessonIdSchema,
  url: MediaPathSchema,
  // WebVTT captions, one timestamp per word so the player can highlight the
  // word being spoken (`src/lib/karaoke-vtt.ts`).
  vttUrl: MediaPathSchema,
  // A still frame shown before playback; iPad Safari draws nothing otherwise.
  posterUrl: MediaPathSchema,
  durationSec: z.number().positive(),
  clips: z.array(
    z.object({
      id: LocalIdSchema,
      start: z.number().nonnegative(),
      end: z.number().positive(),
      cardIds: z.array(CardIdSchema),
    }),
  ),
  voice: SpokenVoiceSchema,
  // Moments where the player pauses by itself and waits for the child
  // ("Tiếp" to go on, "Xem lại đoạn này" to see the part again). Written by
  // `pnpm video:build` from the script's checkpoint sentences; a video
  // without them plays straight through.
  checkpoints: z
    .array(
      z.object({
        id: LocalIdSchema,
        // Where the player stops, in seconds into the video.
        at: z.number().positive(),
        // Where "Xem lại đoạn này" restarts: the previous checkpoint's
        // resume point (0 for the first).
        from: z.number().nonnegative(),
      }),
    )
    .optional(),
});

// What a child sees before the first section: why the lesson is worth their
// time, in words from everyday life rather than the textbook's.
export const LessonOverviewSchema = z.object({
  // Opens the overview: an everyday situation the lesson explains, or for a
  // literature lesson a teaser of the story.
  hook: z.object({
    text: TextSchema,
    visualId: VisualIdSchema.optional(),
  }),
  // Literature: the story in 3–5 short sentences; other subjects: what the
  // lesson covers.
  summary: TextSchema,
  // Each item completes the lead-in "Học xong bài này, bạn sẽ:" that the
  // screen prints (`OVERVIEW_GOALS_LEAD`), e.g. "biết lũy thừa là gì".
  goals: z.array(TextSchema).min(2).max(4),
  // One sentence of real value the lesson brings.
  whyItMatters: TextSchema,
  // A human-like reading of the overview (`pnpm narration:build`), with
  // one WebVTT timestamp per word so the screen highlights the word being
  // read (`src/lib/karaoke-vtt.ts`). `voice` is the one voice that read all of
  // it; narrations made before it was recorded have none.
  narration: z
    .object({
      audioUrl: MediaPathSchema,
      vttUrl: MediaPathSchema,
      voice: SpokenVoiceSchema.optional(),
    })
    .optional(),
});

export const LESSON_STATUSES = ["draft", "published"] as const;

// The chapter of the textbook a lesson belongs to, as the book prints it:
// "I" (or "1") and "Tập hợp các số tự nhiên". Left out when the book has no
// chapters.
export const LessonChapterSchema = z.object({
  numeral: TextSchema,
  name: TextSchema,
});

// Where the lesson sits in the book, for a parent looking it up: its number
// inside the book ("Bài 4") and its chapter. Both stay out when the book
// prints none.
const lessonPlacement = {
  number: z.int().positive().optional(),
  chapter: LessonChapterSchema.optional(),
};

export const LessonSchema = z.object({
  id: LessonIdSchema,
  subject: LessonIdSchema,
  series: LessonIdSchema,
  grade: z.literal(6),
  order: z.int().nonnegative(),
  ...lessonPlacement,
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
  overview: LessonOverviewSchema.optional(),
});

// `content/legacy-lessons.json`: lessons written before rules that every new
// lesson must follow (an explanation on every exercise, an overview). A lesson
// not listed is new and meets every rule. A listed lesson is held to the
// older, looser rules:
// - "exempt": the new rules do not apply (it may never be given an
//   explanation, and shows its solution visual and accepted answer instead);
// - "warn": the explanations are being written; the lint reports the missing
//   ones as one warning per lesson. Delete the entry when they are done and
//   the lesson then fails the lint for any exercise without one.
// Never add a lesson to the list to silence the lint.
export const LEGACY_LEVELS = ["exempt", "warn"] as const;
export const LegacyLevelSchema = z.enum(LEGACY_LEVELS);
export const LegacyLessonsSchema = z.object({
  lessons: z.record(LessonIdSchema, LegacyLevelSchema),
});

export const IdsLockSchema = z.object({
  ids: z.array(z.string().min(1)),
  // Retired id -> replacement id, or null when the entity was dropped for good.
  retired: z.record(z.string().min(1), z.string().min(1).nullable()),
});

// `content/<subject>/<series>/<slug>/tips.json`: tips of a lesson kept apart
// from lesson.json, so a published lesson gains tips without a new review of
// the lesson. The file has its own review: `reviewedHash` covers `tips` and
// `lessonId`.
export const TipsFileSchema = z.object({
  lessonId: LessonIdSchema,
  status: z.enum(LESSON_STATUSES),
  reviewedHash: z
    .string()
    .regex(/^[0-9a-f]{64}$/, "Expected a sha256 hex digest")
    .optional(),
  tips: z.array(TipSchema).min(1),
});

// What the app fetches for a lesson's "Mẹo hay" page
// (`/content/<lessonId>.tips.json`): the tips of the lesson's sections, in
// section order, then those of `tips.json`.
export const LessonTipsSchema = z.object({
  lessonId: LessonIdSchema,
  tips: z.array(TipSchema).min(1),
});

// `content/glossary/<subject>.json`: the one accepted word for each concept of
// a subject, and the colour every lesson must give that concept.
// School stages before grade 6 whose knowledge a lesson may teach as background
// when the SGK pages do not define it (see `prerequisite` below).
export const PREREQUISITE_LEVELS = ["tiểu học"] as const;

export const GlossaryTermSchema = z.object({
  term: TextSchema,
  // Non-standard synonyms the content lint rejects in favour of `term`.
  forbidden: z.array(TextSchema),
  color: ConceptColorSchema.optional(),
  // The term was taught at this earlier stage. A section or card that teaches
  // it without an SGK page says so in its `sourceRef` ("Kiến thức nền
  // (tiểu học); câu 5 tr.26"); the content lint accepts that marker only for
  // sections and cards covering a term marked with the same stage.
  prerequisite: z.enum(PREREQUISITE_LEVELS).optional(),
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
  ...lessonPlacement,
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
  // Tips on the lesson's "Mẹo hay" page; none (or absent) hides the page's
  // entry point.
  tipCount: z.int().nonnegative().optional(),
  // The lesson opens with an overview, so home leads a child who has not
  // seen it there before the first section.
  hasOverview: z.boolean(),
  // Shown on home, earned or greyed, without loading the whole lesson.
  sticker: LessonSchema.shape.sticker,
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
export type Tip = z.infer<typeof TipSchema>;
export type TipKind = z.infer<typeof TipKindSchema>;
export type TipBlock = z.infer<typeof TipBlockSchema>;
export type TipsFile = z.infer<typeof TipsFileSchema>;
export type LessonTips = z.infer<typeof LessonTipsSchema>;
export type Explanation = z.infer<typeof ExplanationSchema>;
export type NoteBlock = z.infer<typeof NoteBlockSchema>;
export type GroupBlock = z.infer<typeof GroupBlockSchema>;
export type SectionBlock = z.infer<typeof SectionBlockSchema>;
export type RecapBlock = z.infer<typeof RecapBlockSchema>;
export type PassageBlock = z.infer<typeof PassageBlockSchema>;
export type FormulaBlock = z.infer<typeof FormulaBlockSchema>;
export type Item = z.infer<typeof ItemSchema>;
export type CheckRelation = z.infer<typeof CheckRelationSchema>;
export type GuidedInteraction = z.infer<typeof GuidedInteractionSchema>;
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
export type LessonOverview = z.infer<typeof LessonOverviewSchema>;
export type LessonChapter = z.infer<typeof LessonChapterSchema>;
export type Lesson = z.infer<typeof LessonSchema>;
export type LessonStatus = Lesson["status"];
export type LegacyLevel = z.infer<typeof LegacyLevelSchema>;
export type LegacyLessons = z.infer<typeof LegacyLessonsSchema>;
export type IdsLock = z.infer<typeof IdsLockSchema>;
export type GlossaryTerm = z.infer<typeof GlossaryTermSchema>;
export type GlossaryFile = z.infer<typeof GlossaryFileSchema>;
