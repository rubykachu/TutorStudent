"use client";

import { Clapperboard } from "lucide-react";
import { Formula } from "@/components/blocks/formula";
import { PassageReader } from "@/components/passage-reader";
import type { HighlightSpec } from "@/exercises/feedback";
import type { Block, Video } from "@/schema/content";
import { RegistryVisual } from "@/visuals/registry-visual";

type VideoBlock = Extract<Block, { type: "video" }>;

export type BlockViewProps = {
  block: Block;
  // Formula part / passage sentence id -> how a hint lights it up.
  parts?: ReadonlyMap<string, HighlightSpec>;
  // The lesson's videos; a video block whose video is not listed yet shows a
  // placeholder instead.
  videos?: readonly Video[];
};

const NO_PARTS: ReadonlyMap<string, HighlightSpec> = new Map();

// The one renderer for content blocks, shared by lesson sections, recaps and
// exercise prompts so a block looks the same wherever it appears.
export function BlockView({
  block,
  parts = NO_PARTS,
  videos = [],
}: BlockViewProps) {
  switch (block.type) {
    case "note":
      return <p data-block="note">{block.text}</p>;
    case "formula":
      return (
        <div
          data-block="formula"
          className="w-full overflow-x-auto py-2 text-center"
        >
          <Formula
            tex={block.tex}
            highlight={[...parts].map(([id, spec]) => ({
              id,
              strong: spec.strong,
            }))}
          />
        </div>
      );
    case "visual":
      return (
        <figure
          data-block="visual"
          className="flex w-full flex-col items-center gap-2"
        >
          <RegistryVisual id={block.visualId} />
          {block.caption && (
            <figcaption className="text-center text-caption text-muted-foreground">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    case "passage":
      return (
        <div data-block="passage" className="w-full">
          <PassageReader passage={block} highlight={parts} />
        </div>
      );
    case "image":
      return (
        // Content images come from the media bucket with unknown dimensions,
        // which next/image cannot lay out without extra config.
        // biome-ignore lint/performance/noImgElement: see above
        <img
          data-block="image"
          src={block.src}
          alt={block.alt}
          className="mx-auto max-w-full rounded-lg"
        />
      );
    case "video":
      return <VideoView block={block} videos={videos} />;
  }
}

function VideoView({
  block,
  videos,
}: {
  block: VideoBlock;
  videos: readonly Video[];
}) {
  const video = videos.find((v) => v.id === block.videoId);
  if (!video) {
    return (
      <div
        data-block="video"
        data-video-missing
        className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-lg bg-muted text-muted-foreground"
      >
        <Clapperboard aria-hidden className="size-8" />
        <p>Video sắp có</p>
      </div>
    );
  }
  const clip = block.clipId
    ? video.clips.find((c) => c.id === block.clipId)
    : undefined;
  // A media fragment plays just the clip out of the whole lesson video.
  const src = clip ? `${video.url}#t=${clip.start},${clip.end}` : video.url;
  return (
    <video
      data-block="video"
      src={src}
      controls
      playsInline
      preload="metadata"
      className="w-full rounded-lg bg-muted"
    >
      <track kind="captions" src={video.vttUrl} srcLang="vi" default />
    </video>
  );
}
