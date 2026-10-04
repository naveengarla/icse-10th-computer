# Chapter 2 – Class as the basis of all computations

> Transcribed from school-provided chapter notes (pages 1–10). Authority for depth and style of exam answers — see docs/01-problem-statement.md.

*(Each page carries the footer "Chapter-2 Class as the basis of all computations — Page N"; not repeated below.)*

---

<!-- Page 1 -->

## Chapter-2: Class as the basis of all computations

We have learnt that data types are classified into primitive and reference data types. Let's recall the various primitive data types used in programming. There are 8 primitive data types in java, they are byte, short, int, long, float, double, char and boolean. Each of these primitive data types has fixed storage capacity. Java allows programmers to create their own data types by making use of existing primitive data types, which is called as Composite data type.

> Composite data types are otherwise called as User-defined /reference/derived/non-primitive types data types. Example: class, array, String, Wrapper classes etc.,

Let's learn how to create a user defined data type.

**Syntax:**

```java
class classname
{
  datamember1;
  datamember2;
  datamember n;

   member functions

  constructors
```

*[The syntax box in the PDF ends after "constructors" without a closing brace.]*

Since Java is an Object Oriented Programming Language. It implements all the OOP concepts such as class, object, abstraction, encapsulation, inheritance, polymorphism and message passing. You have learnt these concepts with real world examples. Now you are going to learn these OOP concepts by implementing in a program which becomes more efficient way to understand the real usage of OOP concept in java applications.

**Class:** It is a blue print or prototype of an object. Using a class, numerous objects can be created.

**Object:** It is an instance of a class. It maintains the state and behaviour of an object. In terms of software the state of an object can be implemented through data members and the behaviour of an object is implemented through member functions.

> State of an object is otherwise called as characteristics, fields, instance variables, member variables, attributes.
>
> Behaviour of an object is otherwise called as Member functions, Member methods.

<!-- Page 2 -->

### Example 1:

```java
class Student
{
  String name;
  int age;


  void input()
  {
    name="Abhishek";
    age=15;
  }
  void display()
  {
    System.out.println("Name is "+name);
    System.out.println("Age is "+age);
  }
}
```

*[Annotation: arrows point from `String name;` and `int age;` to a label "Data Members"; arrows point from `void input()` and `void display()` to a label "Member functions".]*

In the above example, the class is Student. The object for this class is created using the following steps:

1. Right-Click on the class Student and select the option new Student().

   *[Screenshot: BlueJ right-click menu on class "Student" showing options new Student(), Open Editor, Compile, Inspect, Remove.]*

2. Create Object (instance) dialog box appears.
   Enter the name of instance (object) or
   you can use the default name.
   Here the name of object is S
   Click ok.

   *[Screenshot: "BlueJ: Create Object" dialog for Student() with "Name of Instance: S" and Ok / Cancel buttons.]*

<!-- Page 3 -->

3. The object S gets created for the class Student.

   *[Screenshot: BlueJ object bench showing a red object "S: Student"; status bar "Creating object... Done."]*

Inspecting Object:

Right-Click on the object and click on Inspect.

*[Screenshot: right-click menu on object S showing "inherited from Object", void display(), void input(), Inspect (highlighted), Remove.]*

*[Screenshot: Object inspector "S : Student" showing String name = null, int age = 0; buttons Inspect, Get, Show static fields, Close.]*

The above dialog box displays the characteristics of the object S which gets initialized to the default values null and 0.

The behaviour of the object is performed by calling the methods input () and display () as follows:

1. Right Click on the object S and select the first behaviour called input () which performs an action of initializing the data members name and age.

   *[Screenshot: right-click menu on object S with "void input()" highlighted.]*

<!-- Page 4 -->

Now the data members are initialized with the values. When you inspect the object, it shows the following values in object.

*[Screenshot: Object inspector "S : Student" showing String name = "Abhishek", int age = 15.]*

2. Right Click on the object S and select display () function, which displays the name and age which was initialized using input () function.

   *[Screenshot: right-click menu on object "S: Student" with "void display()" highlighted.]*

The following output appears after selecting display () function.

*[Screenshot: BlueJ Terminal Window showing the output:]*

```
Name is Abhishek
Age is 15
```

> The process of creating an object for a class is called instantiation.

In the above example, the following OOP concepts are implemented.

Class → Which is a blue print of an object S, We can create many objects like S which has similar characteristics name and age.

Object → S which belongs to type Student.

Data Abstraction → It is the principle of essential details by ignoring the implementation details. In the above example for the class Student we have two methods input() and display().We call these methods to perform the specific tasks. The implementation details of the method input ( ) and display ( ) is ignored by the user.

Data Encapsulation → class acts as a wrapper to protect the data there by providing security by encapsulating the data within the object.

<!-- Page 5 -->

| Primitive Data type | Composite Data type |
|---|---|
| Data types that are provided by java and allows specific type of data to be stored by a variable. | Data types created by programmer which makes use of primitive data type to create a variable as per the user's requirement. |
| The size is fixed | The size depends on the number of member variables and their types |
| To create a variable of primitive data type, new keyword is not used. | To create an object variable we make use of new keyword. |

### Example 2:

Define a class **Mobile** having the following description:-

**Data Members/Instance Variables:**

| | | |
|---|---|---|
| String brand | - | stores the brand name. |
| int price | - | stores the price of a mobile. |
| int q | - | stores the no. of quantities purchased. |
| int amt | - | stores the amount to be paid by the customer. |

**Member functions:**

| | | |
|---|---|---|
| void input ( ) | - | accept values for brand name, price and quantity q from the user. |
| void calculate ( ) | - | calculate the amt by multiplying the price with quantity q. |
| void display ( ) | - | Display the brand name, price, quantity and amount. |

```java
//Program
import java.util.*;
class Mobile
{
  String brand;
  int price;
  int q;
  int amt;

  void input()
  {
    Scanner sc=new Scanner(System.in);
    System.out.println("Enter the brand name");
    brand=sc.nextLine();
    System.out.println("Enter the price");
    price=sc.nextInt();
    System.out.println("Enter the no. of mobiles to be purchased");
    q=sc.nextInt();
  }
  void calculate()
  {
    amt=price*q;
  }
  void display()
  {
    System.out.println("Brand Name : "+brand);
    System.out.println("Price      : "+price);
    System.out.println("Quantity   : "+q);
    System.out.println("Amount     : "+amt);
  }
}
```

<!-- Page 6 (program continues from page 5 to page 6) -->

Creating two objects for the above class Mobile.

*[Screenshot: BlueJ object bench showing two objects "M1: Mobile" and "M2: Mobile".]*

<!-- Page 7 -->

Inspecting both the objects M1, M2

*[Screenshot: two object inspectors "M1 : Mobile" and "M2 : Mobile", each showing String brand = null, int price = 0, int q = 0, int amt = 0.]*

In the above dialog boxes, we can make out that the data members are maintained independently in each object. Any changes done to the values present in the object M1, will not affect the values present in the object M2.

The object's state after calling the functions accept (), calculate () and display ().

*[Screenshot: two object inspectors — "Nokia : Mobile" showing brand = "Nokia", price = 7000, q = 2, amt = 14000; and "Samsung : Mobile" showing brand = "Samsung", price = 10000, q = 2, amt = 20000.]*

Therefore for the Mobile class, we created two objects Nokia and Samsung which has similar characteristics brand, price, q and amt. Each object maintains the values independently in their own object. Any changes done to object will not affect the other object.

> With the help of a class numerous objects can be created, therefore class is referred as object factory because it is the producer of objects.

> A class can have many data members and may functions depending upon the situation of the problem.

<!-- Page 8 -->

### Creating object in the program:

Till now you learnt creating object using the options present in BlueJ environment. Now let's learn how to create objects within the program itself and invoke the methods.

To create an object, the syntax is as follows:

```java
classname objectname = new classname ( );
```

| | | |
|---|---|---|
| classname | - | Name of the class defined. |
| objectname | - | any valid identifier |
| new | - | Allocates memory space for the data members. |
| classname () | - | constructor function which initializes the data members to their default values. |

| Type of value | Default values initialized by the compiler |
|---|---|
| byte, short, int and long | 0 |
| float and double | 0.0 |
| char | \u0000 |
| boolean | false |
| String | null |

Note: You will learn in detail about constructors in the later chapters.

### Accessing the member methods of a class:

**Syntax to access the member function of a class:**

```java
objectname.memeberfunction ();
```

### Example

Define a class **Employee** having the following description:-

**Data Members/Instance Variables:**

| | | |
|---|---|---|
| String name | - | stores the employee name. |
| int sal | - | stores the monthly salary. |
| double Nsal | - | stores the salary by increasing the salary by 25%. |

**Member functions:**

| | | |
|---|---|---|
| void input ( ) | - | accept values for name, sal from the user. |
| void calculate ( ) | - | calculate the increased salary of 25%. |
| void display ( ) | - | Display the name, sal, and Nsal. |

<!-- Page 9 -->

Write a main() method to create an object and call the functions.

```java
import java.util.*;
class Employee
{
  String name;
  int sal;
  double Nsal;
  void input()
  {
    Scanner sc=new Scanner(System.in);
    System.out.println("Enter the employee name");
    name=sc.nextLine();
    System.out.println("Enter the monthly salary");
    sal=sc.nextInt();
  }
  void calculate()
  {
    Nsal=sal+sal*0.25;
  }

  void display()
  {
    System.out.println("Name                   : "+name);
    System.out.println("Montly Salary          : "+sal);
    System.out.println("Salary after increment   : "+Nsal);
  }
  void main()
  {
    Employee e =new Employee(); // creating object
    e.input();
    e.calculate();      // calling methods
    e.display();
  }
}
```

*[In the PDF a brace groups the three lines `e.input();`, `e.calculate();`, `e.display();` with the single comment "// calling methods". The program continues from page 9 to page 10.]*

<!-- Page 10 -->

The execution of the above program starts from main() method.

- First it creates the object using the following statement

  Employee e=new Employee ();

  e is the object which is used to access the data members and member functions.
- e.input (); → invokes the method to accept values from the user. After the execution of input() method, the control comes back to the calling place of input()
- Now it calls e.calculate(); → which calculates the increased salary.
- Finally it calls e.display (); → which displays all the details.

---
