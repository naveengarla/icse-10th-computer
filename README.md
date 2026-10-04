# Java in Your Head — Foundations

An interactive self-learning portal for ICSE Class 10 Computer Applications (Java / BlueJ). It builds a *mental Java interpreter*, so that on a handwritten exam the student can "see" a program run: boxes in memory, expressions reduced one operation at a time, paths through if/switch, and loop passes in a trace table.

Milestone 1 covers **Foundations**: 8 stages plus a checkpoint, about 5–6 hours.

| # | Stage | Exam link |
|---|---|---|
| 1 | One step at a time (print / println) | Q2 output |
| 2 | Memory boxes (variables, =, copy, swap, Scanner) | everything |
| 3 | Kinds of values (types, cast, char codes) | Q1, Q2 conversions |
| 4 | How Java calculates (precedence, int division, %, String +, Math, formulas) | Q1, Q2 expressions |
| 5 | Shortcuts (++, --, +=) | Q2 "Evaluate" |
| 6 | Choosing a path (if, else-if, dangling else, ternary, switch) | Q2 output / rewrite |
| 7 | Going round again (loops, trace tables, series, patterns, full program) | Q2, Section B |
| 8 | The digit machine (% 10, / 10, reverse, palindrome, Armstrong) | Q5 number logic |
| ✓ | Checkpoint (Section A mix + 2 notebook programs) | — |

> Developers and coding agents: start with [docs/README.md](docs/README.md).

## Open it

- **Simplest:** double-click `index.html`. It works from `file://` because the site uses no modules, no build step and no internet.
- **Or run a local server:** run `python -m http.server 8000` in this folder, then open http://localhost:8000.

Progress is saved in the browser (localStorage). Open the **Insights** tab (parent view) to see:
- time per stage
- questions that needed several tries, and what was typed
- confidence ratings from the paper tasks

You can export the data as JSON. *Reset* clears it.

Each runnable example has a **Try in real Java** button. It copies the code, converted to a full `public class Main` program, to the clipboard and opens the W3Schools online compiler. Paste the code there and run it.

## How it works

`js/engine/` is a small interpreter for the Java subset in the syllabus. It runs in stages: lexer → parser → checker (beginner-friendly compile errors) → step-recording interpreter. **Every answer the portal checks is computed by the engine from the code**, so there are no hand-typed answer keys.

```
js/core/     namespace, DOM helper, router, progress store
js/engine/   values, lexer, parser, library (Math/Scanner/String), checker, interpreter
js/ui/       code view, memory boxes, console, input tape, calculation, trace table,
             stepper, card types, paper task, digit tiles, "Try in real Java"
js/content/  one file per stage (pure data: a list of cards)
js/pages/    journey, stage player, playground, insights
tests/       engine cases + content validation
```

### Adding or editing content

A stage is `JP.content.add({ id, n, title, subtitle, minutes, recap, cards })`. The card types are listed at the top of [js/ui/cards.js](js/ui/cards.js):

- learn, watch, explore, reduce, mcq, predict, trace, bug, reorder, fill, quiz
- [paper-task.js](js/ui/paper-task.js) adds paper
- [digit-tiles.js](js/ui/digit-tiles.js) adds digits

Line numbers in `gates` and in `trace.at` count from line 1 of the card's `code`.

## Tests

```
node tests/run.js          # engine cases + every content card
node tests/run.js --jdk    # also compares every program's output with real Java (needs JDK 21+ on PATH)
```

For every card, the content check verifies that:
- its program compiles and runs, or fails to compile where that is intended;
- every prediction gate is actually reached;
- trace tables have rows;
- "output" MCQs have a matching option;
- every accepted fill-in alternative behaves like the model answer.

**Run the tests after every content edit.**

## Publish on GitHub Pages

1. Create a repository and push **everything except `Sources/`**. The school PDFs are for authoring reference only and should not be published. Add a `.gitignore` containing `Sources/`.
2. In the repository, go to **Settings → Pages → Deploy from a branch → `main` / root**.
3. The site appears at `https://<user>.github.io/<repo>/`.

## Scope rules

- The school's exam portion decides **what** is examinable.
- The school chapter PDFs and worksheets decide the **depth and style**. This includes BlueJ `void main()`, Allman braces, `Scanner sc` with a prompt, and `/** */` comments on every variable.
- Generic Java topics beyond that (java.io, arrays, wrapper details and so on) are deliberately left out.
