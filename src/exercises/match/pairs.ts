// Left item id -> right item id. Content pairs every left item with its own
// right item (`content:check` rejects a right item used twice), so the UI
// keeps pairs one-to-one as well.
export type Pairs = Readonly<Record<string, string>>;

export type Side = "left" | "right";

// An item the child tapped and has not placed yet.
export type Armed = { side: Side; id: string };

// Pairs the two items, dropping any pair either of them was in before.
export function pairItems(pairs: Pairs, left: string, right: string): Pairs {
  const next: Record<string, string> = {};
  for (const [l, r] of Object.entries(pairs)) {
    if (l !== left && r !== right) next[l] = r;
  }
  next[left] = right;
  return next;
}

export function unpairLeft(pairs: Pairs, left: string): Pairs {
  return Object.fromEntries(Object.entries(pairs).filter(([l]) => l !== left));
}

export function leftOf(pairs: Pairs, right: string): string | undefined {
  return Object.entries(pairs).find(([, r]) => r === right)?.[0];
}

export type TapResult = { pairs: Pairs; armed: Armed | null };

// Tap-to-select-then-tap-to-place, the alternative to dragging. The first tap
// arms an item on either side; a tap on the other side pairs the two, or
// splits them when they already were a pair. Tapping the armed item again, or
// another item on the same side, re-arms.
export function tapItem(
  pairs: Pairs,
  armed: Armed | null,
  tapped: Armed,
): TapResult {
  if (!armed || armed.side === tapped.side) {
    const same = armed?.side === tapped.side && armed.id === tapped.id;
    return { pairs, armed: same ? null : tapped };
  }
  const left = tapped.side === "left" ? tapped.id : armed.id;
  const right = tapped.side === "right" ? tapped.id : armed.id;
  const next =
    Object.hasOwn(pairs, left) && pairs[left] === right
      ? unpairLeft(pairs, left)
      : pairItems(pairs, left, right);
  return { pairs: next, armed: null };
}
