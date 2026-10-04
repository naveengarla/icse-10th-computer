# Instructions for coding agents

This is "Java in your head", a static self-learning portal for an ICSE Class 10 student preparing for a **handwritten** Java (BlueJ) exam.

**Before doing anything, read [docs/README.md](docs/README.md) and the five docs it links.** They cover the problem, progress, teaching method, architecture and workflow.

Rules that must never be broken:

1. **Scope:**
   - The school exam portion decides *what* is taught, and the school material decide *depth and style*. The material is transcribed in [docs/school-material/](docs/school-material/README.md); the original PDFs in `Sources/` stay local.
   - Never widen scope from generic Java (no java.io, arrays and so on).
   - Ask the owner when unsure.
2. **Answers come from the engine** (`js/engine/`), never hand-typed answer keys.
3. **Static files only:** classic `<script defer>` files on `globalThis.JP`. No modules, build step or runtime dependencies. It must work from `file://` and GitHub Pages.
4. **School code style:** BlueJ `void main()`, Allman braces, `Scanner sc` with a prompt, and a `/** */` comment on every variable.
5. **After every change**, run:
   - `node tests/run.js`
   - `node tests/run.js --jdk` (if a JDK is present)
   - the headless smoke test (`tests/smoke.html` over HTTP)

   See [docs/05-workflow.md](docs/05-workflow.md).
6. **Never commit `Sources/`** (school PDFs) or personal details. The repo is public. Push only when the owner says so.
