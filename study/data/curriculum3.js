window.CURRICULUM = window.CURRICULUM || [];

window.CURRICULUM.push(
{
  id: "sql",
  track: "sql",
  icon: "🗄",
  title: "SQL for Analysts",
  blurb: "SELECT to window functions. The one skill tested in almost every data analyst interview, at every level.",
  lessons: [
    {
      id: "s1",
      title: "SELECT, WHERE, ORDER BY, LIMIT",
      minutes: 12,
      lede: "The shape of every query, plus the operator traps that cause silently wrong answers.",
      body: `
<h3>Anatomy of a query</h3>
<pre><code>SELECT   region, SUM(amount) AS revenue
FROM     orders
WHERE    order_date >= '2026-01-01'
  AND    status = 'completed'
GROUP BY region
HAVING   SUM(amount) > 100000
ORDER BY revenue DESC
LIMIT    10;</code></pre>
<p>Logical execution order — memorise it, it explains almost every error:</p>
<pre><code>FROM → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT</code></pre>
<p>Because <code>SELECT</code> runs after <code>WHERE</code>, you cannot use a SELECT alias in <code>WHERE</code> (but you can in <code>ORDER BY</code>). Because <code>HAVING</code> runs after <code>GROUP BY</code>, it filters aggregates, while <code>WHERE</code> filters rows.</p>

<h3>Filtering</h3>
<pre><code>WHERE amount &gt; 100
WHERE region IN ('West', 'North')
WHERE customer_name LIKE 'Acme%'          -- % any, _ single char
WHERE order_date BETWEEN '2026-01-01' AND '2026-03-31'
WHERE discount IS NULL
WHERE status &lt;&gt; 'Cancelled'</code></pre>
<div class="callout warn"><b>The NULL trap</b><code>WHERE discount != 0</code> silently drops every row where <code>discount IS NULL</code>. NULL comparisons yield UNKNOWN, which is not TRUE, so the row is filtered out. Always think about NULLs in filters.</div>

<h3>DISTINCT and counting</h3>
<pre><code>SELECT DISTINCT region FROM customers;
SELECT COUNT(*)          AS rows_all,
       COUNT(email)      AS rows_with_email,   -- ignores NULL
       COUNT(DISTINCT customer_id) AS unique_customers
FROM customers;</code></pre>

<h3>ORDER BY details</h3>
<pre><code>ORDER BY revenue DESC, region ASC
ORDER BY 2 DESC                       -- by column position (avoid in prod)
ORDER BY CASE WHEN status='New' THEN 0 ELSE 1 END, order_date DESC</code></pre>

<h3>NULL handling</h3>
<pre><code>SELECT COALESCE(discount, 0) AS discount
SELECT IFNULL(discount, 0)            -- MySQL
SELECT NULLIF(total, 0)               -- turns 0 into NULL, avoids /0
SELECT amount / NULLIF(qty, 0)        -- safe division
</code></pre>
<div class="callout interview"><b>Interview classic</b>"Why does <code>COUNT(col)</code> differ from <code>COUNT(*)</code>?" → <code>COUNT(*)</code> counts rows; <code>COUNT(col)</code> counts non-NULL values in that column. If 20 of 100 rows have a NULL email, <code>COUNT(email)</code> returns 80.</div>`
    },
    {
      id: "s2",
      title: "Aggregation and GROUP BY",
      minutes: 14,
      lede: "Group, filter groups, and understand why every non-aggregated column must be grouped.",
      body: `
<h3>Basic aggregation</h3>
<pre><code>SELECT region,
       COUNT(*)              AS orders,
       COUNT(DISTINCT customer_id) AS customers,
       SUM(amount)           AS revenue,
       AVG(amount)           AS avg_order,
       MIN(order_date)       AS first_order,
       MAX(order_date)       AS last_order,
       ROUND(AVG(amount), 2) AS avg_order_r2
FROM   orders
WHERE  status = 'completed'
GROUP BY region;</code></pre>

<h3>GROUP BY rules</h3>
<p>Every column in <code>SELECT</code> that is not inside an aggregate must appear in <code>GROUP BY</code>. MySQL with <code>ONLY_FULL_GROUP_BY</code> disabled lets you break this and returns an arbitrary row's value — a silent correctness bug.</p>
<pre><code>-- WRONG in standard SQL: which order's status is shown?
SELECT region, status, SUM(amount) FROM orders GROUP BY region;</code></pre>

<h3>Multiple keys</h3>
<pre><code>SELECT region, category, SUM(amount) AS revenue
FROM   order_items
GROUP BY region, category
ORDER BY region, revenue DESC;</code></pre>

<h3>HAVING vs WHERE</h3>
<pre><code>SELECT customer_id, SUM(amount) AS lifetime
FROM   orders
WHERE  order_date >= '2025-01-01'      -- filter rows first
GROUP BY customer_id
HAVING SUM(amount) > 5000              -- filter groups after
ORDER BY lifetime DESC;</code></pre>

<h3>Aggregate + detailed rows in one result</h3>
<pre><code>SELECT COALESCE(region, 'TOTAL') AS region, SUM(amount) AS revenue
FROM   orders
GROUP BY ROLLUP(region);

-- or a UNION of detail and total
SELECT region, SUM(amount) AS revenue FROM orders GROUP BY region
UNION ALL
SELECT 'TOTAL', SUM(amount) FROM orders;</code></pre>

<h3>Conditional aggregation — pivot without a pivot</h3>
<pre><code>SELECT region,
       SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) AS completed,
       SUM(CASE WHEN status = 'cancelled' THEN amount ELSE 0 END) AS cancelled,
       ROUND(100.0 * SUM(CASE WHEN status='cancelled' THEN 1 ELSE 0 END) / COUNT(*), 1) AS cancel_rate_pct
FROM   orders
GROUP BY region;</code></pre>
<p>This is the most useful pattern in analytics SQL. Learn it cold: it turns rows into report columns and computes rates safely.</p>
<div class="callout interview"><b>Interview classic</b>"Find the customer with the highest total revenue in each region." → Window functions: <code>ROW_NUMBER() OVER (PARTITION BY region ORDER BY SUM(amount) DESC) = 1</code> in a subquery. Using <code>LIMIT 1</code> or <code>MAX</code> alone gives only a global answer — a common mistake.</div>`
    },
    {
      id: "s3",
      title: "Joins and set operations",
      minutes: 15,
      lede: "Inner/left/right/full, self-joins, anti-joins, and how fan-out destroys your totals.",
      body: `
<h3>Join types</h3>
<pre><code>SELECT o.order_id, c.name, o.amount
FROM   orders o
JOIN   customers c ON c.id = o.customer_id         -- INNER
LEFT JOIN customers c ON c.id = o.customer_id      -- keep all orders
RIGHT JOIN ...  FULL OUTER JOIN ...                -- rare but real
CROSS JOIN ...                                     -- cartesian, careful</code></pre>
<table>
  <tr><th>Join</th><th>Keeps</th><th>Rows with no match</th></tr>
  <tr><td>INNER</td><td>matches only</td><td>dropped</td></tr>
  <tr><td>LEFT</td><td>all left</td><td>right cols NULL</td></tr>
  <tr><td>RIGHT</td><td>all right</td><td>left cols NULL</td></tr>
  <tr><td>FULL</td><td>both</td><td>NULLs on the missing side</td></tr>
</table>

<h3>Anti-join — find what is missing</h3>
<pre><code>-- customers who never ordered
SELECT c.id, c.name
FROM   customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE  o.customer_id IS NULL;

-- equivalent and often faster
SELECT id, name FROM customers
WHERE  id NOT IN (SELECT customer_id FROM orders WHERE customer_id IS NOT NULL);</code></pre>
<div class="callout warn"><b>NOT IN + NULL</b>If the subquery returns a single NULL, <code>NOT IN</code> returns no rows at all. Use <code>NOT EXISTS</code> or filter NULLs out. Interviewers love this one.</div>

<h3>Self-join — compare rows in one table</h3>
<pre><code>-- employees earning more than their manager
SELECT e.name AS employee, m.name AS manager
FROM   employees e
JOIN   employees m ON m.id = e.manager_id
WHERE  e.salary &gt; m.salary;</code></pre>

<h3>Fan-out: the number-one silent bug</h3>
<pre><code>-- orders: 1,000 rows. order_items: 5 items per order.
-- Joining multiplies revenue by 5.
SELECT SUM(o.amount) FROM orders o JOIN order_items i ON i.order_id = o.id;  -- WRONG

-- Fix A: aggregate first
SELECT SUM(o.amount)
FROM orders o
JOIN (SELECT order_id, SUM(qty*price) AS items_total
      FROM order_items GROUP BY order_id) i ON i.order_id = o.id;

-- Fix B: don't sum a duplicated measure; sum the finest grain only
SELECT SUM(i.qty * i.price) FROM order_items i;</code></pre>
<p>Always check <code>COUNT(*)</code> before and after a join. If it grew, you have fan-out.</p>

<h3>Set operations</h3>
<pre><code>SELECT customer_id FROM orders_2025
UNION      -- deduplicates
SELECT customer_id FROM orders_2026;

SELECT customer_id FROM orders_2025
INTERSECT  -- customers active in both years
SELECT customer_id FROM orders_2026;

SELECT customer_id FROM orders_2025
EXCEPT     -- churned (MINUS in Oracle)
SELECT customer_id FROM orders_2026;</code></pre>
<div class="callout interview"><b>Interview classic</b>"Difference between UNION and UNION ALL?" → UNION removes duplicates (requires a sort/hash, slower); UNION ALL keeps everything and is faster. Use UNION ALL whenever duplicates are impossible or acceptable.</div>`
    },
    {
      id: "s4",
      title: "Subqueries and CTEs",
      minutes: 13,
      lede: "Write readable multi-step SQL with WITH, and know when a subquery beats a join.",
      body: `
<h3>CTE — the professional default</h3>
<pre><code>WITH completed AS (
    SELECT * FROM orders WHERE status = 'completed'
),
per_customer AS (
    SELECT customer_id,
           COUNT(*)      AS orders,
           SUM(amount)   AS revenue
    FROM   completed
    GROUP BY customer_id
)
SELECT CASE WHEN revenue &gt;= 10000 THEN 'VIP'
            WHEN revenue &gt;= 1000  THEN 'Regular'
            ELSE 'Low' END AS segment,
       COUNT(*)     AS customers,
       SUM(revenue) AS revenue
FROM   per_customer
GROUP BY segment
ORDER BY revenue DESC;</code></pre>
<p>CTEs read top-to-bottom like a data pipeline and are debuggable one block at a time. Recursive CTEs handle hierarchies:</p>
<pre><code>WITH RECURSIVE chain AS (
    SELECT id, manager_id, 1 AS level FROM employees WHERE manager_id IS NULL
    UNION ALL
    SELECT e.id, e.manager_id, c.level + 1
    FROM   employees e JOIN chain c ON e.manager_id = c.id
)
SELECT * FROM chain;</code></pre>

<h3>Scalar and correlated subqueries</h3>
<pre><code>-- average order value compared to the overall average
SELECT order_id, amount,
       amount - (SELECT AVG(amount) FROM orders) AS vs_avg
FROM   orders;

-- correlated: latest order per customer
SELECT o.*
FROM   orders o
WHERE  o.order_date = (SELECT MAX(order_date)
                       FROM orders x WHERE x.customer_id = o.customer_id);</code></pre>

<h3>EXISTS vs IN</h3>
<pre><code>SELECT c.* FROM customers c
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);</code></pre>
<p><code>EXISTS</code> stops at the first match and is NULL-safe. <code>IN</code> with a small literal list is fine and readable.</p>

<h3>Derived tables</h3>
<pre><code>SELECT region, AVG(order_value) AS aov
FROM (SELECT region, order_id, SUM(amount) AS order_value
      FROM   order_items GROUP BY region, order_id) t
GROUP BY region;</code></pre>

<h3>Which to choose?</h3>
<table>
  <tr><th>Tool</th><th>Best for</th></tr>
  <tr><td>CTE</td><td>Multi-step logic, reuse, readability</td></tr>
  <tr><td>Subquery in WHERE</td><td>Filter against an aggregate or existence</td></tr>
  <tr><td>Derived table</td><td>One-off intermediate aggregation</td></tr>
  <tr><td>Join</td><td>Combining entities side by side</td></tr>
</table>
<div class="callout interview"><b>Interview classic</b>"What is a CTE and why use it over a subquery?" → A named temporary result set scoped to one statement. Benefits: readability, reuse in the same query, stepwise debugging, and recursion. Performance is usually identical because the optimiser inlines it.</div>`
    },
    {
      id: "s5",
      title: "Window functions",
      minutes: 16,
      lede: "ROW_NUMBER, RANK, LAG/LEAD and running totals — the single biggest differentiator in SQL interviews.",
      body: `
<h3>Anatomy</h3>
<pre><code>function() OVER (
    PARTITION BY region      -- reset per group
    ORDER BY order_date      -- ordering inside the group
    ROWS BETWEEN ...         -- optional frame
)</code></pre>
<p>Window functions compute across related rows <strong>without collapsing them</strong>. GROUP BY gives one row per group; a window gives every row plus a group-level value.</p>

<h3>Ranking family</h3>
<pre><code>SELECT customer_id, amount,
       ROW_NUMBER() OVER (PARTITION BY region ORDER BY amount DESC) AS rn,
       RANK()       OVER (PARTITION BY region ORDER BY amount DESC) AS rnk,
       DENSE_RANK() OVER (PARTITION BY region ORDER BY amount DESC) AS drnk
FROM   orders;</code></pre>
<table>
  <tr><th>Amounts</th><th>ROW_NUMBER</th><th>RANK</th><th>DENSE_RANK</th></tr>
  <tr><td>500</td><td>1</td><td>1</td><td>1</td></tr>
  <tr><td>500</td><td>2</td><td>1</td><td>1</td></tr>
  <tr><td>300</td><td>3</td><td>3</td><td>2</td></tr>
</table>

<h3>Top-N per group — the classic</h3>
<pre><code>WITH ranked AS (
    SELECT region, product, SUM(amount) AS revenue,
           ROW_NUMBER() OVER (PARTITION BY region ORDER BY SUM(amount) DESC) AS rn
    FROM   sales GROUP BY region, product
)
SELECT region, product, revenue FROM ranked WHERE rn &lt;= 3;</code></pre>

<h3>Offset: LAG / LEAD</h3>
<pre><code>SELECT month, revenue,
       LAG(revenue)  OVER (ORDER BY month) AS prev_month,
       revenue - LAG(revenue) OVER (ORDER BY month) AS delta,
       ROUND(100.0 * (revenue - LAG(revenue) OVER (ORDER BY month))
             / NULLIF(LAG(revenue) OVER (ORDER BY month), 0), 1) AS growth_pct
FROM   monthly;</code></pre>

<h3>Running totals and moving averages</h3>
<pre><code>SELECT order_date, amount,
       SUM(amount) OVER (ORDER BY order_date
                         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total,
       AVG(amount) OVER (ORDER BY order_date
                         ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS ma_7
FROM   orders;</code></pre>
<div class="callout warn"><b>ROWS vs RANGE</b>Default frame with ORDER BY is <code>RANGE UNBOUNDED PRECEDING AND CURRENT ROW</code>, which lumps ties together. For strict row-by-row running totals (e.g. cumulative revenue with duplicate dates), specify <code>ROWS</code>.</div>

<h3>Percent of total without a self-join</h3>
<pre><code>SELECT region, revenue,
       ROUND(100.0 * revenue / SUM(revenue) OVER (), 1) AS pct_of_total
FROM   region_totals;</code></pre>

<h3>NTILE and FIRST_VALUE</h3>
<pre><code>SELECT customer_id, revenue,
       NTILE(4) OVER (ORDER BY revenue DESC) AS quartile,
       FIRST_VALUE(revenue) OVER (PARTITION BY region ORDER BY revenue DESC) AS top_in_region
FROM   customer_revenue;</code></pre>
<div class="callout interview"><b>Interview classic</b>"Difference between RANK and DENSE_RANK?" → RANK leaves a gap after ties (1,1,3); DENSE_RANK does not (1,1,2). ROW_NUMBER always assigns distinct numbers arbitrarily among ties. Choose based on whether ties should share a position.</div>`
    },
    {
      id: "s6",
      title: "Date handling and cohort SQL",
      minutes: 12,
      lede: "Truncation, date arithmetic and building a retention matrix in pure SQL.",
      body: `
<h3>Truncation (dialect differences)</h3>
<pre><code>DATE_TRUNC('month', order_date)                    -- PostgreSQL, Snowflake, BigQuery
DATE_FORMAT(order_date, '%Y-%m-01')                -- MySQL
CAST(DATEADD(month, DATEDIFF(month, 0, d), 0) AS date)  -- SQL Server
STRFTIME('%Y-%m', order_date)                      -- SQLite</code></pre>

<h3>Date arithmetic</h3>
<pre><code>order_date + INTERVAL '7 days'          -- PostgreSQL
DATE_ADD(order_date, INTERVAL 7 DAY)    -- MySQL
DATEADD(day, 7, order_date)             -- SQL Server
DATEDIFF('day', start, end)             -- BigQuery / Snowflake
DATE_DIFF(end, start, DAY)              -- BigQuery</code></pre>
<p>In interviews, state your dialect and mention the alternative. Nobody expects you to memorise every function; they expect you to know the concept.</p>

<h3>Calendar spine (filling missing days)</h3>
<pre><code>WITH calendar AS (
    SELECT generate_series('2026-01-01'::date, '2026-12-31'::date, '1 day')::date AS d
),
daily AS (
    SELECT DATE_TRUNC('day', order_date)::date AS d, SUM(amount) AS revenue
    FROM   orders GROUP BY 1
)
SELECT c.d, COALESCE(d.revenue, 0) AS revenue
FROM   calendar c LEFT JOIN daily d USING (d)
ORDER BY c.d;</code></pre>
<p>Charts with gaps look broken. A calendar spine plus COALESCE is the standard fix.</p>

<h3>Cohort retention in SQL</h3>
<pre><code>WITH first_order AS (
    SELECT customer_id, MIN(DATE_TRUNC('month', order_date)) AS cohort
    FROM   orders GROUP BY customer_id
),
activity AS (
    SELECT o.customer_id,
           f.cohort,
           DATE_TRUNC('month', o.order_date) AS activity_month,
           (EXTRACT(YEAR FROM DATE_TRUNC('month', o.order_date))
          - EXTRACT(YEAR FROM f.cohort)) * 12
         + (EXTRACT(MONTH FROM DATE_TRUNC('month', o.order_date))
          - EXTRACT(MONTH FROM f.cohort)) AS month_no
    FROM   orders o JOIN first_order f USING (customer_id)
)
SELECT cohort, month_no, COUNT(DISTINCT customer_id) AS active
FROM   activity
GROUP BY cohort, month_no
ORDER BY cohort, month_no;</code></pre>
<p>Pivot in the BI layer. The result above is long-format retention, which is what you want to chart anyway.</p>

<h3>Funnel SQL</h3>
<pre><code>SELECT
  COUNT(DISTINCT CASE WHEN event = 'visit'  THEN user_id END) AS visits,
  COUNT(DISTINCT CASE WHEN event = 'signup' THEN user_id END) AS signups,
  COUNT(DISTINCT CASE WHEN event = 'purchase' THEN user_id END) AS purchases
FROM events
WHERE event_date BETWEEN '2026-10-01' AND '2026-10-31';</code></pre>
<div class="callout interview"><b>Interview classic</b>"How do you calculate month-over-month growth in SQL?" → Aggregate by month, then use <code>LAG(revenue) OVER (ORDER BY month)</code> and divide the difference by the lagged value with <code>NULLIF</code> to avoid divide-by-zero. Mention the first month is NULL by definition.</div>`
    },
    {
      id: "s7",
      title: "Performance and query hygiene",
      minutes: 11,
      lede: "Indexes, sargability, EXPLAIN, and the habits that keep queries fast on big tables.",
      body: `
<h3>WHERE clauses that can use an index</h3>
<pre><code>-- SARGABLE: index on order_date can be used
WHERE order_date >= '2026-01-01'

-- NON-SARGABLE: function on the column kills the index
WHERE DATE_TRUNC('year', order_date) = '2026-01-01'
WHERE YEAR(order_date) = 2026
WHERE amount * 1.1 > 1000</code></pre>
<p>Rewrite to isolate the column:</p>
<pre><code>WHERE order_date >= '2026-01-01' AND order_date &lt; '2027-01-01'
WHERE amount > 1000 / 1.1</code></pre>

<h3>SELECT only what you need</h3>
<pre><code>SELECT * FROM orders          -- scans and ships every column
SELECT order_id, amount FROM orders   -- column store friendly</code></pre>

<h3>Filter early</h3>
<pre><code>-- push filters into the CTE, not the outer query
WITH recent AS (SELECT * FROM orders WHERE order_date >= CURRENT_DATE - 30)
SELECT region, SUM(amount) FROM recent GROUP BY region;</code></pre>

<h3>EXPLAIN</h3>
<pre><code>EXPLAIN ANALYZE SELECT ...;</code></pre>
<p>Read for: <code>Seq Scan</code> on a large table (missing index), estimated vs actual rows wildly different (stale statistics), <code>Nested Loop</code> over huge sets (consider a hash join), and sorts spilling to disk.</p>

<h3>Indexing basics</h3>
<ul>
  <li>Index the columns in <code>WHERE</code>, <code>JOIN</code> and <code>ORDER BY</code>.</li>
  <li>Composite indexes work left-to-right: <code>(region, order_date)</code> helps filters on region alone, or region+date, but not date alone.</li>
  <li>Every index slows writes and costs storage. Do not index everything.</li>
  <li>Low-cardinality columns (a boolean, 3-status field) rarely benefit alone.</li>
</ul>

<h3>Hygiene checklist</h3>
<ul>
  <li>Qualify columns with table aliases in joins — prevents ambiguous-column errors.</li>
  <li>Use <code>COUNT(*)</code> for row counts; reserve <code>COUNT(DISTINCT)</code> for real need.</li>
  <li>Avoid <code>SELECT DISTINCT</code> to hide a fan-out bug — fix the join.</li>
  <li>Cap results during exploration: <code>LIMIT 100</code>.</li>
  <li>Never run an unbounded <code>UPDATE</code> or <code>DELETE</code>; test with <code>SELECT</code> first, then wrap in a transaction.</li>
</ul>
<div class="callout interview"><b>Interview classic</b>"A query got slow after 6 months. What do you check?" → Table growth, missing/stale statistics, new non-sargable filters, join fan-out, added columns in SELECT *, and index bloat. Then run EXPLAIN ANALYZE and compare estimates with actuals.</div>`
    }
  ]
},

{
  id: "stats",
  track: "stats",
  icon: "∑",
  title: "Statistics &amp; Probability",
  blurb: "Descriptive statistics, distributions, sampling, hypothesis tests and A/B testing — the maths behind every 'is this real?' question.",
  lessons: [
    {
      id: "st1",
      title: "Descriptive statistics that matter",
      minutes: 13,
      lede: "Mean vs median, variance, standard deviation, percentiles, IQR and why averages lie.",
      body: `
<h3>Centre</h3>
<pre><code>values = [12, 14, 15, 15, 16, 18, 19, 20, 21, 95]
mean   = 24.5      # pulled up by the outlier
median = 17.0      # robust
</code></pre>
<p>Use the median for income, house prices, session duration and anything with a long right tail. Use the mean when totals matter (revenue per user, where the sum must reconcile).</p>

<h3>Spread</h3>
<pre><code>variance  = Σ(x - mean)² / (n - 1)
std_dev   = √variance
CV        = std_dev / mean          # relative variability, unitless

Q1, Q2, Q3 = 25th, 50th, 75th percentile
IQR        = Q3 - Q1
outlier    = x &lt; Q1 - 1.5*IQR  or  x &gt; Q3 + 1.5*IQR</code></pre>

<h3>Shape</h3>
<table>
  <tr><th>Measure</th><th>Right-skewed (tail right)</th></tr>
  <tr><td>mean vs median</td><td>mean &gt; median</td></tr>
  <tr><td>typical fix</td><td>log transform, or report median + p90</td></tr>
</table>
<p>Skewness is the ratio of the third moment to the cube of the standard deviation; kurtosis measures tail weight. For daily analysis, comparing mean to median is enough.</p>

<h3>The five-number summary</h3>
<pre><code>import numpy as np
np.percentile(x, [0, 25, 50, 75, 100])</code></pre>
<p>Report min, Q1, median, Q3, max, plus count. It describes a distribution honestly in one line, and it is what a box plot draws.</p>

<h3>Averages of averages</h3>
<div class="callout warn"><b>Simpson's paradox</b>Two regions can each improve while the overall rate declines, because the mix of high- and low-performing groups changed. Never average percentage columns without weighting by their denominators:
<code>rate = Σnumerator / Σdenominator</code>, not <code>mean(rate)</code>.</div>

<h3>Working example</h3>
<pre><code>orders per customer: mean 3.2, median 2, p90 7
→ "Half of customers order twice or less, but a small group orders often.
   Average order count overstates the typical customer."
</code></pre>
<p>That sentence is what separates a report from insight.</p>
<div class="callout interview"><b>Interview classic</b>"Mean or median for salary analysis?" → Median, because salary distributions are right-skewed and the mean is inflated by a few very high earners; report both plus percentiles for the full picture.</div>`
    },
    {
      id: "st2",
      title: "Distributions and the normal curve",
      minutes: 12,
      lede: "Normal, binomial, Poisson, uniform and long-tailed data — and picking the right model.",
      body: `
<h3>The normal distribution</h3>
<pre><code>68% of values within 1σ of the mean
95% within 2σ
99.7% within 3σ</code></pre>
<p>z-score = (x − μ) / σ tells you how many standard deviations a value sits from the mean. Used for anomaly flags and standardising features.</p>

<h3>Distributions you will meet</h3>
<table>
  <tr><th>Distribution</th><th>Models</th><th>Example</th></tr>
  <tr><td>Normal</td><td>symmetric continuous</td><td>measurement error, heights</td></tr>
  <tr><td>Binomial</td><td>successes in n trials</td><td>conversions out of 1,000 visits</td></tr>
  <tr><td>Poisson</td><td>counts per interval</td><td>support tickets per hour</td></tr>
  <tr><td>Uniform</td><td>equal probability</td><td>random assignment in a test</td></tr>
  <tr><td>Exponential / log-normal</td><td>time between events, long tails</td><td>session duration, order value</td></tr>
</table>

<h3>Binomial, concretely</h3>
<pre><code>n = 1000 visits, p = 0.03
mean = n·p = 30 conversions
sd   = √(n·p·(1-p)) = √29.1 ≈ 5.4
95% range ≈ 30 ± 2·5.4 → 19 to 41</code></pre>
<p>You just built a confidence interval for a conversion rate without any software. That is the maths behind A/B test sizing.</p>

<h3>Why long tails break dashboards</h3>
<pre><code>revenue per user: median 12, mean 47, p99 1,900
→ A single enterprise account can move the daily average.</code></pre>
<p>Report median and p90/p99, or split the population (enterprise vs self-serve). Never let one whale define the KPI story.</p>

<h3>Checking normality</h3>
<pre><code>import matplotlib.pyplot as plt
import seaborn as sns
sns.histplot(x, kde=True)          # visual
from scipy import stats
stats.skew(x), stats.kurtosis(x)   # numeric
stats.shapiro(x[:5000])            # formal test, small samples</code></pre>
<p>With n &gt; 30 the Central Limit Theorem usually rescues means even for skewed data — but not for extreme outliers or tiny samples.</p>
<div class="callout interview"><b>Interview classic</b>"What is the Central Limit Theorem and why do analysts care?" → Sample means from almost any distribution approach a normal distribution as sample size grows (n ≳ 30). It justifies using normal-based confidence intervals and t-tests for means even when the underlying data is skewed.</div>`
    },
    {
      id: "st3",
      title: "Correlation and causation",
      minutes: 12,
      lede: "Pearson vs Spearman, lurking variables, confounders and the phrasing that keeps you credible.",
      body: `
<h3>Correlation coefficient</h3>
<pre><code>r = covariance(x, y) / (σx · σy)      # -1 .. +1
r = 0.8  strong positive
r = 0.1  weak
r = 0    no linear relationship (but maybe a curve)</code></pre>
<p>Pearson measures <em>linear</em> association and assumes roughly normal data. Spearman uses ranks and catches any monotonic relationship, and is robust to outliers:</p>
<pre><code>from scipy.stats import pearsonr, spearmanr
pearsonr(x, y), spearmanr(x, y)</code></pre>

<h3>Anscombe's quartet</h3>
<p>Four datasets with identical means, variances and correlation — but four completely different shapes. <strong>Always plot before you compute.</strong> This example is a favourite interview reference for exactly that reason.</p>

<h3>Confounders and lurking variables</h3>
<pre><code>Ice cream sales ↑  and  drownings ↑
Cause: hot weather (the confounder)</code></pre>
<ul>
  <li><strong>Confounder</strong> — affects both variables (season, geography, user tenure).</li>
  <li><strong>Reverse causation</strong> — the outcome causes the input.</li>
  <li><strong>Selection bias</strong> — the sample is not representative (survivors only).</li>
  <li><strong>Collider</strong> — conditioning on a common effect invents a relationship.</li>
</ul>

<h3>Establishing causation</h3>
<ol>
  <li>Randomised controlled experiment (the gold standard).</li>
  <li>Quasi-experiments: difference-in-differences, regression discontinuity, instrumental variables, propensity matching.</li>
  <li>Longitudinal data with controls for confounders.</li>
</ol>

<h3>How to phrase findings</h3>
<table>
  <tr><td><b>Overclaim</b></td><td>"Discounts increase retention."</td></tr>
  <tr><td><b>Credible</b></td><td>"Customers who received a discount renewed 8pp more often; this is association, and we cannot rule out that high-intent customers were targeted."</td></tr>
</table>
<div class="callout interview"><b>Interview classic</b>"Correlation vs causation — give an example from data you would see at work." → Signups from paid search correlate with revenue, but paid search may simply capture already-decided buyers (selection). Only a holdout test isolates the incremental effect.</div>`
    },
    {
      id: "st4",
      title: "Sampling and confidence intervals",
      minutes: 13,
      lede: "Standard error, the CLT in practice, margin of error, and how to explain uncertainty to non-technical stakeholders.",
      body: `
<h3>Sampling methods</h3>
<ul>
  <li><strong>Simple random</strong> — everyone equally likely.</li>
  <li><strong>Stratified</strong> — sample within segments (region, plan tier) to guarantee coverage.</li>
  <li><strong>Cluster</strong> — sample whole groups (stores, schools).</li>
  <li><strong>Convenience</strong> — whoever is easy to reach; biased, but common.</li>
</ul>

<h3>Standard error</h3>
<pre><code>SE(mean) = s / √n</code></pre>
<p>Quadrupling the sample halves the error. This is why "just get more data" is often the wrong answer to a precision problem — you need 4× for 2× precision.</p>

<h3>Confidence interval for a mean</h3>
<pre><code>CI = x̄ ± t · s/√n        (t ≈ 1.96 for 95% when n is large)</code></pre>
<pre><code>import numpy as np
from scipy import stats
x = np.array(sample)
n, m, se = len(x), x.mean(), stats.sem(x)
lo, hi = stats.t.interval(0.95, n-1, loc=m, scale=se)
print(f"{m:.1f} (95% CI {lo:.1f}-{hi:.1f})")</code></pre>

<h3>Confidence interval for a proportion</h3>
<pre><code>p̂ = conversions / visitors
SE = √(p̂(1-p̂)/n)
CI = p̂ ± 1.96·SE

# 120 / 4000 = 3.0%, SE = 0.27pp → 2.5% to 3.5%</code></pre>

<h3>What "95% confident" actually means</h3>
<div class="callout warn"><b>Precise wording</b>It does <em>not</em> mean "95% chance the true value is in this interval". It means: if we repeated the sampling many times, 95% of the intervals we built would contain the true value. In practice, say "our best estimate is 3.0%, with a margin of error of about ±0.5pp".</div>

<h3>Sample size planning</h3>
<pre><code>n ≈ (1.96² · p(1-p)) / e²        # proportion, desired margin e
e = 0.01, p = 0.03 → n ≈ 1,118</code></pre>
<p>Small conversion rates need large samples. At 1% baseline, estimating ±0.1pp needs about 380k visitors. Say this out loud in interviews — it shows you have shipped real tests.</p>
<div class="callout interview"><b>Interview classic</b>"Your dashboard shows a 0.2pp lift. Is it real?" → Compute the confidence interval for the difference; if it straddles zero, the change is not distinguishable from noise. Also check sample size, novelty effects and segment imbalance.</div>`
    },
    {
      id: "st5",
      title: "Hypothesis testing",
      minutes: 14,
      lede: "Null and alternative hypotheses, p-values, type I/II errors, power, and the tests analysts actually run.",
      body: `
<h3>The frame</h3>
<pre><code>H0: no effect (difference = 0)
H1: there is an effect
α  = 0.05   tolerable false-positive rate
p  = probability of data this extreme IF H0 is true
reject H0 when p &lt; α</code></pre>

<h3>p-value, honestly</h3>
<div class="callout warn"><b>Not this</b>"p = 0.03 means there is a 3% chance the null hypothesis is true." Wrong. It is P(data at least this extreme | H0), not P(H0 | data). With many comparisons, p &lt; 0.05 happens by chance 1 in 20 times.</div>

<h3>Errors and power</h3>
<table>
  <tr><th></th><th>H0 true</th><th>H0 false</th></tr>
  <tr><td>Reject H0</td><td>Type I error (α)</td><td>Correct — power (1−β)</td></tr>
  <tr><td>Fail to reject</td><td>Correct</td><td>Type II error (β)</td></tr>
</table>
<p>Power = probability of detecting a real effect. Standard target 80%. Power rises with effect size, sample size and lower variance — smaller effects need far more data.</p>

<h3>Choosing a test</h3>
<table>
  <tr><th>Question</th><th>Test</th></tr>
  <tr><td>Two group means</td><td>independent t-test (Welch's if variances differ)</td></tr>
  <tr><td>Paired before/after</td><td>paired t-test</td></tr>
  <tr><td>Three+ group means</td><td>one-way ANOVA</td></tr>
  <tr><td>Two proportions / conversion</td><td>two-proportion z-test or chi-square</td></tr>
  <tr><td>Categorical independence</td><td>chi-square test of independence</td></tr>
  <tr><td>Non-normal, small n</td><td>Mann–Whitney U, Wilcoxon</td></tr>
  <tr><td>Correlation</td><td>Pearson t-test on r</td></tr>
</table>

<h3>In code</h3>
<pre><code>from scipy import stats

t, p = stats.ttest_ind(control, variant, equal_var=False)
chi2, p, dof, expected = stats.chi2_contingency(pd.crosstab(df.segment, df.converted))
t, p = stats.ttest_rel(before, after)
u, p = stats.mannwhitneyu(a, b)

# effect size matters more than p
diff = variant.mean() - control.mean()
d = diff / pooled_std        # Cohen's d: 0.2 small, 0.5 medium, 0.8 large</code></pre>

<h3>Multiple comparisons</h3>
<pre><code>Bonferroni: α / number_of_tests
Benjamini–Hochberg: controls false discovery rate, less conservative</code></pre>
<p>Testing 20 metrics at α=0.05 gives roughly one false positive by construction. Pre-register one primary metric and label everything else exploratory.</p>
<div class="callout interview"><b>Interview classic</b>"Your A/B test shows p = 0.04 but the lift is 0.1%. What do you recommend?" → Statistical significance is not business significance. Check the confidence interval and the cost of shipping; a 0.1% lift may not cover engineering risk. Recommend extending the test or not shipping, and state the minimum detectable effect.</div>`
    },
    {
      id: "st6",
      title: "A/B testing end to end",
      minutes: 15,
      lede: "Design, randomisation, sample size, guardrails, the peeking problem and how to report a test.",
      body: `
<h3>Design checklist</h3>
<ol>
  <li><strong>Hypothesis</strong> — "Showing delivery date on PDP increases checkout conversion."</li>
  <li><strong>Primary metric</strong> — one, chosen before launch. Others are secondary or guardrails.</li>
  <li><strong>Unit</strong> — user, session or account. Users, if the effect persists.</li>
  <li><strong>Randomisation</strong> — 50/50 at the unit level, sticky across sessions.</li>
  <li><strong>Sample size</strong> — from baseline rate and minimum detectable effect.</li>
  <li><strong>Duration</strong> — at least one full week to cover weekday/weekend; longer for pay cycles.</li>
  <li><strong>Guardrails</strong> — latency, refund rate, support contacts, revenue per user.</li>
</ol>

<h3>Sample size formula</h3>
<pre><code>n per arm ≈ 16 · p(1-p) / δ²          # p baseline, δ absolute lift
p = 0.03, δ = 0.003 → n ≈ 51,700 per arm</code></pre>

<h3>Sanity checks before reading results</h3>
<pre><code># sample ratio mismatch
assert abs(len(A) - len(B)) / len(A) &lt; 0.01

# pre-period balance
compare covariates: device mix, geography, tenure
</code></pre>
<p>A 55/45 split with 50/50 assignment means the randomiser is broken. Fix that before interpreting any lift.</p>

<h3>The peeking problem</h3>
<div class="callout warn"><b>Do not check daily and stop when significant</b>Repeated looks inflate the false-positive rate dramatically (up to 25-30% with daily peeking). Either fix the sample size in advance, or use a sequential test designed for continuous monitoring.</div>

<h3>Reading the result</h3>
<pre><code>control:   3.00%  (n=50,000)
variant:   3.28%  (n=50,100)
lift:      +0.28pp (+9.3% relative)
95% CI:    +0.08pp to +0.48pp
p = 0.006
</code></pre>
<p>Report: absolute lift, relative lift, CI, p, sample size, duration, and any segment caveats. Then the recommendation and the expected annual impact.</p>

<h3>When you cannot randomise</h3>
<ul>
  <li><strong>Difference-in-differences</strong> — compare treated vs control before/after.</li>
  <li><strong>Propensity score matching</strong> — build a comparable control group.</li>
  <li><strong>Regression discontinuity</strong> — exploit a threshold rule.</li>
  <li><strong>Synthetic control</strong> — construct a weighted counterfactual from untreated units.</li>
</ul>
<div class="callout interview"><b>Interview classic</b>"Walk me through designing an A/B test for a new checkout flow." → Hypothesis and primary metric, randomisation unit, power calculation for MDE, run for full weeks, guardrail metrics, pre-registered analysis, then report lift with CI and a ship/no-ship recommendation including expected revenue impact.</div>`
    },
    {
      id: "st7",
      title: "Regression basics for analysts",
      minutes: 13,
      lede: "Linear and logistic regression as explanation tools: coefficients, R², overfitting and reading output.",
      body: `
<h3>Linear regression in one line</h3>
<pre><code>y = β0 + β1·x1 + β2·x2 + ... + ε
</code></pre>
<pre><code>import statsmodels.formula.api as smf
m = smf.ols("revenue ~ marketing_spend + region + tenure", data=df).fit()
print(m.summary())</code></pre>

<h3>Reading the summary</h3>
<table>
  <tr><th>Term</th><th>Meaning</th></tr>
  <tr><td>coef</td><td>change in y per one-unit change in x, holding others constant</td></tr>
  <tr><td>std err / t / P&gt;|t|</td><td>precision and significance of that coefficient</td></tr>
  <tr><td>R²</td><td>share of variance explained</td></tr>
  <tr><td>Adj. R²</td><td>R² penalised for extra predictors</td></tr>
  <tr><td>F-statistic</td><td>whether the model as a whole explains anything</td></tr>
 </table>

<h3>Categorical variables</h3>
<pre><code>revenue ~ C(region) + spend
# one level is dropped as the baseline; each coefficient is vs that baseline</code></pre>

<h3>Assumptions (worth naming in interviews)</h3>
<ul>
  <li>Linearity in parameters.</li>
  <li>Independence of errors.</li>
  <li>Homoscedasticity — constant error variance.</li>
  <li>No severe multicollinearity (check VIF).</li>
  <li>Errors approximately normal (mainly for small samples).</li>
</ul>

<h3>Logistic regression — yes/no outcomes</h3>
<pre><code>import statsmodels.api as sm
X = sm.add_constant(df[["visits", "discount", "tenure"]])
y = df["churned"]
logit = sm.Logit(y, X).fit()
print(logit.summary())

import numpy as np
odds_ratios = np.exp(logit.params)      # multiplicative effect on odds</code></pre>
<p>Interpret coefficients as log-odds; exponentiate for odds ratios. "Each extra visit multiplies the odds of retention by 1.12."</p>

<h3>Regression vs machine learning</h3>
<table>
  <tr><th>Goal</th><th>Tool</th></tr>
  <tr><td>Explain and quantify an effect</td><td>Regression with interpretable coefficients</td></tr>
  <tr><td>Predict accurately</td><td>Gradient boosting, random forest, cross-validated</td></tr>
</table>
<div class="callout warn"><b>R² is not causation</b>A high R² says the model fits; it says nothing about whether marketing spend caused revenue, or whether both are driven by season.</div>
<div class="callout interview"><b>Interview classic</b>"How would you quantify the impact of a loyalty programme on spend?" → Regression of spend on programme participation plus controls for tenure, channel and prior spend, then discuss selection bias and propose a matched or holdout design to confirm.</div>`
    }
  ]
}
);
