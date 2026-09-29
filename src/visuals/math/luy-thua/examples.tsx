import type { ComponentType } from "react";
import type { VisualProps } from "@/visuals/registry";
import { TapPower } from "./cham-luy-thua";
import { FactorList, type PowerSpec } from "./phan-tich";
import { ZeroExponent, type ZeroExponentMode } from "./so-mu-0";
import { HiddenExponentOne } from "./so-mu-an";
import { type Mode, RepeatedProduct } from "./tinh-tung-buoc";
import { PlaceValueSum } from "./tong-hang";

// Registry entries that reuse one component with fixed numbers. This module
// is not a client module, so the dev visual page (a server component) may
// call these factories while loading a visual.

export function repeatedProduct(
  base: number,
  exponent: number,
  mode: Mode,
): ComponentType<VisualProps> {
  function Example() {
    return <RepeatedProduct base={base} exponent={exponent} mode={mode} />;
  }
  return Example;
}

export function tapPower(
  base: number,
  exponent: number,
): ComponentType<VisualProps> {
  function Example() {
    return <TapPower base={base} exponent={exponent} />;
  }
  return Example;
}

export function zeroExponent(
  mode: ZeroExponentMode,
): ComponentType<VisualProps> {
  function Example() {
    return <ZeroExponent mode={mode} />;
  }
  return Example;
}

export function hiddenExponentOne(
  base: number,
  exponents: readonly number[],
): ComponentType<VisualProps> {
  function Example() {
    return <HiddenExponentOne base={base} exponents={exponents} />;
  }
  return Example;
}

export function factorList(
  powers: readonly PowerSpec[],
): ComponentType<VisualProps> {
  function Example() {
    return <FactorList powers={powers} />;
  }
  return Example;
}

export function placeValueSum(value: number): ComponentType<VisualProps> {
  function Example() {
    return <PlaceValueSum value={value} />;
  }
  return Example;
}
