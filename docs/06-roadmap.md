# 6. Roadmap: future milestones (detailed handover specs)

This is the build plan for milestones M2–M5. Each milestone is meant to be picked up by a coding agent on its own.

**The authoritative list of what is examinable is [00-exam-scope.md](00-exam-scope.md).** Every item in its "Scope → milestone map" must be covered by the milestone it is assigned to. Tick it there when that is done.

Read [00](00-exam-scope.md)–[05](05-workflow.md) first, because **all their rules apply**:
- scope
- engine-computed answers
- static files
- school code style
- tests

## How to run a milestone (protocol for every agent)

1. **Read the school material listed for the milestone** in [school-material/](school-material/README.md). It is the authority for *what* to include and *how deep* to go.

   Do not add topics that are not there. If something is borderline, list it and ask the owner.
2. **Write a short stage plan and show it to the owner before building.** It should cover:
   - the stages
   - about 8–20 cards each
   - minutes per stage
   - the exam question each stage feeds

   The owner prefers a clear recommendation over a menu of options.
3. **Engine first, then content.** For each new engine feature:
   - add cases to `tests/cases.js`, including the tricky exam variants
   - run `--jdk` so the engine is checked against real Java
4. **Build the content** as new stage files (`js/content/stage-<n>-<slug>.js`). Register them in `index.html` **and** `tests/smoke.html`.
5. **Run all three test suites** (see [05-workflow.md](05-workflow.md)), check the result visually in a browser, then:
   - update [02-progress.md](02-progress.md)
   - update this file: tick items and record any decisions
6. **Ask the owner, then push.** Run the smoke test against the live site after the push.

**Numbering and journey layout:**
- Stage `n` values continue from 9 upward. The Foundations checkpoint is `n:99`, so milestone checkpoints use `n:199`, `n:299`, and so on. Do not reuse ids.
- The journey page currently lists every stage in one path. When M2 lands, group stages by milestone in `js/pages/journey.js`, using a `milestone` field on the stage.
- Keep `localStorage` progress compatible: keep the key and only add fields.

**Exam-time priority:** if time is short, build M2 first, then M3. They unlock 4 of the 6 Section-B questions.

**Design requirement for every milestone (from the "Exam-preparation implication" in [00-exam-scope.md](00-exam-scope.md)).** Each milestone must train both of these:
- **A. Concept and trace knowledge (Section A).** Cover terminology, expressions, statements, conversions, method and library behaviour, and output tracing, all reasoned *without running the code*. Build this with MCQ, predict, reduce, trace and quiz cards in the Q1/Q2 style.
- **B. Handwritten programs (Section B).** Every Section-B type the milestone feeds needs:
  - `paper` cards she writes in her notebook
  - reorder, fill and bug cards on the full program skeleton
  - a self-check list that includes the `/** */` variable comments

  There is no IDE, compiler or autocomplete in the exam, so the paper cards are the real test.

A milestone that only teaches concepts, or only shows programs, is not done.

---

## M2: Objects, methods and constructors (highest value)

**Exam:**
- Section B **Q3 and Q7** (data members + member methods)
- **Q4** (method overloading)
- **Q8** (constructor overloading)
- the matching Section-A theory and output questions

**School material:**
- `ch02-class-basis-of-computation.md`
- `ch03-user-defined-methods.md`
- `ch03-practical-method-overloading-solutions.md`
- `ch04-constructors.md`
- `ch04-practical-constructors-solutions.md`
- `practical-2-data-members-methods.md`
- `worksheets.md` sections 1, 2, 4, 6 and 7

### Current engine status (M2 pilot)
- **Parser:** full classes with fields, methods (static and non-static), constructors (`prog.ctors`) and `new` expressions.
- **Checker:**
  - fields are declared
  - methods and constructors are checked
  - `checkUserCall` filters by parameter count and invocation conversions, then selects a signature more specific than every other applicable signature; ambiguous calls are rejected.
- **Runtime:**
  - static helper methods with frames
  - the `call` step note ("values are COPIED into its own boxes")
  - `return`
- **Library:** `new Scanner(System.in)` and `new String(...)` work.
- **Not yet:** creating objects of the program's own class. `R.eval` case `'New'` in `js/engine/interpreter.js` throws "Creating objects is covered in the next part of the course."

### Engine work
1. **Objects at runtime:**
   - `new C(args)` creates an instance whose fields start at their default values (`0`, `0.0`, `'\u0000'`, `false`, `null`).
   - Field initialisers run next, then the constructor chosen by the checker (`e.target`).
   - A variable of class type holds a **reference**.
   - Record steps for:
     - "object created"
     - "constructor runs automatically"
     - "fields set"
2. **Instance calls:**
   - `ob.method(args)` runs with that object's fields visible.
   - Inside instance methods, a bare field name refers to the current object's field.
   - Static methods cannot use instance fields. The checker should already reject this; add tests.
3. **BlueJ `void main()` inside the class:** school solutions put `void main()` (non-static) or `static void main()` in the same class, then do `C ob = new C(); ob.accept(); ob.calculate(); ob.display();`. Both forms must run.

   Implemented: `mem.fields` contains static/class fields; `mem.objects` contains independent field bundles. Non-static `main` runs on an implicit object initialized by its no-argument constructor, the way BlueJ does.
4. **Memory view:**
   - Show each object as a labelled bundle of field boxes, e.g. "object of Employee", with the reference variable pointing to it or labelled with it.
   - **Two objects must visibly have separate fields.** This is the key misconception to break.
   - Keep method frames visually separate from objects.
5. **Overload resolution must match Java:**
   - Java's rules: exact match, then widening, then the most specific version. If no single version is most specific, it's an "ambiguous" compile error.
   - Implemented and tested with `int`/`double`/`char`/`long` mixes and ambiguous calls. The old "fewest widenings" heuristic has been replaced.
   - Friendly errors: "No version of area takes (double, int)". Also: "Two methods differ only in return type". That second one is a compile error in Java and a classic theory question.
6. **"Try in real Java":** `JP.ui.toW3` already adds a `Main` launcher for full classes. Check that it works for classes with constructors and non-static `main`.

### Content (proposed stages, to be confirmed with the owner)

| n | Stage | Mental model | School source |
|---|---|---|---|
| 9 | **Methods: machines you write** | purpose of methods; call → jump → parameters are *copies* → run → `return` value comes back → continue; **header / prototype / signature / body** (label each part on real code); access specifiers and **static vs non-static** as far as ch03 goes; return type and `void`; **formal vs actual parameters**; the **4 kinds** (no return + no params, no return + params, return + params, return + no params); local boxes vanish at return | ch03 notes |
| 10 | **Same name, different inputs (overloading)** | Java picks the version by the *parameter list* (count, types, order); return type alone is not enough; selecting/invoking the right version | ch03 practical, worksheets §4 |
| 11 | **Class and object** | **primitive vs reference (non-primitive/composite/user-defined) data types**; intro to OOP concepts; class = blueprint/prototype, object = instance; **state** (data members / instance variables) and **behaviour** (member methods); `new`; the dot operator; multiple objects with **independent state**; default values | ch02 notes |
| 12 | **The class-specification answer** | spec → data members with `/** */` → `input()/accept()` (Scanner) → `calculate()/compute()` → `display()/print()` → `main` creates the object and calls the methods in order | practical-2, worksheets §1/§7 |
| 13 | **Constructors** | purpose (initialise data members); same name as the class; no return type; invoked automatically on object creation; default / no-argument vs parameterised; **constructor overloading**, i.e. different objects calling different constructors; constructor vs ordinary method | ch04 notes + practical |
| 199 | **M2 checkpoint** | Section-B style: one Q3/Q7 class spec, one Q4 overloading and one Q8 constructor question on paper, plus Section-A theory and output MCQs | all of the above |

**Card ideas:**
- **`watch`:** watch a call jump into a method and come back.
- **Gates:**
  - `ask:'next'`: which line runs after `return`?
  - `ask:'var:x'`: the value inside the method's frame.
- **`mcq`:** "which version runs?" for overload calls, with the answer computed by the engine. Consider a new card type `overload` that highlights the chosen method.
- **`bug`:**
  - a constructor with `void`
  - overloads that differ only in return type
  - calling an instance method from a static context
- **`paper`:** the school's practical questions, rewritten in fresh words so she doesn't just memorise the solutions, with checklist items:
  - data members are declared with `/** */` comments
  - each method has the right return type
  - `main` creates an object and calls the methods in order
  - the output is labelled

**Theory points** are for Section A: MCQs and Q2 one-liners, not long essays. Take them from the Ch 2/3/4 lists in [00-exam-scope.md](00-exam-scope.md), worded the way the chapter notes word them. Examples:
- class vs object; state vs behaviour
- primitive vs reference data types
- header / prototype / signature
- formal vs actual parameters
- the access specifiers only as far as ch03 covers them
- static vs non-static (ch03 has a `static_demo` example)
- constructor vs method
- default vs parameterised constructor

Pure vs impure methods and call by value or reference are **not** in the scope list. Include them only if the ch03 notes explicitly cover them; check first.

### Done when
- Every program in the six M2 school-material files runs in the engine with output identical to `--jdk`, except where the school's code has a bug. Note any such bugs, but don't copy them into content.
- Stages 9–13 and the checkpoint pass all three test suites.
- The owner has seen the stage plan and a pilot of stage 11 or 12.

---

## M3: Number-logic program bank

**Exam:** Section B **Q5**, which builds directly on Foundations Stages 7–8.

**School material:**
- `practical-1-iterations-solutions.md` (10 programs, including the school's own "Clarit number")
- `worksheets.md` §2 (revision worksheet), §3 (iterations) and §6 (assignment)

### Engine work
Probably none. Foundations already covers loops, `%`/`/`, flags and `break`. If the programs are written as class + method (an exam-style answer), that needs M2 objects. Otherwise use static methods or snippets, and decide this with the owner.

### Content
- **One "family" stage per pattern.** The list comes from the "Number-based programming" section of [00-exam-scope.md](00-exam-scope.md):
  - **digit extraction and processing:** sum, product and count of digits; sums, products and counts of *selected* digits (for example even or odd digits); **minimum and maximum digit**
  - **palindrome and reversal** based logic, and **EvenPal**
  - **Armstrong number**
  - **Pronic number**
  - **number series and the Fibonacci series**
  - other iteration-based number logic that appears in `practical-1` and the worksheets, such as the school's "Clarit number"
- **Do not add special numbers** (Niven, Spy, Neon, Automorphic, Duck, perfect/prime, …) unless they appear in the school material or the owner confirms they are taught.
- **Each program follows the arc:** definition with a worked example → `digits`/`trace` card on that number → `fill` the key lines → `paper` (full program from the spec) → checklist.
- Add a **"definition first" pattern card**. She must turn an English definition into a loop.
- A **mixed timed bank** at the end: pick a random spec, write it on paper, then reveal the solution and run it with her own inputs.

### Done when
- Every program in `practical-1` and the matching worksheet questions has a paper card whose solution matches `--jdk`.
- The family stages pass the tests.

---

## M4: Strings and library classes

**Exam:**
- Section B **Q6** (String programs)
- Section A: the output of String, Character and wrapper methods; conversions

**School material:**
- `ch08-string-handling.md`
- `ch08-practical-string-handling-solutions.md` (12 programs)
- `ch05-library-classes.md` (wrappers, autoboxing, `parseX`/`valueOf`/`toString`, Character methods)
- The Ch 5 and Ch 8 lists in [00-exam-scope.md](00-exam-scope.md)

### What already exists in the engine
- **String methods:** `length`, `charAt`, `indexOf`, `lastIndexOf`, `substring`, `equals`, `equalsIgnoreCase`, `compareTo`, `compareToIgnoreCase`, `toUpperCase`, `toLowerCase`, `trim`, `startsWith`, `endsWith`, `concat`, `replace`, and `String.valueOf`.
- **Character:** `isLetter`, `isDigit`, `isLetterOrDigit`, `isWhitespace`, `isUpperCase`, `isLowerCase`, `toUpperCase`, `toLowerCase`, `toString`.
- **Wrappers:** `Integer`, `Long`, `Double` and `Float` `parseX`, `valueOf`, `toString`.
- **Scanner:** `next`, `nextLine`, `next().charAt(0)`.

### Engine work
- **Check every method example in ch05 and ch08** against `--jdk`. Pay special attention to:
  - `compareTo` (it returns the difference of the char codes, or the difference in length)
  - both forms of `replace` (char and String)
  - `indexOf(ch, from)`
  - out-of-range `charAt` and `substring`, which throw `StringIndexOutOfBoundsException`
- Add only methods that the notes list. Nothing from generic Java.
- **Wrapper classes: all eight are in scope:** Byte, Short, Integer, Long, Float, Double, Boolean, Character.
  - The engine currently has `Integer`, `Long`, `Double`, `Float` and `Character`.
  - Add `Byte`, `Short` and `Boolean` (`parseByte`, `parseShort`, `parseBoolean`, `valueOf`, `toString`) **only for the methods that ch05 shows**.
  - Keep `parseX` vs `valueOf` vs `toString` exactly as the notes describe them.
- **Autoboxing and unboxing:** support it only as far as ch05 shows, as assignment between a primitive and its wrapper. A wrapper value can be displayed as a plain value with an "(Integer object)" label.
- **Static vs non-static library methods** is an explicit scope item. Show which calls go through the class name (`Math.sqrt`, `Character.isDigit`, `Integer.parseInt`) and which go through an object (`s.length()`, `sc.nextInt()`). One sorting or classification card is enough.
- **Strings from a literal vs `new String(...)`** is in scope. The engine already supports both. Teach `==` vs `equals` only if the ch08 notes mention it.
- **A string-index visual:** a new UI piece that shows a String as indexed tiles (0…length−1). `charAt` and `substring` highlight the chosen tiles. This is the string version of the digit tiles.
- **Immutability:** `s.toUpperCase()` without assigning the result leaves `s` unchanged. This is a must-have predict gate.

### Content
- **Stage: String as indexed tiles.** A String is a sequence of characters and an object of class String, created from a literal or with `new`. Cover `length`, `charAt`, and traversal with `for (i = 0; i < s.length(); i++)`.
- **Stage: method machine room.** Each method's syntax, return type and an example, with predict cards. Section A asks for many outputs.
  - **Which String methods:** exactly the prescribed list in `ch08-string-handling.md`. The scope document names `length`, `charAt`, `indexOf`, `lastIndexOf`, `startsWith`, `endsWith` and `equals`, then defers to the ch08 notes for the rest.
  - Do not add String APIs that the notes don't list.
- **Stage: building strings.** Accumulate with `+=`, reverse, count vowels/words, change case, replace.
- **Stage: library classes (ch05).** Cover:
  - what a library class and a package are (`java.lang` and `java.util` only)
  - the System, Math, String, Scanner and wrapper classes
  - the Character methods (classify characters, char ↔ code)
  - `parseX`, `valueOf` and `toString` conversions
  - static vs non-static library methods

  Math was taught in M1 stage 4, so here just recap it in the library-class framing.
- **Programs:** the 12 ch08 practical programs as paper cards, each with a trace.
- **Checkpoint:** a Q6-style paper question plus a Section-A method-output quiz.

---

## M5: Exam simulator

**Purpose:** practise the real first-term paper format under time pressure.

- **Section A, 40 marks:**
  - 20 MCQs
  - 20 marks of Q2 short items: write expressions, evaluate, predict output, loop count, rewrite as directed, method outputs, theory one-liners
  - generated from the content banks (cards tagged with `exam: 'Q1'|'Q2'`), timed
- **Section B, 60 marks:** pick 4 of 6 questions, one per type (Q3–Q8), taken from the paper banks.
  - She writes on paper.
  - She marks her own work against a **rubric checklist** of about 15 marks per question: variable descriptions, class and method headers, logic, output format, comments.
  - Her self-marks are recorded.
- **Insights:** marks by question type over time, and the topics where she loses most marks.
- **Technical:**
  - Add an optional `exam` tag to cards. This is a non-breaking content field.
  - Add a new page `js/pages/exam.js` and route `#/exam`.
  - The timer is a plain clock; no backend is needed.

---

## Open questions to ask the owner (when relevant)

1. Exam date and hours available. This decides whether M3 or M4 comes first after M2.
2. In M3, should number programs be written as a class with methods (exam style, needs M2) or as `main`-only?
3. Are special numbers taught that are not in the transcribed material?
4. Should the M2 checkpoint include a timed element?
5. Pilot findings from Stages 1–3. These may change how fast new stages should go.

## M2 pilot status (2026-10-04)

The owner approved the stage plan recorded in 02-progress. Stage 11 is built as the agreed pilot. The owner subsequently approved Stage 9; its 16-card / 40-minute methods lesson is built. Stages 10, 12–13 and the checkpoint remain pending. Engine items 1–5 are implemented and covered by regression cases. All 11 school practical programs have runnable fixtures; chapter-note and worksheet coverage still needs completion before M2 can be declared done. The journey is grouped by milestone and storage remains compatible.

The six-file completion criterion also requires the listed worksheet sections. No scope-map item is marked complete at this pilot boundary.

Stage 9 follows the owner's exam-time priority: concise concept explanations, prediction and repair practice, then a handwritten method-and-call task. It is locally built; publication awaits instruction.
