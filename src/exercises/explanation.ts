import { formatInteger, withMinusSign } from "@/lib/number-format";
import type { BasicExercise, Item } from "@/schema/content";

// What the panel under an answered exercise shows. An exercise with an
// authored `explain` shows that. One without (every lesson written before
// explanations existed) shows what its content already has: the solution
// visual and the accepted answer.

type Content = Item["content"];

export type ResolvedExplanation = {
  // Authored text explains why; a derived one only shows the solution.
  authored: boolean;
  text?: string;
  tex?: string;
  visualId?: string;
  // `choice`: why a tempting wrong option is wrong, with that option.
  wrong: { content: Content; text: string }[];
  // The accepted answer, one line per answer; a line with several contents
  // joins them with an arrow (match pairs).
  answer: Content[][];
};

function text(value: string): Content {
  return { type: "text", text: value };
}

function numberText(value: number): string {
  return withMinusSign(
    Number.isInteger(value)
      ? formatInteger(value)
      : String(value).replace(".", ","),
  );
}

function answerLines(exercise: BasicExercise): Content[][] {
  switch (exercise.type) {
    case "choice": {
      const answers = new Set(exercise.answer);
      return exercise.options
        .filter((option) => answers.has(option.id))
        .map((option) => [option.content]);
    }
    case "numeric": {
      const { answer, unit } = exercise;
      if (answer.kind === "power") {
        return [
          [
            {
              type: "formula",
              tex: `${answer.base < 0 ? `(${answer.base})` : answer.base}^{${answer.exponent}}`,
            },
          ],
        ];
      }
      const value = numberText(answer.value);
      return [[text(unit ? `${value} ${unit}` : value)]];
    }
    case "fillBlank":
      return exercise.segments.flatMap((segment) =>
        segment.type === "blank" && segment.accept[0] !== undefined
          ? [[text(segment.accept[0])]]
          : [],
      );
    case "match": {
      const byId = (items: readonly Item[], id: string) =>
        items.find((item) => item.id === id)?.content;
      return exercise.pairs.flatMap((pair) => {
        const left = byId(exercise.left, pair.left);
        const right = byId(exercise.right, pair.right);
        return left && right ? [[left, right]] : [];
      });
    }
    case "order":
      return exercise.items.map((item) => [item.content]);
    case "tapText": {
      const answers = new Set(exercise.answer);
      return exercise.prompt.flatMap((block) =>
        block.type === "passage"
          ? block.paragraphs.flatMap((paragraph) =>
              paragraph.sentences
                .filter((sentence) => answers.has(sentence.id))
                .map((sentence) => [text(sentence.text)]),
            )
          : [],
      );
    }
    case "tapRegion":
    case "manipulate":
      return [];
  }
}

function wrongReasons(exercise: BasicExercise): ResolvedExplanation["wrong"] {
  if (exercise.type !== "choice") return [];
  return (exercise.explain?.wrong ?? []).flatMap((reason) => {
    const option = exercise.options.find((o) => o.id === reason.optionId);
    return option ? [{ content: option.content, text: reason.text }] : [];
  });
}

// Null when there is nothing to show beyond the answer itself, which the
// answer area already reveals in place.
export function resolveExplanation(
  exercise: BasicExercise,
): ResolvedExplanation | null {
  const { explain } = exercise;
  if (explain) {
    return {
      authored: true,
      text: explain.text,
      tex: explain.tex,
      visualId: explain.visualId,
      wrong: wrongReasons(exercise),
      answer: [],
    };
  }
  const visualId = exercise.hints.solutionVisualId;
  const answer = answerLines(exercise);
  if (visualId === undefined && answer.length === 0) return null;
  return { authored: false, visualId, wrong: [], answer };
}
