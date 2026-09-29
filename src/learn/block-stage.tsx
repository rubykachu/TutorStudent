import type { ReactNode } from "react";
import { BlockView } from "@/components/blocks/block-view";
import type { SectionBlock, Video } from "@/schema/content";

type BlockStageProps = {
  block: SectionBlock;
  // Shown above the card, e.g. "Nhớ nhé!" on a recap.
  heading?: ReactNode;
  videos?: readonly Video[];
  // A recap screen: a visual's caption is the sentence to remember.
  recap?: boolean;
};

// One content block on a learning screen, centred in the height left between
// the header and the bottom bar so a short block never leaves a tall empty
// gap above the "Tiếp" button. On tall tablet screens (portrait iPad) a
// visual is drawn larger to use that height; phones and landscape tablets
// keep the size the visual was designed and screenshot-checked at. A lone
// note grows there too; the sentence of a group stays body text, so it reads
// as the lead-in to the example under it rather than competing with it.
export function BlockStage({
  block,
  heading,
  videos,
  recap = false,
}: BlockStageProps) {
  return (
    <div
      // The bottom padding on tall screens lifts the block a little above the
      // exact middle, where a centred block looks settled rather than sunk.
      className="flex flex-1 flex-col justify-center gap-6 py-2 tall:pb-16"
      data-block-stage
    >
      {heading && <div className="text-center">{heading}</div>}
      <div className="flex flex-col items-center rounded-xl bg-surface p-4 shadow-card md:p-8 tall:p-12 tall:[&>[data-block=note]]:text-block-lg tall:[&>[data-block=note]]:leading-normal tall:[&_[data-block=visual]>:first-child]:[zoom:1.3]">
        <BlockView block={block} videos={videos} leadCaption={recap} />
      </div>
    </div>
  );
}
