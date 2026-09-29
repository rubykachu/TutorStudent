// Tap-to-toggle selection shared by the answer areas that pick a set of ids
// (sentences, regions). Ids keep the order they were first tapped in.
export function toggleId(selected: readonly string[], id: string): string[] {
  return selected.includes(id)
    ? selected.filter((other) => other !== id)
    : [...selected, id];
}
