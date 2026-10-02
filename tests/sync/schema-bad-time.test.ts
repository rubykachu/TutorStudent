import { describe, expect, it } from "vitest";
import { emptyHistoryDoc, migrateDoc } from "@/sync/schema";

const CHILD = "3f9c2a7be1d04c58a6b7f0e2c4d91a35";

describe("history doc with a time that is not a time", () => {
  it("is reported as invalid instead of throwing", () => {
    const doc = emptyHistoryDoc("nha-minh", CHILD, "2026-10");
    doc.attempts.push({
      id: "a1",
      exerciseId: "l.ex.a",
      lessonId: "l",
      cardIds: [],
      firstTryCorrect: true,
      wrongCount: 0,
      at: "garbage",
      context: "practice",
    });
    expect(migrateDoc("history", doc)).toMatchObject({
      ok: false,
      reason: "invalid",
    });
  });
});
