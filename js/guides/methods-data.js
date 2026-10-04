/* School Chapter 3; executable examples and exam explanations. */
(function () {
var JP=globalThis.JP=globalThis.JP||{};
JP.guides=JP.guides||{};
JP.guides.methods={
  "title": "User-defined Methods",
  "sections": [
    {
      "id": "purpose",
      "title": "1. What is a method? Why use one?",
      "body": "<p>A <strong>method</strong> is a group of statements that performs a specific task. A <strong>user-defined method</strong> is one you write. A <strong>library method</strong> is already provided, such as Math.sqrt() or System.out.println().</p><p>Think of product as a small machine: give it two numbers, let it multiply, receive one result. You can reuse the machine with new inputs.</p><ul><li>Write a task once and call it many times.</li><li>Divide a large program into smaller tasks.</li><li>Find and correct mistakes in one task at a time.</li><li>Use a task without following its internal details every time.</li></ul><aside><strong>Exam wording:</strong> A method is a group of statements that performs a specific task.</aside><div data-example=\"product\"></div>"
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
      "id": "execution",
      "title": "4. Trace a method call on paper",
      "body": "<p>Methods do not run simply because their definitions appear above main. Follow calls, rather than reading every method body from top to bottom.</p><ol><li>main creates c.</li><li>main reaches <code>int result=c.product(4,5);</code> and waits for the result.</li><li>product receives x=4 and y=5 in its own parameter boxes.</li><li><code>p=x*y</code> stores 20 in p.</li><li><code>return p</code> sends 20 to the waiting call and ends this call.</li><li>main stores 20 in result, then runs its next println.</li></ol><p>Local variables such as p belong to that method call. A fresh call has its own parameter and local-variable values.</p><details><summary>Recall: after return p, which method continues?</summary><p>main continues. Its waiting call now has the returned value.</p></details>"
    },
    {
      "id": "return",
      "title": "5. Return type, return statement and void",
      "body": "<p>The <strong>return type</strong> is the promise in the header. The <strong>return statement</strong> fulfils that promise during execution.</p><ul><li><code>int product(...)</code> returns an integer value.</li><li><code>double average(...)</code> returns a double-compatible value.</li><li><code>void display()</code> returns no value.</li></ul><p>A return statement ends the current call immediately. A value-returning method must return a compatible value on every possible path. In our straight-line examples, return is the last executed statement.</p><p><code>return p;</code> sends a value to the caller. <code>System.out.println(p);</code> puts text on the screen. One does not replace the other.</p><table><tr><th>Method body</th><th>Effect</th></tr><tr><td>return x*y;</td><td>Caller receives the value; nothing is printed by this statement</td></tr><tr><td>System.out.println(x*y);</td><td>Value is printed; this statement does not return it</td></tr></table><p>Store a returned value with <code>int answer=c.product(4,5);</code>, or print it directly with <code>System.out.println(c.product(4,5));</code>. Calling <code>c.product(4,5);</code> alone discards the returned value.</p><details><summary>Fix it: int product(int x,int y) { System.out.println(x*y); }</summary><p>Add <code>return x*y;</code> if the method must return the product. Printing alone does not fulfil the int return type.</p></details>"
    },
    {
      "id": "four",
      "title": "6. The four kinds of methods",
      "body": "<table><tr><th>Kind</th><th>Example header</th><th>Call</th></tr><tr><td>No returned value, no parameters</td><td>void welcome()</td><td>t.welcome();</td></tr><tr><td>No returned value, parameters</td><td>void showSum(int x,int y)</td><td>t.showSum(2,3);</td></tr><tr><td>Returned value, parameters</td><td>int product(int x,int y)</td><td>System.out.println(t.product(4,5));</td></tr><tr><td>Returned value, no parameters</td><td>int fixedValue()</td><td>System.out.println(t.fixedValue());</td></tr></table><p><strong>Two checks:</strong> parentheses tell you about inputs; the return type tells you about the value coming back. A method with no parameters can still use an object's fields, as the next example shows.</p><div data-example=\"four\"></div>"
    },
    {
      "id": "noargs",
      "title": "7. Returning a value without parameters",
      "body": "<div data-example=\"noargs\"></div>"
    },
    {
      "id": "copy",
      "title": "8. Primitive arguments are copied",
      "body": "<div data-example=\"copy\"></div><details><summary>Recall: are x and n the same variable?</summary><p>No. They are different variables in different method calls, even when their starting values match.</p></details>"
    },
    {
      "id": "access",
      "title": "9. Access specifiers: Section-A definitions",
      "body": "<table><tr><th>Specifier</th><th>Accessible from</th></tr><tr><td>private</td><td>Within the declaring class</td></tr><tr><td>No specifier: default access</td><td>Within the same package</td></tr><tr><td>protected</td><td>Within the same package, and through inheritance outside the package</td></tr><tr><td>public</td><td>Anywhere</td></tr></table><p>Default access means omitting the keyword; you do not write <code>default void display()</code>. A package groups classes. For this chapter, learn the access definitions; an inheritance program is not needed.</p><p>The school notes have a public/protected wording typo. Use the definitions above.</p><details><summary>Recall: which access restricts a method to its own class?</summary><p>private.</p></details>"
    },
    {
      "id": "static",
      "title": "10. Static and non-static methods",
      "body": "<p>A <strong>static method</strong> is a class method. It can be called without creating an object. An <strong>instance / non-static method</strong> runs on an object.</p><table><tr><th>Definition</th><th>Call from static main</th></tr><tr><td>static int twice(int n)</td><td>Twice.twice(6); within Twice, twice(6) also works</td></tr><tr><td>int product(int x,int y)</td><td>Create c with new Calculator(), then c.product(4,5)</td></tr></table><p><strong>static</strong> describes how to call a method. <strong>int / void</strong> describes what it returns. They are separate parts of the header.</p><div data-example=\"static\"></div>"
    },
    {
      "id": "overloading",
      "title": "11. Method overloading: one name, different parameter lists",
      "body": "<p><strong>Method overloading</strong> means defining two or more methods in the same class with the same name and different parameter lists. The school connects it with <strong>polymorphism</strong>: the same method name can perform different tasks for different inputs.</p><p>It improves readability: one meaningful name can be used for related tasks on different inputs.</p><table><tr><th>Difference</th><th>Valid overload example</th></tr><tr><td>Number of parameters</td><td>area(int s) and area(int l,int b)</td></tr><tr><td>Parameter types</td><td>sum(int a,int b) and sum(double a,double b)</td></tr><tr><td>Order of parameter types</td><td>show(int n,char c) and show(char c,int n)</td></tr></table><p>Changing only parameter names is insufficient: <code>sum(int x,int y)</code> and <code>sum(int a,int b)</code> have the same signature. Changing only the return type is also insufficient.</p><details><summary>Can int sum(int a,int b) and double sum(int a,int b) be overloads?</summary><p>No. Both have the same signature sum(int,int). The return type alone does not distinguish overloads.</p></details>"
    },
    {
      "id": "selection",
      "title": "12. Which overloaded method runs?",
      "body": "<ol><li>Look at the method name.</li><li>Count the arguments.</li><li>Determine their types in order.</li><li>Match them to the method's parameter list.</li></ol><p>For these school examples, exact matches tell you the chosen version. 10 is int, 10.0 is double, and 'a' is char. If no exact match exists, Java may widen a primitive type, such as int to double. It does not automatically narrow double to int.</p><div data-example=\"overload\"></div>"
    },
    {
      "id": "order",
      "title": "13. Order matters in a parameter list",
      "body": "<div data-example=\"order\"></div>"
    },
    {
      "id": "examprogram",
      "title": "14. Q4: turn the specification into a complete program",
      "body": "<p>This task follows the school's first overloading practical.</p><ul><li><code>void compute(int,char)</code>: square if the character is s; otherwise cube.</li><li><code>void compute(double,char)</code>: cube volume if the character is v; otherwise cube diagonal √3 × side.</li><li><code>void compute(int,int,char)</code>: rectangle area if the character is a; otherwise perimeter.</li></ul><p><strong>Write first:</strong> one class, three separate methods, one main. Each method handles only its own task. main creates an object and calls every version.</p><div data-example=\"compute\"></div><aside><strong>Handwritten checklist:</strong> same method name; different parameter lists; correct return types; /** */ descriptions for every variable; correct formulas and branches; object created before calls; labelled output; paired braces.</aside>"
    },
    {
      "id": "mistakes",
      "title": "15. Common mistakes that cost marks",
      "body": "<table><tr><th>Mistake</th><th>Correction</th></tr><tr><td>c.product(int x,int y);</td><td>Supply values: c.product(4,5);</td></tr><tr><td>int method prints but never returns</td><td>Return a compatible value on every path</td></tr><tr><td>void result stored in an int variable</td><td>A void call has no value to store</td></tr><tr><td>Method declared inside main</td><td>Define methods separately inside the class</td></tr><tr><td>Method header ends with ; before its body</td><td>Place the opening brace after the header</td></tr><tr><td>Static main calls an instance method directly</td><td>Create an object and use object.method(...)</td></tr><tr><td>Two overloads differ only in return type</td><td>Change number, types or order of parameters</td></tr><tr><td>5 used when the intended overload needs double</td><td>Use 5.0 for an exact double match</td></tr><tr><td>Assuming changing a primitive formal parameter changes the caller</td><td>Trace separate boxes; its value was copied</td></tr></table>"
    },
    {
      "id": "recall",
      "title": "16. Short exam practice: cover, answer, reveal",
      "body": "<p>Answer on paper before opening each answer. One or two clear sentences are enough for these concept checks.</p><details><summary>1. Define a user-defined method.</summary><p>A group of statements written by the programmer to perform a specific task.</p></details><details><summary>2. State two advantages of methods.</summary><p>They allow code reuse and divide a program into smaller tasks that are easier to check and maintain.</p></details><details><summary>3. In int product(int x,int y), name the return type and formal parameters.</summary><p>Return type: int. Formal parameters: x and y, both int.</p></details><details><summary>4. Write its signature.</summary><p>product(int,int). The return type and parameter names are excluded.</p></details><details><summary>5. Distinguish actual and formal parameters.</summary><p>Actual parameters are values or expressions supplied in a call. Formal parameters are the typed variables declared in the method header to receive those values.</p></details><details><summary>6. Distinguish return and println.</summary><p>return sends a value to the caller and ends the call. println displays output; it does not return that value to the caller.</p></details><details><summary>7. Define method overloading.</summary><p>Two or more methods in the same class have the same name but different parameter lists.</p></details><details><summary>8. How do you call an instance method from static main?</summary><p>Create an object and call the method through it, for example Calculator c=new Calculator(); then c.product(4,5);.</p></details><details><summary>9. Can a method have no parameters and return a value?</summary><p>Yes. int fixedValue() is one example; int sum() can also return a value calculated from object fields.</p></details><details><summary>10. Which two methods are valid overloads: sum(int,int), sum(double,double), or another sum(int,int) with new parameter names?</summary><p>sum(int,int) and sum(double,double). New parameter names alone do not create a new signature.</p></details>"
    },
    {
      "id": "paper",
      "title": "17. Final notebook task: use the knowledge without copying",
      "body": "<p>Allow about 10 minutes. Close the example solutions.</p><ol><li>Write class Area with <code>int area(int side)</code> returning a square's area and <code>int area(int length,int breadth)</code> returning a rectangle's area.</li><li>Write static void main() that creates one Area object, calls both versions, and prints labelled results for side 4 and rectangle 5 × 3.</li><li>Underline formal parameters, circle actual parameters and write both signatures.</li><li>Predict both lines, then compare with the solution below.</li></ol><details><summary>I have written it — show the solution</summary><div data-example=\"area\"></div></details><aside><strong>Self-check:</strong> methods outside main; distinct signatures; return statements; object call; comments; labelled output; correct arithmetic. If one part was wrong, rewrite that part and try once more.</aside>"
    },
    {
      "id": "revision",
      "title": "18. Two-minute revision",
      "body": "<ul><li><strong>Method:</strong> one task, reusable statements.</li><li><strong>Header / prototype:</strong> declaration without body.</li><li><strong>Signature:</strong> name + parameter types in order.</li><li><strong>Body:</strong> statements inside braces.</li><li><strong>Formal:</strong> typed input variables in the definition.</li><li><strong>Actual:</strong> arguments supplied by the call.</li><li><strong>Primitive inputs:</strong> copied into separate boxes.</li><li><strong>return:</strong> sends a value back and ends the call.</li><li><strong>void:</strong> no returned value.</li><li><strong>Four kinds:</strong> inputs yes/no × returned value yes/no.</li><li><strong>static:</strong> callable without an object; instance method needs an object.</li><li><strong>Overloading:</strong> same name, different parameter lists.</li><li><strong>Not enough for overloading:</strong> changing only return type or parameter names.</li></ul><p><strong>Ready to move on?</strong> You can trace a call, explain its inputs and return, select an overload and write the notebook program without copying.</p>"
    }
  ],
  "examples": [
    {
      "id": "product",
      "title": "A complete method and its caller",
      "code": "class Calculator\n{\n    /** x and y receive the two numbers */\n    public int product(int x, int y)\n    {\n        /** p stores their product */\n        int p=x*y;\n        return p;\n    }\n\n    static void main()\n    {\n        /** c refers to a Calculator object */\n        Calculator c=new Calculator();\n        /** result stores the returned value */\n        int result=c.product(4,5);\n        System.out.println(\"Product = \"+result);\n        System.out.println(\"Back in main\");\n    }\n}",
      "before": "Read main first. Predict the product of 4 and 5. Then follow its call into product.",
      "after": "The method returns its result. main stores it and prints it. The second printed line proves that execution continues in main.",
      "tryThis": "Change the call to c.product(7,3). Predict, run, and compare."
    },
    {
      "id": "four",
      "title": "Run all four kinds",
      "code": "class Tasks\n{\n    void welcome()\n    {\n        System.out.println(\"Welcome\");\n    }\n    /** x and y receive the numbers to add */\n    void showSum(int x, int y)\n    {\n        System.out.println(\"Sum = \"+(x+y));\n    }\n    /** x and y receive the numbers to multiply */\n    int product(int x, int y)\n    {\n        return x*y;\n    }\n    int fixedValue()\n    {\n        return 10;\n    }\n    static void main()\n    {\n        /** t refers to a Tasks object */\n        Tasks t=new Tasks();\n        t.welcome();\n        t.showSum(2,3);\n        System.out.println(t.product(4,5));\n        System.out.println(t.fixedValue());\n    }\n}",
      "before": "Predict four output lines. Notice that the first two methods print internally; main prints the values returned by the other two.",
      "after": "void is a return-type keyword. It means no value is returned; it does not mean no statements run.",
      "tryThis": "Change fixedValue to return 25. Which output line changes?"
    },
    {
      "id": "noargs",
      "title": "sum() reads the object’s stored values",
      "code": "class Total\n{\n    /** x stores the first number */\n    int x;\n    /** y stores the second number */\n    int y;\n    /** a and b receive the values to store */\n    void input(int a, int b)\n    {\n        x=a;\n        y=b;\n    }\n    int sum()\n    {\n        return x+y;\n    }\n    static void main()\n    {\n        /** t refers to a Total object */\n        Total t=new Total();\n        t.input(5,6);\n        /** sm stores the returned sum */\n        int sm=t.sum();\n        System.out.println(\"Sum = \"+sm);\n    }\n}",
      "before": "input stores the two fields first. sum has empty parentheses because it reads those stored fields instead of receiving new arguments.",
      "after": "The school Type4 example prints an undefined p; this working version prints sm, the variable holding the returned sum.",
      "tryThis": "Change t.input(5,6) to t.input(8,9). Leave sum() unchanged."
    },
    {
      "id": "copy",
      "title": "Changing n leaves x unchanged",
      "code": "class Change\n{\n    /** n receives a copy of the argument */\n    void change(int n)\n    {\n        n=n+5;\n        System.out.println(\"Inside = \"+n);\n    }\n\n    static void main()\n    {\n        /** c refers to a Change object */\n        Change c=new Change();\n        /** x stores the original number */\n        int x=3;\n        c.change(x);\n        System.out.println(\"After = \"+x);\n    }\n}",
      "before": "Write two boxes on paper: x in main and n in change. Both initially contain 3. Only n is increased.",
      "after": "The school calls this call by value. The primitive value is copied into the formal parameter. Changing that parameter does not change the caller’s variable.",
      "tryThis": "Set x to 10. Predict the Inside and After lines before running."
    },
    {
      "id": "static",
      "title": "Call through the class name",
      "code": "class Twice\n{\n    /** n receives the number to double */\n    static int twice(int n)\n    {\n        return 2*n;\n    }\n    static void main()\n    {\n        System.out.println(Twice.twice(6));\n    }\n}",
      "before": "No Twice object is created. The class name is used to call its static method.",
      "after": "A static method cannot directly use an instance field or call an instance method without an object.",
      "tryThis": "Replace Twice.twice(6) with twice(6). It still works because main is in the same class."
    },
    {
      "id": "overload",
      "title": "Same name, three input types",
      "code": "class Sum\n{\n    /** a and b receive two integers */\n    void sum(int a, int b)\n    {\n        System.out.println(\"int: \"+(a+b));\n    }\n    /** a and b receive two doubles */\n    void sum(double a, double b)\n    {\n        System.out.println(\"double: \"+(a+b));\n    }\n    /** a and b receive two characters */\n    void sum(char a, char b)\n    {\n        System.out.println(\"char: \"+(a+b));\n    }\n    static void main()\n    {\n        /** s refers to a Sum object */\n        Sum s=new Sum();\n        s.sum(10,20);\n        s.sum(12.5,13.5);\n        s.sum('a','b');\n    }\n}",
      "before": "Predict the three lines. In the char method, a+b adds character codes; it does not join letters.",
      "after": "Java chooses the method from the argument types. The school example has spaces inside character literals; the runnable version correctly uses single characters.",
      "tryThis": "Change s.sum(10,20) to s.sum(10.0,20.0). Which version runs?"
    },
    {
      "id": "order",
      "title": "Two signatures, the same two types",
      "code": "class Order\n{\n    /** n stores a number and c stores a character */\n    void show(int n, char c)\n    {\n        System.out.println(\"int then char\");\n    }\n    /** c stores a character and n stores a number */\n    void show(char c, int n)\n    {\n        System.out.println(\"char then int\");\n    }\n    static void main()\n    {\n        /** o refers to an Order object */\n        Order o=new Order();\n        o.show(3,'A');\n        o.show('A',3);\n    }\n}",
      "before": "The types are the same pair, but their order changes. Match each call from left to right.",
      "after": "show(int,char) and show(char,int) are different signatures.",
      "tryThis": "Swap the order of the two calls. Predict the new output order."
    },
    {
      "id": "compute",
      "title": "Full school-style overloading answer",
      "code": "class Compute\n{\n    /** a stores an integer and b selects square or cube */\n    void compute(int a, char b)\n    {\n        if(b=='s' || b=='S')\n        {\n            System.out.println(\"Square=\"+(a*a));\n        }\n        else\n        {\n            System.out.println(\"Cube=\"+(a*a*a));\n        }\n    }\n    /** x stores a side length and y selects volume or diagonal */\n    void compute(double x, char y)\n    {\n        if(y=='v' || y=='V')\n        {\n            System.out.println(\"Cube=\"+(x*x*x));\n        }\n        else\n        {\n            System.out.println(\"Diagonal=\"+(Math.sqrt(3)*x));\n        }\n    }\n    /** a and b store length and breadth; c selects area or perimeter */\n    void compute(int a, int b, char c)\n    {\n        if(c=='a' || c=='A')\n        {\n            System.out.println(\"Area=\"+(a*b));\n        }\n        else\n        {\n            System.out.println(\"Perimeter=\"+(2*(a+b)));\n        }\n    }\n    static void main()\n    {\n        /** obj refers to a Compute object */\n        Compute obj=new Compute();\n        obj.compute(5,'s');\n        obj.compute(3.0,'v');\n        obj.compute(10,5,'a');\n    }\n}",
      "before": "For each call, identify the signature first. Then follow the condition inside that version. Overload selection and if/else selection are different decisions.",
      "after": "5 is int, so the first call selects compute(int,char). 3.0 is double, so the second selects compute(double,char). Three arguments select the third version.",
      "tryThis": "Change the calls to compute(5,'c'), compute(3.0,'d') and compute(10,5,'p'). Predict each formula used, then run."
    },
    {
      "id": "area",
      "title": "Notebook answer to compare",
      "code": "class Area\n{\n    /** side stores the side of the square */\n    int area(int side)\n    {\n        return side*side;\n    }\n    /** length and breadth store rectangle dimensions */\n    int area(int length, int breadth)\n    {\n        return length*breadth;\n    }\n    static void main()\n    {\n        /** a refers to an Area object */\n        Area a=new Area();\n        System.out.println(\"Square = \"+a.area(4));\n        System.out.println(\"Rectangle = \"+a.area(5,3));\n    }\n}",
      "before": "Check the two signatures before comparing the formulas.",
      "after": "Both methods return int. main prints the returned values. Neither helper needs its own println.",
      "tryThis": "Use side 6 and rectangle 8 × 2. Predict before running."
    }
  ]
};
})();
