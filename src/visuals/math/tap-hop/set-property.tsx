"use client";

import { ArrowUpDown } from "lucide-react";
import type { ReactNode } from "react";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { Reveal } from "@/visuals/shared/reveal";
import { StepPlayer } from "@/visuals/shared/step-player";
import {
  Element,
  Figure,
  ListLine,
  MATH_LINE,
  PropertyLine,
  SetName,
  Tag,
  Words,
} from "./set-parts";

// Figures of the second way to write a set, by its characteristic property
// after the vertical bar, and of moving between the two ways.

const LIME = CONCEPT_CLASSES.lime.text;

// A piece of a written set with an optional short label under it.
function Column({
  children,
  label,
}: {
  children: ReactNode;
  label?: ReactNode;
}) {
  return (
    <div className="flex max-w-full flex-col items-center gap-1">
      <span className="font-heading text-block font-bold md:text-block-lg">
        {children}
      </span>
      {label}
    </div>
  );
}

const ANATOMY_ROW =
  "flex w-full flex-wrap items-start justify-center gap-x-2 gap-y-2";

export function DauHieuViDu() {
  return (
    <Figure label="Tập hợp B gồm các số x, với x là số tự nhiên lớn hơn 2 và nhỏ hơn 6">
      <PropertyLine
        name="B"
        property="x là số tự nhiên lớn hơn 2 và nhỏ hơn 6"
      />
      <ul className="flex flex-col items-start gap-1">
        <li>
          <Tag color="amber">x: phần tử mẫu</Tag>
        </li>
        <li className="text-caption font-semibold">
          <span className="font-heading text-block font-bold">|</span> vạch đứng
        </li>
        <li>
          <Tag color="lime">dấu hiệu đặc trưng</Tag>
        </li>
      </ul>
    </Figure>
  );
}

const READING_CAPTIONS = [
  "",
  "B gồm các số x",
  "mà x là số tự nhiên nhỏ hơn 3",
  "",
] as const;

// Reading "B = { x | x là số tự nhiên nhỏ hơn 3 }" in two parts, then listing.
export function DocDauHieu() {
  return (
    <StepPlayer steps={4} label="Đọc tập hợp B theo dấu hiệu đặc trưng">
      {(step) => (
        <div className="flex w-full flex-col items-center gap-3">
          <PropertyLine
            name="B"
            property="x là số tự nhiên nhỏ hơn 3"
            emphasis={step === 1 ? "x" : step === 2 ? "property" : undefined}
          />
          <p className="min-h-7 text-center text-body font-semibold">
            {READING_CAPTIONS[step]}
          </p>
          <Reveal
            shown={step >= 3}
            placeholder={
              <p className={MATH_LINE}>
                <Element>x</Element> = ?
              </p>
            }
          >
            <p className={MATH_LINE}>
              <Element>x</Element>
              <span>=</span>
              <span>
                <Element>0</Element>, <Element>1</Element>, <Element>2</Element>
              </span>
            </p>
          </Reveal>
          <Reveal
            shown={step >= 3}
            placeholder={
              <p className={MATH_LINE}>
                <SetName>B</SetName> = {"{ ? }"}
              </p>
            }
          >
            <ListLine name="B" elements={[0, 1, 2]} />
          </Reveal>
        </div>
      )}
    </StepPlayer>
  );
}

export function TheDauHieu() {
  return (
    <Figure label="Dấu hiệu đặc trưng của các số x là số chẵn, viết sau vạch đứng">
      <div className={ANATOMY_ROW}>
        <Column>
          {"{"} <Element>x</Element> |
        </Column>
        <Column label={<Tag color="lime">dấu hiệu</Tag>}>
          <span className={LIME}>x là số chẵn</span>
        </Column>
        <Column>{"}"}</Column>
      </div>
    </Figure>
  );
}

function WayCard({
  header,
  children,
}: {
  header: string;
  children: ReactNode;
}) {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-1 rounded-2xl border-2 border-border bg-surface p-3">
      <span className="text-caption font-semibold text-muted-foreground">
        {header}
      </span>
      {children}
    </div>
  );
}

// Two rows for the same set joined by a double arrow. `property` is the whole
// phrase after the bar in the second row.
function TwoWays({
  elements,
  property,
  label,
  propertyOnly = false,
}: {
  elements: readonly number[];
  property: string;
  label?: string;
  propertyOnly?: boolean;
}) {
  return (
    <Figure
      label={`Cùng một tập hợp viết hai cách: liệt kê ${elements.join(", ")} và nêu dấu hiệu ${property}`}
    >
      <WayCard header="Liệt kê">
        <ListLine elements={elements} />
      </WayCard>
      <div className="flex items-center gap-3">
        <ArrowUpDown aria-hidden className="size-8" />
        {label && <Tag color="lime">{label}</Tag>}
      </div>
      <WayCard header="Nêu dấu hiệu">
        {propertyOnly ? (
          <p className={MATH_LINE}>
            <Words text={property} className={LIME} />
          </p>
        ) : (
          <PropertyLine property={property} />
        )}
      </WayCard>
    </Figure>
  );
}

export function HaiCachViDu() {
  return (
    <TwoWays
      elements={[5, 6, 7, 8]}
      property="x là số tự nhiên lớn hơn 4 và nhỏ hơn 9"
    />
  );
}

export function TheHaiCach() {
  return <TwoWays elements={[1, 3, 5]} property="x là số lẻ nhỏ hơn 6" />;
}

export function TheDoiCach() {
  return (
    <TwoWays
      elements={[2, 4, 6]}
      property="x là số chẵn lớn hơn 0 và nhỏ hơn 8"
      label="tìm điều chung"
      propertyOnly
    />
  );
}

// From a listed set to its property: what every element has in common.
export function DoiTuLietKe() {
  return (
    <StepPlayer steps={3} label="Từ liệt kê sang nêu dấu hiệu đặc trưng">
      {(step) => (
        <div className="flex w-full flex-col items-center gap-3">
          <ListLine name="B" elements={[1, 3, 5, 7, 9]} />
          <Reveal
            shown={step >= 1}
            placeholder={<Tag color="lime">điều chung: ?</Tag>}
            className="text-center"
          >
            <Tag color="lime">điều chung: đều là số lẻ, đều nhỏ hơn 10</Tag>
          </Reveal>
          <Reveal
            shown={step >= 2}
            placeholder={<PropertyLine name="B" property="?" />}
          >
            <PropertyLine name="B" property="x là số lẻ nhỏ hơn 10" />
          </Reveal>
        </div>
      )}
    </StepPlayer>
  );
}
