/* Stage 4 — How Java calculates: precedence, int division, %, String +, char arithmetic, Math methods, formulas. */
JP.content.add({
  id: 's4', n: 4, minutes: 45,
  title: 'How Java calculates',
  subtitle: 'One operation at a time — and the types decide the answer',
  recap: [
    '<code>* / %</code> before <code>+ -</code>; equal ranks go <strong>left to right</strong>. Brackets first.',
    'int ÷ int gives an int — the decimal part is <strong>cut off</strong>: <code>7/2</code> is 3. If either side is a double, the answer is a double: <code>7/2.0</code> is 3.5.',
    '<code>%</code> gives the <strong>remainder</strong>: <code>17%5</code> is 2. <code>n%10</code> is the last digit.',
    'Once a String appears in a <code>+</code> chain (left to right), every later <code>+</code> joins text.',
    'char + char or char + int gives an <strong>int</strong> (the codes are added).',
    'Math methods return a value of a fixed type: <code>sqrt, pow, cbrt, ceil, floor</code> → double; <code>round</code> → whole number (no .0); <code>abs, max, min</code> → same type as the inputs.',
    'When turning a formula into Java, put the whole numerator and the whole denominator in brackets.'
  ],
  cards: [
    {
      type: 'learn', title: 'Java does one operation at a time',
      body: '<p>Java never “sees” a whole expression at once. It picks <strong>one</strong> operation, works it out, replaces it with the answer, and repeats.</p>' +
        '<p>Which operation goes first?</p><ol><li>Brackets <code>( )</code></li><li><code>*</code> <code>/</code> <code>%</code> — whichever comes first from the left</li><li><code>+</code> <code>-</code> — from the left</li></ol>',
      key: 'Same rank? Left to right. So 20 / 4 * 5 is (20/4)*5 = 25, not 20/(4*5).'
    },
    {
      type: 'reduce', expr: '2 + 3 * 4 - 6 / 4',
      q: 'Work it out on paper first (careful: all numbers are ints). What is the final value?'
    },
    {
      type: 'learn', title: 'Division with whole numbers',
      body: '<p>When <strong>both</strong> sides of <code>/</code> are ints, Java gives an int — it <strong>cuts off</strong> the decimal part (towards zero):</p>' +
        '<table><tr><td><code>7 / 2</code></td><td>3</td></tr><tr><td><code>2 / 5</code></td><td>0</td></tr><tr><td><code>-7 / 2</code></td><td>-3</td></tr></table>' +
        '<p>If <strong>either</strong> side is a double, the answer is a double: <code>7 / 2.0</code> is 3.5, <code>7.0 / 2</code> is 3.5.</p>' +
        '<p><code>%</code> (modulus) gives the <strong>remainder</strong> after whole-number division: <code>17 % 5</code> is 2 (17 = 3×5 + 2). The sign follows the left number: <code>-17 % 5</code> is -2.</p>',
      key: 'n % 10 is the last digit of n. n / 10 removes the last digit. (Stage 8 builds on this.)'
    },
    {
      type: 'watch', title: 'Division in action',
      code: `int a = 17, b = 5;
int q = a / b;
int r = a % b;
double d = a / b;
double e = a / 2.0;
System.out.println(q + " " + r);
System.out.println(d);
System.out.println(e);`,
      gates: [
        { line: 2, ask: 'var:q' },
        { line: 3, ask: 'var:r' },
        { line: 4, ask: 'var:d', q: 'Careful! a / b is worked out first, then stored in a double box. What will d hold?' }
      ],
      after: '<p>Line 4 is a classic trap: <code>a / b</code> is int ÷ int = 3, and <em>only then</em> is 3 stored in the double box as 3.0. The box type does not change how the right side is calculated.</p>'
    },
    {
      type: 'mcq', q: 'What is printed?',
      code: 'System.out.println(1 / 2 * 10.0);',
      options: ['5.0', '0.0', '5', '0'], answer: 'output',
      explain: 'Left to right: 1/2 is int ÷ int = 0. Then 0 * 10.0 = 0.0 (a double, because 10.0 is a double).'
    },
    {
      type: 'reduce', expr: '25 % 7 + 18 / 4 * 2',
      q: 'Remember: % and / are on the same rank as *. What is the value?'
    },
    {
      type: 'learn', title: '+ with text joins',
      body: '<p>If either side of <code>+</code> is a String, Java <strong>joins</strong> (concatenates) instead of adding.</p>' +
        '<p>Java still goes <strong>left to right</strong>, one <code>+</code> at a time:</p>' +
        '<table><tr><td><code>"Sum=" + 2 + 3</code></td><td>→ <code>"Sum=2" + 3</code> → <code>Sum=23</code></td></tr>' +
        '<tr><td><code>2 + 3 + "=Sum"</code></td><td>→ <code>5 + "=Sum"</code> → <code>5=Sum</code></td></tr>' +
        '<tr><td><code>"Sum=" + (2 + 3)</code></td><td>→ brackets first → <code>Sum=5</code></td></tr></table>'
    },
    {
      type: 'watch', title: 'Text joins, left to right',
      code: `int a = 4, b = 6;
System.out.println("Total = " + a + b);
System.out.println(a + b + " is total");
System.out.println("Total = " + (a + b));
System.out.println("" + a * b);`,
      gates: [
        { line: 2, ask: 'output' },
        { line: 3, ask: 'output' },
        { line: 5, ask: 'output', q: '* happens before +. What is printed?' }
      ]
    },
    {
      type: 'learn', title: 'Character arithmetic',
      body: '<p>A char in a calculation is used as its <strong>code number</strong> (\'A\'=65, \'a\'=97, \'0\'=48). The answer is an <strong>int</strong>.</p>' +
        '<table><tr><td><code>\'A\' + 2</code></td><td>65 + 2 = <code>67</code> (an int, not \'C\')</td></tr>' +
        '<tr><td><code>\'2\' + \'d\'</code></td><td>50 + 100 = <code>150</code></td></tr>' +
        '<tr><td><code>(char)(\'A\' + 2)</code></td><td><code>\'C\'</code> — the cast turns the code back into a character</td></tr>' +
        '<tr><td><code>"" + \'A\' + 2</code></td><td><code>A2</code> — once text is involved, it joins</td></tr></table>',
      key: 'But ++ and += keep a char a char: if c is \'A\', after c++ it holds \'B\'.'
    },
    {
      type: 'reduce', expr: "x + y", vars: { x: { t: 'char', v: 50 }, y: { t: 'char', v: 100 } },
      q: "x holds '2' and y holds 'd'. What is x + y?"
    },
    {
      type: 'predict', title: 'The char c = 67 series',
      q: '<p>This is a school worksheet question. Write the output line by line.</p>',
      code: `char c = 67;
System.out.println(c);
System.out.println(c + 3);
System.out.println((char)(c + 3));
System.out.println('5');
System.out.println('5' + 5 - 48 + 50);
c++;
System.out.println("Output is " + c + 2);`,
      ask: 'output',
      explain: 'c+3 is int 70. (char)70 is \'F\'. \'5\' prints as the character 5. \'5\'+5−48+50 = 53+5−48+50 = 60. c++ makes c \'D\', then "Output is " + c joins text → Output is D2.'
    },
    {
      type: 'learn', title: 'Math methods are machines',
      body: '<p>A <strong>Math method</strong> is like a machine: you put values in the brackets, and it <strong>returns</strong> one answer of a fixed type.</p>' +
        '<table><tr><th>Method</th><th>Gives</th><th>Returns</th><th>Example</th></tr>' +
        '<tr><td><code>Math.sqrt(x)</code></td><td>square root</td><td>double</td><td><code>Math.sqrt(25)</code> → 5.0</td></tr>' +
        '<tr><td><code>Math.cbrt(x)</code></td><td>cube root</td><td>double</td><td><code>Math.cbrt(27)</code> → 3.0</td></tr>' +
        '<tr><td><code>Math.pow(a, b)</code></td><td>a to the power b</td><td>double</td><td><code>Math.pow(2, 3)</code> → 8.0</td></tr>' +
        '<tr><td><code>Math.abs(x)</code></td><td>value without the minus sign</td><td>same as x</td><td><code>Math.abs(-7)</code> → 7</td></tr>' +
        '<tr><td><code>Math.max(a, b)</code>, <code>Math.min(a, b)</code></td><td>bigger / smaller</td><td>same as inputs</td><td><code>Math.max(4, 9)</code> → 9</td></tr>' +
        '<tr><td><code>Math.ceil(x)</code></td><td>next whole number <strong>up</strong></td><td>double</td><td><code>Math.ceil(4.1)</code> → 5.0</td></tr>' +
        '<tr><td><code>Math.floor(x)</code></td><td>next whole number <strong>down</strong></td><td>double</td><td><code>Math.floor(4.9)</code> → 4.0</td></tr>' +
        '<tr><td><code>Math.round(x)</code></td><td>nearest whole number (.5 goes <strong>up</strong>)</td><td><strong>whole number</strong> (long)</td><td><code>Math.round(4.5)</code> → 5</td></tr>' +
        '<tr><td><code>Math.random()</code></td><td>a random number from 0.0 up to (not including) 1.0</td><td>double</td><td></td></tr></table>',
      key: 'Math.round gives a whole number with NO .0 — Math.round(7.6) prints 8, not 8.0. But Math.ceil and Math.floor DO print .0.'
    },
    {
      type: 'watch', title: 'Math machines',
      code: `System.out.println(Math.sqrt(49));
System.out.println(Math.pow(3, 2));
System.out.println(Math.round(7.6));
System.out.println(Math.ceil(7.2));
System.out.println(Math.floor(-7.2));
System.out.println(Math.round(-3.5));
System.out.println(Math.abs(-12));`,
      gates: [
        { line: 3, ask: 'output', q: 'Watch out — what does Math.round(7.6) print?' },
        { line: 5, ask: 'output', q: 'floor goes DOWN. What is down from -7.2?' },
        { line: 6, ask: 'output', q: '.5 rounds UP (towards the bigger number). What is Math.round(-3.5)?' }
      ],
      after: '<p>On a number line, “up” means to the right. Up from -3.5 is -3. Down from -7.2 is -8.</p>'
    },
    {
      type: 'mcq', q: 'What is printed?',
      code: 'System.out.println(Math.round(0.5) + Math.ceil(0.5));',
      options: ['1.0', '2.0', '2', '1'], answer: 'output',
      explain: 'Math.round(0.5) is 1 (whole number). Math.ceil(0.5) is 1.0 (double). 1 + 1.0 = 2.0 — once a double joins, the answer is a double.'
    },
    {
      type: 'mcq', q: 'What is printed?',
      code: 'System.out.println(Math.min(\'x\', \'X\'));',
      options: ['X', 'x', '88', '120'], answer: 'output',
      explain: 'The chars are compared as codes: \'x\'=120, \'X\'=88. Math.min with chars works on their int codes, so it returns the int 88.'
    },
    {
      type: 'learn', title: 'Writing a formula in Java',
      body: '<p>Exam question: <em>“Write the Java expression for …”</em>. Rules:</p>' +
        '<ul><li>Write every multiplication with <code>*</code>: <code>2ab</code> → <code>2*a*b</code></li>' +
        '<li>Powers: <code>a²</code> → <code>a*a</code> or <code>Math.pow(a,2)</code></li>' +
        '<li>Roots: <code>√x</code> → <code>Math.sqrt(x)</code>, <code>∛x</code> → <code>Math.cbrt(x)</code></li>' +
        '<li><strong>A fraction bar is a bracket.</strong> Put the whole top and the whole bottom in brackets: <code>(a+b)/(a-b)</code></li></ul>' +
        '<p>Without brackets, <code>a+b/a-b</code> means a + (b/a) − b — completely different.</p>',
      key: 'Fraction → (top)/(bottom). Always.'
    },
    {
      type: 'mcq', q: 'Which is the correct Java expression for  (√a + √b) ÷ (a − b) ?',
      options: ['Math.sqrt(a)+Math.sqrt(b)/(a-b)', '(Math.sqrt(a)+Math.sqrt(b))/(a-b)', 'Math.sqrt(a+b)/(a-b)', '(Math.sqrt(a)+Math.sqrt(b))/a-b'], answer: 1,
      explain: '(a) divides only √b by (a−b). (c) is √(a+b), not √a+√b. (d) divides by a and then subtracts b. Only (b) has the whole top and the whole bottom in brackets.'
    },
    {
      type: 'fill', title: 'Complete the formulas',
      q: '<p>Fill each blank to match the formula in the comment. Use brackets where needed.</p>',
      code: `double a = 3, b = 4, u = 10, t = 2, g = 9.8;
// c = √(a² + b²)
double c = [[Math.sqrt(a*a+b*b)|Math.sqrt(a*a + b*b)|Math.sqrt(Math.pow(a,2)+Math.pow(b,2))|Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2))]];
// s = ut + ½gt²
double s = u*t + [[0.5*g*t*t|1.0/2*g*t*t|0.5 * g * t * t|g*t*t/2|1/2.0*g*t*t]];
// m = (a + b) / 2ab
double m = [[(a+b)/(2*a*b)|(a + b) / (2 * a * b)]];
System.out.println(c + " " + s + " " + m);`,
      explain: '<p>½ must be written <code>0.5</code> or <code>1.0/2</code> — <code>1/2</code> is int division and gives 0! And 2ab in the bottom needs its own brackets: <code>(2*a*b)</code>.</p>'
    },
    {
      type: 'predict', title: 'The ½ trap',
      q: '<p>A student wrote ½gt² like this. What is printed?</p>',
      code: `double g = 9.8;
int t = 2;
double s = 1 / 2 * g * t * t;
System.out.println(s);`,
      ask: 'output',
      explain: '1/2 is worked out first: int ÷ int = 0. 0 × anything = 0.0. Write 0.5 or 1.0/2 instead.'
    },
    {
      type: 'quiz', title: 'Mastery check',
      items: [
        { type: 'reduce', expr: '10 - 4 % 3 * 2 + 9 / 2', q: 'What is the value?' },
        {
          type: 'predict', q: '<p>What is printed?</p>',
          code: `int x = 5, y = 2;
System.out.println("Ans: " + x / y + x % y);`,
          ask: 'output',
          explain: '/ and % happen first (2 and 1), then the text joins from the left: "Ans: 2" then "1".'
        },
        {
          type: 'mcq', q: 'What is printed?', code: 'System.out.println(Math.pow(2, 0) + Math.sqrt(16));',
          options: ['5.0', '5', '6.0', '4.0'], answer: 'output'
        },
        {
          type: 'mcq', q: 'What type of value does <code>Math.round(4.7)</code> return?',
          options: ['double — it prints 5.0', 'a whole number (long) — it prints 5', 'int — it prints 4', 'char'], answer: 1
        },
        {
          type: 'predict', q: '<p>What is printed?</p>',
          code: `char ch = 'a';
System.out.println(ch + 1);`,
          ask: 'output'
        }
      ]
    },
    {
      type: 'paper', title: 'Paper practice: expressions',
      minutes: 8,
      q: '<p>Write Java expressions for:</p><ol><li>area = πr² (use 3.14)</li><li>p = √(x² + y²) ÷ 2</li><li>z = (a³ + b³) ÷ (a + b)</li><li>average of three ints a, b, c as a double (careful with int division!)</li></ol>' +
        '<p>Then evaluate on paper with r = 2, x = 6, y = 8, a = 1, b = 2, c = 4 and check with the solution.</p>',
      hints: ['π r² → 3.14 * r * r', 'For (4): (a + b + c) / 3.0 — the .0 forces double division.'],
      solution: `double r = 2;
int x = 6, y = 8, a = 1, b = 2, c = 4;
double area = 3.14 * r * r;
double p = Math.sqrt(x*x + y*y) / 2;
double z = (Math.pow(a, 3) + Math.pow(b, 3)) / (a + b);
double avg = (a + b + c) / 3.0;
System.out.println(area);
System.out.println(p);
System.out.println(z);
System.out.println(avg);`,
      checklist: [
        'Every multiplication has a <code>*</code>',
        'Whole numerator and whole denominator are in brackets',
        '<code>Math</code> has a capital M; <code>sqrt</code>, <code>pow</code> are small letters',
        'No int ÷ int where a decimal answer is needed'
      ]
    }
  ]
});
