import "fake-indexeddb/auto";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ChildSounds } from "@/learn/child-sounds";
import { resetAudioForTesting } from "@/lib/sound";
import { appDb, resetAppDbForTesting } from "@/progress/hooks";

// jsdom has no Web Audio; this records the sources a press starts and stops.
class FakeSource {
  buffer: { silent?: boolean } | null = null;
  onended: (() => void) | null = null;
  started = 0;
  stopped = 0;
  connect = vi.fn();
  disconnect = vi.fn();
  start() {
    this.started++;
  }
  stop() {
    this.stopped++;
  }
}

class FakeContext {
  static instances: FakeContext[] = [];
  // When set, decoding never finishes: a clip that is not ready.
  static stallDecode = false;
  state = "running";
  sampleRate = 44100;
  destination = {};
  sources: FakeSource[] = [];
  resume = vi.fn(async () => undefined);
  suspend = vi.fn(async () => undefined);
  constructor() {
    FakeContext.instances.push(this);
  }
  get pressed() {
    return this.sources.filter((s) => s.started && !s.buffer?.silent);
  }
  createBuffer() {
    return { silent: true, length: 1, numberOfChannels: 1 };
  }
  createBufferSource() {
    const source = new FakeSource();
    this.sources.push(source);
    return source;
  }
  decodeAudioData(): Promise<{ length: number; numberOfChannels: number }> {
    if (FakeContext.stallDecode) return new Promise(() => undefined);
    return Promise.resolve({ length: 100, numberOfChannels: 1 });
  }
}

beforeEach(() => {
  FakeContext.instances = [];
  FakeContext.stallDecode = false;
  vi.stubGlobal("AudioContext", FakeContext);
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({
      ok: true,
      arrayBuffer: async () => new ArrayBuffer(4),
    })),
  );
});

afterEach(async () => {
  resetAudioForTesting();
  vi.unstubAllGlobals();
  await appDb().delete();
  resetAppDbForTesting();
});

function Link({ label }: { label: string }) {
  return (
    <a href="/next" onClick={(event) => event.preventDefault()}>
      {label}
    </a>
  );
}

// Mounts a child's screen and taps once, so the clips decode.
async function mountAndTap(ui: React.ReactElement) {
  const view = render(ui);
  // Sound settings are read from IndexedDB; the install of the unlock follows.
  await waitFor(() => {
    window.dispatchEvent(new Event("pointerdown"));
    expect(FakeContext.instances).toHaveLength(1);
  });
  return view;
}

const context = () => FakeContext.instances[0] as FakeContext;

describe("ChildSounds", () => {
  it("presses a link that navigates away audibly: the next screen mounting does not cut the sound", async () => {
    const view = await mountAndTap(
      <ChildSounds childId="kid-1" key="lesson">
        <Link label="‹ Toán" />
      </ChildSounds>,
    );
    // The press sound is decoded within the first taps.
    await waitFor(() => {
      fireEvent.click(screen.getByRole("link", { name: "‹ Toán" }));
      expect(context().pressed.length).toBeGreaterThan(0);
    });
    const [press] = context().pressed;

    // The link leads to another screen of the child: its own ChildSounds
    // mounts and declares its clips, while the press sound is still playing.
    view.rerender(
      <ChildSounds childId="kid-1" key="subject">
        <p>Toán</p>
      </ChildSounds>,
    );
    await waitFor(() => expect(screen.getByText("Toán")).toBeInTheDocument());
    await new Promise((resolve) => setTimeout(resolve, 20));

    expect(press?.stopped).toBe(0);
    expect(FakeContext.instances).toHaveLength(1);
  });

  it("never holds a tap back for its sound: the action runs in the tap while the clip is not even decoded", async () => {
    FakeContext.stallDecode = true;
    const action = vi.fn();
    await mountAndTap(
      <ChildSounds childId="kid-1">
        <a
          href="/next"
          onClick={(event) => {
            event.preventDefault();
            action();
          }}
        >
          ‹ Toán
        </a>
        <button type="button" onClick={action}>
          Kiểm tra
        </button>
      </ChildSounds>,
    );
    fireEvent.click(screen.getByRole("link", { name: "‹ Toán" }));
    fireEvent.click(screen.getByRole("button", { name: "Kiểm tra" }));
    // Both actions ran inside their taps, with the sound still pending.
    expect(action).toHaveBeenCalledTimes(2);
    expect(context().pressed).toHaveLength(0);
  });
});
