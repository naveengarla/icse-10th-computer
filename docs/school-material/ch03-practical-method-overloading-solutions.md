# Chapter 3 – Practical Exercise (Method Overloading) – Solutions

> Transcribed from school-provided material (6 pages). Authority for depth and style of exam answers — see docs/01-problem-statement.md.

## Question 1

1. Design a class to overload a function ***compute()*** as follows:

(i) ***void compute(int, char):*** to compute the square of the integer argument if the given character argument is 's' otherwise find its cube.

(ii) ***void compute(double, char):*** to compute volume of a cube of the double argument if the given character argument is 'v' otherwise find its diagonal (√3a)

(iii) ***void compute(int,int,char):*** to compute area of a rectangle if the given character argument is 'a' otherwise finds its perimeter.

  Area=leangth\*breadth,  Perimeter of rectangle=2\*(length+breadth)

Write a ***main()*** method to create an object and invoke the above methods.

### Solution

```java
class P1
{
   void compute(int a, char b)/**a-stores integer and b-stores a character*/
   {
      if(b=='s'||b=='S')
      System.out.println("Square="+(a*a));
      else
      System.out.println("Cube="+(a*a*a));
   }
   void compute(double x, char y)/**x-stores a value
                              and y stores a char*/
   {
      if(y=='v'||y=='V')
      System.out.println("Cube="+(x*x*x));
      else
      System.out.println("Diagonal="+Math.sqrt(3)*x);
   }
   void compute(int a, int b, char c)
   {      /**a and b stores length and breadth values and
           c stores a character*/
       if(c=='a'||c=='A')
       System.out.println("Area="+a*b);
       else
       System.out.println("Perimeter="+2*(a+b));
   }
   public static void main()
   {
      P1 obj=new P1();
      obj.compute(5,'s');
      obj.compute(3.0,'v');
      obj.compute(10,5,'a');
   }
}
```

## Question 2

2. Write a class with the name ***volume*** using function overloading that computes the volume of a cube, a sphere and a cuboid.

Formula:

***volume of a cube (vc) = s\*s\*s***

***volume of a sphere (vs) = 4/3 \* pi \* r \* r \* r (where pi = 3.14 or 22/7)***

***Volume of a cuboid (vcd) = l \* b \* h***

Write a ***main()*** method to create an object and invoke the above methods.

### Solution

```java
class volume
{
   void vol(int s)/**s-side of the cube*/
   {
      System.out.println("Volume of cube="+s*s*s);
   }
   void vol(double r)/**r-radius*/
   {
      System.out.println("Volume of Sphere="+4.0/3*22.0/7*r*r*r);
   }
   void vol(int L,int B,int H)/**L-length, B-Breadth, H-Height*/
   {
      System.out.println("Volume of Cuboid="+L*B*H);
   }
   public static void main()
   {
      volume obj=new volume();
      obj.vol(5);
      obj.vol(4.5);
      obj.vol(10,5,7);
   }
}
```

## Question 3

3. Design a class to overload a function ***series()*** as follows:

(i) ***double series(double n)*** with one double argument and returns the sum of the series.

***sum = 1/1 + 1/2 + 1/3 + ….. 1/n***

(ii) ***double series(double a, double n)*** with two double arguments and returns the sum of the series.

***Sum = 1/a<sup>2</sup> + 4/a<sup>5</sup> + 7/a<sup>8</sup> + 10/a<sup>11</sup> ….. to n terms***

Write a ***main()*** method to create an object and invoke the above methods.

### Solution

```java
public class P3
{
   double series(double n)//number of terms
   {
      double sum=0;//sum of series
      for(int i=1;i<=n;i++)
      {
         sum=sum+1.0/i;
      }
      return sum;
   }
   double series(double a, double n)/** two parameters are passing in the function*/
   {
      double sum=0,c=1,d=2;
      for(int i=1;i<=n;i++)
      {
         sum=sum+c/Math.pow(a,d);
         c=c+3;
         d=d+3;
      }
      return sum;/** return a double value */
   }
   void main()
   {
      P3 ob=new P3();
      System.out.println("Series 1 ="+ob.series(5.0));
      System.out.println("Series 2 ="+ob.series(2.0,10.0));

   }
}
```

## Question 4

4. Define a class to overload the method ***number()*** as follows:-

(i) ***public void number(int n)*** – print the square root value of each digit of a number n

```
   Example if n is 146
   Output: 6= 2.449
           4= 2.0
           1 = 1.0
```

(ii) ***public void number (int n, int d)*** – print the frequency of d in the number n

```
Example: If n is 121671 and d is 1
    Output: the frequency of 1 is 3
```

Write a ***main()*** method to create an object and invoke the above methods.

### Solution

```java
class p4
{
   public void number(int n)/**n stores a number*/
   {
      while(n>0)
      {
         int d=n%10;/**stores a digit*/
         double r=Math.sqrt(d);
         System.out.println(r);
         n=n/10;
      }
   }
   public void number(int n, int d)/**n-stores a number
   d-stores a digit*/
   {
      int f=0;/**frequency of digit*/
      while(n>0)
      {
         int r=n%10;
         if(r==d)
            f++;
         n=n/10;
      }
      System.out.println("Frequency="+f);
   }
   public static void main()
   {
      p4 obj=new p4();
      obj.number(1256);
      obj.number(12141,1);
   }
}
```

## Question 5

5, Define a class to overload the method ***pattern()*** as follows:-

(i) ***void pattern()*** – display the following pattern ***using nested for loop***.

```
121212
121212
121212
```

(ii) ***void pattern(int r, int c)*** – display the following pattern in 'r' rows and 'c' columns

***For example: If r is 5 and c is 5, then the output is:***

```
9 9 9 9 9
7 7 7 7 7
5 5 5 5 5
3 3 3 3 3
1 1 1 1 1
```

(iii) ***void pattern (char c, int n)*** – display the pattern in ***n rows*** using the ***character c***

***For example: If c is 'O' and n is 5***

```
O
OO
OOO
OOOO
OOOOO
```

Write a ***main()*** method to create an object and invoke the above methods.

### Solution

```java
public class P5
{
   void pattern(){
      for(int i=1;i<=3;i++)
      {
         for(int j=1;j<=6;j++)
         {
            if(j%2!=0)
               System.out.print(1);
            else
               System.out.print(2);
         }
         System.out.println();
      }
   }
   void pattern(int r, int c)
   {
      int a=9;
      for(int i=1;i<=r;i++)
      {
         for(int j=1;j<=c;j++)
         {
            System.out.print(a);
         }
         a-=2;
         System.out.println();

      }
   }
   void pattern(char c,int n)
   {
      for(int i=1;i<=n;i++)
      {
         for(int j=1;j<=i;j++)
         {
            System.out.print(c);
         }
         System.out.println();
      }
   }
   void main(){
      P5 ob=new P5();
      ob.pattern();
      ob.pattern(5,5);
      ob.pattern('a',5);
   }
}
```

---
