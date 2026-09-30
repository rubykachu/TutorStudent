"use client";

import { useState } from "react";
import { ReviewPlayer } from "@/learn/review-player";
import { appDb, childScope } from "@/progress/hooks";
import { LessonGate } from "../lesson-gate";

export function ReviewScreen({ lessonId }: { lessonId: string }) {
  // Each round is a fresh session chosen from the memory states at its start.
  const [round, setRound] = useState(0);
  return (
    <main className="mx-auto flex w-full max-w-content flex-1 lg:landscape:max-w-content-wide flex-col gap-4 px-gutter pt-4 md:px-gutter-lg md:pt-6">
      <LessonGate lessonId={lessonId}>
        {(index, profile) => (
          <ReviewPlayer
            key={round}
            db={appDb()}
            index={index}
            scope={childScope(profile.id)}
            onAgain={() => setRound(round + 1)}
          />
        )}
      </LessonGate>
    </main>
  );
}
