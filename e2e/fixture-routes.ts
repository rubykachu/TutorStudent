import { readFileSync } from "node:fs";
import path from "node:path";
import type { Page } from "@playwright/test";
import type { Lesson } from "@/schema/content";

// Test-only changes to the served fixture lesson, made by intercepting its
// JSON, so specs can reach renderer paths the committed fixture leaves out
// (a lesson video, a recorded overview narration) without media files.

type LessonPatch = (lesson: Lesson) => void;

export async function patchFixtureLesson(page: Page, patch: LessonPatch) {
  await page.route("**/content/fixture.json", async (route) => {
    const response = await route.fetch();
    const lesson = (await response.json()) as Lesson;
    patch(lesson);
    await route.fulfill({ response, json: lesson });
  });
}

export const FIXTURE_VIDEO_ID = "fixture.video.gioi-thieu";

// A lesson video at the start of the first section, with a clip for `cardId`
// so a review recap of that card offers "Xem lại đoạn video".
export function withVideo(cardId: string): LessonPatch {
  return (lesson) => {
    lesson.videos = [
      {
        id: FIXTURE_VIDEO_ID,
        lessonId: lesson.id,
        url: "video/fixture/gioi-thieu.mp4",
        vttUrl: "video/fixture/gioi-thieu.vtt",
        posterUrl: "video/fixture/gioi-thieu.jpg",
        durationSec: 30,
        clips: [{ id: "phep-nhan", start: 0, end: 10, cardIds: [cardId] }],
        voice: { engine: "local", voiceName: "Hải Đăng", model: "test" },
      },
    ];
    lesson.sections[0]?.blocks.unshift({
      type: "video",
      videoId: FIXTURE_VIDEO_ID,
    });
  };
}

// A 10 s test picture (a running clock) standing in for the fixture video,
// so the player can really play, pause and seek without media files.
const DEMO_VIDEO = path.join(import.meta.dirname, "assets", "video-demo.mp4");
export const DEMO_VIDEO_SECONDS = 10;
// Karaoke captions of the demo picture: one cue of seven words from 0.5 s to
// 9.5 s, so a caption is on screen while the video plays.
const DEMO_CAPTIONS = `WEBVTT

1
00:00:00.500 --> 00:00:09.500
Một <00:00:01.500>hai <00:00:02.500>ba <00:00:03.500>bốn <00:00:04.500>năm <00:00:05.500>sáu <00:00:06.500>bảy
`;

// The fixture video of `withVideo`, with the demo picture's length.
export function withDemoVideo(cardId: string): LessonPatch {
  return (lesson) => {
    withVideo(cardId)(lesson);
    const video = lesson.videos?.[0];
    if (video) video.durationSec = DEMO_VIDEO_SECONDS;
  };
}

// Serves the demo picture and its captions for the fixture video, answering
// byte-range requests the way a media server does, which seeking needs.
export async function serveDemoVideo(page: Page) {
  await page.route("**/media/video/fixture/gioi-thieu.vtt", (route) =>
    route.fulfill({
      status: 200,
      headers: { "Content-Type": "text/vtt; charset=utf-8" },
      body: DEMO_CAPTIONS,
    }),
  );
  const file = readFileSync(DEMO_VIDEO);
  await page.route("**/media/video/fixture/gioi-thieu.mp4", (route) => {
    const range = /bytes=(\d+)-(\d*)/.exec(
      route.request().headers().range ?? "",
    );
    const headers = { "Accept-Ranges": "bytes", "Content-Type": "video/mp4" };
    if (!range) {
      return route.fulfill({ status: 200, headers, body: file });
    }
    const start = Number(range[1]);
    const end = range[2] ? Number(range[2]) : file.length - 1;
    return route.fulfill({
      status: 206,
      headers: {
        ...headers,
        "Content-Range": `bytes ${start}-${end}/${file.length}`,
      },
      body: file.subarray(start, end + 1),
    });
  });
}

const NARRATION_AUDIO = "narration/fixture/overview.m4a";
const NARRATION_VTT = "narration/fixture/overview.vtt";

// A mono 16-bit WAV of silence, standing in for the narration audio.
function silentWav(seconds: number): Buffer {
  const rate = 8000;
  const data = Buffer.alloc(rate * seconds * 2);
  const header = Buffer.alloc(44);
  header.write("RIFF", 0, "ascii");
  header.writeUInt32LE(36 + data.length, 4);
  header.write("WAVEfmt ", 8, "ascii");
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(rate, 24);
  header.writeUInt32LE(rate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36, "ascii");
  header.writeUInt32LE(data.length, 40);
  return Buffer.concat([header, data]);
}

// A recorded narration on the fixture's overview: `vtt` is served as its
// captions and silence as its audio.
export async function withNarration(page: Page, vtt: string) {
  await patchFixtureLesson(page, (lesson) => {
    if (lesson.overview) {
      lesson.overview.narration = {
        audioUrl: NARRATION_AUDIO,
        vttUrl: NARRATION_VTT,
      };
    }
  });
  await page.route(`**/media/${NARRATION_VTT}`, (route) =>
    route.fulfill({ contentType: "text/vtt", body: vtt }),
  );
  await page.route(`**/media/${NARRATION_AUDIO}`, (route) =>
    route.fulfill({ contentType: "audio/wav", body: silentWav(20) }),
  );
}
