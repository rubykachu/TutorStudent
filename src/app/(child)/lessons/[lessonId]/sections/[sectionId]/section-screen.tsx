"use client";

import { useLiveQuery } from "dexie-react-hooks";
import type { ReactNode } from "react";
import { SectionPlayer } from "@/learn/section-player";
import { SECTION_START, type SectionPosition } from "@/progress/db";
import { appDb, childScope } from "@/progress/hooks";
import { LessonGate } from "../../lesson-gate";

function SectionResume({
  childId,
  lessonId,
  sectionId,
  children,
}: {
  childId: string;
  lessonId: string;
  sectionId: string;
  children: (position: SectionPosition) => ReactNode;
}) {
  const scope = childScope(childId);
  // `null` once read and absent, so the player waits for the saved place
  // instead of flashing the first block.
  const record = useLiveQuery(
    async () =>
      (await appDb().sectionProgress.get([
        scope.familyId,
        scope.childId,
        sectionId,
      ])) ?? null,
    [scope.familyId, scope.childId, sectionId],
  );
  if (record === undefined) return null;
  return children(
    record && record.lessonId === lessonId ? record.position : SECTION_START,
  );
}

export function SectionScreen({
  lessonId,
  sectionId,
}: {
  lessonId: string;
  sectionId: string;
}) {
  return (
    <main className="mx-auto flex w-full max-w-content flex-1 lg:landscape:max-w-content-wide flex-col gap-4 px-gutter pt-4 md:px-gutter-lg md:pt-6">
      <LessonGate lessonId={lessonId}>
        {(index, profile) => {
          const section = index.sectionById.get(sectionId);
          if (!section) return null;
          return (
            <SectionResume
              childId={profile.id}
              lessonId={lessonId}
              sectionId={sectionId}
            >
              {(position) => (
                <SectionPlayer
                  // The player reads the saved place only when it mounts.
                  key={sectionId}
                  db={appDb()}
                  index={index}
                  section={section}
                  scope={childScope(profile.id)}
                  initialPosition={position}
                />
              )}
            </SectionResume>
          );
        }}
      </LessonGate>
    </main>
  );
}
