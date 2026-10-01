// Pure helpers of the prime-number pictures: divisors, primality, the prime
// factors a column or tree shows, and the TeX of their lines. No React, so
// `content:check` and tests read it.

export const LESSON_SLUG = "so-nguyen-to";

// The prime tables list the numbers from 1 up to this value.
export const TABLE_LIMIT = 100;

export function divisorsOf(n: number): number[] {
  const divisors: number[] = [];
  for (let d = 1; d <= n; d++) {
    if (n % d === 0) divisors.push(d);
  }
  return divisors;
}

export function isPrime(n: number): boolean {
  return n > 1 && divisorsOf(n).length === 2;
}

// The prime factors of n from smallest to largest, repeated as often as they
// divide n: 60 gives 2, 2, 3, 5. The smallest prime divisor is taken first,
// which is the order of a division column.
export function primeFactors(n: number): number[] {
  const factors: number[] = [];
  let rest = n;
  for (let p = 2; rest > 1; p++) {
    while (rest % p === 0) {
      factors.push(p);
      rest /= p;
    }
  }
  return factors;
}

// One row of a division column: the number still to divide and the prime
// that divides it. The last row (value 1) has no divisor.
export type ColumnRow = { value: number; prime: number | undefined };

export function columnRows(n: number): ColumnRow[] {
  const rows: ColumnRow[] = [];
  let rest = n;
  for (const prime of primeFactors(n)) {
    rows.push({ value: rest, prime });
    rest /= prime;
  }
  rows.push({ value: rest, prime: undefined });
  return rows;
}

// The primes below `limit`, smallest first.
export function primesBelow(limit: number): number[] {
  return Array.from({ length: limit }, (_, i) => i + 1).filter(isPrime);
}

// A whole number in TeX with thousands grouped by thin spaces.
export function texInt(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "\\,");
}

// "1, 2, 3, 6" in TeX.
export function texList(numbers: readonly number[]): string {
  return numbers.map(texInt).join(",\\ ");
}

// "2 · 2 · 3 · 5" in TeX, every prime painted in the prime concept's colour.
export function productTex(factors: readonly number[]): string {
  return factors.map((f) => `\\concept{sky}{${f}}`).join(" \\cdot ");
}

// A node of a factor tree: a number and, unless it is a prime, the two
// numbers it splits into.
export type TreeNode = {
  n: number;
  kids?: readonly [TreeNode, TreeNode];
};

// The nodes of a tree in drawing order (parent before children, left before
// right); a `hide` list of a tree picture indexes this order.
export function flattenTree(root: TreeNode): TreeNode[] {
  return [root, ...(root.kids ?? []).flatMap(flattenTree)];
}

export function treeDepth(node: TreeNode): number {
  return node.kids ? 1 + Math.max(...node.kids.map(treeDepth)) : 0;
}

export function treeLeaves(node: TreeNode): TreeNode[] {
  return node.kids ? node.kids.flatMap(treeLeaves) : [node];
}
