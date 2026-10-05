import { describe, expect, it } from "vitest";
import { commentJson, noteText, plainText } from "@/user-feedback/sanitize";

describe("plainText", () => {
  it("keeps Vietnamese words, digits and the allowed marks", () => {
    expect(plainText("Bài 6. Lũy thừa (phần 1/2): a–b, c-d; 'x'", 120)).toBe(
      "Bài 6. Lũy thừa (phần 1/2): a–b, c-d; 'x'",
    );
  });

  it("drops markdown, HTML, mentions and links", () => {
    const hostile = [
      "[click](https://evil.example)",
      "![img](https://evil.example/a.png)",
      "<script>alert(1)</script>",
      "--> <!-- x",
      "@user hi",
      "```code```",
      "**bold** _it_ ~~s~~ # h | t",
      "https://evil.example/x",
      "www.evil.example",
    ];
    for (const text of hostile) {
      const out = plainText(text, 120);
      expect(out).not.toMatch(/[`*_[\]<>#@!|~]/);
      expect(out).not.toContain("://");
      expect(out.toLowerCase()).not.toContain("www.");
    }
  });

  it("turns controls into spaces, drops bidi overrides, collapses and cuts", () => {
    expect(plainText("a\nb\tc\u0000d", 120)).toBe("a b c d");
    expect(plainText("abc‮def", 120)).toBe("abcdef");
    expect(plainText("  a   b  ", 120)).toBe("a b");
    expect(Array.from(plainText("ệ".repeat(10_000), 120))).toHaveLength(120);
  });
});

describe("noteText", () => {
  it("never mentions, opens a tag or closes the fence", () => {
    const out = noteText("@user <b>x</b> ```\n```js\n-->");
    expect(out).not.toMatch(/[@<>`]/);
    expect(out).toContain("＠user");
    expect(out).toContain("‹b›");
  });

  it("keeps line breaks, folds blank runs and long runs of lines", () => {
    expect(noteText("a\r\n\r\n\r\n\r\nb")).toBe("a\n\nb");
    expect(noteText("1\n2\n3\n4\n5\n6\n7")).toBe("1\n2\n3\n4\n5 6 7");
    expect(noteText("a\u0000\u0007b‮c")).toBe("abc");
  });

  it("cuts to 500 characters", () => {
    expect(Array.from(noteText("x".repeat(10_000)))).toHaveLength(500);
  });
});

describe("commentJson", () => {
  it("cannot close an HTML comment and parses back", () => {
    const value = { a: "--> <!-- & --!> <b>" };
    const text = commentJson(value);
    expect(text).not.toMatch(/[<>&]/);
    expect(JSON.parse(text)).toEqual(value);
  });
});
