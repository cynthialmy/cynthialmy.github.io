(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var climates = {
    origin: { r: 168, g: 128, b: 64 },
    still: { r: 158, g: 124, b: 72 },
    essay: { r: 142, g: 124, b: 88 },
    instrument: { r: 118, g: 122, b: 112 }
  };
  var cool = { r: 108, g: 114, b: 108 };

  function climateName() {
    var path = location.pathname.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
    if (path === "/" || path === "") return "origin";
    if (/\/about\/?$/.test(path)) return "still";
    if (/\/projects\/?$/.test(path)) return "instrument";
    return "essay";
  }

  document.documentElement.setAttribute("data-climate", climateName());

  var read = document.createElement("div");
  read.className = "path-read";
  read.setAttribute("aria-hidden", "true");
  document.body.prepend(read);

  function scrollProgress() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 48 ? Math.min(1, window.scrollY / max) : 0;
  }

  function syncRead() {
    read.style.transform = "scaleX(" + scrollProgress() + ")";
  }

  syncRead();
  window.addEventListener("scroll", syncRead, { passive: true });
  window.addEventListener("resize", syncRead);

  var canvas = document.createElement("canvas");
  canvas.className = "path-canvas";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);

  var ctx = canvas.getContext("2d");
  if (!ctx) return;

  var LAG = 700;
  var running = false;
  var hidden = false;
  var raf = 0;
  var lastNow = 0;
  var wash = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.42 };
  var washTarget = { x: wash.x, y: wash.y };

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
    placeWashFromScroll(true);
  }

  function mix(a, b, t) {
    return {
      r: Math.round(a.r + (b.r - a.r) * t),
      g: Math.round(a.g + (b.g - a.g) * t),
      b: Math.round(a.b + (b.b - a.b) * t)
    };
  }

  function washColor() {
    var base = climates[climateName()] || climates.essay;
    return mix(base, cool, scrollProgress() * 0.28);
  }

  function placeWashFromScroll(snap) {
    washTarget.x = window.innerWidth * 0.5;
    washTarget.y = window.innerHeight * (0.28 + scrollProgress() * 0.42);
    if (snap) {
      wash.x = washTarget.x;
      wash.y = washTarget.y;
    }
  }

  function washSettled() {
    var dx = washTarget.x - wash.x;
    var dy = washTarget.y - wash.y;
    return dx * dx + dy * dy <= 0.4;
  }

  function drawWash(color) {
    var radius = Math.max(window.innerWidth, window.innerHeight) * 0.52;
    var g = ctx.createRadialGradient(wash.x, wash.y, 0, wash.x, wash.y, radius);
    g.addColorStop(0, "rgba(" + color.r + "," + color.g + "," + color.b + ",0.16)");
    g.addColorStop(0.42, "rgba(" + color.r + "," + color.g + "," + color.b + ",0.07)");
    g.addColorStop(1, "rgba(" + color.r + "," + color.g + "," + color.b + ",0)");
    ctx.globalAlpha = 1;
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  }

  function tick(now) {
    var dt = lastNow ? Math.min(48, now - lastNow) : 16;
    lastNow = now;
    var k = 1 - Math.exp(-dt / LAG);
    wash.x += (washTarget.x - wash.x) * k;
    wash.y += (washTarget.y - wash.y) * k;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    drawWash(washColor());

    if (!hidden && !washSettled()) {
      raf = requestAnimationFrame(tick);
    } else {
      running = false;
      raf = 0;
    }
  }

  function start() {
    if (running || hidden) return;
    running = true;
    lastNow = 0;
    raf = requestAnimationFrame(tick);
  }

  function onScroll() {
    placeWashFromScroll(false);
    start();
  }

  function onVisibility() {
    hidden = document.hidden;
    if (hidden && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
      running = false;
    } else if (!hidden && !washSettled()) {
      start();
    }
  }

  resize();
  placeWashFromScroll(true);
  window.addEventListener("resize", resize);
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);
  start();
})();
