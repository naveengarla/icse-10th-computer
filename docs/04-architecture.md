# 4. Architecture and code guide

## Files

```
index.html              shell; loads every script with <script defer> in dependency order
css/base.css            theme variables, buttons, inputs (code ligatures are disabled on purpose)
css/components.css      stepper, memory boxes, cards, trace table, digit tiles, ...
js/core/   ns.js        JP namespace + content registry (JP.content.add/list/get/programsOf/exprsOf/fillSolution)
           dom.js       h('tag.class#id', {attrs, on:{click}, html}, ...children), JP.dom.clear
           store.js     localStorage progress + attempt log (JP.store)
           router.js    hash router: #/  #/stage/<id>/<n>  #/stage/<id>/done  #/play  #/insights
js/engine/ values.js    typed values V(t,v), Java number formatting (Double.toString rules), promotion, conversions
           lexer.js     tokens; E.CompileError
           parser.js    AST with line numbers; E.parse(src), E.parseExpression(src); detects snippet vs full class
           library.js   Math.*, String methods, Scanner (InputTape), Integer/Math constants; E.RuntimeErr
           checker.js   static checks with beginner-friendly compile errors (E.check)
           interpreter.js  step-recording runtime: E.run(src, opts), E.reduce(expr, vars)
js/ui/     answer.js    JP.ui.compareAnswer(given, expected, 'output'|'value') with friendly hints
           try-w3.js    "Try in real Java": converts to a W3Schools-ready `public class Main`, copies it, opens the compiler
           code-view.js memory-view.js console-view.js calc-view.js trace-table.js   (panels)
           stepper.js   composes the panels + controls + prediction gates
           cards.js     renderers for most card types (JP.cards.<type>)
           paper-task.js  'paper' card;  digit-tiles.js  'digits' card
js/content/ stage-1-sequence.js … stage-8-digits.js, checkpoint.js   (pure data)
js/pages/  journey.js  stage.js  play.js  insights.js
js/app.js  starts the router
tests/     run.js (node), cases.js (engine cases), smoke.html + smoke.js (headless browser test)
```

**Load order matters**, because there are no modules: core → engine → ui → content → pages → app. A new script must be added to **both** `index.html` and `tests/smoke.html`. If it is engine code, also add it to the `load()` list in `tests/run.js`.

**Pattern:** each file is an IIFE that reads `var JP = globalThis.JP` and attaches to it. Code is ES5-style (`var`, `function`), because the files are plain scripts run directly in the browser and in Node's `vm`. Match the surrounding style.

## The engine

```js
var res = JP.engine.run(src, { input: '12 30', maxSteps: 3000 });
// compile error: {ok:false, phase:'compile', error:{line, message}, steps:[], output:''}
// otherwise:     {ok, phase:'done'|'runtime', error, steps:[...], output, prog, inputLog}
//   error.kind: 'runtime' (Java exception) | 'limit' (infinite-loop guard)
```

- **Accepted programs:**
  - **Snippets** (bare statements; `prog.snippet === true`).
  - Full classes with `void main()`, `static void main()` or `public static void main(String args[])`.
  - Static helper methods (which run with their own frame and a `call` step).
- **Objects (`new X()`) are not supported yet.** This is milestone 2.
- **Semantics match Java exactly. The tests cross-check this against JDK 21.**
  - int is 32-bit and wraps.
  - int/int truncates toward zero.
  - `%` takes the sign of the dividend.
  - ArithmeticException on division by zero.
  - String `+` is evaluated left to right.
  - char is a numeric code.
  - `++` and `+=` apply an implicit cast back to the variable's type.
  - Math methods have the correct return types (`round(double)` returns long).
  - `Double.toString` formatting (`5.0`, `1.0E7`).
  - switch fall-through.
  - Short-circuit `&&` and `||`.
  - Block scope.
  - `System.exit`.

### Step records (`res.steps[i]`)

```js
{ i, kind, line, note,          // note = plain-English explanation shown under the code
  mem,                          // snapshot: {frames:[{vars:[{name,type,text,empty,...}]}], fields:[...]}
  out,                          // whole console text so far
  loops: [{line, pass}],        // active loops and their pass counters
  depth, inPos,                 // call depth, input-tape position
  calc?, cond?, skip?, ... }    // expression reduction rows, condition value, lines skipped by a branch
```

- **Kinds:** `start`, `end`, `stmt`, `declare`, `empty`, `cond`, `switch`, `fall`, `break`, `continue`, `loopCheck`, `loopPass`, `forInit`, `forUpdate`, `scopeEnd`, `back`, `call`, `return` and `error`.
- **Quiet kinds:** the stepper's `QUIET` set (`loopPass, fall, scopeEnd, back, start, end`) contains bookkeeping steps that gates never stop on.

### `JP.engine.reduce(expr, vars)`

Takes an expression and `vars` of the form `{name:{t,v}}`. A char's `v` is its char code, for example `{t:'char', v:67}`.

Returns `{ok, value, type, snaps:[{text, note}], vars}`. Each entry in `snaps` is one rewrite of the expression. This powers `reduce` cards and the calc panel.

## The stepper (`js/ui/stepper.js`)

`JP.ui.Stepper(opts)` builds the code view with execution/next-line markers, plus the memory, console, input tape (when the program uses Scanner), calc and optional trace-table panels. It also adds the controls (Start, Back, Next, Play with a speed setting, and a step counter), the gate box and the note.

- **It precomputes all steps:** `JP.engine.run` once, then `go(i)` renders snapshot `i`. Back is just `go(i-1)`.
- **Gates** use the shape `{line, n?, ask, q?}`:
  - `ask: 'var:x'`: the value of `x` after `line` runs.
  - `ask: 'output'`: what `line` prints.
  - `ask: 'cond'`: the condition on `line`, true or false.
  - `ask: 'next'`: the student clicks the line that will run next.
  - `n`: the n-th time that line runs (default 1).
  - Before advancing, `gateAt(idx)` checks whether the next step matches an unpassed gate. If so, `openGate` shows the question and disables Next until she answers and clicks "Show me ▶".
  - Every answer is logged through `JP.store.log`.
  - ⚠️ `.st-gate` is `display:none` in CSS, so show it with `style.display = 'block'`, **never `''`**. That exact mistake caused a "stuck Next button" bug.
- `opts.trace = {cols:['i','s'], at: <line> | 'loop'}` sets how rows are made. `at: <line>` adds one row each time that line runs. `at: 'loop'` adds one row per condition check, plus a true/false column.
- The keyboard ← and → keys step the most recently used stepper.

## Content format

```js
JP.content.add({
  id: 's2', n: 2, minutes: 35,            // n orders stages; checkpoint uses n:99
  title, subtitle,
  recap: ['html', ...],                   // shown on the stage "done" page
  cards: [ {type:'...', ...}, ... ]       // card ids default to '<stageId>-<index+1>'
});
```

Card fields (HTML strings are allowed in `q`, `body`, `intro`, `after`, `explain` and `key`). Line numbers always count from line 1 of the card's `code`:

| type | fields |
|---|---|
| learn | `title, body, code?, after?, key?` |
| watch | `title, intro?, code, input?, gates?, trace?, after?` |
| explore | `title, intro, code, input?, trace?, tryThis: [string, ...]` (**must be an array**) |
| reduce | `title?, expr, vars:{name:{t,v}}, q?, ask?` (`ask:false` means just show the steps)`, after?` |
| mcq | `q, code?, input?, options:[...], answer: <index> \| 'output', explain?, hint?` |
| predict | `title?, q, code, input?, ask: 'output' \| 'var:x', explain?, trace?` |
| trace | `title?, q, code, trace:{cols, at}, given?: [[cell\|null,...],...], askPasses?, askOutput?, explain?` |
| bug | `title?, q?, code, line?` (no `line` means a compile error is expected; otherwise the line to click)`, fixed?, explain, input?` |
| reorder | `title?, q, lines:[...]` (in the correct order; shuffled at runtime)`, input?, explain?` |
| fill | `title?, q, code` with `[[answer\|alt1\|alt2]]` blanks`, strict?, input?, explain?` |
| quiz | `title, items:[card, ...]` (the mastery check) |
| paper | `title, minutes, q, input?, hints:[...], structure, solution, checklist:[...], trace?` |
| digits | `title, intro?, n, mode: 'reverse'\|'sum'\|'count'\|'cube'` |

**Exception to "the engine computes everything":** the `digits` card animates with its own small JS state machine (`digit-tiles.js`) instead of the engine. Keep it simple, or move it onto the engine if you extend it.

`JP.content.programsOf(card)` lists every runnable program in a card, and the tests run all of them. If you add a card type that contains code, **extend `programsOf`** so it is tested.

## Storage (`JP.store`, localStorage key `jp-foundations-v1`)

```js
{ created, settings:{},
  stages: { s2: { pos, done:{cardId: time}, ms, firstSeen } },
  attempts: [{stage, card, item, answer, expected, ok, t}],   // capped at 3000
  paper: [{..., confidence, t}] }
```

If you change the schema, keep `load()` tolerant of old data, or bump the key and accept the loss of existing progress. **Ask the owner first**, because the student's progress lives there.

## Pages

| Page | What it does |
|---|---|
| `journey` | Stage map with progress and a "continue" button |
| `stage` | Plays one card at a time, records time spent, and shows the recap on `/done` |
| `play` | Free playground: an editable stepper |
| `insights` | The parent view |
