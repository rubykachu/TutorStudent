import { Fragment } from "react";

// Unicode superscript characters content writes exponents with (aⁿ, 2⁵, 10³)
// and the plain characters they stand for.
const SUPERSCRIPTS: Readonly<Record<string, string>> = {
  "⁰": "0",
  "¹": "1",
  "²": "2",
  "³": "3",
  "⁴": "4",
  "⁵": "5",
  "⁶": "6",
  "⁷": "7",
  "⁸": "8",
  "⁹": "9",
  "⁺": "+",
  "⁻": "−",
  ⁿ: "n",
  ᵐ: "m",
};

const SUPERSCRIPT_RUN = new RegExp(
  `([${Object.keys(SUPERSCRIPTS).join("")}]+)`,
  "u",
);

export type TextPart = { text: string; raised: boolean };

// Splits text into plain runs and exponent runs, each exponent written with
// plain characters.
export function splitSuperscripts(text: string): TextPart[] {
  return text
    .split(SUPERSCRIPT_RUN)
    .filter((part) => part !== "")
    .map((part) =>
      SUPERSCRIPT_RUN.test(part)
        ? {
            text: [...part].map((char) => SUPERSCRIPTS[char] ?? char).join(""),
            raised: true,
          }
        : { text: part, raised: false },
    );
}

// The one renderer for lesson text shown as prose (notes, captions, choice
// options, match and order items, fill-in sentences). Unicode superscript
// glyphs are drawn tiny and thin by most fonts, so exponents are set as real
// superscripts: at least three quarters of the text size (never below the
// 16px floor) and semibold, kept on one line with their base.
export function RichText({ text }: { text: string }) {
  const parts = splitSuperscripts(text);
  if (parts.every((part) => !part.raised)) return text;
  return parts.map((part, i) =>
    part.raised ? (
      <sup
        // Parts have no ids; their order is fixed by the text.
        // biome-ignore lint/suspicious/noArrayIndexKey: static list
        key={i}
        data-exponent
        className="text-[max(0.75em,1rem)] font-semibold leading-none"
      >
        {part.text}
      </sup>
    ) : (
      // biome-ignore lint/suspicious/noArrayIndexKey: static list
      <Fragment key={i}>{part.text}</Fragment>
    ),
  );
}
