/* Stage 3 — Kinds of values: int, double, char, boolean, String; widening, casting, char codes. */
JP.content.add({
  id: 's3', n: 3, minutes: 30,
  title: 'Kinds of values',
  subtitle: 'Every box has a shape — only the right kind of value fits',
  recap: [
    '<code>int</code> whole numbers · <code>double</code> decimals · <code>char</code> one character in single quotes · <code>boolean</code> true/false · <code>String</code> text in double quotes.',
    'A smaller kind fits into a bigger box automatically: <code>double d = 5;</code> stores <code>5.0</code>.',
    'A double does <strong>not</strong> fit into an int box: <code>int x = 3.5;</code> is a compile error.',
    'A cast <code>(int)</code> forces it — and <strong>chops off</strong> the decimal part (no rounding): <code>(int)7.9</code> is 7.',
    'Every char has a number code: <code>\'A\'</code>=65, <code>\'a\'</code>=97, <code>\'0\'</code>=48. Letters are in order.',
    '<code>\'A\'</code> is a char, <code>"A"</code> is a String.'
  ],
  cards: [
    {
      type: 'learn', title: 'Five kinds of boxes',
      body: '<p>The <strong>type</strong> written before a variable decides what can go in the box.</p>' +
        '<table><tr><th>Type</th><th>Holds</th><th>Example</th></tr>' +
        '<tr><td><code>int</code></td><td>whole numbers</td><td><code>int marks = 92;</code></td></tr>' +
        '<tr><td><code>double</code></td><td>numbers with a decimal point</td><td><code>double price = 49.5;</code></td></tr>' +
        '<tr><td><code>char</code></td><td>exactly one character, in <strong>single</strong> quotes</td><td><code>char grade = \'A\';</code></td></tr>' +
        '<tr><td><code>boolean</code></td><td><code>true</code> or <code>false</code> only</td><td><code>boolean pass = true;</code></td></tr>' +
        '<tr><td><code>String</code></td><td>text, in <strong>double</strong> quotes (capital S!)</td><td><code>String name = "Prasasta";</code></td></tr></table>' +
        '<p class="muted small">Java also has byte, short, long and float. For now just know their names: byte, short, int, long are whole-number types (small → big); float and double are decimal types.</p>'
    },
    {
      type: 'watch', title: 'Boxes of different shapes',
      intro: '<p>Each type gets its own colour and shape in the Memory panel. Notice how each value is shown.</p>',
      code: `int marks = 92;
double price = 49.5;
char grade = 'A';
boolean pass = true;
String name = "Prasasta";
double d = 5;
System.out.println(d);`,
      gates: [{ line: 7, ask: 'output', q: 'd is a double box holding 5. What exactly is printed?' }],
      after: '<p>A double always prints with a decimal point: <code>5.0</code>, never <code>5</code>. The int 5 was <em>widened</em> to 5.0 to fit the double box.</p>'
    },
    {
      type: 'learn', title: 'What fits where',
      body: '<p>Think of the number types as boxes of increasing size: <code>int</code> → <code>long</code> → <code>double</code>.</p>' +
        '<ul><li>Small into big is <strong>automatic</strong> (widening, also called implicit conversion): <code>double d = 7;</code> → 7.0</li>' +
        '<li>Big into small is <strong>refused</strong> because something could be lost: <code>int x = 7.5;</code> ✗ compile error</li>' +
        '<li>If you really want it, use a <strong>cast</strong> (explicit conversion): <code>int x = (int)7.5;</code> → 7. The cast simply <strong>cuts off</strong> the decimal part — it never rounds.</li></ul>',
      key: '(int) chops, it does not round: (int)9.99 is 9, (int)-2.7 is -2.'
    },
    {
      type: 'bug', title: 'Java refuses this one',
      code: `double avg = 78.6;
int whole = avg;
System.out.println(whole);`,
      explain: 'A double value cannot be stored in an int box without a cast, because the .6 would be lost. Java calls this a “possible lossy conversion”. Fix: <code>int whole = (int)avg;</code>',
      fixed: `double avg = 78.6;
int whole = (int)avg;
System.out.println(whole);`
    },
    {
      type: 'predict', title: 'Casting chops',
      q: '<p>What is printed?</p>',
      code: `double a = 9.99;
int b = (int)a;
double c = b;
System.out.println(b);
System.out.println(c);`,
      ask: 'output',
      explain: '(int)9.99 cuts to 9. Putting 9 back into a double box gives 9.0 — the .99 is gone for ever.'
    },
    {
      type: 'learn', title: 'Characters are secretly numbers',
      body: '<p>A <code>char</code> box stores a character, but inside the computer every character has a <strong>code number</strong> (its Unicode/ASCII value).</p>' +
        '<p>You only need three anchors — the rest follow in order:</p>' +
        '<table><tr><th>Character</th><th>Code</th><th>So…</th></tr>' +
        '<tr><td><code>\'A\'</code></td><td>65</td><td>\'B\'=66, \'C\'=67 … \'Z\'=90</td></tr>' +
        '<tr><td><code>\'a\'</code></td><td>97</td><td>\'b\'=98 … \'z\'=122 (small letters = capital + 32)</td></tr>' +
        '<tr><td><code>\'0\'</code></td><td>48</td><td>\'1\'=49 … \'9\'=57</td></tr></table>' +
        '<p>Storing a code number in a char box gives the character: <code>char c = 67;</code> puts <code>\'C\'</code> in c. Storing a char in an int box gives its code: <code>int n = \'A\';</code> puts 65 in n.</p>',
      key: '\'A\' (single quotes) is one char. "A" (double quotes) is a String. \'5\' is a character whose code is 53 — not the number 5.'
    },
    {
      type: 'watch', title: 'Char ↔ number',
      code: `char c = 67;
int n = 'a';
char d = 'B';
int code = d;
System.out.println(c);
System.out.println(n);
System.out.println(code);`,
      gates: [
        { line: 1, ask: 'var:c' },
        { line: 4, ask: 'var:code' }
      ]
    },
    {
      type: 'mcq', q: 'Which declaration is correct?',
      options: ['char ch = "A";', 'char ch = \'A\';', 'char ch = \'AB\';', 'String s = \'A\';'], answer: 1,
      explain: 'A char uses single quotes and holds exactly one character.'
    },
    {
      type: 'mcq', q: 'What is the value of <code>(int)-6.8</code>?',
      code: 'System.out.println((int)-6.8);',
      options: ['-7', '-6', '-6.8', '6'], answer: 'output',
      explain: 'The cast cuts the decimal part off, towards zero. It does not round.'
    },
    {
      type: 'quiz', title: 'Mastery check',
      items: [
        {
          type: 'mcq', q: 'Which type would you use to store whether a student has passed?',
          options: ['int', 'char', 'boolean', 'String'], answer: 2
        },
        {
          type: 'predict', q: '<p>What is printed?</p>',
          code: `int x = 7;
double y = x;
System.out.println(y);`,
          ask: 'output'
        },
        {
          type: 'bug', q: '<p>Click the line Java will reject.</p>',
          code: `int a = 10;
double b = a;
int c = b + 1;
System.out.println(c);`,
          explain: 'b is a double, so b + 1 is a double. It cannot go into an int box without (int).'
        },
        {
          type: 'predict', q: '<p>What is printed?</p>',
          code: `char ch = 'D';
int v = ch;
System.out.println(v);`,
          ask: 'output',
          explain: '\'A\'=65, so \'D\' = 65 + 3 = 68.'
        },
        {
          type: 'mcq', q: 'Converting int to double automatically, as in <code>double d = 5;</code>, is called:',
          options: ['explicit type conversion (casting)', 'implicit type conversion (widening)', 'concatenation', 'a compile error'], answer: 1
        }
      ]
    },
    {
      type: 'paper', title: 'Paper practice: declarations',
      minutes: 6,
      q: '<p>Write Java declarations (one statement each) to:</p><ol><li>store the roll number 21</li><li>store the percentage 87.5</li><li>store the section letter B</li><li>store whether fees are paid (yes)</li><li>store the school name Clarence Public School</li><li>store the whole-number part of the percentage in a new int variable, using a cast</li></ol><p>Then print the int variable from (6).</p>',
      hints: ['Pick the type first: whole number, decimal, one character, yes/no, text.', 'For (6): <code>int part = (int)percentage;</code>'],
      solution: `int roll = 21;
double percentage = 87.5;
char section = 'B';
boolean feesPaid = true;
String school = "Clarence Public School";
int part = (int)percentage;
System.out.println(part);`,
      checklist: [
        'char uses single quotes, String uses double quotes',
        '<code>String</code> has a capital S; the other types are all small letters',
        '<code>true</code> is written without quotes',
        'The cast is written <code>(int)</code> in brackets before the value',
        'Variable names have no spaces (feesPaid, not fees paid)'
      ]
    }
  ]
});
