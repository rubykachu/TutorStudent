// @vitest-environment node
import { describe, expect, it } from "vitest";
import { sentenceCuts } from "../../video/lib/split";

function heard(...words: [string, number, number][]) {
  return words.map(([word, start, end]) => ({ word, start, end }));
}

describe("sentenceCuts", () => {
  const sentences = ["Chào bạn.", "Hôm nay ta học.", "Tạm biệt!"];
  const words = heard(
    ["Chào", 0.2, 0.5],
    ["bạn", 0.5, 0.9],
    ["Hôm", 1.5, 1.8],
    ["nay", 1.8, 2.0],
    ["ta", 2.0, 2.2],
    ["học", 2.2, 2.6],
    ["Tạm", 3.4, 3.7],
    ["biệt", 3.7, 4.2],
  );

  it("cuts in the middle of each pause between sentences", () => {
    const cuts = sentenceCuts(sentences, words, 4.5);
    expect(cuts?.map((c) => Math.round(c * 100) / 100)).toEqual([1.2, 3]);
  });

  it("finds one cut for two sentences and none for one", () => {
    expect(sentenceCuts(sentences.slice(0, 2), words.slice(0, 6), 3)).toEqual([
      1.2,
    ]);
    expect(sentenceCuts(["Chào bạn."], words.slice(0, 2), 1)).toEqual([]);
  });

  it("copes with a word Whisper heard wrong", () => {
    const wrong = words.map((w) =>
      w.word === "nay" ? { ...w, word: "nai" } : w,
    );
    expect(sentenceCuts(sentences, wrong, 4.5)).toHaveLength(2);
  });

  it("reads a number Whisper wrote as digits like the spoken words", () => {
    const cuts = sentenceCuts(
      ["Có 4 376 hạt.", "Hết rồi."],
      heard(
        ["Có", 0, 0.3],
        ["4376", 0.3, 1.5],
        ["hạt", 1.5, 1.8],
        ["Hết", 2.6, 2.9],
        ["rồi", 2.9, 3.2],
      ),
      3.4,
    );
    expect(cuts).toEqual([(1.8 + 2.6) / 2]);
  });

  it("gives up when a sentence was not heard at all", () => {
    expect(
      sentenceCuts(
        sentences,
        words.filter((w) => w.start < 3),
        4.5,
      ),
    ).toBeUndefined();
  });
});
