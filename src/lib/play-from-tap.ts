// iOS Safari lets a page start media only from inside a tap, and the right
// is tied to the element that was asked to play. A file fetched after the tap
// arrives too late for that (the tap's activation can have expired), so the
// tap itself asks the element to play and, when the file is not here yet,
// gives it a silent clip to start and stop at once. The element is then
// unlocked: the real file is swapped in later on the same element and played
// without another tap. A new element would not be unlocked, so players never
// create one after the fetch.

const SAMPLE_RATE = 8000;
const SILENT_SAMPLES = 800;

function silentWavUri(): string {
  const bytes = new Uint8Array(44 + SILENT_SAMPLES);
  const view = new DataView(bytes.buffer);
  const text = (offset: number, value: string) => {
    for (let i = 0; i < value.length; i++) {
      bytes[offset + i] = value.charCodeAt(i);
    }
  };
  text(0, "RIFF");
  view.setUint32(4, 36 + SILENT_SAMPLES, true);
  text(8, "WAVEfmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, SAMPLE_RATE, true);
  view.setUint32(28, SAMPLE_RATE, true);
  view.setUint16(32, 1, true);
  view.setUint16(34, 8, true); // 8-bit: 0x80 is silence
  text(36, "data");
  view.setUint32(40, SILENT_SAMPLES, true);
  bytes.fill(0x80, 44);
  return `data:audio/wav;base64,${btoa(String.fromCharCode(...bytes))}`;
}

let silentUri: string | undefined;
function silentSource(): string {
  silentUri ??= silentWavUri();
  return silentUri;
}

// True while the element holds the silent clip: the events it fires then
// are not the child's playback and players ignore them.
export function holdsSilentClip(element: HTMLMediaElement | null): boolean {
  return element?.getAttribute("src") === silentSource();
}

// Wraps a media event handler so it does nothing for the silent clip.
export function ignoringSilentClip<
  E extends { currentTarget: HTMLMediaElement },
>(handler: (event: E) => void): (event: E) => void {
  return (event) => {
    if (!holdsSilentClip(event.currentTarget)) handler(event);
  };
}

// Call synchronously from the tap handler, before any await. `ready` is true
// when the element already has its real file: it plays now, and `onRefused`
// runs if the browser still says no (the player shows its play button
// again, nothing worse). Otherwise the element is unlocked with the silent
// clip and the caller plays the real file once it arrives.
export function playFromTap(
  element: HTMLMediaElement,
  ready: boolean,
  onRefused: () => void,
): void {
  if (ready) {
    Promise.resolve(element.play()).catch(onRefused);
    return;
  }
  // A real file is already set: nothing to unlock with.
  if (element.getAttribute("src") && !holdsSilentClip(element)) return;
  element.src = silentSource();
  // The start is cut short by the pause below, so this promise rejects by
  // design; being allowed to start is what unlocks the element.
  Promise.resolve(element.play()).catch(() => undefined);
  element.pause();
}
