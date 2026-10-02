"use client";

import {
  CircleCheck,
  Lightbulb,
  ListOrdered,
  LocateFixed,
  Play,
  Rocket,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { BigButton } from "@/components/big-button";
import { BottomBar } from "@/components/bottom-bar";
import { RichText } from "@/components/rich-text";
import {
  type OverviewPart,
  type OverviewSentence,
  overviewParts,
  overviewWordCount,
} from "@/content/overview";
import {
  NarrationMiniPlayer,
  NarrationPlayer,
  useMostlyInView,
  useNarration,
} from "@/learn/narration";
import {
  NARRATION_CONTROL_ATTR,
  useFollowReading,
} from "@/learn/use-follow-reading";
import { lessonHeading } from "@/lib/lesson-label";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { Owl } from "@/mascot/owl";
import type { Lesson, LessonOverview } from "@/schema/content";
import { RegistryVisual } from "@/visuals/registry-visual";

// One sentence of the overview, word by word so the narration can light up
// the word being said (`reading`: its position in the overview, -1 for none).
function SentenceText({
  sentence,
  reading,
}: {
  sentence: OverviewSentence;
  reading: number;
}) {
  return sentence.words.map((word, i) => {
    const at = sentence.firstWord + i;
    return (
      // Words of a fixed sentence never reorder.
      // biome-ignore lint/suspicious/noArrayIndexKey: static list
      <span key={i}>
        {i > 0 && " "}
        <span
          data-word-reading={at === reading || undefined}
          className={
            at === reading
              ? "box-decoration-clone rounded-sm bg-reading"
              : undefined
          }
        >
          <RichText text={word} />
        </span>
      </span>
    );
  });
}

function PartText({
  part,
  reading,
}: {
  part: OverviewPart | undefined;
  reading: number;
}) {
  if (!part) return null;
  return part.sentences.map((sentence, i) => (
    <span key={sentence.index}>
      {i > 0 && " "}
      <SentenceText sentence={sentence} reading={reading} />
    </span>
  ));
}

type LessonOverviewViewProps = {
  lesson: Pick<Lesson, "title" | "number"> & { overview: LessonOverview };
  onStart: () => void;
  startLabel: string;
  // Closes the overview onto the lesson's list of sections.
  onBrowse?: () => void;
};

// The lesson's opening screen: why it matters, before any exercise. It
// opens with an everyday situation (or the story's teaser), says what the
// lesson covers and what the child will be able to do, and can be heard
// when the lesson has a recorded narration.
export function LessonOverviewView({
  lesson,
  onStart,
  startLabel,
  onBrowse,
}: LessonOverviewViewProps) {
  const { overview } = lesson;
  const parts = useMemo(() => overviewParts(overview), [overview]);
  const narration = useNarration(overview.narration, overviewWordCount(parts));
  const reading = narration.word;
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const follow = useFollowReading({
    rootRef,
    reading,
    playing: narration.playing,
    reducedMotion,
  });
  // Once the player card has scrolled away, a slim player stays on screen.
  const cardRef = useRef<HTMLDivElement>(null);
  const cardInView = useMostlyInView(cardRef);
  const [closed, setClosed] = useState(false);
  useEffect(() => {
    if (narration.playing) setClosed(false);
  }, [narration.playing]);
  const showMini =
    Boolean(overview.narration) && !cardInView && narration.started && !closed;
  const find = (key: OverviewPart["key"], item = 0) =>
    parts.find((p) => p.key === key && p.item === item);
  const goals = parts.filter((p) => p.key === "goal");

  return (
    <div
      ref={rootRef}
      className="flex flex-1 flex-col gap-6"
      data-lesson-overview
    >
      <header className="flex items-center gap-4">
        <Owl expression="welcome" size="home" className="shrink-0" />
        <div className="flex min-w-0 flex-col gap-1">
          <p className="font-semibold text-muted-foreground">Giới thiệu bài</p>
          <h1 className="text-title font-bold md:text-title-lg">
            {lessonHeading(lesson)}
          </h1>
        </div>
      </header>

      {overview.narration && (
        <NarrationPlayer state={narration} containerRef={cardRef} />
      )}

      <section
        data-overview-part="hook"
        className="flex flex-col items-center gap-4 rounded-xl bg-surface p-5 shadow-card md:p-8"
      >
        {overview.hook.visualId && (
          <RegistryVisual id={overview.hook.visualId} />
        )}
        <p className="max-w-prose text-center font-heading text-block font-semibold md:text-block-lg">
          <PartText part={find("hook")} reading={reading} />
        </p>
      </section>

      <section data-overview-part="summary" className="flex flex-col gap-2">
        <h2 className="flex items-center gap-2 text-block font-semibold md:text-block-lg">
          <Sparkles aria-hidden className="size-6 text-primary" />
          Bài này nói về
        </h2>
        <p className="max-w-prose md:text-body-lg">
          <PartText part={find("summary")} reading={reading} />
        </p>
      </section>

      <section data-overview-part="goals" className="flex flex-col gap-3">
        <h2 className="flex items-center gap-2 text-block font-semibold md:text-block-lg">
          <Rocket aria-hidden className="size-6 text-primary" />
          <span>
            <PartText part={find("goalsLead")} reading={reading} />
          </span>
        </h2>
        <ul className="flex flex-col gap-3">
          {goals.map((goal) => (
            <li
              key={goal.item}
              data-overview-goal
              className="flex items-start gap-3 rounded-lg border-2 border-border bg-surface p-4 md:text-body-lg"
            >
              <CircleCheck
                aria-hidden
                className="mt-0.5 size-6 shrink-0 text-correct"
                strokeWidth={2.25}
              />
              <span>
                <PartText part={goal} reading={reading} />
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section
        data-overview-part="why"
        className="flex items-start gap-3 rounded-xl bg-streak-soft p-4 md:p-5"
      >
        <Lightbulb
          aria-hidden
          className="mt-0.5 size-7 shrink-0 text-streak"
          strokeWidth={2.25}
        />
        <p className="font-semibold md:text-body-lg">
          <PartText part={find("why")} reading={reading} />
        </p>
      </section>

      {showMini && (
        <NarrationMiniPlayer
          state={narration}
          onClose={() => {
            narration.stop();
            setClosed(true);
          }}
        />
      )}
      {follow.canResume && (
        <button
          type="button"
          onClick={follow.resume}
          data-narration-follow
          {...{ [NARRATION_CONTROL_ATTR]: "" }}
          className="-translate-x-1/2 fixed bottom-[calc(var(--bottom-bar-height,0px)+0.75rem)] left-1/2 z-20 inline-flex min-h-touch items-center gap-2 rounded-full bg-primary px-5 font-semibold text-primary-foreground shadow-card short:min-h-11"
        >
          <LocateFixed aria-hidden className="size-5" />
          Theo dõi lời đọc
        </button>
      )}

      <BottomBar>
        <BigButton onClick={onStart} data-overview-start>
          {startLabel}
          <Play aria-hidden className="size-6 fill-current" />
        </BigButton>
        {onBrowse && (
          <button
            type="button"
            onClick={onBrowse}
            data-overview-browse
            data-bar-secondary
            className="mx-auto inline-flex min-h-touch items-center gap-2 rounded-full px-4 font-semibold text-muted-foreground short:mx-0 short:min-h-11 short:whitespace-nowrap"
          >
            <ListOrdered aria-hidden className="size-5" />
            Xem các phần của bài
          </button>
        )}
      </BottomBar>
    </div>
  );
}
