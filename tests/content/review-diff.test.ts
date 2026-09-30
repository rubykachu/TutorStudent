import { describe, expect, it } from "vitest";
import { diffLessons, formatDiff } from "@/content/review-diff";
import { readSkeleton } from "./helpers";

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));
// biome-ignore lint/suspicious/noExplicitAny: raw lesson JSON edited in place
type Raw = any;

describe("diffLessons", () => {
  const before: Raw = readSkeleton();

  it("reports nothing for the same content, ignoring review fields", () => {
    const after = clone(before);
    after.status = "published";
    after.reviewedHash = "a".repeat(64);
    expect(diffLessons(before, after).entries).toEqual([]);
    expect(formatDiff(diffLessons(before, after))).toContain("No change");
  });

  it("lists changed, added and removed items by id with their text", () => {
    const after = clone(before);
    const section = after.sections[0];
    section.recap.caption = "Câu nhớ mới.";
    after.exercises[0].prompt[0].text = "Đề mới.";
    after.exercises.push({
      ...clone(after.exercises[1]),
      id: "bai-moi.ex.moi",
    });
    const removed = after.cards.pop();

    const { entries, sections } = diffLessons(before, after);
    const units = entries.map((e) => `${e.kind} ${e.unit}`);
    expect(units).toContain(`changed section ${section.id} recap`);
    expect(units).toContain(`changed exercise ${before.exercises[0].id}`);
    expect(units).toContain("added exercise bai-moi.ex.moi");
    expect(units).toContain(`removed card ${removed.id}`);

    const recap = entries.find((e) => e.unit.endsWith("recap"));
    expect(recap?.before).toEqual([
      ["caption", before.sections[0].recap.caption],
    ]);
    expect(recap?.after).toEqual([["caption", "Câu nhớ mới."]]);
    expect(sections.map((s) => s.id)).toEqual([section.id]);
  });

  it("aligns blocks by content, so an inserted block does not shift the rest", () => {
    const after = clone(before);
    const id = after.sections[0].id;
    after.sections[0].blocks.unshift({
      type: "video",
      videoId: "bai-moi.video.gioi-thieu",
    });
    after.sections[0].blocks[2].children[0].text = "Quy tắc mới.";

    const units = diffLessons(before, after).entries.map(
      (e) => `${e.kind} ${e.unit}`,
    );
    expect(units).toEqual([
      `added section ${id} blocks[0]`,
      `changed section ${id} blocks[2]`,
    ]);
  });

  it("maps a changed review-bank exercise to the sections practising its card", () => {
    const after = clone(before);
    const listed = new Set(
      before.sections.flatMap((s: Raw) => [...s.checkIds, ...s.practiceIds]),
    );
    const bank = after.exercises.find((e: Raw) => !listed.has(e.id));
    expect(bank).toBeDefined();
    bank.difficulty = 3;
    expect(diffLessons(before, after).sections.map((s) => s.id)).toEqual([
      before.sections[0].id,
    ]);
  });
});
