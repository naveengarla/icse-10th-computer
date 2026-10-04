# 3. Teaching method

## Principle

Build a **mental model of execution**, then **name** it, then attach **syntax**, then move it to **paper**. Each stage reuses the visuals of earlier stages, so understanding compounds.

## Misconceptions the journey must break (in priority order)

1. **"A program is a document."** It is a sequence of instructions run **one at a time, top to bottom**. *Visual:* the execution pointer.
2. **`=` means "equals".** It means: evaluate the right side first, then **store** the result in the box on the left. So `x = x + 1` makes sense.
3. **"A variable remembers its history or is linked to another variable."** A box holds **one** value. `b = a` copies it, and overwriting loses the old value. This is why number programs keep a copy of `n`.
4. **"Maths rules apply."**
   - int/int truncates, and `%` is the remainder.
   - `"Sum="+a+b` is text concatenation.
   - `'2'+'d'` is 150.
   - Math methods have return types: `Math.round` returns an integer type and `Math.sqrt` returns a double.
5. **"`++` and `+=` are just +1."** Pre and post forms differ in *when* the box changes. Compound assignment **saves the left value first**: `a op= b` means `a = (type of a)(a op b)` with `a` read before `b` is evaluated.
6. **"A condition is about the wording."** A condition is a **true/false value computed now**. Further facts:
   - Only one branch runs.
   - An else-if ladder stops at the first true condition.
   - switch falls through without `break`.
   - `else` pairs with the nearest `if`.
7. **"A loop is a vague repeat."**
   - The condition is checked **before each pass**.
   - The variable still has a value after the loop.
   - `<` vs `<=` causes off-by-one errors.
   - An empty body `;` is a real loop.
8. **"Output appears all at once."** `print` vs `println` moves a cursor, and that is how patterns work.

## The arc inside each stage (scaffolding fades)

1. **Explore:** a playground, no jargon.
2. **Name it:** a learn card attaches the term and syntax to what she just saw.
3. **Watch & Predict:** a stepper with *gates* that stop and ask "what will `x` hold?", "what prints?", "true or false?" or "which line runs next?" **before** revealing.
4. **Trace it yourself:** she fills in a trace table or predicts the output.
5. **Fix / Complete / Reorder:** click the buggy line, fill in blanks, put jumbled lines in order (mirrors the school's "jumbled statements" question).
6. **Mastery check:** a `quiz` card with about 5 mixed items. Misses are logged for the parent.
7. **Paper practice:** the question is shown, she writes in her **notebook**, then reveals hints → structure → solution, and finishes with a self-check checklist and a confidence rating.

## Card types: their purpose

| Type | Purpose |
|---|---|
| `learn` | A short explanation, optional static code, and a "Remember" key idea |
| `watch` | The stepper with prediction gates. Optional `trace` table. `after` text is revealed when the run ends |
| `explore` | Editable stepper with "try this" prompts |
| `reduce` | Evaluates one expression **one operation at a time** (precedence, `++`, `+=`, char maths) |
| `mcq` | ICSE Q1-style multiple choice. `answer:'output'` means the correct option is computed by running the code |
| `predict` | Type the exact output or a variable's final value |
| `trace` | Fill in a trace table row by row. Optionally also the number of passes and the output |
| `bug` | Click the line Java rejects or that is logically wrong. A compile error is expected if no `line` is given |
| `reorder` | Arrange jumbled lines so the program works |
| `fill` | Fill in the blanks. `[[a\|b]]` lists accepted alternatives, and the tests make sure each one behaves like the first |
| `quiz` | A mastery check made of mixed items of the types above |
| `paper` | Notebook task: hints → structure → solution → checklist → confidence |
| `digits` | Digit-tile machine for `n%10` / `n/10` (modes: reverse, sum, count, cube) |

## Exam code style (mirror the school exactly)

```java
import java.util.*;
class Sum
{
    void main()
    {
        Scanner sc = new Scanner(System.in);
        /** n stores the number entered by the user */
        int n;
        System.out.println("Enter a number");
        n = sc.nextInt();
        ...
    }
}
```

- BlueJ style: `void main()` (often non-static), no `String args[]` needed.
- **Allman braces** (the opening brace on its own line).
- The Scanner is always named `sc`, and there is a `println("Enter ...")` prompt before each read.
- **Every variable declaration has a `/** ... */` comment.** "Variable description" carries marks.
- Early stages show *snippets*. The engine wraps them in a grey "every program lives inside this" frame. Full class skeletons appear from Stage 7 onward.

## Writing style for content

- Short sentences and a friendly tone, written for a 15-year-old beginner.
- Use concrete pictures: boxes, the drinks-glass swap, digit tiles.
- One idea per card.
- Explain *why* a wrong answer is wrong, especially for the targeted misconceptions.
- Use the school's vocabulary. Never introduce exam-irrelevant jargon.
