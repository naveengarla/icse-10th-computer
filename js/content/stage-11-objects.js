/* M2 Stage 11 pilot. School source: ch02 notes, Mobile examples. */
(function () {
  var JP = globalThis.JP;
  JP.content.add({
  "id": "s11",
  "n": 11,
  "milestone": "M2",
  "minutes": 35,
  "title": "Class and object",
  "subtitle": "One blueprint. Separate objects. Their own field boxes.",
  "recap": [
    "A class is a blueprint; an object is an instance.",
    "State lives in data members; behaviour lives in member methods.",
    "new creates an object. A reference points to it.",
    "Two separate objects maintain independent state.",
    "Create the object, then call its methods with the dot operator."
  ],
  "cards": [
    {
      "type": "explore",
      "title": "Meet two mobiles",
      "intro": "<p>Start the program. Each <code>new Mobile()</code> creates a separate bundle of boxes. Click Next and look at the memory panel.</p>",
      "code": "class Mobile\n{\n    /** brand stores the mobile brand */\n    String brand;\n    /** price stores the price of one mobile */\n    int price;\n    /** q stores the quantity */\n    int q;\n    /** amt stores the total amount */\n    int amt;\n\n    void input()\n    {\n        brand=\"Nokia\";\n        price=7000;\n        q=2;\n    }\n\n    void calculate()\n    {\n        amt=price*q;\n    }\n\n    void display()\n    {\n        System.out.println(brand+\": \"+amt);\n    }\n\n    static void main()\n    {\n        /** a refers to the first Mobile object */\n        Mobile a=new Mobile();\n        /** b refers to a different Mobile object */\n        Mobile b=new Mobile();\n        a.input();\n        a.calculate();\n        b.display();\n        a.display();\n    }\n}",
      "tryThis": [
        "Change price=7000 to price=9000. Which object changes?",
        "Add b.input(); and b.calculate(); before b.display();. Predict the output first."
      ]
    },
    {
      "type": "learn",
      "title": "One blueprint, many objects",
      "body": "<p>A <strong>class</strong> is a blueprint or prototype. An <strong>object</strong> is one instance made from that class.</p><p><code>Mobile</code> is the blueprint. <code>new Mobile()</code> creates an object. The variable <code>a</code> refers to that object.</p><p>Two calls to <code>new Mobile()</code> create two objects of the same class.</p>",
      "key": "Same class. Separate objects. Separate state."
    },
    {
      "type": "learn",
      "title": "A value box or an object reference?",
      "body": "<p><code>int price</code> holds a primitive value. <code>Mobile a</code> holds a reference to an object.</p><p>The eight primitive types are <code>byte, short, int, long, float, double, char, boolean</code>.</p><p>A class is a user-defined or composite type. The school also calls these non-primitive or reference types. <code>String</code> is a reference type.</p>",
      "key": "The reference points to the bundle. It is not the bundle itself."
    },
    {
      "type": "learn",
      "title": "State and behaviour",
      "body": "<p><strong>State:</strong> the values in an object's data members. In Mobile these are <code>brand, price, q, amt</code>.</p><p><strong>Behaviour:</strong> its member methods. <code>input()</code> stores details; <code>calculate()</code> finds the amount; <code>display()</code> prints it.</p><p>Data members are also called fields, instance variables or attributes. Calling a method lets us use its task without following every internal detail (abstraction). A class groups its data and methods (encapsulation).</p>",
      "key": "Boxes describe state. Methods perform behaviour."
    },
    {
      "type": "watch",
      "title": "Before input: default values",
      "intro": "<p>Watch the fields appear when each object is created. Then predict what b prints before its display method prints the line. Fields get default values; uninitialized local variables do not.</p>",
      "code": "class Mobile\n{\n    /** brand stores the mobile brand */\n    String brand;\n    /** price stores the price of one mobile */\n    int price;\n    /** q stores the quantity */\n    int q;\n    /** amt stores the total amount */\n    int amt;\n\n    void input()\n    {\n        brand=\"Nokia\";\n        price=7000;\n        q=2;\n    }\n\n    void calculate()\n    {\n        amt=price*q;\n    }\n\n    void display()\n    {\n        System.out.println(brand+\": \"+amt);\n    }\n\n    static void main()\n    {\n        /** a refers to the first Mobile object */\n        Mobile a=new Mobile();\n        /** b refers to a different Mobile object */\n        Mobile b=new Mobile();\n        a.input();\n        a.calculate();\n        b.display();\n        a.display();\n    }\n}",
      "gates": [
        {
          "line": 26,
          "ask": "output",
          "q": "Only a has received details. What does b print?"
        }
      ],
      "after": "<p>Numeric fields start at 0 or 0.0; boolean at false; char at \\u0000; reference fields such as String at null.</p>"
    },
    {
      "type": "watch",
      "title": "Follow the dot to the right object",
      "intro": "<p><code>a.input()</code> runs input on the object referred to by a. Its field boxes remain after the method returns.</p>",
      "code": "class Mobile\n{\n    /** brand stores the mobile brand */\n    String brand;\n    /** price stores the price of one mobile */\n    int price;\n    /** q stores the quantity */\n    int q;\n    /** amt stores the total amount */\n    int amt;\n\n    void input()\n    {\n        brand=\"Nokia\";\n        price=7000;\n        q=2;\n    }\n\n    void calculate()\n    {\n        amt=price*q;\n    }\n\n    void display()\n    {\n        System.out.println(brand+\": \"+amt);\n    }\n\n    static void main()\n    {\n        /** a refers to the first Mobile object */\n        Mobile a=new Mobile();\n        a.input();\n        a.calculate();\n        a.display();\n    }\n}",
      "gates": [
        {
          "line": 15,
          "ask": "var:price",
          "q": "What value is now in this object's price field?"
        },
        {
          "line": 21,
          "ask": "var:amt",
          "q": "What will this object's amt field hold?"
        },
        {
          "line": 26,
          "ask": "output",
          "q": "Predict the printed line before revealing it."
        }
      ],
      "after": "<p>The method's local boxes disappear when it returns. The object's fields remain for the next method.</p>"
    },
    {
      "type": "predict",
      "title": "Did b receive a's details?",
      "q": "a has received details and calculated its amount. b has not. Write the exact two output lines.",
      "code": "class Mobile\n{\n    /** brand stores the mobile brand */\n    String brand;\n    /** price stores the price of one mobile */\n    int price;\n    /** q stores the quantity */\n    int q;\n    /** amt stores the total amount */\n    int amt;\n\n    void input()\n    {\n        brand=\"Nokia\";\n        price=7000;\n        q=2;\n    }\n\n    void calculate()\n    {\n        amt=price*q;\n    }\n\n    void display()\n    {\n        System.out.println(brand+\": \"+amt);\n    }\n\n    static void main()\n    {\n        /** a refers to the first Mobile object */\n        Mobile a=new Mobile();\n        /** b refers to a different Mobile object */\n        Mobile b=new Mobile();\n        a.input();\n        a.calculate();\n        b.display();\n        a.display();\n    }\n}",
      "ask": "output",
      "explain": "<p>Changing a's state does not change b's state. Each new object has its own fields.</p>"
    },
    {
      "type": "trace",
      "title": "Track two bundles separately",
      "q": "Complete the values after each display call. Use null for an uninitialized String field.",
      "code": "class Mobile\n{\n    /** brand stores the mobile brand */\n    String brand;\n    /** price stores the price of one mobile */\n    int price;\n    /** q stores the quantity */\n    int q;\n    /** amt stores the total amount */\n    int amt;\n\n    void input()\n    {\n        brand=\"Nokia\";\n        price=7000;\n        q=2;\n    }\n\n    void calculate()\n    {\n        amt=price*q;\n    }\n\n    void display()\n    {\n        System.out.println(brand+\": \"+amt);\n    }\n\n    static void main()\n    {\n        /** a refers to the first Mobile object */\n        Mobile a=new Mobile();\n        /** b refers to a different Mobile object */\n        Mobile b=new Mobile();\n        a.input();\n        a.calculate();\n        b.display();\n        a.display();\n    }\n}",
      "trace": {
        "cols": [
          "a.amt",
          "b.amt"
        ],
        "at": 26
      },
      "askOutput": true,
      "explain": "<p>Both references stay in main while display runs. Follow a and b to their separate amt boxes.</p>"
    },
    {
      "type": "explore",
      "title": "Give both objects their own details",
      "intro": "<p>Now both objects receive input and calculate. Change the price inside input. Predict both outputs, then run.</p>",
      "code": "class Mobile\n{\n    /** brand stores the mobile brand */\n    String brand;\n    /** price stores the price of one mobile */\n    int price;\n    /** q stores the quantity */\n    int q;\n    /** amt stores the total amount */\n    int amt;\n\n    void input()\n    {\n        brand=\"Nokia\";\n        price=7000;\n        q=2;\n    }\n\n    void calculate()\n    {\n        amt=price*q;\n    }\n\n    void display()\n    {\n        System.out.println(brand+\": \"+amt);\n    }\n\n    static void main()\n    {\n        /** a refers to the first Mobile object */\n        Mobile a=new Mobile();\n        /** b refers to a different Mobile object */\n        Mobile b=new Mobile();\n        a.input();\n        a.calculate();\n        b.input();\n        b.calculate();\n        b.display();\n        a.display();\n    }\n}",
      "tryThis": [
        "Remove b.calculate();. What will b print?",
        "Move a.display(); before a.calculate();. What is printed then?"
      ]
    },
    {
      "type": "bug",
      "title": "A static main needs an object",
      "q": "Click the line Java rejects. Which object should receive input?",
      "code": "class Mobile\n{\n    /** brand stores the mobile brand */\n    String brand;\n    /** price stores the price of one mobile */\n    int price;\n    /** q stores the quantity */\n    int q;\n    /** amt stores the total amount */\n    int amt;\n\n    void input()\n    {\n        brand=\"Nokia\";\n        price=7000;\n        q=2;\n    }\n\n    void calculate()\n    {\n        amt=price*q;\n    }\n\n    void display()\n    {\n        System.out.println(brand+\": \"+amt);\n    }\n\n    static void main()\n    {\n        /** a refers to the first Mobile object */\n        Mobile a=new Mobile();\n        input();\n        a.calculate();\n        a.display();\n    }\n}",
      "fixed": "class Mobile\n{\n    /** brand stores the mobile brand */\n    String brand;\n    /** price stores the price of one mobile */\n    int price;\n    /** q stores the quantity */\n    int q;\n    /** amt stores the total amount */\n    int amt;\n\n    void input()\n    {\n        brand=\"Nokia\";\n        price=7000;\n        q=2;\n    }\n\n    void calculate()\n    {\n        amt=price*q;\n    }\n\n    void display()\n    {\n        System.out.println(brand+\": \"+amt);\n    }\n\n    static void main()\n    {\n        /** a refers to the first Mobile object */\n        Mobile a=new Mobile();\n        a.input();\n        a.calculate();\n        a.display();\n    }\n}",
      "explain": "<p>input is an instance method. In static main, call it through an object: a.input();.</p>"
    },
    {
      "type": "fill",
      "title": "Create, then call",
      "q": "Complete the object creation and the member-method call.",
      "code": "class Mobile\n{\n    /** brand stores the mobile brand */\n    String brand;\n    /** price stores the price of one mobile */\n    int price;\n    /** q stores the quantity */\n    int q;\n    /** amt stores the total amount */\n    int amt;\n\n    void input()\n    {\n        brand=\"Nokia\";\n        price=7000;\n        q=2;\n    }\n\n    void calculate()\n    {\n        amt=price*q;\n    }\n\n    void display()\n    {\n        System.out.println(brand+\": \"+amt);\n    }\n\n    static void main()\n    {\n        /** a refers to the first Mobile object */\n        Mobile a=[[new]] Mobile();\n        a.input();\n        a.[[calculate]]();\n        a.display();\n    }\n}",
      "explain": "<p>new creates the object. The dot calls a method on that object.</p>"
    },
    {
      "type": "reorder",
      "title": "Put a small class together",
      "q": "Arrange the program. Create the object before using it.",
      "lines": [
        "class Ticket",
        "{",
        "    /** cost stores the ticket price */",
        "    int cost=50;",
        "    void display()",
        "    {",
        "        System.out.println(cost);",
        "    }",
        "    static void main()",
        "    {",
        "        /** t refers to a Ticket object */",
        "        Ticket t=new Ticket();",
        "        t.display();",
        "    }",
        "}"
      ],
      "explain": "<p>The field belongs to Ticket objects. main creates t, then calls its display method.</p>"
    },
    {
      "type": "quiz",
      "title": "Can you explain and predict?",
      "items": [
        {
          "type": "mcq",
          "q": "Which is the class in Mobile a=new Mobile();?",
          "options": [
            "Mobile",
            "a",
            "new"
          ],
          "answer": 0,
          "explain": "Mobile names the class. a is a reference variable."
        },
        {
          "type": "mcq",
          "q": "Which describes an object's behaviour?",
          "options": [
            "Its member methods",
            "Its field values",
            "Its class name"
          ],
          "answer": 0,
          "explain": "Methods perform tasks. Field values describe state."
        },
        {
          "type": "predict",
          "q": "Predict both output lines.",
          "code": "class Mobile\n{\n    /** brand stores the mobile brand */\n    String brand;\n    /** price stores the price of one mobile */\n    int price;\n    /** q stores the quantity */\n    int q;\n    /** amt stores the total amount */\n    int amt;\n\n    void input()\n    {\n        brand=\"Nokia\";\n        price=7000;\n        q=2;\n    }\n\n    void calculate()\n    {\n        amt=price*q;\n    }\n\n    void display()\n    {\n        System.out.println(brand+\": \"+amt);\n    }\n\n    static void main()\n    {\n        /** a refers to the first Mobile object */\n        Mobile a=new Mobile();\n        /** b refers to a different Mobile object */\n        Mobile b=new Mobile();\n        a.input();\n        a.calculate();\n        b.display();\n        a.display();\n    }\n}",
          "ask": "output"
        },
        {
          "type": "mcq",
          "q": "Which is a primitive type?",
          "options": [
            "int",
            "String",
            "Mobile"
          ],
          "answer": 0,
          "explain": "int is one of the eight primitive types."
        },
        {
          "type": "mcq",
          "q": "What is printed after creating a, before calling input?",
          "code": "class Mobile\n{\n    /** brand stores the mobile brand */\n    String brand;\n    /** price stores the price of one mobile */\n    int price;\n    /** q stores the quantity */\n    int q;\n    /** amt stores the total amount */\n    int amt;\n\n    void input()\n    {\n        brand=\"Nokia\";\n        price=7000;\n        q=2;\n    }\n\n    void calculate()\n    {\n        amt=price*q;\n    }\n\n    void display()\n    {\n        System.out.println(brand+\": \"+amt);\n    }\n\n    static void main()\n    {\n        /** a refers to the first Mobile object */\n        Mobile a=new Mobile();\n        a.display();\n    }\n}",
          "options": [
            "null: 0",
            "Nokia: 14000",
            "Nokia: 0"
          ],
          "answer": "output",
          "explain": "The fields still hold their default values."
        }
      ]
    },
    {
      "type": "paper",
      "title": "Notebook: build and use a class",
      "minutes": 10,
      "q": "<p>Define a class <strong>Mobile</strong> with String brand, int price, int q and int amt.</p><p>input() sets brand to Nokia, price to 7000 and q to 2. calculate() finds price × q. display() prints brand and amount. Write a main() method that creates an object and calls these methods in order.</p><p>Write the full program in your notebook, then predict its output.</p>",
      "hints": [
        "List the four fields before the methods.",
        "input stores details; calculate stores amt; display prints.",
        "In main, create the object before calling its methods."
      ],
      "structure": "class Mobile\n{\n    // Data members with variable descriptions\n    // void input()\n    // void calculate()\n    // void display()\n    // static void main(): create object and call methods\n}",
      "solution": "class Mobile\n{\n    /** brand stores the mobile brand */\n    String brand;\n    /** price stores the price of one mobile */\n    int price;\n    /** q stores the quantity */\n    int q;\n    /** amt stores the total amount */\n    int amt;\n\n    void input()\n    {\n        brand=\"Nokia\";\n        price=7000;\n        q=2;\n    }\n\n    void calculate()\n    {\n        amt=price*q;\n    }\n\n    void display()\n    {\n        System.out.println(brand+\": \"+amt);\n    }\n\n    static void main()\n    {\n        /** a refers to the first Mobile object */\n        Mobile a=new Mobile();\n        a.input();\n        a.calculate();\n        a.display();\n    }\n}",
      "checklist": [
        "Class name is Mobile and braces are paired.",
        "Every variable, including the object reference, has a /** */ description.",
        "Data members are declared inside the class and outside its methods.",
        "calculate stores price*q in amt.",
        "main creates an object using new Mobile().",
        "Calls are input → calculate → display through that object.",
        "I predicted the output before revealing the solution."
      ]
    }
  ]
});
})();
