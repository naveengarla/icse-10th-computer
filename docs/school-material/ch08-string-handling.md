# Chapter-8 String Handling

> Transcribed from school-provided chapter notes (5 pages). Authority for depth and style of exam answers — see docs/01-problem-statement.md.

<!-- Page 1 -->

## String Handling

**String:** In Java a string is a sequence of characters. Java implements strings as objects of class String. The class String is for working with data composed of multiple characters. Implementing strings as built-in objects allows Java to provide many features for string handling. Java has methods to perform various operations on strings such as comparing, finding length, extracting characters etc.,

### Creating Strings

**I. From String Literal:** A string can be created from a string literal—a series of characters enclosed in double quotes.

**Example:**
```java
String s="Welcome";
```

**II. Using new keyword:** A string can also be created using object of type String.

**Example:**
```java
String s=new String ("Hello");
```

### Methods in String class

- **int length ( ) -** Returns the total no. of characters present in the string object including space.

  **Example:**
  ```java
  String s="Java program";
  int L=s.length(); //Output: 12
  ```

- **char charAt (int) -** Returns the character at the corresponding index position. If the index position is not found, then it raises a run-time error StringIndexOutOfBounds Exception.

  **Example:**
  ```java
  String s="Java program";
  char c=s.charAt(2);
  System.out.println (c); // Output: v
  char c1=s.charAt(s.length());
  System.out.println (c1); //Error-StringIndexOutOfBounds
  char c2=s.charAt(s.length()-1);
  System.out.println (c2); //Output: m
  ```

- **int indexOf (char/String) -** Returns the first occurrence of the character or string present in the string object. If the character/string is not found then it displays the index position as -1 by default.

<!-- Page 2 -->

  **Example:**
  ```java
  String s="Java program";
  int i1=s.indexOf('a');
  System.out.println (i1);//Output: 1

  int i2=s.indexOf('A');
  System.out.println (i2);//Output: -1
  int i3=s.indexOf("va");
  System.out.println (i3); //Output: 2
  ```

- **int lastIndexOf (char/String) -** Returns the last occurrence of the character or string present in the string object.

  **Example:**
  ```java
  String s="Java program";
  int i1=s.lastIndexOf('a');
  System.out.println (i1);//Output: 10
  ```

- **boolean startsWith (String) -** Checks whether the calling string begins with the specified string argument and returns true/false

  **Example:**
  ```java
  String s="Java program";
  boolean b=s.startsWith("J");
  System.out.println (b); //Output: true
  boolean b1=s.startsWith("Jav");
  System.out.println (b1);//Output: true
  boolean b3=s.startsWith("j");
  System.out.println (b3); //Output: false
  ```

- **boolean endsWith (String) -** Checks whether the calling string ends with the specified string argument and returns true/false.

  **Example:**
  ```java
  String s="Java program";
  boolean b=s.endsWith("m");
  System.out.println (b); //Output: true
  boolean b1=s.endsWith("ram");
  System.out.println (b1); //Output: true
  boolean b2=s.endsWith("Ram");
  System.out.println (b2);//Output: false
  ```

- **boolean equals (String) -** Checks the equality between calling string and argument string and returns true if they are exactly matching with the case of characters, otherwise false.

<!-- Page 3 -->

  **Example:**
  ```java
  String s1="Java";
  String s2="Java";
  boolean b=s1.equals(s2);
  System.out.println (b); //Output: true
  ```

  Note: s1 is calling string, and s2 is argument string.

- **boolean equalsIgnoreCase (String) -** Checks the equality between calling string and argument string by ignoring the case of characters and returns true if they are having same characters, otherwise false.

  **Example:**
  ```java
  String s1="Java";
  String s2="JAVA";
  boolean b=s1.equalsIgnoreCase(s2);
  System.out.println (b); //Output: true
  ```

- **String toUpperCase ( ) -** Returns the string in uppercase by converting lowercase characters to uppercase.

  **Example:**
  ```java
   String s1="convert";
   s1=s1.toUpperCase();
   System.out.println (s1); //Output: CONVERT
  ```

- **String toLowerCase ( ) -** Returns the string in Lowercase by converting uppercase characters to lowercase.

  **Example:**
  ```java
  String s1="CONVERT";
  s1=s1.toLowerCase();
  System.out.println (s1);//Output: convert
  ```

- **String trim ( ) -** Returns the string after removing the space characters before and after the end of the string. It does not remove space characters in between the string.

  **Example:**
  ```java
  String s1="    Go to the class     ";
   s1=s1.trim();
  System.out.println (s1); //Output: Go to the class
  ```

<!-- Page 4 -->

- **String replace (char, char) -** Returns the string after replacing all the occurrences of existing character with new character/string.

  **Example:**
  ```java
  String s1="babbage";
  s1=s1.replace('b','*');
  System.out.println (s1);//Output:  *a**age
  ```

- **String replace (String, String) -** Returns the string after replacing all the occurrences of existing string with new character/string.

  **Example:**
  ```java
  String s2="keyboard";
  s2=s2.replace("key","Black");
  System.out.println (s2); //Output: Blackboard
  ```

- **String concat (String) -** Concatenates or joins the calling string with the string present as the argument.

  **Example:**
  ```java
  String s1="Sanjay ";
  String s2="Kumar;
  String s3=s1.concat(s2);
  System.out.println (s3); //Sanjay Kumar
  ```

- **String substring (int) -** Returns a part of the string from the specified index positions.

  **Example:**
  ```java
  String s1="Computer";
  String s2=s1.substring(3);
  System.out.println (s2); //Output: puter
  ```

- **String substring (int, int) -** Returns the part of the string from the specified index position till the specified ending index position.

  **Example:**
  ```java
  String s1="Computer";
  String s2=s1.substring(3, 7);
  System.out.println (s2); //Output: pute
  ```

*[Highlighted box in original:]*

> In the above substring method, the starting index value is subtracted from the ending index value to find the number of characters to be extracted from the string.
> In the above example the start index = 3 and the end index =7,
> Therefore end index – start index = 7 – 3 = 4 [no. of characters to be extracted from 3<sup>rd</sup> index position]. The output is pute.

<!-- Page 5 -->

- **int compareTo (String) -** Compares the calling string and argument string by finding the difference in ASCII values of the characters. It returns +ve/-ve/0. If +ve then calling string is greater than the argument string. If it is –ve, then calling string is lesser than the argument string. If 0, then it indicates both the strings are same.

  **Example:**
  ```java
  String s1="Laptop";
  String s2="Desktop";
  int c=s1.compareTo(s2);
  System.out.println (c); //Output: 8
  /*subtracts the ascii value of L and D and gives the output as positive value
  indicating that Laptop is greater than the Desktop.*/
  ```

*[Highlighted box in original:]*

> The difference in ASCII values are found till the compiler gets one occurance of either +ve or –ve value.

- **int compareToIgnoreCase (String) -** Compares the calling string and argument string by finding the difference in ASCII values of the characters by ignoring the case of characters. It returns +ve/-ve/0. If +ve then calling string is greater than the argument string. If it is –ve, then calling string is lesser than the argument string. If 0, then it indicates both the strings are same.

  **Example:**
  ```java
  String s1="Delhi";
  String s2="DELHI";
  int c=s1.compareToIgnoreCase(s2);
  System.out.println (c); //Output: 0
  ```

- **String valueOf (number) –** returns the number as String.

  **Example:**
  ```java
  int a=12, b=13;
  String s1=String.valueOf(a);
  String s2=String.valueOf(b);
  System.out.println(s1+s2);//Output: 1213
  System.out.println((s1+s2).length());//Output: 4
  ```
