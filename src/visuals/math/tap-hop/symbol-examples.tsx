import type { ComponentType } from "react";
import type { VisualProps } from "@/visuals/registry";
import type { GlyphKey, TraceSymbol } from "./glyphs";
import { StrokeDemo } from "./stroke-demo";
import { SemicolonGaps } from "./symbol-gaps";
import { SymbolTiles } from "./symbol-tiles";
import { SymbolTrace } from "./symbol-trace";

// Explainers, examples and factories of the symbols section. This module is
// not a client module, so the dev visual page (a server component) may call
// its factories while loading a visual.

export * from "./symbol-static";

function demo(symbol: TraceSymbol): ComponentType<VisualProps> {
  function Demo() {
    return <StrokeDemo symbol={symbol} />;
  }
  return Demo;
}

export const VeMoNgoac = demo("ngoac-mo");
export const VeDongNgoac = demo("ngoac-dong");
export const VeChamPhay = demo("cham-phay");
export const VeThuoc = demo("thuoc");
export const VeKhongThuoc = demo("khong-thuoc");

// The child draws the mark by tapping its start dots in order.
export function tapNet(
  symbol: "ngoac-mo" | "ngoac-dong" | "thuoc" | "khong-thuoc",
): ComponentType<VisualProps> {
  function Example(props: VisualProps) {
    return <SymbolTrace symbol={symbol} {...props} />;
  }
  return Example;
}

// A row of `count` numbers whose gaps the child fills with ";".
export function datChamPhay(count: number): ComponentType<VisualProps> {
  function Example(props: VisualProps) {
    return <SemicolonGaps count={count} {...props} />;
  }
  return Example;
}

// Tiles of the given marks, one tappable region per key in the order given.
export function symbolTap(
  keys: readonly GlyphKey[],
): ComponentType<VisualProps> {
  function Example() {
    return <SymbolTiles keys={keys} />;
  }
  return Example;
}
