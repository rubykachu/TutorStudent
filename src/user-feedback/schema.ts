import { z } from "zod";
import {
  FEEDBACK_NOTE_MAX_CHARS,
  FEEDBACK_OUTBOX_MAX_AGE_DAYS,
  FEEDBACK_PENDING_MAX,
  SYNC_FUTURE_SKEW_MINUTES,
} from "@/lib/config";
import { vnDayKey } from "@/lib/time";
import { SECTION_PHASES } from "@/progress/enums";
import {
  CardIdSchema,
  ExerciseIdSchema,
  GRADES,
  LessonIdSchema,
  SectionIdSchema,
  TipIdSchema,
  VideoIdSchema,
} from "@/schema/content";
import { MONTH_PATTERN } from "@/sync/schema";
import subjectsFile from "../../content/subjects.json";

// The shapes of one feedback report: what the device sends to
// `POST /api/feedback`, the record the server keeps in the progress bucket and
// the list of reports not yet forwarded to GitHub. Shared by the device
// outbox, the route and the forwarding pass.

export const FEEDBACK_REASONS = [
  "kho-hieu",
  "sai-noi-dung",
  "loi-hinh-video",
  "dai-chan",
  "thich",
] as const;
export type FeedbackReason = (typeof FEEDBACK_REASONS)[number];

// `be`: the child's quick chips; `phu-huynh`: the parent form behind the PIN.
// A claim of the device: it only picks a label and never grants anything.
export const FEEDBACK_SOURCES = ["be", "phu-huynh"] as const;
export type FeedbackSource = (typeof FEEDBACK_SOURCES)[number];

// The screen a report was sent from.
export const FEEDBACK_SCREENS = [
  "lesson",
  "overview",
  "tips",
  "block",
  "exercise",
  "recap",
  "done",
  "review",
] as const;
export type FeedbackScreen = (typeof FEEDBACK_SCREENS)[number];

export const DEVICE_KINDS = ["ipad", "phone", "desktop"] as const;
export const DEVICE_OSES = [
  "ios",
  "android",
  "macos",
  "windows",
  "other",
] as const;
export const DeviceClassSchema = z
  .object({ kind: z.enum(DEVICE_KINDS), os: z.enum(DEVICE_OSES) })
  .strict();
export type DeviceClass = z.infer<typeof DeviceClassSchema>;

// A report id: 32 hex digits, the format of `newId()`.
export const FEEDBACK_ID_PATTERN = /^[0-9a-f]{32}$/;
// `<phase>-<index>`: where in a section's steps the report was sent.
export const FEEDBACK_STEP_PATTERN = new RegExp(
  `^(${SECTION_PHASES.join("|")})-(0|[1-9]\\d{0,2})$`,
);

export const FEEDBACK_SUBJECTS: readonly string[] = subjectsFile.subjects.map(
  (subject) => subject.id,
);

const ItemIdSchema = z.union([
  CardIdSchema,
  ExerciseIdSchema,
  VideoIdSchema,
  TipIdSchema,
]);
const TitleSchema = z.string().min(1).max(120);

export const FeedbackRequestSchema = z
  .object({
    id: z.string().regex(FEEDBACK_ID_PATTERN),
    lesson: LessonIdSchema.max(80),
    lessonTitle: TitleSchema,
    subject: z
      .string()
      .refine((value) => FEEDBACK_SUBJECTS.includes(value), "unknown subject"),
    grade: z.int().refine((value) => GRADES.includes(value), "unknown grade"),
    section: SectionIdSchema.max(160).nullable(),
    sectionNumber: z.int().min(1).max(99).nullable(),
    sectionTitle: TitleSchema.nullable(),
    item: ItemIdSchema.refine((value) => value.length <= 160).nullable(),
    step: z.string().regex(FEEDBACK_STEP_PATTERN).nullable(),
    screen: z.enum(FEEDBACK_SCREENS),
    reason: z.enum(FEEDBACK_REASONS),
    source: z.enum(FEEDBACK_SOURCES),
    note: z
      .string()
      .max(FEEDBACK_NOTE_MAX_CHARS * 2)
      .optional(),
    device: DeviceClassSchema,
    createdAt: z.iso.datetime(),
  })
  .strict()
  .superRefine((report, ctx) => {
    const issue = (message: string) =>
      ctx.addIssue({ code: "custom", message });
    const inLesson = (id: string | null) =>
      id === null || id.startsWith(`${report.lesson}.`);
    if (!inLesson(report.section)) issue("section of another lesson");
    if (!inLesson(report.item)) issue("item of another lesson");
    if ((report.section === null) !== (report.sectionNumber === null)) {
      issue("sectionNumber goes with section");
    }
    if (report.section === null && report.sectionTitle !== null) {
      issue("sectionTitle goes with section");
    }
    if (report.note !== undefined && report.note !== "") {
      if (report.source !== "phu-huynh") issue("a note is for the parent");
      if (report.note.normalize("NFC").length > FEEDBACK_NOTE_MAX_CHARS) {
        issue("note too long");
      }
    }
  });
export type FeedbackRequest = z.infer<typeof FeedbackRequestSchema>;

const DAY_MS = 86_400_000;

// Whether a report's `createdAt` is plausible on the server's clock: not older
// than the outbox keeps a report (plus a day), not further ahead than the sync
// clock skew.
export function createdAtInWindow(createdAt: string, now: Date): boolean {
  const at = Date.parse(createdAt);
  if (!Number.isFinite(at)) return false;
  const nowMs = now.getTime();
  return (
    at >= nowMs - (FEEDBACK_OUTBOX_MAX_AGE_DAYS + 1) * DAY_MS &&
    at <= nowMs + SYNC_FUTURE_SKEW_MINUTES * 60_000
  );
}

// The Vietnam month (`yyyy-mm`) that places a report's record: from its own
// `createdAt`, so a retry across a month boundary finds the same key.
export function feedbackMonth(createdAt: string): string {
  return vnDayKey(new Date(createdAt)).slice(0, 7);
}

export const FORWARD_STATES = ["pending", "sending", "sent", "failed"] as const;
export type ForwardState = (typeof FORWARD_STATES)[number];

// Short codes of why a forward failed: never a message or a body.
export const FORWARD_ERRORS = [
  "no-token",
  "github-401",
  "github-403",
  "github-rate",
  "github-422",
  "github-5xx",
  "github-other",
  "timeout",
  "labels",
] as const;
export type ForwardError = (typeof FORWARD_ERRORS)[number];

export const ForwardSchema = z
  .object({
    state: z.enum(FORWARD_STATES),
    attempts: z.int().min(0),
    claimedAt: z.string().nullable(),
    lastError: z.enum(FORWARD_ERRORS).nullable(),
    issue: z.int().positive().nullable(),
    url: z.string().nullable(),
  })
  .strict();
export type Forward = z.infer<typeof ForwardSchema>;

// The stored report. `report` is the validated request with the note already
// sanitized; `family` is the household pseudonym, never the family id.
export const FeedbackRecordSchema = z
  .object({
    schema: z.literal("feedback"),
    version: z.literal(1),
    id: z.string().regex(FEEDBACK_ID_PATTERN),
    receivedAt: z.string(),
    family: z.string().regex(/^[0-9a-f]{12}$/),
    app: z.string().min(1).max(40),
    report: FeedbackRequestSchema,
    forward: ForwardSchema,
  })
  .strict();
export type FeedbackRecord = z.infer<typeof FeedbackRecordSchema>;

export const PendingItemSchema = z
  .object({
    id: z.string().regex(FEEDBACK_ID_PATTERN),
    month: z.string().regex(MONTH_PATTERN),
  })
  .strict();
export type PendingItem = z.infer<typeof PendingItemSchema>;

export const PendingListSchema = z
  .object({
    schema: z.literal("feedback-pending"),
    version: z.literal(1),
    items: z.array(PendingItemSchema).max(FEEDBACK_PENDING_MAX),
  })
  .strict();
export type PendingList = z.infer<typeof PendingListSchema>;
