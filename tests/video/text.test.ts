// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  anchorKey,
  matchRate,
  ownedTokens,
  readNumber,
  spokenNegatives,
  textTokens,
} from "../../video/lib/text";

describe("readNumber", () => {
  it("reads whole numbers the Vietnamese way, without tones", () => {
    expect(readNumber(0)).toEqual(["khong"]);
    expect(readNumber(15)).toEqual(["muoi", "nam"]);
    expect(readNumber(64)).toEqual(["sau", "muoi", "bon"]);
    expect(readNumber(105)).toEqual(["mot", "tram", "linh", "nam"]);
    expect(readNumber(1005)).toEqual([
      "mot",
      "nghin",
      "khong",
      "tram",
      "linh",
      "nam",
    ]);
  });
});

describe("textTokens", () => {
  it("drops tones and punctuation and reads digits", () => {
    expect(textTokens("Ô thứ 64, có 8 hạt!")).toEqual([
      "o",
      "thu",
      "sau",
      "muoi",
      "bon",
      "co",
      "tam",
      "hat",
    ]);
  });

  it("treats spoken variants as the canonical word", () => {
    expect(textTokens("sáu mươi tư")).toEqual(textTokens("64"));
    expect(textTokens("ô thứ tư")).toEqual(textTokens("ô thứ 4"));
    expect(textTokens("2 x 2")).toEqual(textTokens("hai nhân hai"));
    expect(textTokens("5 trừ 3")).toEqual(textTokens("5 chữ 3"));
  });

  it("compares initial d and gi as one sound before a vowel", () => {
    expect(textTokens("dải băng dài 12")).toEqual(
      textTokens("giải băng giải 12"),
    );
    expect(textTokens("gì")).not.toEqual(textTokens("d"));
    expect(textTokens("giờ")).toEqual(textTokens("dờ"));
    expect(textTokens("đi")).not.toEqual(textTokens("gì"));
  });

  it("reads Whisper's written thousands and minus as spoken words", () => {
    expect(textTokens("35.000 đồng")).toEqual(textTokens("35 nghìn đồng"));
    expect(textTokens("368.000 đồng")).toEqual(textTokens("368 nghìn đồng"));
    expect(textTokens("60-18 bằng 42")).toEqual(
      textTokens("60 trừ 18 bằng 42"),
    );
  });

  it("reads a minus sign before a digit as \"âm\", not as a subtraction", () => {
    expect(textTokens("−3")).toEqual(["am", "ba"]);
    expect(textTokens("âm 3")).toEqual(textTokens("−3"));
    expect(textTokens("-3")).toEqual(textTokens("âm ba"));
    expect(textTokens("(−12),")).toEqual(textTokens("âm 12"));
    expect(textTokens("5−3")).toEqual(textTokens("5 trừ 3"));
    expect(textTokens("5 − 3")).toEqual(textTokens("5 3"));
  });

  it("says each negative sign as one word joined to its number", () => {
    expect(spokenNegatives("Số đối của 5 là −5, của −12 là 12.")).toBe(
      "Số đối của 5 là âm-5, của âm-12 là 12.",
    );
    expect(spokenNegatives("5-3 và 5−3")).toBe("5-3 và 5−3");
    const text = "ví dụ số đối của 5 là −5";
    expect(spokenNegatives(text).split(" ")).toHaveLength(
      text.split(" ").length,
    );
  });

  it("reads thousands written with a space, a dot or nothing alike", () => {
    const spoken = textTokens("số 4376");
    expect(textTokens("số 4 376")).toEqual(spoken);
    expect(textTokens("số 4376")).toEqual(spoken);
    expect(textTokens("số 4.376")).toEqual(spoken);
    expect(spoken.slice(1, 3)).toEqual(["bon", "nghin"]);
    expect(textTokens("5 976.")).toEqual(textTokens("5.976"));
    expect(textTokens("1 250 000")).toEqual(textTokens("1250000"));
    expect(textTokens("1 005")).toEqual(textTokens("1005"));
  });

  it("keeps separate numbers apart", () => {
    expect(textTokens("2 415")).not.toEqual(textTokens("2 41"));
    expect(textTokens("12, 345")).not.toEqual(textTokens("12345"));
    expect(textTokens("5 cộng 376")).not.toEqual(textTokens("5376"));
  });

  it("gives each word of a grouped number the tokens of its group", () => {
    const owners = ownedTokens(["số", "4", "376."]).map((t) => [
      t.token,
      t.owner,
    ]);
    expect(owners).toEqual([
      ["so", 0],
      ["bon", 1],
      ["nghin", 1],
      ["ba", 2],
      ["tram", 2],
      ["bay", 2],
      ["muoi", 2],
      ["sau", 2],
    ]);
  });
});

describe("matchRate", () => {
  it("is 1 when Whisper wrote the same speech differently", () => {
    expect(
      matchRate(
        "Hai nhân hai nhân hai viết gọn là 2 mũ 3.",
        "2 x 2 x 2 viết gọn là 2 mũ 3.",
      ),
    ).toBe(1);
  });

  it("drops with every misheard sound", () => {
    const rate = matchRate("Ô thứ tư có 8 hạt.", "Ông thứ tư có tăm hạt.");
    expect(rate).toBeLessThan(0.97);
    expect(rate).toBeGreaterThan(0.8);
  });
});

describe("anchorKey", () => {
  it("keeps tone marks and drops punctuation", () => {
    expect(anchorKey("Thóc.")).toBe("thóc");
    expect(anchorKey("64,")).toBe("64");
  });
});
