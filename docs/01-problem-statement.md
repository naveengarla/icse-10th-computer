# 1. Problem statement

## Who and why

- **Learner:** an ICSE **Class 10** student. She is a beginner in Java and learns alone on a laptop.
- **Exam:** a school **first-term Computer Applications** exam (Java, BlueJ style). It is **written on paper**, not on a computer.
- **Owner:** the student's parent, who commissions and reviews the work and gives instructions to the coding agent.
- **Time pressure:** about 14 hours of total preparation time were available when the project started (early October 2026). The Foundations milestone was budgeted at **4–6 hours** of her time.

### The core goal
The goal is not "know Java syntax". It is to **build a mental Java interpreter**: when she reads a short program on paper, she should be able to "see" it run line by line. That means:
- memory boxes changing
- expressions reducing one operation at a time
- one branch being taken
- loops repeating, with a pass count

On paper she must then **predict output**, **trace variables**, **evaluate expressions** and **write small programs**.

## Hard constraints

1. **Plain static files.** These must work:
   - on GitHub Pages
   - when `index.html` is double-clicked (the `file://` protocol, so no ES modules and no fetch of local files)
   - offline

   There is no build step and there are no npm dependencies at runtime.
2. **Laptop-first.** Pages should not break on narrower screens, but the laptop is the target.
3. **Correctness over everything.** A wrong answer key teaches the wrong thing. Answers are computed by the engine and cross-checked against real Java (JDK 21) in tests.
4. **Exam transfer.** Everything leads back to pen and paper: paper tasks, a self-check checklist, and school code style.

## Scope rules (from the owner, verbatim; do not relax)

> - Treat the school's exam portion/pattern as the authority for WHAT is examinable.
> - Treat the supplied school chapter PDFs, practical exercises, worksheets and solutions as the authority for the expected DEPTH and STYLE.
> - Do not automatically expand the syllabus based on the full Java language or generic online Java tutorials.
> - External Java resources may be used to improve explanations and pedagogy, but must not silently enlarge the examination scope.
> - Do not expand into unrelated Java packages such as java.io.
> - Do NOT invent a detailed chapter-wise scope for Chapter 1 (Revision of Class IX). Include only constructs evidenced in the worksheets and practicals.

**In practice:**
- No arrays, java.io, exceptions, `this`, access-specifier theory, wrapper-class details, generics, collections or lambdas.
- If something seems useful but is not clearly in the school material, **ask the owner** before adding it.

## Exam portion (First Term)

> Summary only. The **authoritative, detailed scope** is in [00-exam-scope.md](00-exam-scope.md), the owner's verbatim text. It gives a chapter-by-chapter topic list for Ch 2/3/4/5/8 and number-based logic. If this summary and that file ever disagree, 00-exam-scope.md wins.

| Ch | Topic |
|---|---|
| 1 | Revision of Class IX syntax (Java foundations) |
| 2 | Class as the basis of all computation |
| 3 | User-defined methods (and overloading) |
| 4 | Constructors (and overloading) |
| 5 | Library classes |
| 8 | String handling |
| — | Number-based logic programs (iterations) |

## Exam pattern (100 marks)

- **Section A: 40 marks, all compulsory.**
  - **Q1:** 20 MCQs.
  - **Q2:** 20 marks of short answers. These include theory, predicting output, conversions, writing Java expressions from formulas, and writing or rewriting Java statements.
- **Section B: 60 marks. Answer any 4 of 6** (15 marks each).

| Q | Type |
|---|---|
| Q3 | Data members + member methods (class specification) |
| Q4 | Method overloading |
| Q5 | Number logic (digit/loop programs) |
| Q6 | String methods |
| Q7 | Data members + member methods |
| Q8 | Constructor overloading |

**Priority insight:**
- Q3, Q7 and Q8 share the same class-specification skeleton, and Q5 builds directly on Foundations.
- So Foundations → objects/methods/constructors → number logic covers 4 answerable Section-B questions plus most of Section A.
- That is why the roadmap is in that order.

## Source material

**Use [school-material/](school-material/README.md).** It holds Markdown transcriptions of every school PDF, with identifying details removed:
- chapter notes for Ch 2, 3, 4, 5 and 8
- practical-exercise solutions for iterations, data members/methods, overloading, constructors and strings
- the worksheet bundle, including the Section-A practice paper

The original PDFs are only on the owner's machine, in `Sources/`. That folder is git-ignored and must never be committed, because it contains the school's name.

### What the school material showed, which sets depth and style
- **Section-A favourites:**
  - "Evaluate" with `++`/`--` inside `+=` (for example `a+=b+=c`, `p+=p++ + q++ - ++p`)
  - char arithmetic (`'2'+'d'` = 150)
  - ternary, switch fall-through, dangling else
  - `while(++a<=20);` with an empty body
  - "how many times does the loop run"
  - Math method outputs
  - "write the Java expression"
  - "rewrite as directed" (if↔ternary, while↔for, switch↔if)
- **Section-B patterns:**
  - digit loop `while(n>0){ d=n%10; ... n=n/10; }` with a **copy of n**
  - counters and accumulators
  - series with `1.0/i`
  - Fibonacci-style terms
  - flag + `break`
  - if-else-if slabs
  - nested-loop patterns
- **The student's real mistakes on the Section-A practice paper** (worksheets.md, section 5), which the content targets:
  - Thinks `Math.round` returns `1.0`/`8.0`/`-3.0`. It returns an integer type, so it prints `1`, `8`, `-3`. She does this consistently.
  - Drops brackets when converting formulas (`Math.sqrt(a)+Math.sqrt(b)/(a-b)`).
  - Counted the `for(a=34,b=5;a<=50;a+=b)` loop as 3 passes instead of 4.
  - Gave `Math.min('x','X')` as 87. It is 88: chars become int codes.
  - With nested calls, `Math.cbrt(Math.floor(8.2))`, she stopped after the inner call and wrote 8.0 instead of 2.0.
  - Wrote a "constant" as `double a = 14.22;` without `final`.
  - She tends to answer "how many times does the loop run" but skip "what is the output".
