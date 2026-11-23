/* Shibu Sangma — premium 3D animated name identity (vanilla, no build step).
   Progressive enhancement: the markup keeps a plain-text fallback that is only
   hidden once this script has built and revealed the animated version. */
(function () {
  const WORDS = ["SHIBU", "SANGMA"];
  const TAGLINE = "Data Analyst | Creative Technologist | Lifelong Learner";
  const DUST = ["#42e5ff", "#9364ff", "#e8f6ff", "#22bfff", "#b18aff"];

  const reduced = () =>
    document.body.classList.contains("reduce-motion") ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function buildLetter(ch, i, depth) {
    const l = document.createElement("span");
    l.className = "nm-l";
    l.style.setProperty("--i", i);
    l.style.setProperty("--d", (i * 62 + 220) + "ms");
    l.style.setProperty("--px", (depth * 7).toFixed(2) + "px");
    l.style.setProperty("--py", (depth * -5).toFixed(2) + "px");
    l.style.setProperty("--ry", (depth * 8).toFixed(2) + "deg");
    l.style.setProperty("--rx", (depth * -6).toFixed(2) + "deg");

    const inner = document.createElement("span");
    inner.className = "nm-in";

    const ext = document.createElement("span");
    ext.className = "nm-ext";
    ext.setAttribute("aria-hidden", "true");
    ext.textContent = ch;

    const face = document.createElement("span");
    face.className = "nm-face";
    face.textContent = ch;

    const shine = document.createElement("span");
    shine.className = "nm-shine";
    shine.setAttribute("aria-hidden", "true");
    shine.textContent = ch;

    inner.appendChild(ext);
    inner.appendChild(face);
    inner.appendChild(shine);
    l.appendChild(inner);
    return l;
  }

  function build(host) {
    if (!host || host.dataset.nmBuilt === "1") return;
    host.dataset.nmBuilt = "1";

    const fallback = host.querySelector(".nm-fallback");
    if (fallback) fallback.textContent = WORDS.join(" ");

    const nm = document.createElement("span");
    nm.className = "nm";

    const glow = document.createElement("span");
    glow.className = "nm-glow";
    glow.setAttribute("aria-hidden", "true");
    nm.appendChild(glow);

    const scan = document.createElement("span");
    scan.className = "nm-scan";
    scan.setAttribute("aria-hidden", "true");
    nm.appendChild(scan);

    const stage = document.createElement("span");
    stage.className = "nm-3d";
    stage.setAttribute("aria-hidden", "true");

    let idx = 0;
    WORDS.forEach((word) => {
      const wordEl = document.createElement("span");
      wordEl.className = "nm-word";
      const centre = (word.length - 1) / 2;
      word.split("").forEach((ch, j) => {
        const depth = 1 - (Math.abs(j - centre) / Math.max(centre, 1)) * 0.55;
        wordEl.appendChild(buildLetter(ch, idx, Math.max(0.45, depth)));
        idx++;
      });
      stage.appendChild(wordEl);
    });
    nm.appendChild(stage);

    const rule = document.createElement("span");
    rule.className = "nm-underline";
    rule.setAttribute("aria-hidden", "true");
    nm.appendChild(rule);

    const tag = document.createElement("span");
    tag.className = "nm-tagline";
    tag.textContent = TAGLINE;
    nm.appendChild(tag);

    host.innerHTML = "";
    host.classList.add("is-enhanced");
    if (fallback) host.appendChild(fallback);
    host.appendChild(nm);

    function reveal() {
      if (host.classList.contains("is-in")) return;
      if (!reduced()) spawnDust(nm);
      host.classList.add("is-in");
    }

    /* entrance starts when the hero is actually on screen */
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          for (const en of entries) {
            if (en.isIntersecting) {
              io.disconnect();
              reveal();
              break;
            }
          }
        },
        { threshold: 0.25 }
      );
      io.observe(host);
    } else {
      setTimeout(reveal, 300);
    }

    /* restrained pointer parallax (skipped for touch and reduced motion) */
    let frame = 0;
    let px = 0;
    let py = 0;
    host.addEventListener(
      "pointermove",
      (e) => {
        if (e.pointerType === "touch" || reduced()) return;
        const r = host.getBoundingClientRect();
        if (!r.width) return;
        px = (e.clientX - r.left) / r.width - 0.5;
        py = (e.clientY - r.top) / r.height - 0.5;
        if (!frame) {
          frame = requestAnimationFrame(() => {
            frame = 0;
            host.style.setProperty("--mx", px.toFixed(3));
            host.style.setProperty("--my", py.toFixed(3));
          });
        }
      },
      { passive: true }
    );

    host.addEventListener(
      "pointerleave",
      () => {
        cancelAnimationFrame(frame);
        frame = 0;
        host.style.setProperty("--mx", "0");
        host.style.setProperty("--my", "0");
      },
      { passive: true }
    );

    /* light pulse on tap / click — never blocks navigation */
    host.addEventListener(
      "pointerdown",
      (e) => {
        if (reduced()) return;
        const r = host.getBoundingClientRect();
        const p = document.createElement("span");
        p.className = "nm-pulse";
        p.style.left = e.clientX - r.left + "px";
        p.style.top = e.clientY - r.top + "px";
        host.appendChild(p);
        setTimeout(() => p.remove(), 820);
      },
      { passive: true }
    );

    /* re-reveal only if the component is re-rendered by the app */
    window.addEventListener("hashchange", () => {
      if (location.hash.replace("#", "") !== "dashboard") return;
      if (!host.classList.contains("is-in")) reveal();
    });
  }

  function spawnDust(nm) {
    const colours = DUST;
    for (let i = 0; i < 16; i++) {
      const d = document.createElement("span");
      d.className = "nm-dust";
      const angle = (i / 16) * Math.PI * 2 + Math.random() * 0.6;
      const dist = 90 + Math.random() * 150;
      d.style.setProperty("--x0", Math.cos(angle) * dist + "px");
      d.style.setProperty("--y0", Math.sin(angle) * dist * 0.55 + "px");
      d.style.setProperty("--d", Math.round(Math.random() * 260) + "ms");
      d.style.setProperty("--s", (2 + Math.random() * 2).toFixed(1) + "px");
      d.style.setProperty("--c", colours[i % colours.length]);
      nm.appendChild(d);
      setTimeout(() => d.remove(), 2400);
    }
  }

  function init() {
    document.querySelectorAll(".nm-host").forEach(build);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

  window.NameIdentity = { init, build };
})();
