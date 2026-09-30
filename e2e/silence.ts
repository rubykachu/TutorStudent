// Browser runs (E2E, lesson walk, visual shots) never play sound on the
// machine's speakers. The app's audio is only HTMLMediaElement (shared clips,
// narration, lesson video), so each play starts at volume 0. Volume rather
// than `muted`: specs that record plays read `muted` to tell a real play from
// the silent unlock the app does, and replace `play` themselves.
export const SILENCE_MEDIA_SCRIPT = `(() => {
  const play = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function () {
    this.volume = 0;
    return play.call(this);
  };
})();`;
