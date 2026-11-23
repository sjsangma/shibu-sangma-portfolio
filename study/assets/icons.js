/* Data Analyst Academy — icon set. Every icon is hand-drawn SVG so it can be animated
   per part (stroke draw, bars growing, layers rotating, glyph morphing). */
(function () {
  const S = (inner, name) =>
    `<svg class="mi mi-${name}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${inner}</svg>`;

  const I = {};

  I.dashboard = S(`<rect class="mi-c1" x="3" y="3" width="7.5" height="7.5" rx="1.8"/>
    <rect class="mi-c2" x="13.5" y="3" width="7.5" height="4.6" rx="1.6"/>
    <rect class="mi-c3" x="13.5" y="10.4" width="7.5" height="10.6" rx="1.8"/>
    <rect class="mi-c4" x="3" y="13.5" width="7.5" height="7.5" rx="1.8"/>`, "dashboard");

  I.curriculum = S(`<path class="mi-cover" d="M4 5.2A2.2 2.2 0 0 1 6.2 3H19v16.4H6.4A2.4 2.4 0 0 0 4 21.8z"/>
    <path class="mi-spine" d="M7.6 3v16.4"/>
    <path class="mi-p1" d="M10.2 7.4h5.6"/><path class="mi-p2" d="M10.2 10.6h4"/>`, "curriculum");

  I.mycourses = S(`<path class="mi-l1" d="m12 3 8 4.2-8 4.2-8-4.2z"/>
    <path class="mi-l2" d="m4 12 8 4.2 8-4.2"/><path class="mi-l3" d="m4 16.6 8 4.2 8-4.2"/>`, "mycourses");

  I.library = S(`<path class="mi-b1" d="M4 4.5h4v15H4z"/><path class="mi-b2" d="M9.6 6.2h3.6v13.3H9.6z"/>
    <path class="mi-b3" d="m15.4 6.6 3.4.9-3.2 12.6-3.4-.9z"/>`, "library");

  I.video = S(`<rect class="mi-frame" x="2.6" y="4.4" width="18.8" height="15.2" rx="3.2"/>
    <path class="mi-tri" d="M10.2 8.9v6.2l5.2-3.1z"/><path class="mi-wave" d="M6 12h1.4"/>`, "video");

  I.sessions = S(`<circle class="mi-clock" cx="12" cy="13" r="8"/>
    <path class="mi-h1" d="M12 8.6V13"/><path class="mi-h2" d="M12 13l3.2 2"/>
    <path class="mi-top" d="M9 2.6h6"/>`, "sessions");

  I.interview = S(`<rect class="mi-case" x="2.8" y="7.4" width="12" height="9.4" rx="2"/>
    <path class="mi-handle" d="M6.4 7.4V6a2 2 0 0 1 2-2h1.2a2 2 0 0 1 2 2v1.4"/>
    <path class="mi-mic" d="M19 8.6a2.4 2.4 0 0 1 2.4 2.4v2.4a2.4 2.4 0 0 1-4.8 0V11A2.4 2.4 0 0 1 19 8.6z"/>
    <path class="mi-stand" d="M16.6 14.6a5 5 0 0 0 4.8 0"/>`, "interview");

  I.assistant = S(`<path class="mi-spark" d="M12 3.2 13.7 9l5.8 1.7-5.8 1.7L12 18.2 10.3 12.4 4.5 10.7 10.3 9z"/>
    <circle class="mi-orbit" cx="18.6" cy="5.2" r="1.5"/><circle class="mi-orbit2" cx="5.4" cy="18.4" r="1.1"/>`, "assistant");

  I.notes = S(`<path class="mi-doc" d="M5 3.6h9.4L19 8.2v12.2H5z"/><path class="mi-fold" d="M14.4 3.6v4.6H19"/>
    <path class="mi-l1" d="M8 12.4h7"/><path class="mi-l2" d="M8 15.6h7"/><path class="mi-l3" d="M8 18.4h4"/>`, "notes");

  I.analytics = S(`<path class="mi-axis" d="M3.4 20.2h17.2"/>
    <rect class="mi-bar1" x="4.6" y="13" width="3.2" height="7.2" rx="0.9"/>
    <rect class="mi-bar2" x="9.8" y="9.2" width="3.2" height="11" rx="0.9"/>
    <rect class="mi-bar3" x="15" y="5.4" width="3.2" height="14.8" rx="0.9"/>
    <path class="mi-line" d="M4.6 10.4 9 7.2l4.4 1.6 6.2-4"/>`, "analytics");

  I.database = S(`<ellipse class="mi-db1" cx="12" cy="5.6" rx="7.4" ry="2.8"/>
    <path class="mi-db2" d="M4.6 5.6v6c0 1.5 3.3 2.8 7.4 2.8s7.4-1.3 7.4-2.8v-6"/>
    <path class="mi-db3" d="M4.6 11.6v6c0 1.5 3.3 2.8 7.4 2.8s7.4-1.3 7.4-2.8v-6"/>`, "database");

  I.sql = S(`<rect class="mi-screen" x="2.8" y="4" width="18.4" height="16" rx="2.4"/>
    <path class="mi-code" d="M6.6 9.6 9.4 12l-2.8 2.4"/><path class="mi-cursor" d="M11.4 15.4h4"/>
    <path class="mi-tab1" d="M2.8 8h18.4"/>`, "sql");

  I.python = S(`<path class="mi-snake1" d="M11.4 2.8h3.1a3.1 3.1 0 0 1 3.1 3.1v2.6a2.4 2.4 0 0 1-2.4 2.4H9.6a2.4 2.4 0 0 0-2.4 2.4v1.5"/>
    <path class="mi-snake2" d="M12.6 21.2h-3.1a3.1 3.1 0 0 1-3.1-3.1v-2.6a2.4 2.4 0 0 1 2.4-2.4h5.6a2.4 2.4 0 0 0 2.4-2.4v-1.5"/>
    <circle class="mi-eye1" cx="10.2" cy="6.4" r="0.9"/><circle class="mi-eye2" cx="13.8" cy="17.6" r="0.9"/>`, "python");

  I.excel = S(`<rect class="mi-sheet" x="3" y="3.4" width="18" height="17.2" rx="2.2"/>
    <path class="mi-g1" d="M3 9h18"/><path class="mi-g2" d="M3 14.6h18"/>
    <path class="mi-g3" d="M9.6 3.4v17.2"/><path class="mi-g4" d="M15 3.4v17.2"/>
    <rect class="mi-selected" x="9.6" y="9" width="5.4" height="5.6"/>`, "excel");

  I.powerbi = S(`<rect class="mi-pb1" x="3.4" y="13.6" width="4.2" height="7" rx="1"/>
    <rect class="mi-pb2" x="9.9" y="9" width="4.2" height="11.6" rx="1"/>
    <rect class="mi-pb3" x="16.4" y="4.2" width="4.2" height="16.4" rx="1"/>`, "powerbi");

  I.statistics = S(`<path class="mi-sigma" d="M18.4 6H6.2l5.6 6-5.6 6h12.2"/>
    <circle class="mi-dot1" cx="4.4" cy="4.6" r="0.9"/><circle class="mi-dot2" cx="19.6" cy="19.4" r="0.9"/>`, "statistics");

  I.quiz = S(`<path class="mi-q" d="M8.4 8.6a3.6 3.6 0 1 1 5.6 3c-1.2.8-1.9 1.5-1.9 3"/>
    <circle class="mi-qdot" cx="12.1" cy="18.4" r="1.05"/>
    <path class="mi-check" d="m7.4 12.2 3.1 3.2 6.1-7"/>`, "quiz");

  I.exams = S(`<path class="mi-ring" d="M12 3.4a8.4 8.4 0 1 1-6 2.5"/>
    <path class="mi-cup" d="M8 7.4h8v4.2a4 4 0 0 1-8 0z"/>
    <path class="mi-stem" d="M12 15.8v3"/><path class="mi-base" d="M8.8 20.4h6.4"/>
    <path class="mi-h1" d="M8 8.2H6.2a2.4 2.4 0 0 0 2.4 3.4"/><path class="mi-h2" d="M16 8.2h1.8a2.4 2.4 0 0 1-2.4 3.4"/>`, "exams");

  I.cheatsheets = S(`<path class="mi-doc" d="M5.4 3h9l4.2 4.2V21H5.4z"/><path class="mi-fold" d="M14.4 3v4.2h4.2"/>
    <path class="mi-hl" d="M8 11.4h8"/><path class="mi-l2" d="M8 14.6h8"/><path class="mi-l3" d="M8 17.6h5"/>`, "cheatsheets");

  I.roadmap = S(`<rect class="mi-cal" x="3.2" y="5" width="17.6" height="16" rx="2.4"/>
    <path class="mi-t1" d="M3.2 9.6h17.6"/><path class="mi-r1" d="M8 2.8v3.6"/><path class="mi-r2" d="M16 2.8v3.6"/>
    <path class="mi-tick" d="m7.6 14.6 2.2 2.2 4.4-4.6"/>`, "roadmap");

  I.studio = S(`<path class="mi-frame" d="M4 7.4h16v13H4z"/><path class="mi-frame2" d="M4 7.4 7.4 3h9.2L20 7.4"/>
    <path class="mi-sp" d="M12 10.4l1.2 2.6 2.6 1.2-2.6 1.2L12 18l-1.2-2.6L8.2 14.2l2.6-1.2z"/>`, "studio");

  I.settings = S(`<circle class="mi-core" cx="12" cy="12" r="3.1"/>
    <path class="mi-gear" d="M19.4 14.6a1.7 1.7 0 0 0 .35 1.9l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.9-.35 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.55 1.7 1.7 0 0 0-1.9.35l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .35-1.9 1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.55-1.1 1.7 1.7 0 0 0-.35-1.9l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.9.35H9a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.9-.35l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.35 1.9V9a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>`, "settings");

  I.search = S(`<circle class="mi-lens" cx="10.6" cy="10.6" r="6.6"/>
    <path class="mi-beam" d="M10.6 4.4v12.4"/><path class="mi-handle" d="m15.6 15.6 5 5"/>`, "search");

  I.menu = S(`<path class="mi-bar1" d="M4 7.4h16"/><path class="mi-bar2" d="M4 12h16"/><path class="mi-bar3" d="M4 16.6h16"/>`, "menu");

  I.bell = S(`<path class="mi-bell" d="M18 15.4V10a6 6 0 1 0-12 0v5.4L3.8 18h16.4z"/>
    <path class="mi-clap" d="M9.6 20.6a2.6 2.6 0 0 0 4.8 0"/>`, "bell");

  I.theme = S(`<circle class="mi-sun" cx="12" cy="12" r="4.2"/>
    <path class="mi-rays" d="M12 2.6v2.2M12 19.2v2.2M4.5 4.5l1.6 1.6M17.9 17.9l1.6 1.6M2.6 12h2.2M19.2 12h2.2M4.5 19.5l1.6-1.6M17.9 6.1l1.6-1.6"/>
    <path class="mi-moon" d="M20.4 14.6A8.6 8.6 0 0 1 9.4 3.6a8.8 8.8 0 1 0 11 11z"/>`, "theme");

  I.reset = S(`<path class="mi-arc" d="M20 12a8 8 0 1 1-2.6-5.9"/><path class="mi-head" d="M20.4 3.6v4.6h-4.6"/>
    <path class="mi-inner" d="M12 8.4V12l2.6 1.6"/>`, "reset");

  I.flame = S(`<path class="mi-fire" d="M12 21.4c3.5 0 6-2.3 6-5.5 0-4.1-4.2-5.9-4.2-9.9 0-1-.4-1.9-1-2.6-.6 3-3.1 4.1-4.6 6.5a7.6 7.6 0 0 0-1.2 4.1c0 4 2.4 6.4 5 6.4z"/>
    <path class="mi-ember" d="M12 20c1.4 0 2.4-1.1 2.4-2.6 0-1.8-2.4-2.6-2.4-4.6-1.2 1.4-2.4 2.4-2.4 4.6 0 1.5 1 2.6 2.4 2.6z"/>`, "flame");

  I.trophy = S(`<path class="mi-cup" d="M8 3.8h8v5.2a4 4 0 0 1-8 0z"/>
    <path class="mi-h1" d="M8 5.4H5.4a3.4 3.4 0 0 0 3.4 4.4"/><path class="mi-h2" d="M16 5.4h2.6a3.4 3.4 0 0 1-3.4 4.4"/>
    <path class="mi-stem" d="M12 13v4.2"/><path class="mi-base" d="M8.2 20.2h7.6"/>`, "trophy");

  I.clock = I.sessions;
  I.target = S(`<circle class="mi-t1" cx="12" cy="12" r="8.4"/><circle class="mi-t2" cx="12" cy="12" r="4.6"/>
    <circle class="mi-t3" cx="12" cy="12" r="1.2"/>`, "target");
  I.download = S(`<path class="mi-arrow" d="M12 3.6v10.2"/><path class="mi-head" d="m7.8 9.6 4.2 4.2 4.2-4.2"/>
    <path class="mi-tray" d="M4.4 17.4v2.2h15.2v-2.2"/>`, "download");
  I.upload = S(`<path class="mi-arrow" d="M12 20.4V10.2"/><path class="mi-head" d="m7.8 14.4 4.2-4.2 4.2 4.2"/>
    <path class="mi-tray" d="M4.4 6.6V4.4h15.2v2.2"/>`, "upload");
  I.check = S(`<path class="mi-path" d="m4.6 12.6 4.6 4.6L19.4 6.8"/>`, "check");
  I.lock = S(`<rect class="mi-body" x="4.6" y="10.4" width="14.8" height="10" rx="2.6"/>
    <path class="mi-shackle" d="M8.2 10.4V7.8a3.8 3.8 0 0 1 7.6 0v2.6"/>
    <circle class="mi-kh" cx="12" cy="15.4" r="1.2"/>`, "lock");
  I.arrowRight = S(`<path class="mi-ar" d="M4.6 12h14.2"/><path class="mi-head" d="m13.4 6.6 5.4 5.4-5.4 5.4"/>`, "arrow-right");
  I.arrowLeft = S(`<path class="mi-ar" d="M19.4 12H5.2"/><path class="mi-head" d="M10.6 6.6 5.2 12l5.4 5.4"/>`, "arrow-left");
  I.chevron = S(`<path class="mi-ch" d="m9 5.5 6.5 6.5L9 18.5"/>`, "chevron");
  I.close = S(`<path class="mi-x1" d="M5.6 5.6 18.4 18.4"/><path class="mi-x2" d="M18.4 5.6 5.6 18.4"/>`, "close");
  I.plus = S(`<path class="mi-p1" d="M12 4.4v15.2"/><path class="mi-p2" d="M4.4 12h15.2"/>`, "plus");
  I.trash = S(`<path class="mi-lid" d="M4.4 6.6h15.2"/><path class="mi-anc" d="M9.4 6.6V4.4h5.2v2.2"/>
    <path class="mi-bin" d="M6.4 6.6 7.6 20a1.6 1.6 0 0 0 1.6 1.4h5.6a1.6 1.6 0 0 0 1.6-1.4l1.2-13.4"/>
    <path class="mi-l1" d="M10.4 10.6v6"/><path class="mi-l2" d="M13.6 10.6v6"/>`, "trash");
  I.edit = S(`<path class="mi-pen" d="m4 20 1-4.6L16.2 4.2a2.3 2.3 0 0 1 3.3 3.3L8.4 18.9z"/>
    <path class="mi-nib" d="m14.4 6.6 3.3 3.3"/>`, "edit");
  I.star = S(`<path class="mi-star" d="m12 3.4 2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17.4l-5.4 2.8 1-6.1L3.2 9.8l6.1-.9z"/>`, "star");
  I.filter = S(`<path class="mi-f1" d="M3.6 5.4h16.8l-6.6 7.6v6.6l-3.6 2v-8.6z"/>`, "filter");
  I.brain = S(`<path class="mi-b1" d="M9.4 4.2a3.2 3.2 0 0 0-3.2 3.2 3 3 0 0 0-1.6 5.4 3.2 3.2 0 0 0 2.2 5.4 3 3 0 0 0 5.2-2V7a2.8 2.8 0 0 0-2.6-2.8z"/>
    <path class="mi-b2" d="M14.6 4.2a3.2 3.2 0 0 1 3.2 3.2 3 3 0 0 1 1.6 5.4 3.2 3.2 0 0 1-2.2 5.4 3 3 0 0 1-5.2-2"/>`, "brain");
  I.rocket = S(`<path class="mi-body" d="M12 3.4c3 1.6 4.6 4.6 4.6 8.2L12 16.4l-4.6-4.8c0-3.6 1.6-6.6 4.6-8.2z"/>
    <circle class="mi-win" cx="12" cy="9.4" r="1.7"/><path class="mi-fin1" d="M7.4 12.4 4.6 16l3.4-.6"/>
    <path class="mi-fin2" d="M16.6 12.4 19.4 16l-3.4-.6"/><path class="mi-flame" d="M12 16.4v4.2"/>`, "rocket");

  I.cards = S(`<rect class="mi-back" x="6.6" y="6.8" width="12" height="12.4" rx="2.4" opacity=".4"/>
    <rect class="mi-front" x="4.2" y="3.4" width="12.4" height="13.6" rx="2.4"/>
    <path class="mi-cl1" d="M7.2 7.4h6.4"/><path class="mi-cl2" d="M7.2 10.6h4.2"/>`, "cards");

  window.Icons = I;
  window.Icon = (name, extraClass) => {
    const raw = I[name] || I.dashboard;
    return extraClass ? raw.replace('class="mi mi-', `class="mi ${extraClass} mi-`) : raw;
  };
})();
