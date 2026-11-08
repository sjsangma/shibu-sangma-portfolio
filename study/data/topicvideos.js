/* Topic video courses — one main pick + one alternative per tool */
window.TOPIC_VIDEOS = [
  {
    topic: "Python",
    modules: ["python", "pandas", "eda"],
    icon: "⌨",
    main: { id: "K5KVEU3aaeQ", title: "Python Full Course for Beginners", channel: "Programming with Mosh", minutes: 122 },
    alt: { id: "rfscVS0vtbw", title: "Learn Python — Full Course for Beginners", channel: "freeCodeCamp.org", minutes: 267 },
    why: "Modules: Python Fundamentals, NumPy & Pandas, EDA"
  },
  {
    topic: "Excel",
    modules: ["excel"],
    icon: "▦",
    main: { id: "Vl0H-qTclOg", title: "Microsoft Excel Tutorial for Beginners — Full Course", channel: "freeCodeCamp.org", minutes: 146 },
    alt: { id: "pCJ15nGFgVg", title: "Excel for Data Analytics — Full Course for Beginners", channel: "Luke Barousse", minutes: 660 },
    why: "Module: Excel for Analysts"
  },
  {
    topic: "SQL",
    modules: ["sql"],
    icon: "🗄",
    main: { id: "7S_tz1z_5bA", title: "SQL Course for Beginners [Full Course]", channel: "Programming with Mosh", minutes: 190 },
    alt: { id: "HXV3zeQKqGY", title: "SQL Tutorial — Full Database Course for Beginners", channel: "freeCodeCamp.org", minutes: 261 },
    why: "Module: SQL for Analysts"
  },
  {
    topic: "Power BI",
    modules: ["powerbi"],
    icon: "▦",
    main: { id: "I0vQ_VLZTWg", title: "Learn Power BI in Under 3 Hours — Full Project", channel: "Alex The Analyst", minutes: 125 },
    alt: { id: "FwjaHCVNBWA", title: "Power BI for Data Analytics — Full Course for Beginners", channel: "Luke Barousse", minutes: 505 },
    why: "Module: Power BI & DAX"
  },
  {
    topic: "Tableau",
    modules: ["viz"],
    icon: "📈",
    main: { id: "j8FSP8XuFyk", title: "Learn Tableau in Under 2 Hours — Mini Project", channel: "Alex The Analyst", minutes: 90 },
    alt: { id: "HGMrIZq5dq0", title: "Tableau Full Course — Tableau Training for Beginners", channel: "Simplilearn", minutes: 335 },
    why: "Module: Data Visualization"
  }
];

/* module id -> topic video, used by the 20-minute sessions "Watch" step */
window.MODULE_VIDEO = {};
(window.TOPIC_VIDEOS || []).forEach(function (t) {
  (t.modules || []).forEach(function (m) { window.MODULE_VIDEO[m] = t; });
});
