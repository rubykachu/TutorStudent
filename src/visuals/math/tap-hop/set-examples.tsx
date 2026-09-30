import type { ComponentType } from "react";
import type { VisualProps } from "@/visuals/registry";
import { ChooseX } from "./set-choose-x";
import { PickItems } from "./set-pick-items";

// Components and factories of the set visuals. This module is not a client
// module, so the dev visual page (a server component) may call its factories
// while loading a visual.

export {
  LapGhepLietKe,
  TheLietKe,
  TheXetThuoc,
  ThuocHopBut,
  ViDuLietKe,
  XetMau,
  XetViDu,
} from "./set-listing";
export {
  HopBut,
  ThePhanTu,
  TheTapHop,
  TomTatTapHop,
  ViDuPhanTu,
  ViDuTapHop,
} from "./set-objects";
export {
  DauHieuViDu,
  DocDauHieu,
  DoiTuLietKe,
  HaiCachViDu,
  TheDauHieu,
  TheDoiCach,
  TheHaiCach,
} from "./set-property";
export { default as Sticker } from "./set-sticker";
export { DauHieuCham, HopCham } from "./set-tap";

export function pickItems(items: string[]): ComponentType<VisualProps> {
  function Example(props: VisualProps) {
    return <PickItems items={items} {...props} />;
  }
  return Example;
}

export function chooseX(
  elements: number[],
  max: number,
  verdict: boolean,
  start: number,
): ComponentType<VisualProps> {
  function Example(props: VisualProps) {
    return (
      <ChooseX
        elements={elements}
        max={max}
        verdict={verdict}
        start={start}
        {...props}
      />
    );
  }
  return Example;
}
