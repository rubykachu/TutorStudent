// @vitest-environment node
import { describe, expect, it } from "vitest";
import { cacheKey } from "../../video/lib/narrate";
import {
  anchorKey,
  matchRate,
  ownedTokens,
  readNumber,
  SPOKEN_ABBREVIATIONS,
  spelledOutCapitals,
  spokenAbbreviations,
  spokenNegatives,
  spokenText,
  textTokens,
} from "../../video/lib/text";
import { localEngine } from "../../video/tts/local";
import { VOICES } from "../../video/voices";

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

  it('reads a minus sign before a digit as "âm", not as a subtraction', () => {
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

describe("spokenText", () => {
  it("says an abbreviation in full, as one word per written word", () => {
    expect(spokenText("Tìm ƯCLN(12, 18).")).toBe(
      "Tìm ước-chung-lớn-nhất(12, 18).",
    );
    expect(spokenText("ƯCLN và BCNN")).toBe(
      "ước-chung-lớn-nhất và bội-chung-nhỏ-nhất",
    );
    expect(spokenText("Tìm ƯC(12) rồi BC của 4 và 6")).toBe(
      "Tìm ước-chung(12) rồi bội-chung của 4 và 6",
    );
    for (const text of ["Tìm ƯCLN(12, 18).", "ƯCLN và BCNN", "ƯC(12)"]) {
      expect(spokenText(text).split(/\s+/)).toHaveLength(
        text.split(/\s+/).length,
      );
    }
  });

  it("leaves a sentence with no abbreviation unchanged", () => {
    const text = "Bội chung nhỏ nhất của 4 và 6 là 12, ước là số chia hết.";
    expect(spokenText(text)).toBe(text);
    expect(spokenText("Số đối của 5 là −5.")).toBe(
      spokenNegatives("Số đối của 5 là −5."),
    );
  });

  it("leaves point labels, lone letters and longer words alone", () => {
    for (const text of [
      "Đoạn thẳng AB dài 3 cm, tia OA.",
      "Điểm B nằm giữa A và C.",
      "Số b chia hết cho c.",
      "Chữ BCNNX và ABC và XƯCLN.",
      "Mã BC2 và 2BC.",
    ]) {
      expect(spokenText(text)).toBe(text);
    }
  });

  it("reads a Roman chapter number as a number, other numerals as letters", () => {
    expect(spokenText("Ta ôn lại cả chương II.")).toBe(
      "Ta ôn lại cả chương hai.",
    );
    expect(spokenText("Chương IV nói về phân số.")).toBe(
      "Chương bốn nói về phân số.",
    );
    expect(spokenText("Kim giờ chỉ vào số IV.")).toBe("Kim giờ chỉ vào số IV.");
    expect(spokenText("chương IIIA")).toBe("chương IIIA");
  });

  it("uses the author's respelling in full, with abbreviations expanded", () => {
    expect(spokenText("BC", "bê-xê")).toBe("bê-xê");
    expect(spokenText("ƯCLN là gì", "ƯCLN là gì")).toBe(
      "ước-chung-lớn-nhất là gì",
    );
  });

  it("is the one map: every entry is said and matched whole-word only", () => {
    for (const [abbreviation, phrase] of Object.entries(SPOKEN_ABBREVIATIONS)) {
      expect(spokenAbbreviations(abbreviation)).toBe(phrase.replace(/ /g, "-"));
      expect(spokenAbbreviations(`x${abbreviation}`)).toBe(`x${abbreviation}`);
    }
  });

  it("is checked by Whisper against the full words", () => {
    const spoken = spokenText("Tìm ƯCLN và BCNN của 12 và 18.");
    expect(
      matchRate(
        spoken,
        "Tìm ước chung lớn nhất và bội chung nhỏ nhất của 12 và 18.",
      ),
    ).toBe(1);
    expect(
      matchRate(spoken, "Tìm Ư C L N và B C N N của 12 và 18."),
    ).toBeLessThan(0.97);
  });

  it("changes the audio cache key of an affected sentence only", () => {
    const voice = localEngine.voice(VOICES["hai-dang"].video.preset);
    const key = (text: string) => cacheKey(voice, spokenText(text));
    expect(key("Bạn nhớ nhé.")).toBe(cacheKey(voice, "Bạn nhớ nhé."));
    expect(key("Bạn nhớ nhé.")).toBe("56dedb834ddda5c4");
    expect(key("Tìm ƯCLN của 12.")).not.toBe(
      cacheKey(voice, "Tìm ƯCLN của 12."),
    );
  });
});

describe("spelledOutCapitals", () => {
  it("reports a capital-letter token the voice would spell out", () => {
    expect(spelledOutCapitals("Xem SGK trang 5.")).toEqual(["SGK"]);
    expect(spelledOutCapitals("Tìm ƯCLN và BCNN.")).toEqual([]);
    expect(spelledOutCapitals("Ôn chương II.")).toEqual([]);
  });

  it("lets point labels and Roman numerals through", () => {
    expect(spelledOutCapitals("Đoạn thẳng AB nằm trên tia OA.")).toEqual([]);
    expect(spelledOutCapitals("Số IV và IX.")).toEqual([]);
    expect(spelledOutCapitals("AB dài 3 cm")).toEqual(["AB"]);
    expect(spelledOutCapitals("Chữ A, B và x.")).toEqual([]);
  });

  it("does not report what the author respelled", () => {
    expect(spelledOutCapitals("Xem SGK", "Xem ét-gờ-ca")).toEqual([]);
  });
});
