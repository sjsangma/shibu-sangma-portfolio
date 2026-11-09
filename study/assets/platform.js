/* Data Analyst Academy — platform layer: courses, 20-minute segments, notes,
   AI assistant shell, analytics, course studio and settings.
   Additive: reads the existing DAA state, never rewrites it. */
(function () {
  "use strict";

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const PKEY = "daa:platform:v1";
  const bound = new WeakMap();
  function on(host, fn) {
    const prev = bound.get(host);
    if (prev) host.removeEventListener("click", prev);
    bound.set(host, fn);
    host.addEventListener("click", fn);
  }
  const views = ["library", "mycourses", "course", "assistant", "notes", "analytics", "admin", "settings"];

  const D = () => window.DAA || {};
  const state = () => (window.DAA && window.DAA.state) || {};
  const dt = () => new Date().toISOString().slice(0, 10);
  const uid = () => Math.random().toString(36).slice(2, 10);
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const fmtTime = (s) => {
    s = Math.max(0, Math.round(s || 0));
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
    return (h ? h + ":" + String(m).padStart(2, "0") : m) + ":" + String(x).padStart(2, "0");
  };

  const blank = () => ({
    version: 1,
    courses: null,
    enroll: [],
    notes: [],
    bookmarks: [],
    segments: {},
    positions: {},
    lastCourse: null,
    lastLesson: {},
    profile: { name: "Shibu Sangma", role: "owner" },
    settings: { ownerMode: true, aiEndpoint: "", supabaseUrl: "", supabaseKey: "" },
    ai: []
  });

  let P = blank();
  try {
    const raw = localStorage.getItem(PKEY);
    if (raw) P = Object.assign(blank(), JSON.parse(raw));
  } catch (e) { /* storage unavailable */ }

  let saveT = null;
  function persist() {
    clearTimeout(saveT);
    saveT = setTimeout(() => {
      try { localStorage.setItem(PKEY, JSON.stringify(P)); } catch (e) { /* ignore */ }
    }, 120);
  }

  /* ------------------------------------------------------------ seed data */
  const COLORS = [
    ["#0c4a6e", "#22bfff"], ["#3b0764", "#a855f7"], ["#064e3b", "#35d6a0"],
    ["#4c1d95", "#8b8bff"], ["#7c2d12", "#fb923c"], ["#0f2f5c", "#38bdf8"]
  ];

  function topicVideos() {
    const out = [];
    (window.TOPIC_VIDEOS || []).forEach((t) => {
      ["main", "alt"].forEach((k) => {
        const v = t[k];
        if (!v) return;
        out.push({ id: "yt-" + v.id, title: v.title, yt: v.id, minutes: v.minutes, channel: v.channel, tool: t.topic, lang: "English" });
      });
    });
    (window.HINDI_TRACK || []).forEach((t) => {
      (t.levels || []).forEach((v) => {
        out.push({ id: "yt-" + v.id, title: v.title, yt: v.id, minutes: v.min, channel: v.ch, tool: t.tool, lang: "Hindi" });
      });
    });
    return out;
  }

  function seedCourses() {
    const mods = D().CURRICULUM || [];
    const all = mods.map((m) => m.id);
    const byTool = {};
    topicVideos().forEach((v) => (byTool[v.tool] = byTool[v.tool] || []).push(v));
    const pick = (...keys) => keys.reduce((a, k) => a.concat(byTool[k] || []), []);

    return [
      {
        id: "track-data-analyst", title: "Data Analyst Career Track",
        category: "Data Analytics", level: "Beginner to Advanced",
        description: "The full path from raw spreadsheets to interview-ready analysis: Excel, SQL, Python, statistics, visualisation, Power BI, storytelling and a capstone project.",
        objectives: ["Read and clean real datasets", "Write analytical SQL with confidence", "Build dashboards that answer business questions", "Present insights and pass a data analyst interview"],
        moduleIds: all, videos: pick("Python", "Excel", "SQL", "Power BI", "Tableau"),
        published: true, createdAt: dt(), color: 0
      },
      {
        id: "excel-core", title: "Excel for Analysts",
        category: "Excel", level: "Beginner",
        description: "Formulas, lookups, pivot tables, Power Query and a full interactive dashboard project.",
        objectives: ["Master lookup and aggregation formulas", "Build pivot dashboards", "Automate cleaning with Power Query"],
        moduleIds: ["excel", "viz"], videos: pick("Excel"),
        published: true, createdAt: dt(), color: 1
      },
      {
        id: "sql-core", title: "SQL for Analysts",
        category: "SQL", level: "Beginner to Intermediate",
        description: "SELECT to window functions, joins that do not duplicate rows, and the interview patterns that repeat.",
        objectives: ["Model queries logically", "Use joins, CTEs and window functions", "Solve timed SQL interview questions"],
        moduleIds: ["sql"], videos: pick("SQL"),
        published: true, createdAt: dt(), color: 2
      },
      {
        id: "python-core", title: "Python & Pandas for Data",
        category: "Python", level: "Beginner to Intermediate",
        description: "Python fundamentals then real pandas work: loading, joining, grouping and exploratory analysis.",
        objectives: ["Write clean Python", "Manipulate dataframes with pandas", "Run an end-to-end EDA"],
        moduleIds: ["python", "pandas", "eda"], videos: pick("Python"),
        published: true, createdAt: dt(), color: 3
      },
      {
        id: "stats-core", title: "Statistics for Decision Making",
        category: "Statistics", level: "Intermediate",
        description: "Descriptive statistics, distributions, sampling, hypothesis testing and the traps interviewers probe.",
        objectives: ["Choose the right test", "Interpret p-values honestly", "Explain variance and uncertainty"],
        moduleIds: ["stats", "governance"], videos: [],
        published: true, createdAt: dt(), color: 4
      },
      {
        id: "powerbi-core", title: "Power BI & DAX",
        category: "Power BI", level: "Beginner to Intermediate",
        description: "Model data, write DAX measures and ship a report that survives real stakeholder questions.",
        objectives: ["Build a star schema", "Write CALCULATE-based measures", "Design report pages that read clearly"],
        moduleIds: ["powerbi", "viz"], videos: pick("Power BI", "Tableau"),
        published: true, createdAt: dt(), color: 5
      },
      {
        id: "interview-prep", title: "Interview Preparation Sprint",
        category: "Interview Preparation", level: "All levels",
        description: "Storytelling, stakeholder scenarios and 193 flashcards across SQL, Python, Excel, statistics and Power BI.",
        objectives: ["Structure answers with STAR", "Handle take-home case studies", "Revise weak topics with spaced repetition"],
        moduleIds: ["story", "capstone"], videos: [],
        published: true, createdAt: dt(), color: 1
      }
    ];
  }

  function courses() {
    if (!Array.isArray(P.courses) || !P.courses.length) {
      P.courses = seedCourses();
      persist();
    }
    return P.courses;
  }
  const courseById = (id) => courses().filter((c) => c.id === id)[0] || null;

  /* --------------------------------------------------------------- helpers */
  function moduleList(c) {
    const map = {};
    (D().CURRICULUM || []).forEach((m) => (map[m.id] = m));
    return (c.moduleIds || []).map((id) => map[id]).filter(Boolean);
  }

  function courseLessons(c) {
    const out = [];
    moduleList(c).forEach((m) => (m.lessons || []).forEach((l) => out.push({ module: m, lesson: l, key: m.id + ":" + l.id })));
    return out;
  }

  function courseProgress(c) {
    const lessons = courseLessons(c);
    const st = state();
    const done = lessons.filter((x) => st.lessons && st.lessons[x.key]).length;
    const segs = c.videos || [];
    const segTotal = segs.reduce((a, v) => a + segmentsOf(v).length, 0);
    const segDone = segs.reduce((a, v) => a + segmentsOf(v).filter((s) => P.segments[segKey(v, s.n)]).length, 0);
    const total = lessons.length + segTotal;
    const finished = done + segDone;
    return { done: finished, total, pct: total ? Math.round((finished / total) * 100) : 0, lessonsDone: done, lessonsTotal: lessons.length, segDone, segTotal };
  }

  function enrolled(id) { return P.enroll.indexOf(id) >= 0; }
  function enroll(id) {
    if (enrolled(id)) return;
    P.enroll.push(id);
    const c = courseById(id);
    P.lastCourse = id;
    persist();
    const n = (c && c.title) || "Course";
    D().toast && D().toast("Enrolled in " + n);
    render("course", "course/" + id);
  }

  function segKey(video, n) { return video.id + "#" + n; }

  function segmentsOf(video) {
    const mins = Math.max(1, Math.round(video.minutes || 20));
    const size = 20;
    const out = [];
    for (let start = 0, n = 1; start < mins; n++) {
      const end = Math.min(start + size, mins);
      out.push({
        n, start, end,
        title: n === 1 ? (video.title.length > 46 ? video.title.slice(0, 44) + "…" : video.title) : "Part " + n + " · " + (video.tool || "Lesson"),
        minutes: end - start
      });
      start = end;
    }
    return out;
  }

  function segmentDone(video, n) { return !!P.segments[segKey(video, n)]; }
  function markSegment(video, n, on) {
    const k = segKey(video, n);
    if (on) P.segments[k] = Date.now(); else delete P.segments[k];
    persist();
    D().touchDay && D().touchDay();
    render("course", "course/" + (P.openCourseId || ""));
  }

  function bookmarked(type, id) { return P.bookmarks.some((b) => b.type === type && b.id === id); }
  function toggleBookmark(type, id, label) {
    const i = P.bookmarks.findIndex((b) => b.type === type && b.id === id);
    if (i >= 0) P.bookmarks.splice(i, 1);
    else P.bookmarks.push({ type, id, label, at: Date.now() });
    persist();
    D().toast && D().toast(i >= 0 ? "Bookmark removed" : "Bookmarked");
  }

  function coverStyle(c) {
    const pair = COLORS[(c.color || 0) % COLORS.length];
    return "background:linear-gradient(135deg," + pair[0] + "," + pair[1] + ")";
  }

  function courseCard(c) {
    const p = courseProgress(c);
    const lessons = courseLessons(c).length;
    return `<article class="course-card">
      <div class="course-cover" style="${coverStyle(c)}">${esc(c.category)}</div>
      <div class="course-body">
        <h3>${esc(c.title)}</h3>
        <div class="course-meta">
          <span class="plat-tag">${esc(c.level)}</span>
          <span class="plat-tag">${lessons} lessons</span>
          <span class="plat-tag">${(c.videos || []).length} videos</span>
        </div>
        <p>${esc(c.description || "").slice(0, 150)}</p>
        <div class="course-foot">
          <div class="mini-bar"><span style="width:${p.pct}%"></span></div>
          <span class="mini-pct">${p.pct}%</span>
        </div>
        <div class="course-foot">
          <button class="btn ${enrolled(c.id) ? "btn-ghost" : "btn-primary"} btn-sm" data-enroll="${esc(c.id)}">${enrolled(c.id) ? "Continue" : "Enrol free"}</button>
          <button class="link-btn" data-open="${esc(c.id)}">Details →</button>
        </div>
      </div>
    </article>`;
  }

  /* ------------------------------------------------------------- library */
  const UI = { filter: "All", q: "" };

  function renderLibrary() {
    const host = $("#platLibrary");
    if (!host) return;
    const cats = ["All"].concat(Array.from(new Set(courses().map((c) => c.category))));
    const q = UI.q.toLowerCase();
    const list = courses().filter((c) => c.published !== false)
      .filter((c) => UI.filter === "All" || c.category === UI.filter)
      .filter((c) => !q || (c.title + " " + c.category + " " + (c.description || "")).toLowerCase().includes(q));

    host.innerHTML = `<div class="plat-head">
      <div><div class="plat-kicker">Course library</div><h1>Learn a tool, then prove it</h1>
        <p class="muted">Every course reuses the same lessons, quizzes and progress you already have. Enrol to unlock sessions, notes and analytics.</p></div>
      <div class="plat-actions"><label class="plat-search">⌕<input id="libSearch" type="text" placeholder="Search courses…" value="${esc(UI.q)}" /></label></div>
    </div>
    <div class="chip-row">${cats.map((c) => `<button class="chip ${UI.filter === c ? "on" : ""}" data-filter="${esc(c)}">${esc(c)}</button>`).join("")}</div>
    ${list.length ? `<div class="course-grid">${list.map(courseCard).join("")}</div>` : `<div class="empty">No course matches that search.</div>`}`;

    $("#libSearch").addEventListener("input", (e) => { UI.q = e.target.value; const pos = e.target.selectionStart; renderLibrary(); const el = $("#libSearch"); el.focus(); el.setSelectionRange(pos, pos); });
    on(host, onClick);
  }

  function renderMyCourses() {
    const host = $("#platMyCourses");
    if (!host) return;
    const mine = courses().filter((c) => enrolled(c.id));
    const st = state();
    const done = Object.keys(st.lessons || {}).length;
    host.innerHTML = `<div class="plat-head">
      <div><div class="plat-kicker">My learning</div><h1>My courses</h1>
        <p class="muted">Progress here is the same progress as your dashboard — nothing is duplicated.</p></div>
      <div class="plat-actions"><button class="btn btn-ghost btn-sm" data-go="library">Browse library</button></div>
    </div>
    <div class="kpi-row">
      <div class="kpi-card"><span>Enrolled</span><b>${mine.length}</b></div>
      <div class="kpi-card"><span>Lessons done</span><b>${done}</b></div>
      <div class="kpi-card"><span>Study streak</span><b>${D().streak ? D().streak() : 0}d</b></div>
    </div>
    ${mine.length ? `<div class="course-grid">${mine.map(courseCard).join("")}</div>` : `<div class="empty">You have not enrolled in a course yet. <button class="link-btn" data-go="library">Open the library →</button></div>`}`;
    on(host, onClick);
  }

  function onClick(e) {
    const en = e.target.closest("[data-enroll]");
    if (en) { e.preventDefault(); enroll(en.dataset.enroll); return; }
    const open = e.target.closest("[data-open]");
    if (open) { e.preventDefault(); D().go && D().go("course/" + open.dataset.open); return; }
    const go = e.target.closest("[data-go]");
    if (go) { e.preventDefault(); D().go && D().go(go.dataset.go); return; }
    const fil = e.target.closest("[data-filter]");
    if (fil) { UI.filter = fil.dataset.filter; renderLibrary(); }
  }

  /* -------------------------------------------------------- course detail */
  const PL = { player: null, video: null, seg: 1, videoId: null, showVideo: false, courseId: null, timer: null };

  function renderCourse(route) {
    const host = $("#platCourse");
    if (!host) return;
    const id = (String(route || "").split("/")[1] || P.lastCourse || "").split("?")[0];
    const c = courseById(id);
    if (!c) { host.innerHTML = `<div class="empty">Course not found. <button class="link-btn" data-go="library">Back to library →</button></div>`; on(host, onClick); return; }
    P.lastCourse = c.id; P.openCourseId = c.id;
    if (PL.courseId !== c.id) { PL.courseId = c.id; PL.videoId = null; PL.showVideo = false; }
    const p = courseProgress(c);
    const mods = moduleList(c);
    const st = state();
    const key = P.lastLesson[c.id];
    const flat = courseLessons(c);
    const current = flat.filter((x) => x.key === key)[0] || flat[0] || null;

    host.innerHTML = `
    <div class="course-hero">
      <div>
        <div class="plat-kicker">${esc(c.category)} · ${esc(c.level)}</div>
        <h1>${esc(c.title)}</h1>
        <p>${esc(c.description || "")}</p>
        <div class="course-stats">
          <div><b>${p.lessonsTotal}</b>lessons</div>
          <div><b>${p.segTotal}</b>video sessions</div>
          <div><b>${p.pct}%</b>complete</div>
          <div><b>${(c.videos || []).length}</b>videos</div>
        </div>
        <div class="plat-actions" style="margin-top:14px">
          ${enrolled(c.id) ? `<button class="btn btn-ghost btn-sm" data-go="mycourses">In my courses ✓</button>` : `<button class="btn btn-primary btn-sm" data-enroll="${esc(c.id)}">Enrol free</button>`}
          <button class="btn btn-ghost btn-sm" data-book="course:${esc(c.id)}">${bookmarked("course", c.id) ? "★ Bookmarked" : "☆ Bookmark"}</button>
        </div>
      </div>
      <div><h3 style="margin:0 0 8px;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#8fb2d1">Learning objectives</h3>
        <ul class="course-objectives">${(c.objectives || []).map((o) => `<li>${esc(o)}</li>`).join("") || "<li>Complete the modules and the capstone.</li>"}</ul></div>
    </div>
    <div class="course-layout">
      <aside class="course-outline">
        <h3>Curriculum</h3>
        ${mods.map((m) => {
          const ls = m.lessons || [];
          const dn = ls.filter((l) => st.lessons && st.lessons[m.id + ":" + l.id]).length;
          return `<div class="outline-mod">
            <button data-modopen="${esc(m.id)}">${esc(m.title)} <span class="mini-pct">${dn}/${ls.length}</span></button>
            <ul>${ls.map((l) => {
              const k = m.id + ":" + l.id;
              const on = current && current.key === k;
              return `<li><button class="${on ? "on" : ""}" data-lesson="${esc(k)}"><span class="dot ${st.lessons && st.lessons[k] ? "" : "off"}">${st.lessons && st.lessons[k] ? "●" : "○"}</span><span>${esc(l.title)} <span class="mini-pct">${l.minutes || 0}m</span></span></button></li>`;
            }).join("")}</ul>
          </div>`;
        }).join("")}
        ${(c.videos || []).length ? `<h3 style="margin-top:16px">Video sessions</h3>
          ${c.videos.map((v) => {
            const done = segmentsOf(v).filter((s) => segmentDone(v, s.n)).length;
            return `<button class="seg-item ${PL.videoId === v.id ? "on" : ""}" data-video="${esc(v.id)}" style="width:100%;margin-bottom:7px">
              <span class="seg-n">${done}/${segmentsOf(v).length}</span>
              <span class="seg-t">${esc(v.title).slice(0, 64)}<small>${esc(v.tool || "")} · ${esc(v.channel || "YouTube")} · ${v.minutes} min</small></span>
              <span>▶</span></button>`;
          }).join("")}` : ""}
      </aside>
      <div class="course-main" id="courseMain">
        ${PL.showVideo ? videoPanel(c) : (current ? lessonPanel(c, current) : videoPanel(c))}
      </div>
    </div>`;

    on(host, (e) => {
      const mod = e.target.closest("[data-modopen]");
      if (mod) {
        const d = D();
        const m = (d.CURRICULUM || []).filter((x) => x.id === mod.dataset.modopen)[0];
        if (m) d.openModule && d.openModule(m);
        return;
      }
      const ls = e.target.closest("[data-lesson]");
      if (ls) { P.lastLesson[c.id] = ls.dataset.lesson; PL.showVideo = false; persist(); renderCourse("course/" + c.id); return; }
      const bm = e.target.closest("[data-book]");
      if (bm) { const [t, i] = bm.dataset.book.split(":"); toggleBookmark(t, i, c.title); renderCourse("course/" + c.id); return; }
      const vd = e.target.closest("[data-video]");
      if (vd) { PL.videoId = vd.dataset.video; PL.seg = 1; PL.showVideo = true; renderCourse("course/" + c.id); initPlayer(c); return; }
      const sg = e.target.closest("[data-seg]");
      if (sg) { PL.seg = +sg.dataset.seg; playSeg(c); return; }
      const md = e.target.closest("[data-segdone]");
      if (md) {
        const v = (c.videos || []).filter((x) => x.id === md.dataset.vid)[0];
        markSegment(v, +md.dataset.segdone, !segmentDone(v, +md.dataset.segdone));
        return;
      }
      const nb = e.target.closest("#noteSave");
      if (nb) { saveNote(c, current); return; }
      const mk = e.target.closest("#markLesson");
      if (mk && current) {
        const s = D();
        s.state.lessons[current.key] = Date.now();
        s.save(); s.touchDay && s.touchDay(); s.refreshAll && s.refreshAll();
        D().toast && D().toast("Lesson marked complete");
        renderCourse("course/" + c.id);
        return;
      }
      onClick(e);
    });
    if (PL.showVideo) initPlayer(c);
  }

  function lessonPanel(c, cur) {
    const l = cur.lesson, m = cur.module;
    const st = state();
    const done = st.lessons && st.lessons[cur.key];
    const note = P.notes.filter((n) => n.courseId === c.id && n.lessonKey === cur.key)[0];
    return `<article class="plat-panel lesson-doc">
      <div class="plat-kicker">${esc(m.title)}</div>
      <h2>${esc(l.title)}</h2>
      ${l.lede ? `<p class="lede">${esc(l.lede)}</p>` : ""}
      <div class="body">${l.body || "<p>Open the full lesson reader for this module.</p>"}</div>
      <div class="plat-actions" style="margin:16px 0 6px">
        <button class="btn ${done ? "btn-ghost" : "btn-primary"} btn-sm" id="markLesson">${done ? "✓ Completed — mark again" : "Mark lesson complete"}</button>
        <button class="btn btn-ghost btn-sm" data-book="lesson:${esc(cur.key)}">${bookmarked("lesson", cur.key) ? "★ Bookmarked" : "☆ Bookmark lesson"}</button>
        <span class="mini-pct">${l.minutes || 0} min read</span>
      </div>
      <div class="plat-panel" style="margin-top:14px;background:rgba(5,16,30,.5)">
        <h3>Your note on this lesson</h3>
        <div class="note-box">
          <textarea id="noteText" placeholder="Write what you want to remember, in your own words…">${esc(note ? note.text : "")}</textarea>
          <div class="plat-actions"><button class="btn btn-primary btn-sm" id="noteSave">${note ? "Update note" : "Save note"}</button>
          <span class="muted tiny">Private to you on this device${P.settings.supabaseUrl ? " and synced when signed in" : ""}.</span></div>
        </div>
      </div>
    </article>`;
  }

  function saveNote(c, cur) {
    const el = $("#noteText");
    if (!el || !cur) return;
    const text = el.value.trim();
    const i = P.notes.findIndex((n) => n.courseId === c.id && n.lessonKey === cur.key);
    if (!text) {
      if (i >= 0) P.notes.splice(i, 1);
    } else if (i >= 0) { P.notes[i].text = text; P.notes[i].at = Date.now(); }
    else P.notes.push({ id: uid(), courseId: c.id, lessonKey: cur.key, moduleId: cur.module.id, lessonId: cur.lesson.id, lessonTitle: cur.lesson.title, at: Date.now(), text });
    persist();
    D().toast && D().toast(text ? "Note saved" : "Note removed");
    renderCourse("course/" + c.id);
  }

  /* ------------------------------------------------------- video sessions */
  function videoPanel(c) {
    const v = (c.videos || []).filter((x) => x.id === PL.videoId)[0] || (c.videos || [])[0] || null;
    if (!v) return `<article class="plat-panel"><h3>No video in this course yet</h3><p class="muted">Lessons are text-first. Add a YouTube link in the Course Studio to create 20-minute sessions.</p></article>`;
    PL.videoId = v.id;
    const segs = segmentsOf(v);
    const seg = segs.filter((s) => s.n === PL.seg)[0] || segs[0];
    return `<article class="plat-panel">
      <div class="plat-kicker">${esc(v.tool || "Video")} · ${esc(v.lang || "English")} · ${v.minutes} min</div>
      <h3 style="margin:6px 0 12px">${esc(v.title)}</h3>
      <div class="player-frame" id="playerFrame"></div>
      <div class="player-bar">
        <button class="btn btn-ghost btn-sm" data-seg="${Math.max(1, seg.n - 1)}">⏮ Previous</button>
        <button class="btn btn-ghost btn-sm" data-seg="${Math.min(segs.length, seg.n + 1)}">Next ⏭</button>
        <button class="btn ${segmentDone(v, seg.n) ? "btn-ghost" : "btn-primary"} btn-sm" data-segdone="${seg.n}" data-vid="${esc(v.id)}">${segmentDone(v, seg.n) ? "✓ Session complete" : "Mark session complete"}</button>
        <span class="muted tiny">Session ${seg.n} of ${segs.length} · ${fmtTime(seg.start * 60)}–${fmtTime(seg.end * 60)}</span>
      </div>
      <div class="notice" id="segPrompt" style="display:none;margin-top:10px"></div>
      <div class="seg-list">${segs.map((s) => `<button class="seg-item ${s.n === seg.n ? "on" : ""} ${segmentDone(v, s.n) ? "done" : ""}" data-seg="${s.n}">
        <span class="seg-n">${String(s.n).padStart(2, "0")}</span>
        <span class="seg-t">${esc(s.title)}<small>${fmtTime(s.start * 60)} – ${fmtTime(s.end * 60)} · ${s.minutes} min</small></span>
        <span>${segmentDone(v, s.n) ? "✓" : "▶"}</span></button>`).join("")}</div>
      <p class="muted tiny" style="margin-top:10px">Segments are timestamps on the original video, not re-uploads. Progress saves as you watch; a session is only marked done when you say so.</p>
    </article>`;
  }

  function initPlayer(c) {
    const v = (c.videos || []).filter((x) => x.id === PL.videoId)[0];
    const host = $("#playerFrame");
    if (!v || !host) return;
    if (PL.timer) { clearInterval(PL.timer); PL.timer = null; }
    PL.video = v;
    PL.seg = PL.seg || 1;
    const segs = segmentsOf(v);
    const seg = segs.filter((s) => s.n === PL.seg)[0] || segs[0];
    const saved = P.positions[segKey(v, seg.n)] || 0;
    const startSeconds = Math.floor(seg.start * 60) + (saved > 3 && saved < (seg.end - seg.start) * 60 - 3 ? saved : 0);

    if (v.url) {
      host.innerHTML = `<video id="upVideo" controls playsinline preload="metadata" src="${esc(v.url)}"></video>`;
      const el = $("#upVideo");
      el.currentTime = startSeconds;
      el.addEventListener("timeupdate", () => {
        if (el.currentTime % 5 < 0.4) P.positions[segKey(v, seg.n)] = Math.round(el.currentTime);
        if (el.currentTime >= seg.end * 60) { el.pause(); segPrompt(seg, v); }
      });
      el.addEventListener("loadedmetadata", () => { if (startSeconds) el.currentTime = startSeconds; });
      el.play().catch(() => {});
      PL.timer = setInterval(() => { P.positions[segKey(v, seg.n)] = Math.round(el.currentTime); persist(); }, 10000);
      return;
    }

    host.innerHTML = `<iframe id="ytFrame" src="https://www.youtube.com/embed/${encodeURIComponent(v.yt)}?enablejsapi=1&rel=0&modestbranding=1&start=${startSeconds}" title="${esc(v.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
    loadYT(() => {
      try {
        PL.player = new window.YT.Player("ytFrame", {
          events: {
            onReady: (ev) => {
              const t = saved > 3 && saved < (seg.end - seg.start) * 60 - 3 ? saved : 0;
              if (t) ev.target.seekTo(seg.start * 60 + t, true);
            }
          }
        });
      } catch (e) { /* iframe still plays without the API */ }
    });
    PL.timer = setInterval(() => {
      let ct = null;
      try { ct = PL.player && PL.player.getCurrentTime ? PL.player.getCurrentTime() : null; } catch (e) { ct = null; }
      if (ct == null) return;
      if (ct >= seg.start * 60) P.positions[segKey(v, seg.n)] = Math.round(ct - seg.start * 60);
      persist();
      if (ct >= seg.end * 60 - 0.6) {
        try { PL.player.pauseVideo(); } catch (e) { /* ignore */ }
        segPrompt(seg, v);
      }
    }, 4000);
  }

  function segPrompt(seg, v) {
    const box = $("#segPrompt");
    if (!box) return;
    box.style.display = "block";
    box.innerHTML = `Session ${seg.n} finished (${fmtTime(seg.start * 60)}–${fmtTime(seg.end * 60)}). Mark it complete, or continue to the next session.`;
  }

  function playSeg(c) {
    const v = (c.videos || []).filter((x) => x.id === PL.videoId)[0];
    if (!v) return;
    const segs = segmentsOf(v);
    const seg = segs.filter((s) => s.n === PL.seg)[0] || segs[0];
    P.lastCourse = c.id;
    persist();
    renderCourse("course/" + c.id);
    initPlayer(c);
  }

  let ytLoading = false;
  function loadYT(cb) {
    if (window.YT && window.YT.Player) return cb();
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { prev && prev(); cb(); };
    if (!ytLoading) {
      ytLoading = true;
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      s.async = true;
      document.head.appendChild(s);
    }
  }


  /* --------------------------------------------------------- AI assistant */
  function courseCorpus() {
    const chunks = [];
    (D().CURRICULUM || []).forEach((m) => (m.lessons || []).forEach((l) => {
      chunks.push({
        title: l.title,
        where: m.title,
        text: [l.lede || "", String(l.body || "").replace(/<[^>]+>/g, " ")].join(" ").replace(/\s+/g, " ").trim(),
        href: "course/track-data-analyst"
      });
    }));
    (window.INTERVIEW || []).forEach((q) => chunks.push({ title: q.q, where: "Interview · " + (q.topic || ""), text: q.a, href: "interview" }));
    (window.CHEATSHEETS || []).forEach((c) => chunks.push({ title: c.title, where: "Cheat sheet", text: String(c.body || "").replace(/<[^>]+>/g, " "), href: "cheatsheets" }));
    return chunks;
  }

  function offlineAnswer(q) {
    const words = q.toLowerCase().split(/[^a-z0-9+#.]+/).filter((w) => w.length > 2);
    if (!words.length) return null;
    const scored = courseCorpus().map((ch) => {
      const hay = (ch.title + " " + ch.text).toLowerCase();
      let score = 0;
      words.forEach((w) => { if (hay.includes(w)) score += 1 + (ch.title.toLowerCase().includes(w) ? 2 : 0); });
      return { ch, score };
    }).filter((x) => x.score > 1).sort((a, b) => b.score - a.score).slice(0, 3);
    if (!scored.length) return null;
    return scored.map((x) => "• " + x.ch.title + " — " + (x.ch.where || "") + "\n" + x.ch.text.slice(0, 420) + (x.ch.text.length > 420 ? "…" : "")).join("\n\n");
  }

  function renderAssistant() {
    const host = $("#platAssistant");
    if (!host) return;
    const msgs = P.ai.slice(-40);
    host.innerHTML = `<div class="plat-head">
      <div><div class="plat-kicker">AI study assistant</div><h1>Ask about your material</h1>
      <p class="muted">Grounded in the lessons, flashcards and cheat sheets on this device. ${P.settings.aiEndpoint || (P.settings.supabaseUrl && P.settings.supabaseKey) ? "" : "A language model is not connected yet, so answers are exact search results from your own material."}</p></div>
      <div class="plat-actions"><span class="ai-badge">${P.settings.aiEndpoint || (P.settings.supabaseUrl && P.settings.supabaseKey) ? "Tutor connected" : "Offline search mode"}</span></div>
    </div>
    <div class="plat-panel">
      <div class="chat-wrap">
        <div class="chat-log" id="chatLog">${msgs.length ? msgs.map((m) => `<div class="msg ${m.role}">${esc(m.text)}</div>`).join("") : `<div class="msg bot">Ask me anything from your course: SQL joins, pandas groupby, DAX CALCULATE, p-values, or paste a query and I will look up the matching lesson. When you connect a model endpoint in Settings, this becomes a real tutor with the same grounding.</div>`}</div>
        <form class="chat-form" id="chatForm">
          <input id="chatInput" type="text" placeholder="e.g. explain window functions with an example" autocomplete="off" />
          <button class="btn btn-primary btn-sm" type="submit">Send</button>
        </form>
      </div>
      <div class="chip-row" style="margin-top:12px">
        ${["Explain SQL window functions", "Pandas groupby vs pivot_table", "CALCULATE in DAX", "When is a p-value misleading?"].map((t) => `<button class="chip" data-ask="${esc(t)}">${esc(t)}</button>`).join("")}
      </div>
    </div>`;

    const log = $("#chatLog");
    const add = (role, text) => {
      P.ai.push({ role, text, at: Date.now() });
      P.ai = P.ai.slice(-40);
      persist();
      const d = document.createElement("div");
      d.className = "msg " + role;
      d.textContent = text;
      log.appendChild(d);
      log.scrollTop = log.scrollHeight;
    };

    async function cloudAI(q) {
      const base = String(P.settings.supabaseUrl || "").replace(/\/+$/, "");
      const key = P.settings.supabaseKey;
      if (!base || !key) return null;
      const context = courseCorpus()
        .map((ch) => ({ ch, score: q.toLowerCase().split(/[^a-z0-9+#.]+/).filter((w) => w.length > 2 && (ch.title + ch.text).toLowerCase().includes(w)).length }))
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score).slice(0, 4)
        .map((x) => x.ch.title + ": " + x.ch.text.slice(0, 900)).join("\n\n");
      const res = await fetch(base + "/functions/v1/ai-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: key, Authorization: "Bearer " + key },
        body: JSON.stringify({
          question: q,
          context,
          history: P.ai.slice(-8).map((m) => ({ role: m.role === "bot" ? "assistant" : m.role, content: m.text }))
        })
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      return data.answer || null;
    }

    async function ask(text) {
      if (!text.trim()) return;
      add("user", text);
      const ep = P.settings.aiEndpoint;
      if (!ep && P.settings.supabaseUrl && P.settings.supabaseKey) {
        const holder = document.createElement("div");
        holder.className = "msg bot";
        holder.textContent = "Thinking…";
        log.appendChild(holder);
        try {
          const ans = await cloudAI(text);
          holder.remove();
          add("bot", ans || offlineAnswer(text) || "The tutor returned no text.");
        } catch (err) {
          holder.remove();
          add("bot", offlineAnswer(text) || "Cloud tutor unavailable: " + err.message);
        }
        return;
      }
      if (!ep) {
        const a = offlineAnswer(text);
        add("bot", a || "I could not find that in your material. Try a tool keyword such as SQL, pandas, Excel, Power BI or statistics — or connect an AI endpoint in Settings for open questions.");
        return;
      }
      const holder = document.createElement("div");
      holder.className = "msg bot";
      holder.textContent = "Thinking…";
      log.appendChild(holder);
      try {
        const res = await fetch(ep, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: P.ai.slice(-12).map((m) => ({ role: m.role === "bot" ? "assistant" : m.role, content: m.text })), course: P.openCourseId || null })
        });
        if (!res.ok) throw new Error("HTTP " + res.status);
        const data = await res.json();
        holder.remove();
        add("bot", data.reply || data.text || "The assistant returned no text.");
      } catch (err) {
        holder.remove();
        add("sys", "AI request failed: " + err.message + ". Your messages stayed on this device.");
      }
    }

    $("#chatForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const el = $("#chatInput");
      const t = el.value;
      el.value = "";
      ask(t);
    });
    on(host, (e) => {
      const b = e.target.closest("[data-ask]");
      if (b) ask(b.dataset.ask);
    });
  }

  /* ------------------------------------------------------ notes/bookmarks */
  const NB = { tab: "notes", q: "" };

  function renderNotes() {
    const host = $("#platNotes");
    if (!host) return;
    const q = NB.q.toLowerCase();
    const notes = P.notes.filter((n) => !q || (n.text + " " + n.lessonTitle).toLowerCase().includes(q));
    const marks = P.bookmarks.filter((b) => !q || String(b.label || "").toLowerCase().includes(q));
    host.innerHTML = `<div class="plat-head">
      <div><div class="plat-kicker">Revision</div><h1>Notes &amp; bookmarks</h1><p class="muted">Everything you write stays private on this device until you connect an account.</p></div>
      <div class="plat-actions">
        <button class="btn btn-ghost btn-sm" data-nbexp="1">Export notes</button>
        <label class="plat-search">⌕<input id="nbSearch" type="text" placeholder="Search notes…" value="${esc(NB.q)}" /></label>
      </div>
    </div>
    <div class="chip-row">
      <button class="chip ${NB.tab === "notes" ? "on" : ""}" data-nbtab="notes">Notes · ${P.notes.length}</button>
      <button class="chip ${NB.tab === "bookmarks" ? "on" : ""}" data-nbtab="bookmarks">Bookmarks · ${P.bookmarks.length}</button>
    </div>
    ${NB.tab === "notes" ? `<div class="note-list">${notes.length ? notes.sort((a, b) => b.at - a.at).map((n) => `<div class="note-item">
      <header><span>${esc(n.lessonTitle || n.lessonKey)}</span><span>${new Date(n.at).toLocaleDateString()}</span></header>
      <p>${esc(n.text)}</p>
      <div class="row"><button class="link-btn" data-nbopen="${esc(n.courseId)}">Open lesson</button><button class="link-btn danger" data-nbdel="${esc(n.id)}">Delete</button></div>
    </div>`).join("") : `<div class="empty">No notes yet. Open any lesson and write one.</div>`}</div>`
    : `<div class="note-list">${marks.length ? marks.map((b) => `<div class="note-item">
      <header><span>${esc(b.type)}</span><span>${new Date(b.at).toLocaleDateString()}</span></header>
      <p>${esc(b.label || b.id)}</p>
      <div class="row"><button class="link-btn danger" data-bmdel="${esc(b.id)}">Remove</button></div>
    </div>`).join("") : `<div class="empty">No bookmarks yet.</div>`}</div>`}`;

    $("#nbSearch").addEventListener("input", (e) => { NB.q = e.target.value; renderNotes(); const el = $("#nbSearch"); el.focus(); const p = el.value.length; el.setSelectionRange(p, p); });
    on(host, (e) => {
      const t = e.target.closest("[data-nbtab]");
      if (t) { NB.tab = t.dataset.nbtab; renderNotes(); return; }
      const del = e.target.closest("[data-nbdel]");
      if (del) { P.notes = P.notes.filter((n) => n.id !== del.dataset.nbdel); persist(); renderNotes(); return; }
      const bm = e.target.closest("[data-bmdel]");
      if (bm) { P.bookmarks = P.bookmarks.filter((b) => b.id !== bm.dataset.bmdel); persist(); renderNotes(); return; }
      const op = e.target.closest("[data-nbopen]");
      if (op) D().go && D().go("course/" + op.dataset.nbopen);
      const ex = e.target.closest("[data-nbexp]");
      if (ex) downloadJSON("daa-notes-" + dt() + ".json", { notes: P.notes, bookmarks: P.bookmarks });
    });
  }

  function downloadJSON(name, obj) {
    try {
      const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = name;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 3000);
      D().toast && D().toast("Exported " + name);
    } catch (e) { D().toast && D().toast("Export blocked by the browser"); }
  }

  /* ------------------------------------------------------------ analytics */
  function renderAnalytics() {
    const host = $("#platAnalytics");
    if (!host) return;
    const st = state();
    const C = D().CURRICULUM || [];
    const done = Object.keys(st.lessons || {}).length;
    const totalLessons = (D().ALL_LESSONS || []).length || 1;
    const quizzes = window.QUIZZES || [];
    const qDone = quizzes.filter((q) => st.quiz && st.quiz[q.id] != null);
    const qAvg = qDone.length ? Math.round(qDone.reduce((a, q) => a + st.quiz[q.id], 0) / qDone.length) : 0;
    const exams = window.EXAMS || [];
    const eDone = exams.filter((e) => st.exams && st.exams[e.id]);
    const eAvg = eDone.length ? Math.round(eDone.reduce((a, e) => a + (st.exams[e.id].best || 0), 0) / eDone.length) : 0;
    const known = Object.keys(st.fc || {}).filter((k) => st.fc[k] === "known").length;
    const cards = (window.INTERVIEW || []).length || 1;
    const segCount = Object.keys(P.segments || {}).length;
    const mins = C.reduce((a, m) => a + (m.lessons || []).reduce((b, l) => b + (l.minutes || 0), 0), 0);
    const hours = ((done / totalLessons) * mins + segCount * 20) / 60;
    const days = Array.from(new Set(st.days || [])).sort().slice(-14);
    const maxDay = 1;

    host.innerHTML = `<div class="plat-head">
      <div><div class="plat-kicker">Your data, not a demo</div><h1>Analytics</h1>
      <p class="muted">Every number is computed from your own saved progress, quiz attempts and study days.</p></div>
      <div class="plat-actions"><button class="btn btn-ghost btn-sm" data-anexport="1">Export my data</button></div>
    </div>
    <div class="kpi-row">
      <div class="kpi-card"><span>Lessons</span><b>${done}/${totalLessons}</b></div>
      <div class="kpi-card"><span>Video sessions</span><b>${segCount}</b></div>
      <div class="kpi-card"><span>Study hours</span><b>${hours.toFixed(1)}</b></div>
      <div class="kpi-card"><span>Quiz average</span><b>${qAvg}%</b></div>
      <div class="kpi-card"><span>Exam average</span><b>${eAvg}%</b></div>
      <div class="kpi-card"><span>Interview ready</span><b>${Math.round((known / cards) * 100)}%</b></div>
      <div class="kpi-card"><span>Streak</span><b>${D().streak ? D().streak() : 0}d</b></div>
    </div>
    <div class="course-layout">
      <div class="plat-panel">
        <h3>Progress by module</h3>
        <div class="chart">${C.map((m) => {
          const ls = m.lessons || [];
          const dn = ls.filter((l) => st.lessons && st.lessons[m.id + ":" + l.id]).length;
          const pc = ls.length ? Math.round((dn / ls.length) * 100) : 0;
          return `<div class="chart-row"><span>${esc(m.title)}</span><div class="chart-track"><span style="width:${pc}%"></span></div><b>${pc}%</b></div>`;
        }).join("")}</div>
      </div>
      <div class="plat-panel">
        <h3>Quiz history</h3>
        ${quizzes.length ? `<div class="chart">${quizzes.map((q) => {
          const best = st.quiz && st.quiz[q.id];
          const pc = best == null ? 0 : best;
          return `<div class="chart-row"><span>${esc(q.title)}</span><div class="chart-track"><span style="width:${pc}%"></span></div><b>${best == null ? "—" : pc + "%"}</b></div>`;
        }).join("")}</div>` : `<div class="empty">No quizzes found.</div>`}
        <h3 style="margin-top:18px">Study days</h3>
        <div class="chart">${days.length ? days.map((d) => `<div class="chart-row"><span>${esc(d)}</span><div class="chart-track"><span style="width:100%"></span></div><b>active</b></div>`).join("") : `<div class="empty">No study days recorded yet.</div>`}</div>
      </div>
    </div>`;
    on(host, (e) => {
      if (e.target.closest("[data-anexport]")) exportAll();
    });
  }

  /* ------------------------------------------------------- course studio */
  const ADMIN = { edit: null };

  function ytId(input) {
    const s = String(input || "").trim();
    if (!s) return "";
    const m = s.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{6,})/);
    return m ? m[1] : (/^[A-Za-z0-9_-]{6,}$/.test(s) ? s : "");
  }

  function renderAdmin() {
    const host = $("#platAdmin");
    if (!host) return;
    if (!P.settings.ownerMode) {
      host.innerHTML = `<div class="plat-head"><div><div class="plat-kicker">Owner area</div><h1>Course studio</h1>
        <p class="muted">This area edits course content and is limited to the owner account. Turn on owner mode in Settings on this device.</p></div></div>
        <div class="plat-panel"><button class="btn btn-primary btn-sm" data-go="settings">Open settings</button></div>`;
      on(host, onClick);
      return;
    }
    const c = ADMIN.edit ? courseById(ADMIN.edit) : null;
    const mods = D().CURRICULUM || [];
    host.innerHTML = `<div class="plat-head">
      <div><div class="plat-kicker">Owner workspace</div><h1>Course studio</h1>
      <p class="muted">Create and edit courses, attach existing modules and add video sources. Learner progress and course ids are never changed by editing a course.</p></div>
      <div class="plat-actions"><button class="btn btn-ghost btn-sm" data-newcourse="1">+ New course</button></div>
    </div>
    <div class="course-layout">
      <div class="plat-panel">
        <h3>Your courses · ${courses().length}</h3>
        <div class="admin-list">${courses().map((x) => `<div class="admin-row">
          <div><b>${esc(x.title)}</b><small>${esc(x.category)} · ${(x.moduleIds || []).length} modules · ${(x.videos || []).length} videos</small></div>
          <div class="row">
            <button class="link-btn" data-edit="${esc(x.id)}">Edit</button>
            <button class="link-btn" data-pub="${esc(x.id)}">${x.published === false ? "Publish" : "Unpublish"}</button>
            <button class="link-btn danger" data-del="${esc(x.id)}">Delete</button>
          </div></div>`).join("")}</div>
      </div>
      <div class="plat-panel">
        <h3>${c ? "Edit course" : "New course"}</h3>
        <div class="form-grid">
          <label>Title<input id="adTitle" value="${esc(c ? c.title : "")}" placeholder="e.g. SQL for Marketing Analysts" /></label>
          <label>Category<input id="adCat" value="${esc(c ? c.category : "Data Analytics")}" /></label>
          <label>Level<input id="adLevel" value="${esc(c ? c.level : "Beginner")}" /></label>
          <label class="wide">Description<textarea id="adDesc" rows="3">${esc(c ? c.description : "")}</textarea></label>
          <label class="wide">Objectives, one per line<textarea id="adObj" rows="3">${esc(c ? (c.objectives || []).join("\n") : "")}</textarea></label>
          <div class="wide"><div class="field-label">Modules from your curriculum</div>
            <div class="check-grid">${mods.map((m) => `<label class="check"><input type="checkbox" value="${esc(m.id)}" ${c && (c.moduleIds || []).includes(m.id) ? "checked" : ""} /> ${esc(m.title)}</label>`).join("")}</div></div>
          <label class="wide">Add a video by YouTube link or id<input id="adVid" placeholder="https://www.youtube.com/watch?v=…" /></label>
          <label>Video minutes<input id="adVidMin" type="number" min="1" value="20" /></label>
          <label>Or a direct video file URL<input id="adUrl" placeholder="https://…/lesson.mp4" /></label>
        </div>
        ${c && (c.videos || []).length ? `<div class="admin-list" style="margin-top:10px">${c.videos.map((v) => `<div class="admin-row"><div><b>${esc(v.title)}</b><small>${esc(v.tool || "")} · ${v.minutes} min · ${v.yt ? "YouTube " + esc(v.yt) : "file"}</small></div><button class="link-btn danger" data-delvid="${esc(v.id)}">Remove</button></div>`).join("")}</div>` : ""}
        <div class="plat-actions" style="margin-top:12px">
          <button class="btn btn-primary btn-sm" data-savecourse="1">${c ? "Save changes" : "Create course"}</button>
          ${c ? `<button class="btn btn-ghost btn-sm" data-cancel="1">Cancel</button>` : ""}
        </div>
        <p class="muted tiny" style="margin-top:10px">Publishing writes to this device only. To publish for every learner, apply the same row through the Supabase table described in docs/BACKEND.md.</p>
      </div>
    </div>`;
    on(host, (e) => {
      const ed = e.target.closest("[data-edit]");
      if (ed) { ADMIN.edit = ed.dataset.edit; renderAdmin(); return; }
      const nc = e.target.closest("[data-newcourse]");
      if (nc) { ADMIN.edit = null; renderAdmin(); return; }
      const ca = e.target.closest("[data-cancel]");
      if (ca) { ADMIN.edit = null; renderAdmin(); return; }
      const pu = e.target.closest("[data-pub]");
      if (pu) { const x = courseById(pu.dataset.pub); x.published = x.published === false; persist(); renderAdmin(); return; }
      const dl = e.target.closest("[data-del]");
      if (dl) {
        if (!confirm("Delete this course? Learner progress for its lessons stays in place.")) return;
        P.courses = courses().filter((x) => x.id !== dl.dataset.del);
        P.enroll = P.enroll.filter((i) => i !== dl.dataset.del);
        persist(); renderAdmin(); D().toast && D().toast("Course deleted");
        return;
      }
      const dv = e.target.closest("[data-delvid]");
      if (dv) { const x = courseById(ADMIN.edit); x.videos = (x.videos || []).filter((v) => v.id !== dv.dataset.delvid); persist(); renderAdmin(); return; }
      const sv = e.target.closest("[data-savecourse]");
      if (sv) { saveCourseForm(); return; }
      onClick(e);
    });
  }

  function saveCourseForm() {
    const title = ($("#adTitle") || {}).value ? $("#adTitle").value.trim() : "";
    if (!title) { D().toast && D().toast("A course needs a title"); return; }
    const moduleIds = $$(".check-grid input:checked").map((i) => i.value);
    const base = ADMIN.edit ? courseById(ADMIN.edit) : null;
    const obj = $("#adObj").value.split("\n").map((s) => s.trim()).filter(Boolean);
    const c = base || { id: "c-" + uid(), createdAt: dt(), color: courses().length % COLORS.length, videos: [] };
    c.title = title;
    c.category = $("#adCat").value.trim() || "Data Analytics";
    c.level = $("#adLevel").value.trim() || "Beginner";
    c.description = $("#adDesc").value.trim();
    c.objectives = obj;
    c.moduleIds = moduleIds;
    c.videos = c.videos || [];
    const raw = $("#adVid").value.trim();
    const mins = Math.max(1, parseInt($("#adVidMin").value, 10) || 20);
    const fileUrl = $("#adUrl").value.trim();
    if (raw) {
      const id = ytId(raw);
      if (!id) { D().toast && D().toast("That does not look like a YouTube link"); return; }
      c.videos.push({ id: "yt-" + id + "-" + uid().slice(0, 3), title: title + " — video", yt: id, minutes: mins, channel: "YouTube", lang: "English", tool: c.category });
    } else if (fileUrl) {
      if (!/^https?:\/\//.test(fileUrl)) { D().toast && D().toast("Use a full https:// URL"); return; }
      c.videos.push({ id: "up-" + uid(), title: title + " — video", url: fileUrl, minutes: mins, channel: "Uploaded file", lang: "English", tool: c.category });
    }
    if (!base) P.courses.push(c);
    if (!enrolled(c.id) && base) { /* keep enrolment as-is */ }
    persist();
    ADMIN.edit = c.id;
    D().toast && D().toast(base ? "Course updated" : "Course created");
    renderAdmin();
  }

  /* ------------------------------------------------------------ settings */
  function renderSettings() {
    const host = $("#platSettings");
    if (!host) return;
    const sbUrl = P.settings.supabaseUrl || "";
    const hasSb = !!(sbUrl && P.settings.supabaseKey);
    host.innerHTML = `<div class="plat-head">
      <div><div class="plat-kicker">Configuration</div><h1>Settings</h1>
      <p class="muted">Your data lives on this device by default. Nothing is uploaded until you add your own Supabase project and choose to sync.</p></div>
      <div class="plat-actions"><span class="ai-badge">${hasSb ? "Supabase configured" : "Local-only mode"}</span></div>
    </div>
    <div class="course-layout">
      <div class="plat-panel">
        <h3>Profile</h3>
        <div class="form-grid">
          <label>Display name<input id="setName" value="${esc(P.profile.name)}" /></label>
          <label>Role<input id="setRole" value="${esc(P.profile.role)}" disabled /></label>
        </div>
        <h3 style="margin-top:18px">Owner mode</h3>
        <label class="check"><input type="checkbox" id="setOwner" ${P.settings.ownerMode ? "checked" : ""} /> Allow this device to edit courses (Course Studio)</label>
        <p class="muted tiny">This is a device-level guard, not authentication. Real permissions belong in Supabase Row Level Security — see docs/BACKEND.md.</p>
        <h3 style="margin-top:18px">AI endpoint</h3>
        <div class="form-grid"><label class="wide">Server-side endpoint that accepts {messages:[…]} and returns {reply}<input id="setAi" value="${esc(P.settings.aiEndpoint)}" placeholder="https://your-project.functions.supabase.co/ai-tutor" /></label></div>
        <p class="muted tiny">Never paste a provider API key into this page: the browser would expose it. Put the key in the Edge Function secret store.</p>
        <h3 style="margin-top:18px">Cloud sync (optional)</h3>
        <div class="form-grid">
          <label>Supabase project URL<input id="setSbUrl" value="${esc(sbUrl)}" placeholder="https://xxxx.supabase.co" /></label>
          <label>Supabase anon key<input id="setSbKey" type="password" value="${P.settings.supabaseKey ? "••••••••" : ""}" placeholder="public anon key only" /></label>
        </div>
        <div class="plat-actions" style="margin-top:12px">
          <button class="btn btn-primary btn-sm" data-savesettings="1">Save settings</button>
          <button class="btn btn-ghost btn-sm" data-cloudsync="1">Sync now</button>
        </div>
        <p class="muted tiny">Use the public anon key, never the service role key. Sign-in and sync activate only when Supabase is reachable from this page.</p>
        <div id="cloudState" class="notice" style="margin-top:12px">${hasSb ? "Checking cloud session…" : "Cloud sync off. Everything works offline."}</div>
      </div>
      <div class="plat-panel">
        <h3>Account</h3>
        <div class="form-grid">
          <label>Email<input id="setEmail" type="email" placeholder="you@example.com" /></label>
          <label>Password<input id="setPass" type="password" placeholder="at least 6 characters" /></label>
        </div>
        <div class="plat-actions" style="margin-top:10px">
          <button class="btn btn-primary btn-sm" data-auth="signin">Sign in</button>
          <button class="btn btn-ghost btn-sm" data-auth="signup">Create account</button>
          <button class="btn btn-ghost btn-sm" data-auth="signout">Sign out</button>
        </div>
        <h3 style="margin-top:20px">Your data</h3>
        <div class="plat-actions">
          <button class="btn btn-ghost btn-sm" data-exportall="1">Export everything</button>
          <button class="btn btn-ghost btn-sm" data-importall="1">Import backup</button>
          <button class="btn btn-ghost btn-sm danger" data-resetplat="1">Reset platform data</button>
        </div>
        <input id="importFile" type="file" accept="application/json" hidden />
        <p class="muted tiny" style="margin-top:10px">Reset removes notes, bookmarks, enrolments and video positions. Lesson, quiz and exam progress from the original dashboard is not touched.</p>
        <h3 style="margin-top:20px">Migration status</h3>
        <p class="muted tiny">Existing progress: ${Object.keys(state().lessons || {}).length} lessons, ${Object.keys(state().quiz || {}).length} quizzes, ${Object.keys(state().exams || {}).length} exams, ${(state().days || []).length} study days. These are read directly from <code>daa:v1</code> — no copy, no reset.</p>
      </div>
    </div>`;
    on(host, (e) => {
      if (e.target.closest("[data-savesettings]")) return saveSettings();
      if (e.target.closest("[data-exportall]")) return exportAll();
      if (e.target.closest("[data-resetplat]")) {
        if (!confirm("Reset notes, bookmarks, enrolments and video positions on this device?")) return;
        const keep = P.settings;
        P = Object.assign(blank(), { settings: keep, courses: null });
        persist(); renderSettings(); D().toast && D().toast("Platform data reset");
        return;
      }
      const im = e.target.closest("[data-importall]");
      if (im) { $("#importFile").click(); return; }
      const au = e.target.closest("[data-auth]");
      if (au) return authAction(au.dataset.auth);
      if (e.target.closest("[data-cloudsync]")) return syncNow();
    });
    $("#importFile").addEventListener("change", (e) => {
      const f = e.target.files && e.target.files[0];
      if (f) importAll(f);
    });
    if (hasSb) cloudStatus();
  }

  function saveSettings() {
    P.profile.name = $("#setName").value.trim() || "Shibu Sangma";
    P.settings.ownerMode = $("#setOwner").checked;
    P.settings.aiEndpoint = $("#setAi").value.trim();
    P.settings.supabaseUrl = $("#setSbUrl").value.trim().replace(/\/$/, "");
    const key = $("#setSbKey").value.trim();
    if (key && key !== "••••••••") P.settings.supabaseKey = key;
    persist();
    D().toast && D().toast("Settings saved");
    renderSettings();
  }

  function exportAll() {
    downloadJSON("daa-backup-" + dt() + ".json", {
      app: "data-analyst-academy", exportedAt: new Date().toISOString(), version: 1,
      progress: state(),
      platform: { courses: P.courses, enroll: P.enroll, notes: P.notes, bookmarks: P.bookmarks, segments: P.segments, positions: P.positions, profile: P.profile, settings: { ownerMode: P.settings.ownerMode, aiEndpoint: P.settings.aiEndpoint } }
    });
  }

  function importAll(file) {
    const fr = new FileReader();
    fr.onload = () => {
      try {
        const data = JSON.parse(String(fr.result));
        const st = state();
        if (data.progress) {
          ["lessons", "videos", "fc", "quiz", "exams", "hi", "weeks"].forEach((k) => {
            Object.assign(st[k] = st[k] || {}, data.progress[k] || {});
          });
          st.days = Array.from(new Set((st.days || []).concat(data.progress.days || [])));
          if (D().save) D().save();
        }
        const pl = data.platform || {};
        if (Array.isArray(pl.notes)) {
          const seen = new Set(P.notes.map((n) => n.courseId + "|" + n.lessonKey));
          pl.notes.forEach((n) => { if (!seen.has(n.courseId + "|" + n.lessonKey)) P.notes.push(n); });
        }
        Object.assign(P.segments = P.segments || {}, pl.segments || {});
        P.bookmarks = P.bookmarks.concat((pl.bookmarks || []).filter((b) => !bookmarked(b.type, b.id)));
        P.enroll = Array.from(new Set(P.enroll.concat(pl.enroll || [])));
        if (Array.isArray(pl.courses) && pl.courses.length) {
          const ids = new Set(courses().map((c) => c.id));
          pl.courses.forEach((c) => { if (!ids.has(c.id)) P.courses.push(c); });
        }
        persist();
        if (D().refreshAll) D().refreshAll();
        D().toast && D().toast("Backup merged, nothing overwritten");
        renderSettings();
      } catch (err) {
        D().toast && D().toast("That file is not a valid backup");
      }
    };
    fr.readAsText(file);
  }

  /* ---------------------------------------------------------- cloud sync */
  let sbClient = null;
  let sbLoading = null;

  function sbReady() {
    if (!P.settings.supabaseUrl || !P.settings.supabaseKey) return Promise.reject(new Error("Add your Supabase URL and anon key in Settings"));
    if (window.supabase && window.supabase.createClient) {
      if (!sbClient) sbClient = window.supabase.createClient(P.settings.supabaseUrl, P.settings.supabaseKey);
      return Promise.resolve(sbClient);
    }
    sbClient = null;
    if (!sbLoading) {
      sbLoading = new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js";
        s.onload = () => {
          if (!window.supabase) return reject(new Error("Supabase library did not load"));
          sbClient = window.supabase.createClient(P.settings.supabaseUrl, P.settings.supabaseKey);
          resolve(sbClient);
        };
        s.onerror = () => reject(new Error("Supabase library blocked by the network"));
        document.head.appendChild(s);
      });
    }
    return sbLoading;
  }

  function setCloud(text) {
    const el = $("#cloudState");
    if (el) el.textContent = text;
  }

  async function cloudStatus() {
    try {
      const sb = await sbReady();
      const { data } = await sb.auth.getSession();
      setCloud(data && data.session ? "Signed in as " + data.session.user.email + ". Sync is available." : "Supabase configured. Sign in to sync this device.");
    } catch (e) { setCloud("Cloud unavailable: " + e.message); }
  }

  async function authAction(kind) {
    try {
      const sb = await sbReady();
      if (kind === "signout") {
        await sb.auth.signOut();
        setCloud("Signed out. Local study data is untouched.");
        D().toast && D().toast("Signed out");
        return;
      }
      const email = ($("#setEmail") || {}).value ? $("#setEmail").value.trim() : "";
      const pass = ($("#setPass") || {}).value || "";
      if (!email || pass.length < 6) { setCloud("Enter an email and a password of at least 6 characters."); return; }
      setCloud(kind === "signup" ? "Creating your account…" : "Signing in…");
      const r = kind === "signup" ? await sb.auth.signUp({ email, password: pass }) : await sb.auth.signInWithPassword({ email, password: pass });
      if (r.error) throw r.error;
      if (kind === "signup" && r.data && !r.data.session) {
        setCloud("Account created. Confirm the email link, then sign in.");
        return;
      }
      P.profile.name = (r.data && r.data.user && r.data.user.email) || P.profile.name;
      persist();
      setCloud("Signed in. Press Sync now to upload this device's progress.");
      D().toast && D().toast(kind === "signup" ? "Account created" : "Signed in");
    } catch (e) {
      setCloud("Account error: " + (e.message || "unknown"));
    }
  }

  async function syncNow() {
    try {
      setCloud("Syncing…");
      const sb = await sbReady();
      const { data: ses } = await sb.auth.getSession();
      const user = ses && ses.session && ses.session.user;
      if (!user) { setCloud("Sign in first, then sync."); return; }
      const st = state();
      const lessonRows = Object.keys(st.lessons || {}).map((k) => {
        const [module_id, lesson_id] = k.split(":");
        return { user_id: user.id, module_id, lesson_id, completed_at: new Date(st.lessons[k] || Date.now()).toISOString() };
      });
      const segRows = Object.keys(P.segments || {}).map((k) => {
        const [video_id, seg] = k.split("#");
        return { user_id: user.id, course_id: P.openCourseId || null, video_id, segment: parseInt(seg, 10) || 1, completed_at: new Date(P.segments[k] || Date.now()).toISOString() };
      });
      const noteRows = P.notes.map((n) => ({ id: n.id, user_id: user.id, course_id: n.courseId, lesson_key: n.lessonKey, body: n.text, updated_at: new Date(n.at).toISOString() }));
      if (lessonRows.length) {
        const r = await sb.from("lesson_progress").upsert(lessonRows, { onConflict: "user_id,module_id,lesson_id" });
        if (r.error) throw r.error;
      }
      if (segRows.length) {
        const r = await sb.from("video_progress").upsert(segRows, { onConflict: "user_id,video_id,segment" });
        if (r.error) throw r.error;
      }
      if (noteRows.length) {
        const r = await sb.from("notes").upsert(noteRows, { onConflict: "id" });
        if (r.error) throw r.error;
      }
      setCloud("Synced " + lessonRows.length + " lessons, " + segRows.length + " video sessions and " + noteRows.length + " notes.");
      D().toast && D().toast("Cloud sync complete");
    } catch (e) {
      setCloud("Sync failed: " + (e.message || "unknown") + ". Nothing was deleted locally.");
    }
  }

  /* ------------------------------------------------------- render + boot */
  function render(base, raw) {
    if (base === "library") renderLibrary();
    else if (base === "mycourses") renderMyCourses();
    else if (base === "course") renderCourse(raw);
    else if (base === "assistant") renderAssistant();
    else if (base === "notes") renderNotes();
    else if (base === "analytics") renderAnalytics();
    else if (base === "admin") renderAdmin();
    else if (base === "settings") renderSettings();
  }

  function routeHash() {
    const raw = (location.hash || "").replace(/^#/, "");
    if (!raw) return;
    const base = raw.split(/[?/]/)[0];
    if (views.indexOf(base) >= 0) render(base, raw);
  }

  window.Platform = {
    views, render, store: () => P, segmentsOf,
    refresh() { persist(); },
    courses,
    sync: syncNow
  };

  function boot() {
    courses();
    window.addEventListener("hashchange", routeHash);
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const raw = a.getAttribute("href").slice(1);
      if (views.indexOf(raw.split(/[?/]/)[0]) < 0) return;
      e.preventDefault();
      if (D().go) D().go(raw);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
