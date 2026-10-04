# 2. Progress, roadmap and decisions

_Last updated: 2026-10-04._

## Status at a glance

| Milestone | State |
|---|---|
| **M1 Foundations** (8 stages + checkpoint) | ✅ Built, tested and published |
| Pilot of Stages 1–3 with the student | ⏳ **Next.** The owner runs it and then reports what to change |
| M2 Objects, methods, constructors | 🟡 Engine support, Stage 11 pilot and Stage 9 built; remaining stages pending |
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

**Coverage tracking:** every examinable item is listed in the "Scope → milestone map" at the end of [00-exam-scope.md](00-exam-scope.md). Tick items there as milestones are completed.

1. **Pilot feedback.** The owner will run Stages 1–3 with the student, look at Insights, and report problems or changes. Treat those reports as top priority.
2. **M2: Objects and methods.** These cover exam Q3, Q4, Q7 and Q8 and most marks.
   - The engine now creates independent objects, runs field initializers and constructors, and invokes instance methods on the correct receiver. Method/constructor overload selection uses the most-specific signature and rejects ambiguous calls. Stage 11 is a 14-card, 35-minute pilot. Stage 9 is now built. Stage 10, stages 12–13 and the M2 checkpoint are pending.
   - Planned content:
     - call/return with frames
     - actual vs formal parameters
     - return types
     - class = blueprint, object = bundle of boxes (two objects with independent state; default values)
     - the input → calculate → display class-spec skeleton used in the school solutions
     - constructors running on `new`
     - overloading: choosing a version by its parameter list
   - Use the school PDFs (Ch 2, 3, 4 and their practical solutions) for depth and style.
3. **M3: Number-logic bank.** Paper-mode programs for exactly the scope list:
   - number series and the Fibonacci series
   - Pronic
   - palindrome/reversal and EvenPal
   - Armstrong
   - min/max digit
   - digit extraction
   - sums, products and counts of selected digits
   - other iteration logic from the practicals

   Covers Q5.
4. **M4: Strings and library classes.**
   - char vs String, indexing and traversal
   - the String methods prescribed in the ch08 notes
   - String from a literal vs `new`
   - all 8 wrapper classes (the engine still lacks Byte, Short and Boolean)
   - `parseX`, `valueOf` and `toString`
   - Character methods
   - static vs non-static library methods
   - System, `java.lang` and `java.util`

   Covers Q6 and parts of Section A.
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

## M2 pilot handover (2026-10-04)

The owner approved the recommended 88-card / 260-minute plan. Build engine support and Stage 11 first, show the pilot, then continue the remaining stages after review. The owner authorized committing and pushing the pilot to main on 2026-10-04.

| Stage | Cards | Minutes | Exam | Status |
|---|---:|---:|---|---|
| 9 Methods | 16 | 40 | Q1/Q2; Q3/Q4/Q7 foundation | built, publication pending |
| 10 Method overloading | 14 | 35 | Q4; Q1/Q2 | pending |
| 11 Classes and objects | 14 | 35 | Q3/Q7; Q1/Q2 | pilot built |
| 12 Class-specification answers | 18 | 55 | Q3/Q7 | pending |
| 13 Constructors | 18 | 45 | Q8; Q1/Q2 | pending |
| M2 checkpoint | 8 | 50 | Q1/Q2/Q3/Q4/Q7/Q8 | pending |

- Pilot route: `#/stage/s11/1`. The journey groups M1 and M2 and keeps the Foundations checkpoint before M2. Existing browser progress and storage key remain compatible.
- Each object's fields are shown in a separate labelled bundle. Reference boxes point to an object number; method frames name their receiver. Snapshots preserve past object values for Back. Qualified prediction/trace names such as `a.amt` are supported.
- Regression fixtures cover all 11 M2 practical solutions, plus independence, parameter copies, initialization order, constructor selection, method selection, ambiguous calls, static-context rejection, and snapshot history.
- School corrections in runnable fixtures: sales computes `net`; Bank checks the balance after withdrawal; digit roots are labelled; pattern output includes spaces. Original transcriptions are unchanged.
- Scope decisions: 00-exam-scope wins over the outdated exclusions in 01. No dedicated pure/impure, reference-passing or shared-static-field lesson is included in the pilot. Static-field runtime support exists to verify the school's static_demo, without adding syllabus content.
- Checkpoint recommendation: untimed, with suggested minutes.

Change history: object runtime, Java-correct overload resolution, object memory view, qualified trace values, Stage 11 pilot, milestone journey grouping, and gate validation that detects references queried before assignment.

### Pilot verification

- Node: 289 passed, 0 failed.
- Java 21: 499 passed, 0 failed (full suite, including school fixtures).
- Browser: SMOKE OK, 160 routes. Pilot opens over HTTP and file:// without page errors.
- Visual review: separate object bundles, references and receiver frames, prediction gate before output, and notebook task.
- W3Schools launcher: three constructor/static/non-static scenarios compiled and agreed with Java 21.
- Stage completion keeps Stage 8 → Foundations checkpoint → Stage 11, using milestone order in the content registry.
- Full M2 coverage remains incomplete; chapter-note and worksheet regression coverage and the remaining stages are still pending.

## Stage 9: exam-focused methods (2026-10-04)

The owner approved continuing with Stage 9 and emphasized quick concept learning with enough understanding to answer handwritten exam questions. The stage uses 16 cards / 40 suggested minutes, including an 8-minute notebook task. It covers method purpose, header/prototype/signature/body, actual/formal parameters, call/return frames, printing versus returning, all four method kinds, primitive parameter copies, access specifiers, and static versus instance calls. Program answers remain engine-computed. No engine or storage changes were needed.

School-source corrections in explanations: protected access is described correctly despite the notes' public/protected typo; return ends a call and need not be the final textual statement of every method; signature excludes return type and parameter names. No inheritance program, reference-passing lesson, or pure/impure lesson was added. Those broader scope decisions remain pending.

Stage 9 is registered in both entry points. The journey now describes the two available M2 stages. Commit and push still require owner instruction.

### Separate reading guide (owner-directed addition)

The owner requested keeping the existing work and adding a large, scrollable HTML learning path. `guides/methods.html` is a separate Chapter 3 guide, reached through the new Read & practise navigation link. It covers the examinable methods topics in 18 sections, with nine complete runnable examples, computed output reveals, experiment prompts, school/BlueJ versions, short recall answers, a complete school-style compute overloading program, notebook practice and quick revision. The W3Schools launcher is clearly separated from exam code. It does not use or change localStorage progress.

The existing stages and engine remain intact. No dedicated pure/impure or shared-static-field lesson or reference-passing program has been added; scope remains governed by 00-exam-scope. The new guide examples are included in tests/run.js and its Java comparison. Publication still awaits owner instruction.

Stage 9 verification: Node 300/300, Java 21 520/520, browser 177 routes, file opening and visual review passed.

Reading-guide verification: Node 309 passed; full Java 21 suite 538 passed; existing browser smoke 177 routes. All nine copied W3Schools launchers compiled and ran with identical output. Clipboard contents, output reveal, navigation, file:// opening, desktop and 390px layout passed with no page errors or mobile horizontal overflow.
