/* Data Analyst Academy — 20-minute study sessions (chunks the long YouTube course) */
(function () {
  "use strict";

  const D = window.DAA;
  if (!D) return;
  const { CURRICULUM, INTERVIEW, state, save, go, toast, esc, openLesson } = D;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  const YT_URL = "https://www.youtube.com/watch?v=5mCglA9CuSg";
  const TOPIC_VIDEOS = window.TOPIC_VIDEOS || [];
  const MODULE_VIDEO = window.MODULE_VIDEO || {};
  const thumb = (id) => "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg";
  const watchUrl = (id) => "https://www.youtube.com/watch?v=" + id;

  function renderTopicVideos() {
    const host = $("#topicVideos");
    if (!host || !TOPIC_VIDEOS.length) return;
    host.innerHTML = `
      <h3 class="tv-head">Pick one video per tool</h3>
      <div class="tv-grid">
        ${TOPIC_VIDEOS.map((t) => `
          <div class="tv-card">
            <a class="tv-thumb" href="${watchUrl(t.main.id)}" target="_blank" rel="noopener noreferrer">
              <img src="${thumb(t.main.id)}" alt="${esc(t.main.title)}" loading="lazy">
              <span class="tv-len">${t.main.minutes} min</span>
            </a>
            <div class="tv-body">
              <span class="tv-topic">${esc(t.icon)} ${esc(t.topic)}</span>
              <a class="tv-title" href="${watchUrl(t.main.id)}" target="_blank" rel="noopener noreferrer">${esc(t.main.title)}</a>
              <span class="muted tiny">${esc(t.main.channel)}</span>
              <a class="tv-alt" href="${watchUrl(t.alt.id)}" target="_blank" rel="noopener noreferrer">Alt: ${esc(t.alt.title)} · ${t.alt.minutes} min</a>
              <span class="muted tiny tv-why">${esc(t.why)}</span>
            </div>
          </div>`).join("")}
      </div>`;
  }

  /* which interview topic backs each module's recall phase */
  const TOPIC = {
    foundations: "Career", excel: "Excel", python: "Python", pandas: "pandas",
    sql: "SQL", stats: "Statistics", viz: "Visualisation", powerbi: "Power BI",
    eda: "Data Quality", story: "Business Case", governance: "Data Quality", capstone: "Behavioural"
  };

  const PHASES = [
    { id: "watch", label: "Watch the course", share: 0.4, hint: "Play the 47-hour course and take notes on one idea." },
    { id: "read", label: "Read the matching lesson", share: 0.35, hint: "The module lesson here is the deep reference for what you just watched." },
    { id: "recall", label: "Recall from memory", share: 0.25, hint: "Answer flashcards out loud before checking the answer." }
  ];

  const TODAY = () => {
    const d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  };

  const sess = () => (state.sessions = state.sessions || []);

  const timer = { total: 20 * 60, left: 20 * 60, running: false, tick: null, phase: 0 };

  let moduleId = null;

  function minutesFor(p) {
    return Math.max(2, Math.round((timer.total / 60) * p.share));
  }

  function phaseBounds() {
    let acc = 0;
    return PHASES.map((p) => {
      const m = minutesFor(p);
      const from = acc;
      acc += m;
      return { ...p, minutes: m, from, to: acc };
    });
  }

  function currentPhaseIndex() {
    const elapsed = timer.total - timer.left;
    const bounds = phaseBounds();
    const min = elapsed / 60;
    for (let i = 0; i < bounds.length; i++) if (min < bounds[i].to || i === bounds.length - 1) return i;
    return bounds.length - 1;
  }

  function fmt(sec) {
    const m = Math.floor(Math.max(0, sec) / 60);
    const s = Math.max(0, sec) % 60;
    return m + ":" + String(s).padStart(2, "0");
  }

  function activeModule() {
    if (!moduleId) {
      const firstUndone = CURRICULUM.find((m) => (m.lessons || []).some((l) => !state.lessons[m.id + ":" + l.id]));
      moduleId = (firstUndone || CURRICULUM[0]).id;
    }
    return D.MODULE_BY_ID[moduleId] || CURRICULUM[0];
  }

  function nextLesson(mod) {
    const lessons = mod.lessons || [];
    return lessons.find((l) => !state.lessons[mod.id + ":" + l.id]) || lessons[0];
  }

  function todaysSessions() {
    return sess().filter((s) => s.d === TODAY());
  }

  function totalMinutes() {
    return sess().reduce((a, s) => a + (s.min || 0), 0);
  }

  function stopTick() {
    if (timer.tick) clearInterval(timer.tick);
    timer.tick = null;
    timer.running = false;
  }

  function tick() {
    timer.left -= 1;
    if (timer.left <= 0) {
      timer.left = 0;
      stopTick();
      finishSession();
    } else {
      const idx = currentPhaseIndex();
      if (idx !== timer.phase) {
        timer.phase = idx;
        toast("Next block: " + PHASES[idx].label);
        return render();
      }
      paint();
    }
  }

  function start() {
    if (timer.running) return;
    if (timer.left <= 0) timer.left = timer.total;
    timer.running = true;
    timer.tick = setInterval(tick, 1000);
    paint();
  }

  function pause() {
    stopTick();
    paint();
  }

  function reset() {
    stopTick();
    timer.left = timer.total;
    timer.phase = currentPhaseIndex();
    paint();
  }

  function finishSession() {
    const mod = activeModule();
    sess().push({ d: TODAY(), m: mod.id, min: Math.round(timer.total / 60) });
    save();
    D.touchDay && D.touchDay();
    toast("Session logged — " + Math.round(timer.total / 60) + " min on " + mod.title);
    render();
  }

  function setLength(min) {
    stopTick();
    timer.total = min * 60;
    timer.left = min * 60;
    timer.phase = 0;
    render();
  }

  function topicVideo() {
    return MODULE_VIDEO[activeModule().id] || null;
  }

  function openWatch() {
    const t = topicVideo();
    window.open(t ? watchUrl(t.main.id) : YT_URL, "_blank", "noopener");
  }

  function openRead() {
    const mod = activeModule();
    const lesson = nextLesson(mod);
    if (lesson) go("lesson");
    if (lesson && D.openLesson) D.openLesson(mod.id, lesson.id);
  }

  function openRecall() {
    go("interview");
  }

  function render() {
    const host = $("#sessionApp");
    if (!host) return;
    const mod = activeModule();
    const bounds = phaseBounds();
    const idx = currentPhaseIndex();
    const phase = bounds[idx];
    const pctDone = Math.round(((timer.total - timer.left) / timer.total) * 100);
    const topic = TOPIC[mod.id] || "Career";
    const qs = INTERVIEW.filter((q) => q.topic === topic).slice(0, 3);
    const todayCount = todaysSessions().length;
    const lesson = nextLesson(mod);
    const blocksDone = sess().length;
    const blocksTotal = Math.round((47 * 60) / 20);

    host.innerHTML = `
      <div class="sess-wrap">
        <div class="sess-main card">
          <div class="sess-top">
            <div>
              <div class="stage-kicker">Session focus</div>
              <h2>${esc(mod.icon || "▤")} ${esc(mod.title)}</h2>
            </div>
            <div class="sess-lens">
              ${[20, 25, 45].map((m) => `<button class="chip ${timer.total === m * 60 ? "chip-on" : ""}" data-min="${m}">${m} min</button>`).join("")}
            </div>
          </div>

          <div class="sess-timer">
            <div class="sess-clock" id="sessClock">${fmt(timer.left)}</div>
            <div class="sess-meta">
              <strong>${esc(phase.label)}</strong>
              <span class="muted tiny">minutes ${phase.from}–${phase.to} of ${Math.round(timer.total / 60)}</span>
            </div>
            <div class="bar-track"><div class="bar-fill" style="width:${pctDone}%"></div></div>
            <div class="sess-btns">
              <button class="btn btn-primary" id="sessStart">${timer.running ? "Pause" : timer.left === 0 ? "Start a new session" : "Start"}</button>
              <button class="btn" id="sessReset">Reset</button>
              <button class="btn btn-ghost" id="sessDone">Mark session done</button>
            </div>
          </div>

          <ol class="sess-plan">
            ${bounds.map((p, i) => `
              <li class="${i === idx ? "on" : ""}">
                <div class="sess-plan-head">
                  <span class="sess-plan-min">${p.minutes} min</span>
                  <strong>${esc(p.label)}</strong>
                </div>
                <p class="muted tiny">${esc(p.hint)}</p>
                <div class="sess-plan-act">
                  <button class="btn btn-ghost" data-act="${p.id}">Open</button>
                  ${p.id === "watch" ? `<span class="muted tiny">→ ${esc((topicVideo() || { main: { title: "47-hour full course" } }).main.title)}</span>` : ""}
                  ${p.id === "read" && lesson ? `<span class="muted tiny">→ ${esc(lesson.title)}</span>` : ""}
                  ${p.id === "recall" ? `<span class="muted tiny">→ ${qs.length} ${esc(topic)} flashcards</span>` : ""}
                </div>
              </li>`).join("")}
          </ol>
        </div>

        <aside class="sess-side">
          <div class="card">
            <h3>Pick a module</h3>
            <div class="sess-mods">
              ${CURRICULUM.map((m) => `<button class="chip ${m.id === mod.id ? "chip-on" : ""}" data-mod="${esc(m.id)}">${esc(m.icon || "▤")} ${esc(m.title)}</button>`).join("")}
            </div>
          </div>

          <div class="card">
            <h3>Your chunked progress</h3>
            <div class="sess-stats">
              <div><strong>${todayCount}</strong><span class="muted tiny">sessions today</span></div>
              <div><strong>${blocksDone}</strong><span class="muted tiny">sessions logged</span></div>
              <div><strong>${(totalMinutes() / 60).toFixed(1)}h</strong><span class="muted tiny">total study time</span></div>
            </div>
            <div class="bar-track"><div class="bar-fill" style="width:${Math.min(100, Math.round((blocksDone / blocksTotal) * 100))}%"></div></div>
            <p class="muted tiny">${blocksDone} of about ${blocksTotal} twenty-minute blocks in a 47-hour course.</p>
            <a class="btn btn-primary sess-yt" href="${YT_URL}" target="_blank" rel="noopener noreferrer">Play the 47-hour course ↗</a>
            <p class="muted tiny">Tip: pause the course when the timer changes block — that is your cut point. Nothing is re-uploaded; you study the original video in 20-minute slices.</p>
          </div>
        </aside>
      </div>`;

    $$("#sessionApp [data-min]").forEach((b) => b.addEventListener("click", () => setLength(Number(b.dataset.min))));
    $$("#sessionApp [data-mod]").forEach((b) => b.addEventListener("click", () => { moduleId = b.dataset.mod; render(); }));
    $$("#sessionApp [data-act]").forEach((b) => b.addEventListener("click", () => {
      const a = b.dataset.act;
      if (a === "watch") openWatch();
      if (a === "read") openRead();
      if (a === "recall") openRecall();
    }));
    $("#sessStart").addEventListener("click", () => (timer.running ? pause() : start()));
    $("#sessReset").addEventListener("click", reset);
    $("#sessDone").addEventListener("click", () => {
      timer.left = Math.max(0, timer.left);
      finishSession();
    });
  }

  function paint() {
    const clock = $("#sessClock");
    if (!clock) return;
    clock.textContent = fmt(timer.left);
    const fill = $("#sessionApp .sess-timer .bar-fill");
    if (fill) fill.style.width = Math.round(((timer.total - timer.left) / timer.total) * 100) + "%";
    const btn = $("#sessStart");
    if (btn) btn.textContent = timer.running ? "Pause" : "Start";
  }

  /* ---------- Hindi track: beginner -> advanced -> real project ---------- */
  const HINDI = window.HINDI_TRACK || [];

  function hiWatched() {
    state.hi = state.hi || {};
    return Object.keys(state.hi).filter((k) => state.hi[k]).length;
  }

  function renderHindi() {
    const host = $("#hindiTrack");
    if (!host || !HINDI.length) return;
    const done = hiWatched();
    const total = HINDI.reduce((n, t) => n + t.levels.length, 0);
    host.innerHTML = `
      <div class="hi-shell">
        <div class="hi-head">
          <div>
            <h2>Hindi track — beginner → advanced → project</h2>
            <p class="muted">One ordered path per tool, in Hindi, from the highest-ranked explainers on YouTube. Finish the beginner video, then the advanced ones, then build the project — that project is your interview story.</p>
          </div>
          <span class="tag tag-ghost">${done} / ${total} watched</span>
        </div>
        <div class="hi-grid">
          ${HINDI.map((t) => `
            <article class="hi-card" data-tool="${esc(t.tool)}">
              <header class="hi-card-head">
                <span class="hi-ico">${t.icon}</span>
                <div>
                  <h3>${esc(t.tool)}</h3>
                  <p class="muted tiny">${esc(t.module)}</p>
                </div>
              </header>
              <p class="hi-why muted tiny">${esc(t.why)}</p>
              <ol class="hi-levels">
                ${t.levels.map((v) => `
                  <li class="hi-lvl ${state.hi && state.hi[v.id] ? "seen" : ""}">
                    <div class="hi-lvl-top">
                      <span class="lvl lvl-${v.level.toLowerCase()}">${esc(v.level)}</span>
                      <span class="muted tiny">${esc(v.ch)} · ${v.min} min</span>
                    </div>
                    <a class="hi-title" href="${watchUrl(v.id)}" target="_blank" rel="noopener">${esc(v.title)} ↗</a>
                    <p class="hi-note muted tiny">${esc(v.note)}</p>
                    <button class="hi-mark ${state.hi && state.hi[v.id] ? "on" : ""}" data-watch="${v.id}">${state.hi && state.hi[v.id] ? "✓ Watched" : "Mark watched"}</button>
                  </li>`).join("")}
              </ol>
              <button class="btn btn-ghost btn-sm hi-open" data-module="${esc(t.mid || "")}">Read the ${esc(t.tool)} notes →</button>
            </article>`).join("")}
        </div>
      </div>`;

    $$(".hi-mark", host).forEach((b) => b.addEventListener("click", () => {
      state.hi = state.hi || {};
      const id = b.dataset.watch;
      if (state.hi[id]) delete state.hi[id];
      else { state.hi[id] = 1; D.touchDay && D.touchDay(); }
      save();
      renderHindi();
    }));
    $$(".hi-open", host).forEach((b) => b.addEventListener("click", () => {
      if (b.dataset.module) D.openModule(b.dataset.module);
    }));
  }

  D.renderSessions = render;
  D.renderTopicVideos = renderTopicVideos;
  D.renderHindi = renderHindi;

  const baseRenderVideos = D.renderVideos;
  D.renderVideos = function () {
    if (baseRenderVideos) baseRenderVideos();
    renderTopicVideos();
    renderHindi();
  };
  renderTopicVideos();
  renderHindi();
})();
