import { Fragment, type ReactNode } from "react";
import { formatInteger } from "@/lib/number-format";
import { PowerText } from "@/visuals/shared/power-text";
import { Board } from "./ban-co";
import { CubeBlocks, SquareTiles } from "./blocks";
import CacPhan from "./cac-phan";
import { grainsOn } from "./grains";
import {
  FactorCount,
  FactorRow,
  MATH_LINE,
  PowerAnatomy,
  PowerLegend,
  RuleCard,
  ZerosInColour,
  ZeroTermNote,
} from "./parts";
import { ZeroExponent } from "./so-mu-0";
import SoMu1 from "./so-mu-1";
import TachSo from "./tach-so";
import { RepeatedProduct } from "./tinh-tung-buoc";
import { SquareAndCube } from "./tom-tat-hinh";

// Screens that pair a sentence to remember with a labelled example: the rule
// screens of the sections and the recaps of sections and cards. The lesson
// player shows one block per screen, so a rule and its example live in one
// visual instead of a lone note followed by a lone formula.

// Letters stand for any number, set in italics as the textbook writes them.
function Letter({ children }: { children: ReactNode }) {
  return <i>{children}</i>;
}

// "2⁴ · 2¹" style products and quotients: powers joined by an operator.
function Powers({
  items,
  operator,
}: {
  items: readonly [ReactNode, ReactNode][];
  operator: "·" | ":";
}) {
  return (
    <>
      {items.map(([base, exponent], i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: terms never reorder
        <Fragment key={i}>
          {i > 0 && <span>{operator}</span>}
          {exponent === "" ? (
            <span className="text-concept-blue">{base}</span>
          ) : (
            <PowerText base={base} exponent={exponent} />
          )}
        </Fragment>
      ))}
    </>
  );
}

// A line of maths whose parts wrap as whole pieces on a phone.
function Line({ children }: { children: ReactNode }) {
  return <p className={MATH_LINE}>{children}</p>;
}

const a = <Letter>a</Letter>;
const m = <Letter>m</Letter>;
const n = <Letter>n</Letter>;

// ---------------------------------------------------------------------------
// Rule screens

export function DinhNghia() {
  return (
    <RuleCard
      rule={
        <>
          <PowerText base={a} exponent={n} /> là tích của {n} thừa số, thừa số
          nào cũng bằng {a}.
        </>
      }
    >
      <PowerAnatomy base={a} exponent={n} />
      <div className="flex flex-col items-center">
        <Line>
          <span>=</span>
          {/* Any count past maxShown collapses to "a · a · … · a". */}
          <FactorRow base={a} count={4} maxShown={3} />
        </Line>
        {/* The brace under the product names how many factors it has. */}
        <span
          aria-hidden
          className="h-3 w-40 rounded-b-lg border-x-2 border-b-2 border-concept-violet"
        />
        <FactorCount count={n} />
      </div>
      <p className="text-center">
        Đọc <PowerText base={a} exponent={n} /> là <strong>“a mũ n”</strong>{" "}
        hoặc <strong>“a luỹ thừa n”</strong>.
      </p>
      <p className="text-center">
        Nhân nhiều thừa số bằng nhau như thế gọi là{" "}
        <strong>phép nâng lên luỹ thừa</strong>.
      </p>
    </RuleCard>
  );
}

const LAST_SQUARE = 64;

export function KetBanCo() {
  return (
    <RuleCard
      rule={`Ô cuối là ô thứ ${LAST_SQUARE}, nên số hạt là tích của ${LAST_SQUARE - 1} thừa số 2.`}
    >
      <Board square={LAST_SQUARE} />
      <div className="flex flex-col items-center gap-1">
        <Line>
          <PowerText base={2} exponent={LAST_SQUARE - 1} />
          <span>=</span>
        </Line>
        <p className="text-center font-heading text-block font-bold md:text-block-lg">
          {`${formatInteger(grainsOn(LAST_SQUARE))} hạt`}
        </p>
      </div>
      <p className="text-center font-semibold">
        Nhiều thóc đến thế, nhà vua không có đủ để thưởng!
      </p>
    </RuleCard>
  );
}

export function QuyTacSoMu1() {
  return (
    <RuleCard rule="Số mũ bằng 1 thì luỹ thừa bằng chính cơ số.">
      <SoMu1 />
      <Line>
        <PowerText base={a} exponent={1} />
        <span>=</span>
        <span className="text-concept-blue">{a}</span>
      </Line>
    </RuleCard>
  );
}

// The number pad as the child meets it: which key to press at each step and
// what the answer boxes then show. Drawn, not tappable.
const PAD_STEPS = [
  { key: "2", base: "2", exponent: "", focus: "base" },
  { key: "mũ", base: "2", exponent: "", focus: "exponent" },
  { key: "5", base: "2", exponent: "5", focus: "exponent" },
] as const;

function slotClass(focused: boolean): string {
  return focused ? "border-3 border-primary" : "border-2 border-border";
}

export function BamMu() {
  return (
    <RuleCard rule="Viết luỹ thừa: bấm cơ số, bấm phím “mũ”, rồi bấm số mũ.">
      <ol
        className="grid w-full grid-cols-3 gap-2 md:gap-6"
        aria-label="Viết 2 mũ 5: bấm 2, bấm mũ, rồi bấm 5"
      >
        {PAD_STEPS.map((step, i) => (
          <li
            key={step.key}
            aria-hidden
            className="flex flex-col items-center gap-3"
          >
            <span className="flex items-center gap-2 font-semibold">
              <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                {i + 1}
              </span>
              Bấm
            </span>
            <span
              className={`flex h-14 min-w-14 items-center justify-center rounded-lg px-2 font-semibold text-block md:text-block-lg ${step.key === "mũ" ? "border-3 border-primary bg-highlight" : "border-2 border-border bg-surface"}`}
            >
              {step.key}
            </span>
            <span className="flex items-start gap-1">
              <span
                className={`mt-3 flex h-12 min-w-10 items-center justify-center rounded-lg px-2 font-bold text-title tabular-nums text-concept-blue ${slotClass(step.focus === "base")}`}
              >
                {step.base}
              </span>
              <span
                className={`flex h-9 min-w-8 items-center justify-center rounded-lg px-1 font-bold text-block tabular-nums text-concept-violet ${slotClass(step.focus === "exponent")}`}
              >
                {step.exponent}
              </span>
            </span>
          </li>
        ))}
      </ol>
      <PowerLegend />
    </RuleCard>
  );
}

export function DocBinhPhuong() {
  return (
    <RuleCard
      rule={
        <>
          <PowerText base={a} exponent={2} /> đọc là “a bình phương”,{" "}
          <PowerText base={a} exponent={3} /> đọc là “a lập phương”.
        </>
      }
    >
      <SquareAndCube side={2} />
    </RuleCard>
  );
}

export function TinhTungBuoc() {
  return (
    <RuleCard rule="Nhân hai thừa số đầu, rồi lấy kết quả nhân tiếp với cơ số. Ghi từng kết quả ra nháp.">
      <RepeatedProduct base={2} exponent={5} mode="solution" />
    </RuleCard>
  );
}

export function QuyTacNhan() {
  return (
    <RuleCard rule="Nhân hai luỹ thừa cùng cơ số: giữ nguyên cơ số, cộng các số mũ.">
      <Line>
        <Powers
          operator="·"
          items={[
            [a, m],
            [a, n],
          ]}
        />
        <span>=</span>
        <PowerText
          base={a}
          exponent={
            <>
              {m} + {n}
            </>
          }
        />
      </Line>
      <Line>
        <Powers
          operator="·"
          items={[
            [5, 2],
            [5, 4],
          ]}
        />
        <span>=</span>
        <PowerText base={5} exponent="2 + 4" />
        <span>=</span>
        <PowerText base={5} exponent={6} />
      </Line>
      <PowerLegend />
    </RuleCard>
  );
}

export function QuyTacSoMuAn() {
  return (
    <RuleCard rule="Số không ghi số mũ thì có số mũ là 1.">
      <Line>
        <Powers
          operator="·"
          items={[
            [5, 3],
            [5, ""],
          ]}
        />
        <span>=</span>
        <Powers
          operator="·"
          items={[
            [5, 3],
            [5, 1],
          ]}
        />
      </Line>
      <Line>
        <span>=</span>
        <PowerText base={5} exponent="3 + 1" />
        <span>=</span>
        <PowerText base={5} exponent={4} />
      </Line>
      <PowerLegend />
    </RuleCard>
  );
}

function DivisionRule() {
  return (
    <div className="flex flex-col items-center gap-1">
      <Line>
        <Powers
          operator=":"
          items={[
            [a, m],
            [a, n],
          ]}
        />
        <span>=</span>
        <PowerText
          base={a}
          exponent={
            <>
              {m} − {n}
            </>
          }
        />
      </Line>
      <p>
        (với {a} ≠ 0, {m} ≥ {n})
      </p>
    </div>
  );
}

export function QuyTacChia() {
  return (
    <RuleCard rule="Chia hai luỹ thừa cùng cơ số: giữ nguyên cơ số, lấy số mũ thứ nhất trừ số mũ thứ hai.">
      <DivisionRule />
      <Line>
        <Powers
          operator=":"
          items={[
            [3, 6],
            [3, 2],
          ]}
        />
        <span>=</span>
        <PowerText base={3} exponent="6 − 2" />
        <span>=</span>
        <PowerText base={3} exponent={4} />
      </Line>
      <PowerLegend />
    </RuleCard>
  );
}

export function QuyTacSoMu0() {
  return (
    <RuleCard rule="Ta quy ước: luỹ thừa có số mũ 0 thì bằng 1, với cơ số khác 0.">
      <ZeroExponent mode="solution" />
    </RuleCard>
  );
}

const POWERS_OF_TEN = [
  { exponent: 1, name: "một chục" },
  { exponent: 2, name: "một trăm" },
  { exponent: 3, name: "một nghìn" },
] as const;

export function QuyTacLuyThua10() {
  return (
    <RuleCard rule="Với luỹ thừa của 10, số mũ bằng số chữ số 0 đứng sau chữ số 1.">
      <div className="grid grid-cols-[auto_auto_auto_auto] items-baseline gap-x-3 gap-y-2">
        {POWERS_OF_TEN.map(({ exponent, name }) => (
          <Fragment key={exponent}>
            <PowerText
              base={10}
              exponent={exponent}
              className="text-right font-heading text-title font-bold md:text-title-lg"
            />
            <span className="font-heading text-title font-bold">=</span>
            <span className="font-heading text-title font-bold md:text-title-lg">
              <ZerosInColour value={formatInteger(10 ** exponent)} />
            </span>
            <span>{name}</span>
          </Fragment>
        ))}
      </div>
      <PowerLegend />
    </RuleCard>
  );
}

export function QuyTacTachSo() {
  return (
    <RuleCard rule="Viết một số thành tổng: nhân mỗi chữ số với luỹ thừa của 10 ở hàng của nó, rồi cộng lại.">
      <TachSo />
    </RuleCard>
  );
}

// ---------------------------------------------------------------------------
// Recaps: one sentence and one labelled example each.

export function TomTatLuyThua() {
  return (
    <RuleCard rule="Luỹ thừa viết gọn một tích có các thừa số bằng nhau.">
      <CacPhan />
      <p className="text-center">
        Đọc là <strong>“2 mũ 5”</strong>.
      </p>
    </RuleCard>
  );
}

export function TomTatBinhPhuong() {
  return (
    <RuleCard
      rule={
        <>
          <PowerText base={a} exponent={2} /> là “a bình phương”,{" "}
          <PowerText base={a} exponent={3} /> là “a lập phương”.
        </>
      }
    >
      <SquareAndCube side={3} />
    </RuleCard>
  );
}

export function TomTatNhan() {
  return (
    <RuleCard rule="Nhân hai luỹ thừa cùng cơ số: giữ nguyên cơ số, cộng các số mũ.">
      <Line>
        <Powers
          operator="·"
          items={[
            [5, 3],
            [5, ""],
          ]}
        />
        <span>=</span>
        <Powers
          operator="·"
          items={[
            [5, 3],
            [5, 1],
          ]}
        />
      </Line>
      <Line>
        <span>=</span>
        <PowerText base={5} exponent="3 + 1" />
        <span>=</span>
        <PowerText base={5} exponent={4} />
      </Line>
      <PowerLegend />
    </RuleCard>
  );
}

export function TomTatChia() {
  return (
    <RuleCard rule="Chia hai luỹ thừa cùng cơ số: giữ nguyên cơ số, lấy số mũ thứ nhất trừ số mũ thứ hai.">
      <DivisionRule />
      <p className="text-center font-semibold">
        Quy ước: số mũ bằng 0 thì luỹ thừa bằng 1, với cơ số khác 0.
      </p>
      <Line>
        <PowerText base={a} exponent={0} />
        <span>= 1</span>
      </Line>
      <p>(với {a} ≠ 0)</p>
      <PowerLegend />
    </RuleCard>
  );
}

function PlaceValueTerm({
  digit,
  exponent,
}: {
  digit: number;
  exponent: number;
}) {
  if (exponent === 0) return <span>{digit}</span>;
  return (
    <span className="whitespace-nowrap">
      {digit} ·{" "}
      {exponent === 1 ? (
        <span className="text-concept-blue">10</span>
      ) : (
        <PowerText base={10} exponent={exponent} />
      )}
    </span>
  );
}

// One term per line under the number, each continued with "+", so a phone
// never breaks the sum at a place a child could read as a new calculation.
function PlaceValueRecap({ value }: { value: number }) {
  // A place whose digit is 0 is left out of the sum.
  const digits = [...String(value)].map(Number);
  const last = digits.length - 1;
  const terms = digits
    .map((digit, i) => ({ digit, exponent: last - i }))
    .filter(({ digit }) => digit !== 0);
  return (
    <div className="grid grid-cols-[auto_auto_auto] items-baseline gap-x-3 gap-y-1 font-heading text-title font-bold md:text-title-lg">
      {terms.map(({ digit, exponent }, i) => (
        <Fragment key={exponent}>
          <span className="whitespace-nowrap text-right">
            {i === 0 ? formatInteger(value) : ""}
          </span>
          <span>{i === 0 ? "=" : "+"}</span>
          <PlaceValueTerm digit={digit} exponent={exponent} />
        </Fragment>
      ))}
    </div>
  );
}

function PlaceValueSum({ value }: { value: number }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <PlaceValueRecap value={value} />
      <ZeroTermNote value={value} />
    </div>
  );
}

export function TomTatLuyThua10() {
  return (
    <RuleCard rule="Số mũ của 10 bằng số chữ số 0 đứng sau chữ số 1.">
      <Line>
        <PowerText base={10} exponent={3} />
        <span>=</span>
        <ZerosInColour value={formatInteger(1000)} />
      </Line>
      <p className="text-center font-semibold">
        Viết một số thành tổng: nhân mỗi chữ số với luỹ thừa của 10 ở hàng của
        nó, rồi cộng lại.
      </p>
      <PlaceValueSum value={6084} />
    </RuleCard>
  );
}

export function TheVietLuyThua() {
  return (
    <RuleCard rule="Tích các thừa số bằng nhau viết gọn thành một luỹ thừa.">
      <Line>
        <FactorRow base={2} count={3} />
        <span>=</span>
        <PowerText base={2} exponent={3} />
      </Line>
      <FactorCount count={3} />
      <PowerLegend />
    </RuleCard>
  );
}

export function TheCoSoSoMu() {
  return (
    <RuleCard rule="Cơ số là thừa số được nhân lặp lại, số mũ là số thừa số.">
      <PowerAnatomy base={4} exponent={3} />
      <Line>
        <span>=</span>
        <FactorRow base={4} count={3} />
      </Line>
      <FactorCount count={3} />
    </RuleCard>
  );
}

export function TheSoMu1() {
  return (
    <RuleCard rule="Số mũ bằng 1 thì luỹ thừa bằng chính cơ số.">
      <Line>
        <PowerText base={5} exponent={1} />
        <span>=</span>
        <span className="text-concept-blue">5</span>
      </Line>
      <PowerLegend />
    </RuleCard>
  );
}

function NamedPower({
  base,
  exponent,
  picture,
  name,
}: {
  base: number;
  exponent: number;
  picture: ReactNode;
  name: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-32 md:w-40 [&>svg]:h-auto [&>svg]:w-full">
        {picture}
      </div>
      <Line>
        <PowerText base={base} exponent={exponent} />
        <span>=</span>
        <FactorRow base={base} count={exponent} />
        <span>=</span>
        <span>{base ** exponent}</span>
      </Line>
      <p>{name}</p>
    </div>
  );
}

export function TheBinhPhuong() {
  return (
    <RuleCard
      rule={
        <>
          <PowerText base={a} exponent={2} /> đọc là “a bình phương”.
        </>
      }
    >
      <NamedPower
        base={6}
        exponent={2}
        name="6 bình phương"
        picture={<SquareTiles side={6} label="Hình vuông cạnh 6, có 36 ô" />}
      />
    </RuleCard>
  );
}

export function TheLapPhuong() {
  return (
    <RuleCard
      rule={
        <>
          <PowerText base={a} exponent={3} /> đọc là “a lập phương”.
        </>
      }
    >
      <NamedPower
        base={2}
        exponent={3}
        name="2 lập phương"
        picture={
          <CubeBlocks side={2} label="Hình lập phương cạnh 2, có 8 khối nhỏ" />
        }
      />
    </RuleCard>
  );
}

export function TheTinhGiaTri() {
  return (
    <RuleCard rule="Tính luỹ thừa: nhân lần lượt từng thừa số, ghi kết quả từng bước.">
      <Line>
        <PowerText base={2} exponent={4} />
        <span>=</span>
        <FactorRow base={2} count={4} />
      </Line>
      <div className="grid grid-cols-[repeat(5,auto)] items-baseline gap-x-2 gap-y-1 font-heading text-block font-bold tabular-nums md:text-block-lg">
        {[
          [2, 4],
          [4, 8],
          [8, 16],
        ].map(([left, right]) => (
          <Fragment key={left}>
            <span className="text-right">{left}</span>
            <span>·</span>
            <span className="text-concept-blue">2</span>
            <span>=</span>
            <span>{right}</span>
          </Fragment>
        ))}
      </div>
    </RuleCard>
  );
}

export function TheNhanCungCoSo() {
  return (
    <RuleCard rule="Nhân hai luỹ thừa cùng cơ số: giữ nguyên cơ số, cộng các số mũ.">
      <Line>
        <Powers
          operator="·"
          items={[
            [5, 2],
            [5, 3],
          ]}
        />
        <span>=</span>
        <PowerText base={5} exponent="2 + 3" />
        <span>=</span>
        <PowerText base={5} exponent={5} />
      </Line>
      <PowerLegend />
    </RuleCard>
  );
}

export function TheNhanSoMu1() {
  return (
    <RuleCard rule="Số không ghi số mũ thì có số mũ là 1.">
      <Line>
        <Powers
          operator="·"
          items={[
            [2, 4],
            [2, ""],
          ]}
        />
        <span>=</span>
        <Powers
          operator="·"
          items={[
            [2, 4],
            [2, 1],
          ]}
        />
        <span>=</span>
        <PowerText base={2} exponent={5} />
      </Line>
      <PowerLegend />
    </RuleCard>
  );
}

export function TheChiaCungCoSo() {
  return (
    <RuleCard rule="Chia hai luỹ thừa cùng cơ số: giữ nguyên cơ số, lấy số mũ thứ nhất trừ số mũ thứ hai.">
      <Line>
        <Powers
          operator=":"
          items={[
            [7, 5],
            [7, 2],
          ]}
        />
        <span>=</span>
        <PowerText base={7} exponent="5 − 2" />
        <span>=</span>
        <PowerText base={7} exponent={3} />
      </Line>
      <PowerLegend />
    </RuleCard>
  );
}

export function TheSoMu0() {
  return (
    <RuleCard rule="Số mũ bằng 0 thì luỹ thừa bằng 1, với cơ số khác 0.">
      <Line>
        <PowerText base={4} exponent={0} />
        <span>= 1</span>
      </Line>
      <PowerLegend />
    </RuleCard>
  );
}

export function TheLuyThua10() {
  return (
    <RuleCard rule="Số mũ của 10 bằng số chữ số 0 đứng sau chữ số 1.">
      <Line>
        <PowerText base={10} exponent={3} />
        <span>=</span>
        <ZerosInColour value={formatInteger(1000)} />
      </Line>
      <PowerLegend />
    </RuleCard>
  );
}

export function TheTongLuyThua10() {
  return (
    <RuleCard rule="Nhân mỗi chữ số với luỹ thừa của 10 ở hàng của nó, rồi cộng lại.">
      <PlaceValueSum value={8059} />
    </RuleCard>
  );
}
