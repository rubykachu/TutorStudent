import { describe, expect, it } from "vitest";
import { docHash, hashText } from "@/sync/hash";
import { emptyChildDoc } from "@/sync/schema";
import { at, CHILD, FAMILY } from "./generators";

describe("hashText", () => {
  it("matches the published cyrb53 values, so it is stable across runs", () => {
    expect(hashText("")).toBe("0bdcb81aee8d83");
    expect(hashText("a")).toBe("1c2ba782c97901");
    expect(hashText("tutor")).toBe("019a56fe1ed78a");
    expect(hashText("Mình muốn có một người bạn.")).toBe("133988d4f0742a");
  });

  it("is 14 hex characters and differs for different text", () => {
    expect(hashText("x")).toMatch(/^[0-9a-f]{14}$/);
    expect(hashText("x")).not.toBe(hashText("y"));
  });
});

describe("docHash", () => {
  it("is the same for the same doc whatever the order of its arrays", () => {
    const base = emptyChildDoc(FAMILY, CHILD);
    const a = {
      ...base,
      activityDays: ["2026-10-01", "2026-10-02"],
      historyMonths: ["2026-09", "2026-10"],
      stickers: [
        { lessonId: "l-one", at: at(1) },
        { lessonId: "l-two", at: at(2) },
      ],
    };
    const b = {
      ...base,
      stickers: [...a.stickers].reverse(),
      historyMonths: [...a.historyMonths].reverse(),
      activityDays: [...a.activityDays].reverse(),
    };
    expect(docHash("child", a)).toBe(docHash("child", b));
  });

  it("changes when the data changes", () => {
    const base = emptyChildDoc(FAMILY, CHILD);
    expect(docHash("child", base)).not.toBe(
      docHash("child", { ...base, resets: { "l-one": at(1) } }),
    );
  });
});
