import type {
  ManipulateSolver,
  ManipulateValidator,
  VisualState,
} from "@/visuals/registry";

// The column multiplication exercise ("tich-cot", params `a` and `b`): the
// child types the product digit by digit. The visual reports one number per
// place value, 0 to 9, and the exercise is right when the digits spell a · b;
// zeros left of the first digit are not part of the number.
export const PRODUCT_PLACES = [
  { key: "thousands", value: 1000, label: "Nghìn" },
  { key: "hundreds", value: 100, label: "Trăm" },
  { key: "tens", value: 10, label: "Chục" },
  { key: "ones", value: 1, label: "Đơn vị" },
] as const;

export const PRODUCT_LIMIT = 10 ** PRODUCT_PLACES.length;

// Number spelled by the state, or undefined when a place is missing or not a
// digit.
export function spelledProduct(state: VisualState): number | undefined {
  let total = 0;
  for (const { key, value } of PRODUCT_PLACES) {
    const digit = state[key];
    if (digit === undefined || !Number.isInteger(digit)) return undefined;
    if (digit < 0 || digit > 9) return undefined;
    total += digit * value;
  }
  return total;
}

// The places of a number as a visual state.
export function productState(product: number): VisualState {
  return Object.fromEntries(
    PRODUCT_PLACES.map(({ key, value }) => [
      key,
      Math.floor(product / value) % 10,
    ]),
  );
}

function tichCot(state: VisualState, params: Record<string, number>): boolean {
  const { a, b } = params;
  if (a === undefined || b === undefined) return false;
  return spelledProduct(state) === a * b;
}

function solveTichCot(params: Record<string, number>): VisualState {
  const product = (params.a ?? 0) * (params.b ?? 0);
  if (product >= PRODUCT_LIMIT) {
    throw new Error(`a · b = ${product} has more than four digits`);
  }
  return productState(product);
}

export const validators = {
  "tich-cot": tichCot,
} satisfies Record<string, ManipulateValidator>;

export const solutions = {
  "tich-cot": solveTichCot,
} satisfies Record<string, ManipulateSolver>;
