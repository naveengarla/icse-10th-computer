/* Java value model: every runtime value is {t: type, v: jsValue}. */
(function () {
  var JP = (globalThis.JP = globalThis.JP || {});
  var E = (JP.engine = JP.engine || {});

  var NUMERIC = { byte: 1, short: 2, char: 2, int: 3, long: 4, float: 5, double: 6 };
  var INTEGRAL = { byte: 1, short: 1, char: 1, int: 1, long: 1 };

  function isNumeric(t) { return Object.prototype.hasOwnProperty.call(NUMERIC, t); }
  function isIntegral(t) { return Object.prototype.hasOwnProperty.call(INTEGRAL, t); }

  // Binary numeric promotion (JLS 5.6.2).
  function promote2(a, b) {
    if (a === 'double' || b === 'double') return 'double';
    if (a === 'float' || b === 'float') return 'float';
    if (a === 'long' || b === 'long') return 'long';
    return 'int';
  }
  function promote1(a) {
    return a === 'byte' || a === 'short' || a === 'char' ? 'int' : a;
  }

  // Widening primitive conversion allowed without a cast?
  var WIDEN = {
    byte: ['short', 'int', 'long', 'float', 'double'],
    short: ['int', 'long', 'float', 'double'],
    char: ['int', 'long', 'float', 'double'],
    int: ['long', 'float', 'double'],
    long: ['float', 'double'],
    float: ['double'],
    double: []
  };
  function canWiden(from, to) {
    return from === to || (WIDEN[from] || []).indexOf(to) >= 0;
  }

  function toInt32(x) { return x | 0; }

  function dToIntegral(x, lo, hi) {
    if (isNaN(x)) return 0;
    if (x >= hi) return hi;
    if (x <= lo) return lo;
    return Math.trunc(x);
  }

  // Convert a raw JS number of type `from` into type `to` (cast semantics).
  function convert(v, from, to) {
    if (from === to) return v;
    var x = v;
    if (from === 'double' || from === 'float') {
      if (to === 'double') return x;
      if (to === 'float') return Math.fround(x);
      if (to === 'long') return dToIntegral(x, -9223372036854775808, 9223372036854775807);
      x = dToIntegral(x, -2147483648, 2147483647);
      from = 'int';
    }
    switch (to) {
      case 'double': return x;
      case 'float': return Math.fround(x);
      case 'long': return Math.trunc(x);
      case 'int': return toInt32(x);
      case 'char': return toInt32(x) & 0xffff;
      case 'short': return (toInt32(x) << 16) >> 16;
      case 'byte': return (toInt32(x) << 24) >> 24;
    }
    return x;
  }

  // Java's Double.toString
  function fmtDouble(x) {
    if (isNaN(x)) return 'NaN';
    if (x === Infinity) return 'Infinity';
    if (x === -Infinity) return '-Infinity';
    if (x === 0) return Object.is(x, -0) ? '-0.0' : '0.0';
    var a = Math.abs(x);
    if (a >= 1e-3 && a < 1e7) {
      var s = String(x);
      if (s.indexOf('e') >= 0) s = x.toFixed(20).replace(/0+$/, '');
      if (s.indexOf('.') < 0) s += '.0';
      return s;
    }
    var ex = x.toExponential(); // e.g. "1.2345e+7"
    var parts = ex.split('e');
    var mant = parts[0];
    if (mant.indexOf('.') < 0) mant += '.0';
    return mant + 'E' + parseInt(parts[1], 10);
  }

  function fmtFloat(x) {
    if (!isFinite(x) || x === 0) return fmtDouble(x);
    var s = String(x);
    for (var p = 1; p <= 9; p++) {
      s = x.toPrecision(p);
      if (Math.fround(parseFloat(s)) === x) break;
    }
    return fmtDouble(parseFloat(s));
  }

  // How the value prints (System.out.print / string concatenation).
  function str(val) {
    if (val == null || val.v === null) return 'null';
    switch (val.t) {
      case 'double': return fmtDouble(val.v);
      case 'float': return fmtFloat(val.v);
      case 'char': return String.fromCharCode(val.v);
      case 'boolean': return val.v ? 'true' : 'false';
      case 'String': return val.v;
      default: return String(val.v);
    }
  }

  // How the value is written as Java source (used in memory boxes and reductions).
  function lit(val) {
    if (val == null) return '?';
    if (val.v === null) return 'null';
    if (val.v && val.v.objectId) return '→ object #' + val.v.objectId;
    switch (val.t) {
      case 'char': return "'" + escChar(String.fromCharCode(val.v)) + "'";
      case 'String': return '"' + val.v.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\t/g, '\\t') + '"';
      case 'Scanner': return 'keyboard reader';
      default: return str(val);
    }
  }
  function escChar(c) {
    if (c === '\u0000') return '\\u0000';
    if (c === '\n') return '\\n';
    if (c === '\t') return '\\t';
    if (c === "'") return "\\'";
    if (c === '\\') return '\\\\';
    return c;
  }

  function V(t, v) { return { t: t, v: v }; }

  E.values = {
    isNumeric: isNumeric,
    isIntegral: isIntegral,
    promote2: promote2,
    promote1: promote1,
    canWiden: canWiden,
    convert: convert,
    fmtDouble: fmtDouble,
    fmtFloat: fmtFloat,
    str: str,
    lit: lit,
    V: V
  };
})();
