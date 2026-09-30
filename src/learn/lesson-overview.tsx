"use client";

import {
  CircleCheck,
  Lightbulb,
  ListOrdered,
  Pause,
  Play,
  Rocket,
  Sparkles,
} from "lucide-react";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { BigButton } from "@/components/big-button";
import { BottomBar } from "@/components/bottom-bar";
import {
  ReadAloudButton,
  type ReadAloudState,
  useReadAloud,
} from "@/components/read-aloud";
import { RichText } from "@/components/rich-text";
import {
  type OverviewPart,
  type OverviewSentence,
  overviewParts,
  overviewSentences,
  overviewWordCount,
} from "@/content/overview";
import { parseKaraokeVtt, type TimedWord } from "@/lib/karaoke-vtt";
import { mediaUrl } from "@/lib/media";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { Owl } from "@/mascot/owl";
import type { Lesson, LessonOverview } from "@/schema/content";
import { RegistryVisual } from "@/visuals/registry-visual";

type Narration = NonNullable<LessonOverview["narration"]>;

// What is lit up while the overview is heard: a word of the narration, or a
// sentence of the device voice's reading.
type Reading = { word: number; sentence: number };
const NOT_READING: Reading = { word: -1, sentence: -1 };

// The narration's words with their times, or null while loading or when the
// captions do not match the overview text word for word (the overview was
// edited after the narration was built); the audio still plays then.
function useNarrationWords(
  narration: Narration | undefined,
  wordCount: number,
): TimedWord[] | null {
  const [words, setWords] = useState<TimedWord[] | null>(null);
  useEffect(() => {
    if (!narration) return;
    let live = true;
    fetch(mediaUrl(narration.vttUrl))
      .then((response) => (response.ok ? response.text() : ""))
      .then((vtt) => {
        const parsed = parseKaraokeVtt(vtt);
        if (live) setWords(parsed.length === wordCount ? parsed : null);
      })
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, [narration, wordCount]);
  return words;
}

type NarrationState = {
  playing: boolean;
  // 0–1 through the audio.
  progress: number;
  word: number;
  toggle: () => void;
  audio: ReactNode;
};

// The recorded narration: never starts on its own; the highlighted word
// follows the playhead on every frame while it plays.
function useNarration(
  narration: Narration | undefined,
  wordCount: number,
): NarrationState {
  const audioRef = useRef<HTMLAudioElement>(null);
  const words = useNarrationWords(narration, wordCount);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [word, setWord] = useState(-1);

  useEffect(() => {
    const element = audioRef.current;
    if (!element || !playing) return;
    let frame = 0;
    const tick = () => {
      const t = element.currentTime;
      setProgress(element.duration > 0 ? t / element.duration : 0);
      setWord(words ? words.findLastIndex((w) => w.start <= t) : -1);
      frame = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(frame);
  }, [playing, words]);

  const toggle = () => {
    const element = audioRef.current;
    if (!element) return;
    if (element.paused) void element.play().catch(() => setPlaying(false));
    else element.pause();
  };

  const audio = narration ? (
    <audio
      ref={audioRef}
      src={mediaUrl(narration.audioUrl)}
      preload="metadata"
      data-overview-audio
      onPlay={() => setPlaying(true)}
      onPause={() => setPlaying(false)}
      onEnded={() => {
        setPlaying(false);
        setWord(-1);
        setProgress(0);
      }}
    >
      {/* The page itself shows the words being said; the track carries
        the same captions for assistive technology. */}
      <track
        kind="captions"
        src={mediaUrl(narration.vttUrl)}
        srcLang="vi"
        label="Tiếng Việt"
      />
    </audio>
  ) : null;
  return { playing, progress, word: playing ? word : -1, toggle, audio };
}

function NarrationPlayer({ state }: { state: NarrationState }) {
  const Icon = state.playing ? Pause : Play;
  return (
    <div
      data-overview-narration={state.playing ? "playing" : "paused"}
      className="flex items-center gap-4 rounded-xl border-2 border-border bg-surface p-3 pr-5"
    >
      {state.audio}
      <button
        type="button"
        onClick={state.toggle}
        aria-label={state.playing ? "Tạm dừng" : "Nghe giới thiệu"}
        className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-card transition-transform duration-100 ease-out active:scale-[0.95] motion-reduce:transition-none"
      >
        <Icon
          aria-hidden
          className={`size-8 fill-current ${state.playing ? "" : "ml-1"}`}
        />
      </button>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <span className="font-semibold">
          {state.playing ? "Đang đọc…" : "Nghe giới thiệu"}
        </span>
        <span
          aria-hidden
          className="h-2 w-full overflow-hidden rounded-full bg-muted"
        >
          <span
            className="block h-full rounded-full bg-primary"
            style={{ width: `${Math.round(state.progress * 100)}%` }}
          />
        </span>
      </div>
    </div>
  );
}

// One sentence of the overview, word by word so the narration can light up
// the word being said; the device voice lights up the whole sentence.
function SentenceText({
  sentence,
  reading,
}: {
  sentence: OverviewSentence;
  reading: Reading;
}) {
  const active = reading.sentence === sentence.index;
  return (
    <span
      data-reading={active || undefined}
      className={`box-decoration-clone rounded-sm ${active ? "bg-reading" : ""}`}
    >
      {sentence.words.map((word, i) => {
        const at = sentence.firstWord + i;
        return (
          // Words of a fixed sentence never reorder.
          // biome-ignore lint/suspicious/noArrayIndexKey: static list
          <span key={i}>
            {i > 0 && " "}
            <span
              data-word-reading={at === reading.word || undefined}
              className={
                at === reading.word
                  ? "box-decoration-clone rounded-sm bg-reading"
                  : undefined
              }
            >
              <RichText text={word} />
            </span>
          </span>
        );
      })}
    </span>
  );
}

function PartText({
  part,
  reading,
}: {
  part: OverviewPart | undefined;
  reading: Reading;
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
  lesson: Pick<Lesson, "title"> & { overview: LessonOverview };
  onStart: () => void;
  startLabel: string;
  // Closes the overview onto the lesson's list of sections.
  onBrowse?: () => void;
};

// The lesson's opening screen: why it matters, before any exercise. It
// opens with an everyday situation (or the story's teaser), says what the
// lesson covers and what the child will be able to do, and can be heard:
// the recorded narration when the lesson has one, else the device voice.
export function LessonOverviewView({
  lesson,
  onStart,
  startLabel,
  onBrowse,
}: LessonOverviewViewProps) {
  const { overview } = lesson;
  const parts = useMemo(() => overviewParts(overview), [overview]);
  const sentences = useMemo(() => overviewSentences(parts), [parts]);
  const narration = useNarration(overview.narration, overviewWordCount(parts));
  const readAloud: ReadAloudState = useReadAloud(sentences.map((s) => s.text));
  const reading: Reading = overview.narration
    ? { word: narration.word, sentence: -1 }
    : readAloud.reading === null
      ? NOT_READING
      : { word: -1, sentence: readAloud.reading };
  // The text being heard stays on screen: the page follows it down, and the
  // document's scroll-padding keeps it above the bottom bar.
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  useEffect(() => {
    if (reading.word < 0 && reading.sentence < 0) return;
    rootRef.current
      ?.querySelector("[data-word-reading], [data-reading]")
      ?.scrollIntoView?.({
        block: "nearest",
        behavior: reducedMotion ? "auto" : "smooth",
      });
  }, [reading.word, reading.sentence, reducedMotion]);
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
            {lesson.title}
          </h1>
        </div>
      </header>

      {overview.narration ? (
        <NarrationPlayer state={narration} />
      ) : (
        <ReadAloudButton state={readAloud} className="self-start" />
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
            className="mx-auto inline-flex min-h-touch items-center gap-2 rounded-full px-4 font-semibold text-muted-foreground"
          >
            <ListOrdered aria-hidden className="size-5" />
            Xem các phần của bài
          </button>
        )}
      </BottomBar>
    </div>
  );
}
