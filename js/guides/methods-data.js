/* Practice-first Chapter 3; answers computed by the engine. */
(function () {
var JP=globalThis.JP=globalThis.JP||{};
JP.guides=JP.guides||{};
JP.guides.methods={
  "title": "User-defined Methods",
  "sections": [
    {
      "id": "purpose",
      "title": "1. What is a method? Why use one?",
      "body": "<p>A <strong>method</strong> is a group of statements that performs a specific task. A <strong>user-defined method</strong> is one you write. A <strong>library method</strong> is already provided, such as Math.sqrt() or System.out.println().</p><p>Think of product as a small machine: give it two numbers, let it multiply, receive one result. You can reuse the machine with new inputs.</p><ul><li>Write a task once and call it many times.</li><li>Divide a large program into smaller tasks.</li><li>Find and correct mistakes in one task at a time.</li><li>Use a task without following its internal details every time.</li></ul><aside><strong>Exam wording:</strong> A method is a group of statements that performs a specific task.</aside>"
    },
    {
      "id": "parts",
      "title": "2. Header / prototype, signature and body",
      "body": "<pre><code>public int product(int x, int y)\n{\n    int p=x*y;\n    return p;\n}</code></pre><table><tr><th>Part</th><th>Here</th><th>What it tells you</th></tr><tr><td>Access specifier</td><td>public</td><td>Where the method can be accessed</td></tr><tr><td>Return type</td><td>int</td><td>Type of value sent back</td></tr><tr><td>Method name</td><td>product</td><td>Name used in the call</td></tr><tr><td>Formal parameters</td><td>int x, int y</td><td>Inputs received by this method</td></tr><tr><td>Header / prototype</td><td>public int product(int x, int y)</td><td>Declaration without the body, in the school terminology</td></tr><tr><td>Signature</td><td>product(int, int)</td><td>Name and parameter types in order</td></tr><tr><td>Body</td><td>Statements inside { }</td><td>Instructions executed when called</td></tr></table><p>Parameter names and the return type are <strong>not part of the signature</strong>. The optional static modifier goes between the access specifier and return type.</p><aside><strong>Recall:</strong> Cover the table. Point to each part of the header and name it aloud.</aside>"
    },
    {
      "id": "arguments",
      "title": "3. Formal parameters and actual parameters",
      "body": "<p><code>product(int x, int y)</code> is a definition: x and y are <strong>formal parameters</strong>. Their types are written here.</p><p><code>c.product(4,5)</code> is a call: 4 and 5 are <strong>actual parameters</strong>, also called <strong>arguments</strong>.</p><table><tr><th>First argument</th><th>Second argument</th></tr><tr><td>4 → x</td><td>5 → y</td></tr></table><p>Arguments may be literals, variables or expressions. If a is 4, then <code>c.product(a, a+1)</code> passes the values 4 and 5. Arguments are evaluated before the method uses the received values.</p><aside><strong>Common mistake:</strong> Write c.product(4,5), not c.product(int 4,int 5). Types belong in the definition.</aside>"
    },
    {
      "id": "return",
      "title": "5. Return type, return statement and void",
      "body": "<p>The <strong>return type</strong> is the promise in the header. The <strong>return statement</strong> fulfils that promise during execution.</p><ul><li><code>int product(...)</code> returns an integer value.</li><li><code>double average(...)</code> returns a double-compatible value.</li><li><code>void display()</code> returns no value.</li></ul><p>A return statement ends the current call immediately. A value-returning method must return a compatible value on every possible path. In our straight-line examples, return is the last executed statement.</p><p><code>return p;</code> sends a value to the caller. <code>System.out.println(p);</code> puts text on the screen. One does not replace the other.</p><table><tr><th>Method body</th><th>Effect</th></tr><tr><td>return x*y;</td><td>Caller receives the value; nothing is printed by this statement</td></tr><tr><td>System.out.println(x*y);</td><td>Value is printed; this statement does not return it</td></tr></table><p>Store a returned value with <code>int answer=c.product(4,5);</code>, or print it directly with <code>System.out.println(c.product(4,5));</code>. Calling <code>c.product(4,5);</code> alone discards the returned value.</p><details><summary>Fix it: int product(int x,int y) { System.out.println(x*y); }</summary><p>Add <code>return x*y;</code> if the method must return the product. Printing alone does not fulfil the int return type.</p></details>"
    },
    {
      "id": "four",
      "title": "6. The four kinds of methods",
      "body": "<table><tr><th>Kind</th><th>Example header</th><th>Call</th></tr><tr><td>No returned value, no parameters</td><td>void welcome()</td><td>t.welcome();</td></tr><tr><td>No returned value, parameters</td><td>void showSum(int x,int y)</td><td>t.showSum(2,3);</td></tr><tr><td>Returned value, parameters</td><td>int product(int x,int y)</td><td>System.out.println(t.product(4,5));</td></tr><tr><td>Returned value, no parameters</td><td>int fixedValue()</td><td>System.out.println(t.fixedValue());</td></tr></table><p><strong>Two checks:</strong> parentheses tell you about inputs; the return type tells you about the value coming back. A method with no parameters can still use an object's fields, as the next example shows.</p>"
    },
    {
      "id": "access",
      "title": "9. Access specifiers: Section-A definitions",
      "body": "<table><tr><th>Specifier</th><th>Accessible from</th></tr><tr><td>private</td><td>Within the declaring class</td></tr><tr><td>No specifier: default access</td><td>Within the same package</td></tr><tr><td>protected</td><td>Within the same package, and through inheritance outside the package</td></tr><tr><td>public</td><td>Anywhere</td></tr></table><p>Default access means omitting the keyword; you do not write <code>default void display()</code>. A package groups classes. For this chapter, learn the access definitions; an inheritance program is not needed.</p><p>The school notes have a public/protected wording typo. Use the definitions above.</p><details><summary>Recall: which access restricts a method to its own class?</summary><p>private.</p></details>"
    },
    {
      "id": "static",
      "title": "10. Static and non-static methods",
      "body": "<p>A <strong>static method</strong> is a class method. It can be called without creating an object. An <strong>instance / non-static method</strong> runs on an object.</p><table><tr><th>Definition</th><th>Call from static main</th></tr><tr><td>static int twice(int n)</td><td>Twice.twice(6); within Twice, twice(6) also works</td></tr><tr><td>int product(int x,int y)</td><td>Create c with new Calculator(), then c.product(4,5)</td></tr></table><p><strong>static</strong> describes how to call a method. <strong>int / void</strong> describes what it returns. They are separate parts of the header.</p>"
    },
    {
      "id": "overloading",
      "title": "11. Method overloading: one name, different parameter lists",
      "body": "<p><strong>Method overloading</strong> means defining two or more methods in the same class with the same name and different parameter lists. The school connects it with <strong>polymorphism</strong>: the same method name can perform different tasks for different inputs.</p><p>It improves readability: one meaningful name can be used for related tasks on different inputs.</p><table><tr><th>Difference</th><th>Valid overload example</th></tr><tr><td>Number of parameters</td><td>area(int s) and area(int l,int b)</td></tr><tr><td>Parameter types</td><td>sum(int a,int b) and sum(double a,double b)</td></tr><tr><td>Order of parameter types</td><td>show(int n,char c) and show(char c,int n)</td></tr></table><p>Changing only parameter names is insufficient: <code>sum(int x,int y)</code> and <code>sum(int a,int b)</code> have the same signature. Changing only the return type is also insufficient.</p><details><summary>Can int sum(int a,int b) and double sum(int a,int b) be overloads?</summary><p>No. Both have the same signature sum(int,int). The return type alone does not distinguish overloads.</p></details>"
    },
    {
      "id": "selection",
      "title": "12. Which overloaded method runs?",
      "body": "<ol><li>Look at the method name.</li><li>Count the arguments.</li><li>Determine their types in order.</li><li>Match them to the method's parameter list.</li></ol><p>For these school examples, exact matches tell you the chosen version. 10 is int, 10.0 is double, and 'a' is char. If no exact match exists, Java may widen a primitive type, such as int to double. It does not automatically narrow double to int.</p>"
    },
    {
      "id": "mistakes",
      "title": "15. Common mistakes that cost marks",
      "body": "<table><tr><th>Mistake</th><th>Correction</th></tr><tr><td>c.product(int x,int y);</td><td>Supply values: c.product(4,5);</td></tr><tr><td>int method prints but never returns</td><td>Return a compatible value on every path</td></tr><tr><td>void result stored in an int variable</td><td>A void call has no value to store</td></tr><tr><td>Method declared inside main</td><td>Define methods separately inside the class</td></tr><tr><td>Method header ends with ; before its body</td><td>Place the opening brace after the header</td></tr><tr><td>Static main calls an instance method directly</td><td>Create an object and use object.method(...)</td></tr><tr><td>Two overloads differ only in return type</td><td>Change number, types or order of parameters</td></tr><tr><td>5 used when the intended overload needs double</td><td>Use 5.0 for an exact double match</td></tr><tr><td>Assuming changing a primitive formal parameter changes the caller</td><td>Trace separate boxes; its value was copied</td></tr></table>"
    },
    {
      "id": "revision",
      "title": "18. Two-minute revision",
      "body": "<ul><li><strong>Method:</strong> one task, reusable statements.</li><li><strong>Header / prototype:</strong> declaration without body.</li><li><strong>Signature:</strong> name + parameter types in order.</li><li><strong>Body:</strong> statements inside braces.</li><li><strong>Formal:</strong> typed input variables in the definition.</li><li><strong>Actual:</strong> arguments supplied by the call.</li><li><strong>Primitive inputs:</strong> copied into separate boxes.</li><li><strong>return:</strong> sends a value back and ends the call.</li><li><strong>void:</strong> no returned value.</li><li><strong>Four kinds:</strong> inputs yes/no × returned value yes/no.</li><li><strong>static:</strong> callable without an object; instance method needs an object.</li><li><strong>Overloading:</strong> same name, different parameter lists.</li><li><strong>Not enough for overloading:</strong> changing only return type or parameter names.</li></ul><p><strong>Ready to move on?</strong> You can trace a call, explain its inputs and return, select an overload and write the notebook program without copying.</p>"
    }
  ],
  "examples": [
    {
      "id": "hello",
      "title": "A method is waiting to be called",
      "code": "class Greeting\n{\n    void welcome()\n    {\n        System.out.println(\"Welcome\");\n    }\n    static void main()\n    {\n        /** g refers to a Greeting object */\n        Greeting g=new Greeting();\n        g.welcome();\n        System.out.println(\"Done\");\n    }\n}",
      "expectCompileError": false
    },
    {
      "id": "nocall",
      "title": "One line removed",
      "code": "class Greeting\n{\n    void welcome()\n    {\n        System.out.println(\"Welcome\");\n    }\n    static void main()\n    {\n        /** g refers to a Greeting object */\n        Greeting g=new Greeting();\n        System.out.println(\"Done\");\n    }\n}",
      "expectCompileError": false
    },
    {
      "id": "twocalls",
      "title": "Reuse the task",
      "code": "class Greeting\n{\n    void welcome()\n    {\n        System.out.println(\"Welcome\");\n    }\n    static void main()\n    {\n        /** g refers to a Greeting object */\n        Greeting g=new Greeting();\n        g.welcome();\n        g.welcome();\n        System.out.println(\"Done\");\n    }\n}",
      "expectCompileError": false
    },
    {
      "id": "order-values",
      "title": "Same method, swapped arguments",
      "code": "class Difference\n{\n    /** x and y receive the two numbers */\n    void show(int x, int y)\n    {\n        System.out.println(x-y);\n    }\n    static void main()\n    {\n        /** d refers to a Difference object */\n        Difference d=new Difference();\n        d.show(9,4);\n        d.show(4,9);\n    }\n}",
      "expectCompileError": false
    },
    {
      "id": "expression-args",
      "title": "Pass expressions, not just literals",
      "code": "class Difference\n{\n    /** x and y receive the two numbers */\n    void show(int x, int y)\n    {\n        System.out.println(x-y);\n    }\n    static void main()\n    {\n        /** d refers to a Difference object */\n        Difference d=new Difference();\n        /** a stores the starting value */\n        int a=3;\n        d.show(a+2,a);\n        System.out.println(a);\n    }\n}",
      "expectCompileError": false
    },
    {
      "id": "copy",
      "title": "Change the copy",
      "code": "class Change\n{\n    /** n receives a copy of the argument */\n    void change(int n)\n    {\n        n=n+5;\n        System.out.println(\"Inside = \"+n);\n    }\n\n    static void main()\n    {\n        /** c refers to a Change object */\n        Change c=new Change();\n        /** x stores the original number */\n        int x=3;\n        c.change(x);\n        System.out.println(\"After = \"+x);\n    }\n}",
      "expectCompileError": false
    },
    {
      "id": "product",
      "title": "Return to the waiting call",
      "code": "class Calculator\n{\n    /** x and y receive the two numbers */\n    public int product(int x, int y)\n    {\n        /** p stores their product */\n        int p=x*y;\n        return p;\n    }\n\n    static void main()\n    {\n        /** c refers to a Calculator object */\n        Calculator c=new Calculator();\n        /** result stores the returned value */\n        int result=c.product(4,5);\n        System.out.println(\"Product = \"+result);\n        System.out.println(\"Back in main\");\n    }\n}",
      "expectCompileError": false
    },
    {
      "id": "discard",
      "title": "A returned result can be ignored",
      "code": "class Calculator\n{\n    /** x and y receive the two numbers */\n    public int product(int x, int y)\n    {\n        /** p stores their product */\n        int p=x*y;\n        return p;\n    }\n\n    static void main()\n    {\n        /** c refers to a Calculator object */\n        Calculator c=new Calculator();\n        c.product(4,5);\n        System.out.println(\"Back in main\");\n    }\n}",
      "expectCompileError": false
    },
    {
      "id": "print-return",
      "title": "Print inside, return outside",
      "code": "class Calculator\n{\n    /** x and y receive the two numbers */\n    public int product(int x, int y)\n    {\n        /** p stores their product */\n        int p=x*y;\n        System.out.println(\"Inside = \"+p);\n        return p;\n    }\n\n    static void main()\n    {\n        /** c refers to a Calculator object */\n        Calculator c=new Calculator();\n        /** result stores the returned value */\n        int result=c.product(4,5);\n        System.out.println(\"Product = \"+result);\n        System.out.println(\"Back in main\");\n    }\n}",
      "expectCompileError": false
    },
    {
      "id": "four",
      "title": "All four kinds in one program",
      "code": "class Tasks\n{\n    void welcome()\n    {\n        System.out.println(\"Welcome\");\n    }\n    /** x and y receive the numbers to add */\n    void showSum(int x, int y)\n    {\n        System.out.println(\"Sum = \"+(x+y));\n    }\n    /** x and y receive the numbers to multiply */\n    int product(int x, int y)\n    {\n        return x*y;\n    }\n    int fixedValue()\n    {\n        return 10;\n    }\n    static void main()\n    {\n        /** t refers to a Tasks object */\n        Tasks t=new Tasks();\n        t.welcome();\n        t.showSum(2,3);\n        System.out.println(t.product(4,5));\n        System.out.println(t.fixedValue());\n    }\n}",
      "expectCompileError": false
    },
    {
      "id": "empty-return",
      "title": "Does this compile?",
      "code": "class Calculator\n{\n    /** x and y receive the two numbers */\n    public int product(int x, int y)\n    {\n        /** p stores their product */\n        int p=x*y;\n        return;\n    }\n\n    static void main()\n    {\n        /** c refers to a Calculator object */\n        Calculator c=new Calculator();\n        /** result stores the returned value */\n        int result=c.product(4,5);\n        System.out.println(\"Product = \"+result);\n        System.out.println(\"Back in main\");\n    }\n}",
      "expectCompileError": true
    },
    {
      "id": "empty-return-fixed",
      "title": "Does this compile? — corrected",
      "code": "class Calculator\n{\n    /** x and y receive the two numbers */\n    public int product(int x, int y)\n    {\n        /** p stores their product */\n        int p=x*y;\n        return p;\n    }\n\n    static void main()\n    {\n        /** c refers to a Calculator object */\n        Calculator c=new Calculator();\n        /** result stores the returned value */\n        int result=c.product(4,5);\n        System.out.println(\"Product = \"+result);\n        System.out.println(\"Back in main\");\n    }\n}"
    },
    {
      "id": "static",
      "title": "A class call without an object",
      "code": "class Twice\n{\n    /** n receives the number to double */\n    static int twice(int n)\n    {\n        return 2*n;\n    }\n    static void main()\n    {\n        System.out.println(Twice.twice(6));\n    }\n}",
      "expectCompileError": false
    },
    {
      "id": "instance-error",
      "title": "An instance method from static main",
      "code": "class Greeting\n{\n    void welcome()\n    {\n        System.out.println(\"Welcome\");\n    }\n    static void main()\n    {\n        /** g refers to a Greeting object */\n        Greeting g=new Greeting();\n        welcome();\n        System.out.println(\"Done\");\n    }\n}",
      "expectCompileError": true
    },
    {
      "id": "instance-error-fixed",
      "title": "An instance method from static main — corrected",
      "code": "class Greeting\n{\n    void welcome()\n    {\n        System.out.println(\"Welcome\");\n    }\n    static void main()\n    {\n        /** g refers to a Greeting object */\n        Greeting g=new Greeting();\n        g.welcome();\n        System.out.println(\"Done\");\n    }\n}"
    },
    {
      "id": "overload",
      "title": "Which version runs?",
      "code": "class Sum\n{\n    /** a and b receive two integers */\n    void sum(int a, int b)\n    {\n        System.out.println(\"int: \"+(a+b));\n    }\n    /** a and b receive two doubles */\n    void sum(double a, double b)\n    {\n        System.out.println(\"double: \"+(a+b));\n    }\n    /** a and b receive two characters */\n    void sum(char a, char b)\n    {\n        System.out.println(\"char: \"+(a+b));\n    }\n    static void main()\n    {\n        /** s refers to a Sum object */\n        Sum s=new Sum();\n        s.sum(10,20);\n        s.sum(12.5,13.5);\n        s.sum('a','b');\n    }\n}",
      "expectCompileError": false
    },
    {
      "id": "type-order",
      "title": "Type order changes the signature",
      "code": "class Order\n{\n    /** n stores a number and c stores a character */\n    void show(int n, char c)\n    {\n        System.out.println(\"int then char\");\n    }\n    /** c stores a character and n stores a number */\n    void show(char c, int n)\n    {\n        System.out.println(\"char then int\");\n    }\n    static void main()\n    {\n        /** o refers to an Order object */\n        Order o=new Order();\n        o.show(3,'A');\n        o.show('A',3);\n    }\n}",
      "expectCompileError": false
    },
    {
      "id": "count",
      "title": "One argument or two?",
      "code": "class Area\n{\n    /** side stores the side of the square */\n    int area(int side)\n    {\n        return side*side;\n    }\n    /** length and breadth store rectangle dimensions */\n    int area(int length, int breadth)\n    {\n        return length*breadth;\n    }\n    static void main()\n    {\n        /** a refers to an Area object */\n        Area a=new Area();\n        System.out.println(\"Square = \"+a.area(4));\n        System.out.println(\"Rectangle = \"+a.area(5,3));\n    }\n}",
      "expectCompileError": false
    },
    {
      "id": "return-overload",
      "title": "Only the return type changes",
      "code": "class Invalid\n{\n    /** n receives an integer */\n    int value(int n)\n    {\n        return n;\n    }\n    /** n receives an integer */\n    double value(int n)\n    {\n        return n;\n    }\n    static void main()\n    {\n        System.out.println(\"Ready\");\n    }\n}",
      "expectCompileError": true
    },
    {
      "id": "return-overload-fixed",
      "title": "Only the return type changes — corrected",
      "code": "class Invalid\n{\n    /** n receives an integer */\n    int value(int n)\n    {\n        return n;\n    }\n    /** n receives a double */\n    double value(double n)\n    {\n        return n;\n    }\n    static void main()\n    {\n        System.out.println(\"Ready\");\n    }\n}"
    },
    {
      "id": "widen",
      "title": "No exact int version",
      "code": "class Wide\n{\n    /** n receives a double value */\n    void show(double n)\n    {\n        System.out.println(n);\n    }\n    static void main()\n    {\n        /** w refers to a Wide object */\n        Wide w=new Wide();\n        w.show(5);\n    }\n}",
      "expectCompileError": false
    },
    {
      "id": "narrow",
      "title": "Reverse the conversion",
      "code": "class Wide\n{\n    /** n receives a integer value */\n    void show(int n)\n    {\n        System.out.println(n);\n    }\n    static void main()\n    {\n        /** w refers to a Wide object */\n        Wide w=new Wide();\n        w.show(5.5);\n    }\n}",
      "expectCompileError": true
    },
    {
      "id": "narrow-fixed",
      "title": "Reverse the conversion — corrected",
      "code": "class Wide\n{\n    /** n receives a integer value */\n    void show(int n)\n    {\n        System.out.println(n);\n    }\n    static void main()\n    {\n        /** w refers to a Wide object */\n        Wide w=new Wide();\n        w.show(5);\n    }\n}"
    },
    {
      "id": "noargs",
      "title": "Return without new arguments",
      "code": "class Total\n{\n    /** x stores the first number */\n    int x;\n    /** y stores the second number */\n    int y;\n    /** a and b receive the values to store */\n    void input(int a, int b)\n    {\n        x=a;\n        y=b;\n    }\n    int sum()\n    {\n        return x+y;\n    }\n    static void main()\n    {\n        /** t refers to a Total object */\n        Total t=new Total();\n        t.input(5,6);\n        /** sm stores the returned sum */\n        int sm=t.sum();\n        System.out.println(\"Sum = \"+sm);\n    }\n}",
      "expectCompileError": false
    },
    {
      "id": "compute",
      "title": "School Q4-style program",
      "code": "class Compute\n{\n    /** a stores an integer and b selects square or cube */\n    void compute(int a, char b)\n    {\n        if(b=='s' || b=='S')\n        {\n            System.out.println(\"Square=\"+(a*a));\n        }\n        else\n        {\n            System.out.println(\"Cube=\"+(a*a*a));\n        }\n    }\n    /** x stores a side length and y selects volume or diagonal */\n    void compute(double x, char y)\n    {\n        if(y=='v' || y=='V')\n        {\n            System.out.println(\"Cube=\"+(x*x*x));\n        }\n        else\n        {\n            System.out.println(\"Diagonal=\"+(Math.sqrt(3)*x));\n        }\n    }\n    /** a and b store length and breadth; c selects area or perimeter */\n    void compute(int a, int b, char c)\n    {\n        if(c=='a' || c=='A')\n        {\n            System.out.println(\"Area=\"+(a*b));\n        }\n        else\n        {\n            System.out.println(\"Perimeter=\"+(2*(a+b)));\n        }\n    }\n    static void main()\n    {\n        /** obj refers to a Compute object */\n        Compute obj=new Compute();\n        obj.compute(5,'s');\n        obj.compute(3.0,'v');\n        obj.compute(10,5,'a');\n    }\n}",
      "expectCompileError": false
    },
    {
      "id": "paper-product",
      "title": "Notebook solution",
      "code": "class Calculator\n{\n    /** x and y receive the two numbers */\n    public int product(int x, int y)\n    {\n        /** p stores their product */\n        int p=x*y;\n        return p;\n    }\n\n    static void main()\n    {\n        /** c refers to a Calculator object */\n        Calculator c=new Calculator();\n        /** result stores the returned value */\n        int result=c.product(4,5);\n        System.out.println(\"Product = \"+result);\n        System.out.println(\"Back in main\");\n    }\n}"
    },
    {
      "id": "paper-area",
      "title": "Notebook solution",
      "code": "class Area\n{\n    /** side stores the side of the square */\n    int area(int side)\n    {\n        return side*side;\n    }\n    /** length and breadth store rectangle dimensions */\n    int area(int length, int breadth)\n    {\n        return length*breadth;\n    }\n    static void main()\n    {\n        /** a refers to an Area object */\n        Area a=new Area();\n        System.out.println(\"Square = \"+a.area(4));\n        System.out.println(\"Rectangle = \"+a.area(5,3));\n    }\n}"
    },
    {
      "id": "lab-full",
      "title": "The complete program: predict seven lines",
      "code": "class Order\n{\n    /** price stores the price of one item */\n    private int price;\n    /** quantity stores the object's item count */\n    private int quantity;\n\n    public void welcome()\n    {\n        System.out.println(\"Order ready\");\n    }\n\n    /** p and q receive the price and quantity to store */\n    public void accept(int p, int q)\n    {\n        price=p;\n        quantity=q;\n    }\n\n    public int total()\n    {\n        return price*quantity;\n    }\n\n    /** p and q receive values for a separate calculation */\n    public int total(int p, int q)\n    {\n        return p*q;\n    }\n\n    void display()\n    {\n        System.out.println(\"Stored total = \"+total());\n    }\n\n    /** n receives a copy of the caller's number */\n    public void changeCopy(int n)\n    {\n        n=n+1;\n        System.out.println(\"Inside copy = \"+n);\n    }\n\n    /** n receives the number to double */\n    public static int twice(int n)\n    {\n        return 2*n;\n    }\n\n    static void main()\n    {\n        /** o refers to an Order object */\n        Order o=new Order();\n        o.welcome();\n        o.accept(50,2);\n        System.out.println(\"Returned total = \"+o.total());\n        System.out.println(\"Other total = \"+o.total(30,3));\n        o.display();\n        /** q stores the caller's quantity */\n        int q=2;\n        o.changeCopy(q);\n        System.out.println(\"Caller quantity = \"+q);\n        System.out.println(\"Static result = \"+Order.twice(7));\n    }\n}"
    },
    {
      "id": "lab-void",
      "title": "Store values without printing",
      "code": "class Order\n{\n    /** price stores the price of one item */\n    private int price;\n    /** quantity stores the object's item count */\n    private int quantity;\n\n    public void welcome()\n    {\n        System.out.println(\"Order ready\");\n    }\n\n    /** p and q receive the price and quantity to store */\n    public void accept(int p, int q)\n    {\n        price=p;\n        quantity=q;\n    }\n\n    public int total()\n    {\n        return price*quantity;\n    }\n\n    /** p and q receive values for a separate calculation */\n    public int total(int p, int q)\n    {\n        return p*q;\n    }\n\n    void display()\n    {\n        System.out.println(\"Stored total = \"+total());\n    }\n\n    /** n receives a copy of the caller's number */\n    public void changeCopy(int n)\n    {\n        n=n+1;\n        System.out.println(\"Inside copy = \"+n);\n    }\n\n    /** n receives the number to double */\n    public static int twice(int n)\n    {\n        return 2*n;\n    }\n\n    static void main()\n    {\n        /** o refers to an Order object */\n        Order o=new Order();\n        o.accept(50,2);\n        System.out.println(\"Reached main\");\n    }\n}"
    },
    {
      "id": "lab-return",
      "title": "Calling total alone does not print",
      "code": "class Order\n{\n    /** price stores the price of one item */\n    private int price;\n    /** quantity stores the object's item count */\n    private int quantity;\n\n    public void welcome()\n    {\n        System.out.println(\"Order ready\");\n    }\n\n    /** p and q receive the price and quantity to store */\n    public void accept(int p, int q)\n    {\n        price=p;\n        quantity=q;\n    }\n\n    public int total()\n    {\n        return price*quantity;\n    }\n\n    /** p and q receive values for a separate calculation */\n    public int total(int p, int q)\n    {\n        return p*q;\n    }\n\n    void display()\n    {\n        System.out.println(\"Stored total = \"+total());\n    }\n\n    /** n receives a copy of the caller's number */\n    public void changeCopy(int n)\n    {\n        n=n+1;\n        System.out.println(\"Inside copy = \"+n);\n    }\n\n    /** n receives the number to double */\n    public static int twice(int n)\n    {\n        return 2*n;\n    }\n\n    static void main()\n    {\n        /** o refers to an Order object */\n        Order o=new Order();\n        o.accept(50,2);\n        o.total();\n        System.out.println(\"Returned to main\");\n    }\n}"
    },
    {
      "id": "lab-args",
      "title": "Arguments versus stored fields",
      "code": "class Order\n{\n    /** price stores the price of one item */\n    private int price;\n    /** quantity stores the object's item count */\n    private int quantity;\n\n    public void welcome()\n    {\n        System.out.println(\"Order ready\");\n    }\n\n    /** p and q receive the price and quantity to store */\n    public void accept(int p, int q)\n    {\n        price=p;\n        quantity=q;\n    }\n\n    public int total()\n    {\n        return price*quantity;\n    }\n\n    /** p and q receive values for a separate calculation */\n    public int total(int p, int q)\n    {\n        return p*q;\n    }\n\n    void display()\n    {\n        System.out.println(\"Stored total = \"+total());\n    }\n\n    /** n receives a copy of the caller's number */\n    public void changeCopy(int n)\n    {\n        n=n+1;\n        System.out.println(\"Inside copy = \"+n);\n    }\n\n    /** n receives the number to double */\n    public static int twice(int n)\n    {\n        return 2*n;\n    }\n\n    static void main()\n    {\n        /** o refers to an Order object */\n        Order o=new Order();\n        o.accept(50,2);\n        System.out.println(\"Arguments = \"+o.total(10,4));\n        o.display();\n    }\n}"
    },
    {
      "id": "lab-copy",
      "title": "The caller and parameter are separate",
      "code": "class Order\n{\n    /** price stores the price of one item */\n    private int price;\n    /** quantity stores the object's item count */\n    private int quantity;\n\n    public void welcome()\n    {\n        System.out.println(\"Order ready\");\n    }\n\n    /** p and q receive the price and quantity to store */\n    public void accept(int p, int q)\n    {\n        price=p;\n        quantity=q;\n    }\n\n    public int total()\n    {\n        return price*quantity;\n    }\n\n    /** p and q receive values for a separate calculation */\n    public int total(int p, int q)\n    {\n        return p*q;\n    }\n\n    void display()\n    {\n        System.out.println(\"Stored total = \"+total());\n    }\n\n    /** n receives a copy of the caller's number */\n    public void changeCopy(int n)\n    {\n        n=n+1;\n        System.out.println(\"Inside copy = \"+n);\n    }\n\n    /** n receives the number to double */\n    public static int twice(int n)\n    {\n        return 2*n;\n    }\n\n    static void main()\n    {\n        /** o refers to an Order object */\n        Order o=new Order();\n        /** q stores the caller's quantity */\n        int q=2;\n        o.changeCopy(q);\n        System.out.println(\"Caller = \"+q);\n    }\n}"
    },
    {
      "id": "lab-state",
      "title": "A different method really changes the fields",
      "code": "class Order\n{\n    /** price stores the price of one item */\n    private int price;\n    /** quantity stores the object's item count */\n    private int quantity;\n\n    public void welcome()\n    {\n        System.out.println(\"Order ready\");\n    }\n\n    /** p and q receive the price and quantity to store */\n    public void accept(int p, int q)\n    {\n        price=p;\n        quantity=q;\n    }\n\n    public int total()\n    {\n        return price*quantity;\n    }\n\n    /** p and q receive values for a separate calculation */\n    public int total(int p, int q)\n    {\n        return p*q;\n    }\n\n    void display()\n    {\n        System.out.println(\"Stored total = \"+total());\n    }\n\n    /** n receives a copy of the caller's number */\n    public void changeCopy(int n)\n    {\n        n=n+1;\n        System.out.println(\"Inside copy = \"+n);\n    }\n\n    /** n receives the number to double */\n    public static int twice(int n)\n    {\n        return 2*n;\n    }\n\n    static void main()\n    {\n        /** o refers to an Order object */\n        Order o=new Order();\n        o.accept(50,2);\n        o.display();\n        o.accept(50,3);\n        o.display();\n    }\n}"
    },
    {
      "id": "lab-static",
      "title": "Use the class name, with no object",
      "code": "class Order\n{\n    /** price stores the price of one item */\n    private int price;\n    /** quantity stores the object's item count */\n    private int quantity;\n\n    public void welcome()\n    {\n        System.out.println(\"Order ready\");\n    }\n\n    /** p and q receive the price and quantity to store */\n    public void accept(int p, int q)\n    {\n        price=p;\n        quantity=q;\n    }\n\n    public int total()\n    {\n        return price*quantity;\n    }\n\n    /** p and q receive values for a separate calculation */\n    public int total(int p, int q)\n    {\n        return p*q;\n    }\n\n    void display()\n    {\n        System.out.println(\"Stored total = \"+total());\n    }\n\n    /** n receives a copy of the caller's number */\n    public void changeCopy(int n)\n    {\n        n=n+1;\n        System.out.println(\"Inside copy = \"+n);\n    }\n\n    /** n receives the number to double */\n    public static int twice(int n)\n    {\n        return 2*n;\n    }\n\n    static void main()\n    {\n        System.out.println(Order.twice(7));\n        System.out.println(Order.twice(10));\n    }\n}"
    },
    {
      "id": "lab-nested",
      "title": "A return value becomes another argument",
      "code": "class Order\n{\n    /** price stores the price of one item */\n    private int price;\n    /** quantity stores the object's item count */\n    private int quantity;\n\n    public void welcome()\n    {\n        System.out.println(\"Order ready\");\n    }\n\n    /** p and q receive the price and quantity to store */\n    public void accept(int p, int q)\n    {\n        price=p;\n        quantity=q;\n    }\n\n    public int total()\n    {\n        return price*quantity;\n    }\n\n    /** p and q receive values for a separate calculation */\n    public int total(int p, int q)\n    {\n        return p*q;\n    }\n\n    void display()\n    {\n        System.out.println(\"Stored total = \"+total());\n    }\n\n    /** n receives a copy of the caller's number */\n    public void changeCopy(int n)\n    {\n        n=n+1;\n        System.out.println(\"Inside copy = \"+n);\n    }\n\n    /** n receives the number to double */\n    public static int twice(int n)\n    {\n        return 2*n;\n    }\n\n    static void main()\n    {\n        /** o refers to an Order object */\n        Order o=new Order();\n        o.accept(50,2);\n        System.out.println(o.total(Order.twice(5),3));\n    }\n}"
    },
    {
      "id": "lab-paper",
      "title": "Order notebook reconstruction",
      "code": "class Order\n{\n    /** price stores the price of one item */\n    private int price;\n    /** quantity stores the object's item count */\n    private int quantity;\n\n    public void welcome()\n    {\n        System.out.println(\"Order ready\");\n    }\n\n    /** p and q receive the price and quantity to store */\n    public void accept(int p, int q)\n    {\n        price=p;\n        quantity=q;\n    }\n\n    public int total()\n    {\n        return price*quantity;\n    }\n\n    /** p and q receive values for a separate calculation */\n    public int total(int p, int q)\n    {\n        return p*q;\n    }\n\n    void display()\n    {\n        System.out.println(\"Stored total = \"+total());\n    }\n\n    /** n receives a copy of the caller's number */\n    public void changeCopy(int n)\n    {\n        n=n+1;\n        System.out.println(\"Inside copy = \"+n);\n    }\n\n    /** n receives the number to double */\n    public static int twice(int n)\n    {\n        return 2*n;\n    }\n\n    static void main()\n    {\n        /** o refers to an Order object */\n        Order o=new Order();\n        o.accept(25,4);\n        o.display();\n        System.out.println(\"Separate = \"+o.total(10,3));\n        System.out.println(\"Twice = \"+Order.twice(6));\n    }\n}"
    }
  ],
  "batches": [
    {
      "id": "calls",
      "title": "1 · Follow the call",
      "minutes": 6,
      "focus": "Call order, reusable methods, and purpose",
      "tasks": [
        {
          "id": "hello",
          "title": "A method is waiting to be called",
          "kind": "output",
          "example": "hello",
          "q": "Write the exact two output lines. Start at main, not at the first method definition.",
          "why": "main calls welcome; Welcome prints. Control returns to main, which prints Done.",
          "rule": "A method runs when called. Defining it alone does not run it.",
          "change": "Swap the two statements g.welcome() and println(\"Done\"). Predict again."
        },
        {
          "id": "nocall",
          "title": "One line removed",
          "kind": "output",
          "example": "nocall",
          "q": "The method is still defined. Its call is missing. What prints?",
          "why": "Creating g does not call welcome. Only the remaining println runs.",
          "rule": "Object creation and calling an ordinary method are separate actions.",
          "change": ""
        },
        {
          "id": "twocalls",
          "title": "Reuse the task",
          "kind": "output",
          "example": "twocalls",
          "q": "Write all output lines in their order.",
          "why": "Each call executes the same method body; main then continues.",
          "rule": "One definition can be called more than once.",
          "change": ""
        },
        {
          "id": "purpose",
          "title": "Name what you just used",
          "kind": "recall",
          "q": "What is a method? State one advantage you saw in these three programs.",
          "answer": "A method is a group of statements that performs a specific task. It can be defined once and called repeatedly; methods also split a large program into smaller tasks.",
          "rule": "User-defined methods contain logic you write; library methods are already provided."
        }
      ]
    },
    {
      "id": "inputs",
      "title": "2 · Put values into parameter boxes",
      "minutes": 7,
      "focus": "Arguments, formal parameters, order and primitive copies",
      "tasks": [
        {
          "id": "order-values",
          "title": "Same method, swapped arguments",
          "kind": "output",
          "example": "order-values",
          "q": "Write both output lines. Draw x and y boxes for each call.",
          "why": "The first argument goes into x; the second goes into y. Swapping them changes subtraction.",
          "rule": "Actual parameters / arguments supply values; formal parameters receive them.",
          "change": ""
        },
        {
          "id": "expression-args",
          "title": "Pass expressions, not just literals",
          "kind": "output",
          "example": "expression-args",
          "q": "What prints? Does passing a+2 change a?",
          "why": "a+2 evaluates to 5 and is passed as a value. It does not assign 5 to a.",
          "rule": "Evaluate argument expressions before following the method body.",
          "change": ""
        },
        {
          "id": "copy",
          "title": "Change the copy",
          "kind": "output",
          "example": "copy",
          "q": "Draw x in main and n in change. Predict Inside and After.",
          "why": "change receives a copy of 3 in n. Increasing n leaves the caller’s x unchanged.",
          "rule": "Primitive parameter values are copied. The school calls this call by value.",
          "change": "Set x=10. Predict both lines before checking."
        },
        {
          "id": "formal-actual",
          "title": "Label the definition and the call",
          "kind": "recall",
          "q": "Name the formal parameters and the actual parameters. Write the signature.",
          "answer": "Formal: x and y, both int. Actual: 9 and 4. Signature: show(int,int).",
          "rule": "Types belong in the definition; values or expressions belong in the call.",
          "fragment": "void show(int x,int y)\n// called as:\nd.show(9,4);"
        }
      ]
    },
    {
      "id": "returns",
      "title": "3 · Printing is different from returning",
      "minutes": 8,
      "focus": "Return values, void, ignored results and four method kinds",
      "tasks": [
        {
          "id": "product",
          "title": "Return to the waiting call",
          "kind": "output",
          "example": "product",
          "q": "Write both output lines. Where does the returned value go?",
          "why": "product returns its calculated p to the call. main stores that value in result, then prints it.",
          "rule": "return sends a value back and ends the current method call.",
          "change": ""
        },
        {
          "id": "discard",
          "title": "A returned result can be ignored",
          "kind": "output",
          "example": "discard",
          "q": "The call executes, but its returned result is not stored or printed. What appears?",
          "why": "The product is computed and returned, then discarded. Only Back in main is printed.",
          "rule": "Returning a value does not automatically print it.",
          "change": ""
        },
        {
          "id": "print-return",
          "title": "Print inside, return outside",
          "kind": "output",
          "example": "print-return",
          "q": "Write every output line. Identify which method prints each one.",
          "why": "product prints once before returning; main then prints the returned value and its continuation message.",
          "rule": "A method may both print and return. Trace each action separately.",
          "change": ""
        },
        {
          "id": "four",
          "title": "All four kinds in one program",
          "kind": "output",
          "example": "four",
          "q": "Predict all four lines. For each method, say: inputs yes/no, returned value yes/no.",
          "why": "welcome and showSum print internally. product and fixedValue return values that main prints.",
          "rule": "Empty parentheses mean no parameters; void means no returned value.",
          "change": ""
        },
        {
          "id": "empty-return",
          "title": "Does this compile?",
          "kind": "diagnose",
          "example": "empty-return",
          "q": "Write “compiles” or “does not compile”. If rejected, write the replacement statement.",
          "why": "product promises int, but return; supplies no value. Use return p;.",
          "rule": "A value-returning method must supply a compatible value.",
          "change": "",
          "fixed": "empty-return-fixed"
        }
      ]
    },
    {
      "id": "headers",
      "title": "4 · Recognize the exam vocabulary",
      "minutes": 5,
      "focus": "Header, signature, body, access and static",
      "tasks": [
        {
          "id": "header",
          "title": "Read one header",
          "kind": "recall",
          "q": "Identify the access specifier, modifier, return type, name and signature.",
          "answer": "Access: public. Modifier: static. Return type: int. Name: twice. Signature: twice(int). The full declaration shown is the header / prototype in school terminology.",
          "rule": "The signature excludes return type, parameter names and access specifier.",
          "fragment": "public static int twice(int n)"
        },
        {
          "id": "static",
          "title": "A class call without an object",
          "kind": "output",
          "example": "static",
          "q": "Write the output. Was a Twice object needed?",
          "why": "The static method is called through its class name; no object is created.",
          "rule": "static describes how the method is called; int describes the returned value.",
          "change": ""
        },
        {
          "id": "instance-error",
          "title": "An instance method from static main",
          "kind": "diagnose",
          "example": "instance-error",
          "q": "Does it compile? Replace only the faulty call.",
          "why": "welcome is an instance method. static main must call it through g: g.welcome();.",
          "rule": "An instance method runs on an object.",
          "change": "",
          "fixed": "instance-error-fixed"
        },
        {
          "id": "access",
          "title": "Choose the access",
          "kind": "recall",
          "q": "Write the access for: own class only; same package; anywhere; same package plus inheritance outside it.",
          "answer": "Own class only: private. Same package: no specifier (default access). Anywhere: public. Same package plus inheritance outside it: protected.",
          "rule": "Default access means omitting a keyword, not writing default before the method."
        }
      ]
    },
    {
      "id": "overloads",
      "title": "5 · Same name, different parameter lists",
      "minutes": 8,
      "focus": "Selection by count, type and order",
      "tasks": [
        {
          "id": "overload",
          "title": "Which version runs?",
          "kind": "output",
          "example": "overload",
          "q": "For each call, write the chosen signature, then predict its output.",
          "why": "The three calls match int,int; double,double; and char,char. In the char body, a+b adds character codes.",
          "rule": "Method overloading: same name in the same class, different parameter lists.",
          "change": "Change the integer call to sum(10.0,20.0). Which version runs now?"
        },
        {
          "id": "type-order",
          "title": "Type order changes the signature",
          "kind": "output",
          "example": "type-order",
          "q": "Write both signatures and both output lines.",
          "why": "show(int,char) and show(char,int) are different signatures, despite using the same two types.",
          "rule": "Count, types or order of parameter types can distinguish overloads.",
          "change": ""
        },
        {
          "id": "count",
          "title": "One argument or two?",
          "kind": "output",
          "example": "count",
          "q": "Predict both labelled lines. What distinguishes these overloads?",
          "why": "The square method takes one int. The rectangle method takes two ints.",
          "rule": "Different numbers of parameters create different signatures.",
          "change": ""
        },
        {
          "id": "return-overload",
          "title": "Only the return type changes",
          "kind": "diagnose",
          "example": "return-overload",
          "q": "Does this compile? Explain without running it.",
          "why": "Both declarations have signature value(int). Different return types alone cannot create overloads.",
          "rule": "Overloading is distinguished by parameter lists.",
          "change": "",
          "fixed": "return-overload-fixed"
        }
      ]
    },
    {
      "id": "mixed",
      "title": "6 · Mixed checks without hints",
      "minutes": 7,
      "focus": "Transfer: widening, no-parameter return and original school program",
      "tasks": [
        {
          "id": "widen",
          "title": "No exact int version",
          "kind": "output",
          "example": "widen",
          "q": "Does it compile? If yes, write the exact output.",
          "why": "Java widens the int argument to double when calling show(double).",
          "rule": "Primitive widening may make a call valid; narrowing is not automatic.",
          "change": ""
        },
        {
          "id": "narrow",
          "title": "Reverse the conversion",
          "kind": "diagnose",
          "example": "narrow",
          "q": "Does it compile? What changed compared with the previous example?",
          "why": "A double argument cannot automatically narrow to int. The corrected example uses an int argument.",
          "rule": "A valid widening conversion does not imply a valid conversion in the opposite direction.",
          "change": "",
          "fixed": "narrow-fixed"
        },
        {
          "id": "noargs",
          "title": "Return without new arguments",
          "kind": "output",
          "example": "noargs",
          "q": "Predict the output. Where does sum() get the values it uses?",
          "why": "input stores fields x and y on the object. sum reads those fields and returns their sum without parameters.",
          "rule": "A method with no parameters may still use its object’s stored values.",
          "change": ""
        },
        {
          "id": "compute",
          "title": "School Q4-style program",
          "kind": "output",
          "example": "compute",
          "q": "For each call, write its selected signature and output. Then change all three selector characters and try again.",
          "why": "Argument types select a method first. Its if/else then selects a formula. Those are separate decisions.",
          "rule": "Identify the signature before tracing the selected method body.",
          "change": "Use compute(5,'c'), compute(3.0,'d'), compute(10,5,'p'). Predict which formula each uses."
        }
      ]
    },
    {
      "id": "program-lab",
      "title": "Program lab · one class, many method experiments",
      "minutes": 20,
      "focus": "Use one Order class to connect every method idea",
      "intro": "Keep the same Order class. For each short experiment below, only main changes. Predict first; the W3Schools copy includes the complete class for that experiment.",
      "tasks": [
        {
          "id": "lab-full",
          "title": "The complete program: predict seven lines",
          "kind": "output",
          "example": "lab-full",
          "q": "Start in main. Write every output line before opening the answer. Mark which calls return values and which print.",
          "why": "welcome prints. accept stores 50 and 2 without printing. total() returns their product; total(30,3) returns a separate product without changing the fields. display prints the stored total. changeCopy changes only n. twice returns a value through the class call.",
          "rule": "Call → receive inputs → execute → return or print → continue.",
          "change": "Change accept(50,2) to accept(50,4). Identify exactly which output lines change."
        },
        {
          "id": "lab-void",
          "title": "Store values without printing",
          "kind": "output",
          "example": "lab-void",
          "q": "What prints? Does accept returning void mean it did nothing?",
          "why": "accept changes the fields but has no println and returns no value. main still prints its continuation message.",
          "rule": "void means no returned value, not no work.",
          "change": "",
          "displayCode": "static void main()\n{\n    /** o refers to an Order object */\n    Order o=new Order();\n    o.accept(50,2);\n    System.out.println(\"Reached main\");\n}",
          "snippetLabel": "Focus snippet · replacement main only; copy includes the full Order class"
        },
        {
          "id": "lab-return",
          "title": "Calling total alone does not print",
          "kind": "output",
          "example": "lab-return",
          "q": "Predict the output. Now suppose o.total() were inside println—what would change?",
          "why": "total computes and returns a value, but this call discards it. Only main prints.",
          "rule": "A returned value is not automatically output.",
          "change": "Replace o.total(); with System.out.println(o.total());. Predict the added line.",
          "displayCode": "static void main()\n{\n    /** o refers to an Order object */\n    Order o=new Order();\n    o.accept(50,2);\n    o.total();\n    System.out.println(\"Returned to main\");\n}",
          "snippetLabel": "Focus snippet · replacement main only; copy includes the full Order class"
        },
        {
          "id": "lab-args",
          "title": "Arguments versus stored fields",
          "kind": "output",
          "example": "lab-args",
          "q": "Write both lines. Did total(10,4) replace the object’s price and quantity?",
          "why": "The overloaded method calculates from its formal parameters p and q. It does not assign the object’s fields. display still uses values stored by accept.",
          "rule": "Parameters are method inputs; fields are the object’s stored state.",
          "change": "",
          "displayCode": "static void main()\n{\n    /** o refers to an Order object */\n    Order o=new Order();\n    o.accept(50,2);\n    System.out.println(\"Arguments = \"+o.total(10,4));\n    o.display();\n}",
          "snippetLabel": "Focus snippet · replacement main only; copy includes the full Order class"
        },
        {
          "id": "lab-copy",
          "title": "The caller and parameter are separate",
          "kind": "output",
          "example": "lab-copy",
          "q": "Draw q in main and n inside changeCopy. Predict both lines.",
          "why": "n receives a copy of q. Increasing n does not assign anything to q.",
          "rule": "Primitive values are copied into formal parameters.",
          "change": "Change q to 5 and predict again.",
          "displayCode": "static void main()\n{\n    /** o refers to an Order object */\n    Order o=new Order();\n    /** q stores the caller's quantity */\n    int q=2;\n    o.changeCopy(q);\n    System.out.println(\"Caller = \"+q);\n}",
          "snippetLabel": "Focus snippet · replacement main only; copy includes the full Order class"
        },
        {
          "id": "lab-state",
          "title": "A different method really changes the fields",
          "kind": "output",
          "example": "lab-state",
          "q": "Compare this with changeCopy. Why can the second display now differ?",
          "why": "accept assigns price and quantity on the object. The next display reads those new stored values.",
          "rule": "An instance method may change object fields; this differs from changing a local primitive parameter.",
          "change": "",
          "displayCode": "static void main()\n{\n    /** o refers to an Order object */\n    Order o=new Order();\n    o.accept(50,2);\n    o.display();\n    o.accept(50,3);\n    o.display();\n}",
          "snippetLabel": "Focus snippet · replacement main only; copy includes the full Order class"
        },
        {
          "id": "lab-static",
          "title": "Use the class name, with no object",
          "kind": "output",
          "example": "lab-static",
          "q": "Write both lines. Find the object creation statement—or explain why there is none.",
          "why": "twice is static. It receives an int and returns an int without needing an Order object.",
          "rule": "static describes how to call; int describes the returned value.",
          "change": "",
          "displayCode": "static void main()\n{\n    System.out.println(Order.twice(7));\n    System.out.println(Order.twice(10));\n}",
          "snippetLabel": "Focus snippet · replacement main only; copy includes the full Order class"
        },
        {
          "id": "lab-nested",
          "title": "A return value becomes another argument",
          "kind": "output",
          "example": "lab-nested",
          "q": "Follow the inner call first. Write the values passed to total, then the printed result.",
          "why": "twice(5) completes first. Its returned value becomes the first argument of total(int,int). That overload returns the product for println.",
          "rule": "Finish an inner call to get the argument value before tracing the outer call.",
          "change": "",
          "displayCode": "static void main()\n{\n    /** o refers to an Order object */\n    Order o=new Order();\n    o.accept(50,2);\n    System.out.println(o.total(Order.twice(5),3));\n}",
          "snippetLabel": "Focus snippet · replacement main only; copy includes the full Order class"
        },
        {
          "id": "lab-paper",
          "title": "Notebook: rebuild the useful methods",
          "kind": "paper",
          "example": "lab-paper",
          "q": "Close the complete program. Write class Order with private int price and quantity; accept(int p,int q) stores them; int total() returns their product; int total(int p,int q) returns the argument product; void display() prints Stored total = and the field-based result; static int twice(int n) returns twice n. Write static main that creates o, accepts 25 and 4, displays, prints Separate = and total(10,3), then Twice = and twice(6). Extra welcome/changeCopy methods in the comparison solution are optional. Predict the three lines.",
          "hint": "Write fields first, then five separate methods. total is overloaded by parameter count. main calls through o, except the static class call.",
          "checklist": [
            "Fields and parameters have /** */ descriptions",
            "All four parameter/return combinations understood",
            "total() and total(int,int) have different signatures",
            "accept changes fields; parameter-based total does not",
            "display prints while total returns",
            "Static call uses Order.twice",
            "Full main and three outputs written without copying"
          ]
        }
      ],
      "methodMap": [
        [
          "welcome()",
          "No parameters · void",
          "Prints a message"
        ],
        [
          "accept(int,int)",
          "Parameters · void",
          "Stores values in the object"
        ],
        [
          "total()",
          "No parameters · int",
          "Returns a calculation using fields"
        ],
        [
          "total(int,int)",
          "Parameters · int",
          "Returns a calculation using arguments"
        ],
        [
          "display()",
          "Instance method",
          "Prints the result of another method call"
        ],
        [
          "changeCopy(int)",
          "Primitive parameter copy",
          "Changes its local copy, not the caller"
        ],
        [
          "Order.twice(int)",
          "Static method · int",
          "Called through the class name"
        ]
      ]
    },
    {
      "id": "paper",
      "title": "7 · Write the answer sheet",
      "minutes": 12,
      "focus": "Two notebook tasks, solutions hidden",
      "tasks": [
        {
          "id": "paper-product",
          "title": "Notebook · method and call",
          "kind": "paper",
          "example": "paper-product",
          "q": "Write class Calculator with public int product(int x,int y). It returns the product. In static void main(), create an object, call it with 4 and 5, store the result, then print Product = followed by the result and a second line Back in main. Name the formal/actual parameters and write the signature.",
          "hint": "Define the method outside main. Return p; main stores the returned value.",
          "checklist": [
            "Typed formal parameters and int return type",
            "return supplies the product",
            "Object created before call",
            "Actual arguments have no type declarations",
            "All variables have /** */ descriptions",
            "Both output lines predicted"
          ]
        },
        {
          "id": "paper-area",
          "title": "Notebook · overloaded methods",
          "kind": "paper",
          "example": "paper-area",
          "q": "Write class Area with int area(int side) returning square area and int area(int length,int breadth) returning rectangle area. static void main() creates one object and prints labelled results for side 4 and rectangle 5 × 3. Write both signatures.",
          "hint": "Use the same name with different parameter counts. main prints each returned value.",
          "checklist": [
            "Two different signatures",
            "Each method returns a value",
            "Both helpers defined outside main",
            "Object created and both versions called",
            "All variables have /** */ descriptions",
            "Correct formulas, labels and paired braces"
          ]
        }
      ]
    }
  ]
};
})();
