// `wrongTargets` are local ids of answer-area elements (the `option` kind of a
// hint target), so the first feedback tier can light up exactly what to fix.
export type GradeResult = {
  correct: boolean;
  wrongTargets: readonly string[];
};

export function fromWrongTargets(wrongTargets: readonly string[]): GradeResult {
  return { correct: wrongTargets.length === 0, wrongTargets };
}

// Answers are keyed by content ids, and a kebab-case id such as "constructor"
// must never resolve to an Object.prototype member.
export function ownValue(
  record: Readonly<Record<string, string>>,
  key: string,
): string | undefined {
  return Object.hasOwn(record, key) ? record[key] : undefined;
}
