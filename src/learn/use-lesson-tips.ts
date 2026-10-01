"use client";

import { useCallback, useEffect, useState } from "react";
import { lessonTipsUrl } from "@/content";
import { type LessonTips, LessonTipsSchema } from "@/schema/content";

export type LessonTipsState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; tips: LessonTips["tips"] };

// The tips of a lesson, fetched from its own static file (see
// `lessonTipsFile`) when its "Mẹo hay" page opens. `retry` fetches again
// after an error.
export function useLessonTips(lessonId: string): {
  state: LessonTipsState;
  retry: () => void;
} {
  const [state, setState] = useState<LessonTipsState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  // `attempt` only restarts the fetch below.
  // biome-ignore lint/correctness/useExhaustiveDependencies: see above
  useEffect(() => {
    let current = true;
    setState({ status: "loading" });
    const url = lessonTipsUrl(lessonId);
    fetch(url)
      .then(async (response) => {
        if (!response.ok) throw new Error(`${url} returned ${response.status}`);
        return LessonTipsSchema.parse(await response.json());
      })
      .then(
        (page) => {
          if (current) setState({ status: "ready", tips: page.tips });
        },
        () => {
          if (current) setState({ status: "error" });
        },
      );
    return () => {
      current = false;
    };
  }, [lessonId, attempt]);
  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { state, retry };
}
