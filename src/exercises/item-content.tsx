import { Formula } from "@/components/blocks/formula";
import type { Item } from "@/schema/content";
import { RegistryVisual } from "@/visuals/registry-visual";

// Content of a choice option, match item or order item.
export function ItemContent({ content }: { content: Item["content"] }) {
  switch (content.type) {
    case "text":
      return <span>{content.text}</span>;
    case "formula":
      return <Formula tex={content.tex} />;
    case "visual":
      return (
        <span className="block w-full">
          <RegistryVisual id={content.visualId} />
        </span>
      );
    case "image":
      return (
        // Content images come from the media bucket with unknown dimensions,
        // which next/image cannot lay out without extra config.
        // biome-ignore lint/performance/noImgElement: see above
        <img
          src={content.src}
          alt={content.alt}
          className="max-h-40 max-w-full rounded-sm"
        />
      );
  }
}
