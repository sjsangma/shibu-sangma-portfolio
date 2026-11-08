/* Data Analyst Academy — app core: state, routing, dashboard, curriculum, reader, search */
(function () {
  "use strict";

  const STORE_KEY = "daa:v1";
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (s) =>
    String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const CURRICULUM = window.CURRICULUM || [];
  const VIDEOS = window.VIDEOS || [];
  const INTERVIEW = window.INTERVIEW || [];
  const QUIZZES = window.QUIZZES || [];
  const CHEATSHEETS = window.CHEATSHEETS || [];
  const ROADMAP = window.ROADMAP || [];

  const ALL_LESSONS = [];
  CURRICULUM.forEach((m) => (m.lessons || []).forEach((l) => ALL_LESSONS.push({ module: m, lesson: l })));
  const MODULE_BY_ID = {};
  CURRICULUM.forEach((m) => (MODULE_BY_ID[m.id] = m));

  /* ---------------- state ---------------- */
  const blank = () => ({ lessons: {}, videos: {}, fc: {}, quiz: {}, exams: {}, hi: {}, weeks: {}, days: [], sessions: [], lastLesson: null, lastVideo: null, lastView: "dashboard" });
  let state = blank();
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) state = Object.assign(blank(), JSON.parse(raw));
  } catch (e) { /* storage blocked on file:// in some browsers */ }

  let saveTimer = null;
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
    }, 120);
  }

  function todayKey() {
    const d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function touchDay() {
    const t = todayKey();
    if (!state.days.includes(t)) { state.days.push(t); save(); }
  }
  function streak() {
    if (!state.days.length) return 0;
    const set = new Set(state.days);
    let n = 0;
    const d = new Date();
    if (!set.has(todayKey())) d.setDate(d.getDate() - 1);
    for (;;) {
      const k = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
      if (!set.has(k)) break;
      n++;
      d.setDate(d.getDate() - 1);
    }
    return n;
  }

  /* ---------- greeting ---------- */
  const USER_NAME = (() => {
    try { return localStorage.getItem("daa:name") || "Shibu Sangma"; } catch (e) { return "Shibu Sangma"; }
  })();

  function salutation(hour) {
    if (hour < 5) return { text: "Still up", icon: "🌙" };
    if (hour < 12) return { text: "Good morning", icon: "☀️" };
    if (hour < 17) return { text: "Good afternoon", icon: "🌤️" };
    if (hour < 22) return { text: "Good evening", icon: "🌇" };
    return { text: "Good night", icon: "🌙" };
  }

  function isReturning() {
    const t = todayKey();
    return state.days.some((d) => d !== t);
  }

  function greetingFor(hour, returning) {
    if (returning) return "Welcome back, " + USER_NAME + " 👋";
    const s = salutation(hour);
    return s.text + ", " + USER_NAME + " " + s.icon;
  }

  function applyGreeting() {
    const title = $("#greetTitle");
    if (!title) return;
    const words = greetingFor(new Date().getHours(), isReturning()).split(" ");
    title.innerHTML = words
      .map((w, i) => `<span class="greet-w" style="animation-delay:${i * 80}ms">${esc(w)}</span>`)
      .join(" ");
    title.classList.remove("replay");
    void title.offsetWidth;
    title.classList.add("replay");

    const initials = USER_NAME.trim().split(/\s+/).slice(0, 2).map((w) => (w[0] || "").toUpperCase()).join("") || "D";

    const badge = $("#greetBadge");
    if (badge) badge.textContent = initials;

    const name = $("#profileName");
    if (name) name.textContent = USER_NAME;
    const av = $("#profileAvatar");
    if (av) av.textContent = initials;

    const sub = $("#dashSubtitle");
    if (sub) {
      const today = new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });
      sub.textContent = totalDone()
        ? `${today} · ${streak()}-day streak · ${pct(totalDone(), totalLessons)}% of the roadmap done`
        : `${today} · 12 modules, 68 lessons — start with module 1 and keep the streak alive`;
    }
  }

  function toast(msg) {
    const el = $("#toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove("show"), 2200);
  }

  const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
  const lessonsDoneIn = (m) => (m.lessons || []).filter((l) => state.lessons[m.id + ":" + l.id]).length;
  const modulePct = (m) => pct(lessonsDoneIn(m), (m.lessons || []).length);
  const totalLessons = ALL_LESSONS.length;
  const totalDone = () => CURRICULUM.reduce((a, m) => a + lessonsDoneIn(m), 0);
  const videosWatched = () => VIDEOS.filter((v) => state.videos[v.id]).length;

  /* ---------------- routing ---------------- */
  const views = ["dashboard", "curriculum", "lesson", "videos", "sessions", "interview", "quiz", "exams", "cheatsheets", "roadmap"];

  function go(view, opts) {
    if (!views.includes(view)) view = "dashboard";
    $$(".view").forEach((v) => v.classList.toggle("active", v.id === "view-" + view));
    $$(".nav-item").forEach((a) => a.classList.toggle("active", a.dataset.view === view));
    $("#sidebar").classList.remove("open");
    state.lastView = view;
    save();
    touchDay();
    if (view === "dashboard") renderDashboard();
    if (view === "curriculum") renderCurriculum();
    if (view === "videos") window.DAA && window.DAA.renderVideos && window.DAA.renderVideos();
    if (view === "sessions") window.DAA && window.DAA.renderSessions && window.DAA.renderSessions();
    if (view === "interview") window.DAA && window.DAA.renderInterview && window.DAA.renderInterview();
    if (view === "quiz") window.DAA && window.DAA.renderQuizzes && window.DAA.renderQuizzes();
    if (view === "exams") window.DAA && window.DAA.renderExams && window.DAA.renderExams();
    if (view === "cheatsheets") window.DAA && window.DAA.renderCheats && window.DAA.renderCheats();
    if (view === "roadmap") window.DAA && window.DAA.renderRoadmap && window.DAA.renderRoadmap();
    if (!opts || !opts.keepScroll) window.scrollTo({ top: 0, behavior: "instant" in window ? "auto" : "auto" });
    if (location.hash !== "#" + view) history.replaceState(null, "", "#" + view);
    window.DAA.state = state;
  }

  $$(".nav-item").forEach((a) =>
    a.addEventListener("click", (e) => { e.preventDefault(); go(a.dataset.view); })
  );
  window.addEventListener("hashchange", () => go(location.hash.slice(1) || "dashboard", { keepScroll: true }));

  /* ---------------- dashboard ---------------- */
  const R = 52, CIRC = 2 * Math.PI * R;

  function setRing(el, value) {
    if (!el) return;
    el.style.strokeDasharray = CIRC;
    el.style.strokeDashoffset = CIRC * (1 - Math.max(0, Math.min(100, value)) / 100);
    el.style.transform = "rotate(-90deg)";
    el.style.transformOrigin = "60px 60px";
  }

  function renderDashboard() {
    applyGreeting();
    const overall = pct(totalDone(), totalLessons);
    const ringFg = $("#ringOverallFg");
    setRing(ringFg, overall);
    $("#ringPct").textContent = overall + "%";
    $("#lessonsDoneLabel").textContent = totalDone() + " / " + totalLessons + " lessons";
    $("#overallPill").textContent = overall + "% complete";
    $("#statStreak").textContent = streak();
    $("#streakDays").textContent = streak();
    $("#statVideos").innerHTML = videosWatched() + '<span class="small">/' + VIDEOS.length + "</span>";

    const scores = Object.values(state.quiz);
    const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
    $("#statQuiz").textContent = avg === null ? "—" : avg + "%";
    $("#quizCountLabel").textContent = scores.length ? scores.length + " quiz" + (scores.length > 1 ? "zes" : "") + " taken" : "No quizzes taken yet";

    /* module bars */
    $("#moduleBars").innerHTML = CURRICULUM.map((m) => {
      const p = modulePct(m);
      return `<div class="bar-row" data-module="${esc(m.id)}" role="button" tabindex="0">
        <div class="bar-top"><span>${esc(m.icon || "▤")} ${esc(m.title)}</span><span class="muted tiny">${lessonsDoneIn(m)}/${(m.lessons || []).length} · ${p}%</span></div>
        <div class="bar-track"><div class="bar-fill" style="width:${p}%"></div></div>
      </div>`;
    }).join("");
    $$("#moduleBars .bar-row").forEach((r) =>
      r.addEventListener("click", () => openModule(r.dataset.module))
    );

    /* today's plan */
    const next = nextLesson();
    const quizLeft = QUIZZES.filter((q) => state.quiz[q.id] == null).length;
    const examsLeft = (window.EXAMS || []).filter((e) => state.exams[e.id] == null).length;
    const fcKnown = Object.values(state.fc).filter((v) => v === "known").length;
    const plan = [
      { t: next ? "Study: " + next.lesson.title : "All lessons complete 🎉", s: next ? next.module.title + " · " + (next.lesson.minutes || 10) + " min" : "Move on to interview practice", act: next ? () => openLesson(next.module.id, next.lesson.id) : null },
      { t: "Watch one video lesson", s: videosWatched() + " of " + VIDEOS.length + " watched", act: () => go("videos") },
      { t: quizLeft ? "Take a module quiz" : "Re-take your weakest quiz", s: quizLeft + " quizzes untouched", act: () => go("quiz") },
      { t: examsLeft ? "Sit a timed tool exam" : "Retake an exam to beat 85%", s: examsLeft ? examsLeft + " exam papers untouched" : (window.EXAMS || []).length + " papers taken", act: () => go("exams") },
      { t: "Review 10 interview flashcards", s: fcKnown + " of " + INTERVIEW.length + " marked known", act: () => go("interview") }
    ];
    $("#todayPlan").innerHTML = plan.map((p, i) =>
      `<div class="plan-item" data-i="${i}"><div class="plan-dot">${i + 1}</div><div><strong>${esc(p.t)}</strong><span class="muted tiny">${esc(p.s)}</span></div></div>`
    ).join("");
    $$("#todayPlan .plan-item").forEach((el) => {
      const p = plan[Number(el.dataset.i)];
      if (p.act) el.addEventListener("click", p.act);
    });

    /* recent */
    const recent = [];
    if (state.lastLesson) {
      const m = MODULE_BY_ID[state.lastLesson.m];
      const l = m && m.lessons.find((x) => x.id === state.lastLesson.l);
      if (l) recent.push({ t: l.title, s: m.title, act: () => openLesson(m.id, l.id) });
    }
    if (state.lastVideo) {
      const v = VIDEOS.find((x) => x.id === state.lastVideo);
      if (v) recent.push({ t: v.title, s: "Video · " + v.minutes + " min", act: () => { go("videos"); window.DAA.playVideo(v.id); } });
    }
    if (!recent.length) recent.push({ t: "Start with Foundations of Data Analytics", s: "Module 1 · 75 min", act: () => openModule("foundations") });
    $("#recentList").innerHTML = recent.map((r, i) => `<div class="search-hit" data-i="${i}"><div><strong>${esc(r.t)}</strong><div class="muted tiny">${esc(r.s)}</div></div></div>`).join("");
    $$("#recentList .search-hit").forEach((el) => el.addEventListener("click", () => recent[Number(el.dataset.i)].act()));

    /* readiness */
    const topics = {};
    INTERVIEW.forEach((c) => {
      topics[c.topic] = topics[c.topic] || { total: 0, known: 0 };
      topics[c.topic].total++;
      if (state.fc[c.id] === "known") topics[c.topic].known++;
    });
    const rows = Object.keys(topics).sort().slice(0, 8);
    $("#readiness").innerHTML = rows.map((t) => {
      const p = pct(topics[t].known, topics[t].total);
      return `<div class="readiness-row"><div class="readiness-top"><span>${esc(t)}</span><span class="muted tiny">${p}%</span></div><div class="readiness-track"><div class="readiness-fill" style="width:${p}%"></div></div></div>`;
    }).join("") || '<p class="muted">Start marking flashcards to see your readiness.</p>';
  }

  function nextLesson() {
    for (const m of CURRICULUM) {
      for (const l of m.lessons || []) {
        if (!state.lessons[m.id + ":" + l.id]) return { module: m, lesson: l };
      }
    }
    return null;
  }

  $("#continueBtn").addEventListener("click", () => {
    const n = nextLesson();
    if (n) openLesson(n.module.id, n.lesson.id);
    else go("interview");
  });

  /* ---------------- curriculum ---------------- */
  function renderCurriculum() {
    const f = ($("#curFilter") && $("#curFilter").value) || "all";
    const list = CURRICULUM.filter((m) => f === "all" || m.track === f);
    $("#moduleGrid").innerHTML = list.map((m) => {
      const p = modulePct(m);
      return `<article class="module-card" data-module="${esc(m.id)}" tabindex="0" role="button">
        <div class="module-icon">${esc(m.icon || "▤")}</div>
        <h3>${esc(m.title)}</h3>
        <p class="muted">${esc(m.blurb || "")}</p>
        <div class="module-meta">
          <span class="tag tag-ghost">${(m.lessons || []).length} lessons</span>
          <span class="tag tag-ghost">${(m.lessons || []).reduce((a, l) => a + (l.minutes || 0), 0)} min</span>
          ${p === 100 ? '<span class="tag tag-ok">Done</span>' : ""}
        </div>
        <div class="module-progress"><div class="module-progress-fill" style="width:${p}%"></div></div>
        <p class="muted tiny">${lessonsDoneIn(m)}/${(m.lessons || []).length} lessons complete</p>
      </article>`;
    }).join("") || '<p class="muted">No modules in this track yet.</p>';
    $$("#moduleGrid .module-card").forEach((c) => {
      c.addEventListener("click", () => openModule(c.dataset.module));
      c.addEventListener("keydown", (e) => { if (e.key === "Enter") openModule(c.dataset.module); });
    });
  }
  const filterEl = $("#curFilter");
  if (filterEl) filterEl.addEventListener("change", renderCurriculum);

  function openModule(id) {
    const m = MODULE_BY_ID[id];
    if (!m || !m.lessons.length) return;
    const firstUndone = m.lessons.find((l) => !state.lessons[m.id + ":" + l.id]) || m.lessons[0];
    openLesson(m.id, firstUndone.id);
  }

  /* ---------------- reader ---------------- */
  let current = { module: null, lesson: null };

  function openLesson(moduleId, lessonId) {
    const m = MODULE_BY_ID[moduleId];
    if (!m) return;
    const l = m.lessons.find((x) => x.id === lessonId) || m.lessons[0];
    current = { module: m, lesson: l };
    state.lastLesson = { m: m.id, l: l.id };
    save();

    $("#readerModuleTitle").textContent = m.title;
    $("#readerLessonList").innerHTML = m.lessons.map((x) => {
      const done = !!state.lessons[m.id + ":" + x.id];
      const active = x.id === l.id;
      return `<li class="${active ? "active" : ""}"><a href="#" data-lesson="${esc(x.id)}">${done ? "✓ " : ""}${esc(x.title)}<span class="muted tiny">${x.minutes || 10} min</span></a></li>`;
    }).join("");
    $$("#readerLessonList a").forEach((a) =>
      a.addEventListener("click", (e) => { e.preventDefault(); openLesson(m.id, a.dataset.lesson); })
    );

    const done = !!state.lessons[m.id + ":" + l.id];
    const pos = m.lessons.indexOf(l);
    const prev = m.lessons[pos - 1];
    const nxt = m.lessons[pos + 1];

    $("#readerBody").innerHTML = `
      <div class="reader-actions">
        <span class="tag">${esc(m.title)}</span>
        <span class="tag tag-ghost">${esc(l.minutes || 10)} min read</span>
      </div>
      <h1>${esc(l.title)}</h1>
      ${l.lede ? `<p class="lede muted">${esc(l.lede)}</p>` : ""}
      ${l.body || ""}
      <div class="reader-actions" style="margin-top:28px">
        <button class="btn ${done ? "btn-ghost" : "btn-ok"}" id="markLesson">${done ? "✓ Marked complete" : "Mark lesson complete"}</button>
        ${prev ? `<button class="btn btn-ghost" id="prevLesson">← ${esc(prev.title)}</button>` : ""}
        ${nxt ? `<button class="btn btn-ghost" id="nextLesson">${esc(nxt.title)} →</button>` : ""}
      </div>`;

    $("#markLesson").addEventListener("click", () => {
      const key = m.id + ":" + l.id;
      if (state.lessons[key]) { delete state.lessons[key]; toast("Marked as not complete"); }
      else { state.lessons[key] = true; toast("Lesson complete — nice work"); }
      save(); touchDay(); openLesson(m.id, l.id);
    });
    if (prev) $("#prevLesson").addEventListener("click", () => openLesson(m.id, prev.id));
    if (nxt) $("#nextLesson").addEventListener("click", () => openLesson(m.id, nxt.id));

    go("lesson");
    document.querySelector(".reader") && document.querySelector(".reader").scrollIntoView({ block: "start" });
    window.scrollTo(0, 0);
  }

  $("#backToModules").addEventListener("click", () => go("curriculum"));

  /* ---------------- search ---------------- */
  const searchInput = $("#globalSearch");
  const searchResults = $("#searchResults");

  const searchIndex = [];
  ALL_LESSONS.forEach(({ module, lesson }) =>
    searchIndex.push({ type: "Lesson", title: lesson.title, sub: module.title, text: module.title + " " + lesson.title + " " + (lesson.lede || ""), act: () => openLesson(module.id, lesson.id) })
  );
  VIDEOS.forEach((v) => searchIndex.push({ type: "Video", title: v.title, sub: v.minutes + " min · " + (MODULE_BY_ID[v.module] ? MODULE_BY_ID[v.module].title : "Video"), text: v.title + " " + v.blurb, act: () => { go("videos"); window.DAA.playVideo(v.id); } }));
  INTERVIEW.forEach((c) => searchIndex.push({ type: "Q&A", title: c.q, sub: c.topic + " · " + c.level, text: c.q + " " + c.a + " " + c.topic, act: () => { go("interview"); window.DAA.focusCard(c.id); } }));
  CHEATSHEETS.forEach((s) => searchIndex.push({ type: "Sheet", title: s.title + " cheat sheet", sub: "Reference", text: s.title + " " + s.body.replace(/<[^>]+>/g, " "), act: () => { go("cheatsheets"); window.DAA.openSheet(s.id); } }));

  function runSearch(q) {
    q = q.trim().toLowerCase();
    if (!q) { searchResults.classList.remove("open"); searchResults.innerHTML = ""; return; }
    const words = q.split(/\s+/);
    const hits = searchIndex
      .map((item) => {
        const hay = item.text.toLowerCase();
        let score = 0;
        words.forEach((w) => { if (item.title.toLowerCase().includes(w)) score += 3; if (hay.includes(w)) score += 1; });
        return { item, score };
      })
      .filter((h) => h.score >= words.length)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);

    searchResults.innerHTML = hits.length
      ? hits.map((h, i) => `<div class="search-hit" data-i="${i}"><div><span class="tag tag-ghost">${esc(h.item.type)}</span> <strong>${esc(h.item.title)}</strong><div class="muted tiny">${esc(h.item.sub)}</div></div></div>`).join("")
      : '<div class="search-hit"><span class="muted">No matches. Try “join”, “p-value”, “DAX”.</span></div>';
    searchResults.classList.add("open");
    $$("#searchResults .search-hit").forEach((el) => {
      const h = hits[Number(el.dataset.i)];
      if (!h) return;
      el.addEventListener("click", () => { searchResults.classList.remove("open"); searchInput.value = ""; h.item.act(); });
    });
  }
  if (searchInput) {
    searchInput.addEventListener("input", (e) => runSearch(e.target.value));
    searchInput.addEventListener("keydown", (e) => { if (e.key === "Escape") { searchInput.value = ""; runSearch(""); searchInput.blur(); } });
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".search-wrap")) searchResults.classList.remove("open");
    });
  }

  /* ---------------- misc ---------------- */
  $("#menuBtn").addEventListener("click", () => $("#sidebar").classList.toggle("open"));
  $("#resetBtn").addEventListener("click", () => {
    if (!confirm("Reset all progress, quiz scores and flashcard marks?")) return;
    state = blank();
    try { localStorage.removeItem(STORE_KEY); } catch (e) {}
    save();
    go("dashboard");
    toast("Progress reset");
  });

  document.addEventListener("keydown", (e) => {
    if (e.target.matches("input, textarea, select")) return;
    if (e.key === "/") { e.preventDefault(); searchInput && searchInput.focus(); }
  });

  /* expose for app2 */
  window.DAA = Object.assign(window.DAA || {}, {
    CURRICULUM, VIDEOS, INTERVIEW, QUIZZES, CHEATSHEETS, ROADMAP,
    MODULE_BY_ID, ALL_LESSONS, state, save, go, toast, esc, pct, touchDay, streak,
    openLesson, openModule, renderDashboard, renderCurriculum, totalLessons, totalDone,
    greetingFor, applyGreeting, USER_NAME
  });

  (window.DAA.refreshAll = function () {
    renderDashboard();
    const v = (location.hash || "#dashboard").slice(1);
    if (v === "curriculum") renderCurriculum();
  })();

  window.addEventListener("DOMContentLoaded", () => {
    touchDay(); save();
    go(location.hash.slice(1) || "dashboard");
  });
  if (document.readyState !== "loading") {
    touchDay(); save();
    go(location.hash.slice(1) || "dashboard");
  }
})();
