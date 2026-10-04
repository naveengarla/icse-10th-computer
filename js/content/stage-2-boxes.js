/* Stage 2 — Memory boxes: variables, assignment, copy, overwrite, Scanner input. */
JP.content.add({
  id: 's2', n: 2, minutes: 35,
  title: 'Memory boxes',
  subtitle: 'A variable is a labelled box that holds exactly one value',
  recap: [
    '<code>int a;</code> makes a box called <code>a</code> that can hold whole numbers.',
    '<code>=</code> is not “equals”. It means: <strong>work out the right side first, then store the answer in the box on the left</strong>.',
    'A box holds <strong>one</strong> value. Storing a new value throws the old one away.',
    '<code>b = a;</code> <strong>copies</strong> the value. Later changes to <code>a</code> do not affect <code>b</code>.',
    'To swap two boxes you need a third box (<code>t</code>) to save one value.',
    '<code>sc.nextInt()</code> waits for the user to type a number and puts it in the box.'
  ],
  cards: [
    {
      type: 'learn', title: 'A variable is a box',
      body: '<p>Java remembers values in <strong>boxes</strong> in its memory. Each box has:</p>' +
        '<ul><li>a <strong>name</strong> (like <code>marks</code>),</li><li>a <strong>type</strong> — what kind of value fits (for now: <code>int</code> = whole number),</li><li>and <strong>one value</strong> inside.</li></ul>' +
        '<p><code>int marks;</code> <em>declares</em> the box: “make an empty int box called marks”.</p>' +
        '<p><code>marks = 75;</code> <em>stores</em> 75 in it. You can do both at once: <code>int marks = 75;</code></p>',
      code: `int marks;
marks = 75;
int bonus = 5;`,
      key: 'Declare once (with the type). After that, use only the name.'
    },
    {
      type: 'watch', title: 'Watch the boxes',
      intro: '<p>Watch the <strong>Memory</strong> panel. A new box appears when a variable is declared. A box flashes when its value changes.</p>',
      code: `int marks;
marks = 75;
int bonus = 5;
marks = marks + bonus;
System.out.println(marks);`,
      gates: [{ line: 4, ask: 'var:marks', q: 'Line 4 is about to run. What will be in <code>marks</code> after it?' }],
      after: '<p><code>marks = marks + bonus;</code> looks impossible in maths, but in Java it is normal: first work out <code>marks + bonus</code> (75 + 5 = 80) <em>using the old value</em>, then store 80 back in <code>marks</code>.</p>'
    },
    {
      type: 'learn', title: '= means “store”',
      body: '<p>Read <code>x = x + 1;</code> as <strong>“x becomes x + 1”</strong>, never “x equals x + 1”.</p>' +
        '<p>Java always does it in two moves:</p><ol><li><strong>Right side first</strong>: look inside the boxes and calculate.</li><li><strong>Then store</strong> the single answer in the box on the left.</li></ol>' +
        '<p>The left side must be a box name. <code>5 = x;</code> or <code>a + b = c;</code> make no sense to Java.</p>',
      key: 'Right side first, then store into the left.'
    },
    {
      type: 'watch', title: 'Overwrite: the old value is gone',
      code: `int x = 4;
x = 9;
x = x * 2;
x = x - 5;
System.out.println(x);`,
      gates: [
        { line: 2, ask: 'var:x' },
        { line: 3, ask: 'var:x' },
        { line: 4, ask: 'var:x' }
      ],
      after: '<p>The box never remembers 4 once 9 is stored. A box has <strong>no history</strong> — only its current value.</p>'
    },
    {
      type: 'watch', title: 'Copying is not linking',
      intro: '<p><code>b = a;</code> puts a <strong>copy</strong> of a’s value into b. Watch what happens to b when a changes later.</p>',
      code: `int a = 10;
int b;
b = a;
a = 25;
System.out.println(a);
System.out.println(b);`,
      gates: [{ line: 6, ask: 'output', q: 'a is now 25. What will line 6 print for b?' }],
      after: '<p>b still holds 10. After the copy, the two boxes are completely separate. This idea is why number programs keep a <em>copy</em> of n (Stage 8).</p>'
    },
    {
      type: 'predict', title: 'Your turn',
      q: '<p>What is printed?</p>',
      code: `int p = 3;
int q = p + 4;
p = q * 2;
q = p - q;
System.out.println(p + " " + q);`,
      ask: 'output',
      explain: 'p=3, q=7, then p=14, then q = 14 − 7 = 7. Always use the value in the box <em>at that moment</em>.'
    },
    {
      type: 'explore', title: 'The swap puzzle',
      intro: '<p>Goal: swap the values so <code>a</code> ends with 8 and <code>b</code> with 5. Step through this attempt — <strong>why does it fail?</strong></p>',
      tryThis: ['Watch the boxes after line 3. Where did the 5 go?', 'Edit the code and fix it. (Hint: you need a third box.)'],
      code: `int a = 5;
int b = 8;
a = b;
b = a;
System.out.println(a + " " + b);`
    },
    {
      type: 'watch', title: 'Swap with a spare box',
      code: `int a = 5;
int b = 8;
int t;
t = a;
a = b;
b = t;
System.out.println(a + " " + b);`,
      gates: [{ line: 5, ask: 'var:a' }, { line: 6, ask: 'var:b' }],
      after: '<p><code>t</code> saves a’s value before it is overwritten. Think of swapping the drinks in two glasses — you need an empty third glass.</p>'
    },
    {
      type: 'reorder', title: 'Put the swap in order',
      q: '<p>Arrange the lines so that x and y are swapped and the program prints <code>2 7</code>.</p>',
      lines: [
        'int x = 7;',
        'int y = 2;',
        'int temp = x;',
        'x = y;',
        'y = temp;',
        'System.out.println(x + " " + y);'
      ]
    },
    {
      type: 'learn', title: 'Printing a label with a value',
      body: '<p>To print text and a box’s value together, join them with <code>+</code>:</p>' +
        '<p><code>System.out.println("Marks = " + marks);</code> prints <code>Marks = 80</code></p>' +
        '<p>The text in quotes is printed as it is; <code>marks</code> without quotes is replaced by the value in the box.</p>' +
        '<p>Careful: <code>"marks"</code> (in quotes) prints the word <em>marks</em>, not the value.</p>'
    },
    {
      type: 'mcq', q: 'What is printed?',
      code: `int age = 15;
System.out.println("age is " + age);`,
      options: ['age is age', 'age is 15', '"age is" 15', '15 is 15'], answer: 'output'
    },
    {
      type: 'learn', title: 'Getting a value from the keyboard',
      body: '<p>In school programs, values usually come from the user. Java uses a <strong>Scanner</strong> for this:</p>' +
        '<ol><li><code>import java.util.*;</code> at the very top of the program (Scanner lives there).</li>' +
        '<li><code>Scanner sc = new Scanner(System.in);</code> — make a scanner called <code>sc</code> that reads the keyboard.</li>' +
        '<li>Print a message so the user knows what to type.</li>' +
        '<li><code>n = sc.nextInt();</code> — wait for a whole number and store it in n.</li></ol>' +
        '<p>Other readers: <code>sc.nextDouble()</code> for decimals, <code>sc.next()</code> for one word, <code>sc.nextLine()</code> for a whole line.</p>',
      key: 'The program does not know the value in advance. It arrives from the keyboard into the box when <code>nextInt()</code> runs.'
    },
    {
      type: 'watch', title: 'Watch input arrive',
      intro: '<p>The <strong>Input</strong> strip shows what the user will type. Watch the value move from the input into the box. You can change the input and run again.</p>',
      code: `Scanner sc = new Scanner(System.in);
System.out.println("Enter two numbers");
int a = sc.nextInt();
int b = sc.nextInt();
int sum = a + b;
System.out.println("Sum = " + sum);`,
      input: '12 30',
      gates: [{ line: 4, ask: 'var:b' }, { line: 6, ask: 'output' }]
    },
    {
      type: 'bug', title: 'Find the mistake',
      code: `int length = 6;
int width = 4;
area = length * width;
System.out.println(area);`,
      explain: '<code>area</code> was never declared. Java only knows the boxes you have made. Fix: <code>int area = length * width;</code>',
      fixed: `int length = 6;
int width = 4;
int area = length * width;
System.out.println(area);`
    },
    {
      type: 'quiz', title: 'Mastery check',
      items: [
        {
          type: 'predict', q: '<p>What is printed?</p>',
          code: `int m = 6;
int n = m;
m = m + 4;
System.out.println(m + " " + n);`,
          ask: 'output'
        },
        {
          type: 'mcq', q: 'What does <code>count = count + 1;</code> do?',
          options: ['It is wrong — count cannot equal count + 1', 'It adds 1 to the value in count and stores the result back in count', 'It makes a new box called count + 1', 'It compares count with count + 1'], answer: 1
        },
        {
          type: 'predict', q: '<p>What is in <code>y</code> at the end?</p>',
          code: `int x = 2;
int y = 3;
x = x + y;
y = x - y;
x = x - y;`,
          ask: 'var:y',
          explain: 'A famous trick: this swaps x and y without a third box. x=5, y=5−3=2, x=5−2=3.'
        },
        {
          type: 'bug', q: '<p>Click the line Java will reject.</p>',
          code: `int a = 4;
int b = 7;
int a = a + b;
System.out.println(a);`,
          explain: 'a is already declared on line 1. You cannot make a second box with the same name. Write <code>a = a + b;</code> (no int).'
        },
        {
          type: 'mcq', q: 'Which statement reads a whole number typed by the user into n?',
          options: ['n = sc.nextInt();', 'n = sc.next();', 'sc.nextInt(n);', 'n = Scanner.nextInt();'], answer: 0
        }
      ]
    },
    {
      type: 'paper', title: 'Paper practice: swap two numbers',
      minutes: 8,
      q: '<p>Write Java statements that read two integers into <code>a</code> and <code>b</code>, swap their values using a third variable, and print both values after the swap.</p><p>Sample input <code>5 9</code> → output:</p><pre>a = 9\nb = 5</pre>',
      input: '5 9',
      hints: [
        'Start with the Scanner line and a message.',
        'Swap = three moves: save a in t, copy b into a, copy t into b.'
      ],
      structure: `Scanner sc = new Scanner(System.in);
// message, then read a and b
// t = ...;  a = ...;  b = ...;
// print a and b with labels`,
      solution: `Scanner sc = new Scanner(System.in);
System.out.println("Enter two numbers");
int a = sc.nextInt();
int b = sc.nextInt();
int t = a;
a = b;
b = t;
System.out.println("a = " + a);
System.out.println("b = " + b);`,
      checklist: [
        '<code>Scanner sc = new Scanner(System.in);</code> spelled correctly (capital S twice)',
        'A message is printed before reading',
        'Each variable is declared once with <code>int</code>',
        'The swap uses a third variable in the right order',
        'Labels are in quotes, values are not'
      ]
    }
  ]
});
