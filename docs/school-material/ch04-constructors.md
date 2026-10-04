# Chapter-4 Constructors

> Transcribed from school-provided material (3 pages). Authority for depth and style of exam answers — see docs/01-problem-statement.md.

Before we start constructor, let's recall the different ways of initializing the data members.

## Direct Initialization

**Example:**

```java
class Student
{
     String name="Sanjan";
     int roll_no=35;
}
```

## Using Scanner class

**Example:**

```java
import java.util.*;
class Student
{
String name;
int roll_no;
void input ( )
{
Scanner sc=new Scanner (System.in);
System.out.println ("Enter the student name");
name=sc.nextLine ( );
System.out.println ("Enter the roll number");
roll_no=sc.nextInt();
}

}
```

## Through formal parameters

**Example:**

```java
class Student
{
String name;
int roll_no;
void input (String n, int r )
{
name=n;
roll_no=r;
}
}
```

## Constructor

The next method of initializing the data members is through constructor function.

> A constructor is a special member function used to initialize the data members whenever an object is created for the class.

**Syntax:**

```java
Access-specifier constructor_name ()
{
  statements;
}
```

```java
Access-specifier constructor_name (parameters)
{
  statements;
}
```

**Types:**

- Default constructor or non-parameterized constructor.
- Parameterized constructor or constructor with parameters.

**Characteristics:**

- Constructor has same name as the classname.
- Constructor is defined under public access-specifier. When defined under private access-specifier, objects cannot be created for the class in any other program. When left un-specified without using either private or public, objects can be created within the class as well as in any other program but within the package.
- Constructor never returns a value. Even the keyword void shouldn't be used.
- Constructor gets invoked automatically whenever an object is created for the given class.
- When no constructor is defined in the class, then the compiler generates a default constructor for the class and initializes the data members to the following default values.

| Type of Data Member | Default values |
|---|---|
| byte | 0 |
| short | 0 |
| int | 0 |
| long | 0 |
| float | 0.0 |
| double | 0.0 |
| char | '\u0000' [UNICODE] OR 0[ASCII CODE] |
| boolean | false |
| String | null |

**Example:**

```java
class Student
{
String name;
int roll_no;
public Student ( ) //default constructor
{
     name="Sanjan";
     roll_no=35;
}
publicStudent (String n, int r ) //Parameterized constructor
{
name=n;
roll_no=r;
}
public void Display ( )
{
 System.out.println ("Roll Number is "+roll_no);
 System.out.println ("Name is "+name);
}
public static void main ( )
{
 Student s1=new Student ( ); //Default constructor gets invoked.
Student s2=new Student ("Francis", 10); //Parameterized constructor gets invoked
s1.Display ( );
 s2. Display ( );
}
}
```

> When there is more than one constructor present in the class, then it is called as Constructor Overloading as all the constructor functions share the same name as the class name.

## Differences between a Constructor and Function.

| Constructor | Function (Method) |
|---|---|
| Has same name as the class name | Can be different from the class name |
| Always Defined under public access-specifier | Can be defined under private/public/protected access-specifier |
| Never returns a value | May or may not return a value |
| Gets invoked (called) when object is created | Has to be invoked explicitly through objects or without objects |
