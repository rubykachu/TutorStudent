import { fireEvent, render, screen } from "@testing-library/react";
import type { ComponentType } from "react";
import { describe, expect, it, vi } from "vitest";
import { FeedbackSoundsProvider } from "@/lib/feedback-sounds";
import {
  planMultiplication,
  tryCells,
} from "@/visuals/math/phep-nhan-phep-chia/col-mul-digits";
import {
  digitsOf,
  divide,
} from "@/visuals/math/phep-nhan-phep-chia/long-division";
import { type VisualProps, visualRegistry } from "@/visuals/registry";
import { GuidedStepProvider, useGuided } from "@/visuals/shared/guided-step";

// Every interactive theory screen of the set, addition and subtraction,
// multiplication and division, and power lessons that is a task: it holds the
// screen's "Tiếp" until the child is right or asks "Xem cách làm", judges at
// once, and respects the number of picks the screen asks for.

function Bar() {
  const { held, show } = useGuided();
  return (
    <>
      <output data-testid="bar">{held ? "waiting" : "free"}</output>
      <button type="button" onClick={show}>
        Xem cách làm
      </button>
    </>
  );
}

function makeSounds() {
  return { play: vi.fn(), tap: vi.fn(), button: vi.fn(), leave: vi.fn() };
}

async function open(id: string, props: Partial<VisualProps> = {}) {
  const entry = visualRegistry[id];
  if (!entry) throw new Error(id);
  const Visual = (await entry.load()).default as ComponentType<VisualProps>;
  const sounds = makeSounds();
  const view = render(
    <FeedbackSoundsProvider sounds={sounds}>
      <GuidedStepProvider>
        <Visual {...props} />
        <Bar />
      </GuidedStepProvider>
    </FeedbackSoundsProvider>,
  );
  return { ...view, sounds };
}

const bar = () => screen.getByTestId("bar").textContent;
const click = (name: string | RegExp) =>
  fireEvent.click(screen.getByRole("button", { name }));
const showHow = () => click("Xem cách làm");
const lastSound = (sounds: ReturnType<typeof makeSounds>) =>
  sounds.play.mock.lastCall?.[0];

describe("tap-hop: pick the items of the pencil box", () => {
  const ID = "tap-hop.visual.chon-hop-but";

  it("holds Tiếp, keeps at most three items in the box and judges as soon as it has three", async () => {
    const { container, sounds } = await open(ID);
    expect(bar()).toBe("waiting");
    for (const item of ["bút chì", "cục tẩy", "quả cam", "con mèo"]) {
      click(`Bỏ ${item} vào hộp`);
    }
    // Four picks, three fit: the oldest (bút chì) left the box.
    expect(
      screen.queryByRole("button", { name: "Lấy bút chì ra khỏi hộp" }),
    ).toBeNull();
    // Wrong picks are marked gently and nothing is revealed or locked.
    expect(
      screen.getByRole("button", { name: "Lấy quả cam ra khỏi hộp" }),
    ).toHaveAttribute("data-wrong");
    expect(
      screen.getByRole("button", { name: "Lấy cục tẩy ra khỏi hộp" }),
    ).not.toHaveAttribute("data-wrong");
    expect(screen.getByText(/Chưa đúng/)).toBeInTheDocument();
    expect(lastSound(sounds)).toEqual(["wrong-answer"]);
    expect(bar()).toBe("waiting");
    expect(container.querySelector("[data-pick-done]")).toBeNull();
  });

  it("goes green with the closing line and a jingle when the right three are in the box", async () => {
    const { container, sounds } = await open(ID);
    for (const item of ["bút chì", "cục tẩy", "thước kẻ"]) {
      click(`Bỏ ${item} vào hộp`);
    }
    expect(container.querySelector("[data-pick-done]")).not.toBeNull();
    expect(lastSound(sounds)).toEqual(["correct-jingle"]);
    expect(bar()).toBe("free");
    expect(
      screen.getByRole("button", { name: "Lấy thước kẻ ra khỏi hộp" }),
    ).toBeDisabled();
  });

  it("puts the answer in the box on Xem cách làm without praising the child", async () => {
    const { container } = await open(ID);
    showHow();
    expect(bar()).toBe("free");
    expect(container.querySelector("[data-pick-shown]")).not.toBeNull();
    expect(container.querySelector("[data-pick-done]")).toBeNull();
    expect(
      screen.getByRole("button", { name: "Lấy cục tẩy ra khỏi hộp" }),
    ).toBeInTheDocument();
  });

  it("stays a free pick in the exercise version", async () => {
    await open("tap-hop.visual.chon-do-dung");
    expect(bar()).toBe("free");
  });
});

describe("tap-hop: put a semicolon in every gap", () => {
  const ID = "tap-hop.visual.dat-cham-phay";

  it("holds Tiếp until every gap has its semicolon, then locks with a jingle", async () => {
    const { container, sounds } = await open(ID);
    expect(bar()).toBe("waiting");
    click("Ô trống giữa 1 và 2");
    expect(bar()).toBe("waiting");
    click("Ô trống giữa 2 và 3");
    expect(bar()).toBe("free");
    expect(container.querySelector("[data-gaps-done]")).not.toBeNull();
    expect(lastSound(sounds)).toEqual(["correct-jingle"]);
    expect(
      screen.getByRole("button", { name: "Ô trống giữa 1 và 2" }),
    ).toBeDisabled();
  });

  it("fills the gaps on Xem cách làm", async () => {
    const { container } = await open(ID);
    showHow();
    expect(bar()).toBe("free");
    expect(container.querySelector("[data-gaps-shown]")).not.toBeNull();
  });

  it("does not wait or judge in the exercise (it has params)", async () => {
    const { container } = await open("tap-hop.visual.dat-cham-phay-bon", {
      params: { gaps: 3 },
    });
    expect(bar()).toBe("free");
    click("Ô trống giữa 5 và 6");
    expect(container.querySelector("[data-gaps-done]")).toBeNull();
  });
});

describe("tap-hop: draw the mark stroke by stroke", () => {
  it.each([
    ["tap-hop.visual.tap-net-thuoc", 2],
    ["tap-hop.visual.tap-net-khong-thuoc", 3],
  ])("%s holds Tiếp until the last stroke", async (id, strokes) => {
    const { container, sounds } = await open(id);
    expect(bar()).toBe("waiting");
    for (let n = 1; n <= strokes; n++) {
      expect(bar()).toBe("waiting");
      click(new RegExp(`Chạm chấm số ${n} `));
    }
    expect(bar()).toBe("free");
    expect(container.querySelector("[data-trace-done]")).not.toBeNull();
    expect(lastSound(sounds)).toEqual(["correct-jingle"]);
  });

  it("draws the rest on Xem cách làm", async () => {
    const { container } = await open("tap-hop.visual.tap-net-thuoc");
    showHow();
    expect(bar()).toBe("free");
    expect(container.querySelector("[data-trace-shown]")).not.toBeNull();
    expect(container.querySelector("[data-trace-done]")).toBeNull();
  });

  it("does not hold the exercise version", async () => {
    await open("tap-hop.visual.tap-net-ngoac-mo", { params: { total: 3 } });
    expect(bar()).toBe("free");
  });
});

describe("tap-hop: move x to see both ∈ and ∉", () => {
  const ID = "tap-hop.visual.chon-x-tu-do";

  it("holds Tiếp until x has been outside and inside A", async () => {
    const { container, sounds } = await open(ID);
    // Starts at x = 4, outside A = { 1 ; 2 ; 3 }.
    expect(bar()).toBe("waiting");
    click("Tăng x");
    expect(bar()).toBe("waiting");
    click("Giảm x");
    click("Giảm x");
    expect(bar()).toBe("free");
    expect(container.querySelector("[data-choose-done]")).not.toBeNull();
    expect(lastSound(sounds)).toEqual(["correct-jingle"]);
  });

  it("moves x to the case not seen yet on Xem cách làm", async () => {
    const { container } = await open(ID);
    showHow();
    expect(bar()).toBe("free");
    expect(screen.getByText("1 thuộc A")).toBeInTheDocument();
    expect(container.querySelector("[data-choose-shown]")).not.toBeNull();
  });
});

describe("addition and subtraction: make a round sum", () => {
  const ID = "phep-cong-phep-tru.visual.ket-hop-tu-lam";

  it("judges the pair at once, marks a wrong number and holds Tiếp", async () => {
    const { sounds } = await open(ID);
    expect(bar()).toBe("waiting");
    // Numbers 9, 4, 6 with a round ten: 4 + 6 is the pair.
    click("9");
    click("4");
    expect(screen.getByRole("button", { name: "9" })).toHaveAttribute(
      "data-wrong",
    );
    expect(screen.getByRole("button", { name: "4" })).not.toHaveAttribute(
      "data-wrong",
    );
    expect(screen.getByText(/Chưa đúng/)).toBeInTheDocument();
    expect(lastSound(sounds)).toEqual(["wrong-answer"]);
    expect(bar()).toBe("waiting");
  });

  it("never lets a third number be chosen: a new pick pushes out the oldest", async () => {
    await open(ID);
    click("9");
    click("4");
    click("6");
    expect(screen.getByRole("button", { name: "9" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.queryByText("Chọn đúng hai số.")).toBeNull();
  });

  it("goes green with the closing line when the pair is round", async () => {
    const { container, sounds } = await open(ID);
    click("4");
    click("6");
    expect(container.querySelector("[data-pair-done]")).not.toBeNull();
    expect(lastSound(sounds)).toEqual(["correct-jingle"]);
    expect(bar()).toBe("free");
    expect(screen.getByRole("button", { name: "4" })).toHaveClass("bg-correct");
    expect(screen.getByRole("button", { name: "9" })).toBeDisabled();
  });

  it("shows the pair on Xem cách làm", async () => {
    const { container } = await open(
      "phep-cong-phep-tru.visual.ghep-tron-tu-lam",
    );
    showHow();
    expect(bar()).toBe("free");
    expect(container.querySelector("[data-pair-shown]")).not.toBeNull();
    expect(screen.getByRole("button", { name: "35" })).toHaveClass(
      "bg-correct",
    );
    expect(screen.getByRole("button", { name: "65" })).toHaveClass(
      "bg-correct",
    );
  });

  it("is not judged in the exercise", async () => {
    await open("phep-cong-phep-tru.visual.ghep-tron-cham", {
      params: { unit: 10, n0: 16, n1: 38, n2: 24 },
    });
    expect(bar()).toBe("free");
  });
});

describe("addition and subtraction: move a number to round the other", () => {
  const ID = "phep-cong-phep-tru.visual.them-bot-tu-lam";

  it("holds Tiếp until the second number is round", async () => {
    const { container, sounds } = await open(ID);
    expect(bar()).toBe("waiting");
    // 36 + 28: moving 2 makes 30.
    click("Tăng số chuyển");
    expect(bar()).toBe("waiting");
    click("Tăng số chuyển");
    expect(bar()).toBe("free");
    expect(container.querySelector("[data-shift-done]")).not.toBeNull();
    expect(lastSound(sounds)).toEqual(["correct-jingle"]);
  });

  it("moves the right number on Xem cách làm", async () => {
    const { container } = await open(ID);
    showHow();
    expect(bar()).toBe("free");
    expect(container.querySelector("[data-shift-shown]")).not.toBeNull();
    expect(container.querySelector("[data-shift-done]")).toBeNull();
  });
});

describe("addition and subtraction: work out one column", () => {
  it.each([
    ["phep-cong-phep-tru.visual.cot-cong-tu-lam", "Số nhớ", 5, 1],
    ["phep-cong-phep-tru.visual.cot-tru-tu-lam", "Số mượn", 5, 1],
  ])(
    "%s holds Tiếp until digit and carry are right",
    async (id, carryName, digit, carry) => {
      const { container, sounds } = await open(id);
      expect(bar()).toBe("waiting");
      for (let i = 0; i < digit; i++) click("Tăng chữ số viết");
      expect(bar()).toBe("waiting");
      click(`Tăng ${carryName.toLowerCase()}`);
      expect(carry).toBe(1);
      expect(bar()).toBe("free");
      expect(container.querySelector("[data-column-done]")).not.toBeNull();
      expect(lastSound(sounds)).toEqual(["correct-jingle"]);
    },
  );

  it("sets the right digit and carry on Xem cách làm", async () => {
    const { container } = await open(
      "phep-cong-phep-tru.visual.cot-cong-tu-lam",
    );
    showHow();
    expect(bar()).toBe("free");
    expect(container.querySelector("[data-column-shown]")).not.toBeNull();
    expect(container.querySelector("[data-column-done]")).toBeNull();
  });
});

describe("multiplication and division: build the dot grid", () => {
  const ID = "phep-nhan-phep-chia.visual.xep-luoi-cung-lam";

  it("holds Tiếp until the grid is 3 rows of 5", async () => {
    const { container, sounds } = await open(ID);
    expect(bar()).toBe("waiting");
    for (let i = 0; i < 2; i++) click("Tăng số hàng");
    expect(bar()).toBe("waiting");
    for (let i = 0; i < 4; i++) click("Tăng chấm mỗi hàng");
    expect(bar()).toBe("free");
    expect(container.querySelector("[data-grid-done]")).not.toBeNull();
    expect(lastSound(sounds)).toEqual(["correct-jingle"]);
  });

  it("builds the grid on Xem cách làm", async () => {
    const { container } = await open(ID);
    showHow();
    expect(bar()).toBe("free");
    expect(container.querySelector("[data-grid-shown]")).not.toBeNull();
    expect(container.querySelector("[data-grid-done]")).toBeNull();
  });
});

describe("multiplication and division: split a factor", () => {
  const ID = "phep-nhan-phep-chia.visual.phan-phoi-tach";

  it("holds Tiếp until 12 is cut into tens and ones", async () => {
    const { sounds } = await open(ID);
    expect(bar()).toBe("waiting");
    // Starts at 6 + 6; 10 + 2 is four taps up.
    for (let i = 0; i < 3; i++) click("Tăng số thứ nhất");
    expect(bar()).toBe("waiting");
    click("Tăng số thứ nhất");
    expect(bar()).toBe("free");
    expect(lastSound(sounds)).toEqual(["correct-jingle"]);
  });

  it("makes the cut on Xem cách làm", async () => {
    await open(ID);
    showHow();
    expect(bar()).toBe("free");
    expect(screen.getByText(/Tách 12 = 10 \+ 2/)).toBeInTheDocument();
  });
});

describe("multiplication and division: fill a column multiplication", () => {
  const ID = "phep-nhan-phep-chia.visual.nhan-cot-26-4-cung-lam";

  it("holds Tiếp, rings a wrong digit and frees it once every cell is right", async () => {
    const { container, sounds } = await open(ID);
    const cells = tryCells(planMultiplication(26, 4));
    expect(bar()).toBe("waiting");
    const wrong = (cells[0]?.digit ?? 0) === 0 ? 1 : 0;
    click(`Chữ số ${wrong}`);
    expect(lastSound(sounds)).toEqual(["wrong-answer"]);
    expect(bar()).toBe("waiting");
    for (const cell of cells) click(`Chữ số ${cell.digit}`);
    expect(bar()).toBe("free");
    expect(container.querySelector("[data-col-mul-done]")).not.toBeNull();
    expect(lastSound(sounds)).toEqual(["correct-jingle"]);
  });

  it("fills the product on Xem cách làm", async () => {
    const { container } = await open(ID);
    showHow();
    expect(bar()).toBe("free");
    expect(container.querySelector("[data-col-mul-shown]")).not.toBeNull();
    expect(container.querySelector("[data-col-mul-done]")).toBeNull();
  });
});

describe("multiplication and division: deal the sweets", () => {
  const ID = "phep-nhan-phep-chia.visual.chia-keo-17-5-cung-lam";

  it("holds Tiếp until fewer sweets are left than friends", async () => {
    const { container, sounds } = await open(ID);
    expect(bar()).toBe("waiting");
    for (let i = 0; i < 2; i++) click("Chia một vòng");
    expect(bar()).toBe("waiting");
    click("Chia một vòng");
    expect(bar()).toBe("free");
    expect(container.querySelector("[data-share-done]")).not.toBeNull();
    expect(lastSound(sounds)).toEqual(["correct-jingle"]);
  });

  it("deals every round on Xem cách làm", async () => {
    const { container } = await open(ID);
    showHow();
    expect(bar()).toBe("free");
    expect(screen.getByText("Đã chia 3 vòng")).toBeInTheDocument();
    expect(container.querySelector("[data-share-shown]")).not.toBeNull();
  });
});

describe("multiplication and division: fill a long division", () => {
  const ID = "phep-nhan-phep-chia.visual.chia-cot-75-6-cung-lam";

  it("holds Tiếp, rings a wrong digit and frees it after the last step", async () => {
    const { container, sounds } = await open(ID);
    expect(bar()).toBe("waiting");
    const division = divide(75, 6);
    const first = division.steps[0];
    const wrong = first?.quotientDigit === 0 ? 1 : 0;
    click(`${wrong}`);
    expect(lastSound(sounds)).toEqual(["wrong-answer"]);
    expect(bar()).toBe("waiting");
    for (const step of division.steps) {
      for (const value of [step.quotientDigit, step.product, step.remainder]) {
        for (const digit of digitsOf(value)) click(`${digit}`);
      }
    }
    expect(bar()).toBe("free");
    expect(container.querySelector("[data-col-div-done]")).not.toBeNull();
    expect(lastSound(sounds)).toEqual(["correct-jingle"]);
  });

  it("works the division out on Xem cách làm", async () => {
    const { container } = await open(ID);
    showHow();
    expect(bar()).toBe("free");
    expect(container.querySelector("[data-col-div-shown]")).not.toBeNull();
    expect(container.querySelector("[data-col-div-done]")).toBeNull();
  });
});

describe("powers: walk to the last square, merge the groups", () => {
  it("holds Tiếp on the chessboard until the last square", async () => {
    const { container, sounds } = await open("luy-thua.visual.ban-co");
    expect(bar()).toBe("waiting");
    click("Ô sau");
    expect(bar()).toBe("waiting");
    click("Ô cuối");
    expect(bar()).toBe("free");
    expect(container.querySelector("[data-board-done]")).not.toBeNull();
    expect(lastSound(sounds)).toEqual(["correct-jingle"]);
  });

  it("goes to the last square on Xem cách làm", async () => {
    const { container } = await open("luy-thua.visual.ban-co");
    showHow();
    expect(bar()).toBe("free");
    expect(container.querySelector("[data-board-shown]")).not.toBeNull();
  });

  it("is not held in the exercise", async () => {
    await open("luy-thua.visual.ban-co", { params: { grains: 8 } });
    expect(bar()).toBe("free");
  });

  it("holds Tiếp until the two groups are merged", async () => {
    const { container, sounds } = await open("luy-thua.visual.ghep-luy-thua");
    expect(bar()).toBe("waiting");
    click("Tăng số mũ thứ nhất");
    expect(bar()).toBe("waiting");
    click("Ghép lại");
    expect(bar()).toBe("free");
    expect(container.querySelector("[data-merge-done]")).not.toBeNull();
    expect(lastSound(sounds)).toEqual(["correct-jingle"]);
  });

  it("merges the groups on Xem cách làm", async () => {
    const { container } = await open("luy-thua.visual.ghep-luy-thua");
    showHow();
    expect(bar()).toBe("free");
    expect(container.querySelector("[data-merge-shown]")).not.toBeNull();
  });
});

describe("free exploration screens never wait", () => {
  it.each([
    "luy-thua.visual.tao-luy-thua",
    "luy-thua.visual.binh-phuong-lap-phuong",
    "luy-thua.visual.bot-luy-thua",
    "luy-thua.visual.luy-thua-cua-10",
  ])("%s", async (id) => {
    await open(id);
    expect(bar()).toBe("free");
  });
});
