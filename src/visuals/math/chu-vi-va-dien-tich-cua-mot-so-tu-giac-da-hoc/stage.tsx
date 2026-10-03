"use client";

import { RotateCcw, StepForward } from "lucide-react";
import { useState } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import type { VisualProps, VisualState } from "@/visuals/registry";
import {
  DoneLine,
  isLessonScreen,
  ShownLine,
  useGuidedGoal,
} from "@/visuals/shared/guided-feedback";
import { decorative, stateSet } from "@/visuals/shared/markers";
import {
  FigureLayers,
  fillClass,
  pointList,
  strokeClass,
} from "@/visuals/shared/plane/figure";
import { glide, PRIMARY_BUTTON, SECONDARY_BUTTON } from "./controls";
import {
  isTapStage,
  pieceStatus,
  type StagePiece,
  type StageSpec,
  stageGoal,
  stageTapIds,
} from "./models";

// A drawing whose pieces move as the child presses buttons ("Cắt", "Trượt") or
// taps a piece to turn it. State { step } for buttons; { t0, t1, … } with
// 1 = turned for taps.

const PIECE_FILL = 0.4;
const DASH = "7 6";

function Piece({
  piece,
  visible,
  moved,
  reducedMotion,
  interactive,
  onTap,
  stateKey,
}: {
  piece: StagePiece;
  visible: boolean;
  moved: boolean;
  reducedMotion: boolean;
  interactive: boolean;
  onTap: () => void;
  stateKey?: string;
}) {
  const { move } = piece;
  const transform =
    moved && move
      ? "dx" in move
        ? `translate(${move.dx}px, ${move.dy}px)`
        : `rotate(${move.turn}deg)`
      : "none";
  const origin = move && "turn" in move ? `${move.cx}px ${move.cy}px` : "0 0";
  const drawn = (points: readonly (readonly [number, number])[]) =>
    points.length === 2 ? (
      <line
        x1={points[0]?.[0]}
        y1={points[0]?.[1]}
        x2={points[1]?.[0]}
        y2={points[1]?.[1]}
        strokeWidth={2.5}
        strokeDasharray={piece.dash ? DASH : undefined}
        strokeLinecap="round"
        className={strokeClass(piece.tone)}
      />
    ) : (
      <polygon
        points={pointList(points)}
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeDasharray={piece.dash ? DASH : undefined}
        fillOpacity={piece.filled ? PIECE_FILL : 0}
        className={`${fillClass(piece.tone)} ${strokeClass(piece.tone)}`}
      />
    );
  const frame = (
    <g
      {...decorative}
      style={{
        opacity: visible ? 1 : 0,
        transform,
        transformOrigin: origin,
        transformBox: "view-box",
        transition: glide(reducedMotion),
      }}
    >
      {drawn(piece.v)}
    </g>
  );
  if (!interactive) return frame;
  return (
    // biome-ignore lint/a11y/useSemanticElements: an SVG has no <button>; a focusable group with the button role is the equivalent inside a drawing
    <g
      role="button"
      tabIndex={moved ? -1 : 0}
      aria-label={piece.label ?? piece.id}
      aria-pressed={moved}
      {...decorative}
      className={`outline-none focus-visible:stroke-ring ${moved ? "" : "cursor-pointer"}`}
      onClick={onTap}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        onTap();
      }}
      {...(stateKey ? stateSet(stateKey, 1) : {})}
    >
      {frame}
      {piece.v.length > 2 && (
        <polygon
          points={pointList(piece.v)}
          fill="transparent"
          stroke="none"
          {...decorative}
        />
      )}
    </g>
  );
}

export function Stage({
  spec,
  onStateChange,
  shownState,
  disabled = false,
  params,
}: VisualProps & { spec: StageSpec }) {
  const reducedMotion = usePrefersReducedMotion();
  const tap = isTapStage(spec);
  const tapIds = stageTapIds(spec);
  const goal = stageGoal(spec);
  const [own, setOwn] = useState<VisualState>({});
  const state = shownState ?? own;
  const locked = disabled || shownState !== undefined;
  const step = tap ? 0 : (state.step ?? 0);
  const tapped = new Set(tapIds.filter((_, i) => state[`t${i}`] === 1));
  const progress = tap ? tapped.size : step;
  const finished = progress >= goal;

  function change(next: VisualState) {
    setOwn(next);
    onStateChange?.(next);
  }
  const { shown } = useGuidedGoal({
    met: finished,
    guided: isLessonScreen(params),
    reveal: () =>
      change(
        tap
          ? Object.fromEntries(tapIds.map((_, i) => [`t${i}`, 1]))
          : { step: goal },
      ),
  });

  const caption = tap
    ? `${spec.verb ?? "Đã chạm"} ${progress}/${goal}`
    : (spec.captions?.[step] ?? "");
  const { base } = spec;
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="w-full max-w-md">
        {/* biome-ignore lint/a11y/useSemanticElements: a drawing that holds buttons is a group of them */}
        <svg
          viewBox={`0 0 ${base.w} ${base.h}`}
          role="group"
          aria-label={spec.label}
          className="h-auto max-h-72 w-full"
        >
          <FigureLayers spec={base} />
          {spec.pieces.map((piece) => {
            const status = pieceStatus(piece, step, tapped);
            const tapIndex = tapIds.indexOf(piece.id);
            return (
              <Piece
                key={piece.id}
                piece={piece}
                visible={status.visible}
                moved={status.moved}
                reducedMotion={reducedMotion}
                interactive={tapIndex >= 0 && !locked}
                stateKey={tapIndex >= 0 ? `t${tapIndex}` : undefined}
                onTap={() => change({ ...state, [`t${tapIndex}`]: 1 })}
              />
            );
          })}
          {(spec.texts ?? []).map((t) => (
            <text
              key={`${t.x}-${t.y}-${t.text}`}
              x={t.x}
              y={t.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={17}
              stroke="none"
              className={`font-heading font-bold ${fillClass(t.tone)}`}
              style={{
                opacity: t.appearAt === undefined || step >= t.appearAt ? 1 : 0,
                transition: glide(reducedMotion),
              }}
            >
              {t.text}
            </text>
          ))}
        </svg>
      </div>
      <p
        className="min-h-14 text-center font-heading text-block font-semibold"
        aria-live="polite"
      >
        {caption}
      </p>
      <div className="flex gap-3">
        {!tap && (
          <button
            type="button"
            className={PRIMARY_BUTTON}
            disabled={locked || finished}
            onClick={() => change({ step: step + 1 })}
          >
            <StepForward aria-hidden className="size-5" />
            {finished ? "Xong" : (spec.actions?.[step] ?? "Tiếp")}
          </button>
        )}
        <button
          type="button"
          className={SECONDARY_BUTTON}
          disabled={locked || progress === 0}
          onClick={() => change({})}
        >
          <RotateCcw aria-hidden className="size-5" />
          Làm lại
        </button>
      </div>
      {finished && !shown && <DoneLine>{spec.done}</DoneLine>}
      {finished && shown && <ShownLine>{spec.done}</ShownLine>}
    </div>
  );
}
