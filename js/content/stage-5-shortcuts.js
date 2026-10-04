/* Stage 5 — Shortcuts that change boxes: ++, --, compound assignment. */
JP.content.add({
  id: 's5', n: 5, minutes: 35,
  title: 'Shortcuts that change boxes',
  subtitle: '++, -- and += change a box in the middle of a calculation',
  recap: [
    '<code>x++</code> and <code>++x</code> both add 1 to the box x.',
    '<strong>Prefix</strong> <code>++x</code>: change the box first, then use the <strong>new</strong> value.',
    '<strong>Postfix</strong> <code>x++</code>: use the <strong>old</strong> value, then change the box.',
    '<code>a += b</code> means <code>a = a + (b)</code>. Java <strong>saves the old value of a first</strong>, then works out the whole right side.',
    'In “Evaluate” questions, go left to right and write each operand’s value under it, keeping the boxes updated as you go.'
  ],
  cards: [
    {
      type: 'learn', title: 'Two kinds of ++',
      body: '<p><code>x++;</code> on its own line simply adds 1 to x. So does <code>++x;</code>. The difference only shows when ++ is used <strong>inside</strong> a bigger expression:</p>' +
        '<table><tr><th></th><th>Value used in the expression</th><th>Box afterwards</th></tr>' +
        '<tr><td><code>++x</code> (prefix)</td><td><strong>new</strong> value — change first, then use</td><td>x + 1</td></tr>' +
        '<tr><td><code>x++</code> (postfix)</td><td><strong>old</strong> value — use first, then change</td><td>x + 1</td></tr></table>' +
        '<p><code>--</code> works the same way, subtracting 1.</p>',
      key: 'Read the order on the page: ++ before x = increase before use. x before ++ = use before increase.'
    },
    {
      type: 'watch', title: 'Watch the two moments',
      intro: '<p>Watch the <strong>Calculation</strong> panel and the box x on each line.</p>',
      code: `int x = 5;
int a = x++;
int b = ++x;
int c = x-- + 10;
System.out.println(a + " " + b + " " + c + " " + x);`,
      gates: [
        { line: 2, ask: 'var:a', q: 'x is 5. After <code>a = x++;</code> what is in a?' },
        { line: 3, ask: 'var:b', q: 'x is now 6. After <code>b = ++x;</code> what is in b?' },
        { line: 4, ask: 'var:c' }
      ]
    },
    {
      type: 'reduce', expr: 'x++ + ++x', vars: { x: { t: 'int', v: 3 } },
      q: 'x starts at 3. Go left to right, updating x as you go. What is the value?'
    },
    {
      type: 'learn', title: 'Compound assignment: +=, -=, *=, /=, %=',
      body: '<p><code>a += 5;</code> is short for <code>a = a + 5;</code>. Similarly <code>-=</code>, <code>*=</code>, <code>/=</code>, <code>%=</code>.</p>' +
        '<p>Two important details:</p>' +
        '<ol><li>The right side is worked out <strong>completely first</strong> (as if in brackets): <code>k *= 2 + 3;</code> means <code>k = k * (2 + 3)</code>, not k*2+3.</li>' +
        '<li>Java <strong>saves the old value of the left box first</strong>, then works out the right side. Changes made to that box by ++ inside the right side do not affect the saved value — and are then overwritten.</li></ol>',
      key: 'a op= expr  →  a = (saved a) op (expr)'
    },
    {
      type: 'mcq', q: 'k is 4. What is printed?',
      code: `int k = 4;
k *= 2 + 3;
System.out.println(k);`,
      options: ['11', '20', '14', '9'], answer: 'output',
      explain: 'k *= 2 + 3 means k = k * (2 + 3) = 4 * 5 = 20.'
    },
    {
      type: 'predict', title: 'Chain of +=',
      q: '<p>Assignment works <strong>right to left</strong>: <code>b += c</code> is done first, then <code>a += (the new b)</code>. What is printed?</p>',
      code: `int a = 2, b = 6, c = 10;
a += b += c;
System.out.println(a + ", " + b + ", " + c);`,
      ask: 'output'
    },
    {
      type: 'learn', title: 'How to answer “Evaluate” questions on paper',
      body: '<p>The school worksheets love expressions like <code>p += p++ + q++ - ++p</code>. Method:</p>' +
        '<ol><li>Write the starting values of the boxes.</li>' +
        '<li>For <code>op=</code>, note the <strong>saved</strong> value of the left variable.</li>' +
        '<li>Go <strong>left to right</strong> through the right side. Under each operand, write the value it gives, and update the box if it has ++ or --.</li>' +
        '<li>Calculate using normal precedence.</li>' +
        '<li>Apply the op= with the saved value. That is the final value of the variable.</li></ol>' +
        '<p>Example, p=6, q=7: <code>p += p++ + q++ - ++p</code> → saved p = 6; p++ gives 6 (p→7), q++ gives 7 (q→8), ++p gives 8 (p→8); 6 + 7 − 8 = 5; p = 6 + 5 = <strong>11</strong>.</p>'
    },
    {
      type: 'reduce', expr: 'p += p++ + q++ - ++p', vars: { p: { t: 'int', v: 6 }, q: { t: 'int', v: 7 } },
      q: 'p = 6, q = 7. What is the final value of p?'
    },
    {
      type: 'reduce', expr: 'y *= ++x + ++y + x--', vars: { x: { t: 'int', v: 5 }, y: { t: 'int', v: 10 } },
      q: 'x = 5, y = 10. What is the final value of y?'
    },
    {
      type: 'reduce', expr: 'm += m-- + ++n + ++m + --n', vars: { m: { t: 'int', v: 10 }, n: { t: 'int', v: 5 } },
      q: 'm = 10, n = 5. What is the final value of m?'
    },
    {
      type: 'reduce', expr: '++x + ++y', vars: { x: { t: 'char', v: 50 }, y: { t: 'char', v: 100 } },
      q: "x holds '2' and y holds 'd'. ++ keeps them as chars, but + adds the codes. What is the value?"
    },
    {
      type: 'watch', title: '++ on a char stays a char',
      code: `char ch = 'A';
ch++;
ch += 2;
System.out.println(ch);
int n = ch + 1;
System.out.println(n);`,
      gates: [{ line: 3, ask: 'var:ch' }, { line: 6, ask: 'output' }],
      after: '<p><code>ch++</code> and <code>ch += 2</code> keep ch a char (they include a hidden cast). But <code>ch + 1</code> is an int calculation.</p>'
    },
    {
      type: 'quiz', title: 'Mastery check',
      items: [
        {
          type: 'predict', q: '<p>What is printed?</p>',
          code: `int a = 8;
int b = a-- - --a;
System.out.println(a + " " + b);`,
          ask: 'output',
          explain: 'a-- gives 8 (a→7), --a makes a 6 and gives 6. b = 8 − 6 = 2.'
        },
        { type: 'reduce', expr: 'a += a++ * 2', vars: { a: { t: 'int', v: 4 } }, q: 'a = 4. Final value of a?' },
        {
          type: 'mcq', q: 'What is printed?',
          code: `int x = 3;
x += x++ + ++x;
System.out.println(x);`,
          options: ['11', '12', '13', '14'], answer: 'output',
          explain: 'Saved x = 3. x++ gives 3 (x→4), ++x gives 5. 3 + 5 = 8. x = 3 + 8 = 11.'
        },
        {
          type: 'predict', q: '<p>What is in <code>j</code> at the end?</p>',
          code: `int j = 10;
j -= 2 * 3;
j++;`,
          ask: 'var:j'
        },
        {
          type: 'mcq', q: 'Which statement does NOT add 1 to x?',
          options: ['x++;', '++x;', 'x += 1;', 'x + 1;'], answer: 3,
          explain: '<code>x + 1;</code> calculates a value but does not store it anywhere — Java actually rejects it as “not a statement”.'
        }
      ]
    },
    {
      type: 'paper', title: 'Paper practice: evaluate',
      minutes: 10,
      q: '<p>Evaluate on paper, showing each operand’s value. Give the final values of all variables.</p>' +
        '<ol><li><code>int a = 7, b = 3; a += a++ - --b + b * 2;</code></li>' +
        '<li><code>int x = 4; int y = x++ * 2 + --x;</code></li>' +
        '<li><code>char c = \'B\'; c += 3; int k = c + 1;</code></li></ol>',
      hints: [
        '(1) Saved a = 7. a++ gives 7 (a→8), --b gives 2 (b→2), b*2 uses b = 2.',
        '(2) x++ gives 4 (x→5), --x makes x 4 and gives 4.'
      ],
      solution: `int a = 7, b = 3;
a += a++ - --b + b * 2;
System.out.println("a = " + a + ", b = " + b);
int x = 4;
int y = x++ * 2 + --x;
System.out.println("x = " + x + ", y = " + y);
char c = 'B';
c += 3;
int k = c + 1;
System.out.println("c = " + c + ", k = " + k);`,
      checklist: [
        'Saved the old value before op=',
        'Went strictly left to right',
        'Updated the box immediately after each ++ / --',
        'Kept the char as a char after +='
      ]
    }
  ]
});
