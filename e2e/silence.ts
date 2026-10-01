// Browser runs (E2E, lesson walk, visual shots) never play sound on the
// machine's speakers. The app's audio is only HTMLMediaElement (shared clips,
// narration, lesson video), so every element is really muted with volume 0
// from its first play on. The app must still see what it asked for: `muted`
// reads back the value the app set (or the element's own value before its
// first play), so code and specs that tell a real play from the silent unlock
// by `this.muted` behave as in a real browser.
export const SILENCE_MEDIA_SCRIPT = `(() => {
  const proto = HTMLMediaElement.prototype;
  const muted = Object.getOwnPropertyDescriptor(proto, "muted");
  const appMuted = new WeakMap();
  Object.defineProperty(proto, "muted", {
    configurable: true,
    get() {
      return appMuted.has(this) ? appMuted.get(this) : muted.get.call(this);
    },
    set(value) {
      appMuted.set(this, Boolean(value));
      muted.set.call(this, true);
    },
  });
  const play = proto.play;
  proto.play = function () {
    if (!appMuted.has(this)) appMuted.set(this, muted.get.call(this));
    muted.set.call(this, true);
    this.volume = 0;
    return play.call(this);
  };
})();`;
