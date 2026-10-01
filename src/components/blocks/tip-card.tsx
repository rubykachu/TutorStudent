import { Lightbulb, ShieldCheck, Zap } from "lucide-react";
import type { ComponentType } from "react";
import { Formula } from "@/components/blocks/formula";
import { RichText } from "@/components/rich-text";
import type { Tip, TipKind } from "@/schema/content";
import { RegistryVisual } from "@/visuals/registry-visual";

// How each kind of tip introduces itself: the icon is the second cue next to
// the label, so the kind never rests on colour or words alone.
const KIND_STYLE: Record<
  TipKind,
  { label: string; Icon: ComponentType<{ className?: string }> }
> = {
  "làm nhanh": { label: "Mẹo làm nhanh", Icon: Zap },
  "hiểu nhanh": { label: "Mẹo hiểu nhanh", Icon: Lightbulb },
  "tránh sai": { label: "Mẹo tránh sai", Icon: ShieldCheck },
};

// One tip: kind badge, the problem type it is for, the trick in a few words,
// and the formula or picture that carries it. The same card appears as a
// screen of a section and in the lesson's "Mẹo hay" list.
export function TipCard({ tip }: { tip: Tip }) {
  const { label, Icon } = KIND_STYLE[tip.kind];
  return (
    <article
      data-block="tip"
      data-tip-kind={tip.kind}
      className="flex w-full max-w-prose flex-col gap-4 rounded-xl border-3 border-tip bg-tip-soft p-4 text-tip-soft-foreground md:p-6"
    >
      <p
        data-tip-badge
        className="flex w-fit items-center gap-2 rounded-full bg-tip px-4 py-1 font-semibold text-caption text-white"
      >
        <Icon aria-hidden className="size-5" />
        {label}
      </p>
      <h3 className="font-bold font-heading text-block md:text-block-lg">
        <RichText text={tip.title} />
      </h3>
      <p>
        <RichText text={tip.text} />
      </p>
      {tip.tex && (
        <div
          data-tip-formula
          className="w-full overflow-x-auto rounded-lg bg-surface py-3 text-center text-foreground"
        >
          <Formula tex={tip.tex} />
        </div>
      )}
      {tip.visualId && (
        <div
          data-tip-visual
          className="flex w-full justify-center rounded-lg bg-surface p-2"
        >
          <RegistryVisual id={tip.visualId} />
        </div>
      )}
    </article>
  );
}
