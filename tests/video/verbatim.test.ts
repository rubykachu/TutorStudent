// @vitest-environment node
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { PROJECTS_DIR } from "../../video/config";
import { readScript, type VideoScript } from "../../video/lib/script";
import {
  checkVerbatim,
  spokenForm,
  verbatimIssues,
} from "../../video/lib/verbatim";

const lesson = {
  sections: [
    {
      blocks: [
        {
          type: "group",
          children: [
            {
              type: "note",
              text: "Chia hai luỹ thừa cùng cơ số (khác 0): giữ nguyên cơ số. Số mũ thứ nhất lớn hơn.",
            },
          ],
        },
      ],
      recap: { type: "visual", caption: "aⁿ là tích của n thừa số bằng a." },
    },
  ],
  cards: [{ recap: { type: "visual", caption: "Từ ghép gồm các tiếng." } }],
};
const passage =
  "– Mình sẽ khóc mất. – cáo nói.\nNgười ta chỉ thấy rõ với trái tim.";

function script(
  ...sentences: VideoScript["scenes"][number]["sentences"]
): VideoScript {
  return {
    title: "t",
    engine: "local",
    voice: "Hải Đăng",
    poster: { scene: "s01-a", at: 0.5 },
    scenes: [{ id: "s01-a", sentences }],
    clips: [],
  };
}

describe("spokenForm", () => {
  it("reads superscripts, brackets and a lone letter the way the script says them", () => {
    expect(spokenForm("aⁿ là tích, bằng a.")).toBe(
      spokenForm("a mũ n là tích, bằng số a."),
    );
    expect(spokenForm("cơ số (khác 0): giữ")).toBe("cơ số, khác 0: giữ");
    expect(spokenForm("10ⁿ viết ra")).toBe("10 mũ n viết ra");
  });
});

describe("verbatimIssues", () => {
  it("accepts rules equal to a whole note, one of its sentences, or a recap caption", () => {
    const ok = script(
      {
        text: "Chia hai luỹ thừa cùng cơ số, khác 0: giữ nguyên cơ số.",
        rule: true,
      },
      { text: "Số mũ thứ nhất lớn hơn.", rule: true },
      { text: "a mũ n là tích của n thừa số bằng số a.", rule: true },
      { text: "Từ ghép gồm các tiếng.", rule: true },
      { text: "Câu dẫn không phải quy tắc thì nói tự do." },
    );
    expect(verbatimIssues(ok, lesson, passage)).toEqual([]);
  });

  it("fails a rule that rewords the lesson", () => {
    const issues = verbatimIssues(
      script({ text: "Từ ghép có các tiếng.", rule: true }),
      lesson,
      passage,
    );
    expect(issues).toEqual([
      's01-a: rule "Từ ghép có các tiếng." is not a note or caption of the lesson, word for word',
    ]);
  });

  it("checks the quoted part of a quote against the source passage", () => {
    expect(
      verbatimIssues(
        script(
          { text: "Cáo nói: “Mình sẽ khóc mất.”", quote: true },
          { text: "Người ta chỉ thấy rõ với trái tim.", quote: true },
        ),
        lesson,
        passage,
      ),
    ).toEqual([]);
    expect(
      verbatimIssues(
        script({ text: "Cáo nói: “Mình sẽ khóc.”", quote: true }),
        lesson,
        passage,
      ),
    ).toEqual([
      's01-a: quote "Mình sẽ khóc." is not in source-passage.txt, word for word',
    ]);
  });
});

// Every committed video still says its lesson's rules word for word, so a
// later edit of a note or caption shows up here, not only at the next build.
describe("committed video scripts", () => {
  const projects = existsSync(PROJECTS_DIR)
    ? readdirSync(PROJECTS_DIR).flatMap((lessonId) =>
        readdirSync(path.join(PROJECTS_DIR, lessonId))
          .filter((name) =>
            existsSync(path.join(PROJECTS_DIR, lessonId, name, "script.json")),
          )
          .map((name) => [lessonId, name] as const),
      )
    : [];

  it.each(projects)(
    "%s/%s quotes its lesson word for word",
    (lessonId, name) => {
      const file = path.join(PROJECTS_DIR, lessonId, name, "script.json");
      expect(checkVerbatim(readScript(file), lessonId)).toEqual([]);
    },
  );
});
