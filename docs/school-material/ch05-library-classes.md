# Chapter-5 Library Classes

> Transcribed from school-provided chapter notes (5 pages). Authority for depth and style of exam answers — see docs/01-problem-statement.md.

<!-- Page 1 -->

## Library Classes

Java as a totality is a combination of the Java language and its standard classes. The class libraries provide much of the functionality that comes with Java. All the classes are present in their respective packages like System, String, Math etc.,

> set of packages that contains built-in classes that contains built-in methods which provides support for actions such as string handling, input-output operations etc., is known as the Application Programming Interface (API)

*[Highlighted box in original.]*

java.lang.*; → This package contains the following classes.

- System
- String
- Math
- Wrapper classes (Byte, Short, Integer, Long, Float, Double, Boolean and Character)

**Java.lang is called as the default package in java.**

import java.util.*; → This package contains the class Scanner

\*Apart from the above, there are many other packages which are not included in the scope of the syllabus like java.io etc.,

Let's learn in detail about each of the above classes.

### System

**System:** It belongs to the default package java.lang which has the following methods.

- **print ( )** - displays the text/values/result of any expression and the cursor remains in the same line.

**Example:**

```java
System.out.print ("Output: ");
System.out.print (10+5);
```

**Output:** Output: 15

- **println ( )** - displays the text/values/result of any expression and the cursor goes to the next line.

**Example:**

```java
System.out.println ("Output: ");
System.out.println (10+5);
```

**Output:**

```
Output:
15
```

<!-- Page 2 -->

### Wrapper Classes

**Wrapper Classes:** Each of Java's eight primitive data types has a class dedicated to it. These are known as wrapper classes because they "wrap" the primitive data type into an object of that class. The wrapper classes are part of the java.lang package, which is imported by default into all Java programs.

The wrapper classes in java is used for two primary purposes.

- To provide a mechanism to 'wrap' primitive values in an object so that primitives can do activities reserved for the objects.
- To provide an assortment of utility functions for primitives like converting primitive types to and from string objects.

Below table lists wrapper classes

| Primitive | Wrapper Class |
|-----------|---------------|
| boolean   | Boolean       |
| byte      | Byte          |
| char      | Character     |
| int       | Integer       |
| float     | Float         |
| double    | Double        |
| long      | Long          |
| short     | Short         |

<!-- Page 3 -->

### Creating a Wrapper Class Object

```java
int x=100; // primitive data type
Integer I=new Integer (x); // I is Integer object.
float a=10.5f;
Float f=new Float (a); // f is Float object.
```

- <u>Autoboxing :</u> is the process by which primitive data type is automatically encapsulated (boxed) into its equivalent type wrapper whenever an object that type is needed. There is no need explicitly construct an object.

  Eg:
  ```java
  Integer x=100;
  ```

- <u>Auto –unboxing :</u> is the process by which value of a boxed object is automatically extracted (unboxed)from the type wrapper when its value is needed .

  <u>Eg:</u>
  ```java
  Integer x=100;
       int a=x;
  ```

### Wrapper Class Conversions

#### Converting numerical string to a numerical value (int, long, float and double)

```java
String s="145";
int c=Integer.parseInt (s); [OR] Integer.valueOf (s);
long d= Long.parseLong (s); [OR] Long.valueOf (s);

String a="14.5";

float f=Float.parseFloat (a); [OR] Float.valueOf (a);

double d=Double.parseDouble (a); Double.valueOf (a);
```

#### Converting a numerical value and char to Sring (int, long, float, double, char) to String type

```java
int c=30;
long d=40;
float e=1.2f;
double f=12.34;
char ch='A';
String c1=Integer.toString (c); [OR] String.valueOf (c);
String d1=Long.toString (d); [OR] String.valueOf (d);
String e1=Float.toString(e); [OR] String.valueOf (e);
String f1=Double.toString(f); [OR] String.valueOf (f);
String s=Charater.toString(ch); [OR] String.valueOf(ch);
```

<!-- Page 4 -->

*[Highlighted box in original:]*

> parseInt() → method of Integer class which converts the string as number to int data type.
>
> parseLong() → method of Long class which converts the string as number to long data type.
>
> parseFloat() → method of Float class which converts the string as number to float data type.
>
> parseDouble() → method of Double class which converts the string as number to double data type.
>
> The alternate method valueOf() can be used instead parseInt(), and parseLong(),parseFloat() and parseDouble()
>
> The method toString() converts a number to String form.
>
> The alternate method valueOf() can be instead of toString()

### Character class

**Character class:** This class wraps a char type value. It has methods which can be implemented on char value to check it is uppercase, lowercase, etc.,

```java
Character c=new Character ('a'); //c is the Character object.

Characher c='a'; //Auto-boxing
```

#### Methods

- **boolean isLetter (char) -** Checks and returns true if the character is an alphabet, otherwise false.

  **Example:**
  ```java
  System.out.println (Character.isLetter('D')); // Output: true
  System.out.println (Character.isLetter('a')); //Output: true
  System.out.println (Character.isLetter('2'));// Output: false
  System.out.println (Character.isLetter('$')); //Output:false
  ```

- **boolean isDigit (char) -** Checks and returns true if the character is digit, otherwise false.

  **Example:**
  ```java
  System.out.println (Character.isDigit('1')); //Output: true
  System.out.println (Character.isDigit('a')); // Output: false
  ```

- **boolean isLetterOrDigit (char) -** Checks and returns true if the character is alphabet/digit, otherwise false.

  **Example:**
  ```java
  System.out.println (Character.isLetterOrDigit('a')); //Output: true
  System.out.println (Character.isLetterOrDigit('4')); //Output: true
  System.out.println (Character.isLetterOrDigit('@')); //Output: false
  ```

<!-- Page 5 -->

- **boolean isWhitespace (char) -** Checks and returns true if the character is whitespace, otherwise false.

  **Example:**
  ```java
  System.out.println (Character.isWhitespace(' '));//Output: true
  System.out.println (Character.isWhitespace('\t'));//Output: true
  System.out.println (Character.isWhitespace('\n'));//Output: true
  ```

- **boolean isUpperCase (char) -** Checks and returns true if the character is upper case, otherwise false.

  **Example:**
  ```java
  System.out.println (Character.isUpperCase('A'));//Output: true
  System.out.println (Character.isUpperCase('a'));//Output: false
  ```

- **boolean isLowerCase (char) -** Checks and returns true if the character is lower case, otherwise false.

  **Example:**
  ```java
  System.out.println (Character.isLowerCase('a'));//Output: true
  System.out.println (Character.isLowerCase('A'));//Output: false
  ```

- **char toUpperCase (char) -** Converts the character from lowercase to uppercase.

  **Example:**
  ```java
  System.out.println (Character.toUpperCase('a'));//Output: A
  System.out.println (Character.toUpperCase('G'));//Output: G
  ```

- **char toLowerCase (char) -** Converts the character from uppercase to lowercase.

  **Example:**
  ```java
  System.out.println (Character.toLowerCase('A'));//Output: a
  System.out.println (Character.toLowerCase('g'));//Output: g
  ```

**Note: All the inbuilt methods which are called by referring to classname are defined as static/class mehods. The methods which are called/invoked using objects are defined as non-static methods.**

**<u>Example for static library methods:</u>**

**Math.sqrt(4), Math.ceil (5.6), Character.isLetter('S'), Integer.toString(45), etc.,**

**<u>Examples for non-static library methods:</u>**

**sc.nextInt(), s.length(), s.charAt(int),…etc.,**

---
