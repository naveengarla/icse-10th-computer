/* Tokeniser for the Java subset used in ICSE Class 10. */
(function () {
  var JP = (globalThis.JP = globalThis.JP || {});
  var E = (JP.engine = JP.engine || {});

  function CompileError(msg, line) {
    this.message = msg;
    this.line = line;
  }
  E.CompileError = CompileError;

  var KEYWORDS = {};
  ('int long double float char boolean byte short void if else while do for switch case default ' +
    'break continue return class public private protected static new true false null import final')
    .split(' ')
    .forEach(function (k) { KEYWORDS[k] = true; });
  E.KEYWORDS = KEYWORDS;

  var OPS = ['>>>=', '<<=', '>>=', '>>>', '++', '--', '+=', '-=', '*=', '/=', '%=', '==', '!=', '<=', '>=',
    '&&', '||', '<<', '>>', '+', '-', '*', '/', '%', '=', '<', '>', '!', '?', ':', ';', ',', '.', '(', ')',
    '{', '}', '[', ']', '&', '|', '^', '~'];

  var ESC = { n: '\n', t: '\t', b: '\b', r: '\r', f: '\f', '0': '\0', "'": "'", '"': '"', '\\': '\\' };

  E.lex = function (src) {
    var toks = [];
    var i = 0, line = 1, n = src.length;

    function adv(k) {
      for (var j = 0; j < k; j++) {
        if (src[i] === '\n') line++;
        i++;
      }
    }

    function readEscape(qline) {
      // at backslash
      var c = src[i + 1];
      if (c === 'u') {
        var hex = src.substr(i + 2, 4);
        if (!/^[0-9a-fA-F]{4}$/.test(hex)) throw new CompileError('Bad \\u escape: it needs exactly 4 hex digits, like \\u0041.', qline);
        adv(6);
        return String.fromCharCode(parseInt(hex, 16));
      }
      if (ESC.hasOwnProperty(c)) { adv(2); return ESC[c]; }
      throw new CompileError('Unknown escape \\' + c + ' — Java knows \\n, \\t, \\\', \\", \\\\.', qline);
    }

    while (i < n) {
      var c = src[i];
      if (c === ' ' || c === '\t' || c === '\r' || c === '\n') { adv(1); continue; }
      if (c === '/' && src[i + 1] === '/') { while (i < n && src[i] !== '\n') adv(1); continue; }
      if (c === '/' && src[i + 1] === '*') {
        var cl = line;
        adv(2);
        while (i < n && !(src[i] === '*' && src[i + 1] === '/')) adv(1);
        if (i >= n) throw new CompileError('This comment /* ... is never closed with */', cl);
        adv(2);
        continue;
      }
      var start = i, sline = line;

      if (/[A-Za-z_$]/.test(c)) {
        while (i < n && /[A-Za-z0-9_$]/.test(src[i])) adv(1);
        var w = src.slice(start, i);
        toks.push({ k: KEYWORDS[w] ? 'kw' : 'id', v: w, line: sline, s: start, e: i });
        continue;
      }

      if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(src[i + 1] || ''))) {
        var isFloat = false;
        while (i < n && /[0-9]/.test(src[i])) adv(1);
        if (src[i] === '.' && !/[A-Za-z_]/.test(src[i + 1] || '')) {
          isFloat = true;
          adv(1);
          while (i < n && /[0-9]/.test(src[i])) adv(1);
        }
        if (src[i] === 'e' || src[i] === 'E') {
          var save = i;
          adv(1);
          if (src[i] === '+' || src[i] === '-') adv(1);
          if (!/[0-9]/.test(src[i] || '')) { i = save; } else {
            isFloat = true;
            while (i < n && /[0-9]/.test(src[i])) adv(1);
          }
        }
        var text = src.slice(start, i);
        var t = isFloat ? 'double' : 'int';
        var suf = src[i];
        if (suf === 'L' || suf === 'l') { if (isFloat) throw new CompileError('A decimal number cannot end in L.', sline); t = 'long'; adv(1); }
        else if (suf === 'f' || suf === 'F') { t = 'float'; adv(1); }
        else if (suf === 'd' || suf === 'D') { t = 'double'; adv(1); }
        var val = parseFloat(text);
        if (t === 'int' && val > 2147483648) throw new CompileError('integer number too large: ' + text + ' (an int can hold at most 2147483647)', sline);
        if (t === 'float') val = Math.fround(val);
        if (/[A-Za-z_]/.test(src[i] || '')) throw new CompileError('A name cannot start with a digit: ' + src.slice(start, i + 1) + '…', sline);
        toks.push({ k: 'num', t: t, v: val, text: text, line: sline, s: start, e: i });
        continue;
      }

      if (c === "'") {
        adv(1);
        var ch;
        if (src[i] === "'") throw new CompileError("Empty character literal ''. A char must hold exactly one character, like 'A'.", sline);
        if (src[i] === '\\') ch = readEscape(sline);
        else if (src[i] === '\n' || i >= n) throw new CompileError("Character literal not closed — add the closing '.", sline);
        else { ch = src[i]; adv(1); }
        if (src[i] !== "'") {
          throw new CompileError("A char holds exactly ONE character between single quotes, like 'A'. For text with many characters use double quotes: \"…\" (a String).", sline);
        }
        adv(1);
        toks.push({ k: 'char', v: ch.charCodeAt(0), line: sline, s: start, e: i });
        continue;
      }

      if (c === '"') {
        adv(1);
        var s = '';
        while (true) {
          if (i >= n || src[i] === '\n') throw new CompileError('This text (String) is not closed — add the closing ".', sline);
          if (src[i] === '"') { adv(1); break; }
          if (src[i] === '\\') { s += readEscape(sline); continue; }
          s += src[i];
          adv(1);
        }
        toks.push({ k: 'str', v: s, line: sline, s: start, e: i });
        continue;
      }

      var op = null;
      for (var j = 0; j < OPS.length; j++) {
        if (src.substr(i, OPS[j].length) === OPS[j]) { op = OPS[j]; break; }
      }
      if (!op) {
        if (c === '“' || c === '”') throw new CompileError('Curly quotes “ ” are not allowed in Java. Use the straight quote ".', sline);
        throw new CompileError('Java does not understand the symbol ' + c, sline);
      }
      adv(op.length);
      toks.push({ k: 'op', v: op, line: sline, s: start, e: i });
    }
    toks.push({ k: 'eof', v: '<end>', line: line, s: n, e: n });
    return toks;
  };
})();
