// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  formatVttTime,
  karaokeCueText,
  parseKaraokeCue,
} from "@/lib/karaoke-vtt";

describe("formatVttTime", () => {
  it("writes hours, minutes, seconds and milliseconds", () => {
    expect(formatVttTime(0)).toBe("00:00:00.000");
    expect(formatVttTime(75.4567)).toBe("00:01:15.457");
    expect(formatVttTime(3725.001)).toBe("01:02:05.001");
  });
});

describe("karaoke cues", () => {
  const words = [
    { text: "Luỹ", start: 1 },
    { text: "thừa", start: 1.25 },
    { text: "là", start: 1.6 },
  ];

  it("stamps every word after the first", () => {
    expect(karaokeCueText(words)).toBe(
      "Luỹ <00:00:01.250>thừa <00:00:01.600>là",
    );
  });

  it("reads back what it writes", () => {
    expect(parseKaraokeCue(karaokeCueText(words), 1)).toEqual(words);
  });

  it("lets an unstamped word start with the word before it", () => {
    expect(parseKaraokeCue("Ô <00:00:02.000>đầu tiên", 1.5)).toEqual([
      { text: "Ô", start: 1.5 },
      { text: "đầu", start: 2 },
      { text: "tiên", start: 2 },
    ]);
  });
});
