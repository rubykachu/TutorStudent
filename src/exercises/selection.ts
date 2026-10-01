// Tap-to-toggle selection shared by the answer areas that pick a set of ids
// (choice options, sentences, regions). Ids keep the order they were first
// tapped in.
export function toggleId(selected: readonly string[], id: string): string[] {
  return selected.includes(id)
    ? selected.filter((other) => other !== id)
    : [...selected, id];
}

// The ids of the last check's mistakes the child still has chosen. A wrong
// check never edits a selection: a wrong pick stays on screen, marked, until
// the child taps it off, and a mark only ever sits on something chosen.
export function wrongPicks(
  wrong: ReadonlySet<string>,
  selected: readonly string[],
): ReadonlySet<string> {
  return new Set(selected.filter((id) => wrong.has(id)));
}
