import "fake-indexeddb/auto";
import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const { flushOutbox } = vi.hoisted(() => ({
  flushOutbox: vi.fn(() => Promise.resolve()),
}));
vi.mock("@/user-feedback/outbox", () => ({ flushOutbox }));

import { FeedbackOutboxRunner } from "@/user-feedback/outbox-runner";

afterEach(() => flushOutbox.mockClear());

describe("FeedbackOutboxRunner", () => {
  it("flushes on mount and when the network comes back, and draws nothing", () => {
    const { container, unmount } = render(<FeedbackOutboxRunner />);
    expect(container.innerHTML).toBe("");
    expect(flushOutbox).toHaveBeenCalledTimes(1);
    window.dispatchEvent(new Event("online"));
    expect(flushOutbox).toHaveBeenCalledTimes(2);
    unmount();
    window.dispatchEvent(new Event("online"));
    expect(flushOutbox).toHaveBeenCalledTimes(2);
  });
});
