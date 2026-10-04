# Chapter 8 - Practical Exercise (String Handling) - Solutions

> Transcribed from school-provided practical exercise (12 pages). Authority for depth and style of exam answers — see docs/01-problem-statement.md.

## Program 1: Vowels and consonants

1. Define a class to accept a string and convert to uppercase and print the vowels and consonants.

Example: Input: ICSE EXAMS 2027
Output: Vowels are: I,E,E,A Consonants are: C,S,X,M,S

### Solution

```java
import java.util.*;
class P1
{
    public static void main()
    {
        Scanner sc=new Scanner(System.in);
        System.out.println("Enter a word/sentence");
        String s=sc.nextLine();/**stores a string*/
        s=s.toUpperCase();
        String v="";/**stores vowels*/
        String c="";/**stores consonants*/
        for(int i=0;i<s.length();i++)/**i is index number*/
        {
            char ch=s.charAt(i);/**stores a character*/
            if(ch=='A'||ch=='E'||ch=='I'||ch=='O'||ch=='U')
                v=v+ch;
            else if(ch!='A'&&ch!='E'&&ch!='I'&&ch!='O'&&ch!='U'&&
            Character.isLetter(ch))
                c=c+ch;
        }
        System.out.println("Vowels are:"+v);
        System.out.println("Consonants are:"+c);
    }
}
```

## Program 2: Count uppercase, lowercase, digits, whitespaces, symbols

2. Define a class to accept a string and display the count of uppercase, lowercase, digits, whitespaces and symbols.

Example: Input: I.C.S.E Computer App 2027
Output: Count of Uppercase: 6
        Count of Lowercase: 9
        Count of digits: 4
        Count of whitespaces: 3
        Count of symbols: 3

### Solution

```java
import java.util.*;
class P2
{
    public static void main()
    {
        Scanner sc=new Scanner(System.in);
        System.out.println("Enter a word/sentence");
        String s=sc.nextLine();/**stores a string*/
        int c1=0;/**to count uppercase*/
        int c2=0;/**to count lowercase*/
        int c3=0;/**to count digits*/
        int c4=0;/**to count whitespaces*/
        int c5=0;/**to count symbols*/
        for(int i=0;i<s.length();i++)/**i is index number*/
        {
             char ch=s.charAt(i);/**stores a character*/
            if(Character.isUpperCase(ch))
            c1++;
            else if(Character.isLowerCase(ch))
            c2++;
            else if(Character.isDigit(ch))
            c3++;
            else if(Character.isWhitespace(ch))
            c4++;
            else
            c5++;
        }
        System.out.println("Uppercase count="+c1);
        System.out.println("Lowercase count="+c2);
        System.out.println("Digit count="+c3);
        System.out.println("Whitespaces count="+c4);
        System.out.println("symbols count="+c5);
    }
}
```

## Program 3: Merge two strings alternately

3. Define a class to accept two strings of equal length and create a new string by combining first character of string1 followed by 1st character of string2 and so on……………

Example: Input string1: ICSE
         Input string2: CBSE
         Output: ICCBSSEE

### Solution

```java
import java.util.*;

class P3

{

    public static void main()

    {

        Scanner sc=new Scanner(System.in);

        System.out.println("Enter first string");

        String s1=sc.nextLine();/**stores a string*/

        System.out.println("Enter second string");

        String s2=sc.nextLine();/**stores a string*/

        if(s1.length()==s2.length())

        for(int i=0;i<s1.length();i++)/**i is index number*/

        {

            System.out.print(s1.charAt(i));

            System.out.print(s2.charAt(i));

        }

        else

        System.out.println("string lengthrs are not same");

    }

}
```

## Program 4: Palindrome string

4. Define a class to accept a string and convert to lowercase and check whether it is a palindrome string or not.

Example: Input: civic
         Output: palindrome string

### Solution

```java
import java.util.*;

class P4

{

    public static void main()

    {

        Scanner sc=new Scanner(System.in);

        System.out.println("Enter a string");

        String s=sc.nextLine();/**stores a string*/

        s=s.toUpperCase();

        String r="";/**reverese of s*/

        for(int i=s.length()-1;i>=0;i--)/**i is index number*/

        {

            char c=s.charAt(i);

            r=r+c;

        }

        if(s.equals(r))

        System.out.println("Palindrome string");

        else

        System.out.println("not a palindrome string");

    }

}
```

## Program 5: Initials of every word in uppercase

5. Define a class to accept a string and display only the starting letter of every word in uppercase.

Example: Input: Universal Serial Bus
         Output: USB

### Solution

```java
import java.util.*;

class P5

{

    public static void main()

    {

        Scanner sc=new Scanner(System.in);

        System.out.println("Enter a string");

        String s=sc.nextLine();/**stores a string*/

        char c=s.charAt(0);

        System.out.print(Character.toUpperCase(c));

        for(int i=0;i<s.length();i++)/**i is index number*/

        {

            c=s.charAt(i);/**stores a character*/

            if(Character.isWhitespace(c))

           {

               c=s.charAt(i+1);

               System.out.print(Character.toUpperCase(c));

           }

        }

    }

}
```

## Program 6: Toggle case

6. Define a class to input a string and convert uppercase alphabets to lowercase and lowercase alphabets to uppercase and print.

Example: Input: WeLCoMe 2027
         Output: wElcOmE 2027

### Solution

```java
import java.util.*;

class P6

{

    public static void main()

    {

        Scanner sc=new Scanner(System.in);

        System.out.println("Enter a word/sentence");

        String s=sc.nextLine();/**stores a string*/

        for(int i=0;i<s.length();i++)/**i is index number*/

        {

            char c=s.charAt(i);/**stores a character*/

            if(Character.isUpperCase(c))

            System.out.print(Character.toLowerCase(c));

            else if(Character.isLowerCase(c))

            System.out.print(Character.toUpperCase(c));

            else

            System.out.print(c);

        }

    }

}
```

## Program 7: Replace characters (next letter/digit, whitespace by $)

7. Define a class to accept a string and replace characters as per the following criteria:

A/a→B/b, B/b→C/c,………………………Y/y→A/a
0→a, 1→2, 2→3,…………………………..9→0
Whitespaces by $
Other characters will remain the same.

Example: [example input/output omitted — it contained identifying location text]

### Solution

```java
import java.util.*;

class P7

{

    public static void main()

    {

        Scanner sc=new Scanner(System.in);

        System.out.println("Enter a word/sentence");

        String s=sc.nextLine();/**stores a string*/

        for(int i=0;i<s.length();i++)/**i is index number*/

        {

            char c=s.charAt(i);/**stores a character*/

            if(c=='Z')

            System.out.print("A");

            else if(c=='z')

            System.out.print("a");

            else if(c=='9')

            System.out.print("0");

            else if(Character.isLetterOrDigit(c))

            System.out.print(++c);

            else if(Character.isWhitespace(c))

            System.out.print("$");

            else

            System.out.print(c);

        }

    }

}
```

## Program 8: Each word in uppercase on a new line

8. Define a class to accept a string and print each word in uppercase in different lines.

Example: Input: India is my country
         Output: INDIA
                 IS
                 MY
                 COUNTRY

### Solution

```java
import java.util.*;

class P8

{

    public static void main()

    {

        Scanner sc=new Scanner(System.in);

        System.out.println("Enter a word/sentence");

        String s=sc.nextLine();/**stores a string*/

        s=s.toUpperCase();

        for(int i=0;i<s.length();i++)/**i is index number*/

        {

            char c=s.charAt(i);/**stores a character*/

            if(!Character.isWhitespace(c))

            System.out.print(c);

            else if(Character.isWhitespace(c))

            System.out.println();

        }

    }

}
```

## Program 9: Symbolic word

9. Define a class to accept a string and convert to uppercase and print the string as Symbolic word.The rules of a symbolic string are:

- Find the first consonant in the word.
- Move all characters from that consonant to the end of the word to the front.
- Move all characters that appeared before that consonant to the back.
- Append a specific suffix, usually "TR", to the very end.
- If the word contains no consonants (all vowels), simply append "TR" to the original word.

Example: Input: AMOEBA
         Output: MOEBAATR

### Solution

```java
import java.util.*;

class P9

{

    public static void main()

    {

        Scanner sc=new Scanner(System.in);

        System.out.println("Enter a word");

        String s=sc.nextLine();/**stores a string*/

        s=s.toUpperCase();

        for(int i=0;i<s.length();i++)/**i is index number*/

        {

            char c=s.charAt(i);/**stores a character*/

            if(Character.isLetter(c))

            if(c!='A'&&c!='E'&&c!='I'&&c!='O'&&c!='U')

            {

        String s1=s.substring(i)+s.substring(0,i)+"TR";

        System.out.println(s1); break;

            }

        }

    }

}
```

## Program 10: Replace each vowel with the next character

10. Define a class to accept a string and convert to lowercase and replace each vowel with immediate next character as per the alphabetical order and print.

Example: Input: computer
         Output: cpmpvtfr

### Solution

```java
import java.util.*;

class P10

{

    public static void main()

    {

        Scanner sc=new Scanner(System.in);

        System.out.println("Enter a word");

        String s=sc.nextLine();/**stores a string*/

        s=s.toLowerCase();

        for(int i=0;i<s.length();i++)/**i is index number*/

        {       /**computer = cpmpvtfr */

            char c=s.charAt(i);/**stores a character*/

            if(c=='a'||c=='e'||c=='i'||c=='o'||c=='u')

            System.out.print(++c);

            else

            System.out.print(c);

        }

    }

}
```

## Program 11: Growing prefix pattern

11. Define a class to accept a word and convert to uppercase and display in the following format:

Example: FLOPPY
         Output: F
                 FL
                 FLO
                 FLOP
                 FLOPP
                 FLOPPY

### Solution

```java
import java.util.*;

class P11

{

    public static void main()

    {

        Scanner sc=new Scanner(System.in);

        System.out.println("Enter a word");

        String s=sc.nextLine();/**stores a string*/

        s=s.toUpperCase();

        for(int i=0;i<s.length();i++)/**i is index number*/

            System.out.println(s.substring(0,i+1));

        /**

         * Alternate Logic

         * for(int i=0;i<s.length();i++)

         * {

         *    for(int j=0;j<=i;j++)

         *    System.out.print(s.charAt(j));

         *    System.out.println();

         }

         */

    }

}
```

## Program 12: Shrinking prefix and reversed patterns

12. Define a class to accept a word and convert to lowercase and display in the following format:

Example: exams

```
Output: exams              smaxe
        exam               smax
        exa                sma
        ex                 sm
        e                  s
```

### Solution

```java
import java.util.*;
class P12
{
    public static void main()
    {
        Scanner sc=new Scanner(System.in);
        System.out.println("Enter a word");
        String s=sc.nextLine();/**stores a string*/
        s=s.toLowerCase();
        /**Pattern1*/
        int len=s.length();
        for(int i=0;i<s.length();i++)/**i is index number*/
        {
           System.out.println(s.substring(0,len));
           len--;
        }
        /** Pattern2*/
         for(int i=0;i<s.length();i++)
         {
           for(int j=s.length()-1;j>=i;j--)
           System.out.print(s.charAt(j));
           System.out.println();
         }

    }
}
```
