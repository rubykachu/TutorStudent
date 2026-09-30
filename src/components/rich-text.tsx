import { Fragment, type ReactNode } from "react";

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

// Membership signs are missing from the body font, so the browser draws them
// from a fallback font at about half the size of the text around them. They
// are set in the maths font instead, enlarged, so a child who is learning to
// read them sees them as clearly as a digit.
const SET_SIGNS = /([∈∉])/u;
// A chip, blank or option that is one sign on its own ("{", ";", ","): drawn
// large in the maths font so a comma and a semicolon never look alike.
const SINGLE_SIGN = /^[^\p{L}\p{N}\s]$/u;

function withSetSigns(text: string, keyPrefix: number): ReactNode {
  return text.split(SET_SIGNS).map((piece, j) =>
    SET_SIGNS.test(piece) ? (
      <span
        // biome-ignore lint/suspicious/noArrayIndexKey: static list
        key={`${keyPrefix}-${j}`}
        data-set-sign
        className="font-[KaTeX_Main] text-[1.3em] leading-none font-normal"
      >
        {piece}
      </span>
    ) : (
      // biome-ignore lint/suspicious/noArrayIndexKey: static list
      <Fragment key={`${keyPrefix}-${j}`}>{piece}</Fragment>
    ),
  );
}

// The one renderer for lesson text shown as prose (notes, captions, choice
// options, match and order items, fill-in sentences). Unicode superscript
// glyphs are drawn tiny and thin by most fonts, so exponents are set as real
// superscripts: at least three quarters of the text size (never below the
// 16px floor) and semibold, kept on one line with their base.
export function RichText({ text }: { text: string }) {
  if (SINGLE_SIGN.test(text)) {
    return (
      <span
        data-set-sign
        className="font-[KaTeX_Main] text-[1.5em] leading-none font-normal"
      >
        {text}
      </span>
    );
  }
  const parts = splitSuperscripts(text);
  if (parts.every((part) => !part.raised) && !SET_SIGNS.test(text)) return text;
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
      <Fragment key={i}>{withSetSigns(part.text, i)}</Fragment>
    ),
  );
}
