// What changed in a lesson since the version that was last reviewed, so a
// later review round reads only those parts (`pnpm content:diff`). Works on
// raw lesson JSON: an old reviewed version may not parse with today's schema.

type Json = unknown;
type Obj = Record<string, Json>;

export type DiffKind = "added" | "removed" | "changed";

export interface DiffEntry {
  kind: DiffKind;
  // "section <id>", "section <id> blocks[2]", "exercise <id>", "lesson", ...
  unit: string;
  // Text leaves (path relative to the unit, then value) before and after;
  // for "changed", only the leaves that differ.
  before: [string, string][];
  after: [string, string][];
}

export interface LessonDiff {
  entries: DiffEntry[];
  // Sections holding a changed item, whose neighbours the reviewer rechecks.
  sections: { id: string; title: string }[];
}

const isObj = (value: Json): value is Obj =>
  value !== null && typeof value === "object" && !Array.isArray(value);
const asArray = (value: Json): Obj[] =>
  Array.isArray(value) ? value.filter(isObj) : [];
const idOf = (value: Obj): string => String(value.id ?? "");
const same = (a: Json, b: Json) => JSON.stringify(a) === JSON.stringify(b);

// Every primitive in `value`, keyed by its path ("options[1].content.text").
export function textLeaves(value: Json, prefix = ""): [string, string][] {
  if (Array.isArray(value)) {
    return value.flatMap((child, i) => textLeaves(child, `${prefix}[${i}]`));
  }
  if (isObj(value)) {
    return Object.entries(value).flatMap(([key, child]) =>
      textLeaves(child, prefix ? `${prefix}.${key}` : key),
    );
  }
  if (value === undefined) return [];
  return [[prefix || "(value)", String(value)]];
}

function compare(unit: string, before: Json, after: Json): DiffEntry[] {
  if (before === undefined && after === undefined) return [];
  if (before === undefined) {
    return [{ kind: "added", unit, before: [], after: textLeaves(after) }];
  }
  if (after === undefined) {
    return [{ kind: "removed", unit, before: textLeaves(before), after: [] }];
  }
  if (same(before, after)) return [];
  const old = new Map(textLeaves(before));
  const next = new Map(textLeaves(after));
  return [
    {
      kind: "changed",
      unit,
      before: [...old].filter(([key, value]) => next.get(key) !== value),
      after: [...next].filter(([key, value]) => old.get(key) !== value),
    },
  ];
}

// Blocks carry no id, so they are aligned by content (longest common
// subsequence); an unmatched block facing an unmatched block is "changed".
function compareBlocks(unit: string, before: Json[], after: Json[]) {
  const n = before.length;
  const m = after.length;
  const lcs = Array.from({ length: n + 1 }, () => Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      lcs[i][j] = same(before[i], after[j])
        ? lcs[i + 1][j + 1] + 1
        : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }
  const entries: DiffEntry[] = [];
  let removed: number[] = [];
  let added: number[] = [];
  const flush = () => {
    const paired = Math.min(removed.length, added.length);
    for (let k = 0; k < paired; k++) {
      entries.push(
        ...compare(
          `${unit} blocks[${added[k]}]`,
          before[removed[k]],
          after[added[k]],
        ),
      );
    }
    for (const i of removed.slice(paired)) {
      entries.push(...compare(`${unit} blocks[${i}]`, before[i], undefined));
    }
    for (const j of added.slice(paired)) {
      entries.push(...compare(`${unit} blocks[${j}]`, undefined, after[j]));
    }
    removed = [];
    added = [];
  };
  let i = 0;
  let j = 0;
  while (i < n || j < m) {
    if (i < n && j < m && same(before[i], after[j])) {
      flush();
      i++;
      j++;
    } else if (j >= m || (i < n && lcs[i + 1][j] >= lcs[i][j + 1])) {
      removed.push(i++);
    } else {
      added.push(j++);
    }
  }
  flush();
  return entries;
}

function byId(items: Obj[]): Map<string, Obj> {
  return new Map(items.map((item) => [idOf(item), item]));
}

function compareCollection(
  label: string,
  before: Json,
  after: Json,
  split?: (id: string, old?: Obj, next?: Obj) => DiffEntry[],
): DiffEntry[] {
  const old = byId(asArray(before));
  const next = byId(asArray(after));
  const ids = [
    ...next.keys(),
    ...[...old.keys()].filter((id) => !next.has(id)),
  ];
  return ids.flatMap((id) =>
    split
      ? split(id, old.get(id), next.get(id))
      : compare(`${label} ${id}`, old.get(id), next.get(id)),
  );
}

const LESSON_PARTS = ["sections", "cards", "exercises", "videos"];
// Written by the review itself, never reviewed.
const REVIEW_FIELDS = ["status", "reviewedHash"];

export function diffLessons(before: Json, after: Json): LessonDiff {
  const old = isObj(before) ? before : {};
  const next = isObj(after) ? after : {};
  const rest = (lesson: Obj) =>
    Object.fromEntries(
      Object.entries(lesson).filter(
        ([key]) => !LESSON_PARTS.includes(key) && !REVIEW_FIELDS.includes(key),
      ),
    );
  const entries = [
    ...compare("lesson", rest(old), rest(next)),
    ...compareCollection("section", old.sections, next.sections, (id, a, b) => {
      const unit = `section ${id}`;
      if (!a || !b) return compare(unit, a, b);
      const { blocks: oldBlocks, recap: oldRecap, ...oldFields } = a;
      const { blocks: newBlocks, recap: newRecap, ...newFields } = b;
      return [
        ...compare(unit, oldFields, newFields),
        ...compareBlocks(
          unit,
          Array.isArray(oldBlocks) ? oldBlocks : [],
          Array.isArray(newBlocks) ? newBlocks : [],
        ),
        ...compare(`${unit} recap`, oldRecap, newRecap),
      ];
    }),
    ...compareCollection("card", old.cards, next.cards),
    ...compareCollection("exercise", old.exercises, next.exercises),
    ...compareCollection("video", old.videos, next.videos),
  ];
  return { entries, sections: touchedSections(entries, next, old) };
}

// A changed exercise belongs to the sections that list it; a changed card or
// review-bank exercise to the sections practising that card; a video to the
// sections that show it.
function touchedSections(entries: DiffEntry[], next: Obj, old: Obj) {
  const sections = [...asArray(next.sections), ...asArray(old.sections)];
  const exercises = [...asArray(next.exercises), ...asArray(old.exercises)];
  const listed = (section: Obj) =>
    [section.checkIds, section.practiceIds].flatMap((ids) =>
      Array.isArray(ids) ? ids.map(String) : [],
    );
  const cardsOf = (exerciseId: string) =>
    exercises
      .filter((exercise) => idOf(exercise) === exerciseId)
      .flatMap((exercise) =>
        Array.isArray(exercise.cardIds) ? exercise.cardIds.map(String) : [],
      );
  const practises = (section: Obj, cardId: string) =>
    listed(section).some((id) => cardsOf(id).includes(cardId));

  const hit = new Set<string>();
  for (const { unit } of entries) {
    const [label, id] = unit.split(" ");
    for (const section of sections) {
      const sectionId = idOf(section);
      const matches =
        (label === "section" && id === sectionId) ||
        (label === "exercise" &&
          (listed(section).includes(id) ||
            cardsOf(id).some((card) => practises(section, card)))) ||
        (label === "card" && practises(section, id)) ||
        (label === "video" &&
          JSON.stringify(section.blocks ?? []).includes(`"${id}"`));
      if (matches) hit.add(sectionId);
    }
  }
  return asArray(next.sections)
    .concat(asArray(old.sections))
    .filter(
      (section, i, all) =>
        hit.has(idOf(section)) &&
        all.findIndex((s) => idOf(s) === idOf(section)) === i,
    )
    .map((section) => ({ id: idOf(section), title: String(section.title) }));
}

export function formatDiff(diff: LessonDiff): string {
  if (diff.entries.length === 0) return "No change since the reviewed version.";
  const lines: string[] = [];
  for (const entry of diff.entries) {
    lines.push(`${entry.kind} ${entry.unit}`);
    for (const [key, value] of entry.before) lines.push(`  - ${key}: ${value}`);
    for (const [key, value] of entry.after) lines.push(`  + ${key}: ${value}`);
  }
  lines.push(
    "",
    "Sections to review with their neighbours (same section):",
    ...diff.sections.map((s) => `  ${s.id} (${s.title})`),
  );
  return lines.join("\n");
}
