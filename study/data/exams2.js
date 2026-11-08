window.EXAMS = window.EXAMS || [];

window.EXAMS.push({
  id: "exam-powerbi",
  name: "Power BI",
  icon: "▦",
  minutes: 20,
  level: "Analyst screening · modelling and DAX",
  topics: [
    { name: "Star schema and relationships", weight: "high" },
    { name: "Measures vs calculated columns", weight: "high" },
    { name: "Filter context and CALCULATE", weight: "high" },
    { name: "Core DAX: SUM, SUMX, COUNTROWS, DIVIDE, ALL, RELATED", weight: "high" },
    { name: "Time intelligence and the date table", weight: "high" },
    { name: "Power Query: shaping and cleaning at load", weight: "medium" },
    { name: "Import vs DirectQuery vs Live connection", weight: "medium" },
    { name: "Report vs dashboard, publish and refresh", weight: "medium" },
    { name: "Slicers, bookmarks, drill-through", weight: "medium" },
    { name: "Row-level security", weight: "medium" }
  ],
  questions: [
    {
      t: "Star schema",
      q: "In a star schema, which table holds the measurable events?",
      options: ["The dimension table", "The fact table", "The bridge table", "The date table"],
      answer: 1,
      explain: "The fact table holds numeric events (sales, clicks) plus foreign keys. Dimension tables hold descriptive attributes (product, customer) and are filtered one-side to many-side facts."
    },
    {
      t: "Relationships",
      q: "What cardinality connects a dimension table to a fact table in a clean model?",
      options: ["Many-to-many", "One-to-one", "One-to-many (dimension one, fact many)", "No relationship needed"],
      answer: 2,
      explain: "Each dimension row is unique (one side) and many fact rows reference it. Many-to-many relationships cause ambiguous filter paths and bloated results."
    },
    {
      t: "Measures",
      q: "What is the key difference between a measure and a calculated column?",
      options: [
        "A measure is stored per row; a calculated column is computed at query time",
        "A measure is evaluated at query time in the current filter context; a calculated column is computed at refresh and stored per row",
        "They are the same thing with a different icon",
        "A calculated column cannot use DAX"
      ],
      answer: 1,
      explain: "Calculated columns add stored values per row, which costs memory and does not react to slicers. Measures are evaluated when a visual renders, using the filter context of that visual."
    },
    {
      t: "Filter context",
      q: "What does `CALCULATE([Total Sales], Product[Colour] = \"Red\")` do?",
      options: [
        "Adds a Red column to the table",
        "Replaces the current filter on Colour with Red and evaluates the measure in that context",
        "Filters the whole report page to red",
        "Creates a new Red product"
      ],
      answer: 1,
      explain: "CALCULATE modifies the filter context for the expression it wraps: the Colour filter is replaced by Red while other filters from the visual stay in place."
    },
    {
      t: "DAX basics",
      q: "Which measure computes total revenue safely when quantity can be zero?",
      options: [
        "= SUM(Sales[Revenue]) / SUM(Sales[Quantity])",
        "= DIVIDE(SUM(Sales[Revenue]), SUM(Sales[Quantity]))",
        "= SUM(Sales[Revenue] / Sales[Quantity])",
        "= AVERAGE(Sales[Revenue])"
      ],
      answer: 1,
      explain: "DIVIDE returns BLANK instead of an error when the denominator is zero or blank. The / operator raises a division error and a row-level division inside SUM is usually wrong anyway."
    },
    {
      t: "DAX basics",
      q: "What is `SUMX` used for?",
      options: [
        "Summing a single column",
        "Summing the result of an expression evaluated row by row",
        "Counting rows",
        "Removing filters"
      ],
      answer: 1,
      explain: "SUM(Sales[qty]*Sales[price]) is invalid; SUMX iterates the table and sums qty*price per row. It is the workhorse for row-level calculation inside an aggregate."
    },
    {
      t: "DAX basics",
      q: "A measure must count the rows of the Sales table. Which expression is correct?",
      options: ["COUNT(Sales)", "COUNTROWS(Sales)", "COUNTA(Sales[*])", "SUM(Sales[Rows])"],
      answer: 1,
      explain: "COUNTROWS takes a table and counts its rows. COUNT requires a column and skips blanks."
    },
    {
      t: "DAX basics",
      q: "What does `ALL(Product[Category])` do inside CALCULATE?",
      options: [
        "Selects all categories in the model",
        "Removes any filter on Category for that calculation",
        "Sums every column",
        "Deletes the relationship"
      ],
      answer: 1,
      explain: "ALL ignores existing filters on the column, which is how you build 'share of total' measures: sales for the current category divided by sales with the category filter removed."
    },
    {
      t: "DAX basics",
      q: "In a fact table, how do you pull `Product[Name]` from the related dimension for a displayed value?",
      options: ["LOOKUP()", "RELATED(Product[Name])", "VALUES(Product[Name])", "SELECTEDVALUE(Product[Name])"],
      answer: 1,
      explain: "RELATED follows a many-to-one relationship from the fact to the dimension and is used in calculated columns. The reverse direction uses RELATEDTABLE."
    },
    {
      t: "Time intelligence",
      q: "What must exist before `TOTALYTD`, `SAMEPERIODLASTYEAR` and similar functions work?",
      options: [
        "A date table marked as a date table with one row per day and no gaps",
        "A measure named Date",
        "A slicer on the page",
        "DirectQuery mode"
      ],
      answer: 0,
      explain: "Time intelligence needs a continuous, marked date table related to the fact table's date column. Gaps or missing dates silently break year-to-date and prior-year comparisons."
    },
    {
      t: "Power Query",
      q: "Which statement best describes the split of work between Power Query and DAX?",
      options: [
        "Power Query builds visuals, DAX cleans data",
        "Power Query shapes and cleans data at load; DAX calculates at query time",
        "Both do the same job",
        "Power Query only works in Excel"
      ],
      answer: 1,
      explain: "Power Query steps are applied during refresh and stored in the model; DAX runs when a visual asks for numbers. Cleaning in Power Query usually beats fighting it later in DAX."
    },
    {
      t: "Storage mode",
      q: "When would you choose DirectQuery over Import?",
      options: [
        "When you need near-real-time data or data too large to import",
        "When you want the fastest visual rendering",
        "When you need full DAX time intelligence on all sources",
        "When the dataset has fewer than 1000 rows"
      ],
      answer: 0,
      explain: "DirectQuery queries the source at render time, so data is fresh but each visual is slower and source limits apply. Import is compressed in memory and much faster."
    },
    {
      t: "Report vs dashboard",
      q: "What is a dashboard in the Power BI service?",
      options: [
        "A single-page canvas of pinned visuals from one or more reports",
        "Another name for a report page",
        "A dataflow",
        "A workspace"
      ],
      answer: 0,
      explain: "Reports are the editable multi-page documents in the desktop app. Dashboards are a service-only single page of pinned tiles, often combining several reports."
    },
    {
      t: "Refresh",
      q: "Your model imports from an on-premises SQL Server. What is required for scheduled refresh in the service?",
      options: [
        "Nothing, the cloud connects directly",
        "A data gateway configured with credentials",
        "A published dashboard",
        "Premium capacity"
      ],
      answer: 1,
      explain: "The cloud service cannot reach an on-premises database without a gateway (personal or enterprise) that holds the credentials and passes queries through."
    },
    {
      t: "Slicers",
      q: "A slicer on the page filters which visuals?",
      options: [
        "All visuals on the page, unless interactions are edited",
        "Only the visual next to it",
        "None, slicers only affect measures",
        "Only tables"
      ],
      answer: 0,
      explain: "By default a slicer filters every visual on the page. Edit interactions when a card should stay as a fixed total."
    },
    {
      t: "Modelling",
      q: "Why should you usually avoid bi-directional relationships in a star schema?",
      options: [
        "They are not supported",
        "They create ambiguous filter paths and can produce wrong or slow results",
        "They break Power Query",
        "They prevent publishing"
      ],
      answer: 1,
      explain: "Both-direction filtering lets filters travel in unexpected loops, making results ambiguous and queries slower. Keep single-direction filters from dimension to fact."
    },
    {
      t: "Writing DAX",
      q: "Which is an explicit measure?",
      options: [
        "Dragging Sales[Amount] into a card and picking Sum",
        "Total Sales = SUM(Sales[Amount])",
        "A calculated column named Total",
        "A text box with a number typed in it"
      ],
      answer: 1,
      explain: "An explicit measure is written as name = expression and can be reused, formatted and documented. Implicit measures are the auto-generated sums you get by dragging a column."
    },
    {
      t: "Modelling",
      q: "Why do we hide raw columns such as Sales[Amount] from report view after creating measures?",
      options: [
        "To save memory",
        "To stop report authors summing them implicitly and to keep the field list clean",
        "To break the relationship",
        "To speed up refresh"
      ],
      answer: 1,
      explain: "Hiding columns does not delete them or free memory; it prevents accidental implicit aggregation and steers people to the vetted measures."
    },
    {
      t: "Security",
      q: "What does row-level security (RLS) do?",
      options: [
        "Hides columns from certain users",
        "Filters the rows each user can see based on a role's DAX filter",
        "Encrypts the dataset",
        "Restricts which reports can be opened"
      ],
      answer: 1,
      explain: "RLS roles carry a DAX table filter, for example Region = USERNAME(). Filtering rows is RLS; hiding columns is object-level security."
    },
    {
      t: "DAX error handling",
      q: "A measure shows (Blank) for some months. What is the most likely reason?",
      options: [
        "The DAX is broken",
        "No fact rows match the current filter context",
        "The date table is missing",
        "The report needs publishing"
      ],
      answer: 1,
      explain: "BLANK usually means the measure evaluated over an empty filter context. Check the relationship and whether that period really has rows before assuming a formula bug."
    }
  ]
});

window.EXAMS.push({
  id: "exam-python",
  name: "Python",
  icon: "⌨",
  minutes: 25,
  level: "Analyst screening · syntax, data structures, pandas",
  topics: [
    { name: "Types: int, float, str, bool; list vs tuple vs set vs dict", weight: "high" },
    { name: "Slicing, indexing, string methods", weight: "high" },
    { name: "Comprehensions and loops", weight: "high" },
    { name: "Functions, default arguments, *args/**kwargs", weight: "high" },
    { name: "Mutability, references, copy vs view", weight: "high" },
    { name: "Exceptions: try/except/finally", weight: "medium" },
    { name: "Files and context managers", weight: "medium" },
    { name: "pandas: loc/iloc, groupby, merge, missing data", weight: "high" },
    { name: "NumPy arrays and vectorisation", weight: "medium" },
    { name: "Environments, pip, virtualenv", weight: "medium" }
  ],
  questions: [
    {
      t: "Data structures",
      q: "Which structure is immutable?",
      options: ["list", "dict", "tuple", "set"],
      answer: 2,
      explain: "Tuples cannot be changed after creation, which makes them safe as dictionary keys. Lists, dicts and sets are mutable."
    },
    {
      t: "Slicing",
      q: "What does `\"hello\"[1:4]` return?",
      options: ["\"ell\"", "\"ello\"", "\"hell\"", "\"llo\""],
      answer: 0,
      explain: "The start index is included, the stop index is excluded: characters at 1, 2 and 3 give \"ell\"."
    },
    {
      t: "Slicing",
      q: "What is `[1, 2, 3, 4, 5][::-1]`?",
      options: ["[1, 2, 3, 4, 5]", "[5, 4, 3, 2, 1]", "[1, 5]", "A syntax error"],
      answer: 1,
      explain: "A step of -1 walks the list backwards, so the slice reverses it."
    },
    {
      t: "Comprehensions",
      q: "What is the value of `[x * 2 for x in range(3)]`?",
      options: ["[0, 1, 2]", "[0, 2, 4]", "[2, 4, 6]", "[1, 2, 3]"],
      answer: 1,
      explain: "range(3) yields 0, 1, 2 and each is doubled. Use a comprehension when a loop only exists to build a list."
    },
    {
      t: "Mutability",
      q: "What is the classic bug in `def add(item, bucket=[]): bucket.append(item); return bucket`?",
      options: [
        "Lists cannot be default arguments",
        "The default list is created once and shared across all calls",
        "append returns a new list",
        "It fails on the first call"
      ],
      answer: 1,
      explain: "Default arguments are evaluated once at definition time, so every call appends to the same list. Use bucket=None and create a new list inside."
    },
    {
      t: "Operators",
      q: "What is the difference between `==` and `is`?",
      options: [
        "They are identical for all objects",
        "`==` compares values; `is` compares identity (same object in memory)",
        "`is` compares values; `==` compares types",
        "`is` only works for numbers"
      ],
      answer: 1,
      explain: "Use is None, never is with strings or numbers. Python caches small ints and interns strings, so is can appear to work until it suddenly does not."
    },
    {
      t: "Functions",
      q: "What do `*args` and `**kwargs` collect?",
      options: [
        "Extra positional arguments as a tuple, and extra keyword arguments as a dict",
        "Two required arguments",
        "Only keyword arguments, twice",
        "Nothing unless the caller passes a list"
      ],
      answer: 0,
      explain: "args becomes a tuple of positional extras, kwargs a dict of named extras. That is how wrappers stay generic."
    },
    {
      t: "Functions",
      q: "What does `list.append(x)` return?",
      options: ["The new list", "None", "The appended item", "The list length"],
      answer: 1,
      explain: "append mutates in place and returns None, so `y = mylist.append(x)` sets y to None — a common beginner mistake."
    },
    {
      t: "Exceptions",
      q: "When does the `finally` block run?",
      options: [
        "Only when no exception occurred",
        "Only when an exception occurred",
        "Always, whether the try succeeded, failed, or returned early",
        "Only if you call it explicitly"
      ],
      answer: 2,
      explain: "finally is for cleanup and runs on every path, including a return inside try. That makes it right for closing files and connections."
    },
    {
      t: "Exceptions",
      q: "Which is the better error-handling practice?",
      options: [
        "except Exception: pass",
        "except ValueError as e: log.warning(\"bad row: %s\", e)",
        "except: continue",
        "Wrap the whole program in try/except"
      ],
      answer: 1,
      explain: "Catch the specific exception you can handle and record why. A bare except hides real failures, including typos and keyboard interrupts."
    },
    {
      t: "Files",
      q: "Why use `with open(path) as f:`?",
      options: [
        "It is the only way to open a file",
        "It closes the file automatically, even if an error occurs",
        "It reads the file faster",
        "It compresses the file"
      ],
      answer: 1,
      explain: "The context manager guarantees the close. Forgetting to close leaks file handles and can leave writes unflushed."
    },
    {
      t: "Dicts",
      q: "What does `{}.get(\"k\", 0)` return when key \"k\" is missing?",
      options: ["KeyError", "None", "0", "\"\""],
      answer: 2,
      explain: "get returns the default instead of raising. d[\"k\"] would raise KeyError."
    },
    {
      t: "Sets",
      q: "What is `len(set([1, 2, 2, 3, 3, 3]))`?",
      options: ["1", "2", "3", "6"],
      answer: 2,
      explain: "A set keeps unique values only, so it holds 1, 2 and 3. Sets are the fastest way to deduplicate and to test membership."
    },
    {
      t: "Builtins",
      q: "What does `enumerate([\"a\", \"b\"])` give you?",
      options: ["[\"a\", \"b\"]", "[(0, \"a\"), (1, \"b\")]", "{\"a\": 0, \"b\": 1}", "A syntax error"],
      answer: 1,
      explain: "enumerate pairs each item with its index, removing the manual counter loop. Use for i, value in enumerate(items)."
    },
    {
      t: "pandas",
      q: "What is the difference between `df.loc` and `df.iloc`?",
      options: [
        "loc is label-based; iloc is integer position-based",
        "loc is faster",
        "iloc works only on columns",
        "They are interchangeable"
      ],
      answer: 0,
      explain: "df.loc[df[\"x\"] > 5, \"y\"] selects by labels and boolean masks; df.iloc[0:3, 0:2] selects by position. Mixing them up after a sort silently returns the wrong rows."
    },
    {
      t: "pandas",
      q: "What does `df.groupby(\"region\")[\"sales\"].sum()` produce?",
      options: [
        "A single number",
        "A Series of total sales per region",
        "The original dataframe",
        "A list of regions"
      ],
      answer: 1,
      explain: "The result is indexed by region with one total each. Use reset_index() to get a flat dataframe back for further merging."
    },
    {
      t: "pandas",
      q: "What does `how=\"left\"` mean in `pd.merge(a, b, on=\"id\", how=\"left\")`?",
      options: [
        "Keep only rows present in both",
        "Keep all rows of a, filling b's columns with NaN where there is no match",
        "Keep all rows of b",
        "Merge on the leftmost column"
      ],
      answer: 1,
      explain: "Left keeps the left frame intact. Check the row count before and after every merge; a duplicated key on the right silently multiplies rows."
    },
    {
      t: "pandas",
      q: "How do you count missing values per column?",
      options: ["df.count()", "df.isna().sum()", "df.dropna().shape", "df.missing"],
      answer: 1,
      explain: "isna() marks missing cells, and sum adds the Trues per column. df.count() gives non-missing counts, which is the complement."
    },
    {
      t: "NumPy",
      q: "Why is `arr * 2` on a NumPy array faster than a Python loop?",
      options: [
        "It runs in another thread",
        "The operation is vectorised in compiled C over contiguous memory",
        "NumPy caches every result",
        "It uses less code, which is faster to type"
      ],
      answer: 1,
      explain: "Vectorised operations avoid per-element Python overhead. The same idea is why pandas operations beat apply() for large tables."
    },
    {
      t: "Environments",
      q: "What problem does a virtual environment solve?",
      options: [
        "It makes Python faster",
        "It isolates packages and versions per project",
        "It replaces pip",
        "It compiles code to bytecode ahead of time"
      ],
      answer: 1,
      explain: "A venv keeps each project's dependencies separate so upgrading one does not break another. Activate it, then pip install into it."
    }
  ]
});
