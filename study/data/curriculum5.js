window.CURRICULUM = window.CURRICULUM || [];

window.CURRICULUM.push(
{
  id: "eda",
  track: "core",
  icon: "🔍",
  title: "Exploratory Data Analysis",
  blurb: "A repeatable EDA workflow — profile, clean, univariate, bivariate, segment, and the questions to ask at each step.",
  lessons: [
    {
      id: "e1",
      title: "The EDA workflow",
      minutes: 12,
      lede: "Six stages from raw file to findings, with the checklist a senior analyst actually runs.",
      body: `
<h3>The six stages</h3>
<pre><code>1. Frame      what decision does this analysis support?
2. Profile    shape, types, nulls, duplicates, ranges
3. Clean      types, dates, categories, missing, outliers
4. Univariate one variable at a time: distribution, spread, tail
5. Bivariate  relationships, segments, time patterns
6. Conclude   findings, caveats, next questions</code></pre>

<h3>Frame before touching data</h3>
<pre><code>Decision:   should we expand the loyalty programme to the North region?
Metric:     repeat purchase rate within 90 days
Population: customers with ≥1 order in the last 12 months
Cut:        region, tenure, plan
Success:    North lifts to within 5pp of West's 34%</code></pre>
<p>Without a decision, EDA becomes "let me look at everything", which is how analysts spend three days producing nothing.</p>

<h3>Profile with a standard script</h3>
<pre><code>def profile(df):
    print(df.shape)
    out = pd.DataFrame({
        "dtype": df.dtypes,
        "non_null": df.notna().sum(),
        "null_%": (df.isna().mean() * 100).round(1),
        "unique": df.nunique(),
        "sample": df.iloc[0] if len(df) else None,
    })
    return out.sort_values("null_%", ascending=False)

profile(df)</code></pre>

<h3>Questions that generate findings</h3>
<ul>
  <li>Which segment drives the total, and how concentrated is it? (Pareto)</li>
  <li>How has the metric moved over time, and is the move a trend or a step?</li>
  <li>Which dimension explains the most variance?</li>
  <li>Where are the data-quality cliffs — a spike on one date usually means an import bug.</li>
  <li>What would have to be true for this to be wrong?</li>
</ul>

<h3>Common data-quality signals</h3>
<table>
  <tr><th>Signal</th><th>Likely cause</th></tr>
  <tr><td>Row count jumps on one date</td><td>Duplicate load / backfill</td></tr>
  <tr><td>Sudden 100% null column</td><td>Upstream pipeline change</td></tr>
  <tr><td>Negative values in a quantity</td><td>Refunds mixed with sales</td></tr>
  <tr><td>Dates before company founding</td><td>Default 1970-01-01 / 1900-01-01</td></tr>
  <tr><td>100+ categories in a "region" field</td><td>Free-text entry, needs mapping</td></tr>
 </table>
<div class="callout interview"><b>Interview classic</b>"Walk me through how you approach a new dataset." → State the decision and metric, then profile (shape, types, nulls, duplicates), clean, explore univariate then bivariate, validate against a known total from the source system, and finish with findings plus limitations. The validation step is what separates a professional answer.</div>`
    },
    {
      id: "e2",
      title: "Univariate and bivariate analysis",
      minutes: 13,
      lede: "Distributions, outlier handling, and the exploration of two variables at a time including time patterns.",
      body: `
<h3>Univariate: numeric</h3>
<pre><code>df["amount"].describe(percentiles=[.01,.25,.5,.75,.9,.99])
df["amount"].skew()
df["amount"].value_counts().head(10)      # detect rounding artefacts
</code></pre>
<p>Look for: modality (one peak or several), skew, zero-inflation, absurd maxima, and suspicious round numbers (999, 0, -1 used as placeholders).</p>

<h3>Univariate: categorical</h3>
<pre><code>df["region"].value_counts(dropna=False)
df["region"].value_counts(normalize=True).mul(100).round(1)
</code></pre>
<p>Check for case variants ("west", "West", " WEST"), typos, and placeholder values like "N/A", "-", "unknown".</p>

<h3>Outliers: three responses</h3>
<ol>
  <li><strong>Verify</strong> — is it real? Check the record and upstream system.</li>
  <li><strong>Keep and change the measure</strong> — median, trimmed mean, log scale.</li>
  <li><strong>Remove</strong> — only with a documented rule (e.g. exclude internal test accounts).</li>
</ol>
<pre><code>q1, q3 = df["amount"].quantile([.25, .75])
iqr = q3 - q1
mask = df["amount"].between(q1 - 1.5*iqr, q3 + 1.5*iqr)
print(f"{len(df) - mask.sum():,} outliers ({(~mask).mean():.1%})")</code></pre>
<div class="callout warn"><b>Do not silently drop</b>Deleting 4% of rows changes the answer. Report the count and the decision, and check whether the excluded rows differ systematically (whales are usually the ones you exclude and often the ones that matter).</div>

<h3>Bivariate: numeric vs numeric</h3>
<pre><code>df[["amount","qty","discount"]].corr()
sns.scatterplot(data=df, x="discount", y="amount", alpha=0.4)
df.groupby(pd.cut(df["discount"], 5))["amount"].mean()</code></pre>

<h3>Bivariate: categorical vs numeric</h3>
<pre><code>df.groupby("region")["amount"].agg(["count","mean","median","std"])
sns.boxplot(data=df, x="region", y="amount")</code></pre>

<h3>Time patterns</h3>
<pre><code>daily = df.groupby(df["date"].dt.date)["amount"].sum()
daily.rolling(7).mean().plot()
df.groupby(df["date"].dt.day_name())["amount"].mean()     # weekday effect
df.groupby(df["date"].dt.hour)["orders"].count()          # intraday pattern
</code></pre>
<p>Weekday effects and seasonality are the two most common reasons a naive comparison misleads. Compare like with like: full weeks, same weekdays, same number of days per month.</p>
<div class="callout interview"><b>Interview classic</b>"Traffic dropped 20% week over week — how do you investigate?" → Confirm the drop is real (instrumentation, data freshness), then decompose by dimension (device, channel, region, page), by time (single day vs sustained), and by funnel stage; check for seasonality, holidays and releases; compare against last year's same week.</div>`
    },
    {
      id: "e3",
      title: "Segmentation and cohort analysis",
      minutes: 13,
      lede: "RFM, cohort retention, funnel analysis and how slicing turns an average into a story.",
      body: `
<h3>Why segment</h3>
<p>An average over a mixed population describes nobody. Segments turn "users spend $40" into "self-serve users spend $12, enterprise accounts spend $400".</p>

<h3>RFM segmentation</h3>
<pre><code>snapshot = df["date"].max()
rfm = df.groupby("customer_id").agg(
    recency=("date", lambda s: (snapshot - s.max()).days),
    frequency=("order_id", "nunique"),
    monetary=("amount", "sum"),
)
rfm["R"] = pd.qcut(rfm["recency"], 4, labels=[4,3,2,1]).astype(int)
rfm["F"] = pd.qcut(rfm["frequency"].rank(method="first"), 4, labels=[1,2,3,4]).astype(int)
rfm["M"] = pd.qcut(rfm["monetary"], 4, labels=[1,2,3,4]).astype(int)
rfm["score"] = rfm[["R","F","M"]].sum(axis=1)

def label(s):
    if s >= 10: return "Champion"
    if s >= 8:  return "Loyal"
    if s >= 6:  return "Potential"
    if s >= 4:  return "At risk"
    return "Hibernating"
rfm["segment"] = rfm["score"].map(label)
rfm["segment"].value_counts()</code></pre>

<h3>Cohort retention</h3>
<pre><code>first = df.groupby("customer_id")["date"].min().dt.to_period("M")
df["cohort"] = df["customer_id"].map(first)
df["month"] = df["date"].dt.to_period("M")
df["period"] = (df["month"] - df["cohort"]).apply(lambda x: x.n)

size = df.groupby("cohort")["customer_id"].nunique()
ret = (df.groupby(["cohort","period"])["customer_id"].nunique()
         .unstack(fill_value=0))
ret_pct = ret.div(size, axis=0)</code></pre>
<p>Read the triangle: the diagonal shows whether recent cohorts start stronger, and the columns show whether the curve flattens (a healthy sign) or keeps decaying (leaky product).</p>

<h3>Funnel</h3>
<pre><code>stages = ["visit", "product_view", "add_to_cart", "checkout", "purchase"]
counts = [df[df.event == s]["user_id"].nunique() for s in stages]
conv = [c / counts[0] for c in counts]
step = [counts[i] / counts[i-1] for i in range(1, len(counts))]
</code></pre>
<p>Report both the cumulative conversion and the step-by-step rate. The weakest step is where the work is, not necessarily the weakest cumulative number.</p>

<h3>Segment sanity</h3>
<div class="callout warn"><b>Small cells lie</b>A segment with 40 users can show a 300% lift by accident. Set a minimum cell size (often 100–500), and always show n alongside the rate.</div>
<div class="callout interview"><b>Interview classic</b>"How would you find which customers are about to churn?" → Define churn by business rule (no order in 90 days), compute RFM and usage deltas, compare churned vs retained cohorts on pre-churn behaviour, then rank at-risk customers by the strongest discriminators; validate that the rule beats a naive baseline.</div>`
    },
    {
      id: "e4",
      title: "Working an end-to-end case",
      minutes: 15,
      lede: "A complete worked example: revenue decline — the questions, the queries and the answer a hiring manager wants.",
      body: `
<h3>The brief</h3>
<p>"Revenue fell 8% in October. Find out why and tell us what to do."</p>

<h3>Step 1 — Validate</h3>
<pre><code>SELECT COUNT(*), SUM(amount), MIN(order_date), MAX(order_date)
FROM   orders
WHERE  order_date &gt;= '2026-09-01' AND order_date &lt; '2026-11-01';</code></pre>
<p>Check row counts day by day. A cliff on one date is a pipeline bug, not a business problem. Check that the month is complete (31 days vs 30) and that refunds are handled consistently.</p>

<h3>Step 2 — Decompose revenue</h3>
<pre><code>Revenue = Orders × AOV
       = Buyers × Frequency × AOV</code></pre>
<pre><code>SELECT DATE_TRUNC('month', order_date) AS m,
       COUNT(DISTINCT customer_id) AS buyers,
       COUNT(*) AS orders,
       SUM(amount) AS revenue,
       SUM(amount)/COUNT(*) AS aov
FROM   orders
WHERE  order_date &gt;= '2026-07-01'
GROUP BY 1 ORDER BY 1;</code></pre>

<h3>Step 3 — Find the segment that moved</h3>
<pre><code>SELECT region, channel,
       SUM(CASE WHEN order_date &gt;= '2026-10-01' THEN amount END) AS oct,
       SUM(CASE WHEN order_date &lt;  '2026-10-01' THEN amount END) AS sep
FROM   orders
WHERE  order_date &gt;= '2026-09-01' AND order_date &lt; '2026-11-01'
GROUP BY region, channel
ORDER BY (oct - sep) NULLS LAST;</code></pre>

<h3>Step 4 — Rate vs mix</h3>
<p>Decompose the change into <strong>rate effect</strong> (conversion fell within segments) and <strong>mix effect</strong> (traffic shifted toward low-value segments). This distinction is the hallmark of a strong analyst.</p>
<pre><code>overall_change = Σ(share_i × rate_i) change
mix    = Σ(Δshare_i × rate_i_sep)
rate   = Σ(share_i_oct × Δrate_i)</code></pre>

<h3>Step 5 — Timing and external factors</h3>
<ul>
  <li>Compare with the same month last year (seasonality).</li>
  <li>Check promotions that ended in September.</li>
  <li>Check pricing changes and site incidents.</li>
  <li>Check whether a competitor's launch date lines up.</li>
</ul>

<h3>Step 6 — Answer</h3>
<pre><code>What:   Revenue −8% ($412k), October vs September.
Where:  61% of the drop from paid search in the North region.
Why:    Orders fell 14% there while AOV held; buyers fell, not basket size.
Cause:  Paid search spend was cut 30% on 3 Oct (campaign change log).
Action: Restore budget, monitor 2 weeks, hold the other regions.
</code></pre>
<div class="callout interview"><b>Interview classic</b>This whole walkthrough is the answer to "tell me about an analysis you did". Structure it as Question → Method → Finding → Recommendation → Impact, and always quantify using the metric, the segment and the size of the effect.</div>`
    },
    {
      id: "e5",
      title: "Reproducible analysis and notebooks",
      minutes: 11,
      lede: "Project structure, Jupyter hygiene, git for analysts, and handing over work someone else can rerun.",
      body: `
<h3>Project layout</h3>
<pre><code>project/
├── data/
│   ├── raw/           # never edit, never commit big files
│   └── processed/
├── notebooks/
│   └── 01_eda_sales.ipynb
├── src/
│   ├── io.py          # load/save
│   ├── cleaning.py    # reusable transforms
│   └── metrics.py     # KPI definitions
├── outputs/           # charts, exports
├── requirements.txt
└── README.md          # question, data source, how to run</code></pre>

<h3>Notebook discipline</h3>
<ul>
  <li>Restart-and-run-all before sharing. If it fails, it is not reproducible.</li>
  <li>Numeric prefixes (<code>01_</code>, <code>02_</code>) show execution order.</li>
  <li>One notebook per question, not one notebook per quarter.</li>
  <li>Move repeated logic into <code>src/</code> and import it — notebooks call functions, they do not contain them.</li>
  <li>Clear outputs before committing notebooks, or use <code>nbstripout</code>.</li>
</ul>

<h3>Configuration, not hardcoding</h3>
<pre><code># config.yaml
paths:
  raw: data/raw/sales.csv
params:
  start_date: "2025-01-01"

import yaml, pathlib
cfg = yaml.safe_load(pathlib.Path("config.yaml").read_text())</code></pre>

<h3>Deterministic runs</h3>
<pre><code>SEED = 42
import numpy as np, random
np.random.seed(SEED); random.seed(SEED)
</code></pre>
<p>Pin versions in <code>requirements.txt</code>. A result that cannot be reproduced next month is an anecdote.</p>

<h3>Validation tests for data</h3>
<pre><code>def test_no_negative_amounts(df):
    assert (df["amount"] &gt;= 0).all()

def test_keys_unique(df):
    assert not df["order_id"].duplicated().any()

def test_revenue_reconciles(df, expected_total):
    assert abs(df["amount"].sum() - expected_total) &lt; 1
</code></pre>
<p>Four assertions at the top of a notebook catch most silent breakage. This is the "data contract" idea in its simplest form.</p>

<h3>Git for analysts</h3>
<pre><code>git add src/ notebooks/ requirements.txt
git commit -m "feat: add RFM segmentation and cohort retention"
# never: git add data/ (large, changing, possibly personal data)</code></pre>
<div class="callout interview"><b>Interview classic</b>"How do you ensure your analysis is trustworthy?" → Validation against source totals, documented cleaning decisions, version-controlled code with pinned dependencies, a peer review, and a written statement of assumptions and limitations.</div>`
    }
  ]
},

{
  id: "story",
  track: "core",
  icon: "🗣",
  title: "Insight, Storytelling &amp; Stakeholders",
  blurb: "Turning numbers into decisions: structure, narrative, executive summaries and handling pushback.",
  lessons: [
    {
      id: "t1",
      title: "From data to insight",
      minutes: 12,
      lede: "The three-level ladder (observation → insight → recommendation) and how to write each one.",
      body: `
<h3>The ladder</h3>
<table>
  <tr><th>Level</th><th>Example</th><th>Value</th></tr>
  <tr><td>Observation</td><td>"Conversion is 3.1%."</td><td>None alone</td></tr>
  <tr><td>Insight</td><td>"Mobile conversion is 1.4pp below desktop and accounts for 68% of traffic, so it costs us ~$230k/quarter."</td><td>Explains and sizes</td></tr>
  <tr><td>Recommendation</td><td>"Fix mobile checkout; expected +0.6pp overall, worth ~$95k/quarter, 3 weeks of work."</td><td>Drives a decision</td></tr>
</table>
<p>An insight is a change, a cause, or a comparison — with a size attached. If you cannot state the impact in money, users or time, you have an observation.</p>

<h3>The insight sentence</h3>
<pre><code>[Metric] [moved by X] [in segment] [because/driven by Y],
which is worth [impact], so we should [action].</code></pre>
<pre><code>Cart abandonment rose 6pp among returning mobile users after the
Nov 2 checkout release, worth ~$48k in lost monthly revenue;
revert the address-autofill step and re-test.
</code></pre>

<h3>So-what test</h3>
<ol>
  <li>Say the finding out loud.</li>
  <li>Ask "so what?" three times.</li>
  <li>If the third answer is still "interesting", it is not an insight yet — go back and size it.</li>
</ol>

<h3>Prioritising findings</h3>
<pre><code>score = impact × confidence × actionability
impact:       revenue, users, risk
confidence:   data quality, sample size, causal strength
actionability: can someone do something this quarter?
</code></pre>

<h3>Killing your own findings</h3>
<ul>
  <li>Could a different denominator explain it? (per user vs per session)</li>
  <li>Is the segment an artefact of a small n?</li>
  <li>Did the definition of the metric change mid-period?</li>
  <li>Is it seasonality you have seen before?</li>
</ul>
<div class="callout interview"><b>Interview classic</b>"What is the most impactful analysis you have done?" → Deliver the ladder: the observation, the sized insight, the recommendation and the measured outcome. Numbers and a decision beat a description of tools.</div>`
    },
    {
      id: "t2",
      title: "Structuring a readout",
      minutes: 12,
      lede: "Pyramid principle, one-page memos, and the order executives actually want.",
      body: `
<h3>Answer first</h3>
<pre><code>1. Recommendation / headline        (one sentence)
2. Why: three supporting points     (each with a number)
3. Evidence: charts and tables      (appendix depth)
4. Next steps and owner             (dates)
</code></pre>
<p>Consultants call this the pyramid principle. Executives stop reading after 30 seconds, so the answer must be in the first line.</p>

<h3>One-page memo template</h3>
<pre><code>**Question**  Why did October revenue fall 8%?
**Answer**    Paid search budget cut in the North drove 61% of the drop.
**Evidence**  • North paid orders −14%, AOV flat
              • Spend cut 30% on 3 Oct (change log)
              • Other regions flat or up
**Impact**    ~$250k annualised if not reversed
**Action**    Restore budget by Fri; review in 2 weeks
**Caveats**   Attribution window changed on 1 Oct
</code></pre>

<h3>Slide structure for a readout</h3>
<ol>
  <li>Title with the finding, not the topic.</li>
  <li>One chart, one message per slide.</li>
  <li>Annotation on the chart pointing at the evidence.</li>
  <li>Appendix with method and definitions.</li>
</ol>

<h3>Speaking to the room</h3>
<ul>
  <li>Start with the decision you are asking for.</li>
  <li>Give the number, then the chart — never the reverse.</li>
  <li>Say "I don't know yet" when you do not; then say what you would check and by when.</li>
  <li>Keep three numbers in your head you can defend in detail.</li>
</ul>

<h3>Adapting to the audience</h3>
<table>
  <tr><th>Audience</th><th>Wants</th><th>Length</th></tr>
  <tr><td>Executive</td><td>Decision, impact, risk</td><td>1 page / 3 minutes</td></tr>
  <tr><td>Product manager</td><td>Segments, behaviour, next experiment</td><td>1 page + charts</td></tr>
  <tr><td>Engineer</td><td>Definition, edge cases, query</td><td>Detail + code</td></tr>
  <tr><td>Finance</td><td>Reconciliation, assumptions, forecast</td><td>Numbered tables</td></tr>
</table>
<div class="callout interview"><b>Interview classic</b>"How do you present to non-technical stakeholders?" → Lead with the answer and impact, one chart per message, define every metric in plain language, keep method in the appendix, and end with a clear ask.</div>`
    },
    {
      id: "t3",
      title: "Metrics that hold up",
      minutes: 13,
      lede: "Defining KPIs precisely, leading vs lagging indicators, guardrails, and the metric-gaming trap.",
      body: `
<h3>A metric definition template</h3>
<pre><code>Name:        Activation rate
Definition:  % of new signups completing ≥1 core action within 7 days
Numerator:   signups with first_core_action_at <= signup_at + 7d
Denominator: signups created in the period
Exclusions:  internal accounts, deleted accounts, test domains
Owner:       Growth PM
Source:      events.core_action, users
Refresh:     daily 06:00 UTC
</code></pre>
<p>Six lines resolve 90% of metric arguments, and writing them is a recognised senior-analyst skill.</p>

<h3>Leading vs lagging</h3>
<table>
  <tr><th>Type</th><th>Example</th><th>Use</th></tr>
  <tr><td>Lagging</td><td>Revenue, churn, NPS</td><td>Outcome you cannot move this week</td></tr>
  <tr><td>Leading</td><td>Trials started, activation, feature adoption</td><td>Early signal, actionable now</td></tr>
</table>
<p>Every dashboard should pair a lagging outcome with 2–3 leading drivers, so the reader sees cause and result together.</p>

<h3>Guardrail metrics</h3>
<pre><code>Primary:   checkout conversion
Guardrails: page load p95, refund rate, support contacts, revenue/order
</code></pre>
<p>Guardrails prevent "we improved conversion by removing the address form" style wins that quietly cost refunds.</p>

<h3>Gaming: Goodhart's law</h3>
<pre><code>Metric: tickets per agent  → agents close tickets without resolving
Metric: session duration   → endless autoplay
Metric: DAU               → notification spam
</code></pre>
<p>Mitigation: pair every efficiency metric with a quality metric (reopen rate, CSAT, retention), and review outliers by hand.</p>

<h3>Ratios vs totals</h3>
<div class="callout warn"><b>Mixing</b>Never average ratios. Sum numerators and denominators first, then divide. A 5% and a 50% rate averaged to 27.5% is meaningless if their denominators were 10,000 and 20.</div>

<h3>North star and tree</h3>
<pre><code>North star: weekly active buyers
├── new buyers        ← signup rate × activation rate
├── repeat buyers     ← repurchase rate × frequency
└── retention         ← cohort retention at 30/60/90d
</code></pre>
<p>A metric tree tells you where to dig when the headline moves. Draw this in an interview and you look like you have run a business.</p>
<div class="callout interview"><b>Interview classic</b>"How would you measure the success of feature X?" → Primary metric tied to the user behaviour the feature changes, plus guardrails, a pre-period baseline, and the experiment design. Then mention segment cuts and the minimum detectable effect.</div>`
    },
    {
      id: "t4",
      title: "Handling pushback and ambiguity",
      minutes: 11,
      lede: "Stakeholders who disagree, contradictory numbers, and how to run a scoping conversation.",
      body: `
<h3>When the number is challenged</h3>
<pre><code>1. Reconcile the definition    (same numerator? denominator? date range?)
2. Reconcile the source        (which table? which filter?)
3. Show the query and the total row count
4. Offer the alternative view  ("your number excludes refunds")
</code></pre>
<p>Ninety percent of "your numbers are wrong" is a definition mismatch, not an error. Say so neutrally and show both.</p>

<h3>Script for a disagreement</h3>
<pre><code>"Thanks — let's make sure we're comparing the same thing.
 My figure counts completed orders only, Oct 1-31, in USD.
 If you're on gross including refunds, that would explain ~$38k.
 Can you tell me the filter you used so I can reconcile?"
</code></pre>

<h3>Scoping an ambiguous request</h3>
<pre><code>Request: "Can you look into why users are churning?"

Questions:
1. Which users, over what window, and what counts as churn?
2. What decision will this inform, and by when?
3. Is a 1-week directional answer useful, or do you need a confirmed cause?
4. Who else has looked at this?
</code></pre>
<p>Then send a one-paragraph scope back: question, approach, deliverable, date. Confirm before working.</p>

<h3>When you find nothing</h3>
<pre><code>"There is no measurable difference between the groups
 (+0.1pp, 95% CI −0.4 to +0.6). The most likely explanation is
 that the effect is smaller than our sample can detect.
 To detect +0.5pp we would need ~4x the traffic."
</code></pre>
<p>A well-reported null result is valuable. Never manufacture a finding.</p>

<h3>Escalating risk</h3>
<ul>
  <li>State the risk in business terms and its size.</li>
  <li>Propose the smallest mitigation.</li>
  <li>Record the decision and who made it.</li>
  <li>Never sit on a data-quality problem that misleads a decision.</li>
</ul>
<div class="callout interview"><b>Interview classic</b>"A stakeholder says your analysis is wrong. What do you do?" → Reconcile definitions and sources first, show the query, ask for their filter, present both numbers with the difference explained, and agree on one definition going forward.</div>`
    },
    {
      id: "t5",
      title: "Portfolio and personal brand",
      minutes: 10,
      lede: "Three projects that get interviews, how to write them up, and what recruiters actually scan for.",
      body: `
<h3>Three projects, three skills</h3>
<ol>
  <li><strong>SQL + product analytics</strong> — funnel or retention analysis on a public dataset (e-commerce, SaaS events). Shows joins, windows, cohorts.</li>
  <li><strong>Python + EDA</strong> — a public dataset (health, transport, housing) cleaned and explored, ending in a recommendation.</li>
  <li><strong>BI dashboard</strong> — a Power BI or Streamlit dashboard with a stated decision it supports, published and usable.</li>
</ol>

<h3>Write-up structure (README)</h3>
<pre><code>1. Question and why it matters
2. Data: source, size, known limitations
3. Method: cleaning decisions, metrics defined
4. Findings: 3 bullets with numbers
5. Recommendation and expected impact
6. What I would do next
7. How to rerun (commands)
</code></pre>
<p>Recruiters scan for: a question, a number, a chart, and a conclusion. If those are not visible in the first screen, the project does not count.</p>

<h3>GitHub hygiene</h3>
<ul>
  <li>Pinned repositories with a description and a screenshot.</li>
  <li><code>README.md</code> with the finding in the title, not "Data Analysis Project".</li>
  <li>Clean commit history; no 400 MB CSVs.</li>
  <li>Requirements and run instructions that actually work.</li>
</ul>

<h3>LinkedIn and CV</h3>
<pre><code>Weak:   "Analyzed data using Python and SQL"
Strong: "Cut reporting time 60% by rebuilding 12 Excel reports as a
         Power BI model (star schema + 40 DAX measures) used by 3 teams"
</code></pre>
<p>One line = action + tool + measurable outcome. Three such lines beat a list of 30 skills.</p>

<h3>What to say when asked about projects</h3>
<pre><code>"I wanted to know whether discount depth actually drives repeat purchase.
 I used 18 months of order data; the key challenge was that discounts
 were targeted at already-loyal customers, so I compared matched cohorts.
 Repeat rate was +4pp for the discounted group, but the margin loss
 outweighed it — so I recommended cap at 10% and test."
</code></pre>
<p>Note the structure: question, challenge, method, finding, recommendation. That is a 60-second answer that beats any certificate.</p>
<div class="callout interview"><b>Interview classic</b>"Tell me about a project you are proud of." → Use the structure above. Include a real difficulty you solved; interviewers are testing whether you can find and fix problems, not whether you can list libraries.</div>`
    }
  ]
},

{
  id: "governance",
  track: "core",
  icon: "🛡",
  title: "Data Quality, Ethics &amp; Governance",
  blurb: "Privacy, security, quality checks, documentation and the responsible-analyst behaviours employers screen for.",
  lessons: [
    {
      id: "g1",
      title: "Data quality dimensions",
      minutes: 11,
      lede: "Accuracy, completeness, consistency, timeliness, validity and uniqueness — with a test for each.",
      body: `
<h3>Six dimensions</h3>
<table>
  <tr><th>Dimension</th><th>Question</th><th>Check</th></tr>
  <tr><td>Accuracy</td><td>Does it match reality?</td><td>Reconcile with source system totals</td></tr>
  <tr><td>Completeness</td><td>Are records/fields present?</td><td>Null %, expected row counts</td></tr>
  <tr><td>Consistency</td><td>Do systems agree?</td><td>Cross-table comparisons, same key different value</td></tr>
  <tr><td>Timeliness</td><td>Is it fresh enough?</td><td>Max(loaded_at) vs SLA</td></tr>
  <tr><td>Validity</td><td>Does it fit the rules?</td><td>Range, format, enum membership</td></tr>
  <tr><td>Uniqueness</td><td>Are there duplicates?</td><td>Primary-key duplicate count</td></tr>
</table>

<h3>Practical checks in code</h3>
<pre><code>checks = {
    "rows &gt; 0":            len(df) &gt; 0,
    "pk unique":           not df["order_id"].duplicated().any(),
    "no negative amount":  (df["amount"] &gt;= 0).all(),
    "date in range":       df["date"].between("2025-01-01", "2026-12-31").all(),
    "region in list":      df["region"].isin(REGIONS).all(),
    "fresh":               df["loaded_at"].max() &gt; pd.Timestamp.now() - pd.Timedelta("24h"),
}
failed = [k for k, ok in checks.items() if not ok]
</code></pre>

<h3>Root cause, not symptom</h3>
<pre><code>Symptom: 5% of orders have null region
Cause:   checkout API returns 204 on region lookup timeout
Fix:     retry + default queue, alert on null rate &gt; 1%
</code></pre>
<p>Cleaning in the report hides the bug forever. Fix upstream and add a monitor.</p>

<h3>Documentation that survives you</h3>
<ul>
  <li>Data dictionary: every table, column, type, meaning, owner.</li>
  <li>Lineage: source → transform → report.</li>
  <li>Known issues and quirks list.</li>
  <li>Change log with dates and reasons.</li>
</ul>
<div class="callout interview"><b>Interview classic</b>"How do you handle dirty data?" → Profile it, quantify the problem, decide per column (fix upstream, exclude with a documented rule, or impute with a flag), validate against a source total, and report the impact on the analysis.</div>`
    },
    {
      id: "g2",
      title: "Privacy, ethics and the law",
      minutes: 12,
      lede: "PII, GDPR principles, minimisation, consent, anonymisation limits and ethical judgement calls.",
      body: `
<h3>What counts as personal data</h3>
<p>Any information relating to an identified or identifiable person: name, email, phone, address, IP, device ID, customer ID, and combinations that re-identify. Pseudonymised data is still personal data.</p>

<h3>GDPR principles (and their practical meaning)</h3>
<table>
  <tr><th>Principle</th><th>In practice</th></tr>
  <tr><td>Lawfulness, fairness, transparency</td><td>Documented basis; privacy notice</td></tr>
  <tr><td>Purpose limitation</td><td>Do not reuse marketing data for credit scoring</td></tr>
  <tr><td>Data minimisation</td><td>Pull only needed columns; no <code>SELECT *</code> on the user table</td></tr>
  <tr><td>Accuracy</td><td>Correction pathways</td></tr>
  <tr><td>Storage limitation</td><td>Retention schedule, deletion jobs</td></tr>
  <tr><td>Integrity and confidentiality</td><td>Access control, encryption</td></tr>
  <tr><td>Accountability</td><td>Records of processing, DPIAs</td></tr>
</table>

<h3>Techniques</h3>
<pre><code>Pseudonymisation  replace identifiers with tokens (reversible with key)
Anonymisation    irreversible; hard - small cells re-identify easily
Aggregation      report counts, not individuals; enforce min cell size
Hashing          SHA-256 for matching without storing raw values
Masking          j***@example.com in non-prod environments
</code></pre>
<div class="callout warn"><b>Re-identification is easy</b>Postcode + birth date + gender uniquely identifies a large share of a population. "Anonymous" datasets have been de-anonymised many times. Report at segment level with a minimum group size (often ≥10 or ≥50).</div>

<h3>Ethical questions to ask</h3>
<ul>
  <li>Would the person be surprised by how this data is used?</li>
  <li>Does the analysis enable harm, discrimination or manipulation?</li>
  <li>Is the sample excluding a group that would be affected by the decision?</li>
  <li>Am I presenting uncertainty honestly?</li>
  <li>Is a proxy variable encoding protected characteristics (postcode → ethnicity)?</li>
</ul>

<h3>Practical rules</h3>
<pre><code>- Never copy production PII to a laptop or a personal sheet
- Never paste customer data into a public LLM or forum
- Use aggregated extracts for analysis; keep raw data in governed storage
- Log access to sensitive tables
- Ask before exporting anything with names, emails or addresses
</code></pre>
<div class="callout interview"><b>Interview classic</b>"You are asked for a list of high-value customers with emails for a campaign. What do you do?" → Check the purpose and consent basis, confirm the request comes from an authorised owner, provide an aggregated or tokenised extract through the governed channel, and log the request. Do not email a spreadsheet of PII.</div>`
    },
    {
      id: "g3",
      title: "Access control and secure analysis",
      minutes: 10,
      lede: "Least privilege, RLS, sharing safely, and how analysts accidentally leak data.",
      body: `
<h3>Least privilege</h3>
<pre><code>Read-only role on the warehouse
Column-level grants where supported
Separate dev / prod schemas
No shared admin passwords; individual accounts only
</code></pre>

<h3>Sharing rules</h3>
<ul>
  <li>Share the <em>dashboard</em>, not the underlying extract.</li>
  <li>Use workspace/app permissions rather than file attachments.</li>
  <li>Set link expiry on external shares; avoid "anyone with the link".</li>
  <li>Row-level security for multi-region or multi-tenant reporting.</li>
</ul>

<h3>Common leaks</h3>
<table>
  <tr><th>Leak</th><th>Prevention</th></tr>
  <tr><td>PII in a chart tooltip or table</td><td>Mask columns in the report layer</td></tr>
  <tr><td>Full extract in an email attachment</td><td>Share a governed link</td></tr>
  <tr><td>API key committed to git</td><td>Environment variables, secret scanning, rotate</td></tr>
  <tr><td>Test data in prod notebooks</td><td>Separate environments, no production copies locally</td></tr>
  <tr><td>Public dashboard containing customer names</td><td>Aggregation + min cell size</td></tr>
</table>

<h3>Handling a suspected breach</h3>
<pre><code>1. Stop the exposure (revoke link, rotate key)
2. Preserve evidence, do not delete logs
3. Report to your security/privacy contact immediately
4. Do not investigate or notify externally on your own
</code></pre>
<p>GDPR requires notification within 72 hours of awareness in many cases — speed of internal reporting matters more than your own diagnosis.</p>
<div class="callout interview"><b>Interview classic</b>"How do you make sure a dashboard does not expose data to the wrong people?" → RLS roles keyed to identity, tested with "view as", workspace permissions rather than broad sharing, no PII in visuals, and periodic access reviews.</div>`
    },
    {
      id: "g4",
      title: "Documentation and stakeholder trust",
      minutes: 10,
      lede: "Data dictionaries, lineage, versioning and the small habits that make people believe your numbers.",
      body: `
<h3>The trust equation</h3>
<pre><code>Trust = (reliability × transparency × responsiveness) / surprises
</code></pre>
<p>Most trust is lost to surprises: a number changed and nobody said why.</p>

<h3>Data dictionary entry</h3>
<pre><code>Table:   fact_orders
Column:  net_revenue
Type:    decimal(18,2)
Meaning: gross revenue − discounts − refunds, excluding tax, in USD
Source:  orders + refunds, joined on order_id
Owner:   Finance Data
Caveats: null for orders created before 2024-03; excludes marketplace orders
</code></pre>

<h3>Change communication</h3>
<pre><code>Subject: Metric change — Active User definition, effective 1 Dec
What:    now requires ≥1 core action (was ≥1 login)
Impact:  headline drops ~12% (comparable baseline restated in the dashboard)
Why:     login-only inflated the metric with idle accounts
Action:  no action needed; historical series restated back to Jan 2024
</code></pre>
<p>Announce definition changes before someone notices a "drop" and panics.</p>

<h3>Lineage</h3>
<pre><code>raw.orders ──▶ stg_orders ──▶ fact_orders ──▶ Revenue (measure) ──▶ Exec dashboard
             (dedupe)       (typing, joins)   (DAX)
</code></pre>
<p>When a number is questioned, lineage turns a two-hour investigation into a two-minute trace.</p>

<h3>Review habits</h3>
<ul>
  <li>Second pair of eyes on any query that feeds a decision.</li>
  <li>Totals in the report reconcile to the source system — show the reconciliation.</li>
  <li>Freshness timestamp on every dashboard.</li>
  <li>Owner named on every dataset; unowned data rots.</li>
</ul>
<div class="callout interview"><b>Interview classic</b>"Two dashboards show different revenue. How do you resolve it?" → Compare definitions, filters, date grains, currency handling and refresh times; trace lineage to the source; reconcile to the finance system total; then agree one canonical definition and document it.</div>`
    }
  ]
}
);
