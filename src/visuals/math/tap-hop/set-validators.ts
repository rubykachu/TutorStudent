import type { VisualState } from "@/visuals/registry";

// Validators of the lesson's set visuals. "Pick items" visuals report one
// key per candidate, { i0, i1, … } with 1 = inside the box; "choose x"
// visuals report { x }.

// Every candidate named in params is inside (1) or outside (0) as asked; a
// candidate the child never touched counts as outside.
export function pickMatches(
  state: VisualState,
  params: Record<string, number>,
): boolean {
  return Object.entries(params).every(
    ([key, want]) => (state[key] ?? 0) === want,
  );
}

export function solvePickMatches(params: Record<string, number>): VisualState {
  return { ...params };
}

// Elements of the set a "choose x" exercise describes: params.e0 … e(count-1).
function membersOf(params: Record<string, number>): number[] {
  const members: number[] = [];
  for (let i = 0; i < (params.count ?? 0); i++) {
    const member = params[`e${i}`];
    if (member !== undefined) members.push(member);
  }
  return members;
}

// x is (want = 1) or is not (want = 0) an element of the set. An x the child
// never chose is no answer, so it never passes.
export function xIsMember(
  state: VisualState,
  params: Record<string, number>,
): boolean {
  const { x } = state;
  if (x === undefined) return false;
  return (membersOf(params).includes(x) ? 1 : 0) === params.want;
}

// For "not an element", prefers a number squeezed between two elements, so
// the one-step neighbours of the solution are elements and the answer is seen
// as a single, deliberate choice.
export function solveXIsMember(params: Record<string, number>): VisualState {
  const members = membersOf(params);
  if (params.want === 1) return { x: members[0] ?? 0 };
  const outside = (n: number) => n >= 0 && !members.includes(n);
  const top = Math.max(0, ...members) + 1;
  const all = Array.from({ length: top + 1 }, (_, n) => n).filter(outside);
  const squeezed = all.find(
    (n) => members.includes(n - 1) && members.includes(n + 1),
  );
  return { x: squeezed ?? all[0] ?? 0 };
}
