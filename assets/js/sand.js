/*
 * Sand — see DESIGN.md
 *
 * The pointer lifts a little sand. Grains drift, settle, and dry out inside a
 * second. Not a line stuck to the cursor: a few grains, mostly ink, the odd
 * one tea-gold, small enough to read as dust over the type rather than a layer
 * on top of it. Dies completely when the pointer stops.
 */
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!window.matchMedia("(hover: hover)").matches) return;

  var MAX = 110;
  var LIFE = 1100;

  var canvas = document.createElement("canvas");
  canvas.className = "sand";
  canvas.setAttribute("aria-hidden", "true");
  var ctx = canvas.getContext("2d");
  if (!ctx) return;
  document.body.prepend(canvas);

  var grains = [];
  var w = 0, h = 0;
  var lastX = null, lastY = null;
  var raf = 0, lastNow = 0, hidden = false;

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    var ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * ratio);
    canvas.height = Math.round(h * ratio);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function lift(x, y, dx, dy) {
    var speed = Math.min(6, Math.sqrt(dx * dx + dy * dy));
    var n = speed > 3 ? 3 : 2;
    for (var i = 0; i < n && grains.length < MAX; i++) {
      grains.push({
        x: x + (Math.random() - 0.5) * 6,
        y: y + (Math.random() - 0.5) * 6,
        vx: dx * 0.035 + (Math.random() - 0.5) * 0.25,
        vy: dy * 0.02 + Math.random() * 0.1,
        r: 0.6 + Math.random() * 1.0,
        life: LIFE * (0.6 + Math.random() * 0.6),
        age: 0,
        gold: Math.random() < 0.22
      });
    }
  }

  function step(dt) {
    var f = dt / 16.7;
    for (var i = grains.length - 1; i >= 0; i--) {
      var g = grains[i];
      g.age += dt;
      if (g.age >= g.life) { grains.splice(i, 1); continue; }
      /* the wind takes it back, and it settles */
      g.vx = g.vx * 0.97 + 0.006 * f;
      g.vy = g.vy * 0.985 + 0.012 * f;
      g.x += g.vx * f;
      g.y += g.vy * f;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < grains.length; i++) {
      var g = grains[i];
      var t = g.age / g.life;
      var a = (1 - t) * (1 - t) * 0.3;
      if (a < 0.005) continue;
      ctx.fillStyle = g.gold
        ? "rgba(112,78,28," + a * 1.15 + ")"
        : "rgba(26,26,24," + a + ")";
      ctx.beginPath();
      ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function tick(now) {
    var dt = lastNow ? Math.min(48, now - lastNow) : 16;
    lastNow = now;
    step(dt);
    draw();
    if (grains.length && !hidden) {
      raf = requestAnimationFrame(tick);
    } else {
      ctx.clearRect(0, 0, w, h);
      raf = 0;
    }
  }

  function start() {
    if (raf || hidden) return;
    lastNow = 0;
    raf = requestAnimationFrame(tick);
  }

  resize();
  window.addEventListener("resize", resize);

  window.addEventListener("pointermove", function (e) {
    if (e.pointerType === "touch") return;
    if (lastX !== null) {
      var dx = e.clientX - lastX;
      var dy = e.clientY - lastY;
      if (dx * dx + dy * dy > 20) {
        lift(e.clientX, e.clientY, dx, dy);
        start();
      }
    }
    lastX = e.clientX;
    lastY = e.clientY;
  }, { passive: true });

  document.addEventListener("visibilitychange", function () {
    hidden = document.hidden;
    if (hidden && raf) { cancelAnimationFrame(raf); raf = 0; grains.length = 0; }
  });
})();
