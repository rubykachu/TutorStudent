// Shared runtime of lesson video compositions (HyperFrames + GSAP).
// Loaded after gsap.min.js, owl.js and the page's window.TIMING (injected by
// `pnpm video:build`), before the page's own choreography. Every time comes
// from TIMING, never the wall clock, so a render is the same every time:
// the renderer seeks the one paused timeline frame by frame.
window.LV = (() => {
  const T = window.TIMING;
  const tl = window.gsap.timeline({ paused: true });
  window.__timelines = window.__timelines || {};
  window.__timelines.main = tl;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [
    ...root.querySelectorAll(selector),
  ];

  const scene = (sid) => {
    const found = T.scenes[sid];
    if (!found) throw new Error(`[timing] no scene ${sid}`);
    return found;
  };
  const start = (sid) => scene(sid).start;
  const end = (sid) => scene(sid).end;
  // A spoken word of a scene (lower case, tone marks kept, no punctuation);
  // `nth` counts repeats of the word within the scene.
  const hit = (sid, word, nth = 1) => {
    const found = scene(sid).words.filter((w) => w[0] === word)[nth - 1];
    if (!found) console.warn(`[timing] "${word}" #${nth} missing in ${sid}`);
    return found;
  };
  const W = (sid, word, nth = 1) => (hit(sid, word, nth) || [0, start(sid)])[1];
  const WE = (sid, word, nth = 1) =>
    (hit(sid, word, nth) || [0, 0, start(sid)])[2];

  // A colour token's value: GSAP cannot tween a var() reference.
  const color = (token) =>
    getComputedStyle(document.documentElement)
      .getPropertyValue(`--color-${token}`)
      .trim();

  // ---------- building blocks (DOM is built before any tween) ----------
  const make = (tag, className, parent, html) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (html !== undefined) node.innerHTML = html;
    if (parent) parent.append(node);
    return node;
  };
  // A power as in the lesson: blue base, violet raised exponent.
  const pow = (base, exponent) =>
    `<span class="pow"><span class="b">${base}</span><span class="e">${exponent}</span></span>`;
  const op = (symbol) => `<span class="op">${symbol}</span>`;
  const beads = (parent, count, label) => {
    const row = make("div", "beads", parent);
    for (let i = 0; i < count; i++) {
      const bead = make(
        "div",
        "bead",
        row,
        `<span class="slash"></span><span class="num">${label}</span>`,
      );
      window.gsap.set($(".slash", bead), { rotation: -45, scaleX: 0 });
    }
    return row;
  };
  // Cơ số blue at 30% on the surface: the disc of a crossed bead.
  const paleBlue = (() => {
    const hex = color("concept-blue").replace("#", "");
    const [r, g, b] = [0, 2, 4].map((k) =>
      Number.parseInt(hex.slice(k, k + 2), 16),
    );
    return `rgba(${r}, ${g}, ${b}, 0.3)`;
  })();
  // The mascot, one layer per pose, only the first shown.
  const owl = (parent, poses, style) => {
    const wrap = make("div", "owl-wrap", parent);
    Object.assign(wrap.style, style);
    const layers = {};
    poses.forEach((pose, i) => {
      layers[pose] = make("div", "owl-pose", wrap, window.OWL_SVG[pose]);
      if (i > 0) layers[pose].style.opacity = "0";
    });
    return { wrap, layers };
  };

  // ---------- tweens ----------
  const pop = (target, t, o = {}) =>
    tl.fromTo(
      target,
      { autoAlpha: 0, scale: o.from ?? 0.5 },
      {
        autoAlpha: 1,
        scale: 1,
        duration: o.d ?? 0.45,
        ease: o.ease ?? "back.out(1.8)",
        stagger: o.stagger ?? 0,
        immediateRender: false,
      },
      t,
    );
  const rise = (target, t, o = {}) =>
    tl.fromTo(
      target,
      { autoAlpha: 0, y: o.y ?? 30 },
      {
        autoAlpha: 1,
        y: 0,
        duration: o.d ?? 0.5,
        ease: "power3.out",
        stagger: o.stagger ?? 0,
        immediateRender: false,
      },
      t,
    );
  const fade = (target, t, d = 0.35) =>
    tl.to(target, { autoAlpha: 0, duration: d, ease: "power1.in" }, t);
  const hide = (targets) => window.gsap.set(targets, { autoAlpha: 0 });
  // Crosses out beads: the slash draws, then the bead fades to a pale disc.
  // Crosses out beads as the app does: the slash draws, the disc turns pale
  // and the number switches to the text colour with a halo, still legible.
  const cross = (targets, t, stagger = 0.35) => {
    const list = [].concat(targets);
    const halo = color("surface");
    list.forEach((bead, i) => {
      const at = t + i * stagger;
      tl.fromTo(
        $(".slash", bead),
        { rotation: -45, scaleX: 0 },
        {
          rotation: -45,
          scaleX: 1,
          duration: 0.25,
          ease: "power2.out",
          immediateRender: false,
        },
        at,
      );
      tl.to(bead, { backgroundColor: paleBlue, duration: 0.3 }, at + 0.2);
      tl.set(
        $(".num", bead),
        {
          color: color("foreground"),
          textShadow: `0 0 4px ${halo}, 0 0 4px ${halo}, 0 0 4px ${halo}`,
        },
        at + 0.2,
      );
    });
  };
  // Lights a chessboard square (the square being talked about) or puts it
  // back; both are explicit so seeking backwards shows the right state.
  const light = (square, t, on = true) => {
    if (!square.dataset.base) {
      square.dataset.base = getComputedStyle(square).backgroundColor;
    }
    tl.set(
      square,
      on
        ? {
            backgroundColor: color("highlight"),
            boxShadow: `inset 0 0 0 3px ${color("foreground")}`,
          }
        : { backgroundColor: square.dataset.base, boxShadow: "none" },
      t,
    );
  };
  // Switches the owl to a pose with a small hop.
  const pose = (o, name, t) => {
    Object.entries(o.layers).forEach(([key, layer]) => {
      tl.set(layer, { opacity: key === name ? 1 : 0 }, t);
    });
    tl.fromTo(
      o.wrap,
      { y: 0 },
      {
        y: -14,
        duration: 0.18,
        yoyo: true,
        repeat: 1,
        ease: "power1.out",
        immediateRender: false,
      },
      t,
    );
  };

  // Each scene fades in at its start and out just before the next begins.
  const scenes = (windows) => {
    windows.forEach(([selector, sid]) => {
      const el = $(selector);
      const t0 = start(sid);
      const t1 = end(sid);
      tl.fromTo(
        el,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.35, immediateRender: false },
        t0,
      );
      if (t1 < T.duration) tl.to(el, { autoAlpha: 0, duration: 0.3 }, t1 - 0.3);
    });
  };

  // Fades from and to the background and pins the timeline to the video length.
  const finish = () => {
    tl.fromTo("#fade", { opacity: 1 }, { opacity: 0, duration: 0.4 }, 0);
    tl.to(
      "#fade",
      { opacity: 1, duration: 0.8, ease: "power1.in" },
      T.duration - 0.8,
    );
    tl.set({}, {}, T.duration);
  };

  return {
    T,
    color,
    light,
    tl,
    $,
    $$,
    start,
    end,
    W,
    WE,
    make,
    pow,
    op,
    beads,
    owl,
    pop,
    rise,
    fade,
    hide,
    cross,
    pose,
    scenes,
    finish,
  };
})();
