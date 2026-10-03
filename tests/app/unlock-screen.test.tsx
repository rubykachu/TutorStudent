import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { problemMessage, UnlockScreen } from "@/app/unlock/unlock-screen";

const realLocation = window.location;
const assign = vi.fn();

beforeEach(() => {
  Object.defineProperty(window, "location", {
    configurable: true,
    value: { ...realLocation, assign },
  });
});

afterEach(() => {
  Object.defineProperty(window, "location", {
    configurable: true,
    value: realLocation,
  });
  assign.mockReset();
  vi.unstubAllGlobals();
});

function answer(status: number, body: unknown = {}) {
  const fetchMock = vi.fn(async () => Response.json(body, { status }));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

function enter(code: string) {
  fireEvent.change(screen.getByLabelText(/Nhập mã của gia đình/), {
    target: { value: code },
  });
  fireEvent.click(screen.getByRole("button", { name: "Vào học" }));
}

describe("UnlockScreen", () => {
  it("keeps the button off until something is typed", () => {
    render(<UnlockScreen next="/" />);
    expect(screen.getByRole("button", { name: "Vào học" })).toBeDisabled();
  });

  it("posts the code and opens the page the visitor wanted", async () => {
    const fetchMock = answer(200, { ok: true });
    render(<UnlockScreen next="/parent" />);
    enter("sao-bien-4k7m");
    await waitFor(() => expect(assign).toHaveBeenCalledWith("/parent"));
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/session",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ code: "sao-bien-4k7m" }),
      }),
    );
  });

  it("tells a wrong code kindly and lets the child try again", async () => {
    answer(401, { error: "wrong" });
    render(<UnlockScreen next="/" />);
    enter("sai-roi-nhe");
    expect(await screen.findByText(/Chưa đúng rồi/)).toBeVisible();
    expect(assign).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Vào học" })).toBeEnabled();
  });

  it("says how long to rest after too many tries", async () => {
    answer(429, { error: "locked", retryAfterSeconds: 540 });
    render(<UnlockScreen next="/" />);
    enter("sai-roi-nhe");
    expect(await screen.findByText(/khoảng 9 phút nữa/)).toBeVisible();
  });

  it("suggests checking the network when the call fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new TypeError("offline");
      }),
    );
    render(<UnlockScreen next="/" />);
    enter("sao-bien-4k7m");
    expect(await screen.findByText(/kiểm tra mạng/)).toBeVisible();
  });
});

describe("the owl", () => {
  const defaultMatchMedia = window.matchMedia;
  afterEach(() => {
    window.matchMedia = defaultMatchMedia;
  });

  it("keeps moving while the child types, and after a wrong code", async () => {
    answer(401, { error: "wrong" });
    const { container } = render(<UnlockScreen next="/" />);
    expect(container.querySelector("[data-mascot-loop]")).not.toBeNull();
    enter("sao-bien-4k7m");
    await waitFor(() =>
      expect(container.querySelector("[data-mascot=hint]")).not.toBeNull(),
    );
    expect(container.querySelector("[data-mascot-loop]")).not.toBeNull();
  });

  it("stays still under reduced motion", () => {
    window.matchMedia = (query: string) => ({
      ...defaultMatchMedia(query),
      matches: query.includes("prefers-reduced-motion"),
    });
    const { container } = render(<UnlockScreen next="/" />);
    expect(container.querySelector("[data-mascot]")).not.toBeNull();
    expect(container.querySelector("[data-mascot-loop]")).toBeNull();
  });
});

describe("problemMessage", () => {
  it("rounds the wait up to whole minutes, at least one", () => {
    expect(problemMessage({ kind: "locked", retryAfterSeconds: 1 })).toContain(
      "1 phút",
    );
    expect(problemMessage({ kind: "locked", retryAfterSeconds: 61 })).toContain(
      "2 phút",
    );
  });
});
