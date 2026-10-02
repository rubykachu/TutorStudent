"use client";

import { Captions, CaptionsOff, LoaderCircle, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { parseKaraokeCue, type TimedWord } from "@/lib/karaoke-vtt";
import { mediaUrl } from "@/lib/media";
import type { Video } from "@/schema/content";

export type VideoClip = Video["clips"][number];

type VideoPlayerProps = {
  video: Video;
  // Plays only this part of the video, e.g. the part that explains a card.
  clip?: VideoClip;
  // How much the browser fetches before the child taps play: "auto" for a
  // video the child is looking at, "metadata" (the default) otherwise. The
  // video is only ever streamed, never saved on the device.
  preload?: "metadata" | "auto";
};

// A clip replays from its start once the child presses play past its end.
const CLIP_END_SLACK_S = 0.05;

// A lesson video. It never starts on its own (with sound or without, reduced
// motion or not): the child taps the big play button, and the native
// controls take over for pausing and seeking. It never stops by itself
// either: only the child pauses. Captions are on by default and drawn by the
// page, large and with the spoken word highlighted, from the karaoke
// timestamps in the WebVTT track: over the picture's bottom on a wide screen,
// in a strip under the picture on a phone (where an overlay would cover the
// picture and the native controls). When the video goes native fullscreen
// (where the page cannot draw) the browser shows the track itself.
export function VideoPlayer({
  video,
  clip,
  preload = "metadata",
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const trackRef = useRef<HTMLTrackElement>(null);
  const [started, setStarted] = useState(false);
  // True from the tap on play until the first frame runs, and again whenever
  // playback stalls to buffer: the spinner shows over the poster, so a tap
  // never meets a frozen picture.
  const [waiting, setWaiting] = useState(false);
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

  const play = () => {
    setWaiting(true);
    const element = videoRef.current;
    if (!element) return;
    // Older engines return nothing from `play()`.
    Promise.resolve(element.play()).catch(() => setWaiting(false));
  };

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
    // On a short, wide screen (a landscape tablet) the 16:9 picture would fill
    // the width and push the captions button under the bottom bar, so the
    // block is narrowed until picture, button and bar fit one screen.
    <div
      data-block="video"
      data-video={video.id}
      className="mx-auto w-full max-w-[max(20rem,calc((100dvh-26rem)*16/9))]"
    >
      <div className="relative w-full overflow-hidden rounded-lg bg-foreground">
        <video
          ref={videoRef}
          src={src}
          poster={mediaUrl(video.posterUrl)}
          controls={started}
          playsInline
          preload={preload}
          // Captions come from the media store, which serves them to the app
          // with CORS once it is a separate domain.
          crossOrigin="anonymous"
          onPlay={onPlay}
          onWaiting={() => setWaiting(true)}
          onPlaying={() => setWaiting(false)}
          onPause={() => setWaiting(false)}
          onError={() => setWaiting(false)}
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
        {!started && !waiting && (
          <button
            type="button"
            aria-label="Phát video"
            data-video-play
            onClick={play}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="flex size-20 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-card">
              <Play aria-hidden className="ml-1 size-10 fill-current" />
            </span>
          </button>
        )}
        {waiting && (
          <span
            role="status"
            aria-label="Đang tải video"
            data-video-spinner
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <span className="flex size-20 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-card">
              <LoaderCircle
                aria-hidden
                className="size-10 animate-spin motion-reduce:animate-none"
              />
            </span>
          </span>
        )}
        {captionsOn && (
          <p
            data-video-caption
            aria-hidden
            // Phone: a strip of its own below the picture, tall enough for two
            // lines so the card does not jump between cues. From `md`: over
            // the bottom of the picture, above the native controls once they
            // show.
            className={`flex min-h-16 items-center justify-center px-3 py-2 md:pointer-events-none md:absolute md:inset-x-3 md:min-h-0 md:p-0 ${started ? "md:bottom-14" : "md:bottom-3"}`}
          >
            <span className="max-w-full text-center font-semibold text-caption text-surface md:max-w-[90%] md:rounded-md md:bg-foreground/85 md:px-3 md:py-1 md:text-block-lg">
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
