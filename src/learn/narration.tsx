"use client";

import { Pause, Play, X } from "lucide-react";
import {
  type ReactNode,
  type Ref,
  type RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  loadingText,
  MediaLoadError,
  ProgressRing,
} from "@/components/media-loading";
import {
  MINI_PLAYER_HEIGHT_VAR,
  NARRATION_CONTROL_ATTR,
} from "@/learn/use-follow-reading";
import { parseKaraokeVtt, type TimedWord } from "@/lib/karaoke-vtt";
import { mediaUrl } from "@/lib/media";
import { bufferedFraction, percentLabel } from "@/lib/media-download";
import { useMediaSource } from "@/lib/use-media-source";
import type { LessonOverview } from "@/schema/content";

type Narration = NonNullable<LessonOverview["narration"]>;

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

export type NarrationState = {
  playing: boolean;
  // Played at least once and not yet finished: paused halfway counts.
  started: boolean;
  // The audio file is on its way (after the tap on play, or a stall).
  loading: boolean;
  // 0–1 of the file that arrived, undefined while its length is unknown.
  loadFraction: number | undefined;
  loadedBytes: number;
  // The download failed after the child asked to listen.
  failed: boolean;
  retry: () => void;
  // 0–1 through the audio.
  progress: number;
  word: number;
  toggle: () => void;
  // Pauses and keeps the place.
  stop: () => void;
  audio: ReactNode;
};

// The recorded narration: never starts on its own; the file is fetched on the
// first tap on play (with its percentage on screen) and played from memory;
// the highlighted word follows the playhead on every frame while it plays.
export function useNarration(
  narration: Narration | undefined,
  wordCount: number,
): NarrationState {
  const audioRef = useRef<HTMLAudioElement>(null);
  const words = useNarrationWords(narration, wordCount);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [word, setWord] = useState(-1);
  const source = useMediaSource(narration ? mediaUrl(narration.audioUrl) : "");
  const { phase, src: playable, request } = source;
  // The child tapped play and the audio starts as soon as its file is here.
  const [wanted, setWanted] = useState(false);
  const [stalled, setStalled] = useState(false);
  const [started, setStarted] = useState(false);
  const [buffered, setBuffered] = useState<number | undefined>();
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    const element = audioRef.current;
    if (!wanted || phase !== "ready" || !playable || !element) return;
    void element.play().catch(() => {
      setWanted(false);
      setPlaying(false);
    });
  }, [wanted, phase, playable]);

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
    if (wanted) {
      // Tapped again while the file loads: the child changed their mind.
      setWanted(false);
      return;
    }
    if (playing) {
      element.pause();
      return;
    }
    setWanted(true);
    setBroken(false);
    request();
  };

  const retry = () => {
    setBroken(false);
    if (phase === "error" || phase === "idle") {
      request();
      return;
    }
    const element = audioRef.current;
    element?.load();
    void element?.play().catch(() => setWanted(false));
  };

  const trackBuffered = () => {
    const element = audioRef.current;
    if (element) setBuffered(bufferedFraction(element));
  };
  const loadingFile = wanted && phase === "loading";
  const loading = loadingFile || stalled;
  const loadFraction = loadingFile
    ? source.progress
    : source.streamed
      ? buffered
      : 1;

  const audio = narration ? (
    <audio
      ref={audioRef}
      src={source.src}
      preload="auto"
      data-overview-audio
      onPlay={() => {
        setPlaying(true);
        setStarted(true);
        setWanted(false);
      }}
      onPause={() => {
        setPlaying(false);
        setStalled(false);
      }}
      onWaiting={() => {
        setStalled(true);
        trackBuffered();
      }}
      onPlaying={() => setStalled(false)}
      onProgress={trackBuffered}
      onError={() => {
        setStalled(false);
        if (source.src) setBroken(true);
      }}
      onEnded={() => {
        setPlaying(false);
        setStarted(false);
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
  return {
    playing,
    started: started || loading,
    loading,
    loadFraction,
    loadedBytes: source.receivedBytes,
    failed: wanted && (phase === "error" || broken),
    retry,
    progress,
    word: playing ? word : -1,
    toggle,
    stop: () => audioRef.current?.pause(),
    audio,
  };
}

export function NarrationPlayer({
  state,
  containerRef,
}: {
  state: NarrationState;
  containerRef?: Ref<HTMLDivElement>;
}) {
  const busy = state.loading && !state.failed;
  const Icon = state.playing ? Pause : Play;
  const fraction = busy ? state.loadFraction : state.progress;
  return (
    <div
      ref={containerRef}
      data-overview-narration={state.playing ? "playing" : "paused"}
      data-narration-control
      className="flex items-center gap-4 rounded-xl border-2 border-border bg-surface p-3 pr-5"
    >
      {state.audio}
      <span className="relative shrink-0">
        {busy && (
          <ProgressRing
            fraction={state.loadFraction}
            className="pointer-events-none absolute -inset-2.5"
          />
        )}
        <button
          type="button"
          onClick={state.toggle}
          aria-label={
            state.playing ? "Tạm dừng" : busy ? "Dừng tải" : "Nghe giới thiệu"
          }
          className="relative flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-card transition-transform duration-100 ease-out active:scale-[0.95] motion-reduce:transition-none"
        >
          <Icon
            aria-hidden
            className={`size-8 fill-current ${state.playing ? "" : "ml-1"}`}
          />
        </button>
      </span>
      {state.failed ? (
        <MediaLoadError
          onRetry={state.retry}
          className="min-w-0 flex-1 items-start text-left"
        />
      ) : (
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          {busy ? (
            <span
              data-narration-label
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={
                state.loadFraction === undefined
                  ? undefined
                  : percentLabel(state.loadFraction)
              }
              aria-valuetext={loadingText(
                state.loadFraction,
                state.loadedBytes,
              )}
              className="font-semibold"
            >
              {loadingText(state.loadFraction, state.loadedBytes)}
            </span>
          ) : (
            <span data-narration-label className="font-semibold">
              {state.playing ? "Đang đọc…" : "Nghe giới thiệu"}
            </span>
          )}
          <span
            aria-hidden
            className="h-2 w-full overflow-hidden rounded-full bg-muted"
          >
            <span
              className="block h-full rounded-full bg-primary"
              style={{ width: `${Math.round((fraction ?? 0) * 100)}%` }}
            />
          </span>
        </div>
      )}
    </div>
  );
}

// True while at least half of the element is on screen. Without
// IntersectionObserver (an old engine, a test) it counts as on screen.
export function useMostlyInView(ref: RefObject<Element | null>): boolean {
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) setInView(entry.intersectionRatio >= 0.5);
      },
      { threshold: [0, 0.5, 1] },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);
  return inView;
}

// The narration's controls, kept on screen once its card has scrolled away:
// a slim bar fixed to the top with pause or play, how far along it is and a
// close button (which pauses it). Never narrower than 44px to touch.
export function NarrationMiniPlayer({
  state,
  onClose,
}: {
  state: NarrationState;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const bar = ref.current;
    if (!bar) return;
    const root = document.documentElement;
    const publish = () =>
      root.style.setProperty(
        MINI_PLAYER_HEIGHT_VAR,
        `${bar.getBoundingClientRect().height}px`,
      );
    publish();
    const observer =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(publish);
    observer?.observe(bar);
    return () => {
      observer?.disconnect();
      root.style.removeProperty(MINI_PLAYER_HEIGHT_VAR);
    };
  }, []);

  const busy = state.loading && !state.failed;
  const Icon = state.playing ? Pause : Play;
  const fraction = busy ? state.loadFraction : state.progress;
  return (
    <div
      ref={ref}
      data-narration-mini
      {...{ [NARRATION_CONTROL_ATTR]: "" }}
      className="fixed inset-x-0 top-0 z-20 border-border border-b bg-surface pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)] shadow-card"
    >
      <div className="mx-auto flex max-w-content items-center gap-3 px-gutter py-2 short:py-1 md:px-gutter-lg">
        <button
          type="button"
          onClick={state.toggle}
          aria-label={
            state.playing ? "Tạm dừng" : busy ? "Dừng tải" : "Nghe tiếp"
          }
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-card active:scale-[0.95] motion-reduce:transition-none"
        >
          <Icon
            aria-hidden
            className={`size-6 fill-current ${state.playing ? "" : "ml-0.5"}`}
          />
        </button>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="font-semibold text-caption">
            {busy
              ? loadingText(state.loadFraction, state.loadedBytes)
              : state.playing
                ? "Đang đọc…"
                : "Đã dừng"}
          </span>
          <span
            role="progressbar"
            aria-label="Lời đọc đã qua"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percentLabel(fraction ?? 0)}
            className="h-2 w-full overflow-hidden rounded-full bg-muted"
          >
            <span
              className="block h-full rounded-full bg-primary"
              style={{ width: `${Math.round((fraction ?? 0) * 100)}%` }}
            />
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng trình nghe"
          className="flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-border bg-surface text-muted-foreground"
        >
          <X aria-hidden className="size-5" />
        </button>
      </div>
    </div>
  );
}
