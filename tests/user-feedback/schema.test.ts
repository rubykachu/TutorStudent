import { describe, expect, it } from "vitest";
import {
  createdAtInWindow,
  FeedbackRequestSchema,
  feedbackMonth,
} from "@/user-feedback/schema";
import { childReport, parentReport } from "./fixtures";

const ok = (value: unknown) => FeedbackRequestSchema.safeParse(value).success;

describe("FeedbackRequestSchema", () => {
  it("accepts the full parent example and a child report", () => {
    expect(ok(parentReport())).toBe(true);
    expect(ok(childReport())).toBe(true);
    expect(ok(parentReport({ note: "" }))).toBe(true);
  });

  it("refuses each broken field", () => {
    const bad: unknown[] = [
      { ...parentReport(), extra: 1 },
      { ...childReport(), note: "xin chào" },
      parentReport({ section: "khac.section.a" }),
      parentReport({ item: "khac.ex.a" }),
      parentReport({ section: null, sectionTitle: null }),
      parentReport({ sectionNumber: null }),
      parentReport({ sectionTitle: null }),
      parentReport({ id: "9F0C2A7BE1D04C58A6B7F0E2C4D91A35" }),
      parentReport({ id: "abc" }),
      parentReport({ note: "a".repeat(501) }),
      parentReport({ subject: "physics" }),
      parentReport({ grade: 13 }),
      parentReport({ step: "quiz-1" }),
      parentReport({ step: "check-1000" }),
      parentReport({ item: "luy-thua.visual.a" }),
      parentReport({ screen: "home" as never }),
      parentReport({ reason: "khac" as never }),
      parentReport({ source: "admin" as never }),
      parentReport({ device: { kind: "tv", os: "ios" } as never }),
      parentReport({ lessonTitle: "" }),
      parentReport({ lessonTitle: "x".repeat(121) }),
      parentReport({ createdAt: "yesterday" }),
    ];
    for (const value of bad)
      expect(ok(value), JSON.stringify(value)).toBe(false);
  });

  it("counts the note after NFC", () => {
    const decomposed = "ệ".normalize("NFD").repeat(300);
    expect(decomposed.length).toBeGreaterThan(500);
    expect(ok(parentReport({ note: decomposed }))).toBe(true);
  });
});

describe("createdAtInWindow", () => {
  const now = new Date("2026-10-10T00:00:00.000Z");
  it("refuses a report 9 days old or more than 10 minutes ahead", () => {
    expect(createdAtInWindow("2026-10-01T00:00:00.000Z", now)).toBe(false);
    expect(createdAtInWindow("2026-10-10T00:10:01.000Z", now)).toBe(false);
    expect(createdAtInWindow("2026-10-02T00:00:01.000Z", now)).toBe(true);
    expect(createdAtInWindow("2026-10-10T00:10:00.000Z", now)).toBe(true);
  });
});

describe("feedbackMonth", () => {
  it("is the Vietnam month", () => {
    expect(feedbackMonth("2026-09-30T17:30:00.000Z")).toBe("2026-10");
    expect(feedbackMonth("2026-09-30T16:30:00.000Z")).toBe("2026-09");
  });
});
