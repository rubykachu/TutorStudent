import type { ComponentType } from "react";
import type { VisualProps } from "@/visuals/registry";
import type { VisualSpec } from "./catalog";
import { Column, ColumnTry } from "./column";
import { CheckBySum, FactFamily, FindX } from "./find";
import {
  BarModel,
  EquationLabels,
  EquationTap,
  Sticker,
  Swap,
  ZeroWallet,
} from "./parts";
import { LastDigit, UpperBound } from "./quick-check";
import { PairTry, Regroup } from "./regroup";
import { Shift, ShiftTry } from "./shift";

// One registry entry per `VisualSpec` of the catalog: a component drawn with
// fixed numbers. This module is not a client module, so the dev visual page
// (a server component) may call `fromSpec` while loading a visual.

export function fromSpec(spec: VisualSpec): ComponentType<VisualProps> {
  switch (spec.kind) {
    case "labels": {
      const { op, a, b } = spec;
      return function Labels() {
        return <EquationLabels op={op} a={a} b={b} />;
      };
    }
    case "tap-parts": {
      const { op, a, b } = spec;
      return function TapParts() {
        return <EquationTap op={op} a={a} b={b} />;
      };
    }
    case "bar": {
      const { op, a, b, mode } = spec;
      return function Bar() {
        return <BarModel op={op} a={a} b={b} mode={mode} />;
      };
    }
    case "swap": {
      const { a, b, mode } = spec;
      return function SwapPicture() {
        return <Swap a={a} b={b} mode={mode} />;
      };
    }
    case "zero": {
      const { n } = spec;
      return function Zero() {
        return <ZeroWallet n={n} />;
      };
    }
    case "sticker":
      return Sticker;
    case "regroup": {
      const { numbers, groups, mode } = spec;
      return function Regrouped() {
        return <Regroup numbers={numbers} groups={groups} mode={mode} />;
      };
    }
    case "pair-try": {
      const { numbers, unit } = spec;
      return function Pairs(props: VisualProps) {
        return <PairTry numbers={numbers} unit={unit} {...props} />;
      };
    }
    case "shift": {
      const { op, a, b, delta, mode } = spec;
      return function Shifted() {
        return <Shift op={op} a={a} b={b} delta={delta} mode={mode} />;
      };
    }
    case "shift-try": {
      const { a, b, unit } = spec;
      return function ShiftChoice(props: VisualProps) {
        return <ShiftTry a={a} b={b} unit={unit} {...props} />;
      };
    }
    case "column": {
      const { op, a, b, mode } = spec;
      return function Written() {
        return <Column op={op} a={a} b={b} mode={mode} />;
      };
    }
    case "column-try": {
      const { op, a, b, column } = spec;
      return function WrittenTry(props: VisualProps) {
        return <ColumnTry op={op} a={a} b={b} column={column} {...props} />;
      };
    }
    case "find": {
      const { form, a, t, mode } = spec;
      return function Unknown() {
        return <FindX form={form} a={a} t={t} mode={mode} />;
      };
    }
    case "family": {
      const { total, p1, p2, mode, names } = spec;
      return function Family() {
        return (
          <FactFamily total={total} p1={p1} p2={p2} mode={mode} names={names} />
        );
      };
    }
    case "check-sum": {
      const { a, b, mode } = spec;
      return function CheckSum() {
        return <CheckBySum a={a} b={b} mode={mode} />;
      };
    }
    case "last-digit": {
      const { numbers } = spec;
      return function LastDigitPicture() {
        return <LastDigit numbers={numbers} />;
      };
    }
    case "upper-bound": {
      const { numbers, limit } = spec;
      return function UpperBoundPicture() {
        return <UpperBound numbers={numbers} limit={limit} />;
      };
    }
  }
}
