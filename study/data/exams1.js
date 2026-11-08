window.EXAMS = window.EXAMS || [];

window.EXAMS.push({
  id: "exam-sql",
  name: "SQL",
  icon: "🗄",
  minutes: 25,
  level: "Analyst screening · beginner to intermediate",
  topics: [
    { name: "SELECT, WHERE, ORDER BY, LIMIT", weight: "high" },
    { name: "Joins: INNER, LEFT, RIGHT, FULL, self-join", weight: "high" },
    { name: "Aggregates, GROUP BY, HAVING", weight: "high" },
    { name: "Subqueries and CTEs (WITH)", weight: "high" },
    { name: "Window functions: ROW_NUMBER, RANK, SUM OVER", weight: "high" },
    { name: "NULL semantics and three-valued logic", weight: "high" },
    { name: "Keys, constraints, normalisation", weight: "medium" },
    { name: "Transactions and ACID", weight: "medium" },
    { name: "UNION vs UNION ALL, DISTINCT vs GROUP BY", weight: "medium" },
    { name: "Indexes and why LIKE '%x' is slow", weight: "medium" }
  ],
  questions: [
    {
      t: "GROUP BY / HAVING",
      q: "Which clause filters rows AFTER aggregation has happened?",
      options: ["WHERE", "GROUP BY", "HAVING", "ORDER BY"],
      answer: 2,
      explain: "WHERE filters rows before grouping; HAVING filters the aggregated groups, e.g. HAVING COUNT(*) > 10."
    },
    {
      t: "Joins",
      q: "You want every customer, including those with no orders. Which join do you use?",
      options: ["INNER JOIN", "LEFT JOIN from customers to orders", "RIGHT JOIN from customers to orders", "CROSS JOIN"],
      answer: 1,
      explain: "A LEFT JOIN keeps all rows of the left table; customers without a match get NULL order columns. Swap the order to the right (orders on the left) and a RIGHT JOIN would also work — but the direction matters."
    },
    {
      t: "Aggregates",
      q: "A column `amount` holds the values 10, NULL, 20. What do COUNT(amount) and AVG(amount) return?",
      options: ["3 and 15", "2 and 15", "3 and 10", "2 and 10"],
      answer: 1,
      explain: "COUNT(column) ignores NULLs, so it returns 2. AVG also ignores NULLs, so it is (10+20)/2 = 15. Only COUNT(*) counts rows including NULLs."
    },
    {
      t: "NULL semantics",
      q: "Why does `WHERE manager_id = NULL` return no rows?",
      options: [
        "Because NULL equals nothing and the comparison evaluates to UNKNOWN",
        "Because the column name is wrong",
        "Because you must use WHERE NULL = manager_id",
        "Because NULL is stored as an empty string"
      ],
      answer: 0,
      explain: "NULL means unknown, so any comparison with = returns UNKNOWN, which WHERE discards. Use IS NULL / IS NOT NULL."
    },
    {
      t: "NULL semantics",
      q: "Which expression returns rows where `email` is missing?",
      options: ["email = ''", "email IS NULL OR email = ''", "email <> NULL", "NOT(email = NULL)"],
      answer: 1,
      explain: "Missing data is often a mix of real NULLs and empty strings; both must be checked. The NULL comparisons return UNKNOWN and never match."
    },
    {
      t: "Window functions",
      q: "Which function gives every row a unique sequential number, even when values tie?",
      options: ["RANK()", "DENSE_RANK()", "ROW_NUMBER()", "NTILE()"],
      answer: 2,
      explain: "ROW_NUMBER() never repeats a number. RANK() leaves gaps after ties (1,1,3) and DENSE_RANK() does not (1,1,2), but both repeat numbers on ties."
    },
    {
      t: "Window functions",
      q: "What does `SUM(amount) OVER (PARTITION BY customer_id ORDER BY order_date)` give you?",
      options: [
        "The total for each customer across all orders",
        "A running total per customer, adding rows in date order",
        "The grand total across all customers",
        "The average order amount per customer"
      ],
      answer: 1,
      explain: "With an ORDER BY inside the window, the aggregate is a running (cumulative) total up to the current row. Remove ORDER BY to get the full partition total on every row."
    },
    {
      t: "Subqueries / CTEs",
      q: "Which statement is a correct CTE?",
      options: [
        "WITH recent AS (SELECT * FROM orders WHERE order_date > '2026-01-01') SELECT COUNT(*) FROM recent;",
        "CTE recent = SELECT * FROM orders;",
        "WITH recent SELECT * FROM orders;",
        "SET recent AS (SELECT * FROM orders);"
      ],
      answer: 0,
      explain: "A CTE is `WITH name AS (subquery) SELECT ... FROM name`. It exists only for that statement and is often cleaner than a nested subquery."
    },
    {
      t: "Joins",
      q: "How do you find customers with zero orders?",
      options: [
        "INNER JOIN orders and filter where order_id IS NULL",
        "LEFT JOIN orders and filter WHERE orders.customer_id IS NULL",
        "CROSS JOIN orders and count",
        "SELECT * FROM customers WHERE COUNT(orders.id) = 0"
      ],
      answer: 1,
      explain: "Left join then keep the NULL side, or use NOT EXISTS. Filtering an INNER JOIN on a NULL right-side column always returns nothing, because no unmatched row survives the join."
    },
    {
      t: "UNION",
      q: "What is the difference between UNION and UNION ALL?",
      options: [
        "UNION keeps duplicates, UNION ALL removes them",
        "UNION ALL keeps duplicates and avoids the extra sort, so it is faster",
        "They are identical",
        "UNION only works on three or more tables"
      ],
      answer: 1,
      explain: "UNION deduplicates (which costs a sort or hash) and removes duplicates across the combined results. UNION ALL just stacks rows, so prefer it when duplicates are impossible or allowed."
    },
    {
      t: "Aggregates",
      q: "Which query counts unique users in a table?",
      options: ["SELECT COUNT(user_id) FROM events;", "SELECT COUNT(DISTINCT user_id) FROM events;", "SELECT DISTINCT COUNT(*) FROM events;", "SELECT SUM(user_id) FROM events;"],
      answer: 1,
      explain: "COUNT(DISTINCT col) counts unique non-NULL values. DISTINCT COUNT(*) is a syntax trap: DISTINCT would apply to the count result, not inside it."
    },
    {
      t: "Aggregates",
      q: "`SELECT dept, COUNT(*) FROM emp GROUP BY dept` — what breaks if you add `, name` to the SELECT list?",
      options: [
        "Nothing, name is picked arbitrarily",
        "Most engines reject it because name is not grouped or aggregated",
        "It returns an error only when there are NULLs",
        "It silently returns all names in one row"
      ],
      answer: 1,
      explain: "Every non-aggregated column in the SELECT list must appear in GROUP BY (or be wrapped in an aggregate such as MAX(name)). MySQL may allow it with ONLY_FULL_GROUP_BY off — that is a setting, not portable SQL."
    },
    {
      t: "DISTINCT",
      q: "You need one row per (country, city) combination. What is the clearest query?",
      options: [
        "SELECT DISTINCT country, city FROM customers;",
        "SELECT UNIQUE country, city FROM customers;",
        "SELECT country, city FROM customers ORDER BY 1;",
        "SELECT country FROM customers;"
      ],
      answer: 0,
      explain: "DISTINCT applies to the whole selected row, so two columns give unique combinations. GROUP BY country, city produces the same set and is what you would use if you also need aggregates."
    },
    {
      t: "Top-N per group",
      q: "How do you get the top 3 orders by amount for each customer in a modern SQL engine?",
      options: [
        "ORDER BY amount DESC LIMIT 3",
        "RANK() OVER (PARTITION BY customer_id ORDER BY amount DESC) in a subquery, then filter rank <= 3",
        "GROUP BY customer_id with MAX(amount)",
        "WHERE amount >= (SELECT MAX(amount) FROM orders)"
      ],
      answer: 1,
      explain: "LIMIT 3 applies to the whole result. A window rank inside a subquery or CTE ranks within each customer, and the outer query filters rank <= 3. Use DENSE_RANK if ties should share a place."
    },
    {
      t: "Indexes",
      q: "Which WHERE clause can use a normal B-tree index on `name`?",
      options: ["WHERE name LIKE '%smith'", "WHERE name LIKE 'Smi%'", "WHERE LOWER(name) = 'smith' on an unindexed expression", "WHERE name LIKE '%mit%'"],
      answer: 1,
      explain: "A prefix search keeps the leading characters known, so the index can seek. Leading-wildcard patterns have to scan every row. LOWER(name) needs a functional index to be fast."
    },
    {
      t: "LIKE",
      q: "Which pattern matches exactly three characters: 'ab' followed by one more?",
      options: ["'ab%'", "'ab_'", "'a_b'", "'%ab'"],
      answer: 1,
      explain: "% matches any number of characters including none; _ matches exactly one character. So 'ab_' matches 'abc' but not 'ab' or 'abcd'."
    },
    {
      t: "Keys",
      q: "Which is true of a PRIMARY KEY compared with a UNIQUE constraint?",
      options: [
        "A table can have several primary keys",
        "A primary key cannot contain NULLs and there is at most one per table",
        "UNIQUE columns can contain NULLs but primary keys are always indexed twice",
        "They are identical in every engine"
      ],
      answer: 1,
      explain: "One primary key per table, never NULL, and it is indexed. UNIQUE allows multiple NULLs in most engines (SQL Server allows only one) and a table can have many unique constraints."
    },
    {
      t: "Transactions",
      q: "A transfer debits one account and credits another, and both must succeed or neither. Which ACID property is that?",
      options: ["Atomicity", "Consistency", "Isolation", "Durability"],
      answer: 0,
      explain: "Atomicity means all-or-nothing. Consistency means rules hold before and after, isolation means concurrent transactions do not interfere, durability means committed data survives a crash."
    },
    {
      t: "Foreign keys",
      q: "What does a FOREIGN KEY constraint guarantee?",
      options: [
        "That the column is unique",
        "That every value references an existing row in the parent table",
        "That the table is sorted",
        "That queries on the column always use an index"
      ],
      answer: 1,
      explain: "It enforces referential integrity: you cannot insert an orphan or delete a parent that children still point to (unless cascade or set-null is declared)."
    },
    {
      t: "Second highest",
      q: "Which approach reliably returns the second-highest salary, even with duplicate salaries?",
      options: [
        "SELECT salary FROM emp ORDER BY salary DESC LIMIT 1 OFFSET 1",
        "SELECT MAX(salary) FROM emp WHERE salary < (SELECT MAX(salary) FROM emp)",
        "SELECT salary FROM emp ORDER BY salary ASC LIMIT 2",
        "SELECT salary FROM emp GROUP BY salary HAVING COUNT(*) = 1"
      ],
      answer: 1,
      explain: "The 'max below the max' form returns the second distinct salary. ORDER BY DESC LIMIT 1 OFFSET 1 returns the second row, which may be a duplicate of the highest. DENSE_RANK() = 2 is the modern equivalent."
    }
  ]
});

window.EXAMS.push({
  id: "exam-excel",
  name: "Excel",
  icon: "▦",
  minutes: 25,
  level: "Analyst screening · formulas, lookups and pivots",
  topics: [
    { name: "Cell references: relative, absolute, mixed", weight: "high" },
    { name: "Lookups: VLOOKUP, INDEX/MATCH, XLOOKUP", weight: "high" },
    { name: "Conditional logic: IF, IFS, AND/OR, IFERROR", weight: "high" },
    { name: "Conditional aggregation: SUMIFS, COUNTIFS, AVERAGEIFS", weight: "high" },
    { name: "Pivot tables and pivot charts", weight: "high" },
    { name: "Cleaning: TRIM, TEXT, TEXTJOIN, Remove Duplicates", weight: "medium" },
    { name: "Tables, structured references, sorting and filters", weight: "medium" },
    { name: "Validation, conditional formatting, freeze panes", weight: "medium" },
    { name: "Chart choice and number formats", weight: "medium" },
    { name: "Errors: #N/A, #REF!, #VALUE!, circular references", weight: "medium" }
  ],
  questions: [
    {
      t: "References",
      q: "You copy `=A2*B2` from C2 down to C3. What does the formula in C3 read?",
      options: ["=A2*B2", "=A3*B3", "=$A$3*$B$3", "=A4*B4"],
      answer: 1,
      explain: "Relative references shift with the cell. Both row and column adjust by the offset, so a copy one row down becomes A3 and B3."
    },
    {
      t: "References",
      q: "In `=$A2*B$1`, what happens to each part when the formula is copied one column right and one row down?",
      options: [
        "Both parts move",
        "Column A stays fixed, row 2 moves; row 1 stays fixed, column B moves",
        "Nothing moves",
        "The formula returns #REF!"
      ],
      answer: 1,
      explain: "The $ anchors what follows it. $A2 keeps the column but lets the row move; B$1 keeps the row but lets the column move. That is how a lookup grid is built."
    },
    {
      t: "Lookups",
      q: "What is the main structural limitation of VLOOKUP?",
      options: [
        "It only works with numbers",
        "It can only return values to the right of the lookup column",
        "It cannot handle more than 100 rows",
        "It requires sorted data even with FALSE"
      ],
      answer: 1,
      explain: "VLOOKUP returns the nth column counted to the right of the key. XLOOKUP or INDEX/MATCH can return values in any direction."
    },
    {
      t: "Lookups",
      q: "Which formula is the most robust when columns may be inserted in the source table?",
      options: [
        "=VLOOKUP(A2, Sheet2!A:D, 4, FALSE)",
        "=INDEX(Sheet2!D:D, MATCH(A2, Sheet2!A:A, 0))",
        "=VLOOKUP(A2, Sheet2!A:D, 4, TRUE)",
        "=SUMIF(Sheet2!A:A, A2, Sheet2!D:D)"
      ],
      answer: 1,
      explain: "INDEX/MATCH and XLOOKUP refer to the return column itself, so inserting columns does not break them. A hard-coded column index (4) silently points at the wrong column after a shift."
    },
    {
      t: "Lookups",
      q: "In `=VLOOKUP(A2, Table, 3, FALSE)` what does the final FALSE do?",
      options: [
        "Forces an exact match",
        "Allows an approximate match",
        "Hides errors",
        "Returns FALSE when not found"
      ],
      answer: 0,
      explain: "The fourth argument is range_lookup: FALSE means exact match. Omitting it (or TRUE) allows an approximate match on sorted data and quietly returns the wrong row when data is unsorted."
    },
    {
      t: "Conditional aggregation",
      q: "Which formula sums column D where B equals 'North' and C is greater than 100?",
      options: [
        "=SUMIFS(D:D, B:B, \"North\", C:C, \">100\")",
        "=SUMIF(D:D, B:B, \"North\")",
        "=SUMPRODUCT(D:D) + COUNTIF(C:C, \">100\")",
        "=COUNTIFS(B:B, \"North\", C:C, \">100\")"
      ],
      answer: 0,
      explain: "SUMIFS takes the sum range first, then pairs of criteria range and criterion. COUNTIFS would count the matching rows rather than add their amounts."
    },
    {
      t: "Conditional aggregation",
      q: "What does `=COUNTIFS(A:A, \"*\")` do?",
      options: [
        "Counts nothing",
        "Counts all non-empty text cells",
        "Counts all cells including blanks",
        "Counts only asterisks"
      ],
      answer: 1,
      explain: "The * wildcard matches any run of text, so this counts text values. Blanks and numeric cells are not matched, which makes it a quick text-only row count."
    },
    {
      t: "Errors",
      q: "You see #N/A in a VLOOKUP result. What is the most likely cause?",
      options: [
        "The lookup value is not found in the first column",
        "The file is too large",
        "The cell is formatted as text",
        "The formula is circular"
      ],
      answer: 0,
      explain: "#N/A means not found — often a trailing space, a number stored as text, or the key truly absent. #REF! is a deleted reference and #VALUE! is a wrong argument type."
    },
    {
      t: "Errors",
      q: "What does `=IFERROR(A2/B2, 0)` return when B2 is zero?",
      options: ["#DIV/0!", "0", "Blank", "NULL"],
      answer: 1,
      explain: "IFERROR replaces any error with the fallback value, so a division by zero becomes 0. Use it deliberately — wrapping everything hides real mistakes."
    },
    {
      t: "Conditional logic",
      q: "Which formula returns 'Pass' when A2 is at least 70 and 'Fail' otherwise?",
      options: ["=IF(A2 >= 70, \"Pass\", \"Fail\")", "=IF(A2 => 70, \"Pass\", \"Fail\")", "=IF(A2 >= 70; \"Pass\")", "=IF(A2 = 70, \"Pass\", \"Fail\")"],
      answer: 0,
      explain: ">= is the correct operator; => is invalid in Excel. IF needs a condition, a value when true, and a value when false."
    },
    {
      t: "Conditional logic",
      q: "What does `=IFS(A2 > 90, \"A\", A2 > 80, \"B\", TRUE, \"C\")` return for A2 = 85?",
      options: ["A", "B", "C", "#N/A"],
      answer: 1,
      explain: "IFS evaluates pairs in order and returns the first true one; 85 is above 80 so the answer is B. The final TRUE, \"C\" is the catch-all."
    },
    {
      t: "Pivot tables",
      q: "Your source data changed but the pivot table still shows old numbers. What do you do?",
      options: ["Recreate the pivot", "Refresh the pivot table", "Re-save the file", "Recalculate with Ctrl+Alt+F9"],
      answer: 1,
      explain: "Pivots cache their source. Data → Refresh (or Refresh All) reloads it. A pivot built on a plain range also needs the range extended when rows are added — use a Table instead."
    },
    {
      t: "Pivot tables",
      q: "Where do you change a value field from a sum to a share of the grand total?",
      options: [
        "Value Field Settings → Show Values As",
        "Insert → Chart",
        "Data → Sort",
        "Home → Conditional Formatting"
      ],
      answer: 0,
      explain: "Value Field Settings holds both the aggregation and Show Values As options such as % of Grand Total, % of Row Total and Running Total."
    },
    {
      t: "Cleaning",
      q: "Which function removes leading, trailing and repeated internal spaces?",
      options: ["CLEAN(A2)", "TRIM(A2)", "SUBSTITUTE(A2, \" \", \"\")", "PROPER(A2)"],
      answer: 1,
      explain: "TRIM removes extra spaces and keeps single spaces between words. CLEAN removes non-printing characters, SUBSTITUTE would also remove the spaces you want to keep, PROPER only changes case."
    },
    {
      t: "Cleaning",
      q: "Data → Remove Duplicates does what?",
      options: [
        "Deletes every row with a repeated value in any column",
        "Keeps the first occurrence per selected column combination and deletes the rest",
        "Hides duplicates without deleting",
        "Only works on numbers"
      ],
      answer: 1,
      explain: "You choose which columns define a duplicate; the first row in current order is kept and the later ones are deleted. Insert a helper ID column first if you need to undo."
    },
    {
      t: "Tables",
      q: "What does the structured reference `Table1[Sales]` give you?",
      options: [
        "The whole Sales column of Table1",
        "Only the first cell",
        "A named range of one row",
        "The header text"
      ],
      answer: 0,
      explain: "Structured references use table and column names, auto-expand when rows are added, and read better than A2:A500. Table1[[#Headers],[Sales]] would give the header cell."
    },
    {
      t: "Charts",
      q: "Which chart best shows revenue by month over two years?",
      options: ["Pie chart", "Line chart", "Scatter plot", "Treemap"],
      answer: 1,
      explain: "Time on the x-axis is a line-chart job because it shows trend and seasonality. Pie charts suit parts of a whole with few categories, scatter suits two numeric variables."
    },
    {
      t: "Validation",
      q: "You want a cell to accept only values from a fixed list. Which feature?",
      options: ["Data Validation → List", "Conditional Formatting", "Filter", "Freeze Panes"],
      answer: 0,
      explain: "Data → Data Validation → Allow: List, pointing at a range or a comma-separated list. It prevents bad input at the source, which beats cleaning it later."
    },
    {
      t: "Viewing",
      q: "What is Freeze Panes for?",
      options: [
        "Locking cells so they cannot be edited",
        "Keeping chosen rows or columns visible while scrolling",
        "Hiding formulas",
        "Splitting the workbook into files"
      ],
      answer: 1,
      explain: "Freeze Panes pins the header row or first column on screen. Protection (Review → Protect Sheet) is what stops editing."
    },
    {
      t: "Formatting",
      q: "A cell holds 0.256 and shows 25.6% only because of the number format. What is the underlying value?",
      options: ["25.6", "0.256", "\"25.6%\" text", "256"],
      answer: 1,
      explain: "Number formats change display only. Percentage format multiplies the display by 100, so the stored value stays 0.256 — which is what other formulas and charts use."
    }
  ]
});
