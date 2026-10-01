// Browser runs (E2E, lesson walk, visual shots) never play sound on the
// machine's speakers. The app's audio is HTMLMediaElement (songs, narration,
// lesson video) and Web Audio (the shared short clips). Every element is
// really muted with volume 0 from its first play on, and whatever a Web Audio
// node sends to the speakers goes through a gain of 0 first. The app must
// still see what it asked for: `muted` reads back the value the app set (or
// the element's own value before its first play), so code and specs that tell
// a real play from the silent unlock by `this.muted` behave as in a real
// browser.
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
  if (typeof AudioNode !== "undefined") {
    const connect = AudioNode.prototype.connect;
    const quiet = new WeakMap();
    AudioNode.prototype.connect = function (target, ...rest) {
      if (target instanceof AudioDestinationNode) {
        let gain = quiet.get(target.context);
        if (!gain) {
          gain = target.context.createGain();
          gain.gain.value = 0;
          connect.call(gain, target);
          quiet.set(target.context, gain);
        }
        return connect.call(this, gain, ...rest);
      }
      return connect.call(this, target, ...rest);
    };
  }
  const play = proto.play;
  proto.play = function () {
    if (!appMuted.has(this)) appMuted.set(this, muted.get.call(this));
    muted.set.call(this, true);
    this.volume = 0;
    return play.call(this);
  };
})();`;
