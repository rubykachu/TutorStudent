import { describe, expect, it } from "vitest";
import {
  lessonHeading,
  lessonPlacement,
  sectionHeading,
  subjectHeading,
} from "@/lib/lesson-label";

const chapter = { numeral: "I", name: "Tập hợp các số tự nhiên" };

describe("lesson labels", () => {
  it("names the chapter and lesson as the textbook numbers them", () => {
    expect(lessonPlacement({ number: 4, chapter })).toBe("Chương I · Bài 4");
    expect(lessonPlacement({ number: 4 })).toBe("Bài 4");
    expect(lessonPlacement({ chapter })).toBe("Chương I");
    expect(lessonPlacement({})).toBeUndefined();
  });

  it("puts the lesson number before its title", () => {
    expect(lessonHeading({ number: 4, title: "Phép cộng" })).toBe(
      "Bài 4: Phép cộng",
    );
    expect(lessonHeading({ title: "Phép cộng" })).toBe("Phép cộng");
  });

  it("numbers a section from 1 and names the subject", () => {
    expect(sectionHeading(2, "Nhân, chia trước")).toBe(
      "Phần 3: Nhân, chia trước",
    );
    expect(subjectHeading("Toán")).toBe("Môn: Toán");
  });
});
