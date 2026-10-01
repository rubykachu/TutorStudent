// @vitest-environment node

import { readFileSync } from "node:fs";
import { type Browser, chromium, type Page } from "@playwright/test";
import katex from "katex";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { findOverlaps } from "../e2e/overlap";
import { NOT_DIVIDES_MACRO, TEX_MACROS } from "../src/lib/tex";
import { DECORATIVE_ATTR } from "../src/visuals/shared/markers";

let browser: Browser;
let page: Page;

beforeAll(async () => {
  browser = await chromium.launch();
  page = await browser.newPage({ viewport: { width: 400, height: 600 } });
});
afterAll(async () => {
  await browser.close();
});

async function overlapsIn(html: string): Promise<string[]> {
  await page.setContent(
    `<style>body{margin:0;font:16px/1.4 Helvetica,Arial,sans-serif}
     [data-highlighted]{outline:4px solid red;outline-offset:2px}</style>
     <main>${html}</main>`,
  );
  return page.evaluate(findOverlaps, {
    scope: "main",
    decorativeAttr: DECORATIVE_ATTR,
  });
}

describe("findOverlaps catches real overlaps", () => {
  it("flags hint rings of a formula base and exponent crossing (5^3)", async () => {
    const issues = await overlapsIn(
      `<p style="font-size:48px;margin:40px">
         <span data-highlighted>5</span><sup data-highlighted style="margin-left:-6px">3</sup>
       </p>`,
    );
    expect(issues.some((i) => i.includes("hint ring"))).toBe(true);
  });

  it("flags a label drawn on top of a word", async () => {
    const issues = await overlapsIn(
      `<p style="position:relative;font-size:32px">Xin chào
         <span style="position:absolute;left:10px;top:4px">Nhãn</span></p>`,
    );
    expect(issues.some((i) => i.includes("overlaps text"))).toBe(true);
  });

  it("flags a hint ring painted over text it does not mark", async () => {
    const issues = await overlapsIn(
      `<p style="margin:20px"><span data-highlighted>abc</span></p>
       <p style="margin:-30px 0 0 20px">other words</p>`,
    );
    expect(issues.some((i) => i.includes("covers text"))).toBe(true);
  });
});

describe("findOverlaps leaves by-design layouts alone", () => {
  it("ignores a large sign whose font box reaches its label but whose ink does not", async () => {
    const issues = await overlapsIn(
      `<div style="display:flex;flex-direction:column;align-items:center">
         <span style="font-size:64px;line-height:1;font-weight:700">+</span>
         <span style="font-size:22px;margin-top:-12px">Dấu cộng</span>
       </div>`,
    );
    expect(issues).toEqual([]);
  });

  it("ignores a big SVG dot above a line of text below the drawing", async () => {
    const issues = await overlapsIn(
      `<svg width="200" height="60" viewBox="0 0 200 60">
         <text x="100" y="30" text-anchor="middle" dominant-baseline="central" font-size="60">·</text>
       </svg>
       <p style="margin:-14px 0 0 90px">2 and more</p>`,
    );
    expect(issues).toEqual([]);
  });

  it("ignores a greyed copy layered under its coloured twin when marked decorative", async () => {
    const layers = (mark: string) =>
      `<div style="display:grid"><div ${mark} style="grid-area:1/1">1 2 3</div>
       <div style="grid-area:1/1">1 2 3</div></div>`;
    expect(await overlapsIn(layers(DECORATIVE_ATTR))).toEqual([]);
    expect(await overlapsIn(layers(""))).not.toEqual([]);
  });

  it("ignores lines of one paragraph that touch through their leading", async () => {
    const issues = await overlapsIn(
      `<p style="width:120px;line-height:1.1">alpha beta gamma delta epsilon zeta</p>`,
    );
    expect(issues).toEqual([]);
  });

  it("ignores the slash TeX draws over the symbol of a negation (\\notin)", async () => {
    const css = readFileSync(
      "node_modules/katex/dist/katex.min.css",
      "utf8",
    ).replaceAll(/url\([^)]*\)/g, "none");
    const issues = await overlapsIn(
      `<style>${css}</style><p style="font-size:40px">${katex.renderToString("B \\notin 5")}</p>`,
    );
    expect(issues).toEqual([]);
  });

  it('ignores the slash over the "does not divide" sign', async () => {
    const css = readFileSync(
      "node_modules/katex/dist/katex.min.css",
      "utf8",
    ).replaceAll(/url\([^)]*\)/g, "none");
    const tex = katex.renderToString(`40 ${NOT_DIVIDES_MACRO} 6`, {
      macros: { ...TEX_MACROS },
    });
    const issues = await overlapsIn(
      `<style>${css}</style><p style="font-size:40px">${tex}</p>`,
    );
    expect(issues).toEqual([]);
  });

  it("ignores the slash over the equals sign of a not-equal (\\neq)", async () => {
    const css = readFileSync(
      "node_modules/katex/dist/katex.min.css",
      "utf8",
    ).replaceAll(/url\([^)]*\)/g, "none");
    const issues = await overlapsIn(
      `<style>${css}</style><p style="font-size:40px">${katex.renderToString("2^{3} = 8 \\neq 2 \\cdot 3 = 6")}</p>`,
    );
    expect(issues).toEqual([]);
  });
});
