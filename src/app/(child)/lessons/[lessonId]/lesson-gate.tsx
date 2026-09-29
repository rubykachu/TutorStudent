"use client";

import type { ReactNode } from "react";
import type { LessonIndex } from "@/content";
import type { ProfileRecord } from "@/progress/db";
import { requestLesson, useLesson } from "@/progress/hooks";
import { ContentError } from "../../content-error";
import { useRequiredProfile } from "../../use-required-profile";

type LessonGateProps = {
  lessonId: string;
  children: (index: LessonIndex, profile: ProfileRecord) => ReactNode;
};

// Every lesson screen needs the active child and the lesson file; this waits
// for both and offers a retry when the lesson cannot be fetched.
export function LessonGate({ lessonId, children }: LessonGateProps) {
  const profile = useRequiredProfile();
  const lesson = useLesson(lessonId);
  if (lesson.status === "error") {
    return (
      <ContentError
        message="Chưa tải được bài học. Mình thử lại nhé!"
        onRetry={() => requestLesson(lessonId)}
      />
    );
  }
  if (lesson.status === "loading" || !profile) return null;
  return children(lesson.index, profile);
}
