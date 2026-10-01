// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  cardClip,
  exercisesForCard,
  findExercise,
  flattenExercises,
  indexLesson,
  isServed,
  lessonContentFile,
  lessonContentUrl,
  practiceExerciseIds,
  summarizeLesson,
} from "@/content/index";
import { type Lesson, LessonSchema } from "@/schema/content";
import { fixtureContent, fixtureFile } from "./helpers";

function fixtureLesson(): Lesson {
  return LessonSchema.parse(fixtureFile(fixtureContent()).data);
}

describe("flattenExercises", () => {
  it("lists openEnded steps after their parent with a path and parentId", () => {
    const entries = flattenExercises(fixtureLesson());
    const step = entries.find(
      (e) => e.exercise.id === "fixture.ex.chon-y-chinh",
    );
    expect(step).toMatchObject({
      parentId: "fixture.ex.viet-ve-ban",
      path: ["exercises", 10, "steps", 0],
    });
    expect(entries).toHaveLength(13);
  });
});

describe("indexLesson", () => {
  const index = indexLesson(fixtureLesson());

  it("maps each card to the exercises that declare it, in lesson order", () => {
    expect(index.exerciseIdsByCard.get("fixture.card.nhan-lap")).toEqual([
      "fixture.ex.dem-cham",
      "fixture.ex.ghep-phep-nhan",
      "fixture.ex.tao-sau-cham",
    ]);
    expect(index.exerciseIdsByCard.get("fixture.card.doc-hieu")).toEqual([
      "fixture.ex.dien-tu",
      "fixture.ex.cham-cau",
      "fixture.ex.chon-y-chinh",
    ]);
  });

  it("resolves exercises for a card and ignores unknown cards", () => {
    expect(
      exercisesForCard(index, "fixture.card.luy-thua").map((e) => e.type),
    ).toEqual(["numeric", "order", "choice"]);
    expect(exercisesForCard(index, "fixture.card.da-xoa")).toEqual([]);
  });

  it("finds top-level exercises and steps, and nothing for stale ids", () => {
    expect(findExercise(index, "fixture.ex.chon-y-chinh")?.type).toBe("choice");
    expect(findExercise(index, "fixture.ex.dem-cham")?.type).toBe("numeric");
    expect(findExercise(index, "fixture.ex.da-xoa")).toBeUndefined();
  });

  it("indexes cards, sections and concepts by id", () => {
    expect(
      index.cardById.get("fixture.card.luy-thua")?.conceptIds,
    ).toHaveLength(2);
    expect(index.sectionById.get("fixture.section.doc-hieu")?.minutes).toBe(8);
    expect(index.conceptById.get("fixture.concept.so-mu")?.color).toBe(
      "violet",
    );
  });
});

describe("practiceExerciseIds", () => {
  it("includes the steps of a practiced openEnded exercise", () => {
    const ids = practiceExerciseIds(fixtureLesson());
    expect(ids).toContain("fixture.ex.viet-ve-ban");
    expect(ids).toContain("fixture.ex.chon-y-chinh");
    expect(ids).not.toContain("fixture.ex.chon-phep-nhan");
  });
});

describe("isServed", () => {
  it("serves published real lessons, and the fixture only on opt-in", () => {
    expect(isServed({ status: "published" }, false, false)).toBe(true);
    expect(isServed({ status: "draft" }, false, true)).toBe(false);
    expect(isServed({ status: "draft" }, true, true)).toBe(true);
    expect(isServed({ status: "published" }, true, false)).toBe(false);
  });
});

describe("summarizeLesson", () => {
  it("keeps what the lesson list needs and drops exercise content", () => {
    expect(summarizeLesson(fixtureLesson())).toEqual({
      id: "fixture",
      subject: "math",
      series: "kntt",
      order: 0,
      title: "Bài mẫu: phép nhân và đọc hiểu",
      sourceRef: "Bài mẫu kiểm thử",
      tipCount: 1,
      sections: [
        {
          id: "fixture.section.phep-nhan",
          title: "Phép nhân là phép cộng lặp lại",
          minutes: 8,
        },
        {
          id: "fixture.section.doc-hieu",
          title: "Đọc một đoạn văn ngắn",
          minutes: 8,
        },
      ],
      cardCount: 3,
      hasOverview: true,
      sticker: {
        name: "Ngôi sao chăm chỉ",
        visualId: "fixture.visual.star-sticker",
      },
    });
  });
});

describe("lessonContentUrl", () => {
  it("points at the emitted lesson file", () => {
    expect(lessonContentFile("fixture")).toBe("fixture.json");
    expect(lessonContentUrl("fixture")).toBe("/content/fixture.json");
  });
});

describe("cardClip", () => {
  const video = {
    id: "fixture.video.gioi-thieu",
    lessonId: "fixture",
    url: "video/fixture/gioi-thieu.mp4",
    vttUrl: "video/fixture/gioi-thieu.vtt",
    posterUrl: "video/fixture/gioi-thieu.jpg",
    durationSec: 60,
    clips: [
      { id: "mo-dau", start: 0, end: 20, cardIds: ["fixture.card.nhan-lap"] },
      { id: "tiep", start: 20, end: 50, cardIds: ["fixture.card.luy-thua"] },
    ],
    voice: { engine: "local", voiceName: "Hải Đăng", model: "vieneu" },
  };

  it("finds the clip that explains a card", () => {
    expect(
      cardClip({ videos: [video] }, "fixture.card.luy-thua")?.clip.id,
    ).toBe("tiep");
  });

  it("finds nothing for a card without a clip or a lesson without videos", () => {
    expect(cardClip({ videos: [video] }, "fixture.card.khac")).toBeUndefined();
    expect(cardClip({}, "fixture.card.nhan-lap")).toBeUndefined();
  });
});
