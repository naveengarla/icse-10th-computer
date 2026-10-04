/* Runs a checked program and records every step (memory snapshot, output, note, expression reduction).
   E.run(src, {input, maxSteps}) -> {ok, error, steps, output, prog} */
(function () {
  var JP = (globalThis.JP = globalThis.JP || {});
  var E = (JP.engine = JP.engine || {});
  var Vs = E.values;
  var V = Vs.V;
  var RuntimeErr = E.RuntimeErr;

  var MARK_A = '\u0001', MARK_B = '\u0002';
  E.MARK_A = MARK_A;
  E.MARK_B = MARK_B;

  function ExitSignal() {}
  function StepLimit() {}

  var DEFAULTS = { int: 0, long: 0, short: 0, byte: 0, double: 0, float: 0, char: 0, boolean: false };
  function defaultVal(t) {
    if (Object.prototype.hasOwnProperty.call(DEFAULTS, t)) return V(t, DEFAULTS[t]);
    return V(t, null);
  }

  function coerce(val, to) {
    if (!val || val.t === to) return val;
    if (Vs.isNumeric(to) && Vs.isNumeric(val.t)) return V(to, Vs.convert(val.v, val.t, to));
    if (val.t === 'null') return V(to, null);
    return val;
  }

  // ---------- arithmetic ----------
  function arith(op, t, x, y) {
    switch (t) {
      case 'int':
        switch (op) {
          case '+': return (x + y) | 0;
          case '-': return (x - y) | 0;
          case '*': return Math.imul(x, y);
          case '/': if (y === 0) throw divZero(); return (x / y) | 0;
          case '%': if (y === 0) throw divZero(); return (x % y) | 0;
        }
        break;
      case 'long':
        switch (op) {
          case '+': return x + y;
          case '-': return x - y;
          case '*': return x * y;
          case '/': if (y === 0) throw divZero(); return Math.trunc(x / y);
          case '%': if (y === 0) throw divZero(); return (x % y) || 0;
        }
        break;
      case 'float':
      case 'double': {
        var r;
        switch (op) {
          case '+': r = x + y; break;
          case '-': r = x - y; break;
          case '*': r = x * y; break;
          case '/': r = x / y; break;
          case '%': r = x % y; break;
        }
        return t === 'float' ? Math.fround(r) : r;
      }
    }
    throw new Error('bad arith ' + op + ' ' + t);
  }
  function divZero() {
    return new RuntimeErr('ArithmeticException', '/ by zero — Java cannot divide a whole number by 0, so the program crashes here.');
  }

  function binop(op, a, b) {
    if (op === '+' && (a.t === 'String' || b.t === 'String')) return V('String', Vs.str(a) + Vs.str(b));
    if (op === '+' || op === '-' || op === '*' || op === '/' || op === '%') {
      var t = Vs.promote2(a.t, b.t);
      return V(t, arith(op, t, a.v, b.v));
    }
    switch (op) {
      case '<': return V('boolean', a.v < b.v);
      case '>': return V('boolean', a.v > b.v);
      case '<=': return V('boolean', a.v <= b.v);
      case '>=': return V('boolean', a.v >= b.v);
      case '==': return V('boolean', a.v === b.v);
      case '!=': return V('boolean', a.v !== b.v);
    }
    throw new Error('bad op ' + op);
  }
  E.binop = binop;

  // ---------- notes that explain each little calculation ----------
  var L = Vs.lit;
  function noteBin(op, a, b, r) {
    var base = L(a) + ' ' + op + ' ' + L(b) + ' → ' + L(r);
    if (op === '+' && r.t === 'String') {
      return 'Joining text: ' + base + '. When one side of + is a String, + glues text together instead of adding.';
    }
    var charNote = '';
    if (a.t === 'char' || b.t === 'char') {
      var c = a.t === 'char' ? a : b;
      charNote = ' (' + L(c) + ' is a char; in calculations Java uses its code number ' + c.v + '.)';
    }
    if (op === '/' && Vs.isIntegral(a.t) && Vs.isIntegral(b.t)) {
      var exact = a.v / b.v;
      if (exact !== r.v) return base + '. Both are whole numbers, so the answer is a whole number: the decimal part (.' + String(exact).split('.')[1] + ') is thrown away.' + charNote;
      return base + '.' + charNote;
    }
    if (op === '%') return base + ' (the remainder when ' + L(a) + ' is divided by ' + L(b) + ').' + charNote;
    if ((r.t === 'double' || r.t === 'float') && (Vs.isIntegral(a.t) || Vs.isIntegral(b.t)) && !(Vs.isIntegral(a.t) && Vs.isIntegral(b.t))) {
      return base + '. One side is a ' + r.t + ', so the answer is a ' + r.t + '.' + charNote;
    }
    if (r.t === 'boolean') return base + '.';
    return base + '.' + charNote;
  }

  // ---------- runtime ----------
  function Runtime(prog, opts) {
    this.prog = prog;
    this.src = prog.src;
    this.opts = opts || {};
    this.maxSteps = this.opts.maxSteps || 3000;
    this.steps = [];
    this.out = '';
    this.input = new E.InputTape(this.opts.input || '');
    this.frames = [];
    this.fields = [];
    this.objects = [];
    this.nextObjectId = 1;
    this.changed = {};
    this.effects = [];
    this.loops = [];
    this.breakCtx = [];
    this.nextId = 1;
    var ls = [0];
    for (var i = 0; i < this.src.length; i++) if (this.src[i] === '\n') ls.push(i + 1);
    this.lineStarts = ls;
  }
  var R = Runtime.prototype;

  R.lineOf = function (off) {
    var ls = this.lineStarts, lo = 0, hi = ls.length - 1;
    while (lo < hi) {
      var mid = (lo + hi + 1) >> 1;
      if (ls[mid] <= off) lo = mid; else hi = mid - 1;
    }
    return lo + 1;
  };
  R.range = function (node) {
    if (!node) return null;
    return { from: this.lineOf(node.s), to: this.lineOf(Math.max(node.s, node.e - 1)) };
  };

  // ----- memory -----
  R.frame = function () { return this.frames[this.frames.length - 1]; };
  R.pushScope = function () { this.frame().scopes.push([]); };
  R.popScope = function () { return this.frame().scopes.pop(); };
  R.declare = function (name, type, val) {
    var v = { id: this.nextId++, name: name, type: type, val: val };
    this.frame().scopes[this.frame().scopes.length - 1].push(v);
    this.changed[v.id] = true;
    return v;
  };
  R.find = function (name) {
    var f = this.frame();
    for (var i = f.scopes.length - 1; i >= 0; i--) {
      var sc = f.scopes[i];
      for (var j = 0; j < sc.length; j++) if (sc[j].name === name) return sc[j];
    }
    var ob = f.object;
    if (ob) for (var j2 = 0; j2 < ob.fields.length; j2++) if (ob.fields[j2].name === name) return ob.fields[j2];
    for (var k = 0; k < this.fields.length; k++) if (this.fields[k].name === name) return this.fields[k];
    throw new Error('variable not found at runtime: ' + name);
  };
  R.get = function (name) {
    var v = this.find(name);
    if (v.val === undefined) {
      throw new RuntimeErr('NoValue', "'" + name + "' is used before it has been given a value. (Java would not even compile this: \"variable " + name + ' might not have been initialized".)');
    }
    return v.val;
  };
  R.set = function (name, val) {
    var v = this.find(name);
    var old = v.val;
    v.val = coerce(val, v.type);
    this.changed[v.id] = true;
    this.effects.push({ kind: 'assign', name: name, from: old, to: v.val });
    return v.val;
  };

  R.snapshot = function () {
    var self = this;
    function box(v, depth) {
      return {
        id: v.id, name: v.name, type: v.type, depth: depth,
        value: v.val === undefined ? null : v.val,
        text: v.val === undefined ? '' : L(v.val),
        empty: v.val === undefined,
        changed: !!self.changed[v.id]
      };
    }
    return {
      fields: this.fields.map(function (v) { return box(v, 0); }),
      objects: this.objects.map(function (ob) {
        return { id: ob.id, type: ob.type, implicit: ob.implicit, fields: ob.fields.map(function (v) { return box(v, 0); }) };
      }),
      frames: this.frames.map(function (f) {
        var vars = [];
        f.scopes.forEach(function (sc, d) { sc.forEach(function (v) { vars.push(box(v, d)); }); });
        return { name: f.name, objectId: f.object ? f.object.id : null, vars: vars };
      })
    };
  };

  R.rec = function (kind, line, note, extra) {
    if (this.steps.length >= this.maxSteps) throw new StepLimit();
    var st = {
      i: this.steps.length,
      kind: kind,
      line: line,
      note: note,
      mem: this.snapshot(),
      out: this.out,
      loops: this.loops.map(function (l) { return { line: l.line, pass: l.pass }; }),
      depth: this.frames.length,
      inPos: this.input.pos
    };
    if (extra) for (var k in extra) st[k] = extra[k];
    this.steps.push(st);
    this.changed = {};
    this.effects = [];
    return st;
  };

  R.effectNote = function () {
    var parts = [];
    this.effects.forEach(function (ef) {
      if (ef.kind === 'declare') {
        parts.push(ef.val === undefined
          ? 'Created a box called ' + ef.name + ' (' + ef.type + '). It is empty — no value yet.'
          : 'Created a box called ' + ef.name + ' (' + ef.type + ') and stored ' + L(ef.val) + ' in it.');
      } else if (ef.kind === 'assign') {
        if (ef.from === undefined) parts.push(ef.name + ' gets its first value: ' + L(ef.to) + '.');
        else if (ef.from.v === ef.to.v && ef.from.t === ef.to.t) parts.push(ef.name + ' is stored again: still ' + L(ef.to) + '.');
        else parts.push(ef.name + ' changes from ' + L(ef.from) + ' to ' + L(ef.to) + '. (The old value ' + L(ef.from) + ' is gone.)');
      } else if (ef.kind === 'print') {
        if (ef.ln && ef.text === '') parts.push('Moved the cursor to a new line.');
        else if (ef.ln) parts.push('Printed ' + JSON.stringify(ef.text) + ' and moved to a new line.');
        else parts.push('Printed ' + JSON.stringify(ef.text) + ' — the cursor stays on the same line.');
      } else if (ef.kind === 'input') {
        parts.push('Read ' + JSON.stringify(ef.text) + ' from the keyboard (input).');
      }
    });
    return parts.join(' ');
  };

  // ----- expression evaluation with optional reduction recording -----
  function Rec(root, prefix) {
    this.root = root;
    this.prefix = prefix || '';
    this.vals = new Map();
    this.saved = new Map();
    this.snaps = [];
    this.pendingRead = false;
    this.focus = null;
  }

  R.render = function (n, rc) {
    var self = this;
    var s;
    if (rc.vals.has(n)) {
      s = L(rc.vals.get(n));
      if (rc.focus === n) s = MARK_A + s + MARK_B;
      return s;
    }
    switch (n.kind) {
      case 'Lit': s = n.t === 'int' || n.t === 'long' || n.t === 'double' || n.t === 'float' ? (n.text + (n.t === 'long' ? 'L' : n.t === 'float' ? 'f' : '')) : L(V(n.t, n.v)); break;
      case 'Name': s = n.name; break;
      case 'Bin': s = this.render(n.l, rc) + ' ' + n.op + ' ' + this.render(n.r, rc); break;
      case 'Unary': s = n.op + this.render(n.arg, rc); break;
      case 'Update': s = n.prefix ? n.op + n.arg.name : n.arg.name + n.op; break;
      case 'Assign':
        if (rc.saved.has(n)) {
          var inner = this.render(n.value, rc);
          var simple = rc.vals.has(n.value) || n.value.kind === 'Lit' || n.value.kind === 'Name';
          s = n.target.name + ' = ' + L(rc.saved.get(n)) + ' ' + n.op[0] + ' ' + (simple ? inner : '(' + inner + ')');
        } else s = n.target.name + ' ' + n.op + ' ' + this.render(n.value, rc);
        break;
      case 'Cond': s = this.render(n.test, rc) + ' ? ' + this.render(n.a, rc) + ' : ' + this.render(n.b, rc); break;
      case 'Cast': s = '(' + n.type + ') ' + this.render(n.arg, rc); break;
      case 'Call':
        s = (n.obj ? this.render(n.obj, rc) + '.' : '') + n.name + '(' + n.args.map(function (a) { return self.render(a, rc); }).join(', ') + ')';
        break;
      case 'Field': s = this.render(n.obj, rc) + '.' + n.name; break;
      case 'New': s = 'new ' + n.type + '(' + n.args.map(function (a) { return self.render(a, rc); }).join(', ') + ')'; break;
      default: s = '?';
    }
    for (var p = 0; p < (n.paren || 0); p++) s = '(' + s + ')';
    return s;
  };

  R.snap = function (rc, note, focus) {
    if (!rc) return;
    rc.focus = focus || null;
    var text = rc.prefix + this.render(rc.root, rc);
    rc.focus = null;
    var last = rc.snaps[rc.snaps.length - 1];
    var plain = text.replace(/[\u0001\u0002]/g, '');
    if (last && last.plain === plain) { if (note && !last.note) last.note = note; return; }
    rc.snaps.push({ text: text, plain: plain, note: note || '' });
  };
  R.flushReads = function (rc) {
    if (rc && rc.pendingRead) {
      rc.pendingRead = false;
      var before = rc.snaps.length;
      this.snap(rc, 'Look inside the boxes: replace each variable name with the value stored in it.');
      if (rc.snaps.length > before) rc.snaps[rc.snaps.length - 1].reads = true;
    }
  };
  // A recorder that starts with the expression exactly as written.
  R.newRec = function (root, prefix) {
    var rc = new Rec(root, prefix);
    this.snap(rc, '');
    return rc;
  };
  R.done = function (n, val, rc, note, keep) {
    if (rc) {
      this.flushReads(rc);
      rc.vals.set(n, val);
      var last = rc.snaps[rc.snaps.length - 1];
      if (!keep && n === rc.root && n.kind === 'Assign' && n.op === '=' && last) {
        // "x = 5" already shows the value; just say it is stored
        last.note = (last.note ? last.note + ' ' : '') + 'Store it in ' + n.target.name + '.';
      } else this.snap(rc, note, n);
    }
    return val;
  };

  R.eval = function (n, rc) {
    var self = this;
    switch (n.kind) {
      case 'Lit':
        return V(n.t, n.v);
      case 'Name': {
        var v = this.get(n.name);
        if (rc) { rc.vals.set(n, v); rc.pendingRead = true; }
        return v;
      }
      case 'Field': {
        var sf = E.lib.staticFields[n.obj.name];
        if (sf && sf[n.name]) {
          var fv = sf[n.name];
          return this.done(n, fv, rc, n.obj.name + '.' + n.name + ' is ' + L(fv) + '.');
        }
        if (n.obj.name === 'System' && n.name === 'in') return V('System.in', null);
        var ref = this.eval(n.obj, rc);
        if (ref.v === null && !n.isStaticField) throw new RuntimeErr('NullPointerException', 'This variable holds null, so it has no fields.');
        var fields = n.isStaticField ? this.fields : this.objectOf(ref).fields;
        for (var fi = 0; fi < fields.length; fi++) if (fields[fi].name === n.name) return this.done(n, fields[fi].val, rc, 'Read ' + n.name + ' from ' + L(ref) + '.');
        throw new Error('field not found: ' + n.name);
      }
      case 'Bin': {
        var op = n.op;
        var a = this.eval(n.l, rc);
        if (op === '&&' || op === '||') {
          if ((op === '&&' && !a.v) || (op === '||' && a.v)) {
            var sc = V('boolean', a.v);
            return this.done(n, sc, rc, op === '&&'
              ? 'false && … is always false, so Java does not even look at the right side (short-circuit).'
              : 'true || … is always true, so Java does not even look at the right side (short-circuit).');
          }
          var b2 = this.eval(n.r, rc);
          return this.done(n, V('boolean', b2.v), rc, L(a) + ' ' + op + ' ' + L(b2) + ' → ' + L(V('boolean', b2.v)) + '.');
        }
        var b = this.eval(n.r, rc);
        this.flushReads(rc);
        var r = binop(op, a, b);
        return this.done(n, r, rc, noteBin(op, a, b, r));
      }
      case 'Unary': {
        var x = this.eval(n.arg, rc);
        var res;
        if (n.op === '!') res = V('boolean', !x.v);
        else {
          var t = Vs.promote1(x.t);
          var xv = Vs.convert(x.v, x.t, t);
          res = V(t, n.op === '-' ? (t === 'int' ? (-xv) | 0 : -xv) : xv);
        }
        return this.done(n, res, rc, n.op === '!' ? '! flips ' + L(x) + ' to ' + L(res) + '.' : n.op + L(x) + ' → ' + L(res) + '.');
      }
      case 'Update': {
        var name = n.arg.name;
        var old = this.get(name);
        var pt = Vs.promote1(old.t);
        var nv = arith(n.op === '++' ? '+' : '-', pt, Vs.convert(old.v, old.t, pt), 1);
        var newVal = V(old.t, Vs.convert(nv, pt, old.t));
        this.set(name, newVal);
        var result = n.prefix ? newVal : old;
        var note = n.prefix
          ? n.op + name + ': first ' + name + ' becomes ' + L(newVal) + ', then that NEW value ' + L(newVal) + ' is used.'
          : name + n.op + ': the OLD value ' + L(old) + ' is used here, then ' + name + ' becomes ' + L(newVal) + '.';
        return this.done(n, result, rc, note);
      }
      case 'Assign': {
        var tn = n.target.name;
        var cur = this.find(tn);
        if (n.op === '=') {
          var val = this.eval(n.value, rc);
          this.flushReads(rc);
          var stored = coerce(val, cur.type);
          this.set(tn, stored);
          var an = tn + ' gets ' + L(stored) + '.';
          var conv = stored.t !== val.t && Vs.isNumeric(val.t);
          if (conv) an = L(val) + ' is ' + (val.t === 'int' ? 'an ' : 'a ') + val.t + '; stored in the ' + cur.type + ' box ' + tn + ' it becomes ' + L(stored) + '.';
          return this.done(n, stored, rc, an, conv);
        }
        var saved = this.get(tn);
        if (rc) {
          rc.saved.set(n, saved);
          this.snap(rc, n.op + ' first saves the current value of ' + tn + ' (' + L(saved) + '), then works out the right side.');
        }
        var rv = this.eval(n.value, rc);
        this.flushReads(rc);
        var raw = n.op === '+=' && saved.t === 'String' ? V('String', Vs.str(saved) + Vs.str(rv)) : binop(n.op[0], saved, rv);
        var fin = coerce(raw, cur.type);
        if (rc) {
          // show "x = saved op value" as one line before storing
          rc.vals.set(n.value, rv);
          this.snap(rc, '');
        }
        this.set(tn, fin);
        var cn = L(saved) + ' ' + n.op[0] + ' ' + L(rv) + ' → ' + L(raw) + '; ' + tn + ' is now ' + L(fin) + '.';
        if (fin.t !== raw.t) cn += ' (The result is converted back to ' + cur.type + ' automatically — compound operators like ' + n.op + ' do that.)';
        return this.done(n, fin, rc, cn);
      }
      case 'Cond': {
        var tv = this.eval(n.test, rc);
        this.flushReads(rc);
        if (rc) this.snap(rc, 'The condition is ' + L(tv) + ', so Java picks the ' + (tv.v ? 'first' : 'second') + ' choice (' + (tv.v ? 'after ?' : 'after :') + ').');
        var chosen = this.eval(tv.v ? n.a : n.b, rc);
        this.flushReads(rc);
        var cv = Vs.isNumeric(n.type) ? coerce(chosen, n.type) : chosen;
        return this.done(n, cv, rc, 'The ? : gives ' + L(cv) + '.');
      }
      case 'Cast': {
        var iv = this.eval(n.arg, rc);
        this.flushReads(rc);
        var out = V(n.type, Vs.convert(iv.v, iv.t, n.type));
        var cnote = '(' + n.type + ') ' + L(iv) + ' → ' + L(out) + '.';
        if ((iv.t === 'double' || iv.t === 'float') && Vs.isIntegral(n.type)) cnote += ' A cast to ' + n.type + ' chops off the decimal part (it does not round).';
        if (n.type === 'char') cnote += ' The number ' + iv.v + ' is the code of the character ' + L(out) + '.';
        if (iv.t === 'char' && n.type === 'int') cnote += ' This is the code number of ' + L(iv) + '.';
        return this.done(n, out, rc, cnote);
      }
      case 'New':
        if (n.type === 'Scanner') return V('Scanner', { scanner: true });
        if (n.type === 'String') return n.args.length ? V('String', this.eval(n.args[0], rc).v) : V('String', '');
        var args = n.args.map(function (a) { return self.eval(a, rc); });
        return this.done(n, this.createObject(n.target, args, n.line, false), rc, 'new creates a separate object with its own field boxes.');
      case 'Call':
        return this.call(n, rc);
    }
    throw new Error('cannot eval ' + n.kind);
  };

  R.call = function (n, rc) {
    var self = this;
    if (n.libKind === 'print') {
      var arg = n.args.length ? this.eval(n.args[0], rc) : null;
      this.flushReads(rc);
      var text = arg ? Vs.str(arg) : '';
      var ln = n.name === 'println';
      this.out += text + (ln ? '\n' : '');
      this.effects.push({ kind: 'print', text: text, ln: ln });
      return V('void', null);
    }
    if (n.libKind === 'exit') {
      this.eval(n.args[0], rc);
      throw new ExitSignal();
    }
    if (n.libKind === 'static') {
      var args = n.args.map(function (a) { return self.eval(a, rc); });
      this.flushReads(rc);
      var res = n.lib.call(args, null, this);
      return this.done(n, res, rc, callNote(n, args, res));
    }
    if (n.libKind === 'instance') {
      var obj = this.eval(n.obj, rc);
      var iargs = n.args.map(function (a) { return self.eval(a, rc); });
      this.flushReads(rc);
      if (obj.v === null) throw new RuntimeErr('NullPointerException', 'This variable holds null (no object), so it has no methods to call.');
      var ires = n.lib.call(iargs, obj.v, this);
      if (obj.t === 'Scanner') {
        this.effects.push({ kind: 'input', text: Vs.str(ires) });
        return this.done(n, ires, rc, 'The keyboard gives ' + L(ires) + '.');
      }
      return this.done(n, ires, rc, L(obj) + '.' + n.name + '(' + iargs.map(L).join(', ') + ') returns ' + L(ires) + ' (a ' + ires.t + ').');
    }
    // user-defined method
    var m = n.target;
    var receiver = n.obj && !n.classCall ? this.eval(n.obj, rc) : null;
    var vals = n.args.map(function (a) { return self.eval(a, rc); });
    this.flushReads(rc);
    var object = m.isStatic ? null : receiver ? this.objectOf(receiver) : this.frame().object;
    var ret = this.invoke(m, vals, n.line, object);
    if (m.ret === 'void') return V('void', null);
    return this.done(n, ret, rc, n.name + '(…) returned ' + L(ret) + '.');
  };

  function callNote(n, args, res) {
    var call = (n.obj ? n.obj.name + '.' : '') + n.name + '(' + args.map(L).join(', ') + ')';
    var s = call + ' returns ' + L(res) + ' — a ' + res.t + '.';
    if (n.obj && n.obj.name === 'Math') {
      if (n.name === 'round') s += ' Math.round gives a whole number (no .0): it rounds to the nearest whole number, and .5 goes UP (towards the bigger number, so -3.5 → -3).';
      else if (n.name === 'ceil') s += ' ceil = the smallest whole number ≥ the value, still written as a double.';
      else if (n.name === 'floor') s += ' floor = the biggest whole number ≤ the value, still written as a double.';
      else if (res.t === 'double' && (n.name === 'sqrt' || n.name === 'cbrt' || n.name === 'pow')) s += ' Math.' + n.name + ' always gives a double, so whole answers are written with .0';
      else if ((n.name === 'max' || n.name === 'min') && (args[0].t === 'char' || args[1].t === 'char')) s += ' Chars are compared (and returned) as their code numbers.';
    }
    return s;
  }

  R.objectOf = function (ref) {
    if (!ref || ref.v === null) throw new RuntimeErr('NullPointerException', 'This variable holds null (no object), so it has no methods to call.');
    for (var i = 0; i < this.objects.length; i++) if (this.objects[i].id === ref.v.objectId) return this.objects[i];
    throw new Error('unknown object reference');
  };

  R.createObject = function (ctor, vals, line, implicit) {
    var self = this;
    var ob = { id: this.nextObjectId++, type: this.prog.className, fields: [], implicit: !!implicit };
    this.objects.push(ob);
    this.prog.fields.forEach(function (f) {
      if (f.isStatic) return;
      f.decls.forEach(function (d) {
        var v = { id: self.nextId++, name: d.name, type: f.type, val: defaultVal(f.type), field: true };
        ob.fields.push(v);
        self.changed[v.id] = true;
      });
    });
    this.rec('object', line, (implicit ? 'BlueJ starts the non-static main() on ' : 'Created ') + 'object #' + ob.id + ' of ' + ob.type + '. Its fields start with default values.');
    this.frames.push({ name: 'field initialization', scopes: [[]], object: ob });
    try {
      this.prog.fields.forEach(function (f) {
        if (f.isStatic) return;
        f.decls.forEach(function (d) {
          if (!d.init) return;
          self.set(d.name, coerce(self.eval(d.init, null), f.type));
          self.rec('fieldInit', d.line, self.effectNote());
        });
      });
    } finally { this.frames.pop(); }
    if (ctor) this.invoke(ctor, vals, line, ob);
    return V(this.prog.className, { objectId: ob.id, className: ob.type });
  };

  R.invoke = function (m, vals, callLine, object) {
    var self = this;
    this.frames.push({ name: m.name, scopes: [[]], method: m, object: object });
    m.params.forEach(function (p, i) {
      var v = self.declare(p.name, p.type, coerce(vals[i], p.type));
      v.param = true;
    });
    var desc = m.params.map(function (p, i) { return p.name + ' = ' + L(coerce(vals[i], p.type)); }).join(', ');
    this.rec(m.isCtor ? 'constructor' : 'call', m.line, (m.isCtor ? 'The constructor runs automatically for object #' + object.id + '. ' : 'Jump into ' + m.name + '(). ') + (desc ? 'The values are COPIED into its own boxes: ' + desc + '.' : ''), { callLine: callLine, signature: m.name + '(' + m.params.map(function (p) { return p.type; }).join(', ') + ')' });
    var saveLoops = this.loops, saveBreak = this.breakCtx;
    this.loops = [];
    this.breakCtx = [];
    var r = this.execBlockBody(m.body.body);
    this.loops = saveLoops;
    this.breakCtx = saveBreak;
    this.frames.pop();
    var rv = r && r.ret ? coerce(r.ret, m.ret) : null;
    if (!rv && m.ret !== 'void' && !m.isCtor) throw new RuntimeErr('MissingReturn', m.name + '() reached its end without a return statement.');
    this.rec('back', callLine, 'Back where ' + m.name + '() was called' + (rv ? ', with the answer ' + L(rv) + '.' : '.'));
    return rv;
  };

  // ----- statements -----
  R.execBlockBody = function (stmts) {
    this.pushScope();
    try {
      for (var i = 0; i < stmts.length; i++) {
        var r = this.exec(stmts[i]);
        if (r) return r;
      }
    } finally {
      this.popScope();
    }
    return null;
  };

  R.calcOf = function (rc) {
    if (!rc || rc.snaps.length < 2) return null;
    return rc.snaps.map(function (s) { return { text: s.text, note: s.note }; });
  };

  R.condCheck = function (cond, what) {
    var rc = this.newRec(cond);
    var v = this.eval(cond, rc);
    this.flushReads(rc);
    var src = this.src.slice(cond.s, cond.e);
    // "i <= 3" becomes "4 <= 3" in the note only when all names are replaced in one go
    var subSnaps = rc.snaps.filter(function (sn) { return sn.reads; });
    var sub = subSnaps.length === 1 && subSnaps[0] === rc.snaps[1] ? subSnaps[0].plain : null;
    return { v: v.v, src: src, sub: sub, calc: this.calcOf(rc) };
  };

  R.exec = function (s) {
    var self = this;
    switch (s.kind) {
      case 'Block':
        return this.execBlockBody(s.body);
      case 'Empty':
        this.rec('empty', s.line, 'An empty statement ; — nothing happens here.');
        return null;
      case 'VarDecl': {
        for (var i = 0; i < s.decls.length; i++) {
          var d = s.decls[i];
          var rc = null, val = undefined;
          if (d.init) {
            rc = this.newRec(d.init, d.name + ' = ');
            val = coerce(this.eval(d.init, rc), s.type);
            this.flushReads(rc);
          }
          this.declare(d.name, s.type, val);
          this.effects.unshift({ kind: 'declare', name: d.name, type: s.type, val: val });
          var conv = '';
          if (d.init && d.init.type && d.init.type !== s.type && Vs.isNumeric(d.init.type)) {
            conv = ' (The ' + d.init.type + ' value is stored as a ' + s.type + ': ' + L(val) + '.)';
          }
          this.rec('declare', d.line, this.effectNote() + conv, { calc: this.calcOf(rc) });
        }
        return null;
      }
      case 'ExprStmt': {
        var rc2 = this.newRec(s.expr);
        this.eval(s.expr, rc2);
        this.flushReads(rc2);
        var note = this.effectNote();
        if (!note) note = 'Ran this line.';
        // a lone x++ needs no calculation panel: the note says it all
        this.rec('stmt', s.line, note, { calc: s.expr.kind === 'Update' ? null : this.calcOf(rc2) });
        return null;
      }
      case 'If': {
        var c = this.condCheck(s.cond);
        var taken = c.v ? 'then' : s.els ? 'else' : 'none';
        var msg = 'Check the condition (' + c.src + ')' + (c.sub ? ': ' + c.sub : '') + ' → ' + c.v + '. ';
        if (c.v) msg += s.els ? 'True, so the if-part runs and the else-part is skipped.' : 'True, so the if-part runs.';
        else msg += s.els ? 'False, so the if-part is skipped and the else-part runs.' : 'False, so the if-part is skipped.';
        var skip = c.v ? (s.els ? { from: s.elseLine, to: this.range(s.els).to } : null) : this.range(s.then);
        this.rec('cond', s.line, msg, { calc: c.calc, cond: c.v, skip: skip, taken: taken });
        if (c.v) return this.exec(s.then);
        if (s.els) return this.exec(s.els);
        return null;
      }
      case 'While':
        return this.loop(s, 'while');
      case 'DoWhile':
        return this.loop(s, 'do');
      case 'For': {
        this.pushScope();
        try {
          var initDecl = false;
          if (s.init.length) {
            s.init.forEach(function (st) {
              if (st.kind === 'VarDecl') {
                initDecl = true;
                st.decls.forEach(function (d) {
                  var v = d.init ? coerce(self.eval(d.init, null), st.type) : undefined;
                  self.declare(d.name, st.type, v);
                  self.effects.push({ kind: 'declare', name: d.name, type: st.type, val: v });
                });
              } else self.eval(st.expr, null);
            });
            this.rec('forInit', s.line, 'Start of the for loop (runs once): ' + this.effectNote());
          }
          var r = this.loop(s, 'for');
          return r;
        } finally {
          var gone = this.popScope();
          if (gone && gone.length) {
            this.rec('scopeEnd', s.line, 'The loop is over. The box' + (gone.length > 1 ? 'es ' : ' ') + gone.map(function (g) { return g.name; }).join(', ') + (gone.length > 1 ? ' are' : ' is') + ' removed — a variable declared in the for( ) exists only inside the loop.', { quiet: true });
          }
        }
      }
      case 'Switch':
        return this.execSwitch(s);
      case 'Break': {
        var ctx = this.breakCtx[this.breakCtx.length - 1];
        this.rec('break', s.line, ctx === 'switch' ? 'break → jump out of the switch now.' : 'break → jump out of the loop immediately. No more passes.');
        return { brk: true };
      }
      case 'Continue':
        this.rec('continue', s.line, 'continue → skip the rest of this pass and go straight to the ' + (this.loops.length && this.loops[this.loops.length - 1].kind === 'for' ? 'update part of the for' : 'loop condition') + '.');
        return { cont: true };
      case 'Return': {
        var rcR = s.expr ? new Rec(s.expr, 'return ') : null;
        var rv = s.expr ? this.eval(s.expr, rcR) : V('void', null);
        if (rcR) this.flushReads(rcR);
        this.rec('return', s.line, s.expr ? 'return → leave the method and give back ' + L(rv) + '.' : 'return → leave the method now.', { calc: this.calcOf(rcR) });
        return { ret: rv };
      }
    }
    throw new Error('cannot exec ' + s.kind);
  };

  R.loop = function (s, kind) {
    var self = this;
    var info = { line: s.line, pass: 0, kind: kind };
    this.loops.push(info);
    this.breakCtx.push('loop');
    var bodyRange = this.range(s.body);
    try {
      if (kind === 'do') {
        while (true) {
          info.pass++;
          this.rec('loopPass', s.line, 'do: run the body first (pass ' + info.pass + ') — a do-while always runs at least once.', { quiet: true });
          var r = this.exec(s.body);
          if (r && r.brk) break;
          if (r && r.ret) return r;
          var c = this.condCheck(s.cond);
          this.rec('loopCheck', s.condLine, 'Check (' + c.src + ')' + (c.sub ? ': ' + c.sub : '') + ' → ' + c.v + (c.v ? '. True, so go back up and run the body again.' : '. False, so the loop ends here.'), { calc: c.calc, cond: c.v });
          if (!c.v) break;
        }
        return null;
      }
      while (true) {
        var cv = true, chk = null;
        if (s.cond) {
          chk = this.condCheck(s.cond);
          cv = chk.v;
        }
        var msg = s.cond
          ? 'Check (' + chk.src + ')' + (chk.sub ? ': ' + chk.sub : '') + ' → ' + cv + '. ' + (cv ? 'True, so run the body (pass ' + (info.pass + 1) + ').' : 'False, so the loop ends' + (info.pass === 0 ? ' — the body never ran at all.' : ' after ' + info.pass + ' pass' + (info.pass > 1 ? 'es' : '') + '.') + ' Jump to the line after the loop.')
          : 'No condition in this for( ; ; ), so it counts as true.';
        this.rec('loopCheck', s.line, msg, { calc: chk && chk.calc, cond: cv, skip: cv ? null : bodyRange });
        if (!cv) break;
        info.pass++;
        var res = this.exec(s.body);
        if (res && res.brk) break;
        if (res && res.ret) return res;
        if (kind === 'for' && s.update.length) {
          s.update.forEach(function (u) { self.eval(u, null); });
          this.rec('forUpdate', s.line, 'Update part of the for: ' + this.effectNote());
        }
      }
      return null;
    } finally {
      this.loops.pop();
      this.breakCtx.pop();
    }
  };

  R.execSwitch = function (s) {
    var rc = new Rec(s.disc);
    var dv = this.eval(s.disc, rc);
    this.flushReads(rc);
    var start = -1, defIdx = -1;
    for (var i = 0; i < s.cases.length && start < 0; i++) {
      var labs = s.cases[i].labels;
      for (var j = 0; j < labs.length; j++) {
        if (labs[j] === 'default') { defIdx = i; continue; }
        var lv = this.eval(labs[j], null);
        var match = dv.t === 'String' ? lv.v === dv.v : lv.v === dv.v;
        if (match) { start = i; break; }
      }
    }
    var viaDefault = false;
    if (start < 0 && defIdx >= 0) { start = defIdx; viaDefault = true; }
    if (start < 0) {
      this.rec('switch', s.line, 'The switch value is ' + L(dv) + '. No case matches and there is no default, so nothing inside the switch runs.', { calc: this.calcOf(rc), skip: this.range(s) && { from: s.line + 1, to: this.range(s).to } });
      return null;
    }
    this.rec('switch', s.line, 'The switch value is ' + L(dv) + (viaDefault ? '. No case matches, so Java jumps to default:.' : ' → jump to the matching case.'), { calc: this.calcOf(rc), jumpTo: s.cases[start].line });
    this.breakCtx.push('switch');
    this.pushScope();
    try {
      for (var k = start; k < s.cases.length; k++) {
        if (k > start && s.cases[k].body.length) {
          this.rec('fall', s.cases[k].line, 'There was no break, so Java "falls through" into the next case and keeps running — it does not check this case value.', { quiet: false });
        }
        var body = s.cases[k].body;
        for (var b = 0; b < body.length; b++) {
          var r = this.exec(body[b]);
          if (r && r.brk) return null;
          if (r) return r;
        }
      }
      return null;
    } finally {
      this.popScope();
      this.breakCtx.pop();
    }
  };

  R.runMain = function () {
    var prog = this.prog;
    var self = this;
    this.frames.push({ name: 'main', scopes: [[]], method: prog.main });
    prog.fields.forEach(function (f) {
      if (!f.isStatic) return;
      f.decls.forEach(function (d) {
        self.fields.push({ id: self.nextId++, name: d.name, type: f.type, val: defaultVal(f.type), field: true });
      });
    });
    prog.fields.forEach(function (f) {
      if (!f.isStatic) return;
      f.decls.forEach(function (d) { if (d.init) self.set(d.name, self.eval(d.init, null)); });
    });
    if (!prog.main.isStatic) {
      var ctors = prog.ctors.filter(function (c) { return !c.params.length; });
      if (prog.ctors.length && !ctors.length) throw new RuntimeErr('Unsupported', 'BlueJ needs an existing object to run this main(). Use a static main() to create the object with constructor arguments.');
      this.frame().object = this.objectOf(this.createObject(ctors[0] || null, [], prog.main.line, true));
    }
    var first = prog.main.body.body[0];
    this.rec('start', null, 'The program starts. Java begins at the first line inside main() and goes down one line at a time.', { nextLine: first ? first.line : null });
    this.changed = {};
    var r = this.execBlockBody(prog.main.body.body);
    void r;
    var endLine = this.lineOf(Math.max(0, prog.main.body.e - 1));
    this.rec('end', prog.snippet ? null : endLine, 'The program has finished.');
  };

  E.run = function (src, opts) {
    var prog;
    try {
      prog = E.parse(src);
      E.check(prog);
    } catch (e) {
      if (e instanceof E.CompileError) return { ok: false, phase: 'compile', error: { line: e.line, message: e.message }, steps: [], output: '' };
      throw e;
    }
    var rt = new Runtime(prog, opts);
    var error = null;
    try {
      rt.runMain();
    } catch (e) {
      if (e instanceof ExitSignal) {
        rt.rec('end', null, 'System.exit() stops the whole program immediately.');
      } else if (e instanceof StepLimit) {
        error = { message: 'Stopped after ' + rt.maxSteps + ' steps — this looks like a loop that never ends (an infinite loop).', kind: 'limit' };
        rt.steps.push({ i: rt.steps.length, kind: 'error', line: null, note: error.message, mem: rt.snapshot(), out: rt.out, loops: [], inPos: rt.input.pos });
      } else if (e instanceof RuntimeErr) {
        var lastLine = rt.steps.length ? rt.steps[rt.steps.length - 1].line : null;
        error = { name: e.javaName, message: e.message, kind: 'runtime' };
        rt.steps.push({ i: rt.steps.length, kind: 'error', line: lastLine, note: (e.javaName === 'NoInput' || e.javaName === 'NoValue' || e.javaName === 'Unsupported' ? '' : e.javaName + ': ') + e.message, mem: rt.snapshot(), out: rt.out, loops: [], inPos: rt.input.pos });
      } else throw e;
    }
    return { ok: !error, phase: error ? 'runtime' : 'done', error: error, steps: rt.steps, output: rt.out, prog: prog, inputLog: rt.input.log };
  };

  // Evaluate one expression with given variables and return its reduction steps.
  // vars: {name: {t, v}}  -> {ok, value, type, snaps:[{text,note}], error}
  E.reduce = function (exprSrc, vars) {
    try {
      var ex = E.parseExpression(exprSrc);
      var types = {};
      Object.keys(vars || {}).forEach(function (k) { types[k] = vars[k].t; });
      E.checkExpression(ex, types);
      var rt = new Runtime({ src: exprSrc, fields: [], methods: [] }, {});
      rt.frames.push({ name: 'main', scopes: [[]] });
      Object.keys(vars || {}).forEach(function (k) { rt.declare(k, vars[k].t, V(vars[k].t, vars[k].v)); });
      var rc = new Rec(ex);
      rt.snap(rc, '');
      var v = rt.eval(ex, rc);
      rt.flushReads(rc);
      var after = {};
      rt.frame().scopes[0].forEach(function (b) { after[b.name] = b.val; });
      return { ok: true, value: v, type: v.t, snaps: rc.snaps.map(function (s) { return { text: s.text, note: s.note }; }), vars: after };
    } catch (e) {
      if (e instanceof E.CompileError || e instanceof RuntimeErr) return { ok: false, error: e.message };
      throw e;
    }
  };
})();
