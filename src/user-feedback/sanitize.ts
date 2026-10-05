import { FEEDBACK_NOTE_MAX_CHARS } from "@/lib/config";

// Text that came from a device and ends up in a GitHub issue. Nothing here
// may render as markdown or HTML, ping a user or become a link.

// C0 and C1 controls, and the format characters (bidi overrides, zero-width
// marks) except the zero-width joiner that emoji need.
const CONTROLS = /\p{Cc}/gu;
const FORMATS = /(?!\u200D)\p{Cf}/gu;

function cut(text: string, max: number): string {
  const chars = Array.from(text);
  return chars.length <= max ? text : chars.slice(0, max).join("");
}

// Breaks what GitHub would turn into a link or a reference: the colon of
// `://`, the dot of `www.` and the hyphen of `GH-<n>`. Repeated until nothing
// changes, since a removal can join its neighbours into a new match
// (`http:://` -> `http://`).
function unlinked(text: string): string {
  let current = text;
  for (;;) {
    const next = current
      .replace(/:\/\//g, "//")
      .replace(/www\./gi, "www")
      .replace(/\b(GH)-(?=\d)/gi, "$1 ");
    if (next === current) return current;
    current = next;
  }
}

// One line of display text (a lesson or section title): letters with their
// marks, digits, spaces and `.,:;()/'–-` only, so no markdown, HTML, mention
// or table syntax survives. The colon of `://` and the dot of `www.` are
// dropped too, so GitHub finds nothing to autolink.
export function plainText(text: string, max: number): string {
  const cleaned = text
    .normalize("NFC")
    .replace(CONTROLS, " ")
    .replace(FORMATS, "")
    .replace(/[^\p{L}\p{M}\p{Nd} .,:;()/'–-]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
  return cut(unlinked(cleaned), max).trim();
}

// Lines of text kept in a row; the next ones join the last kept line.
const MAX_LINES_IN_A_ROW = 5;

// The parent's note, shown only inside a ```text fence: line breaks stay
// (three or more become one blank line, at most five lines in a row), other
// controls go, `@` can never mention, `<` `>` never open a tag and a backtick
// never closes the fence.
export function noteText(text: string): string {
  const flat = text
    .normalize("NFC")
    .replace(/\r\n?/g, "\n")
    .replace(/(?!\n)\p{Cc}/gu, "")
    .replace(FORMATS, "")
    .replace(/@/g, "＠")
    .replace(/</g, "‹")
    .replace(/>/g, "›")
    .replace(/`/g, "'");
  const paragraphs = flat
    .split(/\n\s*\n/)
    .map((paragraph) => {
      const lines = paragraph
        .split("\n")
        .map((line) => line.replace(/[ \t]+$/g, ""))
        .filter((line) => line.trim() !== "");
      const kept = lines.slice(0, MAX_LINES_IN_A_ROW);
      const rest = lines.slice(MAX_LINES_IN_A_ROW);
      if (rest.length > 0 && kept.length > 0) {
        kept[kept.length - 1] = [kept[kept.length - 1], ...rest].join(" ");
      }
      return kept.join("\n");
    })
    .filter((paragraph) => paragraph !== "");
  return cut(paragraphs.join("\n\n"), FEEDBACK_NOTE_MAX_CHARS).trim();
}

// JSON for an HTML comment: `<`, `>` and `&` written as JSON escapes, so the
// text can never close the comment (`-->`, `--!>`) and still parses back to
// the same values.
export function commentJson(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}
