(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var read = document.createElement("div");
  read.className = "path-read";
  read.setAttribute("aria-hidden", "true");
  document.body.prepend(read);

  function syncRead() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 48 ? Math.min(1, window.scrollY / max) : 0;
    read.style.transform = "scaleX(" + p + ")";
  }

  syncRead();
  window.addEventListener("scroll", syncRead, { passive: true });
  window.addEventListener("resize", syncRead);

  if (window.matchMedia("(pointer: coarse)").matches) return;

  var canvas = document.createElement("canvas");
  canvas.className = "path-canvas";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);

  var ctx = canvas.getContext("2d");
  if (!ctx) return;

  var MAX = 64;
  var LIFE = 1400;
  var points = [];
  var running = false;
  var hidden = false;
  var raf = 0;

  function dpr() {
    return Math.min(window.devicePixelRatio || 1, 2);
  }

  function resize() {
    var ratio = dpr();
    canvas.width = Math.round(window.innerWidth * ratio);
    canvas.height = Math.round(window.innerHeight * ratio);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    points = [];
  }

  function tick() {
    var now = performance.now();
    points = points.filter(function (p) {
      return now - p.t < LIFE;
    });

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    if (points.length > 1) {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "rgb(154, 132, 80)";

      for (var i = 1; i < points.length; i++) {
        var a = points[i - 1];
        var b = points[i];
        var age = (now - b.t) / LIFE;
        var wet = 1 - age;
        if (wet <= 0.02) continue;
        ctx.globalAlpha = wet * 0.16;
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        ctx.globalAlpha = wet * 0.45;
        ctx.lineWidth = 1.35;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        if (i < points.length - 1) {
          var c = points[i + 1];
          var mx = (b.x + c.x) / 2;
          var my = (b.y + c.y) / 2;
          ctx.quadraticCurveTo(b.x, b.y, mx, my);
        } else {
          ctx.lineTo(b.x, b.y);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    if (points.length && !hidden) {
      raf = requestAnimationFrame(tick);
    } else {
      running = false;
      raf = 0;
    }
  }

  function start() {
    if (running || hidden) return;
    running = true;
    raf = requestAnimationFrame(tick);
  }

  function onMove(e) {
    if (e.pointerType && e.pointerType !== "mouse") return;
    points.push({ x: e.clientX, y: e.clientY, t: performance.now() });
    if (points.length > MAX) points.shift();
    start();
  }

  function onVisibility() {
    hidden = document.hidden;
    if (hidden && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
      running = false;
    } else if (!hidden && points.length) {
      start();
    }
  }

  resize();
  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);
})();
