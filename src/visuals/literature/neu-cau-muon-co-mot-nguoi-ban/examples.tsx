import type { ComponentType } from "react";
import type { VisualProps } from "@/visuals/registry";
import { ComparisonParts } from "./rule-examples";

// Components shared by several registry entries: the labelled examples of
// rule screens, recaps and hints, the still versions of the step-by-step
// explainers, and factories that draw one component with fixed words. This
// module is not a client module, so the dev visual page (a server
// component) may call these factories while loading a visual.

export { CamXucTomTat } from "./cam-xuc-cao";
export { HanhTinhTomTat } from "./hanh-tinh";
export * from "./rule-examples";
export { SoSanhTacDungTomTat } from "./so-sanh-tac-dung";
export { TruocSauTomTat } from "./truoc-sau";
export { XichLaiGanTomTat } from "./xich-lai-gan";

export function comparisonParts(
  compared: string,
  word: string,
  image: string,
  middle?: string,
): ComponentType<VisualProps> {
  function Example() {
    return (
      <ComparisonParts
        compared={compared}
        word={word}
        image={image}
        middle={middle}
      />
    );
  }
  return Example;
}
