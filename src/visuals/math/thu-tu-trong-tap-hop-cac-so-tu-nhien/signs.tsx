"use client";

import type { ConceptColor } from "@/schema/content";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { ConceptShape } from "@/visuals/shared/concept-mark";
import { decorative } from "@/visuals/shared/markers";
import { Legend, Tint } from "@/visuals/shared/math-parts";
import { Reveal } from "@/visuals/shared/reveal";
import { StepPlayer } from "@/visuals/shared/step-player";
import { SvgFade } from "./bars";
import type { SignsSpec } from "./types";

// Two numbers with a comparison sign between them. The sign's pointed end
// faces the smaller number; the smaller number is blue and the bigger one
// violet, each with its concept's shape above it.

const WIDTH = 340;
const HEIGHT = 100;
const NUMBER_Y = 62;
const MARK_Y = 14;
const MARK_RADIUS = 9;
const SIGN_HALF_WIDTH = 17;
const SIGN_HALF_HEIGHT = 26;
const SIGN_STROKE = 9;
const SIGN_CENTRE = WIDTH / 2;
const NUMBER_ZONE = 136;
const MAX_FONT = 44;
const NARROW_SPACE = " ";
const DIGIT_EM = 0.6;
const SPACE_EM = 0.25;

const READING: Readonly<Record<SignsSpec["sign"], string>> = {
  "<": "nhỏ hơn",
  ">": "lớn hơn",
  "≤": "nhỏ hơn hoặc bằng",
  "≥": "lớn hơn hoặc bằng",
  "=": "bằng",
};

function numberOf(text: string): number {
  return Number(text.replaceAll(NARROW_SPACE, "").replaceAll(" ", ""));
}

// Font size that fits the longest number in its zone beside the sign.
function fontFor(...texts: string[]): number {
  const em = Math.max(
    ...texts.map((text) =>
      [...text].reduce(
        (sum, char) => sum + (char === NARROW_SPACE ? SPACE_EM : DIGIT_EM),
        0,
      ),
    ),
  );
  return Math.min(MAX_FONT, Math.floor(NUMBER_ZONE / em));
}

// Strokes of the sign, pointing at the smaller number: "<" and "≤" have their
// point on the left, ">" and "≥" on the right; "≤" and "≥" carry a bar below.
function SignShape({ sign }: { sign: SignsSpec["sign"] }) {
  const common = {
    fill: "none",
    strokeWidth: SIGN_STROKE,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "stroke-foreground",
  };
  if (sign === "=") {
    return (
      <g {...decorative}>
        {[-9, 9].map((dy) => (
          <line
            key={dy}
            {...common}
            x1={SIGN_CENTRE - SIGN_HALF_WIDTH}
            x2={SIGN_CENTRE + SIGN_HALF_WIDTH}
            y1={NUMBER_Y + dy}
            y2={NUMBER_Y + dy}
          />
        ))}
      </g>
    );
  }
  const pointLeft = sign === "<" || sign === "≤";
  const orEqual = sign === "≤" || sign === "≥";
  const tip = SIGN_CENTRE + (pointLeft ? -1 : 1) * SIGN_HALF_WIDTH;
  const back = SIGN_CENTRE + (pointLeft ? 1 : -1) * SIGN_HALF_WIDTH;
  const lift = orEqual ? 6 : 0;
  return (
    <g {...decorative}>
      <polyline
        {...common}
        points={`${back},${NUMBER_Y - SIGN_HALF_HEIGHT + 4 - lift} ${tip},${NUMBER_Y - lift} ${back},${NUMBER_Y + SIGN_HALF_HEIGHT - 4 - lift}`}
      />
      {orEqual ? (
        <line
          {...common}
          x1={SIGN_CENTRE - SIGN_HALF_WIDTH}
          x2={SIGN_CENTRE + SIGN_HALF_WIDTH}
          y1={NUMBER_Y + SIGN_HALF_HEIGHT + 2}
          y2={NUMBER_Y + SIGN_HALF_HEIGHT + 2}
        />
      ) : null}
    </g>
  );
}

type Side = { text: string; color?: ConceptColor };

function Picture({ spec, step }: { spec: SignsSpec; step: number }) {
  const { left, right, sign } = spec;
  const hint = spec.mode === "hint";
  const revealed = step >= 1;
  const leftValue = numberOf(left);
  const rightValue = numberOf(right);
  const sides: [Side, Side] =
    revealed && leftValue !== rightValue
      ? [
          { text: left, color: leftValue < rightValue ? "blue" : "violet" },
          { text: right, color: leftValue < rightValue ? "violet" : "blue" },
        ]
      : [{ text: left }, { text: right }];
  const fontSize = fontFor(left, right);
  const centres = [NUMBER_ZONE / 2, WIDTH - NUMBER_ZONE / 2] as const;
  const colored = sides.some((side) => side.color);

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <svg
        role="img"
        aria-label={spec.label}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-auto w-full max-w-sm"
      >
        {sides.map((side, i) => (
          <g key={i === 0 ? "left" : "right"}>
            <text
              x={centres[i]}
              y={NUMBER_Y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={fontSize}
              stroke="none"
              className={`font-heading font-bold tabular-nums ${side.color ? CONCEPT_CLASSES[side.color].fill : "fill-foreground"}`}
            >
              {side.text}
            </text>
            {side.color ? (
              <SvgFade opacity={1}>
                <ConceptShape
                  color={side.color}
                  cx={centres[i] ?? 0}
                  cy={MARK_Y}
                  r={MARK_RADIUS}
                />
              </SvgFade>
            ) : null}
          </g>
        ))}
        <SvgFade opacity={revealed ? 0 : 1}>
          <text
            x={SIGN_CENTRE}
            y={NUMBER_Y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={MAX_FONT}
            stroke="none"
            className="fill-muted-foreground font-heading font-bold"
          >
            ?
          </text>
        </SvgFade>
        {hint ? null : (
          <SvgFade opacity={revealed ? 1 : 0}>
            <SignShape sign={sign} />
          </SvgFade>
        )}
      </svg>
      {hint ? null : (
        <Reveal shown={revealed}>
          <p className="text-center font-heading text-body font-bold">
            {colored ? (
              <>
                <Tint color={sides[0].color ?? "blue"}>{left}</Tint>{" "}
                {READING[sign]}{" "}
                <Tint color={sides[1].color ?? "violet"}>{right}</Tint>
              </>
            ) : (
              `${left} ${READING[sign]} ${right}`
            )}
          </p>
        </Reveal>
      )}
      {hint || leftValue === rightValue ? null : (
        <Reveal shown={revealed}>
          <Legend
            items={[
              { color: "blue", name: "Số nhỏ hơn" },
              { color: "violet", name: "Số lớn hơn" },
            ]}
          />
        </Reveal>
      )}
    </div>
  );
}

// "steps": the two numbers with "?" between them, then the sign and how it
// reads. "still": the finished picture. "hint": only the first step, so the
// sign is never drawn.
export function Signs({ spec }: { spec: SignsSpec }) {
  if (spec.mode === "steps") {
    return (
      <StepPlayer steps={2} label={spec.label}>
        {(step) => <Picture spec={spec} step={step} />}
      </StepPlayer>
    );
  }
  return <Picture spec={spec} step={spec.mode === "still" ? 1 : 0} />;
}
