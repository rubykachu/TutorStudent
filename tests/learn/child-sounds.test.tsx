import "fake-indexeddb/auto";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ChildSounds } from "@/learn/child-sounds";
import { resetAudioForTesting } from "@/lib/sound";
import { BUTTON_ID, soundUrl } from "@/lib/sound-manifest";
import { appDb, resetAppDbForTesting } from "@/progress/hooks";

// jsdom does not play media; this records what the real sound code asks of
// each element, like a browser that resets a playing clip on `load()`.
class FakeAudio extends EventTarget {
  static instances: FakeAudio[] = [];
  src: string;
  preload = "";
  muted = false;
  currentTime = 0;
  paused = true;
  loads = 0;
  plays = 0;
  // Set when the clip was playing and `load()` or `pause()` stopped it.
  cutOff = false;

  constructor(src: string) {
    super();
    this.src = src;
    FakeAudio.instances.push(this);
  }

  load() {
    this.loads += 1;
    if (!this.paused) this.cutOff = true;
    this.paused = true;
  }

  pause() {
    if (!this.paused && !this.muted) this.cutOff = true;
    this.paused = true;
  }

  play() {
    this.plays += 1;
    this.paused = false;
    return Promise.resolve();
  }
}

function clipOf(id: string): FakeAudio {
  const url = soundUrl(id);
  const found = FakeAudio.instances.find((a) => a.src === url);
  if (!found) throw new Error(`clip ${id} not created`);
  return found;
}

beforeEach(() => {
  FakeAudio.instances = [];
  vi.stubGlobal("Audio", FakeAudio);
});

afterEach(async () => {
  vi.unstubAllGlobals();
  resetAudioForTesting();
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

describe("ChildSounds", () => {
  it("presses a link that navigates away audibly: the next screen's preload does not cut the sound", async () => {
    const view = render(
      <ChildSounds childId="kid-1" key="lesson">
        <Link label="‹ Toán" />
      </ChildSounds>,
    );
    // Sound settings are read from IndexedDB; the clips preload once on.
    await waitFor(() => expect(FakeAudio.instances.length).toBeGreaterThan(0));

    fireEvent.click(screen.getByRole("link", { name: "‹ Toán" }));
    const button = clipOf(BUTTON_ID);
    expect(button.plays).toBe(1);

    // The link leads to another screen of the child: its own ChildSounds
    // mounts and preloads, while the press sound is still playing.
    view.rerender(
      <ChildSounds childId="kid-1" key="subject">
        <p>Toán</p>
      </ChildSounds>,
    );
    await waitFor(() => expect(screen.getByText("Toán")).toBeInTheDocument());
    await new Promise((resolve) => setTimeout(resolve, 20));

    expect(button.loads).toBe(1);
    expect(button.cutOff).toBe(false);
  });
});
