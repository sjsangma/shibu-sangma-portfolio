/* Data Analyst Academy — premium 3D layer.
   Purely additive: it never touches lesson content, state or scoring.
   All numbers come from the existing app (DOM + window.DAA). */
(function () {
  "use strict";

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const mq = (q) => (window.matchMedia ? window.matchMedia(q) : { matches: false, addEventListener: function () {}, addListener: function () {} });
  const reduce = mq("(prefers-reduced-motion: reduce)");
  const hoverNone = mq("(hover: none)");
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  /* ------------------------------------------------------------------ data */
  function readData() {
    const D = window.DAA;
    const out = { pct: 0, lessonsDone: 0, lessonsTotal: 0, streak: 0, videos: 0, videosTotal: 0, quiz: null, modules: [], tracks: [], spark: [] };
    const ringPct = $("#ringPct");
    if (ringPct) out.pct = parseInt(ringPct.textContent, 10) || 0;

    const labels = $("#lessonsDoneLabel");
    if (labels) {
      const m = labels.textContent.match(/(\d+)\s*\/\s*(\d+)/);
      if (m) { out.lessonsDone = +m[1]; out.lessonsTotal = +m[2]; }
    }
    const st = $("#statStreak");
    if (st) out.streak = parseInt(st.textContent, 10) || 0;
    const sv = $("#statVideos");
    if (sv) {
      const m = sv.textContent.match(/(\d+)\s*\/\s*(\d+)/);
      if (m) { out.videos = +m[1]; out.videosTotal = +m[2]; }
    }
    const sq = $("#statQuiz");
    if (sq) { const n = parseInt(sq.textContent, 10); out.quiz = Number.isFinite(n) ? n : null; }

    if (D && D.CURRICULUM) {
      const state = D.state || {};
      const known = state.lessons || {};
      const tracks = {};
      D.CURRICULUM.forEach((mod) => {
        const lessons = mod.lessons || [];
        const done = lessons.filter((l) => known[mod.id + ":" + l.id]).length;
        const p = lessons.length ? Math.round((done / lessons.length) * 100) : 0;
        out.modules.push({ id: mod.id, title: mod.title, p: p, done: done, total: lessons.length });
        const t = mod.track || "core";
        tracks[t] = tracks[t] || { done: 0, total: 0 };
        tracks[t].done += done;
        tracks[t].total += lessons.length;
      });
      out.tracks = Object.keys(tracks).map((k) => ({
        key: k,
        label: { core: "Core analysis", python: "Python", sql: "SQL", stats: "Statistics", viz: "Visualisation", bi: "BI & tools" }[k] || k,
        p: tracks[k].total ? Math.round((tracks[k].done / tracks[k].total) * 100) : 0,
        done: tracks[k].done,
        total: tracks[k].total
      }));
      let run = 0;
      let runTotal = 0;
      out.modules.forEach((m) => { run += m.done; runTotal += m.total; out.spark.push(runTotal ? Math.round((run / runTotal) * 100) : 0); });
    }
    return out;
  }

  /* --------------------------------------------------------------- sidebar */
  const SHELL_KEY = "daa:sidebar";
  function initSidebar() {
    const shell = $(".app-shell");
    const sidebar = $("#sidebar");
    if (!shell || !sidebar || $("#sbToggle")) return;

    const btn = document.createElement("button");
    btn.id = "sbToggle";
    btn.className = "sb-toggle";
    btn.type = "button";
    btn.title = "Collapse sidebar";
    btn.setAttribute("aria-label", "Collapse sidebar");
    btn.textContent = "◀";
    sidebar.appendChild(btn);

    let collapsed = false;
    try { collapsed = localStorage.getItem(SHELL_KEY) === "1"; } catch (e) {}
    shell.classList.toggle("sb-collapsed", collapsed);

    btn.addEventListener("click", () => {
      const next = !shell.classList.contains("sb-collapsed");
      shell.classList.toggle("sb-collapsed", next);
      btn.title = next ? "Expand sidebar" : "Collapse sidebar";
      try { localStorage.setItem(SHELL_KEY, next ? "1" : "0"); } catch (e) {}
      setTimeout(() => window.dispatchEvent(new Event("premium:resize")), 320);
    });

    $("#menuBtn") && $("#menuBtn").addEventListener("click", () => {
      document.documentElement.classList.toggle("nav-open", sidebar.classList.contains("open"));
    });
  }

  /* ------------------------------------------------------------------ tilt */
  function attachTilt() {
    if (hoverNone.matches) return;
    const onMove = (e) => {
      const el = e.currentTarget;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      el.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
      el.style.setProperty("--my", (py * 100).toFixed(1) + "%");
      if (reduce.matches) return;
      el.style.transform =
        "perspective(900px) rotateX(" + ((0.5 - py) * 7).toFixed(2) + "deg) rotateY(" + ((px - 0.5) * 9).toFixed(2) + "deg) translateY(-4px)";
    };
    const reset = (el) => { el.style.transform = ""; el.style.setProperty("--mx", "50%"); el.style.setProperty("--my", "0%"); };

    document.addEventListener("pointermove", (e) => {
      const card = e.target.closest && e.target.closest(".stat-card, .module-card");
      if (!card || card.dataset.tiltBound !== "1") return;
      onMove({ currentTarget: card, clientX: e.clientX, clientY: e.clientY });
    }, { passive: true });
    document.addEventListener("pointerout", (e) => {
      const card = e.target.closest && e.target.closest(".stat-card, .module-card");
      if (card) reset(card);
    }, { passive: true });
  }

  function markTilt() {
    $$(".stat-card, .module-card").forEach((c) => (c.dataset.tiltBound = "1"));
  }

  /* -------------------------------------------------------------- counters */
  function countTo(el, value, suffix) {
    if (!el) return;
    const prev = Number(el.dataset.v || 0);
    el.dataset.v = String(value);
    if (reduce.matches || !Number.isFinite(value)) { el.textContent = value + (suffix || ""); return; }
    const from = Number.isFinite(prev) ? prev : 0;
    const t0 = performance.now();
    const dur = 620;
    function step(t) {
      const k = clamp((t - t0) / dur, 0, 1);
      const eased = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(from + (value - from) * eased) + (suffix || "");
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  window.__premiumCountTo = countTo;

  function bootShell() {
    initSidebar();
    attachTilt();
    markTilt();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bootShell);
  else bootShell();
  setTimeout(bootShell, 500);
})();

/* ================= 3D hero scene (Three.js UMD, vendored) ================= */
(function () {
  "use strict";
  const $ = (s, r) => (r || document).querySelector(s);
  const mq = (q) => (window.matchMedia ? window.matchMedia(q) : { matches: false, addEventListener: function () {}, addListener: function () {} });
  const reduce = mq("(prefers-reduced-motion: reduce)");
  const coarse = mq("(hover: none), (max-width: 760px)");
  const LABELS = [
    { text: "SQL", color: "#38bdf8" },
    { text: "PYTHON", color: "#a855f7" },
    { text: "EXCEL", color: "#22d3ee" },
    { text: "POWER BI", color: "#f472b6" },
    { text: "STATISTICS", color: "#818cf8" },
    { text: "DATA VIZ", color: "#34d399" }
  ];

  function labelTexture(text, color) {
    const pad = 24;
    const cv = document.createElement("canvas");
    cv.width = 256; cv.height = 256;
    const g = cv.getContext("2d");
    g.clearRect(0, 0, 256, 256);
    g.fillStyle = "rgba(8, 16, 32, .92)";
    g.fillRect(0, 0, 256, 256);
    g.strokeStyle = color; g.lineWidth = 8;
    g.strokeRect(6, 6, 244, 244);
    g.fillStyle = color;
    g.font = "700 " + (text.length > 6 ? 34 : 44) + "px Inter, Arial, sans-serif";
    g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText(text, 128, 128);
    const tex = new THREE.CanvasTexture(cv);
    tex.anisotropy = 4;
    return tex;
  }

  function faceTexture(text, color) {
    const cv = document.createElement("canvas");
    cv.width = 512; cv.height = 512;
    const g = cv.getContext("2d");
    const grad = g.createLinearGradient(0, 0, 512, 512);
    grad.addColorStop(0, "rgba(14, 34, 60, .96)");
    grad.addColorStop(0.55, "rgba(9, 23, 42, .94)");
    grad.addColorStop(1, "rgba(18, 30, 62, .96)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 512, 512);

    /* faint data grid */
    g.strokeStyle = "rgba(120, 190, 255, .10)";
    g.lineWidth = 1;
    for (let i = 40; i < 512; i += 48) {
      g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 512); g.stroke();
      g.beginPath(); g.moveTo(0, i); g.lineTo(512, i); g.stroke();
    }

    /* neon frame */
    g.strokeStyle = color;
    g.globalAlpha = 0.9;
    g.lineWidth = 6;
    g.strokeRect(14, 14, 484, 484);
    g.globalAlpha = 0.35;
    g.lineWidth = 2;
    g.strokeRect(30, 30, 452, 452);
    g.globalAlpha = 1;

    /* corner brackets */
    const bracket = (x, y, dx, dy) => {
      g.beginPath();
      g.moveTo(x, y + dy * 46);
      g.lineTo(x, y);
      g.lineTo(x + dx * 46, y);
      g.stroke();
    };
    g.strokeStyle = color;
    g.lineWidth = 8;
    bracket(40, 40, 1, 1); bracket(472, 40, -1, 1);
    bracket(40, 472, 1, -1); bracket(472, 472, -1, -1);

    /* glyph */
    g.globalAlpha = 0.16;
    g.fillStyle = color;
    g.beginPath(); g.arc(256, 196, 74, 0, Math.PI * 2); g.fill();
    g.globalAlpha = 1;

    /* label */
    const lines = String(text).split(" ");
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillStyle = "#f4f8ff";
    const size = lines.length > 1 ? (text.length > 9 ? 46 : 54) : (text.length > 8 ? 44 : 58);
    g.font = "700 " + size + "px Inter, Arial, sans-serif";
    lines.forEach((ln, i) => {
      const y = 296 + (i - (lines.length - 1) / 2) * (size + 8);
      g.fillText(ln, 256, y);
    });

    /* accent underline */
    g.strokeStyle = color;
    g.lineWidth = 5;
    g.beginPath();
    g.moveTo(186, 396); g.lineTo(326, 396);
    g.stroke();

    const tex = new THREE.CanvasTexture(cv);
    tex.anisotropy = 8;
    return tex;
  }

  function fallback(host) {
    host.innerHTML = '<div class="hero-fallback-cube"><span>SQL</span><span>PYTHON</span><span>EXCEL</span>' +
      '<span>POWER BI</span><span>STATISTICS</span><span>DATA VIZ</span></div>';
  }

  window.Premium = window.Premium || {};

  window.Premium.initHero = function () {
    const host = $("#heroScene");
    if (!host || host.dataset.ready === "1") return;

    const hasGL = (() => {
      try {
        const c = document.createElement("canvas");
        return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
      } catch (e) { return false; }
    })();
    if (!window.THREE || !hasGL) { fallback(host); host.dataset.ready = "1"; return; }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 7.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setClearAlpha(0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarse.matches ? 1.6 : 2));
    host.appendChild(renderer.domElement);

    const world = new THREE.Group();
    scene.add(world);

    scene.add(new THREE.AmbientLight(0x8fb8ff, 1.15));
    const l1 = new THREE.PointLight(0x38bdf8, 42, 30); l1.position.set(3.2, 2.4, 4);
    const l2 = new THREE.PointLight(0xa855f7, 34, 30); l2.position.set(-3.4, -1.6, 3);
    const l3 = new THREE.DirectionalLight(0xffffff, 1.1); l3.position.set(0, 4, 6);
    scene.add(l1, l2, l3);

    /* central holographic data cube — six labelled faces */
    const core = new THREE.Group();
    const S = 1.34;
    const cubeMats = LABELS.map((item) => new THREE.MeshStandardMaterial({
      map: faceTexture(item.text, item.color),
      transparent: true,
      opacity: 0.94,
      metalness: 0.28,
      roughness: 0.32,
      emissive: new THREE.Color(item.color),
      emissiveIntensity: 0.10,
      side: THREE.DoubleSide
    }));
    const cubeMesh = new THREE.Mesh(new THREE.BoxGeometry(S, S, S), cubeMats);
    cubeMesh.rotation.set(-0.06, 0.5, 0.02);

    const cubeEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(S, S, S)),
      new THREE.LineBasicMaterial({ color: 0x7fe6ff, transparent: true, opacity: 0.9 })
    );
    cubeMesh.add(cubeEdges);

    const glassShell = new THREE.Mesh(
      new THREE.BoxGeometry(S * 1.14, S * 1.14, S * 1.14),
      new THREE.MeshBasicMaterial({ color: 0x2f8fd8, wireframe: true, transparent: true, opacity: 0.22 })
    );
    const glowShell = new THREE.Mesh(
      new THREE.BoxGeometry(S * 1.3, S * 1.3, S * 1.3),
      new THREE.MeshBasicMaterial({ color: 0x9364ff, wireframe: true, transparent: true, opacity: 0.10 })
    );
    core.add(cubeMesh, glassShell, glowShell);
    world.add(core);

    /* progress ring */
    const ringGroup = new THREE.Group();
    ringGroup.rotation.set(1.2, 0.2, -0.35);
    world.add(ringGroup);
    const trackMat = new THREE.MeshBasicMaterial({ color: 0x2b4a7d, transparent: true, opacity: 0.45 });
    const ringTrack = new THREE.Mesh(new THREE.TorusGeometry(1.86, 0.016, 8, 128), trackMat);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: 0.95 });
    let ringMesh = null;
    ringGroup.add(ringTrack);

    window.Premium.setHeroProgress = function (pct) {
      const arc = Math.PI * 2 * (Math.max(0, Math.min(100, pct)) / 100);
      if (ringMesh) { ringGroup.remove(ringMesh); ringMesh.geometry.dispose(); ringMesh = null; }
      if (arc <= 0.02) return;
      ringMesh = new THREE.Mesh(new THREE.TorusGeometry(1.86, 0.032, 10, 160, arc), ringMat);
      ringGroup.add(ringMesh);
    };

    /* floating labelled cubes + connection lines */
    const cubes = [];
    const lineGeo = new THREE.BufferGeometry();
    const linePos = new Float32Array(LABELS.length * 6);
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePos, 3));
    const lines = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({ color: 0x4a8fe0, transparent: true, opacity: 0.34 }));
    world.add(lines);

    LABELS.forEach((item, i) => {
      const tex = labelTexture(item.text, item.color);
      const mat = new THREE.MeshStandardMaterial({ map: tex, metalness: 0.35, roughness: 0.45, emissive: 0x0a1526, emissiveIntensity: 0.6 });
      const cube = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.46, 0.46), mat);
      const edge = new THREE.LineSegments(new THREE.EdgesGeometry(cube.geometry), new THREE.LineBasicMaterial({ color: new THREE.Color(item.color), transparent: true, opacity: 0.85 }));
      cube.add(edge);
      cube.userData = { angle: (i / LABELS.length) * Math.PI * 2, speed: 0.12 + i * 0.014, tilt: (i % 2 ? 1 : -1) * 0.22 };
      world.add(cube);
      cubes.push(cube);
    });

    /* particles */
    const count = coarse.matches ? 260 : 780;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.6 + Math.random() * 3.4;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      pPos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pPos[i * 3 + 1] = r * Math.cos(ph) * 0.7;
      pPos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th) * 0.6;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const points = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x9fd6ff, size: 0.035, transparent: true, opacity: 0.75, depthWrite: false, blending: THREE.AdditiveBlending }));
    scene.add(points);

    /* pointer parallax */
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointer = (e) => {
      const r = host.getBoundingClientRect();
      const cx = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
      const cy = (e.touches ? e.touches[0].clientY : e.clientY) - r.top;
      pointer.tx = ((cx / r.width) - 0.5) * 2;
      pointer.ty = ((cy / r.height) - 0.5) * 2;
    };
    host.addEventListener("pointermove", onPointer, { passive: true });
    host.addEventListener("touchmove", onPointer, { passive: true });

    /* size */
    function resize() {
      const w = host.clientWidth || 480;
      const h = host.clientHeight || 460;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener("premium:resize", resize);
    window.addEventListener("resize", resize);
    if (window.ResizeObserver) new ResizeObserver(resize).observe(host);

    let visible = true;
    if (window.IntersectionObserver) {
      new IntersectionObserver((es) => es.forEach((e) => (visible = e.isIntersecting)), { threshold: 0.05 }).observe(host);
    }

    let t = 0;
    function frame(now) {
      requestAnimationFrame(frame);
      if (!visible || document.hidden) return;
      const dt = Math.min(0.05, (now - (frame.last || now)) / 1000);
      frame.last = now;
      t += dt;

      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;

      world.rotation.y += dt * 0.10;
      world.rotation.x = Math.sin(t * 0.3) * 0.05;

      cubeMesh.rotation.y += dt * 0.30;
      cubeMesh.rotation.x = Math.sin(t * 0.42) * 0.09 + pointer.y * 0.26;
      cubeMesh.rotation.z = -pointer.x * 0.10;
      glassShell.rotation.y -= dt * 0.16;
      glassShell.rotation.x += dt * 0.05;
      glowShell.rotation.y += dt * 0.09;
      glowShell.rotation.z -= dt * 0.04;
      core.position.y = Math.sin(t * 0.7) * 0.06;

      points.rotation.y += dt * 0.03;
      ringGroup.rotation.z -= dt * 0.12;

      cubes.forEach((cube, i) => {
        const u = cube.userData;
        const a = u.angle + t * u.speed;
        const radius = 2.55;
        const x = Math.cos(a) * radius;
        const z = Math.sin(a) * radius * 0.55;
        const y = Math.sin(t * 0.9 + i) * 0.34 + u.tilt;
        cube.position.set(x, y, z);
        cube.rotation.y += dt * 0.7;
        cube.rotation.x = Math.sin(t + i) * 0.3;
        linePos[i * 6] = 0; linePos[i * 6 + 1] = 0; linePos[i * 6 + 2] = 0;
        linePos[i * 6 + 3] = x; linePos[i * 6 + 4] = y; linePos[i * 6 + 5] = z;
      });
      lineGeo.attributes.position.needsUpdate = true;

      camera.position.x = pointer.x * 0.55;
      camera.position.y = -pointer.y * 0.42;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }

    if (reduce.matches) {
      renderer.render(scene, camera);
      setTimeout(() => renderer.render(scene, camera), 400);
    } else {
      requestAnimationFrame(frame);
    }

    host.dataset.ready = "1";
  };
})();

/* ================= analytics widgets + boot ================= */
(function () {
  "use strict";
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const mq = (q) => (window.matchMedia ? window.matchMedia(q) : { matches: false, addEventListener: function () {}, addListener: function () {} });
  const reduce = mq("(prefers-reduced-motion: reduce)");
  const shorten = (s) => String(s || "").replace(/\s*\(.*?\)\s*/g, " ").trim();
  const TRACK_COLORS = { core: "#38bdf8", python: "#a855f7", sql: "#22d3ee", stats: "#818cf8", bi: "#f472b6" };

  function readData() {
    const D = window.DAA;
    const out = { pct: 0, lessonsDone: 0, lessonsTotal: 0, streak: 0, videos: 0, videosTotal: 0, quiz: null, modules: [], tracks: [], spark: [] };
    const m0 = ($("#lessonsDoneLabel") || {}).textContent || "";
    const mm = m0.match(/(\d+)\s*\/\s*(\d+)/);
    if (mm) { out.lessonsDone = +mm[1]; out.lessonsTotal = +mm[2]; }
    out.streak = parseInt((($("#statStreak") || {}).textContent) || "0", 10) || 0;
    const mv = ((($("#statVideos") || {}).textContent) || "").match(/(\d+)\s*\/\s*(\d+)/);
    if (mv) { out.videos = +mv[1]; out.videosTotal = +mv[2]; }
    const q = parseInt((($("#statQuiz") || {}).textContent) || "", 10);
    out.quiz = Number.isFinite(q) ? q : null;

    if (D && D.CURRICULUM) {
      const known = (D.state && D.state.lessons) || {};
      const tracks = {};
      D.CURRICULUM.forEach((mod) => {
        const ls = mod.lessons || [];
        const done = ls.filter((l) => known[mod.id + ":" + l.id]).length;
        out.modules.push({ title: shorten(mod.title), p: ls.length ? Math.round((done / ls.length) * 100) : 0, done: done, total: ls.length });
        const t = mod.track || "core";
        tracks[t] = tracks[t] || { done: 0, total: 0 };
        tracks[t].done += done; tracks[t].total += ls.length;
      });
      out.tracks = Object.keys(tracks).map((k) => ({
        key: k,
        label: { core: "Core analysis", python: "Python", sql: "SQL", stats: "Statistics", viz: "Visualisation", bi: "BI & tools" }[k] || k,
        p: tracks[k].total ? Math.round((tracks[k].done / tracks[k].total) * 100) : 0
      }));
      let run = 0, tot = 0;
      out.modules.forEach((m) => { run += m.done; tot += m.total; out.spark.push(tot ? Math.round((run / tot) * 100) : 0); });
    }
    if (!out.lessonsTotal && out.modules.length) {
      out.lessonsTotal = out.modules.reduce((a, m) => a + m.total, 0);
      out.lessonsDone = out.modules.reduce((a, m) => a + m.done, 0);
    }
    out.pct = out.lessonsTotal ? Math.round((out.lessonsDone / out.lessonsTotal) * 100) : 0;
    return out;
  }

  function renderBars(d) {
    const host = $("#vizBars");
    if (!host) return;
    const rows = (d.modules.length ? d.modules : []).slice(0, 8);
    if (!rows.length) return;
    host.innerHTML = rows.map((m, i) => {
      const h = Math.max(4, m.p);
      return '<div class="bar3d" title="' + m.title.replace(/"/g, "") + " — " + m.p + '% complete" style="--h:' + h + '%;animation-delay:' + (i * 70) + 'ms">' +
        '<div class="col"></div>' +
        '<div class="cap">' + m.p + '%</div>' +
        '<div class="lbl">' + m.title.split(/[\s/&-]+/)[0].slice(0, 8) + "</div></div>";
    }).join("");
  }

  function renderDonut(d) {
    const box = $("#donutBox");
    const legend = $("#donutLegend");
    if (!box || !legend) return;
    const segs = d.tracks.length ? d.tracks : [];
    const C = 2 * Math.PI * 54;
    let offset = 0;
    const circles = segs.map((t) => {
      const len = (t.p / 100) * C;
      const el = '<circle class="seg" cx="70" cy="70" r="54" stroke="' + (TRACK_COLORS[t.key] || "#38bdf8") +
        '" stroke-dasharray="' + len.toFixed(1) + " " + (C - len).toFixed(1) +
        '" stroke-dashoffset="' + (-offset).toFixed(1) + '"></circle>';
      offset += len;
      return el;
    }).join("");
    const avg = segs.length ? Math.round(segs.reduce((a, t) => a + t.p, 0) / segs.length) : 0;
    box.innerHTML = '<svg class="donut" viewBox="0 0 140 140" aria-hidden="true">' +
      '<circle class="track" cx="70" cy="70" r="54"></circle>' + circles + "</svg>" +
      '<div class="donut-center"><b>' + avg + '%</b><span>tracks</span></div>';
    legend.innerHTML = segs.map((t) => '<div class="legend-row"><i style="background:' + (TRACK_COLORS[t.key] || "#38bdf8") + ";color:" + (TRACK_COLORS[t.key] || "#38bdf8") + '"></i>' + t.label + "<b>" + t.p + "%</b></div>").join("");
  }

  function renderSpark(d) {
    const svg = $("#vizSpark");
    if (!svg) return;
    const pts = (d.spark && d.spark.length ? d.spark : [0]).map((v, i, arr) => {
      const x = arr.length === 1 ? 0 : (i / (arr.length - 1)) * 100;
      const y = 90 - (v / 100) * 78;
      return [x, y];
    });
    const line = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
    const area = line + " L100 100 L0 100 Z";
    svg.innerHTML =
      '<defs><linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="#38bdf8" stop-opacity=".45"></stop>' +
      '<stop offset="100%" stop-color="#38bdf8" stop-opacity="0"></stop></linearGradient></defs>' +
      '<path class="area" d="' + area + '"></path>' +
      '<path class="line" d="' + line + '"></path>' +
      pts.filter((p, i) => i === pts.length - 1).map((p) => '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3.4"></circle>').join("");
  }

  function setKpis(d) {
    const map = {
      heroKpiLessons: d.lessonsTotal ? d.lessonsDone + "/" + d.lessonsTotal : "0",
      heroKpiStreak: d.streak,
      heroKpiQuiz: d.quiz === null ? "—" : d.quiz + "%",
      heroKpiVideos: d.videosTotal ? d.videos + "/" + d.videosTotal : "0"
    };
    Object.keys(map).forEach((id) => {
      const el = $("#" + id);
      if (!el) return;
      const v = map[id];
      if (typeof v === "number") { if (window.__premiumCountTo) window.__premiumCountTo(el, v); else el.textContent = v; }
      else el.textContent = v;
    });
    if (window.Premium && window.Premium.setHeroProgress) window.Premium.setHeroProgress(d.pct);
  }

  let lastSig = "";
  function refresh(force) {
    const d = readData();
    const sig = [d.lessonsDone, d.lessonsTotal, d.streak, d.videos, d.quiz].join("|") + "#" + d.pct;
    if (!force && sig === lastSig) return;
    lastSig = sig;
    setKpis(d);
    renderBars(d);
    renderDonut(d);
    renderSpark(d);
    if (window.Premium && window.Premium.initHero) window.Premium.initHero();
    $$(".stat-card, .module-card").forEach((c) => (c.dataset.tiltBound = "1"));
  }

  function boot() {
    const run = () => {
      if (window.Premium && window.Premium.initHero) window.Premium.initHero();
      refresh(true);
    };
    run();
    setTimeout(run, 400);
    window.addEventListener("hashchange", () => setTimeout(() => refresh(false), 60));
    ["click", "keyup", "change"].forEach((ev) =>
      document.addEventListener(ev, (e) => {
        if (!e.target.closest) return;
        if (e.target.closest("#moduleBars, #moduleGrid, .module-card, .plan-item, #continueBtn, .quiz-runner, .btn-ok, .nav-item")) {
          setTimeout(() => refresh(false), 120);
        }
      }, true)
    );
    setInterval(() => refresh(false), 2500);
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  }

  window.Premium = window.Premium || {};
  window.Premium.refresh = refresh;
  boot();
})();

/* hero CTA wiring */
(function () {
  function wire() {
    const map = { heroContinue: "#continueBtn", heroInterview: 'a[href="#interview"]' };
    Object.keys(map).forEach((id) => {
      const el = document.getElementById(id);
      if (!el || el.dataset.wired === "1") return;
      el.dataset.wired = "1";
      el.addEventListener("click", () => {
        const target = document.querySelector(map[id]);
        if (target) target.click();
      });
    });
    const plan = document.getElementById("heroPlan");
    if (plan && plan.dataset.wired !== "1") {
      plan.dataset.wired = "1";
      plan.addEventListener("click", () => {
        const t = document.getElementById("todayPlan");
        if (t) t.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wire);
  else wire();
  setTimeout(wire, 600);
})();
