/* Curriculum data — sources: GeeksforGeeks Data Analytics Tutorial (syllabus structure) + Microsoft Learn Data Analyst career path (Power BI outcome skills). */
window.CURRICULUM = window.CURRICULUM || [];

window.CURRICULUM.push(
{
  id: "foundations",
  track: "core",
  icon: "◉",
  title: "Foundations of Data Analytics",
  blurb: "What analysts actually do, the four types of analytics, the analysis lifecycle and how the role differs from data science and data engineering.",
  lessons: [
    {
      id: "f1",
      title: "What is data analytics?",
      minutes: 12,
      lede: "Data analytics is the systematic process of examining, cleaning, transforming and interpreting data to discover useful information, inform conclusions and support decision-making.",
      body: `
<h3>The working definition</h3>
<p>Data analytics is a <strong>process</strong>, not a tool. It begins with a question, not with a dataset. The output is never a chart for its own sake — it is a <em>decision</em> that is better because of the analysis.</p>
<p>A practical definition you can use in an interview:</p>
<div class="callout"><b>Say this</b>"Data analytics is the discipline of turning raw, messy data into decisions. It covers the full loop — defining the question, sourcing and cleaning data, exploring it, modelling or summarizing it, and communicating the result to someone who will act on it."</div>

<h3>Why companies pay for it</h3>
<ul>
  <li><strong>E-commerce:</strong> real-time sales and inventory data drive dynamic pricing and demand forecasting.</li>
  <li><strong>Banking:</strong> transaction streams are scored in real time to detect and block fraudulent payments.</li>
  <li><strong>Healthcare:</strong> readmission patterns identify patients needing follow-up care.</li>
  <li><strong>Marketing:</strong> attribution models show which channels actually create revenue rather than clicks.</li>
</ul>

<h3>The four types of analytics</h3>
<table>
  <tr><th>Type</th><th>Question it answers</th><th>Typical tools</th><th>Example</th></tr>
  <tr><td>Descriptive</td><td>What happened?</td><td>SQL, Excel, Power BI</td><td>Monthly revenue fell 8% in the West region.</td></tr>
  <tr><td>Diagnostic</td><td>Why did it happen?</td><td>SQL drill-down, correlation, EDA</td><td>Churn rose after a pricing change in March.</td></tr>
  <tr><td>Predictive</td><td>What will happen?</td><td>Regression, forecasting, ML</td><td>Churn is likely to be 12% next quarter.</td></tr>
  <tr><td>Prescriptive</td><td>What should we do?</td><td>Optimization, simulation, A/B tests</td><td>Offer a 15% renewal discount to 4,200 at-risk accounts.</td></tr>
</table>
<p>Most analyst jobs live in <strong>descriptive + diagnostic</strong>, with predictive and prescriptive work increasing with seniority. Interviewers love this framework — be ready to place any problem you are given into one of the four buckets.</p>

<h3>What the day actually looks like</h3>
<ol>
  <li><strong>15%</strong> — understanding the business question and stakeholders.</li>
  <li><strong>50–60%</strong> — finding, joining and cleaning data.</li>
  <li><strong>15%</strong> — analyzing and validating.</li>
  <li><strong>10–20%</strong> — communicating: dashboards, memos, slides, and follow-up questions.</li>
</ol>
<div class="callout warn"><b>Reality check</b>If you expect to spend your day building fancy models, you will be surprised. The value of a good analyst is judgment about which numbers deserve trust and which question is actually worth answering.</div>

<h3>Skills that get you hired</h3>
<ul>
  <li><strong>SQL</strong> — the single most-tested skill. Expect joins, aggregation and window functions in every technical screen.</li>
  <li><strong>Spreadsheets</strong> — still the lingua franca of business; pivot tables and lookups are assumed.</li>
  <li><strong>Python or R</strong> — pandas for cleaning and analysis, matplotlib/seaborn for charts.</li>
  <li><strong>A BI tool</strong> — Power BI (Microsoft stack) or Tableau (widely used).</li>
  <li><strong>Statistics</strong> — distributions, hypothesis testing, confidence intervals, correlation vs causation.</li>
  <li><strong>Communication</strong> — structuring a finding as Situation → Insight → Recommendation.</li>
</ul>
<div class="callout interview"><b>Interview classic</b>"What is the difference between data analytics and data science?" → Analytics explains and communicates what happened and why; data science builds predictive models and products, requiring deeper maths, engineering and ML. Both share the data-wrangling core.</div>`
    },
    {
      id: "f2",
      title: "The analytics lifecycle, end to end",
      minutes: 14,
      lede: "Six stages that every real project passes through — and the questions an interviewer will ask at each one.",
      body: `
<h3>Stage 1 — Ask</h3>
<p>Translate a vague business request into a testable question. "Marketing says engagement is down, look into it" is not a question. Better: "Has 7-day retention for users acquired via paid social dropped since the June campaign, and if so for which cohorts?"</p>
<p>Define up front: the <strong>metric</strong>, the <strong>population</strong>, the <strong>time window</strong>, the <strong>decision</strong> that will be made, and the <strong>stakeholder</strong> who decides. If you cannot name the decision, the analysis is probably not worth doing.</p>

<h3>Stage 2 — Acquire</h3>
<p>Find where the data lives: production databases, a warehouse (BigQuery / Snowflake / Redshift), CSV exports, APIs, or a CRM. Check three things before trusting it:</p>
<ul>
  <li><strong>Grain</strong> — what does one row represent? One order, one line item, one day per product?</li>
  <li><strong>Coverage</strong> — which dates and segments are included? Is history complete?</li>
  <li><strong>Freshness</strong> — how often does it update, and is there a lag?</li>
</ul>

<h3>Stage 3 — Clean</h3>
<p>Typically the largest time sink. Standard checklist: duplicates, missing values, inconsistent categories ("USA", "U.S.", "United States"), wrong types (dates stored as text), outliers, and referential integrity across tables.</p>
<pre><code>import pandas as pd
df = pd.read_csv("orders.csv", parse_dates=["order_date"])
print(df.shape, df.dtypes)
print(df.isna().sum().sort_values(ascending=False).head(10))
print(df.duplicated(subset=["order_id"]).sum())</code></pre>

<h3>Stage 4 — Explore (EDA)</h3>
<p>Univariate first (distributions, missingness), then bivariate (relationships, segments), then multivariate (interactions). Make a note of every anomaly — unexplained spikes are usually data bugs, not insights.</p>

<h3>Stage 5 — Analyse &amp; model</h3>
<p>Choose the simplest technique that answers the question: aggregation, cohort analysis, funnel, regression, or a statistical test. Always sanity-check with a second method and a hand calculation on 5 rows.</p>

<h3>Stage 6 — Communicate &amp; monitor</h3>
<p>A finding nobody acts on has zero business value. Structure the deliverable as:</p>
<ol>
  <li><strong>Headline</strong> — the one-sentence answer.</li>
  <li><strong>Evidence</strong> — 2–3 charts maximum, each with a stated takeaway in the title.</li>
  <li><strong>So what</strong> — recommended action and expected impact.</li>
  <li><strong>Caveats</strong> — known data limitations and confidence level.</li>
</ol>
<p>Then instrument the metric so the business can monitor it after you leave. A dashboard with no owner decays into a lie within a quarter.</p>

<h3>The loop is a loop</h3>
<div class="callout"><b>Remember</b>Real projects loop backward constantly: EDA reveals the data is wrong, which sends you back to acquire; communication reveals the question was misunderstood, which sends you back to ask. Interviewers respect candidates who name the loop rather than presenting a straight line.</div>
<div class="callout interview"><b>Interview classic</b>"Walk me through how you'd approach analysing why user signups dropped 20% last week." Structure your answer through the six stages, and explicitly state assumptions and validation steps — they are testing process, not the final number.</div>`
    },
    {
      id: "f3",
      title: "Data types, sources and storage",
      minutes: 13,
      lede: "Structured vs semi-structured vs unstructured data, and the systems an analyst queries — OLTP, OLAP, warehouses and lakes.",
      body: `
<h3>Three shapes of data</h3>
<table>
  <tr><th>Shape</th><th>Description</th><th>Storage</th><th>Analyst tool</th></tr>
  <tr><td>Structured</td><td>Rows and columns with a fixed schema</td><td>Relational DB, warehouse</td><td>SQL</td></tr>
  <tr><td>Semi-structured</td><td>Self-describing but flexible (JSON, XML, logs)</td><td>Document store, lake</td><td>SQL with JSON functions, Python</td></tr>
  <tr><td>Unstructured</td><td>Text, images, audio, video</td><td>Object storage, lake</td><td>Python / NLP tools</td></tr>
</table>

<h3>Data types you must recognise</h3>
<ul>
  <li><strong>Nominal</strong> — unordered categories (country, colour). Counts and modes only.</li>
  <li><strong>Ordinal</strong> — ordered categories (satisfaction 1–5). Median is valid; mean is arguable.</li>
  <li><strong>Interval</strong> — numeric, no true zero (temperature °C). Differences are meaningful, ratios are not.</li>
  <li><strong>Ratio</strong> — numeric with a true zero (revenue, height). All arithmetic is valid.</li>
  <li><strong>Discrete vs continuous</strong> — countable (orders) vs measurable (time spent).</li>
</ul>
<p>Choosing the wrong type ruins the analysis: averaging an ordinal scale, or treating a postal code as a number, is a classic beginner error and a favourite interview trap.</p>

<h3>OLTP vs OLAP</h3>
<table>
  <tr><th></th><th>OLTP</th><th>OLAP</th></tr>
  <tr><td>Purpose</td><td>Run the business</td><td>Analyse the business</td></tr>
  <tr><td>Operations</td><td>Many small inserts/updates</td><td>Few large reads and aggregations</td></tr>
  <tr><td>Schema</td><td>Normalized (3NF)</td><td>Star / snowflake</td></tr>
  <tr><td>Example</td><td>Order system, ATM</td><td>Warehouse reporting</td></tr>
</table>

<h3>Where analysis data lives</h3>
<ul>
  <li><strong>Data warehouse</strong> (Snowflake, BigQuery, Redshift, Synapse) — structured, modelled, query-optimized. The analyst's home.</li>
  <li><strong>Data lake</strong> (S3, ADLS) — raw files of any format, cheap, schema-on-read.</li>
  <li><strong>Lakehouse</strong> (Databricks, Fabric) — lake storage with warehouse-style tables (Delta, Iceberg).</li>
  <li><strong>Data mart</strong> — a subject-specific slice of the warehouse, e.g. marketing mart.</li>
</ul>

<h3>Star schema in one minute</h3>
<p>A <strong>fact table</strong> holds events and measures (one row per order line: quantity, price, keys). <strong>Dimension tables</strong> hold descriptive context (customer, product, date, store). This shape makes aggregation fast and filters intuitive — and it is exactly the model Power BI expects.</p>
<pre><code>fact_sales(order_line_id, date_key, product_key, customer_key, qty, net_amount)
dim_product(product_key, name, category, subcategory, brand)
dim_date(date_key, date, year, quarter, month, weekday, is_holiday)</code></pre>
<div class="callout interview"><b>Interview classic</b>"What is the difference between a data warehouse and a data lake?" → Warehouse: structured, schema-on-write, optimized for SQL reporting. Lake: raw and flexible, schema-on-read, cheap, needs engineering to be query-ready. Lakehouse blends both.</div>`
    },
    {
      id: "f4",
      title: "Data analyst vs scientist vs engineer",
      minutes: 10,
      lede: "The three roles overlap heavily, but the deliverables, tools and interview bars differ. Know exactly where you fit.",
      body: `
<h3>One-line definitions</h3>
<ul>
  <li><strong>Data analyst</strong> — answers business questions with existing data; delivers dashboards, reports and recommendations. Tools: SQL, Excel, BI, some Python.</li>
  <li><strong>Data scientist</strong> — builds statistical and ML models to predict or classify; often owns experimentation design. Tools: Python/R, ML libraries, statistics.</li>
  <li><strong>Data engineer</strong> — builds and maintains the pipelines and storage that make data available and trustworthy. Tools: Python, SQL, Spark, orchestration, cloud.</li>
</ul>

<h3>Comparison table</h3>
<table>
  <tr><th></th><th>Analyst</th><th>Scientist</th><th>Engineer</th></tr>
  <tr><td>Primary output</td><td>Insight, dashboard, decision</td><td>Model, experiment result</td><td>Reliable pipelines, tables</td></tr>
  <tr><td>Core skill</td><td>SQL + communication</td><td>Statistics + ML</td><td>Software + data systems</td></tr>
  <tr><td>Time horizon</td><td>Now / last quarter</td><td>Forward-looking</td><td>Infrastructure</td></tr>
  <tr><td>Code depth</td><td>Moderate</td><td>High</td><td>Very high</td></tr>
  <tr><td>Success metric</td><td>Decisions improved</td><td>Model lift / accuracy</td><td>Uptime, freshness, cost</td></tr>
</table>

<h3>Where the boundaries blur</h3>
<p>In smaller companies one person does all three. Titles vary wildly: "product analyst" often means SQL + experimentation, "BI developer" means heavy Power BI/Tableau modelling, "analytics engineer" means SQL/dbt transformations between engineer and analyst.</p>
<div class="callout"><b>Career ladder</b>Junior analyst → analyst → senior analyst → lead/manager, or a lateral move into analytics engineering, data science or product management. The most common pivot from analyst to scientist is deepening experimentation and causal inference skills.</div>

<h3>Answering "why analytics?"</h3>
<p>Interviewers ask this to test motivation, not vocabulary. A strong answer names a concrete moment: "I built a churn view for a student club and found that members who attended two events in week one were three times more likely to renew, which changed how we onboarded people." Specificity beats ambition.</p>
<div class="callout interview"><b>Interview classic</b>"Which role do you want and why?" → Show you understand the analyst role is about decision support and stakeholder trust. Mentioning that you enjoy translating ambiguous questions into measurable analysis signals maturity.</div>`
    },
    {
      id: "f5",
      title: "Metrics, KPIs and business vocabulary",
      minutes: 15,
      lede: "Revenue, churn, CAC, LTV, DAU/MAU, conversion, retention — the language your stakeholders speak and your interviewers test.",
      body: `
<h3>What makes a good metric</h3>
<p>A metric must be <strong>specific</strong>, <strong>measurable</strong>, <strong>actionable</strong> and <strong>owned</strong>. If nobody can change their behaviour based on a number, it is trivia, not a KPI.</p>

<h3>The core business metrics</h3>
<table>
  <tr><th>Metric</th><th>Formula</th><th>Watch out for</th></tr>
  <tr><td>Revenue</td><td>Σ(price × quantity) − discounts</td><td>Gross vs net; refunds; currency</td></tr>
  <tr><td>Gross margin</td><td>(Revenue − COGS) / Revenue</td><td>Excludes operating costs</td></tr>
  <tr><td>Conversion rate</td><td>Conversions / Visitors</td><td>Define the denominator precisely</td></tr>
  <tr><td>AOV</td><td>Revenue / Orders</td><td>Skewed by bulk buyers</td></tr>
  <tr><td>Churn rate</td><td>Lost customers / Starting customers</td><td>Logo vs revenue churn differ hugely</td></tr>
  <tr><td>CAC</td><td>Sales &amp; marketing spend / New customers</td><td>Blended vs paid-only</td></tr>
  <tr><td>LTV</td><td>ARPU × gross margin / churn rate</td><td>Assumes stable churn; discount it</td></tr>
  <tr><td>LTV:CAC</td><td>LTV / CAC</td><td>Target ≈ 3:1 for SaaS</td></tr>
  <tr><td>DAU/MAU</td><td>Daily actives / Monthly actives</td><td>Definition of "active" is the whole game</td></tr>
  <tr><td>Retention (Dn)</td><td>Users active on day n / cohort size</td><td>Cohort must be fixed at signup</td></tr>
</table>

<h3>Leading vs lagging indicators</h3>
<p><strong>Lagging</strong> metrics tell you what already happened (revenue, churn). <strong>Leading</strong> metrics predict it (trial starts, feature adoption, support ticket volume). Good dashboards show both: leading metrics are where you can still act.</p>

<h3>North-star metric</h3>
<p>A single metric that best captures delivered customer value, e.g. "weekly orders delivered on time" for a grocery app, or "nights booked" for Airbnb. It must be movable by teams and correlated with long-term revenue. Interview question: "What would you make the north-star metric for our product, and why?" — always justify with the value the customer receives.</p>

<h3>Vanity metrics</h3>
<p>Page views, registered users and total downloads only ever go up. They feel good and inform nothing. Replace them with ratios and cohort-based measures.</p>

<h3>Segmenting a metric</h3>
<p>Never report a headline number without a segment view. A flat overall conversion rate can hide a collapsing mobile funnel offset by a booming desktop one. Standard cuts: channel, device, geography, new vs returning, plan tier, acquisition cohort.</p>
<div class="callout interview"><b>Interview classic</b>"DAU dropped 5% overnight — how do you investigate?" → Confirm the data pipeline first (is it real?), then break down by platform, version, geography, acquisition channel and time-of-day; compare with the same weekday last week; check for releases, outages or tracking changes; then read qualitative signals (support tickets, app-store reviews).</div>`
    },
    {
      id: "f6",
      title: "The analyst's toolkit & environment",
      minutes: 11,
      lede: "Set up a working environment: Python, Jupyter, SQL clients, BI tools, version control, and a repeatable project folder structure.",
      body: `
<h3>Install the core stack</h3>
<pre><code># Python 3.11+ recommended
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\\Scripts\\activate

pip install pandas numpy matplotlib seaborn plotly
pip install jupyterlab sqlalchemy openpyxl
pip install scipy statsmodels scikit-learn</code></pre>
<p>Use a virtual environment per project. Loosely installing packages globally is how "it worked yesterday" stories begin.</p>

<h3>Connecting to a database from Python</h3>
<pre><code>from sqlalchemy import create_engine
import pandas as pd

engine = create_engine("postgresql+psycopg2://user:pw@localhost:5432/analytics")
df = pd.read_sql("SELECT * FROM fact_sales WHERE order_date >= '2026-01-01'", engine)</code></pre>
<div class="callout warn"><b>Never do this</b>Do not build SQL by string-concatenating user input — it is a SQL injection risk and breaks on quotes. Use bound parameters (<code>pd.read_sql(sql, engine, params={...})</code>) or an ORM.</div>

<h3>A project folder that scales</h3>
<pre><code>project/
├── data/
│   ├── raw/           # never edited, never overwritten
│   └── processed/     # outputs of cleaning scripts
├── notebooks/         # exploratory work, numbered 01_, 02_
├── sql/               # saved queries, one file per question
├── src/               # reusable functions
├── reports/           # final dashboards, exports, slides
├── README.md          # question, data dictionary, how to run
└── requirements.txt</code></pre>
<p>Rule of thumb: <strong>raw data is immutable</strong>. Every transformation is code that can be re-run. That is what makes an analysis reproducible — and reproducibility is the difference between an analyst and someone who clicks around in Excel.</p>

<h3>Version control for analysts</h3>
<pre><code>git init
git add .
git commit -m "Add churn cohort analysis v1"
# .gitignore should include:
# data/raw/  .venv/  __pycache__/  .ipynb_checkpoints/  *.pbix</code></pre>
<p>Commit notebooks with outputs cleared, or better, move logic into <code>.py</code> files and keep notebooks thin. Recruiters do look at GitHub — a clean repo with a README is worth more than ten screenshots.</p>

<h3>BI tools and licences</h3>
<ul>
  <li><strong>Power BI Desktop</strong> — free on Windows; publishing needs a work/school account (a free Microsoft 365 Developer account works for practice).</li>
  <li><strong>Tableau Public</strong> — free, but every workbook you save is public. Great for portfolio, unusable for confidential data.</li>
  <li><strong>Looker Studio</strong> — free, browser-based, good with Google Sheets and BigQuery.</li>
</ul>
<div class="callout interview"><b>Interview classic</b>"How do you ensure your analysis is reproducible?" → Immutable raw data, code-based transformations, version control, documented data dictionary, and a README with exact steps to re-run.</div>`
    }
  ]
},

{
  id: "excel",
  track: "core",
  icon: "▦",
  title: "Excel for Analysts",
  blurb: "The tool that still runs most of the business world: formulas, lookups, pivot tables, cleaning, and dashboard building.",
  lessons: [
    {
      id: "e1",
      title: "Structure, references and the golden rules",
      minutes: 12,
      lede: "Most Excel disasters are structural. Learn the layout rules that keep models auditable before touching a single formula.",
      body: `
<h3>The golden rules of a data table</h3>
<ol>
  <li><strong>One header row</strong>, one row per record, no merged cells, no blank rows.</li>
  <li><strong>No totals inside the data</strong> — keep summary rows in a separate sheet.</li>
  <li><strong>One data type per column</strong> — dates as dates, numbers as numbers.</li>
  <li><strong>No colours as data.</strong> Highlighting a row green is not a status field.</li>
  <li><strong>Convert to a Table</strong> (<code>Ctrl+T</code>) so ranges expand automatically and formulas stay readable.</li>
</ol>

<h3>Cell references</h3>
<table>
  <tr><th>Reference</th><th>Behaviour when copied</th><th>Use for</th></tr>
  <tr><td><code>A1</code></td><td>Row and column both move</td><td>Relative calculations</td></tr>
  <tr><td><code>$A$1</code></td><td>Fixed</td><td>Constants, tax rates, parameter cells</td></tr>
  <tr><td><code>$A1</code></td><td>Column fixed</td><td>Lookup key columns</td></tr>
  <tr><td><code>A$1</code></td><td>Row fixed</td><td>Header row references</td></tr>
</table>
<p>Press <code>F4</code> while editing to cycle the dollar signs. Mastering absolute references removes 80% of "#REF!" pain.</p>

<h3>Named ranges and delegation</h3>
<ul>
  <li>Name key inputs (<code>TaxRate</code>, <code>StartDate</code>) via Formulas → Define Name. Formulas become self-documenting.</li>
  <li>Separate <strong>Inputs</strong>, <strong>Calculations</strong> and <strong>Outputs</strong> sheets. Never mix them.</li>
  <li>Colour convention: blue font = hard-coded input, black = formula, green = link to another sheet. State the convention in a legend.</li>
</ul>

<h3>Fast navigation and selection</h3>
<pre><code>Ctrl + Arrow        jump to edge of data block
Ctrl + Shift + Arrow select to edge
Ctrl + T            create Table
Alt + =             AutoSum
Ctrl + Shift + L    toggle filters
F4                  cycle absolute reference (while editing)
Ctrl + ~            show all formulas
Ctrl + PageUp/Down  switch sheets</code></pre>
<div class="callout interview"><b>Interview classic</b>"How do you keep a spreadsheet model auditable?" → Inputs/calculations/output separation, named ranges, colour conventions, no hard-coded numbers inside formulas, and a change log. Interviewers for analyst roles often ask this instead of a formula test.</div>`
    },
    {
      id: "e2",
      title: "Core formulas you must know cold",
      minutes: 16,
      lede: "SUMIFS, COUNTIFS, IF/IFS, AND/OR, error handling, text functions and date maths — with the exact pitfalls.",
      body: `
<h3>Aggregation with conditions</h3>
<pre><code>=SUMIFS(Revenue, Region, "West", Month, ">=2026-01-01")
=COUNTIFS(Status, "Closed", Priority, "High")
=AVERAGEIFS(DeliveryDays, Carrier, "DHL")</code></pre>
<p>Order of arguments: <code>SUMIFS(sum_range, criteria_range1, criteria1, ...)</code>. Note this differs from legacy <code>SUMIF(range, criteria, sum_range)</code> — a common slip under time pressure.</p>

<h3>Conditional logic</h3>
<pre><code>=IF(Revenue > 100000, "Target met", "Below target")
=IFS(Score >= 90, "A", Score >= 80, "B", Score >= 70, "C", TRUE, "F")
=IF(AND(Region="West", Sales>50000), "Priority", "Standard")
=IF(OR(Status="Cancelled", Status="Returned"), 0, Amount)
=IFERROR(VLOOKUP(A2, Rates, 2, FALSE), "Not found")</code></pre>
<p>Prefer <code>IFS</code> over nested <code>IF</code> for readability. Always wrap risky lookups in <code>IFERROR</code> so a single missing key does not break an entire dashboard.</p>

<h3>Text functions</h3>
<table>
  <tr><th>Function</th><th>Example</th><th>Result</th></tr>
  <tr><td><code>LEFT</code></td><td><code>=LEFT("INV-2026-014", 7)</code></td><td>INV-202</td></tr>
  <tr><td><code>RIGHT</code></td><td><code>=RIGHT(A2, 3)</code></td><td>last 3 chars</td></tr>
  <tr><td><code>MID</code></td><td><code>=MID(A2, 5, 4)</code></td><td>chars 5–8</td></tr>
  <tr><td><code>TEXTJOIN</code></td><td><code>=TEXTJOIN(" ", TRUE, B2, C2)</code></td><td>combines, ignores blanks</td></tr>
  <tr><td><code>TRIM</code></td><td><code>=TRIM(A2)</code></td><td>removes extra spaces</td></tr>
  <tr><td><code>SUBSTITUTE</code></td><td><code>=SUBSTITUTE(A2, "-", "")</code></td><td>removes dashes</td></tr>
  <tr><td><code>TEXT</code></td><td><code>=TEXT(A2, "0.0%")</code></td><td>formats a number as text</td></tr>
  <tr><td><code>PROPER</code></td><td><code>=PROPER("new york")</code></td><td>New York</td></tr>
</table>
<div class="callout warn"><b>Gotcha</b><code>TRIM</code> does not remove non-breaking spaces (CHAR(160)) pasted from web pages. Use <code>=TRIM(SUBSTITUTE(A2, CHAR(160), " "))</code>. This exact issue breaks lookups surprisingly often.</div>

<h3>Dates</h3>
<pre><code>=TODAY()                      current date
=DATEDIF(Start, End, "m")     whole months between
=EOMONTH(TODAY(), 0)          end of current month
=WORKDAY(TODAY(), 10)         10 business days ahead
=YEAR(A2) & "-" & TEXT(MONTH(A2),"00")   year-month key</code></pre>
<p>Excel stores dates as serial numbers, so subtracting two dates gives days. If a date will not format, it is text — fix with Data → Text to Columns or <code>DATEVALUE</code>.</p>

<h3>Rounding and division traps</h3>
<pre><code>=ROUND(Revenue, 2)
=ROUNDUP(A2, 0)
=IF(B2=0, 0, A2/B2)     guard against #DIV/0!</code></pre>
<div class="callout interview"><b>Interview classic</b>"Write a formula that counts orders above the regional average." → Either an array formula <code>=SUMPRODUCT(--(Amount>AVERAGEIF(Region,"West",Amount))*(Region="West"))</code> or, in modern Excel, <code>=COUNTIFS(Region,"West",Amount,">"&amp;AVERAGEIF(Region,"West",Amount))</code>. The second is cleaner and what most interviewers expect.</div>`
    },
    {
      id: "e3",
      title: "Lookups: VLOOKUP, INDEX-MATCH, XLOOKUP",
      minutes: 15,
      lede: "The lookup question appears in almost every Excel screen. Know which function to choose and why the other ones fail.",
      body: `
<h3>VLOOKUP</h3>
<pre><code>=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])
=VLOOKUP(A2, Products!$A$2:$D$500, 3, FALSE)</code></pre>
<p>Limitations that interviewers love to hear:</p>
<ul>
  <li>Can only look <strong>right</strong> — the key must be the first column.</li>
  <li>Column index is a hard-coded number that silently breaks if a column is inserted.</li>
  <li><code>range_lookup</code> must be <code>FALSE</code> for exact match; leaving it blank gives approximate matching and wrong answers.</li>
  <li>Returns the first match only and cannot handle duplicates predictably.</li>
</ul>

<h3>INDEX + MATCH</h3>
<pre><code>=INDEX(Products!$D$2:$D$500, MATCH(A2, Products!$A$2:$A$500, 0))</code></pre>
<ul>
  <li>Looks in any direction.</li>
  <li>Column insertion does not break it, because ranges are explicit.</li>
  <li><code>MATCH(type=0)</code> means exact match.</li>
  <li>Two-way lookup: <code>=INDEX(Data, MATCH(rowKey, RowKeys, 0), MATCH(colKey, ColKeys, 0))</code>.</li>
</ul>

<h3>XLOOKUP (Microsoft 365)</h3>
<pre><code>=XLOOKUP(A2, Products!$A$2:$A$500, Products!$D$2:$D$500, "Not found", 0, 1)</code></pre>
<p>Arguments: lookup value, lookup array, return array, [if_not_found], [match_mode 0=exact], [search_mode 1=first-to-last]. It replaces VLOOKUP, HLOOKUP, INDEX-MATCH and IFERROR in one function, and can search backwards (<code>search_mode = -1</code>).</p>

<h3>Which one to use</h3>
<table>
  <tr><th>Situation</th><th>Best choice</th></tr>
  <tr><td>Microsoft 365, straightforward</td><td>XLOOKUP</td></tr>
  <tr><td>Older Excel, need left lookup</td><td>INDEX-MATCH</td></tr>
  <tr><td>Exact match, key is column 1, quick</td><td>VLOOKUP with FALSE</td></tr>
  <tr><td>Multiple criteria</td><td>XLOOKUP on a helper key, or SUMPRODUCT / FILTER</td></tr>
  <tr><td>Return many matches</td><td>FILTER (365) or Power Query merge</td></tr>
</table>

<h3>Multiple criteria lookup</h3>
<pre><code>=XLOOKUP(1, (Region="West")*(Product="Widget"), Sales)
=FILTER(Sales, (Region="West")*(Product="Widget"), "None")</code></pre>
<div class="callout interview"><b>Interview classic</b>"Why is INDEX-MATCH better than VLOOKUP?" → Independent of column order, robust to column insertion, no hard-coded index, and faster on large ranges. Bonus point: mention XLOOKUP is now the preferred modern replacement.</div>`
    },
    {
      id: "e4",
      title: "Cleaning, validation and conditional formatting",
      minutes: 13,
      lede: "Text to Columns, Remove Duplicates, TRIM/CLEAN, Data Validation and flagging outliers with conditional formatting.",
      body: `
<h3>Typical cleaning sequence</h3>
<ol>
  <li><strong>Freeze the header</strong> and convert to a Table.</li>
  <li><strong>Remove exact duplicate rows</strong> (Data → Remove Duplicates) — but decide the subset first; duplicates by order ID may be legitimate line items.</li>
  <li><strong>Trim and clean text</strong>: <code>=TRIM(CLEAN(A2))</code> removes control characters and stray spaces.</li>
  <li><strong>Fix types</strong>: text dates → Data → Text to Columns → Date (MDY); numbers stored as text → Value/Paste Special Multiply by 1.</li>
  <li><strong>Standardize categories</strong> with a mapping table + XLOOKUP rather than nested IFs.</li>
  <li><strong>Handle blanks</strong> deliberately: filter → fill down, or set a business rule (0, "Unknown", exclude).</li>
  <li><strong>Validate</strong> the result: row count, total revenue, min/max dates before and after.</li>
</ol>

<h3>Data validation</h3>
<p>Data → Data Validation lets you constrain a column to a list, a whole number range, or a date window. Use it on <em>input</em> sheets to prevent bad data at the source. Interview point: prevention beats correction.</p>
<pre><code>Allow: List   Source: =Regions        (named range)
Allow: Whole number   between 1 and 100
Allow: Date   between =TODAY()-365 and =TODAY()
Input message: "Choose a region from the list"
Error alert: Stop</code></pre>

<h3>Conditional formatting</h3>
<ul>
  <li><strong>Highlight rules</strong> — cells &gt; / &lt; threshold, duplicates, blanks.</li>
  <li><strong>Top/Bottom N</strong> — instantly spot best and worst performers.</li>
  <li><strong>Data bars</strong> — in-cell bar charts, great for comparison tables.</li>
  <li><strong>Colour scales</strong> — heatmaps across a matrix (region × month).</li>
  <li><strong>Formula-based</strong> — <code>=$D2&lt;0.8*$E2</code> flags rows where actual is below 80% of target.</li>
</ul>
<div class="callout warn"><b>Gotcha</b>Conditional formatting applies to a range with relative references. If you write <code>$D2</code> instead of <code>D2</code>, every row checks the same cell and the whole column lights up. Anchor only what must stay fixed.</div>

<h3>Outlier flagging</h3>
<pre><code>=IF(ABS(A2-AVERAGE($A$2:$A$1000)) > 3*STDEV.S($A$2:$A$1000), "Outlier", "")
=A2 > PERCENTILE.INC($A$2:$A$1000, 0.99)</code></pre>
<p>Flagging is not deleting. Investigate: is it a legitimate large order, a data-entry error, or a different unit (cents vs dollars)?</p>
<div class="callout interview"><b>Interview classic</b>"You receive a sales export with 50,000 rows — what are your first five checks?" → Row count vs source system, duplicate keys, date range and gaps, null/blank rate per column, and category consistency; then reconcile totals to a known figure before analysing.</div>`
    },
    {
      id: "e5",
      title: "Pivot tables and pivot charts",
      minutes: 14,
      lede: "The fastest way to summarize millions of rows — plus grouping, calculated fields, slicers and % of total.",
      body: `
<h3>Anatomy</h3>
<p>Four areas: <strong>Rows</strong> (categories down the side), <strong>Columns</strong> (categories across), <strong>Values</strong> (aggregations), <strong>Filters</strong> (scope). Drag a field and Excel guesses the aggregation — always check it.</p>

<h3>Building a revenue matrix in 6 steps</h3>
<ol>
  <li>Select the data table → Insert → PivotTable → New worksheet.</li>
  <li>Rows: <em>Region</em>, then <em>Category</em>.</li>
  <li>Columns: <em>Order Date</em>, grouped by Year and Quarter.</li>
  <li>Values: <em>Net Revenue</em>, set to Sum.</li>
  <li>Show Values As → % of Grand Total (a second copy of the value field).</li>
  <li>Design → Report Layout → Tabular; repeat item labels for readability.</li>
</ol>

<h3>Grouping and calculated fields</h3>
<ul>
  <li>Right-click a date field → Group → Months/Quarters/Years.</li>
  <li>Numeric grouping: right-click values → Group → bins of 10 (great for age or price bands).</li>
  <li>Calculated field: <code>= Revenue - Cost</code>, created in PivotTable Analyze → Fields, Items &amp; Sets. Computed <em>after</em> aggregation, so ratios are correct.</li>
</ul>

<h3>Percentage and difference views</h3>
<pre><code>Show Values As → % of Column Total
Show Values As → % of Parent Row Total
Show Values As → Difference From → (previous) → Year
Show Values As → Running Total In → Month</code></pre>

<h3>Slicers and timelines</h3>
<p>Insert → Slicer gives clickable filters that work across multiple pivot tables when you use <strong>Report Connections</strong>. That is the whole secret of building an Excel dashboard: several pivots + shared slicers + charts.</p>

<h3>Common mistakes</h3>
<ul>
  <li>Counting instead of summing (the default for text fields).</li>
  <li>Forgetting to refresh after data changes (<code>Alt+F5</code>).</li>
  <li>Source range not a Table — new rows get excluded.</li>
  <li>Grouping dates but leaving the raw date field also in rows (double counting levels).</li>
  <li>Averaging an average — compute the ratio from raw sums instead.</li>
</ul>
<div class="callout interview"><b>Interview classic</b>"How would you find the top 10 customers by revenue who bought in at least 3 different months?" → Pivot with customer in rows, revenue in values, distinct count of month (Data Model required for distinct count), then filter value ≥ 3 and top 10; or do it in one SQL query with <code>HAVING COUNT(DISTINCT month) &gt;= 3</code>. Offering the SQL version shows range.</div>`
    },
    {
      id: "e6",
      title: "Excel dashboards that people trust",
      minutes: 12,
      lede: "Layout, chart selection, KPI cards and the discipline of a dashboard that answers one question per page.",
      body: `
<h3>Design before you build</h3>
<p>A dashboard is an argument, not a gallery. Define: the audience, the one decision it supports, and the 5–7 questions it must answer. Anything that does not serve those questions is deleted.</p>

<h3>Layout pattern</h3>
<pre><code>┌───────────────────────────────────────────────┐
│  Title · period · data freshness              │
├─────────┬─────────┬─────────┬─────────────────┤
│ KPI 1   │ KPI 2   │ KPI 3   │ KPI 4           │
│ value   │ value   │ value   │ value           │
│ ▲ 4.2%  │ ▼ 1.1%  │ ▲ 9.0%  │ ▼ 0.3%          │
├─────────┴─────────┴─────────┴─────────────────┤
│  Trend chart (12 months)  │  Breakdown chart  │
├───────────────────────────┴───────────────────┤
│  Detail table (top N, with sparklines)        │
└───────────────────────────────────────────────┘
Filters: date range · region · category</code></pre>

<h3>Chart choice</h3>
<table>
  <tr><th>Intent</th><th>Use</th><th>Avoid</th></tr>
  <tr><td>Compare categories</td><td>Bar (sorted)</td><td>Pie with 8 slices</td></tr>
  <tr><td>Trend over time</td><td>Line</td><td>Bar with 36 months</td></tr>
  <tr><td>Part of whole</td><td>Stacked bar, treemap</td><td>3D pie</td></tr>
  <tr><td>Distribution</td><td>Histogram, box plot</td><td>Average-only bar</td></tr>
  <tr><td>Correlation</td><td>Scatter</td><td>Dual-axis spaghetti</td></tr>
  <tr><td>Single KPI</td><td>Big number + delta</td><td>Gauge dials</td></tr>
</table>

<h3>Chart hygiene</h3>
<ul>
  <li>Title states the insight: "West region revenue down 8% in Q3", not "Revenue by region".</li>
  <li>Y-axis starts at zero for bars; line charts may zoom if labelled.</li>
  <li>Max 3–4 colours; highlight the one series that matters and grey out the rest.</li>
  <li>Kill gridlines, borders and 3D effects. Data-to-ink ratio is the whole game.</li>
  <li>Label units and currency; state the date range.</li>
</ul>

<h3>Build steps in Excel</h3>
<ol>
  <li>Clean data into a Table on a hidden <em>Data</em> sheet.</li>
  <li>Build pivots on a <em>Calc</em> sheet.</li>
  <li>Create charts from pivots, remove legends where the title explains it.</li>
  <li>Add slicers and connect all pivots via Report Connections.</li>
  <li>Assemble on a <em>Dashboard</em> sheet with a grid; align and size precisely (Alt-drag to snap).</li>
  <li>Protect the sheet, unlock only slicer areas; hide raw data sheets.</li>
</ol>
<div class="callout"><b>Naming for trust</b>Every dashboard needs a data-as-of stamp, an owner and a definition of each metric. Undefined metrics get redefined by whoever shouts loudest.</div>
<div class="callout interview"><b>Interview classic</b>"How do you decide what goes on a dashboard?" → Start from the decisions the audience makes weekly, pick one primary metric per decision, add 2–3 supporting breakdowns, and validate with the stakeholder before building. Mention that you would delete any chart nobody acts on.</div>`
    }
  ]
}
);
