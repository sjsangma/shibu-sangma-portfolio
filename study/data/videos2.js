window.VIDEOS = window.VIDEOS || [];

window.VIDEOS.push(
{
  id: "v-stats",
  module: "stats",
  kicker: "Statistics",
  title: "p-values, confidence and A/B tests",
  minutes: 13,
  blurb: "What significance really means, why peeking ruins tests, and how to size an experiment.",
  scenes: [
    {
      title: "The core question",
      bullets: [
        "Is the difference real, or could it be noise?",
        "Null hypothesis: no difference",
        "p-value: probability of this data if null were true"
      ],
      narration: "Every statistical test answers one question: is the difference I see real, or could it plausibly be random noise? The null hypothesis says there is no difference. The p-value is the probability of seeing data at least this extreme if the null were true. It is not the probability that the null is true, and it is not the probability that your result is wrong. Getting that distinction right is the single most common screening point in analyst interviews.",
      viz: "<div class='viz-card'>p = 0.03 means: 3% chance of this data under the null<br/>NOT: 97% chance the effect is real</div>"
    },
    {
      title: "Confidence intervals beat p-values",
      bullets: [
        "A 95% CI is a range of plausible effects",
        "Width shows precision",
        "Report the effect size with the interval"
      ],
      narration: "A confidence interval is more useful than a p-value. It gives a range of plausible effect sizes, so a reader can see both direction and precision. Conversion up one point with an interval from minus zero point two to plus two point two is very different from the same point estimate with an interval from zero point eight to one point two, even though both might be significant. Always report the effect and the interval, not just the star.",
      viz: "<div class='viz-bars'><div><span>Tight CI ±0.2pp</span><b style='width:30%'></b></div><div><span>Wide CI ±2.2pp</span><b style='width:95%'></b></div></div>"
    },
    {
      title: "Power and sample size",
      bullets: [
        "Power = chance of detecting a real effect",
        "80% power is the usual minimum",
        "MDE drives sample size, not the reverse"
      ],
      narration: "Power is the probability that your test detects an effect that truly exists. The usual minimum is eighty percent. Sample size is driven by the minimum detectable effect you care about: if you want to detect a half-point lift, you need far more traffic than for a five-point lift. Calculate this before launching, not after you find a non-significant result, because you cannot rescue an underpowered test with more analysis.",
      viz: "<pre><code>n ≈ 16 × p(1-p) / MDE²   per arm (rough)\np = 0.10, MDE = 0.005 → ~576,000 per arm</code></pre>"
    },
    {
      title: "The peeking problem",
      bullets: [
        "Checking daily and stopping at significance inflates false positives",
        "Fix the horizon in advance, or use sequential methods",
        "Novelty effects fade — run at least two weeks"
      ],
      narration: "If you check a test every day and stop the moment it turns significant, your false positive rate is not five percent, it is much higher. The fix is to fix the horizon in advance, or to use a method designed for sequential testing. Then run long enough to cover a full week cycle and to let novelty effects fade, because the first two days of a change almost always look better than the steady state.",
      viz: "<div class='viz-warn'>p=0.04 on day 3 of 14 — do not stop</div>"
    },
    {
      title: "Reporting an experiment",
      bullets: [
        "Effect size, interval, p, and n per arm",
        "Guardrail metrics: no harm elsewhere",
        "Decision: ship, iterate, or stop"
      ],
      narration: "A complete experiment report has the effect size, the confidence interval, the p-value and the sample size per arm. Then guardrails: latency, refunds, support contacts. Then a plain decision: ship, iterate, or stop. If the result is flat, say so clearly and state what effect the test could have detected. A trustworthy null result saves the company from shipping a change that does nothing.",
      viz: "<div class='viz-card'>Variant B: +1.2pp (95% CI +0.3 to +2.1), p=0.01, n=48k/arm<br/>Guardrails: flat ✓</div>"
    },
    {
      title: "Regression intuition",
      bullets: [
        "Coefficient = change in y per unit of x, holding others fixed",
        "R² = share of variance explained, not causation",
        "Check residual plots and multicollinearity"
      ],
      narration: "Regression gives you a coefficient per variable, holding the others fixed. That holding fixed part is why regression is more credible than correlation for observational questions, and also why collinear variables confuse the interpretation. R squared tells you how much variance the model explains; it never implies causation. Before trusting the coefficients, look at residual plots for patterns and check that no two predictors are near-duplicates.",
      viz: "<pre><code>revenue ~ discount + tenure + region\ncoef(discount) = -2.4  → each extra 1% discount ⇒ -2.4 revenue units</code></pre>"
    }
  ]
},
{
  id: "v-charts",
  module: "viz",
  kicker: "Visualisation",
  title: "Choosing the right chart",
  minutes: 9,
  blurb: "Question → chart mapping, why pie charts fail, and the five formatting rules that make charts readable.",
  scenes: [
    {
      title: "Chart follows question",
      bullets: [
        "Comparison → bar",
        "Trend → line",
        "Distribution → histogram or box",
        "Relationship → scatter",
        "Part of whole → stacked bar (rarely pie)"
      ],
      narration: "Pick the chart from the question, not from the chart menu. Comparing categories: bar chart, sorted by value. Change over time: line chart with the x axis in time order. Distribution: histogram, or a box plot when comparing several groups. Relationship between two measures: scatter. Composition: a stacked bar is nearly always better than a pie, because humans compare lengths more accurately than angles.",
      viz: "<div class='viz-grid2'><div><h4>Compare</h4><p>Bar, sorted</p></div><div><h4>Trend</h4><p>Line, time axis</p></div><div><h4>Distribution</h4><p>Histogram, box</p></div><div><h4>Relationship</h4><p>Scatter</p></div></div>"
    },
    {
      title: "Five formatting rules",
      bullets: [
        "Title states the finding, not the metric name",
        "Label the units once; drop decimal noise",
        "Sort bars; do not sort by alphabet",
        "Direct-label instead of a legend where possible",
        "Grey the context, colour the point"
      ],
      narration: "Five rules cover most chart quality. One: the title states the finding, not the metric. Two: units appear once and decimals are trimmed to what matters. Three: sort bars by value, never alphabetically, unless the categories have a natural order. Four: label series directly rather than forcing the eye to a legend. Five: make the context grey and colour only the thing you want the reader to notice.",
      viz: "<div class='viz-card'>✗ 'Revenue by region'<br/>✓ 'North drives 61% of October decline'</div>"
    },
    {
      title: "Truncated axes and other lies",
      bullets: [
        "Bar charts must start at zero",
        "Line charts may zoom, but say so",
        "Dual axes invent correlation",
        "3D and shadows distort"
      ],
      narration: "A bar chart must start at zero, because the bar length encodes the value. Truncating the axis turns a one percent difference into a visual cliff. Line charts may start away from zero when you are showing change over a narrow range, but say so in the subtitle. Avoid dual axes, which invite the reader to see a relationship that may not exist. And avoid 3D, shadows and gradients: they change size without changing data.",
      viz: "<div class='viz-warn'>Bar axis from 90% → a 2% gap looks like a collapse</div>"
    },
    {
      title: "Dashboards are arguments",
      bullets: [
        "Top strip: the three numbers that matter",
        "Middle: trend and one driver breakdown",
        "Bottom: detail table for the curious",
        "Every element answers a question someone asks weekly"
      ],
      narration: "A dashboard is an argument, not a data dump. The top strip holds the three numbers that matter this week with change versus last period. The middle holds the trend and one breakdown by the driver people argue about. The bottom holds detail for anyone who wants to check. If an element is not answering a question someone asks weekly, remove it. Fewer, better elements is how dashboards get used.",
      viz: "<div class='viz-stack'><div>KPI strip</div><div>Trend + driver</div><div>Detail table</div></div>"
    },
    {
      title: "Accessibility and colour",
      bullets: [
        "Do not encode meaning by colour alone",
        "Check contrast; avoid red/green only",
        "Use a sequential ramp for magnitude"
      ],
      narration: "Colour should never be the only carrier of meaning, because about one in twelve men has a colour vision deficiency. Add labels or position. Keep contrast high enough to read on a projector. For magnitude, use a sequential ramp rather than a rainbow. And avoid red and green as the only distinction between good and bad. These choices are noticed in interviews because they show you think about the reader.",
      viz: "<div class='viz-swatches'><i style='background:#6d5efc'></i><i style='background:#22d3ee'></i><i style='background:#f59e0b'></i><i style='background:#34d399'></i><i style='background:#fb7185'></i></div>"
    }
  ]
},
{
  id: "v-powerbi",
  module: "powerbi",
  kicker: "Power BI",
  title: "Star schema and DAX essentials",
  minutes: 12,
  blurb: "Why the star schema exists, filter direction, and the seven DAX measures every analyst needs.",
  scenes: [
    {
      title: "Why star schema",
      bullets: [
        "Fact tables: events at a grain, numeric",
        "Dimension tables: descriptive attributes",
        "Filters flow one way: dimension → fact"
      ],
      narration: "A star schema separates measurable events from descriptive context. The fact table holds one row per event with numbers and foreign keys. Dimension tables hold the attributes you filter and group by. This shape exists because it makes filters predictable: they flow from the one side to the many side. One big flat table works until you have twenty columns repeating the same product name and your file is a hundred megabytes too large.",
      viz: "<div class='viz-star'><div>dim_date</div><div>dim_product</div><div>fact_sales</div><div>dim_customer</div></div>"
    },
    {
      title: "Relationships and filter direction",
      bullets: [
        "One-to-many from dimension to fact",
        "Single direction by default — keep it",
        "Bi-directional filters can create ambiguity"
      ],
      narration: "Set relationships as one to many, from the dimension to the fact, with single-direction filtering. This is the default for good reason: it makes the filter path unambiguous. Bi-directional filtering is occasionally necessary, but it creates ambiguity when there are multiple paths between tables, and Power BI will start disabling relationships to compensate. If you feel you need it, the model probably needs a bridge table instead.",
      viz: "<div class='viz-warn'>dim_product 1 ──▶ many fact_sales ✓<br/>fact_sales ◀──▶ dim_product (both) ✗</div>"
    },
    {
      title: "Measures vs calculated columns",
      bullets: [
        "Column: computed per row, stored, increases file size",
        "Measure: computed at query time in filter context",
        "Use measures for anything aggregated"
      ],
      narration: "A calculated column is computed once per row, stored in the model, and grows your file. A measure is computed at query time, respecting whatever filters the visual has applied. Use columns only when you need a row-level value that will be sliced, such as a price band. Use measures for every aggregate. A common mistake is building revenue as a column and then summing it, which is fine but wasteful, and breaks as soon as the grain changes.",
      viz: "<div class='viz-grid2'><div><h4>Column</h4><p>Row-level. Stored. Sliced by.</p></div><div><h4>Measure</h4><p>Aggregate. Query-time. Filter-aware.</p></div></div>"
    },
    {
      title: "Six DAX measures",
      bullets: [
        "Total revenue",
        "Year to date",
        "Same period last year",
        "Year-over-year %",
        "Share of total",
        "Rank within category"
      ],
      narration: "Six measures cover most business reporting. Total revenue is a simple sum. Year to date uses total year to date. Same period last year uses same period last year. Year over year percent divides the difference by last year. Share of total removes the category filter with all and divides by the unfiltered total. Rank within category uses rankx over the category values. Learn these six and you can build ninety percent of a commercial dashboard.",
      viz: "<pre><code>Revenue = SUM(fact_sales[amount])\nRevenue YTD = TOTALYTD([Revenue], dim_date[date])\nRevenue LY  = CALCULATE([Revenue], SAMEPERIODLASTYEAR(dim_date[date]))\nYoY %       = DIVIDE([Revenue] - [Revenue LY], [Revenue LY])\nShare       = DIVIDE([Revenue], CALCULATE([Revenue], ALL(dim_product)))\nRank        = RANKX(ALL(dim_product[category]), [Revenue])</code></pre>"
    },
    {
      title: "Performance quick wins",
      bullets: [
        "Remove unused columns and high-cardinality text",
        "Star schema over wide flat tables",
        "Avoid iterators over large fact tables",
        "Use the performance analyzer before optimising"
      ],
      narration: "Most slow reports come from the model, not the visuals. Remove columns nobody uses, especially long text and high-cardinality identifiers. Prefer a star schema over a wide table. Avoid iterators like sumx over millions of fact rows in a measure if a simple sum works. And measure before optimising: the performance analyzer tells you which visual and which query is slow, so you do not rewrite the model guessing.",
      viz: "<div class='viz-checks'>✓ slim model<br/>✓ star schema<br/>✓ measured, not guessed</div>"
    }
  ]
},
{
  id: "v-story",
  module: "story",
  kicker: "Communication",
  title: "Turning findings into decisions",
  minutes: 10,
  blurb: "The insight ladder, the one-page memo, and how to survive a hostile question.",
  scenes: [
    {
      title: "Observation → insight → recommendation",
      bullets: [
        "Observation: conversion is 3.1%",
        "Insight: mobile is 1.4pp lower and 68% of traffic",
        "Recommendation: fix checkout, worth ~$95k, 3 weeks"
      ],
      narration: "There are three levels and most junior work stops at the first. An observation is a number. An insight adds a comparison, a cause and a size. A recommendation adds an action with an owner and a cost. When you present, always climb to level three, even if the recommendation is simply to investigate further. Executives pay for the third level.",
      viz: "<div class='viz-ladder'><div>Recommendation</div><div>Insight</div><div>Observation</div></div>"
    },
    {
      title: "Answer first",
      bullets: [
        "Headline in the first sentence",
        "Three supporting points, each with a number",
        "Evidence after, appendix for method"
      ],
      narration: "Put the answer first. One sentence with the finding and the impact. Then three supporting points, each with a number. Then evidence, then an appendix with the method. This is the pyramid principle, and it exists because decision makers read the first line and skim the rest. If your recommendation appears on slide nine, it will not be acted on.",
      viz: "<div class='viz-stack'><div>Answer</div><div>3 reasons</div><div>Evidence</div><div>Appendix</div></div>"
    },
    {
      title: "The one-page memo",
      bullets: [
        "Question, Answer, Evidence, Impact, Action, Caveats",
        "Six bold labels, under 300 words",
        "Caveats build trust, not doubt"
      ],
      narration: "The one-page memo is the highest-leverage artefact in analysis. Six bold labels: question, answer, evidence, impact, action, caveats. Under three hundred words. The caveats section is not a weakness; it is what makes the rest believable, because it shows you know where the analysis could fail. Leaders trust analysts who state limits before being asked.",
      viz: "<div class='viz-card'>**Question** Why did October revenue fall?<br/>**Answer** Paid search cut drove 61% of it.</div>"
    },
    {
      title: "Hostile questions",
      bullets: [
        "Repeat the question, buy two seconds",
        "Reconcile definitions before defending",
        "Say 'I don't know, I'd check X' when true"
      ],
      narration: "When someone challenges a number, repeat the question back. That buys two seconds and confirms you understood. Then reconcile definitions before defending anything, because most disagreements are about filters and date ranges. If you genuinely do not know, say so and name the exact check you would run. Fabricating certainty is the fastest way to lose a room permanently.",
      viz: "<div class='viz-card'>\"Good question — let's check we're using the same definition.\"</div>"
    },
    {
      title: "Measure the impact",
      bullets: [
        "Follow up: was the decision made?",
        "Did the metric move as predicted?",
        "Record the outcome with the analysis"
      ],
      narration: "The last step separates good analysts from trusted ones: follow up. Did the decision happen? Did the metric move by roughly what you predicted? Record the outcome next to the analysis. Over a year you build a track record of predictions with known accuracy, which is far more persuasive than any single chart, and it makes your next recommendation much easier to sell.",
      viz: "<div class='viz-checks'>✓ decision made<br/>✓ predicted +0.6pp, actual +0.5pp<br/>✓ logged</div>"
    }
  ]
},
{
  id: "v-interview",
  module: "story",
  kicker: "Career",
  title: "Cracking the data analyst interview",
  minutes: 14,
  blurb: "The five rounds, the questions that repeat, and how to structure every answer.",
  scenes: [
    {
      title: "The five rounds",
      bullets: [
        "Recruiter screen — fit and salary",
        "SQL screen — 2–4 queries, live or take-home",
        "Case or product — metric design, diagnosis",
        "Technical depth — Python, stats, BI tool",
        "Behavioural — STAR stories with numbers"
      ],
      narration: "Most analyst processes have five rounds. A recruiter screen about fit and salary. A SQL screen, either live or take-home, with two to four queries. A case round about metric design or diagnosing a change. A technical depth round on Python, statistics or your BI tool. And a behavioural round with stories about real work. Prepare specifically for each, because the failure modes are different.",
      viz: "<div class='viz-timeline'><div>Screen</div><div>SQL</div><div>Case</div><div>Technical</div><div>Behavioural</div></div>"
    },
    {
      title: "The SQL screen",
      bullets: [
        "Clarify the grain and the output shape first",
        "Write the simplest correct query",
        "Narrate trade-offs; mention indexes and row counts"
      ],
      narration: "In the SQL screen, clarify before typing. What is one row in the output? Which tables? Any filters on status? Then write the simplest correct query, and say why you chose each join. If there is a performance angle, mention it briefly. Interviewers are not only checking syntax, they are checking whether you would write something a colleague could maintain.",
      viz: "<div class='viz-checks'>✓ grain<br/>✓ joins justified<br/>✓ edge cases mentioned</div>"
    },
    {
      title: "The case round",
      bullets: [
        "Structure: clarify → metric tree → hypotheses → data check → recommendation",
        "Always decompose: users × frequency × value",
        "Name what data you would pull and why"
      ],
      narration: "Case rounds test structure under ambiguity. Clarify the goal and the time horizon. Build a metric tree: revenue equals users times frequency times average order value. Then list hypotheses for which component moved, and say which data you would pull to test each one, cheapest first. Finish with a recommendation and what would change it. Say the structure out loud so the interviewer can follow.",
      viz: "<div class='viz-card'>Revenue = Users × Frequency × AOV<br/>Each terms splits into testable hypotheses</div>"
    },
    {
      title: "Behavioural with numbers",
      bullets: [
        "Six stories cover everything",
        "Situation, Task, Action, Result — result has a number",
        "Include one failure and one disagreement"
      ],
      narration: "Six stories cover almost every behavioural question: biggest impact, a conflict, a failure, ambiguity, a data quality crisis, and influencing without authority. Use situation, task, action, result, and make the result a number. Include a real failure with what you changed afterwards; interviewers distrust candidates whose every story succeeds.",
      viz: "<div class='viz-grid2'><div>Impact</div><div>Conflict</div><div>Failure</div><div>Ambiguity</div><div>Data quality</div><div>Influence</div></div>"
    },
    {
      title: "Questions you should ask",
      bullets: [
        "What decisions does this team influence?",
        "How is data quality handled — who owns it?",
        "What does success look like at 6 months?",
        "Which tool is the bottleneck today?"
      ],
      narration: "Your questions signal seniority. Ask what decisions the team actually influences, so you learn whether analysts are trusted or treated as report writers. Ask who owns data quality. Ask what success looks like at six months. Ask which tool is currently the bottleneck. These questions tell you whether the role is a good fit and they signal that you have worked in a real data environment.",
      viz: "<div class='viz-card'>\"What decision did this team change last quarter?\"</div>"
    },
    {
      title: "The 48-hour plan",
      bullets: [
        "Day 1: SQL drills + 20 flashcards",
        "Day 1: rehearse 3 STAR stories aloud",
        "Day 2: one timed mock interview",
        "Day 2: re-read your own project write-ups"
      ],
      narration: "In the last two days before an interview, do not learn a new tool. Drill SQL problems until they are automatic. Run twenty flashcards from the harder topics. Rehearse three stories out loud, because speaking is different from thinking. Do one timed mock interview in this dashboard. Then re-read your own project write-ups so you can talk about them with specifics. Confidence comes from repetition, not from one more tutorial.",
      viz: "<div class='viz-timeline'><div>SQL drills</div><div>Stories aloud</div><div>Mock interview</div><div>Projects</div></div>"
    }
  ]
}
);
