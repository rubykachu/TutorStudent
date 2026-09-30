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

export function solveXIsMember(params: Record<string, number>): VisualState {
  const members = membersOf(params);
  if (params.want === 1) return { x: members[0] ?? 0 };
  let x = 0;
  while (members.includes(x)) x++;
  return { x };
}
