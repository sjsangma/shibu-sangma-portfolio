window.ROADMAP = [
  {
    week: 1,
    title: "Foundations & the analyst mindset",
    focus: "Understand what data analysis is, the four types of analytics, and the lifecycle. Set up your toolchain and a study habit.",
    modules: ["foundations"],
    hours: 10,
    tasks: [
      "Read: Foundations module (6 lessons)",
      "Watch: 'What is Data Analysis?' video lesson",
      "Install: Python 3, VS Code, Jupyter, Power BI Desktop",
      "Practice: write the analytics lifecycle for a product you use daily",
      "Interview: answer 'walk me through an analysis end-to-end' out loud"
    ]
  },
  {
    week: 2,
    title: "Excel to the limit",
    focus: "Formulas, lookups, PivotTables, Power Query. Excel is still the most common analyst tool in interviews.",
    modules: ["excel"],
    hours: 10,
    tasks: [
      "Work through all Excel lessons, rebuilding each example",
      "Build a PivotTable report from a 10k-row sample file",
      "Clean one messy CSV using Power Query only",
      "Memorise: XLOOKUP vs INDEX/MATCH, SUMIFS, COUNTIFS",
      "Quiz: Excel module (aim 80%+)"
    ]
  },
  {
    week: 3,
    title: "SQL core",
    focus: "SELECT → JOIN → GROUP BY → window functions. SQL is the single highest-leverage interview skill.",
    modules: ["sql"],
    hours: 12,
    tasks: [
      "Install SQLite or use an online Postgres sandbox",
      "Write 30 queries against a public dataset (e.g. Chinook, NYC taxi)",
      "Master GROUP BY, HAVING, LEFT JOIN vs INNER JOIN",
      "Learn ROW_NUMBER, RANK, LAG, running totals",
      "Do 10 SQL practice problems timed at 5 minutes each"
    ]
  },
  {
    week: 4,
    title: "Python fundamentals",
    focus: "Variables, control flow, functions, lists/dicts, file handling, error handling. Enough to be dangerous.",
    modules: ["python"],
    hours: 12,
    tasks: [
      "Complete the Python module in order",
      "Write 5 small scripts (FizzBuzz, word count, CSV summary)",
      "Learn f-strings, comprehensions and functions with defaults",
      "Understand exceptions: try/except and when not to catch",
      "Quiz: Python module"
    ]
  },
  {
    week: 5,
    title: "pandas & data wrangling",
    focus: "Loading, selecting, filtering, groupby, merge, pivot, dates, missing data, export.",
    modules: ["pandas"],
    hours: 12,
    tasks: [
      "Recreate every pandas example in a notebook",
      "Take a raw messy CSV and clean it end-to-end",
      "Practise groupby + agg + merge on two related tables",
      "Build a 7-day rolling average chart",
      "Quiz: pandas module"
    ]
  },
  {
    week: 6,
    title: "Statistics & experiments",
    focus: "Descriptive stats, distributions, sampling, hypothesis tests, A/B testing, regression basics.",
    modules: ["stats", "eda"],
    hours: 12,
    tasks: [
      "Work through the statistics module",
      "Explain p-value, confidence interval and power without jargon",
      "Design an A/B test for a checkout change (metric, MDE, sample size)",
      "Run an EDA notebook on a dataset you find interesting",
      "Interview: 'how do you know a result is significant?'"
    ]
  },
  {
    week: 7,
    title: "Visualisation & Power BI",
    focus: "Chart choice, dashboard design, star schema, DAX measures, publishing and RLS.",
    modules: ["viz", "powerbi"],
    hours: 12,
    tasks: [
      "Complete viz and Power BI modules",
      "Build a 3-page Power BI report on a public dataset",
      "Create 10 DAX measures (YoY, %, running total, rank)",
      "Apply a star schema: fact + 3 dimensions",
      "Publish to Power BI Service and set up a refresh"
    ]
  },
  {
    week: 8,
    title: "Interview sprint & portfolio",
    focus: "Mock interviews, story bank, take-home practice, and polishing the portfolio.",
    modules: ["story", "governance", "capstone"],
    hours: 14,
    tasks: [
      "Run 3 timed mock interviews in this dashboard",
      "Write 6 STAR stories (impact, conflict, failure, ambiguity, data quality, stakeholder)",
      "Complete a take-home: 5 SQL questions + 1 dashboard + 1-page memo",
      "Update CV with 3 quantified bullets",
      "Do the full 193-question flashcard deck — anything marked 'review' gets a second pass"
    ]
  }
];
