window.CURRICULUM = window.CURRICULUM || [];

window.CURRICULUM.push({
  id: "capstone",
  track: "core",
  icon: "🏁",
  title: "Capstone: Portfolio & Mock Project",
  blurb: "Build the three artefacts recruiters actually open: a SQL case study, an EDA notebook, and a Power BI dashboard — plus the readout that ties them together.",
  lessons: [
    {
      id: "c1",
      title: "The capstone brief",
      minutes: 14,
      lede: "One dataset, three deliverables, one decision. Every hiring manager is looking for proof that you can turn a messy file into a recommendation.",
      body: `
<p>Pick a public dataset with at least three tables and roughly 100k rows. Good sources: a Kaggle e-commerce or ride-hailing dump, a city open-data portal, or a company's public transaction log. The dataset matters far less than the discipline you show around it.</p>

<h3>The scenario you will present</h3>
<blockquote>"You are the first analyst at <em>[company]</em>. Growth has slowed for two quarters. Leadership wants to know where the next 10% of revenue can come from, and what to stop doing."</blockquote>

<h3>Three deliverables</h3>
<table>
<tr><th>Artefact</th><th>What it proves</th><th>Acceptance test</th></tr>
<tr><td>SQL case study (<code>analysis.sql</code>)</td><td>Joins, aggregation, windows, dedupe</td><td>Reruns end to end, no manual steps</td></tr>
<tr><td>EDA notebook (<code>eda.ipynb</code>)</td><td>Profiling, cleaning decisions, segment discovery</td><td>Every chart answers a stated question</td></tr>
<tr><td>Dashboard (<code>report.pbix</code> or a 3-page PDF)</td><td>Star schema, DAX, layout discipline</td><td>Answers three questions in under 10 seconds</td></tr>
<tr><td>One-page readout (<code>memo.pdf</code>)</td><td>Answer-first communication</td><td>Question, Answer, Evidence, Impact, Action</td></tr>
</table>

<h3>Rules that make it credible</h3>
<ul>
  <li>State the grain of every table in one sentence — "one row per order line".</li>
  <li>Reconcile row counts and revenue totals before and after every join.</li>
  <li>Document each cleaning decision with the number of rows affected.</li>
  <li>Never say "insight" without a comparison: versus last period, versus another segment, or versus a target.</li>
  <li>Put the limitation section <em>in</em> the memo, not in an appendix nobody reads.</li>
</ul>

<div class="callout interview"><strong>Interview classic:</strong> "Walk me through a project end to end." Answer with the decision, the data, the two hardest problems you solved, and the measured outcome — in that order, under two minutes.</div>`
    },
    {
      id: "c2",
      title: "Writing the SQL case study",
      minutes: 28,
      lede: "A readable, reproducible SQL script is the fastest way to prove competence. Structure beats cleverness.",
      body: `
<h3>File layout</h3>
<pre><code>-- 00_checks.sql     row counts, key uniqueness, date range
-- 01_clean.sql      dedupe, type casts, exclude test orders
-- 02_metrics.sql    revenue, buyers, AOV, repeat rate by month
-- 03_segments.sql   region x channel x category breakdown
-- 04_drivers.sql    which segment moved, rate vs mix
-- 05_export.sql     final tables for the notebook</code></pre>

<h3>Start with checks, not conclusions</h3>
<pre><code>SELECT COUNT(*) AS rows, COUNT(DISTINCT order_id) AS orders,
       MIN(order_date) AS first_dt, MAX(order_date) AS last_dt
FROM raw_orders;

SELECT COUNT(*) FROM (
  SELECT order_id FROM raw_orders GROUP BY order_id HAVING COUNT(*) &gt; 1
) d;   -- must be 0</code></pre>

<h3>The decomposition query you will be asked about</h3>
<pre><code>WITH monthly AS (
  SELECT DATE_TRUNC('month', order_date) AS m,
         COUNT(DISTINCT order_id)   AS orders,
         COUNT(DISTINCT customer_id) AS buyers,
         SUM(amount)                 AS revenue
  FROM clean_orders
  GROUP BY 1
)
SELECT m, revenue,
       orders,
       ROUND(orders::numeric / buyers, 2)      AS freq,
       ROUND(revenue / orders, 2)              AS aov,
       ROUND(revenue / LAG(revenue) OVER (ORDER BY m) - 1, 4) AS mom
FROM monthly
ORDER BY m;</code></pre>
<p class="muted">Revenue = buyers × frequency × AOV. When one factor moves, you have found the driver before you have written a single slide.</p>

<h3>Rate versus mix</h3>
<pre><code>-- contribution of each segment to the total change
WITH a AS (SELECT segment, SUM(amount) v FROM clean_orders
           WHERE order_date &gt;= '2026-01-01' AND order_date &lt; '2026-04-01' GROUP BY 1),
     b AS (SELECT segment, SUM(amount) v FROM clean_orders
           WHERE order_date &gt;= '2025-10-01' AND order_date &lt; '2026-01-01' GROUP BY 1)
SELECT COALESCE(a.segment,b.segment) AS segment,
       b.v AS prev, a.v AS curr, a.v - b.v AS delta
FROM a FULL JOIN b USING (segment)
ORDER BY delta;</code></pre>

<div class="callout warn"><strong>Common mistake:</strong> joining customer attributes into the order table and then summing revenue — many-to-many fan-out doubles the total. Aggregate orders first, or join on a unique key you have verified.</div>`
    },
    {
      id: "c3",
      title: "The EDA notebook that tells a story",
      minutes: 26,
      lede: "A notebook is not a scratchpad you clean up afterwards. It is a narrative with numbered questions, each answered by one block of code and one chart.",
      body: `
<h3>Notebook skeleton</h3>
<pre><code>1. Question &amp; scope        (markdown: what decision, what is out of scope)
2. Load + profile          (shape, dtypes, nulls, duplicates, date range)
3. Cleaning log            (each step: what, why, rows affected)
4. Univariate             (distribution of revenue, orders per customer)
5. Bivariate              (revenue by segment, retention by cohort)
6. Drivers                (decomposition, rate vs mix)
7. Findings &amp; limits      (3 bullets, 2 limits, 1 recommendation)</code></pre>

<h3>Profile in one cell</h3>
<pre><code>def profile(df):
    return pd.DataFrame({
        "dtype": df.dtypes.astype(str),
        "nulls_%": (df.isna().mean() * 100).round(1),
        "unique": df.nunique(),
        "example": df.head(1).T.iloc[:, 0],
    })

profile(df)</code></pre>

<h3>Cohort retention: the chart that wins interviews</h3>
<pre><code>df["cohort"] = df.groupby("customer_id").date.transform("min").dt.to_period("M")
df["month"] = df.date.dt.to_period("M")
df["period"] = (df.month - df.cohort).apply(lambda x: x.n)
ret = (df.groupby(["cohort", "period"]).customer_id.nunique()
         .unstack(fill_value=0))
ret_pct = ret.div(ret[0], axis=0).round(3) * 100</code></pre>
<p>Read it as: "of the customers acquired in January, 34% were still buying in month 3." If the curve flattens, you have a stable core worth protecting; if it hits zero, the product is a one-off purchase.</p>

<h3>Funnel</h3>
<pre><code>steps = ["visit", "signup", "activate", "purchase"]
step_rate = df.groupby("step").user_id.nunique().reindex(steps)
cum_rate = (step_rate / step_rate.iloc[0] * 100).round(1)
step_conv = (step_rate / step_rate.shift() * 100).round(1)</code></pre>
<p>Report both. Step conversion names the broken stage; cumulative conversion sizes the loss.</p>

<div class="callout"><strong>Rule:</strong> every chart gets a title that is a finding, and every finding gets an "so what" line in the markdown beneath it.</div>`
    },
    {
      id: "c4",
      title: "The readout and the interview walkthrough",
      minutes: 22,
      lede: "Your analysis is judged by the two minutes you spend explaining it. Rehearse that, not the notebook.",
      body: `
<h3>The one-page memo</h3>
<pre><code>Question   What revenue driver changed, and what should we do about it?
Answer     Revenue fell 7% QoQ; 82% of the decline is one region, driven by
           fewer repeat buyers, not lower prices.
Evidence   1) orders -9%, AOV +2%  2) repeat rate 41% → 33% in North
           3) discount depth unchanged
Impact     ~$180k per quarter at current run rate.
Action     Re-target the lapsed North cohort with the Q2 win-back offer;
           measure against a holdout for 30 days.
Limits     Promotion data is missing before March, so discount effects
           are estimated from price index only.</code></pre>

<h3>The two-minute walkthrough</h3>
<ol>
  <li><strong>Decision (10s)</strong> — who needed to know what, and by when.</li>
  <li><strong>Data (20s)</strong> — source, grain, volume, what you excluded and why.</li>
  <li><strong>Method (30s)</strong> — the two or three steps that mattered, named in business language.</li>
  <li><strong>Finding (30s)</strong> — the number, the comparison, the size of the effect.</li>
  <li><strong>Recommendation (20s)</strong> — the action, the expected value, the way you would validate it.</li>
  <li><strong>Limits (10s)</strong> — one honest caveat; it builds trust rather than weakening the case.</li>
</ol>

<h3>Questions you will get, and how to handle them</h3>
<table>
<tr><th>Question</th><th>Weak answer</th><th>Strong answer</th></tr>
<tr><td>"How did you clean the data?"</td><td>"I used pandas."</td><td>"Three changes: removed 412 duplicate orders, mapped 5% null regions from billing country, excluded internal-test accounts (~0.3%)."</td></tr>
<tr><td>"Why that metric?"</td><td>"It seemed right."</td><td>"Repeat rate is the leading indicator of the decline; AOV already looked stable, so it ruled out pricing."</td></tr>
<tr><td>"What would you do with more time?"</td><td>"Add more charts."</td><td>"Run a holdout on the win-back offer; without it we cannot separate the campaign from seasonality."</td></tr>
</table>

<div class="callout interview"><strong>Portfolio tip:</strong> publish the notebook and a three-sentence README, not a screenshot. Reviewers search your repository for SQL, a clean folder structure and a stated limitation.</div>`
    }
  ]
});
