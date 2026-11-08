window.CURRICULUM = window.CURRICULUM || [];

window.CURRICULUM.push(
{
  id: "viz",
  track: "viz",
  icon: "📈",
  title: "Data Visualization",
  blurb: "Chart selection, design rules, matplotlib and seaborn, and the habits that make a chart instantly readable.",
  lessons: [
    {
      id: "v1",
      title: "Choosing the right chart",
      minutes: 12,
      lede: "A decision table from question to chart type, and the four charts that cover 80% of analytics work.",
      body: `
<h3>Question → chart</h3>
<table>
  <tr><th>Question</th><th>Chart</th><th>Avoid</th></tr>
  <tr><td>Compare categories</td><td>Horizontal bar, sorted</td><td>Pie with 6+ slices, 3D</td></tr>
  <tr><td>Change over time</td><td>Line (one per series)</td><td>Stacked bars for trends</td></tr>
  <tr><td>Distribution</td><td>Histogram, box, violin</td><td>Bar of averages only</td></tr>
  <tr><td>Relationship</td><td>Scatter with trend</td><td>Dual-axis line charts</td></tr>
  <tr><td>Composition</td><td>Stacked bar, treemap</td><td>Pie beyond 4 slices</td></tr>
  <tr><td>Part of a whole over time</td><td>100% stacked area</td><td>Overlapping lines</td></tr>
  <tr><td>Ranking</td><td>Sorted bar or dot plot</td><td>Unsorted bars</td></tr>
  <tr><td>Correlation matrix</td><td>Heatmap</td><td>Table of r values</td></tr>
</table>

<h3>The four workhorses</h3>
<ol>
  <li><strong>Sorted horizontal bar</strong> — comparisons and rankings. Always sort by value.</li>
  <li><strong>Line</strong> — time series. One axis, no dual scales.</li>
  <li><strong>Histogram</strong> — distributions. Choose bin width deliberately.</li>
  <li><strong>Scatter</strong> — relationships and outliers.</li>
</ol>

<h3>Chart selection in practice</h3>
<pre><code>"Which region grew fastest?"        → line per region, or slope chart
"Where is revenue concentrated?"     → sorted bar, cumulative % (Pareto)
"Is AOV different by device?"        → box plot or bar with error bars
"Are spend and revenue related?"     → scatter, log scale if long-tailed</code></pre>

<h3>Dosage</h3>
<div class="callout warn"><b>Too many series</b>More than 5–7 lines is unreadable. Highlight the one that matters and grey the rest. "Small multiples" (a grid of small charts) beats one crowded chart.</div>

<h3>Accessibility and honesty</h3>
<ul>
  <li>Never truncate a bar chart's y-axis — bars encode length.</li>
  <li>Truncating a line chart's axis can be acceptable if labelled, because lines encode slope, not length.</li>
  <li>Do not use area to represent a single number; use length.</li>
  <li>Colour-blind safe palettes: avoid red/green as the only distinction.</li>
  <li>Label units. "Revenue" is not a unit; "$ thousands" is.</li>
</ul>
<div class="callout interview"><b>Interview classic</b>"Why not a pie chart?" → Human eyes compare angles poorly; with more than three or four slices the differences are unreadable. A sorted bar chart answers the same question more accurately.</div>`
    },
    {
      id: "v2",
      title: "Design rules that make charts readable",
      minutes: 12,
      lede: "Data-ink ratio, pre-attentive attributes, titles that state the finding, annotation and the small set of rules that do most of the work.",
      body: `
<h3>Titles state the finding</h3>
<pre><code>Weak:    "Revenue by Region, Q3 2026"
Strong:  "West drives 46% of Q3 revenue, up 12% on Q2"</code></pre>
<p>The reader should get the message without reading the axes. Use a subtitle for the "so what" and keep axis labels for units.</p>

<h3>Data-ink ratio</h3>
<p>Every pixel should carry information. Remove:</p>
<ul>
  <li>Gridlines that are not needed (keep faint horizontal ones on bar charts)</li>
  <li>Chart borders and background fills</li>
  <li>Redundant legends when you can label the lines directly</li>
  <li>3D effects, shadows, gradient fills</li>
</ul>
<pre><code>ax.spines["top"].set_visible(False)
ax.spines["right"].set_visible(False)
ax.grid(axis="y", alpha=0.25)
ax.set_axisbelow(True)</code></pre>

<h3>Pre-attentive attributes</h3>
<p>Position and length are decoded most accurately; colour hue and area least. So:</p>
<ul>
  <li>Rank with position, not colour intensity.</li>
  <li>Use one accent colour for the point you are making; grey everything else.</li>
  <li>Use size sparingly — humans underestimate large areas.</li>
</ul>

<h3>Annotation</h3>
<pre><code>ax.annotate("Price change", xy=(pd.Timestamp("2026-06-01"), 120000),
            xytext=(0, 30), textcoords="offset points",
            arrowprops=dict(arrowstyle="-&gt;", lw=1, color="#97a3c4"),
            fontsize=9, color="#97a3c4")</code></pre>
<p>One annotation explaining a spike is worth more than a paragraph in the appendix.</p>

<h3>Order and scale</h3>
<ul>
  <li>Sort categories by value unless the order is meaningful (months, funnel stages).</li>
  <li>Start bar axes at zero; use log scales only when ranges span orders of magnitude, and label them.</li>
  <li>Round axis ticks: 0, 250k, 500k — not 0, 237,418, 474,836.</li>
</ul>

<h3>Colour palette rules</h3>
<pre><code>categorical → distinct hues, max 6
sequential  → one hue, light to dark
diverging   → two hues around a neutral midpoint (variance vs target)
highlight   → brand colour for one series, grey for context</code></pre>
<div class="callout interview"><b>Interview classic</b>"How do you make this chart better?" (shown a cluttered chart) → Name three concrete moves: sort the bars, drop the gridlines and legend, and retitle it with the finding. Structured critique beats taste-based opinions.</div>`
    },
    {
      id: "v3",
      title: "matplotlib essentials",
      minutes: 14,
      lede: "Figure and axes objects, the ten calls you will reuse, subplots and saving publication-quality output.",
      body: `
<h3>Object-oriented API</h3>
<pre><code>import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(9, 5))
ax.plot(dates, revenue, color="#6d5efc", lw=2, label="Revenue")
ax.set_title("Monthly revenue grew 18% in H2", loc="left", fontsize=13, weight="bold")
ax.set_ylabel("Revenue ($k)")
ax.set_xlabel("")
ax.spines[["top", "right"]].set_visible(False)
ax.grid(axis="y", alpha=0.25)
ax.set_axisbelow(True)
fig.tight_layout()
fig.savefig("revenue.png", dpi=150, bbox_inches="tight")</code></pre>

<h3>Bars</h3>
<pre><code>data = revenue_by_region.sort_values("revenue")
ax.barh(data["region"], data["revenue"], color="#6d5efc")
for y, (v) in enumerate(data["revenue"]):
    ax.text(v, y, f" {v/1000:.0f}k", va="center", fontsize=9)
ax.set_xlabel("Revenue ($)")</code></pre>

<h3>Histograms and box plots</h3>
<pre><code>ax.hist(df["amount"], bins=30, color="#22d3ee", edgecolor="white")
ax.boxplot(df["amount"], vert=False)
ax.set_xlabel("Order value ($)")</code></pre>

<h3>Scatter with a fitted line</h3>
<pre><code>ax.scatter(df["spend"], df["revenue"], s=18, alpha=0.6, color="#6d5efc")
import numpy as np
z = np.polyfit(df["spend"], df["revenue"], 1)
ax.plot(df["spend"], np.poly1d(z)(df["spend"]), color="#f59e0b", lw=1.5)</code></pre>

<h3>Subplots / small multiples</h3>
<pre><code>fig, axes = plt.subplots(2, 2, figsize=(11, 7), sharex=True)
for ax, region in zip(axes.ravel(), ["West", "North", "East", "South"]):
    sub = df[df.region == region]
    ax.plot(sub["date"], sub["revenue"])
    ax.set_title(region, loc="left", fontsize=11)
fig.suptitle("Every region grew except East", x=0.01, ha="left", weight="bold")
fig.tight_layout()</code></pre>

<h3>Styling defaults once</h3>
<pre><code>plt.rcParams.update({
    "figure.dpi": 120,
    "axes.edgecolor": "#97a3c4",
    "axes.labelcolor": "#e8ecf8",
    "text.color": "#e8ecf8",
    "xtick.color": "#97a3c4",
    "ytick.color": "#97a3c4",
    "figure.facecolor": "#0b1020",
    "axes.facecolor": "#0b1020",
    "font.size": 10,
})</code></pre>
<div class="callout interview"><b>Interview classic</b>"Difference between <code>plt.plot</code> and <code>ax.plot</code>?" → <code>plt.*</code> acts on the "current" axes (stateful, fine for quick checks); <code>ax.*</code> is explicit and is the only sane approach for subplots and reusable functions.</div>`
    },
    {
      id: "v4",
      title: "seaborn and statistical plots",
      minutes: 13,
      lede: "One-liners for distributions, relationships and categories — plus how to add confidence bands and facets.",
      body: `
<h3>Setup</h3>
<pre><code>import seaborn as sns
sns.set_theme(style="whitegrid", palette="deep")
sns.set_context("notebook", font_scale=1.05)</code></pre>

<h3>Distributions</h3>
<pre><code>sns.histplot(data=df, x="amount", bins=40, kde=True)
sns.boxplot(data=df, x="device", y="amount")
sns.violinplot(data=df, x="plan", y="sessions", inner="quart")

# many variables at once
sns.pairplot(df[["revenue", "visits", "tenure", "churn"]], hue="churn")</code></pre>

<h3>Relationships</h3>
<pre><code>sns.scatterplot(data=df, x="spend", y="revenue", hue="region", alpha=0.7)
sns.regplot(data=df, x="spend", y="revenue", scatter_kws={"s": 12})   # with CI band
sns.heatmap(df.corr(numeric_only=True), annot=True, fmt=".2f",
            cmap="vlag", center=0, square=True)</code></pre>

<h3>Categories</h3>
<pre><code>sns.barplot(data=df, x="region", y="revenue", estimator="sum", errorbar=None)
sns.barplot(data=df, x="region", y="conversion", ci=95)   # keep the error bars
sns.countplot(data=df, x="plan", order=df["plan"].value_counts().index)
sns.stripplot(data=df, x="region", y="amount", jitter=0.25, alpha=0.5)</code></pre>
<div class="callout warn"><b>Bar plot of raw rows</b>By default <code>sns.barplot</code> shows the <em>mean</em>, not the total. Pass <code>estimator="sum"</code> for revenue totals, or use <code>pointplot</code> when you want to show a trend in a categorical dimension.</div>

<h3>Facets — small multiples</h3>
<pre><code>g = sns.FacetGrid(df, col="region", col_wrap=2, height=3.2)
g.map_dataframe(sns.lineplot, x="date", y="revenue")
g.set_titles("{col_name}")

sns.relplot(data=df, x="spend", y="revenue", col="region", col_wrap=3, kind="scatter")</code></pre>

<h3>Timeseries with bands</h3>
<pre><code>sns.lineplot(data=daily, x="date", y="revenue", errorbar=("ci", 95))
# shade a band yourself for min/max across regions
ax.fill_between(piv.index, piv.min(axis=1), piv.max(axis=1), alpha=0.15)</code></pre>

<h3>When seaborn is not enough</h3>
<p>seaborn is great for exploration and fine for reports; for pixel-level control of a published chart, go back to matplotlib on the returned axes object (<code>g.ax</code>), or use Plotly for interactivity.</p>
<div class="callout interview"><b>Interview classic</b>"How do you visualise a distribution and defend the choice?" → Histogram plus box plot overlay, or a violin; mention that the histogram shows shape and modality while the box shows quartiles and outliers, so together they answer both "what shape" and "how spread".</div>`
    },
    {
      id: "v5",
      title: "Interactive charts and dashboards",
      minutes: 12,
      lede: "Plotly, Streamlit and the principles of interactive design — filters, drill-down and progressive disclosure.",
      body: `
<h3>Plotly for hover and zoom</h3>
<pre><code>import plotly.express as px

fig = px.line(monthly, x="month", y="revenue", color="region",
              title="Revenue by region", markers=True)
fig.update_layout(hovermode="x unified", template="plotly_dark")
fig.show()                      # notebook
fig.write_html("chart.html")    # shareable standalone file</code></pre>

<h3>Quick app in Streamlit</h3>
<pre><code>import streamlit as st, pandas as pd, plotly.express as px

st.set_page_config(page_title="Revenue Explorer", layout="wide")
df = pd.read_parquet("clean.parquet")

regions = st.sidebar.multiselect("Region", sorted(df.region.unique()), default=None)
start, end = st.sidebar.date_input("Date range", [df.date.min(), df.date.max()])

f = df[df.date.between(pd.Timestamp(start), pd.Timestamp(end))]
if regions:
    f = f[f.region.isin(regions)]

c1, c2, c3 = st.columns(3)
c1.metric("Revenue", f"\${f.amount.sum():,.0f}")
c2.metric("Orders", f"{f.order_id.nunique():,}")
c3.metric("AOV", f"\${f.amount.mean():.2f}")

st.plotly_chart(px.line(f.groupby('date', as_index=False).amount.sum(),
                        x='date', y='amount'), use_container_width=True)
</code></pre>
<p>Run with <code>streamlit run app.py</code>. This is the fastest route from a script to something a stakeholder can click.</p>

<h3>Interaction design principles</h3>
<ul>
  <li><strong>One screen, one message.</strong> A dashboard answers one decision.</li>
  <li><strong>Top-left is the headline.</strong> KPIs first, detail below.</li>
  <li><strong>Progressive disclosure</strong> — summary, then filters, then row-level detail.</li>
  <li><strong>Defaults must be meaningful</strong> — the last 30 days, not all time.</li>
  <li><strong>Every filter should visibly change the chart.</strong> Silent no-ops destroy trust.</li>
  <li><strong>Show the data freshness</strong> — "updated 12 min ago" prevents a lot of arguments.</li>
</ul>

<h3>Performance habits</h3>
<pre><code>@st.cache_data            # cache expensive loads
def load(path): return pd.read_parquet(path)

# aggregate before plotting; never plot 1M raw points
</code></pre>
<div class="callout warn"><b>Interactive ≠ better</b>A static chart that loads instantly often beats a dashboard nobody can find the number in. Interactivity is justified by a user need to slice the data, not by novelty.</div>
<div class="callout interview"><b>Interview classic</b>"Design a dashboard for a customer support manager." → KPIs: tickets opened/closed, first-response time, resolution time, backlog; trend over 30 days; breakdown by channel and team; a table of the oldest open tickets; filters for team and priority. Then say what decision each view supports.</div>`
    }
  ]
},

{
  id: "powerbi",
  track: "bi",
  icon: "▦",
  title: "Power BI &amp; DAX",
  blurb: "The Microsoft data-analyst stack: data model, Power Query, DAX measures, reports and the PL-300 exam skills.",
  lessons: [
    {
      id: "b1",
      title: "Power BI anatomy and the analyst workflow",
      minutes: 12,
      lede: "Desktop, Service and Gateway; the four-step flow from source to published report, and what PL-300 tests.",
      body: `
<h3>The pieces</h3>
<table>
  <tr><th>Component</th><th>Role</th></tr>
  <tr><td>Power BI Desktop</td><td>Authoring: model, DAX, reports</td></tr>
  <tr><td>Power BI Service</td><td>Publish, share, schedule refresh, workspaces</td></tr>
  <tr><td>Gateway</td><td>Bridges on-premises data to the cloud</td></tr>
  <tr><td>Power Query</td><td>Extract and transform (M language)</td></tr>
  <tr><td>DAX</td><td>Measures and calculated columns</td></tr>
</table>

<h3>The four-step workflow</h3>
<pre><code>1. Connect      Get Data → SQL Server, Excel, CSV, SharePoint, Snowflake, web
2. Transform    Power Query: clean, rename, unpivot, type, merge
3. Model        relationships, star schema, measures
4. Visualise    report pages → publish to Service
</code></pre>

<h3>Microsoft's data analyst skill areas</h3>
<ol>
  <li><strong>Prepare the data</strong> — connect, profile, clean, shape.</li>
  <li><strong>Model the data</strong> — star schema, relationships, DAX calculations.</li>
  <li><strong>Visualise and analyse</strong> — charts, filters, drill-through, AI visuals.</li>
  <li><strong>Deploy and maintain</strong> — workspaces, row-level security, refresh, sensitivity labels.</li>
</ol>

<h3>Import vs DirectQuery vs Composite</h3>
<table>
  <tr><th>Mode</th><th>Data lives</th><th>Use when</th></tr>
  <tr><td>Import</td><td>In-memory (VertiPaq)</td><td>Fast reports on &lt; ~1GB, daily refresh</td></tr>
  <tr><td>DirectQuery</td><td>Queried live</td><td>Huge or real-time data, strict freshness</td></tr>
  <tr><td>Composite</td><td>Mixed</td><td>Large fact table live, small dimensions imported</td></tr>
</table>
<p>Import mode is dramatically faster; start there unless freshness forces otherwise.</p>

<h3>Naming and hygiene</h3>
<ul>
  <li>Prefix fact and dimension tables: <code>FactSales</code>, <code>DimDate</code>, <code>DimProduct</code>.</li>
  <li>Hide technical columns from the report view.</li>
  <li>Format measures as currency/percentage in the model, not per visual.</li>
  <li>Name measures in business language: <code>Revenue YoY %</code>, not <code>calc_3</code>.</li>
</ul>
<div class="callout interview"><b>Interview classic</b>"Import vs DirectQuery — how do you choose?" → Import for speed and full DAX support on data up to a few hundred MB–GB with acceptable refresh cadence; DirectQuery when data volume or freshness rules out import, accepting slower visuals and query folding limits.</div>`
    },
    {
      id: "b2",
      title: "Star schema and data modelling",
      minutes: 15,
      lede: "Fact vs dimension tables, grain, why the flat table fails, relationship direction and the date table.",
      body: `
<h3>Star schema</h3>
<pre><code>        DimDate
           |
DimProduct — FactSales — DimCustomer
           |
       DimRegion

FactSales: order_id, date_key, product_key, customer_key,
           qty, unit_price, discount, revenue, cost
</code></pre>
<ul>
  <li><strong>Fact table</strong> — events/transactions, numeric measures, foreign keys, many rows.</li>
  <li><strong>Dimension table</strong> — descriptive attributes, one row per entity, few rows.</li>
  <li><strong>Grain</strong> — what one fact row represents. Define it explicitly: "one row per order line".</li>
</ul>

<h3>Why not one big flat table</h3>
<table>
  <tr><th>Flat table</th><th>Star schema</th></tr>
  <tr><td>Duplicated attributes, huge file</td><td>Compact dimensions, compresses well</td></tr>
  <tr><td>Filtering one column crosses all rows</td><td>Filters propagate from small dims</td></tr>
  <tr><td>Hard to add a new dimension</td><td>Add a table + relationship</td></tr>
  <tr><td>Aggregates can double count</td><td>Clean one-to-many flows</td></tr>
</table>

<h3>Relationships</h3>
<pre><code>DimCustomer[CustomerKey]  1 ──── *  FactSales[CustomerKey]
filter flows one way: dimension → fact
</code></pre>
<ul>
  <li>One-to-many, single direction is the default and the goal.</li>
  <li>Bidirectional filtering only for specific bridge cases — it creates ambiguity and slow queries.</li>
  <li>Many-to-many requires a bridge table with distinct keys.</li>
  <li>Inactive relationships are activated in DAX with <code>USERELATIONSHIP</code>.</li>
</ul>

<h3>Date table — mandatory</h3>
<pre><code>DimDate =
ADDCOLUMNS(
    CALENDAR(DATE(2024,1,1), DATE(2026,12,31)),
    "Year", YEAR([Date]),
    "Month", FORMAT([Date], "mmm"),
    "MonthNo", MONTH([Date]),
    "Quarter", "Q" &amp; QUARTER([Date]),
    "YearMonth", FORMAT([Date], "yyyy-mm"),
    "IsWeekend", WEEKDAY([Date], 2) &gt; 5
)
-- Mark as date table; relate DimDate[Date] 1→* FactSales[OrderDate]</code></pre>
<p>Time intelligence (<code>TOTALYTD</code>, <code>SAMEPERIODLASTYEAR</code>) only works correctly with a proper marked date table.</p>

<h3>Snowflake vs star</h3>
<p>Normalised dimensions (product → category table) are a snowflake. Flatten them into one dimension in Power Query. Power BI performs best with a pure star.</p>
<div class="callout interview"><b>Interview classic</b>"Explain star schema and why it improves performance." → Small dimension tables filter large fact tables through simple one-to-many relationships; the engine scans fewer, narrower tables, compression is better, and DAX filter propagation is predictable. Flat tables duplicate attributes and break filter semantics.</div>`
    },
    {
      id: "b3",
      title: "Power Query: cleaning and shaping",
      minutes: 14,
      lede: "The transformation steps that solve 90% of real data: unpivot, merge, split, type, and query folding.",
      body: `
<h3>Applied steps</h3>
<p>Every action is recorded in the Applied Steps pane and written as M code. Order matters — filter and remove columns as early as possible.</p>
<pre><code>let
    Source = Excel.Workbook(File.Contents("C:\\data\\sales.xlsx"), null, true),
    Sheet  = Source{[Item="Sales",Kind="Sheet"]}[Data],
    Promoted = Table.PromoteHeaders(Sheet, [PromoteAllScalars=true]),
    Typed  = Table.TransformColumnTypes(Promoted,
               {{"OrderDate", type date}, {"Amount", type number}}),
    Filtered = Table.SelectRows(Typed, each [Amount] &lt;&gt; null and [Amount] &gt; 0),
    Renamed  = Table.RenameColumns(Filtered, {{"Amt", "Amount"}})
in
    Renamed</code></pre>

<h3>Unpivot — wide to long</h3>
<pre><code>Input:  Region | Jan | Feb | Mar
        West   | 100 | 120 | 90

Select Region → Transform → Unpivot Other Columns

Output: Region | Attribute | Value
        West   | Jan       | 100
        West   | Feb       | 120</code></pre>
<p>This is the single most useful Power Query move. BI tools want long data.</p>

<h3>Merge and append</h3>
<table>
  <tr><th>Operation</th><th>Effect</th></tr>
  <tr><td>Merge queries</td><td>Join columns horizontally (like SQL JOIN)</td></tr>
  <tr><td>Append queries</td><td>Stack rows vertically (like UNION ALL)</td></tr>
</table>
<pre><code>Merged = Table.NestedJoin(Orders, {"CustomerID"},
                          Customers, {"ID"}, "Cust", JoinKind.LeftOuter),
Expanded = Table.ExpandTableColumn(Merged, "Cust", {"Name", "Segment"})</code></pre>

<h3>Common cleaning recipes</h3>
<pre><code>Split column by delimiter        "2026-Q3" → 2026, Q3
Replace values                   "-" → null
Trim / Clean                     remove whitespace, non-printables
Fill down                        spread a header value into blank rows
Group by                         pre-aggregate to reduce model size
Remove duplicates                on a business key
Change type with locale          handles 1.234,56 vs 1,234.56</code></pre>

<h3>Query folding</h3>
<p>When the source is a database, Power Query translates steps into SQL and lets the server do the work. Steps that break folding (adding an index, some custom columns) force local processing and slow refresh. Check <em>View → Query Dependencies</em> or right-click a step → <em>View Native Query</em>.</p>
<div class="callout interview"><b>Interview classic</b>"The refresh takes 40 minutes. What do you check?" → Query folding, row counts pulled before filtering, unnecessary columns, expensive custom columns, and whether incremental refresh can be enabled on the fact table.</div>`
    },
    {
      id: "b4",
      title: "DAX fundamentals",
      minutes: 16,
      lede: "Calculated columns vs measures, CALCULATE, filter context, and the patterns you write every day.",
      body: `
<h3>Column or measure?</h3>
<table>
  <tr><th>Calculated column</th><th>Measure</th></tr>
  <tr><td>Computed row by row, stored</td><td>Computed at query time</td></tr>
  <tr><td>Increases model size</td><td>No storage cost</td></tr>
  <tr><td>Usable on axes, slicers, relationships</td><td>Only in values/tooltips</td></tr>
  <tr><td>Use for attributes and segmentation</td><td>Use for aggregations and ratios</td></tr>
</table>
<p>Default to measures. Add a column only when you need it to slice or filter.</p>

<h3>Basic measures</h3>
<pre><code>Revenue = SUM(FactSales[Revenue])
Orders  = DISTINCTCOUNT(FactSales[OrderID])
AOV     = DIVIDE([Revenue], [Orders])            -- safe divide
Margin% = DIVIDE([Revenue] - [Cost], [Revenue])
</code></pre>
<p><code>DIVIDE</code> returns blank on zero instead of an error; always prefer it to <code>/</code>.</p>

<h3>Filter context and CALCULATE</h3>
<pre><code>CALCULATE( &lt;expression&gt;, &lt;filter1&gt;, &lt;filter2&gt; ... )</code></pre>
<pre><code>Revenue West = CALCULATE([Revenue], DimRegion[Region] = "West")

Revenue All  = CALCULATE([Revenue], REMOVEFILTERS())
% of Total   = DIVIDE([Revenue], CALCULATE([Revenue], REMOVEFILTERS(DimProduct)))

Online Only  = CALCULATE([Revenue], FactSales[Channel] = "Online")</code></pre>
<p>Every visual supplies a filter context: the slices of data relevant to that cell. <code>CALCULATE</code> replaces parts of it. This one concept explains most "why is my number wrong" questions.</p>

<h3>Time intelligence</h3>
<pre><code>Revenue YTD  = TOTALYTD([Revenue], DimDate[Date])
Revenue LY   = CALCULATE([Revenue], SAMEPERIODLASTYEAR(DimDate[Date]))
Revenue MoM  = [Revenue] - CALCULATE([Revenue], DATEADD(DimDate[Date], -1, MONTH))
YoY %        = DIVIDE([Revenue] - [Revenue LY], [Revenue LY])

Rolling 30d  = CALCULATE([Revenue],
                 DATESINPERIOD(DimDate[Date], MAX(DimDate[Date]), -30, DAY))</code></pre>

<h3>Iterators and variables</h3>
<pre><code>Avg Basket = AVERAGEX(
    VALUES(FactSales[OrderID]),
    CALCULATE(SUM(FactSales[Revenue]))
)

Revenue per Customer =
VAR Total = [Revenue]
VAR Customers = DISTINCTCOUNT(DimCustomer[CustomerKey])
RETURN DIVIDE(Total, Customers)</code></pre>

<h3>Common traps</h3>
<ul>
  <li>Summing a pre-averaged column — averages do not sum.</li>
  <li>Using a calculated column for a ratio, then aggregating it (weighted wrong).</li>
  <li>Forgetting that a bare column reference in <code>CALCULATE</code> applies to the expanded table; use a dimension column.</li>
  <li>Bidirectional relationships causing ambiguous filter paths.</li>
</ul>
<div class="callout interview"><b>Interview classic</b>"Difference between a calculated column and a measure?" plus "What does CALCULATE do?" → Column is row-level and stored; measure is an aggregate evaluated in filter context. CALCULATE evaluates an expression in a modified filter context — it is the most important function in DAX.</div>`
    },
    {
      id: "b5",
      title: "Reports, visuals and interactivity",
      minutes: 13,
      lede: "Report design, slicers, drill-through, bookmarks, tooltips, RLS and publication pragmatics.",
      body: `
<h3>Layout</h3>
<pre><code>Page 1  Executive summary   4-6 KPI cards, one trend, one breakdown
Page 2  Detail              matrix, filters, drill-through target
Page 3  Exception list      top/bottom N table with conditional formatting</code></pre>
<ul>
  <li>Reading order: top-left headline → trend → breakdown → detail.</li>
  <li>Max 6–8 visuals per page. If you need more, add a page.</li>
  <li>Align and distribute; consistent font sizes for titles, labels and data.</li>
</ul>

<h3>Interactivity toolkit</h3>
<table>
  <tr><th>Feature</th><th>Use</th></tr>
  <tr><td>Slicers</td><td>Filter by date, region, channel</td></tr>
  <tr><td>Cross-highlighting</td><td>Click a bar, other visuals respond</td></tr>
  <tr><td>Drill-through</td><td>Right-click a category → detail page for it</td></tr>
  <tr><td>Drill-down</td><td>Year → quarter → month inside one visual</td></tr>
  <tr><td>Bookmarks</td><td>Save a filter state; build navigation buttons</td></tr>
  <tr><td>Tooltips page</td><td>Custom hover panel with a mini chart</td></tr>
  <tr><td>What-if parameter</td><td>Scenario sliders driving measures</td></tr>
</table>

<h3>Row-level security</h3>
<pre><code>-- role "RegionManager" on DimRegion
[Region] = LOOKUPVALUE(
    DimUser[Region],
    DimUser[Email], USERPRINCIPALNAME()
)</code></pre>
<p>Test with <em>Modeling → View as role</em>. In the Service, assign members to the role in the dataset's security settings.</p>

<h3>Publishing practicalities</h3>
<ul>
  <li>Publish to a workspace, then build an app for consumers.</li>
  <li>Schedule refresh; set failure notifications.</li>
  <li>Use deployment pipelines for dev → test → prod.</li>
  <li>Apply sensitivity labels to datasets holding personal data.</li>
  <li>Document measures in a "Data dictionary" page inside the report.</li>
</ul>

<h3>Conditional formatting</h3>
<pre><code>Colour scale on a matrix value field
Icons for variance vs target
Data bars in tables for magnitude
Rule: if actual &lt; target then red -&gt; use a measure returning a colour
</code></pre>
<div class="callout warn"><b>Do not</b>Put 12 slicers on one page. Group filters in a collapsible panel, and set defaults so the first view is already meaningful.</div>
<div class="callout interview"><b>Interview classic</b>"How do you stop a regional manager seeing other regions' data?" → RLS role with a filter on the dimension keyed to <code>USERPRINCIPALNAME()</code>, mapped through a user table; test with View as role and verify in the Service that dataset security is enforced for app consumers.</div>`
    },
    {
      id: "b6",
      title: "Excel to Power BI: the analyst's bridge",
      minutes: 12,
      lede: "PivotTables, Power Query in Excel, XLOOKUP, and how the same work looks in both tools.",
      body: `
<h3>PivotTable — the mental model</h3>
<pre><code>Rows:    Region, Category
Columns: Year
Values:  Sum of Revenue
Filters: Channel

→ the same split-apply-combine as groupby and GROUP BY</code></pre>
<p>Add a PivotChart, then <em>Show Values As → % of Grand Total</em> to get share-of-total without formulas.</p>

<h3>Lookup functions</h3>
<pre><code>=XLOOKUP(A2, Products[SKU], Products[Price], "Not found")
=VLOOKUP(A2, Products!A:D, 4, FALSE)      -- legacy, exact match only
=INDEX(Products[Price], MATCH(A2, Products[SKU], 0))   -- legacy flexible

=SUMIFS(Sales[Revenue], Sales[Region], "West", Sales[Year], 2026)
=COUNTIFS(Sales[Status], "Completed")
=IFERROR(A2/B2, 0)</code></pre>

<h3>Table hygiene</h3>
<ul>
  <li>One header row, no merged cells, no blank rows.</li>
  <li>Format as a Table (<kbd>Ctrl</kbd>+<kbd>T</kbd>) so ranges grow automatically.</li>
  <li>Never mix text and numbers in a column; watch for numbers stored as text (green triangle).</li>
  <li>Dates as real dates, not strings.</li>
</ul>

<h3>Power Query in Excel</h3>
<p>Data → Get Data does the same transformation work as in Power BI, and the queries can be copied between the two. Anything you shape in Excel's Power Query can be reused in Power BI Desktop — a strong reason to clean in Power Query rather than with 40 helper columns.</p>

<h3>Same task, three tools</h3>
<table>
  <tr><th>Task</th><th>Excel</th><th>SQL</th><th>pandas</th></tr>
  <tr><td>Total by region</td><td>PivotTable</td><td><code>GROUP BY region</code></td><td><code>groupby("region").sum()</code></td></tr>
  <tr><td>Join two tables</td><td>XLOOKUP</td><td><code>LEFT JOIN</code></td><td><code>merge(how="left")</code></td></tr>
  <tr><td>Rank</td><td><code>RANK.EQ</code></td><td><code>RANK() OVER</code></td><td><code>rank()</code></td></tr>
  <tr><td>Running total</td><td>SUM with expanding range</td><td><code>SUM() OVER (ORDER BY)</code></td><td><code>cumsum()</code></td></tr>
</table>
<div class="callout interview"><b>Interview classic</b>"Why move from Excel to Power BI?" → Volume and refresh: Excel is limited to ~1M rows and manual refresh; Power BI has a compressed model, scheduled refresh, central sharing, RLS and audit. Excel stays better for ad-hoc modelling and quick what-ifs.</div>`
    }
  ]
}
);
