/* Stage 7 — Going round again: while, for, do-while, trace tables, break/continue, series, nested loops, full program skeleton. */
JP.content.add({
  id: 's7', n: 7, minutes: 55,
  title: 'Going round again',
  subtitle: 'A loop checks its condition before every pass — trace tables make it visible',
  recap: [
    '<code>while (cond)</code>: check, run the body, check again … stop as soon as the check is <strong>false</strong>.',
    '<code>for (init; cond; update)</code>: init <strong>once</strong>; then check → body → update → check …',
    '<code>do { } while (cond);</code> runs the body <strong>first</strong>, then checks — so it always runs at least once.',
    'Count passes with a trace table: one row per check. The last check is the false one; the body does not run then.',
    'After the loop, the loop variable holds the value that made the condition false.',
    'A <code>;</code> right after <code>while(...)</code> or <code>for(...)</code> is an empty body.',
    '<code>break</code> leaves the loop at once. <code>continue</code> skips the rest of this pass and goes to the next check (in a for loop, via the update).',
    'Nested loops: for each pass of the outer loop, the inner loop runs completely. <code>print</code> inside, <code>println</code> after the inner loop.'
  ],
  cards: [
    {
      type: 'learn', title: 'The while loop',
      body: '<p>A loop repeats a block. The <code>while</code> loop is the simplest:</p>' +
        '<pre>while (condition)\n{\n    body\n}</pre>' +
        '<ol><li>Check the condition.</li><li>If <strong>true</strong>: run the whole body, then go back to step 1.</li><li>If <strong>false</strong>: skip to the line after the loop.</li></ol>' +
        '<p>Something in the body must change the condition, or the loop never ends (an infinite loop).</p>',
      key: 'The condition is checked BEFORE every pass — including one last time when it turns false.'
    },
    {
      type: 'watch', title: 'Watch a while loop',
      intro: '<p>The <strong>trace table</strong> on the right gets one row each time the condition is checked. Watch the pass counter on the loop line.</p>',
      code: `int i = 1;
while (i <= 4)
{
    System.out.println(i * i);
    i++;
}
System.out.println("After the loop i = " + i);`,
      trace: { cols: ['i'], at: 'loop' },
      gates: [
        { line: 2, n: 5, ask: 'cond', q: 'Fifth check. i is 5 now. Is <code>i &lt;= 4</code> true or false?' },
        { line: 7, ask: 'output' }
      ],
      after: '<p>4 passes, but <strong>5 checks</strong>. And after the loop i is 5 — the value that made the condition false.</p>'
    },
    {
      type: 'learn', title: 'The for loop',
      body: '<p>A <code>for</code> loop puts the three parts of a counting loop on one line:</p>' +
        '<pre>for (int i = 1; i &lt;= 5; i++)\n{\n    body\n}</pre>' +
        '<ol><li><strong>init</strong> <code>int i = 1</code> — runs once, at the very start.</li>' +
        '<li><strong>check</strong> <code>i &lt;= 5</code> — before every pass.</li>' +
        '<li><strong>body</strong>.</li>' +
        '<li><strong>update</strong> <code>i++</code> — after every pass, then back to the check.</li></ol>' +
        '<p>A variable declared in the for line (<code>int i</code>) exists only inside the loop. Declare it before the loop if you need it afterwards.</p>',
      key: 'Order: init → check → body → update → check → body → update → … → check (false) → out.'
    },
    {
      type: 'watch', title: 'Adding up with an accumulator',
      intro: '<p><code>sum</code> starts at 0 and collects a little more on each pass. This pattern — the <strong>accumulator</strong> — is everywhere in exam programs.</p>',
      code: `int sum = 0;
for (int i = 1; i <= 5; i++)
{
    sum = sum + i;
}
System.out.println("Sum = " + sum);`,
      trace: { cols: ['i', 'sum'], at: 4 },
      gates: [{ line: 4, n: 3, ask: 'var:sum' }, { line: 2, n: 6, ask: 'cond' }],
      after: '<p>Notice the box <code>i</code> disappears after the loop: it was declared inside the for line, so it only lives inside the loop.</p>'
    },
    {
      type: 'trace', title: 'How many times does it run?',
      q: '<p>This is from a school worksheet. Complete the trace table (one row per check), then answer the questions. The first row is done for you.</p>',
      code: `int a, b;
for (a = 34, b = 5; a <= 50; a += b)
{
    System.out.println(a);
}
System.out.println("a = " + a);`,
      trace: { cols: ['a', 'b'], at: 'loop' },
      given: [[1, 1]],
      askPasses: true, askOutput: true,
      explain: 'a takes the values 34, 39, 44, 49 — four passes. Then a becomes 54, the check fails, and the loop ends. Count the TRUE rows, not the numbers between 34 and 50!'
    },
    {
      type: 'learn', title: 'do-while: body first',
      body: '<pre>do\n{\n    body\n} while (condition);</pre>' +
        '<p>The body runs <strong>first</strong>, then the condition is checked. So a do-while always runs <strong>at least once</strong>, even if the condition is false from the start. Note the <code>;</code> at the end.</p>'
    },
    {
      type: 'predict', title: 'At least once',
      q: '<p>The condition is false from the start. What is printed?</p>',
      code: `int n = 10;
do
{
    System.out.println("n = " + n);
    n = n + 5;
} while (n < 10);
System.out.println("End");`,
      ask: 'output'
    },
    {
      type: 'predict', title: 'The loop with no body',
      q: '<p>Look carefully at the end of line 2. What is printed?</p>',
      code: `int a = 10;
while (++a <= 20);
System.out.println(a);`,
      ask: 'output',
      explain: 'The <code>;</code> is the whole body. The loop just keeps doing ++a in the condition. When a becomes 21, 21 &lt;= 20 is false and the loop stops. Then a is printed once: 21.'
    },
    {
      type: 'mcq', q: 'What is printed?',
      code: `int i;
for (i = 1; i <= 5; i++);
System.out.println(i);`,
      options: ['1 2 3 4 5', '5', '6', '1'], answer: 'output',
      explain: 'Again an empty body (the ;). The loop counts i up to 6, and then the println runs once.'
    },
    {
      type: 'watch', title: 'break and continue',
      intro: '<p><code>continue</code> skips the rest of this pass. <code>break</code> leaves the loop completely.</p>',
      code: `for (int i = 1; i <= 10; i++)
{
    if (i % 3 == 0)
        continue;
    if (i == 8)
        break;
    System.out.print(i + " ");
}`,
      gates: [
        { line: 4, ask: 'next', q: '<code>continue</code> just ran. Which line runs next? Click it.' },
        { line: 5, n: 6, ask: 'cond', q: 'i is 8. Is <code>i == 8</code> true?' }
      ],
      after: '<p>In a for loop, <code>continue</code> jumps to the <strong>update</strong> (i++), then the check. 3 and 6 are skipped; at 8 the loop breaks, so 9 and 10 are never reached.</p>'
    },
    {
      type: 'watch', title: 'A series: 1 + 1/2 + 1/3 + 1/4',
      intro: '<p>Series questions use an accumulator with a fraction. Watch the type of <code>1.0 / i</code>.</p>',
      code: `double s = 0;
for (int i = 1; i <= 4; i++)
{
    s = s + 1.0 / i;
}
System.out.println(s);`,
      trace: { cols: ['i', 's'], at: 4 },
      gates: [{ line: 4, n: 2, ask: 'var:s' }],
      after: '<p>With <code>1 / i</code> instead of <code>1.0 / i</code>, every term after the first would be int division = 0, and s would end at 1.0.</p>'
    },
    {
      type: 'watch', title: 'Fibonacci: shifting two boxes',
      intro: '<p>Each new term is the sum of the previous two. After making c, the boxes shift along: a takes b, b takes c.</p>',
      code: `int a = 0, b = 1, c;
System.out.print(a + " " + b);
for (int i = 3; i <= 8; i++)
{
    c = a + b;
    System.out.print(" " + c);
    a = b;
    b = c;
}`,
      trace: { cols: ['i', 'a', 'b', 'c'], at: 8 },
      gates: [{ line: 5, n: 3, ask: 'var:c' }]
    },
    {
      type: 'learn', title: 'Nested loops make patterns',
      body: '<p>A loop inside a loop: for <strong>each</strong> pass of the outer loop, the inner loop runs <strong>all</strong> its passes.</p>' +
        '<p>For patterns, think of rows and columns:</p><ul><li>outer loop variable <code>i</code> = the row</li><li>inner loop = what goes on that row, printed with <code>print</code></li><li>after the inner loop, <code>println()</code> moves to the next row</li></ul>'
    },
    {
      type: 'watch', title: 'A number triangle',
      code: `for (int i = 1; i <= 3; i++)
{
    for (int j = 1; j <= i; j++)
    {
        System.out.print(j + " ");
    }
    System.out.println();
}`,
      gates: [{ line: 3, n: 2, ask: 'cond', q: 'Row i = 1. j is now 2. Is <code>j &lt;= i</code> true?' }],
      after: '<p>The inner limit is <code>i</code>, so row 1 has 1 number, row 2 has 2, row 3 has 3.</p>'
    },
    {
      type: 'predict', title: 'Your pattern',
      q: '<p>What is printed?</p>',
      code: `for (int i = 4; i >= 1; i--)
{
    for (int j = 1; j <= i; j++)
        System.out.print("*");
    System.out.println();
}`,
      ask: 'output'
    },
    {
      type: 'bug', title: 'One short',
      q: '<p>This should print the numbers 1 to 10, but it stops at 9. Click the faulty line.</p>',
      code: `int i = 1;
while (i < 10)
{
    System.out.print(i + " ");
    i++;
}`,
      line: 2,
      explain: '<code>i &lt; 10</code> is false when i is 10, so 10 is never printed. Use <code>i &lt;= 10</code>. Off-by-one mistakes come from &lt; versus &lt;=.',
      fixed: `int i = 1;
while (i <= 10)
{
    System.out.print(i + " ");
    i++;
}`
    },
    {
      type: 'fill', title: 'Rewrite the for loop as a while loop',
      q: '<p>Exam: “Rewrite using a while loop”:</p><pre>for (int k = 2; k &lt;= 10; k += 2)\n    System.out.print(k + " ");</pre>',
      code: `int k = [[2]];
while ([[k <= 10|k<=10]])
{
    System.out.print(k + " ");
    [[k += 2|k+=2|k = k + 2|k=k+2]];
}`,
      explain: 'The init goes before the loop, the condition stays in the while, and the update becomes the last statement of the body.'
    },
    {
      type: 'learn', title: 'A complete program, school style',
      body: '<p>From now on you write <strong>full programs</strong> on paper, exactly as your school expects:</p>' +
        '<ul><li><code>import java.util.*;</code> on top (for Scanner)</li>' +
        '<li><code>class</code> + name, then <code>void main()</code></li>' +
        '<li>braces on their own lines</li>' +
        '<li>a <code>/** */</code> comment describing every variable (the variable description — it carries marks!)</li></ul>',
      code: `import java.util.*;
class SeriesSum
{
    void main()
    {
        /** Scanner object to read input */
        Scanner sc = new Scanner(System.in);
        System.out.println("Enter n");
        /** n - number of terms */
        int n = sc.nextInt();
        /** s - sum of the series */
        double s = 0;
        /** i - loop counter */
        for (int i = 1; i <= n; i++)
        {
            s = s + 1.0 / i;
        }
        System.out.println("Sum = " + s);
    }
}`,
      key: 'Skeleton: import → class → void main() → Scanner → read → process → print.'
    },
    {
      type: 'quiz', title: 'Mastery check',
      items: [
        {
          type: 'predict', q: '<p>How many times is "Hi" printed? (Type the number of times.)</p>',
          code: `int c = 0;
for (int x = 5; x < 20; x += 4)
{
    System.out.println("Hi");
    c++;
}`,
          ask: 'var:c',
          explain: 'x is 5, 9, 13, 17 → 4 passes. Then x = 21 fails the check.'
        },
        {
          type: 'predict', q: '<p>What is printed?</p>',
          code: `int p = 1, s = 0;
while (p <= 10)
{
    s += p;
    p += 3;
}
System.out.println(s + " " + p);`,
          ask: 'output'
        },
        {
          type: 'predict', q: '<p>What is printed?</p>',
          code: `int n = 5;
do
{
    System.out.print(n + " ");
    n -= 2;
} while (n > 0);`,
          ask: 'output'
        },
        {
          type: 'mcq', q: 'What is printed?',
          code: `int k;
for (k = 1; k <= 20; k++)
{
    if (k % 7 == 0)
        break;
}
System.out.println(k);`,
          options: ['7', '20', '21', '14'], answer: 'output'
        },
        {
          type: 'predict', q: '<p>What is printed?</p>',
          code: `for (int i = 1; i <= 3; i++)
{
    for (int j = i; j <= 3; j++)
        System.out.print(j);
    System.out.println();
}`,
          ask: 'output'
        }
      ]
    },
    {
      type: 'paper', title: 'Paper practice: a full program',
      minutes: 15,
      q: '<p>Write a <strong>complete program</strong> (with import, class, main and variable comments) to input n and print the sum of the series</p><p style="font-size:1.1em">S = 1 + 1/2² + 1/3² + … + 1/n²</p><p>Sample input <code>3</code> → <code>Sum = 1.3611111111111112</code></p>',
      input: '3',
      hints: [
        'Same skeleton as the SeriesSum example. Only the term changes.',
        'The term is <code>1.0 / (i * i)</code> — brackets around the denominator, and 1.0 to avoid int division.'
      ],
      structure: `import java.util.*;
class Series
{
    void main()
    {
        // Scanner, message, read n
        // double s = 0;
        // for i from 1 to n: s = s + term
        // print
    }
}`,
      solution: `import java.util.*;
class Series
{
    void main()
    {
        /** Scanner object to read input */
        Scanner sc = new Scanner(System.in);
        System.out.println("Enter n");
        /** n - number of terms */
        int n = sc.nextInt();
        /** s - sum of the series */
        double s = 0;
        /** i - loop counter */
        for (int i = 1; i <= n; i++)
        {
            s = s + 1.0 / (i * i);
        }
        System.out.println("Sum = " + s);
    }
}`,
      trace: { cols: ['i', 's'], at: 16 },
      checklist: [
        '<code>import java.util.*;</code> at the top',
        '<code>class</code> name and <code>void main()</code> with matching braces',
        'A <code>/** */</code> comment for every variable',
        'Accumulator s declared as double and set to 0 before the loop',
        'Term uses <code>1.0</code> and brackets: <code>1.0 / (i * i)</code>',
        'Loop runs from 1 to n inclusive (<code>&lt;=</code>)'
      ]
    }
  ]
});
