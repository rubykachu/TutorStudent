import { createHash } from "node:crypto";
import { TIMEZONE } from "@/lib/config";
import {
  deviceLabel,
  REASON_LABELS,
  SCREEN_LABELS,
  SOURCE_LABELS,
} from "./labels";
import { commentJson, plainText } from "./sanitize";
import type { FeedbackRecord } from "./schema";

// The GitHub issue of one stored report: title, labels and body. Built only
// from the validated record: ids and enums as they are, the titles through
// `plainText`, the note (already `noteText`) inside a fence.

export const ISSUE_TITLE_MAX = 256;
// GitHub refuses a label name longer than this.
export const LABEL_MAX = 50;
const TITLE_MAX = 120;

// Colours of the labels the server creates on first use, by prefix. The
// fixed labels (`feedback`, `nguon:*`, `ly-do:*`, `trang-thai:*`) were
// created with the repo.
export const CREATED_LABEL_COLORS: Record<string, string> = {
  "bai:": "F9D0C4",
  "mon:": "BFDADC",
  "lop:": "D4C5F9",
};

// `bai:<slug>`, or, for a slug too long for a label, its first 39 characters
// and 6 hex of its SHA-256 (exactly 50 characters). The hidden block always
// has the full slug.
export function lessonLabel(slug: string): string {
  const label = `bai:${slug}`;
  if (label.length <= LABEL_MAX) return label;
  const hash = createHash("sha256").update(slug).digest("hex").slice(0, 6);
  return `bai:${slug.slice(0, LABEL_MAX - 4 - 7)}-${hash}`;
}

export function issueLabels(record: FeedbackRecord): string[] {
  const { report } = record;
  return [
    "feedback",
    `nguon:${report.source}`,
    `ly-do:${report.reason}`,
    lessonLabel(report.lesson),
    `mon:${report.subject}`,
    `lop:${report.grade}`,
    "trang-thai:moi",
  ];
}

function titles(record: FeedbackRecord) {
  const { report } = record;
  return {
    lesson: plainText(report.lessonTitle, TITLE_MAX) || report.lesson,
    section:
      report.sectionTitle === null
        ? null
        : plainText(report.sectionTitle, TITLE_MAX) || null,
  };
}

export function issueTitle(record: FeedbackRecord): string {
  const { report } = record;
  const head = `[Góp ý] ${REASON_LABELS[report.reason]} · `;
  const tail =
    report.sectionNumber === null ? "" : ` · Phần ${report.sectionNumber}`;
  const room = ISSUE_TITLE_MAX - head.length - tail.length;
  const lesson = Array.from(titles(record).lesson).slice(0, room).join("");
  return `${head}${lesson.trim()}${tail}`;
}

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: TIMEZONE,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

// `dd/mm/yyyy HH:mm` in Vietnam time.
function shownTime(iso: string): string {
  const parts = timeFormatter.formatToParts(new Date(iso));
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";
  return `${part("day")}/${part("month")}/${part("year")} ${part("hour")}:${part("minute")}`;
}

// The machine-readable copy of the report, for the triage loop. Every key is
// always present (null when unknown); `v` rises when the shape changes. The
// note is not in it: it stays in its fence.
export function hiddenData(record: FeedbackRecord) {
  const { report } = record;
  return {
    v: 1,
    id: record.id,
    lesson: report.lesson,
    section: report.section,
    item: report.item,
    step: report.step,
    screen: report.screen,
    reason: report.reason,
    source: report.source,
    app: record.app,
    device: report.device,
    family: record.family,
    at: record.receivedAt,
  };
}

export function issueBody(record: FeedbackRecord): string {
  const { report } = record;
  const shown = titles(record);
  const lines = [
    `**Lý do:** ${REASON_LABELS[report.reason]}`,
    `**Người gửi:** ${SOURCE_LABELS[report.source]}`,
    `**Bài:** ${shown.lesson} (\`${report.lesson}\`)`,
  ];
  if (report.section !== null) {
    const title = shown.section === null ? "" : ` ${shown.section}`;
    lines.push(
      `**Phần:** ${report.sectionNumber}.${title} (\`${report.section}\`)`,
    );
  }
  lines.push(
    report.item === null
      ? `**Câu / màn:** ${SCREEN_LABELS[report.screen]}`
      : `**Câu / màn:** ${SCREEN_LABELS[report.screen]} · \`${report.item}\``,
  );
  if (report.note) {
    lines.push("**Ghi chú:**", "```text", report.note, "```");
  }
  return [
    ...lines,
    "",
    `<sub>Gửi từ app bản \`${record.app}\` · ${deviceLabel(report.device)} · ${shownTime(record.receivedAt)}</sub>`,
    "",
    `<!-- feedback-data ${commentJson(hiddenData(record))} -->`,
    "",
  ].join("\n");
}
