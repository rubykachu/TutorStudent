import type { ComponentType } from "react";
import type { VisualProps } from "@/visuals/registry";
import { Lines, Rows } from "@/visuals/shared/formula-rows";
import { Chips } from "@/visuals/shared/pick-chips";
import type { VisualSpec } from "./catalog";
import { Clock, ClockPick } from "./clock";
import { Gaps } from "./gaps";
import { Places, PlacesExplore, PlacesPick } from "./places";
import { RomanCards } from "./roman-cards";
import { Slots } from "./slots";
import Sticker from "./sticker";
import { Sticks } from "./sticks";

// One registry entry per `VisualSpec` of the catalog: a component drawn with
// fixed numbers. This module is not a client module, so the dev visual page
// (a server component) may call `fromSpec` while loading a visual.
export function fromSpec(spec: VisualSpec): ComponentType<VisualProps> {
  switch (spec.kind) {
    case "rows":
      return function RowsVisual() {
        return <Rows spec={spec} />;
      };
    case "lines":
      return function LinesVisual() {
        return <Lines spec={spec} />;
      };
    case "chips":
      return function ChipsVisual(props: VisualProps) {
        return (
          <Chips
            items={spec.items}
            wants={spec.wants}
            done={spec.done}
            {...props}
          />
        );
      };
    case "places":
      return function PlacesVisual() {
        return <Places spec={spec} />;
      };
    case "placesExplore":
      return function PlacesExploreVisual({ params }: VisualProps) {
        return <PlacesExplore spec={spec} params={params} />;
      };
    case "placesPick":
      return function PlacesPickVisual() {
        return <PlacesPick spec={spec} />;
      };
    case "slots":
      return function SlotsVisual(props: VisualProps) {
        return <Slots spec={spec} {...props} />;
      };
    case "gaps":
      return function GapsVisual() {
        return <Gaps spec={spec} />;
      };
    case "clock":
      return function ClockVisual() {
        return <Clock spec={spec} />;
      };
    case "clockPick":
      return ClockPick;
    case "sticks":
      return function SticksVisual() {
        return <Sticks spec={spec} />;
      };
    case "romanCards":
      return function RomanCardsVisual() {
        return <RomanCards spec={spec} />;
      };
    case "sticker":
      return Sticker;
  }
}
