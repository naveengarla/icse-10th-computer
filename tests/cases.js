/* Engine test cases. Programs without "class" are wrapped in class T { void main() { ... } } for the JDK check.
   expr cases: {expr, vars:{name:{t,v}}, value (source form), after:{name: value}} */
function I(v) { return { t: 'int', v: v }; }
function C(ch) { return { t: 'char', v: ch.charCodeAt(0) }; }
function D(v) { return { t: 'double', v: v }; }
function P(s) { return 'System.out.println(' + s + ');'; }

module.exports = [
  // ---------- worksheet: Evaluate the expressions ----------
  { name: 'a+=b+=c', src: 'int a=2,b=6,c=10;\na+=b+=c;\n' + P('a+", "+b+", "+c'), out: '18, 16, 10\n' },
  { name: 'p+=p++ + q++ - ++p', expr: 'p+=p++ + q++ - ++p', vars: { p: I(6), q: I(7) }, value: '11', after: { p: '11', q: '8' } },
  { name: 'y*=++x + ++y + x--', expr: 'y*=++x + ++y + x--', vars: { x: I(5), y: I(10) }, value: '230', after: { x: '5', y: '230' } },
  { name: 'm+=m-- + ++n + ++m + --n', expr: 'm+=m-- + ++n + ++m + --n', vars: { m: I(10), n: I(5) }, value: '41', after: { m: '41', n: '5' } },
  { name: "'2'+'d'", expr: 'x+y', vars: { x: C('2'), y: C('d') }, value: '150', type: 'int' },
  { name: '++x + ++y on chars', expr: '++x + ++y', vars: { x: C('2'), y: C('d') }, value: '152', after: { x: "'3'", y: "'e'" } },
  { name: 'char c=67 series', src: 'char c=67;\n' + P('c') + '\n' + P('c+3') + '\n' + P('(char)(c+3)') + '\n' + P("'5'") + '\n' + P('"5"+5') + '\n' + P('"Output is "+(++c)+2'),
    out: 'C\n70\nF\n5\n55\nOutput is D2\n' },
  { name: 'Math.round(-3.5)', expr: 'Math.round(-3.5)', value: '-3', type: 'long' },
  { name: 'Math.round(2.5)', expr: 'Math.round(2.5)', value: '3' },
  { name: "Math.min('x','X')", expr: "Math.min('x','X')", value: '88', type: 'int' },
  { name: 'pow(2,0)+pow(3,1/3)', expr: 'Math.pow(2,0)+Math.pow(3,1/3)', value: '2.0' },
  { name: 'empty while body', src: 'int a=5;\nwhile(++a<=20);\n' + P('a'), out: '21\n' },
  { name: 'for comma init runs 4 times', src: 'int a,b;\nfor(a=34,b=5;a<=50;a+=b)\n{\n' + P('a') + '\n}', out: '34\n39\n44\n49\n', passes: 4 },

  // ---------- printing & sequence ----------
  { name: 'print vs println', src: 'System.out.print("Hi");\nSystem.out.print(" there");\nSystem.out.println();\n' + P('"2+3"') + '\n' + P('2+3'), out: 'Hi there\n2+3\n5\n' },
  { name: 'String + order', src: 'int a=2,b=3;\n' + P('"Sum="+a+b') + '\n' + P('a+b+"=Sum"') + '\n' + P('"Sum="+(a+b)'), out: 'Sum=23\n5=Sum\nSum=5\n' },
  { name: 'char + String', src: "char ch='A';\n" + P("ch+1") + '\n' + P('ch+"1"') + '\n' + P("(char)(ch+1)") + '\n' + P("'A'+'B'") + '\n' + P('""+\'A\'+\'B\''), out: '66\nA1\nB\n131\nAB\n' },

  // ---------- arithmetic ----------
  { name: 'int division & %', src: P('7/2') + '\n' + P('7/2.0') + '\n' + P('-7/2') + '\n' + P('-7%3') + '\n' + P('7%-3') + '\n' + P('7.5%2'), out: '3\n3.5\n-3\n-1\n1\n1.5\n' },
  { name: 'double formatting', src: P('1.0/3') + '\n' + P('10/4*1.0') + '\n' + P('0.1+0.2') + '\n' + P('100.0') + '\n' + P('1234567.0') + '\n' + P('12345678.0') + '\n' + P('0.001') + '\n' + P('0.0001') + '\n' + P('-0.0') + '\n' + P('1e20') + '\n' + P('2.5e-5'),
    out: '0.3333333333333333\n2.0\n0.30000000000000004\n100.0\n1234567.0\n1.2345678E7\n0.001\n1.0E-4\n-0.0\n1.0E20\n2.5E-5\n' },
  { name: 'float formatting', src: 'float f=1.1f;\n' + P('f*2') + '\n' + P('0.1f+0.2f') + '\n' + P('f') + '\n' + P('(double)f'), out: '2.2\n0.3\n1.1\n1.100000023841858\n' },
  { name: 'int overflow wraps', src: 'int x=2147483647;\nx=x+1;\n' + P('x') + '\n' + P('Integer.MAX_VALUE*2'), out: '-2147483648\n-2\n' },
  { name: 'long arithmetic', src: 'long p=1;\nfor(int i=1;i<=15;i++)\np=p*i;\n' + P('p'), out: '1307674368000\n' },
  { name: 'casts', src: P('(int)3.99') + '\n' + P('(int)-3.99') + '\n' + P("(int)'a'") + '\n' + P('(char)97') + '\n' + P('(double)7/2') + '\n' + P('(double)(7/2)'), out: '3\n-3\n97\na\n3.5\n3.0\n' },
  { name: 'compound narrowing', src: "int i=5;\ni+=2.7;\n" + P('i') + "\nchar ch='A';\nch+=2;\n" + P('ch') + '\nch++;\n' + P('ch'), out: '7\nC\nD\n' },
  { name: 'Math machines', src: P('Math.sqrt(16)') + '\n' + P('Math.cbrt(27)') + '\n' + P('Math.ceil(-4.2)') + '\n' + P('Math.floor(-4.2)') + '\n' + P('Math.abs(-5)') + '\n' + P('Math.abs(-5.5)') + '\n' + P('Math.round(2.4f)') + '\n' + P('Math.max(3,7.0)') + '\n' + P('Math.pow(2,10)') + '\n' + P('Math.rint(2.5)') + '\n' + P('Math.ceil(4.0001)'),
    out: '4.0\n3.0\n-4.0\n-5.0\n5\n5.5\n2\n7.0\n1024.0\n2.0\n5.0\n' },
  { name: 'formula with brackets', src: 'double a=9,b=4;\ndouble r=(Math.sqrt(a)+Math.sqrt(b))/(a-b);\n' + P('r') + '\n' + P('Math.sqrt(a)+Math.sqrt(b)/(a-b)'), out: '1.0\n3.4\n' },
  { name: 'ternary', src: 'int a=10,b=20;\nint big=(a>b)?a:b;\n' + P('big') + '\n' + P('a%2==0?"Even":"Odd"'), out: '20\nEven\n' },
  { name: 'ternary char/int', src: "char c='A';\nint i=0;\n" + P('true?c:0') + '\n' + P('true?c:i') + '\n' + P("false?1.0:'B'"), out: 'A\n65\n66.0\n' },
  { name: 'short circuit', src: 'int x=5;\nif(x>10 && ++x>0)\n' + P('"in"') + '\n' + P('x'), out: '5\n' },

  // ---------- decisions ----------
  { name: 'if else-if ladder', src: 'int m=72;\nif(m>=90)\n' + P('"A"') + '\nelse if(m>=70)\n' + P('"B"') + '\nelse if(m>=50)\n' + P('"C"') + '\nelse\n' + P('"D"'), out: 'B\n' },
  { name: 'dangling else', src: 'int x=5,y=10;\nif(x>10)\nif(y>5)\n' + P('"one"') + '\nelse\n' + P('"two"') + '\n' + P('"end"'), out: 'end\n' },
  { name: 'switch fall-through', src: 'int n=2;\nswitch(n)\n{\ncase 1: System.out.println("one");\ncase 2: System.out.println("two");\ncase 3: System.out.println("three");\nbreak;\ndefault: System.out.println("other");\n}', out: 'two\nthree\n' },
  { name: 'switch default', src: "char ch='z';\nswitch(ch)\n{\ncase 'a':\ncase 'e': System.out.println(\"vowel\"); break;\ndefault: System.out.println(\"consonant\");\n}", out: 'consonant\n' },
  { name: 'switch String', src: 'String s="Hi";\nswitch(s)\n{\ncase "Hi": System.out.println(1); break;\ncase "Bye": System.out.println(2);\n}', out: '1\n' },

  // ---------- loops ----------
  { name: 'while counting', src: 'int i=1;\nwhile(i<=3)\n{\n' + P('i') + '\ni++;\n}\n' + P('"after: "+i'), out: '1\n2\n3\nafter: 4\n', passes: 3 },
  { name: 'do-while runs once', src: 'int i=10;\ndo\n{\n' + P('i') + '\ni++;\n} while(i<5);', out: '10\n', passes: 1 },
  { name: 'for never runs', src: 'for(int i=5;i<5;i++)\n' + P('i') + '\n' + P('"done"'), out: 'done\n', passes: 0 },
  { name: 'break & continue', src: 'for(int i=1;i<=10;i++)\n{\nif(i%2==0)\ncontinue;\nif(i>7)\nbreak;\nSystem.out.print(i+" ");\n}', out: '1 3 5 7 ' },
  { name: 'series 1.0/i', src: 'double s=0;\nfor(int i=1;i<=4;i++)\ns=s+1.0/i;\n' + P('s') + '\nint t=0;\nfor(int i=1;i<=4;i++)\nt=t+1/i;\n' + P('t'), out: '2.083333333333333\n1\n' },
  { name: 'nested pattern', src: 'for(int i=1;i<=3;i++)\n{\nfor(int j=1;j<=i;j++)\n{\nSystem.out.print(j);\n}\nSystem.out.println();\n}', out: '1\n12\n123\n' },
  { name: 'fibonacci', src: 'int a=0,b=1,c;\nSystem.out.print(a+" "+b);\nfor(int i=3;i<=7;i++)\n{\nc=a+b;\nSystem.out.print(" "+c);\na=b;\nb=c;\n}', out: '0 1 1 2 3 5 8' },
  { name: 'loop variable scope removed', src: 'int s=0;\nfor(int i=1;i<=2;i++)\ns+=i;\n' + P('s'), out: '3\n',
    check: function (r) { return r.steps.some(function (s) { return s.kind === 'scopeEnd'; }) ? null : 'no scopeEnd step'; } },

  // ---------- digits ----------
  { name: 'reverse & palindrome', src: 'int n=1221,copy=n,rev=0,d;\nwhile(n>0)\n{\nd=n%10;\nrev=rev*10+d;\nn=n/10;\n}\nif(rev==copy)\n' + P('"Palindrome"') + '\nelse\n' + P('"Not"'), out: 'Palindrome\n', vars: { n: '0', rev: '1221' } },
  { name: 'armstrong', src: 'int n=153,copy=n,s=0;\nwhile(n>0)\n{\nint d=n%10;\ns=s+d*d*d;\nn=n/10;\n}\n' + P('copy+(s==copy?" is":" is not")+" Armstrong"'), out: '153 is Armstrong\n' },
  { name: 'digit count & sum', src: 'int n=40719,c=0,s=0;\nwhile(n!=0)\n{\ns+=n%10;\nc++;\nn/=10;\n}\n' + P('c+" "+s'), out: '5 21\n', passes: 5 },

  // ---------- Scanner ----------
  { name: 'scanner school style', src: 'import java.util.*;\nclass p1\n{\nvoid main()\n{\n/** reads input */\nScanner sc=new Scanner(System.in);\nSystem.out.println("Enter a number");\nint n=sc.nextInt();\nSystem.out.println("Enter price");\ndouble p=sc.nextDouble();\nSystem.out.println("Enter name");\nString s=sc.next();\nchar ch=sc.next().charAt(0);\nSystem.out.println(n*2+" "+p+" "+s+" "+ch);\n}\n}', input: '21\n5\nRiya\nyes\n', out: 'Enter a number\nEnter price\nEnter name\n42 5.0 Riya y\n' },
  { name: 'scanner nextLine', src: 'Scanner sc=new Scanner(System.in);\nString line=sc.nextLine();\nint k=sc.nextInt();\n' + P('line+"|"+k'), input: 'hello world\n7\n', out: 'hello world|7\n' },
  { name: 'scanner mismatch', src: 'Scanner sc=new Scanner(System.in);\nint k=sc.nextInt();', input: 'abc\n', runtimeError: 'InputMismatchException', jdk: false },
  { name: 'scanner no input', src: 'Scanner sc=new Scanner(System.in);\nint k=sc.nextInt();', input: '', runtimeError: 'NoInput', jdk: false },

  // ---------- library ----------
  { name: 'Character & String methods', src: "char c='g';\n" + P('Character.toUpperCase(c)') + '\n' + P("Character.isDigit('7')") + '\n' + P("Character.isLetter('7')") + '\nString s="Computer";\n' + P('s.length()') + '\n' + P('s.charAt(3)') + '\n' + P('s.indexOf(\'u\')') + '\n' + P('s.substring(3,6)') + '\n' + P('"apple".compareTo("apricot")') + '\n' + P('s.toUpperCase()') + '\n' + P('Integer.parseInt("12")+3'),
    out: 'G\ntrue\nfalse\n8\np\n4\nput\n-2\nCOMPUTER\n15\n' },
  { name: 'user method', src: 'class M\n{\nstatic int sq(int x)\n{\nreturn x*x;\n}\nvoid main()\n{\nint a=sq(4)+sq(3);\nSystem.out.println(a);\n}\n}', out: '25\n',
    check: function (r) { return r.steps.some(function (s) { return s.kind === 'call'; }) ? null : 'no call step'; } },
  { name: 'fields default values', src: 'class F\n{\nint n;\ndouble d;\nString s;\nvoid main()\n{\nSystem.out.println(n+" "+d+" "+s);\n}\n}', out: '0 0.0 null\n' },

  // ---------- runtime errors ----------
  { name: 'divide by zero', src: 'int a=5,b=0;\n' + P('a/b'), runtimeError: 'ArithmeticException' },
  { name: 'double / 0', src: P('5.0/0') + '\n' + P('-5/0.0') + '\n' + P('0.0/0'), out: 'Infinity\n-Infinity\nNaN\n' },
  { name: 'charAt out of range', src: 'String s="abc";\n' + P('s.charAt(3)'), runtimeError: 'StringIndexOutOfBoundsException' },
  { name: 'infinite loop guard', src: 'int i=1;\nwhile(i>0)\ni=1;', runtimeError: 'infinite', jdk: false },
  { name: 'System.exit', src: P('"a"') + '\nSystem.exit(0);\n' + P('"b"'), out: 'a\n' },

  // ---------- compile errors ----------
  { name: 'lossy int=3.5', src: 'int x=3.5;', compileError: 'lossy', errLine: 1 },
  { name: 'undeclared', src: 'int a=5;\nb=a+1;', compileError: true, errLine: 2 },
  { name: 'missing ;', src: 'int a=5\nint b=6;', compileError: ';', errLine: 1 },
  { name: 'char = "A"', src: 'char c="A";', compileError: true },
  { name: 'if(x=5)', src: 'int x=3;\nif(x=5)\n' + P('x'), compileError: true, errLine: 2 },
  { name: 'duplicate variable', src: 'int a=1;\nint a=2;', compileError: true, errLine: 2 },
  { name: 'loop var out of scope', src: 'for(int i=0;i<3;i++)\n' + P('i') + '\n' + P('i'), compileError: true, errLine: 3 },
  { name: 'string lowercase type', src: 'string s="a";', compileError: true },
  { name: 'long to int', src: 'int r=Math.round(2.5);', compileError: 'lossy' },
  { name: 'uninitialised read', src: 'int x;\nint y=x+1;', runtimeError: 'before it has been given a value', jdk: false },

  // ---------- M2 objects, methods, constructors ----------
  { name: 'M2 snapshots preserve past object state', src: 'class M\n{\nint x;\nvoid set(int n){x=n;}\nstatic void main(){M a=new M(); a.set(5); a.set(9);}\n}', out: '',
    check: function (r) {
      var states = r.steps.filter(function (s) { return s.mem.objects.length && s.mem.objects[0].fields[0].text === '5'; });
      if (!states.length) return 'past value 5 disappeared from the snapshots';
      var last = r.steps[r.steps.length - 1];
      if (last.mem.objects[0].fields[0].text !== '9') return 'final object state is wrong';
      var call = r.steps.filter(function (s) { return s.kind === 'call'; })[0];
      return call.mem.frames[call.mem.frames.length - 1].objectId === 1 ? null : 'method frame lost its receiver';
    } },
  { name: 'M2 initialization before constructor snapshot', src: 'class M\n{\nint x=3;\nM(){x+=4;}\nstatic void main(){M a=new M();}\n}', out: '',
    check: function (r) {
      var created = r.steps.filter(function (s) { return s.kind === 'object'; })[0];
      var ctor = r.steps.filter(function (s) { return s.kind === 'constructor'; })[0];
      return created.mem.objects[0].fields[0].text === '0' && ctor.mem.objects[0].fields[0].text === '3' ? null : 'defaults, initializer and constructor are out of order';
    } },
  {"name": "M2 independent object fields", "src": "class M\n{\nint x;\nvoid set(int v){x=v;}\nvoid show(){System.out.println(x);}\nstatic void main()\n{\nM a=new M(); M b=new M(); a.set(7); b.show(); a.show();\n}\n}", "out": "0\n7\n"},
  {"name": "M2 parameter copies and shadowing", "src": "class M\n{\nint x=9;\nvoid change(int x){x=20; System.out.println(x);}\nint read(){return x;}\nstatic void main()\n{\nint x=4; M a=new M(); a.change(x); System.out.println(x); System.out.println(a.read());\n}\n}", "out": "20\n4\n9\n"},
  {"name": "M2 nested instance calls", "src": "class M\n{\nint x;\nvoid first(){x=3; second();}\nvoid second(){x+=4;}\nstatic void main()\n{\nM a=new M(); a.first(); System.out.println(a.x);\n}\n}", "out": "7\n"},
  {"name": "M2 no argument constructor automatic", "src": "class M\n{\nint x=2;\nM(){x+=5; System.out.println(x);}\nstatic void main()\n{\nM a=new M(); System.out.println(a.x);\n}\n}", "out": "7\n7\n"},
  {"name": "M2 parameterized constructor", "src": "class M\n{\nint x;\nM(int n){x=n;}\nint read(){return x;}\nstatic void main()\n{\nM a=new M(8); M b=new M(3); System.out.println(a.read()+b.read());\n}\n}", "out": "11\n"},
  {"name": "M2 constructor overload widening", "src": "class M\n{\nint x;\nM(long n){x=1;}\nM(double n){x=2;}\nstatic void main()\n{\nM a=new M(4); M b=new M(4.0); System.out.println(a.x+\" \"+b.x);\n}\n}", "out": "1 2\n"},
  {"name": "M2 default constructor unavailable", "src": "class M\n{\n\nM(int n){}\nstatic void main()\n{\nM a=new M();\n}\n}", "compileError": true},
  {"name": "M2 duplicate signature return type", "src": "class M\n{\n\nint f(int n){return n;}\ndouble f(int n){return n;}\nstatic void main()\n{\n\n}\n}", "compileError": "return type"},
  {"name": "M2 duplicate constructor", "src": "class M\n{\n\nM(int n){}\nM(int x){}\nstatic void main()\n{\n\n}\n}", "compileError": true},
  {"name": "M2 static cannot read instance field", "src": "class M\n{\nint x;\n\nstatic void main()\n{\nSystem.out.println(x);\n}\n}", "compileError": "instance field"},
  {"name": "M2 static cannot call instance method", "src": "class M\n{\n\nvoid f(){}\nstatic void main()\n{\nf();\n}\n}", "compileError": "instance method"},
  {"name": "M2 class call to instance method rejected", "src": "class M\n{\n\nvoid f(){}\nstatic void main()\n{\nM.f();\n}\n}", "compileError": "instance method"},
  {"name": "M2 static helper via class", "src": "class M\n{\n\nstatic int f(int n){return n*n;}\nstatic void main()\n{\nSystem.out.println(M.f(5));\n}\n}", "out": "25\n"},
  {"name": "M2 overload most specific long before double", "src": "class M\n{\n\nstatic int f(double x){return 2;}\nstatic int f(long x){return 1;}\nstatic void main()\n{\nSystem.out.println(f(7));\n}\n}", "out": "1\n"},
  {"name": "M2 overload char exact and widening", "src": "class M\n{\n\nstatic int f(long x){return 1;}\nstatic int f(int x){return 2;}\nstatic int f(char x){return 3;}\nstatic void main()\n{\nSystem.out.println(f('A')); System.out.println(f(65)); System.out.println(f(65L));\n}\n}", "out": "3\n2\n1\n"},
  {"name": "M2 ambiguous crossed overloads", "src": "class M\n{\n\nstatic int f(int a,double b){return 1;}\nstatic int f(double a,int b){return 2;}\nstatic void main()\n{\nSystem.out.println(f(1,2));\n}\n}", "compileError": "Ambiguous"},
  {"name": "M2 ambiguous constructors", "src": "class M\n{\n\nM(int a,double b){}\nM(double a,int b){}\nstatic void main()\n{\nM a=new M(1,2);\n}\n}", "compileError": "Ambiguous"},
  {"name": "M2 count of exact arguments is insufficient", "src": "class M\n{\n\nstatic int f(int a,double b,double c){return 1;}\nstatic int f(long a,int b,int c){return 2;}\nstatic void main()\n{\nSystem.out.println(f(1,2,3));\n}\n}", "compileError": "Ambiguous"},
  {"name": "M2 null instance call", "src": "class M\n{\n\nvoid f(){}\nstatic void main()\n{\nM a=null; a.f();\n}\n}", "runtimeError": "NullPointerException"},
  {"name": "M2 static through null does not dereference", "src": "class M\n{\n\nstatic void f(){System.out.println(7);}\nstatic void main()\n{\nM a=null; a.f();\n}\n}", "out": "7\n"},
  {"name": "M2 BlueJ implicit main object initialized", "src": "class M\n{\nint x=3;\nM(){x+=2;}\nvoid f(){System.out.println(x);}\nvoid main()\n{\nf();\n}\n}", "out": "5\n"},
  {"name": "M2 field default values", "src": "class M\n{\nint n; double d; boolean b; char c; String s;\n\nstatic void main()\n{\nM a=new M(); System.out.println(a.n+\" \"+a.d+\" \"+a.b+\" \"+(int)a.c+\" \"+a.s);\n}\n}", "out": "0 0.0 false 0 null\n"},
  {"name": "M2 references point to existing objects", "src": "class M\n{\nint x;\nvoid set(int n){x=n;}\nstatic void main()\n{\nM a=new M(); M b=a; b.set(6); System.out.println(a.x);\n}\n}", "out": "6\n"},
  {"name": "M2 void method with class name is not constructor", "src": "class M\n{\nint x;\nvoid M(){x=8;}\nstatic void main()\n{\nM a=new M(); System.out.println(a.x); a.M(); System.out.println(a.x);\n}\n}", "out": "0\n8\n"},
  {"name": "M2 static state used by school demo", "src": "class M\n{\nstatic int x;\nstatic void set(int y){x=y;}\nvoid show(){System.out.println(x);}\nstatic void main()\n{\nM a=new M(); M b=new M(); a.set(5); b.show();\n}\n}", "out": "5\n"},

  // ---------- expression reducer ----------
  { name: 'reducer precedence', expr: '2+3*4-6/4', value: '13' },
  { name: 'reducer String', expr: '"A"+1+2', value: '"A12"' },
  { name: 'reducer error', expr: 'x+1', error: true }
];
