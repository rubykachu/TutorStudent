// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  type CheckResult,
  checkContent,
  collectVisualRefs,
  formatIssue,
  formatPath,
  lessonStats,
} from "@/content/check";
import type { Lesson } from "@/schema/content";
import { visualRegistry } from "@/visuals/registry";
import {
  asRealLesson,
  exercise,
  exerciseIndex,
  fixtureContent,
  fixtureFile,
  lessonData,
} from "./helpers";

const LESSON_FILE = "content/_fixture/math/kntt/fixture/lesson.json";
const LOCK_FILE = "content/ids.lock.json";

function check(raw = fixtureContent()): CheckResult {
  return checkContent(raw, visualRegistry);
}

// "<file> <json path>: <message>" for every error, the form the CLI prints.
function errors(result: CheckResult): string[] {
  return result.issues
    .filter((issue) => issue.severity === "error")
    .map((issue) => formatIssue(issue).replace(/^error /, ""));
}

function expectError(result: CheckResult, location: string, message: string) {
  expect(errors(result)).toContainEqual(
    expect.stringMatching(
      new RegExp(`^${escapeRegExp(location)}: .*${escapeRegExp(message)}`),
    ),
  );
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

describe("checkContent on the fixture", () => {
  it("reports no issues", () => {
    const result = check();
    expect(result.issues).toEqual([]);
    expect(result.lessons.map((l) => l.lesson.id)).toEqual(["fixture"]);
  });

  it("does not require fixture ids in ids.lock.json", () => {
    const result = check();
    expect(result.issues.filter((i) => i.file === LOCK_FILE)).toEqual([]);
  });
});

describe("references", () => {
  it("reports an exercise pointing at a missing card", () => {
    const raw = fixtureContent();
    exercise(raw, "fixture.ex.dem-cham").cardIds = ["fixture.card.khong-co"];
    const i = exerciseIndex(raw, "fixture.ex.dem-cham");
    expectError(
      check(raw),
      `${LESSON_FILE} $.exercises[${i}].cardIds[0]`,
      'Unknown card "fixture.card.khong-co"',
    );
  });

  it("reports an openEnded step pointing at a missing card", () => {
    const raw = fixtureContent();
    const openEnded = exercise(raw, "fixture.ex.viet-ve-ban");
    const [step] = openEnded.steps as Record<string, unknown>[];
    if (!step) throw new Error("fixture openEnded has no step");
    step.cardIds = ["fixture.card.khong-co"];
    const i = exerciseIndex(raw, "fixture.ex.viet-ve-ban");
    expectError(
      check(raw),
      `${LESSON_FILE} $.exercises[${i}].steps[0].cardIds[0]`,
      "Unknown card",
    );
  });

  it("reports a section listing an unknown exercise", () => {
    const raw = fixtureContent();
    const [section] = lessonData(raw).sections;
    if (!section) throw new Error("no section");
    section.checkIds = ["fixture.ex.khong-co"];
    expectError(
      check(raw),
      `${LESSON_FILE} $.sections[0].checkIds[0]`,
      'Unknown top-level exercise "fixture.ex.khong-co"',
    );
  });

  it("reports an exercise placed twice across sections", () => {
    const raw = fixtureContent();
    const [first, second] = lessonData(raw).sections;
    if (!first || !second) throw new Error("fixture needs two sections");
    second.practiceIds = [
      ...(second.practiceIds as string[]),
      "fixture.ex.dem-cham",
    ];
    const last = (second.practiceIds as string[]).length - 1;
    expectError(
      check(raw),
      `${LESSON_FILE} $.sections[1].practiceIds[${last}]`,
      "is already placed at $.sections[0].practiceIds[0]",
    );
  });

  it("reports a card with an unknown concept", () => {
    const raw = fixtureContent();
    const [card] = lessonData(raw).cards;
    if (!card) throw new Error("no card");
    card.conceptIds = ["fixture.concept.khong-co"];
    expectError(
      check(raw),
      `${LESSON_FILE} $.cards[0].conceptIds[0]`,
      "Unknown concept",
    );
  });

  it("reports visual ids missing from the registry wherever they appear", () => {
    const raw = fixtureContent();
    const data = lessonData(raw);
    data.sticker = { name: "Sao", visualId: "fixture.visual.khong-co" };
    const hints = exercise(raw, "fixture.ex.dem-cham").hints as Record<
      string,
      unknown
    >;
    hints.solutionVisualId = "fixture.visual.khong-co";
    const i = exerciseIndex(raw, "fixture.ex.dem-cham");
    const result = check(raw);
    const message =
      'Visual "fixture.visual.khong-co" is not in the visual registry';
    expectError(result, `${LESSON_FILE} $.sticker.visualId`, message);
    expectError(
      result,
      `${LESSON_FILE} $.exercises[${i}].hints.solutionVisualId`,
      message,
    );
  });

  it("reports ids declared twice, within and across lessons", () => {
    const raw = fixtureContent();
    const [first, second] = lessonData(raw).cards;
    if (!first || !second) throw new Error("fixture needs two cards");
    second.id = first.id;
    expectError(check(raw), `${LESSON_FILE} $.cards[1].id`, "Duplicate id");

    const twice = fixtureContent();
    const copy = structuredClone(fixtureFile(twice));
    copy.file = "copy/lesson.json";
    twice.lessons.push(copy);
    expectError(
      check(twice),
      "copy/lesson.json $.id",
      `Id "fixture" is also declared in ${LESSON_FILE}`,
    );
  });

  it("reports ids that do not start with the lesson slug", () => {
    const raw = fixtureContent();
    const [card] = lessonData(raw).cards;
    if (!card) throw new Error("no card");
    card.id = "bai-khac.card.nhan-lap";
    expectError(
      check(raw),
      `${LESSON_FILE} $.cards[0].id`,
      'Id must start with "fixture."',
    );
  });

  it("reports a lesson outside <subject>/<series>/<id>/ or with an unknown subject", () => {
    const raw = fixtureContent();
    fixtureFile(raw).dir = ["_fixture", "math", "kntt", "sai-thu-muc"];
    expectError(
      check(raw),
      `${LESSON_FILE} $.id`,
      "Lesson must live in <root>/_fixture/math/kntt/fixture/",
    );

    const unknown = fixtureContent();
    lessonData(unknown).series = "ctst";
    expectError(
      check(unknown),
      `${LESSON_FILE} $.series`,
      'Subject "math" has no series "ctst"',
    );
    lessonData(unknown).subject = "history";
    expectError(
      check(unknown),
      `${LESSON_FILE} $.subject`,
      'Unknown subject "history"',
    );
  });
});

describe("hint targets", () => {
  it("reports a part that is not marked in the prompt", () => {
    const raw = fixtureContent();
    const i = exerciseIndex(raw, "fixture.ex.chon-luy-thua");
    const hints = exercise(raw, "fixture.ex.chon-luy-thua").hints as {
      highlight: Record<string, unknown>[];
    };
    hints.highlight = [{ target: "part", id: "khong-co" }];
    expectError(
      check(raw),
      `${LESSON_FILE} $.exercises[${i}].hints.highlight[0].id`,
      'Prompt has no part "khong-co"',
    );
  });

  it("reports an answer element that does not exist", () => {
    const raw = fixtureContent();
    const i = exerciseIndex(raw, "fixture.ex.viet-luy-thua");
    const hints = exercise(raw, "fixture.ex.viet-luy-thua").hints as {
      highlight: Record<string, unknown>[];
    };
    // A power answer exposes "base" and "exponent", never "value".
    hints.highlight = [{ target: "option", id: "value" }];
    expectError(
      check(raw),
      `${LESSON_FILE} $.exercises[${i}].hints.highlight[0].id`,
      'Answer area has no element "value"',
    );
  });

  it("reports a block index past the prompt and an unknown concept", () => {
    const raw = fixtureContent();
    const i = exerciseIndex(raw, "fixture.ex.dem-cham");
    const hints = exercise(raw, "fixture.ex.dem-cham").hints as {
      highlight: Record<string, unknown>[];
    };
    hints.highlight = [
      { target: "block", index: 5, conceptId: "fixture.concept.khong-co" },
    ];
    const result = check(raw);
    const at = `${LESSON_FILE} $.exercises[${i}].hints.highlight[0]`;
    expectError(result, `${at}.index`, "Prompt has no block 5");
    expectError(result, `${at}.conceptId`, "Unknown concept");
  });

  it("resolves sentence parts and region elements", () => {
    const raw = fixtureContent();
    const tapText = exercise(raw, "fixture.ex.cham-cau").hints as {
      highlight: Record<string, unknown>[];
    };
    tapText.highlight = [{ target: "part", id: "s2" }];
    const tapRegion = exercise(raw, "fixture.ex.cham-hinh-tron").hints as {
      highlight: Record<string, unknown>[];
    };
    tapRegion.highlight = [{ target: "option", id: "square" }];
    expect(check(raw).issues).toEqual([]);
  });
});

describe("cards and sections", () => {
  it("reports a card none of whose exercises is practiced", () => {
    const raw = fixtureContent();
    const [section] = lessonData(raw).sections;
    if (!section) throw new Error("no section");
    section.practiceIds = (section.practiceIds as string[]).filter(
      (id) => id !== "fixture.ex.viet-luy-thua" && id !== "fixture.ex.sap-xep",
    );
    expectError(
      check(raw),
      `${LESSON_FILE} $.cards[1]`,
      'Card "fixture.card.luy-thua" has no exercise in any section\'s practiceIds',
    );
  });

  it("reports a card with fewer than two exercises", () => {
    const raw = fixtureContent();
    exercise(raw, "fixture.ex.chon-luy-thua").cardIds = [];
    exercise(raw, "fixture.ex.sap-xep").cardIds = [];
    expectError(
      check(raw),
      `${LESSON_FILE} $.cards[1]`,
      "needs at least 2 exercises, has 1",
    );
  });

  it("counts an openEnded step as practiced when its parent is", () => {
    const raw = fixtureContent();
    // Leave the step as the only practiced exercise of its card.
    const [, section] = lessonData(raw).sections;
    if (!section) throw new Error("no section");
    section.practiceIds = ["fixture.ex.viet-ve-ban"];
    section.checkIds = ["fixture.ex.dien-tu", "fixture.ex.cham-cau"];
    expect(check(raw).issues).toEqual([]);
  });

  it("reports a section without checks through the schema", () => {
    const raw = fixtureContent();
    const [section] = lessonData(raw).sections;
    if (!section) throw new Error("no section");
    section.checkIds = [];
    expectError(check(raw), `${LESSON_FILE} $.sections[0].checkIds`, "");
  });

  it("reports an openEnded exercise that carries cards", () => {
    const raw = fixtureContent();
    exercise(raw, "fixture.ex.viet-ve-ban").cardIds = ["fixture.card.doc-hieu"];
    const i = exerciseIndex(raw, "fixture.ex.viet-ve-ban");
    expectError(
      check(raw),
      `${LESSON_FILE} $.exercises[${i}].cardIds`,
      "openEnded exercises carry no cards",
    );
  });
});

describe("exercise answers", () => {
  it("reports a single-answer choice with two answers and unknown options", () => {
    const raw = fixtureContent();
    const ex = exercise(raw, "fixture.ex.chon-phep-nhan");
    ex.answer = ["a", "z"];
    const i = exerciseIndex(raw, "fixture.ex.chon-phep-nhan");
    const result = check(raw);
    expectError(
      result,
      `${LESSON_FILE} $.exercises[${i}].answer`,
      "exactly one answer",
    );
    expectError(
      result,
      `${LESSON_FILE} $.exercises[${i}].answer[1]`,
      'Unknown option "z"',
    );
  });

  it("reports duplicate option ids", () => {
    const raw = fixtureContent();
    const ex = exercise(raw, "fixture.ex.sap-xep");
    const items = ex.items as Record<string, unknown>[];
    const [, second] = items;
    if (!second) throw new Error("no second item");
    second.id = "mot";
    const i = exerciseIndex(raw, "fixture.ex.sap-xep");
    expectError(
      check(raw),
      `${LESSON_FILE} $.exercises[${i}].items[1].id`,
      'Duplicate answer element "mot"',
    );
  });

  it("reports a match with an unpaired left item or unknown pair ids", () => {
    const raw = fixtureContent();
    const ex = exercise(raw, "fixture.ex.ghep-phep-nhan");
    ex.pairs = [{ left: "hai-nhan-ba", right: "khong-co" }];
    const i = exerciseIndex(raw, "fixture.ex.ghep-phep-nhan");
    const result = check(raw);
    expectError(
      result,
      `${LESSON_FILE} $.exercises[${i}].left[1].id`,
      'Left item "bon-nhan-hai" has no pair',
    );
    expectError(
      result,
      `${LESSON_FILE} $.exercises[${i}].pairs[0]`,
      'Unknown right item "khong-co"',
    );
  });

  it("reports a word bank without any accepted answer and a blank-less text", () => {
    const raw = fixtureContent();
    exercise(raw, "fixture.ex.dien-tu").bank = ["Minh", "Hoa"];
    const i = exerciseIndex(raw, "fixture.ex.dien-tu");
    expectError(
      check(raw),
      `${LESSON_FILE} $.exercises[${i}].segments[1].accept`,
      "No accepted answer is in the word bank",
    );

    const noBlank = fixtureContent();
    exercise(noBlank, "fixture.ex.dien-tu").segments = [
      { type: "text", text: "Không có chỗ trống." },
    ];
    const hints = exercise(noBlank, "fixture.ex.dien-tu").hints as {
      highlight: unknown[];
    };
    hints.highlight = [];
    expectError(
      check(noBlank),
      `${LESSON_FILE} $.exercises[${i}].segments`,
      "Needs at least one blank",
    );
  });

  it("reports a tapText answer that is not a sentence of the prompt", () => {
    const raw = fixtureContent();
    exercise(raw, "fixture.ex.cham-cau").answer = ["s9"];
    const i = exerciseIndex(raw, "fixture.ex.cham-cau");
    expectError(
      check(raw),
      `${LESSON_FILE} $.exercises[${i}].answer[0]`,
      'Unknown sentence "s9"',
    );

    const noPassage = fixtureContent();
    exercise(noPassage, "fixture.ex.cham-cau").prompt = [
      { type: "note", text: "Chạm vào câu." },
    ];
    exercise(noPassage, "fixture.ex.cham-cau").hints = { highlight: [] };
    expectError(
      check(noPassage),
      `${LESSON_FILE} $.exercises[${i}].prompt`,
      "tapText needs a passage block",
    );
  });

  it("reports tapRegion regions the visual does not declare", () => {
    const raw = fixtureContent();
    exercise(raw, "fixture.ex.cham-hinh-tron").answer = ["star"];
    const i = exerciseIndex(raw, "fixture.ex.cham-hinh-tron");
    expectError(
      check(raw),
      `${LESSON_FILE} $.exercises[${i}].answer[0]`,
      'Unknown region "star"',
    );

    const noRegions = fixtureContent();
    exercise(noRegions, "fixture.ex.cham-hinh-tron").visualId =
      "fixture.visual.dot-grid";
    expectError(
      check(noRegions),
      `${LESSON_FILE} $.exercises[${i}].visualId`,
      "declares no regions",
    );
  });

  it("reports manipulate exercises on static visuals or unknown validators", () => {
    const raw = fixtureContent();
    const ex = exercise(raw, "fixture.ex.tao-sau-cham");
    ex.visualId = "fixture.visual.dot-grid";
    const i = exerciseIndex(raw, "fixture.ex.tao-sau-cham");
    const result = check(raw);
    expectError(
      result,
      `${LESSON_FILE} $.exercises[${i}].visualId`,
      "is not interactive",
    );
    expectError(
      result,
      `${LESSON_FILE} $.exercises[${i}].validatorId`,
      'has no validator "count-equals"',
    );
  });
});

describe("videos", () => {
  const video = {
    id: "fixture.video.gioi-thieu",
    lessonId: "fixture",
    url: "https://media.example.org/gioi-thieu.mp4",
    vttUrl: "https://media.example.org/gioi-thieu.vtt",
    durationSec: 60,
    clips: [
      { id: "mo-dau", start: 0, end: 30, cardIds: ["fixture.card.nhan-lap"] },
    ],
    voice: { engine: "local", voiceName: "Hải Đăng", model: "vieneu" },
  };

  it("accepts a video block that resolves to a clip", () => {
    const raw = fixtureContent();
    const data = lessonData(raw);
    data.videos = [video];
    const [section] = data.sections;
    if (!section) throw new Error("no section");
    (section.blocks as unknown[]).push({
      type: "video",
      videoId: video.id,
      clipId: "mo-dau",
    });
    expect(check(raw).issues).toEqual([]);
  });

  it("reports unknown videos and clips, wrong lessonId and bad clips", () => {
    const raw = fixtureContent();
    const data = lessonData(raw);
    data.videos = [
      {
        ...video,
        lessonId: "bai-khac",
        clips: [{ id: "mo-dau", start: 40, end: 90, cardIds: [] }],
      },
    ];
    const [section] = data.sections;
    if (!section) throw new Error("no section");
    const blocks = section.blocks as unknown[];
    blocks.push(
      { type: "video", videoId: "fixture.video.khong-co" },
      { type: "video", videoId: video.id, clipId: "khong-co" },
    );
    const result = check(raw);
    const n = blocks.length;
    expectError(
      result,
      `${LESSON_FILE} $.videos[0].lessonId`,
      "Expected lessonId",
    );
    expectError(result, `${LESSON_FILE} $.videos[0].clips[0]`, "Clip must end");
    expectError(
      result,
      `${LESSON_FILE} $.sections[0].blocks[${n - 2}].videoId`,
      "Unknown video",
    );
    expectError(
      result,
      `${LESSON_FILE} $.sections[0].blocks[${n - 1}].clipId`,
      'has no clip "khong-co"',
    );
  });
});

describe("ids.lock.json", () => {
  function withLock(lock: unknown) {
    const raw = asRealLesson(fixtureContent());
    raw.lock = { file: LOCK_FILE, data: lock };
    return raw;
  }
  const allIds = () =>
    check(asRealLesson(fixtureContent())).lessons.flatMap(({ lesson }) =>
      collectIds(lesson),
    );

  function collectIds(lesson: Lesson): string[] {
    return [
      lesson.id,
      ...lesson.concepts.map((c) => c.id),
      ...lesson.sections.map((s) => s.id),
      ...lesson.cards.map((c) => c.id),
      ...lesson.exercises.flatMap((e) => [
        e.id,
        ...(e.type === "openEnded" ? e.steps.map((s) => s.id) : []),
      ]),
    ];
  }

  it("accepts a lock that covers the current ids", () => {
    const result = check(withLock({ ids: allIds(), retired: {} }));
    expect(result.issues).toEqual([]);
  });

  it("warns about real lesson ids that are not locked yet", () => {
    const result = check(withLock({ ids: [], retired: {} }));
    expect(result.issues).toEqual([
      expect.objectContaining({
        severity: "warning",
        file: LESSON_FILE,
        message: expect.stringContaining("run pnpm content:lock"),
      }),
    ]);
  });

  it("reports a locked id that vanished without being retired", () => {
    const result = check(
      withLock({ ids: ["fixture.card.da-xoa", ...allIds()], retired: {} }),
    );
    expectError(
      result,
      `${LOCK_FILE} $.ids[0]`,
      'Locked id "fixture.card.da-xoa" no longer exists and is not retired',
    );
  });

  it("accepts retired chains that end at an existing id or null", () => {
    const result = check(
      withLock({
        ids: ["fixture.card.cu", "fixture.card.bo", ...allIds()],
        retired: {
          "fixture.card.cu": "fixture.card.giua",
          "fixture.card.giua": "fixture.card.nhan-lap",
          "fixture.card.bo": null,
        },
      }),
    );
    expect(result.issues).toEqual([]);
  });

  it("reports a retired chain that loops", () => {
    const result = check(
      withLock({
        ids: allIds(),
        retired: {
          "fixture.card.a": "fixture.card.b",
          "fixture.card.b": "fixture.card.a",
        },
      }),
    );
    expectError(
      result,
      `${LOCK_FILE} $.retired["fixture.card.a"]`,
      "Retired chain loops: fixture.card.a -> fixture.card.b -> fixture.card.a",
    );
  });

  it("reports a retired chain whose final id does not exist", () => {
    const result = check(
      withLock({
        ids: allIds(),
        retired: {
          "fixture.card.a": "fixture.card.b",
          "fixture.card.b": "fixture.card.khong-co",
        },
      }),
    );
    expectError(
      result,
      `${LOCK_FILE} $.retired["fixture.card.a"]`,
      'Retired chain ends at "fixture.card.khong-co", which does not exist',
    );
  });

  it("reports a retired id that still exists", () => {
    const result = check(
      withLock({
        ids: allIds(),
        retired: { "fixture.card.nhan-lap": null },
      }),
    );
    expectError(
      result,
      `${LOCK_FILE} $.retired["fixture.card.nhan-lap"]`,
      "still exists in content",
    );
  });

  it("reports an invalid lock file shape", () => {
    const result = check(withLock({ ids: "fixture" }));
    expectError(result, `${LOCK_FILE} $.ids`, "");
  });
});

describe("files", () => {
  it("reports unreadable or invalid JSON at the file root", () => {
    const raw = fixtureContent();
    raw.subjects = { file: "content/subjects.json", readError: "Invalid JSON" };
    expectError(check(raw), "content/subjects.json $", "Invalid JSON");
  });
});

describe("formatPath", () => {
  it("uses dot keys, bracket indexes and quoted non-identifier keys", () => {
    expect(formatPath([])).toBe("$");
    expect(formatPath(["exercises", 3, "cardIds", 0])).toBe(
      "$.exercises[3].cardIds[0]",
    );
    expect(formatPath(["retired", "a.card.b"])).toBe('$.retired["a.card.b"]');
  });
});

describe("lessonStats", () => {
  it("counts the fixture's sections, cards, exercises, types and interactive visuals", () => {
    const [checked] = check().lessons;
    if (!checked) throw new Error("fixture missing");
    expect(lessonStats(checked.lesson, visualRegistry)).toEqual({
      sections: 2,
      cards: 3,
      exercises: 11,
      exerciseTypes: 8,
      interactiveVisuals: 1,
    });
  });
});

describe("collectVisualRefs", () => {
  it("finds visual references at any depth with their paths", () => {
    expect(
      collectVisualRefs({
        sticker: { visualId: "a.visual.x" },
        list: [{ hints: { hintVisualId: "a.visual.y" } }],
      }),
    ).toEqual([
      { visualId: "a.visual.x", path: ["sticker", "visualId"] },
      { visualId: "a.visual.y", path: ["list", 0, "hints", "hintVisualId"] },
    ]);
  });
});
