// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  anchorKey,
  matchRate,
  readNumber,
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

  it("reads Whisper's written thousands and minus as spoken words", () => {
    expect(textTokens("35.000 đồng")).toEqual(textTokens("35 nghìn đồng"));
    expect(textTokens("368.000 đồng")).toEqual(textTokens("368 nghìn đồng"));
    expect(textTokens("60-18 bằng 42")).toEqual(
      textTokens("60 trừ 18 bằng 42"),
    );
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
