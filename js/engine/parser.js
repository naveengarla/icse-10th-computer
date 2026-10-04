/* Recursive-descent parser for the ICSE Java subset. Produces an AST with line numbers and source offsets. */
(function () {
  var JP = (globalThis.JP = globalThis.JP || {});
  var E = (JP.engine = JP.engine || {});
  var CompileError = E.CompileError;

  var PRIMS = { int: 1, long: 1, double: 1, float: 1, char: 1, boolean: 1, byte: 1, short: 1 };
  E.PRIMS = PRIMS;

  var BIN_PREC = {
    '||': 1, '&&': 2,
    '==': 6, '!=': 6,
    '<': 7, '>': 7, '<=': 7, '>=': 7,
    '+': 9, '-': 9,
    '*': 10, '/': 10, '%': 10
  };
  E.BIN_PREC = BIN_PREC;
  var ASSIGN_OPS = { '=': 1, '+=': 1, '-=': 1, '*=': 1, '/=': 1, '%=': 1 };
  var UNSUPPORTED = {
    '&': 'Use && for "and" (the single & is not used in our syllabus).',
    '|': 'Use || for "or" (the single | is not used in our syllabus).',
    '^': 'The ^ operator is not "power" in Java. Use Math.pow(a, b).',
    '<<': 'Shift operators are not part of the syllabus.',
    '>>': 'Shift operators are not part of the syllabus.',
    '>>>': 'Shift operators are not part of the syllabus.',
    '~': 'The ~ operator is not part of the syllabus.',
    '[': 'Arrays are not covered in this part of the course.'
  };

  function Parser(src, toks) {
    this.src = src;
    this.toks = toks;
    this.p = 0;
  }
  var P = Parser.prototype;

  P.peek = function (o) { return this.toks[this.p + (o || 0)]; };
  P.next = function () { return this.toks[this.p++]; };
  P.prev = function () { return this.toks[this.p - 1]; };
  P.is = function (v, o) {
    var t = this.peek(o);
    return (t.k === 'op' || t.k === 'kw') && t.v === v;
  };
  P.accept = function (v) {
    if (this.is(v)) return this.next();
    return null;
  };
  P.fail = function (msg, tok) {
    throw new CompileError(msg, (tok || this.peek()).line);
  };
  P.expect = function (v, what) {
    if (this.is(v)) return this.next();
    var t = this.peek();
    if (v === ';') {
      var pl = this.prev() ? this.prev().line : t.line;
      throw new CompileError('Missing ; at the end of this line. Every Java statement ends with a semicolon.', pl);
    }
    if (t.k === 'op' && UNSUPPORTED[t.v]) this.fail(UNSUPPORTED[t.v]);
    this.fail('Expected ' + (what || "'" + v + "'") + ' but found ' + describe(t) + '.');
  };
  P.ident = function (what) {
    var t = this.peek();
    if (t.k === 'id') return this.next();
    if (t.k === 'kw') this.fail("'" + t.v + "' is a Java keyword, so it cannot be used as a " + (what || 'name') + '.');
    this.fail('Expected a ' + (what || 'name') + ' but found ' + describe(t) + '.');
  };

  function describe(t) {
    if (t.k === 'eof') return 'the end of the program (is a } missing?)';
    if (t.k === 'str') return 'the text "' + t.v + '"';
    if (t.k === 'char') return 'a character';
    if (t.k === 'num') return 'the number ' + t.text;
    return "'" + t.v + "'";
  }

  function node(kind, tok, extra) {
    var n = { kind: kind, line: tok.line, s: tok.s, e: tok.e };
    for (var k in extra) n[k] = extra[k];
    return n;
  }
  P.end = function (n) {
    n.e = this.prev().e;
    return n;
  };

  // ---------- program ----------
  P.parseProgram = function () {
    while (this.is('import')) {
      this.next();
      while (!this.is(';') && this.peek().k !== 'eof') this.next();
      this.expect(';');
    }
    var save = this.p;
    while (this.is('public') || this.is('final')) this.next();
    if (this.is('class')) return this.parseClass();
    this.p = save;
    // Snippet: plain statements, treated as the body of main().
    var first = this.peek();
    var body = [];
    while (this.peek().k !== 'eof') body.push(this.parseStatement());
    var block = { kind: 'Block', body: body, line: first.line, s: first.s, e: this.peek().e };
    var main = { kind: 'Method', name: 'main', ret: 'void', params: [], body: block, line: first.line, isStatic: true, synthetic: true };
    return { kind: 'Program', snippet: true, className: null, fields: [], methods: [main], ctors: [], main: main };
  };

  P.parseClass = function () {
    this.expect('class');
    var name = this.ident('class name').v;
    this.expect('{');
    var prog = { kind: 'Program', snippet: false, className: name, fields: [], methods: [], ctors: [] };
    while (!this.is('}')) {
      if (this.peek().k === 'eof') this.fail('The class is missing its closing }.');
      this.parseMember(prog);
    }
    this.expect('}');
    if (this.peek().k !== 'eof') this.fail('Unexpected ' + describe(this.peek()) + ' after the end of the class.');
    var mains = prog.methods.filter(function (m) { return m.name === 'main'; });
    if (!mains.length) throw new CompileError('There is no main() method, so the program has nowhere to start.', 1);
    prog.main = mains[0];
    return prog;
  };

  P.parseMember = function (prog) {
    var startTok = this.peek();
    var mods = {};
    while (this.is('public') || this.is('private') || this.is('protected') || this.is('static') || this.is('final')) {
      mods[this.next().v] = true;
    }
    var t = this.peek();
    // constructor
    if (t.k === 'id' && t.v === prog.className && this.is('(', 1)) {
      this.next();
      var params = this.parseParams();
      var body = this.parseBlock();
      prog.ctors.push({ kind: 'Method', name: t.v, isCtor: true, ret: null, params: params, body: body, line: t.line, mods: mods });
      return;
    }
    var type;
    if (this.accept('void')) type = 'void';
    else type = this.parseType();
    var nameTok = this.ident('method or variable name');
    if (this.is('(')) {
      var ps = this.parseParams();
      var b = this.parseBlock();
      prog.methods.push({ kind: 'Method', name: nameTok.v, ret: type, params: ps, body: b, line: startTok.line, isStatic: !!mods.static, mods: mods });
      return;
    }
    if (type === 'void') this.fail('A variable cannot have type void.');
    // field(s)
    var decls = [];
    var nt = nameTok;
    while (true) {
      var init = null;
      if (this.accept('=')) init = this.parseExpr();
      decls.push({ name: nt.v, init: init, line: nt.line });
      if (!this.accept(',')) break;
      nt = this.ident('variable name');
    }
    this.expect(';');
    prog.fields.push({ kind: 'VarDecl', type: type, decls: decls, line: startTok.line, isStatic: !!mods.static });
  };

  P.parseParams = function () {
    this.expect('(');
    var ps = [];
    if (!this.is(')')) {
      do {
        var ty = this.parseType(true);
        var nm = this.ident('parameter name');
        if (this.accept('[')) { this.expect(']'); ty += '[]'; }
        ps.push({ type: ty, name: nm.v, line: nm.line });
      } while (this.accept(','));
    }
    this.expect(')');
    return ps;
  };

  P.parseType = function (allowArray) {
    var t = this.peek();
    var ty;
    if (t.k === 'kw' && PRIMS[t.v]) { this.next(); ty = t.v; }
    else if (t.k === 'id') { this.next(); ty = t.v; }
    else this.fail('Expected a data type (like int, double, char, String) but found ' + describe(t) + '.');
    if (this.is('[')) {
      if (!allowArray) this.fail(UNSUPPORTED['[']);
      this.next();
      this.expect(']');
      ty += '[]';
    }
    return ty;
  };

  P.isDeclStart = function () {
    var t = this.peek();
    if (t.k === 'kw' && PRIMS[t.v]) return true;
    if (this.is('final')) return true;
    if (t.k === 'id') {
      var n = this.peek(1);
      if (n.k === 'id') return true;
    }
    return false;
  };

  // ---------- statements ----------
  P.parseBlock = function () {
    var open = this.expect('{');
    var body = [];
    while (!this.is('}')) {
      if (this.peek().k === 'eof') throw new CompileError('A { here is never closed with a matching }.', open.line);
      body.push(this.parseStatement());
    }
    this.next();
    return { kind: 'Block', body: body, line: open.line, s: open.s, e: this.prev().e };
  };

  P.parseVarDecl = function () {
    var startTok = this.peek();
    this.accept('final');
    var type = this.parseType();
    var decls = [];
    do {
      var nt = this.ident('variable name');
      if (this.is('[')) this.fail(UNSUPPORTED['[']);
      var init = null;
      if (this.accept('=')) init = this.parseExpr();
      decls.push({ name: nt.v, init: init, line: nt.line });
    } while (this.accept(','));
    return { kind: 'VarDecl', type: type, decls: decls, line: startTok.line, s: startTok.s, e: this.prev().e };
  };

  P.parseStatement = function () {
    var t = this.peek();
    if (this.is('{')) return this.parseBlock();
    if (this.is(';')) { this.next(); return node('Empty', t, {}); }
    if (t.k === 'kw') {
      switch (t.v) {
        case 'if': return this.parseIf();
        case 'while': {
          this.next();
          this.expect('(');
          var c = this.parseExpr();
          this.expect(')');
          var body = this.parseStatement();
          return { kind: 'While', cond: c, body: body, line: t.line, s: t.s, e: this.prev().e };
        }
        case 'do': {
          this.next();
          var b = this.parseStatement();
          var w = this.expect('while', "'while' after the do-block");
          this.expect('(');
          var dc = this.parseExpr();
          this.expect(')');
          this.expect(';');
          return { kind: 'DoWhile', body: b, cond: dc, condLine: w.line, line: t.line, s: t.s, e: this.prev().e };
        }
        case 'for': return this.parseFor();
        case 'switch': return this.parseSwitch();
        case 'break': this.next(); this.expect(';'); return node('Break', t, {});
        case 'continue': this.next(); this.expect(';'); return node('Continue', t, {});
        case 'return': {
          this.next();
          var ex = null;
          if (!this.is(';')) ex = this.parseExpr();
          this.expect(';');
          return { kind: 'Return', expr: ex, line: t.line, s: t.s, e: this.prev().e };
        }
        case 'else': this.fail("This 'else' has no matching 'if'. Check for a stray ; after the if (…) or a missing { }.");
        case 'case':
        case 'default': this.fail("'" + t.v + "' can only appear inside a switch block.");
      }
    }
    if (this.isDeclStart()) {
      var d = this.parseVarDecl();
      this.expect(';');
      d.e = this.prev().e;
      return d;
    }
    var expr = this.parseExpr();
    if (!(expr.kind === 'Assign' || expr.kind === 'Update' || expr.kind === 'Call' || expr.kind === 'New')) {
      throw new CompileError('This line calculates a value but does nothing with it ("not a statement"). Store it in a variable or print it.', t.line);
    }
    this.expect(';');
    return { kind: 'ExprStmt', expr: expr, line: t.line, s: t.s, e: this.prev().e };
  };

  P.parseIf = function () {
    var t = this.next();
    this.expect('(');
    var c = this.parseExpr();
    this.expect(')');
    var th = this.parseStatement();
    var el = null, elseLine = null;
    if (this.is('else')) {
      elseLine = this.next().line;
      el = this.parseStatement();
    }
    return { kind: 'If', cond: c, then: th, els: el, elseLine: elseLine, line: t.line, s: t.s, e: this.prev().e };
  };

  P.parseFor = function () {
    var t = this.next();
    this.expect('(');
    var init = [];
    if (!this.is(';')) {
      if (this.isDeclStart()) init.push(this.parseVarDecl());
      else {
        do {
          var ie = this.parseExpr();
          init.push({ kind: 'ExprStmt', expr: ie, line: ie.line, s: ie.s, e: ie.e });
        } while (this.accept(','));
      }
    }
    this.expect(';');
    var cond = null;
    if (!this.is(';')) cond = this.parseExpr();
    this.expect(';');
    var upd = [];
    if (!this.is(')')) {
      do { upd.push(this.parseExpr()); } while (this.accept(','));
    }
    this.expect(')');
    var body = this.parseStatement();
    return { kind: 'For', init: init, cond: cond, update: upd, body: body, line: t.line, s: t.s, e: this.prev().e };
  };

  P.parseSwitch = function () {
    var t = this.next();
    this.expect('(');
    var disc = this.parseExpr();
    this.expect(')');
    this.expect('{');
    var cases = [];
    var cur = null;
    while (!this.is('}')) {
      var ct = this.peek();
      if (this.accept('case')) {
        var lab = this.parseExpr();
        this.expect(':', "':' after the case value");
        if (!cur || cur.body.length) { cur = { labels: [], body: [], line: ct.line }; cases.push(cur); }
        cur.labels.push(lab);
      } else if (this.accept('default')) {
        this.expect(':', "':' after default");
        if (!cur || cur.body.length) { cur = { labels: [], body: [], line: ct.line }; cases.push(cur); }
        cur.labels.push('default');
      } else {
        if (!cur) this.fail('Inside a switch, statements must come after a case label.');
        if (ct.k === 'eof') this.fail('The switch block is missing its closing }.');
        cur.body.push(this.parseStatement());
      }
    }
    this.next();
    return { kind: 'Switch', disc: disc, cases: cases, line: t.line, s: t.s, e: this.prev().e };
  };

  // ---------- expressions ----------
  P.parseExpr = function () { return this.parseAssign(); };

  P.parseAssign = function () {
    var lhs = this.parseTernary();
    var t = this.peek();
    if (t.k === 'op' && ASSIGN_OPS[t.v]) {
      if (lhs.kind !== 'Name') this.fail('The left side of ' + t.v + ' must be a variable (a box to store into).');
      this.next();
      var rhs = this.parseAssign();
      return { kind: 'Assign', op: t.v, target: lhs, value: rhs, line: lhs.line, s: lhs.s, e: rhs.e };
    }
    return lhs;
  };

  P.parseTernary = function () {
    var c = this.parseBinary(1);
    if (this.is('?')) {
      this.next();
      var a = this.parseAssign();
      this.expect(':', "':' in the ternary operator ( ? : )");
      var b = this.parseTernary();
      return { kind: 'Cond', test: c, a: a, b: b, line: c.line, s: c.s, e: b.e };
    }
    return c;
  };

  P.parseBinary = function (minPrec) {
    var left = this.parseUnary();
    while (true) {
      var t = this.peek();
      if (t.k !== 'op') break;
      if (UNSUPPORTED[t.v] && t.v !== '[' && t.v !== '~') this.fail(UNSUPPORTED[t.v]);
      var prec = BIN_PREC[t.v];
      if (!prec || prec < minPrec) break;
      this.next();
      var right = this.parseBinary(prec + 1);
      left = { kind: 'Bin', op: t.v, l: left, r: right, line: left.line, opLine: t.line, s: left.s, e: right.e };
    }
    return left;
  };

  P.parseUnary = function () {
    var t = this.peek();
    if (t.k === 'op') {
      if (t.v === '+' || t.v === '-' || t.v === '!') {
        this.next();
        var arg = this.parseUnary();
        return { kind: 'Unary', op: t.v, arg: arg, line: t.line, s: t.s, e: arg.e };
      }
      if (t.v === '~') this.fail(UNSUPPORTED['~']);
      if (t.v === '++' || t.v === '--') {
        this.next();
        var a2 = this.parseUnary();
        if (a2.kind !== 'Name') this.fail(t.v + ' can only be used on a variable.');
        return { kind: 'Update', op: t.v, prefix: true, arg: a2, line: t.line, s: t.s, e: a2.e };
      }
      if (t.v === '(') {
        var n1 = this.peek(1), n2 = this.peek(2);
        if (n1.k === 'kw' && PRIMS[n1.v] && n2.k === 'op' && n2.v === ')') {
          this.next(); this.next(); this.next();
          var ca = this.parseUnary();
          return { kind: 'Cast', type: n1.v, arg: ca, line: t.line, s: t.s, e: ca.e };
        }
      }
    }
    return this.parsePostfix();
  };

  P.parseArgs = function () {
    this.expect('(');
    var args = [];
    if (!this.is(')')) {
      do { args.push(this.parseExpr()); } while (this.accept(','));
    }
    this.expect(')', "')' to close the brackets");
    return args;
  };

  P.parsePostfix = function () {
    var e = this.parsePrimary();
    while (true) {
      var t = this.peek();
      if (this.is('.')) {
        this.next();
        var nm = this.ident('method or field name');
        if (this.is('(')) {
          var args = this.parseArgs();
          e = { kind: 'Call', obj: e, name: nm.v, args: args, line: e.line, s: e.s, e: this.prev().e };
        } else {
          e = { kind: 'Field', obj: e, name: nm.v, line: e.line, s: e.s, e: nm.e };
        }
      } else if (this.is('++') || this.is('--')) {
        if (e.kind !== 'Name') this.fail(t.v + ' can only be used on a variable.');
        this.next();
        e = { kind: 'Update', op: t.v, prefix: false, arg: e, line: e.line, s: e.s, e: t.e };
      } else if (this.is('[')) {
        this.fail(UNSUPPORTED['[']);
      } else break;
    }
    return e;
  };

  P.parsePrimary = function () {
    var t = this.peek();
    switch (t.k) {
      case 'num': this.next(); return node('Lit', t, { t: t.t, v: t.v, text: t.text });
      case 'char': this.next(); return node('Lit', t, { t: 'char', v: t.v });
      case 'str': this.next(); return node('Lit', t, { t: 'String', v: t.v });
      case 'id':
        this.next();
        if (this.is('(')) {
          var args = this.parseArgs();
          return { kind: 'Call', obj: null, name: t.v, args: args, line: t.line, s: t.s, e: this.prev().e };
        }
        return node('Name', t, { name: t.v });
      case 'kw':
        if (t.v === 'true' || t.v === 'false') { this.next(); return node('Lit', t, { t: 'boolean', v: t.v === 'true' }); }
        if (t.v === 'null') { this.next(); return node('Lit', t, { t: 'null', v: null }); }
        if (t.v === 'new') {
          this.next();
          var ty = this.ident('class name after new');
          var a = this.parseArgs();
          return { kind: 'New', type: ty.v, args: a, line: t.line, s: t.s, e: this.prev().e };
        }
        if (PRIMS[t.v]) this.fail("A data type like '" + t.v + "' can't be used here. (Declarations must be on their own line, like: " + t.v + ' x = 5;)');
        break;
      case 'op':
        if (t.v === '(') {
          this.next();
          var ex = this.parseExpr();
          this.expect(')', "')' to close the bracket");
          ex.paren = (ex.paren || 0) + 1;
          ex.s = t.s;
          ex.e = this.prev().e;
          return ex;
        }
        if (UNSUPPORTED[t.v]) this.fail(UNSUPPORTED[t.v]);
        break;
    }
    if (t.k === 'eof') this.fail('The program ended too early — something is unfinished.');
    this.fail('Unexpected ' + describe(t) + ' here.');
  };

  E.parse = function (src) {
    var toks = E.lex(src);
    var p = new Parser(src, toks);
    var prog = p.parseProgram();
    prog.src = src;
    return prog;
  };

  E.parseExpression = function (src) {
    var toks = E.lex(src);
    var p = new Parser(src, toks);
    var ex = p.parseExpr();
    if (p.peek().k !== 'eof') p.fail('Unexpected ' + describe(p.peek()) + ' after the expression.');
    return ex;
  };
})();
