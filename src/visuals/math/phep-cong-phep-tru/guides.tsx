import { Hand, Pointer } from "lucide-react";

// Pictures of the guide screens: how to answer each kind of exercise the
// lesson uses. They use made-up content so they never give away an exercise.

const BOX = "rounded-lg border-2 px-3 py-2 text-body";
const PICKED = "border-primary bg-primary/10";
const PLAIN = "border-border bg-surface";

function Frame({
  children,
  caption,
}: {
  children: React.ReactNode;
  caption: string;
}) {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      {children}
      <p className="text-caption">{caption}</p>
    </div>
  );
}

// Matching: a left box joined to the right box that goes with it.
export function GuideMatch() {
  return (
    <Frame caption="Hai ô cùng số 1 là một cặp đã nối">
      <div className="grid w-full max-w-sm grid-cols-2 gap-x-6 gap-y-3">
        <span className={`${BOX} ${PICKED}`}>
          <b className="text-primary">1</b> Nước
        </span>
        <span className={`${BOX} ${PLAIN}`}>nóng</span>
        <span className={`${BOX} ${PLAIN}`}>Lửa</span>
        <span className={`${BOX} ${PICKED}`}>
          <b className="text-primary">1</b> uống
        </span>
      </div>
    </Frame>
  );
}

// Manipulation: tap the numbers (or the buttons) the exercise asks for.
export function GuideTap() {
  return (
    <Frame caption="Số đã chạm có viền đậm">
      <div className="flex items-center gap-3 font-heading text-title font-bold tabular-nums">
        <span className={`${BOX} ${PLAIN}`}>12</span>
        <span className={`${BOX} ${PICKED}`}>7</span>
        <span className={`${BOX} ${PICKED}`}>9</span>
        <Pointer aria-hidden className="size-7 shrink-0 text-foreground" />
      </div>
    </Frame>
  );
}

// Ordering: cards moved into place, numbered from the top.
export function GuideOrder() {
  const steps = ["Thức dậy", "Đánh răng", "Đi học"];
  return (
    <Frame caption="Thẻ trên cùng là bước làm trước">
      <ol className="flex w-full max-w-xs flex-col gap-3">
        {steps.map((step, i) => (
          <li key={step} className={`flex items-center gap-3 ${BOX} ${PLAIN}`}>
            <b className="text-primary">{i + 1}</b>
            {step}
            {i === 1 && (
              <Hand aria-hidden className="ml-auto size-6 text-foreground" />
            )}
          </li>
        ))}
      </ol>
    </Frame>
  );
}
