window.CURRICULUM = window.CURRICULUM || [];

window.CURRICULUM.push(
{
  id: "python",
  track: "python",
  icon: "⌨",
  title: "Python Fundamentals",
  blurb: "Variables, data types, control flow, functions and collections — only what an analyst actually uses, taught with data examples.",
  lessons: [
    {
      id: "p1",
      title: "Variables, data types and operators",
      minutes: 12,
      lede: "Python is dynamically typed but not type-free. Know the four core types and the traps in numeric division.",
      body: `
<h3>The core types</h3>
<pre><code>revenue   = 1250000        # int
margin    = 0.42           # float
company   = "Acme Ltd"     # str
is_active = True           # bool
nothing   = None           # absence of a value</code></pre>
<p>Check any value with <code>type(x)</code>. Convert with <code>int()</code>, <code>float()</code>, <code>str()</code>. Conversion failures raise <code>ValueError</code> — wrap in <code>try/except</code> when parsing messy files.</p>

<h3>Strings: formatting matters</h3>
<pre><code>name = "Acme"
f"{name} revenue: \${revenue:,.0f}"     # 'Acme revenue: $1,250,000'
f"{margin:.1%}"                        # '42.0%'
"  padded  ".strip()                   # 'padded'
"a,b,c".split(",")                     # ['a','b','c']
"-".join(["2026","Q3"])                # '2026-Q3'
"Region: West".startswith("Region")    # True
"west".upper(), "WEST".lower()</code></pre>
<p>f-strings are the standard. Use <code>:.2f</code> for money, <code>:,.0f</code> for thousands, <code>:.1%</code> for rates.</p>

<h3>Arithmetic and the division trap</h3>
<table>
  <tr><th>Operator</th><th>Meaning</th><th>Example</th></tr>
  <tr><td><code>+ - * /</code></td><td>add, subtract, multiply, true divide</td><td><code>7 / 2 → 3.5</code></td></tr>
  <tr><td><code>//</code></td><td>floor divide</td><td><code>7 // 2 → 3</code></td></tr>
  <tr><td><code>%</code></td><td>modulo (remainder)</td><td><code>7 % 2 → 1</code></td></tr>
  <tr><td><code>**</code></td><td>power</td><td><code>2 ** 10 → 1024</code></td></tr>
</table>
<div class="callout warn"><b>Floating point</b><code>0.1 + 0.2 == 0.30000000000000004</code>. Never compare floats with <code>==</code>; use <code>abs(a - b) &lt; 1e-9</code> or <code>round()</code>. For money, store integers in cents or use <code>decimal.Decimal</code>.</div>

<h3>Truthiness and None</h3>
<pre><code>if value is None:          # always use 'is None', never '== None'
    value = 0

if not rows:               # empty list / empty dict is falsy
    print("no data")</code></pre>
<p>Falsy values: <code>0</code>, <code>0.0</code>, <code>""</code>, <code>[]</code>, <code>{}</code>, <code>None</code>, <code>False</code>. This matters constantly when filtering data.</p>
<div class="callout interview"><b>Interview classic</b>"What is the difference between a list and a tuple?" → Lists are mutable and used for ordered collections that change; tuples are immutable, hashable and slightly faster, used for fixed records (coordinates, DB rows) and as dict keys.</div>`
    },
    {
      id: "p2",
      title: "Collections: lists, dicts, sets, tuples",
      minutes: 14,
      lede: "Choose the right container and most data tasks become one line. Includes comprehensions and the dict-based grouping pattern.",
      body: `
<h3>Choosing a container</h3>
<table>
  <tr><th>Type</th><th>Ordered</th><th>Mutable</th><th>Duplicates</th><th>Use when</th></tr>
  <tr><td><code>list</code></td><td>yes</td><td>yes</td><td>yes</td><td>Sequence of records</td></tr>
  <tr><td><code>tuple</code></td><td>yes</td><td>no</td><td>yes</td><td>Fixed record, dict key</td></tr>
  <tr><td><code>dict</code></td><td>yes (insertion)</td><td>yes</td><td>keys unique</td><td>Lookup by key</td></tr>
  <tr><td><code>set</code></td><td>no</td><td>yes</td><td>no</td><td>Membership, dedupe</td></tr>
</table>

<h3>Lists — the workhorse</h3>
<pre><code>sales = [120, 340, 90, 500]
sales.append(210)
sales.sort(reverse=True)
len(sales), sum(sales), max(sales), min(sales)
sales[0], sales[-1], sales[1:3]        # last item, slice

[c * 1.1 for c in sales]               # list comprehension
[x for x in sales if x > 150]          # filtered comprehension</code></pre>

<h3>Dictionaries — the analyst's index</h3>
<pre><code>by_region = {}
for row in rows:
    by_region.setdefault(row["region"], 0)
    by_region[row["region"]] += row["amount"]

# or with collections
from collections import defaultdict
totals = defaultdict(float)
for r in rows:
    totals[r["region"]] += r["amount"]

for region, total in sorted(totals.items(), key=lambda kv: -kv[1]):
    print(f"{region:10} {total:,.0f}")</code></pre>
<p>This is manual <code>GROUP BY</code>. Understanding it makes SQL aggregation obvious later.</p>

<h3>Sets — dedupe and overlap</h3>
<pre><code>customers_q1 = {"A","B","C"}
customers_q2 = {"B","C","D"}
customers_q1 &amp; customers_q2     # {'B','C'}  retained
customers_q1 | customers_q2     # union
customers_q1 - customers_q2     # {'A'} churned
list(set(emails))               # dedupe, order lost</code></pre>

<h3>Unpacking and zip</h3>
<pre><code>first, *rest = [1, 2, 3, 4]
for name, amount in zip(names, amounts):
    print(name, amount)

record = ("West", 2026, 12500)
region, year, revenue = record</code></pre>

<h3>Copy caveat</h3>
<pre><code>a = [1, 2, 3]
b = a            # same object! mutating b changes a
c = a.copy()     # shallow copy
import copy
d = copy.deepcopy(a)   # for nested structures</code></pre>
<div class="callout interview"><b>Interview classic</b>"How would you count word frequency in a document?" → <code>Counter(text.split()).most_common(10)</code>, or manually with a <code>defaultdict(int)</code> loop. Explaining the manual version first shows you understand the mechanism.</div>`
    },
    {
      id: "p3",
      title: "Control flow: conditionals and loops",
      minutes: 11,
      lede: "if/elif/else, for/while, break/continue, enumerate and the Pythonic patterns that replace index-based loops.",
      body: `
<h3>Conditionals</h3>
<pre><code>margin = (revenue - cost) / revenue if revenue else 0

if margin >= 0.40:
    tier = "Excellent"
elif margin >= 0.25:
    tier = "Healthy"
elif margin >= 0.10:
    tier = "Watch"
else:
    tier = "Critical"</code></pre>
<p>Guard against division by zero with the inline <code>if revenue else 0</code> pattern. Interviewers notice defensive code.</p>

<h3>Looping correctly</h3>
<pre><code># bad
for i in range(len(rows)):
    print(rows[i]["id"])

# good
for row in rows:
    print(row["id"])

# with index
for i, row in enumerate(rows, start=1):
    print(i, row["id"])

# parallel lists
for name, amount in zip(names, amounts):
    print(name, amount)

# dict
for key, value in totals.items():
    print(key, value)</code></pre>

<h3>break, continue, else</h3>
<pre><code>for row in rows:
    if row["amount"] &lt; 0:
        continue          # skip refunds
    if row["id"] == target:
        found = row
        break
else:
    found = None          # ran out without break</code></pre>

<h3>while and input validation</h3>
<pre><code>attempts = 0
while attempts < 3:
    value = fetch()
    if value is not None:
        break
    attempts += 1</code></pre>

<h3>Nested loops are a smell</h3>
<p>Two nested loops over 100k rows each is 10 billion operations. Use a dict for O(1) lookup instead:</p>
<pre><code># O(n*m) — slow
for order in orders:
    for product in products:
        if order["sku"] == product["sku"]:
            order["price"] = product["price"]
            break

# O(n+m) — fast
price_by_sku = {p["sku"]: p["price"] for p in products}
for order in orders:
    order["price"] = price_by_sku.get(order["sku"], 0)</code></pre>
<div class="callout interview"><b>Interview classic</b>"Explain list comprehensions and when you'd avoid them." → Concise expressions that build a list from an iterable, optionally filtered. Avoid when the logic needs multiple statements, side effects, or exception handling — readability wins.</div>`
    },
    {
      id: "p4",
      title: "Functions, arguments and modules",
      minutes: 12,
      lede: "Write reusable analysis code with default arguments, *args/**kwargs, type hints and docstrings — plus the mutable-default gotcha.",
      body: `
<h3>Defining a function</h3>
<pre><code>def margin(revenue: float, cost: float) -> float:
    """Return gross margin as a fraction. 0 if revenue is 0."""
    if revenue == 0:
        return 0.0
    return (revenue - cost) / revenue</code></pre>
<p>Type hints are documentation, not enforcement. They make editors useful and code reviews faster.</p>

<h3>The mutable default trap</h3>
<pre><code>def add_metric(v, bucket=[]):   # WRONG - shared across calls
    bucket.append(v)
    return bucket

def add_metric(v, bucket=None): # CORRECT
    bucket = [] if bucket is None else bucket
    bucket.append(v)
    return bucket</code></pre>
<p>Default arguments are evaluated once at definition time. This is a very common interview question.</p>

<h3>Flexible signatures</h3>
<pre><code>def summarize(*values, **options):
    digits = options.get("digits", 2)
    return round(sum(values) / len(values), digits)

summarize(1, 2, 3, digits=1)   # 2.0</code></pre>

<h3>Returning multiple values</h3>
<pre><code>def describe(series):
    return series.min(), series.max(), series.mean()

lo, hi, avg = describe(df["price"])</code></pre>

<h3>Scope and closures</h3>
<pre><code>rate = 0.2          # global
def net(amount):
    return amount * (1 - rate)   # reads global

def apply_all(fn, values):
    return [fn(v) for v in values]

apply_all(net, [100, 200])</code></pre>
<p>Pass functions as arguments — it is the basis of reusable pipelines.</p>

<h3>Modules and imports</h3>
<pre><code>import math
from statistics import mean, median
import pandas as pd
from src.cleaning import standardize_regions   # your own code

if __name__ == "__main__":
    main()</code></pre>
<div class="callout"><b>Style</b>One function, one job. If a function needs a comment to explain its middle section, split it. Name functions with verbs (<code>clean_orders</code>, <code>compute_cohorts</code>), not with data (<code>data2</code>).</div>
<div class="callout interview"><b>Interview classic</b>"What does <code>if __name__ == '__main__'</code> do?" → It runs the block only when the file is executed directly, not when imported as a module. It separates library code from script behaviour.</div>`
    },
    {
      id: "p5",
      title: "Error handling and file I/O",
      minutes: 11,
      lede: "try/except/else/finally, raising clear errors, and reading CSV, JSON and text files safely.",
      body: `
<h3>try / except / finally</h3>
<pre><code>try:
    qty = int(row["quantity"])
except (ValueError, TypeError):
    qty = 0
    bad_rows.append(row)
else:
    clean.append({**row, "quantity": qty})
finally:
    log.info("processed %s", row.get("id"))</code></pre>
<p>Catch <strong>specific exceptions</strong>. A bare <code>except:</code> swallows bugs such as typos in variable names and hides real failures.</p>

<h3>Raising your own errors</h3>
<pre><code>def validate(df, required):
    missing = set(required) - set(df.columns)
    if missing:
        raise ValueError(f"Missing columns: {missing}")

try:
    validate(df, ["order_id", "amount", "date"])
except ValueError as e:
    print(f"Data contract failed: {e}")
    raise</code></pre>
<p>Data validation at the start of a pipeline is worth more than heroic cleaning at the end. This is exactly what a "data contract" means in modern analytics.</p>

<h3>Reading files</h3>
<pre><code># text
with open("notes.txt", encoding="utf-8") as f:
    lines = f.read().splitlines()

# CSV without pandas (small files)
import csv
with open("sales.csv", newline="", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        print(row["region"], row["amount"])

# JSON
import json
with open("config.json", encoding="utf-8") as f:
    cfg = json.load(f)</code></pre>
<p>Always pass <code>encoding="utf-8"</code>; the default varies by platform and mangles accented characters on Windows.</p>

<h3>Writing output</h3>
<pre><code>import csv
with open("out.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=["region", "total"])
    w.writeheader()
    w.writerows(results)</code></pre>
<div class="callout warn"><b>Never do this</b>Do not write to a file you are also reading in a loop, and never overwrite raw data. Write to a new timestamped path: <code>processed/sales_2026-11-06.csv</code>.</div>
<div class="callout interview"><b>Interview classic</b>"How do you handle a CSV with 10 million rows that will not fit in memory?" → Read in chunks (<code>pd.read_csv(..., chunksize=100_000)</code>) and aggregate each chunk; or push the file into a database / use DuckDB / Polars; or filter columns and rows at read time with <code>usecols</code> and <code>dtype</code>.</div>`
    },
    {
      id: "p6",
      title: "Pythonic patterns that save hours",
      minutes: 12,
      lede: "Sorting with keys, lambda, map/filter, Counter, groupby-lite patterns, and date handling with datetime.",
      body: `
<h3>Sorting by a key</h3>
<pre><code>rows.sort(key=lambda r: r["revenue"], reverse=True)
sorted(rows, key=lambda r: (r["region"], -r["revenue"]))   # multi-key

from operator import itemgetter
sorted(rows, key=itemgetter("region", "revenue"))</code></pre>

<h3>Counter — frequency analysis</h3>
<pre><code>from collections import Counter
Counter(["West","West","East"]).most_common()   # [('West',2),('East',1)]
Counter(row["channel"] for row in rows)</code></pre>

<h3>groupby-lite without pandas</h3>
<pre><code>from itertools import groupby
rows.sort(key=lambda r: r["region"])           # must sort first
for region, group in groupby(rows, key=lambda r: r["region"]):
    total = sum(r["amount"] for r in group)
    print(region, total)</code></pre>
<p>In practice use <code>df.groupby()</code>. Knowing the pure-Python version is a good sign of depth.</p>

<h3>Dates with datetime</h3>
<pre><code>from datetime import datetime, timedelta, date

d = datetime.strptime("2026-11-06", "%Y-%m-%d").date()
d.strftime("%d %b %Y")             # '06 Nov 2026'
d + timedelta(days=30)
d.isoweekday()                     # 1=Mon ... 7=Sun
(d2 - d1).days                     # difference in days

# month key for grouping
d.strftime("%Y-%m")</code></pre>
<p>Common formats: <code>%Y-%m-%d</code>, <code>%d/%m/%Y</code>, <code>%b %d, %Y</code>. Use <code>dateutil.parser.parse</code> when the format is inconsistent.</p>

<h3>Quick statistics without numpy</h3>
<pre><code>from statistics import mean, median, mode, stdev, quantiles
mean(values), median(values), stdev(values)
quantiles(values, n=4)     # quartiles</code></pre>

<h3>Comprehension cookbook</h3>
<pre><code>squares      = {x: x**2 for x in range(5)}
unique       = {r["region"] for r in rows}
pairs        = [(r["id"], r["amount"]) for r in rows if r["amount"] > 0]
index        = {r["id"]: r for r in rows}       # O(1) lookup</code></pre>
<div class="callout interview"><b>Interview classic</b>"Find the second-highest salary." → <code>sorted(set(salaries), reverse=True)[1]</code> handles ties; the SQL equivalent is <code>DENSE_RANK() OVER (ORDER BY salary DESC) = 2</code>. Mention both and you cover two rounds at once.</div>`
    }
  ]
},

{
  id: "pandas",
  track: "python",
  icon: "🐼",
  title: "NumPy &amp; Pandas",
  blurb: "The analyst's engine room: reading data, slicing, filtering, groupby, joins, reshaping and time series.",
  lessons: [
    {
      id: "n1",
      title: "NumPy essentials",
      minutes: 12,
      lede: "Arrays, vectorization, broadcasting and the statistics functions that make pandas fast.",
      body: `
<h3>Why NumPy exists</h3>
<p>Pure Python loops over a million numbers take seconds; NumPy's vectorized operations run in C and take milliseconds. pandas is built on it. The rule: <strong>avoid Python-level loops over numeric columns</strong>.</p>
<pre><code>import numpy as np
a = np.array([1, 2, 3, 4])
a * 2                 # array([2, 4, 6, 8])  - no loop
a.mean(), a.std(), a.sum()</code></pre>

<h3>Creating arrays</h3>
<pre><code>np.zeros(5)
np.ones((2, 3))
np.arange(0, 10, 2)        # [0 2 4 6 8]
np.linspace(0, 1, 5)       # 5 evenly spaced points
np.full(3, 7)
np.random.default_rng(42).normal(0, 1, 1000)</code></pre>

<h3>Shape, broadcasting and axes</h3>
<pre><code>m = np.array([[1, 2, 3], [4, 5, 6]])   # shape (2,3)
m.shape, m.dtype, m.ndim
m.sum(axis=0)     # column sums -> [5 7 9]
m.sum(axis=1)     # row sums    -> [6 15]

m * np.array([10, 20, 30])   # broadcast across rows</code></pre>
<p><code>axis=0</code> collapses down the rows (gives one value per column). <code>axis=1</code> collapses along columns (one value per row). This confuses everyone at first; memorise it with "axis is the direction you squash".</p>

<h3>Boolean masks and np.where</h3>
<pre><code>values = np.array([10, -5, 30, 0])
values[values > 0]                    # filter
np.where(values > 0, values, 0)       # replace negatives with 0
np.clip(values, 0, 20)                # cap the range</code></pre>

<h3>Statistics</h3>
<pre><code>x = np.array([2, 4, 4, 4, 5, 5, 7, 9])
x.mean(), np.median(x), x.std(ddof=1)
np.percentile(x, [25, 50, 75])
np.corrcoef(x, y)[0, 1]
np.unique(x, return_counts=True)</code></pre>
<div class="callout warn"><b>ddof matters</b><code>np.std()</code> defaults to the population formula (<code>ddof=0</code>); pandas and statistics default to the sample formula (<code>ddof=1</code>). Use <code>ddof=1</code> for a sample. Mixing them gives subtly wrong numbers, which is exactly the sort of thing an interviewer probes.</div>
<div class="callout interview"><b>Interview classic</b>"What is broadcasting?" → NumPy's rule for combining arrays of different shapes by stretching the smaller one along the mismatched dimension, as long as they are compatible (either equal or 1). It removes the need for explicit loops.</div>`
    },
    {
      id: "n2",
      title: "Series, DataFrames and loading data",
      minutes: 14,
      lede: "read_csv with dtypes and dates, inspection methods, and the difference between views and copies.",
      body: `
<h3>Load with intent</h3>
<pre><code>import pandas as pd

df = pd.read_csv(
    "sales.csv",
    usecols=["order_id", "order_date", "region", "amount", "qty"],
    dtype={"region": "category", "order_id": "string"},
    parse_dates=["order_date"],
    na_values=["", "NA", "N/A", "-"],
)
print(df.shape)          # (rows, cols)
df.head()
df.info()                # dtypes + non-null counts
df.describe(include="all")</code></pre>
<p><code>dtype</code> reduces memory dramatically on large files. <code>category</code> for low-cardinality text can cut memory by 90%.</p>

<h3>Series vs DataFrame</h3>
<pre><code>df["amount"]        # Series (1D)
df[["amount"]]      # DataFrame (2D)
df.amount           # attribute access - avoid, clashes with methods
type(df["amount"])  # pandas.core.series.Series</code></pre>

<h3>Inspecting a new dataset in 60 seconds</h3>
<pre><code>df.shape
df.columns.tolist()
df.dtypes
df.isna().sum()
df.duplicated().sum()
df["region"].value_counts(dropna=False)
df["order_date"].min(), df["order_date"].max()
df["amount"].describe()</code></pre>

<h3>Views vs copies</h3>
<pre><code>sub = df[df["region"] == "West"]        # may be a view
sub = df[df["region"] == "West"].copy() # guaranteed independent

df.loc[df["amount"] < 0, "amount"] = 0  # .loc assignment on the original
</code></pre>
<div class="callout warn"><b>SettingWithCopyWarning</b>It means you are assigning into a slice that pandas cannot prove is yours. Fix by using <code>.loc</code> in one step on the original DataFrame, or by explicitly calling <code>.copy()</code> first. Never chain <code>df[mask]["col"] = value</code>.</div>

<h3>Other sources</h3>
<pre><code>pd.read_excel("book.xlsx", sheet_name="Data")
pd.read_json("events.json")
pd.read_parquet("part.parquet")               # fastest for big data
pd.read_sql(query, engine)
pd.read_html("https://example.com/table")     # scraped tables</code></pre>
<div class="callout interview"><b>Interview classic</b>"You open a 2 GB CSV and pandas runs out of memory. What do you do?" → Read only needed columns (<code>usecols</code>), set smaller dtypes, chunk with <code>chunksize</code>, convert CSV to Parquet, or use DuckDB/Polars. Naming three options shows real experience.</div>`
    },
    {
      id: "n3",
      title: "Selecting, filtering and sorting",
      minutes: 15,
      lede: "loc vs iloc, boolean masks, query(), isin(), between(), and safe assignment.",
      body: `
<h3>loc vs iloc</h3>
<table>
  <tr><th></th><th>Selection</th><th>Syntax</th></tr>
  <tr><td><code>.loc</code></td><td>label-based</td><td><code>df.loc[row_label, col_label]</code></td></tr>
  <tr><td><code>.iloc</code></td><td>integer position</td><td><code>df.iloc[row_pos, col_pos]</code></td></tr>
</table>
<pre><code>df.loc[0:4, ["region", "amount"]]   # labels 0..4 INCLUSIVE
df.iloc[0:5, 0:2]                   # positions 0..4 (exclusive end)
df.loc[df["region"] == "West", "amount"]
df.iloc[-1]                         # last row</code></pre>
<p>The inclusive/exclusive difference between <code>loc</code> and <code>iloc</code> is a classic interview question.</p>

<h3>Boolean filtering</h3>
<pre><code>df[df["amount"] > 1000]
df[(df["region"] == "West") &amp; (df["amount"] > 1000)]     # & not 'and'
df[~(df["status"] == "Cancelled")]                        # ~ not 'not'
df[df["region"].isin(["West", "North"])]
df[df["amount"].between(100, 500)]
df[df["customer"].str.contains("Ltd", case=False, na=False)]</code></pre>
<div class="callout warn"><b>Always parenthesise</b>Each condition needs its own parentheses and <code>&amp;</code>, <code>|</code>, <code>~</code> — Python's <code>and</code>/<code>or</code> do not work on Series because they expect single booleans.</div>

<h3>query() — readable filters</h3>
<pre><code>df.query("amount > 1000 and region == 'West'")
df.query("order_date >= '2026-01-01'")
df.query("amount > @threshold")      # @ references a Python variable</code></pre>

<h3>Sorting</h3>
<pre><code>df.sort_values("amount", ascending=False)
df.sort_values(["region", "amount"], ascending=[True, False])
df.nlargest(10, "amount")
df.nsmallest(5, "order_date")</code></pre>

<h3>Column operations</h3>
<pre><code>df["margin"] = (df["revenue"] - df["cost"]) / df["revenue"].replace(0, pd.NA)
df = df.rename(columns={"amt": "amount"})
df = df.drop(columns=["internal_flag"])
df = df.assign(amount_cents=lambda d: (d["amount"] * 100).round().astype("int64"))
df["region"] = df["region"].astype("category")</code></pre>
<p><code>assign</code> makes transformations chainable and testable — prefer it in pipelines.</p>
<div class="callout interview"><b>Interview classic</b>"Difference between <code>df.loc</code> and <code>df.iloc</code>?" and "why does <code>df[df.a &gt; 1]</code> fail with <code>and</code>?" Both are quick filters for real pandas competence. Answer with the operator table above.</div>`
    },
    {
      id: "n4",
      title: "GroupBy and aggregation",
      minutes: 16,
      lede: "The single most important pandas skill: split-apply-combine, named aggregation, transform and pivot_table.",
      body: `
<h3>Split–apply–combine</h3>
<pre><code>df.groupby("region")["amount"].sum()
df.groupby(["region", "category"])["amount"].agg(["sum", "mean", "count"])
df.groupby("region").agg(
    revenue=("amount", "sum"),
    orders=("order_id", "nunique"),
    avg_order=("amount", "mean"),
)
</code></pre>
<p>Named aggregation with tuples is the cleanest modern syntax and gives well-named columns in one step.</p>

<h3>The aggregation menu</h3>
<table>
  <tr><th>Function</th><th>Meaning</th></tr>
  <tr><td><code>sum</code>, <code>mean</code>, <code>median</code></td><td>Totals and central tendency</td></tr>
  <tr><td><code>count</code> / <code>size</code></td><td>Non-null count / row count</td></tr>
  <tr><td><code>nunique</code></td><td>Distinct count</td></tr>
  <tr><td><code>min</code>, <code>max</code></td><td>Range</td></tr>
  <tr><td><code>std</code>, <code>var</code></td><td>Spread</td></tr>
  <tr><td><code>first</code>, <code>last</code></td><td>Boundary values in order</td></tr>
</table>

<h3>transform — keep the row count</h3>
<pre><code>df["region_avg"] = df.groupby("region")["amount"].transform("mean")
df["pct_of_region"] = df["amount"] / df["region_avg"]
df["rank_in_region"] = df.groupby("region")["amount"].rank(ascending=False)</code></pre>
<p><code>agg</code> collapses rows; <code>transform</code> returns a Series aligned to the original index. This is the difference between a summary and a feature.</p>

<h3>filter — keep whole groups</h3>
<pre><code>df.groupby("customer").filter(lambda g: g["amount"].sum() > 10000)</code></pre>

<h3>pivot_table — the Excel pivot in code</h3>
<pre><code>pd.pivot_table(
    df,
    index="region",
    columns="category",
    values="amount",
    aggfunc="sum",
    margins=True,
    margins_name="Total",
    fill_value=0,
)</code></pre>

<h3>Cohort / retention pattern</h3>
<pre><code>df["cohort"] = df.groupby("customer")["order_date"].transform("min").dt.to_period("M")
df["order_month"] = df["order_date"].dt.to_period("M")
df["month_no"] = (df["order_month"] - df["cohort"]).apply(lambda x: x.n)

retention = (
    df.groupby(["cohort", "month_no"])["customer"]
      .nunique()
      .unstack(fill_value=0)
)
retention_pct = retention.div(retention[0], axis=0)</code></pre>
<p>This 6-line cohort matrix is the most-asked "show me pandas" exercise in analytics interviews.</p>
<div class="callout interview"><b>Interview classic</b>"Difference between <code>agg</code>, <code>transform</code> and <code>apply</code>?" → <code>agg</code> returns one row per group; <code>transform</code> returns one value per original row; <code>apply</code> runs an arbitrary function per group and is the slowest, most flexible fallback.</div>`
    },
    {
      id: "n5",
      title: "Merging, joining and concatenating",
      minutes: 14,
      lede: "merge types, join keys, validating cardinality, and diagnosing row-count explosions.",
      body: `
<h3>The four joins</h3>
<pre><code>pd.merge(orders, customers, on="customer_id", how="inner")  # matching only
pd.merge(orders, customers, on="customer_id", how="left")   # keep all orders
pd.merge(orders, customers, on="customer_id", how="right")  # keep all customers
pd.merge(orders, customers, on="customer_id", how="outer")  # keep everything</code></pre>
<table>
  <tr><th>how</th><th>Rows kept</th><th>Typical use</th></tr>
  <tr><td>inner</td><td>keys in both</td><td>Only complete records</td></tr>
  <tr><td>left</td><td>all left + matches</td><td>Enrich a fact table</td></tr>
  <tr><td>right</td><td>all right + matches</td><td>Reverse of left</td></tr>
  <tr><td>outer</td><td>all keys</td><td>Find unmatched on both sides</td></tr>
</table>

<h3>Different key names and multiple keys</h3>
<pre><code>pd.merge(orders, products, left_on="sku", right_on="product_code", how="left")
pd.merge(a, b, on=["date", "store_id"], how="inner")</code></pre>

<h3>Validate the join — always</h3>
<pre><code>before = len(orders)
merged = orders.merge(customers, on="customer_id", how="left", validate="many_to_one")
assert len(merged) == before, "row count changed - duplicate keys"

merged["customer_id"].isna().sum()        # unmatched left rows
merged["_merge"].value_counts()           # with indicator=True</code></pre>
<p><code>validate="many_to_one"</code> makes pandas raise an error if the right table has duplicate keys — an instant diagnosis for the classic "my join doubled my revenue" bug.</p>

<h3>Row explosion, explained</h3>
<pre><code>orders (100 rows)  ⋈  customers (2 identical customer_id rows)
→ 200 rows, revenue doubled</code></pre>
<p>Fix: deduplicate the dimension first (<code>customers.drop_duplicates("customer_id")</code>), or aggregate before joining.</p>

<h3>Concatenation</h3>
<pre><code>pd.concat([jan, feb, mar], ignore_index=True)        # stack rows
pd.concat([df1, df2], axis=1)                        # side by side
pd.concat(frames, keys=["2025", "2026"], names=["year", "idx"])</code></pre>

<h3>Suffixes and conflicts</h3>
<pre><code>pd.merge(a, b, on="id", suffixes=("_orders", "_customers"))</code></pre>
<div class="callout interview"><b>Interview classic</b>"After joining two tables your row count tripled. Why?" → Duplicate keys on the join column cause a cartesian blow-up within each key group. Diagnose with a <code>validate</code> check or <code>value_counts()</code> on the key, then deduplicate or aggregate before joining.</div>`
    },
    {
      id: "n6",
      title: "Missing data, duplicates and types",
      minutes: 13,
      lede: "isna/fillna/dropna strategy, interpolation, duplicate handling and converting dtypes safely.",
      body: `
<h3>Quantify first</h3>
<pre><code>df.isna().sum().sort_values(ascending=False)
df.isna().mean().mul(100).round(1)          # % missing per column
df[df["region"].isna()].head()
df["amount"].isna().sum() / len(df)</code></pre>
<p>Before filling anything, ask <em>why</em> it is missing. Three mechanisms: missing completely at random, missing dependent on another observed variable, missing dependent on the unobserved value itself (e.g. high earners skip income). Filling blindly biases the analysis.</p>

<h3>Dropping</h3>
<pre><code>df.dropna(subset=["amount"])            # only rows missing the key metric
df.dropna(thresh=len(df.columns) - 3)   # keep rows with &lt;=3 missing fields
df.drop(columns=["unused_flag"])</code></pre>

<h3>Filling</h3>
<pre><code>df["amount"] = df["amount"].fillna(0)                     # true zero
df["region"] = df["region"].fillna("Unknown")             # categorical
df["score"] = df["score"].fillna(df["score"].median())    # numeric
df["price"] = df.groupby("category")["price"].transform(lambda s: s.fillna(s.median()))

df["temp"] = df["temp"].interpolate(method="linear")      # time series
df["flag"] = df["flag"].ffill()                           # carry last value</code></pre>
<div class="callout warn"><b>Mean vs median</b>Filling with the mean distorts the distribution and shrinks variance. Filling with the median is safer with outliers; for time series, interpolate or forward-fill instead of using a global average.</div>

<h3>Duplicates</h3>
<pre><code>df.duplicated().sum()
df.duplicated(subset=["order_id", "line_no"]).sum()
df.drop_duplicates(subset=["order_id"], keep="last")
df.sort_values("updated_at").drop_duplicates("order_id", keep="last")</code></pre>
<p>"keep last after sorting by update time" is the standard way to deduplicate slowly-changing records.</p>

<h3>Type conversion</h3>
<pre><code>df["amount"] = pd.to_numeric(df["amount"], errors="coerce")   # bad -> NaN
df["order_date"] = pd.to_datetime(df["order_date"], errors="coerce")
df["region"] = df["region"].astype("category")
df["qty"] = df["qty"].astype("int32")

# cleaning text before conversion
df["amount"] = (df["amount"].astype(str)
                .str.replace(r"[$,]", "", regex=True)
                .pipe(pd.to_numeric, errors="coerce"))</code></pre>
<div class="callout interview"><b>Interview classic</b>"A column is 30% missing. What do you do?" → Investigate the mechanism and the business meaning; if the data is missing at random and the share is large, consider dropping the column or using a "Missing" category; if it is a key metric, impute with a justified method and add a flag column so downstream users know. Never silently fill with the mean.</div>`
    },
    {
      id: "n7",
      title: "Time series, reshaping and export",
      minutes: 14,
      lede: "Resampling, rolling windows, shift, melt/pivot, and writing clean outputs for dashboards.",
      body: `
<h3>Datetime accessors</h3>
<pre><code>s = df["order_date"]
s.dt.year, s.dt.month, s.dt.day_name(), s.dt.quarter
s.dt.to_period("M")            # month bucket for grouping
s.dt.is_month_end
(s.max() - s.min()).days</code></pre>

<h3>Resampling</h3>
<pre><code>ts = df.set_index("order_date").sort_index()
ts["amount"].resample("D").sum()
ts.resample("W").agg(revenue=("amount", "sum"), orders=("order_id", "nunique"))
ts.resample("MS").sum().fillna(0)       # month start buckets
</code></pre>
<p><code>resample</code> needs a DatetimeIndex. Use <code>"W"</code>, <code>"MS"</code>, <code>"Q"</code>, <code>"YS"</code> rather than ambiguous <code>"M"</code>.</p>

<h3>Rolling and shifting</h3>
<pre><code>ts["amount"].rolling(7).mean()                 # 7-period moving average
ts["amount"].expanding().sum()                 # cumulative
ts["prev"] = ts["amount"].shift(1)
ts["mom_growth"] = ts["amount"].pct_change()   # period-over-period
ts["yoy"] = ts["amount"].pct_change(12)        # year over year (monthly data)</code></pre>

<h3>Reshape: wide ↔ long</h3>
<pre><code>long = df.melt(id_vars=["region"], value_vars=["Q1","Q2","Q3","Q4"],
               var_name="quarter", value_name="revenue")
wide = long.pivot(index="region", columns="quarter", values="revenue")
wide = wide.stack().reset_index()   # back to long</code></pre>
<p>Most charting libraries and BI tools prefer <strong>long</strong> data. Excel pivots use <strong>wide</strong> presentation. Recognising which you have is half the work.</p>

<h3>Export</h3>
<pre><code>df.to_csv("clean_sales.csv", index=False)
df.to_excel("report.xlsx", sheet_name="Data", index=False)
df.to_parquet("clean_sales.parquet", index=False)   # typed, compressed
df.to_json("out.json", orient="records")
with pd.ExcelWriter("report.xlsx") as w:
    summary.to_excel(w, sheet_name="Summary")
    detail.to_excel(w, sheet_name="Detail")</code></pre>
<div class="callout"><b>Handoff hygiene</b>Export with <code>index=False</code>, snake_case column names, one header row, values not formulas, and a README describing each column. Whoever opens it next is your customer.</div>
<div class="callout interview"><b>Interview classic</b>"How would you compute a 7-day rolling average of daily signups?" → <code>df.set_index("date")["signups"].resample("D").sum().rolling(7).mean()</code>. Mention that the first 6 values are NaN by construction, and that <code>min_periods=1</code> changes that.</div>`
    }
  ]
}
);
