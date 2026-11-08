/* Data Analyst Academy — holographic dashboard layer.
   Additive only: reads the existing app state (window.DAA) and DOM.
   Never writes progress, never invents numbers. */
(function () {
  "use strict";

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const mq = (q) => (window.matchMedia ? window.matchMedia(q) : { matches: false, addEventListener() {}, addListener() {} });
  const reduce = mq("(prefers-reduced-motion: reduce)");
  const noHover = mq("(hover: none)");
  const RING_C = 2 * Math.PI * 50;

  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* --------------------------------------------------------------- metrics */
  function metrics() {
    const D = window.DAA || {};
    const state = D.state || {};
    const lessonsState = state.lessons || {};
    const videosState = state.videos || {};
    const fcState = state.fc || {};
    const curriculum = D.CURRICULUM || [];
    const videos = D.VIDEOS || [];
    const cards = D.INTERVIEW || window.INTERVIEW || [];

    let total = 0, done = 0, minutes = 0, next = null;
    curriculum.forEach((mod) => {
      (mod.lessons || []).forEach((l) => {
        total++;
        const key = mod.id + ":" + l.id;
        if (lessonsState[key]) {
          done++;
          minutes += Number(l.minutes) || 0;
        } else if (!next) {
          next = { module: mod.title, title: l.title, href: "#curriculum" };
        }
      });
    });

    let videosDone = 0, videoMinutes = 0;
    videos.forEach((v) => {
      if (videosState[v.id]) { videosDone++; videoMinutes += Number(v.minutes) || 0; }
    });

    const known = cards.filter((c) => fcState[c.id] === "known").length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    const hours = (minutes + videoMinutes) / 60;

    return {
      pct, done, total, next,
      videosDone, videosTotal: videos.length,
      known, cards: cards.length,
      readiness: cards.length ? Math.round((known / cards.length) * 100) : 0,
      hours,
      lessonsMinutes: minutes,
      videoMinutes
    };
  }

  /* ----------------------------------------------------------------- hero */
  function paintHero(m) {
    const fg = $("#heroRingFg");
    if (fg) fg.style.strokeDashoffset = String(RING_C * (1 - m.pct / 100));
    const pct = $("#heroRingPct");
    if (pct) pct.textContent = m.pct + "%";

    const chipPct = $("#wChipPct");
    if (chipPct) chipPct.textContent = m.pct + "% of the roadmap";
    const chipStreak = $("#wChipStreak");
    const streak = parseInt((($("#statStreak") || {}).textContent) || "0", 10) || 0;
    if (chipStreak) chipStreak.textContent = streak + "-day streak";
    const chipNext = $("#wChipNext");
    if (chipNext) chipNext.textContent = m.next ? "Next: " + m.next.title : "All lessons complete";
  }

  /* ------------------------------------------------------------- stat cards */
  let lastHours = "";
  function paintStats(m) {
    const r = $("#statReadiness");
    if (r) r.innerHTML = m.readiness + '<span class="small">%</span>';
    const rl = $("#readinessLabel");
    if (rl) rl.textContent = m.known + " of " + m.cards + " cards known";

    const h = $("#statHours");
    if (h) h.innerHTML = m.hours.toFixed(1) + '<span class="small">h</span>';
    const hl = $("#hoursLabel");
    if (hl) {
      hl.textContent = Math.round(m.lessonsMinutes) + " min lessons · " + Math.round(m.videoMinutes) + " min video";
    }
    lastHours = m.hours.toFixed(1);
  }

  /* ------------------------------------------------------------ study queue */
  function paintNotifications(m) {
    const list = $("#notifList");
    if (!list) return;
    const quizState = (window.DAA && window.DAA.state && window.DAA.state.quiz) || {};
    const quizzes = (window.DAA && window.DAA.QUIZZES) || window.QUIZZES || [];
    const pendingQuiz = quizzes.filter((q) => {
      const r = quizState[q.id];
      return !r || !r.best;
    }).length;
    const examsState = (window.DAA && window.DAA.state && window.DAA.state.exams) || {};
    const exams = [].concat((window.DAA && window.DAA.EXAMS) || window.EXAMS || []);
    const pendingExam = exams.filter((e) => !examsState[e.id]).length;

    const items = [];
    if (m.next) {
      items.push({ icon: "▸", label: "Next lesson", text: m.next.title, go: "#curriculum" });
    }
    if (m.cards - m.known > 0) {
      items.push({ icon: "◈", label: "Interview", text: (m.cards - m.known) + " flashcards still to mark known", go: "#interview" });
    }
    if (pendingQuiz > 0) {
      items.push({ icon: "✓", label: "Quizzes", text: pendingQuiz + " quizzes not attempted yet", go: "#quiz" });
    }
    if (pendingExam > 0) {
      items.push({ icon: "🎓", label: "Exams", text: pendingExam + " exam papers available", go: "#exams" });
    }
    if (!items.length) {
      list.innerHTML = '<p class="notif-empty">Everything on the roadmap is complete — time for a mock interview.</p>';
      const dot = $("#notifDot");
      if (dot) dot.hidden = true;
      return;
    }
    list.innerHTML = items.slice(0, 4).map((it, i) =>
      '<button class="notif-item" type="button" data-go="' + it.go + '" data-i="' + i + '">' +
        '<i>' + it.icon + "</i><div><strong>" + esc(it.label) + "</strong><br><span>" + esc(it.text) + "</span></div></button>"
    ).join("");
    const dot = $("#notifDot");
    if (dot) dot.hidden = items.length === 0;
  }

  function wireNotifications() {
    const btn = $("#notifBtn");
    const panel = $("#notifPanel");
    if (!btn || !panel) return;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = !panel.hidden;
      panel.hidden = open;
      btn.setAttribute("aria-expanded", String(!open));
    });
    panel.addEventListener("click", (e) => {
      const item = e.target.closest("[data-go]");
      if (!item) return;
      const link = document.querySelector('.nav-item[href="' + item.dataset.go + '"]');
      if (link) link.click();
      panel.hidden = true;
      btn.setAttribute("aria-expanded", "false");
    });
    document.addEventListener("click", (e) => {
      if (panel.hidden) return;
      if (e.target.closest("#notifPanel, #notifBtn")) return;
      panel.hidden = true;
      btn.setAttribute("aria-expanded", "false");
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !panel.hidden) {
        panel.hidden = true;
        btn.setAttribute("aria-expanded", "false");
        btn.focus();
      }
    });
  }

  /* --------------------------------------------------------------- 3D tilt */
  function bindTilt() {
    if (noHover.matches || reduce.matches) return;
    $$(".stat-card, .module-card").forEach((card) => {
      if (card.dataset.holoTilt === "1") return;
      card.dataset.holoTilt = "1";
      let raf = 0, tx = 0, ty = 0;
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        tx = (py - 0.5) * -7;
        ty = (px - 0.5) * 9;
        card.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
        card.style.setProperty("--my", (py * 100).toFixed(1) + "%");
        if (!raf) {
          raf = requestAnimationFrame(() => {
            raf = 0;
            card.style.transform = "perspective(900px) rotateX(" + tx.toFixed(2) + "deg) rotateY(" + ty.toFixed(2) + "deg) translateY(-4px)";
          });
        }
      });
      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
        card.style.setProperty("--mx", "50%");
        card.style.setProperty("--my", "0%");
      });
    });
  }

  /* ---------------------------------------------------------- mobile drawer */
  function wireMobileNav() {
    const shell = $(".app-shell");
    $$(".nav-item").forEach((a) => {
      a.addEventListener("click", () => {
        if (window.innerWidth <= 900 && shell) shell.classList.remove("nav-open", "sidebar-open");
        document.body.classList.remove("nav-open", "drawer-open");
      });
    });
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape" || window.innerWidth > 900) return;
      document.body.classList.remove("nav-open", "drawer-open");
      if (shell) shell.classList.remove("nav-open", "sidebar-open");
    });
  }

  function wireHeroCtas() {
    const explore = $("#heroExplore");
    if (explore && explore.dataset.wired !== "1") {
      explore.dataset.wired = "1";
      explore.addEventListener("click", () => {
        const link = document.querySelector('.nav-item[href="#curriculum"]');
        if (link) link.click();
      });
    }
  }

  /* ------------------------------------------------------------------ loop */
  let lastSig = "";
  function refresh() {
    const m = metrics();
    const sig = [m.pct, m.done, m.total, m.known, m.readiness, m.hours.toFixed(2), m.videosDone].join("|");
    if (sig !== lastSig) {
      lastSig = sig;
      paintHero(m);
      paintStats(m);
      paintNotifications(m);
    }
    bindTilt();
  }

  function boot() {
    refresh();
    wireNotifications();
    wireMobileNav();
    wireHeroCtas();
    window.addEventListener("hashchange", () => setTimeout(refresh, 80));
    ["click", "keyup", "change"].forEach((ev) => document.addEventListener(ev, () => setTimeout(refresh, 120), true));
    setInterval(refresh, 2000);
    window.Holo = { refresh, metrics };
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
