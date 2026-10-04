/* Library classes in the ICSE syllabus: Math, Character, wrapper parse/toString, String methods, Scanner.
   Each entry: check(argTypes) -> return type or an error string; call(args, rt) -> value. */
(function () {
  var JP = (globalThis.JP = globalThis.JP || {});
  var E = (JP.engine = JP.engine || {});
  var Vs = E.values;
  var V = Vs.V;

  function RuntimeErr(name, msg) {
    this.javaName = name;
    this.message = msg;
  }
  E.RuntimeErr = RuntimeErr;

  var num = Vs.isNumeric;

  function oneNum(ret) {
    return function (ts) {
      if (ts.length !== 1) return 'needs exactly 1 value inside the brackets';
      if (!num(ts[0])) return 'needs a number, not a ' + ts[0];
      return ret;
    };
  }
  function n(a) { return a.v; }
  function fixZero(x) { return x === 0 ? 0 : x; }

  var MathLib = {
    sqrt: { check: oneNum('double'), call: function (a) { return V('double', Math.sqrt(n(a[0]))); } },
    cbrt: { check: oneNum('double'), call: function (a) { return V('double', Math.cbrt(n(a[0]))); } },
    ceil: { check: oneNum('double'), call: function (a) { return V('double', Math.ceil(n(a[0]))); } },
    floor: { check: oneNum('double'), call: function (a) { return V('double', Math.floor(n(a[0]))); } },
    log: { check: oneNum('double'), call: function (a) { return V('double', Math.log(n(a[0]))); } },
    exp: { check: oneNum('double'), call: function (a) { return V('double', Math.exp(n(a[0]))); } },
    rint: {
      check: oneNum('double'),
      call: function (a) {
        var x = n(a[0]), f = Math.floor(x), d = x - f, r;
        if (d < 0.5) r = f; else if (d > 0.5) r = f + 1; else r = f % 2 === 0 ? f : f + 1;
        return V('double', r === 0 && x < 0 ? -0 : r);
      }
    },
    pow: {
      check: function (ts) {
        if (ts.length !== 2) return 'needs exactly 2 values: Math.pow(base, power)';
        if (!num(ts[0]) || !num(ts[1])) return 'needs two numbers';
        return 'double';
      },
      call: function (a) { return V('double', Math.pow(n(a[0]), n(a[1]))); }
    },
    round: {
      check: function (ts) {
        var r = oneNum('x')(ts);
        if (r !== 'x') return r;
        return ts[0] === 'double' ? 'long' : 'int';
      },
      call: function (a) {
        var x = n(a[0]);
        var t = a[0].t === 'double' ? 'long' : 'int';
        if (isNaN(x)) return V(t, 0);
        var r = fixZero(Math.round(x));
        return V(t, t === 'int' ? Vs.convert(r, 'double', 'int') : r);
      }
    },
    abs: {
      check: function (ts) {
        var r = oneNum('x')(ts);
        return r === 'x' ? Vs.promote1(ts[0]) : r;
      },
      call: function (a) {
        var t = Vs.promote1(a[0].t);
        var x = Math.abs(n(a[0]));
        return V(t, t === 'int' ? x | 0 : x);
      }
    },
    max: {
      check: twoNum,
      call: function (a) { var t = Vs.promote2(a[0].t, a[1].t); return V(t, Math.max(n(a[0]), n(a[1]))); }
    },
    min: {
      check: twoNum,
      call: function (a) { var t = Vs.promote2(a[0].t, a[1].t); return V(t, Math.min(n(a[0]), n(a[1]))); }
    },
    random: {
      check: function (ts) { return ts.length ? 'takes no values' : 'double'; },
      call: function () { return V('double', Math.random()); }
    }
  };
  function twoNum(ts) {
    if (ts.length !== 2) return 'needs exactly 2 values';
    if (!num(ts[0]) || !num(ts[1])) return 'needs two numbers';
    return Vs.promote2(ts[0], ts[1]);
  }

  // ----- Character -----
  function ch(a) { return String.fromCharCode(a.v); }
  function charPred(fn) {
    return {
      check: function (ts) {
        if (ts.length !== 1) return 'needs exactly 1 character';
        if (ts[0] !== 'char' && ts[0] !== 'int') return 'needs a char, not a ' + ts[0];
        return 'boolean';
      },
      call: function (a) { return V('boolean', fn(ch(a[0]), a[0].v)); }
    };
  }
  function charConv(up) {
    return {
      check: function (ts) {
        if (ts.length !== 1) return 'needs exactly 1 character';
        if (ts[0] !== 'char' && ts[0] !== 'int') return 'needs a char, not a ' + ts[0];
        return ts[0];
      },
      call: function (a) {
        var c = ch(a[0]);
        var r = up ? c.toUpperCase() : c.toLowerCase();
        var code = r.length === 1 ? r.charCodeAt(0) : a[0].v;
        return V(a[0].t, code);
      }
    };
  }
  var CharacterLib = {
    isLetter: charPred(function (c) { return /\p{L}/u.test(c); }),
    isDigit: charPred(function (c) { return /\p{Nd}/u.test(c); }),
    isLetterOrDigit: charPred(function (c) { return /[\p{L}\p{Nd}]/u.test(c); }),
    isWhitespace: charPred(function (c, code) {
      if (code === 0xa0 || code === 0x2007 || code === 0x202f) return false;
      return /[ \t\n\x0B\f\r\x1C-\x1F]/.test(c) || /[\p{Zs}\p{Zl}\p{Zp}]/u.test(c);
    }),
    isUpperCase: charPred(function (c) { return /\p{Lu}/u.test(c); }),
    isLowerCase: charPred(function (c) { return /\p{Ll}/u.test(c); }),
    toUpperCase: charConv(true),
    toLowerCase: charConv(false)
  };

  // ----- wrappers -----
  function parser(t, re, label) {
    return {
      check: function (ts) {
        if (ts.length !== 1) return 'needs exactly 1 value';
        if (ts[0] !== 'String') return 'needs a String (text), not a ' + ts[0];
        return t;
      },
      call: function (a) {
        var s = a[0].v;
        if (s === null || !re.test(s)) throw new RuntimeErr('NumberFormatException', 'For input string: "' + s + '" — this text is not a valid ' + label + '.');
        var x = parseFloat(s);
        if (t === 'int' && (x > 2147483647 || x < -2147483648)) throw new RuntimeErr('NumberFormatException', 'For input string: "' + s + '" — too big for an int.');
        return V(t, t === 'float' ? Math.fround(x) : x);
      }
    };
  }
  var INT_RE = /^[+-]?\d+$/;
  var DEC_RE = /^\s*[+-]?(\d+\.?\d*([eE][+-]?\d+)?|\.\d+([eE][+-]?\d+)?)[fFdD]?\s*$/;
  function toStr(fromTypes) {
    return {
      check: function (ts) {
        if (ts.length !== 1) return 'needs exactly 1 value';
        if (fromTypes.indexOf(ts[0]) < 0 && !(fromTypes[0] === 'any')) return 'cannot convert a ' + ts[0] + ' here';
        return 'String';
      },
      call: function (a) { return V('String', Vs.str(a[0])); }
    };
  }
  var IntegerLib = { parseInt: parser('int', INT_RE, 'int'), valueOf: parser('int', INT_RE, 'int'), toString: toStr(['int', 'char', 'short', 'byte']) };
  var LongLib = { parseLong: parser('long', INT_RE, 'long'), valueOf: parser('long', INT_RE, 'long'), toString: toStr(['long', 'int', 'char', 'short', 'byte']) };
  var DoubleLib = { parseDouble: parser('double', DEC_RE, 'double'), valueOf: parser('double', DEC_RE, 'double'), toString: toStr(['double', 'float', 'long', 'int', 'char', 'short', 'byte']) };
  var FloatLib = { parseFloat: parser('float', DEC_RE, 'float'), valueOf: parser('float', DEC_RE, 'float'), toString: toStr(['float', 'long', 'int', 'char', 'short', 'byte']) };
  var CharacterStatic = Object.assign({ toString: toStr(['char']) }, CharacterLib);
  var StringStatic = { valueOf: toStr(['any']) };

  var STATIC_FIELDS = {
    Math: { PI: V('double', Math.PI), E: V('double', Math.E) },
    Integer: { MAX_VALUE: V('int', 2147483647), MIN_VALUE: V('int', -2147483648) }
  };

  // ----- String instance methods -----
  function S(retOrFn, argSpec, impl) {
    return {
      check: function (ts) { return checkSig(ts, argSpec, retOrFn); },
      call: impl
    };
  }
  // argSpec: array of alternative signatures, each an array of allowed-type-lists
  function checkSig(ts, sigs, ret) {
    for (var i = 0; i < sigs.length; i++) {
      var sig = sigs[i];
      if (sig.length !== ts.length) continue;
      var ok = true;
      for (var j = 0; j < sig.length; j++) {
        if (sig[j].indexOf(ts[j]) < 0 && sig[j].indexOf('*') < 0) { ok = false; break; }
      }
      if (ok) return typeof ret === 'function' ? ret(ts) : ret;
    }
    var want = sigs.map(function (s) { return '(' + s.map(function (a) { return a[0]; }).join(', ') + ')'; }).join(' or ');
    return 'expects ' + want + ', but got (' + ts.join(', ') + ')';
  }
  var INTISH = ['int', 'char', 'short', 'byte'];
  var CHARISH = ['char', 'int'];
  var STR = ['String'];

  function idx(s, i, len) {
    if (i < 0 || i >= len) throw new RuntimeErr('StringIndexOutOfBoundsException', 'index ' + i + ' is outside the string "' + s + '" (valid positions are 0 to ' + (len - 1) + ').');
  }
  function sub(s, b, e) {
    if (b < 0 || e > s.length || b > e) throw new RuntimeErr('StringIndexOutOfBoundsException', 'substring(' + b + ', ' + e + ') does not fit in "' + s + '" (length ' + s.length + ').');
    return s.substring(b, e);
  }
  function needle(a) { return a.t === 'String' ? a.v : String.fromCharCode(a.v); }
  function cmp(a, b, fold) {
    var n1 = a.length, n2 = b.length, lim = Math.min(n1, n2);
    for (var k = 0; k < lim; k++) {
      var c1 = a.charCodeAt(k), c2 = b.charCodeAt(k);
      if (fold) {
        c1 = String.fromCharCode(c1).toUpperCase().toLowerCase().charCodeAt(0);
        c2 = String.fromCharCode(c2).toUpperCase().toLowerCase().charCodeAt(0);
      }
      if (c1 !== c2) return c1 - c2;
    }
    return n1 - n2;
  }

  var StringMethods = {
    length: S('int', [[]], function (a, self) { return V('int', self.length); }),
    charAt: S('char', [[INTISH]], function (a, self) { idx(self, a[0].v, self.length); return V('char', self.charCodeAt(a[0].v)); }),
    indexOf: S('int', [[CHARISH.concat(STR)], [CHARISH.concat(STR), INTISH]], function (a, self) {
      return V('int', self.indexOf(needle(a[0]), a.length > 1 ? Math.max(0, a[1].v) : 0));
    }),
    lastIndexOf: S('int', [[CHARISH.concat(STR)], [CHARISH.concat(STR), INTISH]], function (a, self) {
      return V('int', a.length > 1 ? (a[1].v < 0 ? -1 : self.lastIndexOf(needle(a[0]), a[1].v)) : self.lastIndexOf(needle(a[0])));
    }),
    substring: S('String', [[INTISH], [INTISH, INTISH]], function (a, self) {
      return V('String', sub(self, a[0].v, a.length > 1 ? a[1].v : self.length));
    }),
    equals: S('boolean', [[['*']]], function (a, self) { return V('boolean', a[0].t === 'String' && a[0].v === self); }),
    equalsIgnoreCase: S('boolean', [[STR]], function (a, self) {
      return V('boolean', a[0].v !== null && a[0].v.length === self.length && cmp(self, a[0].v, true) === 0);
    }),
    compareTo: S('int', [[STR]], function (a, self) { return V('int', cmp(self, a[0].v, false)); }),
    compareToIgnoreCase: S('int', [[STR]], function (a, self) { return V('int', cmp(self, a[0].v, true)); }),
    toUpperCase: S('String', [[]], function (a, self) { return V('String', self.toUpperCase()); }),
    toLowerCase: S('String', [[]], function (a, self) { return V('String', self.toLowerCase()); }),
    trim: S('String', [[]], function (a, self) { return V('String', self.replace(/^[\x00-\x20]+|[\x00-\x20]+$/g, '')); }),
    startsWith: S('boolean', [[STR]], function (a, self) { return V('boolean', self.startsWith(a[0].v)); }),
    endsWith: S('boolean', [[STR]], function (a, self) { return V('boolean', self.endsWith(a[0].v)); }),
    concat: S('String', [[STR]], function (a, self) { return V('String', self + a[0].v); }),
    replace: S('String', [[['char'], ['char']], [STR, STR]], function (a, self) {
      return V('String', self.split(needle(a[0])).join(needle(a[1])));
    })
  };

  // ----- Scanner -----
  function scan(name, t) {
    return {
      check: function (ts) { return ts.length ? 'takes nothing inside the brackets' : t; },
      call: function (a, self, rt) { return rt.input.read(name); }
    };
  }
  var ScannerMethods = {
    nextInt: scan('nextInt', 'int'),
    nextLong: scan('nextLong', 'long'),
    nextDouble: scan('nextDouble', 'double'),
    nextFloat: scan('nextFloat', 'float'),
    nextBoolean: scan('nextBoolean', 'boolean'),
    next: scan('next', 'String'),
    nextLine: scan('nextLine', 'String')
  };

  // Input tape that behaves like java.util.Scanner on System.in.
  function InputTape(text) {
    this.text = text || '';
    this.pos = 0;
    this.log = [];
  }
  InputTape.prototype.read = function (kind) {
    var s = this.text, p = this.pos;
    if (kind === 'nextLine') {
      if (p >= s.length) throw new RuntimeErr('NoInput', 'The program is waiting for you to type a line, but the input box is empty. Add more input and run again.');
      var nl = s.indexOf('\n', p);
      var line = nl < 0 ? s.slice(p) : s.slice(p, nl);
      this.pos = nl < 0 ? s.length : nl + 1;
      line = line.replace(/\r$/, '');
      this.log.push({ kind: kind, text: line });
      return V('String', line);
    }
    while (p < s.length && /\s/.test(s[p])) p++;
    if (p >= s.length) throw new RuntimeErr('NoInput', 'The program is waiting for input (' + kind + '), but there is nothing left in the input box. Add another value and run again.');
    var q = p;
    while (q < s.length && !/\s/.test(s[q])) q++;
    var tok = s.slice(p, q);
    var val;
    switch (kind) {
      case 'nextInt':
      case 'nextLong':
        if (!INT_RE.test(tok)) throw new RuntimeErr('InputMismatchException', kind + '() expected a whole number but the next input is "' + tok + '".');
        val = V(kind === 'nextInt' ? 'int' : 'long', parseInt(tok, 10));
        break;
      case 'nextDouble':
      case 'nextFloat':
        if (!DEC_RE.test(tok) || /[fFdD]$/.test(tok)) throw new RuntimeErr('InputMismatchException', kind + '() expected a number but the next input is "' + tok + '".');
        val = V(kind === 'nextDouble' ? 'double' : 'float', kind === 'nextFloat' ? Math.fround(parseFloat(tok)) : parseFloat(tok));
        break;
      case 'nextBoolean':
        if (!/^(true|false)$/i.test(tok)) throw new RuntimeErr('InputMismatchException', 'nextBoolean() expected true or false but got "' + tok + '".');
        val = V('boolean', tok.toLowerCase() === 'true');
        break;
      default:
        val = V('String', tok);
    }
    this.pos = q;
    this.log.push({ kind: kind, text: tok });
    return val;
  };
  E.InputTape = InputTape;

  E.lib = {
    staticClasses: {
      Math: MathLib,
      Character: CharacterStatic,
      Integer: IntegerLib,
      Long: LongLib,
      Double: DoubleLib,
      Float: FloatLib,
      String: StringStatic
    },
    staticFields: STATIC_FIELDS,
    instance: { String: StringMethods, Scanner: ScannerMethods }
  };
})();
