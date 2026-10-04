/* Exam-focused methods: school Chapter 3. */
(function () {
var JP = globalThis.JP;
JP.content.add({
  "id": "s9",
  "n": 9,
  "milestone": "M2",
  "minutes": 40,
  "title": "Methods: machines you write",
  "subtitle": "Call, copy inputs, return, continue · Q1/Q2 and Q3/Q4/Q7 foundations",
  "recap": [
    "A call executes a method; a definition alone does not.",
    "Actual arguments supply values to formal parameters. Primitive values are copied.",
    "Return sends a value back; void returns no value.",
    "Recognize header, signature, body, access and static; write the method and call on paper."
  ],
  "cards": [
    {
      "type": "explore",
      "title": "Write a task once, call it again",
      "intro": "<p>Start, then step through product. It runs only when main calls it. Change 4 and 5 in the call; predict before running.</p>",
      "code": "class Calculator\n{\n    /** x and y receive the two numbers */\n    public int product(int x, int y)\n    {\n        /** p stores their product */\n        int p=x*y;\n        return p;\n    }\n\n    static void main()\n    {\n        /** c refers to a Calculator object */\n        Calculator c=new Calculator();\n        /** result stores the returned value */\n        int result=c.product(4,5);\n        System.out.println(\"Product = \"+result);\n        System.out.println(\"Back in main\");\n    }\n}",
      "tryThis": [
        "Add System.out.println(c.product(2,3)); after the first output. Which method runs again?"
      ]
    },
    {
      "type": "learn",
      "title": "A method performs one task",
      "body": "<p>A method is a group of statements that performs a specific task. Library methods are already provided; user-defined methods contain logic you write.</p><p>Define once, call many times. Smaller tasks are easier to check and maintain.</p>",
      "key": "Defining a method does not execute it. A call executes it."
    },
    {
      "type": "learn",
      "title": "Read the header, then the body",
      "body": "<p><code>public int product(int x, int y)</code> is the <strong>header / prototype</strong> in the school vocabulary.</p><p><code>public</code>: access specifier. <code>int</code>: return type. <code>product</code>: name. <code>int x, int y</code>: parameter list.</p><p>The statements inside the braces form the <strong>body</strong>. The <strong>signature</strong> uses the name and parameter types in order: <code>product(int, int)</code>. It excludes the return type and parameter names.</p>",
      "key": "Header describes the task; body performs it; signature identifies its parameter version."
    },
    {
      "type": "learn",
      "title": "Arguments become parameter values",
      "body": "<p>In <code>c.product(4,5)</code>, 4 and 5 are <strong>actual parameters / arguments</strong>.</p><p>In <code>product(int x, int y)</code>, x and y are <strong>formal parameters</strong>. The call copies 4 into x and 5 into y, in order.</p><p>Write types in the definition. Write values or expressions in the call.</p>",
      "key": "Definition: int x, int y. Call: 4, 5."
    },
    {
      "type": "watch",
      "title": "Call → calculate → return → continue",
      "intro": "<p>Follow the execution marker into product. Its own boxes appear. return sends one value back to the waiting expression in main.</p>",
      "code": "class Calculator\n{\n    /** x and y receive the two numbers */\n    public int product(int x, int y)\n    {\n        /** p stores their product */\n        int p=x*y;\n        return p;\n    }\n\n    static void main()\n    {\n        /** c refers to a Calculator object */\n        Calculator c=new Calculator();\n        /** result stores the returned value */\n        int result=c.product(4,5);\n        System.out.println(\"Product = \"+result);\n        System.out.println(\"Back in main\");\n    }\n}",
      "gates": [
        {
          "line": 7,
          "ask": "var:p",
          "q": "What will p hold inside product?"
        },
        {
          "line": 16,
          "ask": "var:result",
          "q": "What does main store when product returns?"
        },
        {
          "line": 17,
          "ask": "output",
          "q": "What is the first printed line?"
        }
      ],
      "after": "<p>The method frame disappears when the call finishes. main continues with the returned value.</p>"
    },
    {
      "type": "learn",
      "title": "Return is different from printing",
      "body": "<p><code>return p;</code> sends p back to the caller and ends that method call.</p><p><code>System.out.println(p);</code> displays p. Printing alone does not supply a return value.</p><p>A <code>void</code> method returns no value. An <code>int</code> method must return a compatible integer value on every path. Do not put executable statements after an unconditional return.</p>",
      "key": "Return supplies a value to the call. println supplies text to the output."
    },
    {
      "type": "learn",
      "title": "The four method kinds",
      "body": "<table><tr><th>Header</th><th>Inputs?</th><th>Returns a value?</th></tr><tr><td>void welcome()</td><td>No</td><td>No</td></tr><tr><td>void showSum(int x, int y)</td><td>Yes</td><td>No</td></tr><tr><td>int product(int x, int y)</td><td>Yes</td><td>Yes</td></tr><tr><td>int fixedValue()</td><td>No</td><td>Yes</td></tr></table><p>Empty parentheses mean no parameters. void means no returned value. These are two separate decisions.</p>",
      "key": "Check parentheses for inputs; check the return type for a returned value."
    },
    {
      "type": "predict",
      "title": "Use all four kinds",
      "q": "Write the four output lines. A returned value prints only because main passes it to println.",
      "code": "class Tasks\n{\n    void welcome()\n    {\n        System.out.println(\"Welcome\");\n    }\n    /** x and y receive the numbers to add */\n    void showSum(int x, int y)\n    {\n        System.out.println(\"Sum = \"+(x+y));\n    }\n    /** x and y receive the numbers to multiply */\n    int product(int x, int y)\n    {\n        return x*y;\n    }\n    int fixedValue()\n    {\n        return 10;\n    }\n    static void main()\n    {\n        /** t refers to a Tasks object */\n        Tasks t=new Tasks();\n        t.welcome();\n        t.showSum(2,3);\n        System.out.println(t.product(4,5));\n        System.out.println(t.fixedValue());\n    }\n}",
      "ask": "output"
    },
    {
      "type": "watch",
      "title": "Changing a parameter does not change the caller’s number",
      "intro": "<p>x and n are different primitive-variable boxes. Predict the inside value, then the value in main.</p>",
      "code": "class Change\n{\n    /** n receives a copy of the argument */\n    void change(int n)\n    {\n        n=n+5;\n        System.out.println(\"Inside = \"+n);\n    }\n\n    static void main()\n    {\n        /** c refers to a Change object */\n        Change c=new Change();\n        /** x stores the original number */\n        int x=3;\n        c.change(x);\n        System.out.println(\"After = \"+x);\n    }\n}",
      "gates": [
        {
          "line": 6,
          "ask": "var:n",
          "q": "What will n hold after adding 5?"
        },
        {
          "line": 17,
          "ask": "output",
          "q": "What prints after change returns?"
        }
      ],
      "after": "<p>The primitive value was copied. Changing n does not overwrite x. The school calls this call by value.</p>"
    },
    {
      "type": "learn",
      "title": "Who can access the method?",
      "body": "<p><strong>private:</strong> within its own class.<br><strong>No specifier (default access):</strong> within the same package.<br><strong>public:</strong> from anywhere.<br><strong>protected:</strong> in the same package and through inheritance outside the package.</p><p>Recognize these Section-A definitions. Our single-class programs do not need an inheritance example.</p>",
      "key": "Default access means writing no access-specifier keyword."
    },
    {
      "type": "watch",
      "title": "Static method or object method?",
      "intro": "<p>A static method belongs to the class and can be called without creating an object: Twice.twice(6). Within the same class, twice(6) also works.</p><p>An instance method such as product runs through an object: c.product(4,5). From static main, create that object first.</p>",
      "code": "class Twice\n{\n    /** n receives the number to double */\n    static int twice(int n)\n    {\n        return 2*n;\n    }\n    static void main()\n    {\n        System.out.println(Twice.twice(6));\n    }\n}",
      "gates": [
        {
          "line": 10,
          "ask": "output",
          "q": "Predict what this class-method call prints."
        }
      ],
      "after": "<p>static tells you how to call the method. int tells you what it returns. They describe different things.</p>"
    },
    {
      "type": "bug",
      "title": "Printing does not return the answer",
      "q": "Click the line that tries to return no value from an int method.",
      "code": "class Calculator\n{\n    /** x and y receive the two numbers */\n    public int product(int x, int y)\n    {\n        /** p stores their product */\n        int p=x*y;\n        return;\n    }\n\n    static void main()\n    {\n        /** c refers to a Calculator object */\n        Calculator c=new Calculator();\n        /** result stores the returned value */\n        int result=c.product(4,5);\n        System.out.println(\"Product = \"+result);\n        System.out.println(\"Back in main\");\n    }\n}",
      "fixed": "class Calculator\n{\n    /** x and y receive the two numbers */\n    public int product(int x, int y)\n    {\n        /** p stores their product */\n        int p=x*y;\n        return p;\n    }\n\n    static void main()\n    {\n        /** c refers to a Calculator object */\n        Calculator c=new Calculator();\n        /** result stores the returned value */\n        int result=c.product(4,5);\n        System.out.println(\"Product = \"+result);\n        System.out.println(\"Back in main\");\n    }\n}",
      "explain": "<p>product promises an int. Use return p; to supply the calculated value.</p>"
    },
    {
      "type": "fill",
      "title": "Finish the method and its call",
      "q": "Complete the return type, return statement and call. The arguments have no type declarations.",
      "code": "class Calculator\n{\n    /** x and y receive the two numbers */\n    public [[int]] product(int x, int y)\n    {\n        /** p stores their product */\n        int p=x*y;\n        [[return]] p;\n    }\n\n    static void main()\n    {\n        /** c refers to a Calculator object */\n        Calculator c=new Calculator();\n        /** result stores the returned value */\n        int result=c.[[product]](4,5);\n        System.out.println(\"Product = \"+result);\n        System.out.println(\"Back in main\");\n    }\n}",
      "explain": "<p>The header promises int; return fulfils it; the call provides the arguments.</p>"
    },
    {
      "type": "reorder",
      "title": "Build a method and call it",
      "q": "Put the class together. The helper is defined outside main; main calls it and prints the returned value.",
      "lines": [
        "class Twice",
        "{",
        "    /** n receives the number to double */",
        "    static int twice(int n)",
        "    {",
        "        return 2*n;",
        "    }",
        "    static void main()",
        "    {",
        "        System.out.println(Twice.twice(6));",
        "    }",
        "}"
      ],
      "explain": "<p>Both methods are inside the class. The call runs twice and brings its result back to println.</p>"
    },
    {
      "type": "quiz",
      "title": "Exam check: name it and trace it",
      "items": [
        {
          "type": "mcq",
          "q": "In c.product(4,5), which are the actual parameters?",
          "options": [
            "4 and 5",
            "int x and int y",
            "public and int"
          ],
          "answer": 0,
          "explain": "Actual parameters are supplied by the call."
        },
        {
          "type": "mcq",
          "q": "Which is the signature of public int product(int x, int y)?",
          "options": [
            "product(int, int)",
            "public int",
            "return p"
          ],
          "answer": 0,
          "explain": "Name plus parameter types in order identifies the method signature."
        },
        {
          "type": "mcq",
          "q": "Which header takes inputs but returns no value?",
          "options": [
            "void showSum(int x, int y)",
            "int fixedValue()",
            "void welcome()"
          ],
          "answer": 0,
          "explain": "Parameters supply inputs; void means no returned value."
        },
        {
          "type": "predict",
          "q": "Predict both lines without running.",
          "code": "class Change\n{\n    /** n receives a copy of the argument */\n    void change(int n)\n    {\n        n=n+5;\n        System.out.println(\"Inside = \"+n);\n    }\n\n    static void main()\n    {\n        /** c refers to a Change object */\n        Change c=new Change();\n        /** x stores the original number */\n        int x=3;\n        c.change(x);\n        System.out.println(\"After = \"+x);\n    }\n}",
          "ask": "output",
          "explain": "The method changes its copy n; x in main remains unchanged."
        },
        {
          "type": "mcq",
          "q": "Which access allows a method to be used only inside its own class?",
          "options": [
            "private",
            "public",
            "default access"
          ],
          "answer": 0,
          "explain": "private restricts access to the declaring class."
        }
      ]
    },
    {
      "type": "paper",
      "title": "Notebook: write a method, use its result",
      "minutes": 8,
      "q": "<p>Write a class <strong>Calculator</strong> with a public method <strong>int product(int x, int y)</strong> that returns the product.</p><p>In static void main(), create an object, call product with 4 and 5, store its result, then print <code>Product = </code> followed by the value and a second line <code>Back in main</code>.</p><p>Before revealing, underline the formal parameters, circle the actual parameters, and write the signature and predicted output. This is the method structure you will reuse in Q4 and class programs.</p>",
      "hints": [
        "A return method supplies a value; it need not print.",
        "Declare the helper outside main, inside the class.",
        "Create c before calling c.product(4,5)."
      ],
      "structure": "class Calculator\n{\n    // public int product(int x, int y): calculate and return\n    // static void main(): create object, call, store, print\n}",
      "solution": "class Calculator\n{\n    /** x and y receive the two numbers */\n    public int product(int x, int y)\n    {\n        /** p stores their product */\n        int p=x*y;\n        return p;\n    }\n\n    static void main()\n    {\n        /** c refers to a Calculator object */\n        Calculator c=new Calculator();\n        /** result stores the returned value */\n        int result=c.product(4,5);\n        System.out.println(\"Product = \"+result);\n        System.out.println(\"Back in main\");\n    }\n}",
      "checklist": [
        "Method header has the correct name, int return type and typed parameters.",
        "Every variable, including parameters and the object reference, has a /** */ description.",
        "Method returns the product rather than only printing it.",
        "main creates the object before calling its method.",
        "Arguments appear in the correct order without type declarations.",
        "I distinguished header, signature and body.",
        "I predicted both output lines before revealing."
      ]
    }
  ]
});
})();
