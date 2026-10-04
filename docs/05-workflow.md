# 5. Workflow: testing, publishing, working with the owner

## Working with the owner

- The owner is the student's parent. They give instructions in plain language, often with a **screenshot** of what the student saw (for example "Next step would not come down").
- **To reproduce a report:** find the card from the URL hash (`#/stage/s4/4` means stage `s4`, card 4, counting from 1) and the step counter shown in the screenshot.
- **Explain results in plain language:** what was wrong, what changed and how it was verified. Avoid jargon dumps.
- **Ask before:**
  - expanding scope beyond the school material (see [01-problem-statement.md](01-problem-statement.md))
  - changing the storage schema, which would wipe progress
  - pushing or publishing
  - deleting anything
- Default to the agreed design (custom engine, static files, school style). Do not re-open settled decisions (see the decision log in [02-progress.md](02-progress.md)) unless the owner asks.
- Pilot feedback outranks new milestones.

## Tests (run after every change)

```bash
node tests/run.js            # engine cases (tests/cases.js) + validation of every content card
node tests/run.js --jdk      # also compares every program with real Java (JDK 21+, `java` on PATH)
node tests/run.js --only=round  # debug aid: only engine cases whose name contains "round" (skips content validation)
```

**What the content validation checks for every card:**
- programs compile and run, or fail to compile where a `bug` card intends it
- every gate is actually reached
- `ask:'next'` targets exist
- trace tables have rows
- `mcq` cards with `answer:'output'` have a matching option
- every `fill` alternative behaves like the first one

### Headless browser smoke test

The smoke test catches UI/runtime errors that Node can't. It must be served over **HTTP**: on `file://`, errors are masked as "Script error" and the run can hang.

```bash
python -m http.server 8765 &        # from the repo root; remember the PID to stop it later
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu \
  --user-data-dir="$(mktemp -d)" --virtual-time-budget=60000 \
  --dump-dom "http://localhost:8765/tests/smoke.html" | grep -A5 'id="result"'
# optional: tests/smoke.html?only=s1,s4   (limit to some stages)
```

**What it does:**
- Visits every route (145 at handover) and clicks every button in each card for several rounds.
- Fills answer inputs.
- Presses Next on each stepper until it stops, and **fails if Next is disabled before the last step without a visible question**.

The result is `SMOKE OK (N routes)` or `SMOKE FAIL` followed by a list of problems.

`tests/smoke.html` loads the real CSS on purpose, so visibility checks match what the student sees. Keep its script list in sync with `index.html`.

**Screenshots for visual checks:** use the same Chrome command with `--screenshot=out.png --window-size=1366,1000 --hide-scrollbars "http://localhost:8765/index.html#/stage/s4/4"`.

When done, stop the server **by its PID**. Don't kill all `python.exe` processes, because the owner may have other Python programs running.

### When you find a bug
1. Reproduce it, ideally by making the smoke test or `run.js` fail.
2. Fix it.
3. Confirm the test now passes, and that it would fail without the fix.
4. Add a line to the change history in [02-progress.md](02-progress.md).

## Adding content: checklist

1. Edit or add `js/content/stage-*.js`. A new stage file goes into `index.html` **and** `tests/smoke.html`.
2. Use school code style (see [03-method.md](03-method.md)) and only in-scope constructs. Model the questions on [school-material/](school-material/README.md).
3. Never type an answer key by hand:
   - use `answer:'output'`, `ask`, `trace` or `gates`
   - let the engine compute the answer
4. If the engine lacks a construct the school material uses, extend the engine. Then:
   - add cases to `tests/cases.js` that cover it, including the tricky exam variants
   - run `--jdk` so the case is checked against real Java
5. Run all three test commands.
6. Check visually in a browser for anything layout-related.

## Publishing (GitHub Pages)

- **Repo:** `https://github.com/naveengarla/icse-10th-computer`, branch `main`. Pages is served from `main` at the root (a `.nojekyll` file is present).
- **Live site:** https://naveengarla.github.io/icse-10th-computer/. It rebuilds automatically about 1 minute after a push.
- **Before pushing:**
  1. Check that tests pass.
  2. Check that `git status` shows nothing from `Sources/` (it is git-ignored and must stay unpublished).
  3. Push only with the owner's go-ahead.
- **The repo is public:**
  - Don't put personal details (the student's name, school, the owner's emails) into files or commits.
  - The repo-local git identity is already configured with a GitHub no-reply email. Keep it.
- **Commit message attribution:** end each message with your own co-author line, if your tooling uses one.
- **After a push:** run the smoke test against the live URL (`https://naveengarla.github.io/icse-10th-computer/tests/smoke.html`).

### Environment notes (owner's Windows machine)

- The shell is Git Bash. Chrome is at `/c/Program Files/Google/Chrome/Application/chrome.exe`. Python and Node are on PATH, and JDK 21 is used for `--jdk`.
- The `gh` CLI's `GITHUB_TOKEN` was invalid at handover. Plain `git push` works through Git Credential Manager. For GitHub API calls, the token from `printf "protocol=https\nhost=github.com\n\n" | git credential fill` worked.

## Known gotchas

| Gotcha | What to do |
|---|---|
| `display = ''` doesn't show an element hidden by a stylesheet | Use `'block'` (or toggle a class) |
| ES modules and `fetch` of local files break `file://` | Keep classic scripts and inline data |
| Code font ligatures turn `<=` into `≤` | They are disabled in `base.css`. Keep it that way: she must write two characters on paper |
| `explore.tryThis` must be an array | A string crashes the card |
| Renderers that append optional nodes | Make helpers return a node, not `null` (see `explainBox`) |
| Gate and trace line numbers | They are relative to the card's `code`, not to any wrapper |
| The snippet wrapper in "Try in real Java" | `JP.ui.toW3` wraps snippets in `public class Main`. Full classes get a small `Main` launcher appended |
