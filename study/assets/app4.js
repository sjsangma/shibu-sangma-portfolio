(function () {
  const D = window.DAA;
  if (!D) return;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = D.esc;
  const EXAMS = window.EXAMS || [];
  const PASS = 70;

  const host = () => $("#examApp");
  let run = null;
  let tick = null;

  function fmt(sec) {
    const m = Math.floor(sec / 60), s = sec % 60;
    return m + ":" + String(s).padStart(2, "0");
  }

  function best(id) {
    const r = (D.state.exams || {})[id];
    return r && typeof r.best === "number" ? r.best : null;
  }

  function stopTimer() {
    if (tick) { clearInterval(tick); tick = null; }
  }

  function renderLanding() {
    stopTimer();
    run = null;
    const app = host();
    if (!app) return;
    app.innerHTML = `
      <div class="exam-grid">
        ${EXAMS.map((e) => {
          const b = best(e.id);
          return `<article class="exam-card">
            <div class="exam-card-top">
              <span class="exam-ico">${e.icon}</span>
              <div>
                <h3>${esc(e.name)} exam</h3>
                <p class="muted tiny">${e.questions.length} questions · ${e.minutes} min · pass ${PASS}%</p>
              </div>
            </div>
            <p class="muted tiny">${esc(e.level)}</p>
            <div class="exam-tags">${e.topics.slice(0, 4).map((t) => `<span class="tag tag-ghost">${esc(t.name)}</span>`).join("")}<span class="tag tag-ghost">+${e.topics.length - 4} more</span></div>
            <div class="exam-actions">
              <button class="btn btn-primary btn-sm" data-start="${e.id}">Start exam</button>
              <button class="btn btn-ghost btn-sm" data-topics="${e.id}">Topics</button>
              ${b == null ? "" : `<span class="tag ${b >= PASS ? "tag-ok" : "tag-ghost"}">Best ${b}%</span>`}
            </div>
            <div class="exam-syllabus hidden" data-syllabus="${e.id}">
              <p class="muted tiny">What is tested</p>
              <ul class="exam-list">
                ${e.topics.map((t) => `<li><span class="w-${t.weight}">${t.weight === "high" ? "●" : "○"}</span> ${esc(t.name)}</li>`).join("")}
              </ul>
            </div>
          </article>`;
        }).join("")}
      </div>`;

    $$("[data-start]", app).forEach((b) => b.addEventListener("click", () => startExam(b.dataset.start)));
    $$("[data-topics]", app).forEach((b) => b.addEventListener("click", () => {
      const box = $('[data-syllabus="' + b.dataset.topics + '"]', app);
      box.classList.toggle("hidden");
      b.textContent = box.classList.contains("hidden") ? "Topics" : "Hide topics";
    }));
  }

  function startExam(id) {
    const exam = EXAMS.find((e) => e.id === id);
    if (!exam) return;
    stopTimer();
    run = { exam, i: 0, picks: new Array(exam.questions.length).fill(null), left: exam.minutes * 60 };
    draw();
    tick = setInterval(() => {
      if (!run) return stopTimer();
      run.left -= 1;
      const t = $("#examClock");
      if (t) t.textContent = fmt(Math.max(0, run.left));
      if (run.left <= 60) { const c = $("#examClock"); if (c) c.classList.add("low"); }
      if (run.left <= 0) { stopTimer(); finish(true); }
    }, 1000);
  }

  function draw() {
    const { exam, i, picks } = run;
    const q = exam.questions[i];
    const answered = picks.filter((p) => p !== null).length;
    const app = host();
    app.innerHTML = `
      <div class="exam-run">
        <div class="exam-bar">
          <div>
            <span class="tag tag-ghost">${esc(exam.name)}</span>
            <span class="muted tiny">${answered} of ${exam.questions.length} answered</span>
          </div>
          <div class="exam-clock-wrap">
            <span class="muted tiny">Time left</span>
            <span id="examClock" class="exam-clock ${run.left <= 60 ? "low" : ""}">${fmt(Math.max(0, run.left))}</span>
          </div>
        </div>
        <div class="bar"><span style="width:${Math.round((answered / exam.questions.length) * 100)}%"></span></div>
        <div class="quiz-q">
          <p class="muted tiny">${esc(q.t)} · question ${i + 1} of ${exam.questions.length}</p>
          <h2>${esc(q.q)}</h2>
        </div>
        <div id="examOpts">
          ${q.options.map((o, k) => `<button class="quiz-opt ${picks[i] === k ? "sel" : ""}" data-k="${k}"><span class="k">${String.fromCharCode(65 + k)}</span>${esc(o)}</button>`).join("")}
        </div>
        <div class="reader-actions" style="margin-top:18px">
          <button class="btn btn-ghost btn-sm" data-act="quit">← Leave exam</button>
          <span style="flex:1"></span>
          <button class="btn btn-ghost btn-sm" data-act="prev" ${i === 0 ? "disabled" : ""}>Prev</button>
          ${i === exam.questions.length - 1
            ? `<button class="btn btn-primary btn-sm" data-act="finish">Submit exam</button>`
            : `<button class="btn btn-primary btn-sm" data-act="next">Next →</button>`}
        </div>
        <div class="exam-jump">${exam.questions.map((_, k) => `<button class="jump ${picks[k] !== null ? "done" : ""} ${k === i ? "cur" : ""}" data-jump="${k}">${k + 1}</button>`).join("")}</div>
      </div>`;

    $$("#examOpts .quiz-opt", app).forEach((b) => b.addEventListener("click", () => {
      run.picks[run.i] = Number(b.dataset.k);
      draw();
    }));
    $$("[data-act]", app).forEach((b) => b.addEventListener("click", () => {
      const a = b.dataset.act;
      if (a === "quit") { if (confirm("Leave the exam without submitting?")) renderLanding(); }
      if (a === "prev" && run.i > 0) { run.i--; draw(); }
      if (a === "next" && run.i < run.exam.questions.length - 1) { run.i++; draw(); }
      if (a === "finish") finish(false);
    }));
    $$("[data-jump]", app).forEach((b) => b.addEventListener("click", () => { run.i = Number(b.dataset.jump); draw(); }));
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function finish(auto) {
    if (!run) return;
    stopTimer();
    const { exam, picks } = run;
    const perTopic = {};
    let correct = 0;
    exam.questions.forEach((q, i) => {
      const t = perTopic[q.t] || (perTopic[q.t] = { ok: 0, n: 0 });
      t.n += 1;
      if (picks[i] === q.answer) { correct += 1; t.ok += 1; }
    });
    const score = Math.round((correct / exam.questions.length) * 100);
    const prev = (D.state.exams || {})[exam.id] || {};
    D.state.exams = D.state.exams || {};
    D.state.exams[exam.id] = { best: Math.max(prev.best || 0, score), last: score, date: D.today ? D.today() : new Date().toISOString().slice(0, 10) };
    D.save();
    if (D.touchDay) D.touchDay();
    if (D.renderDashboard) D.renderDashboard();

    const weak = Object.entries(perTopic).filter(([, v]) => v.ok < v.n).map(([k]) => k);
    const app = host();
    app.innerHTML = `
      <div class="exam-result">
        <div class="mock-score ${score >= PASS ? "ok" : ""}">${score}%</div>
        <p class="muted">${correct} of ${exam.questions.length} correct · ${esc(exam.name)} · ${auto ? "time ran out" : "submitted"} · pass mark ${PASS}%</p>
        <p>${score >= 85 ? "Interview-ready on this tool. Move to the next one." : score >= PASS ? "Passed. Re-read the weak topics below, then retake to get above 85%." : "Not yet. Study the weak topics, work the matching module notes, then retake."}</p>
        <div class="exam-breakdown">
          ${Object.entries(perTopic).map(([k, v]) => {
            const p = Math.round((v.ok / v.n) * 100);
            return `<div class="bk-row"><span>${esc(k)}</span><div class="bar"><span style="width:${p}%"></span></div><b>${v.ok}/${v.n}</b></div>`;
          }).join("")}
        </div>
        <div class="reader-actions" style="margin-top:16px">
          <button class="btn btn-primary" data-act="retry">Retake</button>
          <button class="btn btn-ghost" data-act="back">All exams</button>
        </div>
      </div>
      <h3 class="tv-head">Review every question</h3>
      <ol class="exam-review">
        ${exam.questions.map((q, i) => {
          const ok = picks[i] === q.answer;
          return `<li class="${ok ? "ok" : "no"}">
            <p class="muted tiny">${esc(q.t)} · Q${i + 1}</p>
            <p class="rv-q">${esc(q.q)}</p>
            <p class="rv-a"><b>${ok ? "Correct" : picks[i] == null ? "Skipped" : "Your answer: " + esc(q.options[picks[i]])}</b>${ok ? "" : " · Answer: " + esc(q.options[q.answer])}</p>
            <p class="muted">${esc(q.explain)}</p>
          </li>`;
        }).join("")}
      </ol>`;

    $$("[data-act]", app).forEach((b) => b.addEventListener("click", () => {
      if (b.dataset.act === "retry") startExam(exam.id);
      else renderLanding();
    }));
    run = null;
  }

  D.renderExams = function () {
    if (run) { draw(); return; }
    renderLanding();
  };

  D.examSummary = function () {
    const all = Object.values(D.state.exams || {});
    if (!all.length) return null;
    return { taken: all.length, avg: Math.round(all.reduce((s, r) => s + (r.best || 0), 0) / all.length) };
  };
})();
