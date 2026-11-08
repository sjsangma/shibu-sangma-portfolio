window.QUIZZES = [
{
  id: "qz-foundations",
  module: "foundations",
  title: "Foundations of Data Analytics",
  questions: [
    { q: "Which type of analytics answers 'why did this happen?'", options: ["Descriptive", "Diagnostic", "Predictive", "Prescriptive"], answer: 1, explain: "Diagnostic analytics drills into causes; descriptive only reports what happened." },
    { q: "What is the correct order of the analysis lifecycle?", options: ["Clean → Frame → Explore → Communicate", "Frame → Acquire → Clean → Explore → Validate → Communicate", "Acquire → Communicate → Clean → Explore", "Explore → Frame → Acquire → Clean"], answer: 1, explain: "Framing the decision comes first; validation before communication is what separates professional work." },
    { q: "Which is the output of a successful analysis?", options: ["A polished chart", "A large dataset", "A decision someone acts on", "A statistical model"], answer: 2, explain: "If no decision changes, the analysis has not landed." },
    { q: "Which activity consumes the largest share of an analyst's day?", options: ["Modelling", "Data wrangling and validation", "Presenting", "Writing documentation"], answer: 1, explain: "Roughly 60% of the time goes to finding, cleaning and validating data." },
    { q: "What is the first thing to do when you receive a new dataset?", options: ["Build a dashboard", "Profile it: shape, types, nulls, duplicates", "Run a regression", "Export to Excel"], answer: 1, explain: "Profiling reveals structure and quality issues before any analysis decision." }
  ]
},
{
  id: "qz-excel",
  module: "excel",
  title: "Excel for Analysts",
  questions: [
    { q: "Which function handles lookups in any direction and defaults to exact match?", options: ["VLOOKUP", "HLOOKUP", "XLOOKUP", "LOOKUP"], answer: 2, explain: "XLOOKUP has no direction constraint and defaults to exact match." },
    { q: "Which is the safest way to sum with two conditions?", options: ["SUM", "SUMIFS", "SUMPRODUCT only", "COUNTIF"], answer: 1, explain: "SUMIFS is fast, readable, and supports multiple criteria pairs." },
    { q: "What does Power Query primarily provide?", options: ["Charting", "Repeatable data cleaning and loading", "Statistical testing", "Pivot caching"], answer: 1, explain: "Steps are recorded and re-run on refresh, replacing manual cleanup." },
    { q: "What does $A$1 do in a formula?", options: ["Locks both column and row", "Locks column only", "Locks row only", "Nothing"], answer: 0, explain: "Absolute reference — copying the formula does not shift the cell." },
    { q: "Why is an Excel Table preferable to a plain range?", options: ["It is smaller", "It auto-expands and supports structured references", "It allows more rows", "It disables formulas"], answer: 1, explain: "Tables grow with new data and keep formulas and charts aligned." }
  ]
},
{
  id: "qz-python",
  module: "python",
  title: "Python Fundamentals",
  questions: [
    { q: "Which structure guarantees unique elements and O(1) membership tests?", options: ["list", "tuple", "set", "dict key order"], answer: 2, explain: "A set stores unique values with hash-based lookup." },
    { q: "What is wrong with `def f(x, items=[])`?", options: ["Syntax error", "The default list is shared across calls", "It cannot accept kwargs", "It breaks type hints"], answer: 1, explain: "Mutable defaults are created once; use None and initialise inside." },
    { q: "Which reads a CSV into dicts per row?", options: ["csv.DictReader", "csv.reader", "open()", "json.load"], answer: 0, explain: "DictReader maps each row to a dict keyed by header." },
    { q: "What does an f-string `f\"{v:,.2f}\"` produce for v=1234.5?", options: ["1234.5", "1,234.50", "1234.50", "1.234,50"], answer: 1, explain: "Comma thousands separator and two decimals." },
    { q: "Which exception should you usually NOT catch?", options: ["ValueError", "KeyError", "A bare except", "TypeError"], answer: 2, explain: "Catching everything hides real bugs; catch specific exceptions." }
  ]
},
{
  id: "qz-pandas",
  module: "pandas",
  title: "pandas",
  questions: [
    { q: "Which selector uses labels and boolean masks?", options: ["iloc", "loc", "at only", "query only"], answer: 1, explain: "loc is label-based and accepts boolean masks." },
    { q: "Which argument makes merge() raise on an unexpected relationship?", options: ["how", "on", "validate", "suffixes"], answer: 2, explain: "validate='one_to_many' etc. catches fan-out errors." },
    { q: "How do you compute a within-group share?", options: ["groupby().sum()", "groupby().transform('sum')", "pivot_table", "melt"], answer: 1, explain: "transform broadcasts the group total back to every row." },
    { q: "What does resample('W').sum() require?", options: ["A numeric column", "A DatetimeIndex", "A MultiIndex", "A categorical column"], answer: 1, explain: "Resampling groups by time, so the index must be datetime." },
    { q: "Which is best for a 5 GB CSV with limited RAM?", options: ["read_csv with usecols, dtype, chunksize", "read_excel", "df.copy()", "iterrows"], answer: 0, explain: "Load only needed columns and typed data, or switch to Parquet." }
  ]
},
{
  id: "qz-sql",
  module: "sql",
  title: "SQL for Analysts",
  questions: [
    { q: "What is the logical execution order of a SELECT query?", options: ["SELECT, FROM, WHERE, GROUP BY", "FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT", "WHERE, FROM, SELECT, ORDER BY", "FROM, SELECT, WHERE, HAVING"], answer: 1, explain: "This is why SELECT aliases cannot be used in WHERE." },
    { q: "Which join keeps all rows from the left table?", options: ["INNER", "LEFT", "RIGHT", "CROSS"], answer: 1, explain: "LEFT keeps every left row and NULLs the right where unmatched." },
    { q: "What does RANK() produce for values 100, 90, 90, 80?", options: ["1,2,3,4", "1,2,2,4", "1,2,2,3", "1,1,2,3"], answer: 1, explain: "RANK leaves gaps after ties; DENSE_RANK does not." },
    { q: "How do you keep the latest row per key?", options: ["GROUP BY key", "ROW_NUMBER() over key ORDER BY ts DESC, filter rn=1", "DISTINCT", "LIMIT 1"], answer: 1, explain: "Window numbering then filtering in an outer query is the standard pattern." },
    { q: "Which query finds customers with no orders?", options: ["INNER JOIN orders", "LEFT JOIN orders WHERE orders.id IS NULL", "CROSS JOIN", "UNION ALL"], answer: 1, explain: "An anti-join; NOT EXISTS is the alternative." }
  ]
},
{
  id: "qz-stats",
  module: "stats",
  title: "Statistics & Experiments",
  questions: [
    { q: "A p-value of 0.03 means:", options: ["97% chance the effect is real", "3% chance of this data if the null were true", "3% chance of a bug", "The effect size is 3%"], answer: 1, explain: "It is a probability of the data under the null, not of the hypothesis." },
    { q: "Which metric best conveys precision?", options: ["p-value", "Confidence interval", "R²", "Sample mean"], answer: 1, explain: "An interval shows both the effect size and how precisely it is estimated." },
    { q: "Increasing sample size does what to standard error?", options: ["Increases it", "Halves it for every doubling", "Reduces it by √n", "No effect"], answer: 2, explain: "SE = s/√n, so quadrupling n halves the error." },
    { q: "What is a guardrail metric?", options: ["The primary success metric", "A metric that must not be harmed", "A vanity metric", "A leading indicator only"], answer: 1, explain: "Guardrails prevent optimisation that damages latency, refunds or support load." },
    { q: "Why is checking a test daily and stopping at p&lt;0.05 dangerous?", options: ["It costs more", "It inflates the false positive rate", "It reduces power only", "It changes the metric definition"], answer: 1, explain: "Repeated testing inflates type I error well above 5%." }
  ]
},
{
  id: "qz-viz",
  module: "viz",
  title: "Data Visualisation",
  questions: [
    { q: "Best chart for ranking 12 regions by revenue?", options: ["Pie", "Sorted horizontal bar", "Scatter", "Line"], answer: 1, explain: "Sorted bars make comparison precise and handle long labels." },
    { q: "Bar charts must usually start at:", options: ["The minimum value", "Zero", "The mean", "The median"], answer: 1, explain: "Bar length encodes value; truncation exaggerates differences." },
    { q: "Why avoid dual axes?", options: ["They are hard to build", "They imply relationships that may not exist", "They break tooltips", "They cannot be labelled"], answer: 1, explain: "Two scales invite false correlation readings." },
    { q: "Which is NOT an accessibility rule?", options: ["Do not rely on colour alone", "Keep contrast high", "Use red/green for good/bad", "Use sequential ramps for magnitude"], answer: 2, explain: "Red/green alone fails for colour vision deficiency." },
    { q: "What should a dashboard title contain?", options: ["The metric name", "The finding", "The data source", "The author"], answer: 1, explain: "State the insight: 'North drove 61% of the October decline'." }
  ]
},
{
  id: "qz-powerbi",
  module: "powerbi",
  title: "Power BI & DAX",
  questions: [
    { q: "In a star schema, filters should flow:", options: ["Fact → dimension", "Dimension → fact, single direction", "Both directions always", "Neither direction"], answer: 1, explain: "One-to-many with single-direction filtering keeps the model unambiguous." },
    { q: "Which is computed at query time in the current filter context?", options: ["Calculated column", "Measure", "Calculated table", "Relationship"], answer: 1, explain: "Measures are filter-context aware; columns are stored per row." },
    { q: "What does CALCULATE do?", options: ["Sorts a table", "Modifies filter context for an expression", "Creates a relationship", "Refreshes data"], answer: 1, explain: "It adds, removes or replaces filters around the expression." },
    { q: "Which measure computes year-over-year growth?", options: ["TOTALYTD", "SAMEPERIODLASTYEAR inside CALCULATE", "RANKX", "DIVIDE"], answer: 1, explain: "Revenue LY = CALCULATE([Revenue], SAMEPERIODLASTYEAR(dim_date[date]))." },
    { q: "Why is a marked date table required?", options: ["For slicing", "Time intelligence functions need a continuous date table", "To reduce file size", "For RLS"], answer: 1, explain: "YTD, YoY and similar functions rely on a complete date dimension." }
  ]
},
{
  id: "qz-eda",
  module: "eda",
  title: "Exploratory Data Analysis",
  questions: [
    { q: "What should you do before exploring a dataset?", options: ["Build a model", "Define the decision and the metric", "Export to Excel", "Remove outliers"], answer: 1, explain: "Without a decision, EDA has no stopping condition." },
    { q: "A sudden spike in row count on one date suggests:", options: ["A real business event", "A duplicate load or backfill", "Seasonality", "High retention"], answer: 1, explain: "Single-day cliffs are usually pipeline artefacts." },
    { q: "How should outliers be handled?", options: ["Always delete", "Verify, then keep with robust measures or exclude with a documented rule", "Always impute the mean", "Cap at p99 silently"], answer: 1, explain: "Deleting silently changes the answer; document the decision." },
    { q: "What does a flattening retention curve indicate?", options: ["A leaky product", "A healthy core of returning users", "Bad tracking", "Small sample"], answer: 1, explain: "A plateau means a stable loyal segment exists." },
    { q: "Why report both cumulative and step conversion in a funnel?", options: ["Redundancy", "The weakest step difference matters", "Tools require it", "To increase length"], answer: 1, explain: "Cumulative hides which step actually broke." }
  ]
},
{
  id: "qz-story",
  module: "story",
  title: "Insight & Storytelling",
  questions: [
    { q: "Which is an insight, not an observation?", options: ["Conversion is 3.1%", "Mobile conversion is 1.4pp lower and 68% of traffic, costing ~$230k/quarter", "Traffic rose", "There are 12 regions"], answer: 1, explain: "Insights add comparison, cause and size." },
    { q: "In the pyramid principle, what comes first?", options: ["Method", "The answer/recommendation", "The data source", "Caveats"], answer: 1, explain: "Answer first, then supporting points, then evidence." },
    { q: "What should a one-page memo contain?", options: ["Every chart you made", "Question, Answer, Evidence, Impact, Action, Caveats", "Only SQL", "A literature review"], answer: 1, explain: "Six bold labels keep it scannable and decision-ready." },
    { q: "Why include caveats?", options: ["To hedge", "They build trust by showing limits", "To fill space", "To avoid recommendations"], answer: 1, explain: "Stating limits before being asked is a credibility signal." },
    { q: "Never average:", options: ["Revenue over time", "Ratios with different denominators", "Counts", "Percent changes across the same denominator"], answer: 1, explain: "Pool numerators and denominators first." }
  ]
},
{
  id: "qz-governance",
  module: "governance",
  title: "Data Quality & Governance",
  questions: [
    { q: "Which dimension checks that data matches the source system?", options: ["Uniqueness", "Accuracy", "Timeliness", "Validity"], answer: 1, explain: "Accuracy is verified by reconciliation with a trusted source." },
    { q: "Pseudonymised data is:", options: ["Not personal data", "Still personal data", "Always anonymous", "Illegal"], answer: 1, explain: "It remains personal data because re-identification is possible." },
    { q: "What is data minimisation?", options: ["Deleting old data", "Collecting and using only what is necessary", "Compressing storage", "Removing duplicates"], answer: 1, explain: "A GDPR principle: no SELECT * on the user table." },
    { q: "You suspect PII was exposed. First step?", options: ["Investigate alone", "Stop the exposure and report internally immediately", "Email the affected customers", "Delete the logs"], answer: 1, explain: "Revoke access, preserve logs, report; notification timelines are legally bounded." },
    { q: "What prevents silent upstream schema changes breaking reports?", options: ["More dashboards", "A data contract with tests and alerts", "Manual checks", "A bigger warehouse"], answer: 1, explain: "Contracts make breaks loud at the producer." }
  ]
}
];
