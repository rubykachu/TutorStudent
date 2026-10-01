import path from "node:path";

// Settings of the lesson video pipeline (`pnpm video:build`), in one place.

const ROOT = process.cwd();
export const VIDEO_DIR = path.join(ROOT, "video");
export const PROJECTS_DIR = path.join(VIDEO_DIR, "projects");
export const COMPOSITION_DIR = path.join(VIDEO_DIR, "composition");
// Rendered files land here and are served by the app under the media base
// (`MEDIA_BASE_URL`, default /media). At go-live the same tree is uploaded to
// the media bucket unchanged, so lesson.json keeps its paths.
export const MEDIA_DIR = path.join(ROOT, "public", "media");
export const GLOBALS_CSS = path.join(ROOT, "src", "app", "globals.css");

// The arm64 Python that runs VieNeu-TTS and mlx-whisper, and its model
// cache; setup and pinned versions in video/requirements.txt.
export const PYTHON_BIN =
  process.env.VIDEO_PYTHON ?? path.join(VIDEO_DIR, ".venv", "bin", "python");
export const HF_HOME = process.env.VIDEO_HF_HOME ?? path.join(VIDEO_DIR, ".hf");
export const WHISPER_MODEL = "mlx-community/whisper-large-v3-turbo";

// Narration is slowed to this share of the voice's own speed, for a grade-6
// child who needs time to follow.
export const TEMPO = 0.9;
// Gemini already speaks at a calm pace of its own, so its narration is not
// slowed further.
export const GEMINI_TEMPO = 1;
// Each sentence's transcript must match the script this closely (character
// similarity after dropping tone marks and punctuation); a sentence below it
// is synthesized again, at most MAX_REGENERATIONS more times.
export const MATCH_THRESHOLD = 0.97;
export const MAX_REGENERATIONS = 3;
export const TTS_TEMPERATURE = 0.8;

// Longest silence the child should wait between two sentences or scenes: a
// longer one reads as a frozen video and costs file size. Every entry of
// PAUSE except leadIn and tail stays within it (tested).
export const PAUSE_MAX = 1.5;
// Silence in seconds: before the first sentence, between sentences, between
// scenes, and after the last sentence.
export const PAUSE = {
  leadIn: 1,
  sentence: 0.8,
  scene: 1.3,
  tail: 2,
  // After a sentence flagged `pause: "think"` (a key reveal) or
  // `pause: "ask"` (a question the child should try before the answer
  // shows): the silence after it is at least this long (longer of it and
  // the usual gap). Both within 1 to PAUSE_MAX seconds.
  think: 1,
  ask: 1.5,
};

// Pacing of a new video, for a slow, low-focus child (checked by
// `pacingIssues`; videos listed in `pacing-exempt.json` predate it).
export const PACING = {
  maxSentences: 16,
  maxWordsPerSentence: 12,
  minCheckpoints: 1,
  maxCheckpoints: 4,
  // Sentences between two checkpoints, at least.
  minSentencesBetweenCheckpoints: 3,
};
// The player stops this long after a checkpoint sentence ends; the next
// sentence must start at least CHECKPOINT_MARGIN later still.
export const CHECKPOINT_AFTER = 0.3;
export const CHECKPOINT_MARGIN = 0.3;
// Videos built before the pacing rules, one "<lesson>/<name>" each.
export const PACING_EXEMPT_FILE = path.join(VIDEO_DIR, "pacing-exempt.json");
// A caption shows at most this many words, so it fits two lines on a phone.
export const CAPTION_MAX_WORDS = 7;
// A clip starts a little before its first word and ends after its last.
export const CLIP_PAD = { before: 0.3, after: 0.6 };

export const RENDER = {
  width: 1280,
  height: 720,
  fps: 30,
  // H.264 High, constant quality capped by a bitrate that keeps a minute of
  // video (with audio) under MAX_MB_PER_MINUTE; a keyframe every 2 s so
  // seeking on iPad Safari lands quickly.
  crf: 24,
  maxrate: "1000k",
  bufsize: "2000k",
  gop: 60,
  audioBitrate: "96k",
  loudness: "loudnorm=I=-16:TP=-1.5:LRA=11",
};
export const MAX_MB_PER_MINUTE = 10;
export const HYPERFRAMES = "hyperframes@0.7.99";
