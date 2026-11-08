window.CHEATSHEETS = [
{
  id: "sql",
  title: "SQL",
  body: `
<h3>Query skeleton</h3>
<pre><code>SELECT   region, COUNT(*) AS n, SUM(amount) AS rev
FROM     orders
WHERE    order_date &gt;= '2026-01-01' AND status = 'paid'
GROUP BY region
HAVING   SUM(amount) &gt; 10000
ORDER BY rev DESC
LIMIT    10;</code></pre>
<p class="mono small">Logical order: FROM → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT</p>

<h3>Joins</h3>
<table>
<tr><th>Type</th><th>Keeps</th><th>Use</th></tr>
<tr><td>INNER</td><td>matches only</td><td>both sides required</td></tr>
<tr><td>LEFT</td><td>all left</td><td>enrich a fact table</td></tr>
<tr><td>FULL</td><td>both sides</td><td>reconciliation</td></tr>
<tr><td>CROSS</td><td>cartesian</td><td>date spines, scaffolding</td></tr>
</table>
<pre><code>-- anti-join
SELECT c.id FROM customers c
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);</code></pre>

<h3>Windows</h3>
<pre><code>ROW_NUMBER() OVER (PARTITION BY k ORDER BY ts DESC)
RANK()       OVER (PARTITION BY k ORDER BY v DESC)
LAG(v)       OVER (ORDER BY d)
SUM(v)       OVER (ORDER BY d ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)
AVG(v)       OVER (ORDER BY d ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)</code></pre>

<h3>Patterns</h3>
<pre><code>-- dedupe, keep latest
WITH r AS (SELECT *, ROW_NUMBER() OVER (PARTITION BY email ORDER BY loaded_at DESC) rn
           FROM raw_users)
SELECT * FROM r WHERE rn = 1;

-- top 3 per category
WITH r AS (SELECT *, DENSE_RANK() OVER (PARTITION BY category ORDER BY rev DESC) rk
           FROM t)
SELECT * FROM r WHERE rk &lt;= 3;

-- month over month
SELECT m, rev, rev - LAG(rev) OVER (ORDER BY m) AS delta FROM monthly;

-- safe ratio
SELECT SUM(paid)::numeric / NULLIF(SUM(total),0) AS rate FROM x;</code></pre>

<h3>Gotchas</h3>
<ul>
  <li><code>col = NULL</code> never matches — use <code>IS NULL</code>.</li>
  <li><code>BETWEEN</code> on timestamps misses the last day — use <code>&gt;= a AND &lt; b</code>.</li>
  <li>Joining many-to-many fans out rows; aggregate first.</li>
  <li>Window functions cannot be filtered in the same query level.</li>
  <li>COUNT(col) skips NULLs; COUNT(*) does not.</li>
</ul>`
},
{
  id: "pandas",
  title: "pandas",
  body: `
<h3>Load &amp; inspect</h3>
<pre><code>import pandas as pd
df = pd.read_csv("f.csv", parse_dates=["date"], usecols=["date","amount"])
df.shape; df.dtypes; df.head()
df.info(memory_usage="deep")
df.isna().mean().mul(100).round(1).sort_values(ascending=False)
df.duplicated(subset=["id"]).sum()</code></pre>

<h3>Select &amp; filter</h3>
<pre><code>df.loc[df.amount &gt; 100, ["region","amount"]]
df.iloc[0:5, 0:3]
df.query("region == 'North' and amount &gt; 100")
df.sort_values(["region","amount"], ascending=[True,False])</code></pre>

<h3>Aggregate</h3>
<pre><code>df.groupby("region").agg(
    n=("order_id","nunique"),
    rev=("amount","sum"),
    aov=("amount","mean"),
).round(2)

df["share"] = df.amount / df.amount.sum()
df["grp_share"] = df.amount / df.groupby("region").amount.transform("sum")</code></pre>

<h3>Reshape</h3>
<pre><code>df.pivot_table(index="region", columns="month", values="amount",
               aggfunc="sum", fill_value=0)
df.melt(id_vars=["id"], var_name="month", value_name="amount")
pd.cut(df.amount, bins=[0,10,50,100,1e9])
pd.qcut(df.amount, 4)                 # quartiles
pd.concat([a,b], ignore_index=True)</code></pre>

<h3>Time</h3>
<pre><code>s = df.set_index("date")["signups"].resample("D").sum()
s.rolling(7, min_periods=1).mean()
df["dow"] = df.date.dt.day_name()
(df.date.max() - df.date.min()).days</code></pre>

<h3>Clean</h3>
<pre><code>df["region"] = df.region.str.strip().str.title()
df["amount"] = pd.to_numeric(df.amount, errors="coerce")
df = df.drop_duplicates(subset=["order_id"], keep="last")
df["band"] = np.select([df.a &lt; 10, df.a &lt; 100], ["low","mid"], "high")</code></pre>

<h3>Export</h3>
<pre><code>with pd.ExcelWriter("out.xlsx") as w:
    summary.to_excel(w, sheet_name="Summary", index=False)
    detail.to_excel(w, sheet_name="Detail", index=False)</code></pre>`
},
{
  id: "python",
  title: "Python",
  body: `
<h3>Types</h3>
<table>
<tr><th>Type</th><th>Mutable</th><th>Use</th></tr>
<tr><td>list</td><td>yes</td><td>ordered collection</td></tr>
<tr><td>tuple</td><td>no</td><td>fixed record / dict key</td></tr>
<tr><td>set</td><td>yes</td><td>uniqueness, O(1) membership</td></tr>
<tr><td>dict</td><td>yes</td><td>key-value lookup</td></tr>
</table>

<h3>Idioms</h3>
<pre><code>[x*2 for x in nums if x &gt; 0]              # comprehension
{k: v for k, v in pairs}                  # dict comprehension
sorted(rows, key=lambda r: (-r["rev"], r["name"]))
f"{value:,.2f}  {pct:.1%}  {name:&gt;10}"
", ".join(items)
enumerate(items, start=1)
zip(a, b)
{**a, **b}                                # merge dicts
Counter(items).most_common(5)</code></pre>

<h3>Functions</h3>
<pre><code>def summarise(df, col="amount", top=None):
    out = df.groupby("region")[col].agg(["count","mean"]).round(2)
    return out.head(top) if top else out</code></pre>

<h3>Files</h3>
<pre><code>import json, pathlib, csv
cfg = json.loads(pathlib.Path("config.json").read_text())
with open("data.csv", newline="") as f:
    rows = list(csv.DictReader(f))</code></pre>

<h3>Errors</h3>
<pre><code>try:
    v = int(raw)
except (TypeError, ValueError) as e:
    log.warning("bad value %r: %s", raw, e)
    v = None
finally:
    fh.close()</code></pre>
<p class="mono small">Never use a bare <code>except:</code>; never use a mutable default argument.</p>`
},
{
  id: "stats",
  title: "Statistics",
  body: `
<h3>Descriptive</h3>
<pre><code>mean, median, mode
std (ddof=1), IQR = q3 - q1, CV = std/mean
skew, kurtosis
percentiles: 1, 5, 50, 95, 99</code></pre>

<h3>Distributions</h3>
<table>
<tr><th>Distribution</th><th>Use</th></tr>
<tr><td>Normal</td><td>measurement noise, sums of many effects</td></tr>
<tr><td>Binomial</td><td>conversions, yes/no per user</td></tr>
<tr><td>Poisson</td><td>event counts per interval</td></tr>
<tr><td>Lognormal / Pareto</td><td>revenue, session length, city size</td></tr>
</table>

<h3>Inference</h3>
<pre><code>SE      = s / sqrt(n)
CI 95%  = estimate ± 1.96 * SE
p-value = P(data at least this extreme | H0 true)
power   = 1 - beta  (aim ≥ 0.8)
n ≈ 16 * p(1-p) / MDE^2   per arm</code></pre>

<h3>Test selection</h3>
<table>
<tr><th>Question</th><th>Test</th></tr>
<tr><td>2 group means</td><td>Welch t-test</td></tr>
<tr><td>3+ group means</td><td>ANOVA</td></tr>
<tr><td>2 proportions</td><td>two-proportion z-test / chi-square</td></tr>
<tr><td>2 categorical vars</td><td>chi-square / Fisher exact</td></tr>
<tr><td>non-normal small sample</td><td>Mann–Whitney U</td></tr>
<tr><td>distribution-free CI</td><td>bootstrap</td></tr>
</table>

<h3>Traps</h3>
<ul>
  <li>Peeking inflates false positives.</li>
  <li>Averaging ratios instead of pooling numerators.</li>
  <li>Simpson's paradox: aggregate reverses segment direction.</li>
  <li>Regression to the mean after selecting extremes.</li>
  <li>Practical vs statistical significance.</li>
</ul>`
},
{
  id: "dax",
  title: "Power BI / DAX",
  body: `
<h3>Model</h3>
<pre><code>dim_date 1 ──▶ * fact_sales ◀── * dim_customer
dim_product 1 ──▶ *
single-direction filters, star schema, mark dim_date as date table</code></pre>

<h3>Measures</h3>
<pre><code>Revenue      = SUM(fact_sales[amount])
Orders       = DISTINCTCOUNT(fact_sales[order_id])
AOV          = DIVIDE([Revenue], [Orders])
Revenue YTD  = TOTALYTD([Revenue], dim_date[date])
Revenue LY   = CALCULATE([Revenue], SAMEPERIODLASTYEAR(dim_date[date]))
YoY %        = DIVIDE([Revenue] - [Revenue LY], [Revenue LY])
Share        = DIVIDE([Revenue], CALCULATE([Revenue], ALL(dim_product)))
Rank         = RANKX(ALL(dim_product[product]), [Revenue])
Rolling30    = CALCULATE([Revenue], DATESINPERIOD(dim_date[date], MAX(dim_date[date]), -30, DAY))</code></pre>

<h3>Key concepts</h3>
<ul>
  <li><strong>Filter context</strong> — slicers, page filters, visual axes.</li>
  <li><strong>Row context</strong> — inside calculated columns and iterators (SUMX).</li>
  <li><strong>CALCULATE</strong> — changes the filter context; the core of advanced DAX.</li>
  <li><strong>ALL</strong> — removes filters (share of total).</li>
  <li><strong>DIVIDE</strong> — safe division, handles zero.</li>
</ul>

<h3>Performance</h3>
<pre><code>drop unused columns · star schema · avoid SUMX over facts
prefer measures over columns · limit visuals per page
use Performance Analyzer · aggregate tables for large models</code></pre>`
},
{
  id: "excel",
  title: "Excel",
  body: `
<h3>Lookups</h3>
<pre><code>=XLOOKUP(A2, ids, values, "not found")
=INDEX(values, MATCH(A2, ids, 0))
=IFERROR(VLOOKUP(A2, tbl, 3, FALSE), "")</code></pre>

<h3>Aggregation</h3>
<pre><code>=SUMIFS(amount, region, "North", month, "Oct")
=COUNTIFS(status, "paid")
=SUMPRODUCT((region="North")*(month="Oct")*amount)
=AVERAGEIFS(amount, region, "North")</code></pre>

<h3>Logic &amp; text</h3>
<pre><code>=IF(AND(a&gt;0,b&lt;0), "x", "y")
=IFS(x&gt;90,"A", x&gt;80,"B", TRUE,"C")
=TEXT(date,"yyyy-mm"); =TEXTJOIN(", ",TRUE,range)
=TRIM(PROPER(SUBSTITUTE(a,"_"," ")))</code></pre>

<h3>Dynamic arrays</h3>
<pre><code>=UNIQUE(range)
=SORT(FILTER(tbl, tbl[region]="North"), 3, -1)
=SEQUENCE(12,1,DATE(2026,1,1),0)&lt;!-- monthly spine --&gt;
=XLOOKUP(key, ids, values, "—", 0, 1)   &lt;!-- last match --&gt;</code></pre>

<h3>Power Query steps worth knowing</h3>
<pre><code>Remove duplicates · Change type · Split column · Unpivot
Group by · Merge queries · Append · Replace values
Add index · Filter rows</code></pre>

<h3>Shortcuts</h3>
<pre><code>Ctrl+T table · Alt+= autosum · F4 absolute ref
Ctrl+Shift+L filter · Alt+N+V pivot table
Ctrl+Arrow jump to edge · Ctrl+Shift+Arrow select block</code></pre>`
},
{
  id: "charts",
  title: "Chart choice",
  body: `
<h3>Question → chart</h3>
<table>
<tr><th>You want to show</th><th>Chart</th><th>Avoid</th></tr>
<tr><td>Rank / comparison</td><td>sorted bar (horizontal if long labels)</td><td>pie, 3D</td></tr>
<tr><td>Change over time</td><td>line (sparkline for dense)</td><td>stacked area with many series</td></tr>
<tr><td>Distribution</td><td>histogram, box, violin</td><td>bar of averages</td></tr>
<tr><td>Correlation</td><td>scatter (+ trend line)</td><td>dual-axis line</td></tr>
<tr><td>Composition</td><td>stacked bar, treemap</td><td>pie with &gt;3 slices</td></tr>
<tr><td>Many segments, same trend</td><td>small multiples</td><td>overlapping 12-line chart</td></tr>
<tr><td>Exact values</td><td>table</td><td>heatmap for &lt;10 cells</td></tr>
</table>

<h3>Rules</h3>
<ul>
  <li>Bar charts start at zero; line charts may zoom if labelled.</li>
  <li>Sort bars by value unless categories have natural order.</li>
  <li>Title = finding, not metric name.</li>
  <li>Direct-label instead of a legend when possible.</li>
  <li>Grey the context, colour one message.</li>
  <li>Never encode meaning by colour alone.</li>
</ul>

<h3>Dashboard layout</h3>
<pre><code>row 1  3-5 KPI tiles with delta vs prior period
row 2  trend chart (period selector) + driver breakdown
row 3  detail table / top-N list
footer freshness timestamp + owner + definitions link</code></pre>`
},
{
  id: "interview",
  title: "Interview one-liners",
  body: `
<h3>Openers</h3>
<ul>
  <li>"Before I write anything — what is one row in the output?"</li>
  <li>"Let me confirm the decision this supports."</li>
  <li>"I'd reconcile to the source total first."</li>
</ul>

<h3>SQL</h3>
<ul>
  <li>"I'll aggregate to the join grain first to avoid fan-out."</li>
  <li>"Window functions can't be filtered in the same level, so I'll wrap it in a CTE."</li>
  <li>"I'd check row counts before and after the join."</li>
</ul>

<h3>Statistics</h3>
<ul>
  <li>"A p-value is not the probability the hypothesis is true."</li>
  <li>"I'd report the effect size with a confidence interval."</li>
  <li>"We need to size the test before launching."</li>
</ul>

<h3>Business</h3>
<ul>
  <li>"Revenue = buyers × frequency × AOV — let's see which moved."</li>
  <li>"Is this a rate change or a mix change?"</li>
  <li>"What would have to be true for this to be wrong?"</li>
</ul>

<h3>Closing</h3>
<ul>
  <li>"What decision did this team change last quarter?"</li>
  <li>"Who owns data quality here?"</li>
  <li>"What does success look like at six months?"</li>
</ul>`
}
];
