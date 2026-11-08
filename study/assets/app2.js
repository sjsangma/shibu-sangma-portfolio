/* Data Analyst Academy — video player, interview prep, quizzes, cheat sheets, roadmap */
(function () {
  "use strict";
  const D = window.DAA;
  if (!D) return;
  const { VIDEOS, INTERVIEW, QUIZZES, CHEATSHEETS, ROADMAP, MODULE_BY_ID, state, save, go, toast, esc, pct } = D;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  // Merge in the deep-dive narration and derive a realistic duration (~155 wpm + think time).
  const DEEP = window.VIDEO_DEEP || {};
  VIDEOS.forEach((v) => {
    const extra = DEEP[v.id] || [];
    v.scenes.forEach((s, i) => {
      if (extra[i]) s.narration = extra[i];
    });
    const words = v.scenes.reduce((a, s) => a + (s.narration || "").split(/\s+/).length, 0);
    v.minutes = Math.max(3, Math.round(words / 155));
    v.words = words;
  });

  /* =======================================================================
     VIDEO PLAYER
     ======================================================================= */
  const player = {
    video: null,
    scene: 0,
    playing: false,
    raf: null,
    startedAt: 0,
    estimate: 0,
    utter: null,
    timer: null,
    runId: 0
  };

  const speechOk = "speechSynthesis" in window && typeof window.SpeechSynthesisUtterance === "function";
  let voices = [];
  function loadVoices() { try { voices = window.speechSynthesis.getVoices() || []; } catch (e) { voices = []; } }
  if (speechOk) {
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
  function pickVoice() {
    if (!voices.length) loadVoices();
    const en = voices.filter((v) => /^en/i.test(v.lang || ""));
    return (
      en.find((v) => /Google UK English Female|Samantha|Microsoft Aria|Microsoft Zira/i.test(v.name)) ||
      en.find((v) => /female/i.test(v.name)) ||
      en[0] || null
    );
  }

  const words = (t) => String(t || "").trim().split(/\s+/).filter(Boolean).length;

  function renderVideoList() {
    $("#videoList").innerHTML = VIDEOS.map((v) => {
      const watched = !!state.videos[v.id];
      const active = player.video && player.video.id === v.id;
      const mod = MODULE_BY_ID[v.module];
      return `<div class="video-item ${watched ? "watched" : ""} ${active ? "active" : ""}" data-id="${esc(v.id)}" role="button" tabindex="0">
        <div class="video-thumb">${watched ? "✓" : "▶"}</div>
        <div>
          <strong>${esc(v.title)}</strong>
          <div class="muted tiny">${esc(mod ? mod.title : v.kicker || "")} · ${esc(v.minutes || 8)} min</div>
        </div>
      </div>`;
    }).join("");
    $$("#videoList .video-item").forEach((el) => {
      el.addEventListener("click", () => playVideo(el.dataset.id));
      el.addEventListener("keydown", (e) => { if (e.key === "Enter") playVideo(el.dataset.id); });
    });
  }

  function renderDots() {
    const scenes = (player.video && player.video.scenes) || [];
    $("#sceneDots").innerHTML = scenes.map((s, i) =>
      `<button class="dot ${i === player.scene ? "on" : ""}" data-i="${i}" title="${esc(s.title)}"></button>`
    ).join("");
    $$("#sceneDots .dot").forEach((b) => b.addEventListener("click", () => { stopSpeech(); jumpScene(Number(b.dataset.i)); }));
    $("#sceneLabel").textContent = scenes.length ? player.scene + 1 + " / " + scenes.length : "0 / 0";
  }

  function renderTranscript() {
    const scenes = (player.video && player.video.scenes) || [];
    $("#transcript").innerHTML = scenes
      .map((s, i) => `<p class="tr-line ${i === player.scene ? "on" : ""}" data-i="${i}"><span class="tr-n">${i + 1}</span>${esc(s.narration)}</p>`)
      .join("");
    $$("#transcript .tr-line").forEach((p) => p.addEventListener("click", () => { stopSpeech(); jumpScene(Number(p.dataset.i)); }));
  }

  function renderScene() {
    const v = player.video;
    if (!v) return;
    const s = v.scenes[player.scene] || { title: "", bullets: [], narration: "" };
    $("#stageKicker").textContent = (v.kicker || "Lesson") + " · scene " + (player.scene + 1);
    $("#stageTitle").textContent = s.title || v.title;
    $("#stageBullets").innerHTML = (s.bullets || []).map((b) => `<li>${esc(b)}</li>`).join("");
    const viz = $("#stageViz");
    if (s.viz && s.viz.html) { viz.innerHTML = s.viz.html; viz.style.display = ""; }
    else { viz.innerHTML = ""; viz.style.display = "none"; }
    $("#stageProgress").style.width = "0%";
    renderDots();
    renderTranscript();
    $("#transcript .tr-line.on") && $("#transcript .tr-line.on").scrollIntoView({ block: "nearest" });
  }

  function stopSpeech() {
    player.runId++;
    if (speechOk) { try { window.speechSynthesis.cancel(); } catch (e) {} }
    clearTimeout(player.timer);
    cancelAnimationFrame(player.raf);
    player.raf = null;
  }

  function tickProgress(duration, runId) {
    const start = performance.now();
    const step = (now) => {
      if (runId !== player.runId) return;
      const p = Math.min(1, (now - start) / 1000 / duration);
      $("#stageProgress").style.width = (p * 100).toFixed(2) + "%";
      if (p < 1) player.raf = requestAnimationFrame(step);
    };
    player.raf = requestAnimationFrame(step);
  }

  function play(paused) {
    if (!player.video) return;
    const s = player.video.scenes[player.scene] || {};
    const text = s.narration || "";
    const voiceOn = $("#voiceToggle").checked;
    const duration = Math.max(5, words(text) / 2.7);
    stopSpeech();
    const runId = player.runId;
    player.playing = !paused;
    $("#playBtn").textContent = player.playing ? "❚❚" : "▶";

    const advance = () => {
      if (runId !== player.runId) return;
      player.playing = false;
      $("#playBtn").textContent = "▶";
      const last = player.scene >= player.video.scenes.length - 1;
      if (last) { finishVideo(); return; }
      if ($("#autoToggle").checked) { player.scene++; renderScene(); play(false); }
    };

    if (!player.playing) { stopSpeech(); return; }
    tickProgress(duration, runId);

    if (speechOk && voiceOn && text) {
      const u = new SpeechSynthesisUtterance(text);
      const v = pickVoice();
      if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = "en-US"; }
      u.rate = 1.02; u.pitch = 1;
      let spoke = false;
      u.onstart = () => { spoke = true; };
      u.onend = () => { if (runId === player.runId) advance(); };
      u.onerror = () => { /* fall back to timer */ };
      player.utter = u;
      try { window.speechSynthesis.speak(u); } catch (e) {}
      /* watchdog: if speech never starts (blocked), use the reading timer */
      player.timer = setTimeout(() => {
        if (!spoke && runId === player.runId) {
          clearTimeout(player.timer);
          player.timer = setTimeout(advance, duration * 1000);
        }
      }, 900);
    } else {
      player.timer = setTimeout(advance, duration * 1000);
    }
  }

  function pause() {
    player.playing = false;
    $("#playBtn").textContent = "▶";
    stopSpeech();
  }

  function jumpScene(i) {
    if (!player.video) return;
    player.scene = Math.max(0, Math.min(player.video.scenes.length - 1, i));
    renderScene();
    if (player.playing) play(false);
  }

  function finishVideo() {
    if (!player.video) return;
    pause();
    $("#stageProgress").style.width = "100%";
    if (!state.videos[player.video.id]) {
      state.videos[player.video.id] = true;
      state.lastVideo = player.video.id;
      save();
      D.renderDashboard();
      toast("Lesson complete ✓");
    }
    renderVideoList();
  }

  function playVideo(id) {
    const v = VIDEOS.find((x) => x.id === id);
    if (!v) return;
    pause();
    player.video = v;
    player.scene = 0;
    state.lastVideo = v.id;
    save();
    renderVideoList();
    renderScene();
    $("#playBtn").textContent = "▶";
  }

  $("#playBtn").addEventListener("click", () => {
    if (!player.video) { if (VIDEOS.length) playVideo(VIDEOS[0].id); return; }
    if (player.playing) pause();
    else play(false);
  });
  $("#nextScene").addEventListener("click", () => jumpScene(player.scene + 1));
  $("#prevScene").addEventListener("click", () => jumpScene(player.scene - 1));
  $("#voiceToggle").addEventListener("change", () => { if (player.playing) play(false); });
  $("#autoToggle").addEventListener("change", () => { if (player.playing) play(false); });

  D.renderVideos = function () {
    renderVideoList();
    if (!player.video && VIDEOS.length) {
      const last = VIDEOS.find((v) => v.id === state.lastVideo) || VIDEOS[0];
      player.video = last;
      player.scene = 0;
      renderScene();
    } else {
      renderDots();
      renderTranscript();
    }
  };
  D.playVideo = playVideo;

  /* =======================================================================
     INTERVIEW PREP
     ======================================================================= */
  const topics = Array.from(new Set(INTERVIEW.map((c) => c.topic)));
  const topicOrder = ["SQL", "pandas", "Python", "Statistics", "A/B Testing", "Excel", "Power BI", "Visualisation", "Data Quality", "Business Case", "Career", "Behavioural"];
  topics.sort((a, b) => {
    const ia = topicOrder.indexOf(a), ib = topicOrder.indexOf(b);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  });

  const iv = { topic: "all", level: "all", list: [], i: 0, revealed: false };

  function buildInterviewFilters() {
    const bar = $("#interviewFilters");
    bar.innerHTML =
      `<button class="tab ${iv.topic === "all" ? "active" : ""}" data-topic="all">All (${INTERVIEW.length})</button>` +
      topics.map((t) => {
        const n = INTERVIEW.filter((c) => c.topic === t).length;
        return `<button class="tab ${iv.topic === t ? "active" : ""}" data-topic="${esc(t)}">${esc(t)} (${n})</button>`;
      }).join("") +
      `<select class="select" id="levelSel">
         <option value="all">All levels</option>
         <option value="core">Core</option>
         <option value="advanced">Advanced</option>
         <option value="behavioural">Behavioural</option>
       </select>`;
    $$("#interviewFilters .tab").forEach((b) =>
      b.addEventListener("click", () => { iv.topic = b.dataset.topic; iv.i = 0; applyFilters(); })
    );
    const sel = $("#levelSel");
    sel.value = iv.level;
    sel.addEventListener("change", () => { iv.level = sel.value; iv.i = 0; applyFilters(); });
  }

  function applyFilters() {
    iv.list = INTERVIEW.filter(
      (c) => (iv.topic === "all" || c.topic === iv.topic) && (iv.level === "all" || c.level === iv.level)
    );
    if (iv.i >= iv.list.length) iv.i = 0;
    buildInterviewFilters();
    renderCard();
    renderMastery();
  }

  function renderCard() {
    const c = iv.list[iv.i];
    if (!c) {
      $("#fcQuestion").textContent = "No questions in this filter.";
      $("#fcAnswer").textContent = "";
      $("#fcCounter").textContent = "0 / 0";
      return;
    }
    $("#fcTopic").textContent = c.topic;
    $("#fcLevel").textContent = c.level;
    $("#fcQuestion").textContent = c.q;
    $("#fcAnswer").textContent = c.a;
    $("#fcAnswer").classList.toggle("show", iv.revealed);
    $("#fcReveal").textContent = iv.revealed ? "Hide answer" : "Show answer";
    $("#fcCounter").textContent = iv.i + 1 + " / " + iv.list.length;
    const mark = $("#fcMarkState");
    const st = state.fc[c.id];
    if (mark) mark.textContent = st === "known" ? "✓ known" : st === "review" ? "↻ review" : "";
  }

  function renderMastery() {
    const byTopic = {};
    INTERVIEW.forEach((c) => {
      const k = c.topic;
      byTopic[k] = byTopic[k] || { total: 0, known: 0 };
      byTopic[k].total++;
      if (state.fc[c.id] === "known") byTopic[k].known++;
    });
    $("#masteryList").innerHTML = Object.keys(byTopic)
      .sort((a, b) => byTopic[b].total - byTopic[a].total)
      .map((t) => {
        const p = pct(byTopic[t].known, byTopic[t].total);
        return `<div class="mastery-row"><div class="mastery-top"><span>${esc(t)}</span><span class="muted tiny">${byTopic[t].known}/${byTopic[t].total}</span></div><div class="mastery-track"><div class="mastery-fill" style="width:${p}%"></div></div></div>`;
      }).join("");
  }

  $("#fcReveal").addEventListener("click", () => {
    iv.revealed = !iv.revealed;
    $("#fcAnswer").classList.toggle("show", iv.revealed);
    $("#fcReveal").textContent = iv.revealed ? "Hide answer" : "Show answer";
  });
  $("#fcNext").addEventListener("click", () => { iv.i = (iv.i + 1) % Math.max(1, iv.list.length); iv.revealed = false; renderCard(); });
  $("#fcPrev").addEventListener("click", () => { iv.i = (iv.i - 1 + iv.list.length) % Math.max(1, iv.list.length); iv.revealed = false; renderCard(); });
  $("#fcKnown").addEventListener("click", () => {
    const c = iv.list[iv.i]; if (!c) return;
    state.fc[c.id] = "known"; save(); D.touchDay();
    renderMastery(); D.renderDashboard();
    iv.i = (iv.i + 1) % iv.list.length; iv.revealed = false; renderCard();
  });
  $("#fcReview").addEventListener("click", () => {
    const c = iv.list[iv.i]; if (!c) return;
    state.fc[c.id] = "review"; save(); D.touchDay();
    renderMastery(); D.renderDashboard();
    iv.i = (iv.i + 1) % iv.list.length; iv.revealed = false; renderCard();
  });

  document.addEventListener("keydown", (e) => {
    if (!document.getElementById("view-interview").classList.contains("active")) return;
    if (e.target.matches("input, textarea, select")) return;
    if (e.key === "ArrowRight") $("#fcNext").click();
    if (e.key === "ArrowLeft") $("#fcPrev").click();
    if (e.key === " ") { e.preventDefault(); $("#fcReveal").click(); }
  });

  D.renderInterview = function () {
    if (!iv.list.length) applyFilters();
    else { renderCard(); renderMastery(); if (!$("#interviewFilters").children.length) buildInterviewFilters(); }
  };
  D.focusCard = function (id) {
    const c = INTERVIEW.find((x) => x.id === id);
    if (!c) return;
    iv.topic = c.topic; iv.level = "all"; iv.revealed = false;
    applyFilters();
    iv.i = Math.max(0, iv.list.findIndex((x) => x.id === id));
    renderCard();
  };

  /* ---- mock interview ---- */
  function startMock() {
    const pool = INTERVIEW.slice().sort(() => Math.random() - 0.5);
    const picks = [];
    const seen = {};
    pool.forEach((c) => {
      if (picks.length >= 8) return;
      const k = c.topic + c.level;
      if ((seen[k] || 0) >= 2) return;
      seen[k] = (seen[k] || 0) + 1;
      picks.push(c);
    });
    let idx = 0, knows = 0, started = false;

    const wrap = document.createElement("div");
    wrap.className = "mock-wrap";
    wrap.innerHTML = `<div class="mock-card"><div class="mock-head"><span class="tag">Mock interview</span><button class="icon-btn" id="mockClose" aria-label="Close">✕</button></div><div id="mockBody"></div></div>`;
    document.body.appendChild(wrap);
    const body = $("#mockBody", wrap);

    function draw() {
      const c = picks[idx];
      body.innerHTML = `
        <p class="muted tiny">Question ${idx + 1} of ${picks.length} · ${esc(c.topic)}</p>
        <p class="mock-q">${esc(c.q)}</p>
        <div class="mock-actions">
          <button class="btn btn-ghost btn-sm" id="mockShow">Show model answer</button>
          <button class="btn btn-warn" id="mockStumble">I stumbled</button>
          <button class="btn btn-ok" id="mockNailed">I answered well</button>
        </div>
        <div class="mock-answer hidden"></div>`;
      $("#mockShow", body).addEventListener("click", () => {
        const a = $(".mock-answer", body);
        a.innerHTML = `<p class="muted tiny">Model answer</p><p>${esc(c.a)}</p>`;
        a.classList.remove("hidden");
      });
      $("#mockNailed", body).addEventListener("click", () => { knows++; state.fc[c.id] = "known"; save(); step(); });
      $("#mockStumble", body).addEventListener("click", () => { state.fc[c.id] = "review"; save(); step(); });
    }

    function step() {
      idx++;
      if (idx < picks.length) draw();
      else finish();
    }

    function finish() {
      const score = Math.round((knows / picks.length) * 100);
      body.innerHTML = `
        <div class="mock-score">${score}%</div>
        <p class="muted">You answered ${knows} of ${picks.length} confidently.</p>
        <p>${score >= 80 ? "You are interview ready for this band. Keep the streak going." : score >= 50 ? "Solid base. Re-read the topics where you stumbled, then run another mock." : "Go back to the flashcards for the topics you missed, then try again in a day or two."}</p>
        <div class="mock-actions"><button class="btn btn-primary" id="mockAgain">Run another</button><button class="btn btn-ghost" id="mockDone">Done</button></div>`;
      $("#mockAgain", body).addEventListener("click", () => { wrap.remove(); startMock(); });
      $("#mockDone", body).addEventListener("click", () => { wrap.remove(); D.renderInterview(); D.renderDashboard(); });
      D.renderDashboard();
      renderMastery();
    }

    $("#mockClose", wrap).addEventListener("click", () => wrap.remove());
    draw();
    started = true;
    return started;
  }
  $("#startMockBtn").addEventListener("click", startMock);

  /* =======================================================================
     QUIZZES
     ======================================================================= */
  const qz = { quiz: null, i: 0, answers: [], locked: false };

  function renderQuizzes() {
    $("#quizRunner").classList.add("hidden");
    $("#quizPicker").classList.remove("hidden");
    $("#quizPicker").innerHTML = QUIZZES.map((q) => {
      const best = state.quiz[q.id];
      const mod = MODULE_BY_ID[q.module];
      return `<article class="module-card" data-quiz="${esc(q.id)}" tabindex="0" role="button">
        <div class="module-icon">✓</div>
        <h3>${esc(q.title)}</h3>
        <p class="muted">${q.questions.length} questions${mod ? " · " + esc(mod.title) : ""}</p>
        <div class="module-meta">${best == null ? '<span class="tag tag-ghost">Not attempted</span>' : `<span class="tag ${best >= 80 ? "tag-ok" : "tag-ghost"}">Best ${best}%</span>`}</div>
      </article>`;
    }).join("");
    $$("#quizPicker .module-card").forEach((c) => c.addEventListener("click", () => startQuiz(c.dataset.quiz)));
  }

  function startQuiz(id) {
    qz.quiz = QUIZZES.find((q) => q.id === id);
    if (!qz.quiz) return;
    qz.i = 0; qz.answers = []; qz.locked = false;
    $("#quizPicker").classList.add("hidden");
    $("#quizRunner").classList.remove("hidden");
    drawQuestion();
  }

  function drawQuestion() {
    const q = qz.quiz.questions[qz.i];
    qz.locked = false;
    $("#quizRunner").innerHTML = `
      <div class="quiz-q">
        <p class="muted tiny">${esc(qz.quiz.title)} · question ${qz.i + 1} of ${qz.quiz.questions.length}</p>
        <h2>${esc(q.q)}</h2>
      </div>
      <div id="quizOpts">${q.options.map((o, i) => `<button class="quiz-opt" data-i="${i}">${esc(o)}</button>`).join("")}</div>
      <div id="quizExplain" class="callout hidden"></div>
      <div class="reader-actions" style="margin-top:18px">
        <button class="btn btn-ghost btn-sm" id="quizQuit">← Back to quizzes</button>
        <span style="flex:1"></span>
        <button class="btn btn-primary hidden" id="quizNext">Next →</button>
      </div>`;
    $("#quizQuit").addEventListener("click", renderQuizzes);
    $$("#quizOpts .quiz-opt").forEach((b) =>
      b.addEventListener("click", () => {
        if (qz.locked) return;
        qz.locked = true;
        const pick = Number(b.dataset.i);
        qz.answers.push(pick === q.answer);
        $$("#quizOpts .quiz-opt").forEach((x) => {
          const xi = Number(x.dataset.i);
          if (xi === q.answer) x.classList.add("correct");
          if (xi === pick && pick !== q.answer) x.classList.add("wrong");
        });
        const ex = $("#quizExplain");
        ex.innerHTML = `<strong>${pick === q.answer ? "Correct" : "Not quite"}</strong> — ${esc(q.explain)}`;
        ex.classList.remove("hidden");
        const nx = $("#quizNext");
        nx.classList.remove("hidden");
        nx.textContent = qz.i === qz.quiz.questions.length - 1 ? "See result →" : "Next →";
        nx.addEventListener("click", () => {
          qz.i++;
          if (qz.i < qz.quiz.questions.length) drawQuestion();
          else finishQuiz();
        });
      })
    );
  }

  function finishQuiz() {
    const score = Math.round((qz.answers.filter(Boolean).length / qz.quiz.questions.length) * 100);
    const prev = state.quiz[qz.quiz.id];
    const best = prev == null ? score : Math.max(prev, score);
    state.quiz[qz.quiz.id] = best;
    save(); D.touchDay(); D.renderDashboard();
    $("#quizRunner").innerHTML = `
      <div class="quiz-result">
        <div class="mock-score">${score}%</div>
        <p class="muted">${qz.answers.filter(Boolean).length} of ${qz.quiz.questions.length} correct · best ${best}%</p>
        <p>${score >= 80 ? "Strong. Move to the next module." : score >= 50 ? "Re-read the module notes for the questions you missed, then retry." : "Go back through the lesson notes before retrying this quiz."}</p>
        <div class="reader-actions">
          <button class="btn btn-primary" id="quizRetry">Retry quiz</button>
          <button class="btn btn-ghost" id="quizAllQuizzes">All quizzes</button>
          ${MODULE_BY_ID[qz.quiz.module] ? `<button class="btn btn-ghost" id="quizGoModule">Open module notes</button>` : ""}
        </div>
      </div>`;
    $("#quizRetry").addEventListener("click", () => startQuiz(qz.quiz.id));
    $("#quizAllQuizzes").addEventListener("click", renderQuizzes);
    const gm = $("#quizGoModule");
    if (gm) gm.addEventListener("click", () => D.openModule(qz.quiz.module));
  }

  D.renderQuizzes = renderQuizzes;

  /* =======================================================================
     CHEAT SHEETS
     ======================================================================= */
  let sheetId = CHEATSHEETS.length ? CHEATSHEETS[0].id : null;
  function renderCheats() {
    if (!CHEATSHEETS.length) return;
    $("#cheatTabs").innerHTML = CHEATSHEETS.map((s) => `<button class="tab ${s.id === sheetId ? "active" : ""}" data-id="${esc(s.id)}">${esc(s.title)}</button>`).join("");
    $$("#cheatTabs .tab").forEach((b) => b.addEventListener("click", () => { sheetId = b.dataset.id; renderCheats(); }));
    const s = CHEATSHEETS.find((x) => x.id === sheetId) || CHEATSHEETS[0];
    $("#cheatBody").innerHTML = `<div class="cheat-card"><h2>${esc(s.title)}</h2>${s.body}</div>`;
    document.querySelectorAll("#cheatBody pre code").forEach((c) => { c.style.whiteSpace = "pre"; });
  }
  D.renderCheats = renderCheats;
  D.openSheet = function (id) { sheetId = id; renderCheats(); };

  /* =======================================================================
     ROADMAP
     ======================================================================= */
  function renderRoadmap() {
    const doneWeeks = Object.keys(state.weeks).filter((k) => state.weeks[k]).length;
    $("#roadmapList").innerHTML = ROADMAP.map((w) => {
      const on = !!state.weeks[w.week];
      const mods = (w.modules || []).map((id) => MODULE_BY_ID[id]).filter(Boolean);
      const modPct = mods.length ? Math.round(mods.reduce((a, m) => a + D.pct((m.lessons || []).filter((l) => state.lessons[m.id + ":" + l.id]).length, (m.lessons || []).length), 0) / mods.length) : 0;
      return `<article class="week-card ${on ? "done" : ""}">
        <div class="week-num">W${esc(w.week)}</div>
        <div class="week-main">
          <div class="week-head">
            <h3>${esc(w.title)}</h3>
            <span class="muted tiny">${esc(w.hours || 10)} h · modules ${modPct}% complete</span>
          </div>
          <p class="muted">${esc(w.focus || "")}</p>
          <div class="module-meta">
            ${mods.map((m) => `<span class="tag tag-ghost" data-mod="${esc(m.id)}" style="cursor:pointer">${esc(m.title)}</span>`).join("")}
          </div>
          <ul class="week-tasks">
            ${(w.tasks || []).map((t) => `<li>${esc(t)}</li>`).join("")}
          </ul>
        </div>
        <button class="week-check ${on ? "on" : ""}" data-week="${esc(w.week)}" aria-label="Mark week complete">${on ? "✓" : ""}</button>
      </article>`;
    }).join("") + `<p class="muted tiny">${doneWeeks} of ${ROADMAP.length} weeks marked complete.</p>`;
    $$("#roadmapList .week-check").forEach((b) =>
      b.addEventListener("click", () => {
        const k = b.dataset.week;
        state.weeks[k] = !state.weeks[k];
        save(); D.touchDay(); renderRoadmap(); D.renderDashboard();
      })
    );
    $$("#roadmapList .tag[data-mod]").forEach((t) => t.addEventListener("click", () => D.openModule(t.dataset.mod)));
  }
  D.renderRoadmap = renderRoadmap;
})();
