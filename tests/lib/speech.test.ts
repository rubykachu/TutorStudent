import { afterEach, describe, expect, it, vi } from "vitest";
import {
  pickVietnameseVoice,
  READ_ALOUD_RATE,
  readAloud,
  speechSentences,
  stopReading,
} from "@/lib/speech";
import { fakeVoice, installSpeech } from "./speech-mock";

afterEach(() => {
  stopReading();
  vi.unstubAllGlobals();
});

describe("pickVietnameseVoice", () => {
  it("prefers the iOS voice Linh over other Vietnamese voices", () => {
    const voice = pickVietnameseVoice([
      fakeVoice("Samantha", "en-US"),
      fakeVoice("Google tiếng Việt", "vi-VN", false),
      fakeVoice("Linh", "vi-VN"),
    ]);
    expect(voice?.name).toBe("Linh");
  });

  it("then an enhanced voice, then an on-device one", () => {
    expect(
      pickVietnameseVoice([
        fakeVoice("Online", "vi-VN", false),
        fakeVoice("An (Enhanced)", "vi_VN", false),
      ])?.name,
    ).toBe("An (Enhanced)");
    expect(
      pickVietnameseVoice([
        fakeVoice("Online", "vi-VN", false),
        fakeVoice("Local", "vi-vn"),
      ])?.name,
    ).toBe("Local");
  });

  it("finds nothing on a device without Vietnamese", () => {
    expect(pickVietnameseVoice([fakeVoice("Samantha", "en-US")])).toBeNull();
  });
});

describe("speechSentences", () => {
  it("splits prose the way the content lint counts sentences", () => {
    expect(speechSentences("Cáo xin kết bạn. Hoàng tử bé đồng ý!")).toEqual([
      "Cáo xin kết bạn.",
      "Hoàng tử bé đồng ý!",
    ]);
  });
});

describe("readAloud", () => {
  const linh = fakeVoice("Linh", "vi-VN");

  it("reads each part as its own utterance and reports the one being read", () => {
    const speech = installSpeech([linh]);
    const onSentence = vi.fn();
    readAloud(["Câu một.", "Câu hai."], { voice: linh, onSentence });
    expect(speech.spoken.map((u) => u.text)).toEqual(["Câu một.", "Câu hai."]);
    expect(speech.spoken[0]).toMatchObject({
      voice: linh,
      lang: "vi-VN",
      rate: READ_ALOUD_RATE,
    });
    speech.startNext();
    expect(onSentence).toHaveBeenLastCalledWith(0);
    speech.endCurrent();
    speech.startNext();
    expect(onSentence).toHaveBeenLastCalledWith(1);
    speech.endCurrent();
    expect(onSentence).toHaveBeenLastCalledWith(null);
  });

  it("stops: cancels the voice and clears the highlight", () => {
    const speech = installSpeech([linh]);
    const onSentence = vi.fn();
    const stop = readAloud(["Câu một.", "Câu hai."], {
      voice: linh,
      onSentence,
    });
    speech.startNext();
    stop();
    expect(speech.synth.cancel).toHaveBeenCalled();
    expect(onSentence).toHaveBeenLastCalledWith(null);
  });

  it("reads one text at a time: a new reading stops the previous one", () => {
    installSpeech([linh]);
    const first = vi.fn();
    readAloud(["Một."], { voice: linh, onSentence: first });
    readAloud(["Hai."], { voice: linh, onSentence: vi.fn() });
    expect(first).toHaveBeenLastCalledWith(null);
  });

  it("stops when the page is hidden", () => {
    installSpeech([linh]);
    const onSentence = vi.fn();
    readAloud(["Một."], { voice: linh, onSentence });
    window.dispatchEvent(new Event("pagehide"));
    expect(onSentence).toHaveBeenLastCalledWith(null);
  });
});
