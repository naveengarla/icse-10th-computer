/* Stage 6 — Choosing a path: conditions, if / else / else-if, nested + dangling else, ternary, switch. */
JP.content.add({
  id: 's6', n: 6, minutes: 45,
  title: 'Choosing a path',
  subtitle: 'A condition is worked out to true or false — right now — and only one path runs',
  recap: [
    'A condition is an expression whose value is <code>true</code> or <code>false</code>, calculated with the values in the boxes <strong>at that moment</strong>.',
    '<code>==</code> compares; <code>=</code> stores. <code>if (x = 5)</code> is an error.',
    'In if–else exactly <strong>one</strong> of the two blocks runs.',
    'An else-if ladder is checked from the top and <strong>stops at the first true</strong> condition. Later conditions are never checked.',
    'An <code>else</code> belongs to the <strong>nearest</strong> unmatched <code>if</code> above it — whatever the indentation says.',
    '<code>cond ? a : b</code> gives a if cond is true, otherwise b.',
    'switch jumps to the matching case and runs <strong>downwards until a break</strong> (fall-through). <code>default</code> runs if no case matches.'
  ],
  cards: [
    {
      type: 'learn', title: 'Conditions are true or false',
      body: '<p>A <strong>condition</strong> asks a yes/no question about the boxes. Java works it out to <code>true</code> or <code>false</code>.</p>' +
        '<table><tr><th>Operator</th><th>Meaning</th><th>Example (a = 7)</th></tr>' +
        '<tr><td><code>==</code></td><td>is equal to</td><td><code>a == 7</code> → true</td></tr>' +
        '<tr><td><code>!=</code></td><td>is not equal to</td><td><code>a != 7</code> → false</td></tr>' +
        '<tr><td><code>&gt;</code> <code>&lt;</code> <code>&gt;=</code> <code>&lt;=</code></td><td>bigger / smaller (or equal)</td><td><code>a &gt;= 7</code> → true</td></tr>' +
        '<tr><td><code>&amp;&amp;</code></td><td>AND — both must be true</td><td><code>a &gt; 0 &amp;&amp; a &lt; 5</code> → false</td></tr>' +
        '<tr><td><code>||</code></td><td>OR — at least one true</td><td><code>a &lt; 0 || a == 7</code> → true</td></tr>' +
        '<tr><td><code>!</code></td><td>NOT — flips it</td><td><code>!(a == 7)</code> → false</td></tr></table>',
      key: '= stores, == compares. Never mix them up.'
    },
    {
      type: 'reduce', expr: 'a % 2 == 0 && b > a || c != 3',
      vars: { a: { t: 'int', v: 6 }, b: { t: 'int', v: 4 }, c: { t: 'int', v: 3 } },
      q: 'a = 6, b = 4, c = 3. && is done before ||. Is it true or false?'
    },
    {
      type: 'watch', title: 'if – else: one path only',
      intro: '<p>Watch the code: the path Java takes lights up, and the block it skips is dimmed. Change the input and run again to take the other path.</p>',
      code: `Scanner sc = new Scanner(System.in);
System.out.println("Enter marks");
int marks = sc.nextInt();
if (marks >= 40)
{
    System.out.println("Pass");
}
else
{
    System.out.println("Fail");
}
System.out.println("Done");`,
      input: '35',
      gates: [{ line: 4, ask: 'cond' }, { line: 4, ask: 'next', q: 'The condition was false. Which line runs next? Click it.' }]
    },
    {
      type: 'learn', title: 'The else-if ladder',
      body: '<p>When there are more than two paths (grades, slabs, ranges), use a ladder:</p>' +
        '<pre>if (cond1)\n    ...\nelse if (cond2)\n    ...\nelse if (cond3)\n    ...\nelse\n    ...</pre>' +
        '<p>Java checks the conditions <strong>from the top</strong>. At the <strong>first true</strong> one it runs that block and then <strong>jumps out of the whole ladder</strong>. If none is true, the final <code>else</code> runs.</p>',
      key: 'Because the ladder stops at the first true, the order of the conditions matters.'
    },
    {
      type: 'watch', title: 'Electricity bill slabs',
      intro: '<p>Rates: first 100 units at ₹2, next 200 units at ₹3, above 300 units at ₹5. Try inputs 80, 250 and 420.</p>',
      code: `Scanner sc = new Scanner(System.in);
System.out.println("Enter units consumed");
int units = sc.nextInt();
double bill;
if (units <= 100)
    bill = units * 2.0;
else if (units <= 300)
    bill = 200 + (units - 100) * 3.0;
else
    bill = 800 + (units - 300) * 5.0;
System.out.println("Bill = " + bill);`,
      input: '250',
      gates: [{ line: 5, ask: 'cond' }, { line: 7, ask: 'cond' }, { line: 8, ask: 'var:bill' }],
      after: '<p>Why is the second condition just <code>units &lt;= 300</code> and not <code>units &gt; 100 &amp;&amp; units &lt;= 300</code>? Because Java only reaches it when the first condition was false — so units is already more than 100.</p>'
    },
    {
      type: 'mcq', q: 'm is 85. What is printed?',
      code: `int m = 85;
if (m >= 40)
    System.out.println("Pass");
else if (m >= 80)
    System.out.println("Distinction");
else
    System.out.println("Fail");`,
      options: ['Pass', 'Distinction', 'Pass\nDistinction', 'Fail'], answer: 'output',
      explain: 'm >= 40 is already true, so Java prints Pass and leaves the ladder. m >= 80 is never even checked. The conditions are in the wrong order for this program!'
    },
    {
      type: 'learn', title: 'Nested if — and the dangling else',
      body: '<p>An if can sit inside another if. Then a tricky rule matters:</p>' +
        '<p><strong>An <code>else</code> pairs with the nearest <code>if</code> above it that has no else yet.</strong> Indentation means nothing to Java.</p>' +
        '<p>To make an else belong to the outer if, use braces <code>{ }</code> around the inner if.</p>'
    },
    {
      type: 'watch', title: 'The indentation lies',
      intro: '<p>The indentation makes it <em>look</em> like the else belongs to the first if. Predict, then watch.</p>',
      code: `int a = 5, b = 10;
if (a > 10)
    if (b > 5)
        System.out.println("X");
else
    System.out.println("Y");
System.out.println("Z");`,
      gates: [{ line: 2, ask: 'next', q: 'a > 10 is false. Which line runs next? Click it.' }],
      after: '<p>The else belongs to <code>if (b &gt; 5)</code>. Since the outer if is false, the whole inner if–else is skipped — so not even Y is printed. Only <code>Z</code>.</p>'
    },
    {
      type: 'learn', title: 'The ternary operator ? :',
      body: '<p>A short if-else that <strong>gives a value</strong>:</p>' +
        '<p><code>result = (condition) ? valueIfTrue : valueIfFalse;</code></p>' +
        '<p><code>int max = (a &gt; b) ? a : b;</code> is the same as:</p>' +
        '<pre>if (a &gt; b)\n    max = a;\nelse\n    max = b;</pre>',
      key: 'Exam: “Rewrite using the ternary operator” — condition ? true-value : false-value.'
    },
    {
      type: 'predict', title: 'Nested ternary',
      q: '<p>What is printed?</p>',
      code: `int n = 0;
String s = (n > 0) ? "Positive" : (n < 0) ? "Negative" : "Zero";
System.out.println(s);
int a = 14, b = 9;
int big = (a > b) ? a : b;
System.out.println(big * 2);`,
      ask: 'output'
    },
    {
      type: 'fill', title: 'Rewrite as ternary',
      q: '<p>Rewrite this if-else using the ternary operator:</p><pre>if (age &gt;= 18)\n    fee = 500;\nelse\n    fee = 200;</pre>',
      code: `int age = 15;
int fee = [[(age >= 18) ? 500 : 200|age >= 18 ? 500 : 200|(age>=18)?500:200|age>=18?500:200]];
System.out.println(fee);`
    },
    {
      type: 'learn', title: 'switch: jump to a case',
      body: '<p><code>switch</code> compares one value (int, char or String) with several <code>case</code> labels:</p>' +
        '<pre>switch (day)\n{\n    case 1: System.out.println("Mon");\n            break;\n    case 2: System.out.println("Tue");\n            break;\n    default: System.out.println("Other");\n}</pre>' +
        '<p>Java <strong>jumps</strong> to the matching case and runs <strong>downwards</strong>. <code>break</code> jumps out of the switch. <strong>Without break, it keeps running into the next case</strong> — this is called <strong>fall-through</strong>. <code>default</code> runs when no case matches.</p>'
    },
    {
      type: 'watch', title: 'Fall-through',
      intro: '<p>One break is missing. Watch Java fall through into the next case.</p>',
      code: `int choice = 2;
switch (choice)
{
    case 1: System.out.println("Tea");
            break;
    case 2: System.out.println("Coffee");
    case 3: System.out.println("Juice");
            break;
    default: System.out.println("Water");
}
System.out.println("Enjoy");`,
      gates: [{ line: 2, ask: 'next', q: 'choice is 2. Which line does the switch jump to? Click it.' }, { line: 7, ask: 'output' }]
    },
    {
      type: 'predict', title: 'Your turn: switch on a char',
      q: '<p>What is printed?</p>',
      code: `char grade = 'B';
switch (grade)
{
    case 'A': System.out.print("Excellent ");
    case 'B': System.out.print("Good ");
    case 'C': System.out.print("Fair ");
              break;
    case 'D': System.out.print("Poor ");
    default: System.out.print("Invalid ");
}`,
      ask: 'output',
      explain: 'Jump to case \'B\', print Good, fall into case \'C\', print Fair, then break.'
    },
    {
      type: 'bug', title: 'Why does it say Positive?',
      q: '<p>n is negative, but the program prints “Positive”. Click the line that causes it.</p>',
      code: `int n = -4;
if (n > 0);
{
    System.out.println("Positive");
}`,
      line: 2,
      explain: 'The <code>;</code> right after <code>if (n &gt; 0)</code> is an empty statement — it IS the body of the if. The block in braces is then just ordinary code that always runs.',
      fixed: `int n = -4;
if (n > 0)
{
    System.out.println("Positive");
}`
    },
    {
      type: 'bug', title: 'Compare, don’t store',
      code: `int x = 5;
if (x = 5)
    System.out.println("five");`,
      explain: '<code>x = 5</code> stores 5; it is not a true/false question. To compare use <code>==</code>: <code>if (x == 5)</code>.',
      fixed: `int x = 5;
if (x == 5)
    System.out.println("five");`
    },
    {
      type: 'quiz', title: 'Mastery check',
      items: [
        {
          type: 'predict', q: '<p>What is printed?</p>',
          code: `int x = 7, y = 3;
if (x % y == 1 && x > y)
    System.out.println("A");
else
    System.out.println("B");
System.out.println("C");`,
          ask: 'output'
        },
        {
          type: 'predict', q: '<p>What is printed?</p>',
          code: `int t = 32;
if (t > 40)
    System.out.println("Hot");
else if (t > 30)
    System.out.println("Warm");
else if (t > 20)
    System.out.println("Pleasant");
else
    System.out.println("Cold");`,
          ask: 'output'
        },
        {
          type: 'predict', q: '<p>What is printed?</p>',
          code: `int k = 3;
switch (k)
{
    case 2: System.out.print("two ");
    case 3: System.out.print("three ");
    case 4: System.out.print("four ");
    default: System.out.print("end");
}`,
          ask: 'output'
        },
        {
          type: 'mcq', q: 'Which is the ternary form of: if (a % 2 == 0) s = "Even"; else s = "Odd";',
          options: ['s = a % 2 == 0 : "Even" ? "Odd";', 's = (a % 2 == 0) ? "Even" : "Odd";', 's = (a % 2 == 0) ? "Odd" : "Even";', 's = if (a % 2 == 0) "Even" else "Odd";'], answer: 1
        },
        {
          type: 'predict', q: '<p>Careful with the dangling else. What is printed?</p>',
          code: `int p = 8;
if (p > 5)
    if (p > 10)
        System.out.println("big");
else
    System.out.println("medium");
System.out.println("end");`,
          ask: 'output',
          explain: 'The else pairs with if (p &gt; 10). p &gt; 5 is true, p &gt; 10 is false → the else runs: medium.'
        }
      ]
    },
    {
      type: 'paper', title: 'Paper practice: positive, negative or zero',
      minutes: 10,
      q: '<p>Write Java statements to read an integer and print whether it is <code>Positive</code>, <code>Negative</code> or <code>Zero</code>. Also print whether it is <code>Even</code> or <code>Odd</code> using the ternary operator.</p><p>Sample input <code>-6</code> → output:</p><pre>Negative\nEven</pre>',
      input: '-6',
      hints: ['Use an if – else if – else ladder: n &gt; 0, n &lt; 0, otherwise zero.', 'Even means n % 2 == 0. (This works for negative n too, because -6 % 2 is 0.)'],
      structure: `Scanner sc = new Scanner(System.in);
// message + read n
if (...)
    ...
else if (...)
    ...
else
    ...
String type = (...) ? "Even" : "Odd";
// print type`,
      solution: `Scanner sc = new Scanner(System.in);
System.out.println("Enter a number");
int n = sc.nextInt();
if (n > 0)
    System.out.println("Positive");
else if (n < 0)
    System.out.println("Negative");
else
    System.out.println("Zero");
String type = (n % 2 == 0) ? "Even" : "Odd";
System.out.println(type);`,
      checklist: [
        '<code>==</code> (not <code>=</code>) in comparisons',
        'No <code>;</code> right after <code>if (...)</code>',
        'The last branch is a plain <code>else</code> (no condition)',
        'Ternary is written condition <code>?</code> true-value <code>:</code> false-value'
      ]
    }
  ]
});
