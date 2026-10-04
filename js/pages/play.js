/* Playground: write or paste any small program and step through it. */
(function () {
  var JP = globalThis.JP;
  var h = JP.dom.h;

  var SAMPLES = [
    ['Swap two boxes', 'int a = 5, b = 9;\nint t = a;\na = b;\nb = t;\nSystem.out.println("a = " + a + ", b = " + b);'],
    ['Sum of 1 to 5', 'int s = 0;\nfor (int i = 1; i <= 5; i++)\n{\n    s = s + i;\n}\nSystem.out.println("Sum = " + s);'],
    ['Reverse a number', 'int n = 2048, rev = 0, d;\nwhile (n > 0)\n{\n    d = n % 10;\n    rev = rev * 10 + d;\n    n = n / 10;\n}\nSystem.out.println(rev);'],
    ['Grade slabs', 'int m = 67;\nif (m >= 80)\n    System.out.println("A");\nelse if (m >= 60)\n    System.out.println("B");\nelse\n    System.out.println("C");'],
    ['Full program with input', 'import java.util.*;\nclass Area\n{\n    void main()\n    {\n        Scanner sc = new Scanner(System.in);\n        System.out.println("Enter length and breadth");\n        int l = sc.nextInt();\n        int b = sc.nextInt();\n        int area = l * b;\n        System.out.println("Area = " + area);\n    }\n}']
  ];

  JP.pages.play = {
    render: function (main) {
      var holder = h('div');
      var saved = JP.store.setting('playCode');
      function load(code, input) {
        JP.dom.clear(holder);
        var st = JP.ui.Stepper({
          code: code, input: input || (/Scanner/.test(code) ? '4 7\n' : ''), editable: true, wrap: true, title: 'Your program',
          onBuild: function (src) { JP.store.setting('playCode', src); } // remember the last code she ran
        });
        holder.appendChild(st.el);
      }
      main.appendChild(h('div.page-head', h('h1', 'Playground'),
        h('p.muted', 'Write any small program and watch Java run it. Statements on their own are fine — the class and main() frame is added for you. You can also write a full program with class and main().')));
      main.appendChild(h('div.samples', h('span.muted', 'Start from: '), SAMPLES.map(function (s) {
        return h('button.btn.tiny', { on: { click: function () { load(s[1]); } } }, s[0]);
      })));
      main.appendChild(holder);
      load(saved || SAMPLES[0][1]);
    }
  };
})();
