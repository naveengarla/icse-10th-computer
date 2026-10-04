# Practical Exercise 2 - Programs on Data Members and Member Methods

> Transcribed from school-provided practical exercise (5 pages). Authority for depth and style of exam answers — see docs/01-problem-statement.md.

SUBJECT: COMPUTER APPLICATIONS

STD: X – ICSE

CHAPTER 2 – PRACTICAL EXERCISE

## Program 1: sales

1. Define a class with the following specifications:-

Classname: sales

**Data Members**:

- String name : customer's name
- double price : price of an item
- int qty : number of items purchased.
- double tprice : total price
- double tax: sales tax
- double net: net amount to be paid [tprice + tax]

**Member methods:**

void input() : Accept details for name, price and qty.

void calculate(): calculate the total price, sales tax and the net amount as per given below:

| Total Price | Sales tax in % |
|---|---|
| More than Rs. 3,000 | 17.5% |
| More than Rs. 1,500 | 12% |
| Otherwise | 7% |

void display(): print name, tprice, tax and the net amount.

Write a main() method to create an object and call the above member methods.

### Solution

```java
import java.util.*;
class sales
{
    String name;//customer's name
    double price;//price of item
    int qty;//quantity
    double tprice;//total price
    double tax;//sales tax
    double net;//net amount
    void input()
    {
        Scanner sc=new Scanner(System.in);
        System.out.println("Enter name, price and quantity");
        name=sc.nextLine();
        price=sc.nextDouble();
        qty=sc.nextInt();
    }
    void calculate()
    {
        tprice=price*qty;
        if(tprice>3000)
        tax=tprice*17.5/100;
        else if(tprice>1500)
        tax=tprice*12.0/100;
        else
        tax=tprice*7.0/100;
    }
    void display()
    {
        System.out.println("Name is "+name);
        System.out.println("Total Price is "+tprice);
        System.out.println("Sales Tax is "+tax);
        System.out.println("Net amount is "+net);
    }
    void main()
    {
        sales obj=new sales();/**obj is object*/
        obj.input();
        obj.calculate();
        obj.display();
    }
}
```

## Program 2: Library

2. Define a class Library having the following description:

**Data Members/Instance variables**:

- name : stores student's name
- days: number of days book returned late.
- fine: amount to be paid as fine.

**Member methods:**

void accept(): to initialize name and days through Scanner class.

void compute(): calculate the fine as per given below:

| Days | Fine per day |
|---|---|
| First 10 days | Rs.1 |
| Next 10 days | Rs.5 |
| Later than 20 days | Rs.8 |

void display(): print the name, days and the amount as

```
Name      days    fine
 Xxx      xxx     xxx
```

Write a main() method to create an object and call the above member methods.

### Solution

```java
import java.util.*;
class Library{
    String name;//customer's name
    int days;//number of days
    int fine;//amount to pay
    void accept()   {
        Scanner sc=new Scanner(System.in);
        System.out.println("Enter name, and no. of days");
        name=sc.nextLine();
         days=sc.nextInt();
    }
    void compute()   {
       if(days<=10)
       fine=days*1;
       else if(days>=11 && days<=20)
       fine=10*1 + (days-10)*5;
       else
       if(days>20)
       fine=1*10 + 10*5 + (days-20)*8;
    }
    void display()   {
        System.out.println("Name\tDays\tFine");
        System.out.println(name+"\t"+days+"\t"+fine);
    }
    void main()
    {
        Library obj=new Library();/**obj is object*/
        obj.accept();
        obj.compute();
        obj.display();
    }
}
```

## Program 3: insurance

3. Define a class insurance having the following description:

**Data Members:**

- int amount : premium amount
- char type: type of plan 'C'/'c' for Child and 'G'/'g' for general
- double bonus : bonus amount.

**Member methods:**

void accept() : accept details for amount and type of plan

void calculate(): calculate the premium amount as per the following:

[Source has a handwritten correction here: "premium" is struck out and "bonus" written beside it, i.e. "calculate the bonus amount as per the following".]

| Premium amount in Rs | Child plan | General plan |
|---|---|---|
| Minimum Rs.5,000 | 3% on Premium amount | 1.5% on Premium amount |
| Rs.5,001 – Rs.20,000 | 5% on Premium amount | 3.5% on Premium amount |
| Rs.20,001 – Rs. 45,000 | 7% on Premium amount | 6.0% on Premium amount |
| Rs.45,001 and above | 10% on Premium amount | 8.5% on Premium amount |

void print(): Print the premium amount, type of plan and the bonus amount.

Write a main() method to create an object and call the above member methods.

### Solution

```java
import java.util.*;
class insurance
{
    int amount;//premium amount
    char type;//type of plan
    double bonus;//bonus amount
    void accept()
    {
        Scanner sc=new Scanner(System.in);
        System.out.println("Enter amount and type of plan");
        amount=sc.nextInt();
        type=sc.next().charAt(0);
    }
    void calculate()
    {
        if(type=='C'||type=='c')
        {
            if(amount==5000)
                bonus=amount*3.0/100;
            else if(amount>=5001 && amount<=20000)
                bonus=amount*5.0/100;
            else if(amount>=20001 && amount<=45000)
                bonus=amount*7.0/100;
            else if(amount>=45001)
                bonus=amount*10.0/100;
        }
        else if(type=='G'||type=='g')
        {
            if(amount==5000)
                bonus=amount*1.5/100;
            else if(amount>=5001 && amount<=20000)
                bonus=amount*3.5/100;
            else if(amount>=20001 && amount<=45000)
                bonus=amount*6.0/100;
            else if(amount>=45001)
                bonus=amount*8.5/100;
        }
    }
    void print()
    {
        System.out.println("Premium Amount is "+amount);
        System.out.println("type of plan is "+type);
        System.out.println("bonus amount is "+bonus);
    }
    void main()
    {
        insurance obj=new insurance();
        obj.accept();
        obj.calculate();
        obj.print();
    }
}
```
