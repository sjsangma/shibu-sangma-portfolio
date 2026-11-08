/* ===========================================================
   Depth layer — pointer tilt, 3D hero cube, scroll reveal
   =========================================================== */
(function () {
  "use strict";

  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var coarse = window.matchMedia ? window.matchMedia("(hover: none)") : null;
  var fine = !coarse || !coarse.matches;
  var TILT_SEL = [
    ".stat-card", ".panel", ".module-card", ".exam-card", ".hi-card",
    ".vid-card", ".tv-card", ".week-card", ".quiz-card", ".sheet-card"
  ].join(",");

  var MAX = 6;

  function tiltOn(el) {
    if (el.__tilt || !fine || reduced) return;
    el.__tilt = true;
    el.setAttribute("data-tilt", "");
    if (!el.querySelector(":scope > .tilt-glare")) {
      var g = document.createElement("div");
      g.className = "tilt-glare";
      el.appendChild(g);
    }
    el.addEventListener("pointermove", function (e) {
      var r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      el.classList.add("tilting");
      el.style.setProperty("--gx", ((px + 0.5) * 100).toFixed(1) + "%");
      el.style.setProperty("--gy", ((py + 0.5) * 100).toFixed(1) + "%");
      el.style.transform =
        "perspective(900px) rotateX(" + (-py * MAX).toFixed(2) + "deg) rotateY(" +
        (px * MAX).toFixed(2) + "deg) translateZ(0)";
    });
    el.addEventListener("pointerleave", function () {
      el.classList.remove("tilting");
      el.style.transform = "";
    });
  }

  var io = null;
  if ("IntersectionObserver" in window && !reduced) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
  }

  var seen = 0;
  function decorate(root) {
    var scope = root && root.querySelectorAll ? root : document;
    var nodes = scope.querySelectorAll(TILT_SEL);
    nodes.forEach(function (el) {
      tiltOn(el);
      if (io && !el.classList.contains("reveal")) {
        el.classList.add("reveal");
        el.style.transitionDelay = Math.min(seen++ % 8, 7) * 45 + "ms";
        io.observe(el);
      }
    });
  }

  function hero() {
    var head = document.querySelector("#view-dashboard .view-head");
    if (!head || head.querySelector(".hero-3d")) return;
    var faces = ["SQL", "Py", "XL", "BI", "T", "DA"];
    var wrap = document.createElement("div");
    wrap.className = "hero-3d";
    wrap.setAttribute("aria-hidden", "true");
    wrap.innerHTML =
      '<div class="cube">' +
      faces.map(function (f, i) { return '<span class="f' + (i + 1) + '">' + f + "</span>"; }).join("") +
      "</div><div class='cube-shadow'></div>";
    var btn = head.querySelector("button");
    if (btn) head.insertBefore(wrap, btn); else head.appendChild(wrap);
  }

  /* safety net: anything above the fold that the observer missed */
  function sweep() {
    var vh = window.innerHeight || 800;
    document.querySelectorAll(".reveal:not(.in)").forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < vh * 1.15 && r.bottom > -40) el.classList.add("in");
    });
  }

  var t = null;
  function refresh() {
    clearTimeout(t);
    t = setTimeout(function () {
      hero();
      decorate(document);
      setTimeout(sweep, 120);
    }, 60);
  }

  window.addEventListener("load", function () { refresh(); setTimeout(sweep, 300); });
  window.addEventListener("scroll", function () { if (sweep.t) return; sweep.t = requestAnimationFrame(function () { sweep.t = 0; sweep(); }); }, { passive: true });
  window.addEventListener("DOMContentLoaded", refresh);
  window.addEventListener("hashchange", refresh);
  if ("MutationObserver" in window) {
    var mo = new MutationObserver(function () { refresh(); });
    window.addEventListener("DOMContentLoaded", function () {
      var c = document.getElementById("viewContainer");
      if (c) mo.observe(c, { childList: true, subtree: true });
    });
  }
  refresh();
})();
