/* Stage 1 — One step at a time: sequence, output, print vs println. */
JP.content.add({
  id: 's1', n: 1, minutes: 25,
  title: 'One step at a time',
  subtitle: 'Java runs one instruction, then the next — and prints to a screen with a cursor',
  recap: [
    'Java runs statements <strong>one at a time, top to bottom</strong>.',
    '<code>println</code> prints and then moves the cursor to a new line; <code>print</code> leaves the cursor where it is.',
    'Text in double quotes is printed exactly as written. Without quotes, Java calculates.',
    'Every statement ends with a semicolon <code>;</code>.'
  ],
  cards: [
    {
      type: 'learn', title: 'You are the computer',
      body: '<p>In the exam there is no computer to run your program. <strong>You</strong> have to be the computer: read each line and do exactly what it says.</p>' +
        '<p>A program is a list of instructions called <em>statements</em>. Java does <strong>one statement at a time</strong>, starting at the top and going down — like following a recipe, one step after another.</p>' +
        '<p>In these first stages the program sits inside a grey frame (<code>class … void main()</code>). Every Java program needs that frame. Ignore it for now — we will look at it in Stage 7.</p>',
      key: 'Java never skips ahead and never does two lines at once. One line, then the next.'
    },
    {
      type: 'watch', title: 'Watch Java run three lines',
      intro: '<p>Press <strong>Next step</strong>. The <span style="background:#fff2b3">yellow</span> line has just run. The blue arrow ➜ shows the line that runs next. Watch the Output screen.</p>',
      code: `System.out.println("Good morning");
System.out.println("Class 10B");
System.out.println("Let us learn Java");`,
      gates: [{ line: 1, ask: 'next', q: 'Line 1 has run. Which line will Java run next? Click it.' }]
    },
    {
      type: 'learn', title: 'print and println — the cursor',
      body: '<p>The output screen has an invisible <strong>cursor</strong> (shown as a blue block). Printing always starts at the cursor.</p>' +
        '<table><tr><th>Statement</th><th>What it does</th></tr>' +
        '<tr><td><code>System.out.print("Hi");</code></td><td>prints <code>Hi</code> — the cursor <strong>stays on the same line</strong>, right after it</td></tr>' +
        '<tr><td><code>System.out.println("Hi");</code></td><td>prints <code>Hi</code> and then <strong>moves the cursor to the next line</strong></td></tr>' +
        '<tr><td><code>System.out.println();</code></td><td>prints nothing, just moves to the next line</td></tr></table>',
      key: '<code>println</code> = print + new line (<em>ln</em> stands for line).'
    },
    {
      type: 'watch', title: 'Where does the cursor go?',
      intro: '<p>Watch the blue cursor on the Output screen after each step.</p>',
      code: `System.out.print("Hello ");
System.out.print("there");
System.out.println("!");
System.out.println("Bye");`,
      gates: [
        { line: 2, ask: 'output', q: 'Line 2 is about to run. What will it print? (Only what line 2 adds.)' },
        { line: 4, ask: 'output', q: 'Line 4 is about to run. The cursor is at the start of a new line. What will line 4 print?' }
      ],
      after: '<p>Notice: "Hello " and "there" are on the <strong>same</strong> line because <code>print</code> did not move the cursor. The space inside <code>"Hello "</code> is printed too.</p>'
    },
    {
      type: 'predict', title: 'Your turn: predict the screen',
      q: '<p>Trace it line by line. Keep track of where the cursor is.</p>',
      code: `System.out.print("A");
System.out.print("B");
System.out.println("C");
System.out.print("D");
System.out.println();
System.out.println("E");`,
      ask: 'output',
      explain: 'A, B and C share a line because only <code>print</code> was used before C. <code>println()</code> on line 5 prints nothing but ends the line after D.'
    },
    {
      type: 'learn', title: 'Text or calculation?',
      body: '<p>Anything inside <strong>double quotes</strong> <code>"…"</code> is <em>text</em> (a String). Java prints it exactly, letter by letter.</p>' +
        '<p>Without quotes, Java treats it as a <em>calculation</em> and prints the answer.</p>' +
        '<table><tr><td><code>System.out.println("2+3");</code></td><td>prints <code>2+3</code></td></tr>' +
        '<tr><td><code>System.out.println(2+3);</code></td><td>prints <code>5</code></td></tr></table>'
    },
    {
      type: 'watch', title: 'Quotes change everything',
      code: `System.out.println(2 + 3);
System.out.println("2 + 3");
System.out.println(10 - 4);
System.out.println("10 - 4");`,
      gates: [
        { line: 1, ask: 'output' },
        { line: 4, ask: 'output' }
      ]
    },
    {
      type: 'mcq', q: 'What is printed by this statement?',
      code: 'System.out.println("5*4");',
      options: ['20', '5*4', '"5*4"', 'Error'], answer: 'output',
      explain: 'The quotes make it text, so Java prints the characters 5, * and 4. The quotes themselves are never printed.'
    },
    {
      type: 'mcq', q: 'Which statement prints the text and then moves the cursor to the next line?',
      options: ['System.out.print("Hi");', 'System.out.println("Hi");', 'System.out.next("Hi");', 'print("Hi");'], answer: 1,
      explain: '<code>println</code> = print + new line.'
    },
    {
      type: 'reorder', title: 'Build the output',
      q: '<p>Click the lines in the right order so the screen shows exactly:</p><pre class="console-out">Roll no: 12\nName: Prasasta\nClass: 10B</pre>',
      lines: [
        'System.out.println("Roll no: 12");',
        'System.out.print("Name: ");',
        'System.out.println("Prasasta");',
        'System.out.println("Class: 10B");'
      ],
      explain: '"Name: " uses <code>print</code>, so "Prasasta" continues on the same line.'
    },
    {
      type: 'bug', title: 'Find the mistake',
      code: `System.out.println("Hello")
System.out.println("World");`,
      explain: 'Every statement must end with a semicolon <code>;</code>. Line 1 is missing it. (Java reports it at the end of line 1.)',
      fixed: `System.out.println("Hello");
System.out.println("World");`
    },
    {
      type: 'quiz', title: 'Mastery check', intro: '<p>Five quick questions. Answer them like in the exam — think first, then answer.</p>',
      items: [
        {
          type: 'predict', q: '<p>Write the output.</p>',
          code: `System.out.print("Java ");
System.out.println("is");
System.out.println("fun");`,
          ask: 'output'
        },
        {
          type: 'mcq', q: 'What does this print?', code: 'System.out.println("7" + "3");',
          options: ['10', '73', '7+3', '"73"'], answer: 'output',
          explain: 'Both are text, so + joins them: "7" then "3". (More about this in Stage 4.)'
        },
        {
          type: 'bug', q: '<p>One line will not compile. Click it.</p>',
          code: `System.out.println("Start");
System.out.printn("Middle");
System.out.println("End");`,
          explain: 'The method is <code>println</code> — spelled exactly. Java does not guess what you meant.'
        },
        {
          type: 'predict', q: '<p>Write the output. Be careful with spaces.</p>',
          code: `System.out.print(4 + 5);
System.out.print(" ");
System.out.println("4 + 5");`,
          ask: 'output'
        },
        {
          type: 'mcq', q: 'In what order does Java run the statements inside main()?',
          options: ['All at the same time', 'From the top, one statement at a time', 'From the bottom up', 'In any order it likes'], answer: 1
        }
      ]
    },
    {
      type: 'paper', title: 'Paper practice: print a name card',
      minutes: 5,
      q: '<p>Write Java statements that print exactly:</p><pre>Name: Prasasta Garla\nSchool: Clarence Public School\n*** Class 10 ***</pre><p>Use <code>print</code> for "Name: " and "School: " and <code>println</code> for the rest.</p>',
      hints: ['Three lines on screen — so you need three <code>println</code>s in total, and two <code>print</code>s before them.', 'Remember the space after the colon: <code>"Name: "</code>.'],
      solution: `System.out.print("Name: ");
System.out.println("Prasasta Garla");
System.out.print("School: ");
System.out.println("Clarence Public School");
System.out.println("*** Class 10 ***");`,
      checklist: [
        '<code>System</code> starts with a capital S',
        'Every text is inside straight double quotes <code>"…"</code>',
        'Every statement ends with <code>;</code>',
        '<code>print</code> where the next text continues on the same line, <code>println</code> where the line ends'
      ]
    }
  ]
});
