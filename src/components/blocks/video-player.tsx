"use client";

import { Captions, CaptionsOff, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { parseKaraokeCue, type TimedWord } from "@/lib/karaoke-vtt";
import { mediaUrl } from "@/lib/media";
import type { Video } from "@/schema/content";

export type VideoClip = Video["clips"][number];

type VideoPlayerProps = {
  video: Video;
  // Plays only this part of the video, e.g. the part that explains a card.
  clip?: VideoClip;
};

// A clip replays from its start once the child presses play past its end.
const CLIP_END_SLACK_S = 0.05;

// A lesson video. It never starts on its own (with sound or without, reduced
// motion or not): the child taps the big play button, and the native
// controls take over for pausing and seeking. Captions are on by default and
// drawn by the page, large and with the spoken word highlighted, from the
// karaoke timestamps in the WebVTT track; when the video goes native
// fullscreen (where the page cannot draw) the browser shows the track itself.
export function VideoPlayer({ video, clip }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const trackRef = useRef<HTMLTrackElement>(null);
  const [started, setStarted] = useState(false);
  const [captionsOn, setCaptionsOn] = useState(true);
  const [cue, setCue] = useState<TimedWord[]>([]);
  const [spoken, setSpoken] = useState(-1);

  // The track stays "hidden" (not `default`, which WebKit draws) so its cues
  // load and fire events without the browser drawing them over ours.
  useEffect(() => {
    const element = videoRef.current;
    const trackElement = trackRef.current;
    const track = trackElement?.track;
    if (!element || !trackElement || !track) return;
    const nativeFullscreen = (on: boolean) => {
      track.mode = on && captionsOn ? "showing" : "hidden";
    };
    nativeFullscreen(false);
    const onCueChange = () => {
      const active = track.activeCues?.[0] as VTTCue | undefined;
      setCue(active ? parseKaraokeCue(active.text, active.startTime) : []);
    };
    const onBegin = () => nativeFullscreen(true);
    const onEnd = () => nativeFullscreen(false);
    const onFullscreen = () =>
      nativeFullscreen(document.fullscreenElement === element);
    // WebKit may switch a track back on as it loads; keep it drawn by us.
    const onLoad = () => nativeFullscreen(false);
    trackElement.addEventListener("load", onLoad);
    track.addEventListener("cuechange", onCueChange);
    // iPad Safari plays fullscreen through its own events on the element.
    element.addEventListener("webkitbeginfullscreen", onBegin);
    element.addEventListener("webkitendfullscreen", onEnd);
    document.addEventListener("fullscreenchange", onFullscreen);
    return () => {
      trackElement.removeEventListener("load", onLoad);
      track.removeEventListener("cuechange", onCueChange);
      element.removeEventListener("webkitbeginfullscreen", onBegin);
      element.removeEventListener("webkitendfullscreen", onEnd);
      document.removeEventListener("fullscreenchange", onFullscreen);
    };
  }, [captionsOn]);

  // The highlighted word follows the playhead on every frame while playing;
  // `timeupdate` alone fires only a few times a second.
  useEffect(() => {
    const element = videoRef.current;
    if (!element || cue.length === 0) {
      setSpoken(-1);
      return;
    }
    let frame = 0;
    const tick = () => {
      cancelAnimationFrame(frame);
      const t = element.currentTime;
      setSpoken(cue.findLastIndex((w) => w.start <= t));
      if (!element.paused) frame = requestAnimationFrame(tick);
    };
    tick();
    element.addEventListener("play", tick);
    element.addEventListener("seeked", tick);
    return () => {
      cancelAnimationFrame(frame);
      element.removeEventListener("play", tick);
      element.removeEventListener("seeked", tick);
    };
  }, [cue]);

  const onPlay = () => {
    setStarted(true);
    const element = videoRef.current;
    if (!clip || !element) return;
    const t = element.currentTime;
    if (t < clip.start || t >= clip.end - CLIP_END_SLACK_S) {
      element.currentTime = clip.start;
    }
  };

  const onTimeUpdate = () => {
    const element = videoRef.current;
    if (clip && element && element.currentTime >= clip.end) element.pause();
  };

  // A media fragment makes the poster frame and first seek land on the clip.
  const src = clip
    ? `${mediaUrl(video.url)}#t=${clip.start},${clip.end}`
    : mediaUrl(video.url);

  return (
    <div data-block="video" data-video={video.id} className="w-full">
      <div className="relative w-full overflow-hidden rounded-lg bg-foreground">
        <video
          ref={videoRef}
          src={src}
          poster={mediaUrl(video.posterUrl)}
          controls={started}
          playsInline
          preload="metadata"
          // Captions come from the media store, which serves them to the app
          // with CORS once it is a separate domain.
          crossOrigin="anonymous"
          onPlay={onPlay}
          onTimeUpdate={onTimeUpdate}
          className="block aspect-video w-full"
        >
          <track
            ref={trackRef}
            kind="captions"
            src={mediaUrl(video.vttUrl)}
            srcLang="vi"
            label="Tiếng Việt"
          />
        </video>
        {!started && (
          <button
            type="button"
            aria-label="Phát video"
            data-video-play
            onClick={() => videoRef.current?.play()}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="flex size-20 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-card">
              <Play aria-hidden className="ml-1 size-10 fill-current" />
            </span>
          </button>
        )}
        {captionsOn && cue.length > 0 && (
          <p
            data-video-caption
            aria-hidden
            className={`pointer-events-none absolute inset-x-3 flex justify-center ${started ? "bottom-14" : "bottom-3"}`}
          >
            <span className="max-w-[90%] rounded-md bg-foreground/85 px-3 py-1 text-center font-semibold text-caption text-surface md:text-block-lg">
              {cue.map((word, i) => (
                <span
                  // Words of one cue never reorder.
                  // biome-ignore lint/suspicious/noArrayIndexKey: static list
                  key={i}
                  className={
                    i === spoken
                      ? "text-highlight"
                      : i < spoken
                        ? undefined
                        : "text-surface/75"
                  }
                >
                  {i > 0 && " "}
                  {word.text}
                </span>
              ))}
            </span>
          </p>
        )}
      </div>
      <button
        type="button"
        aria-pressed={captionsOn}
        onClick={() => setCaptionsOn((on) => !on)}
        className="mt-3 inline-flex min-h-12 items-center gap-2 rounded-lg border-2 border-border bg-surface px-4 font-semibold text-body text-foreground"
      >
        {captionsOn ? (
          <Captions aria-hidden className="size-6" />
        ) : (
          <CaptionsOff aria-hidden className="size-6" />
        )}
        {captionsOn ? "Phụ đề: bật" : "Phụ đề: tắt"}
      </button>
    </div>
  );
}
