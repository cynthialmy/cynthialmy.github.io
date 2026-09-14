/*
 * The left rail — see DESIGN.md
 *
 * One thing in the left margin, doing three jobs at once:
 *   navigation  — the page's own section headings, as prominent links
 *   position    — a curve that draws itself as you scroll, with a mark on it
 *   the climate — the tab's instrument at the head of the curve, small marks
 *                 strung along it further down
 *
 * The right margin is empty on purpose. Nothing here is decoration standing
 * on its own: every mark is threaded on the line the reader is travelling.
 */
(function () {
  var root = document.documentElement;

  /* the climate attribute drives the entrance timing in CSS; set it before any
     early return, since not every page has sections to index */
  (function () {
    var path = location.pathname.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
    var climate = "essay";
    if (path === "/" || path === "") climate = "origin";
    else if (/\/about\/?$/.test(path)) climate = "still";
    else if (/\/projects\/?$/.test(path)) climate = "instrument";
    root.setAttribute("data-climate", climate);
  })();

  var main = document.querySelector("main");
  if (!main) return;

  var NS = "http://www.w3.org/2000/svg";
  var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var heads = Array.prototype.slice.call(main.querySelectorAll("h2"));
  if (!heads.length) return;

  function setViewport() { root.style.setProperty("--vw", root.clientWidth + "px"); }
  setViewport();

  function railWidth() {
    var w = root.clientWidth;
    if (w < 1000) return 0;
    return (w - Math.min(1080, w - 340)) / 2 - 18;
  }

  function progress() {
    var max = root.scrollHeight - window.innerHeight;
    return max > 48 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  }

  /* ── shell ─────────────────────────────────────────── */

  var rail = document.createElement("nav");
  rail.className = "rail";
  rail.setAttribute("aria-label", "Sections on this page");

  var art = document.createElementNS(NS, "svg");
  art.setAttribute("class", "rail__art");
  art.setAttribute("fill", "none");
  art.setAttribute("aria-hidden", "true");
  rail.appendChild(art);

  var links = heads.map(function (h, i) {
    if (!h.id) h.id = "section-" + (i + 1);
    var a = document.createElement("a");
    a.className = "rail__link";
    a.href = "#" + h.id;
    a.innerHTML = '<span class="rail__text"></span>';
    a.firstChild.textContent = h.textContent.trim();
    a.addEventListener("click", function (e) {
      e.preventDefault();
      h.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "start" });
      history.replaceState(null, "", "#" + h.id);
      h.setAttribute("tabindex", "-1");
      h.focus({ preventScroll: true });
    });
    rail.appendChild(a);
    return { el: a, head: h, y: 0 };
  });

  document.body.appendChild(rail);

  var source = document.querySelector(".instrument svg");
  var motifTpl = document.getElementById("margin-motifs");
  var curve = null, guide = null, mark = null, curveLen = 0, nodes = [];
  var clipRect = null, endPath = null, cutY = 0;
  var footer = document.querySelector("footer");
  var W = 0, H = 0, Y0 = 0;

  /* the swing is whatever is left after the labels have their room */
  function amplitude(w) {
    return Math.min(16, Math.max(3, (w - 130) / 1.4));
  }

  function curveX(y, w) {
    var amp = amplitude(w);
    return (w - 40) + Math.sin(y / 190) * amp + Math.sin(y / 520 + 0.9) * amp * 0.4;
  }

  /* the line starts below the head mark, so it never strikes through it */
  function curveD(w, h, y0) {
    var d = "";
    for (var y = y0; y <= h; y += 16) {
      d += (y === y0 ? "M" : "L") + curveX(y, w).toFixed(1) + " " + y.toFixed(1);
    }
    return d + "L" + curveX(h, w).toFixed(1) + " " + h;
  }

  function nest(svgEl, x, y, size, parent) {
    var vb = (svgEl.getAttribute("viewBox") || "0 0 200 270").split(/\s+/).map(Number);
    var h = size * (vb[3] / vb[2]);
    x = Math.min(Math.max(x, size / 2 + 2), W - size / 2 - 2);
    y = Math.min(Math.max(y, h / 2 + 2), H - h / 2 - 2);
    var g = document.createElementNS(NS, "g");
    g.setAttribute("class", "rail__node");
    var inner = document.createElementNS(NS, "svg");
    inner.setAttribute("x", (x - size / 2).toFixed(1));
    inner.setAttribute("y", (y - h / 2).toFixed(1));
    inner.setAttribute("width", size.toFixed(1));
    inner.setAttribute("height", h.toFixed(1));
    inner.setAttribute("viewBox", vb.join(" "));
    inner.innerHTML = svgEl.innerHTML;
    g.appendChild(inner);
    (parent || art).appendChild(g);
    return g;
  }

  /* ── build ─────────────────────────────────────────── */

  function build() {
    W = railWidth();
    H = Math.round(window.innerHeight * 0.84);
    rail.classList.toggle("is-on", W >= 110);
    if (W < 110) return;

    art.innerHTML = "";
    nodes = [];
    rail.style.setProperty("--label-right", (46 + amplitude(W) * 1.4).toFixed(0) + "px");
    art.setAttribute("width", W);
    art.setAttribute("height", H);
    art.setAttribute("viewBox", "0 0 " + W + " " + H);

    /* head mark first: it decides where the line may begin */
    var headSize = source ? Math.min(W - 70, 72) : 0;
    var headH = 0;
    if (source) {
      var hb = (source.getAttribute("viewBox") || "0 0 200 270").split(/\s+/).map(Number);
      headH = headSize * (hb[3] / hb[2]);
    }
    Y0 = source ? Math.round(10 + headH + 14) : 12;

    var d = curveD(W, H, Y0);

    /* everything on the line lives inside a clip we can raise to meet the footer */
    var defs = document.createElementNS(NS, "defs");
    var clip = document.createElementNS(NS, "clipPath");
    clip.setAttribute("id", "rail-clip");
    clipRect = document.createElementNS(NS, "rect");
    clipRect.setAttribute("x", "0");
    clipRect.setAttribute("y", "0");
    clipRect.setAttribute("width", W);
    clipRect.setAttribute("height", H);
    clip.appendChild(clipRect);
    defs.appendChild(clip);
    art.appendChild(defs);

    var clipped = document.createElementNS(NS, "g");
    clipped.setAttribute("clip-path", "url(#rail-clip)");
    art.appendChild(clipped);

    guide = document.createElementNS(NS, "path");
    guide.setAttribute("d", d);
    guide.setAttribute("class", "rail__guide");
    clipped.appendChild(guide);

    curve = document.createElementNS(NS, "path");
    curve.setAttribute("d", d);
    curve.setAttribute("class", "rail__curve");
    clipped.appendChild(curve);
    art.__clipped = clipped;
    curveLen = curve.getTotalLength();
    curve.style.strokeDasharray = curveLen;

    /* the tab's instrument sits at the head of the curve, like a frontispiece */
    if (source) {
      nest(source, curveX(Y0, W), 10 + headH / 2, headSize).classList.add("is-head");
    }

    /* place the links where their sections fall, then thread small marks between */
    placeLinks();

    if (motifTpl) {
      var small = Array.prototype.slice.call(motifTpl.content.querySelectorAll("svg"));
      var stops = [];
      for (var i = 0; i < links.length - 1; i++) {
        var gap = links[i + 1].y - links[i].y;
        if (gap > 104) stops.push((links[i].y + links[i + 1].y) / 2);
      }
      var tail = links[links.length - 1].y;
      if (H - tail > 120) stops.push((tail + H) / 2);
      stops.forEach(function (y, i) {
        if (!small.length) return;
        nodes.push({
          el: nest(small[i % small.length], curveX(y, W), y, 38, art.__clipped),
          at: (y - Y0) / (H - Y0),
          y: y
        });
      });
    }

    /* a terminus, so the line ends rather than stopping */
    endPath = document.createElementNS(NS, "path");
    endPath.setAttribute("class", "rail__end");
    art.appendChild(endPath);

    mark = document.createElementNS(NS, "circle");
    mark.setAttribute("class", "rail__mark");
    mark.setAttribute("r", "3.4");
    art.appendChild(mark);

    sync();
  }

  function placeLinks() {
    var docH = Math.max(1, root.scrollHeight);
    var top = Y0 + 26;
    var bottom = cutY || H;
    var span = Math.max(60, bottom - top - 16);
    var last = -1e9;
    links.forEach(function (l) {
      var at = l.head.getBoundingClientRect().top + window.scrollY;
      var y = top + Math.min(1, Math.max(0, at / docH)) * span;
      if (y - last < 42) y = last + 42;
      last = y;
      l.y = Math.min(y, bottom - 10);
      l.el.style.top = l.y + "px";
    });
  }

  /* ── scroll ────────────────────────────────────────── */

  function sync() {
    if (W < 110 || !curve) return;
    var p = progress();

    /* the line ends where the footer begins, never across it */
    cutY = H;
    if (footer) {
      var ft = footer.getBoundingClientRect().top - window.innerHeight * 0.08;
      cutY = Math.max(Y0 + 70, Math.min(H, ft - 26));
    }
    clipRect.setAttribute("height", cutY.toFixed(1));
    var ex = curveX(cutY, W);
    endPath.setAttribute("d", "M" + (ex - 6).toFixed(1) + " " + cutY.toFixed(1) +
                              "L" + (ex + 6).toFixed(1) + " " + cutY.toFixed(1));
    placeLinks();
    var shown = still ? 1 : Math.min(1, p * 0.9 + 0.16);
    curve.style.strokeDashoffset = curveLen * (1 - shown);

    var my = Math.min(Y0 + p * (H - Y0), cutY - 2);
    mark.setAttribute("cx", curveX(my, W).toFixed(1));
    mark.setAttribute("cy", my.toFixed(1));

    nodes.forEach(function (n) {
      n.el.classList.toggle("is-shown", shown >= n.at - 0.02 && n.y < cutY - 24);
    });

    var line = window.scrollY + window.innerHeight * 0.32;
    var active = 0;
    links.forEach(function (l, i) {
      if (l.head.getBoundingClientRect().top + window.scrollY <= line) active = i;
    });
    links.forEach(function (l, i) { l.el.classList.toggle("is-active", i === active); });
  }

  /* ── life ──────────────────────────────────────────── */

  var clock = 0, lastNow = 0, raf = 0, hidden = false;
  function turn(now) {
    var dt = lastNow ? Math.min(48, now - lastNow) : 16;
    lastNow = now;
    clock += dt / 1000;
    rail.style.setProperty("--turn", (progress() * 140 + clock * 1.1).toFixed(2));
    raf = hidden ? 0 : requestAnimationFrame(turn);
  }

  function rebuild() { setViewport(); build(); }

  rebuild();
  window.addEventListener("resize", rebuild);
  window.addEventListener("load", rebuild);
  window.addEventListener("scroll", sync, { passive: true });

  if (!still) {
    document.addEventListener("visibilitychange", function () {
      hidden = document.hidden;
      if (hidden) { if (raf) cancelAnimationFrame(raf); raf = 0; }
      else if (!raf) { lastNow = 0; raf = requestAnimationFrame(turn); }
    });
    raf = requestAnimationFrame(turn);
  }
})();
