/* "Try it in real Java": copy a W3Schools-ready version of the program and open their online compiler. */
(function () {
  var JP = globalThis.JP;
  var h = JP.dom.h;
  var URL = 'https://www.w3schools.com/java/tryjava.asp?filename=demo_helloworld';

  // W3Schools runs "public class Main" with "public static void main(String[] args)".
  JP.ui.toW3 = function (src) {
    var prog;
    try { prog = JP.engine.parse(src); } catch (e) { prog = null; }
    if (!prog || prog.snippet) {
      var body = src.split('\n').map(function (l) { return '    ' + l; }).join('\n');
      return 'import java.util.*;\n\npublic class Main\n{\n  public static void main(String[] args)\n  {\n' + body + '\n  }\n}\n';
    }
    var cls = prog.className;
    var main = prog.main;
    var call = main.isStatic ? cls + '.main(' + (main.params.length ? 'args' : '') + ');' : 'new ' + cls + '().main();';
    var text = src.replace(/public\s+class\s+/, 'class ');
    if (!/import\s+java\.util/.test(text)) text = 'import java.util.*;\n' + text;
    return text.replace(/\s*$/, '\n') + '\n// W3Schools starts here and runs the program above\npublic class Main\n{\n  public static void main(String[] args)\n  {\n    ' + call + '\n  }\n}\n';
  };

  JP.ui.tryW3Button = function (getSrc, usesInput) {
    var msg = h('span.w3-msg');
    var btn = h('button.btn.ghost', {
      title: 'Copies this program (adapted for W3Schools) and opens their free online Java compiler in a new tab',
      on: {
        click: function () {
          var code = JP.ui.toW3(getSrc());
          var done = function (ok) {
            msg.textContent = ok
              ? 'Copied! In the W3Schools tab: click in the code, press Ctrl+A then Ctrl+V, then "Run ❯".' + (usesInput ? ' (Their site cannot take keyboard input, so programs that use Scanner will not run there.)' : '')
              : 'Could not copy automatically — select the code yourself and copy it.';
          };
          if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(code).then(function () { done(true); }, function () { done(false); });
          else done(false);
          window.open(URL, '_blank', 'noopener');
        }
      }
    }, 'Try in real Java ↗');
    return h('span.w3', btn, msg);
  };
})();
