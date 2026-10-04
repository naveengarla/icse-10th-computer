/* Static checks: the things javac would refuse to compile, explained for a beginner. Annotates expr.type. */
(function () {
  var JP = (globalThis.JP = globalThis.JP || {});
  var E = (JP.engine = JP.engine || {});
  var Vs = E.values;
  var CompileError = E.CompileError;
  var num = Vs.isNumeric;

  var KNOWN_TYPES = { int: 1, long: 1, double: 1, float: 1, char: 1, boolean: 1, byte: 1, short: 1, String: 1, Scanner: 1 };
  var RANGE = { byte: [-128, 127], short: [-32768, 32767], char: [0, 65535] };

  function err(msg, line) { throw new CompileError(msg, line); }

  // Compile-time constant value of an int/char expression made only of literals, or undefined.
  function constInt(e) {
    switch (e.kind) {
      case 'Lit':
        return e.t === 'int' || e.t === 'char' ? e.v : undefined;
      case 'Unary': {
        var a = constInt(e.arg);
        if (a === undefined) return undefined;
        return e.op === '-' ? -a : e.op === '+' ? a : undefined;
      }
      case 'Bin': {
        var l = constInt(e.l), r = constInt(e.r);
        if (l === undefined || r === undefined) return undefined;
        switch (e.op) {
          case '+': return (l + r) | 0;
          case '-': return (l - r) | 0;
          case '*': return Math.imul(l, r);
          case '/': return r === 0 ? undefined : (l / r) | 0;
          case '%': return r === 0 ? undefined : l % r;
        }
        return undefined;
      }
      case 'Cast': {
        var c = constInt(e.arg);
        return c === undefined ? undefined : Vs.convert(c, 'int', e.type);
      }
    }
    return undefined;
  }
  E.constInt = constInt;

  // Can a value of type `from` (from expression e) be stored in a box of type `to`?
  function assignable(to, from, e) {
    if (to === from) return true;
    if (from === 'null') return !Vs.isNumeric(to) && to !== 'boolean';
    if (num(to) && num(from)) {
      if (Vs.canWiden(from, to)) return true;
      if (RANGE[to] && (from === 'int' || from === 'char' || from === 'short' || from === 'byte') && e) {
        var c = constInt(e);
        if (c !== undefined && c >= RANGE[to][0] && c <= RANGE[to][1]) return true;
      }
    }
    return false;
  }
  E.assignable = assignable;

  function badAssignMsg(to, from, e) {
    if (num(to) && num(from)) {
      var hint = '';
      if ((from === 'double' || from === 'float') && Vs.isIntegral(to)) hint = ' An ' + to + ' box holds whole numbers only. If you really want to drop the decimal part, write a cast: (' + to + ')';
      else if (to === 'char') hint = ' A char box takes a char; an ' + from + ' expression needs a cast: (char)';
      else hint = ' Use a cast like (' + to + ') if you are sure.';
      return 'Type mismatch: possible lossy conversion from ' + from + ' to ' + to + '.' + hint;
    }
    if (to === 'String' && from === 'char') return "Type mismatch: a char (single quotes) cannot go into a String box. Use double quotes for a String: \"A\" not 'A'.";
    if (to === 'char' && from === 'String') return "Type mismatch: a String (double quotes) cannot go into a char box. Use single quotes for one character: 'A' not \"A\".";
    if (from === 'String' && num(to)) return 'Type mismatch: text (String) cannot go into a ' + to + ' box. (Text in quotes is not a number, even if it looks like one.)';
    if (to === 'boolean') return 'Type mismatch: a boolean box holds only true or false, not a ' + from + '.';
    if (from === 'boolean') return 'Type mismatch: true/false (boolean) cannot go into a ' + to + ' box.';
    if (from === 'void') return 'This method gives back nothing (void), so there is no value to store.';
    return 'Type mismatch: a ' + from + ' cannot be stored in a ' + to + ' box.';
  }

  function Checker(prog) {
    this.prog = prog;
    this.scopes = [];
    this.method = null;
    this.breakable = [];
    this.methods = {};
    var self = this;
    prog.methods.forEach(function (m) {
      (self.methods[m.name] = self.methods[m.name] || []).push(m);
    });
  }
  var C = Checker.prototype;

  C.lookup = function (name) {
    for (var i = this.scopes.length - 1; i >= 0; i--) {
      if (Object.prototype.hasOwnProperty.call(this.scopes[i].vars, name)) return this.scopes[i].vars[name];
    }
    return null;
  };
  C.declare = function (name, type, line, isField) {
    if (!KNOWN_TYPES[type]) {
      if (type === 'string') err("Java is case-sensitive: write String with a capital S.", line);
      if (type === 'Int' || type === 'Double' || type === 'Char') err("Data types are lowercase in Java: write " + type.toLowerCase() + '.', line);
      if (type !== this.prog.className) err("Unknown data type '" + type + "'.", line);
    }
    var top = this.scopes[this.scopes.length - 1];
    if (!isField) {
      for (var i = this.scopes.length - 1; i >= 0 && !this.scopes[i].isFieldScope; i--) {
        if (Object.prototype.hasOwnProperty.call(this.scopes[i].vars, name)) {
          err("A variable called '" + name + "' already exists here. You can't create two boxes with the same name — just use the existing one (without writing the type again).", line);
        }
      }
    } else if (Object.prototype.hasOwnProperty.call(top.vars, name)) {
      err("'" + name + "' is declared twice.", line);
    }
    top.vars[name] = type;
  };

  C.checkProgram = function () {
    var prog = this.prog;
    var fieldScope = { vars: {}, isFieldScope: true };
    this.scopes.push(fieldScope);
    var self = this;
    prog.fields.forEach(function (f) {
      f.decls.forEach(function (d) {
        if (d.init) self.expectAssignable(f.type, d.init, d.line);
        self.declare(d.name, f.type, d.line, true);
      });
    });
    prog.methods.forEach(function (m) { self.checkMethod(m); });
    prog.ctors.forEach(function (m) { self.checkMethod(m); });
  };

  C.checkMethod = function (m) {
    this.method = m;
    this.scopes.push({ vars: {} });
    var self = this;
    m.params.forEach(function (p) {
      if (p.type === 'String[]') { self.scopes[self.scopes.length - 1].vars[p.name] = 'String[]'; return; }
      self.declare(p.name, p.type, p.line);
    });
    this.block(m.body.body);
    this.scopes.pop();
    this.method = null;
  };

  C.block = function (stmts) {
    this.scopes.push({ vars: {} });
    for (var i = 0; i < stmts.length; i++) this.stmt(stmts[i]);
    this.scopes.pop();
  };

  C.cond = function (e, what) {
    var t = this.expr(e);
    if (t !== 'boolean') {
      if (e.kind === 'Assign' && e.op === '=') err('The condition of ' + what + " must be true/false. You wrote = (store). To compare, use == (two equals signs).", e.line);
      err('The condition of ' + what + ' must be true or false (a boolean), but this is a ' + t + '.', e.line);
    }
  };

  C.stmt = function (s) {
    var self = this;
    switch (s.kind) {
      case 'Block': this.block(s.body); break;
      case 'Empty': break;
      case 'VarDecl':
        s.decls.forEach(function (d) {
          if (d.init) self.expectAssignable(s.type, d.init, d.line);
          self.declare(d.name, s.type, d.line);
        });
        break;
      case 'ExprStmt': this.expr(s.expr); break;
      case 'If':
        this.cond(s.cond, 'if');
        this.sub(s.then);
        if (s.els) this.sub(s.els);
        break;
      case 'While':
        this.cond(s.cond, 'while');
        this.breakable.push('loop');
        this.sub(s.body);
        this.breakable.pop();
        break;
      case 'DoWhile':
        this.breakable.push('loop');
        this.sub(s.body);
        this.breakable.pop();
        this.cond(s.cond, 'do-while');
        break;
      case 'For':
        this.scopes.push({ vars: {} });
        s.init.forEach(function (st) { self.stmt(st); });
        if (s.cond) this.cond(s.cond, 'for');
        s.update.forEach(function (u) {
          self.expr(u);
          if (!(u.kind === 'Assign' || u.kind === 'Update' || u.kind === 'Call')) err('The update part of a for loop must change something, e.g. i++ or i = i + 2.', u.line);
        });
        this.breakable.push('loop');
        this.sub(s.body);
        this.breakable.pop();
        this.scopes.pop();
        break;
      case 'Switch': {
        var dt = this.expr(s.disc);
        if (['int', 'char', 'String', 'byte', 'short'].indexOf(dt) < 0) err('switch works with int, char or String values — not ' + dt + '.', s.line);
        var seen = {};
        this.breakable.push('switch');
        this.scopes.push({ vars: {} });
        s.cases.forEach(function (c) {
          c.labels.forEach(function (l) {
            if (l === 'default') {
              if (seen.default) err('A switch can have only one default.', c.line);
              seen.default = true;
              return;
            }
            var lt = self.expr(l);
            var key;
            if (dt === 'String') {
              if (l.kind !== 'Lit' || lt !== 'String') err('In a switch on a String, each case needs a text in double quotes, like case "Apple":', l.line);
              key = 's:' + l.v;
            } else {
              var cv = constInt(l);
              if (cv === undefined) err('Each case needs a fixed value (a constant), like case 3: or case \'A\':', l.line);
              if (!assignable(dt, lt, l)) err('This case value (' + lt + ') does not match the switch value type (' + dt + ').', l.line);
              key = 'n:' + cv;
            }
            if (seen[key]) err('Duplicate case label: two cases have the same value.', l.line);
            seen[key] = true;
          });
          c.body.forEach(function (st) { self.stmt(st); });
        });
        this.scopes.pop();
        this.breakable.pop();
        break;
      }
      case 'Break':
        if (!this.breakable.length) err('break can only be used inside a loop or a switch.', s.line);
        break;
      case 'Continue':
        if (this.breakable.indexOf('loop') < 0) err('continue can only be used inside a loop.', s.line);
        break;
      case 'Return': {
        var m = this.method;
        var rt = m.isCtor ? 'void' : m.ret;
        if (s.expr) {
          if (rt === 'void') err((m.isCtor ? 'A constructor' : 'A void method') + ' cannot return a value.', s.line);
          this.expectAssignable(rt, s.expr, s.line, 'return');
        } else if (rt !== 'void') {
          err('This method must return a ' + rt + ' value: write return followed by a value.', s.line);
        }
        break;
      }
      default:
        err('Unsupported statement', s.line);
    }
  };

  // A single statement used as a branch/body: a declaration there is illegal in Java.
  C.sub = function (s) {
    if (s.kind === 'VarDecl') err('A declaration cannot be the only statement of an if/loop. Put it inside { } or move it before.', s.line);
    this.stmt(s);
  };

  C.expectAssignable = function (to, e, line, ctx) {
    var t = this.expr(e);
    if (!assignable(to, t, e)) {
      var m = badAssignMsg(to, t, e);
      if (ctx === 'return') m = 'The method promises to return a ' + to + '. ' + m;
      err(m, e.line || line);
    }
  };

  C.expr = function (e) {
    var t = this.type(e);
    e.type = t;
    return t;
  };

  C.type = function (e) {
    var self = this;
    switch (e.kind) {
      case 'Lit': return e.t;
      case 'Name': {
        var t = this.lookup(e.name);
        if (!t) {
          if (/^(Math|System|Character|Integer|Double|Long|Float|String)$/.test(e.name)) err(e.name + ' is a class, not a variable. Use it like ' + e.name + '.something(...).', e.line);
          var lower = e.name.toLowerCase();
          var near = this.allNames().filter(function (n) { return n.toLowerCase() === lower; });
          var hint = near.length ? " Did you mean '" + near[0] + "'? Java is case-sensitive." : ' Did you forget to declare it, e.g. int ' + e.name + ';';
          err("Java doesn't know any variable called '" + e.name + "'." + hint, e.line);
        }
        return t;
      }
      case 'Field': {
        if (e.obj.kind === 'Name' && !this.lookup(e.obj.name)) {
          var cn = e.obj.name;
          if (cn === 'System' && (e.name === 'out' || e.name === 'in')) return 'System.' + e.name;
          var sf = E.lib.staticFields[cn];
          if (sf && sf[e.name]) return sf[e.name].t;
        }
        var ot = this.expr(e.obj);
        if (ot === 'String' && e.name === 'length') err('For a String, length is a method: write length() with brackets.', e.line);
        err("Unknown field '" + e.name + "'.", e.line);
        break;
      }
      case 'Bin': {
        var l = this.expr(e.l), r = this.expr(e.r);
        var op = e.op;
        if (l === 'void' || r === 'void') err('A void method gives back nothing, so it cannot be used inside a calculation.', e.line);
        if (op === '+') {
          if (l === 'String' || r === 'String') return 'String';
          if (num(l) && num(r)) return Vs.promote2(l, r);
          err("+ can add numbers or join text, but not " + l + ' + ' + r + '.', e.line);
        }
        if (op === '-' || op === '*' || op === '/' || op === '%') {
          if (num(l) && num(r)) return Vs.promote2(l, r);
          err('The ' + op + ' operator works only on numbers (here: ' + l + ' ' + op + ' ' + r + ').', e.line);
        }
        if (op === '<' || op === '>' || op === '<=' || op === '>=') {
          if (num(l) && num(r)) return 'boolean';
          if (l === 'String' && r === 'String') err("Strings can't be compared with " + op + '. Use s1.compareTo(s2).', e.line);
          err(op + ' compares numbers only (here: ' + l + ' ' + op + ' ' + r + ').', e.line);
        }
        if (op === '==' || op === '!=') {
          if ((num(l) && num(r)) || (l === 'boolean' && r === 'boolean')) return 'boolean';
          if ((l === 'String' || l === 'null') && (r === 'String' || r === 'null')) return 'boolean';
          err('Cannot compare a ' + l + ' with a ' + r + ' using ' + op + '.', e.line);
        }
        if (op === '&&' || op === '||') {
          if (l === 'boolean' && r === 'boolean') return 'boolean';
          err(op + ' joins two true/false conditions, e.g. (a > 0 ' + op + ' b > 0). Here it got ' + l + ' and ' + r + '.', e.line);
        }
        err('Unknown operator ' + op, e.line);
        break;
      }
      case 'Unary': {
        var at = this.expr(e.arg);
        if (e.op === '!') {
          if (at !== 'boolean') err('! (not) works only on true/false values.', e.line);
          return 'boolean';
        }
        if (!num(at)) err('Unary ' + e.op + ' needs a number.', e.line);
        return Vs.promote1(at);
      }
      case 'Update': {
        var ut = this.expr(e.arg);
        if (!num(ut)) err(e.op + ' works only on number or char variables.', e.line);
        return ut;
      }
      case 'Assign': {
        var tt = this.expr(e.target);
        if (e.op === '=') {
          this.expectAssignable(tt, e.value, e.line);
          return tt;
        }
        var vt = this.expr(e.value);
        if (e.op === '+=' && tt === 'String') {
          if (vt === 'void') err('Cannot add a void value.', e.line);
          return tt;
        }
        if (!num(tt) || !num(vt)) err(e.op + ' works on numbers' + (e.op === '+=' ? ' (or to add text to a String)' : '') + ', not ' + tt + ' ' + e.op + ' ' + vt + '.', e.line);
        return tt;
      }
      case 'Cond': {
        var ct = this.expr(e.test);
        if (ct !== 'boolean') err('The part before ? must be a true/false condition.', e.line);
        var a = this.expr(e.a), b = this.expr(e.b);
        if (a === b) return a;
        if (num(a) && num(b)) {
          if (a === 'char' && b === 'int' && constInt(e.b) !== undefined && constInt(e.b) >= 0 && constInt(e.b) <= 65535) return 'char';
          if (b === 'char' && a === 'int' && constInt(e.a) !== undefined && constInt(e.a) >= 0 && constInt(e.a) <= 65535) return 'char';
          return Vs.promote2(a, b);
        }
        if (a === 'null' && b !== 'boolean' && !num(b)) return b;
        if (b === 'null' && a !== 'boolean' && !num(a)) return a;
        err('The two choices of ? : must be the same kind of value (got ' + a + ' and ' + b + ').', e.line);
        break;
      }
      case 'Cast': {
        var xt = this.expr(e.arg);
        if (!num(xt) || !num(e.type)) err('Cannot cast a ' + xt + ' to ' + e.type + '.', e.line);
        return e.type;
      }
      case 'New': {
        if (e.type === 'Scanner') {
          if (e.args.length !== 1 || this.type(e.args[0]) !== 'System.in') err('Create the Scanner like this: new Scanner(System.in)', e.line);
          return 'Scanner';
        }
        if (e.type === 'String') {
          var ats = e.args.map(function (x) { return self.expr(x); });
          if (ats.length > 1 || (ats.length === 1 && ats[0] !== 'String')) err('new String(...) takes one String.', e.line);
          return 'String';
        }
        if (e.type === this.prog.className) return this.checkUserCall(e, this.prog.ctors, true);
        err("Unknown class '" + e.type + "'.", e.line);
        break;
      }
      case 'Call': return this.callType(e);
    }
    err('Cannot understand this expression.', e.line);
  };

  C.allNames = function () {
    var out = [];
    this.scopes.forEach(function (s) { out = out.concat(Object.keys(s.vars)); });
    return out;
  };

  C.callType = function (e) {
    var self = this;
    var argTypes = function () { return e.args.map(function (a) { return self.expr(a); }); };
    if (!e.obj) {
      var ms = this.methods[e.name];
      if (!ms) {
        if (e.name === 'println' || e.name === 'print') err('Write System.out.' + e.name + '(...) — Java needs the full name.', e.line);
        err("There is no method called '" + e.name + "' in this program.", e.line);
      }
      return this.checkUserCall(e, ms, false);
    }
    var o = e.obj;
    // System.out.print / println
    if (o.kind === 'Field' && o.obj.kind === 'Name' && o.obj.name === 'System' && o.name === 'out') {
      e.libKind = 'print';
      var ts = argTypes();
      if (e.name === 'println') {
        if (ts.length > 1) err('println takes one value. Join several parts with +, e.g. println("x = " + x).', e.line);
      } else if (e.name === 'print') {
        if (ts.length !== 1) err('print needs exactly one value inside the brackets.', e.line);
      } else err("System.out has print and println, not '" + e.name + "'.", e.line);
      if (ts[0] === 'void') err('Cannot print a void method call — it gives back nothing.', e.line);
      return 'void';
    }
    if (o.kind === 'Name' && o.name === 'System' && !this.lookup('System')) {
      if (e.name === 'exit') {
        var xs = argTypes();
        if (xs.length !== 1 || !num(xs[0])) err('Use System.exit(0) to stop the program.', e.line);
        e.libKind = 'exit';
        return 'void';
      }
      err("System has no method '" + e.name + "' in our syllabus.", e.line);
    }
    if (o.kind === 'Name' && !this.lookup(o.name) && E.lib.staticClasses[o.name]) {
      var cls = E.lib.staticClasses[o.name];
      var m = cls[e.name];
      if (!m) err(o.name + " has no method called '" + e.name + "'" + (o.name === 'Math' ? ' (check spelling: sqrt, cbrt, pow, abs, round, ceil, floor, max, min).' : '.'), e.line);
      var r = m.check(argTypes());
      if (!E.KNOWN_RET[r]) err(o.name + '.' + e.name + ' ' + r + '.', e.line);
      e.libKind = 'static';
      e.lib = m;
      return r;
    }
    var objT = this.expr(o);
    var table = E.lib.instance[objT];
    if (!table) err("A " + objT + " value has no methods to call with a dot.", e.line);
    var im = table[e.name];
    if (!im) {
      if (objT === 'String' && e.name === 'size') err('For a String use length(), not size().', e.line);
      err('A ' + objT + " has no method called '" + e.name + "'.", e.line);
    }
    var rr = im.check(argTypes());
    if (!E.KNOWN_RET[rr]) err(objT + '.' + e.name + ' ' + rr + '.', e.line);
    e.libKind = 'instance';
    e.lib = im;
    return rr;
  };

  C.checkUserCall = function (e, cands, isCtor) {
    var self = this;
    var ts = e.args.map(function (a) { return self.expr(a); });
    var applicable = (cands || []).filter(function (m) {
      if (m.params.length !== ts.length) return false;
      for (var i = 0; i < ts.length; i++) if (!(m.params[i].type === ts[i] || (num(ts[i]) && num(m.params[i].type) && Vs.canWiden(ts[i], m.params[i].type)))) return false;
      return true;
    });
    if (!applicable.length) {
      if (isCtor && !(cands || []).length && !ts.length) { e.target = null; return this.prog.className; }
      err('No ' + (isCtor ? 'constructor' : "version of '" + e.name + "'") + ' takes (' + ts.join(', ') + ').', e.line);
    }
    // most specific: fewest widenings
    applicable.sort(function (a, b) { return score(a) - score(b); });
    function score(m) { var s = 0; for (var i = 0; i < ts.length; i++) if (m.params[i].type !== ts[i]) s++; return s; }
    e.target = applicable[0];
    return isCtor ? this.prog.className : applicable[0].ret;
  };

  E.KNOWN_RET = { int: 1, long: 1, double: 1, float: 1, char: 1, boolean: 1, String: 1, void: 1, short: 1, byte: 1 };

  E.check = function (prog) {
    new Checker(prog).checkProgram();
    return prog;
  };

  // Type-check a standalone expression against a set of variables {name: type}.
  E.checkExpression = function (expr, varTypes, fakeProg) {
    var c = new Checker(fakeProg || { methods: [], ctors: [], fields: [], className: null });
    c.scopes.push({ vars: Object.assign({}, varTypes) });
    return c.expr(expr);
  };
})();
