# Handover docs: start here

These docs are for a **coding agent (or developer) taking over this project**. Read them in order before changing anything.

| File | Read it for |
|---|---|
| [01-problem-statement.md](01-problem-statement.md) | Who this is for, the exam, the hard constraints and the **scope rules** (non-negotiable) |
| [02-progress.md](02-progress.md) | What is built, what is pending, the roadmap and the decision log |
| [03-method.md](03-method.md) | Teaching method: the misconceptions targeted, the stage arc, card types and exam code style |
| [04-architecture.md](04-architecture.md) | How the code works: engine, step records, stepper, cards, content format, storage and routes |
| [05-workflow.md](05-workflow.md) | How to test, verify, publish and take instructions from the owner, plus known gotchas |

## The 60-second version

- **What:** "Java in your head", a static web portal that teaches an ICSE Class 10 student to *run Java programs in her head*. This prepares her for a **handwritten** Computer Applications exam.
- **How:**
  - A small Java-subset interpreter written in JavaScript (`js/engine/`) runs every example step by step.
  - The UI shows memory boxes, output, expression reduction and trace tables.
  - It pauses to make the student *predict* before revealing.
  - **Every answer key is computed by the engine**, never typed by hand.
- **Stack:**
  - Plain HTML/CSS/JS with `<script defer>` files sharing the `globalThis.JP` namespace.
  - No build step, no modules, no dependencies.
  - Must keep working when `index.html` is opened from `file://`, and on GitHub Pages.
- **Live:** https://naveengarla.github.io/icse-10th-computer/ (repo `naveengarla/icse-10th-computer`, branch `main`, Pages served from the root).
- **Status:** milestone 1 (Foundations: 8 stages plus a checkpoint) is complete and published. The next step is a pilot with the student, followed by milestone 2 (objects, methods and constructors).
- **Before finishing any change:**
  1. `node tests/run.js`
  2. `node tests/run.js --jdk` (if a JDK is available)
  3. the headless browser smoke test

  See [05-workflow.md](05-workflow.md).
