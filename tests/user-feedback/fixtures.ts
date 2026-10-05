import type { FeedbackRequest } from "@/user-feedback/schema";

// A full valid parent report, the example of the request contract.
export function parentReport(
  overrides: Partial<FeedbackRequest> = {},
): FeedbackRequest {
  return {
    id: "9f0c2a7be1d04c58a6b7f0e2c4d91a35",
    lesson: "luy-thua",
    lessonTitle: "Bài 6. Lũy thừa với số mũ tự nhiên",
    subject: "math",
    grade: 6,
    section: "luy-thua.section.nhan-hai-luy-thua",
    sectionNumber: 3,
    sectionTitle: "Nhân hai lũy thừa cùng cơ số",
    item: "luy-thua.ex.tinh-nhanh",
    step: "check-2",
    screen: "exercise",
    reason: "sai-noi-dung",
    source: "phu-huynh",
    note: "Đáp án câu b in sai dấu",
    device: { kind: "ipad", os: "ios" },
    createdAt: "2026-10-05T13:15:00.000Z",
    ...overrides,
  };
}

// A child's report from the lesson page: no section, item, step or note.
export function childReport(
  overrides: Partial<FeedbackRequest> = {},
): FeedbackRequest {
  const { note: _note, ...rest } = parentReport({
    section: null,
    sectionNumber: null,
    sectionTitle: null,
    item: null,
    step: null,
    screen: "lesson",
    reason: "thich",
    source: "be",
    device: { kind: "phone", os: "android" },
    ...overrides,
  });
  return rest;
}
