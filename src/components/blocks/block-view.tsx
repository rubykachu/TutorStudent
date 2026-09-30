"use client";

import { Clapperboard } from "lucide-react";
import { Formula } from "@/components/blocks/formula";
import { VideoPlayer } from "@/components/blocks/video-player";
import { PassageReader } from "@/components/passage-reader";
import { type ReadAloudLayout, ReadAloudText } from "@/components/read-aloud";
import { RichText } from "@/components/rich-text";
import type { HighlightSpec } from "@/exercises/feedback";
import type { SectionBlock, Video } from "@/schema/content";
import { RegistryVisual } from "@/visuals/registry-visual";

type VideoBlock = Extract<SectionBlock, { type: "video" }>;

export type BlockViewProps = {
  block: SectionBlock;
  // Formula part / passage sentence id -> how a hint lights it up.
  parts?: ReadonlyMap<string, HighlightSpec>;
  // The lesson's videos; a video block whose video is not listed yet shows a
  // placeholder instead.
  videos?: readonly Video[];
  // A recap is one visual or formula, so the sentence to remember is the
  // visual's caption: drawn as body text above the example, the way a
  // group shows its note, instead of a grey caption under it.
  leadCaption?: boolean;
  // Where a note's or a passage's read-aloud button goes; see ReadAloudLayout.
  readAloudLayout?: ReadAloudLayout;
};

const NO_PARTS: ReadonlyMap<string, HighlightSpec> = new Map();

// The one renderer for content blocks, shared by lesson sections, recaps and
// exercise prompts so a block looks the same wherever it appears. A group
// stacks its parts on one screen: a rule sentence reads as centred body text
// with calm space before the example under it.
export function BlockView({
  block,
  parts = NO_PARTS,
  videos = [],
  leadCaption = false,
  readAloudLayout = "labelled",
}: BlockViewProps) {
  switch (block.type) {
    case "note":
      // A labelled speaker button sits above the sentence, aligned with it:
      // at the start in a prompt, centred where the screen centres the note.
      return (
        <div data-block="note" className="flex flex-col items-start gap-3">
          <ReadAloudText text={block.text} layout={readAloudLayout} />
        </div>
      );
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
              ...spec,
            }))}
          />
        </div>
      );
    case "visual":
      return (
        <figure
          data-block="visual"
          className={`flex w-full flex-col items-center ${leadCaption ? "gap-6" : "gap-2"}`}
        >
          {block.caption && leadCaption && (
            <figcaption
              data-lead-caption
              className="max-w-prose text-center text-foreground"
            >
              <RichText text={block.caption} />
            </figcaption>
          )}
          <RegistryVisual id={block.visualId} />
          {block.caption && !leadCaption && (
            <figcaption className="text-center text-caption text-muted-foreground">
              <RichText text={block.caption} />
            </figcaption>
          )}
        </figure>
      );
    case "passage":
      return (
        <div data-block="passage" className="w-full">
          <PassageReader
            passage={block}
            highlight={parts}
            readAloudLayout={readAloudLayout}
          />
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
    case "group":
      return (
        <div
          data-block="group"
          className="flex w-full flex-col items-center gap-6 [&>[data-block=note]]:max-w-prose [&>[data-block=note]]:items-center [&>[data-block=note]]:text-center"
        >
          {block.children.map((child, i) => (
            <BlockView
              // Children have no ids; their order is fixed content.
              // biome-ignore lint/suspicious/noArrayIndexKey: static list
              key={i}
              block={child}
              parts={parts}
              videos={videos}
              readAloudLayout={readAloudLayout}
            />
          ))}
        </div>
      );
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
  return <VideoPlayer video={video} clip={clip} />;
}
