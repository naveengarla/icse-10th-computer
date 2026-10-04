# Chapter 3 – User Defined Methods

> Transcribed from school-provided chapter notes (pages 1–9). Authority for depth and style of exam answers — see docs/01-problem-statement.md.

*(Each page carries the footer "Chapter-2 User Defined Methods — Page N" — the footer says "Chapter-2" although the heading is "Chapter-3"; not repeated below.)*

---

<!-- Page 1 -->

## Chapter-3: User Defined Methods

**Introduction:** You have already learnt that every object has different characteristics and behaviour. Characteristics are implemented through variable and behaviour is implemented through methods (functions). Every Java class contains function (s) which is used to perform various tasks. In the previous chapter you learnt all the inbuilt functions which are available as a part of various classes under different packages. In this chapter you will learn how to define the function on your own to perform various tasks.

A function or a method in Java is defined as a group of statements which performs a specific task. Generally functions are classified into two. They are:

- Inbuilt Functions
- User Defined Functions

> Functions are also called as modules or subroutines or procedures. It can also be defined as subprogram within a main program which processes data and returns a value.

**Inbuilt Functions** are available as a part of Java library.

**Example:** print ( ), charAt ( ), sin ( ), etc.,

**User Defined Functions** are defined by the user to perform a specific task by writing the logic according to the requirement of a situation.

**Example:** Display ( ), Calculate ( ), etc.,

### Advantages of User Defined Functions:

- Can be defined once and executed many number of times.
- Better Memory Management.
- Easy to debug and maintain.
- Divides the program into smaller units called modules.
- It hides the details of how the problem is being solved from the user.

### Syntax:

```java
[access-specifier] [modifier] return-type function-name (parameters)
{

  statements;

}
```

<!-- Page 2 -->

| | | |
|---|---|---|
| access-specifier | - | can be private, public, protected or default access. It determines the amount of access the function has been given by the rest of the program.<br><br>private: if the member (data member/function) of a class is private, it can be accessed only within the class.<br><br>public: if the member (data member/function) of a class is public, it can be accessed within the class, within the package and outside the package.<br><br>protected: if the member (data member/function) of a class is public, it can be accessed within the class, within the package and outside the package in an inherited class.<br><br>When no access specifier is used for the member of a class then it can be accessed within the class and within the package only. |
| modifier | - | can be static which enables the method to be called without creating object. If a function is not static then object has to be created to access it. |
| return-type | - | determines the data which a function returns when it is executed. It can return data of any primitive type or non-primitive depending upon how it is defined. In case if the function is not returning any value then void keyword must be used. |
| Function-name | - | valid java identifier. |
| Parameters | - | A function can exist with or without parameter. Parameters are used to accept data of any type to process it and give the output. |
| { } | - | Function block which has statements to be executed when it is called. |

### Parts of a function:

- Function Header/Function Prototype.
- Function Body.

**Function Header:** It is the declaration of a function that omits the function body.

**Function Signature:** It is the part of function header which included method name along with the list of parameters.

**Function Body:** The remainder of the method after the header which has block of statements enclosed within the pair of { }.

<!-- Page 3 -->

A function or method can be defined in the following ways:

- Function with no return type and no parameters.
- Function with no return type and with parameters.
- Function with return type and with parameters.
- Function with return type and no parameters.

Let's learn in detail how to define each of the above ways of defining functions:

### Example 1:

```java
class Type1
{
  public void Display ( ) //Function with no return type and no parameters
   {
       System.out.println ("Welcome");
   }
  public static void main ()
  {     Type1 t = new Type1 ( );
        t.Display ( ); // Calling function
  } }
```

> When a function is invoked (called) within any other function is called sub-function. In this example, Display() is called sub-function because it is invoked within main ()

### Example 2:

```java
class Type2
{
 public void Calculate (int x, int y) // Function with no return type and parameters
  {
      int add=x+y;
      System.out.println ("Result is "+add);
  }
 public  static void main ( )
  {
     Type2 t = new Type2 ( );
     t. Calculate (10, 20); // Calling Function
  }
}
```

*[Annotation: a bracket over `int x, int y` is labelled "Formal Parameters"; a bracket under `10, 20` is labelled "Actual Parameters or arguments".]*

In the above example, the method Calculate ( ) has two parameters **int x** and **int y**. These parameters are called as formal parameters. Formal parameters always precede with the data type. In the calling statement t.Calculate (10, 20); the values 10 and 20 are passed to the formal parameters x and y. Therefore **10** and **20** are called as Actual parameters or arguments. Actual parameters do not precede with the data type.

<!-- Page 4 -->

### Example 3:

```java
  class Type3
{
public  int Calculate (int x, int y)
                       // Function with return type and parameters
  {
     int pro=x*y;
     return pro;
  }
 public  static void main ( )
  {
     Type3 t = new Type3 ( );
     int p=t. Calculate (4, 5); // Calling Function
     System.out.println ("Product = "+p);
           [OR]
     System.out.println ("Product = "+ t. Calculate (4, 5));
  }
}
```

*[Annotation: `int pro=x*y;` is circled; a vertical label "Returning the value to the calling place of method" with a connector links `return pro;` to the calling statement `int p=t. Calculate (4, 5);`.]*

> return is the jump statement. When return statement is executed, the control gets transferred to the calling place of the method with a value. A method can return only one value. return statement should be the last statement in a method. The return datatype and the datatype of the value to be returned should exactly match.

### Example 4:

```java
class Type4
{
  int x, y, sum; // data members

  void input (int a, int b)
  {
     x = a;
     y = b;
  }
 public  int Sum () // Function with return type and no parameters
  {
      int s=x+y;
      return s;
  }
 public static void main ( )
 {  Type4 t = new Type4 ( );
     t.input (5,6);
     int sm=t. Sum ( ); // Calling Function
     System.out.println ("Sum = "+p);   }   }
```

*[Annotation: a brace beside `x = a;` and `y = b;` is labelled "Initializing the data members x and y through formal parameters a and b".]*

<!-- Page 5 -->

### Pure and Impure Functions

**Pure and Impure Functions:** When a function doesn't modify the state of an object/value of a method argument(s) variable(s)/formal parameter(s) , then it is called as Pure function or Accessor method. When the object's state/ value of a method argument(s) variable(s)/formal parameter(s) is modified in a function, then it is called as Impure Function or Mutator method.

**Example:**

```java
class Bank
{
  int balance=1000; //state of an object
 public  void Show_balance ( ) //Pure Function
  {
    System.out.println ("Balance is "+balance);
  }
 public  void Deposit (int d) //Impure Function
  {
    balance+=d;
  }
 public static void main ( )
  {
    Bank b = new Bank ( );
    b.Show_balance ( );
    b.Deposit (2000);   } }
```

> In this class Bank, the method Show_balance ( ) is pure function because the state of the object i.e., the data member balance is not modified whereas the method Deposit (int d) is called Impure Function because the state of an object balance is modified by adding 2000.

### Calling a function

**Calling a function:** A function can be called or invoked in two ways.

- Call By Value or Pass By Value
- Call By Reference or Pass By Reference

**Call By Value or pass By Value:** In call by value always primitive data type values are passed as parameters to a method. When the function is called (invoked) the compiler generates a copy of actual parameters and sent to formal parameters. Any changes done to the formal parameter will not get reflected in the actual parameters.

**Example:**

```java
class Display
{
  public void Numbers (int n)
   {
      for (int i=1;i<=n; i++)
      System.out.println (i);

      n=n+5; // formal parameter's value is changed.
   }
  public static void main (int x)
   {
     Display d = new Display ( );

     System.out.println ("The value of actual parameter before calling the

     function");

     System.out.println (x);
      d.Numbers (x); //calling Function by passing value

      System.out.println ("The value of actual parameter after calling the
      function");

     System.out.println (x);

   }
}
```

*[The program continues from page 5 to page 6. The string literals in the two `println` statements wrap onto a second line in the PDF, as shown above.]*

<!-- Page 6 -->

> In this example, int n is the formal parameter and x is called actual parameter. Any changes done to the formal parameter n, the actual parameter x is not affected.

**Call By Reference:** In Call by reference, composite type is passed as actual parameter to a method. When the function is called the reference (Address) of an actual parameter is sent to formal parameter. Any changes done through formal parameter it is reflected in the actual parameter itself. In this concept, the compiler does not create a copy of actual parameter.

**Example:** object is passed as actual parameter to a method. The address(reference) of object is sent to formal parameter.

Note: Programs on call by reference is out of the scope of syllabus.

### Function Overloading or Method Overloading

**Function Overloading or Method Overloading:-** Till now in programs you have implemented the following OOP's concepts – Object, Class, Data Abstraction, Data Encapsulation and Message Passing (via parameters). Now you are going to learn how to implement the OOP concept Polymorphism. You know through this concept that one object can behave differently according to the situations. The concept Polymorphism is implemented in java through function overloading or method overloading.

> Two or more functions or methods within the class having same name but performing different tasks differentiated either with the help of no. of parameters or data type of parameters is known as function overloading or method overloading.

**Need for function overloading:**

Improves the readability of a program.

Implementing the same function for different types of data.

<!-- Page 7 -->

**Example:**

```java
class Calc
{
public void Sum (int a, int b)
{
  System.out.println ("Sum="+(a+b));
}
public void Sum (char a, char b)
{
  System.out.println ("Sum="+(a+b));
}
public void Sum (double a, double b)
{
  System.out.println ("Sum="+(a+b));
}
public static void main()
{
  Calc ob=new Calc ( );
  ob. Sum (10, 20);
  ob. Sum (12.5, 13.5);
  ob. Sum('a ', 'b ');
}
}
```

In the above example the object ob performs three different actions using one common function Sum ( ) differentiated with the help of data type of parameters. Thus implementing the OOP concept Polymorphism.

### static data members and static member functions:

We know that every object has certain characteristics and behaviour. The characteristics will be maintained independently in different objects. The changes done to the characteristics present in one object will not interfere with other objects. There are certain situations where multiple objects need to access the common characteristics. This can done by making the data members declared with a static keyword.

> static variables and static functions are also called as class variables and class functions. Once the static variable is created, the compiler reserves separate memory space for static variables, contradictory to instance variables; it has a independent copy in every object. static variable's value is common to all the objects. static variable's value is not maintained independently in every object. It is common to all the objects. Any object can change static variable's value.

<!-- Page 8 -->

**Rules:**

- data members or functions must be declared with static keyword.

  **Example:**

  ```java
  class static_demo
  {
      static int x;--------------------->static data member
     public  static void display ( )--------->static function
     {
        System.out.println (x);
     }
  }
  ```

- static data members can be accessed in static function or non-static function.

  **Example 1:**

  ```java
  class static_demo
  {
      static int x;
     public  void store ( )
     {
        x=10;
     }
     void display ( )
     {
        store ();
        System.out.println (x);
     }
  }
  ```

  **Example 2:**

  ```java
  class static_demo
  {
    static int x;
   public static void input (int y)
    {
       x=y;
    }
    public static void display ( )
    {
     input (10);
     System.out.println (x);
    }
  }
  ```

- within the class static data members and static functions can be accessed directly without creating an object for the class.

<!-- Page 9 -->

  **Example:**

  ```java
  class static_demo
  {
      static int x;
   public static void input (int y)
   {
      x=y;
   }
  public  static void display ( )
   {
      System.out.println (x);
   }
   public static void main ( )
   {
      input (5);
      display ();
      static_demo ob1=new static_demo ( );
      static_demo ob2=new static_demo ( );
      static_demo ob3=new static_demo ( );
      ob1.input (10);
      ob1.display ( );
      ob2.display ( );
      ob3.display ( );
      ob2.input (15);
      ob2.display ( );
      ob1.display ( );
      ob3.display ( );
   }
  }
  ```

> This example illustrates that static members can be accessed without the help of object and can also be accessed with the help of an object. Here 3 objects created ob1, ob2 and ob3. The static data member x is common to all the objects i.e., the value of x will be shared by all the objects.

| Static variable (class variable) | Instance variable |
|---|---|
| Static variable is created when the class is first referred to. | Instance variable is created when an object of the class is created. |
| Static variable is destroyed when the class is destroyed. | Instance variable is destroyed when the object is destroyed. |
| Any changes made to the value of static variable is visible to all the objects of the given class. | Changes made on instance variable does not affect the same variable belonging to different object. |
| Static variable can be accessed without creating an object in the same class both in static function or non-static function. | Instance variable can be accessed without creating object in a non-static function in the same class. But to access instance variable in a static function, can be done using objectname and dot operator within the same class. |
| Static variable's value is common to all the objects from the same class. It is shared by all the objects formed from the class which has the static variable. | Instance variable's value is not shared by different objects formed from the same class. |
