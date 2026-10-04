# Computer Applications — school worksheets

> Transcribed from school-provided worksheets (14 pages). Printed questions only; handwritten answers omitted. Authority for depth and style of Section A questions — see docs/01-problem-statement.md.

Contents (in PDF order):

1. Chapter 2 – Practical Exercise (pages 1–2)
2. Revision Worksheet on Programs for the First Term Examination – 2026-27 (pages 3–4)
3. Practical Exercise-1 – Iterations (Part 1) – 2026-27 (pages 5–6)
4. Chapter 3 – Practical Exercise on Method Overloading (pages 7–8)
5. X – CTA – Section-A – Practice Paper (pages 9–11)
6. Assignment Worksheet-1 – 2026-27 (pages 12–13)
7. Class Test on Programming (page 14)

---

## 1. Chapter 2 – Practical Exercise

*Subject: Computer Applications · Std: X – ICSE*

**1.** Define a class with the following specifications:-

Classname: sales

**Data Members:**

- String name : customer's name
- double price : price of an item
- int qty : number of items purchased.
- double tprice : total price
- double tax: sales tax
- double net: net amount to be paid [tprice + tax]

**Member methods:**

- ~~Sales() : initialize default values to the data members.~~ *(struck through on the sheet)*
- void input() : Accept details for name, price and qty.
- void calculate(): calculate the total price, sales tax and the net amount as per given below:

| Total Price | Sales tax in % |
|---|---|
| More than ₹3,000 | 17.5% |
| More than ₹1,500 | 12% |
| Otherwise | 7% |

- void display(): print name, tprice, tax and the net amount.

Write a main() method to create an object and call the above member methods.

**2.** Define a class Library having the following description:

**Data Members/Instance variables:**

- name : stores student's name
- days: number of days book returned late.
- fine: amount to be paid as fine.

**Member methods:**

- ~~Library(): initialize default values to the data members.~~ *(struck through on the sheet)*
- ~~Library(String, int): to initialize name and days through parameters.~~ *(struck through on the sheet; a handwritten replacement is noted beside it — see note below)*
- void compute(): calculate the fine as per given below:

| Days | Fine per day |
|---|---|
| First 10 days | ₹1 |
| Next 10 days | ₹5 |
| Later than 20 days | ₹8 |

- void display(): print the name, days and the amount as

```
Name    days    fine
Xxx     xxx     xxx
```

Write a main() method to create an object and call the above member methods.

> *Note: beside the struck-through constructors, a handwritten instruction (apparently the class's dictated change) reads: "void accept(): to initialize name and day through Scanner class".*

**3.** Define a class insurance having the following description:

**Data Members:**

- int amount : premium amount
- char type: type of plan 'C'/'c' for Child and 'G'/'g' for general
- double bonus : bonus amount.

**Member methods:**

- void accept() : accept details for amount and type of plan
- void calculate(): calculate the premium amount as per the following:

| Premium amount in ₹ | Child plan | General plan |
|---|---|---|
| Minimum ₹ 5,000 | 3% on Premium amount | 1.5% on Premium amount |
| ₹5,001 - ₹ 20,000 | 5% on Premium amount | 3.5% on Premium amount |
| ₹ 20,001 - ₹ 45,000 | 7% on Premium amount | 6.0% on Premium amount |
| ₹ 45,001 and above | 10% on Premium amount | 8.5% on Premium amount |

- void print(): Print the premium amount, type of plan and the bonus amount.

Write a main() method to create an object and call the above member methods.

---

## 2. Revision Worksheet on Programs for the First Term Examination – 2026-27

*Subject: Computer Applications · Std: X - ICSE*

### I. Programs on Data Members and Member Methods:

**1.** Performance Criteria of an employee is Calculated based on the inputs as accuracy (a), reliability (r) and adaptability (ad) which is recorded as 1 to 10. 10 being the excellent score.
Define a class with the following specifications:

**Class name : Performance**

**Member Variables:**

String n – Name of the employee   int a – Accuracy   int r – reliability
int d – adaptability   double basic – basic salary   double bonus – bonus amount

**Member Methods:**

- Performance() – default constructor to initialize default values to member variables
- void input() – to accept the name, accuracy (a), reliability (r) and adaptability (ad), basic salary from the user using the methods of Scanner class.
- void calculate() – to calculate the average of the three inputs (accuracy (a), reliability (r) and adaptability (ad)) and allot the bonus as per the given criteria:
  **Average = (accuracy + reliability + adaptability) / 3**
  If average is above 7, then the bonus given to the employee is 7.5% of basic salary otherwise it is 5% of the basic salary.
- void print() – to print the name of the employee, bonus.
- void main() – to create an object of the class and invoke the methods.

**2. Define a class WaterBill**

**Data Members:**

String n – Consumer's name.   int lit – litres of water consumed.   double bill – bill amount

**Member Methods:**

- void accept() – accept details for name & number of litres using Scanner class.
- void calculate() – calculate the bill based on:

| Water in litres | Rate / litre |
|---|---|
| First 40 litres. | ₹ 0 |
| Next 60 litres | ₹ 1.50 per litre |
| Next 100 litres | ₹ 3.00 per litre |
| Above 200 litres | ₹ 5.00 per litres |

A penalty fee of ₹ 500 is charged if the consumption of water is more than 200 litres.

- void display() – print name, litres of water and bill amount.

Write a main() method to create an object and invoke the methods.

### II. Programs on Method Overloading:

**1.** Define a class to overload the method display as follows:

- void display() – to display the format using NESTED loops only:

```
1 2 3
4 5 6
7 8 9
```

- void display(int n, char ch): to print the square of n if ch is 'S'/'s' or the cube of n if ch is 'C'/'c'
- double display(double r, double h): to return the volume of cylinder as follows:
  Volume = Area × h      Area = πr²

**2.** Define a class to overload the method compute() as follows:

- void compute(int n): to find and display the sum of ASCII values of first 'n' uppercase characters. If `[condition left blank in print]` print appropriate error message.
- void compute(): to find & display the sum of the given series:
  Sum = 2/1 + 4/3 + 6/5 + ... + 10/9
- double compute(int a, int b): to find and return the result of √(a+b) / (a+b)

### III. Programs on Constructor Overloading:

**1.** Define a class to overload the constructor find() as follows:

**Data members: int a; char ch; String b;**

- public find(int): print the first 'a' multiples of 10.
  Eg: If a is 5,
  Output: 10, 20, 30, 40, 50.
- public find(char): print the character ch as uppercase if it is lowercase. Otherwise print error message.
- public find(String): print the first three characters in lowercase if the length of String b is more than 5, otherwise print error message.

**2.** Define a class to overload the constructor calc() as follows:

Data Members:   double result;

**Member Methods:**

- calc(int, int, int): find and print the average of sum of squares of 3 integers.
- calc(int, char): find and print the twice of the integer number if the character is 's'/'S'. Otherwise print the four times of the integer number if the character is 'f'/'F'.
- calc(double): find and print the result of Math.ceil() if the argument is between 10.1 and 20.8. Otherwise print the result of Math.floor()

### III. Programs on Number Based:

*(numbered "III" again on the sheet)*

**1.** Define a class to accept a number and check if it is a Special buzz number or not. A number is a Special buzz number if it ends with 7 and the sum of the digits of the number is also divisible by 7.
Example:
957
The number ends with 7 and the sum of the digits (9+5+7 = 21) also is divisible by 7.

**2.** Define a class to accept a number and check if it is a Special number or not. A number is called a Special number if the sum of the number and its reversed number is an even number.
Example:
93 → Reverse = 39
Sum = 93 + 39 = 132 (Even)
Hence, 93 is a special number.

### IV. Programs on String Based:

**1.** Define a class to accept a String and encode the String as follows:

- The first letter of the String is converted to @ if it is a vowel, otherwise it is converted to #.
- All the other letters are reversed.

Example:
Input String: APPEARANCE6
Output String: @6ECNARAEPP

**2.** Define a class to accept a String and convert to uppercase and print the count of double letter vowels in the string.
Example:
Input String: BEAUTIFUL LEAVES
Output: 3 [EA, AU, EA]

---

## 3. Practical Exercise-1 – Iterations (Part – 1) – 2026-27

*Std: X – ICSE · [TO BE WRITTEN IN THE LAB RECORD]*

**1.** Define a class to find and display the sum of the given series:

sum = 1/(1+a)^1 + 2/(1+a)^2 + ………… n terms

Where a and n has to be input by the user.

**2.** Define a class to find and display the sum of the given series:

sum = x^1/1 − x^2/2 + x^3/3 ………… n terms

Where x and n has to be input by the user.

**3.** Define a class to display the following Fibonacci series upto n terms. The first two terms of the series are 0 and 1, the next term is generated by adding the previous two terms.
0, 1, 1, 2, 3, 5, ……………n terms.

**4.** Define a class to generate the following numbers in the given series upto n terms:
1, 2, 4, 7, 11,……n terms

**5.** Define a class to accept a number and check whether it is a pronic number or not. A pronic number (also called an oblong or heteromecic number) is a number that is the product of two consecutive integers, expressed as n x (n+1)
For example:
6 is a pronic number because 2 x 3 = 6

**6.** Define a class to accept a number and check whether it is EvenPal Number or not. A number is called EvenPal if the reverse of the input number is same as original number and sum of its digits is an even number.
Example: Input number: 121
Output: EvenPal [ reverse of 121 is 121 and sum of its digits 1+2+1 is 4 [even]

**7.** Define a class to accept a number and check whether it is a 3-digit Armstrong number or not. A number is called Armstrong if the sum of cubes of the digits of n equals the input number n.
Example: Input number: 153
Output: Armstrong number [ 1³+5³+3³ = 153]

**8.** Define a class to accept a number and display the minimum and the maximum digit.
Example: Input number: 42168
Output: Minimum digit is 1
Maximum digit is 8

**9.** Define a class to input a number and find and display the following:-

1) sum of first and the last digits.
2) sum of digits that are divisible by 3.
3) product of ODD digits
4) count of digits that are EVEN.

**10.** Define a class to input an integer number and check and display whether it is a Clarit number or not. A number is called Clarit, if the number of zeros are more than any other digit in the number.

| Example1: | Example2: |
|---|---|
| Input Number: 2004 | Input Number: 204 |
| Output: Clarit number. | Output: Not a Clarit number |

---

## 4. Chapter 3 – Practical Exercise on Method Overloading

*Subject: Computer Applications · Std: X – ICSE*

**1.** Design a class to overload a function *compute()* as follows:

(i) *void compute(int, char):* to compute the square of the integer argument if the given character argument is 's' otherwise find its cube.

(ii) *void compute(double, char):* to compute volume of a cube of the double argument if the given character argument is 'v' otherwise find its diagonal (√3·a)

(iii) *void compute(int,int,char):* to compute area of a rectangle if the given character argument is 'a' otherwise finds its perimeter.
Area=leangth\*breadth,  Perimeter of rectangle=2\*(length+breadth)

Write a *main()* method to create an object and invoke the above methods.

**2.** Write a class with the name *volume* using function overloading that computes the volume of a cube, a sphere and a cuboid.

Formula:

- *volume of a cube (vc) = s\*s\*s*
- *volume of a sphere (vs) = 4/3 \* pi \* r \* r \* r (where pi = 3.14 or 22/7)*
- *Volume of a cuboid (vcd) = l \* b \* h*

Write a *main()* method to create an object and invoke the above methods.

**3.** Design a class to overload a function *series()* as follows:

(i) ***double series(double n)*** with one double argument and returns the sum of the series.
  *sum = 1/1 + 1/2 + 1/3 + ….. 1/n*

(ii) ***double series(double a, double n)*** with two double arguments and returns the sum of the series.
  *Sum = 1/a² + 4/a⁵ + 7/a⁸ + 10/a¹¹ ….. to n terms*

Write a *main()* method to create an object and invoke the above methods.

**4.** Define a class to overload the method *number()* as follows:-

(i) *public void number(int n)* – print the square root value of each digit of a number n

*Example if n is 146*
*Output:*

```
6= 2.449
4= 2.0
1 = 1.0
```

(ii) *public void number (int n, int d)* – print the frequency of d in the number n
*Example: If n is 121671 and d is 1*
*Output: the frequency of 1 is 3*

Write a *main()* method to create an object and invoke the above methods.

**5.** Define a class to overload the method *pattern()* as follows:-

(i) *void pattern()* – display the following pattern *using nested for loop.*

```
121212
121212
121212
```

(ii) *void pattern(int r, int c)* – display the following pattern in 'r' rows and 'c' columns
*For example: If r is 5 and c is 5, then the output is:*

```
9 9 9 9 9
7 7 7 7 7
5 5 5 5 5
3 3 3 3 3
1 1 1 1 1
```

(iii) *void pattern (char c, int n)* – display the pattern in *n rows* using the *character c*
*For example: If c is 'O' and n is 5*

```
O
OO
OOO
OOOO
OOOOO
```

Write a *main()* method to create an object and invoke the above methods.

---

## 5. X – CTA – Section-A – Practice Paper

### I. Write Java expressions for the following:-

1. √((a + b) × (a − b))
2. (√a + √b) / (a − b)
3. |a|·|b|

### II. Evaluate the given expressions:- [Operators]

**1.**

```java
int a=2, b=6, c=10;
a+=b+=c;
System.out.println (a+ ", "+b+ ", "+c);
```

**2.**

```java
char a='A'; int b=2;
a+=b; b++;
System.out.println (a+"\n"+b);
```

**3.**

```java
int p=2, q=6;
p+=p++ + q++ - ++p;
System.out.println ("p="+p+"\nq="+q);
```

**4.**

```java
int x=10, y=7;
y*=++x + ++y + x--;
System.out.println (x+y);
```

*(the `+` before `x--` is slightly smudged in the scan; best reading is `+`)*

**5.**

```java
char x='2', y='d';
System.out.println (x+y);
System.out.println (++x + ++y);
```

### III. Predict the output:- [conditional statements]

**1.**

```java
int a=5, b=10;
int r=(a>b)?b++:(a<b?--b:b);
System.out.println (r);
```

**2.**

```java
String fruit="apple";
switch (fruit)
{
  case "Apple": System.out.println ("Red"); break;
  case "apple": System.out.println ("Green"); break;
}
```

**3.**

```java
int x=60, y=10;
if (x%y==0)
if (y%2==0)
if ((x+y)%10==0)
System.out.println ("All are true");
else
System.out.println ("first and second condition is true and third condition is false");
else
System.out.println ("first condition is true and second condition is false");
else
System.out.println ("first condition is false");
```

### IV. Predict the output: [Iteration statements:-

**1.**

```java
int a=0;
while (a<=5)
{
  System.out.print (a+" ");
  System.out.print (++a*2);
  System.out.println ();
  ++a;
}
```

**2.**

```java
int x=10, c=20;
do
{
  x++;
  System.out.println (x);
  c=c-2;
}while (c>=10);
```

**3.**

```java
for (int m=25; m<=35; m+=5)
{
  if (m%7==0)
  break;
  else if (m%5==0)
  System.out.println (m);
}
```

**4.**

```java
int a, b;
for (a=34, b=5; a<=50; a+=b)
{
  if (a%b==0)
  continue;
  System.out.println (a);
}
System.out.println (a);
```

### V. Rewrite as directed:-

**1. Using ternary operator (conditional operator):-**

```java
boolean r=false; int n;
if (r)
n=500;
else
n=600;
System.out.println (n);
```

**2. Using for loop:**

```java
while (a!=b)
{
  if (a>b)
  a=a-b;
  else
  a=b-a;
}
```

**3. Using nested if:** *(top-left corner of this page is folded/cut off in the scan; the start of the code is partly missing)*

```java
[unclear: "if"] (m==n && n!=p)
{
  System.out.println (m*n);
  System.out.println (n%p);
}
```

**4. Using if else if:**

```java
switch (p)
{
  case 1: a++;
  case 2: ++b;
  case 3: c--;
        break;
  default: System.out.println ("out of range");
}
```

*(no closing brace is visible for the switch in the scan)*

### VI. Predict the output: [Mathematical library methods]:-

1. `System.out.println (Math.floor (-0.88));`
2. `System.out.println (Math.max (-77.66, -87.45));`
3. `System.out.println (Math.min ('x', 'X'));`
4. `System.out.println (Math.ceil (65.5));`
5. `System.out.println (Math.floor (1.22));`
6. `System.out.println (Math.round (1.3));`
7. `System.out.println (Math.round (7.5));`
8. `System.out.println (Math.round (-3.5));`
9. `System.out.println (Math.round (-3.6));`
10. `System.out.println (Math.sqrt (Math.abs (25-50)));`
11. `System.out.println (Math.pow (2,0)+Math.pow (3, 1/3));`
12. `System.out.println (Math.cbrt (Math.floor(8.2)));`

### VII. Write Java statements for the following:-

*(item numbers at the left edge are partly cut off in the scan; numbering 1–9 inferred)*

1. To check the sum of x and y is equal to the sum of a and b.
2. Initialize the constant 14.22 to a variable of appropriate type.
3. Convert the sum of a and b to int data type explicitly.
4. To create an object table of class furniture.
5. A for loop that prints numbers from -10 to -1.
6. To check the value of a is more than b and less than c using nested if statement.
7. To initialize any date of birth (dd/mm/yyyy) to a variable of appropriate type.
8. To find the product of a and b if a is more then b, otherwise find the quotient after dividing a by b using conditional (ternary) operator.
9. To stop the execution of a program if the value of x is 100.

---

## 6. Assignment Worksheet-1 – 2026-27

*Std: X – ICSE · Submission date: 01-06-2026*

**Note: The answers to this worksheet and further on worksheets to be written in a new book of 200 Pages long size.**

### I. Do as directed:-

**1.** Write Java expression for ∛(x+y) / |x−y|

**2.** Evaluate the given expressions and write the output:-

```java
int m=7, n=9;
m+=m-- + ++n + ++m + --n;
System.out.println ("m="+m);
System.out.println ("n="+n);
```

**3.** Predict the output of the following:-

```java
char c=67, x=50; int d=2;
System.out.println (c++);
System.out.println (c+d);
System.out.println ((char)(c+d));
System.out.println (x+=3);
System.out.println (x+d);
System.out.println ("Output is "+c+d);
```

**4.** What is the output given by the following code when
(a) *ch is 'a' or 'A'*   (b) *ch is 'd' or 'D'*

```java
switch (ch)
{
  case 'a':
  case 'A': System.out.println ("Accounts");
  case 'c':
  case 'C': System.out.println ("Commerce");
            break;
  default: System.out.println ("Incorrect Input");
}
```

**5.** Analyze how many times loop runs and what is the output:

```java
int a=10;
while (++a<=20);
System.out.println (a);
```

**6.** Analyze how many times loop runs and what is the output:

```java
int s=20, p=5;
for (; p<=10;)
{
    System.out.println (s+=p);
    if(s%8==0)
    break;
    p+=2;
}
```

**7.** Rewrite using do while loop and for loops:-

```java
int x=-1;
while (++x<=5);
System.out.println (x);
```

**8.** Rewrite using if else if statements:-

```java
switch (choice)
{
case 'A':
case 'U': System.out.println ("Uppercase"); break;
case 'a':
case 'u': System.out.println ("Lowercase");break;
default: System.out.println ("Neither Uppercase nor Lowercase");
}
```

**9.** Rewrite using if else if statements:-

```java
char grade=(marks>=90)?'A':(marks>=80)?'B':'C';
```

**10.** Consider the following program segment in which the statements are jumbled, choose the correct order of statements to find (a + x)^n where x = p/q

```java
void find (double a, double p, double q, int n)
{
        double s=a+x;→ (1)
        double r=Math.pow (s, n);→ (2)
        double x=p/q;→ (3)
```

*(the segment ends here on the sheet; no closing brace is printed)*

---

## 7. Class Test on Programming

*Subject: Computer Applications · Std: X ICSE · Maximum Marks: 40 · Time: 1 HR · Date: 06/07/2026*

**Note: All the programs must be written with Variable Description/Comments.**

### Question 1  [15]

Design a class **IncomeTax** as follows:

Class Name : **IncomeTax**

**Instance variables/Data members**

| | |
|---|---|
| name : Name of the Employee | asalary: Calculate the Annual Salary |
| mincome : Monthly income | itax : Income Tax payable |

**Member methods**

- void getData() : to accept the age, monthly salary
- void incomeTax() : to calculate the tax payable as per the following table:

| Annual Salary | Tax% |
|---|---|
| 0 - Rs 3,00,000 | 0% |
| Rs 3,00,001 - Rs 7,00,000 | 5% |
| Rs 7,00,001 - Rs 10,00,000 | 10% |
| Rs 10,00,001 - Rs 12,00,000 | 15% |
| Rs 12,00,001 - Rs 15,00,000 | 20% |
| Rs 15,00,001 and above | 30% |

- void showData() : to show the name of the Employee, Monthly salary, Annual salary, and Amount tax payable.

Write a main() method to create an object and call the above member methods.

### Question 2

**(a)** Define a class to find and display the sum of the given series upto n terms.  [10]

sum = 1/a² + 4/a⁵ + 7/a⁸ + ………n terms

Where 'a' and 'n' has to be input by the user.

**(b)** Define a class to display the following pattern using nested for loop:  [7]

```
ababa
abab
aba
ab
a
```

**(c)** Define a class to accept n terms and display the following series:  [8]

0, 3, 8, 15,…………………n terms.
