import type { ComponentType } from "react";
import type { VisualProps } from "@/visuals/registry";
import type { VisualSpec } from "./catalog";
import {
  BacUuTien,
  BangDau,
  BangNgoac,
  BangNhanDong,
  ChiaHoiNguoc,
  DocBieuThuc,
  HoaDonHaiBan,
  HopLongNhau,
  HuongDanChamPhepTinh,
  NhanChiaOn,
  NhanHaiChuSo,
  SoSanhThuTu,
  Sticker,
  ThayChu,
  TimSoChuaBiet,
} from "./statics";
import { ExprSteps } from "./steps";
import { TapFirst } from "./tap-first";
import { TryIt } from "./try-it";

// One registry entry per `VisualSpec` of the catalog: a component drawn with
// fixed numbers. This module is not a client module, so the dev visual page
// (a server component) may call `fromSpec` while loading a visual.

const PICTURES = {
  hoaDonHaiBan: HoaDonHaiBan,
  bangDau: BangDau,
  docBieuThuc: DocBieuThuc,
  nhanChiaOn: NhanChiaOn,
  bangNgoac: BangNgoac,
  huongDanChamPhepTinh: HuongDanChamPhepTinh,
  sticker: Sticker,
} as const;
export type PictureName = keyof typeof PICTURES;

export function fromSpec(spec: VisualSpec): ComponentType<VisualProps> {
  switch (spec.kind) {
    case "picture":
      return PICTURES[spec.picture];
    case "steps": {
      const { source, mode, firstAt } = spec;
      return function Steps() {
        return <ExprSteps source={source} mode={mode} firstAt={firstAt} />;
      };
    }
    case "tap": {
      const { source } = spec;
      return function Tap() {
        return <TapFirst source={source} />;
      };
    }
    case "try": {
      const { source } = spec;
      return function Try({ onStateChange }: VisualProps) {
        return <TryIt source={source} onStateChange={onStateChange} />;
      };
    }
    case "compare": {
      const { source, wrongAt, wrongSource, leftLabel, wrongLabel, wrongTone } =
        spec;
      return function Compare() {
        return (
          <SoSanhThuTu
            source={source}
            wrongAt={wrongAt}
            wrongSource={wrongSource}
            leftLabel={leftLabel}
            wrongLabel={wrongLabel}
            wrongTone={wrongTone}
          />
        );
      };
    }
    case "divide": {
      const { dividend, divisor, mode } = spec;
      return function Divide() {
        return (
          <ChiaHoiNguoc dividend={dividend} divisor={divisor} mode={mode} />
        );
      };
    }
    case "split": {
      const { factor, digit, mode } = spec;
      return function Split() {
        return <NhanHaiChuSo factor={factor} digit={digit} mode={mode} />;
      };
    }
    case "times": {
      const { factor, last, mode } = spec;
      return function Times() {
        return <BangNhanDong factor={factor} last={last} mode={mode} />;
      };
    }
    case "findx": {
      const { coef, add, rhs, mode } = spec;
      return function FindX() {
        return <TimSoChuaBiet coef={coef} add={add} rhs={rhs} mode={mode} />;
      };
    }
    case "letters": {
      const { display, expanded, values, source, mode } = spec;
      return function Letters() {
        return (
          <ThayChu
            display={display}
            expanded={expanded}
            values={values}
            source={source}
            mode={mode}
          />
        );
      };
    }
    case "nested": {
      const { source } = spec;
      return function Nested() {
        return <HopLongNhau source={source} />;
      };
    }
    case "ladder": {
      const { rungs } = spec;
      return function Ladder() {
        return <BacUuTien rungs={rungs} />;
      };
    }
  }
}
