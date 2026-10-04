/* Stage 8 — The digit machine: n % 10, n / 10, count / sum / reverse / palindrome / Armstrong. */
JP.content.add({
  id: 's8', n: 8, minutes: 35,
  title: 'The digit machine',
  subtitle: 'Peel off the last digit, use it, drop it — repeat until nothing is left',
  recap: [
    '<code>n % 10</code> gives the <strong>last digit</strong>. <code>n / 10</code> <strong>drops</strong> the last digit (int division).',
    'The digit loop: <code>while (n &gt; 0) { d = n % 10; …use d…; n = n / 10; }</code>',
    'The loop destroys n (it ends at 0). <strong>Keep a copy</strong> before the loop if you need the original later.',
    'Count: <code>c++</code>. Sum: <code>s = s + d</code>. Reverse: <code>rev = rev * 10 + d</code>.',
    'Palindrome: reverse equals the original copy. Armstrong (3 digits): sum of cubes of digits equals the original copy.'
  ],
  cards: [
    {
      type: 'learn', title: 'Two tools: % 10 and / 10',
      body: '<p>Take <code>n = 472</code>.</p>' +
        '<table><tr><td><code>n % 10</code></td><td>remainder when divided by 10</td><td><strong>2</strong> — the last digit</td></tr>' +
        '<tr><td><code>n / 10</code></td><td>int division by 10</td><td><strong>47</strong> — the last digit is dropped</td></tr></table>' +
        '<p>Repeat on 47: last digit 7, drop → 4. Repeat on 4: last digit 4, drop → 0. When n is 0 there are no digits left.</p>',
      key: 'Digits come out from the RIGHT: 2, then 7, then 4.'
    },
    {
      type: 'digits', title: 'The digit machine: sum of digits',
      intro: '<p>Press <strong>Next</strong> to see each step. The last tile is peeled off with <code>% 10</code>, added to the sum, then dropped with <code>/ 10</code>. Try your own number too.</p>',
      n: 472, mode: 'sum'
    },
    {
      type: 'watch', title: 'The same thing in Java',
      code: `int n = 472, s = 0, d;
while (n > 0)
{
    d = n % 10;
    s = s + d;
    n = n / 10;
}
System.out.println("Sum of digits = " + s);`,
      trace: { cols: ['n', 'd', 's'], at: 'loop' },
      gates: [{ line: 4, n: 2, ask: 'var:d' }, { line: 6, n: 2, ask: 'var:n' }, { line: 2, n: 4, ask: 'cond' }]
    },
    {
      type: 'digits', title: 'Reversing a number',
      intro: '<p>To build the reverse, shift the answer one place left (×10) and add the new digit on the right: <code>rev = rev * 10 + d</code>.</p>',
      n: 1234, mode: 'reverse'
    },
    {
      type: 'learn', title: 'Keep a copy of n',
      body: '<p>After the digit loop, <code>n</code> is <strong>0</strong>. The original number is gone!</p>' +
        '<p>Palindrome and Armstrong checks must compare the result with the <em>original</em> number. So save it before the loop:</p>' +
        '<pre>int copy = n;   // a separate box (remember Stage 2: copying is not linking)</pre>' +
        '<p>Then compare with <code>copy</code> at the end, never with <code>n</code>.</p>'
    },
    {
      type: 'watch', title: 'Palindrome number — a full program',
      intro: '<p>A palindrome reads the same both ways (121, 1331). Try inputs 1221 and 123.</p>',
      code: `import java.util.*;
class Palindrome
{
    void main()
    {
        /** Scanner object to read input */
        Scanner sc = new Scanner(System.in);
        System.out.println("Enter a number");
        /** n - the number, destroyed by the loop */
        int n = sc.nextInt();
        /** copy - original value of n */
        int copy = n;
        /** rev - reverse of the number */
        int rev = 0;
        /** d - one digit */
        int d;
        while (n > 0)
        {
            d = n % 10;
            rev = rev * 10 + d;
            n = n / 10;
        }
        if (rev == copy)
            System.out.println(copy + " is a palindrome");
        else
            System.out.println(copy + " is not a palindrome");
    }
}`,
      input: '1221',
      trace: { cols: ['n', 'd', 'rev'], at: 'loop' },
      gates: [{ line: 20, n: 2, ask: 'var:rev' }, { line: 23, ask: 'cond' }]
    },
    {
      type: 'trace', title: 'Trace the reverse',
      q: '<p>Complete the trace table for n = 5038. The first row is done for you.</p>',
      code: `int n = 5038, rev = 0, d;
while (n > 0)
{
    d = n % 10;
    rev = rev * 10 + d;
    n = n / 10;
}
System.out.println(rev);`,
      trace: { cols: ['n', 'd', 'rev'], at: 'loop' },
      given: [[1, 1, 1]],
      askPasses: true, askOutput: true,
      explain: 'Digits come out 8, 3, 0, 5 → rev = 8, 83, 830, 8305. A 4-digit number means 4 passes.'
    },
    {
      type: 'predict', title: 'Counting digits',
      q: '<p>What is printed?</p>',
      code: `int n = 40705, c = 0, z = 0;
while (n > 0)
{
    if (n % 10 == 0)
        z++;
    c++;
    n = n / 10;
}
System.out.println(c + " digits, " + z + " zeros");`,
      ask: 'output'
    },
    {
      type: 'digits', title: 'Sum of cubes (Armstrong)',
      intro: '<p>153 is an Armstrong number: 1³ + 5³ + 3³ = 1 + 125 + 27 = 153.</p>',
      n: 153, mode: 'cube'
    },
    {
      type: 'fill', title: 'Complete the Armstrong check',
      q: '<p>Fill in the blanks so the program checks whether a 3-digit number is an Armstrong number.</p>',
      code: `int n = 153, copy = n, sum = 0, d;
while (n > 0)
{
    d = [[n % 10|n%10]];
    sum = sum + [[d * d * d|d*d*d|(int)Math.pow(d, 3)|(int)Math.pow(d,3)]];
    n = [[n / 10|n/10]];
}
if (sum == [[copy]])
    System.out.println("Armstrong");
else
    System.out.println("Not Armstrong");`,
      explain: '<p>If you use Math.pow, remember it returns a double — so <code>sum + Math.pow(d, 3)</code> cannot go into the int box without <code>(int)</code>. <code>d * d * d</code> is simpler.</p>'
    },
    {
      type: 'bug', title: 'Why is 121 “not a palindrome”?',
      q: '<p>121 is a palindrome, but this prints “Not palindrome”. Click the faulty line.</p>',
      code: `int n = 121, rev = 0, d;
while (n > 0)
{
    d = n % 10;
    rev = rev * 10 + d;
    n = n / 10;
}
if (rev == n)
    System.out.println("Palindrome");
else
    System.out.println("Not palindrome");`,
      line: 8,
      explain: 'After the loop n is 0, so <code>rev == n</code> compares 121 with 0. Keep a copy of n before the loop and compare <code>rev == copy</code>.',
      fixed: `int n = 121, copy = n, rev = 0, d;
while (n > 0)
{
    d = n % 10;
    rev = rev * 10 + d;
    n = n / 10;
}
if (rev == copy)
    System.out.println("Palindrome");
else
    System.out.println("Not palindrome");`
    },
    {
      type: 'quiz', title: 'Mastery check',
      items: [
        {
          type: 'mcq', q: 'n is 6083. What are <code>n % 10</code> and <code>n / 10</code>?',
          code: `int n = 6083;
System.out.println(n % 10 + " " + n / 10);`,
          options: ['3 608', '608 3', '3 608.3', '6 083'], answer: 'output'
        },
        {
          type: 'predict', q: '<p>What is printed?</p>',
          code: `int n = 2457, p = 1;
while (n > 0)
{
    p = p * (n % 10);
    n = n / 10;
}
System.out.println(p);`,
          ask: 'output',
          explain: 'Product of the digits: 7 × 5 × 4 × 2 = 280.'
        },
        {
          type: 'predict', q: '<p>What is printed?</p>',
          code: `int n = 9372, big = 0;
while (n > 0)
{
    int d = n % 10;
    if (d > big)
        big = d;
    n /= 10;
}
System.out.println(big);`,
          ask: 'output'
        },
        {
          type: 'predict', q: '<p>How many times does the loop body run? (What is in c at the end?)</p>',
          code: `int n = 100000, c = 0;
while (n > 0)
{
    c++;
    n = n / 10;
}`,
          ask: 'var:c'
        },
        {
          type: 'mcq', q: 'Why do we store <code>copy = n</code> before a digit loop?',
          options: ['To make the loop faster', 'Because n becomes 0 by the end of the loop', 'Because % only works on copies', 'Java requires two variables in a while loop'], answer: 1
        }
      ]
    },
    {
      type: 'paper', title: 'Paper practice: sum and reverse',
      minutes: 15,
      q: '<p>Write a <strong>complete program</strong> to input a number and print the sum of its digits and its reverse. Also print whether it is a palindrome.</p><p>Sample input <code>4334</code> → output:</p><pre>Sum of digits = 14\nReverse = 4334\nPalindrome</pre>',
      input: '4334',
      hints: [
        'One loop can do both: add d to sum AND build rev.',
        'Keep a copy of n for the palindrome check.'
      ],
      structure: `import java.util.*;
class DigitWork
{
    void main()
    {
        // Scanner, message, read n
        // copy = n, sum = 0, rev = 0
        // while (n > 0) { d = ...; sum = ...; rev = ...; n = ...; }
        // print sum, rev
        // if (rev == copy) ... else ...
    }
}`,
      solution: `import java.util.*;
class DigitWork
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
        /** rev - reverse of the number */
        int rev = 0;
        /** d - one digit */
        int d;
        while (n > 0)
        {
            d = n % 10;
            sum = sum + d;
            rev = rev * 10 + d;
            n = n / 10;
        }
        System.out.println("Sum of digits = " + sum);
        System.out.println("Reverse = " + rev);
        if (rev == copy)
            System.out.println("Palindrome");
        else
            System.out.println("Not a palindrome");
    }
}`,
      trace: { cols: ['n', 'd', 'sum', 'rev'], at: 'loop' },
      checklist: [
        'A copy of n is made <strong>before</strong> the loop',
        'sum and rev start at 0',
        '<code>d = n % 10</code> first, <code>n = n / 10</code> last inside the loop',
        'The palindrome check compares with the copy, not n',
        'Every variable has a <code>/** */</code> comment'
      ]
    }
  ]
});
