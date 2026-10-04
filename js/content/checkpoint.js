/* Foundations checkpoint — Section-A-style mixed questions + two Section-B-style programs on paper. */
JP.content.add({
  id: 'ck', n: 99, minutes: 30,
  title: 'Foundations checkpoint',
  subtitle: 'Exam-style mixed questions, then two programs in your notebook',
  recap: [
    'Look at Insights to see which questions needed more than one try — revisit those stages.',
    'For every output question: trace on paper first, line by line, with the boxes written down.',
    'For every program: skeleton first (import, class, main, Scanner), then the logic, then the variable comments.'
  ],
  cards: [
    {
      type: 'learn', title: 'Exam conditions',
      body: '<p>This checkpoint is like Section A of your paper. Keep your notebook open and <strong>work each question on paper before answering</strong> — no guessing.</p>' +
        '<p>Part 1: quick multiple-choice questions (like Q1). Part 2: outputs and evaluations (like Q2). Part 3: two programs written in your notebook (like Section B).</p>'
    },
    {
      type: 'quiz', title: 'Part 1 — Choose the correct option',
      items: [
        {
          type: 'mcq', q: 'What is the value of <code>Math.ceil(-4.6)</code>?',
          code: 'System.out.println(Math.ceil(-4.6));',
          options: ['-5.0', '-4.0', '-4', '-5'], answer: 'output'
        },
        {
          type: 'mcq', q: 'Which of these is a valid char literal?',
          options: ['"A"', '\'AB\'', '\'7\'', 'A'], answer: 2
        },
        {
          type: 'mcq', q: 'What is printed?',
          code: 'System.out.println(15 / 4 + 15 % 4);',
          options: ['6', '3.75', '7', '6.75'], answer: 'output'
        },
        {
          type: 'mcq', q: 'The output of <code>System.out.println("A" + 1 + 2);</code> is:',
          code: 'System.out.println("A" + 1 + 2);',
          options: ['A3', 'A12', '68', 'A 1 2'], answer: 'output'
        },
        {
          type: 'mcq', q: 'Which loop always executes its body at least once?',
          options: ['for', 'while', 'do-while', 'none of these'], answer: 2
        },
        {
          type: 'mcq', q: 'Converting a double to an int using <code>(int)</code> is an example of:',
          options: ['implicit type conversion', 'explicit type conversion', 'concatenation', 'fall-through'], answer: 1
        },
        {
          type: 'mcq', q: 'What is printed?',
          code: 'System.out.println(Math.round(2.5) + Math.abs(-3));',
          options: ['6', '5', '6.0', '5.0'], answer: 'output'
        },
        {
          type: 'mcq', q: 'If a <code>break</code> is missing in a switch case, the following happens:',
          options: ['compile error', 'fall-through to the next case', 'the switch restarts', 'default always runs first'], answer: 1
        }
      ]
    },
    {
      type: 'quiz', title: 'Part 2 — Outputs and evaluation',
      items: [
        {
          type: 'reduce', expr: 'a -= a++ - --b + a * b', vars: { a: { t: 'int', v: 5 }, b: { t: 'int', v: 3 } },
          q: 'a = 5, b = 3. Find the final value of a.'
        },
        {
          type: 'predict', q: '<p>Give the output.</p>',
          code: `char ch = 'G';
ch -= 2;
System.out.println(ch);
System.out.println(ch + 2);
System.out.println((char)(ch + 32));`,
          ask: 'output'
        },
        {
          type: 'predict', q: '<p>Give the output. How many times does the loop run?</p>',
          code: `int x = 3, y = 0;
while (x <= 20)
{
    y = y + x;
    x = x * 2;
}
System.out.println(x + " " + y);`,
          ask: 'output'
        },
        {
          type: 'predict', q: '<p>Give the output.</p>',
          code: `int n = 4;
switch (n % 3)
{
    case 0: System.out.println("zero");
    case 1: System.out.println("one");
    case 2: System.out.println("two");
            break;
    default: System.out.println("none");
}`,
          ask: 'output'
        },
        {
          type: 'mcq', q: 'Which is the correct Java expression for  z = (x³ + y) ÷ 2xy ?',
          options: ['z = x*x*x + y / 2*x*y;', 'z = (Math.pow(x, 3) + y) / (2 * x * y);', 'z = Math.pow(x, 3) + y / (2 * x * y);', 'z = (x^3 + y) / (2xy);'], answer: 1
        },
        {
          type: 'predict', q: '<p>Give the output.</p>',
          code: `for (int i = 1; i <= 4; i++)
{
    if (i == 3)
        continue;
    for (int j = 1; j <= i; j++)
        System.out.print(i);
    System.out.println();
}`,
          ask: 'output'
        }
      ]
    },
    {
      type: 'paper', title: 'Part 3a — Niven number',
      minutes: 15,
      q: '<p>A <strong>Niven</strong> (Harshad) number is divisible by the sum of its digits. Example: 126 → 1 + 2 + 6 = 9, and 126 % 9 == 0, so 126 is a Niven number.</p>' +
        '<p>Write a complete program to input a number and print whether it is a Niven number.</p><p>Sample input <code>126</code> → <code>126 is a Niven number</code></p>',
      input: '126',
      hints: [
        'Digit loop to find the sum of digits.',
        'n is destroyed by the loop — keep a copy and test <code>copy % sum == 0</code>.'
      ],
      structure: `import java.util.*;
class Niven
{
    void main()
    {
        // read n, copy = n, sum = 0
        // digit loop: sum of digits
        // if (copy % sum == 0) ... else ...
    }
}`,
      solution: `import java.util.*;
class Niven
{
    void main()
    {
        /** Scanner object to read input */
        Scanner sc = new Scanner(System.in);
        System.out.println("Enter a number");
        /** n - the number */
        int n = sc.nextInt();
        /** copy - original value of n */
        int copy = n;
        /** sum - sum of digits */
        int sum = 0;
        while (n > 0)
        {
            sum = sum + n % 10;
            n = n / 10;
        }
        if (copy % sum == 0)
            System.out.println(copy + " is a Niven number");
        else
            System.out.println(copy + " is not a Niven number");
    }
}`,
      trace: { cols: ['n', 'sum'], at: 'loop' },
      checklist: [
        'Complete skeleton: import, class, void main(), Scanner',
        'Copy of n kept before the loop',
        'Digit loop with <code>% 10</code> and <code>/ 10</code>',
        'Divisibility tested with <code>% ... == 0</code> on the copy',
        'Variable comments for every variable'
      ]
    },
    {
      type: 'paper', title: 'Part 3b — Parking charges',
      minutes: 15,
      q: '<p>A parking lot charges by hours parked:</p>' +
        '<table class="data" style="max-width:26em"><tr><th>Hours</th><th>Charge</th></tr><tr><td>up to 2</td><td>₹20 per hour</td></tr><tr><td>next 3 hours (3 to 5)</td><td>₹15 per hour</td></tr><tr><td>above 5</td><td>₹10 per hour</td></tr></table>' +
        '<p>Write a complete program to input the hours (a whole number) and print the total charge. Sample input <code>7</code> → <code>Charge = 105</code> (2×20 + 3×15 + 2×10).</p>',
      input: '7',
      hints: [
        'An else-if ladder on hours: <code>h &lt;= 2</code>, <code>h &lt;= 5</code>, otherwise.',
        'For h &lt;= 5: 40 + (h − 2) × 15. Above 5: 40 + 45 + (h − 5) × 10.'
      ],
      structure: `import java.util.*;
class Parking
{
    void main()
    {
        // read h
        // if (h <= 2) ... else if (h <= 5) ... else ...
        // print charge
    }
}`,
      solution: `import java.util.*;
class Parking
{
    void main()
    {
        /** Scanner object to read input */
        Scanner sc = new Scanner(System.in);
        System.out.println("Enter hours parked");
        /** h - hours parked */
        int h = sc.nextInt();
        /** c - parking charge */
        int c;
        if (h <= 2)
            c = h * 20;
        else if (h <= 5)
            c = 40 + (h - 2) * 15;
        else
            c = 40 + 45 + (h - 5) * 10;
        System.out.println("Charge = " + c);
    }
}`,
      checklist: [
        'Slab conditions in increasing order, ending with a plain else',
        'Earlier slabs added in full for later slabs (40, then 40 + 45)',
        'No <code>;</code> after <code>if (...)</code>',
        'Output has a label',
        'Variable comments for every variable'
      ]
    }
  ]
});
