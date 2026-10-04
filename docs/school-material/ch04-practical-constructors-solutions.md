# Chapter 4 – Practical Exercise (Constructors) – Solutions

> Transcribed from school-provided material (5 pages). Authority for depth and style of exam answers — see docs/01-problem-statement.md.

## Question 1

*(This question is unnumbered in the source.)*

Define a class ***Bank*** with the following specifications:

***Instance Variables:***

***String name*** – to store the name of the account holder.

***long ac_no*** – to store the account number.

***String ac_type*** – to store account type (Saving / Current).

***double balance*** – to store the current balance.

***Member Methods:***

***Bank()*** – default constructor to assign default values to instance variables.

***void accept()***– accept name, ac_no, ac_type and balance using Scanner class methods.

***void deposit(double amount)*** – to add money to the balance.

***void withdraw(double amount)*** – to deduct money if the balance remains above the minimum required limit of ₹ 1000. Display "Insufficient Balance" otherwise.

***void display()*** – to display the name, account number, type, and current balance.

Write a ***main()*** method to invoke the above methods using objects.

### Solution

```java
import java.util.*;
class Bank
{
   String name; //stores name
   long ac_no; //account number
   String ac_type; //account type
   double balance; //account balance
   Bank()
   {
      name=null;
      ac_no=0;
      ac_type=null;
      balance=0.0;
   }
   void accept()
   {
      Scanner sc=new Scanner(System.in);
      System.out.println("Enter the name");
      name=sc.next();
      System.out.println("Enter the account number");
      ac_no=sc.nextLong();
      System.out.println("Enter the account type");
      ac_type=sc.next();
      System.out.println("Enter the balance amount");
      balance=sc.nextDouble();
   }
   void deposit(double amount)
   {
      balance=balance+amount;
   }
   void withdraw(double amount)
   {
      if(balance>=1000)
      balance=balance-amount;
      else
      System.out.println("Insufficient balance");
   }
   void display()
   {
      System.out.println("Name :"+name);
      System.out.println("Account No:"+ac_no);
      System.out.println("Account type:"+ac_type);
      System.out.println("Balance:"+balance);
   }
   static void main()
   {
      Bank obj=new Bank();
      obj.accept();
      obj.deposit(45000);
      obj.withdraw(500);
      obj.display();
   }
}
```

## Question 2

2. Design a class ***Employee*** to process employee salaries with the following details:

***Instance Variables:***

***int empNo*** – to store employee ID.

***String empName*** – to store employee name.

***double basicPay*** – to store basic monthly pay.

***double da*** – Dearness Allowance.

***double hra*** – House Rent Allowance.

***double grossPay*** – Gross monthly salary.

***Member Methods:***

***Employee(int id, String name, double bp)*** – parameterized constructor to assign values to empNo, empName, and basicPay.

***void compute()*** – to calculate components as per the rules:

da = 30% of basicPay

hra = 15% of basicPay

grossPay = basicPay + da + hra

void printSalarySlip() – print the details.

Write a main() method to create an object and invoke the above member methods.

### Solution

```java
class Employee
{
   int empNo;//employee number
   String empName; //name of employee
   double basicPay;//basic monthly income
   double da;//dearness allowance
   double hra;//house rent allowance
   double grossPay;//gross monthly income
   Employee(int id, String name,double bp)
   {
      empNo=id;
      empName=name;
      basicPay=bp;
   }
   void compute()
   {
      da=30.0/100*basicPay;
      hra=15.0/100*basicPay;
      grossPay=basicPay+hra+da;
   }
   void printSalarySlip()
   {
      System.out.println("Employee Id:"+empNo);
      System.out.println("Name:"+empName);
      System.out.println("BasicPay:"+basicPay);
      System.out.println("HouseRent Allowance:"+hra);
      System.out.println("DearnessAllowance:"+da);
      System.out.println("GrossSalary:"+grossPay);
   }
   static void main()
   {
      Employee obj=new Employee(123,"Abhishek",45000);
      obj.compute();
      obj.printSalarySlip();
   }
}
```

## Question 3

3. Design a class named ***FiguresArea***.

***Instance Variables:***

***double area*** – to store the calculated area of the specific figure.

***FiguresArea(double r)*** – calculates the area of a circle (area = π × r²).

***FiguresArea(double l, double b)*** – calculates the area of a rectangle (area = l × b).

***FiguresArea(double a, double b, double c)*** – calculates the area of a scalene triangle using Heron's Formula: s = (a+b+c)/2   area = √( s(s − a)(s − b)(s − c) )

Write a main() method to create three separate objects of the class (one for each constructor) and display their respective areas.

### Solution

```java
class FiguresArea
{
   double area;
   FiguresArea(double r)
   {
      area=3.14*r*r;
      System.out.println("Area="+area);
   }
   FiguresArea(double l,double b)
   {
      area=l*b;
      System.out.println("Area="+area);
   }
   FiguresArea(double a,double b,double c)
   {
      double s=(a+b+c)/2;
      area=Math.sqrt(s*(s-a)*(s-b)*(s-c));
      System.out.println("Area="+area);
   }
   static void main()
   {
      FiguresArea obj1=new FiguresArea(5.0);
      FiguresArea obj2=new FiguresArea(10.5,7.0);
      FiguresArea obj3=new FiguresArea(5.0,4.0,3.0);
   }
}
```

---
