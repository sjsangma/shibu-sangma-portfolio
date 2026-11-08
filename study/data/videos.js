window.VIDEOS = window.VIDEOS || [];

window.VIDEOS.push(
{
  id: "v-intro",
  module: "foundations",
  kicker: "Foundations",
  title: "What data analysis actually is",
  minutes: 9,
  blurb: "The four types of analytics, what an analyst does all day, and the difference between analysis and reporting.",
  scenes: [
    {
      title: "Analysis is a decision machine",
      bullets: [
        "Data → information → decision → action",
        "The output is a decision, not a chart",
        "If nobody changes what they do, the analysis failed"
      ],
      narration: "Data analysis is the process of turning raw data into a decision. Notice the end of that sentence. The output is not a chart and it is not a number. The output is somebody doing something differently because of what you found. If a report is delivered and nobody changes a decision, the work did not land, no matter how good the query was.",
      viz: "<div class='viz-flow'><span>Data</span>→<span>Information</span>→<span>Decision</span>→<span>Action</span></div>"
    },
    {
      title: "Four types of analytics",
      bullets: [
        "Descriptive — what happened",
        "Diagnostic — why it happened",
        "Predictive — what will happen",
        "Prescriptive — what we should do"
      ],
      narration: "Analytics comes in four flavours, and they climb a ladder. Descriptive analytics tells you what happened: revenue was four hundred thousand dollars. Diagnostic asks why: sixty percent of the drop came from one region. Predictive estimates what will happen next, usually with a model. Prescriptive recommends an action under constraints. Most analyst jobs live in the first two, and the best analysts push into the third and fourth with simple, defensible methods rather than complex ones.",
      viz: "<div class='viz-ladder'><div>4. Prescriptive — what should we do?</div><div>3. Predictive — what will happen?</div><div>2. Diagnostic — why did it happen?</div><div>1. Descriptive — what happened?</div></div>"
    },
    {
      title: "A day in the job",
      bullets: [
        "60% wrangling and validating data",
        "25% answering questions with queries and notebooks",
        "15% communicating and building reports"
      ],
      narration: "Here is the honest time split. Roughly sixty percent of an analyst's day is finding, cleaning and validating data. Twenty five percent is the actual analysis: queries, notebooks, statistics. Fifteen percent is communication: writing the memo, building the dashboard, walking a stakeholder through it. Juniors expect the middle slice to dominate. It does not, and the people who get promoted are the ones who make the first and last slices faster and more reliable.",
      viz: "<div class='viz-bars'><div><span>Data wrangling</span><b style='width:60%'>60%</b></div><div><span>Analysis</span><b style='width:25%'>25%</b></div><div><span>Communication</span><b style='width:15%'>15%</b></div></div>"
    },
    {
      title: "Analysis vs reporting",
      bullets: [
        "Reporting: scheduled, stable, pre-defined questions",
        "Analysis: ad hoc, exploratory, new questions",
        "Dashboards are products; analyses are investigations"
      ],
      narration: "People confuse reporting with analysis. Reporting answers questions you already knew to ask, on a schedule, with stable definitions. Analysis starts when a question is new and the path is unknown. Both are valuable. A good analyst automates the reporting so that time is freed for the analysis. In interviews, saying you automated twelve recurring reports to spend more time on ad hoc investigation is a strong signal.",
      viz: "<div class='viz-grid2'><div><h4>Reporting</h4><p>Weekly. Known questions. Stable. Automated.</p></div><div><h4>Analysis</h4><p>Ad hoc. New questions. Exploratory. Judgement.</p></div></div>"
    },
    {
      title: "Your first ninety days",
      bullets: [
        "Week 1–2: learn the data model and the business metrics",
        "Week 3–6: take one recurring report and automate it",
        "Week 7–12: deliver one analysis that changes a decision"
      ],
      narration: "If you are starting a new analyst role, this is the plan. First two weeks: learn the schema, the metric definitions and who owns each system. Do not write clever queries yet. Weeks three to six: take one painful recurring report and automate it, which buys credibility and time. Weeks seven to twelve: find one question that matters to your manager and answer it end to end, with a recommendation and a number attached.",
      viz: "<div class='viz-timeline'><div>1–2 Learn the data</div><div>3–6 Automate one report</div><div>7–12 Ship one insight</div></div>"
    }
  ]
},
{
  id: "v-lifecycle",
  module: "foundations",
  kicker: "Foundations",
  title: "The analysis lifecycle, step by step",
  minutes: 10,
  blurb: "Six stages from question to decision, and the mistakes that happen at each one.",
  scenes: [
    {
      title: "Stage 1 — Frame the question",
      bullets: [
        "Who will act on this, and what will they do differently?",
        "What is the metric, population, time window?",
        "What would change your mind?"
      ],
      narration: "Everything starts with framing. Ask who will act on the answer and what decision they face. Then pin the metric, the population and the time window. Finally, ask what result would change their mind. If no result could, the analysis is theatre. A good framing sentence sounds like: should we shift budget from paid search to email, measured by incremental revenue over the next quarter.",
      viz: "<div class='viz-card'>Decision: reallocate Q1 budget<br/>Metric: incremental revenue per channel<br/>Window: 90 days</div>"
    },
    {
      title: "Stage 2 — Acquire and profile",
      bullets: [
        "Find the source of truth, not the easiest table",
        "Profile: shape, types, nulls, duplicates, ranges",
        "Reconcile against a known total"
      ],
      narration: "Next, get the data and profile it immediately. Shape, types, nulls, duplicates, ranges, distinct counts. Then reconcile against a number you already trust, like the finance system total or the dashboard the executives use. This reconciliation step is what stops you delivering a beautiful analysis of the wrong table. If your total is nine percent off, stop and resolve that before going further.",
      viz: "<div class='viz-table'><div>Rows 1,284,993</div><div>Nulls 0.4%</div><div>Duplicates 112</div><div>Recon +0.2%</div></div>"
    },
    {
      title: "Stage 3 — Clean, with a record",
      bullets: [
        "Fix types and dates first",
        "Decide per column: fix upstream, exclude, or impute",
        "Log every decision in the notebook"
      ],
      narration: "Cleaning is where analyses quietly go wrong. Fix types and dates first, because almost every join depends on them. Then decide per column: fix it upstream, exclude rows with a documented rule, or impute with a flag. Write each decision down in a markdown cell as you make it. Six months later, that log is the difference between a reproducible result and a mystery.",
      viz: "<div class='viz-log'>- 1,204 rows: region null → excluded, logged<br/>- dates parsed to UTC<br/>- amounts: refunds negated</div>"
    },
    {
      title: "Stage 4 — Explore",
      bullets: [
        "Univariate: distribution, spread, tail",
        "Bivariate: segments, correlation, time",
        "Look for the surprising cell, then verify it"
      ],
      narration: "Now explore. One variable at a time first, to understand shape and spread and where the tails are. Then two at a time: segment by segment, correlation, and change over time. Your goal is to find the one surprising cell that explains most of the variation. Then immediately try to destroy it: is it a small sample, a data bug, a definition change? Findings that survive that attack are the ones worth presenting.",
      viz: "<div class='viz-grid2'><div><h4>Univariate</h4><p>Histogram, boxplot, value counts</p></div><div><h4>Bivariate</h4><p>Groupby means, scatter, time series</p></div></div>"
    },
    {
      title: "Stage 5 — Validate",
      bullets: [
        "Sanity-check totals and edge cases",
        "Compare with an independent source",
        "Ask a colleague to try to break it"
      ],
      narration: "Before you present, validate. Do the totals make sense against last month and last year? Do the edge cases behave, like zero-amount orders and future dates? Can you compare the headline number with an independent source? Finally, ask a colleague to try to break it. A five-minute review catches the denominator mistake that would have cost you the room.",
      viz: "<div class='viz-checks'>✓ totals reconcile<br/>✓ no future dates<br/>✓ peer reviewed</div>"
    },
    {
      title: "Stage 6 — Communicate and follow up",
      bullets: [
        "Lead with the answer and the impact",
        "One chart per message",
        "Track whether the decision was made"
      ],
      narration: "Finally, communicate. Lead with the answer and size it in money, users or time. One chart per message, annotated at the point of evidence. End with a specific ask and an owner. Then follow up: did the decision happen, and did the result move? That last loop is what turns an analyst into someone the business trusts with bigger questions.",
      viz: "<div class='viz-card'>Answer: restore paid search budget<br/>Impact: +$250k annualised<br/>Owner: Growth · Review in 2 weeks</div>"
    }
  ]
},
{
  id: "v-sql-joins",
  module: "sql",
  kicker: "SQL",
  title: "Joins without fear",
  minutes: 11,
  blurb: "INNER, LEFT, anti-joins, fan-out and the duplicate-row bug that ruins analyses.",
  scenes: [
    {
      title: "Why joins go wrong",
      bullets: [
        "Wrong join type changes the population",
        "Many-to-many multiplies rows silently",
        "NULL keys never match"
      ],
      narration: "Joins are where most SQL interview answers fall apart, and where most production numbers break. Three failure modes. First, the wrong join type silently changes your population. Second, a many-to-many relationship multiplies rows, so revenue doubles. Third, null keys never match anything, so the left join produces nulls that look like missing data but are actually missing keys.",
      viz: "<div class='viz-warn'>customers 1 → N orders ⇒ joining both can fan out</div>"
    },
    {
      title: "INNER vs LEFT",
      bullets: [
        "INNER: only matched rows on both sides",
        "LEFT: all left rows, nulls where no match",
        "Always check row count before and after"
      ],
      narration: "Inner join keeps only rows that match on both sides. Left join keeps every row from the left table and fills nulls where there is no match. The practical rule: if you are enriching a fact table, use left join and then count nulls to see how much did not match. And always compare the row count before and after the join. If it grew, you have a fan-out and your sums are now wrong.",
      viz: "<pre><code>SELECT COUNT(*) FROM orders;                 -- 120,443\nSELECT COUNT(*) FROM orders o\nJOIN customers c ON c.id = o.customer_id;    -- 120,443 ✓</code></pre>"
    },
    {
      title: "The anti-join",
      bullets: [
        "Find rows with no match: LEFT JOIN … WHERE right.key IS NULL",
        "Or NOT EXISTS, usually faster and clearer",
        "Perfect for churn, orphan records, missing mappings"
      ],
      narration: "The anti-join is the most underused pattern in analyst SQL. You use it to find rows that have no counterpart: customers with no orders, orders with no product mapping, users who never activated. Write it with left join and where the right key is null, or with not exists. In interviews, offering an anti-join when asked about churned customers shows you think in sets rather than loops.",
      viz: "<pre><code>SELECT c.id\nFROM customers c\nWHERE NOT EXISTS (\n  SELECT 1 FROM orders o\n  WHERE o.customer_id = c.id\n    AND o.order_date &gt;= '2026-01-01'\n);</code></pre>"
    },
    {
      title: "Fan-out detection",
      bullets: [
        "Check the granularity of each table first",
        "Aggregate before joining when necessary",
        "Compare SUM before and after the join"
      ],
      narration: "Before any join, ask what one row means in each table. Orders is one row per order. Order items is one row per line item. If you join them directly, each order repeats once per item and your order count inflates. The fix is to aggregate the item table to order level first, then join. And verify by summing revenue before and after. If the total changed, the join was wrong.",
      viz: "<pre><code>WITH items AS (\n  SELECT order_id, SUM(qty*price) AS line_total\n  FROM order_items GROUP BY order_id\n)\nSELECT o.id, o.amount, i.line_total\nFROM orders o LEFT JOIN items i USING (order_id);</code></pre>"
    },
    {
      title: "Interview drill",
      bullets: [
        "State the grain out loud before writing",
        "Say which join type and why",
        "Mention the row-count check"
      ],
      narration: "In an interview, narrate your reasoning. Say the grain: one row per customer per month. Say the join type and why: left join because we must keep customers with zero orders. Then say how you would verify: compare row counts and check the total against the source. That commentary is worth as much as the query, because it shows you have debugged joins in production.",
      viz: "<div class='viz-checks'>✓ grain stated<br/>✓ join type justified<br/>✓ row count verified</div>"
    }
  ]
},
{
  id: "v-sql-window",
  module: "sql",
  kicker: "SQL",
  title: "Window functions in 10 minutes",
  minutes: 12,
  blurb: "ROW_NUMBER, RANK, LAG, running totals and the frame clause — the senior-level SQL topic.",
  scenes: [
    {
      title: "What a window is",
      bullets: [
        "Aggregate without collapsing rows",
        "PARTITION BY = group, ORDER BY = sequence",
        "Evaluated after WHERE, before ORDER BY"
      ],
      narration: "A window function computes across a set of rows while keeping every row in the output. You define the set with partition by, which is like group by but without collapsing, and the sequence with order by. This is how you answer questions like rank customers within each region, or compare this month to last month, without a self-join. Window functions run after where and before the final order by.",
      viz: "<pre><code>SELECT region, customer_id, revenue,\n       RANK() OVER (PARTITION BY region\n                    ORDER BY revenue DESC) AS rk\nFROM customer_totals;</code></pre>"
    },
    {
      title: "ROW_NUMBER vs RANK vs DENSE_RANK",
      bullets: [
        "ROW_NUMBER: 1,2,3,4 — always unique",
        "RANK: 1,2,2,4 — gaps after ties",
        "DENSE_RANK: 1,2,2,3 — no gaps"
      ],
      narration: "These three differ only in how they handle ties. Row number always produces unique numbers, so it is non-deterministic when values tie unless you add a tiebreaker. Rank leaves gaps after ties: one, two, two, four. Dense rank does not: one, two, two, three. Use row number for deduplication, dense rank for top-N by value where you want distinct values, and rank when positions matter.",
      viz: "<div class='viz-table'><div>Values 100, 90, 90, 80</div><div>ROW_NUMBER 1,2,3,4</div><div>RANK 1,2,2,4</div><div>DENSE_RANK 1,2,2,3</div></div>"
    },
    {
      title: "Deduplication",
      bullets: [
        "Classic: keep the latest row per key",
        "ROW_NUMBER over key ordered by loaded_at DESC",
        "Filter rn = 1 in an outer query"
      ],
      narration: "The most common real-world use is deduplication. Number rows within each key, ordered by the load timestamp descending, then keep only row one. This pattern appears in almost every staging model you will ever write, and it is a favourite interview question because it tests whether you understand that you cannot filter on a window function in the same query level.",
      viz: "<pre><code>WITH ranked AS (\n  SELECT *, ROW_NUMBER() OVER (\n    PARTITION BY email ORDER BY loaded_at DESC) rn\n  FROM raw_users\n)\nSELECT * FROM ranked WHERE rn = 1;</code></pre>"
    },
    {
      title: "LAG and LEAD",
      bullets: [
        "Compare a row to the previous one",
        "Month-over-month change without self-joins",
        "Watch the first row: LAG returns NULL"
      ],
      narration: "Lag looks backwards one row, lead looks forwards. This is how you compute month-over-month growth without a self-join. The catch is the boundaries: the first row in each partition has no previous row, so lag returns null. Handle that with coalesce or by filtering in a later step, and always check you have a complete time series before computing deltas, or you will compare March to January and call it growth.",
      viz: "<pre><code>SELECT month, revenue,\n       revenue - LAG(revenue) OVER (ORDER BY month) AS delta,\n       ROUND(100.0 * (revenue - LAG(revenue) OVER (ORDER BY month))\n             / LAG(revenue) OVER (ORDER BY month), 1) AS pct\nFROM monthly;</code></pre>"
    },
    {
      title: "Running totals and the frame",
      bullets: [
        "ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW",
        "Default frame differs by database — be explicit",
        "Moving averages need a fixed window"
      ],
      narration: "A running total is a window with a frame. Rows between unbounded preceding and current row means from the start of the partition up to this row. Be explicit about the frame, because the default differs between databases. For a seven-day moving average, use rows between six preceding and current row. And remember the frame applies to the order by inside the window, not to the outer query.",
      viz: "<pre><code>SUM(revenue) OVER (\n  PARTITION BY region ORDER BY d\n  ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cum_rev,\nAVG(revenue) OVER (ORDER BY d\n  ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS ma7</code></pre>"
    },
    {
      title: "Interview framing",
      bullets: [
        "\"Rank the top 3 products per category\"",
        "\"Find the second purchase of each customer\"",
        "\"Compute 30-day retention\""
      ],
      narration: "Three window-function questions come up constantly. Top three products per category: row number partitioned by category. Second purchase per customer: row number partitioned by customer ordered by date, filter two. Thirty-day retention: join on first order, then bucket the difference in days. Practise these three until you can write them without hesitation, because at least one will appear in a live screen.",
      viz: "<div class='viz-card'>Top-N → ROW_NUMBER<br/>Nth event → ROW_NUMBER + filter<br/>Retention → date diff buckets</div>"
    }
  ]
},
{
  id: "v-pandas",
  module: "pandas",
  kicker: "Python",
  title: "pandas groupby and merge, properly",
  minutes: 12,
  blurb: "Split-apply-combine, named aggregations, merges with validation, and pivot tables.",
  scenes: [
    {
      title: "Split, apply, combine",
      bullets: [
        "groupby splits rows into groups",
        "agg applies a function per group",
        "Result has one row per group"
      ],
      narration: "Group by is split, apply, combine. Pandas splits the rows into groups by key, applies the function to each group, and combines the results into a new frame with one row per group. Once that mental model is solid, most pandas questions become easy. The output index is the group key, which is why people call reset index afterwards, or pass as index equals false.",
      viz: "<pre><code>df.groupby('region')['amount'].mean()\ndf.groupby('region', as_index=False)['amount'].mean()</code></pre>"
    },
    {
      title: "Named aggregation",
      bullets: [
        "Multiple metrics in one pass",
        "Name output columns explicitly",
        "Avoid chained .agg().rename()"
      ],
      narration: "Named aggregation gives you several metrics in a single pass with clean column names. Instead of aggregating then renaming, you pass keyword arguments where the name is the output column and the value is a tuple of source column and function. This is faster, clearer, and it will impress anyone reviewing your notebook. Add a count column always, so readers can see the sample size behind each rate.",
      viz: "<pre><code>df.groupby('region').agg(\n    n=('order_id','nunique'),\n    revenue=('amount','sum'),\n    aov=('amount','mean'),\n    first=('date','min'),\n).round(2)</code></pre>"
    },
    {
      title: "Merging like a SQL analyst",
      bullets: [
        "how='left' keeps all left rows",
        "validate='one_to_many' catches fan-out",
        "Check .shape and nulls after merge"
      ],
      narration: "Pandas merge is SQL join, and it has a feature SQL lacks: the validate argument. Set validate to one to many, many to one, or one to one, and pandas raises an error if the relationship is not what you claimed. That single argument prevents the silent fan-out that ruins revenue totals. Always check the shape before and after, and count nulls in the new columns.",
      viz: "<pre><code>orders.merge(customers, on='customer_id',\n             how='left', validate='many_to_one')</code></pre>"
    },
    {
      title: "Pivot tables",
      bullets: [
        "Rows × columns × values",
        "pivot_table handles duplicates with aggfunc",
        "Reset the index for export"
      ],
      narration: "A pivot table reshapes long data into a grid: regions down the side, months across the top, revenue in the cells. Use pivot table rather than pivot when there may be duplicate combinations, because pivot table takes an aggregate function. Then reset the index if you plan to export the result, since a MultiIndex does not flatten neatly into a spreadsheet.",
      viz: "<pre><code>pd.pivot_table(df, index='region', columns='month',\n               values='amount', aggfunc='sum',\n               fill_value=0)</code></pre>"
    },
    {
      title: "Time series basics",
      bullets: [
        "Parse dates at load: parse_dates=['date']",
        "set_index then resample for any frequency",
        "rolling for smoothing; min_periods matters"
      ],
      narration: "Time series work starts with dates. Parse at load with parse dates, set the date as the index, and then resample to any frequency: daily, weekly, monthly. Rolling windows smooth noise; set min periods so the first days are not computed from one observation. This combination answers most of the daily-grain questions you will get in a take-home, and it reads well in a notebook.",
      viz: "<pre><code>s = df.set_index('date')['signups'].resample('D').sum()\ns.rolling(7, min_periods=1).mean()</code></pre>"
    }
  ]
}
);
