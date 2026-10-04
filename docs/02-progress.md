# 2. Progress, roadmap and decisions

_Last updated: 2026-10-04._

## Status at a glance

| Milestone | State |
|---|---|
| **M1 Foundations** (8 stages + checkpoint) | ✅ Built, tested and published |
| Pilot of Stages 1–3 with the student | ⏳ **Next.** The owner runs it and then reports what to change |
| M2 Objects, methods, constructors | ⬜ Not started |
| M3 Number-logic program bank | ⬜ Not started |
| M4 Strings + library classes | ⬜ Not started |
| M5 Exam simulator | ⬜ Not started |

## M1 Foundations: what exists

| id | n | Stage | min | cards | Card mix |
|---|---|---|---|---|---|
| s1 | 1 | One step at a time (sequence, print vs println) | 25 | 13 | learn 3, watch 3, predict, mcq 2, reorder, bug, quiz, paper |
| s2 | 2 | Memory boxes (variables, =, copy, swap, Scanner) | 35 | 16 | learn 4, watch 5, predict, explore, reorder, mcq, bug, quiz, paper |
| s3 | 3 | Kinds of values (types, cast, char codes) | 30 | 11 | learn 3, watch 2, bug, predict, mcq 2, quiz, paper |
| s4 | 4 | How Java calculates (precedence, int division, %, String +, Math, formulas) | 45 | 21 | learn 6, reduce 3, watch 3, mcq 4, predict 2, fill, quiz, paper |
| s5 | 5 | Shortcuts that change boxes (++, --, +=) | 35 | 14 | learn 3, watch 2, reduce 5, mcq, predict, quiz, paper |
| s6 | 6 | Choosing a path (if, else-if, dangling else, ternary, switch) | 45 | 18 | learn 5, reduce, watch 4, mcq, predict 2, fill, bug 2, quiz, paper |
| s7 | 7 | Going round again (loops, trace tables, series, patterns) | 55 | 20 | learn 5, watch 6, trace, predict 3, mcq, bug, fill, quiz, paper |
| s8 | 8 | The digit machine (%10, /10, reverse, palindrome, Armstrong) | 35 | 13 | learn 2, digits 3, watch 2, trace, predict, fill, bug, quiz, paper |
| ck | 99 | Foundations checkpoint | 30 | 5 | learn, quiz 2, paper 2 |

### Pages
- Journey map (`#/`)
- stage player (`#/stage/<id>/<cardNo>`, plus `/done`)
- Playground (`#/play`)
- "For parents" Insights (`#/insights`): time per stage, wrong attempts and what she typed, paper confidence ratings, JSON export and reset

### Tests at the time of handover
- `node tests/run.js`: **237 passed**
- `node tests/run.js --jdk`: **398 checks** passed against real Java
- headless smoke test: **145 routes OK** (both locally and against the live site)

## Pending and next tasks (in priority order)

Detailed specs for each future milestone are in [06-roadmap.md](06-roadmap.md). This list is the summary.

1. **Pilot feedback.** The owner will run Stages 1–3 with the student, look at Insights, and report problems or changes. Treat those reports as top priority.
2. **M2: Objects and methods.** These cover exam Q3, Q4, Q7 and Q8 and most marks.
   - The engine already runs static helper methods with frames and a call step that says values are COPIED. `new` / objects are **not supported**: the engine raises "Creating objects is covered in the next part of the course."
   - Planned content:
     - call/return with frames
     - actual vs formal parameters
     - return types
     - class = blueprint, object = bundle of boxes (two objects with independent state; default values)
     - the input → calculate → display class-spec skeleton used in the school solutions
     - constructors running on `new`
     - overloading: choosing a version by its parameter list
   - Use the school PDFs (Ch 2, 3, 4 and their practical solutions) for depth and style.
3. **M3: Number-logic bank.** Paper-mode programs such as Pronic, Armstrong, palindrome/EvenPal, Fibonacci, series, and others found in the iterations practical. Covers Q5.
4. **M4: Strings and library classes.** char vs String, indexing, traversal, Character and String methods, wrapper conversions as far as Ch 5 and 8 go. Covers Q6 and parts of Section A.
   - The engine already has a few String methods (`length`, `charAt`, `indexOf`, …) and Scanner (`nextInt`, `nextDouble`, `next`, `nextLine`, `next().charAt(0)`).
5. **M5: Exam simulator.** Timed Section A and a Section B paper with self-marking rubrics.

Whatever comes next, the scope rules in [01-problem-statement.md](01-problem-statement.md) still apply.

## Decision log (why things are the way they are)

| Decision | Reason |
|---|---|
| **Custom Java-subset engine** instead of an external parser (for example the `java-parser` npm package) or only linking out to online compilers | The owner asked about both alternatives. A parser alone gives no step-by-step execution, memory snapshots or expression reduction, which are the core of the method. Online compilers only show final output. Agreed: custom engine **plus** a "Try in real Java" button that copies a W3Schools-ready program and opens their compiler. |
| Classic `<script defer>` + `globalThis.JP` namespace, no modules | Chrome blocks ES modules on `file://`, and double-click opening must work. |
| Answers computed by the engine, never typed by hand | A single source of truth, so answer keys cannot be wrong. Real-Java cross-checking in tests. |
| School code style everywhere (BlueJ `void main()`, Allman braces, `Scanner sc` with a prompt, `/** */` variable comments) | It must match what she writes in the exam and what the teacher expects. |
| `Sources/` git-ignored | School PDFs must not be published. |
| Progress stored in `localStorage` (key `jp-foundations-v1`) | No backend. Progress is per browser, so the student should always use the same laptop and browser. |
| Owner identity is not stored in the repo docs | The repo is public. |

## Change history (notable)

- **2026-10-04: initial build** of M1 and publication to GitHub Pages.
- **2026-10-04: bug fix, "Next step stays disabled with nothing to answer".**
  - **Cause:** `.st-gate` is `display:none` in CSS, and `openGate` set `style.display = ''`, which falls back to the CSS rule. The prediction question was invisible while Next was disabled.
  - **Fix:** set `'block'`, move the gate under the controls and scroll it into view.
  - **Test gap closed:** the smoke page now loads the real CSS, and a new check presses Next until it stops and fails if Next is disabled before the end with no visible question.
- Earlier fixes in the same session:
  - `explainBox` always returns a node (crash in quizzes).
  - `explore.tryThis` must be an array.
  - Code font ligatures disabled (so `<=` doesn't render as `≤`).
  - Digit-machine code keeps its indentation (`white-space: pre`).
