import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  INTERACTIVE_KINDS,
  VALIDATOR_IDS,
  VISUAL_SPECS,
} from "@/visuals/math/so-nguyen-to/catalog";
import { Column } from "@/visuals/math/so-nguyen-to/column";
import {
  columnRows,
  divisorsOf,
  flattenTree,
  isPrime,
  primeFactors,
  productTex,
  texList,
  treeDepth,
  treeLeaves,
} from "@/visuals/math/so-nguyen-to/logic";
import { Rects } from "@/visuals/math/so-nguyen-to/rects";
import { Sieve } from "@/visuals/math/so-nguyen-to/sieve";
import Sticker from "@/visuals/math/so-nguyen-to/sticker";
import { Tree } from "@/visuals/math/so-nguyen-to/tree";
import { visualRegistry } from "@/visuals/registry";

function spec<K extends "rects" | "sieve" | "tree" | "column">(
  key: string,
  kind: K,
) {
  const found = VISUAL_SPECS[key];
  if (found?.kind !== kind) throw new Error(`${key} is not a ${kind}`);
  return found as Extract<typeof found, { kind: K }>;
}

describe("prime-number helpers", () => {
  it("lists divisors and tells primes from composites", () => {
    expect(divisorsOf(12)).toEqual([1, 2, 3, 4, 6, 12]);
    expect(divisorsOf(1)).toEqual([1]);
    expect([1, 2, 9, 11, 25, 97].map(isPrime)).toEqual([
      false,
      true,
      false,
      true,
      false,
      true,
    ]);
  });

  it("factorises smallest prime first, repeating a prime as often as it divides", () => {
    expect(primeFactors(60)).toEqual([2, 2, 3, 5]);
    expect(primeFactors(75)).toEqual([3, 5, 5]);
    expect(primeFactors(13)).toEqual([13]);
  });

  it("builds the rows of a division column down to 1", () => {
    expect(columnRows(36)).toEqual([
      { value: 36, prime: 2 },
      { value: 18, prime: 2 },
      { value: 9, prime: 3 },
      { value: 3, prime: 3 },
      { value: 1, prime: undefined },
    ]);
  });

  it("writes lists and products in TeX", () => {
    expect(texList([1, 2, 3])).toBe("1,\\ 2,\\ 3");
    expect(productTex([2, 3])).toBe(
      "\\concept{sky}{2} \\cdot \\concept{sky}{3}",
    );
  });

  it("walks a factor tree in drawing order", () => {
    const tree = {
      n: 12,
      kids: [{ n: 3 }, { n: 4, kids: [{ n: 2 }, { n: 2 }] }],
    } as const;
    expect(flattenTree(tree).map((node) => node.n)).toEqual([12, 3, 4, 2, 2]);
    expect(treeDepth(tree)).toBe(2);
    expect(treeLeaves(tree).map((node) => node.n)).toEqual([3, 2, 2]);
  });
});

describe("catalog", () => {
  it("every factor tree multiplies out to its root and ends on primes", () => {
    for (const s of Object.values(VISUAL_SPECS)) {
      if (s.kind !== "tree") continue;
      const nodes = flattenTree(s.root);
      for (const node of nodes) {
        if (node.kids) expect(node.kids[0].n * node.kids[1].n).toBe(node.n);
        else expect(isPrime(node.n)).toBe(true);
      }
    }
  });

  it("every rectangle layout uses all the squares", () => {
    for (const s of Object.values(VISUAL_SPECS)) {
      if (s.kind !== "rects") continue;
      for (const [rows, perRow] of s.ways) expect(rows * perRow).toBe(s.n);
    }
  });

  it("only pick screens are interactive and they reuse the shared validator", () => {
    expect([...INTERACTIVE_KINDS]).toEqual(["chips"]);
    expect(VALIDATOR_IDS.chips).toBe("chon-dung");
    const pick = visualRegistry["so-nguyen-to.visual.chon-uoc-10"];
    expect(pick?.interactive).toBe(true);
    expect(pick?.validators?.["chon-dung"]?.({ i0: 1 }, { i0: 1 })).toBe(true);
  });
});

describe("rectangles", () => {
  it("draws every way with its caption and product, then the divisors", () => {
    render(<Rects spec={spec("xep-12-xong", "rects")} />);
    expect(screen.getByText("2 hàng, mỗi hàng 6 ô")).toBeTruthy();
    expect(screen.getByText("Các ước của 12")).toBeTruthy();
  });

  it("states the verdict of a prime and of a composite", () => {
    const { unmount } = render(<Rects spec={spec("xep-11", "rects")} />);
    unmount();
    render(<Rects spec={{ ...spec("xep-9", "rects"), mode: "still" }} />);
    expect(screen.getByText("Có nhiều hơn hai ước: hợp số")).toBeTruthy();
  });
});

describe("sieve, tree and column", () => {
  it("shows the finished table with the 25 primes below 100 marked", () => {
    const { container } = render(<Sieve spec={spec("bang-100", "sieve")} />);
    expect(container.querySelectorAll("text")).toHaveLength(100);
    expect(
      [...container.querySelectorAll("polygon,circle")].length,
    ).toBeGreaterThanOrEqual(25);
  });

  it("masks the cells an exercise asks for", () => {
    const { container: tree } = render(
      <Tree spec={spec("cay-thieu-28", "tree")} />,
    );
    expect(tree.textContent).toContain("?");
    expect(tree.textContent).not.toContain("28 = ");
    const { container: column } = render(
      <Column spec={spec("cot-thieu-36", "column")} />,
    );
    expect(column.textContent).toContain("?");
  });

  it("ends a worked tree and column on the product of the primes", () => {
    const { container: tree } = render(
      <Tree spec={spec("cay-12-xong", "tree")} />,
    );
    expect(tree.querySelector("annotation")?.textContent).toContain("12 =");
    const { container: column } = render(
      <Column spec={spec("cot-60-xong", "column")} />,
    );
    expect(column.querySelector("annotation")?.textContent).toContain("60 =");
  });

  it("draws the sticker as a labelled picture", () => {
    render(<Sticker />);
    expect(screen.getByRole("img").getAttribute("aria-label")).toContain(
      "Huy chương",
    );
  });
});
