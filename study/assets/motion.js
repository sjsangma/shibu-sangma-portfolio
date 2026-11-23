/* Data Analyst Academy — motion controller.
   Vanilla, no build step: icon hydration → state feedback → tilt, ripple,
   counters, reveals, ambient particles and the boot sequence. */
(function () {
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const $ = (s, r) => (r || document).querySelector(s);
  const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reduce = reduceQuery.matches || localStorage.getItem("daa:motion") === "off";
  const icon = (n, c) => (window.Icon ? window.Icon(n, c || "") : "");

  /* ---------------- 1. boot sequence ---------------- */
  function boot() {
    const veil = $("#motionBoot");
    if (!veil) return;
    const done = () => {
      veil.classList.add("is-out");
      setTimeout(() => veil.remove(), 800);
      document.body.classList.add("booted");
    };
    if (sessionStorage.getItem("daa:booted") === "1" || reduce) { veil.remove(); return; }
    sessionStorage.setItem("daa:booted", "1");
    const wait = Math.max(0, 1500);
    setTimeout(done, wait);
  }

  /* ---------------- 2. icon hydration ---------------- */
  const NAV = {
    dashboard: "dashboard", curriculum: "curriculum", mycourses: "mycourses", library: "library",
    videos: "video", sessions: "clock", interview: "interview", assistant: "assistant", notes: "notes",
    analytics: "analytics", quiz: "quiz", exams: "trophy", cheatsheets: "cheatsheets",
    roadmap: "roadmap", admin: "lock", settings: "settings"
  };
  const STAT = {
    "Course progress": "target", "Day streak": "flame", "Lessons completed": "curriculum",
    "Video lessons watched": "video", "Average quiz score": "quiz",
    "Interview readiness": "interview", "Study hours": "clock"
  };
  const WORDS = [
    [/\b(download|export|csv|json|backup)\b/i, "download"],
    [/\b(upload|import)\b/i, "upload"],
    [/\b(add|create|new course|new module)\b/i, "plus"],
    [/\b(save|done|confirm|apply)\b/i, "check"],
    [/\b(delete|remove|clear|reset)\b/i, "trash"],
    [/\b(edit|rename|update)\b/i, "edit"],
    [/\b(search|find|filter)\b/i, "search"],
    [/\b(enrol|enroll|start|begin)\b/i, "rocket"],
    [/\b(send|ask)\b/i, "assistant"],
    [/\b(next|continue)\b/i, "chevron"],
    [/\b(back|previous|prev)\b/i, "arrowLeft"],
    [/\b(bookmark|star|favourite|favorite)\b/i, "star"],
    [/\b(quiz)\b/i, "quiz"],
    [/\b(exam)\b/i, "trophy"],
    [/\b(video|play|watch)\b/i, "video"]
  ];

  function hydrateNav() {
    $$(".nav-item").forEach((a) => {
      a.classList.add("mi-host");
      const ico = a.querySelector(".ico");
      if (ico && !ico.dataset.mi) {
        ico.dataset.mi = "1";
        ico.innerHTML = icon(NAV[a.dataset.view] || "dashboard");
        ico.setAttribute("aria-hidden", "true");
      }
    });
  }

  function hydrateTopbar() {
    const menuBtn = $("#menuBtn");
    if (menuBtn && !menuBtn.dataset.mi) {
      menuBtn.dataset.mi = "1";
      menuBtn.innerHTML = icon("menu");
      menuBtn.classList.add("mi-host");
    }
    const sIco = $(".search-ico");
    if (sIco && !sIco.dataset.mi) { sIco.dataset.mi = "1"; sIco.innerHTML = icon("search"); }
    const wrap = $(".search-wrap");
    if (wrap) wrap.classList.add("mi-host");
    const notif = $("#notifBtn");
    if (notif && !notif.dataset.mi) {
      notif.dataset.mi = "1";
      notif.innerHTML = icon("bell") + '<span class="notif-dot" id="notifDot" hidden></span>';
      notif.classList.add("mi-host");
    }
    const chip = $("#streakChip");
    if (chip && !chip.dataset.mi) {
      chip.dataset.mi = "1";
      const tn = Array.from(chip.childNodes).find((n) => n.nodeType === 3 && n.textContent.trim());
      if (tn) {
        const span = document.createElement("span");
        span.className = "mi-host streak-ico";
        span.innerHTML = icon("flame");
        chip.replaceChild(span, tn);
      }
      chip.classList.add("mi-host");
    }
    const reset = $("#resetBtn");
    if (reset && !reset.dataset.mi) { reset.dataset.mi = "1"; prependIcon(reset, "reset"); }
    const labels = { "#menuBtn": "Menu", "#notifBtn": "Notifications", "#themeBtn": "Theme",
      "#resetBtn": "Reset progress", "#streakChip": "Day streak" };
    Object.entries(labels).forEach(([sel, label]) => {
      const el = $(sel);
      if (el && !el.getAttribute("aria-label")) el.setAttribute("aria-label", label);
    });
    const brand = $(".brand-mark");
    if (brand) brand.classList.add("mi-host");
    const play = $("#playBtn");
    if (play && !play.dataset.mi) { play.dataset.mi = "1"; play.classList.add("mi-host"); if (!play.querySelector(".mi")) play.innerHTML = icon("video") + (play.textContent.trim() ? " " + play.textContent.trim() : ""); }
    [["#prevScene", "arrowLeft"], ["#nextScene", "arrowRight"], ["#mockClose", "close"], ["#notifClose", "close"]].forEach(([sel, n]) => {
      const b = $(sel);
      if (b && !b.dataset.mi) { b.dataset.mi = "1"; b.classList.add("mi-host"); if (!b.querySelector(".mi")) b.innerHTML = icon(n); }
    });
    $$(".arw").forEach((s) => { if (!s.dataset.mi) { s.dataset.mi = "1"; s.innerHTML = icon("arrowRight"); } });
    $$("#heroContinue, #heroExplore, #continueBtn").forEach((b) => {
      if (b.dataset.mi) return;
      b.dataset.mi = "1";
      b.classList.add("mi-host");
      if (b.id === "heroExplore") prependIcon(b, "curriculum");
    });
  }

  function prependIcon(el, name) {
    if (el.querySelector(":scope > .mi")) return;
    const span = document.createElement("span");
    span.className = "btn-ico";
    span.setAttribute("aria-hidden", "true");
    span.innerHTML = icon(name);
    el.insertBefore(span, el.firstChild);
    if (el === document.activeElement) return;
  }

  function hydrateStatCards() {
    $$(".stat-card").forEach((card, i) => {
      if (card.dataset.mi) return;
      card.dataset.mi = "1";
      const title = (card.querySelector(".stat-title") || {}).textContent || "";
      const name = STAT[title.trim()] || "analytics";
      const chip = document.createElement("span");
      chip.className = "card-ico mi-host";
      chip.setAttribute("aria-hidden", "true");
      chip.innerHTML = icon(name);
      const ring = card.querySelector(".ring");
      if (ring) card.insertBefore(chip, ring);
      else card.insertBefore(chip, card.firstChild);
      card.classList.add("tilt");
      card.style.setProperty("--i", String(i % 8));
    });
  }

  function hydrateButtons() {
    $$(".btn, .btn-sm, .link-btn, .btn-hero, .btn-ghost-glass, .pill-btn").forEach((b) => {
      if (b.dataset.mi || b.querySelector(":scope > .mi, :scope > .btn-ico")) return;
      const label = (b.textContent || "").replace(/\s+/g, " ").trim();
      if (!label || label.length > 48) return;
      const hit = WORDS.find(([re]) => re.test(label));
      if (!hit) return;
      b.dataset.mi = "1";
      b.classList.add("mi-host");
      prependIcon(b, hit[1]);
    });
  }

  function hydrate(scope) {
    hydrateNav();
    hydrateTopbar();
    hydrateStatCards();
    hydrateButtons();
    if (scope) hydrateDynamic(scope);
  }

  const DYN = [
    [".course-card", "library"], [".yt-card", "video"], [".module-card", "curriculum"],
    [".quiz-tile", "quiz"], [".exam-card", "trophy"], [".cheat-card", "cheatsheets"],
    [".plan-week", "roadmap"], [".week-card", "roadmap"], [".flashcard", "cards"], [".chat-msg", "assistant"]
  ];
  function hydrateDynamic(scope) {
    DYN.forEach(([sel, name]) => {
      $$(sel).forEach((el, i) => {
        if (el.dataset.mi) return;
        el.dataset.mi = "1";
        el.classList.add("tilt");
        if (i < 12) { el.style.setProperty("--i", String(i)); el.classList.add("m-anim-in"); }
        if (sel === ".chat-msg") return;
        const head = el.querySelector("h3, h4, .card-title, .module-name");
        if (head && !head.querySelector(".mi")) {
          const chip = document.createElement("span");
          chip.className = "card-ico mi-host";
          chip.setAttribute("aria-hidden", "true");
          chip.innerHTML = icon(name);
          head.insertBefore(chip, head.firstChild);
        }
      });
    });
    $$("[data-icon]").forEach((el) => {
      if (el.dataset.mi) return;
      el.dataset.mi = "1";
      el.classList.add("mi-host");
      el.insertAdjacentHTML("afterbegin", icon(el.dataset.icon));
    });
  }

  const PLAT = {
    "view-library": "library", "view-mycourses": "mycourses", "view-course": "curriculum",
    "view-assistant": "assistant", "view-notes": "notes", "view-analytics": "analytics",
    "view-admin": "lock", "view-settings": "settings"
  };
  function hydratePlat() {
    Object.keys(PLAT).forEach((id) => {
      const view = document.getElementById(id);
      if (!view) return;
      const head = view.querySelector(".plat-head > div:first-child");
      if (!head || head.dataset.mi) return;
      head.dataset.mi = "1";
      head.classList.add("mi-host");
      const chip = document.createElement("span");
      chip.className = "card-ico mi-host";
      chip.setAttribute("aria-hidden", "true");
      chip.innerHTML = icon(PLAT[id]);
      const kicker = head.querySelector(".plat-kicker");
      if (kicker) head.insertBefore(chip, kicker);
      else head.insertBefore(chip, head.firstChild);
    });
  }

  /* ---------------- 3. press + ripple + tooltip feedback ---------------- */
  const RIPPLE_HOSTS = ".btn, .btn-sm, .btn-hero, .btn-ghost-glass, .icon-btn, .nav-item, .chip, .streak-chip, .course-card, .module-card";
  document.addEventListener("pointerdown", (e) => {
    const host = e.target.closest(RIPPLE_HOSTS);
    if (!host || reduce) return;
    host.classList.add("ripple-host");
    const r = host.getBoundingClientRect();
    const size = Math.max(r.width, r.height) * 1.8;
    const ink = document.createElement("span");
    ink.className = "m-ripple";
    ink.style.width = ink.style.height = size + "px";
    ink.style.left = (e.clientX - r.left - size / 2) + "px";
    ink.style.top = (e.clientY - r.top - size / 2) + "px";
    host.appendChild(ink);
    setTimeout(() => ink.remove(), 640);
  }, { passive: true });

  document.addEventListener("pointerdown", (e) => {
    const hostEl = e.target.closest(".mi-host");
    const svg = e.target.closest(".mi") || (hostEl && hostEl.querySelector(".mi"));
    if (!svg || reduce) return;
    svg.classList.remove("is-pressed");
    void svg.getBoundingClientRect();
    svg.classList.add("is-pressed");
    setTimeout(() => svg.classList.remove("is-pressed"), 280);
  }, { passive: true });

  const tip = document.createElement("div");
  tip.className = "m-tip";
  tip.setAttribute("role", "tooltip");
  document.body.appendChild(tip);
  let tipTimer = 0;
  document.addEventListener("pointerover", (e) => {
    const host = e.target.closest("[aria-label]");
    if (!host || (!host.classList.contains("icon-btn") && host.textContent.trim().length > 2)) return;
    clearTimeout(tipTimer);
    tipTimer = setTimeout(() => {
      const r = host.getBoundingClientRect();
      tip.textContent = host.getAttribute("aria-label");
      tip.style.left = Math.min(window.innerWidth - 160, Math.max(8, r.left + r.width / 2 - 40)) + "px";
      tip.style.top = (r.bottom + 8) + "px";
      tip.classList.add("is-on");
    }, 350);
  });
  document.addEventListener("pointerout", (e) => {
    const host = e.target.closest("[aria-label]");
    if (host && e.relatedTarget && host.contains(e.relatedTarget)) return;
    clearTimeout(tipTimer); tip.classList.remove("is-on");
  });
  document.addEventListener("focusin", (e) => {
    const host = e.target.closest("[aria-label]");
    if (!host || (!host.classList.contains("icon-btn") && host.textContent.trim().length > 2)) return;
    const r = host.getBoundingClientRect();
    tip.textContent = host.getAttribute("aria-label");
    tip.style.left = Math.max(8, r.left) + "px";
    tip.style.top = (r.bottom + 8) + "px";
    tip.classList.add("is-on");
  });
  document.addEventListener("focusout", () => tip.classList.remove("is-on"));

  document.addEventListener("animationend", (e) => {
    if (e.animationName === "rise-in") e.target.classList.remove("m-anim-in");
  });

  /* ---------------- 4. 3D tilt ---------------- */
  {
    document.addEventListener("pointermove", (e) => {
      const card = e.target.closest(".tilt");
      if (!card) return;
      if (reduce || e.pointerType === "touch") return;
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.setProperty("--tilt-y", (px * 7).toFixed(2) + "deg");
      card.style.setProperty("--tilt-x", (-py * 6).toFixed(2) + "deg");
      card.classList.add("is-tilting");
    }, { passive: true });
    document.addEventListener("pointerleave", () => {}, true);
    document.addEventListener("pointerout", (e) => {
      const card = e.target.closest(".tilt");
      if (!card || card.contains(e.relatedTarget)) return;
      card.classList.remove("is-tilting");
      card.style.setProperty("--tilt-y", "0deg");
      card.style.setProperty("--tilt-x", "0deg");
    }, true);
  }

  /* ---------------- 5. numeric counters ---------------- */
  const COUNT_IDS = ["statLessons", "statStreak", "statVideos", "statQuiz", "statReadiness", "statHours",
    "overallPill", "ringPct", "wChipPct", "heroKpiLessons", "heroKpiStreak", "heroKpiQuiz", "heroKpiVideos"];
  function animateNumber(el) {
    if (reduce || el.dataset.counting === "1") return;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    let node = null;
    while (walker.nextNode()) { if (/\d/.test(walker.currentNode.textContent)) { node = walker.currentNode; break; } }
    if (!node) return;
    const raw = node.textContent;
    const match = raw.match(/-?\d+(?:\.\d+)?/);
    if (!match) return;
    const to = parseFloat(match[0]);
    const from = parseFloat(el.dataset.countPrev || "0");
    el.dataset.countPrev = String(to);
    if (!isFinite(from) || from === to) return;
    const start = performance.now();
    const dur = 760;
    el.dataset.counting = "1";
    const decimals = (match[0].split(".")[1] || "").length;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = from + (to - from) * eased;
      node.textContent = raw.replace(match[0], val.toFixed(decimals));
      if (p < 1) requestAnimationFrame(tick);
      else {
        node.textContent = raw;
        delete el.dataset.counting;
        el.classList.remove("num-flash"); void el.offsetWidth; el.classList.add("num-flash");
      }
    };
    requestAnimationFrame(tick);
  }
  function watchCounters() {
    COUNT_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const first = el.textContent.match(/-?\d+(?:\.\d+)?/);
      el.dataset.countPrev = first ? first[0] : "0";
      new MutationObserver(() => animateNumber(el)).observe(el, { childList: true, characterData: true, subtree: true });
    });
    const ring = document.getElementById("ringOverallFg");
    if (ring) {
      new MutationObserver(() => { if (!reduce) { const c = document.querySelector(".ring"); if (c) { c.classList.remove("m-ring-pulse"); void c.offsetWidth; c.classList.add("m-ring-pulse"); } } })
        .observe(ring, { attributes: true, attributeFilter: ["stroke-dashoffset", "style"] });
    }
  }

  /* ---------------- 6. view choreography ---------------- */
  function decorateView() {
    const view = $(".view.active");
    if (!view) return;
    view.classList.remove("m-enter");
    void view.offsetWidth;
    view.classList.add("m-enter");
    const items = $$(".stat-card, .panel, .module-card, .course-card, .yt-card, .plat-panel, .plan-week, .week-card, .cheat-card", view).slice(0, 14);
    items.forEach((el, i) => {
      if (reduce) return;
      el.style.setProperty("--i", String(Math.min(i, 8)));
      el.classList.remove("m-anim-in");
      void el.offsetWidth;
      el.classList.add("m-anim-in");
      el.addEventListener("animationend", () => el.classList.remove("m-anim-in"), { once: true });
    });
  }
  let refreshTimer = 0;
  function refresh() {
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => { hydrate(document); hydratePlat(); decorateView(); }, 70);
  }

  /* ---------------- 7. topbar controls ---------------- */
  function addControls() {
    const right = $(".topbar-right");
    if (!right || $("#themeBtn")) return;
    const theme = document.createElement("button");
    theme.className = "icon-btn mi-host";
    theme.id = "themeBtn";
    theme.type = "button";
    theme.setAttribute("aria-label", "Ambience: deep night");
    theme.innerHTML = icon("theme");
    theme.addEventListener("click", () => {
      const on = document.body.classList.toggle("dim-mode");
      theme.setAttribute("aria-pressed", on ? "true" : "false");
      theme.setAttribute("aria-label", on ? "Ambience: midnight" : "Ambience: deep night");
      localStorage.setItem("daa:dim", on ? "1" : "0");
    });
    if (localStorage.getItem("daa:dim") === "1") { document.body.classList.add("dim-mode"); theme.setAttribute("aria-pressed", "true"); }
    right.insertBefore(theme, right.firstChild);
  }

  /* ---------------- 8. menu morph + bell life ---------------- */
  function watchMenu() {
    const sidebar = $("#sidebar");
    const menuBtn = $("#menuBtn");
    if (!sidebar || !menuBtn) return;
    const sync = () => {
      const svg = menuBtn.querySelector(".mi-menu");
      if (svg) svg.classList.toggle("is-open", sidebar.classList.contains("open"));
    };
    new MutationObserver(sync).observe(sidebar, { attributes: true, attributeFilter: ["class"] });
    sync();
    const notif = $("#notifBtn");
    if (notif) notif.addEventListener("click", () => {
      const b = notif.querySelector(".mi-bell");
      if (!b || reduce) return;
      b.classList.add("is-ringing");
      setTimeout(() => b.classList.remove("is-ringing"), 900);
    });
  }

  /* ---------------- 9. ambient data particles ---------------- */
  function ambient() {
    if (reduce) return;
    const canvas = document.createElement("canvas");
    canvas.id = "motionParticles";
    canvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    let w = 0, h = 0, dpr = Math.min(2, window.devicePixelRatio || 1);
    const count = window.innerWidth < 720 ? 16 : 34;
    const dots = Array.from({ length: count }, () => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00022,
      vy: -0.00012 - Math.random() * 0.00028,
      r: 0.6 + Math.random() * 1.4,
      a: 0.12 + Math.random() * 0.4,
      hue: Math.random() > 0.55 ? "66,229,255" : "147,100,255"
    }));
    const resize = () => {
      w = canvas.width = Math.floor(innerWidth * dpr);
      h = canvas.height = Math.floor(innerHeight * dpr);
      canvas.style.width = innerWidth + "px";
      canvas.style.height = innerHeight + "px";
    };
    resize();
    addEventListener("resize", resize, { passive: true });
    let raf = 0, last = 0;
    const draw = (t) => {
      raf = requestAnimationFrame(draw);
      if (t - last < 45) return;
      last = t;
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        d.x += d.vx; d.y += d.vy;
        if (d.y < -0.05) { d.y = 1.05; d.x = Math.random(); }
        if (d.x < -0.05) d.x = 1.05;
        if (d.x > 1.05) d.x = -0.05;
        ctx.beginPath();
        ctx.arc(d.x * w, d.y * h, d.r * dpr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${d.hue},${d.a})`;
        ctx.fill();
      }
    };
    raf = requestAnimationFrame(draw);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else raf = requestAnimationFrame(draw);
    });
  }

  /* ---------------- 10. lazy-media skeletons ---------------- */
  function skeletonMedia(root) {
    $$("img[loading='lazy']", root || document).forEach((img) => {
      const wrap = img.parentElement;
      if (!wrap || wrap.classList.contains("m-skel-img")) return;
      wrap.classList.add("m-skel-img");
      const done = () => wrap.classList.add("is-loaded");
      if (img.complete && img.naturalWidth) done();
      else { img.addEventListener("load", done, { once: true }); img.addEventListener("error", done, { once: true }); }
    });
  }

  /* ---------------- 11. success celebration ---------------- */
  const CONFETTI = ["#42e5ff", "#9364ff", "#22bfff", "#35d6a0", "#b18aff"];
  function celebrate(x, y) {
    if (reduce) return;
    const cx = x == null ? innerWidth / 2 : x;
    const cy = y == null ? innerHeight * 0.28 : y;
    for (let i = 0; i < 22; i++) {
      const p = document.createElement("span");
      p.className = "m-confetti";
      p.style.left = cx + "px";
      p.style.top = cy + "px";
      p.style.background = CONFETTI[i % CONFETTI.length];
      document.body.appendChild(p);
      const dx = (Math.random() - 0.5) * 340;
      const dy = 120 + Math.random() * 260;
      p.animate([
        { transform: "translate(-50%,-50%) rotate(0deg)", opacity: 1 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${(Math.random() - 0.5) * 900}deg)`, opacity: 0 }
      ], { duration: 900 + Math.random() * 700, easing: "cubic-bezier(.2,.7,.2,1)" }).onfinish = () => p.remove();
    }
  }
  const toastEl = $("#toast");
  if (toastEl) {
    new MutationObserver(() => {
      if (!toastEl.classList.contains("show")) return;
      if (/complete|correct|passed|🎉|✓/i.test(toastEl.textContent)) celebrate();
    }).observe(toastEl, { attributes: true, attributeFilter: ["class"], childList: true, characterData: true, subtree: true });
  }

  /* ---------------- 12. init ---------------- */
  function start() {
    boot();
    hydrate(document);
    addControls();
    watchMenu();
    watchCounters();
    hydrateDynamic(document);
    hydratePlat();
    skeletonMedia(document);
    decorateView();
    ambient();
    const container = $("#viewContainer");
    if (container) new MutationObserver(refresh).observe(container, { childList: true, subtree: true });
    addEventListener("hashchange", refresh);
    reduceQuery.addEventListener?.("change", (e) => { reduce = e.matches; document.body.classList.toggle("reduce-motion", reduce); });
    document.body.classList.toggle("reduce-motion", reduce);
    window.Motion = {
      refresh,
      celebrate,
      off: () => { reduce = true; document.body.classList.add("reduce-motion"); },
      on: () => { reduce = false; document.body.classList.remove("reduce-motion"); }
    };
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
