import { Glyph, type GlyphKey } from "./glyphs";
import { SymbolLine, type Token } from "./symbol-line";

export type SymbolCardData = {
  glyph: GlyphKey;
  // How the mark is read aloud ("mở ngoặc nhọn").
  reading: string;
  example: { tokens: readonly Token[]; label: string };
  // How the mark is written ("3 nét, từ trên xuống").
  how: string;
};

// Recap image of one mark: the big glyph, its name, the mark inside an
// example and how to write it. Every symbol card is this one component.
export function SymbolCard({ glyph, reading, example, how }: SymbolCardData) {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex items-center justify-center rounded-2xl bg-muted px-8 py-3">
        <Glyph name={glyph} sizeClass="h-32" />
      </div>
      <p className="text-center font-heading text-block font-bold md:text-block-lg">
        {`Đọc: ${reading}`}
      </p>
      <SymbolLine tokens={example.tokens} label={example.label} size="md" />
      <p className="text-center text-body font-semibold">{`Viết: ${how}`}</p>
    </div>
  );
}
