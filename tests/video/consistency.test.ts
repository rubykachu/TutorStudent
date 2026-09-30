// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  captionIssues,
  captionTokens,
  onScreenIssues,
  ruleTextsOnScreen,
} from "../../video/lib/consistency";
import type { VideoScript } from "../../video/lib/script";

function script(...scenes: string[][]): VideoScript {
  return {
    title: "t",
    engine: "local",
    voice: "v",
    poster: { scene: "a", at: 0 },
    scenes: scenes.map((sentences, i) => ({
      id: `s${i + 1}`,
      sentences: sentences.map((text) => ({ text })),
    })),
    clips: [],
  };
}

function vtt(...cues: string[]): string {
  const body = cues
    .map((c, i) => `${i + 1}\n00:00:0${i}.000 --> 00:00:0${i}.900\n${c}`)
    .join("\n\n");
  return `WEBVTT\n\n${body}\n`;
}

describe("captionIssues", () => {
  it("accepts sentences split over cues, with karaoke stamps and punctuation differences", () => {
    const s = script(["Bạn có một hộp bút."], ["Viết aⁿ là số a mũ n."]);
    const v = vtt(
      "Bạn <00:00:00.200>có <00:00:00.400>một",
      "hộp <00:00:01.200>bút.",
      "Viết <00:00:02.100>a <00:00:02.300>mũ <00:00:02.500>n <00:00:02.700>là a mũ n",
    );
    expect(captionIssues(s, v)).toEqual([]);
  });

  it("matches NFC and NFD spellings", () => {
    const s = script(["Tập hợp"]);
    expect(captionIssues(s, vtt("Tập hợp".normalize("NFD")))).toEqual([]);
  });

  it("reports a missing sentence by its index", () => {
    const s = script(["Một hai."], ["Ba bốn."], ["Năm sáu."]);
    const issues = captionIssues(s, vtt("Một hai.", "Năm sáu."));
    expect(issues).toEqual([
      'sentence 2 (s2) is missing from the captions: "Ba bốn."',
    ]);
  });

  it("reports extra caption text before, between and after sentences", () => {
    const s = script(["Một hai."], ["Ba bốn."]);
    const issues = captionIssues(
      s,
      vtt("Lạ đầu. Một hai.", "Ba bốn.", "Lạ cuối."),
    );
    expect(issues).toEqual([
      'extra caption text before sentence 1 (s1): "lạ đầu"',
      'extra caption text after the last sentence: "lạ cuối"',
    ]);
  });

  it("reports a sentence that differs by one word", () => {
    const s = script(["Một hai ba."]);
    expect(captionIssues(s, vtt("Một hai bốn."))).toHaveLength(2);
  });
});

describe("captionTokens", () => {
  it("drops punctuation and lower-cases", () => {
    expect(captionTokens("Tập hợp, là: “gì”?")).toEqual([
      "tập",
      "hợp",
      "là",
      "gì",
    ]);
  });
});

const lesson = {
  sections: [
    {
      blocks: [
        {
          type: "note",
          text: "Kí hiệu 2 ∈ A đọc là 2 thuộc A. Nghĩa là 2 là một phần tử của A.",
        },
      ],
      recap: { type: "visual", caption: "aⁿ là tích của n thừa số bằng a." },
    },
  ],
  cards: [],
};

const page = (...texts: string[]) =>
  `<body>${texts.map((t) => `<div data-rule-text>${t}</div>`).join("")}<p>so sánh</p></body>`;

describe("onScreenIssues", () => {
  it("accepts a rule sentence, with or without the final period", () => {
    expect(
      onScreenIssues(page("Nghĩa là 2 là một phần tử của A"), lesson),
    ).toEqual([]);
    expect(
      onScreenIssues(page("aⁿ <b>là</b> tích của n thừa số bằng a."), lesson),
    ).toEqual([]);
  });

  it("accepts a notation, its reading, and both joined with 'đọc:'", () => {
    expect(
      onScreenIssues(
        page("2 ∈ A", "2 thuộc A", "2 ∈ A đọc: 2 thuộc A"),
        lesson,
      ),
    ).toEqual([]);
  });

  it("fails on text that is not a rule of the lesson", () => {
    const issues = onScreenIssues(
      page("2 ∈ B", "2 ∈ A đọc: 2 không thuộc A", "Nghĩa là 3 là phần tử"),
      lesson,
    );
    expect(issues).toHaveLength(3);
    expect(issues[0]).toContain('"2 ∈ B"');
  });

  it("ignores elements without the attribute", () => {
    expect(onScreenIssues("<body><p>tuỳ ý</p></body>", lesson)).toEqual([]);
  });
});

describe("ruleTextsOnScreen", () => {
  it("reads nested markup, same-name children and entities", () => {
    expect(
      ruleTextsOnScreen(
        '<div data-rule-text class="x">a <div>b</div> &lt;c&gt;</div><div>no</div><span data-rule-text="">d</span>',
      ),
    ).toEqual(["a b <c>", "d"]);
  });
});
