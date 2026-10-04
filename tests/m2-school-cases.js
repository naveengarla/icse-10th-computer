/* School practical regression fixtures. Transcriptions stay unchanged.
   Portal corrections: sales net; Bank minimum after withdrawal; labelled digit roots; pattern spaces.
   Java 21 supplies the output oracle for these programs. */
module.exports = [
  {
    "name": "M2 school practical-2-data-members-methods.md #1",
    "src": "import java.util.*;\nclass sales\n{\n    String name;//customer's name\n    double price;//price of item\n    int qty;//quantity\n    double tprice;//total price\n    double tax;//sales tax\n    double net;//net amount\n    void input()\n    {\n        Scanner sc=new Scanner(System.in);\n        System.out.println(\"Enter name, price and quantity\");\n        name=sc.nextLine();\n        price=sc.nextDouble();\n        qty=sc.nextInt();\n    }\n    void calculate()\n    {\n        tprice=price*qty;\n        if(tprice>3000)\n        tax=tprice*17.5/100;\n        else if(tprice>1500)\n        tax=tprice*12.0/100;\n        else\n        tax=tprice*7.0/100;\n        net=tprice+tax;\n    }\n    void display()\n    {\n        System.out.println(\"Name is \"+name);\n        System.out.println(\"Total Price is \"+tprice);\n        System.out.println(\"Sales Tax is \"+tax);\n        System.out.println(\"Net amount is \"+net);\n    }\n    void main()\n    {\n        sales obj=new sales();/**obj is object*/\n        obj.input();\n        obj.calculate();\n        obj.display();\n    }\n}\n",
    "input": "Sample Customer\n1000\n4\n"
  },
  {
    "name": "M2 school practical-2-data-members-methods.md #2",
    "src": "import java.util.*;\nclass Library{\n    String name;//customer's name\n    int days;//number of days\n    int fine;//amount to pay\n    void accept()   {\n        Scanner sc=new Scanner(System.in);\n        System.out.println(\"Enter name, and no. of days\");\n        name=sc.nextLine();\n         days=sc.nextInt();\n    }\n    void compute()   {\n       if(days<=10)\n       fine=days*1;\n       else if(days>=11 && days<=20)\n       fine=10*1 + (days-10)*5;\n       else\n       if(days>20)\n       fine=1*10 + 10*5 + (days-20)*8;\n    }\n    void display()   {\n        System.out.println(\"Name\\tDays\\tFine\");\n        System.out.println(name+\"\\t\"+days+\"\\t\"+fine);\n    }\n    void main()\n    {\n        Library obj=new Library();/**obj is object*/\n        obj.accept();\n        obj.compute();\n        obj.display();\n    }\n}\n",
    "input": "Sample Reader\n25\n"
  },
  {
    "name": "M2 school practical-2-data-members-methods.md #3",
    "src": "import java.util.*;\nclass insurance\n{\n    int amount;//premium amount\n    char type;//type of plan\n    double bonus;//bonus amount\n    void accept()\n    {\n        Scanner sc=new Scanner(System.in);\n        System.out.println(\"Enter amount and type of plan\");\n        amount=sc.nextInt();\n        type=sc.next().charAt(0);\n    }\n    void calculate()\n    {\n        if(type=='C'||type=='c')\n        {\n            if(amount==5000)\n                bonus=amount*3.0/100;\n            else if(amount>=5001 && amount<=20000)\n                bonus=amount*5.0/100;\n            else if(amount>=20001 && amount<=45000)\n                bonus=amount*7.0/100;\n            else if(amount>=45001)\n                bonus=amount*10.0/100;\n        }\n        else if(type=='G'||type=='g')\n        {\n            if(amount==5000)\n                bonus=amount*1.5/100;\n            else if(amount>=5001 && amount<=20000)\n                bonus=amount*3.5/100;\n            else if(amount>=20001 && amount<=45000)\n                bonus=amount*6.0/100;\n            else if(amount>=45001)\n                bonus=amount*8.5/100;\n        }\n    }\n    void print()\n    {\n        System.out.println(\"Premium Amount is \"+amount);\n        System.out.println(\"type of plan is \"+type);\n        System.out.println(\"bonus amount is \"+bonus);\n    }\n    void main()\n    {\n        insurance obj=new insurance();\n        obj.accept();\n        obj.calculate();\n        obj.print();\n    }\n}\n",
    "input": "20000\nC\n"
  },
  {
    "name": "M2 school ch03-practical-method-overloading-solutions.md #1",
    "src": "class P1\n{\n   void compute(int a, char b)/**a-stores integer and b-stores a character*/\n   {\n      if(b=='s'||b=='S')\n      System.out.println(\"Square=\"+(a*a));\n      else\n      System.out.println(\"Cube=\"+(a*a*a));\n   }\n   void compute(double x, char y)/**x-stores a value\n                              and y stores a char*/\n   {\n      if(y=='v'||y=='V')\n      System.out.println(\"Cube=\"+(x*x*x));\n      else\n      System.out.println(\"Diagonal=\"+Math.sqrt(3)*x);\n   }\n   void compute(int a, int b, char c)\n   {      /**a and b stores length and breadth values and\n           c stores a character*/\n       if(c=='a'||c=='A')\n       System.out.println(\"Area=\"+a*b);\n       else\n       System.out.println(\"Perimeter=\"+2*(a+b));\n   }\n   public static void main()\n   {\n      P1 obj=new P1();\n      obj.compute(5,'s');\n      obj.compute(3.0,'v');\n      obj.compute(10,5,'a');\n   }\n}\n",
    "input": ""
  },
  {
    "name": "M2 school ch03-practical-method-overloading-solutions.md #2",
    "src": "class volume\n{\n   void vol(int s)/**s-side of the cube*/\n   {\n      System.out.println(\"Volume of cube=\"+s*s*s);\n   }\n   void vol(double r)/**r-radius*/\n   {\n      System.out.println(\"Volume of Sphere=\"+4.0/3*22.0/7*r*r*r);\n   }\n   void vol(int L,int B,int H)/**L-length, B-Breadth, H-Height*/\n   {\n      System.out.println(\"Volume of Cuboid=\"+L*B*H);\n   }\n   public static void main()\n   {\n      volume obj=new volume();\n      obj.vol(5);\n      obj.vol(4.5);\n      obj.vol(10,5,7);\n   }\n}\n",
    "input": ""
  },
  {
    "name": "M2 school ch03-practical-method-overloading-solutions.md #3",
    "src": "public class P3\n{\n   double series(double n)//number of terms\n   {\n      double sum=0;//sum of series\n      for(int i=1;i<=n;i++)\n      {\n         sum=sum+1.0/i;\n      }\n      return sum;\n   }\n   double series(double a, double n)/** two parameters are passing in the function*/\n   {\n      double sum=0,c=1,d=2;\n      for(int i=1;i<=n;i++)\n      {\n         sum=sum+c/Math.pow(a,d);\n         c=c+3;\n         d=d+3;\n      }\n      return sum;/** return a double value */\n   }\n   void main()\n   {\n      P3 ob=new P3();\n      System.out.println(\"Series 1 =\"+ob.series(5.0));\n      System.out.println(\"Series 2 =\"+ob.series(2.0,10.0));\n\n   }\n}\n",
    "input": ""
  },
  {
    "name": "M2 school ch03-practical-method-overloading-solutions.md #4",
    "src": "class p4\n{\n   public void number(int n)/**n stores a number*/\n   {\n      while(n>0)\n      {\n         int d=n%10;/**stores a digit*/\n         double r=Math.sqrt(d);\n         System.out.println(d+\" = \"+r);\n         n=n/10;\n      }\n   }\n   public void number(int n, int d)/**n-stores a number\n   d-stores a digit*/\n   {\n      int f=0;/**frequency of digit*/\n      while(n>0)\n      {\n         int r=n%10;\n         if(r==d)\n            f++;\n         n=n/10;\n      }\n      System.out.println(\"Frequency=\"+f);\n   }\n   public static void main()\n   {\n      p4 obj=new p4();\n      obj.number(1256);\n      obj.number(12141,1);\n   }\n}\n",
    "input": ""
  },
  {
    "name": "M2 school ch03-practical-method-overloading-solutions.md #5",
    "src": "public class P5\n{\n   void pattern(){\n      for(int i=1;i<=3;i++)\n      {\n         for(int j=1;j<=6;j++)\n         {\n            if(j%2!=0)\n               System.out.print(1);\n            else\n               System.out.print(2);\n         }\n         System.out.println();\n      }\n   }\n   void pattern(int r, int c)\n   {\n      int a=9;\n      for(int i=1;i<=r;i++)\n      {\n         for(int j=1;j<=c;j++)\n         {\n            System.out.print(a+\" \");\n         }\n         a-=2;\n         System.out.println();\n\n      }\n   }\n   void pattern(char c,int n)\n   {\n      for(int i=1;i<=n;i++)\n      {\n         for(int j=1;j<=i;j++)\n         {\n            System.out.print(c);\n         }\n         System.out.println();\n      }\n   }\n   void main(){\n      P5 ob=new P5();\n      ob.pattern();\n      ob.pattern(5,5);\n      ob.pattern('a',5);\n   }\n}\n",
    "input": ""
  },
  {
    "name": "M2 school ch04-practical-constructors-solutions.md #1",
    "src": "import java.util.*;\nclass Bank\n{\n   String name; //stores name\n   long ac_no; //account number\n   String ac_type; //account type\n   double balance; //account balance\n   Bank()\n   {\n      name=null;\n      ac_no=0;\n      ac_type=null;\n      balance=0.0;\n   }\n   void accept()\n   {\n      Scanner sc=new Scanner(System.in);\n      System.out.println(\"Enter the name\");\n      name=sc.next();\n      System.out.println(\"Enter the account number\");\n      ac_no=sc.nextLong();\n      System.out.println(\"Enter the account type\");\n      ac_type=sc.next();\n      System.out.println(\"Enter the balance amount\");\n      balance=sc.nextDouble();\n   }\n   void deposit(double amount)\n   {\n      balance=balance+amount;\n   }\n   void withdraw(double amount)\n   {\n      if(balance-amount>1000)\n      balance=balance-amount;\n      else\n      System.out.println(\"Insufficient balance\");\n   }\n   void display()\n   {\n      System.out.println(\"Name :\"+name);\n      System.out.println(\"Account No:\"+ac_no);\n      System.out.println(\"Account type:\"+ac_type);\n      System.out.println(\"Balance:\"+balance);\n   }\n   static void main()\n   {\n      Bank obj=new Bank();\n      obj.accept();\n      obj.deposit(45000);\n      obj.withdraw(500);\n      obj.display();\n   }\n}\n",
    "input": "Sample\n123456\nSaving\n2000\n"
  },
  {
    "name": "M2 school ch04-practical-constructors-solutions.md #2",
    "src": "class Employee\n{\n   int empNo;//employee number\n   String empName; //name of employee\n   double basicPay;//basic monthly income\n   double da;//dearness allowance\n   double hra;//house rent allowance\n   double grossPay;//gross monthly income\n   Employee(int id, String name,double bp)\n   {\n      empNo=id;\n      empName=name;\n      basicPay=bp;\n   }\n   void compute()\n   {\n      da=30.0/100*basicPay;\n      hra=15.0/100*basicPay;\n      grossPay=basicPay+hra+da;\n   }\n   void printSalarySlip()\n   {\n      System.out.println(\"Employee Id:\"+empNo);\n      System.out.println(\"Name:\"+empName);\n      System.out.println(\"BasicPay:\"+basicPay);\n      System.out.println(\"HouseRent Allowance:\"+hra);\n      System.out.println(\"DearnessAllowance:\"+da);\n      System.out.println(\"GrossSalary:\"+grossPay);\n   }\n   static void main()\n   {\n      Employee obj=new Employee(123,\"Abhishek\",45000);\n      obj.compute();\n      obj.printSalarySlip();\n   }\n}\n",
    "input": ""
  },
  {
    "name": "M2 school ch04-practical-constructors-solutions.md #3",
    "src": "class FiguresArea\n{\n   double area;\n   FiguresArea(double r)\n   {\n      area=3.14*r*r;\n      System.out.println(\"Area=\"+area);\n   }\n   FiguresArea(double l,double b)\n   {\n      area=l*b;\n      System.out.println(\"Area=\"+area);\n   }\n   FiguresArea(double a,double b,double c)\n   {\n      double s=(a+b+c)/2;\n      area=Math.sqrt(s*(s-a)*(s-b)*(s-c));\n      System.out.println(\"Area=\"+area);\n   }\n   static void main()\n   {\n      FiguresArea obj1=new FiguresArea(5.0);\n      FiguresArea obj2=new FiguresArea(10.5,7.0);\n      FiguresArea obj3=new FiguresArea(5.0,4.0,3.0);\n   }\n}\n",
    "input": ""
  }
];
